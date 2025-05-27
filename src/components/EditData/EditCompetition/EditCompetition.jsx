import React, { useEffect, useState } from 'react';
import './EditCompetition.css';
import { useNavigate } from 'react-router-dom';

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
        // Проверяем, что название команды не содержит лишних символов
        return /^[A-Za-zА-Яа-яЁё0123456789\s]+$/.test(text);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // предотвращаем перезагрузку страницы

        if (NameCompetition == "") {
            setError('Необходимо ввести название соревнования');
            return;
        }

        if (DateStart == "") {
            setError('Необходимо выбрать дату соревнования');
            return;
        }

        // Валидация поля названия команды
        /*if (!validateText(NameCompetition)) {
            setError('Поле текста должно содержать только буквы, цифры и пробелы.');
            return;
        }*/

        //console.log('Отправляем данные:', { NameCompetition, DateStart });
        //console.log(`Добавлено соревнование "${NameCompetition}". Дата: ${DateStart}`);

        // Формируем FormData для отправки файла
        const formData = new FormData();
        formData.append('CompetitionName', NameCompetition);
        formData.append('DateStart', DateStart);

        try {
            const response = await fetch('http://localhost:5000/api/edit/competition/addCompetition', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');
            }

            //const data = await response.json();
            //console.log('Ответ сервера:', data);

            fetch('http://localhost:5000/api/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'userId', actionType: 'Редактирование данных', actionDetails: `Добавлено соревнование "${NameCompetition}". Дата: ${pointFromDifis(DateStart)}` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshCompetitions();

            // Очистка формы
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
                    <label>
                        Название соревнования:
                        <input
                            type="text"
                            value={NameCompetition}
                            onChange={(e) => setNameCompetition(e.target.value)}
                            placeholder="Введите название соревнования"
                        />
                    </label><br />
                    <label>
                        Дата начала соревнования:
                        <input
                            type="date"
                            value={DateStart}
                            onChange={(e) => setDateStart(e.target.value)}
                        />
                    </label>
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit">Добавить</button>
            </form>
        </div>
    );
}

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

