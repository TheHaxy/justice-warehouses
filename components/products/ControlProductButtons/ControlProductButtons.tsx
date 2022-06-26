import React from 'react'
import { Button } from '@mui/material'
import { BasicWarehouse, Product, Warehouse } from '../../../assets/types'
import {
  replaceWarehousesProductsStorage,
  updateProduct,
  updateUnallocatedProductQuantity,
  updateWarehouse,
} from '../../../model/model'

interface ControlButtonsProps {
  currentProduct: Product
  editedProduct: Product
  setEditedProduct: React.Dispatch<Product>
  warehousesList: BasicWarehouse[]
  setWarehousesList: React.Dispatch<BasicWarehouse[]>
  productDistributedWarehouses: Warehouse[]
}

const ControlProductButtons: React.FC<ControlButtonsProps> = ({
  currentProduct,
  editedProduct,
  setEditedProduct,
  warehousesList,
  setWarehousesList,
  productDistributedWarehouses,
}) => {
  const updateProductValue = () => {
    updateProduct(editedProduct)
    warehousesList.forEach((warehouse) => {
      replaceWarehousesProductsStorage(warehouse)
    })
    productDistributedWarehouses.forEach((warehouse) => {
      if (!warehousesList.find((item) => item.id === warehouse.id)) {
        const newProductList = warehouse.products.filter(
          (product) => product.id !== currentProduct.id,
        )
        updateWarehouse({ ...warehouse, products: newProductList })
      }
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
        disabled={!editedProduct?.unallocatedQuantity}
        variant='outlined'
        onClick={addWarehouse}
      >
        Добавить склад
      </Button>
    </div>
  )
}

export default ControlProductButtons
