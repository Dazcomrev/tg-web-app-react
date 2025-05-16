import { use, useEffect } from 'react';
import './App.css';
import { useTelegram } from './hooks/useTelegram';
import Header from "./components/Header/Header";
//import Button from './components/Button/Button';
import { Route, Routes } from 'react-router-dom';
import PlayerCard from './components/PlayerCard/PlayerCard';
import TeamCard from './components/TeamCard/TeamCard';
import ListTeams from './components/ListTeams/ListTeams';

function App() {
    const { onToggleButton, tg } = useTelegram();

    useEffect(() => {
        tg.ready();
    }, [])



    return (
        <div className="App">
            <Header></Header>
            <Routes>
                <Route path={'/TeamCard/:teamId/PlayerCard/:playerId'} element={<PlayerCard />}></Route>
                <Route path={'/TeamCard/:teamId'} element={<TeamCard />}></Route>
                <Route path={'/ListTeams'} element={<ListTeams />}></Route>
            </Routes>
        </div>
    );
}

export default App;
//