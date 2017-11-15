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

describe("Should have undo operation", function () {

  let des = _.cloneDeep(OriginVuexDes)
  new VuexConfigGenerator(des).attachMutations({
    addCount: function () {
      return {
        forward: function (capsule, state, number) {
          state.count += number
        },
        backward: function (capsule, state, number) {
          console.log('backword', capsule, state, number)
          state.count -= number
        }
      }
    }
  })
  let $store = new Vuex.Store(des)

  it('1, going forword', function() {
    $store.commit('addCount', 10)
    expect($store.getters.o_count).to.be.eq(10)
  })
  it('2, undo previous job', function () {
    shm.undo()
    expect($store.getters.o_count).to.be.eq(0)
  })
  it ('3, forward two step, and backward two step', function() {
    $store.commit('addCount', 4)
    expect($store.getters.o_count).to.be.eq(4)
    $store.commit('addCount', 5)
    expect($store.getters.o_count).to.be.eq(9)
    shm.undo()
    expect($store.getters.o_count).to.be.eq(4)
    shm.undo()
    expect($store.getters.o_count).to.be.eq(0)
  })
})
describe("should redo operation", function () {
  GeneratedVuexDes = new VuexConfigGenerator(OriginVuexDes).attachMutations({
    addCount: function () {
      return {
        forward: function (capsule, state, number) {
          state.count += number
        },
        backward: function (capsule, state, number) {
          state.count -= number
        }
      }
    }
  })
  let $store = new Vuex.Store(OriginVuexDes)

  it('undo and redo', function () {
    $store.commit('addCount', 4)
    expect($store.getters.o_count).to.be.eq(4)
    shm.undo()
    expect($store.getters.o_count).to.be.eq(0)
    shm.redo()
    expect($store.getters.o_count).to.be.eq(4)
    shm.undo()
  })

  it('undo and redo multiple, not exceed', function () {
    $store.commit('addCount', 4)
    expect($store.getters.o_count).to.be.eq(4)
    $store.commit('addCount', 5)
    expect($store.getters.o_count).to.be.eq(9)
    shm.undo()
    expect($store.getters.o_count).to.be.eq(4)
    shm.undo()
    expect($store.getters.o_count).to.be.eq(0)
    shm.undo()
    expect($store.getters.o_count).to.be.eq(0)
    shm.redo()
    expect($store.getters.o_count).to.be.eq(4)
    shm.redo()
    expect($store.getters.o_count).to.be.eq(9)
    shm.redo()
    expect($store.getters.o_count).to.be.eq(9)
  })
})