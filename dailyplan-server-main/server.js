const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const cors = require('cors')
const PDFDocument = require('pdfkit');
const fs = require('fs');
const {createWriteStream} = require('fs');
const {Storage} = require('@google-cloud/storage');
const path = require("path");
const download = require('download')

const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

const db = mysql.createConnection({
    // socketPath: "/cloudsql/dailyplan-318514:us-central1:daily-plan",
    host: '34.136.17.35',
    user: 'sauhard',
    password: 'password',
    database: 'dailyplan'
});
const gc = new Storage({
    keyFilename: path.join(__dirname, "/dailyplan-318514-aa275daecc6c.json"),
    projectId: 'dailyplan-318514'
})

const pdfFilesBucket = gc.bucket('pdffile-gen');

app.post('/generate/pdf', (req, res) => {

    const date = req.body.date
    const from_date = req.body.from_date
    const to_date = req.body.to_date
    const clas_s = req.body.clas_s
    const day = req.body.day
    const id = req.body.id_1
    const form = req.body.form
    const extra = req.body.extra

    const doc = new PDFDocument();
    // const blob = new Blob;
    // const stream = doc.pipe(blobStream());

    doc.pipe(pdfFilesBucket.file(`output${id}.pdf`).createWriteStream());
    doc.pipe(res)

    doc.fontSize(20);
    doc.text('Weekly Online Learning Schedule', {
        align: 'center'
    })
    doc.fontSize(15);

    doc.text(`Date - ${from_date} to ${to_date}` , {
        lineBreak: true,
        align: 'center'
    })
    
    doc.text(`Class ${clas_s}`, {
        lineBreak: true,
        align: 'center'
    })
    doc.text(`${day} ${date}`, {
        lineBreak: true,
        align: 'center'
    })

    doc.fontSize(12);
    doc.moveDown(2);
    {
        form.map(form => (
            doc.text(`Period ${form.period} Subject - ${form.subject} [Mr. ${form.teacher}] Ph. No. ${form.phone}`, {
                align: 'left',
                lineBreak: true
            }).text(` Zoom Interactive Class (Chapter - ${form.chapter} Topic - ${form.topic}`, {
                align:'left'
            }).moveDown(2)
        ))
    }

    doc.moveDown(2)
    doc.text('5:00 PM - 6:00 PM - Self Study', {
        align: 'center'
    })
    doc.moveDown(2);
    {
        extra.map(extra => (
            doc.text(`Sub ${extra.id} : ${extra.subject}`, {
                align: 'left',
                lineBreak: true
            })
        ))
    }

    doc.moveDown(2)
    doc.text('Note: In each period Teacher will be available on phone after Zoom interactive class/tutorial video, till the period ends. Feel free to interact through text/voice messaging or calling the teacher.', {
        align: 'left'
    })
    doc.end()
})

app.get('/download/pdf', (req,res) => {
    const file = pdfFilesBucket.file(`output5368.pdf`)

    // file.download({
    //     destination: `your_file5368.pdf`
    // })
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'inline;filename=yolo.pdf')
    res.download(file)

    
})
app.get('/isworking', (req,res)=> {
    console.log("working")
    const query = "select * from period_details"

    db.query(query,(err,result) => {
        res.send(result)
    } )
})
app.post('/period_details/insert', (req, res) => {
    const date = req.body.date
    const period_number = req.body.period_number
    const subject = req.body.subject
    const teacher = req.body.teacher
    const phone = req.body.phone
    const topic = req.body.topic

    const sqlQuery = "INSERT INTO period_details (date, period_number, subject, teacher, phone,topic) VALUES (?,?,?,?,?,?)"

    db.query(sqlQuery, [date, period_number, subject, teacher, phone, topic], (err, result) => {
        console.log(err)
    })
})

app.post('/form_details/insert', (req, res) => {
    const from_date = req.body.from_date
    const to_date = req.body.to_date
    const clas_s = req.body.clas_s
    const date = req.body.date
    const day = req.body.day

    const sqlQuery = "INSERT INTO form_detail ( from_date,to_date, clas_s, date, day ) VALUES (?,?,?,?,?)"

    db.query(sqlQuery, [from_date, to_date, clas_s, date, day], (err, result) => {
        console.log(err)
    })

    console.log("done")
})

app.listen(8080, () => {
    console.log('server is up on port 8080')
})