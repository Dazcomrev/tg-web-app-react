import React, { useEffect, useState } from 'react';
import './TeamCard.css';
import { useNavigate } from 'react-router-dom';
import '../Button/Button.css';
import Header from '../Header/Header';
import { useParams } from 'react-router-dom';

const PlayerItem = ({ player, teamId }) => {
    const navigate = useNavigate();

    /*
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    ДОБАВИТЬ СЧИТЫВАНИЕ TG USER ID В ЛОГИ
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    */

    const handleClick = () => {
        navigate(`/TeamCard/${teamId}/PlayerCard/${player.id}`);
        /*fetch('http://localhost:5000/api/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 'userId', actionType: 'Просмотр игрока', actionDetails: `ID игрока: ${player.id}` }),
        })
            .then(res => res.json())
            .catch(err => console.error(err));*/
    };

    return (
        <button className="player-item" onClick={handleClick}>
            <img src={`http://localhost:5000/images/${player.photo}`} height='150px' alt="photo"></img>
            <p>{player.fio}</p>
        </button>
    );
};

const NoPlayerItem = ({ players }) => {
    if (players.length == 0) {
        return (<p>В команде нет игроков</p>);
    }
    return <p></p>;
};

const HistoryItem = ({ history }) => {
    
    return (
        <div className="history-item">
            <h4>{history.CompetitionName}</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li>Дата: {history.DateStart}</li>
                <li>Заняли {history.Place} место</li>
            </ul>
        </div>
    );
};

const NoHistoryItem = ({ history }) => {
    if (history.length == 0) {
        return (<p>Команда не участвовала в соревнованиях</p>);
    }
    return <p></p>;
};

const PlayerCard = () => {
    const { teamId } = useParams();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/ListTeams`);
    };

    /*const teamCard1 = {
        name: 'Navi',
        players: [
            { id: 1, fio: 'Иванов Иван Иванович', photo: 'Яблоко.jpg' },
            { id: 2, fio: 'Иванов1 Иван1 Иванович1', photo: 'Дед.jpg' }
        ],
        history: [
            {
                CompetitionName: 'Тестовое соревнование',
                DateStart: '14.05.2025',
                Place: 1
            },
            {
                CompetitionName: 'Тестовое соревнование 1',
                DateStart: '14.06.2025',
                Place: 1
            }
        ],
        frequency: '1.00'
    };*/

    const [teamCard, setTeamCard] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/teamCard/${teamId}`)
            .then(res => res.json())
            .then(data => setTeamCard(data))
            .catch(err => console.error(err));
    }, [teamId]);

    if (!teamCard) return <div>Загрузка...</div>;

    return (
        <div>
            <button className="back" onClick={handleClick}>Список команд</button>
            <div>
                <h2 className="team-name">Команда {teamCard.name}</h2>
                <p>Частота побед: {teamCard.frequency * 100}%</p>
                <div>
                    <h3 className="subtitle">Состав команды</h3>
                    {teamCard.players.map((player) => (
                        <PlayerItem key={player.id} player={player} teamId={teamId} />
                    ))}
                    <NoPlayerItem players={teamCard.players}></NoPlayerItem>
                </div>
                <div>
                    <h3 className="subtitle">История участия в соревнованиях</h3>
                    {teamCard.history.map((history, index) => (
                        <HistoryItem key={index} history={history} />
                    ))}
                    <NoHistoryItem history={teamCard.history}></NoHistoryItem>
                </div>
            </div>
        </div>
    )
}

export default PlayerCard