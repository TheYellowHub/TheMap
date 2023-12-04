#!/bin/bash
set -e
apt-get update -y
apt-get install vim -y
echo "Apply database migrations"
python manage.py migrate
python manage.py loaddata doctorCategories.json
python manage.py loaddata doctorSpecialities.json
# TODO
# python manage.py loaddata doctors.json
# python manage.py loaddata doctorLocations.json

echo "Collect static files"
python manage.py collectstatic --noinput 
echo "Create a superuser"
python manage.py initadmin
# TODO
# echo "Run tests"
# coverage run manage.py test -v 2
# coverage report -m
# coverage html

# echo "Starting gunicorn server in production mode"
gunicorn base.wsgi --bind 0.0.0.0:8000 --workers 1 --threads 1

# TODO: var
# echo "Starting gunicorn server in DEBUG mode"
# gunicorn base.wsgi --bind 0.0.0.0:8000 --workers 1 --threads 1 --log-level debug

# echo "Starting development server in DEBUG mode"
# DJANGO_DEBUG=True ./manage.py runserver 0.0.0.0:8000

echo "Exit status: $?"