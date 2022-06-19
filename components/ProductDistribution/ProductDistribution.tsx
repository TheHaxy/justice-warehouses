import React, { ChangeEvent } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { SelectChangeEvent, TextField } from '@mui/material'
import MySelect from '../UI/MySelect/MySelect'
import styles from '../products/CreateProductModal/createProductModal.module.css'
import {
  Product,
  SelectProduct,
  SelectWarehouse,
  Warehouse,
} from '../../assets/types'

interface ProductDistributionProps {
  currentItem: SelectProduct | SelectWarehouse
  selectListItem: Product[] | Warehouse[]
  itemStorage: SelectProduct[] | SelectWarehouse[]
  setItemStorage: React.Dispatch<SelectProduct[] | SelectWarehouse[]>
  checkProductQuantity?: () => void
  selectChange: (e: SelectChangeEvent) => void
  inputChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const ProductDistribution: React.FC<ProductDistributionProps> = ({
  currentItem,
  selectListItem,
  itemStorage,
  setItemStorage,
  checkProductQuantity,
  selectChange,
  inputChange,
}) => {
  const removeAddedProduct = () => {
    setItemStorage(itemStorage.filter((item) => item.id !== currentItem.id))
  }

  return (
    <div className='relative grid items-center grid-cols-2 gap-2'>
      <MySelect list={selectListItem} onChange={selectChange} />
      <TextField
        label='Количество'
        inputProps={{
          min: 1,
        }}
        onChange={inputChange}
        onBlur={checkProductQuantity}
      />
      <div className={styles.CloseIcon} onClick={removeAddedProduct}>
        <CloseIcon fontSize='small' />
      </div>
    </div>
  )
}

export default ProductDistribution
