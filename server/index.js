import express from 'express'
import bodyParser from 'body-parser'
import axios from 'axios'
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import {connectDB, db} from './db.js'
import {getUserFactory, createUserFactory} from './entities/user.js'
import {getTagsFactory, createTagFactory, updateTagFactory, deleteTagFactory} from './entities/tag.js'

dotenv.config()
const app = express()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
app.use(bodyParser.json())
const server = http.createServer(app)

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const githubApiUrl = process.env.GITHUB_API_URL;

const getUser = getUserFactory()
const createUser = createUserFactory()
const getTags = getTagsFactory()
const createTag = createTagFactory()
const updateTag = updateTagFactory()
const deleteTag = deleteTagFactory()

app.get('/', (req, res) => {
    let token = req.header('token')
    if (token) {
        getUserData(token, async (userData, error) => {
            if (error) res.redirect("/login")
            let foundUser = await getUser(userData.githubId)
            if (!foundUser) {
                createUser(userData)
            }
            let tags = await getTags(userData.githubId)
            let repos = await getStarredRepos(token)
            res.status(200).json({tags: tags, repos: repos})
        })
    } else {
        res.status(401).json({error: "Unauthorized Error"})
    }
});

app.post('/tag', (req, res) => {
    let token = req.header('token')
    if (token) {
        let body = req.body
        getUserData(token, (userData, error) => {
            if (isValidTag(body)) {
                let tag = createTag({...userData, name: req.body.name})
                res.status(200).json({tag})
            } else {
                res.status(500).json({error: "invalid tag name"})
            }
        })
    } else {
        res.status(401).json({error: "Unauthorized Error"})
    }
})

app.put('/tag', (req, res) => {
    let token = req.header('token')
    if (token) {
        getUserData(token, (userData, error) => {
            let body = req.body
            updateTag({
                id: body._id,
                name: body.name,
                repositories: body.repos,
                ownerId: userData.githubId
            })
        })
    } else {
        res.status(401).json({error: "Unauthorized Error"})
    }
})

app.delete('/tag', (req, res) => {
    let token = req.header('token')
    if (token) {
        getUserData(token, (userData, error) => {
            let body = req.body
            deleteTag({
                id: body._id,
                ownerId: userData.githubId
            })
        })
    } else {
        res.status(401).json({error: "Unauthorized Error"})
    }
})

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
        res.redirect(`http://localhost:3000?token=${token}`)
        // res.status(200).json({ token })
      }).
      catch(err => res.status(500).json({ message: err.message }))
})

connectDB().then(() => {
    server.listen(8080, () => {
        console.log("Server listening on port 8080.")
    })
})

let config = (token) => {
    return { headers: header(token) }
}

let header = (token) => {
    if (token) {
        return { 
            'Content-Type': 'application/json',
            'Authorization': `token ${token}`
        }
    }
    return {
        'Content-Type': 'application/json'
    }
}

let getUserData = (token, callback) => {
    axios.get(`${githubApiUrl}/user`, config(token))
    .then(res => res.data)
    .then(data => {
        return { githubId: data.id, login: data.login }
    })
    .then(userData => {
        callback(userData)
    })
    .catch(err => {
          console.log(err)
          res.redirect("/login")
    })
}

let getStarredRepos = (token) => {
    return axios.get(`${githubApiUrl}/user/starred`, config(token))
    .then(res => res.data)
    .catch(err => err)
}

let isValidTag = (body) => {
    if (body.name && body.name.length > 0) return true
    else return false
}