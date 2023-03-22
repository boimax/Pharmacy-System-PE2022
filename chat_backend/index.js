const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
const http = require('http')
const server = http.createServer(app)
let users = []

const io = require('socket.io')(server, { 
    cors: {
        origin: '*',
        methods: 'GET,POST,PUT,DELETE',
    }
})
//const io = new Server(server)
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));
let roomid = null;

const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://minh:vcl123456@cluster0.x2dev.mongodb.net/?retryWrites=true&w=majority"
const clients = new MongoClient(uri);


clients.connect(function(err, client){
    const database = client.db("haha").collection("hehe")
    if(err) {throw err;}
    io.on('connection', (socket) => {
        console.log('user connected')
        socket.on('joinRoom', async ({userid, room}) =>{
            if(!userid) {userid = "";}
            if(!room) {room = "";}
            if (userid.localeCompare(room) < 0) roomid = userid + '_' + room;
            else roomid = room + '_' + userid
            socket.join(roomid)    
            const result = await database.find({roomid: roomid}).sort({"timestamp":1}).toArray();
            io.in(roomid).emit('new-chat', result)
        }) 
    
        socket.on('leaveRoom', lastRoom =>{
            if(lastRoom){
                socket.leave(lastRoom)
            }   
        })
    
        socket.on('on-chat', async data => {
            const timestamp = Date.now()
            data.timestamp = timestamp
            if (data.userid.localeCompare(data.room) < 0) roomid = data.userid + '_' + data.room;
            else roomid = data.room + '_' + data.userid;
            data.roomid = roomid
            await database.insertOne(data)
            console.log(users)
            for (const i of users)
            {
                if (i.userid === data.room)
                {
                    io.to(i.socketid).emit('user-chat', data);
                }
            }
            socket.emit('user-chat', data)
        })
    
        socket.on('disconnect', () => {    
            console.log('disconnect')
            let index = users.findIndex(x => x.socketid === socket.id)
            users.splice(index, 1)
            io.emit('updateUserStatus', users)
            //await clients.close();
        })
        
        socket.on('init', async ({userid, users}) => {
            const data = await database.find({$or:[{userid: userid}, {room: userid}]}).sort({"timestamp":-1}).toArray()
            const order = [...new Set(data.map(item => item.roomid))]; // [ 'A', 'B']
            const unique = [];
            if (order.length !== 0)
            {
                const lastMes = [];
                const flag = []
                if (data[0].userid === userid){
                    lastMes.push("You: " + data[0].message);
                }
                else
                {
                    lastMes.push(data[0].message);
                }
                flag[data[0].roomid] = 1
                for (var i = 1; i < data.length; i++) {
                    if (data[i-1].roomid !== data[i].roomid && flag[data[i].roomid] !== 1){
                        if (data[i].userid === userid){
                            lastMes.push("You: " + data[i].message);
                        }
                        else lastMes.push(data[i].message);
                        flag[data[i].roomid] = 1;
                    }
                }
                for (const i of order)
                {
                    let index = i.indexOf('_')
                    let temp1 = i.substring(0, index)
                    let temp2 = i.substring(index + 1, i.length)
                    if (temp1 !== userid)
                    {
                        unique.push({user: temp1, lastmes: lastMes.shift()})
                    }
                    else
                    {
                        unique.push({user: temp2, lastmes: lastMes.shift()})
                    }
                }
            }
            socket.emit('init', {unique, users})
        })
        socket.on('updateUserStatus', userid => {
            users.push({userid: userid, socketid: socket.id})
            console.log(users)
            io.emit('updateUserStatus', users)
        })
        
        socket.on('change-room', (username) => {
            socket.emit('change-room', {username, users})
        })
        
        socket.on('check-icon-status', () => {
            socket.emit('check-icon-status', users)
        })
    })
    
    server.listen(3000, () => {
        console.log('listening on port 3000')
    })
})









