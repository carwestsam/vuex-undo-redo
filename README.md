# Vuex Undo & Redo Helper

Vuex didn't have a native way to handle undo & redo actions,
which is very useful when you want to build editor like applications.

I created this helper, to generate mutations for me. It need a new pattern to create mutations,
like db migration concept. it has forward & backword methods for each mutation.

P.S.

This Project is an Side Outcome from another project, I'm not going to update this project unless get stars, which means this is helpful for others.

# Explain

### forward & backward

Like DB migration. Each Mutation should have this two function,
their are required. when you call \$store.commit, forward function will be called.
When shm.undo(), backward will be called. If followed with shm.redo(), forward will be call again, with previous capsule.

### capsule

created for share variables between forward & backword. Will be {} for the first forward call


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

- [ ] Release to NPM (After 2 stars)
- [ ] Examples & Live Demos (After 10 stars)
- [ ] Available for multiple modules (After 50 stars)

# Requirements

Need support for ES6 and above, Code Written and tested on Vuex 3.0.1