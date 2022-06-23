import React, { ChangeEvent, useEffect, useState } from 'react'
import { useStore } from 'effector-react'
import styles from './warehousePageContent.module.css'
import ProductDistribution from '../../ProductDistribution/ProductDistribution'
import WarehouseMovement from '../WarehouseMovement/WarehouseMovement'
import { BasicProduct, BasicWarehouse, Warehouse } from '../../../assets/types'
import { $productsStorage } from '../../../model/model'
import { CurrentContent } from '../../../pages/warehouses/[id]'

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
  const productStorage = useStore($productsStorage)
  const [currentWarehouseProducts, setCurrentWarehouseProducts] = useState(
    editedWarehouse.products,
  )

  useEffect(() => {
    setEditedWarehouse({
      ...editedWarehouse,
      products: currentWarehouseProducts,
    })
  }, [currentWarehouseProducts])

  const updateAddedProductQuantity = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    selectItem: BasicProduct,
  ) => {
    setCurrentWarehouseProducts(
      currentWarehouseProducts.map((item) => {
        if (item.id !== selectItem.id) return item
        return { ...item, quantity: Number(e.target.value) }
      }),
    )
  }

  return (
    <div className={styles.Content}>
      {currentContent === 'DISTRIBUTED_PRODUCTS' && (
        <>
          <span className='text-xl'>Распределенные продукты:</span>
          {currentWarehouseProducts?.map((product) => (
            <ProductDistribution
              currentItem={product}
              selectListItem={productStorage}
              itemStorage={currentWarehouseProducts}
              setItemStorage={setCurrentWarehouseProducts}
              inputChange={(e) => updateAddedProductQuantity(e, product)}
            />
          ))}
        </>
      )}
      {currentContent === 'WAREHOUSE_MOVEMENT' && (
        <>
          <span className='text-xl'>Перемещение по складам:</span>
          {movementWarehouses?.map((warehouse) => (
            <WarehouseMovement
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
