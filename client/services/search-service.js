import axios from 'axios'

const keyboardsurl = 'https://click-clack.cc:5000/api/keyboards/search'
const usersurl = 'https://click-clack.cc:5000/api/users/search'

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
