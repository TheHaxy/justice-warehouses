import { Product, Warehouse } from './types'

export const findCurrentProduct = (
  warehouse: Warehouse,
  currProduct: Product,
) => warehouse.products.find((product) => product.id === currProduct.id)
