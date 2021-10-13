from django.db import models
# from django.db import connection

"""
def dictfetchall(cursor):
    
    # Convert the list result from db into dict
    
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()]


class CommentSearch:
    def __init__(self, search_text):
        self.query = "SELECT DISTINCT id, sub, author, text, date FROM app_comment WHERE UPPER(text) LIKE UPPER(%s) ORDER BY date DESC"
        self.search_text = search_text


    def search(self):
        if self.search_text is not None:
            with connection.cursor() as cursor:
                cursor.execute(self.query, [self.search_text])
                return dictfetchall(cursor)

"""


class CommentManager(models.Manager):
    def __init__(self):
        super(CommentManager, self).__init__()
        self.query = "SELECT DISTINCT id, author, text, date FROM app_comment WHERE UPPER(text) LIKE UPPER(%s) ORDER BY date DESC"


    def search(self, search_text):
        # qs = self.get_queryset()
        result = self.raw(self.query, (search_text,))
        return result


class Comment(models.Model):
    # sub = models.CharField(max_length=20, verbose_name='Subreddit', default='cryptocurrency')
    author = models.CharField(max_length=60)
    text = models.TextField(max_length=10000)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']
        verbose_name_plural = "Comment's"
        get_latest_by = ['-date']

    def __str__(self):
        return f"{self.author}   -   {self.text}"

    """
    @staticmethod
    def search(search_text=None):
        comment_search = CommentSearch(search_text)
        return comment_search.search()
        """

    objects = CommentManager()


"""
class PostSearch:
    def __init__(self, search_text):
        self.query = 'SELECT DISTINCT id, sub, author, title, text, date FROM app_post WHERE (UPPER(%s) LIKE UPPER(title) OR UPPER(text) LIKE UPPER(%s)) ORDER BY date DESC'
        self.search_text = search_text

    def search(self):
        with connection.cursor() as cursor:
            cursor.execute(self.query, [self.search_text, self.search_text])
            return dictfetchall(cursor)

"""


class PostManager(models.Manager):
    def __init__(self):
        super(PostManager, self).__init__()
        self.query = 'SELECT DISTINCT id, author, title, text, date FROM app_post WHERE (UPPER(title) LIKE UPPER(%s) OR UPPER(text) LIKE UPPER(%s)) ORDER BY date DESC'

    def search(self, search_text):
        result = self.raw(self.query, (search_text, search_text))
        return result



class Post(models.Model):
    # sub = models.CharField(max_length=20, verbose_name='Subreddit', default='cryptocurrency')
    author = models.CharField(max_length=60)
    title = models.CharField(max_length=100)
    text = models.TextField(max_length=10000)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']
        verbose_name_plural = "Post's"
        get_latest_by = ['-date']

    def __str__(self):
        return f"{self.author}   -   {self.title}"

    """
    @staticmethod
    def search(search_text=None):
        post_search = PostSearch(search_text)
        return post_search.search()
        """

    objects = PostManager()