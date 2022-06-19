import React, { useState } from 'react'
import EntityCard from '../EntityCard/EntityCard'
import Modal from '../UI/Modal/Modal'
import { Product, Warehouse } from '../../assets/types'
import styles from './itemsContainer.module.css'

interface WarehousesContainerProps {
  itemsStorage: Warehouse[] | Product[]
}

const ItemsContainer: React.FC<WarehousesContainerProps> = ({
  itemsStorage,
}) => {
  const [modalIsOpened, setModalIsOpened] = useState(false)
  const [currentItem, setCurrentItem] = useState<Warehouse | Product | null>(
    null,
  )

  const openWarehouse = (item: Warehouse | Product) => {
    setCurrentItem(item)
    setModalIsOpened(true)
  }

  return (
    <div className={styles.ItemsContainer}>
      {itemsStorage.map((item) => (
        <EntityCard
          key={item.id}
          name={item.name}
          totalQuantity={(item as Product).totalQuantity}
          unallocatedQuantity={(item as Product).unallocatedQuantity}
          onClick={() => openWarehouse(item)}
        />
      ))}
      {modalIsOpened && (
        <Modal
          name={currentItem?.name || ''}
          setModalIsOpened={setModalIsOpened}
          apply={() => console.log(currentItem)}
        >
          123
        </Modal>
      )}
    </div>
  )
}

export default ItemsContainer