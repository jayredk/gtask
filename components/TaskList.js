import styles from "../styles/TaskList.module.css"
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function TaskList({ children }) {
  
  return (
    <ul className={`${inter.className} ${styles.taskList}`}>
      {children}
    </ul>
  )
}