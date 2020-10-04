import express from 'express'
import axios from 'axios'
import http from 'http'
import dotenv from 'dotenv'
import {connectDB, db} from './db.js'
import {getUserFactory, createUserFactory} from './entities/user.js'

dotenv.config()
const app = express()
const server = http.createServer(app)

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const githubApiUrl = process.env.GITHUB_API_URL;

const getUser = getUserFactory()
const createUser = createUserFactory()

app.get('/', (req, res) => {
    let token = req.header('token')
    if (token) {
        axios.get(`${githubApiUrl}/user`, config(token))
        .then(res => res.data)
        .then(data => {
            return { githubId: data.id, login: data.login }
        })
        .then(async userData => {
            let tags = find_tags(userData)
            let repos = await getStarredRepos(token)
            let foundUser = getUser(userData.githubId)
            if (!foundUser) {
                let opa = createUser(userData)
                console.log(opa)
            }
            res.status(200).json({tags: tags, repos: repos})
        })
        .catch(err => {
              console.log(err)
              res.redirect("/login")
        })
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
    axios.post(`https://github.com/login/oauth/access_token`, body, options)
      .then(res => res.data['access_token'])
      .then(token => {
        res.status(200).json({ token })
      }).
      catch(err => res.status(500).json({ message: err.message }))
})

connectDB().then(() => {
    server.listen(3000, () => {
        console.log("Server listening on port 3000.")
    })
})

let config = (token) => {
    return { headers: header(token) }
}

let header = (token) => {
    // let newHeader = { 
    //     'Content-Type': 'application/json'
    // }
    if (token) {
        return { 
            'Content-Type': 'application/json',
            'Authorization': `token ${token}`
        }
        // newHeader['Authorization'] = `token ${token}`
    }
    return {
        'Content-Type': 'application/json'
    }
}

var find_tags = () => {
    return [1, 2, 3]
}

let getStarredRepos = (token) => {
    return axios.get(`${githubApiUrl}/user/starred`, config(token))
    .then(res => res.data)
    .catch(err => err)
}