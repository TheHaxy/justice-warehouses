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
} from '../../../assets/types'

interface MySelectProps {
  list: (Product | Warehouse)[]
  currentItem: BasicProduct | BasicWarehouse
  onChange: (e: SelectChangeEvent) => void
}

const MySelect: React.FC<MySelectProps> = ({ list, onChange, currentItem }) => (
  <FormControl fullWidth>
    <InputLabel>Продукт</InputLabel>
    <Select
      value={currentItem.id ? String(currentItem.id) : ''}
      label='Продукт'
      onChange={onChange}
    >
      {list.map((el) => (
        <MenuItem key={el.id} value={el.id}>
          {el.name} ({(el as Product).unallocatedQuantity}шт.)
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)

export default MySelect
