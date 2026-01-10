require('dotenv').config();
import express from 'express';
import  enforce from 'express-sslify';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import {initSocket,sendToFrontend} from'./socketService';
import { mqttInstance }  from './controllers/mqttClient.controller';
import MqttRoutes from './routes/mqtt.routes';
import CodeRoutes from './routes/code.routes';
import ControlRoutes from './routes/control.routes';
import ProfileRoutes from'./routes/profile.routes';
import ProtectedRoutes from './routes/protected.routes';
import DeviceRoutes from './routes/devices.routes';
import AuthRoutes from './routes/auth.routes';

const app = express();
app.set('trust proxy', 1);

app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:9443',
        'https://iot.alphatechit.dev'
    ],
    methods: 'GET,POST,PUT,DELETE',
    credentials:true,
}));

if (process.env.NODE_ENV2 === 'production') {
    app.use(enforce.HTTPS({trustProtoHeader:true}));
}
const server = http.createServer(app);
initSocket(server);

 
app.use(bodyParser.json());
app.use(cookieParser());



// Reset The States (Cache) To Default Values
mqttInstance.resetOnStartup();


// User Related API Routing
app.use('/auth', AuthRoutes);
app.use('/devices', DeviceRoutes);
app.use('/subscription', SubsRoutes);
app.use('/mqtt', MqttRoutes);
app.use('/code', CodeRoutes);
app.use('/controls', ControlRoutes)
app.use('/profile', ProfileRoutes);
app.use('/protected', ProtectedRoutes);





module.exports = {
sendToFrontend
}



server.listen(3001, () => {
    console.log(`Server running on http://localhost:3001`);
});


