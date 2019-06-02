import IdleClass from './IdleTabs';

let idleInstance;
const idleTabs = (config, $win, $doc) => {
  if (!(idleInstance instanceof IdleClass)) {
    idleInstance = new IdleClass(config, $win, $doc);
  }
  return idleInstance;
}


export { idleTabs, idleTabs as default, IdleClass };