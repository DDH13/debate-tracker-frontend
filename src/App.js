import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import {theme} from './theme.js';

import Menu from './components/Menu.js';
import Debaters from './components/Debaters.js';
import SpeakerGraphs from "./components/SpeakerGraphs.js";
import MasterTab from "./components/MasterTab.js";
import Institutions from "./components/Institutions.js";
import Judges from "./components/Judges.js";
import JudgeTab from "./components/JudgeTab.js";
import JudgeSentiments from "./components/JudgeSentiments.js";


const App = () => {
    return (
        <Router>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Menu />
                <Routes>
                    <Route path="/master-tab" element={<MasterTab/>} />
                    {/* <Route path="/debaters" element={<Debaters />} /> */}
                    {/* <Route path="/institutions" element={<Institutions />} /> */}
                    <Route path="/graphs" element={<SpeakerGraphs />} />
                    <Route path="/judge-tab" element={<JudgeTab/>}/>
                    {/* <Route path="/judge" element={<Judges />} /> */}
                    <Route path="/judge-sentiments" element={<JudgeSentiments/>} />
                </Routes>
            </ThemeProvider>
        </Router>
    );
};

export default App;
