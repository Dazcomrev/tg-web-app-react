import React, { useCallback, useEffect } from 'react';
import './TwoColumnScrollable.css';
import { useTelegram } from '../../../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';
import { useURL } from '../../../hooks/URLs';
const { urlServer } = useURL();

//TeamId: 3
/*const { tg, queryId } = useTelegram();
const onSendData = useCallback(() => {
    const data = {
        teamId: 12,
        queryId
    };
    fetch('http://localhost:8000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
}, [])

const onTeamCard = () => {
    console.log('Что-то');
    tg.sendData(JSON.stringify('Что-то'));
}*/

const TeamItem = ({ team }) => {
    const navigate = useNavigate();
    const { userId } = useTelegram();
    /*
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    ДОБАВИТЬ СЧИТЫВАНИЕ TG USER ID В ЛОГИ
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    */

    const handleClick = () => {
        navigate(`/TeamCard/${team.TeamId}`);
        fetch(`${urlServer}api/log`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: `${userId}`, actionType: 'Просмотр команды', actionDetails: `Название команды: "${team.TeamName}". TeamId: ${team.TeamId}`}),
        })
            .then(res => res.json())
            .catch(err => console.error(err));
    };

    return (
        <button className="team-item" onClick={handleClick}>
            <h3>{team.TeamName}</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li>Число побед: {team.NumberWins}</li>
                <li>Число поражений: {team.NumberDefeats}</li>
                <li>Чатота побед: {team.FrequencyWins * 100}%</li>
            </ul>
        </button>
    );
};

const TwoColumnScrollable = ({ items }) => {
    return (
        <div className="two-column-scrollable">
            {items.map((team) => (
                <TeamItem key={team.TeamId} team={team} />
            ))}
            { items.length === 0 && <p>Нет информации ни об одной из команд</p> }
        </div>
    );
};

export default TwoColumnScrollable