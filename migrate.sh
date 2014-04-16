#!/bin/bash
if [ ! -f "shifty.sqlite" ]; then
	echo "Creating new database"
    python manage.py syncdb --no-initial-data --noinput
fi;

python manage.py schemamigration shifty --auto
python manage.py migrate
