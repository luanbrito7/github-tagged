import express from 'express'
import axios from 'axios'
import http from 'http'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
const server = http.createServer(app)

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

app.get('/', (req, res) => {
    res.send('hello world');
});

app.get('/login', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}`);
})

app.get('/oauth-callback', (req, res) => {
    const body = {
        client_id: clientId,
        client_secret: clientSecret,
        code: req.query.code
    }
    const options = { headers: { accept: 'application/json' } }
    axios.post(`https://github.com/login/oauth/access_token`, body, options).
      then(res => res.data['access_token']).
      then(token => {
        console.log('My token:', token);
        res.status(200).json({ message: "you are logged in." })
      }).
      catch(err => res.status(500).json({ message: err.message }))
})

server.listen(3000, () => {
    console.log("Server listening on port 3000.")
})