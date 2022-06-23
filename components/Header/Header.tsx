import React from 'react'
import Link from 'next/link'
import styles from './header.module.css'

const Header = () => (
  <header className={styles.Header}>
    <nav>
      <div className='flex text-xl'>
        <Link href='/warehouses'>
          <button className={styles.NavButton} type='button'>
            Склады
          </button>
        </Link>
        <Link href='/products'>
          <button className={styles.NavButton} type='button'>
            Продукты
          </button>
        </Link>
      </div>
    </nav>
  </header>
)

export default Header
