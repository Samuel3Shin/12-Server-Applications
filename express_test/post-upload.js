const express = require('express')
const app = express()

// 파일을 업로드할 때 필요한 모듈
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const tmpDir = path.join(__dirname, 'tmp')
const pubDir = path.join(__dirname, 'pub')

// multer를 통해 업로드되는 모든 파일은 일단 tmpDir로 간다
const uploader = multer({dest: tmpDir})

app.listen(3000, () => {
    console.log('서버 실행 완료 - http://localhost:3000')
})

// 업로드 양식을 html로 출력한다.
app.get('/', (req, res) => {
    res.send(
        '<form method="POST" action="/" enctype="multipart/form-data">' +
        '<input type="file" name="aFile" /><br />' +
        '<input type="submit" value="업로드" />' +
        '</form>'
    )
})

app.use('/pub', express.static(pubDir))

app.post('/', uploader.single('aFile'), (req, res) => {
    console.log('파일을 받았습니다.')
    console.log('원본 저장 파일 이름:', req.file.originalname)
    console.log('저장된 경로:', req.file.path)

    // MIME으로 파일의 형식을 확인한다
    if(req.file.mimetype !== 'image/png') {
        res.send('PNG 이미지만 업로드할 수 있습니다.')
        return
    }

    // 위에서 이미지가 아니면 return을 하는데,
    // 이미지라면 /pub 디렉토리로 옮긴다.
    const fname = req.file.filename + '.png'
    const des = pubDir + '/' + fname

    fs.renameSync(req.file.path, des)
    
    res.send('다음과 같이 파일이 업로드 됐습니다.<br/>' + 
        `<img src="/pub/${fname}" />`)

})