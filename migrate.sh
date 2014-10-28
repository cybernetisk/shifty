#!/bin/bash
python manage.py makemigrations shifty
python manage.py migrate
python manage.py loaddata shifty/initial_data.json
