import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'


// 리액트 라우터를 이용해서 메인 컴포넌트를 정의한다.
// <Router> 컴포넌트를 사용해 어떤 경로일 때 어떤 컴포넌트를 출력할지 지정한다.
// 라우터를 이용하면, 경로와 컴포넌트 지정을 한 곳에서 처리하므로 개발이 편해진다.
const HelloApp = () => {
    return (
        <Router>
            <div style={{margin: 20}}>
                <Route exact path='/' component={Home} />
                <Route path='/ko' component={HelloKorean} />
                <Route path='/en' component={HelloEnglish} />
            </div>
        </Router>
    );
}

// 여기 아래에서부터는 각 페이지를 출력할 컴포넌트를 정의한다.
const Home = () => {
    return (
        <div>
        <h1>Hello App</h1>
        <p>언어를 선택해주세요.</p>
        <ul>
            <li><a href='/ko'>한국어</a></li>
            <li><a href='/en'>영어</a></li>
        </ul>
    </div>
    )

}

const HelloKorean = () => {
    return (
        <div>
        <h1>안녕하세요</h1>
        <p><a href='/'>뒤로가기</a></p>
    </div>
    )
}

const HelloEnglish = () => {
    return (
        <div>
        <h1>Hello</h1>
        <p><a href='/'>Back</a></p>
    </div>
    )
}

export default HelloApp