const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(cors())
app.use(bodyParser.json())

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: "https://localhost:3000",
        clientId: "66fc5169a39843ad81b3cb835da6a3b5",
        clientSecret: "8d2833617b6447cd99f107053bad6e0b",
        refreshToken
    })

    spotifyApi.refreshAccessToken().then(
        (data) => {
          console.log('The access token has been refreshed!');
      
          spotifyApi.setAccessToken(data.body['access_token']);
        }).catch(() => {
            res.sendStatus(400)
        })
})

app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: "https://localhost:3000",
        clientId: "66fc5169a39843ad81b3cb835da6a3b5",
        clientSecret: "8d2833617b6447cd99f107053bad6e0b",
    })

    spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in
        })
    })
    .catch((err) => {
        console.log(err)
        res.sendStatus(400)
    })
})

app.listen(3001)