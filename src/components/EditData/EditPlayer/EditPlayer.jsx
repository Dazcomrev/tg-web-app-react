import React, { useEffect, useState } from 'react';
import './EditPlayer.css';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../../hooks/useTelegram';
import { useURL } from '../../../hooks/URLs';
const { urlServer } = useURL();
const { userId } = useTelegram();

function AddPlayer({ refreshPlayers }) {
    const [FirstName, setFirstName] = useState('');
    const [SecondName, setSecondName] = useState('');
    const [ThirdName, setThirdName] = useState('');
    const [Age, setAge] = useState('');
    const [Photo, setPhoto] = useState(null);
    const [error, setError] = useState('');

    const validateText = (text) => {
        return /^[A-Za-zА-Яа-яЁё\s]+$/.test(text);
    };

    const validate = () => {
        if (!FirstName.trim()) {
            setError('Введите имя');
            return false;
        }
        if (!SecondName.trim()) {
            setError('Введите фамилию');
            return false;
        }
        if (!validateText(FirstName)) {
            setError('Поле имя должно содержать только буквы');
            return false;
        }

        if (!validateText(SecondName)) {
            setError('Поле фамилия должно содержать только буквы');
            return false;
        }
        if (ThirdName != "" && !validateText(ThirdName)) {
            setError('Поле отчество должно содержать только буквы');
            return false;
        }
        if (!Age.trim() || isNaN(Age) || +Age <= 0) {
            setError('Введите корректный возраст');
            return false;
        }
        if (!Photo) {
            setError('Выберите фото');
            return false;
        }
        setError('');
        return true;
    };

    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const formData = new FormData();
        formData.append('Photo', Photo);
        formData.append('FirstName', FirstName);
        formData.append('SecondName', SecondName);
        formData.append('ThirdName', ThirdName);
        formData.append('Age', Age);

        try {
            const response = await fetch(`${urlServer}api/edit/player/addPlayer`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');
            }

            const data = await response.json();

            fetch(`${urlServer}api/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: `${userId}`, actionType: 'Редактирование данных', actionDetails: `Добавлен игрок ${SecondName} ${FirstName} ${ThirdName}. Возраст ${Age}. Название изображения: ${data.filename}` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshPlayers();

            setFirstName('');
            setSecondName('');
            setThirdName('');
            setAge('');
            setPhoto(null);
            e.target.reset();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <h3>Добавление игрока</h3>
            <div>
                <label className="form-label">
                    Имя игрока:
                    <input
                        type="text"
                        value={FirstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Введите имя игрока"
                        className="form-input"
                    />
                </label><br />
                <label className="form-label">
                    Фамилия игрока:
                    <input
                        type="text"
                        value={SecondName}
                        onChange={(e) => setSecondName(e.target.value)}
                        placeholder="Введите фамилия игрока"
                        className="form-input"
                    />
                </label><br />
                <label className="form-label">
                    Отчество игрока:
                    <input
                        type="text"
                        value={ThirdName}
                        onChange={(e) => setThirdName(e.target.value)}
                        placeholder="Введите отчество игрока"
                        className="form-input"
                    />
                </label><br />
                <label className="form-label">
                    Возраст игрока:
                    <input
                        type="text"
                        value={Age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Введите возраст игрока"
                        min="1"
                        className="form-input"
                    />
                </label><br />
            </div>

            <div>
                <label className="form-label">
                    Фото игрока:
                    <input type="file" accept="image/*" onChange={handleFileChange} className="form-input-file" />
                </label>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button className="btn-confirm" type="submit">Добавить</button>
        </form>
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

function RemovePlayer({ players, refreshPlayers }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [playerToRemove, setPlayerToRemove] = useState(null);

    const removePlayer = async (player) => {
        const formData = new FormData();
        formData.append('OldPhoto', player.Photo);
        formData.append('PlayerId', player.PlayerId);

        try {
            const response = await fetch(`${urlServer}api/edit/player/removePlayer`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');
            }

            const data = await response.json();

            fetch(`${urlServer}api/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: `${userId}`, actionType: 'Редактирование данных', actionDetails: `Удален игрок ${player.FIO} с PlayerId ${player.PlayerId}. Возраст: ${player.Age}.Название изображения: ${player.Photo}` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshPlayers();

            setModalOpen(false);
            setPlayerToRemove(null);
        } catch (err) {
            console.error(err.message);
        }
    };

    const openModal = (player) => {
        setPlayerToRemove(player);
        setModalOpen(true);
    };

    const PlayerItem = ({ player }) => {
        return (
            <div>
                <button className="player-item" onClick={() => openModal(player)}>
                    <img src={`${urlServer}images/${player.Photo}`} alt="photo"></img>
                    <p>{player.FIO}</p>
                    <p>Возраст: {player.Age}</p>
                </button>
            </div>
        );
    };

    return (
        <div>
            <form>
                <h3>Удаление игрока</h3>
                <p>Нажмите на игрока, которого хотите удалить</p>
                <div className="players-list">
                    {players.map((player) => (
                        <PlayerItem key={player.PlayerId} player={player} />
                    ))}
                </div>
            </form>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <p>Вы уверены что хотите удалить игрока {playerToRemove?.FIO}?</p>
                <div className="modal-buttons">
                    <button className="btn-confirm" onClick={() => removePlayer(playerToRemove)}>Подтвердить</button>
                    <button className="btn-cancel" onClick={() => setModalOpen(false)}>Отмена</button>
                </div>
            </Modal>
        </div>
    );
}

