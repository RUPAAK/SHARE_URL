const express = require('express')
const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const File = require('../models/file.js')
const route = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/files')
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}_${Date.now()}_${Math.random()*100+1}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storage, limits: 1000000*100})

route.get('/', (req, res)=>{
    res.render('index')
})

route.post('/file', upload.single('file'), async(req, res) => {
    try {
        const file= new File({
            file: req.file.filename, uuid: uuidv4()
        })
        const savedFile= await file.save();
        res.render('downloadSend', {
            url: {
                downloadUrl: `${process.env.APP_URL}/${file.uuid}`
            }
        })
    } catch (error) {
        res.status(400)
        res.json(error)
    }
})

route.get('/file/:id', async(req, res)=>{
    try {
        const file= await File.findOne({uuid: req.params.id})
        res.render('downloadHere', {
            url: `${process.env.APP_URL}/file/${file.uuid}`
        })
    } catch (error) {
        res.send(error)
    }
    
})
route.get('/file/file/:id', async(req, res)=>{
    const file= await File.findOne({uuid: req.params.id})
    const filePath= `${__dirname}/../uploads/files/${file.file}`
    res.download(filePath)

})

module.exports= route