import { http } from './index'

const url = '/announcements'

class announcementService {
    static async getAnnouncements () {
      const { data } = await http.get(url)
      return data.map(announcement => ({ ...announcement, createdAt: new Date(announcement.createdAt) }))
    }

    static async sendAnnouncement (id, text, token) {
        const { data: [msg] } = await http.post(`${url}/`, { id, text }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return msg;
    }
}

export default announcementService
