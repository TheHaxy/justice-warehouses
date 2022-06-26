import React, { ChangeEvent, useEffect, useState } from 'react'
import { Button, TextField } from '@mui/material'
import { useStore } from 'effector-react'
import Modal from '../../UI/Modal/Modal'
import { BasicProduct, Product, Warehouse } from '../../../assets/types'
import {
  $productsStorage,
  updateUnallocatedProductQuantity,
  updateWarehousesStorage,
} from '../../../model/model'
import styles from './createWarehouseModal.module.css'
import ProductDistribution from '../../ProductDistribution/ProductDistribution'

interface CreateWarehouseModalProps {
  setModalIsOpened: React.Dispatch<boolean>
  currentWarehouse: Warehouse
}

const CreateWarehouseModal: React.FC<CreateWarehouseModalProps> = ({
  setModalIsOpened,
  currentWarehouse,
}) => {
  const productStorage: Product[] = useStore($productsStorage)
  const [newWarehouse, setNewWarehouse] = useState<Warehouse>(currentWarehouse)
  const [addedProducts, setAddedProducts] = useState<BasicProduct[]>(
    newWarehouse.products,
  )
  const unallocatedProducts = productStorage.filter(
    (product) => product.unallocatedQuantity,
  )
  const productFieldsIsNotFilled = !!addedProducts.find(
    (item) => !item.id || !item.quantity,
  )

  useEffect(() => {
    const productsList = addedProducts.map((item) => item)
    setNewWarehouse({
      ...newWarehouse,
      products: productsList,
    })
  }, [addedProducts])

  const addNewWarehouse = () => {
    if (!newWarehouse.name || productFieldsIsNotFilled) return
    updateWarehousesStorage(newWarehouse)
    newWarehouse.products.forEach((product) =>
      updateUnallocatedProductQuantity(product),
    )
    setModalIsOpened(false)
  }

  const updateAddedProductQuantity = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    selectItem: BasicProduct,
  ) => {
    setAddedProducts(
      addedProducts.map((item) => {
        if (item.id !== selectItem.id) return item
        return { ...item, quantity: Number(e.target.value) }
      }),
    )
  }

  const checkProductQuantity = (selectItem: BasicProduct) => {
    const productUnallocatedQuantity = productStorage.find(
      (product) => +product.id === +selectItem.id,
    )?.unallocatedQuantity

    if (
      !productUnallocatedQuantity ||
      productUnallocatedQuantity > selectItem.quantity ||
      selectItem.quantity < 1
    )
      return

    setAddedProducts(
      addedProducts.map((el) => {
        if (el.id !== selectItem.id) return el
        return { ...el, quantity: +productUnallocatedQuantity }
      }),
    )
  }

  const changeWarehouseName = (e: ChangeEvent<HTMLInputElement>) => {
    setNewWarehouse({ ...newWarehouse, name: e.target.value })
  }

  const addProduct = () => {
    if (addedProducts.length > 5) return
    setAddedProducts([...addedProducts, { id: 0, quantity: 0 }])
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
          value={newWarehouse.name}
          onChange={changeWarehouseName}
        />
        <Button
          variant='outlined'
          disabled={!unallocatedProducts.length || productFieldsIsNotFilled}
          onClick={addProduct}
        >
          Добавить продукт
        </Button>
        <div className={styles.AddedProductsContainer}>
          {addedProducts.map((item) => (
            <ProductDistribution
              key={item.id}
              currentItem={item}
              selectListItem={unallocatedProducts}
              itemStorage={addedProducts}
              setItemStorage={setAddedProducts}
              inputChange={(e) => updateAddedProductQuantity(e, item)}
              blurInput={() => checkProductQuantity(item)}
              selectLabel='Продукт (нераспр. кол-во)'
              enableQuantity
            />
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default CreateWarehouseModal
