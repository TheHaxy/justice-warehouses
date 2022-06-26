import React, { ChangeEvent, useState } from 'react'
import { useRouter } from 'next/router'
import { useStore } from 'effector-react'
import { TextField } from '@mui/material'
import styles from './productPage.module.css'
import {
  $productsStorage,
  $warehousesStorage,
  deleteProduct,
  updateWarehouse,
} from '../../model/model'
import { BasicWarehouse, Product } from '../../assets/types'
import ItemBasicContent from '../../components/ItemBasicContent/ItemBasicContent'
import ControlProductButtons from '../../components/warehouses/ControlButtons/ControlProductButtons'
import ProductDistribution from '../../components/ProductDistribution/ProductDistribution'
import { calcDistributedQuantity, findCurrentProduct } from '../../assets/utils'
import Modal from '../../components/UI/Modal/Modal'

const ProductPage = () => {
  const router = useRouter()
  const warehousesStorage = useStore($warehousesStorage)
  const productStorage = useStore($productsStorage)
  const currentProduct = productStorage.find(
    (product) => product.id === Number(router.query.id),
  ) as Product
  const [modalIsOpened, setModalIsOpened] = useState(false)
  const [editedProduct, setEditedProduct] = useState(currentProduct)
  const productDistributedWarehouses = warehousesStorage.filter((warehouse) =>
    findCurrentProduct(warehouse, currentProduct),
  )
  const [warehousesList, setWarehousesList] = useState<BasicWarehouse[]>(
    productDistributedWarehouses.map((warehouse) => {
      const thisProduct = findCurrentProduct(warehouse, currentProduct)
      return {
        id: warehouse.id,
        product: { id: thisProduct?.id, quantity: thisProduct?.quantity },
      }
    }) as BasicWarehouse[],
  )

  const changeProductName = (e: ChangeEvent<HTMLInputElement>) => {
    setEditedProduct({ ...editedProduct, name: e.target.value })
  }

  const changeProductTotalQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    setEditedProduct({
      ...editedProduct,
      totalQuantity: Number(e.target.value),
    })
  }

  const updateProductDistributedWarehouseQuantity = (
    e: ChangeEvent<HTMLInputElement>,
    currentWarehouse: BasicWarehouse,
  ) => {
    setWarehousesList(
      warehousesList.map((warehouse) => {
        if (warehouse.id !== currentWarehouse.id) return warehouse
        return {
          ...warehouse,
          product: { ...warehouse.product, quantity: Number(e.target.value) },
        }
      }),
    )
  }

  const deleteCurrentProduct = () => {
    router.back()
    productDistributedWarehouses.forEach((warehouse) => {
      const newWarehouse = {
        ...warehouse,
        products: warehouse.products.filter(
          (product) => product.id !== currentProduct.id,
        ),
      }
      updateWarehouse(newWarehouse)
    })
    deleteProduct(currentProduct)
  }

  const checkDistributedQuantity = (currentItem: BasicWarehouse) => {
    const unallocatedQuantity =
      editedProduct.totalQuantity - calcDistributedQuantity(warehousesList)
    if (unallocatedQuantity >= 0) {
      setEditedProduct({ ...editedProduct, unallocatedQuantity })
      return
    }
    setWarehousesList(
      warehousesList.map((warehouse) => {
        if (warehouse.id !== currentItem.id) return warehouse
        return {
          ...warehouse,
          product: {
            ...warehouse.product,
            quantity:
              editedProduct.totalQuantity -
              calcDistributedQuantity(warehousesList, currentItem),
          },
        }
      }),
    )
  }

  return (
    <div className={styles.productPage}>
      {modalIsOpened && (
        <Modal
          name='Внимание!'
          setModalIsOpened={setModalIsOpened}
          apply={deleteCurrentProduct}
          cancel={() => setModalIsOpened(false)}
          enableCancelButton
        >
          <span>
            При удалении продукта он также будет удален со всех складов. Вы
            действительно хотите сделать это?
          </span>
        </Modal>
      )}
      <div className={styles.PageContent}>
        <div className={styles.BasicContent}>
          <ItemBasicContent
            item={editedProduct}
            changeName={changeProductName}
            deleteItem={() => setModalIsOpened(true)}
          >
            <TextField
              type='number'
              label='Общее количество'
              value={editedProduct.totalQuantity}
              onChange={changeProductTotalQuantity}
            />
            <span>Нераспределено: {editedProduct?.unallocatedQuantity}</span>
          </ItemBasicContent>
        </div>
        <div className='pr-10 flex flex-col gap-6'>
          <span className='text-xl'>Распределение по складам:</span>
          {(warehousesList as BasicWarehouse[])?.map((warehouse) => (
            <ProductDistribution
              key={warehouse.id}
              currentItem={warehouse}
              selectListItem={warehousesStorage}
              itemStorage={warehousesList}
              setItemStorage={setWarehousesList}
              blurInput={() => checkDistributedQuantity(warehouse)}
              inputChange={(e) =>
                updateProductDistributedWarehouseQuantity(e, warehouse)
              }
            />
          ))}
        </div>
      </div>
      <ControlProductButtons
        currentProduct={currentProduct}
        editedProduct={editedProduct}
        setEditedProduct={setEditedProduct}
        warehousesList={warehousesList}
        setWarehousesList={setWarehousesList}
        productDistributedWarehouses={productDistributedWarehouses}
      />
    </div>
  )
}

export default ProductPage
