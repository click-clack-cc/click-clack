import axios from 'axios'

const url = 'https://click-clack.cc:5000/api/img/'

class imgService {
    static uploadProfileImage (id, img, token) {
        const formData = new FormData()
        formData.append('id', id)
        formData.append('image', img, `${id}.jpg`)
        return new Promise((resolve, reject) => {
            return axios.post(url + 'upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
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

    static uploadKeyboardImages (id, keyboard, imageNames, images, token) {
        const formData = new FormData()
        formData.append('id', id)
        formData.append('keyboard', keyboard)
        for (let i = 0; i < images.length; i++) {
            formData.append('image', images[i], imageNames[i])
        }
        return new Promise((resolve, reject) => {
            return axios.post(url + 'keebphotos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
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
}

export default imgService
