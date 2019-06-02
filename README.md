
### idle-tabs

A utility module for tracking user activity on different tabs of same website, with keepalive event, can be used for maintaining sessions where there is token based authentication to preserve or notify users.

> For simple user event tracking use [idle-js](https://github.com/soixantecircuits/idle-js) instead.

**Usage**

> npm i idle-tabs

```js
import  idleTabs from 'idle-tabs';
//or
// import { idleTabs } from 'idle-tabs' 

//optiins example with default values
const configs = {
  idleTime: 2,
  debug: false,
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
  storePrefix: 'mysite', // string sufix to localstorage key
};

const idle = idleTabs(configs, window, document);

idle.start()

// later on somewhere else
  var a = idleTabs(); // returns same instance always
  a.start();


  var a = idleTabs();
  a.reset();


  var a = idleTabs();
  a.stop();

```
**IdleClass**

IdleClass is exported and can be used to initialize or extend it.

```js
import { IdleClass } from 'idle-tabs'

var idle = new IdleClass({})

```