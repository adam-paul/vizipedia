release: cd backend && python manage.py collectstatic --noinput
web: gunicorn backend.vizipedia.wsgi --log-file -
