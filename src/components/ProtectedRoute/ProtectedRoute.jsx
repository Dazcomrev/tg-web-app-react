import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const PASSWORD = '123'; // Замените на нужный пароль

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [inputPass, setInputPass] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputPass === PASSWORD) {
            setIsAuthorized(true);
            setError('');
        } else {
            setError('Неверный пароль');
        }
    };

    const handleClick = () => {
        navigate(`/ListTeams`);
    };

    if (isAuthorized) {
        return children;
    }

    return (
        <div className="protected-route-container">
            <button className="btn-back" onClick={handleClick}>Список команд</button>
            <h2 className="protected-title">Введите пароль для доступа</h2>
            <form onSubmit={handleSubmit} className="protected-form">
                <input
                    type="password"
                    value={inputPass}
                    onChange={(e) => setInputPass(e.target.value)}
                    placeholder="Пароль"
                    className="protected-input"
                />
                <button type="submit" className="btn-submit">Войти</button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default ProtectedRoute;