'use client';

import { useState } from 'react';
import GraphBuilder from '../components/GraphBuilder';

export default function Home() {
  const [nodes, setNodes] = useState([
    { id: '0', position: { x: 259, y: 181 }, data: { label: '0' } },
    { id: '1', position: { x: 492, y: 207 }, data: { label: '1' } },
    { id: '2', position: { x: 337, y: 440 }, data: { label: '2' } },
    { id: '3', position: { x: 622, y: 389 }, data: { label: '3' } },
  ]);
  const [edges, setEdges] = useState([
    { from: 0, to: 1, cap: 12.2 },
    { from: 1, to: 2, cap: 15.6 },
    { from: 2, to: 3, cap: 3.2 },
  ]);
  const [startNode, setStartNode] = useState(0);
  const [endNode, setEndNode] = useState(3);

  return (
    <GraphBuilder
      nodes={nodes}
      setNodes={setNodes}
      edges={edges}
      setEdges={setEdges}
      startNode={startNode}
      setStartNode={setStartNode}
      endNode={endNode}
      setEndNode={setEndNode}
    />
  );
}