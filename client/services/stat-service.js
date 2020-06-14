import { http } from "./index";

const url = '/stats'

class statService {
    static async getStats (id) {
      const { data } = await http.get(url, { params: { id } });
      return data.map(stat => ({ ...stat, createdAt: new Date(stat.createdAt) }));
    }

    static async getTop () {
      const { data } = await http.get(`${url}/leaderboard`);
      return data;
    }

    static insertStat (id, stat, token) {
      return http.post(url, { id, stat }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
}

export default statService
