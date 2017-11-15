const expect = require('chai').expect
const Vue = require('vue')
const Vuex = require('vuex')
const uuid = require('uuid')
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
describe("Should create correct vuex object", function() {
  it('first test', function() {
    expect(true).to.be.eq(true)
  })
  it('create native vuex object', function() {
    $store = new Vuex.Store(OriginVuexDes)
    expect(0).to.be.eq($store.getters.o_count)
  })
})