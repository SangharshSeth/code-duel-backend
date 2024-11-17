import express from 'express'
import { Server } from 'socket.io'
import http from 'node:http'
import cors from 'cors'
import {MatchMakingQueue} from "./QueueService.js";
import {GameService} from "./GameService.js";

const expressApp = express()
expressApp.use(cors())

const webSocketServer = http.createServer(expressApp)

const socketIO = new Server(webSocketServer, {
    cors: {
        origin: "http://localhost:5173",
        allowedHeaders: "*",
        methods: ["POST"]
    }
})

expressApp.use((req, res, next) => {
    req.websocket = socketIO;
    next()
})

const GlobalMatchMakingQueue = new MatchMakingQueue()

socketIO.on("connection", (socket) => {
    console.log(`Someone has connected ${socket.id}`);
    socket.on("join-matchmaking", (gameDataFromSocket) => {
        if(GlobalMatchMakingQueue.items.length === 0){
            GlobalMatchMakingQueue.items.push({
                gameData: gameDataFromSocket,
                socketId: socket.id,
            });
        }
        else {
            const opponent = GlobalMatchMakingQueue.items.shift()
            const gameRoom = `GameRoom ${opponent.gameData.userName}-${gameDataFromSocket.userName}`

            socket.join(gameRoom);
            socketIO.sockets.sockets.get(opponent.socketId).join(gameRoom);
            const gameData = {
                "player1": gameDataFromSocket.userName,
                "player2": opponent.gameData.userName
            }
            socketIO.to(gameRoom).emit('match-found', {
                gameRoomId: gameRoom,
                gameData: gameData
            })

        }
    })

})

webSocketServer.listen(3000, () => {
    console.log("Server is listening");
})

process.on('beforeExit', (err) => {
    //Empty the GlobalMatchMaking items array
    GlobalMatchMakingQueue.items.length = 0
})


