// react 채팅 클라이언트 코드

import React from 'react'
import ReactDOM from 'react-dom'
import styles from './styles.js'

// Socket.IO로 웹 소켓 서버에 접속한다.
// 클라이언트의 모듈 이름은 "socket.io"가 아니고 "socket.io-slcient"이다.
import socketio from 'socket.io-client'
const socket = socketio.connect('http://localhost:3000')
let today = new Date();
let hours = today.getHours(); // 시
let minutes = today.getMinutes();  // 분
let seconds = today.getSeconds();  // 초
let milliseconds = today.getMilliseconds(); // 밀리초
console.log(hours + '시 ' + minutes + '분 ' + seconds + '초 ' + milliseconds);

console.log('[클라] 클라이언트가 소켓 연결을 시도함!')



// 입력 양식 컴포넌트
class ChatForm extends React.Component {
    // 이 컴포넌트에서는 name과 message라는 2개의 input 요소를 사용한다.
    // 그래서 아래 constructor() 메서드 내부에서 2개의 상태를 초기화한다.
    constructor (props) {
        super(props)
        this.state = { name: '', message: ''}
    }

    nameChanged (e) {
        this.setState({name: e.target.value})
    }

    messageChanged(e) {
        this.setState({message: e.target.value})
    }

    // 전송 버튼을 클릭했을 때의 처리 내용
    send () {
        // 서버에 이름과 메시지 전송
        // 'chat-msg'는 클라이언트와 서버가 서로 약속한대로 보내면 된다.
        socket.emit('chat-msg', {
            name: this.state.name,
            message: this.state.message
        })
        let today = new Date();
        let hours = today.getHours(); // 시
        let minutes = today.getMinutes();  // 분
        let seconds = today.getSeconds();  // 초
        let milliseconds = today.getMilliseconds(); // 밀리초
        console.log(hours + '시 ' + minutes + '분 ' + seconds + '초 ' + milliseconds);
        
        console.log('[클라] 메시지 전송')
        this.setState({message: ''})
    }

    render () {
        return (
            <div style={styles.form}>
                이름: <br />
                <input value={this.state.name}
                    onChange={e => this.nameChanged(e)} /><br />
                메시지: <br />
                <input value={this.state.message}
                    onChange={e => this.messageChanged(e)} /><br />
                <button onClick={e => this.send()}>전송</button>
            </div>
        )
    }
}


// 채팅 애플리케이션의 메인 컴포넌트를 정의
class ChatApp extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            logs: []
        }
    }

    // 컴포넌트가 마운트됐을 때
    componentDidMount () {
        // 실시간으로 로그를 받게 설정
        socket.on('chat-msg', (obj) => {
            const logs2 = this.state.logs
            obj.key = 'key_' + (this.state.logs.length + 1)
            let today = new Date();
            let hours = today.getHours(); // 시
            let minutes = today.getMinutes();  // 분
            let seconds = today.getSeconds();  // 초
            let milliseconds = today.getMilliseconds(); // 밀리초
            console.log(hours + '시 ' + minutes + '분 ' + seconds + '초 ' + milliseconds);
            
            console.log('[클라] 메시지를 컴포넌트에 넣는다', obj)
            logs2.unshift(obj) // 로그에 추가한다.
            this.setState({logs:logs2})
        })
    }

    render() {
        // 로그를 이용해 HTML 요소 생성
        const messages = this.state.logs.map( e => (
            <div key={e.key} style={styles.log}>
                <span style={styles.name}>{e.name}</span>
                <span style={styles.msg}>: {e.message}</span>
                <p style={{clear: 'both'}} />
            </div>
        ))

        return (
            <div>
                <h1 style={styles.h1}>실시간 채팅</h1>
                <ChatForm />
                <div>{messages}</div>
            </div>
        )
    }
}

// DOM의 내용을 메인 컴포넌트로 변경
ReactDOM.render(
    <ChatApp />,
    document.getElementById('root')
)