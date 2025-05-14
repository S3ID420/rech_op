import { useState, useEffect, useRef, useCallback } from 'react';
import Modal from './Modal';

export default function SolutionModal({ results, objective, objective_label, startNode, endNode, onClose }) {
  const [maxFlowPath, setMaxFlowPath] = useState([]);
  const canvasRef = useRef(null);
  const [nonZeroFlows, setNonZeroFlows] = useState([]);
  
  // Safe close handler
  const handleClose = useCallback(() => {
    // Clean up
    setMaxFlowPath([]);
    setNonZeroFlows([]);
    // Call parent's onClose
    onClose();
  }, [onClose]);

  // Process flows and set max flow paths
  useEffect(() => {
    if (!results || !Array.isArray(results)) {
      console.warn('Invalid results prop');
      return;
    }

    const filteredFlows = results;
    setNonZeroFlows(filteredFlows);

    // Build graph representation and max flow paths
    const graph = {};
    const flowPaths = [];
    
    console.log('Graph:', graph);
    setMaxFlowPath(flowPaths);
  }, [results]);

  // Draw the graph on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas ref is null');
      return;
    }
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Collect unique node IDs from non-zero flows
    const nodeIds = new Set();
    console.log('Non-Zero Flows:', nonZeroFlows);
    nonZeroFlows.forEach(({from, to, _}) => {
      if (!isNaN(parseInt(from)) && !isNaN(parseInt(to))) {
        nodeIds.add(parseInt(from));
        nodeIds.add(parseInt(to));
      }
    });
    const uniqueNodes = Array.from(nodeIds).sort((a, b) => a - b);
    console.log('Unique Nodes:', uniqueNodes);

    if (uniqueNodes.length === 0) {
      ctx.font = '16px Arial';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.fillText('No valid flows to display', canvas.width / 2, canvas.height / 2);
      return;
    }

    const nodePositions = {};
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 50;

    // Position only the unique nodes
    uniqueNodes.forEach((nodeId, index) => {
      const angle = (2 * Math.PI * index) / uniqueNodes.length;
      nodePositions[nodeId] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
    console.log('NodePositions:', nodePositions);

    // Draw edges
    nonZeroFlows.forEach(({from, to, cap}) => {
      const flowValue = parseFloat(cap);
      if (flowValue <= 0.001 || isNaN(parseInt(from)) || isNaN(parseInt(to))) return;

      const fromPos = nodePositions[parseInt(from)];
      const toPos = nodePositions[parseInt(to)];
      if (!fromPos || !toPos) return;

      ctx.beginPath();
      ctx.moveTo(fromPos.x, fromPos.y);
      ctx.lineTo(toPos.x, toPos.y);
      ctx.strokeStyle = '#48bb78'; // Green for all edges
      ctx.lineWidth = 3;
      ctx.stroke();

      const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
      const arrowSize = 10;
      const arrowX = toPos.x - 25 * Math.cos(angle);
      const arrowY = toPos.y - 25 * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(arrowX - arrowSize * Math.cos(angle - Math.PI / 6), arrowY - arrowSize * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(arrowX, arrowY);
      ctx.lineTo(arrowX - arrowSize * Math.cos(angle + Math.PI / 6), arrowY - arrowSize * Math.sin(angle + Math.PI / 6));
      ctx.fillStyle = '#48bb78'; // Green for arrows
      ctx.fill();

      const labelX = (fromPos.x + toPos.x) / 2;
      const labelY = (fromPos.y + toPos.y) / 2;
      ctx.font = '12px Arial';
      ctx.fillStyle = '#2f855a'; // Dark green for labels
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const label = flowValue.toFixed(1);
      const labelWidth = ctx.measureText(label).width + 8;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillRect(labelX - labelWidth / 2, labelY - 10, labelWidth, 20);

      ctx.fillStyle = '#2f855a';
      ctx.fillText(label, labelX, labelY);
    });

    // Draw nodes
    uniqueNodes.forEach((nodeId) => {
      const pos = nodePositions[nodeId];
      if (!pos) return;

      let fillColor, strokeColor;
      if (nodeId === startNode) {
        fillColor = '#48bb78';
        strokeColor = '#2f855a';
      } else if (nodeId === endNode) {
        fillColor = '#f56565';
        strokeColor = '#c53030';
      } else {
        fillColor = '#4299e1'; // Green for all non-start/end nodes
        strokeColor = '#4299e5';
      }

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 24, 0, 2 * Math.PI);

      const gradient = ctx.createLinearGradient(pos.x - 24, pos.y - 24, pos.x + 24, pos.y + 24);
      gradient.addColorStop(0, fillColor);
      gradient.addColorStop(1, strokeColor);

      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = strokeColor;
      ctx.stroke();

      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(nodeId.toString(), pos.x, pos.y);
    });
  }, [nonZeroFlows, maxFlowPath, startNode, endNode]);

  const isMaxFlowEdge = (edgeName) => {
    const edgePart = edgeName.startsWith('flow_') ? edgeName.replace('flow_', '') : edgeName;
    const [from, to] = edgePart.split('_');
    return nonZeroFlows.some(({nFrom, nTo, _}) => {
      return nFrom === from && nTo === to;
    });
  };

  return (
    <Modal onClose={handleClose}>
      <div className="solution-modal-content">
        <h3>Network Flow Solution</h3>
        <div className="form-group">
          <p>
            <strong>{objective_label}:</strong> {objective.toFixed(2)}
          </p>
        </div>
        
        <div className="flow-visualization">
          <h4>Flow Visualization</h4>
          <div className="canvas-container" style={{ position: 'relative' }}>
            <canvas 
              ref={canvasRef} 
              width={400} 
              height={400} 
              style={{ 
                border: '1px solid #e2e8f0',
                borderRadius: '5px',
                background: '#f7fafc'
              }}
            />
          </div>
          <div className="graph-legend" style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
            <div className="legend-item" style={{ display: 'flex', alignItems: 'center' }}>
              <div className="legend-color" style={{ width: '20px', height: '20px', backgroundColor: '#48bb78', marginRight: '5px' }}></div>
              <span>Max Flow Path</span>
            </div>
          </div>
        </div>
        
        
        <div className="buttons" style={{ marginTop: '20px' }}>
          <button 
            className="secondary" 
            onClick={handleClose}
            style={{
              backgroundColor: '#48bb78', // Changed to green for consistency
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}