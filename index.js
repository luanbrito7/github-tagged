import express from 'express'
import axios from 'axios'
import http from 'http'
import dotenv from 'dotenv'
import {connectDB, db} from './db.js'

dotenv.config()
const app = express()
const server = http.createServer(app)

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const config = {
    headers: {
        Accept: "application/vnd.github.v3+json"
    }
}  

app.get('/', (req, res) => {
    if (req.query.token) {
        axios.get(`https://api.github.com/user/starred`, { headers: { 'Authorization': `token ${req.query.token}`,
        'Content-Type': 'application/json' } }).
          then(res => console.log(res)).
          catch(err => res.redirect("/login"))
    } else {
        res.redirect("/login")
    }
});

app.get('/login', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo`);
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
        res.status(200).json({ token })
      }).
      catch(err => res.status(500).json({ message: err.message }))
})

connectDB().then(() => {
    server.listen(3000, () => {
        console.log("Server listening on port 3000.")
    })
})