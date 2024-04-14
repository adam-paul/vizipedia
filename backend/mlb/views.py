from django.shortcuts import render
from django.http import JsonResponse
from django.db import connections

def get_table_names(request):
    return JsonResponse({'message': 'MLB database not implemented yet'})

def get_season_data(request):
    return JsonResponse({'message': 'Season data not implemented yet'})

def get_team_data(request):
    return JsonResponse({'message': 'Team data not implemented yet'})

def get_player_data(request):
    return JsonResponse({'message': 'Player data not implemented yet'})
