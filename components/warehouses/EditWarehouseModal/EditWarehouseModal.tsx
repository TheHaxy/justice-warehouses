import React from 'react'
import { useStore } from 'effector-react'
import Modal from '../../UI/Modal/Modal'
import { Warehouse } from '../../../assets/types'
import { $productsStorage } from '../../../model/model'

interface EditWarehouseModalProps {
  currentItem: Warehouse
  setModalIsOpened: React.Dispatch<boolean>
}

const EditWarehouseModal: React.FC<EditWarehouseModalProps> = ({
  currentItem,
  setModalIsOpened,
}) => {
  const productStorage = useStore($productsStorage)

  const findProductName = (productId: number) =>
    productStorage.find((item) => item.id === productId)?.name

  return (
    <Modal
      name={currentItem.name || ''}
      setModalIsOpened={setModalIsOpened}
      apply={() => console.log(currentItem)}
    >
      {currentItem.products.map((el) => (
        <div key={el.id}>
          {findProductName(el.id)} {el.quantity}
        </div>
      ))}
    </Modal>
  )
}

export default EditWarehouseModal
