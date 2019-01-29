import React from 'react'
import ReactDOM from "react-dom";
import MainContainer from './main.js'
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faTimesCircle, faFilter, faPalette, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import Reducers from './redux/reducers';
import 'antd/dist/antd.css';
import './style/index.scss'

library.add(faPlus, faTimesCircle, faFilter, faPalette, faInfoCircle)

const middleware = applyMiddleware(thunk);
const store = createStore(Reducers, middleware);

export default ReactDOM.render(<Provider store={store}>
    <MainContainer />
</Provider>, document.getElementById("app"))