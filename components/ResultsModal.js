'use client';

import { useEffect } from 'react';
import styles from './Modal.css';

export default function ResultsModal({ isOpen, onClose, results }) {
  useEffect(() => {
    // Lock body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [isOpen]);
  
  // Close on escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  if (!isOpen || !results) return null;

  // Calculate budget percentage used
  const budgetPercentage = ((results.budget_utilise / results.budget_total) * 100).toFixed(1);

  return (
    <div className="modalOverlay" onClick={() => onClose()}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h2 className="modalTitle">Optimization Results</h2>
          <div className="modalTag">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Optimized</span>
          </div>
        </div>
        
        <div className="resultsContainer">
          <div className="resultItem">
            <span className="resultLabel">Total Profitability:</span>
            <span className="resultValue highlightValue">{results.profitabilite_totale.toLocaleString()} TND</span>
          </div>
          
          <div className="resultItem">
            <span className="resultLabel">Budget Used:</span>
            <span className="resultValue">
              {results.budget_utilise.toLocaleString()} / {results.budget_total.toLocaleString()} TND
              <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem', color: '#6b7280' }}>
                ({budgetPercentage}%)
              </span>
            </span>
          </div>
          
          <div className="resultItem">
            <span className="resultLabel">Factories Built:</span>
            <div className="cityList">
              {results.usines_construites.length > 0 ? (
                results.usines_construites.map(city => (
                  <span key={`factory-${city}`} className="cityTag">
                    {city}
                  </span>
                ))
              ) : (
                <span className="resultValue">None</span>
              )}
            </div>
          </div>
          
          <div className="resultItem">
            <span className="resultLabel">Warehouses Built:</span>
            <div className="cityList">
              {results.entrepots_construits.length > 0 ? (
                results.entrepots_construits.map(city => (
                  <span key={`warehouse-${city}`} className="cityTag">
                    {city}
                  </span>
                ))
              ) : (
                <span className="resultValue">None</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="footer">
          <button className="closeButton" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" className="buttonIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}