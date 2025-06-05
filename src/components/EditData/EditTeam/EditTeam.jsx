import React, { useEffect, useState } from 'react';
import './EditTeam.css';
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

const difisFromPoint = (datePoint) => {
    const d = datePoint.split(".")[0];
    const m = datePoint.split(".")[1];
    const y = datePoint.split(".")[2];
    return `${y}-${m}-${d}`;
};

function AddTeam({ refreshTeams }) {
    const [NameTeam, setNameTeam] = useState('');
    const [error, setError] = useState('');

    const validateText = (text) => {
        // Проверяем, что название команды не содержит лишних символов
        return /^[A-Za-zА-Яа-яЁё0123456789\s]+$/.test(text);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // предотвращаем перезагрузку страницы

        if (NameTeam == "") {
            setError('Поле текста не должно быть пустым');
            return;
        }

        // Валидация поля названия команды
        if (!validateText(NameTeam)) {
            setError('Поле текста должно содержать только буквы, цифры и пробелы.');
            return;
        }

        // Здесь отправляем данные, например на сервер
        //console.log('Отправляем данные:', { NameTeam });
        const formData = new FormData();
        formData.append('NameTeam', NameTeam);

        //console.log('formData:', formData);
        try {
            const response = await fetch(`${urlServer}api/edit/team/addTeam`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');

            }
            //const data = await response.json();
            //console.log('Ответ сервера:', data);

            fetch(`${urlServer}api/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: `${userId}`, actionType: 'Редактирование данных', actionDetails: `Создана команда ${NameTeam}` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshTeams();
            // Можно очистить форму после отправки
            setNameTeam('');
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <h3>Добавление команды</h3>
            <div>
                <label className="form-label">
                    Название команды:
                    <input
                        type="text"
                        value={NameTeam}
                        onChange={(e) => setNameTeam(e.target.value)}
                        placeholder="Введите название"
                        className="form-input"
                    />
                </label>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="btn-confirm">Добавить</button>
        </form>
    );
}

function Modal({ isOpen, onClose, children}) {
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

function RemoveTeam({ teams, refreshTeams }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [teamToRemove, setTeamToRemove] = useState(null);

    const removeTeam = async (team) => {
        //console.log(`Команда ${team.TeamName} с id ${team.TeamId} удалена`);

        const formData = new FormData();
        formData.append('TeamId', team.TeamId);

        try {
            const response = await fetch(`${urlServer}api/edit/team/removeTeam`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');

            }
            //const data = await response.json();
            //console.log('Ответ сервера:', data);

            fetch(`${urlServer}api/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: `${userId}`, actionType: 'Редактирование данных', actionDetails: `Команда ${team.TeamName} с id ${team.TeamId} удалена` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshTeams();
            // Можно очистить форму после отправки
            setModalOpen(false);
            setTeamToRemove(null);

        } catch (err) {
            console.error(err.message);
        }
    };

    const openModal = (team) => {
        setTeamToRemove(team);
        setModalOpen(true);
    };

    const TeamItem = ({ team }) => {
        return (
            <div>
                <button className="team-item" onClick={() => openModal(team)}>
                    <h3>{team.TeamName}</h3>
                </button>
            </div>
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

    if (!teams) return <div>Загрузка...</div>;

    return (
        <div>
            <form>
                <h3>Удаление команды</h3>
                <p>Выберите команду, которую хотите удалить</p>
                <TwoColumnScrollable items={teams}></TwoColumnScrollable>
            </form>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <p>Вы уверены что хотите удалить команду?</p>
                <div className="modal-buttons">
                    <button className="btn-confirm" onClick={() => removeTeam(teamToRemove)}>Подтвердить</button>
                    <button className="btn-cancel" onClick={() => setModalOpen(false)}>Отмена</button>
                </div>
            </Modal>
        </div>
    );
}

function EditNameTeam({ teams, refreshTeams }) {
    const [NameTeam, setNameTeam] = React.useState('');
    const [error, setError] = React.useState('');
    const [isModalOpen, setModalOpen] = React.useState(false);
    const [teamToEdit, setTeamToEdit] = React.useState(null);

    const validateText = (text) => /^[A-Za-zА-Яа-яЁё0123456789\s]+$/.test(text);

    const openModal = (team) => {
        setTeamToEdit(team);
        setNameTeam(team.TeamName); // инициализируем поле ввода текущим именем
        setError('');
        setModalOpen(true);
    };

    const editNameTeam = async (team, newName) => {
        //console.log(`Команда ${team.TeamName} теперь называется ${newName}`);
        // TODO: здесь отправьте запрос на сервер для обновления имени команды
        const formData = new FormData();
        formData.append('TeamId', team.TeamId);
        formData.append('NewTeamName', newName);

        try {
            const response = await fetch(`${urlServer}api/edit/team/editNameTeam`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');

            }
            //const data = await response.json();
            //console.log('Ответ сервера:', data);

            fetch(`${urlServer}api/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: `${userId}`, actionType: 'Редактирование данных', actionDetails: `Название команды ${team.TeamName} изменено на ${newName}` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshTeams();
            // Можно очистить форму после отправки
            setModalOpen(false);
            setTeamToEdit(null);
            setNameTeam('');
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (NameTeam.trim() === '') {
            setError('Поле текста не должно быть пустым');
            return;
        }

        if (!validateText(NameTeam)) {
            setError('Поле текста должно содержать только буквы, цифры и пробелы.');
            return;
        }

        setError('');
        editNameTeam(teamToEdit, NameTeam);
    };

    const TeamItem = ({ team }) => (
        <div>
            <button className="team-item" onClick={() => openModal(team)}>
                <h3>{team.TeamName}</h3>
            </button>
        </div>
    );

    if (!teams) return <div>Загрузка...</div>;

    return (
        <div>
            <h3>Изменение названия команды</h3>
            <p>Выберите команду, название которой хотите изменить</p>
            <div className="two-column-scrollable">
                {teams.map((team) => (
                    <TeamItem key={team.TeamId} team={team} />
                ))}
            </div>

            {/* Модальное окно рендерится один раз */}
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <div>
                        <p>Старое название команды: {teamToEdit?.TeamName}</p>
                        <label className="form-label">
                            Новое название команды:
                            <input
                                type="text"
                                value={NameTeam}
                                onChange={(e) => setNameTeam(e.target.value)}
                                placeholder="Введите название команды"
                                autoFocus
                                className="form-input"
                            />
                        </label>
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}
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

function AddPlayerInTeam({ teams, allPlayers, refreshTeams, refreshPlayers }) {

    const [error, setError] = React.useState('');
    const [isModalOpen, setModalOpen] = React.useState(false);
    const [teamToEdit, setTeamToEdit] = React.useState(null);
    const [DateAdd, setDateAdd] = useState('');
    const [PlayerId, setPlayerId] = React.useState("");
    const [players, setPlayers] = React.useState([]);

    const openModal = (team) => {
        setTeamToEdit(team);
        setPlayerId('0');
        setError('');
        let now = new Date();
        let day = String(now.getDate()).padStart(2, '0');
        let month = String(now.getMonth() + 1).padStart(2, '0');
        let year = now.getFullYear();
        let dateStr = `${year}-${month}-${day}`;
        setDateAdd(dateStr);
        /*const playersInTeamIds = new Set(team.players.map(player => player.PlayerId));
        const playersNotInTeam = allPlayers
            .filter(player => !playersInTeamIds.has(player.PlayerId))
            .map(player => ({ PlayerId: player.PlayerId, FIO: player.FIO || '' }));*/

        const playersInTeams = new Set();
        teams.forEach(team => {
            team.players.forEach(player => {
                playersInTeams.add(player.PlayerId);
            });
        });
        const playersWithoutTeam = allPlayers.filter(player => !playersInTeams.has(player.PlayerId));
        setPlayers(playersWithoutTeam);//playersNotInTeam
        setModalOpen(true);
    };

    const addPlayerInTeam = async (team, PlayerId) => {
        let FIO = '';
        allPlayers.forEach(player => {
            if (player.PlayerId == PlayerId) {
                FIO = player.FIO;
                return;
            }
        });
        //console.log(`В команду ${team.TeamName} (${team.TeamId}) добавлен игрок ${FIO} с PlayerId ${PlayerId}. Дата: ${DateAdd}`);

        const formData = new FormData();
        formData.append('TeamId', team.TeamId);
        formData.append('PlayerId', PlayerId);
        formData.append('DateAdd', DateAdd);
        try {
            const response = await fetch(`${urlServer}api/edit/team/addPlayerInTeam`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');

            }
            //const data = await response.json();
            //console.log('Ответ сервера:', data);

            fetch(`${urlServer}api/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: `${userId}`, actionType: 'Редактирование данных', actionDetails: `В команду ${team.TeamName} (TeamId = ${team.TeamId}) ${DateAdd} добавлен игрок ${FIO} с PlayerId = ${PlayerId}` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshTeams();
            await refreshPlayers();
            // Можно очистить форму после отправки
            setModalOpen(false);
            setTeamToEdit(null);
            setPlayerId('');
            setDateAdd('');
            setError('');

        } catch (err) {
            setError(err.message);
        }
    };

    const handlePlayerChange = (e) => {
        setPlayerId(e.target.value);
    };

    function isDateAvailable(selectedDateStr) {
        // Преобразуем выбранную дату из строки в Date
        const selectedDate = new Date(selectedDateStr.split('.').reverse().join('-')); // 'DD.MM.YYYY' → 'YYYY-MM-DD'

        let periods = [];
        allPlayers.forEach(player => {
            if (player.PlayerId == PlayerId) {
                periods = player.Dates;
                return;
            }
        });

        for (const period of periods) {
            const startDate = new Date(period.DateAdd.split('.').reverse().join('-'));
            const endDate = new Date(period.DateLeft.split('.').reverse().join('-'));

            // Проверяем, входит ли selectedDate в интервал [startDate, endDate]
            if (selectedDate >= startDate && selectedDate <= endDate) {
                return false; // Дата занята, не доступна
            }
        }

        return true; // Дата не попадает ни в один из интервалов
    }

    function datesInTeams() {
        let periods = [];
        allPlayers.forEach(player => {
            if (player.PlayerId == PlayerId) {
                periods = player.Dates;
                return;
            }
        });

        if (!periods || periods.length === 0) return '';

        return periods
            .map(({ DateAdd, DateLeft }) => `${DateAdd} - ${DateLeft}`)
            .join(', ');
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (PlayerId === '0' || PlayerId === '') {
            setError('Необходимо выбрать игрока');
            return;
        }

        if (DateAdd === '') {
            setError('Необходимо выбрать дату');
            return;
        }

        if (!isDateAvailable(DateAdd)) {
            setError(`Необходимо выбрать дату, когда игрок не находился в команде, периоды, когда игрок был в командах: ${datesInTeams()}`);
            return;
        }

        if (players)

        setError('');
        addPlayerInTeam(teamToEdit, PlayerId);
    };

    const TeamItem = ({ team }) => (
        <div>
            <button className="team-item" onClick={() => openModal(team)}>
                <h3>{team.TeamName}</h3>
            </button>
        </div>
    );
    if (!teams || !allPlayers) return <div>Загрузка...</div>;
    return (
        <div>
            <h3>Добавление игрока в команду</h3>
            <p>Выберите команду, в которую хотите добавить игрока</p>
            <div className="two-column-scrollable">
                {teams.map((team) => (
                    <TeamItem key={team.TeamId} team={team} />
                ))}
            </div>

            {/* Модальное окно рендерится один раз */}
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <div>
                        <p>Выберите участника для команды {teamToEdit?.TeamName}</p>
                        <label className="form-label">
                            Игрок:
                            <select value={PlayerId || ''}
                                onChange={(e) => setPlayerId(e.target.value)}>
                                <option className="form-input" key={0} value={0}>---------</option>
                                {players.map((player) => (
                                    <option key={player.PlayerId} value={player.PlayerId}>
                                        {player.FIO}
                                    </option>
                                ))}
                            </select>
                        </label><br />
                        <label></label>
                        <label className="form-label">
                            Дата добавления в команду:
                            <input
                                type="date"
                                value={DateAdd}
                                onChange={(e) => setDateAdd(e.target.value)}
                                className="form-input"
                            />
                        </label>
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
    );
}

function RemovePlayerInTeam({ teams, allPlayers, refreshTeams, refreshPlayers }) {
    const [error, setError] = React.useState('');
    const [isModalOpen, setModalOpen] = React.useState(false);
    const [teamToEdit, setTeamToEdit] = React.useState(null);
    const [PlayerId, setPlayerId] = React.useState("");
    const [DateLeft, setDateLeft] = useState('');
    const [nowDate, setNowDate] = useState('');
    const [players, setPlayers] = React.useState([]);

    const openModal = (team) => {
        setTeamToEdit(team);
        setPlayerId('');
        setError('');
        let now = new Date();
        let day = String(now.getDate()).padStart(2, '0');
        let month = String(now.getMonth() + 1).padStart(2, '0');
        let year = now.getFullYear();
        let dateStr = `${year}-${month}-${day}`;
        setDateLeft(dateStr);
        setNowDate(dateStr);
        setPlayers(team.players);
        setModalOpen(true);
    };

    const removePlayerFromTeam = async (team, PlayerId) => {
        let FIO = '';
        let periods = [];
        allPlayers.forEach(player => {
            if (player.PlayerId == PlayerId) {
                FIO = player.FIO;
                periods = player.Dates;
                return;
            }
        });

        const activePeriod = periods.length === 0 ? null : periods.find(period => period.DateLeft === null);
        //console.log(`Из команды ${team.TeamName} (${team.TeamId}) ${DateLeft} удален игрок ${FIO} с PlayerId ${PlayerId}`);

        const formData = new FormData();
        formData.append('TeamId', team.TeamId);
        formData.append('PlayerId', PlayerId);
        formData.append('DateLeft', DateLeft);
        formData.append('DateAdd', activePeriod.DateAdd);
        try {
            const response = await fetch(`${urlServer}api/edit/team/removePlayerFromTeam`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');

            }
            //const data = await response.json();
            //console.log('Ответ сервера:', data);

            fetch(`${urlServer}api/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: `${userId}`, actionType: 'Редактирование данных', actionDetails: `Из команды ${team.TeamName} (TeamId = ${team.TeamId}) ${DateLeft} удален игрок ${FIO} с PlayerId = ${PlayerId}` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshTeams();
            await refreshPlayers();
            // Можно очистить форму после отправки
            setModalOpen(false);
            setTeamToEdit(null);
            setPlayerId('');
            setDateLeft('');
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handlePlayerChange = (e) => {
        setPlayerId(e.target.value);
    };

    function datesInTeams() {
        let periods = [];
        allPlayers.forEach(player => {
            if (player.PlayerId == PlayerId) {
                periods = player.Dates;
                return;
            }
        });

        if (!periods || periods.length === 0) return '';

        return periods
            .map(({ DateAdd, DateLeft }) => {
                if (DateLeft == null) {
                    return `${DateAdd} - неизвестно`
                }
                return `${DateAdd} - ${DateLeft}`
            })
            .join(', ');
    }

    function isDateLeftValid(selectedDateLeftStr) {
        let periods = [];
        allPlayers.forEach(player => {
            if (player.PlayerId == PlayerId) {
                periods = player.Dates;
                return;
            }
        });

        const activePeriod = periods.find(period => period.DateLeft === null);
        const currentDateAddStr = activePeriod.DateAdd;
        // Преобразуем выбранную дату DateLeft и текущий DateAdd в Date
        const selectedDateLeft = new Date(selectedDateLeftStr.split('.').reverse().join('-'));
        const currentDateAdd = new Date(currentDateAddStr.split('.').reverse().join('-'));

        // Проверка 1: DateLeft должна быть позже DateAdd
        if (selectedDateLeft < currentDateAdd) {
            return { valid: false, message: `Дата выхода должна быть не позже даты добавления ${getActivePeriod()}` };
        }

        // Проверка 2: DateLeft не должна пересекаться с другими периодами
        for (const period of periods) {
            // Пропускаем текущий период (сравниваем по DateAdd)
            if (period.DateAdd === currentDateAddStr) continue;

            const periodStart = new Date(period.DateAdd.split('.').reverse().join('-'));
            const periodEnd = period.DateLeft ? new Date(period.DateLeft.split('.').reverse().join('-')) : null;

            // Проверяем, что selectedDateLeft не попадает внутрь другого периода
            // Если selectedDateLeft >= periodStart и selectedDateLeft <= periodEnd — пересечение
            if (selectedDateLeft >= periodStart && selectedDateLeft <= periodEnd) {
                return { valid: false, message: `Дата выхода пересекается с другим периодом` };
            }

            if (currentDateAdd <= periodStart && currentDateAdd <= periodEnd && selectedDateLeft >= periodStart && selectedDateLeft >= periodEnd) {
                return { valid: false, message: `При этой дате выхода новый период пересекается с другим периодом` };
            }
        }

        // Все проверки пройдены
        return { valid: true };
    }

    function getActivePeriod() {
        let periods = [];
        allPlayers.forEach(player => {
            if (player.PlayerId == PlayerId) {
                periods = player.Dates;
                return;
            }
        });
        if (!periods || periods.length === 0) return '';
        const activePeriod = periods.find(period => period.DateLeft === null);

        return `${activePeriod.DateAdd}`;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (PlayerId === '0' || PlayerId === '') {
            setError('Необходимо выбрать игрока');
            return;
        }

        if (DateLeft === '') {
            setError('Необходимо выбрать дату');
            return;
        }
        const { valid, message } = isDateLeftValid(DateLeft)
        if (!valid) {
            setError(message);
            return;
        }

        const leftD = new Date(Date.parse(DateLeft));
        const nowD = new Date(Date.parse(nowDate));
        if (leftD > nowD) {
            setError('Необходимо выбрать дату не позднее сегодняшней');
            return;
        }
        setError('');
        removePlayerFromTeam(teamToEdit, PlayerId);
    };

    const TeamItem = ({ team }) => (
        <div>
            <button className="team-item" onClick={() => openModal(team)}>
                <h3>{team.TeamName}</h3>
            </button>
        </div>
    );

    if (!teams || !allPlayers) return <div>Загрузка...</div>;

    return (
        <div>
            <h3>Удаление игрока из команды</h3>
            <p>Выберите команду, из которой хотите удалить игрока</p>
            <div className="two-column-scrollable">
                {teams.map((team) => (
                    <TeamItem key={team.TeamId} team={team} />
                ))}
            </div>

            {/* Модальное окно рендерится один раз */}
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <div>
                        <p>Выберите участника для команды {teamToEdit?.TeamName}</p>
                        <label className="form-label">
                            Игрок:
                            <select className="form-input" value={PlayerId || ''}
                                onChange={(e) => setPlayerId(e.target.value)}>
                                <option key={0} value={0}>---------</option>
                                {players.map((player) => (
                                    <option key={player.PlayerId} value={player.PlayerId}>
                                        {player.FIO}
                                    </option>
                                ))}
                            </select>
                        </label><br />
                        <label className="form-label">
                            Дата выхода из команды:
                            <input
                                type="date"
                                value={DateLeft}
                                onChange={(e) => setDateLeft(e.target.value)}
                                className="form-input"
                            />
                        </label>
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="modal-buttons">
                        <button className="btn-confirm" type="submit">Удалить</button>
                        <button className="btn-cancel" type="button" onClick={() => setModalOpen(false)}>
                            Отмена
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}


const EditTeam = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/ListTeams`);
    };

    const backClick = () => {
        navigate(`/EditData`);
    };

    const [teams, setTeams] = useState(null);

    const fetchTeams = () => {
        fetch(`${urlServer}api/edit/team/getTeams`)
            .then(res => res.json())
            .then(data => setTeams(data))
            .catch(err => console.error('Ошибка загрузки данных:', err));
    };
    
    useEffect(() => {
        fetchTeams();
    }, []);

    /*useEffect(() => {
        fetch(`${urlServer}api/edit/team/getTeams`)
            .then(res => res.json())
            .then(data => setTeams(data))
            .catch(err => console.error('Ошибка загрузки данных:', err));
 
    }, []);*/

    const [allPlayers, setAllPlayers] = useState(null);

    const fetchPlayers = () => {
        fetch(`${urlServer}api/getAllPlayers`)
            .then(res => res.json())
            .then(data => setAllPlayers(data))
            .catch(err => console.error('Ошибка загрузки данных:', err));
    };

    useEffect(() => {
        fetchPlayers();
    }, []);

    /*const teams = [
        { TeamId: 1, TeamName: 'Navi', players: [
                { PlayerId: 1, FIO: 'Иванов2 Иван2 Иванович2'},
                { PlayerId: 5, FIO: 'Иванов5 Иван5 Иванович5' }]
        },
        { TeamId: 2, TeamName: 'DreamTeam', players: [
                { PlayerId: 3, FIO: 'Иванов23 Иван23 Иванович23' }]
        },
        { TeamId: 3, TeamName: 'Eteam', players: []
        }
    ];*/

    /*const allPlayers = [
        { PlayerId: 1, FIO: 'Иванов2 Иван2 Иванович2' },
        { PlayerId: 3, FIO: 'Иванов23 Иван23 Иванович23' },
        { PlayerId: 5, FIO: 'Иванов5 Иван5 Иванович5' }
        { PlayerId: 7, FIO: 'Иванов7 Иван7 Иванович7' }
    ];*/

    // Состояние, которое хранит текущий выбранный раздел
    const [activeSection, setActiveSection] = useState('home');

    // Контент для разных разделов
    const renderContent = () => {
        switch (activeSection) {
            case 'addTeam':
                return <AddTeam refreshTeams={fetchTeams} />;
            case 'removeTeam':
                return <RemoveTeam teams={teams} refreshTeams={fetchTeams} />;
            case 'editNameTeam':
                return <EditNameTeam teams={teams} refreshTeams={fetchTeams} />;
            case 'addPlayerInTeam':
                return <AddPlayerInTeam teams={teams} allPlayers={allPlayers} refreshTeams={fetchTeams} refreshPlayers={fetchPlayers} />;
            case 'removePlayerFromTeam':
                return <RemovePlayerInTeam teams={teams} allPlayers={allPlayers} refreshTeams={fetchTeams} refreshPlayers={fetchPlayers} />;
            default:
                return <div>Выберите раздел</div>;
        }
    };

    return (
        <div className="edit-team-container">
            <button className="btn-back" onClick={handleClick}>Список команд</button>
            <button className="btn-back" onClick={backClick}>Назад</button>
            <h2 className="edit-team-title">Выберите какую информацию в разделе команда хотите отредактироать</h2>
            <div className="buttons-group">
                <button className="btn-main" onClick={() => setActiveSection("addTeam")}>Добавление команды</button>
                <button className="btn-main" onClick={() => setActiveSection("removeTeam")}>Удаление команды</button>
                <button className="btn-main" onClick={() => setActiveSection("editNameTeam")}>Изменение названия команды</button>
                <button className="btn-main" onClick={() => setActiveSection("addPlayerInTeam")}>Добавление игрока в команду</button>
                <button className="btn-main" onClick={() => setActiveSection("removePlayerFromTeam")}>Удаление игрока из команды</button>
            </div>
            <hr />

            <div>
                {renderContent()}
            </div>
        </div>
    )
}

export default EditTeam