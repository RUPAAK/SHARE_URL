const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const colors = require('colors')
const path = require('path');
const hbs= require('hbs')



const app= express()


dotenv.config()

const fileRoutes = require('./routes/file.js')

const static_path= path.join(__dirname, './public')
const views_path= path.join(__dirname, './templates/views')

app.use(express.static(static_path))
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(fileRoutes)
app.use('/file', express.static('uploads/files'))

app.set('view engine', 'hbs')
app.set('views', views_path)


//dataabase
mongoose.connect(process.env.MONGO, {
    useCreateIndex: true, useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true
}).then(()=>{
    return console.log('CONNECTION TO DATABASE ESTABLISED'.green.bold)
}).catch((e)=>{
    return console.error(`ERROR- ${e.message}`.red.bold)
})


const PORT= process.env.PORT || 5000

app.listen(PORT, ()=>console.log(`SERVER UP AND RUNNING: ${PORT}`.green.bold))