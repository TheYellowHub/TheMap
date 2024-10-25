#!/bin/bash
set -e
app=/app/backend/manage.py
python_cli=python

echo "Apply database migrations"
python $app migrate
echo "\nDJANGO_LOAD_DATA: $DJANGO_LOAD_DATA\n"
if [ "$DJANGO_LOAD_DATA" = "true" ]; then
    $python_cli $app flush --no-input
    $python_cli $app loaddata doctorCategories.json
    $python_cli $app loaddata doctorSpecialities.json
    $python_cli $app loaddata doctors.json
    $python_cli $app loaddata doctorLocations.json
fi

echo "Collect static files"
$python_cli $app collectstatic --noinput 
echo "Create a superuser"
$python_cli $app initadmin

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
