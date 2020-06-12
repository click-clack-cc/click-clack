import axios from 'axios'
require('dotenv').config()

const url = process.env.API_URL + 'stats/'

class statService {
    static getStats (id) {
        return new Promise((resolve, reject) => {
            try {
                axios.get(url, {
                    params: {
                        id
                    }
                }).then((res) => {
                    const data = res.data
                    resolve(
                        data.map(stat => ({
                            ...stat,
                            createdAt: new Date(stat.createdAt)
                        }))
                    )
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    static getTop () {
        return new Promise((resolve, reject) => {
            try {
                axios.get(url + 'leaderboard').then((res) => {
                    const data = res.data
                    resolve(
                        data
                    )
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    static insertStat (id, stat, token) {
        return axios.post(url,
            {
                id,
                stat
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
    }
}

export default statService
