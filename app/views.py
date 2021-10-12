from django.views import generic
from .models import Post, Comment
from django.db.models import Q
from django.http import HttpResponse
from itertools import chain


class HomeView(generic.TemplateView):
    template_name = "app.html"


class SearchView(generic.ListView):
    template_name = 'app.html'
    paginate_by = 1
    count = 0

    def get_context_data(self, *args, **kwargs):
        context = super(SearchView, self).get_context_data(*args, **kwargs)
        context['count'] = self.count or 0
        context['query'] = self.request.GET.get('search')
        context['sub'] = self.request.GET.get('sub')
        print(context)
        return context

    def get_queryset(self):
        query = self.request.GET.get('search', None)
        # filter = self.request.GET.get('filter', 'post')
        if query is not None:
            post_result = Post.objects.search(query)
            comment_result = Comment.objects.search(query)

            queryset_chain = chain(post_result, comment_result)
            qs = sorted(queryset_chain, key=lambda instance: instance.date, reverse=True)
            self.count = len(qs)
            return qs
        return Post.objects.none()

    html = ""