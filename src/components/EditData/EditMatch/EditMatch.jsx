import React, { useEffect, useState } from 'react';
import './EditMatch.css';
import { useNavigate } from 'react-router-dom';
function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null; // ничего не рендерим, если окно закрыто

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                {children}
                <button onClick={onClose} style={styles.closeBtn}>Закрыть</button>
            </div>
        </div>
    );
}
const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        background: '#fff',
        padding: 20,
        borderRadius: 8,
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    },
    closeBtn: {
        marginTop: 20,
    }
};

function AddMatch({ competitions }) {
    const [firstTeam, setfirstTeam] = useState('');
    const [secondTeam, setSecondTeam] = useState('');
    const [winner, setWinner] = useState('');
    const [dateMatch, setDateMatch] = useState('');
    const [firstScore, setFirstScore] = useState('');
    const [secondScore, setSecondScore] = useState('');
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [error, setError] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = (competition) => {
        setSelectedCompetition(competition);
        setfirstTeam('0');
        setSecondTeam('0');
        setWinner('0');
        setDateMatch('');
        setFirstScore('');
        setSecondScore('');
        setError('');
        setModalOpen(true);
    };

    const validateNumber = (num) => {
        // Проверяем, что введено число
        return /^\d+$/.test(num);
    };
    const validate = () => {
        if (firstTeam === '0' || firstTeam === '') {
            setError('Выберите 1 команду');
            return false;
        }
        if (secondTeam === '0' || secondTeam === '') {
            setError('Выберите 2 команду');
            return false;
        }
        if (firstTeam == secondTeam) {
            setError('Нельзя выбрать две одинаковые команды');
            return false;
        }
        const matchExists = selectedCompetition.matchs.some(match => {
            return (
                (String(match.Team1) === firstTeam && String(match.Team2) === secondTeam) ||
                (String(match.Team1) === secondTeam && String(match.Team2) === firstTeam)
            );
        });
        if (matchExists) {
            setError('Матч между этими командами уже есть');
            return false;
        }
        if (winner === '0' || winner === '') {
            setError('Выберите команду победителя');
            return false;
        }
        if (dateMatch == "") {
            setError('Выберите дату матча');
            return false;
        }
        if (firstScore == '') {
            setError('Не введен счет 1 комнады');
            return false;
        }
        if (!validateNumber(firstScore)) {
            setError('Счет 1 должен содержать только цифры');
            return false;
        }
        if (secondScore == '') {
            setError('Не введен счет 2 комнады');
            return false;
        }
        if (!validateNumber(secondScore)) {
            setError('Счет 2 должен содержать только цифры');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        // Выводим имя и возраст в консоль
        console.log('Отправляем данные:', { firstTeam, secondTeam, winner, dateMatch, firstScore, secondScore, selectedCompetition });

        // Формируем FormData для отправки файла
        /*const formData = new FormData();
        formData.append('Photo', Photo);
        formData.append('FirstName', FirstName);
        formData.append('SecondName', SecondName);
        formData.append('ThirdName', ThirdName);
        formData.append('Age', Age);

        console.log('formData:', formData);*/

        try {
            /*const response = await fetch('http://localhost:5000/api/upload-player', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');
            }

            const data = await response.json();
            console.log('Ответ сервера:', data);*/
            setError('');
            setModalOpen(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const CompetitionItem = ({ competition }) => {

        /*
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        ДОБАВИТЬ СЧИТЫВАНИЕ TG USER ID В ЛОГИ
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        
        */

        return (
            <div>
                <button className="competition-item" onClick={() => openModal(competition)}>
                    <p>{competition.CompetitionName}</p>
                    <p>Дата соревнования: {competition.DateStart}</p>
                </button>
            </div>
        );
    };

    return (
        <div>
            <h3>Добавление матча</h3>
            <p>Выберите соревнование для добавления матча</p>

            <div>
                {competitions.map(comp => (
                    <CompetitionItem key={comp.CompetitionId} competition={comp} onSelect={openModal} />
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <h3>Добавление матча в {selectedCompetition?.CompetitionName}</h3>
                    <div>
                        <label>
                            1 команда:
                            <select value={firstTeam || ''}
                                onChange={(e) => setfirstTeam(e.target.value)}>
                                <option key={0} value={0}>---------</option>
                                {selectedCompetition?.teams.map((team) => (
                                    <option key={team.TeamId} value={team.TeamId}>
                                        {team.TeamName}
                                    </option>
                                ))}
                            </select>
                        </label><br />
                        <label>
                            2 команда:
                            <select value={secondTeam || ''}
                                onChange={(e) => setSecondTeam(e.target.value)}>
                                <option key={0} value={0}>---------</option>
                                {selectedCompetition?.teams.map((team) => (
                                    <option key={team.TeamId} value={team.TeamId}>
                                        {team.TeamName}
                                    </option>
                                ))}
                            </select>
                        </label><br />
                        <label>
                            Команда победитель:
                            <select value={winner || ''}
                                onChange={(e) => setWinner(e.target.value)}>
                                <option key={0} value={0}>---------</option>
                                <option key={1} value={1}>1 команда</option>
                                <option key={2} value={2}>2 команда</option>
                            </select>
                        </label><br />
                        <label>
                            Дата матча:
                            <input
                                type="date"
                                value={dateMatch}
                                onChange={(e) => setDateMatch(e.target.value)}
                            />
                        </label><br />
                        <label>
                            Счет 1 команды:
                            <input
                                type="text"
                                value={firstScore}
                                onChange={(e) => setFirstScore(e.target.value)}
                                placeholder="Введите счет"
                                min="1"
                            />
                        </label><br />
                        <label>
                            Счет 2 команды:
                            <input
                                type="text"
                                value={secondScore}
                                onChange={(e) => setSecondScore(e.target.value)}
                                placeholder="Введите счет"
                                min="1"
                            />
                        </label>

                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <button type="submit">Добавить</button>
                    <button onClick={() => setModalOpen(false)}>Отмена</button>

                    <div>
                        <p>Матчи, которые уже есть:</p>
                        {selectedCompetition?.matchs.map((match, index) => {
                            const teamsMap = new Map(selectedCompetition?.teams.map(team => [team.TeamId, team.TeamName]));
                            return (
                                <p>{index + 1}. {teamsMap.get(match.Team1)} и {teamsMap.get(match.Team2)} – {match?.DateMatch}</p>
                            )}
                        )}
                    </div>
                </form>
            </Modal>
        </div>
    );
}

function RemoveMatch({ competitions }) {
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [error, setError] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = (competition) => {
        setSelectedCompetition(competition);
        setSelectedMatch('');
        setError('');
        setModalOpen(true);
    };

    const validateNumber = (num) => {
        // Проверяем, что введено число
        return /^\d+$/.test(num);
    };
    const validate = () => {
        if (selectedMatch === '0' || selectedMatch === '') {
            setError('Выберите матч, который хотите удалить');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        // Выводим имя и возраст в консоль
        console.log('Отправляем данные:', { selectedMatch, selectedCompetition });

        // Формируем FormData для отправки файла
        /*const formData = new FormData();
        formData.append('Photo', Photo);
        formData.append('FirstName', FirstName);
        formData.append('SecondName', SecondName);
        formData.append('ThirdName', ThirdName);
        formData.append('Age', Age);

        console.log('formData:', formData);*/

        try {
            /*const response = await fetch('http://localhost:5000/api/upload-player', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');
            }

            const data = await response.json();
            console.log('Ответ сервера:', data);*/
            setError('');
            setModalOpen(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const CompetitionItem = ({ competition }) => {

        /*
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        ДОБАВИТЬ СЧИТЫВАНИЕ TG USER ID В ЛОГИ
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        
        */

        return (
            <div>
                <button className="competition-item" onClick={() => openModal(competition)}>
                    <p>{competition.CompetitionName}</p>
                    <p>Дата соревнования: {competition.DateStart}</p>
                </button>
            </div>
        );
    };

    return (
        <div>
            <h3>Удаление матча</h3>
            <p>Выберите соревнование для удаления матча</p>

            <div>
                {competitions.map(comp => (
                    <CompetitionItem key={comp.CompetitionId} competition={comp} onSelect={openModal} />
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <h3>Удаление матча из {selectedCompetition?.CompetitionName}</h3>
                    <div>
                        <label>
                            Матчи:
                            <select value={selectedMatch || ''}
                                onChange={(e) => setSelectedMatch(e.target.value)}>
                                <option key={0} value={0}>----------------------------</option>
                                {selectedCompetition?.matchs.map((match) => {
                                    const teamsMap = new Map(selectedCompetition?.teams.map(team => [team.TeamId, team.TeamName]));
                                    return (
                                        <option key={match.MatchId} value={match.MatchId} title={`Дата: ${match.DateMatch}\nСчет: ${match.Score1}:${match.Score2}`}>
                                            {teamsMap.get(match.Team1)} – {teamsMap.get(match.Team2)}
                                        </option>
                                    )
                                })}
                            </select>
                        </label><br />
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <button type="submit">Удалить</button>
                    <button onClick={() => setModalOpen(false)}>Отмена</button>


                </form>
            </Modal>
        </div>
    );
}

function EditInfoMatch({ competitions }) {
    const [firstTeam, setfirstTeam] = useState('');
    const [secondTeam, setSecondTeam] = useState('');
    const [winner, setWinner] = useState('');
    const [dateMatch, setDateMatch] = useState('');
    const [firstScore, setFirstScore] = useState('');
    const [secondScore, setSecondScore] = useState('');
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [error, setError] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);

    /*
    Добавить проверку на формат даты
    */
    const difisFromPoint = (datePoint) => {
        const d = datePoint.split(".")[0];
        const m = datePoint.split(".")[1];
        const y = datePoint.split(".")[2];
        return `${y}-${m}-${d}`;
    };

    const openModal = (match) => {
        setSelectedCompetition(match.competition);
        setSelectedMatch(match);
        setfirstTeam(String(match.Team1));
        setSecondTeam(String(match.Team2));
        setWinner(String(match.Winner));
        setDateMatch(difisFromPoint(match.DateMatch));
        setFirstScore(String(match.Score1));
        setSecondScore(String(match.Score2));
        setError('');
        setModalOpen(true);
    };

    const validateNumber = (num) => {
        // Проверяем, что введено число
        return /^\d+$/.test(num);
    };
    const validate = () => {
        if (winner === '0' || winner === '') {
            setError('Выберите команду победителя');
            return false;
        }
        if (dateMatch == "") {
            setError('Выберите дату матча');
            return false;
        }
        if (firstScore == '') {
            setError('Не введен счет 1 комнады');
            return false;
        }
        if (!validateNumber(firstScore)) {
            setError('Счет 1 должен содержать только цифры');
            return false;
        }
        if (secondScore == '') {
            setError('Не введен счет 2 комнады');
            return false;
        }
        if (!validateNumber(secondScore)) {
            setError('Счет 2 должен содержать только цифры');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        // Выводим имя и возраст в консоль
        console.log('Отправляем данные:', { firstTeam, secondTeam, winner, dateMatch, firstScore, secondScore, selectedMatch, selectedCompetition });

        // Формируем FormData для отправки файла
        /*const formData = new FormData();
        formData.append('Photo', Photo);
        formData.append('FirstName', FirstName);
        formData.append('SecondName', SecondName);
        formData.append('ThirdName', ThirdName);
        formData.append('Age', Age);

        console.log('formData:', formData);*/

        try {
            /*const response = await fetch('http://localhost:5000/api/upload-player', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');
            }

            const data = await response.json();
            console.log('Ответ сервера:', data);*/
            setError('');
            setModalOpen(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const CompetitionItem = ({ competition }) => {
        return (
            <div>
                <div className="competition-item">
                    <h2>{competition.CompetitionName}</h2>
                    <p>Дата соревнования: {competition.DateStart}</p>
                    <div>
                        <label>Матчи: </label>
                        {competition.matchs.length == 0 && 'Отсутствуют'}
                        {competition.matchs.map(match => {
                            const teamsMap = new Map(competition?.teams.map(team => [team.TeamId, team.TeamName]));
                            match['Team1Name'] = teamsMap.get(match.Team1);
                            match['Team2Name'] = teamsMap.get(match.Team2);
                            match['competition'] = competition;
                            return (
                                <MatchItem key={match.MatchId} match={match} onSelect={openModal} />
                        )})}
                    </div>
                </div>
            </div>
        );
    };

    const MatchItem = ({ match }) => {

        /*
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        ДОБАВИТЬ СЧИТЫВАНИЕ TG USER ID В ЛОГИ
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        
        */

        return (
            <div>
                <button className="competition-item" onClick={() => openModal(match)}>
                    <p>{match.Team1Name} – {match.Team2Name}</p>
                    <p>Счет: {match.Score1} – {match.Score2}</p>
                    <p>Дата соревнования: {match.DateMatch}</p>
                </button>
            </div>
        );
    };

    return (
        <div>
            <h3>Изменение данных матча</h3>
            <p>Выберите матч в соревновании для изменения данных</p>

            <div>
                {competitions.map(comp => (
                    <CompetitionItem key={comp.CompetitionId} competition={comp} onSelect={openModal} />
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <h3>Изменение матча в {selectedCompetition?.CompetitionName}</h3>
                    <h3>{selectedMatch?.Team1Name} – {selectedMatch?.Team2Name}</h3>
                    <div>
                        <label>
                            Команда победитель:
                            <select value={winner || ''}
                                onChange={(e) => setWinner(e.target.value)}>
                                <option key={0} value={0}>---------</option>
                                <option key={1} value={1}>1 команда</option>
                                <option key={2} value={2}>2 команда</option>
                            </select>
                        </label><br />
                        <label>
                            Дата матча:
                            <input
                                type="date"
                                value={dateMatch}
                                onChange={(e) => setDateMatch(e.target.value)}
                            />
                        </label><br />
                        <label>
                            Счет 1 команды:
                            <input
                                type="text"
                                value={firstScore}
                                onChange={(e) => setFirstScore(e.target.value)}
                                placeholder="Введите счет"
                                min="1"
                            />
                        </label><br />
                        <label>
                            Счет 2 команды:
                            <input
                                type="text"
                                value={secondScore}
                                onChange={(e) => setSecondScore(e.target.value)}
                                placeholder="Введите счет"
                                min="1"
                            />
                        </label>

                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <button type="submit">Добавить</button>
                    <button onClick={() => setModalOpen(false)}>Отмена</button>
                </form>
            </Modal>
        </div>
    );
}

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

    const competitions = [
        {
            CompetitionId: 1, CompetitionName: 'Соревнование 1', DateStart: '17.05.2025', teams: [
                { TeamId: 1, TeamName: 'Navi', Place: 1 },
                { TeamId: 2, TeamName: 'DreamTeam', Place: 2 }],
            matchs: []
        },
        {
            CompetitionId: 2, CompetitionName: 'Соревнование 2', DateStart: '20.05.2025', teams: [
                { TeamId: 1, TeamName: 'Navi', Place: 1 },
                { TeamId: 2, TeamName: 'DreamTeam', Place: 3 },
                { TeamId: 3, TeamName: 'Eteam', Place: 2 }],
            matchs: [{ MatchId: 1, Team1: 1, Team2: 3, Winner: 1, DateMatch: '20.05.2025', Score1: 3, Score2: 2 }]
        },
        { CompetitionId: 3, CompetitionName: 'Соревнование 3', DateStart: '22.05.2025', teams: [], matchs:[] }
    ];

    const [activeSection, setActiveSection] = useState('home');

    // Контент для разных разделов
    const renderContent = () => {
        switch (activeSection) {
            case 'addMatch':
                return <AddMatch competitions={competitions} />;
            case 'removeMatch':
                return <RemoveMatch competitions={competitions} />;
            case 'editInfoMatch':
                return <EditInfoMatch competitions={competitions}/>;
            default:
                return <div>Выберите раздел</div>;
        }
    };

    //if (!teams) return <div>Загрузка...</div>;

    return (
        <div>
            <button className="back" onClick={handleClick}>Список команд</button>
            <button className="back" onClick={backClick}>Назад</button>
            <h2>Выберите какую информацию хотите отредактироать</h2>
            <button className="button" onClick={() => setActiveSection("addMatch")}>Добавление матча</button>
            <button className="button" onClick={() => setActiveSection("removeMatch")}>Удаление матча</button>
            <button className="button" onClick={() => setActiveSection("editInfoMatch")}>Изменение данных матча</button>

            <hr />

            <div>
                {renderContent()}
            </div>
        </div>
    )
}

export default EditMatch