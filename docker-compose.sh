#!/bin/bash
ENV_NAME=$1
DOCKER_COMPOSE_FILE=docker-compose-$ENV_NAME.yaml
sudo docker-compose -f $DOCKER_COMPOSE_FILE down
# sudo docker volume rm themap_postgres_data -f # Use this when you want to erase the entire database
sudo docker-compose -f $DOCKER_COMPOSE_FILE build --no-cache
sudo docker-compose -f $DOCKER_COMPOSE_FILE up