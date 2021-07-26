"""Views"""
import json
import re
import uuid
import urllib.request
from datetime import datetime

from django.http import JsonResponse
from django.db.models import Q
from django.urls import reverse
from django.shortcuts import render

from .models import Survey, Question, Answer

def serialize_question(question):
    """Serialize Question"""
    return {
        "id": question.id,
        "list_order": question.list_order,
        "question": question.question,
        "description": question.description,
        "field": question.field_type,
        "options": {} if question.options is None \
                    else json.loads(question.options),
        "is_visible": question.is_visible.split("|"),
        "is_required": question.is_required.split("|")
    }

def prepare_question(question):
    """Get question information for validation"""
    return (
        question.field_type,
        {} if question.options is None else json.loads(question.options)
    )

def check_options_url(options, question_id):
    """Validate url in options"""
    request = urllib.request.urlopen(options['url'])
    if request.status != 200:
        return f"Couldn't get options for question {question_id}"
    response = json.loads(request.read())
    if isinstance(response, dict):
        if 'jsonpath' not in options or options['jsonpath'] == "":
            return f"json path for url {options['url']} is required"
        fields = options['jsonpath'].split(".")
        for field in fields:
            if field not in response:
                return f"field {field} for question {question_id} not found"
            response = response[field]
        if not isinstance(response, list) or len(response) < 1:
            return f"Couldn't get options for question {question_id}"
    return response

def parse_external_reference(conditions, id_lookup, allow_never):
    token_count = len(conditions)
    if token_count == 1:
        allowed = ['always', 'never'] if allow_never else ['always']
        if conditions[0] not in allowed:
            raise RuntimeError(str(conditions[0]) + ' is not a valid standalone condition')
    elif conditions[0] not in ['if', 'unless']:
        raise RuntimeError(str(conditions[0]) + ' is not a valid opening condition')

    if token_count == 2:
        raise RuntimeError('Exactly two list items is not a valid condition')

    if token_count > 2:
        # must have a valid reference to a prior question
        other_id = conditions[1]
        if other_id not in id_lookup:
            raise RuntimeError(other_id + ' does not refer to a prior question')
        conditions[1] = str(id_lookup[other_id])
    if token_count == 3:
        if conditions[2] != 'isAnswered':
            raise RuntimeError(str(conditions[2]) + ' is not a valid terminal condition')
    if token_count == 4:
        if conditions[2] != 'isAnsweredWith':
            raise RuntimeError(str(conditions[2]) + ' is not a valid connecting condition between a question and answer')
    if token_count >= 5:
        raise RuntimeError('only 4 or fewer items are supported')

    return "|".join(conditions)

def save_survey(request): # pylint: disable=R0912,R0915
    """Save Survey"""
    # if not request.user.is_authenticated or not request.user.is_superuser:
    #     return JsonResponse({"data":"Forbidden"}, status=403)

    if 'id' not in request.GET:
        return JsonResponse({"data":"Empty Survey ID"}, status=406)

    # pylint: disable=W0622
    survey = Survey.objects.filter(id=request.GET['id']).first()
    if survey is None:
        return JsonResponse({"data":f"Survey with ID {request.GET['id']} not found"}, status=404)

    if request.method == 'POST': # pylint: disable=R1702
        pages = json.loads(request.body)
        page_counter = 0
        for page in pages:
            id_lookup = dict()
            for question in page:
                db_question = Question()
                if str(question['id']).isnumeric():
                    db_question = Question.objects.filter(id=question['id'], survey=survey).first()
                    if db_question is None:
                        return JsonResponse({
                            "data":f"Question with ID {question['id']} not found"},
                            status=404
                        )
                    if 'delete' in question:
                        db_question.delete()
                        continue
                    id_lookup[str(question['id'])] = question['id']

                try:
                    db_question.survey = survey
                    db_question.page = page_counter
                    db_question.list_order = question['list_order']
                    if not 'question' in question:
                        raise RuntimeError('question is required')
                    db_question.question = question['question']
                    if 'description' in question:
                        db_question.description = question['description']
                    db_question.field_type = question['field']
                    if 'option' in question:
                        options = question['option']
                        if 'url' in options:
                            response = check_options_url(options, db_question.id)
                            if isinstance(response, str):
                                raise RuntimeError(response)
                        db_question.options = json.dumps(options)
                    
                    

                    db_question.is_visible = parse_external_reference(question["is_visible"], id_lookup, False)
                    db_question.is_required = parse_external_reference(question["is_required"], id_lookup, True)

                    id_lookup[question["id"]] = db_question.pk
                except Exception as err: # pylint: disable=W0703
                    return JsonResponse({"data":str(err)}, status=500)

            page_counter += 1

    pages = {}
    for question in survey.question_set.order_by('list_order', 'page').all():
        question_serialized = serialize_question(question)
        if question.page in pages:
            pages[question.page].append(question_serialized)
        else:
            pages[question.page] = [question_serialized]

    return JsonResponse(list(pages.values()), safe=False)

