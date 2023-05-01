import { useEffect, useRef, useState } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import './App.css';
import Graph from './lib/Graph';

const INITIAL_NODE_NUMBERS = 15;

export default function App() {
  const fgRef = useRef();
  const network = new Graph();

  for (let i = 0; i < INITIAL_NODE_NUMBERS; i++) {
    network.addNode(`Node: ${i}`, 100);
  }

  const [data, setData] = useState({
    nodes: network.getAllNodes(),
    links: [],
  });
  const [running, setRunning] = useState(false);
  const [intervals, setIntervals] = useState<number[]>([]);

  useEffect(() => {
    if (running) {
      const id = setInterval(() => {
        const newIntervals = [...intervals];
        newIntervals.push(id);
        setIntervals(newIntervals);
        setData(({ nodes, links }: any) => {
          const nodesLength = nodes.length - 1;
          const sourceRandomNode = Math.ceil(Math.random() * nodesLength);
          let targetRandomNode = Math.ceil(Math.random() * nodesLength);

          if (sourceRandomNode === targetRandomNode) targetRandomNode--;

          const newNodes = [...nodes];

          network.addEdge(sourceRandomNode, targetRandomNode, 10);

          return {
            nodes: newNodes,
            links: [
              ...links,
              { source: sourceRandomNode, target: targetRandomNode },
            ],
          };
        });
      }, 3000);
    } else {
      console.log(intervals);
      intervals.forEach(id => {
        clearInterval(id);
      });
      setIntervals([]);
    }
  }, [running]);

  function handleNodeChange(number: number) {
    const newNodes = Array.from({ length: number }, (_, i) => i);
    setData({
      nodes: newNodes.map(id => ({ id })),
      links: [],
    });
  }

  const start = () => {
    setRunning(!running);
    console.log(running);
  };

  return (
    <div className="App">
      <ForceGraph2D
        ref={fgRef}
        cooldownTicks={100}
        onEngineStop={() => fgRef.current.zoomToFit(400)}
        graphData={data}
        nodeLabel="id"
        nodeAutoColorBy="group"
        linkDirectionalArrowLength={2.5}
        linkDirectionalArrowRelPos={1}
        linkCurvature={0.25}
      />
      <div className="form">
        <label className="h1">Quantide de nós:</label>
        <input
          type="number"
          placeholder="Digite a quatidade de nós"
          className="nodeInputs"
          value={data.nodes.length}
          onChange={e => handleNodeChange(parseInt(e.target.value))}
        />
        <button className="btnstart" onClick={start}>
          {running ? 'Parar' : 'Começar'}
        </button>

        <label className="h2">Lista de transações</label>
        <div className="list">
          <span>Fulano {'>'} Beltrano R$ 12,00</span>
          <span>Fulano {'>'} Beltrano</span>
          <span>Fulano {'>'} Beltrano</span>
        </div>
      </div>
    </div>
  );
}