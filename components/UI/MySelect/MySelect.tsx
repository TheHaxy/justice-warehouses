import React from 'react'

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import {
  BasicProduct,
  BasicWarehouse,
  Product,
  Warehouse,
} from '../../../common/types'

interface MySelectProps {
  list: (Product | Warehouse)[]
  currentItem: BasicProduct | BasicWarehouse | Product | Warehouse
  onChange: (e: SelectChangeEvent) => void
  selectLabel?: string
  enableQuantity?: boolean
}

const MySelect: React.FC<MySelectProps> = ({
  list,
  onChange,
  currentItem,
  selectLabel,
  enableQuantity,
}) => {
  const calcProductQuantity = (el: Product | Warehouse) =>
    `(${(el as Product).unallocatedQuantity}шт.)`

  return (
    <FormControl fullWidth>
      <InputLabel>{selectLabel || ''}</InputLabel>
      <Select
        value={currentItem?.id ? String(currentItem.id) : ''}
        label={selectLabel || ''}
        onChange={onChange}
      >
        {list.map((el) => (
          <MenuItem key={el.id} value={el.id}>
            {el.name} {enableQuantity && calcProductQuantity(el)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default MySelect
