const url = '/messages'

export default class MessageService {
	http = null

	constructor (axios) {
		this.http = axios
	}

	async getMessages (id) {
		const { data } = await this.http.get(`${url}/messages`, { params: { id } })
		return data.map(message => ({ ...message, createdAt: new Date(message.createdAt) }))
	}

	async getUnseenMessageCount (id) {
		const { data: [response] } = await this.http.get(`${url}/unseencount`, { params: { id } })
		return response ? response.unseen : 0
	}

	async sendMessage (id, to, text) {
		const { data: [msg] } = await this.http.post(`${url}/`, { id, to, text })
		return msg
	}

	async markSeen (id, convo) {
		const { data: [msg] } = await this.http.post(`${url}/markseen`, { id, convo })
		return msg
	}
}
