from django.urls import path

from .views import (
    get_team_data, 
    get_player_data,
    get_data_totals,
    get_unique_seasons,
    get_season_stats,
    get_stat_avgs,
    get_seasons_gpg,
    get_total_points,
    get_cup_winners,
    stat_path_preprocess,)

urlpatterns = [
    path('team/', get_team_data, name='get-team-data'),
    path('player/', get_player_data, name='get-player-data'),
    path('data_totals/', get_data_totals, name='get-data-totals'),
    path('unique_seasons/', get_unique_seasons, name='get-unique-seasons'),
    path('season_stats/<str:season>/', get_season_stats, name='get-season-stats'),
    path('stat_avgs/<str:stat>/', get_stat_avgs, name='get-stat-avgs'),
    path('seasons_gpg/', get_seasons_gpg, name='get-seasons-gpg'),
    path('total_points/', get_total_points, name='get-total-points'),
    path('stanley_cup_winners/', get_cup_winners, name='get-cup-winners'),
    path('stat_path_preprocess/<str:season>/', stat_path_preprocess, name='stat-path-preprocess')
]