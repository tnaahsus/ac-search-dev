from django.views import generic
from .models import Post, SubReddit
from django.db.models import Q
from django.http import HttpResponse


class HomeView(generic.TemplateView):
    template_name = "app.html"


def search_post(request,):
    context = request.GET.get('search')
    sub = request.GET.get('subreddit')
    result = Post.objects.filter(Q(title__icontains=context) | Q(text__icontains=context), Q(subreddit__sub=sub))
    try:
        return HttpResponse(f"<h1>{result[0]}</h1>")
    except IndexError:
        return HttpResponse("<h1>No result found</h1>", status=204)