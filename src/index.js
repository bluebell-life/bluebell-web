import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Router} from "react-router-dom";
import {createBrowserHistory} from "history";
import Modal from 'react-modal';

import App from './App';
import * as serviceWorker from './serviceWorker';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/scss/style.scss';
import 'react-toastify/dist/ReactToastify.css';
import 'reactjs-popup/dist/index.css';
import './App.css';

Modal.setAppElement('#root')
Modal.defaultStyles.overlay.backgroundColor = 'rgba(0,0,0,0.2)';
Modal.defaultStyles.overlay.zIndex = 11;
Modal.defaultStyles.content = {
    ...Modal.defaultStyles.content,
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
}

const history = createBrowserHistory();

ReactDOM.render(
    <BrowserRouter history={history}>
        <App/>
    </BrowserRouter>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
