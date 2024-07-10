console.log('preload.js loaded');

const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  require: (module) => {
    if (module === 'three') {
      return require('three');
    }
  }
});
