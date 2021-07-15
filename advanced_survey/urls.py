"""Routes"""
from django.urls import path
from .views import save_survey, get_survey

urlpatterns = [
    path('save/', save_survey, name="advanced_survey_save_url"),
    path('get/', get_survey, name="advanced_survey_get_survey"),
]
