import { http } from "./index";

const url = '/messages'

class messageService {

    static async getMessages (id, token) {
        const { data } = await http.get(`${url}/messages`, { params: { id },
            headers: {
                Authorization: `Bearer ${token}`
            }});
        return data.map(message => ({ ...message, createdAt: new Date(message.createdAt)}));
    }

    static async getUnseenMessageCount (id, token) {
        const { data: [unseen] } = await http.get(`${url}/unseencount`, { params: { id },
            headers: {
                Authorization: `Bearer ${token}`
            }});
        return unseen?unseen.unseen:0
    }

    static async sendMessage (id, to, text, token) {
        const { data: [msg] } = await http.post(`${url}/`, { id, to, text }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return msg;
    }

    static async markSeen (id, convo, token) {
        const { data: [msg]  } = await http.post(`${url}/markseen`, { id, convo }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return msg;
    }
}

export default messageService
