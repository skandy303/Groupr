import uuid
from enum import unique
from multiprocessing.sharedctypes import Value

from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager,
                                        PermissionsMixin)
from django.db import models

# Create your models here.


class UserManager(BaseUserManager):
    def create_user(
        self, email, name="", is_student=False, is_professor=False, password=None
    ):
        if not email:
            raise ValueError("users must have an email address")
        user = self.model(
            email=self.normalize_email(email),
            name=name,
            is_student=is_student,
            is_professor=is_professor,
        )

        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None):
        user = self.create_user(
            email,
            password=password,
        )

        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return user


# Subsitituting our user
class User(AbstractBaseUser, PermissionsMixin):
    email = models.CharField(max_length=40, unique=True)
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    is_student = models.BooleanField(default=False)
    is_professor = models.BooleanField(default=False)

    # for django admin
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    # unique user id
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Student ({self.pk}): {self.user.email}"


class Professor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Professor ({self.pk}): {self.user.email}"
