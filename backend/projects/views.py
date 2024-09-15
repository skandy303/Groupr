import random
from tabnanny import process_tokens

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Count
from django.shortcuts import render
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import Professor, Student, User
from accounts.permissions import IsProfessor, IsStudent
from accounts.serializers import CandidateSerializer

from .models import (Group, GroupInteraction, Interaction, Project,
                     ProjectProfile)
from .serializers import (GroupMemberProfileSerializer, GroupMetaSerializer,
                          ProjectMembersSerializer, ProjectProfileSerializer,
                          ProjectSerializer)
from .utils.naming import random_teamname

# Create your views here.


class ProjectView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        if request.user.is_professor:
            projects = Project.objects.all().filter(professor=request.user.professor)
        else:
            projects = Project.objects.all().filter(students=request.user.student)

        return Response(
            [ProjectSerializer(project).data for project in projects], status=200
        )

    # Create a new project
    def post(self, request, format=None):
        serializer = ProjectSerializer(data=request.data)

        if not request.user.is_professor:
            return Response(
                {"details": "Only professors can create projects"}, status=403
            )

        if not serializer.is_valid():
            return Response(
                {
                    "details": "Project create failed",
                    "errors": serializer.errors,
                },
                status=400,
            )

        new_project = serializer.save()
        new_project.professor = request.user.professor
        new_project.save()

        return Response({"join_code": new_project.join_code})


class ProjectInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        try:
            project = Project.objects.get(join_code=project_id)
        except ObjectDoesNotExist:
            return Response({"details": "No such project was found"}, status=404)

        if request.user.is_professor:
            serialized_students = ProjectMembersSerializer(
                project.students.all(), many=True, context={"project": project}
            )
            serialized_project = ProjectSerializer(project)
            return Response(
                {
                    "students": serialized_students.data,
                    "project": serialized_project.data,
                },
                status=200,
            )

        else:
            student = request.user.student
            if not project.students.filter(pk=student.pk).exists():
                return Response(
                    {"details": "Student has not joined project"}, status=403
                )

            bio_created = ProjectProfile.objects.filter(
                student=student, project=project
            ).exists()

            has_group = student.joined_groups.filter(project=project).exists()

            serialized = ProjectSerializer(project)
            return Response(
                {
                    "bio_created": bio_created,
                    "has_group": has_group,
                    "project": serialized.data,
                }
            )


class ProjectJoinView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        user = request.user

        if not (user.is_student):
            return Response({"details": "Forbidden by non-student"}, status=403)

        try:
            project = Project.objects.get(join_code=project_id)
            serialized = ProjectSerializer(project)
        except ObjectDoesNotExist:
            return Response({"details": "No such project was found"}, status=404)

        if timezone.now() > project.end_date:
            return Response({"details": "Project end date has passed."}, status=400)

        res = serialized.data

        if project.students.filter(user__pk=user.id).exists():
            return Response({"project": res, "newly_joined": False})

        project.students.add(User.objects.get(pk=user.id).student)
        return Response({"project": res, "newly_joined": True})

    def post(self, request, project_id):
        user = request.user
        uuid = request.data.get("uuid", None)

        if uuid is None:
            return Response(
                {"details": "Request body not in correct format"}, status=404
            )

        try:
            project = Project.objects.get(join_code=project_id)
        except ObjectDoesNotExist:
            return Response({"details": "No such project was found"}, status=404)

        student_to_delete = Student.objects.all().filter(user__uuid=uuid).first()
        if student_to_delete is None:
            return Response({"details": "Student not found"}, status=404)

        if project not in student_to_delete.joined_projects.all():
            return Response({"details": "Student to delete not in project"}, status=404)

        if user.is_professor:
            professor = Professor.objects.get(user=user)
            prof_projects = professor.prof_projects.all()
            if project not in prof_projects:
                return Response(
                    {"details": "Request made by wrong professor"}, status=400
                )
        else:
            if not (user.is_student):
                return Response(
                    {
                        "details": "Request made by wrong user type, neither student or professor"
                    },
                    status=400,
                )
            if user.uuid != student_to_delete.user.uuid:
                return Response(
                    {
                        "details": "Request made by wrong user type, student should cannot kick another student"
                    },
                    status=400,
                )

        if user.is_student and timezone.now() > project.end_date:
            return Response(
                {"details": "Student cannot make changes beyond end date"}, status=400
            )

        if current_group := student_to_delete.joined_groups.filter(
            project=project
        ).first():
            current_group.remove_member(student_to_delete)
            num_group_members = current_group.num_members()
            if num_group_members < 2:
                current_group.remove_member(current_group.members.first())
                Group.objects.all().filter(uuid=current_group.uuid).delete()
            else:
                for candidate in current_group.candidates.all():
                    if current_group.num_members() == project.max_group_size:
                        break
                    num_votes = current_group.num_of_votes(candidate, True)
                    if num_votes > num_group_members // 2:
                        current_group.add_member(candidate)
                        current_group.save()
            return Response({"details": "Successfully removed"}, status=200)
        return Response({"details": "Student not in Group"}, status=404)


