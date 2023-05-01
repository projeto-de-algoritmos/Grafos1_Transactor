import { useEffect, useRef, useState } from 'react';
import Graph from '../lib/Graph';
import { faker } from '@faker-js/faker';
import { ForceGraph2D } from 'react-force-graph';

const network = new Graph();

export default function Network({ numberOfNodes }: { numberOfNodes: number }) {
  const fgRef = useRef();

  const INITIAL_NODE_NUMBERS = numberOfNodes;
  for (let i = 0; i < INITIAL_NODE_NUMBERS; i++) {
    network.addNode(faker.name.fullName(), 100);
  }
  // STATES
  const [data, setData] = useState({
    nodes: network.getAllNodes(),
    links: [],
  });
  const [running, setRunning] = useState(false);
  const [intervals, setIntervals] = useState<number[]>([]);
  const [transactions, setTransactions] = useState<string[]>([]);

  // Effects
  useEffect(() => {
    if (running) {
      const id = setInterval(() => {
        const newIntervals = [...intervals];
        newIntervals.push(id);
        setIntervals(newIntervals);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error:
        setData(({ nodes, links }: any) => {
          const nodesLength = nodes.length - 1;
          const sourceRandomNode = Math.ceil(Math.random() * nodesLength);
          let targetRandomNode = Math.ceil(Math.random() * nodesLength);

          if (sourceRandomNode === targetRandomNode) targetRandomNode--;

          const newNodes = [...nodes];

          network.addEdge(sourceRandomNode, targetRandomNode, 10);

          const sourceNode = network.getNode(sourceRandomNode);
          const targetNode = network.getNode(targetRandomNode);

          setTransactions(transactions => [
            ...transactions,
            `${sourceNode?.name} > ${targetNode?.name} R$10,00`,
          ]);
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
      intervals.forEach(id => {
        clearInterval(id);
      });
      setIntervals([]);
    }
  }, [running]);

  function handleNodeChange(number: number) {
    for (let i = 0; i < number; i++) {
      network.addNode(faker.name.fullName(), 100);
    }
    const newNodes = network.getAllNodes();
    setData({
      nodes: newNodes.map(node => node),
      links: [],
    });
  }

  const start = () => {
    setRunning(!running);
    console.log(running);
  };
  return (
    <>
      <ForceGraph2D
        ref={fgRef}
        cooldownTicks={100}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error:
        onEngineStop={() => fgRef.current.zoomToFit(400)}
        graphData={data}
        nodeLabel="id"
        nodeAutoColorBy="group"
        linkDirectionalArrowLength={2.5}
        linkDirectionalArrowRelPos={1}
        linkCurvature={0.25}
        nodeCanvasObject={({ img, x, y, name }: any, ctx, globalScale) => {
          const size = 12;
          ctx.drawImage(img, x - size / 2, y - size / 2, size - 4, size - 4);
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillText(`${name}`, x - 15, y + 15);
        }}
      />
      <div className="form">
        <label className="h1">Quantide de nós: {data.nodes.length}</label>
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

        <span>
          Maior usuário:{' '}
          {network.getHighestBalance()?.name ||
            'Sem usuário com mais dinheiro!'}
        </span>
        <label className="h2">Lista de transações</label>
        <div className="list">
          {transactions.map(transaction => (
            <span>{transaction}</span>
          ))}
        </div>
      </div>
    </>
  );
}
