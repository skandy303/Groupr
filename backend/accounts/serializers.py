from django.contrib.auth import get_user_model, password_validation
from rest_framework import serializers

from accounts.models import Professor, Student, User


class UserRetrievalSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("name", "email", "is_student", "uuid")

    def to_representation(self, instance):
        rep = super(UserRetrievalSerializer, self).to_representation(instance)

        is_student = rep.pop("is_student", False)
        rep["user_type"] = "student" if is_student else "professor"

        return rep


class UserIDRetrievalSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("name", "uuid")


class CandidateSerializer(serializers.ModelSerializer):
    user = UserIDRetrievalSerializer(read_only=True)

    class Meta:
        model = Student
        fields = ("user",)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        user_rep = rep.pop("user", None)
        user_rep.pop("email", None)

        rep = {**rep, **user_rep}
        return rep


class ProfessorSerializer(serializers.ModelSerializer):
    user = UserRetrievalSerializer(read_only=True)

    class Meta:
        model = Professor
        fields = ("user",)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        user_rep = rep.pop("user", None)
        # email should not be serialized
        user_rep.pop("email", None)

        rep = {**rep, **user_rep}
        return rep


class UserRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    name = serializers.CharField(max_length=100)
    password = serializers.CharField(max_length=100)
    user_type = serializers.ChoiceField(choices=["student", "professor"])

    # field specific validator for "email", gets called during validation
    def validate_email(self, value):
        if get_user_model().objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Name must be non-empty")
        return value

    def validate_password(self, value):
        password_validation.validate_password(value)
        return value

    # override - gets called when serializer.save()
    def create(self, validated_data):
        email = validated_data.get("email")
        name = validated_data.get("name")
        password = validated_data.get("password")
        user_type = validated_data.get("user_type")

        # convert user_type into bools
        new_user = get_user_model().objects.create_user(
            email,
            name=name,
            is_student=user_type == "student",
            is_professor=user_type == "professor",
            password=password,
        )

        if new_user.is_student:
            Student.objects.create(user=new_user)
        elif new_user.is_professor:
            Professor.objects.create(user=new_user)

        return new_user

    def update():
        # don't allow updates for now
        pass
