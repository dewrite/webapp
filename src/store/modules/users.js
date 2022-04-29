import { signin } from '@/api/login'
import { updateModel } from '@/api/user'
import router from '../../router'

const state = {
  address: '',
  network: '',
  name: '',
  title: '',
  // avatar: 'http://127.0.0.1:9000/20220424/6da7838865ce1904ccb4abfa1ec226cb.jpeg',
  avatar: './default.png',
  desc: '',
  cover: '',
  domain: "",
  token: '',
  id: '',
  percentage: 0,
  signature: '',
  task: "",
  roles: []
}

const mutations = {
  setPercentage: (state, v) => {
    state.percentage = v
  },
  setSignature: (state, v) => {
    state.signature = v
  },
  
  setDomain: (state, v) => {
    state.domain = v
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
  logout: (state) => {
    state.address = ''
    state.network = ''
    state.token = ''
    state.id = ''
    router.push('/')
  }
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
          if (data.user.signature) {
            commit('setSignature', data.user.signature)
          }
          if (data.user.avatar) {
            commit('setAvatar', data.user.avatar)
          }
          if (data.user.name) {
            commit('setName', data.user.name)
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
          if (data.user.domain) {
            commit('setDomain', data.user.domain)
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
