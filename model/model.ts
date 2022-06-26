import { createEvent, createStore } from 'effector'
import { persist } from 'effector-storage/local'
import {
  BasicProduct,
  BasicWarehouse,
  Product,
  Warehouse,
} from '../assets/types'
import { calcUnallocatedQuantity } from '../assets/utils'

export const updateWarehousesStorage = createEvent<Warehouse>()
export const updateWarehouse = createEvent<Warehouse>()
export const updateProductsStorage = createEvent<Product>()
export const updateProduct = createEvent<Product>()
export const updateWarehousesProductsStorage = createEvent<BasicWarehouse>()
export const replaceWarehousesProductsStorage = createEvent<BasicWarehouse>()
export const updateUnallocatedProductQuantity = createEvent<
  BasicProduct | Product
>()
export const deleteProduct = createEvent<Product>()
export const deleteWarehouse = createEvent<Warehouse>()

export const $warehousesStorage = createStore<Warehouse[]>([])
  .on(updateWarehousesStorage, (state, msg) => [...state, msg])
  .on(updateWarehousesProductsStorage, (state, msg) =>
    state.map((el) => {
      if (el.id !== msg.id) return el
      if (el.products.find((item) => item.id === msg.product.id))
        return {
          ...el,
          products: el.products.map((item) => {
            if (item.id !== msg.product.id) return item
            return { ...item, quantity: item.quantity + msg.product.quantity }
          }),
        }
      return { ...el, products: [...el.products, msg.product] }
    }),
  )
  .on(replaceWarehousesProductsStorage, (state, msg) =>
    state.map((el) => {
      if (el.id !== msg.id) return el
      if (el.products.find((item) => item.id === msg.product.id))
        return {
          ...el,
          products: el.products.map((item) => {
            if (item.id !== msg.product.id) return item
            return { ...item, quantity: msg.product.quantity }
          }),
        }
      return { ...el, products: [...el.products, msg.product] }
    }),
  )
  .on(updateWarehouse, (state, msg) =>
    state.map((el) => {
      if (el.id !== msg.id) return el
      return msg
    }),
  )
  .on(deleteWarehouse, (state, msg) =>
    state.filter((warehouse) => warehouse.id !== msg.id),
  )

export const $productsStorage = createStore<Product[]>([])
  .on(updateProductsStorage, (state, msg) => [...state, msg])
  .on(updateUnallocatedProductQuantity, (state, msg) =>
    state.map((product) => {
      if (product.id !== msg.id) return product
      return calcUnallocatedQuantity(product)
    }),
  )
  .on(updateProduct, (state, msg) =>
    state.map((product) => {
      if (product.id !== msg.id) return product
      return msg
    }),
  )
  .on(deleteProduct, (state, msg) =>
    state.filter((product) => product.id !== msg.id),
  )

persist({
  source: $warehousesStorage,
  target: $warehousesStorage,
  key: 'WAREHOUSES_STORAGE',
})

persist({
  source: $productsStorage,
  target: $productsStorage,
  key: 'PRODUCT_STORAGE',
})
