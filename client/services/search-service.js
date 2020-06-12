import axios from 'axios'
require('dotenv').config()

const keyboardsurl = process.env.API_URL + 'keyboards/search'
const usersurl = process.env.API_URL + 'users/search'

class searchService {
    static search (searchtext) {
        if (searchtext.length < 1) {
            return
        }
        return new Promise((resolve, reject) => {
            try {
                axios.all([
                    axios.get(usersurl, {
                        params: {
                            text: searchtext
                        }
                    }),
                    axios.get(keyboardsurl, {
                        params: {
                            text: searchtext
                        }
                    })
                ]).then(axios.spread((userRes, keyboardRes) => {
                    resolve({
                        users: userRes.data,
                        keyboards: keyboardRes.data
                    })
                }))
            } catch (e) {
                reject(e)
            }
        })
    }
}

export default searchService
