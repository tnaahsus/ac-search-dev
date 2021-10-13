from django.views import generic
from .models import Post, Comment
from itertools import chain
from django.http import HttpResponse
from .db_init import create_dummy_data


class HomeView(generic.TemplateView):
    template_name = "app.html"


class SearchView(generic.ListView):
    template_name = 'app.html'
    paginate_by = 10
    count = 0
    post_result = Post.objects.none()
    comment_result = Comment.objects.none()

    def get_context_data(self, *args, **kwargs):
        context = super(SearchView, self).get_context_data(*args, **kwargs)
        context['count'] = self.count or 0
        context['query'] = self.request.GET.get('search')
        return context

    def get_queryset(self):
        query = self.request.GET.get('search')
        filter1 = self.request.GET.get('filter1', None)
        filter2 = self.request.GET.get('filter2', None)
        if query is not None:
            if filter1 and filter2 is None:
                self.post_result = Post.objects.search(query)
            elif filter2 and filter1 is None:
                self.comment_result = Comment.objects.search(query)
            else:
                self.post_result = Post.objects.search(query)
                self.comment_result = Comment.objects.search(query)
            queryset_chain = chain(self.post_result, self.comment_result)
            qs = sorted(queryset_chain, key=lambda instance: instance.date, reverse=True)
            self.count = len(qs)
            return qs
        return Post.objects.none()


def test(requests):
    create_dummy_data()
    return HttpResponse("<h1>Successfully created dummy data</h1>")