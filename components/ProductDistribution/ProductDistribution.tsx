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
  inputChange: (e: ChangeEvent<HTMLInputElement>) => void
  selectLabel?: string
  enableQuantity?: boolean
}

const ProductDistribution: React.FC<ProductDistributionProps> = ({
  currentItem,
  selectListItem,
  itemStorage,
  setItemStorage,
  checkProductQuantity,
  inputChange,
  selectLabel,
  enableQuantity,
}) => {
  const removeAddedProduct = () =>
    (setItemStorage as React.Dispatch<(BasicProduct | BasicWarehouse)[]>)(
      itemStorage.filter((item) => item.id !== currentItem.id),
    )

  const changeSelectValue = (event: SelectChangeEvent) => {
    if (itemStorage.find((item) => item.id === Number(event.target.value)))
      return
    setItemStorage(
      itemStorage.map((item) => {
        if (item.id !== currentItem.id) return item
        return { ...item, id: Number(event.target.value) }
      }),
    )
  }

  return (
    <div className={styles.ProductDistribution}>
      <MySelect
        currentItem={currentItem}
        list={selectListItem}
        onChange={changeSelectValue}
        selectLabel={selectLabel}
        enableQuantity={enableQuantity}
      />
      <TextField
        label='Количество'
        inputProps={{ min: 1 }}
        value={
          (currentItem as BasicProduct)?.quantity ||
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
