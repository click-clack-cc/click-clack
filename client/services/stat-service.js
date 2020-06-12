import axios from 'axios'

const url = 'https://click-clack.cc:5000/api/stats/'

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
