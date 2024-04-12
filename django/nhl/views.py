import pandas as pd

from django.shortcuts import render
from django.http import JsonResponse
from django.db import connections
from django.db.models import Avg, FloatField, Sum
from django.db.models.functions import Cast
from sklearn import preprocessing

from .models import TeamData
from .models import PlayerData


def fetch_season_stats(season):
    '''
    Returns a list of all teams and their stats for the given season, 
    as well as the Stanley Cup winner for the season.

    Intended for use internal to this module.
    '''
    season_stats = TeamData.objects.filter(season=season).values()
    season_stats_list = list(season_stats)  # Convert QuerySet to list

    # Find the Stanley Cup winner for the season, if it exists
    try:
        winning_team_entry = TeamData.objects.get(season=season, stanley_cup_win=True)
        winning_team = {'team': winning_team_entry.team_id, 'logo': winning_team_entry.logo_url_string}
    except TeamData.DoesNotExist:
        winning_team = 'N/A'

    return season_stats_list, winning_team


def get_data_totals(request):
    '''
    Returns the total number of teams, seasons, and players in the database.
    '''
    # Get the number of teams, seasons, and players
    num_teams = TeamData.objects.values('team_id').distinct().count()
    num_seasons = TeamData.objects.values('season').distinct().count()
    num_players = PlayerData.objects.values('player_name').distinct().count()

    return JsonResponse({
        'num_teams': num_teams,
        'num_seasons': num_seasons,
        'num_players': num_players,
    })


def get_unique_seasons(request):
    '''
    Returns a chronologically ordered list of all unique seasons from the ORM 
    in the format 'XXXX-XXXX'.
    '''
    seasons = TeamData.objects.values('season').distinct().order_by('season')
    seasons_list = [season['season'] for season in seasons]
    
    # Convert the seasons to 'XXXX-XXXX' format
    formatted_seasons_list = [f"{season[:4]}-{season[4:]}" for season in seasons_list]
    
    return JsonResponse({'seasons': formatted_seasons_list})


def get_season_stats(request, season):
    '''
    Calls fetch_season_stats() and returns the results as a JSON response.
    '''
    try:
        season_stats, winning_team = fetch_season_stats(season)

        return JsonResponse({
            'season_stats': season_stats,
            'winning_team': winning_team,
        })
    
    except Exception as e:
        return JsonResponse({'error': str(e)})


def get_stat_avgs(request, stat):
    '''
    Returns a dictionary of seasons and their average for the given stat.
    If the stat is of type 'text', it is first converted to double precision.
    '''
    # Check if the stat is of type 'text' and needs conversion
    if stat in ['pt_pctg', 'power_play_percentage', 'penalty_kill_percentage', 'face_off_win_percentage']:
        converted_stat = Cast(stat, FloatField())
    else:
        converted_stat = stat

    # Aggregate the average for the given stat for each season
    stat_data = TeamData.objects.values('season').annotate(average_stat=Avg(converted_stat)).order_by('season')

    # Convert the QuerySet to a dictionary with formatted season key
    stat_dict = {f"{data['season'][:4]}-{data['season'][4:]}": data['average_stat'] for data in stat_data}

    return JsonResponse(stat_dict)


def get_seasons_gpg(request):
    '''
    Returns a dictionary of seasons and their average goals per game.
    '''
    # Aggregate the average goals per game for each season
    gpg_data = TeamData.objects.values('season').annotate(average_gpg=Avg('goals_per_game')).order_by('season')

    # Convert the QuerySet to a dictionary with formatted season key
    gpg_dict = {f"{data['season'][:4]}-{data['season'][4:]}": data['average_gpg'] for data in gpg_data}

    return JsonResponse(gpg_dict)


def get_total_points(request):
    '''
    Returns a dictionary of seasons and their total points.
    '''
    # Aggregate the total points for each season
    points_data = TeamData.objects.values('season').annotate(total_points=Sum('pts')).order_by('season')

    # Convert the QuerySet to a dictionary with formatted season key
    points_dict = {f"{data['season'][:4]}-{data['season'][4:]}": data['total_points'] for data in points_data}

    return JsonResponse(points_dict)

    
