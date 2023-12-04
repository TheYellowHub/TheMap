from django.contrib.auth import authenticate
import json
import jwt
import requests
import inspect
from functools import wraps
from django.http import JsonResponse

from django.conf import settings
from rest_framework import permissions
from rest_framework.request import Request


ADMIN_SCOPE = "adminPermission"


def jwt_get_username_from_payload_handler(payload: dict) -> str | None:
    """Gets a request's payload and returns the username of the user who sent it"""
    sub = payload.get("sub")
    if sub:
        username = sub.replace("|", ".")
        authenticate(remote_user=username)
        return username


def jwt_decode_token(token: str):
    """Decodes a token"""
    try:
        header = jwt.get_unverified_header(token)
        jwks = requests.get(
            "https://{}/.well-known/jwks.json".format(settings.JWT_AUTH["JWT_DOMAIN"])
        ).json()
        public_key = None
        for jwk in jwks["keys"]:
            if jwk["kid"] == header["kid"]:
                public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk))

        if public_key is None:
            raise Exception("Public key not found.")

        issuer = settings.JWT_AUTH["JWT_ISSUER"]
        return jwt.decode(
            token,
            public_key,
            audience=settings.JWT_AUTH["JWT_AUDIENCE"],
            issuer=issuer,
            algorithms=["RS256"],
        )
    except:
        return None


def get_token_auth_header(request: Request) -> str | None:
    """Obtains the access token from the authorization header"""
    auth = request.META.get("HTTP_AUTHORIZATION", None)
    if auth:
        parts = auth.split()
        token = parts[1]
        return token


def has_scope(request: Request, required_scope: str):
    """Determines if the required scope is present in the access token of the request"""
    try:
        token = get_token_auth_header(request)
        decoded = jwt.decode(token, verify=False, options={"verify_signature": False})
        return decoded.get("scope") and required_scope in decoded["scope"].split()
    except:
        return False


def requires_scope(required_scope: str):
    """
    API decorator.
    Determines if the required scope is present in the access token of the request.
    If not, returns an error."
    """

    ERROR_MESSAGE = "You don't have access to this resource"
    ERROR_CODE = 403

    def require_scope(f):
        if inspect.isclass(f):

            class Decorated(f):
                def check_permissions(self, request):
                    super().check_permissions(request)
                    if not has_scope(request, required_scope):
                        self.permission_denied(
                            request,
                            message=ERROR_MESSAGE,
                            code=ERROR_CODE,
                        )

            return Decorated

        elif inspect.isfunction(f):

            @wraps(f)
            def decorated(*args, **kwargs):
                request = args[0]
                if has_scope(request, required_scope):
                    return f(*args, **kwargs)
                else:
                    response = JsonResponse({"message": ERROR_MESSAGE})
                    response.status_code = ERROR_CODE
                    return response

            return decorated

    return require_scope


class IsAdmin(permissions.BasePermission):
    """
    Admin permissions.
    """

    def has_permission(self, request, view):
        return has_scope(request, ADMIN_SCOPE)
