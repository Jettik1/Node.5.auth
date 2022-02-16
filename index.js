require('dotenv').config()
const PORT = process.env.PORT || 5002

const express = require('express');

const mongoose = require('mongoose')

const router = require('./authRouter')

 
const app = express();

app.use(express.json());
app.use('/auth', router)


const start = async () => {
    try {
        app.listen(PORT, () => console.log(`server started on ${PORT} Port`))
        await mongoose.connect('mongodb+srv://Jettik1:AdminPassword@jettik1cluster.qqwhp.mongodb.net/mySecondDatabase?retryWrites=true&w=majority')
    } catch (e) {
        console.log(e)
    }
}

start();