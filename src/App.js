import { use, useEffect } from 'react';
import './App.css';
import { useTelegram } from './hooks/useTelegram';
import Header from "./components/Header/Header";


function App() {
    const { onToggleButton, tg } = useTelegram();

    useEffect(() => {
        tg.ready();
    }, [])



    return (
        <div className="App">
            <Header />
            <button onClick={onToggleButton}>toggle</button>
        </div>
    );
}

export default App;

//<header className="App-header">
//    <img src={logo} className="App-logo" alt="logo" />
//    <p>
//        Edit <code>src/App.js</code> and save to reload.
//    </p>
//    <a
//        className="App-link"
//        href="https://reactjs.org"
//        target="_blank"
//        rel="noopener noreferrer"
//    >
//        Learn React
//    </a>
//</header>