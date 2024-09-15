from django.urls import path

from . import views

urlpatterns = [
    path("", views.ProjectView.as_view()),
    path("<str:project_id>/", views.ProjectJoinView.as_view()),
    path("<str:project_id>/bio/", views.ProjectProfileView.as_view()),
    path("<str:project_id>/info/", views.ProjectInfoView.as_view()),
    path("<str:project_id>/candidate/", views.ProjectGetCandidate.as_view()),
    path("<str:project_id>/interaction/", views.InteractionView.as_view()),
    path("<str:project_id>/group/", views.GroupView.as_view()),
]
