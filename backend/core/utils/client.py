from django.conf import settings


def get_client_code(request):
    return getattr(request, "client_code", settings.DEFAULT_CLIENT_CODE)
