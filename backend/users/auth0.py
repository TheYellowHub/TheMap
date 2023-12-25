import requests
from http import HTTPMethod
from http_constants.headers import HttpHeaders
from http_constants.status import HttpStatus
from typing import List
import json
import logging

from django.conf import settings

logger = logging.getLogger(__name__)


def getApiAccessToken() -> str:
    headers = {
        HttpHeaders.CONTENT_TYPE: "application/x-www-form-urlencoded",
    }
    data = {
        "grant_type": "client_credentials",
        "client_id": settings.JWT_AUTH["JWT_MANAGMENT_API_CLIENT_ID"],
        "client_secret": settings.JWT_AUTH["JWT_MANAGMENT_API_CLIENT_SECRET"],
        "audience": f"{settings.JWT_AUTH['JWT_ISSUER']}api/v2/",
    }
    url = f"{settings.JWT_AUTH['JWT_ISSUER']}oauth/token"
    response = requests.request(
        method=HTTPMethod.POST.name,
        headers=headers,
        data="&".join([f"{key}={value}" for (key, value) in data.items()]),
        url=url,
    )
    return response.json()["access_token"]


def executeApiRequest(
    http_method: HTTPMethod,
    url_suffix: str,
    data: dict = None,
    expectedStatusCodes: List[HttpStatus] = [
        HttpStatus.OK,
        HttpStatus.CREATED,
        HttpStatus.ACCEPTED,
        HttpStatus.NO_CONTENT,
    ],
) -> requests.Response:
    url = f"{settings.JWT_AUTH['JWT_ISSUER']}api/v2/{url_suffix}"
    request = {
        "method": http_method.name,
        "data": json.dumps(data) if data else None,
        "url": url,
    }
    logger.debug(f"Auth0 API request: {request}")
    headers = {
        HttpHeaders.CONTENT_TYPE: "application/json",
        HttpHeaders.AUTHORIZATION: f"Bearer {getApiAccessToken()}",
    }
    request["headers"] = headers
    response = requests.request(**request)
    logger.debug(f"Auth0 API response: {response.__dict__}")
    if response.status_code not in expectedStatusCodes:
        raise Exception(response.reason)
    return response


def delete(user) -> None:
    url_suffix = f"users/{user.remote_id}"
    executeApiRequest(HTTPMethod.DELETE, url_suffix)