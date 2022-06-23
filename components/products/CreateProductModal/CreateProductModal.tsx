import React, { ChangeEvent, useState } from 'react'
import { Button, TextField } from '@mui/material'
import { useStore } from 'effector-react'
import Modal from '../../UI/Modal/Modal'
import {
  $warehousesStorage,
  replaceWarehousesProductsStorage,
  updateProductsStorage,
  updateUnallocatedProductQuantity,
} from '../../../model/model'
import { BasicWarehouse, Warehouse } from '../../../assets/types'
import styles from './createProductModal.module.css'
import ProductDistribution from '../../ProductDistribution/ProductDistribution'

interface CreateProductModalProps {
  setModalIsOpened: React.Dispatch<boolean>
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({
  setModalIsOpened,
}) => {
  const warehouseStorage: Warehouse[] = useStore($warehousesStorage)
  const [addedWarehouses, setAddedWarehouses] = useState<BasicWarehouse[]>([])
  const [newProduct, setNewProduct] = useState({
    name: '',
    id: 0,
    totalQuantity: 0,
    unallocatedQuantity: 0,
  })
  const warehouseFieldsIsNotFilled = !!addedWarehouses.find(
    (item) => !item.id || !item.product.quantity,
  )
  const thisProductFieldsIsNotFilled =
    !newProduct.name || !newProduct.totalQuantity || warehouseFieldsIsNotFilled

  const addNewProduct = () => {
    if (thisProductFieldsIsNotFilled) return
    updateProductsStorage(newProduct)
    addedWarehouses.forEach((item) => {
      replaceWarehousesProductsStorage(item)
      updateUnallocatedProductQuantity(item.product)
    })
    setModalIsOpened(false)
  }

  const updateProductQuantity = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    selectItem: BasicWarehouse,
  ) => {
    setAddedWarehouses(
      addedWarehouses.map((item) => {
        if (item.id !== selectItem.id) return item
        return {
          ...item,
          product: {
            ...item.product,
            quantity: Number(e.target.value),
          },
        }
      }),
    )
  }

  const checkProductQuantity = (selectItem: BasicWarehouse) => {
    const selectedQuantityIsMorePossible =
      !newProduct.unallocatedQuantity ||
      newProduct.unallocatedQuantity > selectItem.product.quantity

    if (selectedQuantityIsMorePossible || selectItem.product.quantity < 1)
      return
    setAddedWarehouses(
      addedWarehouses.map((warehouse) => {
        if (warehouse.id !== selectItem.id) return warehouse
        return {
          ...warehouse,
          product: {
            ...warehouse.product,
            quantity: newProduct.unallocatedQuantity,
          },
        }
      }),
    )
  }

  const changeProductName = (e: ChangeEvent<HTMLInputElement>) => {
    setNewProduct({ ...newProduct, name: e.target.value })
  }

  const changeProductQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    setNewProduct({
      ...newProduct,
      id: Math.random(),
      totalQuantity: Number(e.target.value),
      unallocatedQuantity: Number(e.target.value),
    })
  }

  const addWarehouse = () => {
    if (addedWarehouses.length > 5) return
    setAddedWarehouses([
      ...addedWarehouses,
      {
        id: 0,
        product: { id: newProduct.id, quantity: 0 },
      },
    ])
  }

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
        <Button
          variant='outlined'
          disabled={!warehouseStorage.length || warehouseFieldsIsNotFilled}
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
              inputChange={(e) => updateProductQuantity(e, item)}
              checkProductQuantity={() => checkProductQuantity(item)}
              selectLabel='Склад'
            />
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default CreateProductModal
