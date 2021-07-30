import axios from 'axios'
import {BASE_URL} from "../config/apiConfig";
import moment from "moment";

const api = axios.create({
    baseURL: BASE_URL,
})

function get (url) {
    return api.get(url).then(r=>r?.data)
}

function remove (url) {
    return api.delete(url).then(r=>r?.data)
}

function post (url, data) {
    return api.post(url, data).then(r=>r?.data)
}

function put (url, data) {
    return api.put(url, data).then(r=>r?.data)
}

const API = {
    addUser: (name) => {
        const data = {
            name: name,
            favorites: null
        }

        return post('/users.json', data)
    },

    getUsersList: () => {
      return get('/users.json')
    },

    getProductsList: () => {
        return get('/products.json')
    },

    getOrdersList: () => {
        return get('/orders.json')
    },

    addProduct: (name) => {
        return post('/products.json', {name})
    },

    initiateOrder: (date = moment().format('DD.MM.YYYY')) => {
        const data = {
            isClosed: false,
            date: date,
            data: {}
        }
        return post('/orders.json', data)
    },

    editProductAmount: async (orderId, userId, productId, amount=1) => {
        if (amount === 0)
            return this.removeUserProduct(orderId, userId, productId)

        return put(`/orders/${orderId}/data/${userId}/${productId}.json`, amount)
    },

    removeUserProduct: (orderId, userId, productId) => {
        return remove(`/orders/${orderId}/data/${userId}/${productId}.json`)
    }

}

export default API
