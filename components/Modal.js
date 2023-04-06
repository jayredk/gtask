import { useState } from "react"
import styles from "../styles/Modal.module.css"
import { Inter } from 'next/font/google'
import Cookies from "js-cookie"

const inter = Inter({ subsets: ['latin'] })

export default function Modal({ title, body, labels, url, onEditSuccess }) {
  const [isEdit, setIsEdit] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleInputChange = (e) => {
    setIsMenuOpen(e.target.checked)
  }
  
  const updateTask = async (data) => {
    try {
      const accessToken = Cookies.get('token')

      const res = await fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          accept: 'application/vnd.github+json',
          Authorization: `Bearer ${accessToken}`
        }
      })

      const response = await res.json()

      onEditSuccess(response)
      setIsEdit(false);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, body } = e.target.elements;

    const data = {
      title: title.value,
      body: body.value,
    }

    updateTask(data)    
  }

  const handleDelete = () => {
    const data = {
      state: 'closed'
    }
    updateTask(data)
    setIsMenuOpen(false);
  }

  const handelEditBtn = () => {
    setIsEdit(true)
    setIsMenuOpen(false);
  }

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
          <input className={styles.menuToggle} type="checkbox" checked={isMenuOpen} onChange={handleInputChange} />
          <ul className={`${styles.menu} ${isMenuOpen ? styles.active : ''}`}>
            <li>
              <button onClick={handelEditBtn} className={styles.menuBtn} type="button">Edit</button>
            </li>
            <li>
              <button onClick={handleDelete} className={`${styles.menuBtn} ${styles.delete}`} type="button">Delete</button>
            </li>
          </ul>
        </div>
      </div>
      {
        isEdit ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <input name="title" className={styles.title} defaultValue={title} type="text"/>
            <textarea name="body" className={inter.className} defaultValue={body || '' }>
            </textarea>
            <div className={styles.btnGroup}>
              <button type="submit">Save</button>
              <button onClick={() => setIsEdit(false)} className={styles.cancel} type="button">Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <h1 className={styles.title}>{title}</h1>
            <div className={inter.className}>
              {body || 'No description provided.' }
            </div>
          </>
        )
      }
      
    </div>
  )
}