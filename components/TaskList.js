import TaskItem from "@/components/TaskItem"

import styles from "../styles/TaskList.module.css"
import taskItemStyles from '@/styles/TaskItem.module.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function TaskList({ tasks, lastTaskRef, setModalData }) {
  
  return (
    <ul className={`${inter.className} ${styles.taskList}`}>
      { tasks && tasks.map((task, index) => {
        if (tasks.length === index + 1) {
          return (
            <TaskItem ref={lastTaskRef} key={task.id} className={taskItemStyles.taskItem}>
              <button onClick={() => setModalData(task)} type='button'>{task.title}</button>
            </TaskItem>
          )
        } else {
          return (
            <TaskItem key={task.id} className={taskItemStyles.taskItem}>
              <button onClick={() => setModalData(task)} type='button'>{task.title}</button>
            </TaskItem>
          )
        }
      })}
    </ul>
  )
}