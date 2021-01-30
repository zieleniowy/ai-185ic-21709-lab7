const portscanner = require('portscanner')
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', socket=>{
    console.log('new connection');
    socket.on('message', message=>{
        socket.broadcast.emit('message', message);
    })
})

const ports = new Array(1000).fill(0).map((zero, k)=>3000+k);

app.use('/', express.static(__dirname+'/public'));

portscanner.findAPortNotInUse(ports).then(function(port) {
    const withRedis = process.env.USE_REDIS === "true";
    if(withRedis){
        const redisAdapter = require('socket.io-redis');
        io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));
    }    
    http.listen(port, () => {
        console.log(`app ${withRedis?"with redis":"without redis"} is listening on port ${port}`);
    });
    

});