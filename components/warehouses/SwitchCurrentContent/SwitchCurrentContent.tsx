import React from 'react'
import { Button } from '@mui/material'
import {
  DISTRIBUTED_PRODUCTS,
  WAREHOUSE_MOVEMENT,
} from '../../../common/constants'
import { CurrentContent } from '../../../common/types'

interface SwitchCurrentContentProps {
  currentContent: CurrentContent
  setCurrentContent: React.Dispatch<CurrentContent>
}

const SwitchCurrentContent: React.FC<SwitchCurrentContentProps> = ({
  currentContent,
  setCurrentContent,
}) => {
  const itsDistributedProducts = currentContent === DISTRIBUTED_PRODUCTS
  const itsWarehouseMovement = currentContent === WAREHOUSE_MOVEMENT
  return (
    <div className='flex gap-4'>
      <Button
        className='max-w-[20rem]'
        variant='outlined'
        disabled={itsDistributedProducts}
        onClick={() => setCurrentContent(DISTRIBUTED_PRODUCTS)}
      >
        Добавление продуктов
      </Button>
      <Button
        className='max-w-[20rem]'
        variant='outlined'
        disabled={itsWarehouseMovement}
        onClick={() => setCurrentContent(WAREHOUSE_MOVEMENT)}
      >
        Перемещение по складам
      </Button>
    </div>
  )
}

export default SwitchCurrentContent
