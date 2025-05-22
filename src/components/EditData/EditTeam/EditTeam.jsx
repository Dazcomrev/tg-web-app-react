import React, { useEffect, useState } from 'react';
import './EditTeam.css';
import { useNavigate } from 'react-router-dom';

/*

        НАДО ДОБАВИТЬ СВЯЗЬ С server.js
        
        СООБЩЕНИЕ ОБ УСПЕШНОСТИ
        */

function AddTeam() {
    const [NameTeam, setNameTeam] = useState('');
    const [error, setError] = useState('');

    const validateText = (text) => {
        // Проверяем, что название команды не содержит лишних символов
        return /^[A-Za-zА-Яа-яЁё0123456789\s]+$/.test(text);
    };

    const handleSubmit = (e) => {
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

        setError(''); // очистить ошибки

        /*

        НАДО ДОБАВИТЬ СВЯЗБ С server.js

        */
        // Здесь отправляем данные, например на сервер
        console.log('Отправляем данные:', { NameTeam });

        // Можно очистить форму после отправки
        setNameTeam('');
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

    const removeTeam = (team) => {
        console.log(`Команда ${team.TeamName} с id ${team.TeamId} удалена`);
        setModalOpen(false);
        setTeamToRemove(null);
        /*fetch('http://localhost:5000/api/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 'userId', actionType: 'Просмотр команды', actionDetails: `Название команды: ${team.TeamName}`}),
        })
            .then(res => res.json())
            .catch(err => console.error(err));*/
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

    const editNameTeam = (team, newName) => {
        console.log(`Команда ${team.TeamName} теперь называется ${newName}`);
        // TODO: здесь отправьте запрос на сервер для обновления имени команды
        setModalOpen(false);
        setTeamToEdit(null);
        setNameTeam('');
        /*fetch('http://localhost:5000/api/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 'userId', actionType: 'Просмотр команды', actionDetails: `Название команды: ${team.TeamName}`}),
        })
            .then(res => res.json())
            .catch(err => console.error(err));*/
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

function AddPlayerInTeam({ teams }) {
    /*
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        ДОБАВИТЬ СЧИТЫВАНИЕ TG USER ID В ЛОГИ
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        
        */
    const [error, setError] = React.useState('');
    const [isModalOpen, setModalOpen] = React.useState(false);
    const [teamToEdit, setTeamToEdit] = React.useState(null);
    const [PlayerId, setPlayerId] = React.useState("");
    

    const validateText = (text) => /^[A-Za-zА-Яа-яЁё0123456789\s]+$/.test(text);

    const openModal = (team, playerId) => {
        setTeamToEdit(team);
        setPlayerId(playerId);
        setError('');
        setModalOpen(true);
    };

    const addPlayerInTeam = (team, playerId) => {
        console.log(`В команду ${team.TeamName} добавлен игрок с id ${playerId}`);
        // TODO: здесь отправьте запрос на сервер для обновления имени команды
        setModalOpen(false);
        setTeamToEdit(null);
        /*fetch('http://localhost:5000/api/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 'userId', actionType: 'Просмотр команды', actionDetails: `Название команды: ${team.TeamName}`}),
        })
            .then(res => res.json())
            .catch(err => console.error(err));*/
    };

    const handlePlayerChange = (e) => {
        setPlayerId(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (PlayerId === '') {
            setError('Поле текста не должно быть пустым');
            return;
        }

        /*if (!validateText(PlayerId)) {
            setError('Поле текста должно содержать только буквы, цифры и пробелы.');
            return;
        }*/

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

    /*НАДО СДЕЛАТЬ ФУНКЦИЮ ДЛЯ ВЫБОРА ИГРОКОВ БЕЗ КОМАНДЫ
    
    const [players, setPlayers] = React.useState(null);

    useEffect(() => {
        if (teamToEdit) {
            //console.log(teamToEdit.TeamId);
            fetch(`http://localhost:5000/api/teamCard/${teamToEdit.TeamId}`)
                .then(res => res.json())
                .then(data => setPlayers(data.players))
                .catch(err => console.error(err));
        }
    }, [teamToEdit]);

    console.log(players);*/

    const players = [
        { id: 1, fio: 'Иванов2 Иван2 Иванович2'},
        { id: 2, fio: 'Иванов1 Иван1 Иванович1'}
    ];

    return (
        <div>
            <h3>Добавление игрока команды</h3>
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
                        <select value={PlayerId || ''}
                            onChange={(e) => setPlayerId(e.target.value)}>
                            {players.map((player) => (
                                <option key={player.id} value={player.id}>
                                    {player.fio}
                                </option>
                            ))}
                        </select>
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

function DeletePlayerInTeam({ teams }) {
    /*
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        ДОБАВИТЬ СЧИТЫВАНИЕ TG USER ID В ЛОГИ
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        
        */
    const [error, setError] = React.useState('');
    const [isModalOpen, setModalOpen] = React.useState(false);
    const [teamToEdit, setTeamToEdit] = React.useState(null);
    const [PlayerId, setPlayerId] = React.useState("");


    const validateText = (text) => /^[A-Za-zА-Яа-яЁё0123456789\s]+$/.test(text);

    const openModal = (team, playerId) => {
        setTeamToEdit(team);
        setPlayerId(playerId);
        setError('');
        setModalOpen(true);
    };

    const removePlayerFromTeam = (team, playerId) => {
        console.log(`Из команды ${team.TeamName} удален игрок с id ${playerId}`);
        // TODO: здесь отправьте запрос на сервер для обновления имени команды
        setModalOpen(false);
        setTeamToEdit(null);
        /*fetch('http://localhost:5000/api/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 'userId', actionType: 'Просмотр команды', actionDetails: `Название команды: ${team.TeamName}`}),
        })
            .then(res => res.json())
            .catch(err => console.error(err));*/
    };

    const handlePlayerChange = (e) => {
        setPlayerId(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (PlayerId === '') {
            setError('Поле текста не должно быть пустым');
            return;
        }

        /*if (!validateText(PlayerId)) {
            setError('Поле текста должно содержать только буквы, цифры и пробелы.');
            return;
        }*/

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

    /*НАДО СДЕЛАТЬ ФУНКЦИЮ ДЛЯ ВЫБОРА ИГРОКОВ БЕЗ КОМАНДЫ
    
    const [players, setPlayers] = React.useState(null);

    useEffect(() => {
        if (teamToEdit) {
            //console.log(teamToEdit.TeamId);
            fetch(`http://localhost:5000/api/teamCard/${teamToEdit.TeamId}`)
                .then(res => res.json())
                .then(data => setPlayers(data.players))
                .catch(err => console.error(err));
        }
    }, [teamToEdit]);

    console.log(players);*/

    const players = [
        { id: 1, fio: 'Иванов2 Иван2 Иванович2' },
        { id: 2, fio: 'Иванов1 Иван1 Иванович1' }
    ];

    return (
        <div>
            <h3>Удаление игрока команды</h3>
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
                        <select value={PlayerId || ''}
                            onChange={(e) => setPlayerId(e.target.value)}>
                            {players.map((player) => (
                                <option key={player.id} value={player.id}>
                                    {player.fio}
                                </option>
                            ))}
                        </select>
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
        fetch('http://localhost:5000/api/listTeams')
            .then(res => res.json())
            .then(data => setTeams(data))
            .catch(err => console.error('Ошибка загрузки данных:', err));

    }, []);

    

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
                return <AddPlayerInTeam teams={teams} />;
            case 'removePlayerFromTeam':
                return <DeletePlayerInTeam teams={teams} />;
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
            <button className="button" onClick={() => setActiveSection("addPlayerInTeam")}>Добавление игрока команды</button>
            <button className="button" onClick={() => setActiveSection("removePlayerFromTeam")}>Удаление игрока команды</button>

            <hr />

            <div>
                {renderContent()}
            </div>
        </div>
    )
}

export default EditTeam