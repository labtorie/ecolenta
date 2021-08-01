import React from 'react'
import SlidingPane from "react-sliding-pane";
import styles from './styles.module.css'
import './customModalStyles.css'

const SlideUpModal = ({isOpen = false, onClose = () => {}, ...props}) => {
    return <SlidingPane isOpen={isOpen}
                        className={styles.modalContainer}
                        width={'100vw'}
                        shouldCloseOnEsc={true}
                        hideHeader={true}
                        onRequestClose={onClose}
                        from={'bottom'}
    >
        <div className={styles.cringe}>Тут могло быть закрытие свайпом...</div>
        <div className={styles.modalBody}>
            {props.children}
        </div>
    </SlidingPane>
}


export default SlideUpModal
