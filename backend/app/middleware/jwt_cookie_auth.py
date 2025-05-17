from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import AnonymousUser, User

class JWTAuthenticationMiddleware:
    """
    Middleware to authenticate users based on JWT stored in cookies.
    This middleware checks for a JWT in the request cookies and sets the user
    in the request object if the token is valid. It also injects the token into
    the request headers so that Django Rest Framework's JWT authentication
    can process it.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        token = request.COOKIES.get('access')
        if token:
            try:
                validated_token = AccessToken(token)
                user_id = validated_token['user_id']
                request.user = User.objects.get(id=user_id)

                # Inject the Authorization header so DRF's JWT auth sees it
                request.META['HTTP_AUTHORIZATION'] = f'Bearer {token}'
                
            except Exception:
                request.user = AnonymousUser()
        return self.get_response(request)
