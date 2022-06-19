import React, { ChangeEvent, useEffect, useState } from 'react'
import { Button, SelectChangeEvent, TextField } from '@mui/material'
import { useStore } from 'effector-react'
import Modal from '../../UI/Modal/Modal'
import { Product, SelectProduct, Warehouse } from '../../../assets/types'
import {
  $productsStorage,
  updateProductUnallocatedQuantity,
  updateWarehousesStorage,
} from '../../../model/model'
import styles from './createWarehouseModal.module.css'
import ProductDistribution from '../../ProductDistribution/ProductDistribution'

interface CreateWarehouseModalProps {
  setModalIsOpened: React.Dispatch<boolean>
}

const CreateWarehouseModal: React.FC<CreateWarehouseModalProps> = ({
  setModalIsOpened,
}) => {
  const productStorage: Product[] = useStore($productsStorage)
  const unallocatedProducts = productStorage.filter(
    (product) => product.unallocatedQuantity,
  )
  const [addedProducts, setAddedProducts] = useState<SelectProduct[]>([])
  const [newWarehouse, setNewWarehouse] = useState<Warehouse>({
    name: '',
    id: Math.random(),
    products: [],
  })

  useEffect(() => {
    const productsList = addedProducts.map((item) => item.product)
    setNewWarehouse({
      ...newWarehouse,
      products: productsList,
    })
  }, [addedProducts])

  const addNewWarehouse = () => {
    newWarehouse.products.forEach((product) =>
      updateProductUnallocatedQuantity(product),
    )
    updateWarehousesStorage(newWarehouse)
    setModalIsOpened(false)
  }

  const updateAddedProductQuantity = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    selectItem: SelectProduct,
  ) => {
    setAddedProducts(
      addedProducts.map((item) => {
        if (item.id !== selectItem.id) return item
        return {
          ...item,
          product: { ...item.product, quantity: Number(e.target.value) },
        }
      }),
    )
  }

  const checkProductQuantity = (selectItem: SelectProduct) => {
    const productUnallocatedQuantity = productStorage.find(
      (product) => +product.id === +selectItem.product.id,
    )?.unallocatedQuantity

    if (
      !productUnallocatedQuantity ||
      productUnallocatedQuantity > selectItem.product.quantity
    )
      return

    setAddedProducts(
      addedProducts.map((el) => {
        if (el.id !== selectItem.id) return el
        return {
          ...el,
          product: { ...el.product, quantity: +productUnallocatedQuantity },
        }
      }),
    )
  }

  const changeSelectValue = (
    event: SelectChangeEvent,
    selectItem: SelectProduct,
  ) => {
    setAddedProducts(
      addedProducts.map((item) => {
        if (item.id !== selectItem.id) return item
        return {
          ...item,
          product: { ...item.product, id: Number(event.target.value) },
        }
      }),
    )
  }

  return (
    <Modal
      name='Добавить склад'
      setModalIsOpened={setModalIsOpened}
      apply={addNewWarehouse}
    >
      <div className={styles.ModalContent}>
        <TextField
          label='Название склада'
          onChange={(e) =>
            setNewWarehouse({ ...newWarehouse, name: e.target.value })
          }
        />
        <Button
          variant='outlined'
          disabled={!unallocatedProducts.length}
          onClick={() =>
            addedProducts.length < 5 &&
            setAddedProducts([
              ...addedProducts,
              { id: Math.random(), product: { id: 0, quantity: 0 } },
            ])
          }
        >
          Добавить продукт
        </Button>
        <div className={styles.AddedProductsContainer}>
          {addedProducts.map((item) => (
            <ProductDistribution
              currentItem={item}
              selectListItem={unallocatedProducts}
              itemStorage={addedProducts}
              setItemStorage={setAddedProducts}
              selectChange={(e) => changeSelectValue(e, item)}
              inputChange={(e) => updateAddedProductQuantity(e, item)}
              checkProductQuantity={() => checkProductQuantity(item)}
            />
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default CreateWarehouseModal
