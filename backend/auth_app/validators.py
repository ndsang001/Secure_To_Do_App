import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

class CustomComplexityValidator:
    """
    This module contains the `CustomComplexityValidator` class, which is used to enforce 
    password complexity requirements for user authentication.
    Classes:
        - CustomComplexityValidator: A custom password validator that ensures a password 
          contains at least one uppercase letter, one lowercase letter, one number, and 
          one special character.
    Usage:
        This validator can be used in Django's authentication system to enforce stricter 
        password policies. It raises a `ValidationError` if the password does not meet 
        the specified complexity requirements.
    """
    def validate(self, password, user=None):
        if not re.search(r'[A-Z]', password):
            raise ValidationError(_('Password must contain at least one uppercase letter.'))
        if not re.search(r'[a-z]', password):
            raise ValidationError(_('Password must contain at least one lowercase letter.'))
        if not re.search(r'\d', password):
            raise ValidationError(_('Password must contain at least one number.'))
        if not re.search(r'[!@#$%^&*()_+=\-{}\[\]:;"\'<>,.?/\\|`~]', password):
            raise ValidationError(_('Password must contain at least one special character.'))

    def get_help_text(self):
        return _("Your password must include at least one uppercase letter, one lowercase letter, one number, and one special character.")
