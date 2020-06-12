import axios from 'axios'

const url = 'https://click-clack.cc:5000/api/announcements/'

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
