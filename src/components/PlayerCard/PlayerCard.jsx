import React, { useEffect, useState } from 'react';
import './PlayerCard.css';
import { useNavigate } from 'react-router-dom';
import '../Button/Button.css';
import Header from '../Header/Header';
import { useParams } from 'react-router-dom';
//import { useTelegram } from '../../hooks/useTelegram';
import { useURL } from '../../hooks/URLs';
const { urlServer } = useURL();

const HistoryItem = ({ history }) => {

    const leftTeam = (dateLeft) => {
        if (dateLeft) {
            return `Вышел: ${dateLeft}`;
        } else {
            return "Сейчас в команде";
        }
    }
    return (
        <div className="history-item">
            <h4 className="history-team-name">{history.TeamName}</h4>
            <ul className="history-list">
                <li>Вошел: {history.DateAdd}</li>
                <li>{leftTeam(history.DateLeft)}</li>
            </ul>
        </div>
    );
};

const PlayerCard = () => {
    const { playerId, teamId } = useParams();
    const navigate = useNavigate();
    /*const [teams, setTeams] = useState(null);

    useEffect(() => {
        fetch(`${urlServer}api/edit/team/getTeams`)
            .then(res => res.json())
            .then(data => setTeams(data))
            .catch(err => console.error('Ошибка загрузки данных:', err));
    }, []);*/

    const teams = [
        {
            TeamId: 1, TeamName: 'Navi', players: [
                { PlayerId: 1, FIO: 'Иванов Иван Иванович', Photo: 'Яблоко.jpg' }, 
                { PlayerId: 3, FIO: 'Косяк Павел Александрович', Photo: '1747892911129-806430307.jpg' }
            ]
        },
        { TeamId: 2, TeamName: 'DreamTeam', players: [] },
        { TeamId: 3, TeamName: 'Eteam', players: [{ PlayerId: 2, FIO: 'Петров Петр Петрович', Photo: 'Дед.jpg' }] }];

    const handleClick = () => {
        navigate(`/ListTeams`);
    };

    const handleClickTeam = () => {
        navigate(`/TeamCard/${teamId}`);
        const teamsMap = new Map(teams?.map(team => [String(team.TeamId), team.TeamName]));
        
        /*fetch(`${urlServer}api/log`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 'userId', actionType: 'Просмотр команды', actionDetails: `Возвращение от просмотра игрока к карточке команды. Название команды: "${teamsMap.get(teamId)}". TeamId: ${teamId}`}),
        })
            .then(res => res.json())
            .catch(err => console.error(err));*/
    };

    /*const playerCard1 = {
        FIO: 'Иванов Иван Иванович',
        Age: 18,
        pathPhoto: 'Яблоко.jpg',
        history: [
            {
                TeamName: 'Kaka',
                DateAdd: '15.04.2024',
                DateLeft: '28.04.2025'
            },
            {
                TeamName: 'Navi',
                DateAdd: '10.05.2025',
                DateLeft: null
            },
        ]
    }*/

    const playerCard = { FIO: 'Иванов Иван Иванович', Age: 18, pathPhoto: 'Яблоко.jpg', history: [{ TeamName: 'Navi', DateAdd: '10.05.2025', DateLeft: null }] }

    /*const [playerCard, setPlayerCard] = useState(null);

    useEffect(() => {
        fetch(`${urlServer}api/playerCard/${playerId}`)
            .then(res => res.json())
            .then(data => setPlayerCard(data))
            .catch(err => console.error(err));
    }, [playerId]);*/

    //console.log('playerCard.playerCard:', playerCard);

    if (!playerCard) return <div className="loading">Загрузка...</div>;

    return (
        <div className="player-card-container">
            <button className="btn-back" onClick={handleClick}>Список команд</button>
            <button className="btn-back" onClick={handleClickTeam}>Назад</button>
            <div className="player-info">
                <img className="player-photo"  src={`http://localhost:5000/images/${playerCard.pathPhoto}`} alt="photo"></img>
                <h2 className="player-name">{playerCard.FIO}</h2>
                <p className="player-age">Возраст: {playerCard.Age}</p>
                <div className="player-history">
                    <h3 className="subtitle">В каких командах находился</h3>
                    {playerCard.history.map((history, index) => (
                        <HistoryItem key={index} history={history} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PlayerCard