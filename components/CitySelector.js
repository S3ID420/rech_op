import styles from './CitySelector.module.css';

export default function CitySelector({ cities, onRemove }) {
  return (
    <div className={styles.container}>
      {cities.length === 0 ? (
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <p>No cities selected yet</p>
          <span className={styles.emptyHint}>Select cities from the map to get started</span>
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <h2>Selected Cities</h2>
            <span className={styles.cityCount}>{cities.length} {cities.length === 1 ? 'city' : 'cities'}</span>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>City</th>
                  <th>Factory Cost</th>
                  <th>Warehouse Cost</th>
                  <th>Factory ROI</th>
                  <th>Warehouse ROI</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((city) => (
                  <tr key={city.name}>
                    <td className={styles.cityName}>{city.name}</td>
                    <td>{city.cout_usine.toLocaleString()} TND</td>
                    <td>{city.cout_entrepot.toLocaleString()} TND</td>
                    <td className={styles.profitCell}>{city.rentabilite_usine.toLocaleString()} TND</td>
                    <td className={styles.profitCell}>{city.rentabilite_entrepot.toLocaleString()} TND</td>
                    <td>
                      <button 
                        className={styles.removeButton} 
                        onClick={() => onRemove(city.name)}
                        aria-label={`Remove ${city.name}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}