#!/bin/bash
sudo docker-compose -f docker-compose-prod.yaml down
# sudo docker volume rm themap_postgres_data -f # Use this when you want to erase the entire database
sudo docker-compose -f docker-compose-prod.yaml build --no-cache
sudo docker-compose -f docker-compose-prod.yaml up