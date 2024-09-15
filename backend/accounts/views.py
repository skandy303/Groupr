from django.contrib.auth import authenticate, login, logout
from django.db import models
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User

from .serializers import UserRegisterSerializer, UserRetrievalSerializer

# Create your views here.


class LoginView(APIView):
    # disable sessions authentication for login
    authentication_classes = []
    permission_classes = []

    # login the user
    def post(self, request, format=None):
        data = request.data
        email = data["email"]
        password = data["password"]
        # cross references the email and password in our db
        user = authenticate(email=email, password=password)
        if user is None:
            return Response({"details": "Email or password is incorrect"}, status=400)

        login(request, user)

        serialized = UserRetrievalSerializer(user)

        return Response(serialized.data)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    # logout user
    def get(self, request, format=None):
        logout(request)
        return Response({"details": "Logout Successful"})


class RegisterView(APIView):
    # disable sessions authentication for registration
    authentication_classes = []
    permission_classes = []

    # create new user and login
    def post(self, request, format=None):
        data = request.data
        # calling constructor validates data
        serializer = UserRegisterSerializer(data=data)
        if not serializer.is_valid():
            return Response(
                {
                    "details": "Could not create user",
                    "reason": serializer.errors,
                },
                status=400,
            )
        # save() calls the create/update function in our serializer under the hood
        user = serializer.save()
        # create a session cookie
        login(request, user)

        serialized = UserRetrievalSerializer(user)

        return Response(serialized.data)


class RetrieveUserView(APIView):
    # checks request.user.is_authenticated automatically
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        serialized = UserRetrievalSerializer(request.user)
        return Response(serialized.data)
