import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import Pusher from 'pusher'
import dbModel from './dbModel.js';


//app config
const app = express();
const port = process.env.PORT || 8080


const pusher = new Pusher({
    appId: "1237227",
    key: "f63b3daf6e65fb5f630e",
    secret: "a17876d79a52db9d381f",
    cluster: "ap2",
    useTLS: true
});

//middlewares
app.use(express.json());
app.use(cors());

const connection_url = "mongodb://admin:qpyHFAHrjRlERdzh@cluster0-shard-00-00.ixg1x.mongodb.net:27017,cluster0-shard-00-01.ixg1x.mongodb.net:27017,cluster0-shard-00-02.ixg1x.mongodb.net:27017/InstaDB?ssl=true&replicaSet=atlas-g5xgl0-shard-0&authSource=admin&retryWrites=true&w=majority"

mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.once('open', () => {
    console.log('DB Connected');

    const changeStream = mongoose.connection.collection('post').watch()

    changeStream.on('change', (change) => {
        console.log('Change triggered on pusher...')
        console.log(change)
        console.log('End of change')

        if (change.operationType == 'insert') {
            console.log('triggering Pusher Img upload')

            const postDetails = change.fullDocument;
            pusher.trigger('posts', 'inserted', {
                user: postDetails.user,
                caption: postDetails.caption,
                image: postDetails.image
            })
        } else {
            console.log('Unknown trigger from pusher')
        }
    })
})

//api routes
app.get("/", (req, res) => res.status(200).send("hello world"));

app.post('/upload', (req, res) => {
    const body = req.body;

    dbModel.create(body, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    });
});

app.get('/sync', (req, res) => {
    dbModel.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    });
})

//listen
app.listen(port, () => console.log(`listening on localhost:${port}`));