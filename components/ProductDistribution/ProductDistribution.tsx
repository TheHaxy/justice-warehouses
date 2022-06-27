import React, { ChangeEvent, useCallback } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { SelectChangeEvent, TextField } from '@mui/material'
import MySelect from '../UI/MySelect/MySelect'
import {
  BasicProduct,
  BasicWarehouse,
  Product,
  Warehouse,
} from '../../common/types'
import styles from './productDistribution.module.css'

interface ProductDistributionProps {
  currentItem: BasicProduct | BasicWarehouse
  selectListItem: (Product | Warehouse)[]
  itemStorage: (BasicProduct | BasicWarehouse)[]
  setItemStorage:
    | React.Dispatch<BasicProduct[]>
    | React.Dispatch<BasicWarehouse[]>
  blurInput?: () => void
  inputChange: (e: ChangeEvent<HTMLInputElement>) => void
  selectLabel?: string
  enableQuantity?: boolean
}

const ProductDistribution: React.FC<ProductDistributionProps> = ({
  currentItem,
  selectListItem,
  itemStorage,
  setItemStorage,
  blurInput,
  inputChange,
  selectLabel,
  enableQuantity,
}) => {
  const productValue =
    (currentItem as BasicProduct)?.quantity ||
    (currentItem as BasicWarehouse)?.product?.quantity

  const removeAddedProduct = useCallback(
    () =>
      (setItemStorage as React.Dispatch<(BasicProduct | BasicWarehouse)[]>)(
        itemStorage.filter((item) => item.id !== currentItem.id),
      ),
    [itemStorage],
  )

  const changeSelectValue = useCallback(
    (event: SelectChangeEvent) => {
      const productAlreadySelected = itemStorage.find(
        (item) => item.id === Number(event.target.value),
      )
      if (productAlreadySelected) return
      ;(setItemStorage as React.Dispatch<(BasicProduct | BasicWarehouse)[]>)(
        itemStorage.map((item) => {
          if (item.id !== currentItem.id) return item
          return { ...item, id: Number(event.target.value) }
        }),
      )
    },
    [itemStorage],
  )

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
        value={productValue}
        onChange={inputChange}
        onBlur={blurInput}
      />
      <div className={styles.CloseIcon} onClick={removeAddedProduct}>
        <CloseIcon fontSize='small' />
      </div>
    </div>
  )
}

export default ProductDistribution
