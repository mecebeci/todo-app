from django.urls import path
from .views import todo_list_create, todo_detail

urlpatterns = [
    path('todos/', todo_list_create, name='todo-list-create'),
    path('todos/<int:pk>/', todo_detail, name='todo-detail'),
]