import random
import string
import uuid

from django.contrib.auth import get_user_model
from django.db import models

from accounts.models import Professor, Student, User

# Create your models here.


class Project(models.Model):
    project_name = models.CharField(max_length=60)
    min_group_size = models.PositiveIntegerField(default=2)
    max_group_size = models.PositiveIntegerField(default=2)
    end_date = models.DateTimeField(null=True)
    description = models.CharField(max_length=200, null=True)
    join_code = models.CharField(max_length=8, unique=True, null=True, default=None)

    students = models.ManyToManyField(Student, related_name="joined_projects")
    professor = models.ForeignKey(
        Professor, related_name="prof_projects", on_delete=models.CASCADE, null=True
    )

    def generate_code(self):
        while True:
            code = "".join(random.choices(string.ascii_letters + string.digits, k=8))
            if not Project.objects.filter(join_code=code).exists():
                self.join_code = code
                break

    def save(self, *args, **kwargs):
        if not self.pk:
            # Only runs when the object is saved for the first time
            self.generate_code()

        super(Project, self).save(*args, **kwargs)

    def __str__(self) -> str:
        return f"Project ({self.pk}): {self.join_code}"


class ProjectProfile(models.Model):
    student = models.ForeignKey("accounts.Student", on_delete=models.CASCADE)
    project = models.ForeignKey("projects.Project", on_delete=models.CASCADE)

    class Year(models.TextChoices):
        FRESHMAN = "1", "1"
        SOPHMORE = "2", "2"
        JUNIOR = "3", "3"
        SENIOR = "4", "4"
        SUPER_SENIOR = "4+", "4+"

    class Pronouns(models.TextChoices):
        MALE = "he/him", "he/him"
        FEMALE = "she/her", "she/her"
        NON_BINARY = "they/them", "they/them"
        OTHER = "other", "other"

    bio = models.CharField(max_length=375)
    skills = models.JSONField()
    year = models.CharField(max_length=2, choices=Year.choices)
    pronouns = models.CharField(max_length=12, choices=Pronouns.choices)
    contact_details = models.CharField(max_length=375)


class Interaction(models.Model):
    project = models.ForeignKey(
        Project, related_name="interactions", on_delete=models.CASCADE
    )
    swiper = models.ForeignKey(
        Student, related_name="swiper_set", on_delete=models.CASCADE
    )
    swipee = models.ForeignKey(
        Student, related_name="swipee_set", on_delete=models.CASCADE
    )
    liked = models.BooleanField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["project", "swiper", "swipee"], name="unique interaction"
            )
        ]


class Group(models.Model):
    members = models.ManyToManyField(Student, related_name="joined_groups")
    candidates = models.ManyToManyField(
        Student, blank=True, related_name="candidate_groups"
    )
    rejects = models.ManyToManyField(
        Student, blank=True, related_name="rejected_groups"
    )
    group_name = models.CharField(max_length=60, unique=False, null=True, blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, null=True)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    def add_member(self, new_member: Student):
        if self.num_members() == self.project.max_group_size:
            return
        self.members.add(new_member)
        new_member.swipee_set.filter(project=self.project).delete()
        # keep all the "like" interactions, we will use them as prevotes
        new_member.swiper_set.filter(project=self.project, liked=False).delete()
        # remove new_member from other groups candidate lists
        [
            item.candidates.remove(new_member)
            for item in new_member.candidate_groups.filter(project=self.project)
        ]
        self.save()
        new_member.save()

    def remove_member(self, member: Student):
        self.members.remove(member)
        member.swiper_set.filter(project=self.project).delete()
        member.liker_set.filter(likee__project=self.project).delete()
        member.save()
        self.save()

    def num_members(self):
        return self.members.all().count()

    def remove_candidate(self, candidate: Student):
        self.candidates.remove(candidate)
        self.save()

    def num_of_votes(self, candidate: Student, like: bool):

        members = self.members.all()
        number_of_likes = 0

        for member in members:
            number_of_likes += (
                member.swiper_set.all()
                .filter(swipee=candidate, project=self.project, liked=like)
                .exists()
            )

        return number_of_likes

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["project", "group_name"], name="unique group"
            )
        ]

    def __str__(self) -> str:
        return f"Group ({self.pk}): {self.group_name}"


class GroupInteraction(models.Model):
    liker = models.ForeignKey(
        Student, related_name="liker_set", on_delete=models.CASCADE
    )
    likee = models.ForeignKey(Group, related_name="likee_set", on_delete=models.CASCADE)
    liked = models.BooleanField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["liker", "likee"], name="unique group interaction"
            )
        ]
