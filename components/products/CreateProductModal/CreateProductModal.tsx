import React, { ChangeEvent, useState } from 'react'
import { Button, SelectChangeEvent, TextField } from '@mui/material'
import { useStore } from 'effector-react'
import Modal from '../../UI/Modal/Modal'
import {
  $warehousesStorage,
  updateProductsStorage,
  updateProductUnallocatedQuantity,
  updateWarehousesProductsStorage,
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
      updateProductUnallocatedQuantity(item.product)
      updateWarehousesProductsStorage(item)
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

    if (selectedQuantityIsMorePossible) return
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

  return (
    <Modal
      name='Добавить продукт'
      setModalIsOpened={setModalIsOpened}
      apply={addNewProduct}
    >
      <div className={styles.ModalContent}>
        <TextField
          label='Название продукта'
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />
        <TextField
          type='number'
          label='Количество'
          inputProps={{ min: 0 }}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              id: Math.random(),
              totalQuantity: Number(e.target.value),
              unallocatedQuantity: Number(e.target.value),
            })
          }
        />
        <Button
          variant='outlined'
          disabled={!warehouseStorage.length || warehouseFieldsIsNotFilled}
          onClick={() =>
            addedWarehouses.length < 5 &&
            setAddedWarehouses([
              ...addedWarehouses,
              {
                id: 0,
                product: { id: newProduct.id, quantity: 0 },
              },
            ])
          }
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
