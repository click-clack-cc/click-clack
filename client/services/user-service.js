import axios from 'axios'
require('dotenv').config()

const url = process.env.API_URL + 'users/'

class userService {
    static logIn (username, password) {
        return new Promise((resolve, reject) => {
            axios.post(url + 'login', {
                id: username,
                password
            }).then((res) => {
                const data = res.data
                data.createdAt = new Date(data.createdAt)
                resolve(
                    data
                )
            }).catch((error) => {
                reject(error)
            })
        })
    }

    static signUp (id, email, firstname, lastname, password) {
        return new Promise((resolve, reject) => {
            axios.post(url + 'register', {
                id,
                email,
                firstname,
                lastname,
                password
            }).then((res) => {
                const data = res.data
                resolve(
                    data
                )
            }).catch((error) => {
                reject(error)
            })
        })
    }

    static getUser (id) {
        return new Promise((resolve, reject) => {
            axios.get(url, {
                params: {
                    id
                }
            }).then((res) => {
                const data = res.data[0]
                data.createdAt = new Date(data.createdAt)
                resolve(
                    data
                )
            }).catch((error) => {
                reject(error)
            })
        })
    }

    static resolveId (id) {
        return new Promise((resolve, reject) => {
            axios.get(url + 'resolveid', {
                params: {
                    id
                }
            }).then((res) => {
                const data = res.data[0]
                data.createdAt = new Date(data.createdAt)
                resolve(
                    data
                )
            }).catch((error) => {
                reject(error)
            })
        })
    }

    static getNewUsers () {
        return new Promise((resolve, reject) => {
            axios.get(url + 'new', {}).then((res) => {
                const data = res.data
                resolve(
                    data.map(user => ({
                        ...user,
                        createdAt: new Date(user.createdAt)
                    }))
                )
            }).catch((error) => {
                reject(error)
            })
        })
    }

    static changeId (oldid, newid, token) {
        console.log(oldid + ' ' + newid + ' ' + token)
        return axios.post(url + 'id',
            {
                id: oldid,
                newid
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
    }

    static changeUserBio (id, bio, token) {
        return axios.post(url + 'bio',
            {
                id,
                bio
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
    }

    static changeKeebs (id, keyboards, token) {
        return axios.post(url + 'keebs',
            {
                id,
                keebs: keyboards
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
    }

    static recommend (submitterid, recommendedid, recommendationtext, token) {
        return new Promise((resolve, reject) => {
            axios.post(url + 'recommend', {
                id: submitterid,
                user: recommendedid,
                text: recommendationtext
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => {
                const data = res.data
                resolve(
                    data
                )
            }).catch((error) => {
                reject(error)
            })
        })
    }

    static report (submitterid, reportedid, reporttext, token) {
        return new Promise((resolve, reject) => {
            axios.post(url + 'report', {
                id: submitterid,
                user: reportedid,
                text: reporttext
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => {
                const data = res.data
                resolve(
                    data
                )
            }).catch((error) => {
                reject(error)
            })
        })
    }

    static deleteUser (id, token) {
        return axios.post(url + '/delete',
            {
                id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
    }

    static validateUsername (publicUserName) {
        return new Promise((resolve, reject) => {
            try {
                axios.get(url + 'validateUsername', {
                    params: {
                        id: publicUserName
                    }
                }).then((res) => {
                    resolve(
                        res.data
                    )
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    static changeLastname (id, lastname, token) {
        return axios.post(url + 'lastname',
            {
                id,
                lastname
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
    }

    static changeFirstname (id, firstname, token) {
        return axios.post(url + 'firstname',
            {
                id,
                firstname
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
    }
}

export default userService
