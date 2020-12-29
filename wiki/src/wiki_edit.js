import React, {Component} from 'react'
import request from 'superagent'
import {Redirect} from 'react-router-dom'
import styles from './styles'

// 편집 화면 컴포넌트
//export 선언을 붙여야, 다른 파일에서 import로 읽어들일 수 있음
export default class WikiEdit extends Component {
    // 웹 브라우저에서 '/wiki/:name'로 쳤을 때의 name이 this.props.match.name 으로 들어오는데, 이를 const name으로 저장
    constructor (props) {
        super(props)
        const {params} = this.props.match
        const name = params.name //
        this.state = {
            name, body: '', loaded: false, jump: ''
        }
    }

    // 컴포넌트가 마운트되기 직전에 실행되는 메서드.
    // SuperAgent 비동기 통신으로 서버의 API에 접근해서 위키의 내용을 추출
    componentWillMount() {
        request
            .get(`/api/get/${this.state.name}`)
            .end((err, res) => {
                if (err) return
                this.setState({
                    body: res.body.data.body,
                    loaded: true
                })
            })
    }

    // 편집한 텍스를 서버 API에 POST로 요청
    // SuperAgent를 사용해 위키 이름(name)과 본문(body)을 전송.
    save () {
        const wikiname = this.state.name
        request
            .post('/api/put/' + wikiname)
            .type('form')
            .send({
                name: wikiname,
                body: this.state.body
            })
            .end((err, data) => {
                if (err) {
                    console.log(err)
                    return
                }
                // 정상적으로 요청이 완료되면, state의 jump에 위키 출력 전용 URL을 설정.
                this.setState({jump: '/wiki/' + wikiname})
            })
    }

    // 편집 화면을 출력
    bodyChanged (e) {
        this.setState({body: e.target.value})
    }

    render () {
        // loaded가 true가 될 때까지 편집 화면을 출력하지 않음
        if (!this.state.loaded) {
            return (<p>읽어 들이는 중</p>)
        }
        // jump에 값이 들어가 있다면, 거기로 Redirect!
        if (this.state.jump !== '') {
            return (<Redirect to={this.state.jump} />)
        }
        const name = this.state.name
        return (
            <div style={styles.edit}>
                <h1><a href={`/wiki/${name}`}>{name}</a></h1>
                <textarea rows={12} cols={60}
                    onChange={e => this.bodyChanged(e)}
                    value={this.state.body} /><br />
                <button onClick={e => this.save()}>저장</button>
            </div>
        )
    }
}