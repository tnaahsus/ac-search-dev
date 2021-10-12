from django.db import models
from django.urls import reverse


class SubReddit(models.Model):
    sub = models.CharField(max_length=20, verbose_name='Subreddit', unique=True)

    class Meta:
        verbose_name_plural = 'Subs'


    def __str__(self):
        return f"{self.sub}"


class Post(models.Model):
    subreddit = models.ForeignKey(SubReddit, on_delete=models.CASCADE, related_name='posts')
    author = models.CharField(max_length=60)
    title = models.CharField(max_length=100)
    text = models.CharField(max_length=10000)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']
        # get_latest_by = ['-date']

    def __str__(self):
        return f"{self.subreddit.sub}   -   {self.author}   -   {self.title}"


    def get_absolute_url(self):
        return reverse('post', kwargs={'sub':self.id})