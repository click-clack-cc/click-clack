const url = '/announcements'

export default class AnnouncementService {
	http = null
	constructor (axios) {
		this.http = axios
	}

	async getAnnouncements () {
		const { data } = await this.http.get(url)
		return data.map(announcement => ({ ...announcement, createdAt: new Date(announcement.createdAt) }))
	}

	static async sendAnnouncement (id, text, token) {
		const { data: [msg] } = await this.http.post(`${url}/`, { id, text }, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
		return msg
	}
}
