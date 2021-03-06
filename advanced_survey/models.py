"""Models"""
import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

def get_field_types():
    """Field Types Helper"""
    return (
        ('LineEdit', 'Line Edit'),
        ('TextArea', 'Text Area'),
        ('Select', 'Select'),
        ('Checkbox', 'Checkbox'),
        ('Radiobox', 'Radiobox'),
        ('Email', 'Email'),
        ('URL', 'URL'),
        ('Phone', 'Phone'),
        ('Boolean', 'Boolean'),
        ('Numeric', 'Numeric'),
        ('File', 'File'),
        ('Image', 'Image'),
        ('Date', 'Date'),
        ('Time', 'Time'),
        ('Rating', 'Rating')
    )

class Survey(models.Model):
    """Survey Model"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expire_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        """String representation of the model"""
        return self.name

class Question(models.Model): # pylint: disable=R0902
    """Question model"""
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, db_index=True)
    page = models.IntegerField(default=0, db_index=True)
    list_order = models.IntegerField(default=0, db_index=True)
    question = models.TextField()
    description = models.TextField(null=True, blank=True)
    field_type = models.CharField(max_length=255, choices=get_field_types())
    options = models.TextField(null=True, blank=True)
    is_required = models.CharField(max_length=255, null=True, blank=True)
    is_visible = models.CharField(max_length=255, null=True, blank=True)

    @property
    def required(self):
        """required computed field"""
        if self.is_required is None:
            return False
        return self.is_required.split("|")

    @property
    def visible(self):
        """visible computed field"""
        if self.is_visible is None:
            return True
        return self.is_visible.split("|")

    def __str__(self):
        """String representation of the model"""
        return self.question

class Answer(models.Model):
    """Answer model"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True, null=True, blank=True)
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, db_index=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, db_index=True)
    answer = models.TextField()
    session = models.CharField(max_length=255, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """String representation of the model"""
        return self.answer
