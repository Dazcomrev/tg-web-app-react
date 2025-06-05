import React, { useEffect, useState } from 'react';
import './ListTeams.css';
import TwoColumnScrollable from './TwoColumnScrollable/TwoColumnScrollable';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { useURL } from '../../hooks/URLs';
const { urlServer } = useURL();

const ListTeams = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/EditData`);
    };

    const [teams, setTeams] = useState(null);

    useEffect(() => {
        fetch(`${urlServer}api/listTeams`)
            .then(res => res.json())
            .then(data => setTeams(data))
            .catch(err => console.error('Ошибка загрузки данных:', err));

    }, []);

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