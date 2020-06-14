import { http } from "./index";

const keyboardsurl = '/keyboards/search'
const usersurl = '/users/search'

class searchService {
    static async search (searchtext) {
      if (searchtext.length < 1) return; // Could be moved to the component or backend validation?

      const usersReq = http.get(usersurl, { params: { text: searchtext }});
      const keyboardsReq = http.get(keyboardsurl, { params: { text: searchtext }});
  
      const [ { data: usersRes }, { data: keyboardsRes } ] = await Promise.all([ usersReq, keyboardsReq ]); // Retrieves the 'data' property of the Promise.all array
      return { usersRes, keyboardsRes };
    }
}

export default searchService
