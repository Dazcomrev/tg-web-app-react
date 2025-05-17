import React, { useEffect, useState } from 'react';
import './PlayerCard.css';
import { useNavigate } from 'react-router-dom';
import '../Button/Button.css';
import Header from '../Header/Header';
import { useParams } from 'react-router-dom';

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
            <h4>{history.TeamName}</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li>Вошел: {history.DateAdd}</li>
                <li>{leftTeam(history.DateLeft)}</li>
            </ul>
        </div>
    );
};

const PlayerCard = () => {
    const { playerId, teamId } = useParams();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/ListTeams`);
    };

    const handleClickTeam = () => {
        navigate(`/TeamCard/${teamId}`);
    };

    /*const playerCard1 = {
        fio: 'Иванов Иван Иванович',
        age: 18,
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

    const [playerCard, setPlayerCard] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/playerCard/${playerId}`)
            .then(res => res.json())
            .then(data => setPlayerCard(data))
            .catch(err => console.error(err));
    }, [playerId]);

    if (!playerCard) return <div>Загрузка...</div>;

    return (
        <div>
            <button className="back" onClick={handleClick}>Список команд</button>
            <button className="back" onClick={handleClickTeam}>Назад</button>
            <div>
                <img src={`/images/${playerCard.pathPhoto}`} height='250px' alt="photo"></img>
                <h2 className="player-name">{playerCard.fio}</h2>
                <p>Возраст: {playerCard.age}</p>
                <div>
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