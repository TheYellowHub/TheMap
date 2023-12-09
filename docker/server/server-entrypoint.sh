#!/bin/bash
set -e
apt-get update -y
apt-get install vim -y
app=/app/backend/manage.py

echo "Apply database migrations"
python $app migrate
python $app loaddata doctorCategories.json
python $app loaddata doctorSpecialities.json
python $app loaddata doctors.json
python $app loaddata doctorLocations.json

echo "Collect static files"
python $app collectstatic --noinput 
echo "Create a superuser"
python $app initadmin

# TODO
# echo "Run tests"
# coverage run $app test -v 2
# coverage report -m
# coverage html

echo "Starting gunicorn server in production mode"
gunicorn base.wsgi --bind 0.0.0.0:8000 --workers $((2*$(grep -c ^processor /proc/cpuinfo) + 1)) --worker-class gthread

# echo "Starting waitress server in production mode"
# waitress-serve --port=8000 base.wsgi:application

# echo "Starting gunicorn server in DEBUG mode"
# gunicorn base.wsgi --bind 0.0.0.0:8000 --workers 1 --threads 1 --log-level debug

# echo "Starting development server in DEBUG mode"
# DJANGO_DEBUG=True ./$app runserver 0.0.0.0:8000

echo "Exit status: $?"
