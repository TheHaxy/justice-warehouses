import React, { ChangeEvent, useEffect, useState } from 'react'
import { Button, SelectChangeEvent, TextField } from '@mui/material'
import { useStore } from 'effector-react'
import Modal from '../../UI/Modal/Modal'
import { BasicProduct, Product, Warehouse } from '../../../assets/types'
import {
  $productsStorage,
  updateProductUnallocatedQuantity,
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
    newWarehouse.products.forEach((product) =>
      updateProductUnallocatedQuantity(product),
    )
    updateWarehousesStorage(newWarehouse)
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
      productUnallocatedQuantity > selectItem.quantity
    )
      return

    setAddedProducts(
      addedProducts.map((el) => {
        if (el.id !== selectItem.id) return el
        return { ...el, quantity: +productUnallocatedQuantity }
      }),
    )
  }

  const changeSelectValue = (event: SelectChangeEvent) => {
    setAddedProducts(
      addedProducts.map((item) => {
        if (item.id !== 0) return item
        return { ...item, id: Number(event.target.value) }
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
          value={newWarehouse.name}
          onChange={(e) =>
            setNewWarehouse({ ...newWarehouse, name: e.target.value })
          }
        />
        <Button
          variant='outlined'
          disabled={!unallocatedProducts.length || productFieldsIsNotFilled}
          onClick={() =>
            addedProducts.length < 5 &&
            setAddedProducts([...addedProducts, { id: 0, quantity: 0 }])
          }
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
              selectChange={changeSelectValue}
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
