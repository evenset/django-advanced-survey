=====
django advanced survey
=====

django advanced survey is a Django app to conduct Web-based surveys.

Quick start
-----------

1. Add "advanced_survey" to your INSTALLED_APPS setting like this::

    INSTALLED_APPS = [
        ...
        'advanced_survey',
    ]

2. Include the advanced_survey URLconf in your project urls.py like this::

    path('advanced_survey/', include('advanced_survey.urls')),

3. Run ``python manage.py migrate`` to create the polls models.

4. Start the development server and visit http://127.0.0.1:8000/admin/
   to create a poll (you'll need the Admin app enabled).
