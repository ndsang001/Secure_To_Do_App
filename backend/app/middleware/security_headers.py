from django.utils.deprecation import MiddlewareMixin

class SecurityHeadersMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        response["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response["X-Frame-Options"] = "DENY"
        response["X-Content-Type-Options"] = "nosniff"
        response["Referrer-Policy"] = "no-referrer"
        response["Content-Security-Policy"] = "default-src 'self'"
        response["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        return response
