import React from "react";
import styles from './styles.module.css'

const Header = ({title='Скоро обед!', goBack= null, rightButton = null }) => {

    return <div className={styles.header}>
        <div className={styles.headerSide} onClick={goBack || function (){}}>
            {goBack && <i className={'fas fa-arrow-left'}/>}
        </div>
        <div className={styles.headerTitle}>{title}</div>
        <div className={styles.headerSide}>
            {rightButton && <HeaderButton disabled={rightButton?.disabled} onClick={rightButton.onClick || rightButton.onPress} label={rightButton.label} />}
        </div>
    </div>
}

export const HeaderButton = ({label='button', onClick=()=>{}, height=30, isProductButton=false, ...props}) => {
    return <button className={isProductButton ? styles.productButton :styles.headerButton} style={{height, borderRadius: height / 2}} onClick={onClick} {...props}>{label}</button>
}

export default Header
