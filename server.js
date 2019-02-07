var express = require('express')
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)



//Render index at root '/'
app.get('/', (req, res)=>{
    res.sendFile(__dirname+"/index.html")
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

http.listen(3001, ()=>{
    console.log("listening to port:3001")
})