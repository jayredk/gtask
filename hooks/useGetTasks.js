import { useState, useEffect, useRef } from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { apiGetTasks } from "@/api";
import { useAuth } from "./useAuth";

const MySwal = withReactContent(Swal)

export default function useGetTasks({ page, sortCreated, labels, setUserName }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const hasEffectRun = useRef(false);

  const accessToken = useAuth();

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const getTasks = async () => {
      try {
        if (accessToken === '') return;

        setLoading(true);
        setError(false);

        const data = await apiGetTasks({page, sortCreated, labels, accessToken, signal});

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

    return () => {
      abortController.abort();
    }
    
  }, [accessToken, labels, page, setUserName, sortCreated])

  return { tasks, hasMore, loading, error, setTasks }
}