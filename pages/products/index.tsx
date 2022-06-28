import React, { useState } from 'react'

import { Button } from '@mui/material'
import { useStore } from 'effector-react'
import Head from 'next/head'
import { $productsStorage } from '../../model/model'
import ItemsContainer from '../../components/ItemsContainer/ItemsContainer'
import CreateProductModal from '../../components/products/CreateProductModal/CreateProductModal'

const Index = () => {
  const productsStorage = useStore($productsStorage)

  const [modalIsOpened, setModalIsOpened] = useState(false)

  return (
    <>
      <Head>
        <title>Products</title>
        <meta charSet='utf-8' />
      </Head>
      <div>
        {modalIsOpened && (
          <CreateProductModal setModalIsOpened={setModalIsOpened} />
        )}
        <Button variant='outlined' onClick={() => setModalIsOpened(true)}>
          Добавить продукт
        </Button>
        <ItemsContainer itemsStorage={productsStorage} />
      </div>
    </>
  )
}

export default Index
