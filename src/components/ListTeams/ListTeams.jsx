import React, { useEffect, useState } from 'react';
import './ListTeams.css';
import TwoColumnScrollable from './TwoColumnScrollable/TwoColumnScrollable';
import { useNavigate } from 'react-router-dom';
//import { useTelegram } from '../../hooks/useTelegram';
import { useURL } from '../../hooks/URLs';
const { urlServer } = useURL();

const ListTeams = () => {
    const navigate = useNavigate();
    //const { userId} = useTelegram();

    const handleClick = () => {
        navigate(`/EditData`);
    };

    /*const teams = [
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

    const teams = [
        { TeamId: 1, TeamName: 'Navi', NumberWins: 4, NumberDefeats: 0, FrequencyWins: '1.0000' },
        { TeamId: 2, TeamName: 'DreamTeam', NumberWins: 0, NumberDefeats: 1, FrequencyWins: '0.0000' },
        { TeamId: 3, TeamName: 'Eteam', NumberWins: 0, NumberDefeats: 0, FrequencyWins: '0' } ];

    /*const [teams, setTeams] = useState(null);

    useEffect(() => {
        fetch(`${urlServer}api/listTeams`)
            .then(res => res.json())
            .then(data => setTeams(data))
            .catch(err => console.error('Ошибка загрузки данных:', err));

    }, []);*/
    //console.log('ListTeams:', teams);

    if (!teams) return <div className="loading">Загрузка...</div>;

    return (
        <div className="list-teams-container">
            <button className="btn-back" onClick={handleClick}>Редактирование</button>
            <h2 className="title">Cписок команд вуза</h2>
            <TwoColumnScrollable items={teams}></TwoColumnScrollable>
        </div>
    )
}

export default ListTeams