import React from 'react'
import { useRouter } from 'next/router'
import EntityCard from '../EntityCard/EntityCard'
import { Product, Warehouse } from '../../assets/types'
import styles from './itemsContainer.module.css'

interface WarehousesContainerProps {
  itemsStorage: Warehouse[] | Product[]
}

const ItemsContainer: React.FC<WarehousesContainerProps> = ({
  itemsStorage,
}) => {
  const router = useRouter()

  const openWarehouse = (item: Warehouse | Product) => {
    router.push(`${router.pathname}/${item.id}`)
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
    </div>
  )
}

export default ItemsContainer
