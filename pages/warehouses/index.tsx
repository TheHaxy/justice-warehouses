import React, { useState } from 'react'
import { Button } from '@mui/material'
import { useStore } from 'effector-react'
import ItemsContainer from '../../components/ItemsContainer/ItemsContainer'
import { $warehousesStorage } from '../../model/model'
import CreateWarehouseModal from '../../components/warehouses/CreateWarehouseModal/CreateWarehouseModal'

const Index = () => {
  const warehousesStorage = useStore($warehousesStorage)
  const [modalIsOpened, setModalIsOpened] = useState(false)

  return (
    <div>
      {modalIsOpened && (
        <CreateWarehouseModal
          setModalIsOpened={setModalIsOpened}
          currentWarehouse={{
            name: '',
            id: Math.random(),
            products: [],
          }}
        />
      )}
      <Button variant='outlined' onClick={() => setModalIsOpened(true)}>
        Добавить склад
      </Button>
      <ItemsContainer itemsStorage={warehousesStorage} />
    </div>
  )
}

export default Index
