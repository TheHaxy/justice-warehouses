import React, { ChangeEvent, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useStore } from 'effector-react'
import { TextField } from '@mui/material'
import Head from 'next/head'
import styles from './productPage.module.css'
import {
  $productsStorage,
  $warehousesStorage,
  deleteProduct,
  updateWarehouse,
} from '../../model/model'
import { BasicProduct, BasicWarehouse, Product } from '../../common/types'
import ItemBasicContent from '../../components/ItemBasicContent/ItemBasicContent'
import ControlProductButtons from '../../components/products/ControlProductButtons/ControlProductButtons'
import ProductDistribution from '../../components/ProductDistribution/ProductDistribution'
import { calcDistributedQuantity, findCurrentItem } from '../../common/utils'
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
    findCurrentItem(warehouse.products, currentProduct),
  )
  const [warehousesList, setWarehousesList] = useState<BasicWarehouse[]>(
    productDistributedWarehouses.map((warehouse) => {
      const thisProduct = findCurrentItem(warehouse.products, currentProduct)
      return {
        id: warehouse.id,
        product: {
          id: thisProduct?.id,
          quantity: (thisProduct as BasicProduct)?.quantity,
        },
      }
    }) as BasicWarehouse[],
  )

  useEffect(() => {
    setEditedProduct(currentProduct)
  }, [currentProduct])

  const changeProductName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setEditedProduct({ ...editedProduct, name: e.target.value })
    },
    [editedProduct],
  )

  const changeProductTotalQuantity = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setEditedProduct({
        ...editedProduct,
        totalQuantity: Number(e.target.value),
      })
    },
    [editedProduct],
  )

  const updateProductDistributedWarehouseQuantity = useCallback(
    (e: ChangeEvent<HTMLInputElement>, currentWarehouse: BasicWarehouse) => {
      setWarehousesList(
        warehousesList.map((warehouse) => {
          if (warehouse.id !== currentWarehouse.id) return warehouse
          return {
            ...warehouse,
            product: { ...warehouse.product, quantity: Number(e.target.value) },
          }
        }),
      )
    },
    [warehousesList],
  )

  const deleteCurrentProduct = useCallback(() => {
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
  }, [productDistributedWarehouses])

  const checkDistributedQuantity = useCallback(
    (currentItem: BasicWarehouse) => {
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
    },
    [editedProduct, warehousesList],
  )

  return (
    <>
      <Head>
        <title>Product - {editedProduct?.name}</title>
        <meta charSet='utf-8' />
      </Head>
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
                value={editedProduct?.totalQuantity}
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
    </>
  )
}

export default ProductPage
