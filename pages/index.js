import Head from 'next/head'
import Image from 'next/image';
import { useState, useRef, useCallback } from 'react'
import useSWR from 'swr'
import Cookies from 'js-cookie';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import TaskItem from "@/components/TaskItem"
import TaskList from "@/components/TaskList"
import Modal from '@/components/Modal'
import useGetTasks from '@/hooks/useGetTasks'

import styles from '@/styles/Home.module.css'
import taskItemStyles from '@/styles/TaskItem.module.css'
import spinner from '@/public/spinner.svg'

const MySwal = withReactContent(Swal)

export default function Home() {
  const [page, setPage] = useState(1)
  const [modalData, setModalData] = useState(null)
  const [userName, setUserName] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [isSearch, setIsSearch] = useState(false)
  const [sortCreated, setSortCreated] = useState('desc')
  const [labels, setLabels] = useState([])

  const { tasks, hasMore, loading, error, setTasks } = useGetTasks({page, sortCreated, labels, setUserName});

  const observer = useRef()
  const lastTaskRef = useCallback((node) => {
    if (loading) return
    if (observer.current) {
      observer.current.disconnect()
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage => prevPage + 1))
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])


  const handleSortCreated = (e) => setSortCreated(e.target.value);

  const handleInput = (e) => {
    const oTarget = e.target;

    const index = labels.findIndex((el) => el === oTarget.name);

    if (index !== -1) {
      setLabels(labels.filter(item => item !== oTarget.name));
    } else {
      setLabels((prevItem) => [...prevItem, oTarget.name]);
    }
  };

  const handleSearchInput = (e) => setSearchInput(e.target.value)

  const handleClick = () => {
    setIsSearch(true)
    setTimeout(() => {
      setIsSearch(false)
    }, 500);
  }

  const handleEditSuccess = (newData) => {
    setModalData(newData)
  }

  const searchTask = async (url) => {
    const accessToken = Cookies.get('token');

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          accept: 'application/vnd.github+json',
          Authorization: `Bearer ${accessToken}`
        }
      })
      const data = await response.json();
      setTasks(data.items)
      
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: <strong>發生錯誤</strong>,
        html: <i>{error}</i>
      })
    }
  }

  const { searchData } = useSWR(isSearch ? `https://api.github.com/search/issues?q=assignee:${userName}+${searchInput}` : null, searchTask)

  if (searchData) {
    setTasks(searchData)
  }

  return (
    <>
      <Head>
        <title>GTask</title>
        <meta name="description" content="GTask dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.searchBar}>
          <input onInput={handleSearchInput} value={searchInput} type="text" placeholder='Search...' />
          <button onClick={handleClick} type="button">🔍</button>
        </div>
        <ul className={styles.filterBar}>
          <li>
            <input onInput={handleInput} name='open' id='open' type='checkbox'/>
            <label className={`${styles.filterBtn} ${labels.includes('open') ? styles.active: ''}`} htmlFor="open">🗽 label: Open</label>
          </li>
          <li>
            <input onInput={handleInput} name='in progress' id='progress' type='checkbox'/>
            <label className={`${styles.filterBtn} ${labels.includes('in progress') ? styles.active: ''}`} htmlFor="progress">🚀 label: In Progress</label>
          </li>
          <li>
            <input onInput={handleInput} name='done' id='done' type='checkbox'/>
            <label className={`${styles.filterBtn} ${labels.includes('done') ? styles.active: ''}`} htmlFor="done">🦄 label: Done</label>
          </li>
        </ul>
        <div className={styles.toolBar}>
          <select className={styles.sortByCreated} name="sortByCreated" id="sortCreated" onChange={handleSortCreated} value={sortCreated}>
            <option value="desc">最新任務</option>
            <option value="asc">最舊任務</option>
          </select>
        </div>

        <TaskList>
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
        </TaskList>
        {loading && (
          <Image src={spinner} style={{display: 'block', margin: '0 auto'}} width="200" height="200" alt='spinner'></Image>
          )}
        {error && <div>Error</div>}
        
        { modalData ? (
          <>
            <div onClick={() => setModalData(null)} style={{backgroundColor: "rgba(0, 0, 0, 0.5)", position: "fixed", inset: 0}}></div>
            <Modal onEditSuccess={handleEditSuccess} title={modalData.title} body={modalData.body} url={modalData.url} labels={modalData.labels} dataList={tasks} onSave={setTasks}></Modal>
          </>
          ) : null}
      </main>
    </>
  )
}
