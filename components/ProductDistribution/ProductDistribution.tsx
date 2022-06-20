import React, { ChangeEvent } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { SelectChangeEvent, TextField } from '@mui/material'
import MySelect from '../UI/MySelect/MySelect'
import {
  BasicProduct,
  BasicWarehouse,
  Product,
  Warehouse,
} from '../../assets/types'
import styles from './productDistribution.module.css'

interface ProductDistributionProps {
  currentItem: BasicProduct | BasicWarehouse
  selectListItem: (Product | Warehouse)[]
  itemStorage: (BasicProduct | BasicWarehouse)[]
  setItemStorage:
    | React.Dispatch<BasicProduct[]>
    | React.Dispatch<BasicWarehouse[]>
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
  const removeAddedProduct = () =>
    (setItemStorage as React.Dispatch<(BasicProduct | BasicWarehouse)[]>)(
      itemStorage.filter((item) => item.id !== currentItem.id),
    )

  return (
    <div className={styles.ProductDistribution}>
      <MySelect
        currentItem={currentItem}
        list={selectListItem}
        onChange={selectChange}
      />
      <TextField
        label='Количество'
        inputProps={{ min: 1 }}
        value={
          (currentItem as BasicProduct).quantity ||
          (currentItem as BasicWarehouse)?.product?.quantity
        }
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
