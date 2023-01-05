require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer')

var upload = multer({ dest: 'uploads/' });

var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use('/public', express.static(process.cwd() + '/public'));

// connect to the database
mongoose.set('strictQuery', false)
mongoose.connect('mongodb+srv://parmenide:jesus123@fccmongoose.srblnut.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })

// create a schema
const urlSchema = new mongoose.Schema({
  original_url: String,
  short_url: Number
})

// create a model
const Url = mongoose.model('Url', urlSchema)

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// You can submit a form that includes a file upload.
// The form file input field has the name attribute set to upfile.
// When you submit a file, you receive the file name, type, and size in bytes within the JSON response.
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {

  // handle multer error
  if (req.fileValidationError) {
    return res.send(req.fileValidationError)
  }

  if (req.file == undefined) {
    res.json({ error: 'No file uploaded' })
    
  } else {

    res.json({
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size
    })
  }
})


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
