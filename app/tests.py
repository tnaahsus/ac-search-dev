from django.test import TestCase, Client
from .models import Post, SubReddit
from .views import search_post


class TestData(TestCase):  # setup the test data
    @classmethod
    def setUpTestData(cls):  # setup the test data
        SubReddit.objects.create(sub='r/cryptocurrency')
        sub = SubReddit.objects.get(sub='r/cryptocurrency')
        Post.objects.create(subreddit=sub, author='user', title='test', text='test')


class ModelTest(TestData):

    def test_queryset_exists(self):  # check if queryset exists or not
        qs = Post.objects.all()
        self.assertTrue(qs.exists())

    def get_query(self):  # check if returning the correct queryset or not
        qs = Post.objects.get(title='test', subreddit__sub='r/cryptocurrency')
        # self.assertQuerysetEqual(qs, [repr("r/cryptocurrency   -   user   -   test")])
        title = qs.title
        self.assertEqual(title, 'test')



class ViewTest(TestData):
    client = Client()

    def test_status_code(self):
        response = self.client.get('/search?subreddit=r%2Fcryptocurrency&search=test')  # search for a post which exists
        next_response = self.client.get('/search?subreddit=r%2Fcryptocurrency&search=hello')  # search for a post which doesn't exist
        # print(response.status_code, Post.objects.all())
        self.assertEqual(response.status_code, 200)
        self.assertEqual(next_response.status_code, 204)