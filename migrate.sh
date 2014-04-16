#!/bin/bash
if [ ! -f "shifty.sqlite" ]
then
    python manage.py syncdb --noinput
fi 

python manage.py schemamigration shifty --auto
python manage.py migrate shifty
python manage.py migrate
