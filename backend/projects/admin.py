from email.headerregistry import Group

from django.contrib import admin

from .models import (Group, GroupInteraction, Interaction, Project,
                     ProjectProfile)

# Register your models here.


class GroupAdmin(admin.ModelAdmin):
    model = Group
    list_display = ("group_name", "uuid", "project")


class InteractionAdmin(admin.ModelAdmin):
    model = Interaction
    list_display = ("pk", "swiper", "swipee", "liked")


class GroupInteractionAdmin(admin.ModelAdmin):
    model = GroupInteraction
    list_display = ("pk", "liker", "likee", "liked")


class ProjectProfileAdmin(admin.ModelAdmin):
    model = ProjectProfile
    list_display = (
        "pk",
        "student",
        "project",
        "bio",
        "skills",
        "pronouns",
        "year",
        "contact_details",
    )


admin.site.register(Project)
admin.site.register(ProjectProfile, ProjectProfileAdmin)
admin.site.register(Interaction, InteractionAdmin)
admin.site.register(Group, GroupAdmin)
admin.site.register(GroupInteraction, GroupInteractionAdmin)
