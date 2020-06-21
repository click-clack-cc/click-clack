import { http } from "./index";

const url = '/keyboards'

class keyboardService {
    static async getKeyboards (user) {
      const { data } = await http.get(`${url}/u`, { params: { user }});
      return data.map(keyboard => ({ ...keyboard, createdAt: new Date(keyboard.createdAt), lastModified: new Date(keyboard.lastModified) }));
    }

    static async getNewKeyboards (method) {
      const { data } = await http.get(`${url}/${method}`);
      return data.map(keyboard => ({
          ...keyboard,
          createdAt: new Date(keyboard.createdAt),
          lastModified: new Date(keyboard.lastModified)
        })
      );
    }

    static async getKeyboard (id) {
      const { data: [keyboard] } = await http.get(`${url}/id`, { params: { id }});
      return { ...keyboard, createdAt: new Date(keyboard.createdAt), lastModified: new Date(keyboard.lastModified) };
    }

    static async newKeyboard (id, edit, keyboard, token) {
        const { data: [kb] } = await http.post(`${url + (edit?"/update":"")}`, { id, keyboard }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return kb;
    }

    static async deleteKeyboard (id, keyboard, token) {
      const { data: [kb] } = await http.post(`${url}/delete`, { id, keyboard }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return kb;
    }

    static async comment (id, keyboard, text, token) {
      const { data: [kb] } = await http.post(`${url}/comment`, { id, keyboard, text }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return kb;
    }

    static async heart (id, keyboard, token) {
      const { data: [kb] } = await http.post(`${url}/heart`, { id, keyboard }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return kb;
    }
}

export default keyboardService
