from django.conf import settings


class ClientContextMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.client_code = settings.DEFAULT_CLIENT_CODE
        return self.get_response(request)
