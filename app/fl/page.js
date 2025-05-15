'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CitySelector from '../../components/CitySelector';
import OptimizationForm from '../../components/OptimizationForm';
import ResultsModal from '../../components/ResultsModal';
import useToast from '../../components/UseToast';
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
  { name: 'Gabès', lat: 33.8818, lng: 10.0982, cout_usine: 780000, cout_entrepot: 390000, rentabilite_usine: 156000, rentabilite_entrepot: 78000 },
  { name: 'Ariana', lat: 36.8665, lng: 10.1647, cout_usine: 970000, cout_entrepot: 485000, rentabilite_usine: 194000, rentabilite_entrepot: 97000 },
  { name: 'Gafsa', lat: 34.4250, lng: 8.7842, cout_usine: 760000, cout_entrepot: 380000, rentabilite_usine: 152000, rentabilite_entrepot: 76000 },
  { name: 'Monastir', lat: 35.6770, lng: 10.8262, cout_usine: 820000, cout_entrepot: 410000, rentabilite_usine: 164000, rentabilite_entrepot: 82000 },
  { name: 'Nabeul', lat: 36.4513, lng: 10.7350, cout_usine: 840000, cout_entrepot: 420000, rentabilite_usine: 168000, rentabilite_entrepot: 84000 },
  { name: 'Zarzis', lat: 33.5036, lng: 11.1122, cout_usine: 750000, cout_entrepot: 375000, rentabilite_usine: 150000, rentabilite_entrepot: 75000 },
  { name: 'Kasserine', lat: 35.1676, lng: 8.8365, cout_usine: 730000, cout_entrepot: 365000, rentabilite_usine: 146000, rentabilite_entrepot: 73000 },
  { name: 'Mahdia', lat: 35.5047, lng: 11.0622, cout_usine: 810000, cout_entrepot: 405000, rentabilite_usine: 162000, rentabilite_entrepot: 81000 },
  { name: 'Tozeur', lat: 33.9197, lng: 8.1335, cout_usine: 720000, cout_entrepot: 360000, rentabilite_usine: 144000, rentabilite_entrepot: 72000 },
  { name: 'Medenine', lat: 33.3549, lng: 10.5055, cout_usine: 770000, cout_entrepot: 385000, rentabilite_usine: 154000, rentabilite_entrepot: 77000 },
  { name: 'Tataouine', lat: 32.9297, lng: 10.4518, cout_usine: 700000, cout_entrepot: 350000, rentabilite_usine: 140000, rentabilite_entrepot: 70000 },
  { name: 'Kebili', lat: 33.7044, lng: 8.9717, cout_usine: 710000, cout_entrepot: 355000, rentabilite_usine: 142000, rentabilite_entrepot: 71000 },
  { name: 'Siliana', lat: 36.0840, lng: 9.3708, cout_usine: 720000, cout_entrepot: 360000, rentabilite_usine: 144000, rentabilite_entrepot: 72000 },
  { name: 'Beja', lat: 36.7256, lng: 9.1842, cout_usine: 740000, cout_entrepot: 370000, rentabilite_usine: 148000, rentabilite_entrepot: 74000 },
  { name: 'Jendouba', lat: 36.5011, lng: 8.7802, cout_usine: 730000, cout_entrepot: 365000, rentabilite_usine: 146000, rentabilite_entrepot: 73000 }
];

export default function SolvePage() {
  const [selectedCities, setSelectedCities] = useState([]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast, showConfirmToast } = useToast();

  const handleCitySelect = (city) => {
    if (!selectedCities.find((c) => c.name === city.name)) {
      setSelectedCities([...selectedCities, city]);
      showToast(`${city.name} added to selection`, 'success');
    } else {
      showToast(`${city.name} is already selected`, 'warning');
    }
  };

  const handleCityRemove = async (cityName) => {
    const confirmed = await showConfirmToast(`Are you sure you want to remove ${cityName}?`, 'Confirm');
    if (confirmed) {
      setSelectedCities(selectedCities.filter((c) => c.name !== cityName));
      showToast(`${cityName} removed from selection`, 'info');
    }
  };

  const handleResults = (results) => {
    setResults(results);
    setIsModalOpen(true);
    
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Centralized error handler to show toast only once
  const handleError = (errorMsg) => {
    setError(errorMsg);
    if (errorMsg) {
      showToast(errorMsg, 'error');
    }
  };

  return (
    <>
      <div className={styles.header}>
        <h1> Location Optimizer</h1>
        <p className={styles.subheading}>Find the optimal placement for Infrastructeres</p>
      </div>
      <div className={styles.container}>
        <div className={styles.con1}>
          <MapComponent cities={CITIES} onCitySelect={handleCitySelect} selectedCities={selectedCities} />
        </div>
        <div className={styles.con2}>
          <OptimizationForm 
            cities={selectedCities} 
            setResults={handleResults} 
            setError={handleError} 
          />
          <CitySelector cities={selectedCities} onRemove={handleCityRemove} />
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
      <ResultsModal isOpen={isModalOpen} onClose={closeModal} results={results} />
      <ToastContainer />
      <script src="https://cdn.tailwindcss.com"></script>
    </>
  );
}