class ProjectProfileView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    # create a new bio
    def post(self, request, project_id):
        user = request.user
        data = request.data

        try:
            project = Project.objects.get(join_code=project_id)
            student_pk = user.student.pk
            project_pk = project.pk
        except ObjectDoesNotExist:
            return Response({"details": "No such project was found"}, status=404)

        if timezone.now() > project.end_date:
            return Response({"details": "Project end date has passed."}, status=400)

        data["student"] = student_pk
        data["project"] = project_pk

        try:
            proj_prof = ProjectProfile.objects.get(
                student=user.student, project=project
            )
            serialized = ProjectProfileSerializer(proj_prof, data=data, partial=True)
        except ObjectDoesNotExist:
            serialized = ProjectProfileSerializer(data=data)

        if not serialized.is_valid():
            return Response(
                {
                    "details": "Project profile create failed",
                    "errors": serialized.errors,
                },
                status=400,
            )

        serialized.save()
        return Response(serialized.data)

    def get(self, request, project_id):
        user = request.user

        try:
            project = Project.objects.get(join_code=project_id)
            project_profile = ProjectProfile.objects.get(
                student=user.student, project=project
            )
            serialized = ProjectProfileSerializer(project_profile)
        except ObjectDoesNotExist:
            return Response(
                {"details": "No such project profile was found"}, status=404
            )

        res = serialized.data

        return Response(res)


