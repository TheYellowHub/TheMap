#!/bin/bash
sudo docker-compose -f docker-compose-dev.yaml down
sudo docker volume rm themap_postgres_data -f     # Use this when you want to erase the entire database
sudo docker-compose -f docker-compose-dev.yaml up --build --remove-orphans