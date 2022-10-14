const express = require("express");
const AWS = require("aws-sdk");
const multer = require('multer');
const { application } = require("express");

const app = express();

application.use(express.static('./templates'))
app.set('view engine', 'ejs')
app.set('views', './templates')

const config = new AWS.Config({
    accessKeyId: 'AKIAXOZL4NJ324FPX3XE',
    secretAccessKey: '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',
    region: 'ap-southeast-1'
})

AWS.config = config;

const tableName = 'Tour'
const load = multer();
const docClient = new AWS.DynamoDB.DocumentClient()

app.get('/', (req, res) => {
    const params = {
        TableName: tableName,
    }

    docClient.scan(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.render('table', { data: data.Items })
        }
    })
})

app.get('/create', (req, res) => {
    return res.render('form')
})

app.post('/create', load.fields([]), (req, res) => {
    const { maTour, tenTour, theLoai, thoiGian, gia, ghiChu } = req.body;
    const params = {
        TableName: tableName,
        Item: {
            'maTour': Number(maTour),
            'tenTour': tenTour,
            'theLoai': theLoai,
            'gia': Number(gia),
            'thoiGian': thoiGian,
            'ghiChu': ghiChu
        }
    }
    docClient.put(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    })
})

app.post('/delete', load.fields([]), (req, res) => {
    const { maTour } = req.body;
    const params = {
        TableName: tableName,
        Key: {
            'maTour': Number(maTour),
        }
    }
    docClient.delete(params, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/');
        }
    })
})

app.listen(8080);