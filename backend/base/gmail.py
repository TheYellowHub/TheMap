from typing import Optional, List, Union
from redmail import gmail
import json

from django.conf import settings


gmail.username = settings.GMAIL_USERNAME
gmail.password = settings.GMAIL_PASSWORD


class GmailAlerts:
    admin_alerts_receivers = settings.ALERTS_RECEIVERS

    @classmethod
    def send_email(cls, subject: str, receivers: List[str], body_text: Optional[str] = None, body_html: Optional[str] = None) -> None:
        if receivers:
            gmail.send(
                subject=subject,
                receivers=receivers,
                text=body_text,
                html=body_html
            )

    @classmethod
    def send_admin_alert(cls, subject: str, body: Union[str, dict]) -> None:
        if isinstance(body, dict):
            body = json.dumps(body, indent=4)
        cls.send_email(subject=subject, body_text=body, receivers=cls.admin_alerts_receivers)
