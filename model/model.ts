import { createEvent, createStore } from 'effector'
import {
  BasicProduct,
  Product,
  SelectWarehouse,
  Warehouse,
} from '../assets/types'

export const updateWarehousesStorage = createEvent<Warehouse>()
export const updateProductsStorage = createEvent<Product>()
export const updateProductUnallocatedQuantity = createEvent<BasicProduct>()
export const updateWarehousesProductsStorage = createEvent<SelectWarehouse>()

export const $warehousesStorage = createStore<Warehouse[]>([])
  .on(updateWarehousesStorage, (state, msg) => [...state, msg])
  .on(updateWarehousesProductsStorage, (state, msg) =>
    state.map((el) => {
      if (el.id !== msg.warehouse.id) return el
      return { ...el, products: [...el.products, msg.warehouse.product] }
    }),
  )

export const $productsStorage = createStore<Product[]>([])
  .on(updateProductsStorage, (state, msg) => [...state, msg])
  .on(updateProductUnallocatedQuantity, (state, msg) =>
    state.map((el) => {
      if (el.id !== msg.id) return el
      return {
        ...el,
        unallocatedQuantity: el.unallocatedQuantity - msg.quantity,
      }
    }),
  )
