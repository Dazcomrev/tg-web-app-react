import React, { useEffect, useState } from 'react';
import './EditData.css';
import { useNavigate } from 'react-router-dom';

const EditData = () => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/listTeams')
            .then(res => res.json())
            .then(data => setTeams(data))
            .catch(err => console.error('Ошибка загрузки данных:', err));

    }, []);

    const handleClick = () => {
        navigate(`/ListTeams`);
    };

    const editTeamClick = () => {
        navigate(`/EditData/EditTeam`);

    };

    const editPlayerClick = () => {

        navigate(`/EditData/EditPlayer`);

    };

    const editCompetitionClick = () => {
        navigate(`/EditData/EditCompetition`);
    };

    const editMatchClick = () => {
        navigate(`/EditData/EditMatch`);
    };

    if (!teams) return <div>Загрузка...</div>;

    return (
        <div>
            <button className="back" onClick={handleClick}>Список команд</button>
            <h2>Выберите какую информацию хотите отредактироать</h2>
            <button className="button" onClick={editTeamClick}>Команда</button>
            <button className="button" onClick={editPlayerClick}>Игрок</button>
            <button className="button" onClick={editCompetitionClick}>Соревнование</button>
            <button className="button" onClick={editMatchClick}>Матч</button>
        </div>
    )
}

export default EditData