import {http} from "./index";

const url = '/users/'

class userService {
    static async logIn(username, password) {
        const {data} = await http.post(`${url}/login`, {id: username, password})
        return {...data, createdAt: new Date(data.createdAt)}
    }

    static async signUp(id, email, firstname, password) {
        const {data} = await http.post(`${url}/register`, {
            id,
            email,
            firstname,
            password
        })

        return data;
    }

    static async getUser(id) {
        const {data: [user]} = await http.get(url, {params: {id}})
        return {...user, createdAt: new Date(user.createdAt)}
    }

    static async resolveId(id) {
        const {data: [user]} = await http.get(`${url}/resolveid`, {params: {id}})
        return {...user, createdAt: new Date(user.createdAt)}
    }

    static async getNewUsers() {
        const {data} = await http.get(`${url}/new`)
        return data.map(user => ({...user, createdAt: new Date(user.createdAt)}))
    }

    static async changeId(oldid, newid, token) {
        return http.post(url + 'id', {id: oldid, newid}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    static async changeUserBio(id, bio, token) {
        return http.post(url + 'bio', {id, bio}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    static async changeKeebs(id, keyboards, token) {
        return http.post(url + 'keebs', {id, keebs: keyboards}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    static async recommend(submitterid, recommendedid, recommendationtext, token) {
        const {data} = await http.post(`${url}/recommend`, {
            id: submitterid,
            user: recommendedid,
            text: recommendationtext
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return data;
    }

    static async report(submitterid, reportedid, reporttext, token) {
        const {data} = await http.post(url + 'report', {
            id: submitterid,
            user: reportedid,
            text: reporttext
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return data;
    }

    static deleteUser(id, token) {
        console.log()
        return http.post(url + 'delete', {id}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    static async validateUsername(publicUserName) {
        const {data} = await http.get(`${url}/validateUsername`, {params: {id: publicUserName}})
        return data;
    }

    static changeLastname(id, lastname, token) {
        return http.post(url + 'lastname', {id, lastname}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    static changeFirstname(id, firstname, token) {
        return http.post(url + 'firstname', {id, firstname}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
}

export default userService
