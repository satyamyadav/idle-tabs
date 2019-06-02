'use strict'

import store from './store';

const addEventListeners = (object, events, callback) => {
  events.forEach((event) => {
    object.addEventListener(event, callback)
  })
}

const removeEventListeners = (object, events, callback) => {
  events.forEach((event) => {
    object.removeEventListener(event, callback)
  })
}

class IdleTabs {
  constructor(options, $window, $document) {
    this.$document = $document;
    this.$window = $window;
    this.defaults = {
      idleTime: 20, // idle time in minutes
      events: ['mousemove', 'keydown', 'mousedown', 'touchstart'], // events that will trigger the idle resetter
      onIdle: () => { }, // callback function to be executed after idle time
      onActive: () => { }, // callback function to be executed after back form idleness
      onAlive: () => { }, // callback function to be executed after back form idleness
      onHide: () => { }, // callback function to be executed when this.$window become hidden
      onShow: () => { }, // callback function to be executed when this.$window become visible
      keepTracking: true, // set it to false of you want to track only once
      keepAlive: true,
      startAtIdle: false, // set it to true if you want to start in the idle state
      recurIdleCall: false,
      storePrefix: 'idleTabs', // string sufix to localstorage key
    }
    this.config = { ...this.defaults, ...options }
    this.config.idle = this.config.idleTime * 60 * 1000; // convert into ms
    this.config.keepAliveTime = (this.config.idleTime - 1) * 60 * 1000; // convert into ms
    this.idle = this.config.startAtIdle
    this.visible = !this.config.startAtIdle
    this.visibilityEvents = ['visibilitychange', 'webkitvisibilitychange', 'mozvisibilitychange', 'msvisibilitychange']
    this.lastId = null;
    this.aliveId = null;
    this.store = store;
    this.storeKey = `${this.config.storePrefix}`;
  }

  notify(msg) {
    if (this.config.debug) {
      console.log(this.config.storePrefix, 'IdleTabs: ', Date().slice(16, 25), this.config.idle / (1000 * 60), msg);
    }
  }

  isExpired() {
    const now = Date.now();
    const lastActive = this.store.get(this.storeKey);
    const timeleft = lastActive + this.config.idle;
    const diff = timeleft - now;
    const isTimeout = diff < 0;
    return isTimeout;
  }

  getIdleTime(duration) {
    const now = Date.now();
    const lastActive = store.get(this.storeKey) || now;
    const remainingTime = (duration - (now - parseInt(lastActive)));
    return remainingTime;
  }

  resetTimeout(id, config) {
    let now = Date.now();
    this.store.set(this.storeKey, now);
    if (this.idle) {
      config.onActive.call()
      this.notify('active')
      this.idle = false
    }
    clearTimeout(id)
    if (this.config.keepTracking) {
      return this.timeout(this.config)
    }
  }

  check() {
    if (this.idle) {
      return;
    }
    const isTimeout = this.isExpired();
    if (isTimeout) {
      this.idle = true
      this.config.onIdle.call();
      this.notify('ideal');
    } else {
      clearTimeout(this.lastId);
      this.lastId = this.timeout();
    }
  }

  timeout() {
    var timer = (this.config.recurIdleCall) ? setInterval : setTimeout
    var id;
    timer.bind(this);
    id = timer(() => {
      this.check()
    }, this.getIdleTime(this.config.idle))
    return id
  }

  keepAlive(id) {
    if (this.config.keepAlive) {
      if (this.idle) {
        clearTimeout(id);
      } else {
        this.aliveId = setTimeout(() => {
          this.config.onAlive.call();
          this.notify('alive');
          this.keepAlive(this.aliveId);
        }, this.config.keepAliveTime)
      }
    }
  }

  reset() {
    this.keepAlive();
    this.lastId = this.resetTimeout(this.lastId, this.config)
    this.notify('Reset')
  }

  stop() {
    const timer = (this.config.recurIdleCall) ? clearInterval : clearTimeout
    removeEventListeners(this.$window, this.config.events, () => { });
    removeEventListeners(this.$document, this.visibilityEvents, () => { });
    timer(this.lastId);
    clearTimeout(this.aliveId);
    this.notify('Stoped');
  }

  start() {
    this.keepAlive();
    this.notify("initialized");
    this.lastId = this.timeout(this.config)
    addEventListeners(this.$window, this.config.events, () => {
      this.lastId = this.resetTimeout(this.lastId, this.config)
    })
    if (this.config.onShow || this.config.onHide) {
      addEventListeners(this.$document, this.visibilityEvents, () => {
        if (this.$document.hidden || this.$document.webkitHidden || this.$document.mozHidden || this.$document.msHidden) {
          if (this.visible) {
            this.visible = false
            this.config.onHide.call()
            this.notify('hidden')
          }
        } else {
          if (!this.visible) {
            this.visible = true
            this.config.onShow.call()
            this.notify('visible')
          }
        }
      })
    }
  }
}

export default IdleTabs
