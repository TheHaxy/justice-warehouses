import React, { useState } from 'react'

import { Button } from '@mui/material'
import { useStore } from 'effector-react'
import Head from 'next/head'
import ItemsContainer from '../../components/ItemsContainer/ItemsContainer'
import { $warehousesStorage } from '../../model/model'
import CreateWarehouseModal from '../../components/warehouses/CreateWarehouseModal/CreateWarehouseModal'
import { voidWarehouse } from '../../common/utils'

const Index = () => {
  const warehousesStorage = useStore($warehousesStorage)

  const [modalIsOpened, setModalIsOpened] = useState(false)

  return (
    <>
      <Head>
        <title>Warehouses</title>
        <meta charSet='utf-8' />
      </Head>
      <div>
        {modalIsOpened && (
          <CreateWarehouseModal
            setModalIsOpened={setModalIsOpened}
            currentWarehouse={voidWarehouse}
          />
        )}
        <Button variant='outlined' onClick={() => setModalIsOpened(true)}>
          Добавить склад
        </Button>
        <ItemsContainer itemsStorage={warehousesStorage} />
      </div>
    </>
  )
}

export default Index
