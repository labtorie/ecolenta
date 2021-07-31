import React, {createContext, useState} from 'react'
import API from "../api";


const stateShape = {
    products: {},
    users: {},
    orders: {},
    isLoaded: false,
}

const actionsShape = {
    addUser(){},
    addProduct(){},
}
export function useAppData () {
    const [state, setState] = useState(stateShape)

    const methods = {
        getUsers: async () => {
            const users = await API.getUsersList()
            setState(prevState => ({
                ...prevState,
                users
            }))
        },
        getProducts: async () => {
            const products = await API.getProductsList()
            setState(prevState => ({
                ...prevState,
                products
            }))
        },
        getOrders: async () => {
            const orders = await API.getOrdersList()
            setState(prevState => ({
                ...prevState,
                orders
            }))
        },
        fetchAll: async () => {
            await methods.getProducts()
            await methods.getOrders()
            await methods.getUsers()
            setState(prevState => ({
                ...prevState,
                isLoaded: true
            }))
        },
        addUser: async (userName) => {
            await API.addUser(userName).then(methods.getUsers)
        },
        addProduct: async (productName) => {
            await API.addProduct(productName).then(methods.getProducts)
        },
        initiateOrder: async (date) => {
            await API.initiateOrder(date).then(methods.getOrders)
        }

    }
    window.data={...state, ...methods}

    return {...state, ...methods}
}

const DataContext = createContext({...stateShape, ...actionsShape})

export default DataContext
