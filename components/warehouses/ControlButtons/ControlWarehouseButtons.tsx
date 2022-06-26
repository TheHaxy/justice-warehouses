import React, { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { useStore } from 'effector-react'
import { BasicWarehouse, Warehouse } from '../../../assets/types'
import {
  $productsStorage,
  updateUnallocatedProductQuantity,
  updateWarehouse,
  updateWarehousesProductsStorage,
} from '../../../model/model'
import { CurrentContent } from '../../../pages/warehouses/[id]'

interface ControlButtonsProps {
  movementWarehouses: BasicWarehouse[]
  setMovementWarehouses: React.Dispatch<BasicWarehouse[]>
  currentContent: CurrentContent
  currentWarehouse: Warehouse
  editedWarehouse: Warehouse
  setEditedWarehouse: React.Dispatch<Warehouse>
}

const ControlWarehouseButtons: React.FC<ControlButtonsProps> = ({
  movementWarehouses,
  setMovementWarehouses,
  currentContent,
  currentWarehouse,
  editedWarehouse,
  setEditedWarehouse,
}) => {
  const productStorage = useStore($productsStorage)
  const [currentWarehouseProducts, setCurrentWarehouseProducts] = useState(
    currentWarehouse?.products,
  )
  const unallocatedProducts = productStorage.filter(
    (product) => product.unallocatedQuantity,
  )
  const productFieldsIsNotFilled = !!currentWarehouseProducts.find(
    (item) => !item.id || !item.quantity,
  )

  useEffect(() => {
    setCurrentWarehouseProducts(currentWarehouse?.products)
  }, [currentWarehouse])

  useEffect(() => {
    setEditedWarehouse({
      ...editedWarehouse,
      products: currentWarehouseProducts,
    })
  }, [currentWarehouseProducts])

  const updateWarehouseValue = () => {
    updateWarehouse({
      ...editedWarehouse,
      products: editedWarehouse.products.map((product) => {
        const movementWarehouse = movementWarehouses.find(
          (item) => item.product.id === product.id,
        )
        if (!movementWarehouse) return product
        return {
          ...product,
          quantity: product.quantity - movementWarehouse.product.quantity,
        }
      }),
    })
    movementWarehouses.forEach((warehouse) => {
      updateWarehousesProductsStorage(warehouse)
    })
    productStorage.forEach((product) => {
      updateUnallocatedProductQuantity(product)
    })
    setMovementWarehouses([])
  }

  const resetWarehouseChanges = () => {
    setEditedWarehouse(JSON.parse(JSON.stringify(currentWarehouse)))
    setMovementWarehouses([])
  }

  const addProduct = () => {
    if (currentWarehouseProducts.length > 5) return
    setCurrentWarehouseProducts([
      ...currentWarehouseProducts,
      { id: 0, quantity: 0 },
    ])
  }

  const addMovementProduct = () => {
    if (!movementWarehouses || !setMovementWarehouses) return
    setMovementWarehouses([
      ...movementWarehouses,
      { id: 0, product: { id: 0, quantity: 0 } },
    ])
  }

  return (
    <div className='flex gap-4'>
      <Button
        onClick={updateWarehouseValue}
        variant='outlined'
        color='success'
        className='max-w-[20rem]'
      >
        Сохранить
      </Button>
      <Button
        onClick={resetWarehouseChanges}
        variant='outlined'
        color='error'
        className='max-w-[20rem]'
      >
        Отменить
      </Button>
      {currentContent === 'DISTRIBUTED_PRODUCTS' && (
        <Button
          className='max-w-[20rem]'
          variant='outlined'
          disabled={!unallocatedProducts.length || productFieldsIsNotFilled}
          onClick={addProduct}
        >
          Добавить продукт
        </Button>
      )}
      {currentContent === 'WAREHOUSE_MOVEMENT' && (
        <Button
          className='max-w-[20rem]'
          variant='outlined'
          disabled={!editedWarehouse.products.length}
          onClick={addMovementProduct}
        >
          Распределить по складам
        </Button>
      )}
    </div>
  )
}

export default ControlWarehouseButtons
