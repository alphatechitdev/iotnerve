import express from 'express';


const app = express();







app.listen(process.env.PORT_NO || 3000, () => {
    console.log("App Listening On Port: ", process.env.PORT_NO || 3000);
})