import Head from "next/head"
import { Inter } from 'next/font/google'
import styles from "../styles/Login.module.css"
import { useRouter } from "next/router"


const inter = Inter({ subsets: ['latin'] })

const clientID = process.env.NEXT_PUBLIC_CLIENT_ID;
const appURL = process.env.NEXT_PUBLIC_APP_URL;

export default function Login() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="GTask Login page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={`${inter.className} ${styles.h1}`}>GTask</h1>
        <form className={styles.form}>
          <h2 className={`${inter.className} ${styles.h2}`}>登入</h2>
          {router.query?.error ? <p className={`${inter.className} ${styles.errorText}`}>授權失敗，請重新嘗試</p> : null }
          <p className={`${inter.className} ${styles.loginText}`}>你尚未登入，請透過下方按鈕登入</p>
          <a className={`${inter.className} ${styles.loginBtn}`} href={`https://github.com/login/oauth/authorize?scope=repo&client_id=${clientID}&redirect_uri=${appURL}oauth/redirect`}>GitHub 登入</a>
        </form>
      </main>
    </>
  )
}