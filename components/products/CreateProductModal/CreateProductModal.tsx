import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { Button, TextField } from '@mui/material'
import { useStore } from 'effector-react'
import Modal from '../../UI/Modal/Modal'
import {
  $warehousesStorage,
  replaceWarehousesProductsStorage,
  updateProductsStorage,
  updateUnallocatedProductQuantity,
} from '../../../model/model'
import { BasicWarehouse, Warehouse } from '../../../common/types'
import styles from './createProductModal.module.css'
import ProductDistribution from '../../ProductDistribution/ProductDistribution'
import { calcDistributedQuantity, voidProduct } from '../../../common/utils'

interface CreateProductModalProps {
  setModalIsOpened: React.Dispatch<boolean>
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({
  setModalIsOpened,
}) => {
  const warehouseStorage: Warehouse[] = useStore($warehousesStorage)
  const [addedWarehouses, setAddedWarehouses] = useState<BasicWarehouse[]>([])
  const [newProduct, setNewProduct] = useState(voidProduct)

  const warehouseFieldsIsNotFilled = !!addedWarehouses.find(
    (item) => !item.id || !item.product.quantity,
  )
  const thisProductFieldsIsNotFilled =
    !newProduct.name || !newProduct.totalQuantity || warehouseFieldsIsNotFilled

  useEffect(() => {
    setNewProduct({
      ...newProduct,
      unallocatedQuantity:
        newProduct.totalQuantity - calcDistributedQuantity(addedWarehouses),
    })
  }, [addedWarehouses.length])

  const addNewProduct = useCallback(() => {
    if (thisProductFieldsIsNotFilled) return
    updateProductsStorage(newProduct)
    addedWarehouses.forEach((item) => {
      replaceWarehousesProductsStorage(item)
      updateUnallocatedProductQuantity(item.product)
    })
    setModalIsOpened(false)
  }, [newProduct, addedWarehouses])

  const updateWarehousesProductQuantity = useCallback(
    (newQuantity: string | number, selectItem: BasicWarehouse) => {
      setAddedWarehouses(
        addedWarehouses.map((item) => {
          if (item.id !== selectItem.id) return item
          return {
            ...item,
            product: {
              ...item.product,
              quantity: Number(newQuantity),
            },
          }
        }),
      )
    },
    [addedWarehouses],
  )

  const checkProductQuantity = useCallback(
    (selectItem: BasicWarehouse) => {
      const unallocatedQuantity =
        newProduct.totalQuantity - calcDistributedQuantity(addedWarehouses)
      if (unallocatedQuantity >= 0) {
        setNewProduct({ ...newProduct, unallocatedQuantity })
        return
      }
      if (!selectItem.product.quantity) return
      const thisWarehouseProductQuantity =
        newProduct.totalQuantity -
        calcDistributedQuantity(addedWarehouses, selectItem)
      updateWarehousesProductQuantity(thisWarehouseProductQuantity, selectItem)
    },
    [newProduct, addedWarehouses],
  )

  const changeProductName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setNewProduct({ ...newProduct, name: e.target.value })
    },
    [newProduct],
  )

  const changeProductQuantity = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setNewProduct({
        ...newProduct,
        id: Math.random(),
        totalQuantity: Number(e.target.value),
        unallocatedQuantity:
          Number(e.target.value) - calcDistributedQuantity(addedWarehouses),
      })
    },
    [newProduct, addedWarehouses],
  )

  const addWarehouse = useCallback(() => {
    if (addedWarehouses.length > 5) return
    setAddedWarehouses([
      ...addedWarehouses,
      {
        id: 0,
        product: { id: newProduct.id, quantity: 0 },
      },
    ])
  }, [addedWarehouses, newProduct])

  return (
    <Modal
      name='Добавить продукт'
      setModalIsOpened={setModalIsOpened}
      apply={addNewProduct}
    >
      <div className={styles.ModalContent}>
        <TextField label='Название продукта' onChange={changeProductName} />
        <TextField
          type='number'
          label='Количество'
          inputProps={{ min: 1 }}
          onChange={changeProductQuantity}
        />
        <span>Нераспределено: {newProduct.unallocatedQuantity}</span>
        <Button
          variant='outlined'
          disabled={
            !warehouseStorage.length ||
            warehouseFieldsIsNotFilled ||
            !(
              newProduct.totalQuantity -
              calcDistributedQuantity(addedWarehouses)
            )
          }
          onClick={addWarehouse}
        >
          Распределить по складам
        </Button>
        <div className={styles.AddedWarehousesContainer}>
          {addedWarehouses.map((item) => (
            <ProductDistribution
              key={item.id}
              currentItem={item}
              selectListItem={warehouseStorage}
              itemStorage={addedWarehouses}
              setItemStorage={setAddedWarehouses}
              inputChange={(e) =>
                updateWarehousesProductQuantity(e.target.value, item)
              }
              blurInput={() => checkProductQuantity(item)}
              selectLabel='Склад'
            />
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default CreateProductModal
