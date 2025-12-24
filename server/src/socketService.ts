import {Server as SocketIOServer, Socket} from 'socket.io';
import {Server as HTTPServer} from 'http';


let io : SocketIOServer | null = null;


export function initSocket(server:HTTPServer) : void {
    io = new SocketIOServer(server, {
        cors : {
            origin: ["http://localhost:3000", "https://iotnerver.alphatechit.dev"],
            methods: ["GET", "POST"],
            credentials: true
        },
    });

    io.on("connection", (socket:Socket) => {
        console.log("a user connected!");
        socket.emit("message", "Welcome to the server!");

        socket.on("disconnect", () => {
            console.log("a user disconnected!")
        });
    });
}

export function sendToFrontend(heading:string, data:T) : void {
    if (io) {
        io.emit(heading, data);
    } else {
        console.error("Socket is not initialized!");
    }

}

