﻿import React, { useEffect, useState } from 'react';
import './EditTeam.css';
import { useNavigate } from 'react-router-dom';

/*

        НАДО ДОБАВИТЬ СВЯЗЬ С server.js
        
        СООБЩЕНИЕ ОБ УСПЕШНОСТИ
        */
/*
 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 ДОБАВИТЬ СЧИТЫВАНИЕ TG USER ID В ЛОГИ
 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 
 */

function AddTeam() {
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
            const response = await fetch('http://localhost:5000/api/edit/team/addTeam', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');

            }
            //const data = await response.json();
            //console.log('Ответ сервера:', data);

            fetch('http://localhost:5000/api/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'userId', actionType: 'Редактирование данных', actionDetails: `Создана команда ${NameTeam}` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            // Можно очистить форму после отправки
            setNameTeam('');
            setError('');
        } catch (err) {
            setError(err.message);
        }

        
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h3>Добавление команды</h3>
                <div>
                    <label>
                        Название команды: 
                        <input
                            type="text"
                            value={NameTeam}
                            onChange={(e) => setNameTeam(e.target.value)}
                            placeholder="Введите название команды"
                        />
                    </label>
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit">Добавить</button>
            </form>
        </div>
    );
}

function Modal({ isOpen, onClose, children}) {
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

function RemoveTeam({teams}) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [teamToRemove, setTeamToRemove] = useState(null);

    const removeTeam = async (team) => {
        //console.log(`Команда ${team.TeamName} с id ${team.TeamId} удалена`);

        const formData = new FormData();
        formData.append('TeamId', team.TeamId);

        try {
            const response = await fetch('http://localhost:5000/api/edit/team/removeTeam', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');

            }
            //const data = await response.json();
            //console.log('Ответ сервера:', data);

            fetch('http://localhost:5000/api/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'userId', actionType: 'Редактирование данных', actionDetails: `Команда ${team.TeamName} с id ${team.TeamId} удалена` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            // Можно очистить форму после отправки
            setModalOpen(false);
            setTeamToRemove(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const openModal = (team) => {
        setTeamToRemove(team);
        setModalOpen(true);
    };

    const TeamItem = ({ team }) => {

        /*
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        ДОБАВИТЬ СЧИТЫВАНИЕ TG USER ID В ЛОГИ
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        
        */

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

    return (
        <div>
            <form>
                <h3>Удаление команды</h3>
                <p>Нажмите на команду, которую хотите удалить</p>
                <TwoColumnScrollable items={teams}></TwoColumnScrollable>
            </form>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <h2>Всплывающее окно</h2>
                <p>Вы уверены что хотите удалить команду?</p>
                <button onClick={() => removeTeam(teamToRemove)}>Подтвердить</button>
                <button onClick={() => setModalOpen(false)}>Отмена</button>
            </Modal>
        </div>
    );
}

function EditNameTeam({ teams }) {
    /*
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        ДОБАВИТЬ СЧИТЫВАНИЕ TG USER ID В ЛОГИ
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        
        */
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
            const response = await fetch('http://localhost:5000/api/edit/team/editNameTeam', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');

            }
            //const data = await response.json();
            //console.log('Ответ сервера:', data);

            fetch('http://localhost:5000/api/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'userId', actionType: 'Редактирование данных', actionDetails: `Название команды ${team.TeamName} изменено на ${newName}` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

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

    return (
        <div>
            <h3>Изменение названия команды</h3>
            <p>Нажмите на команду, название которой хотите изменить</p>
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
                        <label>
                            Новое название команды:
                            <input
                                type="text"
                                value={NameTeam}
                                onChange={(e) => setNameTeam(e.target.value)}
                                placeholder="Введите название команды"
                                autoFocus
                            />
                        </label>
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type="submit">Изменить</button>
                    <button type="button" onClick={() => setModalOpen(false)}>
                        Отмена
                    </button>
                </form>
            </Modal>
        </div>
    );
}

function AddPlayerInTeam({ teams, allPlayers }) {
    
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
        const playersInTeamIds = new Set(team.players.map(player => player.PlayerId));
        const playersNotInTeam = allPlayers
            .filter(player => !playersInTeamIds.has(player.PlayerId))
            .map(player => ({ PlayerId: player.PlayerId, FIO: player.FIO || '' }));
        setPlayers(playersNotInTeam);
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
            const response = await fetch('http://localhost:5000/api/edit/team/addPlayerInTeam', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');

            }
            //const data = await response.json();
            //console.log('Ответ сервера:', data);

            fetch('http://localhost:5000/api/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'userId', actionType: 'Редактирование данных', actionDetails: `В команду ${team.TeamName} (TeamId = ${team.TeamId}) ${DateAdd} добавлен игрок ${FIO} с PlayerId = ${PlayerId}` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

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

    return (
        <div>
            <h3>Добавление игрока в команду</h3>
            <p>Нажмите на команду, в которую хотите добавить игрока</p>
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
                        <label>Игрок: </label>
                        <select value={PlayerId || ''}
                            onChange={(e) => setPlayerId(e.target.value)}>
                            <option key={0} value={0}>---------</option>
                            {players.map((player) => (
                                <option key={player.PlayerId} value={player.PlayerId}>
                                    {player.FIO}
                                </option>
                            ))}
                        </select><br />
                        <label>Дата добавления в команду: </label>
                        <label>
                            <input
                                type="date"
                                value={DateAdd}
                                onChange={(e) => setDateAdd(e.target.value)}
                            />
                        </label>
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type="submit">Добавить</button>
                    <button type="button" onClick={() => setModalOpen(false)}>
                        Отмена
                    </button>
                </form>
            </Modal>
        </div>
    );
}

function RemovePlayerInTeam({ teams, allPlayers }) {
    /*
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        ДОБАВИТЬ СЧИТЫВАНИЕ TG USER ID В ЛОГИ
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        
        */
    const [error, setError] = React.useState('');
    const [isModalOpen, setModalOpen] = React.useState(false);
    const [teamToEdit, setTeamToEdit] = React.useState(null);
    const [PlayerId, setPlayerId] = React.useState("");
    const [DateLeft, setDateLeft] = useState('');
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
        setPlayers(team.players);
        setModalOpen(true);
    };

    const removePlayerFromTeam = async (team, PlayerId) => {
        let FIO = '';
        allPlayers.forEach(player => {
            if (player.PlayerId == PlayerId) {
                FIO = player.FIO;
                return;
            }
        });
        //console.log(`Из команды ${team.TeamName} (${team.TeamId}) ${DateLeft} удален игрок ${FIO} с PlayerId ${PlayerId}`);

        const formData = new FormData();
        formData.append('TeamId', team.TeamId);
        formData.append('PlayerId', PlayerId);
        formData.append('DateLeft', DateLeft);
        try {
            const response = await fetch('http://localhost:5000/api/edit/team/removePlayerFromTeam', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');

            }
            //const data = await response.json();
            //console.log('Ответ сервера:', data);

            fetch('http://localhost:5000/api/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'userId', actionType: 'Редактирование данных', actionDetails: `Из команды ${team.TeamName} (TeamId = ${team.TeamId}) ${DateLeft} удален игрок ${FIO} с PlayerId = ${PlayerId}` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

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

    return (
        <div>
            <h3>Удаление игрока из команды</h3>
            <p>Нажмите на команду, из которой хотите удалить игрока</p>
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
                        <label>Игрок: </label>
                        <select value={PlayerId || ''}
                            onChange={(e) => setPlayerId(e.target.value)}>
                            <option key={0} value={0}>---------</option>
                            {players.map((player) => (
                                <option key={player.PlayerId} value={player.PlayerId}>
                                    {player.FIO}
                                </option>
                            ))}
                        </select><br />
                        <label>Дата выхода из команды: </label>
                        <label>
                            <input
                                type="date"
                                value={DateLeft}
                                onChange={(e) => setDateLeft(e.target.value)}
                            />
                        </label>
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type="submit">Удалить</button>
                    <button type="button" onClick={() => setModalOpen(false)}>
                        Отмена
                    </button>
                </form>
            </Modal>
        </div>
    );
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

    useEffect(() => {
        fetch('http://localhost:5000/api/edit/team/getTeams')
            .then(res => res.json())
            .then(data => setTeams(data))
            .catch(err => console.error('Ошибка загрузки данных:', err));

    }, []);

    const [allPlayers, setAllPlayers] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/edit/team/getAllPlayers')
            .then(res => res.json())
            .then(data => setAllPlayers(data))
            .catch(err => console.error('Ошибка загрузки данных:', err));

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
    ];*/

    // Состояние, которое хранит текущий выбранный раздел
    const [activeSection, setActiveSection] = useState('home');

    // Контент для разных разделов
    const renderContent = () => {
        switch (activeSection) {
            case 'addTeam':
                return <AddTeam />;
            case 'removeTeam':
                return <RemoveTeam teams={teams} />;
            case 'editNameTeam':
                return <EditNameTeam teams={teams} />;
            case 'addPlayerInTeam':
                return <AddPlayerInTeam teams={teams} allPlayers={allPlayers} />;
            case 'removePlayerFromTeam':
                return <RemovePlayerInTeam teams={teams} allPlayers={allPlayers} />;
            default:
                return <div>Выберите раздел</div>;
        }
    };

    //if (!teams) return <div>Загрузка...</div>;

    return (
        <div>
            <button className="back" onClick={handleClick}>Список команд</button>
            <button className="back" onClick={backClick}>Назад</button>
            <h2>Выберите какую информацию в разделе команда хотите отредактироать</h2>
            <button className="button" onClick={() => setActiveSection("addTeam")}>Добавление команды</button>
            <button className="button" onClick={() => setActiveSection("removeTeam")}>Удаление команды</button>
            <button className="button" onClick={() => setActiveSection("editNameTeam")}>Изменение названия команды</button>
            <button className="button" onClick={() => setActiveSection("addPlayerInTeam")}>Добавление игрока в команду</button>
            <button className="button" onClick={() => setActiveSection("removePlayerFromTeam")}>Удаление игрока из команды</button>

            <hr />

            <div>
                {renderContent()}
            </div>
        </div>
    )
}

export default EditTeam