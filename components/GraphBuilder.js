import { useState, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  applyNodeChanges, 
  applyEdgeChanges,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
import NodeRoleModal from './NodeRoleModal';
import EdgeFormModal from './EdgeFormModal';

import SolutionModal from './SolutionModal';
import useToast from './UseToast';
import { ToastContainer } from 'react-toastify';
import "../app/network/page.css"

const nodeStyles = {
  width: 48,
  height: 48,
  color: '#ffffff',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  fontWeight: '600',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
};

const edgeStyles = {
  stroke: '#4299e1',
  strokeWidth: 2,
  animation: 'flow 2s linear infinite',
};

// Custom Node with Two Handles (Left: Target, Right: Source)
const CustomNode = ({ data, id, selected }) => {
  return (
    <div style={{
      ...nodeStyles,
      background: id == data.startNode ? 'linear-gradient(135deg, #48bb78, #38a169)' :
                id == data.endNode ? 'linear-gradient(135deg, #f56565, #e53e3e)' :
                'linear-gradient(135deg, #4299e1, #3182ce)',
      border: id == data.startNode ? '2px solid #2f855a' :
              id == data.endNode ? '2px solid #c53030' :
              '2px solid #2b6cb0',
      transform: selected ? 'scale(1.1)' : 'scale(1)',
    }}>
      <Handle type="target" position={Position.Left} id="left" style={{ background: '#555' }} />
      <Handle type="source" position={Position.Right} id="right" style={{ background: '#555' }} />
      <div>{data.label}</div>
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export default function GraphBuilder({
  nodes,
  setNodes,
  edges,
  setEdges,
  startNode,
  setStartNode,
  endNode,
  setEndNode,
}) {
  return (
    <ReactFlowProvider>
      <GraphBuilderContent
        nodes={nodes}
        setNodes={setNodes}
        edges={edges}
        setEdges={setEdges}
        startNode={startNode}
        setStartNode={setStartNode}
        endNode={endNode}
        setEndNode={setEndNode}
      />
    </ReactFlowProvider>
  );
}

function GraphBuilderContent({
  nodes,
  setNodes,
  edges,
  setEdges,
  startNode,
  setStartNode,
  endNode,
  setEndNode,
}) {
  const { project } = useReactFlow();
  const [gridSize, setGridSize] = useState(25);
  const [useGridSnap, setUseGridSnap] = useState(true);
  const [showNodeRoleModal, setShowNodeRoleModal] = useState(false);
  const [showEdgeFormModal, setShowEdgeFormModal] = useState(false);
  const [showGridSettingsModal, setShowGridSettingsModal] = useState(false);
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [solutionData, setSolutionData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [nodeMode, setNodeMode] = useState('add');
  const { showToast, showConfirmToast } = useToast();

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params) => {
      setSelectedEdge({ source: params.source, target: params.target, cap: 10 });
      setShowEdgeFormModal(true);
    },
    []
  );

  const onPaneClick = useCallback(
    (event) => {
      if (nodeMode === 'add') {
        const position = project({
          x: event.clientX,
          y: event.clientY,
        });

        const snappedPosition = useGridSnap
          ? {
              x: Math.round(position.x / gridSize) * gridSize,
              y: Math.round(position.y / gridSize) * gridSize,
            }
          : position;

        // Find the smallest unused ID
        const existingIds = nodes.map((node) => parseInt(node.id)).sort((a, b) => a - b);
        let newId = 0;
        while (existingIds.includes(newId)) {
          newId++;
        }

        const newNode = {
          id: `${newId}`,
          position: snappedPosition,
          data: { label: `${newId}`, startNode, endNode },
          type: 'custom',
          style: nodeStyles,
        };
        setNodes((nds) => [...nds, newNode]);
      }
    },
    [nodes, gridSize, useGridSnap, setNodes, nodeMode, project, startNode, endNode]
  );

  const onNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault();
      setSelectedNode(node);
      setShowNodeRoleModal(true);
    },
    []
  );

  const onEdgeClick = useCallback(
    (event, edge) => {
      setSelectedEdge({
        source: edge.source,
        target: edge.target,
        cap: edges.find((e) => e.from === parseInt(edge.source) && e.to === parseInt(edge.target)).cap,
      });
      setShowEdgeFormModal(true);
    },
    [edges]
  );

  const onNodeClick = useCallback(
    async (event, node) => {
      if (nodeMode === 'delete') {
        const confirmed = await showConfirmToast(`Delete node ${node.id}?`, 'Delete');
        if (confirmed) {
          setEdges((eds) => eds.filter(
            (e) => e.from !== parseInt(node.id) && e.to !== parseInt(node.id)
          ));
          setNodes((nds) => nds.filter((n) => n.id !== node.id));
          if (startNode === parseInt(node.id)) setStartNode(null);
          if (endNode === parseInt(node.id)) setEndNode(null);
          showToast(`Node ${node.id} deleted`, 'success');
        }
      }
    },
    [nodeMode, setNodes, setEdges, startNode, endNode, setStartNode, setEndNode, showConfirmToast, showToast]
  );

  const handleEdgeSubmit = (edgeData) => {
    if (edgeData) {
      const newEdge = {
        from: parseInt(edgeData.source),
        to: parseInt(edgeData.target),
        cap: parseFloat(edgeData.cap),
      };
      if (
        nodes.some((n) => n.id === edgeData.source) &&
        nodes.some((n) => n.id === edgeData.target) &&
        !isNaN(newEdge.cap) &&
        newEdge.cap > 0
      ) {
        setEdges((eds) => {
          const exists = eds.some(
            (e) => e.from === newEdge.from && e.to === newEdge.to
          );
          if (exists) {
            return eds.map((e) =>
              e.from === newEdge.from && e.to === newEdge.to ? newEdge : e
            );
          }
          return [...eds, newEdge];
        });
      } else {
        showToast('Invalid node IDs or capacity', 'error');
      }
    }
    setShowEdgeFormModal(false);
    setSelectedEdge(null);
  };

  const handleNodeRoleSubmit = (role) => {
    if (selectedNode) {
      if (role === 'start') {
        setStartNode(parseInt(selectedNode.id));
      } else if (role === 'end') {
        setEndNode(parseInt(selectedNode.id));
      } else {
        if (startNode === parseInt(selectedNode.id)) setStartNode(null);
        if (endNode === parseInt(selectedNode.id)) setEndNode(null);
      }
    }
    setShowNodeRoleModal(false);
    setSelectedNode(null);
  };

  const deleteEdge = (source, target) => {
    setEdges((eds) => eds.filter(
      (e) => !(e.from === parseInt(source) && e.to === parseInt(target))
    ));
  };

  const solveNetwork = async () => {
    if (startNode === null || endNode === null) {
      showToast('Please set a start node and an end node', 'warning');
      return;
    }
    if (edges.length === 0) {
      showToast('Please add at least one edge to the network', 'warning');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/solve', {
        nodes,
        edges,
        startNode,
        endNode,
      });
      console.log(response)
      setSolutionData({
        results: response.data.results,
        objective: response.data.objective,
        objective_label: response.data.objective_label,
        startNode,
        endNode,
      });
      setShowSolutionModal(true);
      showToast('Network solved successfully', 'success');
    } catch (error) {
      showToast(error.response?.data?.error || 'Error solving network', 'error');
    }
  };

  const reactFlowEdges = edges.map((edge) => ({
    id: `e${edge.from}-${edge.to}`,
    source: `${edge.from}`,
    target: `${edge.to}`,
    label: `${edge.cap}`,
    type: 'straight',
    style: edgeStyles,
    labelStyle: { fontWeight: 500, fontSize: '12px' },
    markerEnd: { type: 'arrowclosed', color: '#4299e1', width: 20, height: 20 },
    data: { onDelete: () => deleteEdge(edge.from, edge.to) }
  }));

  const updatedNodes = nodes.map((node) => ({
    ...node,
    type: 'custom',
    data: {
      ...node.data,
      startNode,
      endNode,
    },
  }));

  const toggleNodeMode = () => {
    setNodeMode(nodeMode === 'add' ? 'delete' : 'add');
  };

  return (
    <div className="container">
      <style>
        {`
          @keyframes flow {
            0% {
              stroke-dashoffset: 0;
            }
            100% {
              stroke-dashoffset: 20;
            }
          }
          .react-flow__edge-path {
            stroke-dasharray: 10;
          }
        `}
      </style>
      <div className="header">
        <h1>Irrigation System optimizer</h1>
        <div className="header-buttons">
          <button 
            className={nodeMode === 'delete' ? 'delete-mode' : 'secondary'}
            onClick={toggleNodeMode}
          >
            {nodeMode === 'add' ? 'Delete Mode' : 'Add Mode'}
          </button>
          <button className="secondary" onClick={() => setShowEdgeFormModal(true)}>Add Edge</button>
         
          <button className="solve" onClick={solveNetwork}>Solve Network</button>
        </div>
      </div>
      <div className="graph">
        <ReactFlow
          nodes={updatedNodes}
          edges={reactFlowEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onPaneClick={onPaneClick}
          onNodeContextMenu={onNodeContextMenu}
          onEdgeClick={onEdgeClick}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background variant="dots" gap={gridSize} size={1} color="#718096" />
          <Controls />
          <Panel position="top-left" className="instructions-panel">
            <div className="instructions">
              <h3>Instructions</h3>
              <ul>
                <li>Click on the canvas to add nodes</li>
                <li>Right-click on a node to set it as source or sink</li>
                <li>Drag from a node's right handle to another's left handle to create an edge</li>
                <li>Click on an edge to edit its capacity</li>
                <li>Use Delete Mode to remove nodes</li>
              </ul>
            </div>
          </Panel>
        </ReactFlow>
      </div>
      {showNodeRoleModal && (
        <NodeRoleModal
          nodeId={selectedNode?.id}
          onSubmit={handleNodeRoleSubmit}
          onClose={() => setShowNodeRoleModal(false)}
        />
      )}
      {showEdgeFormModal && (
        <EdgeFormModal
          edge={selectedEdge}
          onSubmit={handleEdgeSubmit}
          onClose={() => {
            setShowEdgeFormModal(false);
            setSelectedEdge(null);
          }}
        />
      )}
      {showGridSettingsModal && (
        <GridSettingsModal
          gridSize={gridSize}
          useGridSnap={useGridSnap}
          setGridSize={setGridSize}
          setUseGridSnap={setUseGridSnap}
          onClose={() => setShowGridSettingsModal(false)}
        />
      )}
      {showSolutionModal && solutionData && (
        <SolutionModal
          results={solutionData.results}
          objective={solutionData.objective}
          objective_label={solutionData.objective_label}
          startNode={solutionData.startNode}
          endNode={solutionData.endNode}
          onClose={() => setShowSolutionModal(false)}
        />
      )}
      <ToastContainer />
    </div>
  );
}