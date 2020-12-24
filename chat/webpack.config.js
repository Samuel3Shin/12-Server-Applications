// 웹팩을 이용한 컴파일과 관련된 설정
// 아래 스크립트로 빌드를 하면 /src/index.js의 리액트 프로그램을 웹팩으로 변환해서 /public/bundle.js에 저장한다.

const path = require('path')
module.exports = {
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    }
}