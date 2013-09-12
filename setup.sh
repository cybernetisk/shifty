#!/bin/sh
pip install -e .
python manage.py syncdb
./migrate.sh
