import React, { ChangeEvent, useState } from 'react'
import { useRouter } from 'next/router'
import { useStore } from 'effector-react'
import {
  $warehousesStorage,
  deleteWarehouse,
  updateUnallocatedProductQuantity,
} from '../../model/model'
import { BasicWarehouse, Warehouse } from '../../assets/types'
import ControlWarehouseButtons from '../../components/warehouses/ControlButtons/ControlWarehouseButtons'
import SwitchCurrentContent from '../../components/warehouses/SwitchCurrentContent/SwitchCurrentContent'
import styles from './warehousePage.module.css'
import WarehousePageContent from '../../components/warehouses/WarehousePageContent/WarehousePageContent'
import ItemBasicContent from '../../components/ItemBasicContent/ItemBasicContent'

export type CurrentContent = 'DISTRIBUTED_PRODUCTS' | 'WAREHOUSE_MOVEMENT'

const WarehousePage = () => {
  const router = useRouter()
  const warehousesStorage = useStore($warehousesStorage)
  const currentWarehouse = warehousesStorage.find(
    (warehouse) => warehouse.id === Number(router.query.id),
  ) as Warehouse
  const [editedWarehouse, setEditedWarehouse] = useState(currentWarehouse)
  const [currentContent, setCurrentContent] = useState<CurrentContent>(
    'DISTRIBUTED_PRODUCTS',
  )
  const [movementWarehouses, setMovementWarehouses] = useState<
    BasicWarehouse[]
  >([])

  const changeWarehouseName = (e: ChangeEvent<HTMLInputElement>) => {
    setEditedWarehouse({
      ...editedWarehouse,
      name: e.target.value,
    })
  }

  const deleteCurrentWarehouse = () => {
    router.back()
    deleteWarehouse(currentWarehouse)
    currentWarehouse.products.forEach((product) =>
      updateUnallocatedProductQuantity(product),
    )
  }

  return (
    <div className={styles.WarehousePage}>
      <div className={styles.PageContent}>
        <div className={styles.TopContent}>
          <ItemBasicContent
            item={editedWarehouse}
            changeName={changeWarehouseName}
            deleteItem={deleteCurrentWarehouse}
          >
            <SwitchCurrentContent
              currentContent={currentContent}
              setCurrentContent={setCurrentContent}
            />
          </ItemBasicContent>
        </div>
        <WarehousePageContent
          movementWarehouses={movementWarehouses}
          setMovementWarehouses={setMovementWarehouses}
          editedWarehouse={editedWarehouse}
          setEditedWarehouse={setEditedWarehouse}
          currentContent={currentContent}
        />
      </div>
      <ControlWarehouseButtons
        movementWarehouses={movementWarehouses}
        setMovementWarehouses={setMovementWarehouses}
        currentContent={currentContent}
        currentWarehouse={currentWarehouse}
        editedWarehouse={editedWarehouse}
        setEditedWarehouse={setEditedWarehouse}
      />
    </div>
  )
}

export default WarehousePage
