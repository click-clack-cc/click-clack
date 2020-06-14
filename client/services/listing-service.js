import axios from 'axios'

const url = 'https://click-clack.cc:5000/api/listings/'

class listingService {
    static getListings (user) {
        return new Promise((resolve, reject) => {
            try {
                axios.get(url + '/u', {
                    params: {
                        user
                    }
                }).then((res) => {
                    const data = res.data
                    resolve(
                        data.map(keyboard => ({
                            ...keyboard,
                            createdAt: new Date(keyboard.createdAt),
                            lastModified: new Date(keyboard.lastModified)
                        }))
                    )
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    static getNewListings (method) {
        return new Promise((resolve, reject) => {
            try {
                axios.get(url + `/${method}`).then((res) => {
                    const data = res.data
                    resolve(
                        data.map(keyboard => ({
                            ...keyboard,
                            createdAt: new Date(keyboard.createdAt),
                            lastModified: new Date(keyboard.lastModified)
                        }))
                    )
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    static getListing (id) {
        return new Promise((resolve, reject) => {
            try {
                axios.get(url + '/id', {
                    params: {
                        id
                    }
                }).then((res) => {
                    const data = res.data[0]
                    data.createdAt = new Date(data.createdAt)
                    data.lastModified = new Date(data.lastModified)
                    resolve(
                        data
                    )
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    static newListing (id, keyboard, token) {
        return new Promise((resolve, reject) => {
            try {
                axios.post(url + '/',
                    {
                        id,
                        keyboard
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                ).then((res) => {
                    const data = res.data[0]
                    resolve(
                        data
                    )
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    static updateListing (id, keyboard, token) {
        return new Promise((resolve, reject) => {
            try {
                axios.post(url + '/update',
                    {
                        id,
                        keyboard
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                ).then((res) => {
                    const data = res.data[0]
                    resolve(
                        data
                    )
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    static deleteListing (id, keyboard, token) {
        return new Promise((resolve, reject) => {
            try {
                axios.post(url + '/delete',
                    {
                        id,
                        keyboard
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                ).then((res) => {
                    const data = res.data[0]
                    resolve(
                        data
                    )
                })
            } catch (e) {
                reject(e)
            }
        })
    }
}

export default listingService
