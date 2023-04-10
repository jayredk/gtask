import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { apiGetTasks } from "@/api";

const MySwal = withReactContent(Swal)

export default function useGetTasks({ page, sortCreated, labels, setUserName }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const hasEffectRun = useRef(false);

  const router = useRouter();

  const accessToken = Cookies.get('token');

  useEffect(() => {
    if (!accessToken) {
      router.push('/login');
    }

    const getTasks = async () => {
      try {
        setLoading(true);
        setError(false);

        const data = await apiGetTasks({page, sortCreated, labels, accessToken});

        setTasks((prevData) => [...prevData, ...data]);
        setHasMore(data.length === 10)

        if (data[0]) {
          setUserName(data[0].assignee?.login)
        }
        setLoading(false);
      } catch (error) {
        MySwal.fire({
          icon: 'error',
          title: <strong>發生錯誤</strong>,
          html: <i>{error}</i>
        })
        setError(true);
      }
    }

    if (!hasEffectRun.current) {
      hasEffectRun.current = true;
    } else {
      getTasks();
    }
    
  }, [router, accessToken, labels, page, setUserName, sortCreated])

  return { tasks, hasMore, loading, error, setTasks }
}