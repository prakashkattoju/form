const mysql = require('mysql');
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'meeters_react'
  });
  
  connection.connect((err) => {
      if(err) throw err;
      console.log('Connected to MySQL Server!');
  });

function slugify(text) {
    return text.toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/client/public/uploads/`);
    },
    filename: (req, file, cb) => {
        cb(null, slugify(path.parse(file.originalname).name) + path.parse(file.originalname).ext);
    }
});
const upload = multer({ storage });

const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const mediaUpload = upload.fields([
    { name: 'media', maxCount: 10 }
])

app.post('/register', mediaUpload, function (req, res) {
    try {
        const dat = req.body['dat'];
        const vnm = req.body['vnm'];
        const aco = req.body['aco'];
        const plc = req.body['plc'];
        const evt = req.body['evt'];
        const onm = req.body['onm'];
        const mla = req.body['mla'];
        const gco = req.body['gco'];
        const tto = req.body['tto'];
        const ven = req.body['ven'];

        const media_array = req.files['media'];
        const media = media_array.map(reg => reg.filename).join(',');

        connection.query('INSERT INTO registrations (dat, vnm, aco, plc, evt, onm, mla, gco, tto, ven, media) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [dat, vnm, aco, plc, evt, onm, mla, gco, tto, ven, media],(error, results) => {
            if (error) {
                throw error
            }
            return res.status(200).json({ status: true, insertId: results.insertId });
        });

    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/entry/:id', function (req, res) {
    const id = parseInt(req.params.id)
    connection.query('SELECT * FROM registrations WHERE rid = ?', [id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results)
    })
})

////////////////////////////////////////////////////////////////////////////////////////////

app.listen(5000, () => {
    console.log("Sever is now listening at port 5000");
})