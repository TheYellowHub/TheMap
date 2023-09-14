#!/bin/bash

apt-get update -y
apt-get install vim -y

echo "Apply database migrations"
python manage.py migrate
python manage.py loaddata doctorCategories.json

echo "Collect static files"
python manage.py collectstatic --noinput 

echo "Create a superuser"
python manage.py initadmin

echo "Run tests"
coverage run manage.py test -v 2
coverage report -m
coverage html

echo "Starting gunicorn server in production mode"
gunicorn base.wsgi --bind 0.0.0.0:8000 --workers 4 --threads 4

# echo "Starting gunicorn server in DEBUG mode"
# gunicorn base.wsgi --bind 0.0.0.0:8000 --workers 1 --threads 1 --log-level debug

# echo "Starting development server in DEBUG mode"
# DJANGO_DEBUG=True ./manage.py runserver 0.0.0.0:8000