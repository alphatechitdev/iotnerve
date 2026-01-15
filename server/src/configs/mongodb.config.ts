import {MongoClient, ServerApiVersion} from 'mongodb';


const client = new MongoClient(process.env.mongoURI as string, {
    serverApi: {
        version:ServerApiVersion.v1,
        strict:true,
        deprecationErrors:true
    }
});




async function connectDB () {
    try {
        await client.connect();
        console.log("Connected To MongoDB");
        return client.db("iotHub");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);

    }
};


export default connectDB;

