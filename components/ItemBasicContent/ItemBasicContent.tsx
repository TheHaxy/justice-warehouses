import React, { ChangeEvent, ReactNode } from 'react'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Button, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import { Product, Warehouse } from '../../common/types'

import styles from './ItemBasicContent.module.css'

interface ItemBasicContentProps {
  item: Warehouse | Product
  changeName: (e: ChangeEvent<HTMLInputElement>) => void
  deleteItem: () => void
  children?: ReactNode
}

const ItemBasicContent: React.FC<ItemBasicContentProps> = ({
  item,
  changeName,
  deleteItem,
  children,
}) => {
  const router = useRouter()

  return (
    <div className={styles.ItemBasicContent}>
      <div className={styles.RouteBackButton} onClick={router.back}>
        <ArrowBackIcon /> Вернуться назад
      </div>
      <TextField
        className='text-2xl w-[30rem]'
        label='Название склада'
        value={item?.name}
        onChange={changeName}
      />
      {children}
      <Button variant='outlined' color='error' onClick={deleteItem}>
        Удалить
      </Button>
    </div>
  )
}

export default ItemBasicContent
