from django.shortcuts import render

from django.http import HttpResponse, JsonResponse, FileResponse

# Create your views here.

def vwInicio (request):
    return render(request, 'index.html')

def vwPageIADetection (request):
    return render(request, 'ia_detection.html')