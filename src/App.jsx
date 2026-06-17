import { useState } from 'react'
import Login from "./components/Login";
import InventarioMovil from './components/InventarioMovil'

function App() {
  const [autenticado, setAutenticado] = useState(false);

  return (
    <div className="App">
      {autenticado ? (
        <InventarioMovil />
      ) : (
        <Login onLoginExitoso={() => setAutenticado(true)} />
      )}
    </div>
  )
}

export default App
