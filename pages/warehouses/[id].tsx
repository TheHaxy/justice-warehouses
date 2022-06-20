import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useStore } from 'effector-react'
import { Button } from '@mui/material'
import { $productsStorage, $warehousesStorage } from '../../model/model'
import { BasicProduct } from '../../assets/types'
import ProductDistribution from '../../components/ProductDistribution/ProductDistribution'

const WarehousePage = () => {
  const router = useRouter()
  const warehousesStorage = useStore($warehousesStorage)
  const productStorage = useStore($productsStorage)
  const [currentWarehouse, setCurrentWarehouse] = useState(
    warehousesStorage.find(
      (warehouse) => warehouse.id === Number(router.query.id),
    ),
  )
  const [currentWarehouseProducts, setCurrentWarehouseProducts] = useState(
    currentWarehouse?.products || [],
  )
  const unallocatedProducts = productStorage.filter(
    (product) => product.unallocatedQuantity,
  )
  const productFieldsIsNotFilled = !!currentWarehouseProducts.find(
    (item) => !item.id || !item.quantity,
  )

  return (
    <div className='min-h-[44rem] px-12 py-8 bg-white rounded grid grid-cols-2'>
      <div className='flex flex-col gap-8'>
        <div className='flex items-center justify-between'>
          <span className='text-2xl'>{currentWarehouse?.name}</span>
          <span>
            Общее количество товаров: {currentWarehouseProducts?.length}
          </span>
        </div>
        <div className='flex flex-col gap-6'>
          <span className='text-xl'>Распределенные продукты:</span>
          <Button
            variant='outlined'
            disabled={!unallocatedProducts.length || productFieldsIsNotFilled}
            onClick={() =>
              currentWarehouseProducts.length < 5 &&
              setCurrentWarehouseProducts([
                ...currentWarehouseProducts,
                { id: 0, quantity: 0 },
              ])
            }
          >
            Добавить продукт
          </Button>
          {currentWarehouseProducts?.map((product) => (
            <ProductDistribution
              currentItem={product}
              selectListItem={productStorage}
              itemStorage={currentWarehouseProducts}
              setItemStorage={setCurrentWarehouseProducts}
              selectChange={() => console.log(123)}
              inputChange={() => console.log(321)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default WarehousePage
