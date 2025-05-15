import { use, useEffect } from 'react';
import './App.css';
const tg = window.Telegram.WebApp;

function App() {

    useEffect(() => {
        tg.ready();
    }, [])

    const onClose = () => {
        tg.close();
    }

  return (
    <div className="App">
          work
          <button onClick={onClose}>Закрыть</button>
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