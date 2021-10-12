from django.conf.urls import url
from django.urls import path
from . import views


urlpatterns = [
    path('', views.HomeView.as_view(), name='home'),
    path('search', views.search_post, name='search post')
    ]



