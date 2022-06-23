import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [domLoaded, setDomLoaded] = useState(false)

  useEffect(() => {
    setDomLoaded(true)
  }, [])

  return (
    domLoaded && (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    )
  )
}

export default MyApp
