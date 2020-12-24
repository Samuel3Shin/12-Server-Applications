// react로 이뤄진 클라이언트 프로그램

import React from 'react'
import ReactDOM from 'react-dom'

// 웹 서버와의 Ajax 통신을 위한 모듈
import request from 'superagent'

// 게시판 입력 양식 컴포넌트를 정의한다.
class BBSForm extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            name: '',
            body: ''
        }
    }

    // 텍스트 박스의 값이 변경되었을 경우의 처리
    nameChanged (e) {
        this.setState({name: e.target.value})
    }
    bodyChanged (e) {
        this.setState({body: e.target.value})
    }

    // 전송 버튼을 클릭했을 때의 post 메서드
    post(e) {
        // URL 매개변수를 추가해서 /api/write 메서드를 호출한다.
        request
            .get('/api/write')
            .query({
                name: this.state.name,
                body: this.state.body
            })
            .end((err, data) => {
                if(err) {
                    console.error(err)
                }
                this.setState({body: ''})
                if (this.props.onPost) {
                    this.props.onPost()
                }
            })
    }

    render () {
        return (
            <div style={styles.form}>
                이름:<br />
                <input type='text' value={this.state.name}
                    onChange={e => this.nameChanged(e)} /><br />
                본문:<br />
                <input type='text' value={this.state.body} size='60'
                    onChange={e => this.bodyChanged(e)} /><br />
                <button onClick={e => this.post()}>전송</button>
            </div>
        )
    }
}

// 메인 컴포넌트 정의
class BBSApp extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            items: []
        }
    }

    // 컴포넌트가 마운트되면 로그를 읽어들인다.
    componentWillMount() {
        this.loadLogs()
    }

    // 웹서버 api에 접근해서 게시글 목록을 가져온다.
    loadLogs () {
        request
            .get('/api/getItems')
            .end((err, data) => {
                if (err) {
                    console.error(err)
                    return
                }
                // 결과를 응답받으면 setState로 item에 값을 넣는다.
                this.setState({items: data.body.logs})
            })
    }

    render () {

        // 게시판 글을 생성한다.
        const itemsHtml = this.state.items.map(e => (
            <li key={e._id}>{e.name} - {e.body}</li>
        ))

        return (
            <div>
                <h1 style={styles.h1}>게시판</h1>
                <BBSForm onPost={e => this.loadLogs()} />
                <p style={styles.right}>
                    <button onClick={e => this.loadLogs() }>
                        다시 불러오기 </button></p>
                    <ul>{itemsHtml}</ul>
            </div>
        )
    }
}

// 스타일 정의
const styles = {
    h1: {
        backgroundColor: 'blue',
        color: 'white',
        fontSize: 24,
        padding: 12
    },

    form: {
        padding: 12,
        border: '1px solid silver',
        backgroundColor: '#F0F0F0'
    },
    right: {
        textAlign: 'right'
    }
}

// DOM의 내용을 메인 컴포넌트로 변경한다.
ReactDOM.render(
    <BBSApp />,
    document.getElementById('root')
)
