export interface BasicProduct {
  id: number
  quantity: number
}

export interface BasicWarehouse {
  id: number
  product: BasicProduct
}

export interface Warehouse {
  name: string
  id: number
  products: BasicProduct[]
}

export interface Product {
  name: string
  id: number
  totalQuantity: number
  unallocatedQuantity: number
}
