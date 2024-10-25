import os

from dopplersdk import DopplerSDK


def import_secrets():
    doppler = DopplerSDK()  
    doppler.set_access_token(os.environ.get("DOPPLER_TOKEN"))
    secrets = doppler.secrets.list(
        project=os.environ.get("DOPPLER_PROJECT"),
        config=os.environ.get("DOPPLER_CONFIG")
    ).secrets
    for key, value in secrets.items():
        os.environ.setdefault(key=key, value=value['computed'])
