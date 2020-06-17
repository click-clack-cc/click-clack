import { http } from "./index";

const url = '/listings'

class listingService {
    static async getListings (user) {
        const { data } = await http.get(`${url}/u`, { params: { user }});
        return data.map(listing => ({ ...listing, createdAt: new Date(listing.createdAt), lastModified: new Date(listing.lastModified) }));
    }
    static async getOwn (user) {
        const { data } = await http.get(`${url}/own`, { params: { user }});
        return data.map(listing => ({ ...listing, createdAt: new Date(listing.createdAt), lastModified: new Date(listing.lastModified) }));
    }

    static async getNewListings (method) {
        const { data } = await http.get(`${url}/${method}`);
        return data.map(listing => ({
                ...listing,
                createdAt: new Date(listing.createdAt),
                lastModified: new Date(listing.lastModified)
            })
        );
    }

    static async getFilteredListings (filter) {
        const { data } = await http.post(`${url}/filter`,  filter );
        return data.map(listing => ({
                ...listing,
                createdAt: new Date(listing.createdAt),
                lastModified: new Date(listing.lastModified)
            })
        );
    }

    static async getListing (id) {
        const { data: [lt] } = await http.get(`${url}/id`, { params: { id }});
        return { ...lt, createdAt: new Date(lt.createdAt), lastModified: new Date(lt.lastModified) };
    }

    static async newListing (id, edit, listing, token) {
        const { data: [lt] } = await http.post(`${url + (edit?"/update":"")}`, { id, listing }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return lt;
    }

    static async deleteListing (id, listing, token) {
        const { data: [lt] } = await http.post(`${url}/delete`, { id, listing }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return lt;
    }
}

export default listingService
