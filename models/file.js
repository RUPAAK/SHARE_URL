const express = require('express')
const mongoose = require('mongoose')

const fileSchema= mongoose.Schema({
    file: {type: String},
    uuid: {type: String}
}, {timeStamps: true})

const File= mongoose.model("File", fileSchema)

module.exports= File