import os
from flask import Flask, session, redirect, url_for, request

from spotipy import Spotify
from spotipy.oauth2 import SpotifyOAuth
from spotipy.cache_handler import FlaskSessionCacheHandler

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(64)

client_id = '3622c37a36ad4689b9aead2e7ba6dd2f'
client_secret = '11874c29dd8e440a90071350d4d5f3ee'
redirect_uri = 'http://127.0.0.1:5000/callback'
scope = 'playlist-read-private playlist-modify-private playlist-modify-public'

cache_handler = FlaskSessionCacheHandler(session)
sp_oauth = SpotifyOAuth(
    client_id=client_id,
    client_secret=client_secret,
    redirect_uri=redirect_uri,
    scope=scope,
    cache_handler=cache_handler,
    show_dialog=True
)

sp = Spotify(auth_manager=sp_oauth)

@app.route('/')
def home():
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        return redirect(sp_oauth.get_authorize_url())
    return redirect(url_for('get_playlists'))


@app.route('/callback')
def callback():
    sp_oauth.get_access_token(request.args['code'])
    return redirect(url_for('preview_led_zeppelin'))


@app.route('/preview_led_zeppelin')
def preview_led_zeppelin():
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        return redirect(sp_oauth.get_authorize_url())

    weeknd_uri = 'spotify:artist:1Xyo4u8uXC1ZmMpatF05PJ'  # The Weeknd
    results = sp.artist_top_tracks(weeknd_uri)

    html = '<h2>Top 10 Tracks</h2><ul>'
    for track in results['tracks'][:1]:
        name = track['name']
        cover_art = track['album']['images'][0]['url'] if track['album']['images'] else ''
        track_id = track['id']

        html += f'<a href="{track["external_urls"]["spotify"]}" target="_blank">{name}</a><br>'
        html += f'<iframe src="https://open.spotify.com/embed/track/{track_id}?autoplay=true" width="300" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>'

        if cover_art:
            html += f'<img src="{cover_art}" alt="Cover Art" width="150"><br>'
        html += '</li><br>'
    html += '</ul><a href="/">Back</a>'

    return html



@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))

if __name__ == "__main__":
    # Run the Flask application
    app.run(debug=True)
