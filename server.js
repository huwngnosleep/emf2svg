const express = require("express");
const app = express();
const requestIp = require("request-ip");
var cors = require('cors');
const path = require('path')
const fs = require('fs')
const { exec } = require("child_process");
var parseString = require('xml2js').parseString;
const { uploadFile, UPLOAD_FIELD, getFileExtension, listAbsFilepath, listPathSave } = require('./uploadFile')
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Expose-Headers', 'Access-Control-*, Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-*, Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);

    // res.header("Access-Control-Allow-Origin", '*');
    // res.header("Access-Control-Allow-Credentials", true);
    // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
    // res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
    express.urlencoded({
        limit: "50mb",
        extended: true,
    })
);
app.use(requestIp.mw());

function getMathTag(xml, parsedMath = []) {
    if (!xml) return parsedMath
    const startIndex = xml.indexOf("<mml:math")

    if (startIndex > -1) {
        const endIndex = xml.indexOf("</mml:math>")

        const math = xml.slice(startIndex, endIndex + 11)
        parsedMath.push(math.replace(/mml:/g, ''))

        getMathTag(xml.slice(endIndex + 11), parsedMath)
    }

    return parsedMath
}

app.post('/convert', uploadFile.single(UPLOAD_FIELD.file), async function (req, res, next) {
    try {
        console.log(req.file)
        const { file } = req
        exec(`.\\calabash\\calabash.bat -o result=test.xml .\\docx2hub\\xpl\\docx2hub.xpl docx=${file.path}`, (error, stdout, stderr) => {
            if (error) {
                throw error
            }

            const savedPath = `${listPathSave.file}/${file.filename}.xml`
            fs.readFile('test.xml', 'utf8', function (err, data) {
                const maths = getMathTag(data)
                console.log(maths)
                res.send({ status: true, maths })
            });

        });

    } catch (error) {
        res.send({ status: false, message: "ERROR HAPPENED" })
    }
})

app.post('/convert/emf2svg', uploadFile.single(UPLOAD_FIELD.file), async function (req, res, next) {
    try {
        console.log(req.file)
        const { file } = req
        exec(`./libemf2svg/emf2svg-conv -i ${file.path} -o ${listPathSave.image}/${file.filename}.svg`, (error, stdout, stderr) => {
            if (error) {
                throw error
            }
            res.send({ status: true })
        });

    } catch (error) {
        res.send({ status: false, message: "ERROR HAPPENED" })
    }
})


app.get("/", async (req, res, next) => {

    res.send({
        status: true,
        message: "Docx convert worker is running",
    });
});

const port = 7750
const server = require("http").createServer(app);
server.listen(port);
console.log(`server start on local: ${port}`);