"""Admin settings"""
from django.contrib import admin

from .models import Survey, Answer, Question

@admin.register(Survey)
class SurveyAdmin(admin.ModelAdmin):
    """SurveyAdmin"""
    add_form_template = "add_form.html"
    change_form_template = "change_form.html"
    list_display = ('name', 'created_at', 'expire_at')

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    """AnswerAdmin"""
    list_display = ('question', 'survey', 'session', 'user')

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    """QuestionAdmin"""
    list_display = ('question', 'survey', 'field_type', 'page')