class ProjectGetCandidate(APIView):

    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request, project_id):
        # checks if the project_id exists
        try:
            project = Project.objects.get(join_code=project_id)
        except ObjectDoesNotExist:
            return Response({"details": "No such project was found"}, status=404)

        if timezone.now() > project.end_date:
            return Response({"details": "Project end date has passed."}, status=400)

        current_student = Student.objects.filter(id=request.user.student.id).first()

        # Case: Current user is in a group and looking for candidate list item to swipe on
        if current_group := current_student.joined_groups.filter(
            project=project
        ).first():
            if current_group.num_members() == project.max_group_size:
                return Response({"no_candidates": True, "candidates": []}, status=200)
            # get all items in user group's candidate list
            group_candidate_queryset = list(current_group.candidates.all())

            # filter and remove students that joined groups already from Candidate List
            has_group = []
            for student in group_candidate_queryset:
                if student.joined_groups.filter(project=project).exists():
                    current_group.candidates.remove(student)
                    has_group.append(student)

            # get list of student objects, where we only have the students the user was the swiped on
            user_interactions_list = [
                inter.swipee
                for inter in current_student.swiper_set.filter(project=project)
            ]
            # form the potential get candidate list from the group candidate list by cross refrencing and excluding with the students user had swiped on.
            candidate_list = [
                student
                for student in group_candidate_queryset
                if student not in user_interactions_list and student not in has_group
            ]

            # No candidates
            if not (candidate_list):
                return Response({"no_candidates": True, "candidates": []}, status=200)

            rand = random.randint(0, len(candidate_list) - 1)
            candidate_student = candidate_list[rand]

            profile = ProjectProfile.objects.get(
                project__join_code=project_id, student=candidate_student
            )

            return Response(
                {
                    "no_candidates": False,
                    "group": None,
                    "candidates": [
                        GroupMemberProfileSerializer(
                            candidate_student,
                            context={"project": project, "before_date": True},
                            many=False,
                        ).data
                    ],
                },
                status=200,
            )

        # case: where student is looking for candidates

        # all students in a project
        student_candidates = Project.objects.filter(join_code=project_id).values_list(
            "students"
        )
        # all students in a project excluding the current user
        student_candidates = student_candidates.difference(
            Student.objects.filter(id=request.user.student.id).values_list("id")
        )
        # only 1 student in the project
        if not student_candidates:
            return Response({"no_candidates": True, "candidates": []}, status=200)
        # exclude students in a group
        temp = None
        for student in student_candidates:
            x = (
                Group.objects.filter(members=student)
                .filter(project=project)
                .values_list("members")
            )
            if temp is None:
                temp = x
            else:
                temp = temp.union(x)

        student_candidates = student_candidates.difference(temp)
        # exclude students who don't have a project profile
        student_candidates = student_candidates.intersection(
            ProjectProfile.objects.filter(project__join_code=project_id).values_list(
                "student"
            )
        )
        # all groups in project
        group_candidates = (
            Group.objects.filter(project=project)
            .annotate(memberscount=Count("members"))
            .filter(memberscount__lt=project.max_group_size)
        )
        # user's interactions with a group
        group_interactions = GroupInteraction.objects.filter(
            liker=request.user.student, likee__project=project
        )
        # user's interactions with a student
        student_interactions = Interaction.objects.filter(
            swiper_id=request.user.student.id, project__join_code=project_id
        )
        # check if all groups and students have been interacted with
        if (
            group_candidates.count() - group_interactions.count() == 0
            and student_candidates.count() - student_interactions.count() == 0
        ):
            # remove all disliked interactions if there are no more entities to interact with
            group_interactions.filter(liked=False).delete()
            student_interactions.filter(liked=False).delete()
        # exclude student interactions from student candidates
        student_candidates = student_candidates.difference(
            student_interactions.values_list("swipee")
        )
        # exclude group interactions from group candidates
        group_candidates = group_candidates.values_list("id").difference(
            group_interactions.values_list("likee")
        )
        # if a candidates exists
        if group_candidates.count() != 0 or student_candidates.count() != 0:
            # total count of group and student candidates
            total = group_candidates.count() + student_candidates.count()
            # select arbitrary candidate
            rand = random.randint(0, total - 1)
            # since group candidates and student candidates are dealt with differently
            # seperate the cases by dealing with each list independently
            if rand < student_candidates.count():
                return_value = student_candidates[rand]
                # Get student profile object of arbitrary candidate
                profile = ProjectProfile.objects.get(
                    project__join_code=project_id, student=return_value[0]
                )
                # Get student object of arbitrary candidate
                return_value = Student.objects.get(id=return_value[0])

                return Response(
                    {
                        "no_candidates": False,
                        "group": None,
                        "candidates": [
                            {
                                "student": CandidateSerializer(return_value).data,
                                "profile": ProjectProfileSerializer(profile).data,
                            }
                        ],
                    },
                    status=200,
                )
            else:
                return_value = group_candidates[rand - student_candidates.count()]
                # get group object of arbitrary candidate
                group = Group.objects.get(id=return_value[0])
                return Response(
                    {
                        "no_candidates": False,
                        "group": GroupMetaSerializer(instance=group).data,
                        "candidates": GroupMemberProfileSerializer(
                            group.members.all(),
                            context={"project": project, "before_date": True},
                            many=True,
                        ).data,
                    },
                    status=200,
                )
        # if no candidats exist
        return Response({"no_candidates": True, "candidates": []}, status=200)


