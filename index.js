import express from 'express'
import http from 'http'

const app = express()
const server = http.createServer(app)

app.get('/', function(req, res) {
    res.send('hello world');
});

server.listen(3000, () => {
    console.log("Server listening on port 3000.")
})