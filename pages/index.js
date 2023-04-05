import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { Inter } from 'next/font/google'
import taskItemStyles from '@/styles/TaskItem.module.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import TaskItem from "@/components/TaskItem"
import TaskList from "@/components/TaskList"

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter()
  const [data, setData] = useState(null)
  const [sortCreated, setSortCreated] = useState('desc')
  const [labels, setLabels] = useState([])

  const handleSortCreated = (e) => setSortCreated(e.target.value);

  const handleInput = (e) => {
    const oTarget = e.target;
    console.log(oTarget);
    const index = labels.findIndex((el) => el === oTarget.name);

    if (index !== -1) {
      setLabels(labels.filter(item => item !== oTarget.name));
    } else {
      setLabels((prevItem) => [...prevItem, oTarget.name]);
    }
  };

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
          <input type="text" />
          <button className={styles.btn} type="button">btn</button>
        </div>
        <ul className={styles.filterBar}>
          <li>
            <input onInput={handleInput} name='open' id='open' type='checkbox'/>
            <label className={`${styles.filterBtn} ${labels.includes('open') ? styles.active: ''}`} htmlFor="open">label: Open</label>
          </li>
          <li>
            <input onInput={handleInput} name='in progress' id='progress' type='checkbox'/>
            <label className={`${styles.filterBtn} ${labels.includes('in progress') ? styles.active: ''}`} htmlFor="progress">label: In Progress</label>
          </li>
          <li>
            <input onInput={handleInput} name='done' id='done' type='checkbox'/>
            <label className={`${styles.filterBtn} ${labels.includes('done') ? styles.active: ''}`} htmlFor="done">label: Done</label>
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
            <TaskItem key={task.id} className={taskItemStyles.taskItem}>{task.title}</TaskItem>
            )
          )}
        </TaskList>

      </main>
    </>
  )
}
