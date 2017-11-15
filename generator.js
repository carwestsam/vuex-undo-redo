let shm = undefined
class StateHistoryMgr {
  constructor () {
    this.history = []
    this.origin = {}
    this.historyPt = 0 // next position
  }
  static getInstance () {
    if (typeof shm == 'undefined') {
      shm = new StateHistoryMgr()
    }
    return shm
  }
  addRawMutation(origin, key, raw) {
    this.origin[key] = raw

    origin.mutations[key] = function() {
      shm.append(key, arguments)
      raw().forward.apply(null, arguments)
    }
  }

  append(key, args) {
    if (this.history.length > 0 && this.history.length > this.historyPt){
      this.history = this.history.slice(0, this.historyPt)
    } 
    this.history.push({
      mutation: key,
      args
    })
    this.historyPt += 1
  }

  emptyHistoryPointer() {
    this.historyPt = 0
    this.history = []
  }

  resetHistoryPointer() {
  }

  undo () {
    if (this.historyPt === 0) {
      return
    }

    let {mutation, args} = this.history[this.historyPt - 1]
    this.origin[mutation]().backward.apply(null, args)

    this.historyPt -= 1
  }

  redo () {
    if (this.historyPt === this.history.length) {
      return
    }
    let {mutation, args} = this.history[this.historyPt]
    this.origin[mutation]().forward.apply(null, args)

    this.historyPt += 1
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
      let shm = StateHistoryMgr.getInstance()
      let func = attachObject[key]
      shm.addRawMutation(this.origin, key, func)
    }
  }
}

module.exports = {VuexConfigGenerator, StateHistoryMgr}