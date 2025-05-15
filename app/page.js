import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.splitScreen}>
        <div className={`${styles.split} ${styles.left}`}>
          <div className={styles.overlay}>
            <h1>Problem 1</h1>
            <p>Explore solutions to the first problem</p>
            <a href="/network" className={styles.button}>
              Learn More
            </a>
          </div>
        </div>
        <div className={`${styles.split} ${styles.right}`}>
          <div className={styles.overlay}>
            <h1>Problem 2</h1>
            <p>Discover approaches to the second problem</p>
            <a href="/fl" className={styles.button}>
              Learn More
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}