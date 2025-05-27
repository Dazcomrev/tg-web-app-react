import React, { useEffect, useState } from 'react';
import './EditPlayer.css';
import { useNavigate } from 'react-router-dom';

function AddPlayer({ refreshPlayers }) {
    const [FirstName, setFirstName] = useState('');
    const [SecondName, setSecondName] = useState('');
    const [ThirdName, setThirdName] = useState('');
    const [Age, setAge] = useState('');
    const [Photo, setPhoto] = useState(null);
    const [error, setError] = useState('');

    const validateText = (text) => {
        // Проверяем, что название команды не содержит лишних символов
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
        //console.log(e.target.files);
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        // Выводим имя и возраст в консоль
        //console.log(`Добавлен игрок ${SecondName} ${FirstName} ${ThirdName}. Возраст ${Age}. Название изображения: (Надо барать из Ответа сервера)`);

        // Формируем FormData для отправки файла
        const formData = new FormData();
        formData.append('Photo', Photo);
        formData.append('FirstName', FirstName);
        formData.append('SecondName', SecondName);
        formData.append('ThirdName', ThirdName);
        formData.append('Age', Age);

        try {
            const response = await fetch('http://localhost:5000/api/edit/player/addPlayer', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');
            }

            const data = await response.json();
            //console.log('Ответ сервера:', data);

            fetch('http://localhost:5000/api/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'userId', actionType: 'Редактирование данных', actionDetails: `Добавлен игрок ${SecondName} ${FirstName} ${ThirdName}. Возраст ${Age}. Название изображения: ${data.filename}` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshPlayers();

            // Очистка формы
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
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Имя игрока:
                    <input
                        type="text"
                        value={FirstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Введите имя игрока"
                    />
                </label><br />
                <label>
                    Фамилия игрока:
                    <input
                        type="text"
                        value={SecondName}
                        onChange={(e) => setSecondName(e.target.value)}
                        placeholder="Введите фамилия игрока"
                    />
                </label><br />
                <label>
                    Отчество игрока:
                    <input
                        type="text"
                        value={ThirdName}
                        onChange={(e) => setThirdName(e.target.value)}
                        placeholder="Введите отчество игрока"
                    />
                </label><br />
                <label>
                    Возраст игрока:
                    <input
                        type="text"
                        value={Age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Введите возраст игрока"
                        min="1"
                    />
                </label><br />
            </div>

            <div>
                <label>
                    Фото игрока:
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </label>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button type="submit">Добавить</button>
        </form>
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

function RemovePlayer({ players, refreshPlayers }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [playerToRemove, setPlayerToRemove] = useState(null);

    const removePlayer = async (player) => {
        console.log(`Игрок ${player.FIO} с PlayerId ${player.PlayerId} удален. Возраст: ${player.Age}.Название изображения: ${player.Photo}`);

        // Формируем FormData для отправки файла
        const formData = new FormData();
        formData.append('OldPhoto', player.Photo);
        formData.append('PlayerId', player.PlayerId);
        
        try {
            const response = await fetch('http://localhost:5000/api/edit/player/removePlayer', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');
            }

            const data = await response.json();
            console.log('Ответ сервера:', data);

            fetch('http://localhost:5000/api/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'userId', actionType: 'Редактирование данных', actionDetails: `Удален игрок ${player.FIO} с PlayerId ${player.PlayerId}. Возраст: ${player.Age}.Название изображения: ${player.Photo}` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshPlayers();

            // Очистка формы
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

        /*
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        ДОБАВИТЬ СЧИТЫВАНИЕ TG USER ID В ЛОГИ
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        
        */

        return (
            <div>
                <button className="player-item" onClick={() => openModal(player)}>
                    <img src={`http://localhost:5000/images/${player.Photo}`} height='300px' alt="photo"></img>
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
                <div>
                    {players.map((player) => (
                        <PlayerItem key={player.PlayerId} player={player} />
                    ))}
                </div>
            </form>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <h2>Всплывающее окно</h2>
                <p>Вы уверены что хотите удалить игрока {playerToRemove?.FIO}?</p>
                <button onClick={() => removePlayer(playerToRemove)}>Подтвердить</button>
                <button onClick={() => setModalOpen(false)}>Отмена</button>
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
        // Проверяем, что название команды не содержит лишних символов
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

        // Выводим имя и возраст в консоль
        const FIO = playerToEdit.FIO.split(" ");
        const OldFirstName = FIO[0];
        const OldSecondName = FIO[1];
        const OldThirdName = FIO[2] ? FIO[2] : '';
        console.log('Отправляем данные для изменения:', { Photo, FirstName, SecondName, ThirdName, Age, OldPhoto });
        console.log(`Изменение данных игрока с PlayerId = ${playerToEdit.PlayerId} в формате Старые–Новые. Имя: ${OldFirstName}–${FirstName}. Фамилия: ${OldSecondName}–${SecondName}. Отчество: ${OldThirdName}–${ThirdName}. Возраст: ${playerToEdit.Age}–${Age}. Название изображения: ${playerToEdit.Photo}–{data.data.Photo}.`);

        // Формируем FormData для отправки файла
        const formData = new FormData();
        formData.append('Photo', Photo);
        formData.append('PlayerId', playerToEdit.PlayerId);
        formData.append('FirstName', FirstName);
        formData.append('SecondName', SecondName);
        formData.append('ThirdName', ThirdName);
        formData.append('Age', Age);
        formData.append('OldPhoto', OldPhoto);

        console.log('formData:', formData);

        try {
            const response = await fetch(`http://localhost:5000/api/edit/player/editDataPlayer`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке');
            }

            const data = await response.json();
            console.log('Ответ сервера:', data);

            fetch('http://localhost:5000/api/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'userId', actionType: 'Редактирование данных', actionDetails: `Изменение данных игрока с PlayerId = ${playerToEdit.PlayerId} в формате Старые-Новые. Имя: ${OldFirstName}–${FirstName}. Фамилия: ${OldSecondName}–${SecondName}. Отчество: ${OldThirdName}–${ThirdName}. Возраст: ${playerToEdit.Age}–${Age}. Название изображения: ${playerToEdit.Photo}–${data.data.Photo}.` }),
            })
                .then(res => res.json())
                .catch(err => console.error(err));

            await refreshPlayers();

            // Очистка формы
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

        /*
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        ДОБАВИТЬ СЧИТЫВАНИЕ TG USER ID В ЛОГИ
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        
        */
        //console.log('split FIO:', player.FIO.split(" "));
        //setFIO(player.FIO.split(" "));
        return (
            <div>
                <button className="player-item" onClick={() => openModal(player)}>
                    <img src={`http://localhost:5000/images/${player.Photo}`} height='300px' alt="photo"></img>
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
                <div>
                    {players.map((player) => (
                        <PlayerItem key={player.PlayerId} player={player} />
                    ))}
                </div>
            </form>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            Имя игрока:
                            <input
                                type="text"
                                value={FirstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Введите имя игрока"
                            />
                        </label><br />
                        <label>
                            Фамилия игрока:
                            <input
                                type="text"
                                value={SecondName}
                                onChange={(e) => setSecondName(e.target.value)}
                                placeholder="Введите фамилия игрока"
                            />
                        </label><br />
                        <label>
                            Отчество игрока:
                            <input
                                type="text"
                                value={ThirdName}
                                onChange={(e) => setThirdName(e.target.value)}
                                placeholder="Введите отчество игрока"
                            />
                        </label><br />
                        <label>
                            Возраст игрока:
                            <input
                                type="text"
                                value={Age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="Введите возраст игрока"
                                min="1"
                            />
                        </label><br />
                    </div>

                    <div>
                        <label>
                            Фото игрока:
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                        </label>
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <button type="submit">Подтвердить</button>
                    <button onClick={() => setModalOpen(false)}>Отмена</button>
                </form>
            </Modal>
        </div>
    );
}

const EditPlayer = () => {
    const navigate = useNavigate();
    

    const [players, setPlayers] = useState(null);

    const fetchPlayers = () => {
        fetch('http://localhost:5000/api/getAllPlayers')
            .then(res => res.json())
            .then(data => setPlayers(data))
            .catch(err => console.error('Ошибка загрузки данных:', err));
    };

    useEffect(() => {
        fetchPlayers();
    }, []);

    /*const players = [
        { PlayerId: 1, FIO: 'Иванов Иван2 Иванович2', Photo: 'Дед.jpg', Age: 18 },
        { PlayerId: 2, FIO: 'Иванов1 Иван1 Иванович1', Photo: 'Яблоко.jpg', Age: 21 },
        { PlayerId: 3, FIO: 'Иванов3 Иван3 Иванович3', Photo: '1747892911129-806430307.jpg', Age: 19 }
    ];*/
    //console.log("Иванов2 Иван2 Иванович2".split(" "));
    //console.log("Иванов2 Иван2".split(" ")[2]);
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

    //if (!Players) return <div>Загрузка...</div>;

    /*
    removerPlayer
    editPlayer
    */

    return (
        <div>
            <button className="back" onClick={handleClick}>Список команд</button>
            <button className="back" onClick={backClick}>Назад</button>
            <h2>Выберите какую информацию в разделе игрок хотите отредактироать</h2>
            <button className="button" onClick={() => setActiveSection("addPlayer")}>Добавление игрока</button>
            <button className="button" onClick={() => setActiveSection("removePlayer")}>Удаление игрока</button>
            <button className="button" onClick={() => setActiveSection("editName")}>Изменение общих данных игрока</button>

            <hr />

            <div>
                {renderContent()}
            </div>
        </div>
    )
}

export default EditPlayer