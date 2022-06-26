import React, { useEffect, useState } from 'react'
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
  const [selectedWarehouse, setSelectedWarehouse] = useState(currentWarehouse)
  const [currentProduct, setCurrentProduct] = useState(
    productStorage.find(
      (product) => product.id === selectedWarehouse.product.id,
    ) as Product,
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
      productStorage.find(
        (product) => product.id === selectedWarehouse.product.id,
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

  const updateProductQuantity = (quantity: string | number) => {
    setSelectedWarehouse({
      ...selectedWarehouse,
      product: {
        ...selectedWarehouse.product,
        quantity: Number(quantity),
      },
    })
  }

  const selectProduct = (e: SelectChangeEvent) => {
    setSelectedWarehouse({
      ...selectedWarehouse,
      product: { ...selectedWarehouse.product, id: Number(e.target.value) },
    })
  }

  const selectWarehouse = (e: SelectChangeEvent) => {
    setSelectedWarehouse({ ...selectedWarehouse, id: Number(e.target.value) })
    setMovementWarehouses(
      movementWarehouses.map((warehouse) => {
        if (warehouse.id !== 0) return warehouse
        return { ...warehouse, id: Number(e.target.value) }
      }),
    )
  }

  const checkDistributedQuantity = () => {
    const thisProductUnallocatedQuantity =
      productList.find((product) => product.id === currentProduct.id)
        ?.quantity || 0
    if (thisProductUnallocatedQuantity > selectedWarehouse.product.quantity)
      return
    updateProductQuantity(thisProductUnallocatedQuantity)
  }

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
