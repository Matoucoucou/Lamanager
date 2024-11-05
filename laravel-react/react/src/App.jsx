import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import TestConnection from './components/TestConnection';
import LeftPart from './components/LeftPart';
import RightPart from './components/RightPart';
import './App.css'
import Header from './components/Header';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header />
    <div className="app">
            <LeftPart />
            <RightPart/>
    </div>
    </>
    );
}

export default App
