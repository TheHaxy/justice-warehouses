import { createEvent, createStore } from 'effector'
import {
  BasicProduct,
  BasicWarehouse,
  Product,
  Warehouse,
} from '../assets/types'

export const updateWarehousesStorage = createEvent<Warehouse>()
export const updateWarehouse = createEvent<Warehouse>()
export const updateProductsStorage = createEvent<Product>()
export const updateProductUnallocatedQuantity = createEvent<BasicProduct>()
export const updateWarehousesProductsStorage = createEvent<BasicWarehouse>()

export const $warehousesStorage = createStore<Warehouse[]>([])
  .on(updateWarehousesStorage, (state, msg) => [...state, msg])
  .on(updateWarehousesProductsStorage, (state, msg) =>
    state.map((el) => {
      if (el.id !== msg.id) return el
      return { ...el, products: [...el.products, msg.product] }
    }),
  )
  .on(updateWarehouse, (state, msg) =>
    state.map((el) => {
      if (el.id !== msg.id) return el
      return msg
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
