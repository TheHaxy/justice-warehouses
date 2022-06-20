import React, { ChangeEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useStore } from 'effector-react'
import { Button, TextField } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  $productsStorage,
  $warehousesStorage,
  updateWarehouse,
} from '../../model/model'
import { BasicProduct, Warehouse } from '../../assets/types'
import ProductDistribution from '../../components/ProductDistribution/ProductDistribution'

type CurrentContent = 'DISTRIBUTED_PRODUCTS' | 'WAREHOUSE_MOVEMENT'

const WarehousePage = () => {
  const router = useRouter()
  const warehousesStorage = useStore($warehousesStorage)
  const productStorage = useStore($productsStorage)
  const currentWarehouse = warehousesStorage.find(
    (warehouse) => warehouse.id === Number(router.query.id),
  ) as Warehouse
  const [editedWarehouse, setEditedWarehouse] = useState(currentWarehouse)
  const [currentWarehouseProducts, setCurrentWarehouseProducts] = useState(
    editedWarehouse?.products || [],
  )
  const unallocatedProducts = productStorage.filter(
    (product) => product.unallocatedQuantity,
  )
  const productFieldsIsNotFilled = !!currentWarehouseProducts.find(
    (item) => !item.id || !item.quantity,
  )
  const [currentContent, setCurrentContent] = useState<CurrentContent>(
    'DISTRIBUTED_PRODUCTS',
  )

  useEffect(() => {
    setEditedWarehouse({
      ...editedWarehouse,
      products: currentWarehouseProducts,
    })
  }, [currentWarehouseProducts])

  useEffect(() => {
    setCurrentWarehouseProducts(editedWarehouse.products)
  }, [editedWarehouse])

  const updateAddedProductQuantity = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    selectItem: BasicProduct,
  ) => {
    setCurrentWarehouseProducts(
      currentWarehouseProducts.map((item) => {
        if (item.id !== selectItem.id) return item
        return { ...item, quantity: Number(e.target.value) }
      }),
    )
  }

  const updateWarehouseValue = () => {
    updateWarehouse(editedWarehouse)
  }

  return (
    <div className='min-h-[44rem] px-8 py-6 bg-white rounded flex flex-col justify-between'>
      <div className='flex flex-col gap-6'>
        <div
          className='flex items-center gap-2 hover:cursor-pointer'
          onClick={() => router.push('/warehouses')}
        >
          <ArrowBackIcon /> Вернуться назад
        </div>
        <div className='flex items-center gap-10'>
          <TextField
            className='text-2xl w-[30rem]'
            label='Название склада'
            value={editedWarehouse?.name}
            onChange={(e) =>
              setEditedWarehouse({
                ...editedWarehouse,
                name: e.target.value,
              })
            }
          />
          <span>
            Общее количество товаров: {currentWarehouseProducts?.length}
          </span>
          <div className='flex gap-4'>
            <Button
              className='max-w-[20rem]'
              variant='outlined'
              disabled={currentContent === 'DISTRIBUTED_PRODUCTS'}
              onClick={() => setCurrentContent('DISTRIBUTED_PRODUCTS')}
            >
              Добавление продуктов
            </Button>
            <Button
              className='max-w-[20rem]'
              variant='outlined'
              disabled={currentContent === 'WAREHOUSE_MOVEMENT'}
              onClick={() => setCurrentContent('WAREHOUSE_MOVEMENT')}
            >
              Перемещение по складам
            </Button>
          </div>
        </div>
        <div className='flex pr-10 flex-col gap-6'>
          {currentContent === 'DISTRIBUTED_PRODUCTS' && (
            <>
              <span className='text-xl'>Распределенные продукты:</span>
              {currentWarehouseProducts?.map((product) => (
                <ProductDistribution
                  currentItem={product}
                  selectListItem={productStorage}
                  itemStorage={currentWarehouseProducts}
                  setItemStorage={setCurrentWarehouseProducts}
                  inputChange={(e) => updateAddedProductQuantity(e, product)}
                />
              ))}
            </>
          )}
          {currentContent === 'WAREHOUSE_MOVEMENT' && (
            <>
              <span className='text-xl'>Перемещение по складам:</span>
              {currentWarehouseProducts?.map((product) => (
                <ProductDistribution
                  currentItem={product}
                  selectListItem={productStorage}
                  itemStorage={currentWarehouseProducts}
                  setItemStorage={setCurrentWarehouseProducts}
                  inputChange={(e) => updateAddedProductQuantity(e, product)}
                />
              ))}
            </>
          )}
        </div>
      </div>
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
          onClick={() =>
            setEditedWarehouse(JSON.parse(JSON.stringify(currentWarehouse)))
          }
          variant='outlined'
          color='error'
          className='max-w-[20rem]'
        >
          Отменить
        </Button>
        <Button
          className='max-w-[20rem]'
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
      </div>
    </div>
  )
}

export default WarehousePage
