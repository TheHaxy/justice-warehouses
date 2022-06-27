import { BasicProduct, BasicWarehouse, Product } from './types'
import { $warehousesStorage } from '../model/model'

export const voidProduct = {
  name: '',
  id: 0,
  totalQuantity: 0,
  unallocatedQuantity: 0,
}

export const voidWarehouse = {
  name: '',
  id: 0,
  products: [],
}

export const findCurrentItem = (
  storage: { id: number | string }[],
  item: { id: number | string },
) => storage.find((product) => Number(product.id) === Number(item.id))

export const calcDistributedQuantity = (
  storage: BasicWarehouse[],
  selectItem?: BasicWarehouse,
) => {
  const filteredWarehouses = storage.filter(
    (warehouse) => warehouse.id !== selectItem?.id,
  )
  const distributedQuantities = filteredWarehouses.map(
    (warehouse) => warehouse.product.quantity,
  )
  return distributedQuantities.reduce((prev, curr) => prev + curr, 0)
}

export const calcUnallocatedQuantity = (product: Product) => {
  const distributedQuantities = $warehousesStorage
    .getState()
    .map((warehouse) => {
      const thisProduct = findCurrentItem(warehouse.products, product)
      if (!thisProduct) return 0
      return (thisProduct as BasicProduct).quantity
    })
  const distributedQuantity = distributedQuantities.reduce(
    (prevQuantity, currQuantity) => prevQuantity + currQuantity,
    0,
  )
  return {
    ...product,
    unallocatedQuantity: distributedQuantity
      ? product.totalQuantity - distributedQuantity
      : product.totalQuantity,
  }
}
