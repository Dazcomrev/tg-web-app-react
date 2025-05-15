import { use, useEffect } from 'react';
import './App.css';
import { useTelegram } from './hooks/useTelegram';
import {Header} from "./components/Header/Header";


function App() {
    const { onToggleButton, tg } = useTelegram();

    useEffect(() => {
        tg.ready();
    }, [])



    return (
        <div className="App">
            <Header></Header>
            <dev>ПОЧЕМУ НЕ РАБОТАЕТ Header</dev>
            <button onClick={onToggleButton}>toggle</button>
        </div>
    );
}

export default App;