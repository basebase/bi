import React from 'react'
import ReactDOM from 'react-dom'

import { AppContainer } from 'react-hot-loader'
import { applyMiddleware, compose, createStore } from 'redux'
import { createBrowserHistory } from 'history'
import { routerMiddleware, connectRouter } from 'connected-react-router'
import { Provider } from 'react-redux'

import rootReducer from './reducers'
import R from './r'

const history = createBrowserHistory()
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
    connectRouter(history)(rootReducer),
    composeEnhancer(
        applyMiddleware(
            routerMiddleware(history),
        ),
    ),
)

const render = () => {
    ReactDOM.render(
        <AppContainer>
            <Provider store={ store }>
                <R history={history} />
            </Provider>
        </AppContainer>, document.getElementById('app')
    )
}

render()

// Hot reloading
if (module.hot) {
    // Reload components
    module.hot.accept('./r', () => {
        render()
    })

    // Reload reducers
    module.hot.accept('./reducers', () => {
        store.replaceReducer(connectRouter(history)(rootReducer))
    })
}



// ReactDOM.render(<h1>dasdasdasdas</h1>, app)
// module.hot.accept();