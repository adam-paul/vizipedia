from django.urls import path

from .views import get_table_names, get_season_data, get_team_data, get_player_data

urlpatterns = [
    path('', get_table_names, name='get-table-names'),
    path('season/', get_season_data, name='get-season-data'),
    path('team/', get_team_data, name='get-team-data'),
    path('player/', get_player_data, name='get-player-data'),
]