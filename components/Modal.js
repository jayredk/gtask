import styles from "../styles/Modal.module.css"
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Modal({ title, body, labels }) {
  
  return (
    <div className={styles.dashboard}>
      <div className={styles.toolBar}>
        <div>
          {labels && labels.map((label) => {

            return (
              <span key={label.name} className={`${styles.label}`}>{label.name}</span>
            )
          })}
        </div>
        
        <div className={styles.menuWrap}>
          <div className={styles.dots}>
            <div className={styles.dot}></div>
          </div>
          <input className={styles.menuBtn} type="checkbox" />
        </div>
      </div>
      <h1>{title}</h1>
      <div className={inter.className}>
        {body || 'No description provided.' }
      </div>
    </div>
  )
}