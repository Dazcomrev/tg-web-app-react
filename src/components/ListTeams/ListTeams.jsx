import React, { useEffect, useState } from 'react';
import './ListTeams.css';
import TwoColumnScrollable from './TwoColumnScrollable/TwoColumnScrollable';
import { useNavigate } from 'react-router-dom';

const ListTeams = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/EditData`);
    };

    /*const data1 = [
        {
            TeamId: 1,
            TeamName: 'Navi',
            NumberWins: 1,
            NumberDefeats: 0,
            FrequencyWins: '1.00'
        },
        {
            TeamId: 2,
            TeamName: 'DreamTeam',
            NumberWins: 0,
            NumberDefeats: 1,
            FrequencyWins: '0.00'
        },
        {
            TeamId: 3,
            TeamName: 'Eteam',
            NumberWins: 0,
            NumberDefeats: 0,
            FrequencyWins: '0'
        }
    ];*/

    const [teams, setTeams] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/listTeams')
            .then(res => res.json())
            .then(data => setTeams(data))
            .catch(err => console.error('Ошибка загрузки данных:', err));

    }, []);

    if (!teams) return <div>Загрузка...</div>;

    return (
        <div>
            <button className="back" onClick={handleClick}>Редактирование</button>
            <h2>Cписок команд вуза</h2>
            <TwoColumnScrollable items={teams}></TwoColumnScrollable>
        </div>
    )
}

export default ListTeams