import { http } from "./index";

const url = '/posts'

class postService {

    static async getPosts (user) {
        const { data } = await http.get(`${url}/u`, { params: { user }});
        return data.map(post => ({ ...post, createdAt: new Date(post.createdAt), lastModified: new Date(post.lastModified) }));
    }

    static async getOwn (user) {
        const { data } = await http.get(`${url}/own`, { params: { user }});
        return data.map(post => ({ ...post, createdAt: new Date(post.createdAt), lastModified: new Date(post.lastModified) }));
    }

    static async getNewPosts (method) {
        const { data } = await http.get(`${url}/${method}`);
        return data.map(post => ({
                ...post,
                createdAt: new Date(post.createdAt),
                lastModified: new Date(post.lastModified)
            })
        );
    }

    static async heart (id, post, token) {
        const { data: [ps] } = await http.post(`${url}/heart`, { id, post }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return ps;
    }

    static async comment (id, post, text, token) {
        const { data: [ps] } = await http.post(`${url}/comment`, { id, post, text }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return ps;
    }

    static async getPost (id) {
        const { data: [lt] } = await http.get(`${url}/id`, { params: { id }});
        return { ...lt, createdAt: new Date(lt.createdAt), lastModified: new Date(lt.lastModified) };
    }

    static async newPost (id, edit, post, token) {
        const { data: [lt] } = await http.post(`${url + (edit?"/update":"")}`, { id, post }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return lt;
    }

    static async deletePost (id, post, token) {
        const { data: [lt] } = await http.post(`${url}/delete`, { id, post }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return lt;
    }
}

export default postService
