import { http } from "./index";

const url = '/img'

class imgService {
    static async uploadProfileImage (id, img, token) {
      const formData = new FormData()
      formData.append('id', id)
      formData.append('image', img, `${id}.jpg`)

      const { data } = await http.post(`${url}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      return data;
    }

    static async uploadKeyboardImages (id, keyboard, imageNames, images, token) {
      const formData = new FormData()
      formData.append('id', id)
      formData.append('keyboard', keyboard)

      images.forEach((image, index) => {
        formData.append('image', image, imageNames[index])
      })

      const { data } = await http.post(`${url}/keebphotos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });
      return data;
    }

    static async uploadListingImages (id, listing, imageNames, images, token) {
        const formData = new FormData()
        formData.append('id', id)
        formData.append('listing', listing)

        images.forEach((image, index) => {
            formData.append('image', image, imageNames[index])
        })

        const { data } = await http.post(`${url}/listingphotos`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    }
}

export default imgService
