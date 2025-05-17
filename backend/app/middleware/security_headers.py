from django.utils.deprecation import MiddlewareMixin

# This middleware adds security headers to all responses
class SecurityHeadersMiddleware(MiddlewareMixin):
    """
    SecurityHeadersMiddleware is a Django middleware class that adds various security-related HTTP headers 
    to the response to enhance the security of the application.

    Headers added:
    - Strict-Transport-Security: Enforces HTTPS by specifying a max-age for the browser to remember to only use HTTPS.
    - X-Content-Type-Options: Prevents the browser from interpreting files as a different MIME type.
    - Referrer-Policy: Controls the information sent in the Referer header to protect user privacy.
    - Content-Security-Policy: Restricts the sources from which content can be loaded to mitigate XSS attacks.
    - Permissions-Policy: Restricts access to browser features like camera, microphone, and geolocation.
    - Cross-Origin-Opener-Policy: Ensures the document is isolated from cross-origin resources to prevent cross-origin attacks.
    - Cross-Origin-Embedder-Policy: Requires all resources to be CORS-compatible or same-origin.
    - Cross-Origin-Resource-Policy: Restricts which origins can access the resources to prevent data leaks.

    This middleware is designed to improve the security posture of the application by setting these headers 
    on every HTTP response.
    """
    def process_response(self, request, response):
        response["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains" 
        response["X-Content-Type-Options"] = "nosniff"
        response["Referrer-Policy"] = "no-referrer"
        response["Content-Security-Policy"] = "default-src 'self'"
        response["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        response["Cross-Origin-Opener-Policy"] = "same-origin"
        response["Cross-Origin-Embedder-Policy"] = "require-corp"
        response["Cross-Origin-Resource-Policy"] = "same-origin"
        return response
