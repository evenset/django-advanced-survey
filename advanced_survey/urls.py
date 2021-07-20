"""Routes"""
from django.urls import path
from .views import (
    save_survey,
    get_survey,
    get_surveyjs,
    save_answer
)

urlpatterns = [
    path('save/', save_survey, name="advanced_survey_save_url"),
    path('get/', get_survey, name="advanced_survey_get_survey"),
    path('surveyjs/', get_surveyjs, name="advanced_survey_get_surveyjs"),
    path('answer/', save_answer, name="advanced_survey_save_answer")
]
