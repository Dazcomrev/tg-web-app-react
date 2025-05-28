import React, { useEffect, useState } from 'react';
import './EditData.css';
import { useNavigate } from 'react-router-dom';

const EditData = () => {
    const navigate = useNavigate();

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

    return (
        <div className="edit-data-container">
            <button className="btn-back" onClick={handleClick}>Список команд</button>
            <h2 className="edit-data-title">Выберите какую информацию хотите отредактироать</h2>
            <div className="buttons-group">
                <button className="btn-main" onClick={editTeamClick}>Команда</button>
                <button className="btn-main" onClick={editPlayerClick}>Игрок</button>
                <button className="btn-main" onClick={editCompetitionClick}>Соревнование</button>
                <button className="btn-main" onClick={editMatchClick}>Матч</button>
            </div>
        </div>
    )
}

export default EditData