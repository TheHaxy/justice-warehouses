import React from 'react'
import { Button } from '@mui/material'
import { CurrentContent } from '../../../pages/warehouses/[id]'

interface SwitchCurrentContentProps {
  currentContent: CurrentContent
  setCurrentContent: React.Dispatch<CurrentContent>
}

const SwitchCurrentContent: React.FC<SwitchCurrentContentProps> = ({
  currentContent,
  setCurrentContent,
}) => (
  <div className='flex gap-4'>
    <Button
      className='max-w-[20rem]'
      variant='outlined'
      disabled={currentContent === 'DISTRIBUTED_PRODUCTS'}
      onClick={() => setCurrentContent('DISTRIBUTED_PRODUCTS')}
    >
      Добавление продуктов
    </Button>
    <Button
      className='max-w-[20rem]'
      variant='outlined'
      disabled={currentContent === 'WAREHOUSE_MOVEMENT'}
      onClick={() => setCurrentContent('WAREHOUSE_MOVEMENT')}
    >
      Перемещение по складам
    </Button>
  </div>
)

export default SwitchCurrentContent
