from django.urls import path
from .views import LeaderboardDashboardView, LeaderboardFullView

urlpatterns = [
    path('dashboard/', LeaderboardDashboardView.as_view(), name='leaderboard-dashboard'),
    path('', LeaderboardFullView.as_view(), name='leaderboard-full'),
]
