import React from 'react'
import ReactDOM from 'react-dom'
import {
    BrowserRouter as Router,
    Route, Switch
} from 'react-router-dom'

import WikiEdit from './wiki_edit'
import WikiShow from './wiki_show'

// React Router를 사용해서 접근한 URL에 따라 출력 컴포넌트를 변경
// :name이 component property (props.match.params.name)에 저장된다.
const WikiApp = () => {
    return (
        <Router>
        <div>
            <Route path='/wiki/:name' component={WikiShow} />
            <Route path='/edit/:name' component={WikiEdit} />
        </div>
        </Router>
    )
}

ReactDOM.render(
    <WikiApp />,
    document.getElementById('root')

)