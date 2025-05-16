import React from 'react';
import './TwoColumnScrollable.css';

//TeamId: 3

const TeamItem = ({ team }) => {
    return (
        <button className="team-item">
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
        </div>
    );
};

export default TwoColumnScrollable