import React, {useContext} from 'react'
import Header from "../core/Header";
import DataContext from "../../data";
import styles from './styles.module.css'
import {useHistory} from 'react-router-dom'
import {getLocalDate, today} from "../../utils";

const MainScreen = () => {

    const {orders, users, initiateOrder} = useContext(DataContext)
    const history = useHistory()

    const onCreate = async () => {
        const data = await initiateOrder(today())
        history.push('/order/'+data?.name)

    }

    return <div style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
        <Header title={'Заказы'} rightButton={{label: 'Создать', onClick: onCreate}}/>
        <div className={styles.ordersList}>
            {mapOrders(orders, users).map(order=><OrderItem key={order.id} order={order}/>)}
        </div>
    </div>
}

const OrderItem = ({order}) => {
    const history = useHistory()

    const navigateToOrder = () => {
        history.push('/order/'+order.id)
    }

    function getBottomText () {
        const users = order?.users
        if (users?.length) {
            return `${users[0]} ${users[1] ? ', '+users[1] : ''} ${users.length > 2 ? ('и ещё '+ (users.length - 2)) : ''}`
        }
        return 'Никого('
    }

    return <div className={styles.orderWrapper} onClick={navigateToOrder}>
        <div className={styles.orderTopLine}>
           <div className={styles.orderTitle}>{getLocalDate(order.date)}</div>
           <div className={styles.orderNotClosed}>{order.isClosed ? '' : 'Не заказан!'}</div>
        </div>
        <div className={styles.orderBottomLine}>{getBottomText()}</div>
    </div>
}

function mapOrders (orders, users) {
    return [...Object.entries(orders || {}).map(([orderId, orderData])=>({
        id: orderId,
        users: Object.keys(orderData?.data || {}).map(userId=>users?.[userId]?.name),
        ...orderData
    }))].reverse()
}

export default MainScreen
