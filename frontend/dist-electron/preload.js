const { ipcRenderer: r, contextBridge: i } = require("electron");
i.exposeInMainWorld("ipcRenderer", {
  on(...n) {
    const [e, o] = n;
    return r.on(e, (t, ...c) => o(t, ...c));
  },
  off(...n) {
    const [e, ...o] = n;
    return r.off(e, ...o);
  },
  send(...n) {
    const [e, ...o] = n;
    return r.send(e, ...o);
  },
  invoke(...n) {
    const [e, ...o] = n;
    return r.invoke(e, ...o);
  }
});
