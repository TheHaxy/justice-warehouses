import React from 'react'
import { Button } from '@mui/material'
import { BasicWarehouse, Product } from '../../../assets/types'
import {
  replaceWarehousesProductsStorage,
  updateProduct,
  updateUnallocatedProductQuantity,
} from '../../../model/model'

interface ControlButtonsProps {
  currentProduct: Product
  editedProduct: Product
  setEditedProduct: React.Dispatch<Product>
  warehousesList: BasicWarehouse[]
  setWarehousesList: React.Dispatch<BasicWarehouse[]>
}

const ControlProductButtons: React.FC<ControlButtonsProps> = ({
  currentProduct,
  editedProduct,
  setEditedProduct,
  warehousesList,
  setWarehousesList,
}) => {
  const updateProductValue = () => {
    updateProduct(editedProduct)
    warehousesList.forEach((warehouse) => {
      replaceWarehousesProductsStorage(warehouse)
    })
    updateUnallocatedProductQuantity(editedProduct)
  }

  const resetProductChanges = () => {
    setEditedProduct(JSON.parse(JSON.stringify(currentProduct)))
  }

  const addWarehouse = () => {
    setWarehousesList([
      ...warehousesList,
      { id: 0, product: { id: currentProduct.id, quantity: 0 } },
    ])
  }

  return (
    <div className='flex gap-4'>
      <Button
        onClick={updateProductValue}
        variant='outlined'
        color='success'
        className='max-w-[20rem]'
      >
        Сохранить
      </Button>
      <Button
        onClick={resetProductChanges}
        variant='outlined'
        color='error'
        className='max-w-[20rem]'
      >
        Отменить
      </Button>
      <Button
        className='max-w-[20rem]'
        variant='outlined'
        onClick={addWarehouse}
      >
        Добавить склад
      </Button>
    </div>
  )
}

export default ControlProductButtons
