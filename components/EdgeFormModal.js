import { useState, useEffect } from 'react';
import Modal from './Modal';
import useToast from './UseToast';

export default function EdgeFormModal({ edge, onSubmit, onClose }) {
  const [form, setForm] = useState({
    source: edge?.source || '',
    target: edge?.target || '',
    cap: edge?.cap || '',
  });
  const { showToast } = useToast();

  useEffect(() => {
    if (edge) {
      setForm({
        source: edge.source,
        target: edge.target,
        cap: edge.cap,
      });
    }
  }, [edge]);

  const handleSubmit = () => {
    if (form.source && form.target && form.cap) {
      onSubmit(form);
    } else {
      showToast('Please fill all fields', 'error');
    }
  };

  return (
    <Modal onClose={onClose}>
      <h3>{edge ? 'Edit Edge' : 'Add Edge'}</h3>
      <div className="form-group">
        <label>
          From Node:
          <input
            type="number"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            placeholder="Node ID"
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          To Node:
          <input
            type="number"
            value={form.target}
            onChange={(e) => setForm({ ...form, target: e.target.value })}
            placeholder="Node ID"
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Capacity:
          <input
            type="number"
            value={form.cap}
            onChange={(e) => setForm({ ...form, cap: e.target.value })}
            placeholder="Capacity"
            step="0.1"
            min="0"
          />
        </label>
      </div>
      <div className="buttons">
        <button className="secondary" onClick={onClose}>Cancel</button>
        <button onClick={handleSubmit}>{edge ? 'Update' : 'Add'}</button>
      </div>
    </Modal>
  );
}