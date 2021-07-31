import React, {useEffect, useState} from "react";
import styles from './styles.module.css'

const DELAY = 1200
const Splash = ({isVisible=false}) => {
    const [isShown, setShown] = useState(isVisible)
    const [_isVisible, setVisible] = useState(isVisible)

    useEffect(()=>{
        if (isVisible) {
            setShown(true)
        } else {
            setTimeout(()=>setVisible(false), DELAY)
            setTimeout(()=>setShown(false), DELAY + 300) //кринж
        }
    }, [isVisible])

    if (!isShown) return null

    return <div className={styles.splash} style={{opacity: _isVisible ? 1 : 0}}>
        <div><b>Эко</b>Айти</div>
        <div>🥪🥗🥟</div>
    </div>
}

export default Splash
