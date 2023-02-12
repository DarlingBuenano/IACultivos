from django.contrib import admin
from django.urls import path

from os import name
from MaizeDr import views as vwMaizeDr
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # Página de inicio, cambiar cuando haya más de una herramienta (MaizeDr es una herramienta)
    path('', vwMaizeDr.vwInicio, name="inicio"),

    # Section MaizeDr
    path('maizedr/', vwMaizeDr.vwInicio, name="maizedr"),
    path('maizedr/ia_detection', vwMaizeDr.vwPageIADetection, name="ia_detection"),
]

# Creando el acceso para los archivos de media
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)