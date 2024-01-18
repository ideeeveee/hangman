from django.urls import path
from . import views

urlpatterns = [
    path('', views.createSession, name='create_session'),
    path('update', views.updateSession, name='update_session'),
]