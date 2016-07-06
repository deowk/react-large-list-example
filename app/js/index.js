import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import routes from './bootstrap/routes';
import { createHistory } from 'history';
const appHistory = createHistory();

ReactDOM.render(
    <Router history={appHistory} routes={routes} />,
    document.getElementById('root')
);
