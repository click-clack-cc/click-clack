import axios from 'axios'

const url = 'https://click-clack.cc:5000/api/keyboards/'

class keyboardService {
    static getKeyboards (user) {
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

    static getNewKeyboards (method) {
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

    static getKeyboard (id) {
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

    static newKeyboard (id, keyboard, token) {
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

    static updateKeyboard (id, keyboard, token) {
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

    static deleteKeyboard (id, keyboard, token) {
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

    static comment (id, keyboard, text, token) {
        return new Promise((resolve, reject) => {
            try {
                axios.post(url + '/comment',
                    {
                        id,
                        keyboard,
                        text
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

    static heart (id, keyboard, token) {
        return new Promise((resolve, reject) => {
            try {
                axios.post(url + '/heart',
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

export default keyboardService
