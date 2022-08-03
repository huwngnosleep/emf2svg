require('rootpath')()

var multer = require("multer");
var upload = multer();
const path = require("path");
const { v4: uuid } = require("uuid");
const fs = require('fs')
const base64Img = require('base64-img');
const _ = require('lodash');
const { dirname } = require('path');
let public = "public";
let uploadPath = "public/uploads";
let reportPath = "public/reports";
let video = "public/uploads/video";
let question = "public/uploads/question";
let image = "public/uploads/image";
let mp3 = "public/uploads/mp3";
let file = "public/uploads/file";

fs.existsSync(public) || fs.mkdirSync(public);
fs.existsSync(uploadPath) || fs.mkdirSync(uploadPath);
fs.existsSync(reportPath) || fs.mkdirSync(reportPath);
fs.existsSync(video) || fs.mkdirSync(video);
fs.existsSync(image) || fs.mkdirSync(image);
fs.existsSync(question) || fs.mkdirSync(question);
fs.existsSync(mp3) || fs.mkdirSync(mp3);
fs.existsSync(file) || fs.mkdirSync(file);
const UPLOAD_FIELD = {
    file: "file",
    image: "image",
}

const listAbsFilepath = {
    file: `${path.join(dirname(__dirname), "/public/uploads/file")}`,
    image: `${path.join(dirname(__dirname), "/public/uploads/image")}`,
};

const listPathSave = {
    file: "./public/uploads/file",
    image: "./public/uploads/image",
};

const fileNameCreators = {
    uuid: () => uuid(),

}

let storageUpload = multer.diskStorage({
    destination: function (req, file, cb) {
        if (listPathSave[file.fieldname]) {
            cb(null, listPathSave[file.fieldname]);
        } else {
            cb(new Error("FIELD NAME INCORRECT!!!"), null)
        }
    },
    filename: function (req, file, save) {
        let extension = getFileExtension(file)
        return save(null, `${fileNameCreators.uuid()}.${extension}`);
    },
});

const memoryStorage = multer.memoryStorage()
const uploadFileInMemory = multer({ storage: memoryStorage })

const uploadFile = multer({
    storage: storageUpload,
});

const getDownloadUrl = (file) => {
    if (file) {
        let path = file.destination.split('/').splice(2).join('/')
        return `/${path}/${file.filename}`
    }
    return null
}

const deleteFile = (downloadUrl) => {
    try {
        fs.unlink(`./public/${downloadUrl}`, () => { console.log("File Deleted!!!") })
    } catch (error) {
        console.log("Delete file error: ", error)
    }
}

const convertBase64ToImage = function (base64) {
    if (!base64) return null

    const [extensionStartIndex, extensionEndIndex] = [base64.indexOf("/") + 1, base64.indexOf(";")]
    let extension = extensionStartIndex > -1 ? base64.slice(extensionStartIndex, extensionEndIndex) : "png"
    // thư viện base64-img tự động chuyển jpeg thành jpg
    if (extension === "jpeg") {
        extension = "jpg"
    }
    const imageFolderPath = listPathSave.image
    const imageName = `${uuid()}`
    base64Img.imgSync(base64, imageFolderPath, imageName, function (err, filepath) {

        throw err
    });
    let savedPath = `${imageFolderPath}/${imageName}.${extension}`
    savedPath = savedPath.replace(/.\/public|\/public/, '')
    console.log(savedPath)
    return savedPath
}

function getFileExtension(file) {
    if (!file || !_.isString(file.originalname)) {
        return null
    }
    return file.originalname.split('.').pop()
}

module.exports = {
    uploadFile,
    getDownloadUrl,
    deleteFile,
    UPLOAD_FIELD,
    convertBase64ToImage,
    uploadFileInMemory,
    getFileExtension,
    fileNameCreators,
    listPathSave,
    listAbsFilepath,
}
