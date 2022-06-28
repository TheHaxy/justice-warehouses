import React, { useCallback, useEffect, useState } from 'react'

import { SelectChangeEvent, TextField } from '@mui/material'
import { useStore } from 'effector-react'
import { BasicProduct, BasicWarehouse, Product } from '../../../common/types'
import MySelect from '../../UI/MySelect/MySelect'
import { $productsStorage, $warehousesStorage } from '../../../model/model'
import { findCurrentItem } from '../../../common/utils'

interface WarehouseMovementProps {
  movementWarehouses: BasicWarehouse[]
  setMovementWarehouses: React.Dispatch<BasicWarehouse[]>
  currentWarehouse: BasicWarehouse
  productList: BasicProduct[]
}

const WarehouseMovement: React.FC<WarehouseMovementProps> = ({
  movementWarehouses,
  setMovementWarehouses,
  currentWarehouse,
  productList,
}) => {
  const warehousesStorage = useStore($warehousesStorage)
  const productStorage = useStore($productsStorage)

  const [selectedWarehouse, setSelectedWarehouse] = useState(currentWarehouse)
  const [currentProduct, setCurrentProduct] = useState(
    findCurrentItem(productStorage, selectedWarehouse.product) as Product,
  )
  const [fullProductsInfo, setFullProductsInfo] = useState<Product[]>([])

  useEffect(() => {
    setMovementWarehouses(
      movementWarehouses.map((warehouse) => {
        if (warehouse.id !== currentWarehouse.id) return warehouse
        return selectedWarehouse
      }),
    )
  }, [selectedWarehouse.product])

  useEffect(() => {
    setCurrentProduct(
      findCurrentItem(productStorage, selectedWarehouse.product) as Product,
    )
  }, [currentWarehouse])

  useEffect(() => {
    setFullProductsInfo(
      productList.map(
        (product) => findCurrentItem(productStorage, product) as Product,
      ),
    )
  }, [productList])

  const updateProductQuantity = useCallback(
    (quantity: string | number) => {
      setSelectedWarehouse({
        ...selectedWarehouse,
        product: {
          ...selectedWarehouse.product,
          quantity: Number(quantity),
        },
      })
    },
    [selectedWarehouse],
  )

  const selectProduct = useCallback(
    (e: SelectChangeEvent) => {
      setSelectedWarehouse({
        ...selectedWarehouse,
        product: { ...selectedWarehouse.product, id: Number(e.target.value) },
      })
    },
    [selectedWarehouse],
  )

  const selectWarehouse = useCallback(
    (e: SelectChangeEvent) => {
      setMovementWarehouses(
        movementWarehouses.map((warehouse) => {
          if (warehouse.id !== 0 || warehouse.id !== selectedWarehouse.id)
            return warehouse
          return { ...warehouse, id: Number(e.target.value) }
        }),
      )
      setSelectedWarehouse({ ...selectedWarehouse, id: Number(e.target.value) })
    },
    [movementWarehouses, selectedWarehouse],
  )

  const checkDistributedQuantity = useCallback(() => {
    const thisProductUnallocatedQuantity =
      (findCurrentItem(productList, currentProduct) as BasicProduct)
        ?.quantity || 0

    if (thisProductUnallocatedQuantity > selectedWarehouse.product.quantity)
      return

    updateProductQuantity(thisProductUnallocatedQuantity)
  }, [productList, selectedWarehouse])

  return (
    <div className='grid grid-cols-3 gap-2'>
      <MySelect
        list={warehousesStorage}
        currentItem={selectedWarehouse}
        selectLabel='Склад'
        onChange={selectWarehouse}
      />
      <MySelect
        list={fullProductsInfo}
        currentItem={currentProduct}
        selectLabel='Продукт'
        onChange={selectProduct}
      />
      <TextField
        label='Количество'
        value={currentWarehouse.product.quantity}
        inputProps={{ min: 1 }}
        onBlur={checkDistributedQuantity}
        onChange={(e) => updateProductQuantity(e.target.value)}
      />
    </div>
  )
}

export default WarehouseMovement
