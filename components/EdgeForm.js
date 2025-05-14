export default function EdgeForm({ edgeForm, setEdgeForm, addEdge }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <input
        type="number"
        placeholder="From Node ID"
        value={edgeForm.from}
        onChange={(e) => setEdgeForm({ ...edgeForm, from: e.target.value })}
      />
      <input
        type="number"
        placeholder="To Node ID"
        value={edgeForm.to}
        onChange={(e) => setEdgeForm({ ...edgeForm, to: e.target.value })}
      />
      <input
        type="number"
        placeholder="Capacity"
        value={edgeForm.cap}
        onChange={(e) => setEdgeForm({ ...edgeForm, cap: e.target.value })}
        step="0.1"
        min="0"
      />
      <button onClick={addEdge}>Add Edge</button>
    </div>
  );
}