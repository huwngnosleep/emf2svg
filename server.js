const express = require("express");
const app = express();
const requestIp = require("request-ip");
var cors = require('cors');
const path = require('path')
const fs = require('fs')
const { exec } = require("child_process");
const constants = require('./global/constants');

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

app.get("/", async (req, res, next) => {

    res.send({
        status: true,
        message: "service emf2svg is running",
    });
});

app.get('/health', (req, res) => {
    const data = {
      uptime: process.uptime(),
      message: 'Ok'
    }
  
    res.status(200).send(data);
});

app.post('/convert/emf2svg', uploadFile.single(UPLOAD_FIELD.file), async function (req, res, next) {
    try {
        console.log(req.file)
        const { file } = req
        const output = `${listPathSave.image}/${file.filename}.svg`
        exec(`./libemf2svg/emf2svg-conv -i ${file.path} -o ${output}`, (error, stdout, stderr) => {
            if (error) {
                throw error
            }

            res.send({ status: true, path: constants.PATH_SVG + output.split('/').slice(2).join('/') })
        });

    } catch (error) {
        res.send({ status: false, message: "ERROR HAPPENED" })
    }
})

const port = constants.PORT;
console.log("ENVIRONMENT", constants.NODE_ENV)
const server = require("http").createServer(app);
server.listen(port);
console.log(`server start on ${constants.BASE_URL}`);
