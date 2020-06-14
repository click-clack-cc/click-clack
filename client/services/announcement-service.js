import { http } from './index'

const url = '/announcements'

class announcementService {
    static async getAnnouncements () {
      const { data } = await http.get(url)
      return data.map(announcement => ({ ...announcement, createdAt: new Date(announcement.createdAt) }))
    }
}

export default announcementService
