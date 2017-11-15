const expect = require('chai').expect
const Vue = require('vue')
const Vuex = require('vuex')
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
      expect(true).to.be.eq(true);  
    })
    it('create native vuex object', function() {
      $store = new Vuex.Store(OriginVuexDes);
      expect(0).to.be.eq($store.getters.o_count)
    })
  })
})
