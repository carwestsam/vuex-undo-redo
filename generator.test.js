const expect = require('chai').expect
const Vue = require('vue')
const Vuex = require('vuex')
const {VuexConfigGenerator, StateHistoryMgr} = require('./generator')
let shm = StateHistoryMgr.getInstance()

Vue.use(Vuex)

let OriginVuexDes = {
  state: {
    count: 0
  },
  mutations: {
  },
  getters: {
    o_count: function (state) {
      return state.count
    }
  }
}

describe("Test Generator working properly", function() {
  describe("Should create correct vuex object", function() {
    it('first test', function() {
      expect(true).to.be.eq(true)
    })
    it('create native vuex object', function() {
      $store = new Vuex.Store(OriginVuexDes)
      expect(0).to.be.eq($store.getters.o_count)
    })
  })

  describe("Should have undo operation", function () {
    GeneratedVuexDes = new VuexConfigGenerator(OriginVuexDes).attachMutations({
      addCount: function () {
        return {
          forward: function (state, number) {
            state.count += number
          },
          backward: function (state, number) {
            state.count -= number
          }
        }
      }
    })
    $store = new Vuex.Store(OriginVuexDes)

    it('1, going forword', function() {
      shm.emptyHistoryPointer()
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
          forward: function (state, number) {
            state.count += number
          },
          backward: function (state, number) {
            state.count -= number
          }
        }
      }
    })
    $store = new Vuex.Store(OriginVuexDes)

    it('undo and redo', function () {
      shm.emptyHistoryPointer()
      $store.commit('addCount', 4)
      expect($store.getters.o_count).to.be.eq(4)
      shm.undo()
      expect($store.getters.o_count).to.be.eq(0)
      shm.redo()
      expect($store.getters.o_count).to.be.eq(4)
      shm.undo()
    })

    it('undo and redo multiple, not exceed', function () {
      shm.emptyHistoryPointer()
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
})
