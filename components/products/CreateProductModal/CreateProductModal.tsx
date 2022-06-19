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
import { SelectWarehouse, Warehouse } from '../../../assets/types'
import styles from './createProductModal.module.css'
import ProductDistribution from '../../ProductDistribution/ProductDistribution'

interface CreateProductModalProps {
  setModalIsOpened: React.Dispatch<boolean>
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({
  setModalIsOpened,
}) => {
  const warehouseStorage: Warehouse[] = useStore($warehousesStorage)
  const [addedWarehouses, setAddedWarehouses] = useState<SelectWarehouse[]>([])
  const [newProduct, setNewProduct] = useState({
    name: '',
    id: 0,
    totalQuantity: 0,
    unallocatedQuantity: 0,
  })

  const addNewProduct = () => {
    updateProductsStorage(newProduct)
    addedWarehouses.forEach((item) => {
      updateProductUnallocatedQuantity(item.warehouse.product)
      updateWarehousesProductsStorage(item)
    })
    setModalIsOpened(false)
  }

  const updateProductQuantity = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    selectItem: SelectWarehouse,
  ) => {
    setAddedWarehouses(
      addedWarehouses.map((item) => {
        if (item.id !== selectItem.id) return item
        return {
          ...item,
          warehouse: {
            ...item.warehouse,
            product: {
              ...item.warehouse.product,
              quantity: Number(e.target.value),
            },
          },
        }
      }),
    )
  }

  const changeSelectValue = (
    event: SelectChangeEvent,
    selectItem: SelectWarehouse,
  ) => {
    setAddedWarehouses(
      addedWarehouses.map((item) => {
        if (item.id !== selectItem.id) return item
        return {
          ...item,
          warehouse: { ...item.warehouse, id: Number(event.target.value) },
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
          onClick={() =>
            addedWarehouses.length < 5 &&
            setAddedWarehouses([
              ...addedWarehouses,
              {
                id: Math.random(),
                warehouse: {
                  id: 0,
                  product: { id: newProduct.id, quantity: 0 },
                },
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
              selectChange={(e) => changeSelectValue(e, item)}
              inputChange={(e) => updateProductQuantity(e, item)}
            />
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default CreateProductModal
