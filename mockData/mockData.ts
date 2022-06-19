import { Warehouse } from '../pages/warehouses'
import { Product } from '../pages/products'

export const warehousesStorageMock: Warehouse[] = [
  { name: 'First warehouse', id: 0 },
  { name: 'Second warehouse', id: 1 },
  { name: 'Third warehouse', id: 2 },
  { name: 'Four warehouse', id: 3 },
]

export const productsStorageMock: Product[] = [
  {
    name: 'firstProduct',
    id: 'id1',
    totalQuantity: 123,
    unallocatedQuantity: 32,
  },
  {
    name: 'secondProduct',
    id: 'id2',
    totalQuantity: 87,
    unallocatedQuantity: 45,
  },
]
