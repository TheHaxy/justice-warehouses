import React, { ReactNode } from 'react'
import Header from '../Header/Header'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <>
    <Header />
    <div className='mx-8'>{children}</div>
  </>
)

export default Layout
