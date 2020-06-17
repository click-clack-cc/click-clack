import { http } from "./index";

const keyboardsurl = '/keyboards/search'
const usersurl = '/users/search'
const listingsurl = '/listings/search'

class searchService {
    static async search (searchtext) {
      if (searchtext.length < 1) return; // Could be moved to the component or backend validation?

      const usersReq = http.get(usersurl, { params: { text: searchtext }});
      const keyboardsReq = http.get(keyboardsurl, { params: { text: searchtext }});
      const listingsReq = http.get(listingsurl, { params: { text: searchtext }});

      const [ { data: usersRes }, { data: keyboardsRes }, {data: listingsRes} ]
          = await Promise.all([ usersReq, keyboardsReq, listingsReq ]); // Retrieves the 'data' property of the Promise.all array
      return { users: usersRes, keyboards: keyboardsRes, listings: listingsRes };
    }
}

export default searchService
