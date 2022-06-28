import React, {ChangeEvent, useCallback, useEffect, useState} from 'react'

import {useRouter} from 'next/router'
import {useStore} from 'effector-react'
import Head from 'next/head'
import {
  $warehousesStorage,
  deleteWarehouse,
  updateUnallocatedProductQuantity,
} from '../../model/model'
import {BasicWarehouse, CurrentContent, Warehouse} from '../../common/types'
import ControlWarehouseButtons from '../../components/warehouses/ControlButtons/ControlWarehouseButtons'
import SwitchCurrentContent from '../../components/warehouses/SwitchCurrentContent/SwitchCurrentContent'
import WarehousePageContent from '../../components/warehouses/WarehousePageContent/WarehousePageContent'
import ItemBasicContent from '../../components/ItemBasicContent/ItemBasicContent'
import Modal from '../../components/UI/Modal/Modal'
import {DISTRIBUTED_PRODUCTS} from '../../common/constants'

import styles from './warehousePage.module.css'

const WarehousePage = () => {
  const router = useRouter()

  const warehousesStorage = useStore($warehousesStorage)

  const currentWarehouse = warehousesStorage.find(
    (warehouse) => warehouse.id === Number(router.query.id),
  ) as Warehouse

  const [modalIsOpened, setModalIsOpened] = useState(false)
  const [editedWarehouse, setEditedWarehouse] = useState(currentWarehouse)
  const [currentContent, setCurrentContent] =
    useState<CurrentContent>(DISTRIBUTED_PRODUCTS)
  const [movementWarehouses, setMovementWarehouses] = useState<BasicWarehouse[]>([])

  useEffect(() => {
    setEditedWarehouse(
      warehousesStorage.find(
        (warehouse) => warehouse.id === Number(router.query.id),
      ) as Warehouse,
    )
  }, [warehousesStorage])

  const changeWarehouseName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setEditedWarehouse({
        ...editedWarehouse,
        name: e.target.value,
      })
    },
    [editedWarehouse],
  )

  const deleteCurrentWarehouse = useCallback(() => {
    router.back()
    setTimeout(() => {
      deleteWarehouse(currentWarehouse)
      currentWarehouse.products.forEach((product) =>
        updateUnallocatedProductQuantity(product),
      )
    }, 300)
  }, [currentWarehouse])

  return (
    <>
      <Head>
        <title>Warehouse - {editedWarehouse?.name}</title>
        <meta charSet='utf-8'/>
      </Head>
      <div className={styles.WarehousePage}>
        {modalIsOpened && (
          <Modal
            name='Внимание!'
            setModalIsOpened={setModalIsOpened}
            apply={deleteCurrentWarehouse}
            cancel={() => setModalIsOpened(false)}
            enableCancelButton
          >
            <span>
              При удалении склада все продукты попадут в нераспределенное
              хранилище. Вы действительно хотите сделать это?
            </span>
          </Modal>
        )}
        <div className={styles.PageContent}>
          <div className={styles.TopContent}>
            <ItemBasicContent
              item={editedWarehouse}
              changeName={changeWarehouseName}
              deleteItem={() => setModalIsOpened(true)}
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
    </>
  )
}

export default WarehousePage
