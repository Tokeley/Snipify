import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import request from 'request';

const port = 5001

config()

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET

var app = express();

// Enable CORS for the React frontend (allow cross-origin requests)
app.use(cors({
  origin: 'https://snipifyclient.vercel.app',  // Your React frontend URL
  methods: ['GET', 'POST'],         // Allowed methods
}));

app.listen(port, () => {
  console.log(`Listening at https://snipify-production.up.railway.app:${port}`)
  console.log('Hello');
})

app.get('/auth/login', (req, res) => {
    console.log('Login');
    var scope = "streaming \
                 user-read-email \
                 user-read-private \
                 playlist-read-private \
                 playlist-read-collaborative\
                 playlist-modify-public\
                 playlist-modify-private"
  
    var state = generateRandomString(16);
  
    var auth_query_parameters = new URLSearchParams({
      response_type: "code",
      client_id: spotify_client_id,
      scope: scope,
      redirect_uri: "http://127.0.0.1:3000/auth/callback",
      state: state
    })
  
    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
})

let access_token = '';

app.get('/auth/callback', (req, res) => {
    console.log('Callback');
    var code = req.query.code;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
        code: code,
        redirect_uri: "http://127.0.0.1:3000/auth/callback",
        grant_type: 'authorization_code'
        },
        headers: {
        'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
        'Content-Type' : 'application/x-www-form-urlencoded'
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          access_token = body.access_token;
          res.redirect('/')
        } else {
          res.status(500).send('Error during authentication');
        }
    });
})
  
app.get('/auth/token', (req, res) => {
  console.log('Get token');
  if (access_token) {
      res.json({
          access_token: access_token
      });
  } else {
      console.log('No access token available');
      res.status(400).json({ error: 'No access token available' });
  }
});


var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
  