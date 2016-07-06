import React from 'react';
import { Route, IndexRoute } from 'react-router';
import  App from './app';

import ExampleView from '../views/example-view';

module.exports = (
    <Route path='/' component={App}>
        <IndexRoute component={ExampleView} />
    </Route>
);
