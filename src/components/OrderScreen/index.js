import React, {useContext, useState} from "react";
import Header, {HeaderButton} from "../core/Header";
import {Route, useHistory, useParams} from 'react-router-dom'
import DataContext from "../../data";
import {getLocalDate, sumObjectsByKey} from "../../utils";
import styles from './styles.module.css'
import SlideUpModal from "../core/SlideUpModal";
import {ToDoDoLi} from "../../api";

const OrderScreen = ({...props}) => {
    const {id} = useParams()
    const history = useHistory()
    const {orders, users, products} = useContext(DataContext)
    const [isUserSelectModalOpen, setUserSelectModalOpen] = useState(false)
    const [isProductSelectModalOpen, setProductSelectModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [isDoneModalOpen, setDoneModalOpen] = useState(false)

    function onEditUsersOrder (userId) {
        setSelectedUser(userId)
        setProductSelectModalOpen(true)
    }

    const doneButtonDisabled = !orders[id]?.data || Object.keys(orders[id]?.data || {})?.length === 0

    function onUserSelected (userId) {
        setSelectedUser(userId)
        setUserSelectModalOpen(false)
        setTimeout(()=>{
            setProductSelectModalOpen(true)
        }, 300)
    }

    function onProductModalClose() {
        setSelectedUser(null)
        setProductSelectModalOpen(false)
        setUserSelectModalOpen(false)
    }
    const currentOrder = orders[id] || {}

    const userIds = Object.keys(currentOrder.data || {})

    function goBack() {
        history.goBack()
    }
    return <div>
       <UserSelect onClose={()=>setUserSelectModalOpen(false)} isOpen={isUserSelectModalOpen} onSelectUser={onUserSelected}/>
        <OrderDoneModal isOpen={isDoneModalOpen} onClose={()=>setDoneModalOpen(false)}/>
        <ProductSelectModal isOpen={isProductSelectModalOpen} userId={selectedUser} onAddOrDeleteProduct={()=>{}} onClose={onProductModalClose}/>
        <Header title={getLocalDate(orders[id]?.date)}
                goBack={goBack}
                rightButton={{label: 'Заказать!', onPress:()=>setDoneModalOpen(true), disabled: doneButtonDisabled}}
        />
        <div className={styles.content}>
            {!currentOrder.data ? <EmptyState onStart={()=>setUserSelectModalOpen(true)}/> :
                <div>
                    {userIds?.map(userId=><UserListItem userId={userId} key={userId} onClick={()=>onEditUsersOrder(userId)}/>)}
                    <HeaderButton label={'Ещё не все заказали!'} height={50} onClick={()=>{setUserSelectModalOpen(true)}}/>
                </div>
            }
        </div>
    </div>
}

const EmptyState = ({onStart=()=>{}}) => {
    return <div className={styles.emptyStateContainer}>
        <div className={styles.emptyStateIconAndText}>
            <i className={'fas fa-utensils'}/>
            <div>Такс... Ну, кто чего хочет из Ленты?</div>
        </div>
        <HeaderButton label={'Начать!'} height={50} onClick={onStart}/>
    </div>
}

const UserSelect = ({isOpen, onClose, onSelectUser=()=>{}}) => {

    const {id} = useParams()


    const [search, setSearch] = useState('')

    const {users, addUser, orders} = useContext(DataContext)

    const alreadyOrderedUsers = Object.keys(orders?.[id]?.data || {}) || []

    async function onAdd () {
        await addUser(search)
        setSearch('')

    }

    function getUsers() {
        return Object.entries(users || {}).map(([id, user])=>({
            id,
            ...user
        })).filter(({name, id})=>{
            if (alreadyOrderedUsers.includes(id)) return false
            if (search == '') return true

            return name?.toLowerCase().includes(search?.toLowerCase())
        })
    }

    return <SlideUpModal isOpen={isOpen} onClose={onClose}>
        <ModalHeader title={'Кому?'}/>
        <SearchBar value={search} onChange={setSearch} placeholder={'Имя...'}/>
        <div className={styles.list}>
            {getUsers().map(user => <User name={user.name} onClick={()=>onSelectUser(user.id)}/>)}
            {search !== '' && <AddItem name={search} onClick={onAdd}/>}
        </div>
        <div/>
    </SlideUpModal>
}

const User = ({name, onClick}) => {
    return <div className={styles.userItem} onClick={onClick}>{name}</div>
}

const AddItem = ({name, onClick}) => {
    return <div className={styles.userItem}
                style={{border: 'none', color: '#1A4D9E'}}
                onClick={onClick}
    >{`Добавить "${name}"`}</div>
}

const ModalHeader = ({title, button}) => {
    return <div className={styles.modalHeader}>
        <div>{title}</div>
        {button?.label && <div><HeaderButton onClick={button.onPress} label={button.label}/></div>}
    </div>
}

const SearchBar = ({value, onChange, placeholder}) => {
    return <input className={styles.searchBar} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>
}

const ProductSelectModal = ({isOpen, userId, onClose}) => {
    const [search, setSearch] = useState('')
    const {users, products, addProduct, orders, addToCart} = useContext(DataContext)
    const user = users?.[userId]

    const {id} = useParams()

    function getCart () {
        try {
            const cart = orders[id].data[userId]
            return Object.entries(cart || {}).map(([id, amount])=>({id, amount, name: products[id].name})) || []

        } catch (e) {}
    }

    const onAdd = async () => {
        await addProduct(search)
        setSearch('')
    }
    const getProducts = () => {
        return Object.entries(products || {}).map(([id, product])=>({id, ...product})).filter(({name})=>{
            if (search == '') return true

            return name?.toLowerCase().includes(search?.toLowerCase())
        })
    }

    async function onAddToCart (productId, amount) {
        await addToCart(id, userId, productId, amount)
    }

    const cart = getCart()

    return <SlideUpModal isOpen={isOpen}>
        <ModalHeader title={user?.name} button={{label: 'Готово', onPress: onClose}}/>
        <SearchBar value={search} onChange={setSearch} placeholder={'Товар...'}/>
        <div className={styles.list}>
            {cart?.length > 0 && <div className={styles.section}>{'В корзине:'}</div>}
            {cart?.map(product=> <Product name={product.name} isInCart={true} onAmountChange={(n)=>onAddToCart(product.id, n)} amount={product.amount}/>)}
            <div className={styles.section}>{'Ещё не в корзине:'}</div>
            {getProducts().map(product => <Product name={product.name} onAmountChange={()=>onAddToCart(product.id, 1)}/>)}
            {search !== '' && <AddItem name={search} onClick={onAdd}/>}
        </div>
        <div/>
    </SlideUpModal>
}

const Product = ({name, amount, onAmountChange, isInCart=false}) => {

    if (!isInCart) return <div className={styles.userItem} onClick={()=>onAmountChange(1)}>{name}</div>

    return <div className={styles.productItem}>
        <div>{amount+' x '+ name}</div>
        <div className={styles.productControllers}>
            <HeaderButton label={<i className={'fas fa-minus'}/>} isProductButton onClick={()=>onAmountChange(amount - 1)}/>
            <HeaderButton label={<i className={'fas fa-plus'}/>} isProductButton onClick={()=>onAmountChange(amount + 1)}/>
        </div>
    </div>
}

const UserListItem = ({userId, onClick=()=>{}}) => {
    const {id} = useParams()
    const {orders, users, products} = useContext(DataContext)

    function getCart () {
        try {
            const cart = orders[id].data[userId]
            return Object.entries(cart || {}).map(([id, amount])=>({id, amount, name: products[id].name})) || []

        } catch (e) {
            alert(e)
        }
    }

    const cart = getCart()

    return <div className={styles.orderItem} onClick={onClick}>
        <div className={styles.orderHeader}>
            {users?.[userId]?.name}
        </div>
        <div className={styles.orderList}>
            {cart.map(({amount, name})=><div>{amount+' x '+name}</div>)}
        </div>
    </div>
}

const OrderDoneModal = ({isOpen, onClose}) => {
    const {id} = useParams()
    const {orders, products, closeOrder} = useContext(DataContext)

    async function createToDoList () {
        const response = await ToDoDoLi.createList(`Список от ${orders[id].date}`)
        if (response.name) {
            const total = getTotal()
            const promises = total.map((item)=>{
               return ToDoDoLi.addTask(response.name, `${item.amount} x ${item.name}`)
            })
            Promise.all(promises).then(()=>{
                const win = window.open("https://tododoli.github.io/#/"+response.name, "_blank");
                win.focus();
                closeOrder && closeOrder(id)
            })
        }
    }

    function getTotal () {
        const orderData = orders[id]?.data
        const arrayOfCarts = Object.entries(orderData || {}).map(([userId, cart])=>({
            ...cart
        }))

        const totalObj = sumObjectsByKey(...arrayOfCarts)
        return Object.entries(totalObj || {}).map(([id, amount])=>({name: products[id].name, amount}))
    }


    return <SlideUpModal isOpen={isOpen} onClose={onClose}>
        <ModalHeader title={'Ого, сколько всего!'}/>
        <div className={styles.list}>
            <div style={{height: 16}}/>
            <div className={styles.orderItem}>
                <div className={styles.orderList}>
                    {getTotal().map(({amount, name}) => <div>{amount + ' x ' + name}</div>)}
                </div>
            </div>
            <HeaderButton label={'Экспорт в ToDoDoLi'} onClick={createToDoList} height={50}/>
        </div>
    </SlideUpModal>
}

export default OrderScreen
