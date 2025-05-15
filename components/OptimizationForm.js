'use client';

import { useState } from 'react';
import axios from 'axios';
import styles from './OptimizationForm.module.css';

export default function OptimizationForm({ cities, setResults, setError }) {
  const [budget, setBudget] = useState('');
  const [minDistance, setMinDistance] = useState(50); // Default 50 km
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResults(null);
    setIsLoading(true);

    if (cities.length < 2) {
      setError('Please select at least two cities.');
      setIsLoading(false);
      return;
    }

    if (!budget || budget <= 0) {
      setError('Please enter a valid budget.');
      setIsLoading(false);
      return;
    }

    try {
      // Dynamically import Leaflet only on the client side
      const L = (await import('leaflet')).default;

      // Calculate distances
      const distances = [];
      for (let i = 0; i < cities.length; i++) {
        for (let j = i + 1; j < cities.length; j++) {
          const from = cities[i];
          const to = cities[j];
          const distance = L.latLng(from.lat, from.lng).distanceTo(L.latLng(to.lat, to.lng)) / 1000; // Convert to km
          distances.push({ from: from.name, to: to.name, distance });
        }
      }

      const data = {
        villes: cities.map((c) => c.name),
        couts_usine: cities.map((c) => c.cout_usine),
        couts_entrepot: cities.map((c) => c.cout_entrepot),
        rentabilite_usine: cities.map((c) => c.rentabilite_usine),
        rentabilite_entrepot: cities.map((c) => c.rentabilite_entrepot),
        budget_total: parseFloat(budget),
        distances,
        distance_min_usines: parseFloat(minDistance),
      };

      const response = await axios.post('http://localhost:5000/solve', data);
      // Pass the results to parent component without showing a toast here
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during optimization.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Optimization Parameters</h2>
        <div className={styles.badge}>
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 11-3 3 3 3"></path>
            <path d="m15 11 3 3-3 3"></path>
            <path d="m12 17-1-8"></path>
          </svg>
          <span>Advanced</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="budget">Budget Total (TND):</label>
          <div className={styles.inputWrapper}>
            <input
              id="budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter your total budget"
              required
            />
            <div className={styles.inputIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1v22"></path>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="distance">Minimum Distance Between Factories (km):</label>
          <div className={styles.rangeContainer}>
            <input
              id="distance"
              type="range"
              min="10"
              max="200"
              step="5"
              value={minDistance}
              onChange={(e) => setMinDistance(e.target.value)}
              className={styles.rangeInput}
            />
            <div className={styles.rangeValue}>{minDistance} km</div>
          </div>
        </div>
        
        <div className={styles.buttonContainer}>
          <button 
            className={`${styles.button} ${isLoading ? styles.loading : ''}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
                Optimizing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <path d="M15 3h6v6"></path>
                  <path d="m10 14 11-11"></path>
                </svg>
                Run Optimization
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}