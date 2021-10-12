from django.db import models
from django.urls import reverse
from django.db.models import Q


class CommentManager(models.Manager):
    def search(self, query=None):
        qs = self.get_queryset()
        if query is not None:
            or_lookup = (Q(text__icontains=query))
            qs = qs.filter(or_lookup).distinct()

        return qs


class Comment(models.Model):
    sub = models.CharField(max_length=20, verbose_name='Subreddit', unique=True)
    author = models.CharField(max_length=60)
    text = models.TextField(max_length=10000)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']
        verbose_name_plural = "Comment's"
        get_latest_by = ['-date']

    def __str__(self):
        return f"{self.sub} -   {self.author}   -   {self.text}"

    objects = CommentManager()



class PostManager(models.Manager):
    def search(self, query=None):
        qs = self.get_queryset()
        if query is not None:
            or_lookup = (Q(title__icontains=query) |
                         Q(text__icontains=query))
            qs = qs.filter(or_lookup).distinct()

        return qs


class Post(models.Model):
    sub = models.CharField(max_length=20, verbose_name='Subreddit', unique=True)
    author = models.CharField(max_length=60)
    title = models.CharField(max_length=100)
    text = models.TextField(max_length=10000)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']
        verbose_name_plural = "Post's"
        get_latest_by = ['-date']

    def __str__(self):
        return f"{self.sub}   -   {self.author}   -   {self.title}"


    objects = PostManager()