import { useState } from 'react';
import './App.css';
import Network from './components/Network';

export default function App() {
  const [numberOfNodes, setNumberOfNodes] = useState(0);
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="App">
      {confirm ? (
        <Network numberOfNodes={numberOfNodes} />
      ) : (
        <div className="form">
          <label className="h1">Digite a quatidade de nós</label>
          <input
            type="number"
            placeholder="Digite a quatidade de nós"
            className="nodeInputs"
            value={numberOfNodes}
            onChange={e => setNumberOfNodes(parseInt(e.target.value))}
          />
          <button onClick={() => setConfirm(true)}>Confirmar</button>
        </div>
      )}
    </div>
  );
}
