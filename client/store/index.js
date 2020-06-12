export const state = () => ({
    user: null,
    token: null,
    zenmode: false,
    nightmode: false,
    lighttheme: 'light',
    darktheme: 'fekete',
    search: null
})

export const getters = {
    user (state) {
        return state.user
    },
    token (state) {
        return state.token
    },
    nightmode (state) {
        return state.nightmode
    },
    search (state) {
        return state.search
    },
    lighttheme (state) {
        return state.lighttheme
    },
    darktheme (state) {
        return state.darktheme
    },
    zenmode (state) {
        return state.zenmode
    }
}

export const mutations = {
    updateUser (state, user) {
        state.user = user
    },
    updateToken (state, token) {
        state.token = token
    },
    updateNightmode (state, nightmode) {
        state.nightmode = nightmode
    },
    updateSearch (state, search) {
        state.search = search
    },
    updateLighttheme (state, lighttheme) {
        state.lighttheme = lighttheme
    },
    updateDarktheme (state, darktheme) {
        state.darktheme = darktheme
    },
    updateZenmode (state, zenmode) {
        state.zenmode = zenmode
    }
}
