# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class PlayerData(models.Model):
    team = models.TextField()
    assists = models.FloatField(blank=True, null=True)
    goals = models.FloatField(blank=True, null=True)
    pim = models.FloatField(blank=True, null=True)
    games = models.FloatField(blank=True, null=True)
    penalty_minutes = models.TextField(blank=True, null=True)
    game_winning_goals = models.FloatField(blank=True, null=True)
    over_time_goals = models.FloatField(blank=True, null=True)
    points = models.FloatField(blank=True, null=True)
    player_name = models.TextField(primary_key=True)  # The composite primary key (player_name, team, season) found, that is not supported. The first column is selected.
    season = models.TextField()
    time_on_ice = models.TextField(blank=True, null=True)
    shutouts = models.FloatField(blank=True, null=True)
    ties = models.FloatField(blank=True, null=True)
    wins = models.FloatField(blank=True, null=True)
    losses = models.FloatField(blank=True, null=True)
    goal_against_average = models.FloatField(blank=True, null=True)
    games_started = models.FloatField(blank=True, null=True)
    goals_against = models.FloatField(blank=True, null=True)
    power_play_goals = models.FloatField(blank=True, null=True)
    power_play_points = models.FloatField(blank=True, null=True)
    short_handed_goals = models.FloatField(blank=True, null=True)
    short_handed_points = models.FloatField(blank=True, null=True)
    shots = models.FloatField(blank=True, null=True)
    hits = models.FloatField(blank=True, null=True)
    power_play_time_on_ice = models.TextField(blank=True, null=True)
    even_time_on_ice = models.TextField(blank=True, null=True)
    face_off_pct = models.FloatField(blank=True, null=True)
    shot_pct = models.FloatField(blank=True, null=True)
    short_handed_time_on_ice = models.TextField(blank=True, null=True)
    blocked = models.FloatField(blank=True, null=True)
    plus_minus = models.FloatField(blank=True, null=True)
    shifts = models.FloatField(blank=True, null=True)
    saves = models.FloatField(blank=True, null=True)
    power_play_saves = models.FloatField(blank=True, null=True)
    short_handed_saves = models.FloatField(blank=True, null=True)
    even_saves = models.FloatField(blank=True, null=True)
    save_percentage = models.FloatField(blank=True, null=True)
    shots_against = models.FloatField(blank=True, null=True)
    short_handed_shots = models.FloatField(blank=True, null=True)
    even_shots = models.FloatField(blank=True, null=True)
    power_play_shots = models.FloatField(blank=True, null=True)
    power_play_save_percentage = models.FloatField(blank=True, null=True)
    short_handed_save_percentage = models.FloatField(blank=True, null=True)
    even_strength_save_percentage = models.FloatField(blank=True, null=True)
    ot = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'player_data'
        unique_together = (('player_name', 'team', 'season'),)


class TeamData(models.Model):
    games_played = models.BigIntegerField(blank=True, null=True)
    wins = models.BigIntegerField(blank=True, null=True)
    losses = models.BigIntegerField(blank=True, null=True)
    ot = models.BigIntegerField(blank=True, null=True)
    pts = models.BigIntegerField(blank=True, null=True)
    pt_pctg = models.TextField(blank=True, null=True)
    goals_per_game = models.FloatField(blank=True, null=True)
    goals_against_per_game = models.FloatField(blank=True, null=True)
    ev_ggaratio = models.FloatField(blank=True, null=True)
    power_play_percentage = models.TextField(blank=True, null=True)
    power_play_goals = models.FloatField(blank=True, null=True)
    power_play_goals_against = models.FloatField(blank=True, null=True)
    power_play_opportunities = models.FloatField(blank=True, null=True)
    penalty_kill_percentage = models.TextField(blank=True, null=True)
    shots_per_game = models.FloatField(blank=True, null=True)
    shots_allowed = models.FloatField(blank=True, null=True)
    win_score_first = models.FloatField(blank=True, null=True)
    win_opp_score_first = models.FloatField(blank=True, null=True)
    win_lead_first_per = models.FloatField(blank=True, null=True)
    win_lead_second_per = models.FloatField(blank=True, null=True)
    win_outshoot_opp = models.FloatField(blank=True, null=True)
    win_outshot_by_opp = models.FloatField(blank=True, null=True)
    face_offs_taken = models.FloatField(blank=True, null=True)
    face_offs_won = models.FloatField(blank=True, null=True)
    face_offs_lost = models.FloatField(blank=True, null=True)
    face_off_win_percentage = models.TextField(blank=True, null=True)
    shooting_pctg = models.FloatField(blank=True, null=True)
    save_pctg = models.FloatField(blank=True, null=True)
    season = models.TextField()
    team_id = models.TextField(primary_key=True)  # The composite primary key (team_id, season) found, that is not supported. The first column is selected.
    stanley_cup_win = models.BooleanField(blank=True, null=True)
    logo_url_string = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'team_data'
        unique_together = (('team_id', 'season'),)
