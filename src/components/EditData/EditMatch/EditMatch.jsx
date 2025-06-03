import React, { useEffect, useState } from 'react';
import './EditMatch.css';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../../hooks/useTelegram';
import { useURL } from '../../../hooks/URLs';
const { urlServer } = useURL();
const { userId } = useTelegram();

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null; // ничего не рендерим, если окно закрыто

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="btn-close">Закрыть</button>
                <div className="under-close">
                    {children}
                </div>
            </div>
        </div>
    );
}

const pointFromDifis = (dateDifis) => {
    const y = dateDifis.split("-")[0];
    const m = dateDifis.split("-")[1];
    const d = dateDifis.split("-")[2];
    return `${d}.${m}.${y}`;
};

function AddMatch({ competitions, refreshCompetitions }) {
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
        /*if (winner === '0' || winner === '') {
            setError('Выберите команду победителя');
            return false;
        }*/
        if (dateMatch == "") {
            setError('Выберите дату матча');
            return false;
        }
        /*if (firstScore == '') {
            setError('Не введен счет 1 комнады');
            return false;
        }*/
        if (firstScore != '' && !validateNumber(firstScore)) {
            setError('Счет 1 должен содержать только цифры');
            return false;
        }
        /*if (secondScore == '') {
            setError('Не введен счет 2 комнады');
            return false;
        }*/
        if (secondScore != '' && !validateNumber(secondScore)) {
            setError('Счет 2 должен содержать только цифры');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const haveWinner = winner != '0' ? true : false;
        const teamsMap = new Map(selectedCompetition.teams.map(team => [String(team.TeamId), team.TeamName]));
        const winnerName = haveWinner ? winner == 1 ? `"${String(teamsMap.get(firstTeam))}"` : `"${String(teamsMap.get(secondTeam))}"` : 'не указан';
        const score1 = firstScore != '' ? String(firstScore) : 'не указан';
        const score2 = secondScore != '' ? String(secondScore) : 'не указан';
        // Выводим имя и возраст в консоль
        //console.log('Отправляем данные:', { firstTeam, secondTeam, winner, dateMatch, firstScore, secondScore, selectedCompetition });
        
        // Формируем FormData для отправки файла
        const formData = new FormData();
        formData.append('CompetitionId', selectedCompetition.CompetitionId);
        formData.append('TeamId1', firstTeam);
        formData.append('TeamId2', secondTeam);
        formData.append('WinnerId', winner);
        formData.append('DateMatch', dateMatch);
        formData.append('Score1', firstScore != '' ? firstScore : -1);
        formData.append('Score2', secondScore != '' ? secondScore : -1);

        //console.log(`Добавлен матч "${teamsMap.get(firstTeam)}" – "${teamsMap.get(secondTeam)}" (Счет: ${score1}:${score2}. Победитель: ${winnerName}). Дата: ${pointFromDifis(dateMatch)}.`);
        //setError('');
        //setModalOpen(false);
        try {
            const response = await fetch(`${urlServer}api/edit/match/addMatch`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');
            }

            //const data = await response.json();
            //console.log('Ответ сервера:', data);

            fetch(`${urlServer}api/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: `${userId}`, actionType: 'Редактирование данных', actionDetails: `Добавлен матч "${teamsMap.get(firstTeam)}" – "${teamsMap.get(secondTeam)}" (Счет: ${score1}:${score2}. Победитель: ${winnerName}). Дата: ${pointFromDifis(dateMatch)}.` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshCompetitions();

            // Очистка формы
            setError('');
            setModalOpen(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const CompetitionItem = ({ competition }) => {
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
                        <label className="form-label">
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
                        <label className="form-label">
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
                        <label className="form-label">
                            Команда победитель:
                            <select value={winner || ''}
                                onChange={(e) => setWinner(e.target.value)}>
                                <option key={0} value={0}>---------</option>
                                <option key={1} value={1}>1 команда</option>
                                <option key={2} value={2}>2 команда</option>
                            </select>
                        </label><br />
                        <label className="form-label">
                            Дата матча:
                            <input
                                type="date"
                                value={dateMatch}
                                onChange={(e) => setDateMatch(e.target.value)}
                                className="form-input"
                            />
                        </label><br />
                        <label className="form-label">
                            Счет 1 команды:
                            <input
                                type="text"
                                value={firstScore}
                                onChange={(e) => setFirstScore(e.target.value)}
                                placeholder="Введите счет"
                                min="1"
                                className="form-input"
                            />
                        </label><br />
                        <label className="form-label">
                            Счет 2 команды:
                            <input
                                type="text"
                                value={secondScore}
                                onChange={(e) => setSecondScore(e.target.value)}
                                placeholder="Введите счет"
                                min="1"
                                className="form-input"
                            />
                        </label>

                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button className="btn-confirm" type="submit">Добавить</button>
                    <button className="btn-cancel" onClick={() => setModalOpen(false)}>Отмена</button>

                    <div className="match-list">
                        <p>Матчи, которые уже есть:</p>
                        {selectedCompetition?.matchs.map((match, index) => {
                            const teamsMap = new Map(selectedCompetition?.teams.map(team => [team.TeamId, team.TeamName]));
                            return (
                                <p key={match.MatchId}>{index + 1}. {teamsMap.get(match.Team1)} и {teamsMap.get(match.Team2)} – {match?.DateMatch}</p>
                            )}
                        )}
                    </div>
                </form>
            </Modal>
        </div>
    );
}

function RemoveMatch({ competitions, refreshCompetitions }) {
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

        //console.log('Отправляем данные:', { selectedMatch, selectedCompetition });

        const teamsMap = new Map(selectedCompetition.teams.map(team => [String(team.TeamId), team.TeamName]));
        const matchsMap = new Map(selectedCompetition.matchs.map(match => [String(match.MatchId),
            {
                Team1: String(match.Team1),
                Team2: String(match.Team2),
                Winner: match.Winner,
                Score1: String(match.Score1),
                Score2: String(match.Score2),
                DateMatch: String(match.DateMatch)
            }]));
        const Match = matchsMap.get(selectedMatch);
        const winnerName = selectedMatch.HaveWinner ? winner == 1 ? `"${String(teamsMap.get(firstTeam))}"` : `"${String(teamsMap.get(secondTeam))}"` : 'не указан';
        //const winnerName = Match.Winner == 1 ? `"${teamsMap.get(Match.Team1)}"` : Match.Winner == 2 ? `"${teamsMap.get(Match.Team2)}"` : 'не указан';
        const score1 = Match.Score1 != -1 ? String(Match.Score1) : 'не указан';
        const score2 = Match.Score2 != -1 ? String(Match.Score2) : 'не указан';
        // Формируем FormData для отправки файла
        const formData = new FormData();
        formData.append('MatchId', selectedMatch);

        //console.log(`Удален матч "${teamsMap.get(Match.Team1)}" – "${teamsMap.get(Match.Team2)}" (Счет: ${score1}:${score2}. Победитель: ${winnerName}). Дата: ${Match.DateMatch}.`);

        try {
            const response = await fetch(`${urlServer}api/edit/match/removeMatch`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');
            }

            //const data = await response.json();
            //console.log('Ответ сервера:', data);

            fetch(`${urlServer}api/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: `${userId}`, actionType: 'Редактирование данных', actionDetails: `Удален матч "${teamsMap.get(Match.Team1)}" – "${teamsMap.get(Match.Team2)}" (Счет: ${score1}:${score2}. Победитель: ${winnerName}). Дата: ${Match.DateMatch}.` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshCompetitions();

            // Очистка формы
            setError('');
            setModalOpen(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const CompetitionItem = ({ competition }) => {
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
                    <p>Наведите курсор на матч в списке, чтобы узнать подробности матча</p>
                    <div>
                        <label className="form-label">
                            Матчи:
                            <select value={selectedMatch || ''}
                                onChange={(e) => setSelectedMatch(e.target.value)}>
                                <option key={0} value={0}>----------------------------</option>
                                {selectedCompetition?.matchs.map((match) => {
                                    const teamsMap = new Map(selectedCompetition?.teams.map(team => [team.TeamId, team.TeamName]));
                                    const score1 = match.Score1 != -1 ? String(match.Score1) : 'не указан';
                                    const score2 = match.Score2 != -1 ? String(match.Score2) : 'не указан';
                                    const winnerName = match.HaveWinner ? match.WinnerId == match.Team1 ? `"${String(teamsMap.get(match.Team1))}"` : `"${String(teamsMap.get(match.Team2))}"` : 'не указан';
                                    return (
                                        <option key={match.MatchId} value={match.MatchId} title={`Дата: ${match.DateMatch}\nСчет: ${score1}:${score2}\nПобедитель: ${winnerName}`}>
                                            {teamsMap.get(match.Team1)} – {teamsMap.get(match.Team2)}
                                        </option>
                                    )
                                })}
                            </select>
                        </label><br />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button className="btn-confirm" type="submit">Удалить</button>
                    <button className="btn-cancel" onClick={() => setModalOpen(false)}>Отмена</button>


                </form>
            </Modal>
        </div>
    );
}

function EditInfoMatch({ competitions, refreshCompetitions }) {
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
        const winnerNum = match.HaveWinner ? match.WinnerId == match.Team1 ? `1` : `2` : '0';
        setWinner(winnerNum);
        setDateMatch(difisFromPoint(match.DateMatch));
        setFirstScore(match.Score1 != -1 ? String(match.Score1) : '');
        setSecondScore(match.Score2 != -1 ? String(match.Score2) : '');
        setError('');
        setModalOpen(true);
    };

    const validateNumber = (num) => {
        // Проверяем, что введено число
        return /^\d+$/.test(num);
    };
    const validate = () => {
        /*if (winner === '0' || winner === '') {
            setError('Выберите команду победителя');
            return false;
        }*/
        if (dateMatch == "") {
            setError('Выберите дату матча');
            return false;
        }
        if (dateMatch == "") {
            setError('Выберите дату матча');
            return false;
        }
        /*if (firstScore == '') {
            setError('Не введен счет 1 комнады');
            return false;
        }*/
        if (firstScore != '' && !validateNumber(firstScore)) {
            setError('Счет 1 должен содержать только цифры');
            return false;
        }
        /*if (secondScore == '') {
            setError('Не введен счет 2 комнады');
            return false;
        }*/
        if (secondScore != '' && !validateNumber(secondScore)) {
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
        //console.log('Отправляем данные:', { firstTeam, secondTeam, winner, dateMatch, firstScore, secondScore, selectedMatch, selectedCompetition });

        const haveWinner = winner != '0' ? true : false;
        const teamsMap = new Map(selectedCompetition.teams.map(team => [String(team.TeamId), team.TeamName]));
        const winnerName = haveWinner ? winner == 1 ? `"${String(teamsMap.get(firstTeam))}"` : `"${String(teamsMap.get(secondTeam))}"` : 'не указан';
        const oldWinnerName = selectedMatch.HaveWinner ? selectedMatch.Winner == selectedMatch.Team1 ? `"${String(teamsMap.get(firstTeam))}"` : `"${String(teamsMap.get(secondTeam))}"` : 'не указан';
        const score1 = firstScore != ''  ? String(firstScore) : 'не указан';
        const score2 = secondScore != '' ? String(secondScore) : 'не указан';
        const oldScore1 = selectedMatch.Score1 != -1 ? String(selectedMatch.Score1) : 'не указан';
        const oldScore2 = selectedMatch.Score2 != -1 ? String(selectedMatch.Score2) : 'не указан';
        // Выводим имя и возраст в консоль

        // Формируем FormData для отправки файла
        const formData = new FormData();
        formData.append('MatchId', selectedMatch.MatchId);
        formData.append('TeamId1', firstTeam);
        formData.append('TeamId2', secondTeam);
        formData.append('WinnerId', winner);
        formData.append('DateMatch', dateMatch);
        formData.append('Score1', firstScore != '' ? firstScore : -1);
        formData.append('Score2', secondScore != '' ? secondScore : -1);

        //console.log(`Изменены данные матча "${teamsMap.get(firstTeam)}" – "${teamsMap.get(secondTeam)}". Счет: Был – ${oldScore1}:${oldScore2}; Стал – ${score1}:${score2}. Победитель: Был – ${oldWinnerName}; Стал – ${winnerName}. Дата: Была – ${selectedMatch.DateMatch}; Стала – ${pointFromDifis(dateMatch)}`);
        try {
            const response = await fetch(`${urlServer}api/edit/match/editDataMatch`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');
            }

            //const data = await response.json();
            //console.log('Ответ сервера:', data);

            fetch(`${urlServer}api/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: `${userId}`, actionType: 'Редактирование данных', actionDetails: `Изменены данные матча "${teamsMap.get(firstTeam)}" – "${teamsMap.get(secondTeam)}". Счет: Был – ${oldScore1}:${oldScore2}; Стал – ${score1}:${score2}. Победитель: Был – ${oldWinnerName}; Стал – ${winnerName}. Дата: Была – ${selectedMatch.DateMatch}; Стала – ${pointFromDifis(dateMatch)}` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshCompetitions();

            // Очистка формы
            setError('');
            setModalOpen(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const CompetitionItem = ({ competition }) => {
        return (
            <div>
                <div className="competition-with-match-item">
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
                                <MatchItem key={match.MatchId} match={match} competition={competition} onSelect={openModal} />
                        )})}
                    </div>
                </div>
            </div>
        );
    };

    const MatchItem = ({ match, competition }) => {
        const teamsMap = new Map(competition?.teams.map(team => [String(team.TeamId), team.TeamName]));
        const score1 = match.Score1 != -1 ? String(match.Score1) : 'не указан';
        const score2 = match.Score2 != -1 ? String(match.Score2) : 'не указан';
        const winnerName = match.HaveWinner ? match.WinnerId == match.Team1 ? `"${teamsMap.get(String(match.Team1))}"` : `"${teamsMap.get(String(match.Team2))}"` : 'не указан';

        return (
            <div>
                <button className="match-item" onClick={() => openModal(match)}>
                    <p>"{match.Team1Name}" – "{match.Team2Name}"</p>
                    <p>Счет: {score1} – {score2}</p>
                    <p>Победитель: {winnerName}</p>
                    <p>Дата матча: {match.DateMatch}</p>
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
                        <label className="form-label">
                            Команда победитель:
                            <select value={winner || '0'}
                                onChange={(e) => setWinner(e.target.value)}>
                                <option key={0} value={0}>---------</option>
                                <option key={1} value={1}>1 команда</option>
                                <option key={2} value={2}>2 команда</option>
                            </select>
                        </label><br />
                        <label className="form-label">
                            Дата матча:
                            <input
                                type="date"
                                value={dateMatch}
                                onChange={(e) => setDateMatch(e.target.value)}
                                className="form-input"
                            />
                        </label><br />
                        <label className="form-label">
                            Счет 1 команды:
                            <input
                                type="text"
                                value={firstScore}
                                onChange={(e) => setFirstScore(e.target.value)}
                                placeholder="Введите счет"
                                min="1"
                                className="form-input"
                            />
                        </label><br />
                        <label className="form-label">
                            Счет 2 команды:
                            <input
                                type="text"
                                value={secondScore}
                                onChange={(e) => setSecondScore(e.target.value)}
                                placeholder="Введите счет"
                                min="1"
                                className="form-input"
                            />
                        </label>

                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button className="btn-confirm" type="submit">Изменить</button>
                    <button className="btn-cancel" onClick={() => setModalOpen(false)}>Отмена</button>
                </form>
            </Modal>
        </div>
    );
}

const EditMatch = () => {
    const navigate = useNavigate();
    const [competitions, setCompetitions] = useState(null);

    const fetchCompetitions = () => {
        fetch(`${urlServer}api/getCompetitionsForEditMatch`)
            .then(res => res.json())
            .then(data => setCompetitions(data))
            .catch(err => console.error('Ошибка загрузки данных:', err));
    };

    useEffect(() => {
        fetchCompetitions();
    }, []);

    const handleClick = () => {
        navigate(`/ListTeams`);
    };

    const backClick = () => {
        navigate(`/EditData`);
    };

    /*const competitions = [
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
    ];*/

    const [activeSection, setActiveSection] = useState('home');

    // Контент для разных разделов
    const renderContent = () => {
        switch (activeSection) {
            case 'addMatch':
                return <AddMatch competitions={competitions} refreshCompetitions={fetchCompetitions} />;
            case 'removeMatch':
                return <RemoveMatch competitions={competitions} refreshCompetitions={fetchCompetitions} />;
            case 'editInfoMatch':
                return <EditInfoMatch competitions={competitions} refreshCompetitions={fetchCompetitions} />;
            default:
                return <div>Выберите раздел</div>;
        }
    };

    //if (!teams) return <div>Загрузка...</div>;

    return (
        <div className="edit-match-container">
            <button className="btn-back" onClick={handleClick}>Список команд</button>
            <button className="btn-back" onClick={backClick}>Назад</button>
            <h2>Выберите какую информацию в разделе матч хотите отредактироать</h2>
            <div className="buttons-group">
                <button className="btn-main" onClick={() => setActiveSection("addMatch")}>Добавление матча</button>
                <button className="btn-main" onClick={() => setActiveSection("removeMatch")}>Удаление матча</button>
                <button className="btn-main" onClick={() => setActiveSection("editInfoMatch")}>Изменение данных матча</button>
            </div>

            <hr />

            <div className="edit-match-content">
                {renderContent()}
            </div>
        </div>
    )
}

export default EditMatch