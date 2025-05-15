'use client';

import  './modal.css';

export default function ResultsModal({ isOpen, onClose, results }) {
  if (!isOpen || !results) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal">
        <h2>Optimization Results</h2>
        <div className="results-container">
          <div className="result-item">
            <span className="result-label">Total Profitability:</span>
            <span className="result-value">{results.profitabilite_totale} TND</span>
          </div>
          <div className="result-item">
            <span className="result-label">Budget Used:</span>
            <span className="result-value">{results.budget_utilise} / {results.budget_total} TND</span>
          </div>
          <div className="result-item">
            <span className="result-label">Factories Built:</span>
            <span className="result-value">{results.usines_construites.join(', ') || 'None'}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Warehouses Built:</span>
            <span className="result-value">{results.entrepots_construits.join(', ') || 'None'}</span>
          </div>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </>
  );
}