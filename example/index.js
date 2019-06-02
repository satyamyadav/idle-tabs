import  idleTabs from '../src/index';

const configs = {
  keepTracking: true,
  idleTime: 2,
  keepAlive: true,
  storePrefix: 'mysite',
  debug: true,
  onIdle: () => {
  },
  onShow: () => {
  },
  onActive: () => {
  },
  onAlive: () => {

  }
};

const idle = idleTabs(configs, window, document);

idle.start()

setTimeout(() => {
  var a = idleTabs(configs, window, document);
  a.start();
}, 1000);

setTimeout(() => {
  var a = idleTabs(configs, window, document);
  a.reset();
}, 2000);

setTimeout(() => {
  var a = idleTabs(configs, window, document);
  a.stop();
}, 40000);