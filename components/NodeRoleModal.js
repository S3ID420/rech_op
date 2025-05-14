import { useState } from 'react';
import Modal from './Modal';

export default function NodeRoleModal({ nodeId, onSubmit, onClose }) {
  const [role, setRole] = useState('none');

  const handleSubmit = () => {
    onSubmit(role);
  };

  return (
    <Modal onClose={onClose}>
      <h3>Set Node {nodeId} Role</h3>
      <div className="form-group">
        <label>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="none">None</option>
            <option value="start">Start (Source)</option>
            <option value="end">End (Sink)</option>
          </select>
        </label>
      </div>
      <div className="buttons">
        <button className="secondary" onClick={onClose}>Cancel</button>
        <button onClick={handleSubmit}>Apply</button>
      </div>
    </Modal>
  );
}