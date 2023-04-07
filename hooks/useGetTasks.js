import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export default function useGetTasks({ sortCreated, labels, setUserName }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

        const response = await fetch(`https://api.github.com/issues?per_page=10&direction=${sortCreated}&labels=${labels.toString()}`, {
          method: 'GET',
          headers: {
            accept: 'application/vnd.github+json',
            Authorization: `Bearer ${accessToken}`
          }
        })
        const data = await response.json();
        setTasks(data)

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

    getTasks();
    
  }, [router, accessToken, sortCreated, labels, setUserName])

  return { tasks, loading, error, setTasks }
}