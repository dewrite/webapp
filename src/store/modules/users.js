import { signin } from '@/api/login'
import { updateModel } from '@/api/user'

const state = {
  address: '',
  network: '',
  name: '',
  title: '',
  // avatar: 'http://127.0.0.1:9000/20220424/6da7838865ce1904ccb4abfa1ec226cb.jpeg',
  avatar: './default.png',
  desc: '',
  cover: '',
  token: '',
  id: '',
  percentage: 0,
  task: "",
  roles: []
}

const mutations = {
  setPercentage: (state, v) => {
    state.percentage = v
  },
  setTask: (state, v) => {
    state.task = v
  },
  setId: (state, v) => {
    state.id = v
  },
  setAddress: (state, v) => {
    state.address = v
  },
  setNetwork: (state, v) => {
    state.network = v
  },
  setName: (state, v) => {
    state.name = v
  },
  setTitle: (state, v) => {
    state.title = v
  },
  setAvatar: (state, v) => {
    state.avatar = v
  },
  setCover: (state, v) => {
    state.cover = v
  },
  setDesc: (state, v) => {
    state.desc = v
  },
  setToken: (state, v) => {
    state.token = v
  },
}

const actions = {
  signin({ commit }, address) {
    return new Promise((resolve, reject) => {
      signin({ address }).then(response => {
        if (response.data && response.data.code === 0) {
          const { data } = response.data
          // console.log(data);
          commit('setToken', data.token)
          
          if (data.user._id) {
            commit('setId', data.user._id)
          }
          if (data.user.avatar) {
            commit('setAvatar', data.user.avatar)
          }
          if (data.user.realName) {
            commit('setName', data.user.realName)
          }
          if (data.user.title) {
            commit('setTitle', data.user.title)
          }
          if (data.user.desc) {
            commit('setDesc', data.user.desc)
          }
          if (data.user.cover) {
            commit('setCover', data.user.cover)
          }
          resolve()
        } else {
          reject(response.data)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  update({ commit }, data) {
    return new Promise((resolve, reject) => {
      updateModel( state.id , data).then(response => {
        if (response.data && response.data.code === 0) {
          // const { data } = response.data
          // console.log(data);
          // if (data.avatar) {
          //   commit('setAvatar', data.avatar)
          // }
          // if (data.name) {
          //   commit('setName', data.name)
          // }
          // if (data.title) {
          //   commit('setTitle', data.title)
          // }
          // if (data.desc) {
          //   commit('setDesc', data.desc)
          // }
          // if (data.cover) {
          //   commit('setCover', data.cover)
          // }
          resolve()
        } else {
          reject(response.data)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
