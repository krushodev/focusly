const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Window controls
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  fullscreen: () => ipcRenderer.send('window-fullscreen'),

  // Get window state
  getWindowState: () => ipcRenderer.invoke('get-window-state'),

  // Window event listeners
  onMaximized: callback => {
    ipcRenderer.on('window-maximized', (event, isMaximized) => callback(isMaximized));
  },
  onResized: callback => {
    ipcRenderer.on('window-resized', (event, size) => callback(size));
  },

  // Notifications
  notify: data => ipcRenderer.send('notify', data)
});
