from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from . import views

urlpatterns = [
    path("login/", views.LoginView.as_view()),
    path("register/", views.RegisterView.as_view()),
    path("me/", views.RetrieveUserView.as_view()),
    path("logout/", views.LogoutView.as_view()),
]
