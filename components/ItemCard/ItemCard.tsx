import React from 'react'
import styles from './ItemCard.module.css'

interface EntityCardProps {
  name: string
  onClick: () => void
  totalQuantity?: number
  unallocatedQuantity?: number
}

const ItemCard: React.FC<EntityCardProps> = ({
  name,
  onClick,
  totalQuantity,
  unallocatedQuantity,
}) => {
  const totalQuantityExists = totalQuantity && totalQuantity >= 0
  const unallocatedQuantityExists =
    unallocatedQuantity && unallocatedQuantity >= 0
  return (
    <div className={styles.Item} onClick={onClick}>
      <span className='text-lg'>{name}</span>
      <div className={styles.QuantityContainer}>
        {totalQuantityExists && <span>Общее количество: {totalQuantity}</span>}
        {unallocatedQuantityExists && (
          <span>Нераспределено: {unallocatedQuantity}</span>
        )}
      </div>
    </div>
  )
}

export default ItemCard
