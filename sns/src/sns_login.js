import React, {Component} from 'react'
import request from 'superagent'
import {Redirect} from 'react-router-dom'
import styles from './styles'


// 로그인 화면 컴포넌트
export default class SNSLogin extends Component {
    constructor (props) {
        super (props)
        this.state = { userid: '', passwd: '', jump: '', msg: ''}
    }

    // API를 호출하고 응답받은 토큰을 localStorage에 저장
    // 서버에 ID와 비밀번호를 전송한 후에 로그인 성공하면, ID와 토큰을 localStorage에 저장.
    // localStorage는 웹 브라우저가 관리하는 local PC 내부의 저장소 영역.
    api (command) {
        request
            .get('/api/' + command)
            .query({
                userid: this.state.userid,
                passwd: this.state.passwd
            })
            .end((err, res) => {
                if (err) return
                const r = res.body
                console.log(r)
                if (r.status && r.token) {
                    window.localStorage['sns_id'] = this.state.userid
                    window.localStorage['sns_auth_token'] = r.token
                    this.setState({jump: '/timeline'})
                    return
                }
                this.setState({msg: r.msg})
            })
    }
    render () {
        if (this.state.jump) {
            return <Redirect to={this.state.jump} />
        }
        const changed = (name , e) => {
            this.setState({[name]: e.target.value})
        }
        return (
            <div>
                <h1>로그인</h1>
                <div style={styles.login}>
                    사용자 ID:<br />
                    <input value={this.state.userid}
                        onChange={e => changed('userid', e)} /><br />
                    비밀번호:<br />
                    <input type='password' value={this.state.passwd}
                        onChange={e => changed('passwd', e)} /><br />
                    <button onClick={e => this.api('login')}>로그인</button><br />
                    <p style={styles.error}>{this.state.mgs}</p>
                    <p><button onClick={e=> this.api('addUser')}>
                        사용자 등록</button></p>
                </div>
            </div>
        )
    }
}