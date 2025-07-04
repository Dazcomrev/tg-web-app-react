﻿import React, { useEffect, useState } from 'react';
import './EditCompetition.css';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../../hooks/useTelegram';
import { useURL } from '../../../hooks/URLs';
const { urlServer } = useURL();
const { userId } = useTelegram();

const pointFromDifis = (dateDifis) => {
    const y = dateDifis.split("-")[0];
    const m = dateDifis.split("-")[1];
    const d = dateDifis.split("-")[2];
    return `${d}.${m}.${y}`;
};
function AddCompetition({ refreshCompetitions }) {
    const [NameCompetition, setNameCompetition] = useState('');
    const [DateStart, setDateStart] = useState('');
    const [error, setError] = useState('');

    const validateText = (text) => {
        return /^[A-Za-zА-Яа-яЁё0123456789\s]+$/.test(text);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (NameCompetition == "") {
            setError('Необходимо ввести название соревнования');
            return;
        }

        if (DateStart == "") {
            setError('Необходимо выбрать дату соревнования');
            return;
        }

        const formData = new FormData();
        formData.append('CompetitionName', NameCompetition);
        formData.append('DateStart', DateStart);

        try {
            const response = await fetch(`${urlServer}api/edit/competition/addCompetition`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');
            }

            fetch(`${urlServer}api/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: `${userId}`, actionType: 'Редактирование данных', actionDetails: `Добавлено соревнование "${NameCompetition}". Дата: ${pointFromDifis(DateStart)}` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshCompetitions();

            setError('');
            setNameCompetition('');
            setDateStart('');
            e.target.reset();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h3>Добавление соревнования</h3>
                <div>
                    <label className="form-label">
                        Название соревнования:
                        <input
                            type="text"
                            value={NameCompetition}
                            onChange={(e) => setNameCompetition(e.target.value)}
                            placeholder="Введите название соревнования"
                            className="form-input"
                        />
                    </label><br />
                    <label className="form-label">
                        Дата начала соревнования:
                        <input
                            type="date"
                            value={DateStart}
                            onChange={(e) => setDateStart(e.target.value)}
                            className="form-input"
                        />
                    </label>
                </div>

                {error && <p className="error-message">{error}</p>}

                <button className="btn-confirm" type="submit">Добавить</button>
            </form>
        </div>
    );
}

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

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

function RemoveCompetition({ competitions, refreshCompetitions }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [competitionToRemove, setCompetitionToRemove] = useState(null);

    const removeCompetition = async (competition) => {
        const formData = new FormData();
        formData.append('CompetitionId', competition.CompetitionId);

        try {
            const response = await fetch(`${urlServer}api/edit/competition/removeCompetition`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');
            }

            fetch(`${urlServer}api/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: `${userId}`, actionType: 'Редактирование данных', actionDetails: `Удалено соревнование "${competition.CompetitionName}" (${competition.DateStart}) c CompetitionId = ${competition.CompetitionId}` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshCompetitions();

            setModalOpen(false);
            setCompetitionToRemove(null);
        } catch (err) {
            console.error(err.message);
        }
    };

    const openModal = (competition) => {
        setCompetitionToRemove(competition);
        setModalOpen(true);
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
            <form>
                <h3>Удаление соревнования</h3>
                <p>Выберите соревнование, которое хотите удалить</p>
                <div>
                    {competitions.map((competition) => (
                        <CompetitionItem key={competition.CompetitionId} competition={competition} />
                    ))}
                </div>
            </form>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <h3>Удаление соревнования</h3>
                <p>Вы уверены что хотите удалить соревнование {competitionToRemove?.CompetitionName}?</p>
                <div className="modal-buttons">
                    <button className="btn-confirm" onClick={() => removeCompetition(competitionToRemove)}>Подтвердить</button>
                    <button className="btn-cancel" onClick={() => setModalOpen(false)}>Отмена</button>
                </div>
            </Modal>
        </div>
    );
}

function EditDataCompetition({ competitions, refreshCompetitions }) {
    const [NameCompetition, setNameCompetition] = useState('');
    const [DateStart, setDateStart] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [competitionToEdit, setCompetitionToEdit] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (NameCompetition == "") {
            setError('Необходимо ввести название соревнования');
            return;
        }

        if (DateStart == "") {
            setError('Необходимо выбрать дату соревнования');
            return;
        }

        const formData = new FormData();
        formData.append('CompetitionId', competitionToEdit.CompetitionId);
        formData.append('CompetitionName', NameCompetition);
        formData.append('DateStart', DateStart);

        try {
            const response = await fetch(`${urlServer}api/edit/competition/editDataCompetition`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');
            }

            fetch(`${urlServer}api/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: `${userId}`, actionType: 'Редактирование данных', actionDetails: `Соревнование с CompetitionId = ${competitionToEdit.CompetitionId} – "${competitionToEdit.CompetitionName}" (${competitionToEdit.DateStart}) изменено на "${NameCompetition}" (${pointFromDifis(DateStart)})` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshCompetitions();

            setCompetitionToEdit(null);
            setNameCompetition('');
            setDateStart('');
            setModalOpen(false);
            e.target.reset();
        } catch (err) {
            console.error(err.message);
        }
    };

    const difisFromPoint = (datePoint) => {
        const d = datePoint.split(".")[0];
        const m = datePoint.split(".")[1];
        const y = datePoint.split(".")[2];
        return `${y}-${m}-${d}`;
    };

    const openModal = (competition) => {
        setCompetitionToEdit(competition);
        setNameCompetition(competition.CompetitionName);
        setDateStart(difisFromPoint(competition.DateStart));
        setModalOpen(true);
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
            <form onSubmit={handleSubmit}>
                <h3>Изменение данных о соревновании</h3>
                <p>Выберите соревнование для его редактирования</p>
                <div>
                    {competitions.map((competition) => (
                        <CompetitionItem key={competition.CompetitionId} competition={competition} />
                    ))}
                </div>

                <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                    <h3>Изменение соревнования</h3>
                    <div>
                        <label className="form-label">
                            Название соревнования:
                            <input
                                type="text"
                                value={NameCompetition}
                                onChange={(e) => setNameCompetition(e.target.value)}
                                placeholder="Введите название соревнования"
                                className="form-input"
                            />
                        </label><br />
                        <label className="form-label">
                            Дата начала соревнования:
                            <input
                                type="date"
                                value={DateStart}
                                onChange={(e) => setDateStart(e.target.value)}
                                className="form-input"
                            />
                        </label>
                    </div>
                    {error && <p className="error-message">{error}</p>}

                    <div className="modal-buttons">
                        <button className="btn-confirm" type="submit">Изменить</button>
                        <button className="btn-cancel" onClick={() => setModalOpen(false)}>Отмена</button>
                    </div>
                </Modal>
            </form>
        </div>
    );
}

function AddTeamInCompetition({ competitions, teams, refreshCompetitions }) {
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [availableTeams, setAvailableTeams] = React.useState([]);
    const [selectedTeams, setSelectedTeams] = useState({});
    const [isModalOpen, setModalOpen] = useState(false);
    const [error, setError] = useState('');

    const validateNumber = (num) => {
        return /^\d+$/.test(num);
    };

    const handleCheckboxChange = (teamId) => {
        setSelectedTeams(prev => {
            const newSelected = { ...prev };
            if (newSelected[teamId]) {
                delete newSelected[teamId];
            } else {
                newSelected[teamId] = { checked: true, place: '' };
            }
            return newSelected;
        });
    };

    const handlePlaceChange = (teamId, value) => {
        setSelectedTeams(prev => ({
            ...prev,
            [teamId]: {
                ...prev[teamId],
                place: value,
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Object.keys(selectedTeams).length === 0) {
            setError('Выберите хотя бы одну команду');
            return;
        }

        for (const [teamId, data] of Object.entries(selectedTeams)) {
            if (data.place != '' && !validateNumber(data.place)) {
                setError('Место должно быть числом');
                return;
            }
        }

        setError('');

        const result = Object.entries(selectedTeams).map(([teamId, data]) => ({
            TeamId: teamId,
            Place: data.place != '' ? data.place : '0',
        }));
        const teamsMap = new Map(availableTeams.map(team => [String(team.TeamId), team.TeamName]));

        const addTeams = result.map((entry) => {
            const place = entry.Place != '0' ? `${entry.Place} место` : 'место не указано';
            return `"${teamsMap.get(entry.TeamId)}" – ${place}`;
        }).join(', ');

        const formData = new FormData();
        formData.append('CompetitionId', selectedCompetition.CompetitionId);
        formData.append('entries', result);

        try {
            const response = await fetch(`${urlServer}api/edit/competition/addTeamInCompetition`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    CompetitionId: selectedCompetition.CompetitionId,
                    entries: result
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');
            }

            fetch(`${urlServer}api/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: `${userId}`, actionType: 'Редактирование данных', actionDetails: `В соревнование "${selectedCompetition.CompetitionName}" (CompetitionId = ${selectedCompetition.CompetitionId}) добавлены команды: ${addTeams}` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshCompetitions();

            setModalOpen(false);
            e.target.reset();
        } catch (err) {
            console.error(err.message);
        }
    };

    const openModal = (competition) => {
        setSelectedCompetition(competition);
        const teamsInCompetitionIds = new Set(competition.teams.map(team => team.TeamId));
        const teamsNotInCompetition = teams
            .filter(team => !teamsInCompetitionIds.has(team.TeamId))
            .map(team => ({ TeamId: team.TeamId, TeamName: team.TeamName || '' }));
        setAvailableTeams(teamsNotInCompetition);
        setSelectedTeams({});
        setError('');
        setModalOpen(true);
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
            <div>
                <h3>Добавление команд в соревнование</h3>
                <p>Выберите соревнование для добавления команд</p>
                <div>
                    {competitions.map((competition) => (
                        <CompetitionItem key={competition.CompetitionId} competition={competition} />
                    ))}
                </div>
                <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                    <h3>Добавление команд в {selectedCompetition?.CompetitionName}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-container">
                            {availableTeams.length === 0 && <p>Все команды уже добавлены в это соревнование.</p>}
                            {availableTeams.map(team => {
                                const isChecked = !!selectedTeams[team.TeamId];
                                return (
                                    <div key={team.TeamId}>
                                        <div className="checkbox-wrapper">
                                            <label>

                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => handleCheckboxChange(team.TeamId)}
                                                    className="form-input"
                                                />
                                            </label>
                                            <label>{team.TeamName}</label>
                                        </div>
                                        <label className="form-label">
                                            {isChecked && (<p>Место:</p>)}
                                            {isChecked && (
                                                <input
                                                    type="text"
                                                    placeholder="Введите место"
                                                    value={selectedTeams[team.TeamId]?.place || ''}
                                                    onChange={(e) => handlePlaceChange(team.TeamId, e.target.value)}
                                                    className="form-input"
                                                />
                                            )}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <div className="modal-buttons">
                            <button className="btn-confirm" type="submit">Добавить</button>
                            <button className="btn-cancel" type="button" onClick={() => setModalOpen(false)}>
                                Отмена
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    );
}

function RemoveTeamFromCompetition({ competitions, teams, refreshCompetitions }) {
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [availableTeams, setAvailableTeams] = React.useState([]);
    const [selectedTeams, setSelectedTeams] = useState({});
    const [isModalOpen, setModalOpen] = useState(false);
    const [error, setError] = useState('');

    const validateNumber = (num) => {
        return /^\d+$/.test(num);
    };

    const handleCheckboxChange = (teamId) => {
        setSelectedTeams(prev => {
            const newSelected = { ...prev };
            if (newSelected[teamId]) {
                delete newSelected[teamId];
            } else {
                newSelected[teamId] = { checked: true, place: '' };
            }
            return newSelected;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Object.keys(selectedTeams).length === 0) {
            setError('Выберите хотя бы одну команду');
            return;
        }

        setError('');

        const result = Object.entries(selectedTeams).map(([teamId, data]) => ({
            TeamId: teamId
        }));
        const teamsMap = new Map(availableTeams.map(team => [String(team.TeamId), team.TeamName]));

        const removeTeams = result.map((entry) => {
            return `"${teamsMap.get(entry.TeamId)}"`;
        }).join(', ');

        try {
            const response = await fetch(`${urlServer}api/edit/competition/removeTeamFromCompetition`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    CompetitionId: selectedCompetition.CompetitionId,
                    entries: result
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');
            }

            fetch(`${urlServer}api/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: `${userId}`, actionType: 'Редактирование данных', actionDetails: `В соревновании "${selectedCompetition.CompetitionName}" (CompetitionId = ${selectedCompetition.CompetitionId}) удалены команды: ${removeTeams}` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshCompetitions();

            setModalOpen(false);
            e.target.reset();
        } catch (err) {
            console.error(err.message);
        }
    };

    const openModal = (competition) => {
        setSelectedCompetition(competition);
        const filteredTeams = [];
        competition.teams.forEach(team => {
            filteredTeams.push({ TeamId: team?.TeamId, TeamName: team?.TeamName || '' });
        });
        setAvailableTeams(filteredTeams);
        setSelectedTeams({});
        setError('');
        setModalOpen(true);
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
            <div>
                <h3>Удаление команды из соревнования</h3>
                <p>Выберите соревнование для удаления из него команд</p>
                <div>
                    {competitions.map((competition) => (
                        <CompetitionItem key={competition.CompetitionId} competition={competition} />
                    ))}
                </div>
                <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                    <h3>Удаление команд из {selectedCompetition?.CompetitionName}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-container">
                            {availableTeams.length === 0 && <p>В соревновании нет команд.</p>}
                            {availableTeams.map(team => {
                                const isChecked = !!selectedTeams[team.TeamId];
                                return (
                                    <div key={team.TeamId} className="checkbox-wrapper">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleCheckboxChange(team.TeamId)}
                                                className="form-input"
                                            />
                                        </label>
                                        <label>{team.TeamName}</label>
                                    </div>
                                );
                            })}
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <div className="modal-buttons">
                            <button className="btn-confirm" type="submit">Удалить</button>
                            <button className="btn-cancel" type="button" onClick={() => setModalOpen(false)}>
                                Отмена
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    );
}

function EditTeamPlaces({ competitions, refreshCompetitions }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [teamPlaces, setTeamPlaces] = useState({});
    const [error, setError] = useState('');

    const openModal = (competition) => {
        setSelectedCompetition(competition);
        const places = {};
        competition.teams.forEach(team => {
            places[team.TeamId] = team.Place != 0 ? String(team.Place) : '';
        });
        setTeamPlaces(places);

        setError('');
        setModalOpen(true);
    };

    const handlePlaceChange = (teamId, value) => {
        setTeamPlaces(prev => ({
            ...prev,
            [teamId]: value,
        }));
    };

    const validateNumber = (num) => {
        return /^\d+$/.test(num);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        for (const [teamId, place] of Object.entries(teamPlaces)) {
            if (place != '' && !validateNumber(place)) {
                setError('Место должно быть числом');
                return;
            }
        }

        setError('');
        const result = Object.entries(teamPlaces).map(([teamId, place]) => ({
            TeamId: teamId,
            Place: place != '' ? place : '0'
        }));

        const teamsMap = new Map(selectedCompetition.teams.map(team => [String(team.TeamId), team.TeamName]));
        const teamsOldPlace = new Map(selectedCompetition.teams.map(team => [String(team.TeamId), team.Place]));
        const removeTeams = result.map((entry) => {
            const oldPlace = teamsOldPlace.get(entry.TeamId) != '0' ? `${teamsOldPlace.get(entry.TeamId)} место` : 'место не указано';
            const newPlace = entry.Place != '0' ? `${entry.Place} место` : 'место не указано';
            return `"${teamsMap.get(entry.TeamId)}": ${oldPlace} изменено на ${newPlace}`;
        }).join(', ');

        try {
            const response = await fetch(`${urlServer}api/edit/competition/editTeamPlaces`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    CompetitionId: selectedCompetition.CompetitionId,
                    entries: result
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');
            }

            fetch(`${urlServer}api/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: `${userId}`, actionType: 'Редактирование данных', actionDetails: `В соревновании "${selectedCompetition.CompetitionName}" (CompetitionId = ${selectedCompetition.CompetitionId}) изменены места команд: ${removeTeams}` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshCompetitions();

            setModalOpen(false);
            e.target.reset();
        } catch (err) {
            console.error(err.message);
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
            <h3>Изменение места команды в соревновании</h3>
            <p>Выберите соревнование для редактирования мест команд</p>

            <div>
                {competitions.map(comp => (
                    <CompetitionItem key={comp.CompetitionId} competition={comp} onSelect={openModal} />
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <h3>Редактирование мест в {selectedCompetition?.CompetitionName}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-container">
                        {selectedCompetition?.teams.length === 0 && <p>В соревновании нет команд.</p>}
                        {selectedCompetition?.teams.map(team => (
                            <div key={team.TeamId} className="team-row">
                                <span className="team-name">{team.TeamName} – </span>
                                <input
                                    type="text"
                                    value={teamPlaces[team.TeamId] || ''}
                                    onChange={e => handlePlaceChange(team.TeamId, e.target.value)}
                                    placeholder="Введите место"
                                    className="form-input team-input"
                                />
                            </div>
                        ))}
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <div className="modal-buttons">
                        <button className="btn-confirm" type="submit">Изменить</button>
                        <button className="btn-cancel" type="button" onClick={() => setModalOpen(false)}>
                            Отмена
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

const EditCompetition = () => {
    const navigate = useNavigate();
    const [competitions, setCompetitions] = useState(null);
    const [teams, setTeams] = useState(null);

    const fetchCompetitions = () => {
        fetch(`${urlServer}api/getCompetitionsForEditCompetition`)
            .then(res => res.json())
            .then(data => setCompetitions(data))
            .catch(err => console.error('Ошибка загрузки данных:', err));
    };

    useEffect(() => {
        fetchCompetitions();
    }, []);

    useEffect(() => {
        fetch(`${urlServer}api/listTeams`)
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

    const [activeSection, setActiveSection] = useState('home');

    const renderContent = () => {
        switch (activeSection) {
            case 'addCompetition':
                return <AddCompetition refreshCompetitions={fetchCompetitions} />;
            case 'removeCompetition':
                return <RemoveCompetition competitions={competitions} refreshCompetitions={fetchCompetitions} />;
            case 'editDataCompetition':
                return <EditDataCompetition competitions={competitions} refreshCompetitions={fetchCompetitions} />;
            case 'addTeamInCompetition':
                return <AddTeamInCompetition competitions={competitions} teams={teams} refreshCompetitions={fetchCompetitions} />;
            case 'removeTeamFromCompetition':
                return <RemoveTeamFromCompetition competitions={competitions} teams={teams} refreshCompetitions={fetchCompetitions} />;
            case 'editTeamPlaces':
                return <EditTeamPlaces competitions={competitions} refreshCompetitions={fetchCompetitions} />
            default:
                return <div>Выберите раздел</div>;
        }
    };

    return (
        <div className="edit-match-container">
            <button className="btn-back" onClick={handleClick}>Список команд</button>
            <button className="btn-back" onClick={backClick}>Назад</button>
            <h2>Выберите какую информацию в разделе соревнование хотите отредактироать</h2>
            <div className="buttons-group">
                <button className="btn-main" onClick={() => setActiveSection("addCompetition")}>Добавление соревнования</button>
                <button className="btn-main" onClick={() => setActiveSection("removeCompetition")}>Удаление соревнования</button>
                <button className="btn-main" onClick={() => setActiveSection("editDataCompetition")}>Изменение данных соревнования</button>
                <button className="btn-main" onClick={() => setActiveSection("addTeamInCompetition")}>Добавление команды в соревновании</button>
                <button className="btn-main" onClick={() => setActiveSection("removeTeamFromCompetition")}>Удаление команды из соревнования</button>
                <button className="btn-main" onClick={() => setActiveSection("editTeamPlaces")}>Изменение места команды в соревновании</button>
            </div>

            <hr />

            <div>
                {renderContent()}
            </div>
        </div>
    )
}

export default EditCompetition