function EditInfoPlayer({ players, refreshPlayers }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [playerToEdit, setPlayerToEdit] = useState(null);
    const [PlayerId, setPlayerId] = useState('');
    const [FirstName, setFirstName] = useState('');
    const [SecondName, setSecondName] = useState('');
    const [ThirdName, setThirdName] = useState('');
    const [Age, setAge] = useState('');
    const [Photo, setPhoto] = useState(null);
    const [OldPhoto, setOldPhoto] = useState(null);
    const [error, setError] = useState('');

    const validateText = (text) => {
        return /^[A-Za-zА-Яа-яЁё\s]+$/.test(text);
    };

    const validate = () => {
        if (!FirstName.trim()) {
            setError('Введите имя');
            return false;
        }
        if (!SecondName.trim()) {
            setError('Введите фамилию');
            return false;
        }
        if (!validateText(FirstName)) {
            setError('Поле имя должно содержать только буквы');
            return false;
        }

        if (!validateText(SecondName)) {
            setError('Поле фамилия должно содержать только буквы');
            return false;
        }
        if (ThirdName != "" && !validateText(ThirdName)) {
            setError('Поле отчество должно содержать только буквы');
            return false;
        }
        if (!Age.trim() || isNaN(Age) || +Age <= 0) {
            setError('Введите корректный возраст');
            return false;
        }
        if (!Photo) {
            setError('Выберите фото');
            return false;
        }
        setError('');
        return true;
    };

    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const FIO = playerToEdit.FIO.split(" ");
        const OldFirstName = FIO[0];
        const OldSecondName = FIO[1];
        const OldThirdName = FIO[2] ? FIO[2] : '';
        
        const formData = new FormData();
        formData.append('Photo', Photo);
        formData.append('PlayerId', playerToEdit.PlayerId);
        formData.append('FirstName', FirstName);
        formData.append('SecondName', SecondName);
        formData.append('ThirdName', ThirdName);
        formData.append('Age', Age);
        formData.append('OldPhoto', OldPhoto);

        try {
            const response = await fetch(`${urlServer}api/edit/player/editDataPlayer`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');
            }

            fetch(`${urlServer}api/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: `${userId}`, actionType: 'Редактирование данных', actionDetails: `Изменение данных игрока с PlayerId = ${playerToEdit.PlayerId} в формате Старые-Новые. Имя: ${OldFirstName}–${FirstName}. Фамилия: ${OldSecondName}–${SecondName}. Отчество: ${OldThirdName}–${ThirdName}. Возраст: ${playerToEdit.Age}–${Age}. Название изображения: ${playerToEdit.Photo}–${data.data.Photo}.` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshPlayers();

            setFirstName('');
            setSecondName('');
            setThirdName('');
            setAge('');
            setPhoto(null);
            e.target.reset();
            setModalOpen(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const openModal = (player) => {
        setPlayerToEdit(player);
        setPlayerId(player.PlayerId);
        const FIO = player.FIO.split(" ");
        setFirstName(FIO[0]);
        setSecondName(FIO[1]);
        setThirdName(FIO[2] ? FIO[2] : '');
        setAge(String(player.Age));
        setPhoto(player.Photo);
        setOldPhoto(player.Photo);
        setModalOpen(true);
    };

    const PlayerItem = ({ player }) => {
        return (
            <div>
                <button className="player-item" onClick={() => openModal(player)}>
                    <img src={`${urlServer}images/${player.Photo}`} alt="photo"></img>
                    <p>{player.FIO}</p>
                    <p>Возраст: {player.Age}</p>
                </button>
            </div>
        );
    };

    return (
        <div>
            <form>
                <h3>Изменение данных об игроке</h3>
                <p>Нажмите на игрока, данные которого хотите изменить</p>
                <div className="players-list">
                    {players.map((player) => (
                        <PlayerItem key={player.PlayerId} player={player} />
                    ))}
                </div>
            </form>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="form-label">
                            Имя игрока:
                            <input
                                type="text"
                                value={FirstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Введите имя игрока"
                                className="form-input"
                            />
                        </label><br />
                        <label className="form-label">
                            Фамилия игрока:
                            <input
                                type="text"
                                value={SecondName}
                                onChange={(e) => setSecondName(e.target.value)}
                                placeholder="Введите фамилия игрока"
                                className="form-input"
                            />
                        </label><br />
                        <label className="form-label">
                            Отчество игрока:
                            <input
                                type="text"
                                value={ThirdName}
                                onChange={(e) => setThirdName(e.target.value)}
                                placeholder="Введите отчество игрока"
                                className="form-input"
                            />
                        </label><br />
                        <label className="form-label">
                            Возраст игрока:
                            <input
                                type="text"
                                value={Age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="Введите возраст игрока"
                                min="1"
                                className="form-input"
                            />
                        </label><br />
                    </div>

                    <div>
                        <label className="form-label">
                            Фото игрока:
                            <input type="file" accept="image/*" onChange={handleFileChange} className="form-input-file" />
                        </label>
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    <div className="modal-buttons">
                    <button className="btn-confirm" type="submit">Изменить</button>
                        <button className="btn-cancel" onClick={() => setModalOpen(false)}>Отмена</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

const EditPlayer = () => {
    const navigate = useNavigate();


    const [players, setPlayers] = useState(null);

    const fetchPlayers = () => {
        fetch(`${urlServer}api/getAllPlayers`)
            .then(res => res.json())
            .then(data => setPlayers(data))
            .catch(err => console.error('Ошибка загрузки данных:', err));
    };

    useEffect(() => {
        fetchPlayers();
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
            case 'addPlayer':
                return <AddPlayer refreshPlayers={fetchPlayers} />;
            case 'removePlayer':
                return <RemovePlayer players={players} refreshPlayers={fetchPlayers} />;
            case 'editName':
                return <EditInfoPlayer players={players} refreshPlayers={fetchPlayers} />;
            default:
                return <div>Выберите раздел</div>;
        }
    };

    return (
        <div className="edit-player-container">
            <button className="btn-back" onClick={handleClick}>Список команд</button>
            <button className="btn-back" onClick={backClick}>Назад</button>
            <h2 className="edit-player-title">Выберите какую информацию в разделе игрок хотите отредактироать</h2>
            <div className="buttons-group">
                <button className="btn-main" onClick={() => setActiveSection("addPlayer")}>Добавление игрока</button>
                <button className="btn-main" onClick={() => setActiveSection("removePlayer")}>Удаление игрока</button>
                <button className="btn-main" onClick={() => setActiveSection("editName")}>Изменение общих данных игрока</button>
            </div>

            <hr />

            <div className="edit-player-content">
                {renderContent()}
            </div>
        </div>
    )
}

export default EditPlayer