"""Views"""
import json
from django.http import JsonResponse
from .models import Survey, Question

def save_survey(request): # pylint: disable=R0912
    """Save Survey"""
    if not request.user.is_authenticated or not request.user.is_superuser:
        return JsonResponse({"data":"Forbidden"}, status=403)

    if 'id' not in request.GET:
        return JsonResponse({"data":"Empty Survey ID"}, status=406)

    # pylint: disable=W0622
    question_id = int(request.GET['id'])
    survey = Survey.objects.filter(id=question_id).first()
    if survey is None:
        return JsonResponse({"data":f"Survey with ID {question_id} not found"}, status=404)

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
        question_serialized = {
            "id": question.id,
            "list_order": question.list_order,
            "question": question.question,
            "description": question.description,
            "field": question.field_type,
            "url": question.options_url,
            "options": {} if question.options is None else json.loads(question.options.replace("'", "\""))
        }
        if question.page in pages:
            pages[question.page].append(question_serialized)
        else:
            pages[question.page] = [question_serialized]

    return JsonResponse(list(pages.values()), safe=False)
