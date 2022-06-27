import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useStore } from 'effector-react'
import styles from './warehousePageContent.module.css'
import ProductDistribution from '../../ProductDistribution/ProductDistribution'
import WarehouseMovement from '../WarehouseMovement/WarehouseMovement'
import {
  BasicProduct,
  BasicWarehouse,
  CurrentContent,
  Product,
  Warehouse,
} from '../../../common/types'
import { $productsStorage } from '../../../model/model'
import {
  DISTRIBUTED_PRODUCTS,
  WAREHOUSE_MOVEMENT,
} from '../../../common/constants'
import { findCurrentItem } from '../../../common/utils'

interface WarehousePageContentProps {
  movementWarehouses: BasicWarehouse[]
  setMovementWarehouses: React.Dispatch<BasicWarehouse[]>
  editedWarehouse: Warehouse
  setEditedWarehouse: React.Dispatch<Warehouse>
  currentContent: CurrentContent
}

const WarehousePageContent: React.FC<WarehousePageContentProps> = ({
  movementWarehouses,
  setMovementWarehouses,
  editedWarehouse,
  setEditedWarehouse,
  currentContent,
}) => {
  const itsDistributedProducts = currentContent === DISTRIBUTED_PRODUCTS
  const itsWarehouseMovement = currentContent === WAREHOUSE_MOVEMENT
  const productStorage = useStore($productsStorage)
  const [currentWarehouseProducts, setCurrentWarehouseProducts] = useState(
    editedWarehouse?.products,
  )

  useEffect(() => {
    setEditedWarehouse({
      ...editedWarehouse,
      products: currentWarehouseProducts,
    })
  }, [currentWarehouseProducts])

  useEffect(() => {
    setCurrentWarehouseProducts(editedWarehouse?.products)
  }, [editedWarehouse?.products])

  const updateAddedProductQuantity = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      selectItem: BasicProduct,
    ) => {
      setCurrentWarehouseProducts(
        currentWarehouseProducts.map((item) => {
          if (item.id !== selectItem.id) return item
          return { ...item, quantity: Number(e.target.value) }
        }),
      )
    },
    [currentWarehouseProducts],
  )

  const checkProductUnallocatedQuantity = useCallback(
    (product: BasicProduct) => {
      const productFullInfo = findCurrentItem(productStorage, product)

      const quantityNotExceededLimit =
        product.quantity < (productFullInfo as Product)?.unallocatedQuantity

      if (quantityNotExceededLimit) return

      setEditedWarehouse({
        ...editedWarehouse,
        products: editedWarehouse.products.map((item) => {
          if (item.id !== product.id) return item
          return {
            ...item,
            quantity: (productFullInfo as Product)?.unallocatedQuantity,
          }
        }),
      })
    },
    [editedWarehouse, productStorage],
  )

  return (
    <div className={styles.Content}>
      {itsDistributedProducts && (
        <>
          <span className='text-xl'>Распределенные продукты:</span>
          {editedWarehouse?.products?.map((product) => (
            <ProductDistribution
              key={product.id}
              currentItem={product}
              selectListItem={productStorage}
              itemStorage={currentWarehouseProducts}
              setItemStorage={setCurrentWarehouseProducts}
              blurInput={() => checkProductUnallocatedQuantity(product)}
              inputChange={(e) => updateAddedProductQuantity(e, product)}
            />
          ))}
        </>
      )}
      {itsWarehouseMovement && (
        <>
          <span className='text-xl'>Перемещение по складам:</span>
          {movementWarehouses?.map((warehouse) => (
            <WarehouseMovement
              key={warehouse.id}
              movementWarehouses={movementWarehouses}
              setMovementWarehouses={setMovementWarehouses}
              currentWarehouse={warehouse}
              productList={currentWarehouseProducts}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default WarehousePageContent