def get_pages(surveydb):
    """Get pages from survey"""
    pages = {}
    for question in surveydb.question_set.order_by('list_order', 'page'):
        question_serialized = serialize_question(question)
        options = question_serialized['options']

        if 'url' in options:
            response = check_options_url(options, question.id)
            if isinstance(response, str):
                return JsonResponse({"data": response}, status=500)
            options.pop('url', None)
            options.pop('jsonpath', None)
            question_serialized['options']['items'] = response

        if question.page in pages:
            pages[question.page].append(question_serialized)
        else:
            pages[question.page] = [question_serialized]

    return list(pages.values())

def get_survey(request): # pylint: disable=R0912
    """Get Survey(s) by id (optional)"""
    surveys = Survey.objects.filter(Q(expire_at__isnull=True) | Q(expire_at__lt=datetime.today()))

    if 'id' in request.GET:
        surveys = surveys.filter(id=request.GET['id']).first()
        if surveys is None:
            return JsonResponse(
                {"data":f"Survey with ID {request.GET['id']} not found"},
                status=404
            )

    result = []
    for surveydb in surveys: # pylint: disable=R1702
        survey = {
            "id": surveydb.id,
            "name": surveydb.name,
            "description": surveydb.description,
            "expire_at": surveydb.expire_at,
            "url": reverse("advanced_survey_save_answer")
        }
        survey["pages"] = get_pages(surveydb)
        result.append(survey)

    return JsonResponse(result, safe=False)

def get_element(question): # pylint: disable=R0912,R0915
    """Get surveyjs element"""
    options = question['options']

    element = {
        "name": f"question{question['id']}",
        "title": question['question'],
        "description": question['description'],
    }

    if question['field'] == "Rating":
        element["type"] = "rating"
        element['rateMax'] = len(options['items'])
        item_counter = 0
        rate_values = []
        for item in options['items']:
            item_counter += 1
            rate_values.append({
                "value": item_counter,
                "text": item
            })
        element['rateValues'] = rate_values
    elif question['field'] == "TextArea":
        element["type"] = "comment"
        if "max" in options and options["max"] > 0:
            element["maxLength"] = options["max"]
    elif question['field'] == 'Select':
        element["type"] = "dropdown"
        element["choices"] = options['items']
    elif question['field'] == "Checkbox":
        element["type"] = "checkbox"
        element["choices"] = options['items']
        min_count = 0
        max_count = 0
        if 'min' in options:
            min_count = int(options['min'])
        if 'max' in options:
            max_count = int(options['max'])
        if min_count > 0 or max_count > 0:
            validator = {"type": "answercount"}
            if min_count > 0:
                validator["minCount"] = min_count
            if max_count > 0:
                validator["maxCount"] = max_count
            element["validators"] = [validator]
    elif question['field'] == "Radiobox":
        element["type"] = "radiogroup"
        element["choices"] = options['items']
    elif question["field"] == "Email":
        element["type"] = "text"
        element["inputType"] = "email"
        element["validators"] = [{"type":"email"}]
    elif question["field"] == "URL":
        element["type"] = "text"
        element["inputType"] = "url"
    elif question["field"] == "Phone":
        element["type"] = "text"
        element["inputType"] = "phone"
    elif question["field"] == "Boolean":
        element["type"] = "boolean"
    elif question["field"] == "Numeric":
        element["type"] = "text"
        element["inputType"] = "numeric"
        min_value = 0
        max_value = 0
        if 'min' in options:
            min_value = int(options['min'])
        if 'max' in options:
            max_value = int(options['max'])
        if min_value > 0 or max_value > 0:
            validator = {"type": "numeric"}
            if min_value > 0:
                validator["minValue"] = min_value
            if max_value > 0:
                validator["maxValue"] = max_value
            element["validators"] = [validator]
    elif question["field"] == "File":
        element["type"] = "file"
        if "multiple" in options:
            element["allowMultiple"] = True
        if "max_size" in options:
            element["maxSize"] = int(options["max_size"]) * 1024
        if "items" in options:
            accepted_types = []
            for ext in options["items"]:
                if ext[0] != ".":
                    ext = "."+ext
                if ext not in accepted_types:
                    accepted_types.append(ext)
            element["acceptedTypes"] = "|".join(accepted_types)
    elif question["field"] == "Image":
        element["type"] = "file"
        if "multiple" in options:
            element["allowMultiple"] = True
        if "max_size" in options:
            element["maxSize"] = int(options["max_size"]) * 1024
        element["acceptedTypes"] = ".png|.jpg"
    elif question["field"] == "Date":
        element["type"] = "datepicker"
        element["inputType"] = "date"
    elif question["field"] == "Time":
        element["type"] = "timepicker"
        element["inputType"] = "time"
    else:
        element["type"] = "text"

    return element

