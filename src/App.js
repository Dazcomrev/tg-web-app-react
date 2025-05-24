import { use, useEffect } from 'react';
import './App.css';
import { useTelegram } from './hooks/useTelegram';
import Header from "./components/Header/Header";
//import Button from './components/Button/Button';
import { Route, Routes } from 'react-router-dom';
import PlayerCard from './components/PlayerCard/PlayerCard';
import TeamCard from './components/TeamCard/TeamCard';
import ListTeams from './components/ListTeams/ListTeams';
import EditData from './components/EditData/EditData';
import Team from './components/EditData/EditTeam/EditTeam';
import Player from './components/EditData/EditPlayer/EditPlayer';
import Competition from './components/EditData/EditCompetition/EditCompetition';
import Match from './components/EditData/EditMatch/EditMatch';
import { useNavigate } from 'react-router-dom';

function App() {
    const { onToggleButton, tg } = useTelegram();
    const navigate = useNavigate();

    useEffect(() => {
        tg.ready();
    }, [])

    const handleClick = () => {
        navigate(`/ListTeams`);
    };

    return (
        <div className="App">
            <Header></Header>
            <Routes>
                <Route path={'/TeamCard/:teamId/PlayerCard/:playerId'} element={<PlayerCard />}></Route>
                <Route path={'/TeamCard/:teamId'} element={<TeamCard />}></Route>
                <Route path={'/ListTeams'} element={<ListTeams />}></Route>
                <Route path={'/EditData/EditMatch'} element={<Match />}></Route>
                <Route path={'/EditData/EditCompetition'} element={<Competition />}></Route>
                <Route path={'/EditData/EditPlayer'} element={<Player />}></Route>
                <Route path={'/EditData/EditTeam'} element={<Team />}></Route>
                <Route path={'/EditData'} element={<EditData />}></Route>
                <Route path={'/'} element={<button onClick={handleClick}>Список команд</button>}></Route>
            </Routes>
        </div>
    );
}

export default App;