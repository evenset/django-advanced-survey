"""Admin settings"""
from django.contrib import admin

from .models import Survey, Answer

@admin.register(Survey)
class SurveyAdmin(admin.ModelAdmin):
    """SurveyAdmin"""
    list_display = ('name', 'created_at', 'expire_at')

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    """AnswerAdmin"""
    list_display = ('user', 'survey')
