let shm = undefined
class StateHistoryMgr {
  constructor () {
    this.history = []
    this.origin = {}
  }
  static getInstance () {
    if (typeof shm == 'undefined') {
      shm = new StateHistoryMgr()
    }
    return shm
  }
  addRawMutation(key, raw) {
    this.origin[key] = raw
  }

  append(key, args) {
    this.history.push({
      mutation: key,
      args
    })
  }

  undo () {
    let {mutation, args} = this.history[0]
    this.origin[mutation]().backward.apply(null, args)
  }
}
shm = new StateHistoryMgr()
class VuexConfigGenerator {
  // origin = {}
  constructor (origin) {
    this.origin = origin
  }
  attachMutations (attachObject) {
    for ( let key in attachObject ){
      let func = attachObject[key]     
      let shm = StateHistoryMgr.getInstance()
      shm.addRawMutation(key, func)

      this.origin.mutations[key] = function() {
        shm.append(key, arguments)
        func().forward.apply(null, arguments)
      }
    }
  }

}

module.exports = {VuexConfigGenerator, StateHistoryMgr}