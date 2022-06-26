import React from 'react'

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
}) => (
  <div
    className='p-8 flex items-center gap-12 bg-white rounded-lg hover: cursor-pointer'
    onClick={onClick}
  >
    <span className='text-lg'>{name}</span>
    <div className='flex gap-8'>
      {(totalQuantity || totalQuantity === 0) && (
        <span>Общее количество: {totalQuantity}</span>
      )}
      {(unallocatedQuantity || unallocatedQuantity === 0) && (
        <span>Нераспределено: {unallocatedQuantity}</span>
      )}
    </div>
  </div>
)

export default ItemCard