def get_surveyjs(request):
    """Get Surveyjs format by id"""
    if 'id' not in request.GET:
        return JsonResponse({"data":"Empty Survey ID"}, status=406)

    survey = Survey.objects.filter(
        Q(expire_at__isnull=True) | Q(expire_at__lt=datetime.today())
    ).filter(id=request.GET['id']).first()

    if survey is None:
        return JsonResponse(
            {"data":f"Survey with ID {request.GET['id']} not found"},
            status=404
        )

    pages = get_pages(survey)
    page_counter = 0
    surveyjs = {"pages": [], "url": reverse("advanced_survey_save_answer")}
    for page in pages:
        elements = []
        for question in page:
            elements.append(get_element(question))
        page_counter += 1
        surveyjs["pages"].append({
            "name": f"page{page_counter}",
            "elements": elements
        })

    return JsonResponse(surveyjs)

def validate(question, answer):
    """Validate answer by given question"""
    # field_type, options = prepare_question(question)
    print(question)
    print(answer)
    return True

def save_answer(request): # pylint: disable=R0912
    """Save answer"""
    if 'id' not in request.POST:
        return JsonResponse({"data":"Empty Survey ID"}, status=406)

    survey = Survey.objects.filter(
        Q(expire_at__isnull=True) | Q(expire_at__lt=datetime.today())
    ).filter(id=request.POST['id']).first()

    if survey is None:
        return JsonResponse(
            {"data":f"Survey with ID {request.GET['id']} not found"},
            status=404
        )

    answers = {}
    regex = r'question(\d+)\[(\d+)\]\[(.+)\]'
    for question, answer in request.POST.items():
        if question.startswith("question"):
            if "[" in question:
                data = re.findall(regex, question)
                qid, index, key = data[0]
                if qid not in answers:
                    answers[qid] = {}
                if index not in answers[qid]:
                    answers[qid][index] = {}
                answers[qid][index][key] = answer
            else:
                qid = question.replace("question", "")
                answers[qid] = answer

    for question in survey.question_set.all():
        qid = str(question.id)
        if qid not in answers:
            answer = None
        else:
            answer = answers[qid]
        is_valid = validate(question, answer)
        if isinstance(is_valid, str):
            return JsonResponse({"data": is_valid}, status=406)

    session_id = str(uuid.uuid4())
    for question_id, answer in answers.items():
        answerdb = Answer()
        answerdb.user = request.user if request.user.is_authenticated else None
        answerdb.survey = survey
        answerdb.question_id = question_id
        answerdb.answer = json.dumps(answer) if isinstance(answer, dict) else answer
        answerdb.session = session_id
        answerdb.save()

    return JsonResponse({"data": "saved"})

def example(request):
    """Render example survey js format page"""
    survey = Survey.objects.filter(
        Q(expire_at__isnull=True) | Q(expire_at__lt=datetime.today())
    ).first()

    if survey is None:
        raise RuntimeError("There is no active survey to show")

    pages = get_pages(survey)
    page_counter = 0
    surveyjs = {"pages": []}
    for page in pages:
        elements = []
        for question in page:
            elements.append(get_element(question))
        page_counter += 1
        surveyjs["pages"].append({
            "name": f"page{page_counter}",
            "elements": elements
        })

    context = {
        "id": survey.id,
        "survey": json.dumps(surveyjs),
        "submit_url": reverse("advanced_survey_save_answer")
    }

    return render(request, 'advanced_survey/example.html', context)
