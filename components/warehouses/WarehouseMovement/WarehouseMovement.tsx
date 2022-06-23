import React, { ChangeEvent, useEffect, useState } from 'react'
import { SelectChangeEvent, TextField } from '@mui/material'
import { useStore } from 'effector-react'
import { BasicProduct, BasicWarehouse, Product } from '../../../assets/types'
import MySelect from '../../UI/MySelect/MySelect'
import { $productsStorage, $warehousesStorage } from '../../../model/model'

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
  const [currentProduct, setCurrentProduct] = useState({})
  const [fullProductsInfo, setFullProductsInfo] = useState<Product[]>([])

  useEffect(() => {
    setCurrentProduct(
      productStorage.find(
        (product) => product.id === currentWarehouse.product.id,
      ) as Product,
    )
  }, [currentWarehouse])

  useEffect(() => {
    setFullProductsInfo(
      productList.map(
        (product) =>
          productStorage.find((item) => item.id === product.id) as Product,
      ),
    )
  }, [productList])

  const selectProduct = (e: SelectChangeEvent) => {
    setMovementWarehouses(
      movementWarehouses.map((warehouse) => {
        if (warehouse.product.id !== 0) return warehouse
        return {
          ...warehouse,
          product: { ...warehouse.product, id: Number(e.target.value) },
        }
      }),
    )
  }

  const updateProductQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    setMovementWarehouses(
      movementWarehouses.map((warehouse) => {
        if (warehouse.product.id !== (currentProduct as Product)?.id)
          return warehouse
        return {
          ...warehouse,
          product: { ...warehouse.product, quantity: Number(e.target.value) },
        }
      }),
    )
  }

  const selectWarehouse = (e: SelectChangeEvent) => {
    setMovementWarehouses(
      movementWarehouses.map((warehouse) => {
        if (warehouse.id !== 0) return warehouse
        return { ...warehouse, id: Number(e.target.value) }
      }),
    )
  }

  return (
    <div className='grid grid-cols-3 gap-2'>
      <MySelect
        list={fullProductsInfo}
        currentItem={currentProduct as BasicProduct}
        selectLabel='Продукт'
        onChange={selectProduct}
      />
      <MySelect
        list={warehousesStorage}
        currentItem={currentWarehouse}
        selectLabel='Склад'
        onChange={selectWarehouse}
      />
      <TextField
        label='Количество'
        inputProps={{ min: 1 }}
        onChange={updateProductQuantity}
      />
    </div>
  )
}

export default WarehouseMovement