def get_cup_winners(request):
    # Get all instances where stanley_cup_win is True
    winners = TeamData.objects.filter(stanley_cup_win=True)

    # Adjust season strings to 'XXXX-XXXX' format
    for winner in winners:
        winner.season = f"{winner.season[:4]}-{winner.season[4:]}"

    # Create a dictionary with season as key and team_id as value
    winners_dict = {winner.season: [winner.team_id, winner.logo_url_string] for winner in winners}

    # Handle special cases
    special_cases = {"1924-1925": ["N/A", '5eGVTjK'], "2004-2005": ["N/A", '5eGVTjK']}

    # Create a sorted list of tuples (season, team_id) from the winners dictionary
    sorted_winners = sorted(winners_dict.items(), key=lambda x: x[0])

    # Insert the special cases into the sorted list at the correct positions
    for season, team_id in special_cases.items():
        # Find the position to insert the special case
        position = next((i for i, pair in enumerate(sorted_winners) if pair[0] > season), len(sorted_winners))
        sorted_winners.insert(position, (season, team_id))

    # Convert the sorted list of tuples back to a dictionary
    ordered_winners_dict = dict(sorted_winners)

    # Return the dictionary as a JSON response
    return JsonResponse(ordered_winners_dict)
    

def stat_path_preprocess(request, season):
    """
    Plots the statistical path for a given season

    Parameters
    ----------
    season : str
        The season for which to plot statistical path
        Format: 'YYYYYYYY', e.g. '20182019'

    """
    # Function that returns stats and winning team for a given season
    season_stats_list, winning_team = fetch_season_stats(season)

    # Convert list of dictionaries to DataFrame
    full_team_stats = pd.DataFrame(season_stats_list)
    print(full_team_stats.columns)

    # Preprocess the data:
    # Set the index to team_id
    full_team_stats = full_team_stats.set_index('team_id', drop=False)

    # Attempt to convert erroneous object columns to floats
    for column in full_team_stats.columns:
        if full_team_stats[column].dtype == 'object' and column != 'season':
            try:
                full_team_stats[column] = full_team_stats[column].astype(float)
            except ValueError:
                pass  # Ignore if the conversion fails

    # Drop columns that are not numeric
    full_team_stats.drop('games_played', axis=1, inplace=True)
    numeric_stats = full_team_stats.select_dtypes(include=['number'])

    # Drop columns where all values are 0, as this represents a season where those stats were not recorded
    cols_to_drop = numeric_stats.columns[numeric_stats.eq(0).all()] 
    numeric_stats.drop(columns=cols_to_drop, inplace=True)  
    
    # Mean-subtract the data
    stat_mns = numeric_stats - numeric_stats.mean()

    # Scale the data
    scaler_mm = preprocessing.MinMaxScaler(feature_range=(-1, 1))
    stat_scaled = scaler_mm.fit_transform(stat_mns)

    # List of columns to invert (i.e., lower values are better)
    cols_to_invert = ['losses', 'goals_against_per_game', 'power_play_goals_against', 'shots_allowed', 'face_offs_lost']

    # Invert the selected columns
    for col in cols_to_invert:
        try:
            stat_scaled[:, numeric_stats.columns.get_loc(col)] *= -1
        except KeyError:
            pass

    # Get columns
    stat_cols = numeric_stats.columns

    # Convert the final numpy array and column names to list of dictionaries
    # This will be our data format to send to the frontend for D3.js
    final_data = []
    for team_id, row in zip(numeric_stats.index, stat_scaled):  # Iterate over both index (team_id) and data rows
        row_dict = {'team_id': team_id}  # Initialize the dictionary with team_id
        for i, col_name in enumerate(stat_cols):
            row_dict[col_name] = row[i]
        final_data.append(row_dict)

    return JsonResponse({
        'final_data': final_data,
        'original_data': numeric_stats.to_dict('index'),
        'winning_team': winning_team['team'],
        'winning_team_logo': winning_team['logo'],
        'stat_cols': list(stat_cols)
    })


def get_team_data(request):
    return JsonResponse({'message': 'Team data not implemented yet'})


def get_player_data(request):
    return JsonResponse({'message': 'Player data not implemented yet'})
