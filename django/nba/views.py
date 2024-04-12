from django.shortcuts import render
from django.http import JsonResponse
from django.db import connections

def get_table_names(request):
    #with connections['nhl_db'].cursor() as cursor:
    #    cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")
    #    table_names = [row[0] for row in cursor.fetchall()]
    #return JsonResponse(table_names, safe=False)
    return JsonResponse({'message': 'NBA database not implemented yet'})

def get_season_data(request):
    return JsonResponse({'message': 'Season data not implemented yet'})

def get_team_data(request):
    return JsonResponse({'message': 'Team data not implemented yet'})

def get_player_data(request):
    return JsonResponse({'message': 'Player data not implemented yet'})
