import { useState } from "react"
import styles from "../styles/Modal.module.css"
import { Inter } from 'next/font/google'
import Cookies from "js-cookie"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const inter = Inter({ subsets: ['latin'] })

export default function Modal({ title, body, labels, url, onEditSuccess, dataList, onSave }) {
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

      MySwal.fire({
        icon: 'success',
        title: <strong>Task 更新成功</strong>,
      })

      onEditSuccess(response)
      setIsEdit(false);

      onSave((prevState) => {
        const index = dataList.findIndex((task) => task.id === response.id)
        const newState = [...prevState]
        newState[index] = response

        return newState
      })
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, body } = e.target.elements;

    if (title.value.trim() === '') {
      MySwal.fire({
        icon: 'error',
        title: <strong>標題 欄位為必填</strong>,
      })
      return;
    }

    if (body.value.length < 30) {
      MySwal.fire({
        icon: 'error',
        title: <strong>內容 欄位需至少 30 字</strong>,
      })
      return;
    }

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
            <input name="title" className={styles.title} defaultValue={title} placeholder="請輸入標題" type="text"/>
            <textarea name="body" className={inter.className} defaultValue={body} placeholder="請輸入內容">
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