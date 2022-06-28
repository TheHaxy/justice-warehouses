import React, {useCallback, useEffect, useState} from 'react'

import {Button} from '@mui/material'
import {useStore} from 'effector-react'
import {
  BasicWarehouse,
  CurrentContent,
  Warehouse,
} from '../../../common/types'
import {
  $productsStorage,
  updateUnallocatedProductQuantity,
  updateWarehouse,
  updateWarehousesProductsStorage,
} from '../../../model/model'
import {
  DISTRIBUTED_PRODUCTS,
  WAREHOUSE_MOVEMENT,
} from '../../../common/constants'

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
  const itsDistributedProducts = currentContent === DISTRIBUTED_PRODUCTS
  const itsWarehouseMovement = currentContent === WAREHOUSE_MOVEMENT

  const productStorage = useStore($productsStorage)

  const [currentWarehouseProducts, setCurrentWarehouseProducts] = useState(
    currentWarehouse?.products,
  )

  const unallocatedProducts = productStorage.filter(
    (product) => product.unallocatedQuantity,
  )
  const productFieldsIsNotFilled = !!currentWarehouseProducts?.find(
    (item) => !item.id || !item.quantity,
  )
  const formNotReady = !unallocatedProducts.length || productFieldsIsNotFilled

  useEffect(() => {
    setCurrentWarehouseProducts(currentWarehouse?.products)
  }, [currentWarehouse])

  useEffect(() => {
    setEditedWarehouse({
      ...editedWarehouse,
      products: currentWarehouseProducts,
    })
  }, [currentWarehouseProducts])

  const updateWarehouseValue = useCallback(() => {
    updateWarehouse({
      ...editedWarehouse,
      products: editedWarehouse.products
        .filter((product) => product.id !== 0 && product.quantity !== 0)
        .map((product) => {
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
  }, [editedWarehouse, productStorage, movementWarehouses])

  const resetWarehouseChanges = useCallback(() => {
    setEditedWarehouse(JSON.parse(JSON.stringify(currentWarehouse)))
    setMovementWarehouses([])
  }, [currentWarehouse])

  const addProduct = useCallback(() => {
    if (currentWarehouseProducts.length > 5) return
    setCurrentWarehouseProducts([
      ...currentWarehouseProducts,
      {id: 0, quantity: 0},
    ])
  }, [currentWarehouseProducts])

  const addMovementProduct = useCallback(() => {
    if (!movementWarehouses || !setMovementWarehouses) return
    setMovementWarehouses([
      ...movementWarehouses,
      {id: 0, product: {id: 0, quantity: 0}},
    ])
  }, [movementWarehouses])

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
      {itsDistributedProducts && (
        <Button
          className='max-w-[20rem]'
          variant='outlined'
          disabled={formNotReady}
          onClick={addProduct}
        >
          Добавить продукт
        </Button>
      )}
      {itsWarehouseMovement && (
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
