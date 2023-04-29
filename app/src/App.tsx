import { useEffect, useState } from "react";
import { ForceGraph3D } from "react-force-graph";

const INITIAL_NODE_NUMBERS = 15;
const initialNodes = Array.from({ length: INITIAL_NODE_NUMBERS }, (_, i) => i);

export default function App() {
  const [data, setData] = useState({
    nodes: initialNodes.map((index) => ({
      id: index
    })),
    links: []
  });

  useEffect(() => {
    setInterval(() => {
      // Add a new connected node every second
      setData(({ nodes, links }) => {
        const nodesLength = nodes.length - 1;
        const sourceRandomNode = Math.ceil(Math.random() * nodesLength);
        let targetRandomNode = Math.ceil(Math.random() * nodesLength);

        if (sourceRandomNode === targetRandomNode) targetRandomNode--;

        const newNodes = [...nodes];

        return {
          nodes: newNodes,
          links: [
            ...links,
            { source: sourceRandomNode, target: targetRandomNode }
          ]
        };
      });
    }, 5000);
  }, []);
  return (
    <div className="App">
      <ForceGraph3D graphData={data} nodeLabel="id" nodeAutoColorBy="group" />,
    </div>
  );
}
