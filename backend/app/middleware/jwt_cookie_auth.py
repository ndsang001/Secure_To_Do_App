from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import AnonymousUser, User

class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        token = request.COOKIES.get('access')
        if token:
            try:
                validated_token = AccessToken(token)
                user_id = validated_token['user_id']
                request.user = User.objects.get(id=user_id)
            except Exception:
                request.user = AnonymousUser()
        return self.get_response(request)
