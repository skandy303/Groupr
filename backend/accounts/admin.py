from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserChangeForm, CustomUserCreationForm
from .models import Professor, Student, User


# Register your models here.
class CustomUserAdmin(UserAdmin):
    model = User
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    list_display = ("email", "name", "is_student", "is_professor", "uuid")
    list_filter = (
        "email",
        "name",
        "is_student",
        "is_professor",
    )
    fieldsets = (
        (None, {"fields": ("email", "password", "is_professor", "is_student")}),
        ("Permissions", {"fields": ("is_staff", "is_active")}),
    )
    readonly_fields = ["uuid"]
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2", "is_staff", "is_active"),
            },
        ),
    )

    search_fields = (
        "email",
        "name",
    )
    ordering = ("email",)


admin.site.register(User, CustomUserAdmin)
admin.site.register(Student)
admin.site.register(Professor)
