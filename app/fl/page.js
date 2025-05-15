'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import CitySelector from '../../components/CitySelector';
import OptimizationForm from '../../components/OptimizationForm';
import ResultsModal from '../../components/ResultsModal';
import styles from './solve.module.css';
// Dynamically import MapComponent with SSR disabled
const MapComponent = dynamic(() => import('../../components/MapComponent'), {
  ssr: false, // Disable server-side rendering
});
const CITIES = [
  { name: 'Tunis', lat: 36.8065, lng: 10.1815, cout_usine: 1000000, cout_entrepot: 500000, rentabilite_usine: 200000, rentabilite_entrepot: 100000 },
  { name: 'Sfax', lat: 34.7398, lng: 10.7600, cout_usine: 900000, cout_entrepot: 450000, rentabilite_usine: 180000, rentabilite_entrepot: 90000 },
  { name: 'Sousse', lat: 35.8256, lng: 10.6412, cout_usine: 950000, cout_entrepot: 475000, rentabilite_usine: 190000, rentabilite_entrepot: 95000 },
  { name: 'Bizerte', lat: 37.2744, lng: 9.8739, cout_usine: 850000, cout_entrepot: 425000, rentabilite_usine: 170000, rentabilite_entrepot: 85000 },
  { name: 'Kairouan', lat: 35.6781, lng: 10.0963, cout_usine: 800000, cout_entrepot: 400000, rentabilite_usine: 160000, rentabilite_entrepot: 80000 },
];
export default function SolvePage() {
  const [selectedCities, setSelectedCities] = useState([]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCitySelect = (city) => {
    if (!selectedCities.find((c) => c.name === city.name)) {
      setSelectedCities([...selectedCities, city]);
    }
  };
  const handleCityRemove = (cityName) => {
    setSelectedCities(selectedCities.filter((c) => c.name !== cityName));
  };
  const handleResults = (results) => {
    setResults(results);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div className={styles.header}>
        <h1>Industrial Location Optimizer</h1>
        <p className={styles.subheading}>Find the optimal placement for factories and warehouses</p>
      </div>
      <div className={styles.container}>
        <div className={styles.con1}>
          <MapComponent cities={CITIES} onCitySelect={handleCitySelect} selectedCities={selectedCities} />
        </div>
        <div className={styles.con2}>
          <OptimizationForm cities={selectedCities} setResults={handleResults} setError={setError} />
          <CitySelector cities={selectedCities} onRemove={handleCityRemove} />
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
      <ResultsModal isOpen={isModalOpen} onClose={closeModal} results={results} />
      <script src="https://cdn.tailwindcss.com"></script>
    </>
  );
}