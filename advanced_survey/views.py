"""Views"""
import json
from datetime import datetime

from django.http import JsonResponse
from django.db.models import Q

from .models import Survey, Question

def serialize_question(question):
    """Serialize Question"""
    return {
        "id": question.id,
        "list_order": question.list_order,
        "question": question.question,
        "description": question.description,
        "field": question.field_type,
        "url": question.options_url,
        "options": {} if question.options is None \
                    else json.loads(question.options.replace("'", "\""))
    }

def save_survey(request): # pylint: disable=R0912
    """Save Survey"""
    if not request.user.is_authenticated or not request.user.is_superuser:
        return JsonResponse({"data":"Forbidden"}, status=403)

    if 'id' not in request.GET:
        return JsonResponse({"data":"Empty Survey ID"}, status=406)

    # pylint: disable=W0622
    survey = Survey.objects.filter(id=request.GET['id']).first()
    if survey is None:
        return JsonResponse({"data":f"Survey with ID {request.GET['id']} not found"}, status=404)

    if request.method == 'POST':
        pages = json.loads(request.body)
        page_counter = 0
        for page in pages:
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
                    if 'url' in question:
                        db_question.options_url = question['url']
                    if 'option' in question:
                        db_question.options = question['option']
                    db_question.save()
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

def get_survey(request):
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
    for surveydb in surveys:
        survey = {
            "id": surveydb.id,
            "name": surveydb.name,
            "description": surveydb.description,
            "expire_at": surveydb.expire_at
        }
        pages = {}
        for question in surveydb.question_set.order_by('list_order', 'page'):
            question_serialized = serialize_question(question)
            if question.page in pages:
                pages[question.page].append(question_serialized)
            else:
                pages[question.page] = [question_serialized]
        survey["pages"] = list(pages.values())
        result.append(survey)

    return JsonResponse(result, safe=False)
