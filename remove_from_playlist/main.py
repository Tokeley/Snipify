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
    # Check if the user is logged in
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        auth_url = sp_oauth.get_authorize_url()
        return redirect(auth_url)
    return redirect(url_for('get_playlists'))

@app.route('/callback')
def callback():
    sp_oauth.get_access_token(request.args['code'])
    return redirect(url_for('get_playlists'))

@app.route('/get_playlists')
def get_playlists():
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        return redirect(sp_oauth.get_authorize_url())
    
    playlists = sp.current_user_playlists()
    playlists_html = ''
    for pl in playlists['items']:
        playlists_html += f'<a href="/playlist/{pl["id"]}">{pl["name"]}</a><br>'
    
    return playlists_html

@app.route('/playlist/<playlist_id>')
def show_playlist(playlist_id):
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        return redirect(sp_oauth.get_authorize_url())
    
    tracks = sp.playlist_items(playlist_id)
    html = f'<h2>Tracks in Playlist</h2><ul>'
    for item in tracks['items']:
        track = item['track']
        html += f'<li>{track["name"]} - {track["artists"][0]["name"]} ' \
                f'<a href="/remove/{playlist_id}/{track["id"]}">Remove</a></li>'
    html += '</ul><a href="/">Back</a>'
    return html

@app.route('/remove/<playlist_id>/<track_id>')
def remove_track(playlist_id, track_id):
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        return redirect(sp_oauth.get_authorize_url())
    
    sp.playlist_remove_all_occurrences_of_items(playlist_id, [track_id])
    return redirect(url_for('show_playlist', playlist_id=playlist_id))



@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))

if __name__ == "__main__":
    # Run the Flask application
    app.run(debug=True)