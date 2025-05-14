'use client'
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Solution() {
  const searchParams = useSearchParams();
  const results = JSON.parse(decodeURIComponent(searchParams.get('results') || '[]'));
  const objective = parseFloat(searchParams.get('objective') || '0');
  const objective_label = decodeURIComponent(searchParams.get('objective_label') || '');
  const startNode = searchParams.get('start');
  const endNode = searchParams.get('end');
  
  // Process results to find the maximum flow path
  const [maxFlowPath, setMaxFlowPath] = useState([]);
  
  useEffect(() => {
    // Find edges with positive flow to identify the max flow path
    const nonZeroFlows = results.filter(([_, value]) => parseFloat(value) > 0.001);
    
    // Create a directed graph representation
    const graph = {};
    nonZeroFlows.forEach(([edgeName, flow]) => {
      // Parse edge name to get from and to nodes
      // Assumes edge name is in format "x_y" where x is source and y is target
      const [from, to] = edgeName.split('_');
      
      if (!graph[from]) graph[from] = [];
      graph[from].push({ to, flow });
    });
    
    // DFS to find all paths from start to end with flow > 0
    const findPaths = (current, end, path = [], flowPath = []) => {
      if (current === end) {
        return [path, flowPath];
      }
      
      if (!graph[current]) return null;
      
      for (const { to, flow } of graph[current]) {
        if (!path.includes(to)) {
          const newPath = [...path, to];
          const newFlowPath = [...flowPath, { from: current, to, flow }];
          const result = findPaths(to, end, newPath, newFlowPath);
          if (result) return result;
        }
      }
      
      return null;
    };
    
    if (startNode && endNode) {
      const pathResult = findPaths(startNode, endNode, [startNode], []);
      if (pathResult) {
        setMaxFlowPath(pathResult[1]);
      }
    }
  }, [results, startNode, endNode]);
  
  // Function to check if an edge is part of the max flow path
  const isMaxFlowEdge = (edgeName) => {
    const [from, to] = edgeName.split('_');
    return maxFlowPath.some(edge => edge.from === from && edge.to === to);
  };

  return (
    <div className="solution-container">
      <h1>Network Flow Solution</h1>
      
      <div className="objective">
        {objective_label}: {objective.toFixed(2)}
      </div>
      
      <h3>Flow Assignment</h3>
      <table>
        <thead>
          <tr>
            <th>Edge</th>
            <th>Flow</th>
            <th>Path</th>
          </tr>
        </thead>
        <tbody>
          {results.map(([varName, value], index) => {
            const flowValue = parseFloat(value);
            const isMaxPath = isMaxFlowEdge(varName);
            
            return (
              <tr key={index} className={flowValue > 0.001 ? (isMaxPath ? 'max-flow-path' : 'positive-flow') : ''}>
                <td>{varName}</td>
                <td>{flowValue.toFixed(2)}</td>
                <td>
                  {flowValue > 0.001 && isMaxPath && (
                    <span className="path-badge">Max Flow Path</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <div className="solution-legend">
        <div className="legend-item">
          <div className="legend-color max-flow"></div>
          <span>Max Flow Path</span>
        </div>
        <div className="legend-item">
          <div className="legend-color positive-flow"></div>
          <span>Positive Flow</span>
        </div>
      </div>
      
      <div className="solution-buttons">
        <Link href="/">
          <button>Back to Graph Builder</button>
        </Link>
      </div>
    </div>
  );
}