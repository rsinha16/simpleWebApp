import * as React from 'react';
import { Router, Route, HistoryBase } from 'react-router';
import { Layout } from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import FetchData from './components/FetchData';
import Counter from './components/Counter';
import NavMenu from './components/NavMenu';
import { requireAuthentication } from './components/AuthenticatedComponent'

export default <Route component={ Layout }>
    <Route path='/' components={{ body: Home , nav: NavMenu}} />
    <Route path='/login' components={{ body: Login , nav: NavMenu }} />
    <Route path='/counter' components={{ body: Counter , nav: NavMenu }} />
    <Route path='/fetchdata' components={{ body: requireAuthentication(FetchData) , nav: NavMenu}}>
        <Route path='(:startDateIndex)' /> { /* Optional route segment that does not affect NavMenu highlighting */ }
    </Route>
</Route>;

// Enable Hot Module Replacement (HMR)
if (module.hot) {
    module.hot.accept();
}
