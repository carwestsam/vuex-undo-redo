const expect = require('chai').expect
const Vue = require('vue')
const Vuex = require('vuex')
const uuid = require('uuid/v4')
const _ = require('lodash')
const {VuexConfigGenerator, StateHistoryMgr} = require('../generator')
let shm = StateHistoryMgr.getInstance()

Vue.use(Vuex)

let OriginVuexDes = {
  state: {
    count: 0,
    uuid: uuid(),
    x: 0,
    y: 0
  },
  mutations: {
  },
  getters: {
    o_count: function (state) {
      return state.count
    },
    uuid: function (state) {
      return state.uuid
    },
    x: function (state) {
      return state.x
    },
    y: function (state) {
      return state.y
    }
  }
}

describe("Should record new generated values in forword, it should be visitable in backword", function () {
  GeneratedVuexDes = new VuexConfigGenerator(OriginVuexDes).attachMutations({
    move: function () {
      return {
        forward: function (capsule, state, {x, y}) {
          let id = capsule['uuid'] || uuid()
          capsule['uuid'] = state.uuid
          capsule['x'] = state.x
          capsule['y'] = state.y
          state.uuid = id
          state.x = x
          state.y = y
        },
        backward: function (capsule, state, {x, y}) {
          state.uuid = capsule['uuid']
          state.x = capsule['x']
          state.y = capsule['y']
        }
      }
    }
  })
  let $store = new Vuex.Store(OriginVuexDes)
  it ('Should record the new value generated in forward step', function () {
    let originUUID = $store.getters.uuid
    let originX = $store.x
    let originY = $store.y
    $store.commit('move', {x:2,y:3})
    expect($store.getters.x).to.be.eq(2)
    expect($store.getters.y).to.be.eq(3)
    expect($store.getters.uuid).to.be.not.eq(originUUID)
    shm.undo()
    expect($store.getters.x).to.be.eq(0)
    expect($store.getters.y).to.be.eq(0)
    expect($store.getters.uuid).to.be.eq(originUUID)
  })
})