function RemoveCompetition({ competitions, refreshCompetitions }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [competitionToRemove, setCompetitionToRemove] = useState(null);

    const removeCompetition = async (competition) => {
        //console.log(`Соревнование "${competition.CompetitionName}" (${competition.DateStart}) удалено`);

        // Формируем FormData для отправки файла
        const formData = new FormData();
        formData.append('CompetitionId', competition.CompetitionId);

        try {
            const response = await fetch('http://localhost:5000/api/edit/competition/removeCompetition', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');
            }

            //const data = await response.json();
            //console.log('Ответ сервера:', data);

            fetch('http://localhost:5000/api/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'userId', actionType: 'Редактирование данных', actionDetails: `Удалено соревнование "${competition.CompetitionName}" (${competition.DateStart}) c CompetitionId = ${competition.CompetitionId}` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshCompetitions();

            // Очистка формы
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
                <h2>Всплывающее окно</h2>
                <p>Вы уверены что хотите удалить соревнование?</p>
                <button onClick={() => removeCompetition(competitionToRemove)}>Подтвердить</button>
                <button onClick={() => setModalOpen(false)}>Отмена</button>
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

        // Выводим имя и возраст в консоль
        //console.log(`Соревнование изменено с ${competitionToEdit.CompetitionId} (${competitionToEdit.DateStart}) на ${NameCompetition} (${DateStart})`);

        // Формируем FormData для отправки файла
        const formData = new FormData();
        formData.append('CompetitionId', competitionToEdit.CompetitionId);
        formData.append('CompetitionName', NameCompetition);
        formData.append('DateStart', DateStart);

        try {
            const response = await fetch('http://localhost:5000/api/edit/competition/editDataCompetition', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');
            }

            //const data = await response.json();
            //console.log('Ответ сервера:', data);

            fetch('http://localhost:5000/api/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'userId', actionType: 'Редактирование данных', actionDetails: `Соревнование с CompetitionId = ${competitionToEdit.CompetitionId} – "${competitionToEdit.CompetitionName}" (${competitionToEdit.DateStart}) изменено на "${NameCompetition}" (${pointFromDifis(DateStart)})` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshCompetitions();

            // Очистка формы
            setCompetitionToEdit(null);
            setNameCompetition('');
            setDateStart('');
            setModalOpen(false);
            e.target.reset();
        } catch (err) {
            console.error(err.message);
        }
    };

    /*
    Добавить проверку на формат даты
    */
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
            <form onSubmit={handleSubmit}>
                <h3>Изменение данных о соревновании</h3>
                <p>Выберите соревнование для его редактирования</p>
                <div>
                    {competitions.map((competition) => (
                        <CompetitionItem key={competition.CompetitionId} competition={competition} />
                    ))}
                </div>

                <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                    <h2>Всплывающее окно</h2>
                    <div>
                        <label>
                            Название соревнования:
                            <input
                                type="text"
                                value={NameCompetition}
                                onChange={(e) => setNameCompetition(e.target.value)}
                                placeholder="Введите название соревнования"
                            />
                        </label><br />
                        <label>
                            Дата начала соревнования:
                            <input
                                type="date"
                                value={DateStart}
                                onChange={(e) => setDateStart(e.target.value)}
                            />
                        </label>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type="submit">Подтвердить</button>
                    <button onClick={() => setModalOpen(false)}>Отмена</button>
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
        // Проверяем, что введено число
        return /^\d+$/.test(num);
    };

    const handleCheckboxChange = (teamId) => {
        setSelectedTeams(prev => {
            const newSelected = { ...prev };
            if (newSelected[teamId]) {
                // Если уже выбран — снимаем выбор
                delete newSelected[teamId];
            } else {
                // Добавляем с пустым местом
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

        // Проверка: хотя бы одна команда выбрана
        if (Object.keys(selectedTeams).length === 0) {
            setError('Выберите хотя бы одну команду');
            return;
        }

        // Проверка: для каждой выбранной команды место заполнено
        for (const [teamId, data] of Object.entries(selectedTeams)) {
            /*if (!data.place.trim()) {
                setError('Введите место для всех выбранных команд');
                return;
            }*/
            if (data.place != '' && !validateNumber(data.place)) {
                setError('Место должно быть числом');
                return;
            }
        }

        setError('');

        // Формируем данные для отправки
        const result = Object.entries(selectedTeams).map(([teamId, data]) => ({
            TeamId: teamId,
            Place: data.place != '' ? data.place : '0',
        }));
        const teamsMap = new Map(availableTeams.map(team => [String(team.TeamId), team.TeamName]));

        const addTeams = result.map((entry) => {
            const place = entry.Place != '0' ? `${entry.Place} место` : 'место не указано';
            return `"${teamsMap.get(entry.TeamId)}" – ${place}`;
        }).join(', ');

        console.log(`В соревнование "${selectedCompetition.CompetitionName}" (CompetitionId = ${selectedCompetition.CompetitionId}) добавлены команды: ${addTeams}`);

        // Формируем FormData для отправки файла
        const formData = new FormData();
        formData.append('CompetitionId', selectedCompetition.CompetitionId);
        formData.append('entries', result);

        try {
            const response = await fetch('http://localhost:5000/api/edit/competition/addTeamInCompetition', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    CompetitionId: selectedCompetition.CompetitionId,
                    entries: result // предполагается, что result — массив или объект
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');
            }

            //const data = await response.json();
            //console.log('Ответ сервера:', data);

            fetch('http://localhost:5000/api/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'userId', actionType: 'Редактирование данных', actionDetails: `В соревнование "${selectedCompetition.CompetitionName}" (CompetitionId = ${selectedCompetition.CompetitionId}) добавлены команды: ${addTeams}` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshCompetitions();

            // Очистка формы
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
            <div>
                <h3>Добавление команд в соревнование</h3>
                <p>Выберите соревнование для добавления команд</p>
                <div>
                    {competitions.map((competition) => (
                        <CompetitionItem key={competition.CompetitionId} competition={competition} />
                    ))}
                </div>
                <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                    <h2>Добавление команд в {selectedCompetition?.CompetitionName}</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            {availableTeams.length === 0 && <p>Все команды уже добавлены в это соревнование.</p>}
                            {availableTeams.map(team => {
                                const isChecked = !!selectedTeams[team.TeamId];
                                return (
                                    <div key={team.TeamId} className="checkbox-wrapper">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleCheckboxChange(team.TeamId)}
                                            />
                                            {team.TeamName}
                                        </label>
                                        {isChecked && (<p>–   Место на соревновании:</p>)}
                                        {isChecked && (
                                            <input
                                                type="text"
                                                placeholder="Введите место"
                                                value={selectedTeams[team.TeamId]?.place || ''}
                                                onChange={(e) => handlePlaceChange(team.TeamId, e.target.value)}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        <button type="submit">Подтвердить</button>
                        <button type="button" onClick={() => setModalOpen(false)} style={{ marginLeft: 10 }}>
                            Отмена
                        </button>
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

    /*const handleSubmit = (e) => {
        e.preventDefault(); // предотвращаем перезагрузку страницы

        if (NameCompetition == "") {
            setError('Поле текста не должно быть пустым');
            return;
        }

        setError(''); // очистить ошибки

        /*

        НАДО ДОБАВИТЬ СВЯЗБ С server.js

        *\/
        // Здесь отправляем данные, например на сервер
        console.log('Отправляем данные:', { NameCompetition, DateStart });

        // Можно очистить форму после отправки
        setNameCompetition('');
    };*/

    const validateNumber = (num) => {
        // Проверяем, что введено число
        return /^\d+$/.test(num);
    };

    const handleCheckboxChange = (teamId) => {
        setSelectedTeams(prev => {
            const newSelected = { ...prev };
            if (newSelected[teamId]) {
                // Если уже выбран — снимаем выбор
                delete newSelected[teamId];
            } else {
                // Добавляем с пустым местом
                newSelected[teamId] = { checked: true, place: '' };
            }
            return newSelected;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Проверка: хотя бы одна команда выбрана
        if (Object.keys(selectedTeams).length === 0) {
            setError('Выберите хотя бы одну команду');
            return;
        }

        setError('');

        // Формируем данные для отправки
        const result = Object.entries(selectedTeams).map(([teamId, data]) => ({
            TeamId: teamId
        }));
        const teamsMap = new Map(availableTeams.map(team => [String(team.TeamId), team.TeamName]));

        const removeTeams = result.map((entry) => {
            return `"${teamsMap.get(entry.TeamId)}"`;
        }).join(', ');

        //console.log(`В соревновании "${selectedCompetition.CompetitionName}" (CompetitionId = ${selectedCompetition.CompetitionId}) удалены команды: ${removeTeams}`);

        try {
            const response = await fetch('http://localhost:5000/api/edit/competition/removeTeamFromCompetition', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    CompetitionId: selectedCompetition.CompetitionId,
                    entries: result // предполагается, что result — массив или объект
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');
            }

            //const data = await response.json();
            //console.log('Ответ сервера:', data);

            fetch('http://localhost:5000/api/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'userId', actionType: 'Редактирование данных', actionDetails: `В соревновании "${selectedCompetition.CompetitionName}" (CompetitionId = ${selectedCompetition.CompetitionId}) удалены команды: ${removeTeams}` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshCompetitions();

            // Очистка формы
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
            <div>
                <h3>Удаление команды из соревнования</h3>
                <p>Выберите соревнование для удаления из него команд</p>
                <div>
                    {competitions.map((competition) => (
                        <CompetitionItem key={competition.CompetitionId} competition={competition} />
                    ))}
                </div>
                <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                    <h2>Удаление команд из {selectedCompetition?.CompetitionName}</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
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
                                            />
                                            {team.TeamName}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>

                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        <button type="submit">Подтвердить</button>
                        <button type="button" onClick={() => setModalOpen(false)} style={{ marginLeft: 10 }}>
                            Отмена
                        </button>
                    </form>
                </Modal>
            </div>
        </div>
    );
}

function EditTeamPlaces({ competitions, refreshCompetitions }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [teamPlaces, setTeamPlaces] = useState({}); // { teamId: place }
    const [error, setError] = useState('');

    // Открываем модалку и загружаем команды с их текущими местами
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
        // Проверяем, что введено число
        return /^\d+$/.test(num);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Валидация: все места должны быть заполнены
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
            const oldPlace = teamsOldPlace.get(entry.TeamId) != '0' ? `${teamsOldPlace.get(entry.TeamId) } место` : 'место не указано';
            const newPlace = entry.Place != '0' ? `${entry.Place} место` : 'место не указано';
            return `"${teamsMap.get(entry.TeamId)}": ${oldPlace} изменено на ${newPlace}`;
        }).join(', ');

        // Здесь можно отправить данные на сервер
        //console.log(`В соревновании "${selectedCompetition.CompetitionName}" (CompetitionId = ${selectedCompetition.CompetitionId}) изменены места команд: ${removeTeams}`);

        try {
            const response = await fetch('http://localhost:5000/api/edit/competition/editTeamPlaces', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    CompetitionId: selectedCompetition.CompetitionId,
                    entries: result // предполагается, что result — массив или объект
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');
            }

            //const data = await response.json();
            //console.log('Ответ сервера:', data);

            fetch('http://localhost:5000/api/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'userId', actionType: 'Редактирование данных', actionDetails: `В соревновании "${selectedCompetition.CompetitionName}" (CompetitionId = ${selectedCompetition.CompetitionId}) изменены места команд: ${removeTeams}` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshCompetitions();

            // Очистка формы
            setModalOpen(false);
            e.target.reset();
        } catch (err) {
            console.error(err.message);
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
            <h3>Изменение места команды в соревновании</h3>
            <p>Выберите соревнование для редактирования мест команд</p>

            <div>
                {competitions.map(comp => (
                    <CompetitionItem key={comp.CompetitionId} competition={comp} onSelect={openModal} />
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <h2>Редактирование мест в {selectedCompetition?.CompetitionName}</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        {selectedCompetition?.teams.length === 0 && <p>В соревновании нет команд.</p>}
                        {selectedCompetition?.teams.map(team => (
                            <div key={team.TeamId} style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
                                <div>{team.TeamName}
                                    <input
                                        type="text"
                                        value={teamPlaces[team.TeamId] || ''}
                                        onChange={e => handlePlaceChange(team.TeamId, e.target.value)}
                                        style={{ width: 100, marginLeft: 10 }}
                                        placeholder="Введите место"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <button type="submit">Сохранить</button>
                    <button type="button" onClick={() => setModalOpen(false)} style={{ marginLeft: 10 }}>
                        Отмена
                    </button>
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
        fetch('http://localhost:5000/api/getCompetitionsForEditCompetition')
            .then(res => res.json())
            .then(data => setCompetitions(data))
            .catch(err => console.error('Ошибка загрузки данных:', err));
    };

    useEffect(() => {
        fetchCompetitions();
    }, []);

    useEffect(() => {
        fetch('http://localhost:5000/api/listTeams')
            .then(res => res.json())
            .then(data => setTeams(data))
            .catch(err => console.error('Ошибка загрузки данных:', err));

    }, []);

    /*const teams = [
        {
            TeamId: 1,
            TeamName: 'Navi',
        },
        {
            TeamId: 2,
            TeamName: 'DreamTeam',
        },
        {
            TeamId: 3,
            TeamName: 'Eteam',
        }
    ];*/

    /*const competitions = [
        { CompetitionId: 1, CompetitionName: 'Соревнование 1', DateStart: '17.05.2025', teams: [{ TeamId: 3, TeamName: 'Eteam', Place: 1 }] },
        {
            CompetitionId: 2, CompetitionName: 'Соревнование 2', DateStart: '20.05.2025', teams: [
                { TeamId: 1, TeamName: 'Navi', Place: 1 },
                { TeamId: 2, TeamName: 'DreamTeam', Place: 3 },
                { TeamId: 3, TeamName: 'Eteam', Place: 2 }]
        },
        { CompetitionId: 3, CompetitionName: 'Соревнование 3', DateStart: '22.05.2025', teams: [] }
    ];*/
    
    const handleClick = () => {
        navigate(`/ListTeams`);
    };

    const backClick = () => {
        navigate(`/EditData`);
    };

    // Состояние, которое хранит текущий выбранный раздел
    const [activeSection, setActiveSection] = useState('home');

    // Контент для разных разделов
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

    //if (!teams) return <div>Загрузка...</div>;

    return (
        <div>
            <button className="back" onClick={handleClick}>Список команд</button>
            <button className="back" onClick={backClick}>Назад</button>
            <h2>Выберите какую информацию в разделе соревнование хотите отредактироать</h2>
            <button className="button" onClick={() => setActiveSection("addCompetition")}>Добавление соревнования</button>
            <button className="button" onClick={() => setActiveSection("removeCompetition")}>Удаление соревнования</button>
            <button className="button" onClick={() => setActiveSection("editDataCompetition")}>Изменение данных соревнования</button>
            <button className="button" onClick={() => setActiveSection("addTeamInCompetition")}>Добавление команды в соревновании</button>
            <button className="button" onClick={() => setActiveSection("removeTeamFromCompetition")}>Удаление команды из соревнования</button>
            <button className="button" onClick={() => setActiveSection("editTeamPlaces")}>Изменение места команды в соревновании</button>

            <hr />

            <div>
                {renderContent()}
            </div>
        </div>
    )
}

export default EditCompetition