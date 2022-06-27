import { createEvent, createStore } from 'effector'
import { persist } from 'effector-storage/local'
import {
  BasicProduct,
  BasicWarehouse,
  Product,
  Warehouse,
} from '../common/types'
import { calcUnallocatedQuantity } from '../common/utils'
import { PRODUCT_STORAGE, WAREHOUSES_STORAGE } from '../common/constants'

const hasProduct = (products: BasicProduct[], id: BasicProduct['id']) =>
  products.find((item) => item.id === id)

const isSameEl = (el: { id: number }, msg: { id: number }) => el.id === msg.id

const transformProductById =
  (el: Warehouse, msg: BasicWarehouse) =>
  (callbackNn: (item: BasicProduct) => BasicProduct) => ({
    ...el,
    products: el.products.map((item) =>
      isSameEl(item, msg.product) ? callbackNn(item) : item,
    ),
  })

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
      if (isSameEl(el, msg))
        return { ...el, products: [...el.products, msg.product] }
      if (hasProduct(el.products, msg.product.id)) return el

      return transformProductById(
        el,
        msg,
      )((item) => ({ ...item, quantity: item.quantity + msg.product.quantity }))
    }),
  )
  .on(replaceWarehousesProductsStorage, (state, msg) =>
    state.map((el) => {
      if (!isSameEl(el, msg)) return el
      if (hasProduct(el.products, msg.product.id))
        return { ...el, products: [...el.products, msg.product] }
      return transformProductById(
        el,
        msg,
      )((item) => ({ ...item, quantity: msg.product.quantity }))
    }),
  )
  .on(updateWarehouse, (state, msg) =>
    state.map((el) => (isSameEl(el, msg) ? msg : el)),
  )
  .on(deleteWarehouse, (state, msg) =>
    state.filter((warehouse) => !isSameEl(warehouse, msg)),
  )

export const $productsStorage = createStore<Product[]>([])
  .on(updateProductsStorage, (state, msg) => [...state, msg])
  .on(updateUnallocatedProductQuantity, (state, msg) =>
    state.map((product) =>
      isSameEl(product, msg) ? calcUnallocatedQuantity(product) : product,
    ),
  )
  .on(updateProduct, (state, msg) =>
    state.map((product) => (isSameEl(product, msg) ? msg : product)),
  )
  .on(deleteProduct, (state, msg) =>
    state.filter((product) => !isSameEl(product, msg)),
  )

persist({
  source: $warehousesStorage,
  target: $warehousesStorage,
  key: WAREHOUSES_STORAGE,
})

persist({
  source: $productsStorage,
  target: $productsStorage,
  key: PRODUCT_STORAGE,
})
