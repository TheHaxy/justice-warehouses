import React, { useState } from 'react'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import { Product, Warehouse } from '../../../assets/types'

interface MySelectProps {
  list: Product[] | Warehouse[]
  onChange: (e: SelectChangeEvent) => void
}

const MySelect: React.FC<MySelectProps> = ({ list, onChange }) => {
  const [selectedItem, setSelectedItem] = useState('')

  const handleChange = (e: SelectChangeEvent) => {
    setSelectedItem(e.target.value)
    onChange(e)
  }

  return (
    <FormControl fullWidth>
      <InputLabel>Продукт</InputLabel>
      <Select value={selectedItem} label='Продукт' onChange={handleChange}>
        {list.map((el) => (
          <MenuItem key={el.id} value={el.id}>
            {el.name} ({(el as Product).unallocatedQuantity}шт.)
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default MySelect
