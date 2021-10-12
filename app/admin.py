from django.apps import apps
from django.contrib import admin
from .models import SubReddit
from .models import Post


admin.site.register(SubReddit)


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    search_fields = ['subreddit', 'author', 'title']
    list_filter = ['subreddit', 'author', 'title', 'date']
    list_display = ['subreddit', 'author', 'title']
