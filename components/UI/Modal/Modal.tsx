import React, { ReactNode } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Button } from '@mui/material'
import styles from './modal.module.css'

interface ModalProps {
  children: ReactNode
  name: string
  setModalIsOpened: React.Dispatch<boolean>
  apply: () => void
}

const Modal: React.FC<ModalProps> = ({
  children,
  name,
  setModalIsOpened,
  apply,
}) => (
  <div className={styles.Background}>
    <div className={styles.Modal}>
      <div className={styles.CloseIcon} onClick={() => setModalIsOpened(false)}>
        <CloseIcon />
      </div>
      <div className={styles.Content}>
        <span className={styles.Title}>{name}</span>
        {children}
      </div>
      <Button
        onClick={apply}
        variant='outlined'
        color='success'
        className={styles.ApplyButton}
      >
        Применить
      </Button>
    </div>
  </div>
)

export default Modal