class InteractionView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request, project_id):
        uuid = request.data["uuid"]
        current_student = request.user.student
        liked = True if request.data["liked"] else False

        try:
            project = Project.objects.get(join_code=project_id)
        except ObjectDoesNotExist:
            return Response({"details": "Project does not exist"}, status=404)

        if timezone.now() > project.end_date:
            return Response({"details": "Project end date has passed."}, status=400)

        liker_group = current_student.joined_groups.filter(project=project).first()

        if (
            other_student := Student.objects.filter(user__uuid=uuid).first()
        ) and not liker_group:

            if other_student.joined_groups.filter(project=project).first():
                return Response({"details": "likee is already in a group"}, status=400)

            Interaction.objects.create(
                project=project,
                swiper=current_student,
                swipee=other_student,
                liked=liked,
            )
            if (
                liked
                and Interaction.objects.filter(
                    project=project,
                    swiper=other_student,
                    swipee=current_student,
                    liked=liked,
                ).first()
            ):
                # match occurred
                new_group = Group()
                #  get a random team name and captialize each word
                new_group.group_name = random_teamname().title()
                while project.group_set.filter(
                    group_name=new_group.group_name
                ).exists():
                    new_group.group_name = random_teamname().title()
                new_group.project = project
                new_group.save()
                # call helper funciton
                for new_member in [current_student, other_student]:
                    new_group.add_member(new_member)
                return Response({"matched": True})
        elif swiped_group := Group.objects.filter(uuid=uuid).first():
            # check if current group members already liked the swiper
            if liked:
                like_count = swiped_group.num_of_votes(current_student, liked)
                # need a simple majority to instantly add
                if like_count > swiped_group.members.count() // 2:
                    swiped_group.add_member(current_student)
                    return Response({"matched": True})
                # if not all liked, then just add to candidate list
                swiped_group.candidates.add(current_student)
            # if not liked or not all group members already liked, create group iteraction
            GroupInteraction.objects.create(
                liker=current_student, likee=swiped_group, liked=liked
            )
        # if liker is part of a group, and likee is a single
        elif other_student and liker_group:
            # if likee is already in a group, 400
            if other_student.joined_groups.filter(project=project).first():
                return Response({"details": "likee is already in a group"}, status=400)

            num_group_members = liker_group.num_members()

            Interaction.objects.create(
                project=project,
                swiper=current_student,
                swipee=other_student,
                liked=liked,
            )

            # if number of likes more than majority, add to group and remove from candidate list
            # else if number of dislikes more than majority, remove from candidate list and add rejects (TBD)
            num_votes = liker_group.num_of_votes(other_student, liked)
            if num_votes > num_group_members // 2:
                liker_group.add_member(
                    other_student
                ) if liked else liker_group.candidates.remove(other_student)
                liker_group.save()
                return Response({"matched": liked}, status=200)

            # return no match or no match
            return Response({"matched": False}, status=200)

        else:
            return Response(
                {"details": "likee uuid did not match any user or group"}, status=404
            )

        return Response({"matched": False})


class GroupView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request, project_id):
        student = request.user.student
        try:
            project = Project.objects.get(join_code=project_id)
        except ObjectDoesNotExist:
            return Response({"details": "Project does not exist"}, status=404)

        # check if the date has passed
        before_date = timezone.now() < project.end_date

        try:
            group = student.joined_groups.get(project=project)
        except ObjectDoesNotExist:
            return Response({"details": "No such group found"}, status=404)

        return Response(
            {
                "group": GroupMetaSerializer(instance=group).data,
                "members": GroupMemberProfileSerializer(
                    group.members.all(),
                    context={"project": project, "before_date": before_date},
                    many=True,
                ).data,
            }
        )
