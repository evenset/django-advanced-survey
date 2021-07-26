"""Fields classes"""
import sys

from django.core.validators import validate_email

def get_field(question):
    """Get related field class"""
    class_name = getattr(sys.modules[__name__], question['field'])
    field = class_name(question)
    return field

class Field:
    """Field base class"""
    def __init__(self, question):
        self.question = question
        self.options = question['options'] if 'options' in question else {}

    def validate(self, answer):
        """Validate answer"""

    @property
    def element(self):
        """Survey.js element"""
        elem = {
            "id": self.question['id'],
            "name": f"question{self.question['id']}",
            "title": self.question['question'],
            "description": self.question['description'],
        }
        return elem

class LineEdit(Field):
    """LineEdit class"""

class Rating(Field):
    """Rating class"""
    def validate(self, answer):
        rate_max = len(self.options['items'])
        answer = int(answer)
        if answer < 1 or answer > rate_max:
            raise ValueError(f"Answer should be 1 and {rate_max}")

    @property
    def element(self):
        elem = super().element
        elem["type"] = "rating"
        elem['rateMax'] = len(self.options['items'])
        item_counter = 0
        rate_values = []
        for item in self.options['items']:
            item_counter += 1
            rate_values.append({
                "value": item_counter,
                "text": item
            })
        elem['rateValues'] = rate_values
        return elem

class TextArea(Field):
    """TextArea class"""
    def validate(self, answer):
        if "max" in self.options and self.options["max"] > 0 and len(answer) >  self.options["max"]:
            raise ValueError(f"Answer should be less than {self.options['max']} characters")

    @property
    def element(self):
        elem = super().element
        elem["type"] = "comment"
        if "max" in self.options and self.options["max"] > 0:
            elem["maxLength"] = self.options["max"]
        return elem

class Select(Field):
    """Select class"""
    def validate(self, answer):
        for opt in answer:
            if opt not in self.options['items']:
                raise ValueError(f"{opt} is not a valid option")

    @property
    def element(self):
        elem = super().element
        elem["type"] = "dropdown"
        elem["choices"] = self.options['items']
        return elem

class Checkbox(Field):
    """Checkbox class"""
    def validate(self, answer):
        for opt in answer:
            if opt not in self.options['items']:
                raise ValueError(f"{opt} is not a valid option")
        if 'min' in self.options:
            min_count = int(self.options['min'])
            if min_count > 0 and len(answer) < min_count:
                raise ValueError(f"You should select at leaset {min_count} options.")
        if 'max' in self.options:
            max_count = int(self.options['max'])
            if len(answer) > max_count:
                raise ValueError(f"You should select {max_count} options maximum.")

    @property
    def element(self):
        elem = super().element
        elem["type"] = "checkbox"
        elem["choices"] = self.options['items']
        min_count = 0
        max_count = 0
        if 'min' in self.options:
            min_count = int(self.options['min'])
        if 'max' in self.options:
            max_count = int(self.options['max'])
        if min_count > 0 or max_count > 0:
            validator = {"type": "answercount"}
            if min_count > 0:
                validator["minCount"] = min_count
            if max_count > 0:
                validator["maxCount"] = max_count
            elem["validators"] = [validator]
        return elem

class Radiobox(Field):
    """Radiobox class"""
    def validate(self, answer):
        if answer not in self.options['items']:
            raise ValueError(f"{answer} is not a valid option")

    @property
    def element(self):
        elem = super().element
        elem["type"] = "radiogroup"
        elem["choices"] = self.options['items']
        return elem

class Email(Field):
    """Email class"""
    def validate(self, answer):
        validate_email(answer)

    @property
    def element(self):
        elem = super().element
        elem["type"] = "text"
        elem["inputType"] = "email"
        elem["validators"] = [{"type":"email"}]
        return elem

class URL(Field):
    """URL class"""
    @property
    def element(self):
        elem = super().element
        elem["type"] = "text"
        elem["inputType"] = "url"
        return elem

class Phone(Field):
    """URL class"""
    @property
    def element(self):
        elem = super().element
        elem["type"] = "text"
        elem["inputType"] = "phone"
        return elem

class Boolean(Field):
    """Boolean class"""
    @property
    def element(self):
        elem = super().element
        elem["type"] = "boolean"
        return elem

class Numeric(Field):
    """Numeric class"""
    def validate(self, answer):
        answer = int(answer)
        if 'min' in self.options and answer < int(self.options['min']):
            raise ValueError(f"{answer} should be greater than {self.options['min']}")
        if 'max' in self.options and answer > int(self.options['max']):
            raise ValueError(f"{answer} should be less than {self.options['max']}")

    @property
    def element(self):
        elem = super().element
        elem["type"] = "text"
        elem["inputType"] = "numeric"
        min_value = 0
        max_value = 0
        if 'min' in self.options:
            min_value = int(self.options['min'])
        if 'max' in self.options:
            max_value = int(self.options['max'])
        if min_value > 0 or max_value > 0:
            validator = {"type": "numeric"}
            if min_value > 0:
                validator["minValue"] = min_value
            if max_value > 0:
                validator["maxValue"] = max_value
            elem["validators"] = [validator]
        return elem

class File(Field):
    """File class"""
    @property
    def element(self):
        elem = super().element
        elem["type"] = "file"
        if "multiple" in self.options:
            elem["allowMultiple"] = True
        if "max_size" in self.options:
            elem["maxSize"] = int(self.options["max_size"]) * 1024
        if "items" in self.options:
            accepted_types = []
            for ext in self.options["items"]:
                if ext[0] != ".":
                    ext = "."+ext
                if ext not in accepted_types:
                    accepted_types.append(ext)
            elem["acceptedTypes"] = ",".join(accepted_types)
        return elem

class Image(Field):
    """Image class"""
    @property
    def element(self):
        elem = super().element
        elem["type"] = "file"
        if "multiple" in self.options:
            elem["allowMultiple"] = True
        if "max_size" in self.options:
            elem["maxSize"] = int(self.options["max_size"]) * 1024
        elem["acceptedTypes"] = ".png,.jpg"
        return elem

class Date(Field):
    """Date class"""
    @property
    def element(self):
        elem = super().element
        elem["type"] = "text"
        elem["inputType"] = "datepicker"
        return elem

class Time(Field):
    """Time class"""
    @property
    def element(self):
        elem = super().element
        elem["type"] = "text"
        elem["inputType"] = "timepicker"
        return elem
