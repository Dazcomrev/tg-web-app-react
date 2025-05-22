import React, { useEffect, useState } from 'react';
import './EditMatch.css';
import { useNavigate } from 'react-router-dom';

const EditMatch = () => {
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

    const backClick = () => {
        navigate(`/EditData`);
    };

    const buttonToEditClick = (data) => {
        console.log(data);
    };

    if (!teams) return <div>Загрузка...</div>;

    return (
        <div>
            <button className="back" onClick={handleClick}>Список команд</button>
            <button className="back" onClick={backClick}>Назад</button>
            <h2>Выберите какую информацию хотите отредактироать</h2>
            <button className="button" onClick={buttonToEditClick("ТЕТЕТОТОТ")}>Команда</button>
            <button className="button">Игрок</button>
            <button className="button">Соревнование</button>
        </div>
    )
}

export default EditMatch