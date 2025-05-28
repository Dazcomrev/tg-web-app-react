import React, { useEffect, useState } from 'react';
import './TeamCard.css';
import { useNavigate } from 'react-router-dom';
import '../Button/Button.css';
import Header from '../Header/Header';
import { useParams } from 'react-router-dom';
//import { useTelegram } from '../../hooks/useTelegram';
import { useURL } from '../../hooks/URLs';
const { urlServer } = useURL();

function ImageTooltip({ children, imgSrc, imgAlt }) {
    const [visible, setVisible] = useState(false);

    return (
        <div
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}

            {visible && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginTop: 8,
                        padding: 5,
                        border: '1px solid #ccc',
                        backgroundColor: '#fff',
                        boxShadow: '0 0 5px rgba(0,0,0,0.3)',
                        zIndex: 1000,
                    }}
                >
                    <img src={imgSrc} alt={imgAlt} style={{ maxWidth: 200, maxHeight: 150 }} />
                </div>
            )}
        </div>
    );
}

const PlayerItem = ({ player, teamId }) => {
    const navigate = useNavigate();

    /*
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    ДОБАВИТЬ СЧИТЫВАНИЕ TG USER ID В ЛОГИ
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    */

    const handleClick = () => {
        navigate(`/TeamCard/${teamId}/PlayerCard/${player.PlayerId}`);
        /*fetch(`${urlServer}api/log`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 'userId', actionType: 'Просмотр игрока', actionDetails: `Игрок: ${player.FIO}. ID игрока: ${player.PlayerId}` }),
        })
            .then(res => res.json())
            .catch(err => console.error(err));*/
    };
    //<img src={`http://localhost:5000/images/${player.Photo}`} height='150px' alt="photo"></img>
    const imgSrc = `http://localhost:5000/images/${player.Photo}`;
    return (

        <button className="player-item" onClick={handleClick}>
            <ImageTooltip imgSrc={imgSrc} imgAlt="photo">
                <p>{player.FIO}</p>
            </ImageTooltip>
        </button>

    );
};

const NoPlayerItem = ({ players }) => {
    if (players.length == 0) {
        return (<p>В команде нет игроков</p>);
    }
    return <p></p>;
};

const HistoryItem = ({ history, teams }) => {
    
    return (
        <div className="history-item">
            <hr className={'hr-competitions'} />
            <h3>{history.CompetitionName}</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li>Дата: {history.DateStart}</li>
                <li>Место : {history.Place}</li>
                <div>
                    <h3>Матчи команды: </h3>
                    {history.matchs.length == 0 && 'Отсутствуют'}
                    {history.matchs.map(match => {
                        const teamsMap = new Map(teams?.map(team => [team.TeamId, team.TeamName]));
                        const score1 = match.Score1 != -1 ? String(match.Score1) : 'не указан';
                        const score2 = match.Score2 != -1 ? String(match.Score2) : 'не указан';
                        const winnerName = match.HaveWinner ? match.WinnerId == match.Team1 ? `"${teamsMap.get(match.Team1)}"` : `"${teamsMap.get(match.Team2)}"` : 'не указан';
                        return (
                            <div key={match.MatchId}>
                                <hr className={'hr-matchs'} />
                                <p>"{teamsMap?.get(match?.Team1)}" – "{teamsMap?.get(match?.Team2)}"</p>
                                <p>Счет: {score1} – {score2}</p>
                                <p>Победитель: {winnerName}</p>
                                <p>Дата соревнования: {match?.DateMatch}</p>
                            </div>
                        )
                    })}
                </div>
            </ul>
        </div>
    );
};

const NoHistoryItem = ({ history }) => {
    if (history.length == 0) {
        return (<p>Команда не участвовала в соревнованиях</p>);
    }
    return <p></p>;
};

const PlayerCard = () => {
    const { teamId } = useParams();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/ListTeams`);
    };

    /*const teamCard1 = {
        name: 'Navi',
        players: [
            { PlayerId: 1, FIO: 'Иванов Иван Иванович', Photo: 'Яблоко.jpg' },
            { PlayerId: 2, FIO: 'Иванов1 Иван1 Иванович1', Photo: 'Дед.jpg' }
        ],
        history: [
            {
                CompetitionName: 'Тестовое соревнование',
                DateStart: '14.05.2025',
                Place: 1
            },
            {
                CompetitionName: 'Тестовое соревнование 1',
                DateStart: '14.06.2025',
                Place: 1
            }
        ],
        frequency: '1.00'
    };*/

    const [teamCard, setTeamCard] = useState(null);

    useEffect(() => {
        fetch(`${urlServer}api/teamCard/${teamId}`)
            .then(res => res.json())
            .then(data => setTeamCard(data))
            .catch(err => console.error(err));
    }, [teamId]);

    const [teams, setTeams] = useState(null);

    useEffect(() => {
        fetch(`${urlServer}api/listTeams`)
            .then(res => res.json())
            .then(data => setTeams(data))
            .catch(err => console.error('Ошибка загрузки данных:', err));

    }, []);

    if (!teamCard) return <div>Загрузка...</div>;

    return (
        <div>
            <button className="back" onClick={handleClick}>Список команд</button>
            <div>
                <h2 className="team-name">Команда {teamCard.name}</h2>
                <p>Частота побед: {teamCard.frequency * 100}%</p>
                <div>
                    <h3 className="subtitle">Состав команды</h3>
                    {teamCard.players.map((player) => (
                        <PlayerItem key={player.PlayerId} player={player} teamId={teamId} />
                    ))}
                    <NoPlayerItem players={teamCard.players}></NoPlayerItem>
                </div>
                <div className="test-div">
                    <h3 className="subtitle">История участия в соревнованиях</h3>
                    {teamCard.history.map((history, index) => (
                        <HistoryItem key={index} history={history} teams={teams} />
                    ))}
                    <NoHistoryItem history={teamCard.history}></NoHistoryItem>
                </div>
            </div>
        </div>
    )
}

export default PlayerCard