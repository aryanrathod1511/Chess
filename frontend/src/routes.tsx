import React from 'react';

import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';

import {Home} from './pages/Home';
import {GamePage} from './pages/GamePage';

const AppRoutes : React.FC = ()=> {
    return (
        <Router>
            <Router>
                <Route path="/" element={<Home/>}/>

                <Route path = "/game" element = {<GamePage/>}/>
            </Router>
        </Router>
    );
};

export default AppRoutes;