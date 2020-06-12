import axios from 'axios'
require('dotenv').config()

const url = process.env.API_URL + 'announcements/'

class announcementService {
    static getAnnouncements () {
        return new Promise((resolve, reject) => {
            try {
                axios.get(url, {}).then((res) => {
                    const data = res.data
                    resolve(
                        data.map(announcement => ({
                            ...announcement,
                            createdAt: new Date(announcement.createdAt)
                        }))
                    )
                })
            } catch (e) {
                reject(e)
            }
        })
    }
}

export default announcementService
