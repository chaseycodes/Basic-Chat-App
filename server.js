var express = require('express')
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
const Joi = require('joi')

app.use(express.json());

const games = [
    { id: 1, name: 'chess' },
    { id: 2, name: 'tic-tac-toe' },
    { id: 3, name: 'pong' }
]
//Render index at root '/'
app.get('/', (req, res)=>{
    res.sendFile(__dirname+"/index.html");
})

app.get('/games', (req, res) =>{
    res.send(games);
})

app.get('/games/:id', (req, res)=>{
    const game = games.find(c => c.id === parseInt(req.params.id));
    if (!game) res.status(404).send("Id not found");
    res.send(game);
})

app.post('/games', (req, res)=>{
    const schema = {
        name: Joi.string().min(3).required()
    }

    const result = Joi.validate(req.body, schema);

    if (result.error) {
        res.status(400).send(result.error.details[0].message)
        return;
    }

    const game = {
        id: games.length + 1,
        name: req.body.name
    };
    games.push(game);
    res.send(game);
})

//Create Socket for Chat Connection
io.on('connection', (socket)=>{
    socket.on('chat', (msg)=>{
        io.emit('chat', msg)
    })
})

io.on('disconnect', function(){
    console.log('User Disconnected')
})

app.use(express.static('public'))


//PORT
const port = process.env.PORT || 3001;
http.listen(port, ()=>{
    console.log(`listening to port: ${port}`)
})