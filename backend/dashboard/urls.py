from django.urls import path
from dashboard.views import UserDashboardView

urlpatterns = [
    path('dashboard/', UserDashboardView.as_view(), name='dashboard'),
]