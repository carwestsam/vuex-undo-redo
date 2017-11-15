# Vuex Undo & Redo Helper

Vuex didn't have a native way to handle undo & redo actions,
which is very useful when you want to build editor like applications.

I created this helper, to generate mutaions for me. It need a new pattern to create mutations,
like db migration concept. it has forward & backword methods for each mutation.

# Example

### how to define it

```javascript

const Vue = require('vue')
const Vuex = require('vuex')
const uuid = require('uuid/v4')
// two components of this project
const {VuexConfigGenerator, StateHistoryMgr} = require('./generator')
// StateHistoryMgr is an singlton. Manage the version.
let shm = StateHistoryMgr.getInstance()

Vue.use(Vuex)

// general Vuex description
let OriginVuexDes = {
  state: {
    uuid: uuid(),
    x: 0,
    y: 0
  },
  mutations: {
  },
  getters: {
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

// update the exsiting Description
new VuexConfigGenerator(OriginVuexDes).attachMutations({
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

```

### how to use it

```javascript
// calling the store is same as original Vuex style
$store.commit('move', {x:2, y:3})

// undo

StateHistoryMgr.getInstance().undo()
// or
shm.undo()

// redo

StateHistoryMgr.getInstance().undo()
shm.redo()

```

# ToDo

- [ ] Release to NPM
- [ ] Available for multiple modules

# Requirements

Need support for ES6 and above, Code Written and tested on Vuex 3.0.1