"""Routes"""
from django.urls import path
from .views import save_survey

urlpatterns = [
    path('save/', save_survey, name="advanced_survey_save_url"),
]
