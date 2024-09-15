from dataclasses import fields

from rest_framework import serializers

from accounts.models import Student
from accounts.serializers import (CandidateSerializer, ProfessorSerializer,
                                  UserIDRetrievalSerializer,
                                  UserRetrievalSerializer)

from .models import Group, Project, ProjectProfile


class ProjectSerializer(serializers.ModelSerializer):
    professor = ProfessorSerializer(read_only=True)

    class Meta:
        model = Project
        fields = (
            "project_name",
            "description",
            "min_group_size",
            "max_group_size",
            "end_date",
            "join_code",
            "professor",
        )
        read_only_fields = ("join_code", "professor")


class ProjectMembersSerializer(serializers.ModelSerializer):
    user = UserRetrievalSerializer(read_only=True)

    class Meta:
        model = Student
        fields = ("user",)

    # called per student in the queryset
    def to_representation(self, instance: Student):
        rep = super().to_representation(instance)
        project = self.context.get("project")
        student_rep = rep.pop("user", None)
        student_rep.pop("user_type", None)
        group = instance.joined_groups.all().filter(project=project).first()
        student_rep["group_name"] = (
            group.group_name if group and group.group_name else ""
        )
        return student_rep


class ProjectProfileSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(), write_only=True
    )
    project = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(), write_only=True
    )

    class Meta:
        model = ProjectProfile
        fields = (
            "student",
            "project",
            "bio",
            "skills",
            "year",
            "pronouns",
            "contact_details",
        )


class ProjectProfileSerializerBeforeDate(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(), write_only=True
    )
    project = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(), write_only=True
    )

    class Meta:
        model = ProjectProfile
        fields = (
            "student",
            "project",
            "bio",
            "skills",
            "year",
            "pronouns",
        )


class GroupMetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ("group_name", "uuid")


class GroupMemberProfileSerializer(CandidateSerializer):
    def to_representation(self, instance: Student):
        project = self.context["project"]
        before_date = self.context["before_date"]
        # will throw an error if no profile exists
        profile = instance.projectprofile_set.get(project=project)
        student_rep = super().to_representation(instance)
        if before_date:
            profile_rep = ProjectProfileSerializerBeforeDate(profile).data
        else:
            profile_rep = ProjectProfileSerializer(profile).data
        return {"student": student_rep, "profile": profile_rep}
