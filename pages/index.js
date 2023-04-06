import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { Inter } from 'next/font/google'
import taskItemStyles from '@/styles/TaskItem.module.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import TaskItem from "@/components/TaskItem"
import TaskList from "@/components/TaskList"
import Modal from '@/components/modal'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter()
  const [data, setData] = useState(null)
  const [modalData, setModalData] = useState(null)
  const [userName, setUserName] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [isSearch, setIsSearch] = useState(false)
  const [sortCreated, setSortCreated] = useState('desc')
  const [labels, setLabels] = useState([])

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

  const searchIssue = async (url) => {
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
      setData(data.items)
      
    } catch (error) {
      console.log(error);
    }
  }

  const { searchData } = useSWR(isSearch ? `https://api.github.com/search/issues?q=assignee:${userName}+${searchInput}` : null, searchIssue)

  if (searchData) {
    setData(searchData)
  }

  useEffect(() => {
    const accessToken = Cookies.get('token');

    if (!accessToken) {
      router.push('/login');
    }

    const getIssue = async () => {
      const response = await fetch(`https://api.github.com/issues?state=all&per_page=10&direction=${sortCreated}&labels=${labels.toString()}`, {
        method: 'GET',
        headers: {
          accept: 'application/vnd.github+json',
          Authorization: `Bearer ${accessToken}`
        }
      })
      const data = await response.json();
      setData(data)
      if (data[0]) {
        setUserName(data[0].assignee?.login)
      }
    }

      getIssue();
    
  }, [router, sortCreated, labels])

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
          <div>
            <label className={inter.className} htmlFor="sortCreated">建立日期</label>
            <select name="sortByCreated" id="sortCreated" onChange={handleSortCreated} value={sortCreated}>
              <option value="desc">從新到舊</option>
              <option value="asc">從舊到新</option>
            </select>
          </div>
        </div>

        <TaskList>
          { data && data.map(task => (
            <TaskItem key={task.id} className={taskItemStyles.taskItem}>
              <button onClick={() => setModalData(task)} type='button'>{task.title}</button>
            </TaskItem>
            )
          )}
        </TaskList>
        { modalData ? (
          <>
            <div onClick={() => setModalData(null)} style={{backgroundColor: "rgba(0, 0, 0, 0.5)", position: "fixed", inset: 0}}></div>
            <Modal onEditSuccess={handleEditSuccess} title={modalData.title} body={modalData.body} url={modalData.url} labels={modalData.labels} dataList={data} onSave={setData}></Modal>
          </>
          ) : null}
      </main>
    </>
  )
}
