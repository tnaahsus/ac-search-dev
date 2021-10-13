from django.apps import apps
from django.contrib import admin
from .models import Post, Comment


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    search_fields = ['author']
    list_filter = ['author', 'date']
    list_display = ['author', 'text']


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    search_fields = ['author', 'title']
    list_filter = ['author', 'title', 'date']
    list_display = ['author', 'title']
