import Ut, { app as $n, BrowserWindow as Cl, dialog as Qf } from "electron";
import vt from "fs";
import Zf from "constants";
import Kn from "stream";
import Io from "util";
import Rl from "assert";
import Z from "path";
import Kr from "child_process";
import Ol from "events";
import Jn from "crypto";
import Il from "tty";
import Jr from "os";
import At from "url";
import Nl from "zlib";
import ed from "http";
import mt from "node:path";
import { fileURLToPath as td } from "node:url";
var Re = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Fn = {}, Mt = {}, Ie = {};
Ie.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((n, r) => {
        t.push((i, o) => i != null ? r(i) : n(o)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
Ie.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const n = t[t.length - 1];
    if (typeof n != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((r) => n(null, r), n);
  }, "name", { value: e.name });
};
var ct = Zf, nd = process.cwd, xr = null, rd = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return xr || (xr = nd.call(process)), xr;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var Ns = process.chdir;
  process.chdir = function(e) {
    xr = null, Ns.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, Ns);
}
var id = od;
function od(e) {
  ct.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || n(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = r(e.chmod), e.fchmod = r(e.fchmod), e.lchmod = r(e.lchmod), e.chownSync = s(e.chownSync), e.fchownSync = s(e.fchownSync), e.lchownSync = s(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = a(e.stat), e.fstat = a(e.fstat), e.lstat = a(e.lstat), e.statSync = c(e.statSync), e.fstatSync = c(e.fstatSync), e.lstatSync = c(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(l, f, h) {
    h && process.nextTick(h);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(l, f, h, g) {
    g && process.nextTick(g);
  }, e.lchownSync = function() {
  }), rd === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(l) {
    function f(h, g, w) {
      var E = Date.now(), A = 0;
      l(h, g, function T(O) {
        if (O && (O.code === "EACCES" || O.code === "EPERM" || O.code === "EBUSY") && Date.now() - E < 6e4) {
          setTimeout(function() {
            e.stat(g, function($, B) {
              $ && $.code === "ENOENT" ? l(h, g, T) : w(O);
            });
          }, A), A < 100 && (A += 10);
          return;
        }
        w && w(O);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, l), f;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(l) {
    function f(h, g, w, E, A, T) {
      var O;
      if (T && typeof T == "function") {
        var $ = 0;
        O = function(B, q, J) {
          if (B && B.code === "EAGAIN" && $ < 10)
            return $++, l.call(e, h, g, w, E, A, O);
          T.apply(this, arguments);
        };
      }
      return l.call(e, h, g, w, E, A, O);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, l), f;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(l) {
    return function(f, h, g, w, E) {
      for (var A = 0; ; )
        try {
          return l.call(e, f, h, g, w, E);
        } catch (T) {
          if (T.code === "EAGAIN" && A < 10) {
            A++;
            continue;
          }
          throw T;
        }
    };
  }(e.readSync);
  function t(l) {
    l.lchmod = function(f, h, g) {
      l.open(
        f,
        ct.O_WRONLY | ct.O_SYMLINK,
        h,
        function(w, E) {
          if (w) {
            g && g(w);
            return;
          }
          l.fchmod(E, h, function(A) {
            l.close(E, function(T) {
              g && g(A || T);
            });
          });
        }
      );
    }, l.lchmodSync = function(f, h) {
      var g = l.openSync(f, ct.O_WRONLY | ct.O_SYMLINK, h), w = !0, E;
      try {
        E = l.fchmodSync(g, h), w = !1;
      } finally {
        if (w)
          try {
            l.closeSync(g);
          } catch {
          }
        else
          l.closeSync(g);
      }
      return E;
    };
  }
  function n(l) {
    ct.hasOwnProperty("O_SYMLINK") && l.futimes ? (l.lutimes = function(f, h, g, w) {
      l.open(f, ct.O_SYMLINK, function(E, A) {
        if (E) {
          w && w(E);
          return;
        }
        l.futimes(A, h, g, function(T) {
          l.close(A, function(O) {
            w && w(T || O);
          });
        });
      });
    }, l.lutimesSync = function(f, h, g) {
      var w = l.openSync(f, ct.O_SYMLINK), E, A = !0;
      try {
        E = l.futimesSync(w, h, g), A = !1;
      } finally {
        if (A)
          try {
            l.closeSync(w);
          } catch {
          }
        else
          l.closeSync(w);
      }
      return E;
    }) : l.futimes && (l.lutimes = function(f, h, g, w) {
      w && process.nextTick(w);
    }, l.lutimesSync = function() {
    });
  }
  function r(l) {
    return l && function(f, h, g) {
      return l.call(e, f, h, function(w) {
        m(w) && (w = null), g && g.apply(this, arguments);
      });
    };
  }
  function i(l) {
    return l && function(f, h) {
      try {
        return l.call(e, f, h);
      } catch (g) {
        if (!m(g)) throw g;
      }
    };
  }
  function o(l) {
    return l && function(f, h, g, w) {
      return l.call(e, f, h, g, function(E) {
        m(E) && (E = null), w && w.apply(this, arguments);
      });
    };
  }
  function s(l) {
    return l && function(f, h, g) {
      try {
        return l.call(e, f, h, g);
      } catch (w) {
        if (!m(w)) throw w;
      }
    };
  }
  function a(l) {
    return l && function(f, h, g) {
      typeof h == "function" && (g = h, h = null);
      function w(E, A) {
        A && (A.uid < 0 && (A.uid += 4294967296), A.gid < 0 && (A.gid += 4294967296)), g && g.apply(this, arguments);
      }
      return h ? l.call(e, f, h, w) : l.call(e, f, w);
    };
  }
  function c(l) {
    return l && function(f, h) {
      var g = h ? l.call(e, f, h) : l.call(e, f);
      return g && (g.uid < 0 && (g.uid += 4294967296), g.gid < 0 && (g.gid += 4294967296)), g;
    };
  }
  function m(l) {
    if (!l || l.code === "ENOSYS")
      return !0;
    var f = !process.getuid || process.getuid() !== 0;
    return !!(f && (l.code === "EINVAL" || l.code === "EPERM"));
  }
}
var Ps = Kn.Stream, sd = ad;
function ad(e) {
  return {
    ReadStream: t,
    WriteStream: n
  };
  function t(r, i) {
    if (!(this instanceof t)) return new t(r, i);
    Ps.call(this);
    var o = this;
    this.path = r, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var s = Object.keys(i), a = 0, c = s.length; a < c; a++) {
      var m = s[a];
      this[m] = i[m];
    }
    if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.end === void 0)
        this.end = 1 / 0;
      else if (typeof this.end != "number")
        throw TypeError("end must be a Number");
      if (this.start > this.end)
        throw new Error("start must be <= end");
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        o._read();
      });
      return;
    }
    e.open(this.path, this.flags, this.mode, function(l, f) {
      if (l) {
        o.emit("error", l), o.readable = !1;
        return;
      }
      o.fd = f, o.emit("open", f), o._read();
    });
  }
  function n(r, i) {
    if (!(this instanceof n)) return new n(r, i);
    Ps.call(this), this.path = r, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
    for (var o = Object.keys(i), s = 0, a = o.length; s < a; s++) {
      var c = o[s];
      this[c] = i[c];
    }
    if (this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.start < 0)
        throw new Error("start must be >= zero");
      this.pos = this.start;
    }
    this.busy = !1, this._queue = [], this.fd === null && (this._open = e.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
  }
}
var ld = ud, cd = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function ud(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: cd(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(n) {
    Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n));
  }), t;
}
var re = vt, fd = id, dd = sd, hd = ld, yr = Io, Ee, Mr;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (Ee = Symbol.for("graceful-fs.queue"), Mr = Symbol.for("graceful-fs.previous")) : (Ee = "___graceful-fs.queue", Mr = "___graceful-fs.previous");
function pd() {
}
function Pl(e, t) {
  Object.defineProperty(e, Ee, {
    get: function() {
      return t;
    }
  });
}
var Lt = pd;
yr.debuglog ? Lt = yr.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Lt = function() {
  var e = yr.format.apply(yr, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!re[Ee]) {
  var md = Re[Ee] || [];
  Pl(re, md), re.close = function(e) {
    function t(n, r) {
      return e.call(re, n, function(i) {
        i || Ds(), typeof r == "function" && r.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, Mr, {
      value: e
    }), t;
  }(re.close), re.closeSync = function(e) {
    function t(n) {
      e.apply(re, arguments), Ds();
    }
    return Object.defineProperty(t, Mr, {
      value: e
    }), t;
  }(re.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Lt(re[Ee]), Rl.equal(re[Ee].length, 0);
  });
}
Re[Ee] || Pl(Re, re[Ee]);
var Ne = No(hd(re));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !re.__patched && (Ne = No(re), re.__patched = !0);
function No(e) {
  fd(e), e.gracefulify = No, e.createReadStream = q, e.createWriteStream = J;
  var t = e.readFile;
  e.readFile = n;
  function n(U, y, H) {
    return typeof y == "function" && (H = y, y = null), Y(U, y, H);
    function Y(ee, I, R, P) {
      return t(ee, I, function(C) {
        C && (C.code === "EMFILE" || C.code === "ENFILE") ? Wt([Y, [ee, I, R], C, P || Date.now(), Date.now()]) : typeof R == "function" && R.apply(this, arguments);
      });
    }
  }
  var r = e.writeFile;
  e.writeFile = i;
  function i(U, y, H, Y) {
    return typeof H == "function" && (Y = H, H = null), ee(U, y, H, Y);
    function ee(I, R, P, C, D) {
      return r(I, R, P, function(N) {
        N && (N.code === "EMFILE" || N.code === "ENFILE") ? Wt([ee, [I, R, P, C], N, D || Date.now(), Date.now()]) : typeof C == "function" && C.apply(this, arguments);
      });
    }
  }
  var o = e.appendFile;
  o && (e.appendFile = s);
  function s(U, y, H, Y) {
    return typeof H == "function" && (Y = H, H = null), ee(U, y, H, Y);
    function ee(I, R, P, C, D) {
      return o(I, R, P, function(N) {
        N && (N.code === "EMFILE" || N.code === "ENFILE") ? Wt([ee, [I, R, P, C], N, D || Date.now(), Date.now()]) : typeof C == "function" && C.apply(this, arguments);
      });
    }
  }
  var a = e.copyFile;
  a && (e.copyFile = c);
  function c(U, y, H, Y) {
    return typeof H == "function" && (Y = H, H = 0), ee(U, y, H, Y);
    function ee(I, R, P, C, D) {
      return a(I, R, P, function(N) {
        N && (N.code === "EMFILE" || N.code === "ENFILE") ? Wt([ee, [I, R, P, C], N, D || Date.now(), Date.now()]) : typeof C == "function" && C.apply(this, arguments);
      });
    }
  }
  var m = e.readdir;
  e.readdir = f;
  var l = /^v[0-5]\./;
  function f(U, y, H) {
    typeof y == "function" && (H = y, y = null);
    var Y = l.test(process.version) ? function(R, P, C, D) {
      return m(R, ee(
        R,
        P,
        C,
        D
      ));
    } : function(R, P, C, D) {
      return m(R, P, ee(
        R,
        P,
        C,
        D
      ));
    };
    return Y(U, y, H);
    function ee(I, R, P, C) {
      return function(D, N) {
        D && (D.code === "EMFILE" || D.code === "ENFILE") ? Wt([
          Y,
          [I, R, P],
          D,
          C || Date.now(),
          Date.now()
        ]) : (N && N.sort && N.sort(), typeof P == "function" && P.call(this, D, N));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var h = dd(e);
    T = h.ReadStream, $ = h.WriteStream;
  }
  var g = e.ReadStream;
  g && (T.prototype = Object.create(g.prototype), T.prototype.open = O);
  var w = e.WriteStream;
  w && ($.prototype = Object.create(w.prototype), $.prototype.open = B), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return T;
    },
    set: function(U) {
      T = U;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return $;
    },
    set: function(U) {
      $ = U;
    },
    enumerable: !0,
    configurable: !0
  });
  var E = T;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return E;
    },
    set: function(U) {
      E = U;
    },
    enumerable: !0,
    configurable: !0
  });
  var A = $;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return A;
    },
    set: function(U) {
      A = U;
    },
    enumerable: !0,
    configurable: !0
  });
  function T(U, y) {
    return this instanceof T ? (g.apply(this, arguments), this) : T.apply(Object.create(T.prototype), arguments);
  }
  function O() {
    var U = this;
    oe(U.path, U.flags, U.mode, function(y, H) {
      y ? (U.autoClose && U.destroy(), U.emit("error", y)) : (U.fd = H, U.emit("open", H), U.read());
    });
  }
  function $(U, y) {
    return this instanceof $ ? (w.apply(this, arguments), this) : $.apply(Object.create($.prototype), arguments);
  }
  function B() {
    var U = this;
    oe(U.path, U.flags, U.mode, function(y, H) {
      y ? (U.destroy(), U.emit("error", y)) : (U.fd = H, U.emit("open", H));
    });
  }
  function q(U, y) {
    return new e.ReadStream(U, y);
  }
  function J(U, y) {
    return new e.WriteStream(U, y);
  }
  var Q = e.open;
  e.open = oe;
  function oe(U, y, H, Y) {
    return typeof H == "function" && (Y = H, H = null), ee(U, y, H, Y);
    function ee(I, R, P, C, D) {
      return Q(I, R, P, function(N, k) {
        N && (N.code === "EMFILE" || N.code === "ENFILE") ? Wt([ee, [I, R, P, C], N, D || Date.now(), Date.now()]) : typeof C == "function" && C.apply(this, arguments);
      });
    }
  }
  return e;
}
function Wt(e) {
  Lt("ENQUEUE", e[0].name, e[1]), re[Ee].push(e), Po();
}
var wr;
function Ds() {
  for (var e = Date.now(), t = 0; t < re[Ee].length; ++t)
    re[Ee][t].length > 2 && (re[Ee][t][3] = e, re[Ee][t][4] = e);
  Po();
}
function Po() {
  if (clearTimeout(wr), wr = void 0, re[Ee].length !== 0) {
    var e = re[Ee].shift(), t = e[0], n = e[1], r = e[2], i = e[3], o = e[4];
    if (i === void 0)
      Lt("RETRY", t.name, n), t.apply(null, n);
    else if (Date.now() - i >= 6e4) {
      Lt("TIMEOUT", t.name, n);
      var s = n.pop();
      typeof s == "function" && s.call(null, r);
    } else {
      var a = Date.now() - o, c = Math.max(o - i, 1), m = Math.min(c * 1.2, 100);
      a >= m ? (Lt("RETRY", t.name, n), t.apply(null, n.concat([i]))) : re[Ee].push(e);
    }
    wr === void 0 && (wr = setTimeout(Po, 0));
  }
}
(function(e) {
  const t = Ie.fromCallback, n = Ne, r = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rm",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((i) => typeof n[i] == "function");
  Object.assign(e, n), r.forEach((i) => {
    e[i] = t(n[i]);
  }), e.exists = function(i, o) {
    return typeof o == "function" ? n.exists(i, o) : new Promise((s) => n.exists(i, s));
  }, e.read = function(i, o, s, a, c, m) {
    return typeof m == "function" ? n.read(i, o, s, a, c, m) : new Promise((l, f) => {
      n.read(i, o, s, a, c, (h, g, w) => {
        if (h) return f(h);
        l({ bytesRead: g, buffer: w });
      });
    });
  }, e.write = function(i, o, ...s) {
    return typeof s[s.length - 1] == "function" ? n.write(i, o, ...s) : new Promise((a, c) => {
      n.write(i, o, ...s, (m, l, f) => {
        if (m) return c(m);
        a({ bytesWritten: l, buffer: f });
      });
    });
  }, typeof n.writev == "function" && (e.writev = function(i, o, ...s) {
    return typeof s[s.length - 1] == "function" ? n.writev(i, o, ...s) : new Promise((a, c) => {
      n.writev(i, o, ...s, (m, l, f) => {
        if (m) return c(m);
        a({ bytesWritten: l, buffers: f });
      });
    });
  }), typeof n.realpath.native == "function" ? e.realpath.native = t(n.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(Mt);
var Do = {}, Dl = {};
const gd = Z;
Dl.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(gd.parse(t).root, ""))) {
    const r = new Error(`Path contains invalid characters: ${t}`);
    throw r.code = "EINVAL", r;
  }
};
const $l = Mt, { checkPath: Fl } = Dl, xl = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
Do.makeDir = async (e, t) => (Fl(e), $l.mkdir(e, {
  mode: xl(t),
  recursive: !0
}));
Do.makeDirSync = (e, t) => (Fl(e), $l.mkdirSync(e, {
  mode: xl(t),
  recursive: !0
}));
const Ed = Ie.fromPromise, { makeDir: yd, makeDirSync: Ii } = Do, Ni = Ed(yd);
var et = {
  mkdirs: Ni,
  mkdirsSync: Ii,
  // alias
  mkdirp: Ni,
  mkdirpSync: Ii,
  ensureDir: Ni,
  ensureDirSync: Ii
};
const wd = Ie.fromPromise, Ll = Mt;
function _d(e) {
  return Ll.access(e).then(() => !0).catch(() => !1);
}
var Bt = {
  pathExists: wd(_d),
  pathExistsSync: Ll.existsSync
};
const on = Ne;
function vd(e, t, n, r) {
  on.open(e, "r+", (i, o) => {
    if (i) return r(i);
    on.futimes(o, t, n, (s) => {
      on.close(o, (a) => {
        r && r(s || a);
      });
    });
  });
}
function Ad(e, t, n) {
  const r = on.openSync(e, "r+");
  return on.futimesSync(r, t, n), on.closeSync(r);
}
var Ul = {
  utimesMillis: vd,
  utimesMillisSync: Ad
};
const an = Mt, pe = Z, Td = Io;
function Sd(e, t, n) {
  const r = n.dereference ? (i) => an.stat(i, { bigint: !0 }) : (i) => an.lstat(i, { bigint: !0 });
  return Promise.all([
    r(e),
    r(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, o]) => ({ srcStat: i, destStat: o }));
}
function bd(e, t, n) {
  let r;
  const i = n.dereference ? (s) => an.statSync(s, { bigint: !0 }) : (s) => an.lstatSync(s, { bigint: !0 }), o = i(e);
  try {
    r = i(t);
  } catch (s) {
    if (s.code === "ENOENT") return { srcStat: o, destStat: null };
    throw s;
  }
  return { srcStat: o, destStat: r };
}
function Cd(e, t, n, r, i) {
  Td.callbackify(Sd)(e, t, r, (o, s) => {
    if (o) return i(o);
    const { srcStat: a, destStat: c } = s;
    if (c) {
      if (Qn(a, c)) {
        const m = pe.basename(e), l = pe.basename(t);
        return n === "move" && m !== l && m.toLowerCase() === l.toLowerCase() ? i(null, { srcStat: a, destStat: c, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (a.isDirectory() && !c.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!a.isDirectory() && c.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return a.isDirectory() && $o(e, t) ? i(new Error(Qr(e, t, n))) : i(null, { srcStat: a, destStat: c });
  });
}
function Rd(e, t, n, r) {
  const { srcStat: i, destStat: o } = bd(e, t, r);
  if (o) {
    if (Qn(i, o)) {
      const s = pe.basename(e), a = pe.basename(t);
      if (n === "move" && s !== a && s.toLowerCase() === a.toLowerCase())
        return { srcStat: i, destStat: o, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !o.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && o.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && $o(e, t))
    throw new Error(Qr(e, t, n));
  return { srcStat: i, destStat: o };
}
function kl(e, t, n, r, i) {
  const o = pe.resolve(pe.dirname(e)), s = pe.resolve(pe.dirname(n));
  if (s === o || s === pe.parse(s).root) return i();
  an.stat(s, { bigint: !0 }, (a, c) => a ? a.code === "ENOENT" ? i() : i(a) : Qn(t, c) ? i(new Error(Qr(e, n, r))) : kl(e, t, s, r, i));
}
function Ml(e, t, n, r) {
  const i = pe.resolve(pe.dirname(e)), o = pe.resolve(pe.dirname(n));
  if (o === i || o === pe.parse(o).root) return;
  let s;
  try {
    s = an.statSync(o, { bigint: !0 });
  } catch (a) {
    if (a.code === "ENOENT") return;
    throw a;
  }
  if (Qn(t, s))
    throw new Error(Qr(e, n, r));
  return Ml(e, t, o, r);
}
function Qn(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function $o(e, t) {
  const n = pe.resolve(e).split(pe.sep).filter((i) => i), r = pe.resolve(t).split(pe.sep).filter((i) => i);
  return n.reduce((i, o, s) => i && r[s] === o, !0);
}
function Qr(e, t, n) {
  return `Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`;
}
var fn = {
  checkPaths: Cd,
  checkPathsSync: Rd,
  checkParentPaths: kl,
  checkParentPathsSync: Ml,
  isSrcSubdir: $o,
  areIdentical: Qn
};
const $e = Ne, xn = Z, Od = et.mkdirs, Id = Bt.pathExists, Nd = Ul.utimesMillis, Ln = fn;
function Pd(e, t, n, r) {
  typeof n == "function" && !r ? (r = n, n = {}) : typeof n == "function" && (n = { filter: n }), r = r || function() {
  }, n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Ln.checkPaths(e, t, "copy", n, (i, o) => {
    if (i) return r(i);
    const { srcStat: s, destStat: a } = o;
    Ln.checkParentPaths(e, s, t, "copy", (c) => c ? r(c) : n.filter ? Bl($s, a, e, t, n, r) : $s(a, e, t, n, r));
  });
}
function $s(e, t, n, r, i) {
  const o = xn.dirname(n);
  Id(o, (s, a) => {
    if (s) return i(s);
    if (a) return Br(e, t, n, r, i);
    Od(o, (c) => c ? i(c) : Br(e, t, n, r, i));
  });
}
function Bl(e, t, n, r, i, o) {
  Promise.resolve(i.filter(n, r)).then((s) => s ? e(t, n, r, i, o) : o(), (s) => o(s));
}
function Dd(e, t, n, r, i) {
  return r.filter ? Bl(Br, e, t, n, r, i) : Br(e, t, n, r, i);
}
function Br(e, t, n, r, i) {
  (r.dereference ? $e.stat : $e.lstat)(t, (s, a) => s ? i(s) : a.isDirectory() ? Md(a, e, t, n, r, i) : a.isFile() || a.isCharacterDevice() || a.isBlockDevice() ? $d(a, e, t, n, r, i) : a.isSymbolicLink() ? Hd(e, t, n, r, i) : a.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : a.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function $d(e, t, n, r, i, o) {
  return t ? Fd(e, n, r, i, o) : jl(e, n, r, i, o);
}
function Fd(e, t, n, r, i) {
  if (r.overwrite)
    $e.unlink(n, (o) => o ? i(o) : jl(e, t, n, r, i));
  else return r.errorOnExist ? i(new Error(`'${n}' already exists`)) : i();
}
function jl(e, t, n, r, i) {
  $e.copyFile(t, n, (o) => o ? i(o) : r.preserveTimestamps ? xd(e.mode, t, n, i) : Zr(n, e.mode, i));
}
function xd(e, t, n, r) {
  return Ld(e) ? Ud(n, e, (i) => i ? r(i) : Fs(e, t, n, r)) : Fs(e, t, n, r);
}
function Ld(e) {
  return (e & 128) === 0;
}
function Ud(e, t, n) {
  return Zr(e, t | 128, n);
}
function Fs(e, t, n, r) {
  kd(t, n, (i) => i ? r(i) : Zr(n, e, r));
}
function Zr(e, t, n) {
  return $e.chmod(e, t, n);
}
function kd(e, t, n) {
  $e.stat(e, (r, i) => r ? n(r) : Nd(t, i.atime, i.mtime, n));
}
function Md(e, t, n, r, i, o) {
  return t ? Hl(n, r, i, o) : Bd(e.mode, n, r, i, o);
}
function Bd(e, t, n, r, i) {
  $e.mkdir(n, (o) => {
    if (o) return i(o);
    Hl(t, n, r, (s) => s ? i(s) : Zr(n, e, i));
  });
}
function Hl(e, t, n, r) {
  $e.readdir(e, (i, o) => i ? r(i) : ql(o, e, t, n, r));
}
function ql(e, t, n, r, i) {
  const o = e.pop();
  return o ? jd(e, o, t, n, r, i) : i();
}
function jd(e, t, n, r, i, o) {
  const s = xn.join(n, t), a = xn.join(r, t);
  Ln.checkPaths(s, a, "copy", i, (c, m) => {
    if (c) return o(c);
    const { destStat: l } = m;
    Dd(l, s, a, i, (f) => f ? o(f) : ql(e, n, r, i, o));
  });
}
function Hd(e, t, n, r, i) {
  $e.readlink(t, (o, s) => {
    if (o) return i(o);
    if (r.dereference && (s = xn.resolve(process.cwd(), s)), e)
      $e.readlink(n, (a, c) => a ? a.code === "EINVAL" || a.code === "UNKNOWN" ? $e.symlink(s, n, i) : i(a) : (r.dereference && (c = xn.resolve(process.cwd(), c)), Ln.isSrcSubdir(s, c) ? i(new Error(`Cannot copy '${s}' to a subdirectory of itself, '${c}'.`)) : e.isDirectory() && Ln.isSrcSubdir(c, s) ? i(new Error(`Cannot overwrite '${c}' with '${s}'.`)) : qd(s, n, i)));
    else
      return $e.symlink(s, n, i);
  });
}
function qd(e, t, n) {
  $e.unlink(t, (r) => r ? n(r) : $e.symlink(e, t, n));
}
var Gd = Pd;
const Te = Ne, Un = Z, Vd = et.mkdirsSync, Wd = Ul.utimesMillisSync, kn = fn;
function Yd(e, t, n) {
  typeof n == "function" && (n = { filter: n }), n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: r, destStat: i } = kn.checkPathsSync(e, t, "copy", n);
  return kn.checkParentPathsSync(e, r, t, "copy"), zd(i, e, t, n);
}
function zd(e, t, n, r) {
  if (r.filter && !r.filter(t, n)) return;
  const i = Un.dirname(n);
  return Te.existsSync(i) || Vd(i), Gl(e, t, n, r);
}
function Xd(e, t, n, r) {
  if (!(r.filter && !r.filter(t, n)))
    return Gl(e, t, n, r);
}
function Gl(e, t, n, r) {
  const o = (r.dereference ? Te.statSync : Te.lstatSync)(t);
  if (o.isDirectory()) return nh(o, e, t, n, r);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) return Kd(o, e, t, n, r);
  if (o.isSymbolicLink()) return oh(e, t, n, r);
  throw o.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : o.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function Kd(e, t, n, r, i) {
  return t ? Jd(e, n, r, i) : Vl(e, n, r, i);
}
function Jd(e, t, n, r) {
  if (r.overwrite)
    return Te.unlinkSync(n), Vl(e, t, n, r);
  if (r.errorOnExist)
    throw new Error(`'${n}' already exists`);
}
function Vl(e, t, n, r) {
  return Te.copyFileSync(t, n), r.preserveTimestamps && Qd(e.mode, t, n), Fo(n, e.mode);
}
function Qd(e, t, n) {
  return Zd(e) && eh(n, e), th(t, n);
}
function Zd(e) {
  return (e & 128) === 0;
}
function eh(e, t) {
  return Fo(e, t | 128);
}
function Fo(e, t) {
  return Te.chmodSync(e, t);
}
function th(e, t) {
  const n = Te.statSync(e);
  return Wd(t, n.atime, n.mtime);
}
function nh(e, t, n, r, i) {
  return t ? Wl(n, r, i) : rh(e.mode, n, r, i);
}
function rh(e, t, n, r) {
  return Te.mkdirSync(n), Wl(t, n, r), Fo(n, e);
}
function Wl(e, t, n) {
  Te.readdirSync(e).forEach((r) => ih(r, e, t, n));
}
function ih(e, t, n, r) {
  const i = Un.join(t, e), o = Un.join(n, e), { destStat: s } = kn.checkPathsSync(i, o, "copy", r);
  return Xd(s, i, o, r);
}
function oh(e, t, n, r) {
  let i = Te.readlinkSync(t);
  if (r.dereference && (i = Un.resolve(process.cwd(), i)), e) {
    let o;
    try {
      o = Te.readlinkSync(n);
    } catch (s) {
      if (s.code === "EINVAL" || s.code === "UNKNOWN") return Te.symlinkSync(i, n);
      throw s;
    }
    if (r.dereference && (o = Un.resolve(process.cwd(), o)), kn.isSrcSubdir(i, o))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${o}'.`);
    if (Te.statSync(n).isDirectory() && kn.isSrcSubdir(o, i))
      throw new Error(`Cannot overwrite '${o}' with '${i}'.`);
    return sh(i, n);
  } else
    return Te.symlinkSync(i, n);
}
function sh(e, t) {
  return Te.unlinkSync(t), Te.symlinkSync(e, t);
}
var ah = Yd;
const lh = Ie.fromCallback;
var xo = {
  copy: lh(Gd),
  copySync: ah
};
const xs = Ne, Yl = Z, X = Rl, Mn = process.platform === "win32";
function zl(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((n) => {
    e[n] = e[n] || xs[n], n = n + "Sync", e[n] = e[n] || xs[n];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function Lo(e, t, n) {
  let r = 0;
  typeof t == "function" && (n = t, t = {}), X(e, "rimraf: missing path"), X.strictEqual(typeof e, "string", "rimraf: path should be a string"), X.strictEqual(typeof n, "function", "rimraf: callback function required"), X(t, "rimraf: invalid options argument provided"), X.strictEqual(typeof t, "object", "rimraf: options should be object"), zl(t), Ls(e, t, function i(o) {
    if (o) {
      if ((o.code === "EBUSY" || o.code === "ENOTEMPTY" || o.code === "EPERM") && r < t.maxBusyTries) {
        r++;
        const s = r * 100;
        return setTimeout(() => Ls(e, t, i), s);
      }
      o.code === "ENOENT" && (o = null);
    }
    n(o);
  });
}
function Ls(e, t, n) {
  X(e), X(t), X(typeof n == "function"), t.lstat(e, (r, i) => {
    if (r && r.code === "ENOENT")
      return n(null);
    if (r && r.code === "EPERM" && Mn)
      return Us(e, t, r, n);
    if (i && i.isDirectory())
      return Lr(e, t, r, n);
    t.unlink(e, (o) => {
      if (o) {
        if (o.code === "ENOENT")
          return n(null);
        if (o.code === "EPERM")
          return Mn ? Us(e, t, o, n) : Lr(e, t, o, n);
        if (o.code === "EISDIR")
          return Lr(e, t, o, n);
      }
      return n(o);
    });
  });
}
function Us(e, t, n, r) {
  X(e), X(t), X(typeof r == "function"), t.chmod(e, 438, (i) => {
    i ? r(i.code === "ENOENT" ? null : n) : t.stat(e, (o, s) => {
      o ? r(o.code === "ENOENT" ? null : n) : s.isDirectory() ? Lr(e, t, n, r) : t.unlink(e, r);
    });
  });
}
function ks(e, t, n) {
  let r;
  X(e), X(t);
  try {
    t.chmodSync(e, 438);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw n;
  }
  try {
    r = t.statSync(e);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw n;
  }
  r.isDirectory() ? Ur(e, t, n) : t.unlinkSync(e);
}
function Lr(e, t, n, r) {
  X(e), X(t), X(typeof r == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? ch(e, t, r) : i && i.code === "ENOTDIR" ? r(n) : r(i);
  });
}
function ch(e, t, n) {
  X(e), X(t), X(typeof n == "function"), t.readdir(e, (r, i) => {
    if (r) return n(r);
    let o = i.length, s;
    if (o === 0) return t.rmdir(e, n);
    i.forEach((a) => {
      Lo(Yl.join(e, a), t, (c) => {
        if (!s) {
          if (c) return n(s = c);
          --o === 0 && t.rmdir(e, n);
        }
      });
    });
  });
}
function Xl(e, t) {
  let n;
  t = t || {}, zl(t), X(e, "rimraf: missing path"), X.strictEqual(typeof e, "string", "rimraf: path should be a string"), X(t, "rimraf: missing options"), X.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    n = t.lstatSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    r.code === "EPERM" && Mn && ks(e, t, r);
  }
  try {
    n && n.isDirectory() ? Ur(e, t, null) : t.unlinkSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    if (r.code === "EPERM")
      return Mn ? ks(e, t, r) : Ur(e, t, r);
    if (r.code !== "EISDIR")
      throw r;
    Ur(e, t, r);
  }
}
function Ur(e, t, n) {
  X(e), X(t);
  try {
    t.rmdirSync(e);
  } catch (r) {
    if (r.code === "ENOTDIR")
      throw n;
    if (r.code === "ENOTEMPTY" || r.code === "EEXIST" || r.code === "EPERM")
      uh(e, t);
    else if (r.code !== "ENOENT")
      throw r;
  }
}
function uh(e, t) {
  if (X(e), X(t), t.readdirSync(e).forEach((n) => Xl(Yl.join(e, n), t)), Mn) {
    const n = Date.now();
    do
      try {
        return t.rmdirSync(e, t);
      } catch {
      }
    while (Date.now() - n < 500);
  } else
    return t.rmdirSync(e, t);
}
var fh = Lo;
Lo.sync = Xl;
const jr = Ne, dh = Ie.fromCallback, Kl = fh;
function hh(e, t) {
  if (jr.rm) return jr.rm(e, { recursive: !0, force: !0 }, t);
  Kl(e, t);
}
function ph(e) {
  if (jr.rmSync) return jr.rmSync(e, { recursive: !0, force: !0 });
  Kl.sync(e);
}
var ei = {
  remove: dh(hh),
  removeSync: ph
};
const mh = Ie.fromPromise, Jl = Mt, Ql = Z, Zl = et, ec = ei, Ms = mh(async function(t) {
  let n;
  try {
    n = await Jl.readdir(t);
  } catch {
    return Zl.mkdirs(t);
  }
  return Promise.all(n.map((r) => ec.remove(Ql.join(t, r))));
});
function Bs(e) {
  let t;
  try {
    t = Jl.readdirSync(e);
  } catch {
    return Zl.mkdirsSync(e);
  }
  t.forEach((n) => {
    n = Ql.join(e, n), ec.removeSync(n);
  });
}
var gh = {
  emptyDirSync: Bs,
  emptydirSync: Bs,
  emptyDir: Ms,
  emptydir: Ms
};
const Eh = Ie.fromCallback, tc = Z, ht = Ne, nc = et;
function yh(e, t) {
  function n() {
    ht.writeFile(e, "", (r) => {
      if (r) return t(r);
      t();
    });
  }
  ht.stat(e, (r, i) => {
    if (!r && i.isFile()) return t();
    const o = tc.dirname(e);
    ht.stat(o, (s, a) => {
      if (s)
        return s.code === "ENOENT" ? nc.mkdirs(o, (c) => {
          if (c) return t(c);
          n();
        }) : t(s);
      a.isDirectory() ? n() : ht.readdir(o, (c) => {
        if (c) return t(c);
      });
    });
  });
}
function wh(e) {
  let t;
  try {
    t = ht.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const n = tc.dirname(e);
  try {
    ht.statSync(n).isDirectory() || ht.readdirSync(n);
  } catch (r) {
    if (r && r.code === "ENOENT") nc.mkdirsSync(n);
    else throw r;
  }
  ht.writeFileSync(e, "");
}
var _h = {
  createFile: Eh(yh),
  createFileSync: wh
};
const vh = Ie.fromCallback, rc = Z, dt = Ne, ic = et, Ah = Bt.pathExists, { areIdentical: oc } = fn;
function Th(e, t, n) {
  function r(i, o) {
    dt.link(i, o, (s) => {
      if (s) return n(s);
      n(null);
    });
  }
  dt.lstat(t, (i, o) => {
    dt.lstat(e, (s, a) => {
      if (s)
        return s.message = s.message.replace("lstat", "ensureLink"), n(s);
      if (o && oc(a, o)) return n(null);
      const c = rc.dirname(t);
      Ah(c, (m, l) => {
        if (m) return n(m);
        if (l) return r(e, t);
        ic.mkdirs(c, (f) => {
          if (f) return n(f);
          r(e, t);
        });
      });
    });
  });
}
function Sh(e, t) {
  let n;
  try {
    n = dt.lstatSync(t);
  } catch {
  }
  try {
    const o = dt.lstatSync(e);
    if (n && oc(o, n)) return;
  } catch (o) {
    throw o.message = o.message.replace("lstat", "ensureLink"), o;
  }
  const r = rc.dirname(t);
  return dt.existsSync(r) || ic.mkdirsSync(r), dt.linkSync(e, t);
}
var bh = {
  createLink: vh(Th),
  createLinkSync: Sh
};
const pt = Z, In = Ne, Ch = Bt.pathExists;
function Rh(e, t, n) {
  if (pt.isAbsolute(e))
    return In.lstat(e, (r) => r ? (r.message = r.message.replace("lstat", "ensureSymlink"), n(r)) : n(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const r = pt.dirname(t), i = pt.join(r, e);
    return Ch(i, (o, s) => o ? n(o) : s ? n(null, {
      toCwd: i,
      toDst: e
    }) : In.lstat(e, (a) => a ? (a.message = a.message.replace("lstat", "ensureSymlink"), n(a)) : n(null, {
      toCwd: e,
      toDst: pt.relative(r, e)
    })));
  }
}
function Oh(e, t) {
  let n;
  if (pt.isAbsolute(e)) {
    if (n = In.existsSync(e), !n) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const r = pt.dirname(t), i = pt.join(r, e);
    if (n = In.existsSync(i), n)
      return {
        toCwd: i,
        toDst: e
      };
    if (n = In.existsSync(e), !n) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: pt.relative(r, e)
    };
  }
}
var Ih = {
  symlinkPaths: Rh,
  symlinkPathsSync: Oh
};
const sc = Ne;
function Nh(e, t, n) {
  if (n = typeof t == "function" ? t : n, t = typeof t == "function" ? !1 : t, t) return n(null, t);
  sc.lstat(e, (r, i) => {
    if (r) return n(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", n(null, t);
  });
}
function Ph(e, t) {
  let n;
  if (t) return t;
  try {
    n = sc.lstatSync(e);
  } catch {
    return "file";
  }
  return n && n.isDirectory() ? "dir" : "file";
}
var Dh = {
  symlinkType: Nh,
  symlinkTypeSync: Ph
};
const $h = Ie.fromCallback, ac = Z, Ge = Mt, lc = et, Fh = lc.mkdirs, xh = lc.mkdirsSync, cc = Ih, Lh = cc.symlinkPaths, Uh = cc.symlinkPathsSync, uc = Dh, kh = uc.symlinkType, Mh = uc.symlinkTypeSync, Bh = Bt.pathExists, { areIdentical: fc } = fn;
function jh(e, t, n, r) {
  r = typeof n == "function" ? n : r, n = typeof n == "function" ? !1 : n, Ge.lstat(t, (i, o) => {
    !i && o.isSymbolicLink() ? Promise.all([
      Ge.stat(e),
      Ge.stat(t)
    ]).then(([s, a]) => {
      if (fc(s, a)) return r(null);
      js(e, t, n, r);
    }) : js(e, t, n, r);
  });
}
function js(e, t, n, r) {
  Lh(e, t, (i, o) => {
    if (i) return r(i);
    e = o.toDst, kh(o.toCwd, n, (s, a) => {
      if (s) return r(s);
      const c = ac.dirname(t);
      Bh(c, (m, l) => {
        if (m) return r(m);
        if (l) return Ge.symlink(e, t, a, r);
        Fh(c, (f) => {
          if (f) return r(f);
          Ge.symlink(e, t, a, r);
        });
      });
    });
  });
}
function Hh(e, t, n) {
  let r;
  try {
    r = Ge.lstatSync(t);
  } catch {
  }
  if (r && r.isSymbolicLink()) {
    const a = Ge.statSync(e), c = Ge.statSync(t);
    if (fc(a, c)) return;
  }
  const i = Uh(e, t);
  e = i.toDst, n = Mh(i.toCwd, n);
  const o = ac.dirname(t);
  return Ge.existsSync(o) || xh(o), Ge.symlinkSync(e, t, n);
}
var qh = {
  createSymlink: $h(jh),
  createSymlinkSync: Hh
};
const { createFile: Hs, createFileSync: qs } = _h, { createLink: Gs, createLinkSync: Vs } = bh, { createSymlink: Ws, createSymlinkSync: Ys } = qh;
var Gh = {
  // file
  createFile: Hs,
  createFileSync: qs,
  ensureFile: Hs,
  ensureFileSync: qs,
  // link
  createLink: Gs,
  createLinkSync: Vs,
  ensureLink: Gs,
  ensureLinkSync: Vs,
  // symlink
  createSymlink: Ws,
  createSymlinkSync: Ys,
  ensureSymlink: Ws,
  ensureSymlinkSync: Ys
};
function Vh(e, { EOL: t = `
`, finalEOL: n = !0, replacer: r = null, spaces: i } = {}) {
  const o = n ? t : "", s = JSON.stringify(e, r, i);
  if (s === void 0)
    throw new TypeError(`Converting ${typeof e} value to JSON is not supported`);
  return s.replace(/\n/g, t) + o;
}
function Wh(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var Uo = { stringify: Vh, stripBom: Wh };
let ln;
try {
  ln = Ne;
} catch {
  ln = vt;
}
const ti = Ie, { stringify: dc, stripBom: hc } = Uo;
async function Yh(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || ln, r = "throws" in t ? t.throws : !0;
  let i = await ti.fromCallback(n.readFile)(e, t);
  i = hc(i);
  let o;
  try {
    o = JSON.parse(i, t ? t.reviver : null);
  } catch (s) {
    if (r)
      throw s.message = `${e}: ${s.message}`, s;
    return null;
  }
  return o;
}
const zh = ti.fromPromise(Yh);
function Xh(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || ln, r = "throws" in t ? t.throws : !0;
  try {
    let i = n.readFileSync(e, t);
    return i = hc(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (r)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function Kh(e, t, n = {}) {
  const r = n.fs || ln, i = dc(t, n);
  await ti.fromCallback(r.writeFile)(e, i, n);
}
const Jh = ti.fromPromise(Kh);
function Qh(e, t, n = {}) {
  const r = n.fs || ln, i = dc(t, n);
  return r.writeFileSync(e, i, n);
}
var Zh = {
  readFile: zh,
  readFileSync: Xh,
  writeFile: Jh,
  writeFileSync: Qh
};
const _r = Zh;
var ep = {
  // jsonfile exports
  readJson: _r.readFile,
  readJsonSync: _r.readFileSync,
  writeJson: _r.writeFile,
  writeJsonSync: _r.writeFileSync
};
const tp = Ie.fromCallback, Nn = Ne, pc = Z, mc = et, np = Bt.pathExists;
function rp(e, t, n, r) {
  typeof n == "function" && (r = n, n = "utf8");
  const i = pc.dirname(e);
  np(i, (o, s) => {
    if (o) return r(o);
    if (s) return Nn.writeFile(e, t, n, r);
    mc.mkdirs(i, (a) => {
      if (a) return r(a);
      Nn.writeFile(e, t, n, r);
    });
  });
}
function ip(e, ...t) {
  const n = pc.dirname(e);
  if (Nn.existsSync(n))
    return Nn.writeFileSync(e, ...t);
  mc.mkdirsSync(n), Nn.writeFileSync(e, ...t);
}
var ko = {
  outputFile: tp(rp),
  outputFileSync: ip
};
const { stringify: op } = Uo, { outputFile: sp } = ko;
async function ap(e, t, n = {}) {
  const r = op(t, n);
  await sp(e, r, n);
}
var lp = ap;
const { stringify: cp } = Uo, { outputFileSync: up } = ko;
function fp(e, t, n) {
  const r = cp(t, n);
  up(e, r, n);
}
var dp = fp;
const hp = Ie.fromPromise, Oe = ep;
Oe.outputJson = hp(lp);
Oe.outputJsonSync = dp;
Oe.outputJSON = Oe.outputJson;
Oe.outputJSONSync = Oe.outputJsonSync;
Oe.writeJSON = Oe.writeJson;
Oe.writeJSONSync = Oe.writeJsonSync;
Oe.readJSON = Oe.readJson;
Oe.readJSONSync = Oe.readJsonSync;
var pp = Oe;
const mp = Ne, fo = Z, gp = xo.copy, gc = ei.remove, Ep = et.mkdirp, yp = Bt.pathExists, zs = fn;
function wp(e, t, n, r) {
  typeof n == "function" && (r = n, n = {}), n = n || {};
  const i = n.overwrite || n.clobber || !1;
  zs.checkPaths(e, t, "move", n, (o, s) => {
    if (o) return r(o);
    const { srcStat: a, isChangingCase: c = !1 } = s;
    zs.checkParentPaths(e, a, t, "move", (m) => {
      if (m) return r(m);
      if (_p(t)) return Xs(e, t, i, c, r);
      Ep(fo.dirname(t), (l) => l ? r(l) : Xs(e, t, i, c, r));
    });
  });
}
function _p(e) {
  const t = fo.dirname(e);
  return fo.parse(t).root === t;
}
function Xs(e, t, n, r, i) {
  if (r) return Pi(e, t, n, i);
  if (n)
    return gc(t, (o) => o ? i(o) : Pi(e, t, n, i));
  yp(t, (o, s) => o ? i(o) : s ? i(new Error("dest already exists.")) : Pi(e, t, n, i));
}
function Pi(e, t, n, r) {
  mp.rename(e, t, (i) => i ? i.code !== "EXDEV" ? r(i) : vp(e, t, n, r) : r());
}
function vp(e, t, n, r) {
  gp(e, t, {
    overwrite: n,
    errorOnExist: !0
  }, (o) => o ? r(o) : gc(e, r));
}
var Ap = wp;
const Ec = Ne, ho = Z, Tp = xo.copySync, yc = ei.removeSync, Sp = et.mkdirpSync, Ks = fn;
function bp(e, t, n) {
  n = n || {};
  const r = n.overwrite || n.clobber || !1, { srcStat: i, isChangingCase: o = !1 } = Ks.checkPathsSync(e, t, "move", n);
  return Ks.checkParentPathsSync(e, i, t, "move"), Cp(t) || Sp(ho.dirname(t)), Rp(e, t, r, o);
}
function Cp(e) {
  const t = ho.dirname(e);
  return ho.parse(t).root === t;
}
function Rp(e, t, n, r) {
  if (r) return Di(e, t, n);
  if (n)
    return yc(t), Di(e, t, n);
  if (Ec.existsSync(t)) throw new Error("dest already exists.");
  return Di(e, t, n);
}
function Di(e, t, n) {
  try {
    Ec.renameSync(e, t);
  } catch (r) {
    if (r.code !== "EXDEV") throw r;
    return Op(e, t, n);
  }
}
function Op(e, t, n) {
  return Tp(e, t, {
    overwrite: n,
    errorOnExist: !0
  }), yc(e);
}
var Ip = bp;
const Np = Ie.fromCallback;
var Pp = {
  move: Np(Ap),
  moveSync: Ip
}, Tt = {
  // Export promiseified graceful-fs:
  ...Mt,
  // Export extra methods:
  ...xo,
  ...gh,
  ...Gh,
  ...pp,
  ...et,
  ...Pp,
  ...ko,
  ...Bt,
  ...ei
}, jt = {}, Et = {}, de = {}, yt = {};
Object.defineProperty(yt, "__esModule", { value: !0 });
yt.CancellationError = yt.CancellationToken = void 0;
const Dp = Ol;
class $p extends Dp.EventEmitter {
  get cancelled() {
    return this._cancelled || this._parent != null && this._parent.cancelled;
  }
  set parent(t) {
    this.removeParentCancelHandler(), this._parent = t, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
  }
  // babel cannot compile ... correctly for super calls
  constructor(t) {
    super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, t != null && (this.parent = t);
  }
  cancel() {
    this._cancelled = !0, this.emit("cancel");
  }
  onCancel(t) {
    this.cancelled ? t() : this.once("cancel", t);
  }
  createPromise(t) {
    if (this.cancelled)
      return Promise.reject(new po());
    const n = () => {
      if (r != null)
        try {
          this.removeListener("cancel", r), r = null;
        } catch {
        }
    };
    let r = null;
    return new Promise((i, o) => {
      let s = null;
      if (r = () => {
        try {
          s != null && (s(), s = null);
        } finally {
          o(new po());
        }
      }, this.cancelled) {
        r();
        return;
      }
      this.onCancel(r), t(i, o, (a) => {
        s = a;
      });
    }).then((i) => (n(), i)).catch((i) => {
      throw n(), i;
    });
  }
  removeParentCancelHandler() {
    const t = this._parent;
    t != null && this.parentCancelHandler != null && (t.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
  }
  dispose() {
    try {
      this.removeParentCancelHandler();
    } finally {
      this.removeAllListeners(), this._parent = null;
    }
  }
}
yt.CancellationToken = $p;
class po extends Error {
  constructor() {
    super("cancelled");
  }
}
yt.CancellationError = po;
var dn = {};
Object.defineProperty(dn, "__esModule", { value: !0 });
dn.newError = Fp;
function Fp(e, t) {
  const n = new Error(e);
  return n.code = t, n;
}
var fe = {}, mo = { exports: {} }, vr = { exports: {} }, $i, Js;
function xp() {
  if (Js) return $i;
  Js = 1;
  var e = 1e3, t = e * 60, n = t * 60, r = n * 24, i = r * 7, o = r * 365.25;
  $i = function(l, f) {
    f = f || {};
    var h = typeof l;
    if (h === "string" && l.length > 0)
      return s(l);
    if (h === "number" && isFinite(l))
      return f.long ? c(l) : a(l);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(l)
    );
  };
  function s(l) {
    if (l = String(l), !(l.length > 100)) {
      var f = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        l
      );
      if (f) {
        var h = parseFloat(f[1]), g = (f[2] || "ms").toLowerCase();
        switch (g) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return h * o;
          case "weeks":
          case "week":
          case "w":
            return h * i;
          case "days":
          case "day":
          case "d":
            return h * r;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return h * n;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return h * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return h * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return h;
          default:
            return;
        }
      }
    }
  }
  function a(l) {
    var f = Math.abs(l);
    return f >= r ? Math.round(l / r) + "d" : f >= n ? Math.round(l / n) + "h" : f >= t ? Math.round(l / t) + "m" : f >= e ? Math.round(l / e) + "s" : l + "ms";
  }
  function c(l) {
    var f = Math.abs(l);
    return f >= r ? m(l, f, r, "day") : f >= n ? m(l, f, n, "hour") : f >= t ? m(l, f, t, "minute") : f >= e ? m(l, f, e, "second") : l + " ms";
  }
  function m(l, f, h, g) {
    var w = f >= h * 1.5;
    return Math.round(l / h) + " " + g + (w ? "s" : "");
  }
  return $i;
}
var Fi, Qs;
function wc() {
  if (Qs) return Fi;
  Qs = 1;
  function e(t) {
    r.debug = r, r.default = r, r.coerce = m, r.disable = a, r.enable = o, r.enabled = c, r.humanize = xp(), r.destroy = l, Object.keys(t).forEach((f) => {
      r[f] = t[f];
    }), r.names = [], r.skips = [], r.formatters = {};
    function n(f) {
      let h = 0;
      for (let g = 0; g < f.length; g++)
        h = (h << 5) - h + f.charCodeAt(g), h |= 0;
      return r.colors[Math.abs(h) % r.colors.length];
    }
    r.selectColor = n;
    function r(f) {
      let h, g = null, w, E;
      function A(...T) {
        if (!A.enabled)
          return;
        const O = A, $ = Number(/* @__PURE__ */ new Date()), B = $ - (h || $);
        O.diff = B, O.prev = h, O.curr = $, h = $, T[0] = r.coerce(T[0]), typeof T[0] != "string" && T.unshift("%O");
        let q = 0;
        T[0] = T[0].replace(/%([a-zA-Z%])/g, (Q, oe) => {
          if (Q === "%%")
            return "%";
          q++;
          const U = r.formatters[oe];
          if (typeof U == "function") {
            const y = T[q];
            Q = U.call(O, y), T.splice(q, 1), q--;
          }
          return Q;
        }), r.formatArgs.call(O, T), (O.log || r.log).apply(O, T);
      }
      return A.namespace = f, A.useColors = r.useColors(), A.color = r.selectColor(f), A.extend = i, A.destroy = r.destroy, Object.defineProperty(A, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => g !== null ? g : (w !== r.namespaces && (w = r.namespaces, E = r.enabled(f)), E),
        set: (T) => {
          g = T;
        }
      }), typeof r.init == "function" && r.init(A), A;
    }
    function i(f, h) {
      const g = r(this.namespace + (typeof h > "u" ? ":" : h) + f);
      return g.log = this.log, g;
    }
    function o(f) {
      r.save(f), r.namespaces = f, r.names = [], r.skips = [];
      const h = (typeof f == "string" ? f : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const g of h)
        g[0] === "-" ? r.skips.push(g.slice(1)) : r.names.push(g);
    }
    function s(f, h) {
      let g = 0, w = 0, E = -1, A = 0;
      for (; g < f.length; )
        if (w < h.length && (h[w] === f[g] || h[w] === "*"))
          h[w] === "*" ? (E = w, A = g, w++) : (g++, w++);
        else if (E !== -1)
          w = E + 1, A++, g = A;
        else
          return !1;
      for (; w < h.length && h[w] === "*"; )
        w++;
      return w === h.length;
    }
    function a() {
      const f = [
        ...r.names,
        ...r.skips.map((h) => "-" + h)
      ].join(",");
      return r.enable(""), f;
    }
    function c(f) {
      for (const h of r.skips)
        if (s(f, h))
          return !1;
      for (const h of r.names)
        if (s(f, h))
          return !0;
      return !1;
    }
    function m(f) {
      return f instanceof Error ? f.stack || f.message : f;
    }
    function l() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return r.enable(r.load()), r;
  }
  return Fi = e, Fi;
}
var Zs;
function Lp() {
  return Zs || (Zs = 1, function(e, t) {
    t.formatArgs = r, t.save = i, t.load = o, t.useColors = n, t.storage = s(), t.destroy = /* @__PURE__ */ (() => {
      let c = !1;
      return () => {
        c || (c = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), t.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function n() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let c;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (c = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(c[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function r(c) {
      if (c[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + c[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const m = "color: " + this.color;
      c.splice(1, 0, m, "color: inherit");
      let l = 0, f = 0;
      c[0].replace(/%[a-zA-Z%]/g, (h) => {
        h !== "%%" && (l++, h === "%c" && (f = l));
      }), c.splice(f, 0, m);
    }
    t.log = console.debug || console.log || (() => {
    });
    function i(c) {
      try {
        c ? t.storage.setItem("debug", c) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function o() {
      let c;
      try {
        c = t.storage.getItem("debug") || t.storage.getItem("DEBUG");
      } catch {
      }
      return !c && typeof process < "u" && "env" in process && (c = process.env.DEBUG), c;
    }
    function s() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = wc()(t);
    const { formatters: a } = e.exports;
    a.j = function(c) {
      try {
        return JSON.stringify(c);
      } catch (m) {
        return "[UnexpectedJSONParseError]: " + m.message;
      }
    };
  }(vr, vr.exports)), vr.exports;
}
var Ar = { exports: {} }, xi, ea;
function Up() {
  return ea || (ea = 1, xi = (e, t = process.argv) => {
    const n = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", r = t.indexOf(n + e), i = t.indexOf("--");
    return r !== -1 && (i === -1 || r < i);
  }), xi;
}
var Li, ta;
function kp() {
  if (ta) return Li;
  ta = 1;
  const e = Jr, t = Il, n = Up(), { env: r } = process;
  let i;
  n("no-color") || n("no-colors") || n("color=false") || n("color=never") ? i = 0 : (n("color") || n("colors") || n("color=true") || n("color=always")) && (i = 1), "FORCE_COLOR" in r && (r.FORCE_COLOR === "true" ? i = 1 : r.FORCE_COLOR === "false" ? i = 0 : i = r.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(r.FORCE_COLOR, 10), 3));
  function o(c) {
    return c === 0 ? !1 : {
      level: c,
      hasBasic: !0,
      has256: c >= 2,
      has16m: c >= 3
    };
  }
  function s(c, m) {
    if (i === 0)
      return 0;
    if (n("color=16m") || n("color=full") || n("color=truecolor"))
      return 3;
    if (n("color=256"))
      return 2;
    if (c && !m && i === void 0)
      return 0;
    const l = i || 0;
    if (r.TERM === "dumb")
      return l;
    if (process.platform === "win32") {
      const f = e.release().split(".");
      return Number(f[0]) >= 10 && Number(f[2]) >= 10586 ? Number(f[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in r)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((f) => f in r) || r.CI_NAME === "codeship" ? 1 : l;
    if ("TEAMCITY_VERSION" in r)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(r.TEAMCITY_VERSION) ? 1 : 0;
    if (r.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in r) {
      const f = parseInt((r.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (r.TERM_PROGRAM) {
        case "iTerm.app":
          return f >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(r.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(r.TERM) || "COLORTERM" in r ? 1 : l;
  }
  function a(c) {
    const m = s(c, c && c.isTTY);
    return o(m);
  }
  return Li = {
    supportsColor: a,
    stdout: o(s(!0, t.isatty(1))),
    stderr: o(s(!0, t.isatty(2)))
  }, Li;
}
var na;
function Mp() {
  return na || (na = 1, function(e, t) {
    const n = Il, r = Io;
    t.init = l, t.log = a, t.formatArgs = o, t.save = c, t.load = m, t.useColors = i, t.destroy = r.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const h = kp();
      h && (h.stderr || h).level >= 2 && (t.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter((h) => /^debug_/i.test(h)).reduce((h, g) => {
      const w = g.substring(6).toLowerCase().replace(/_([a-z])/g, (A, T) => T.toUpperCase());
      let E = process.env[g];
      return /^(yes|on|true|enabled)$/i.test(E) ? E = !0 : /^(no|off|false|disabled)$/i.test(E) ? E = !1 : E === "null" ? E = null : E = Number(E), h[w] = E, h;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : n.isatty(process.stderr.fd);
    }
    function o(h) {
      const { namespace: g, useColors: w } = this;
      if (w) {
        const E = this.color, A = "\x1B[3" + (E < 8 ? E : "8;5;" + E), T = `  ${A};1m${g} \x1B[0m`;
        h[0] = T + h[0].split(`
`).join(`
` + T), h.push(A + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        h[0] = s() + g + " " + h[0];
    }
    function s() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function a(...h) {
      return process.stderr.write(r.formatWithOptions(t.inspectOpts, ...h) + `
`);
    }
    function c(h) {
      h ? process.env.DEBUG = h : delete process.env.DEBUG;
    }
    function m() {
      return process.env.DEBUG;
    }
    function l(h) {
      h.inspectOpts = {};
      const g = Object.keys(t.inspectOpts);
      for (let w = 0; w < g.length; w++)
        h.inspectOpts[g[w]] = t.inspectOpts[g[w]];
    }
    e.exports = wc()(t);
    const { formatters: f } = e.exports;
    f.o = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts).split(`
`).map((g) => g.trim()).join(" ");
    }, f.O = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts);
    };
  }(Ar, Ar.exports)), Ar.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? mo.exports = Lp() : mo.exports = Mp();
var Bp = mo.exports, Zn = {};
Object.defineProperty(Zn, "__esModule", { value: !0 });
Zn.ProgressCallbackTransform = void 0;
const jp = Kn;
class Hp extends jp.Transform {
  constructor(t, n, r) {
    super(), this.total = t, this.cancellationToken = n, this.onProgress = r, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, n, r) {
    if (this.cancellationToken.cancelled) {
      r(new Error("cancelled"), null);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.total * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), r(null, t);
  }
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.total,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, t(null);
  }
}
Zn.ProgressCallbackTransform = Hp;
Object.defineProperty(fe, "__esModule", { value: !0 });
fe.DigestTransform = fe.HttpExecutor = fe.HttpError = void 0;
fe.addSensitiveRedirectHeader = Xp;
fe.addSensitiveFieldPattern = Kp;
fe.createHttpError = Eo;
fe.parseJson = Qp;
fe.configureRequestOptionsFromUrl = Sc;
fe.configureRequestUrl = jo;
fe.safeGetHeader = sn;
fe.configureRequestOptions = Hr;
fe.isSensitiveFieldName = bc;
fe.hashSensitiveValue = Cc;
fe.safeStringifyJson = Zt;
const _c = Jn, qp = Bp, Gp = vt, Vp = Kn, go = At, Wp = yt, ra = dn, Yp = Zn, ut = (0, qp.default)("electron-builder"), Mo = (e) => e.toLowerCase().replace(/[-_]/g, ""), vc = /* @__PURE__ */ new Set(["authorization", "proxyauthorization", "privatetoken", "xapikey", "xauthtoken", "xaccesstoken", "xgitlabtoken", "cookie", "xcsrftoken"]), Ac = ["token", "password", "secret", "authorization", "credential", "apikey", "passphrase", "auth"], zp = ["key"];
function Xp(e) {
  vc.add(Mo(e));
}
function Kp(e) {
  Ac.push(e.toLowerCase().replace(/[-_]/g, ""));
}
function Eo(e, t = null) {
  return new Bo(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + Zt(e.headers), t);
}
const Jp = /* @__PURE__ */ new Map([
  [429, "Too many requests"],
  [400, "Bad request"],
  [403, "Forbidden"],
  [404, "Not found"],
  [405, "Method not allowed"],
  [406, "Not acceptable"],
  [408, "Request timeout"],
  [413, "Request entity too large"],
  [500, "Internal server error"],
  [502, "Bad gateway"],
  [503, "Service unavailable"],
  [504, "Gateway timeout"],
  [505, "HTTP version not supported"]
]);
class Bo extends Error {
  constructor(t, n = `HTTP error: ${Jp.get(t) || t}`, r = null) {
    super(n), this.statusCode = t, this.description = r, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
fe.HttpError = Bo;
function Qp(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class Qt {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, n = new Wp.CancellationToken(), r) {
    Hr(t);
    const i = r == null ? void 0 : JSON.stringify(r), o = i ? Buffer.from(i) : void 0;
    if (o != null) {
      ut.enabled && ut(Zt(r));
      const { headers: s, ...a } = t;
      t = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": o.length,
          ...s
        },
        ...a
      };
    }
    return this.doApiRequest(t, n, (s) => s.end(o));
  }
  doApiRequest(t, n, r, i = 0) {
    if (ut.enabled) {
      const { headers: o, auth: s, ...a } = t;
      ut(`Request: ${Zt(a)}`);
    }
    return n.createPromise((o, s, a) => {
      const c = this.createRequest(t, (m) => {
        try {
          this.handleResponse(m, t, n, o, s, i, r);
        } catch (l) {
          s(l);
        }
      });
      this.addErrorAndTimeoutHandlers(c, s, t.timeout), this.addRedirectHandlers(c, t, s, i, (m) => {
        this.doApiRequest(m, n, r, i).then(o).catch(s);
      }), r(c, s), a(() => c.abort());
    });
  }
  // noinspection JSUnusedLocalSymbols
  // eslint-disable-next-line
  addRedirectHandlers(t, n, r, i, o) {
  }
  addErrorAndTimeoutHandlers(t, n, r = 60 * 1e3) {
    this.addTimeOutHandler(t, n, r), t.on("error", n), t.on("aborted", () => {
      n(new Error("Request has been aborted by the server"));
    });
  }
  handleResponse(t, n, r, i, o, s, a) {
    var c;
    if (ut.enabled) {
      const { headers: g, auth: w, ...E } = n;
      ut(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${Zt(E)}`);
    }
    if (t.statusCode === 404) {
      o(Eo(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const m = (c = t.statusCode) !== null && c !== void 0 ? c : 0, l = m >= 300 && m < 400, f = sn(t, "location");
    if (l && f != null) {
      if (s > this.maxRedirects) {
        o(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(Qt.prepareRedirectUrlOptions(f, n), r, a, s).then(i).catch(o);
      return;
    }
    t.setEncoding("utf8");
    let h = "";
    t.on("error", o), t.on("data", (g) => h += g), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const g = sn(t, "content-type"), w = g != null && (Array.isArray(g) ? g.find((E) => E.includes("json")) != null : g.includes("json"));
          o(Eo(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

          Data:
          ${w ? Zt(JSON.parse(h)) : h}
          `));
        } else
          i(h.length === 0 ? null : h);
      } catch (g) {
        o(g);
      }
    });
  }
  async downloadToBuffer(t, n) {
    return await n.cancellationToken.createPromise((r, i, o) => {
      const s = [], a = {
        headers: n.headers || void 0,
        // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
        redirect: "manual"
      };
      jo(t, a), Hr(a), this.doDownload(a, {
        destination: null,
        options: n,
        onCancel: o,
        callback: (c) => {
          c == null ? r(Buffer.concat(s)) : i(c);
        },
        responseHandler: (c, m) => {
          let l = 0;
          c.on("data", (f) => {
            if (l += f.length, l > 524288e3) {
              m(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            s.push(f);
          }), c.on("end", () => {
            m(null);
          });
        }
      }, 0);
    });
  }
  doDownload(t, n, r) {
    const i = this.createRequest(t, (o) => {
      if (o.statusCode >= 400) {
        n.callback(new Error(`Cannot download "${t.protocol || "https:"}//${t.hostname}${t.path}", status ${o.statusCode}: ${o.statusMessage}`));
        return;
      }
      o.on("error", n.callback);
      const s = sn(o, "location");
      if (s != null) {
        r < this.maxRedirects ? this.doDownload(Qt.prepareRedirectUrlOptions(s, t), n, r++) : n.callback(this.createMaxRedirectError());
        return;
      }
      n.responseHandler == null ? em(n, o) : n.responseHandler(o, n.callback);
    });
    this.addErrorAndTimeoutHandlers(i, n.callback, t.timeout), this.addRedirectHandlers(i, t, n.callback, r, (o) => {
      this.doDownload(o, n, r++);
    }), i.end();
  }
  createMaxRedirectError() {
    return new Error(`Too many redirects (> ${this.maxRedirects})`);
  }
  addTimeOutHandler(t, n, r) {
    t.on("socket", (i) => {
      i.setTimeout(r, () => {
        t.abort(), n(new Error("Request timed out"));
      });
    });
  }
  static prepareRedirectUrlOptions(t, n) {
    const r = Sc(t, { ...n }), i = r.headers;
    if (i == null)
      return r;
    const o = Qt.reconstructOriginalUrl(n), s = Tc(t, n);
    if (Qt.isCrossOriginRedirect(o, s)) {
      ut.enabled && ut(`Cross-origin redirect (${o.host} → ${s.host}): stripping sensitive headers`);
      for (const a of Object.keys(i))
        vc.has(Mo(a)) && delete i[a];
    }
    return r;
  }
  static reconstructOriginalUrl(t) {
    const n = t.protocol || "https:";
    if (!t.hostname)
      throw new Error("Missing hostname in request options");
    const r = t.hostname, i = t.port ? `:${t.port}` : "", o = t.path || "/";
    return new go.URL(`${n}//${r}${i}${o}`);
  }
  static isCrossOriginRedirect(t, n) {
    if (t.hostname.toLowerCase() !== n.hostname.toLowerCase())
      return !0;
    if (t.protocol === "http:" && // This can be replaced with `!originalUrl.port`, but for the sake of clarity.
    ["80", ""].includes(t.port) && n.protocol === "https:" && // This can be replaced with `!redirectUrl.port`, but for the sake of clarity.
    ["443", ""].includes(n.port))
      return !1;
    if (t.protocol !== n.protocol)
      return !0;
    const r = t.port, i = n.port;
    return r !== i;
  }
  static async retryOnServerError(t, n = 3) {
    for (let r = 0; ; r++)
      try {
        return await t();
      } catch (i) {
        if (r < n && (i instanceof Bo && i.isServerError() || i.code === "EPIPE")) {
          await new Promise((o) => setTimeout(o, 1e3 * (r + 1)));
          continue;
        }
        throw i;
      }
  }
}
fe.HttpExecutor = Qt;
function Tc(e, t) {
  try {
    return new go.URL(e);
  } catch {
    const n = t.hostname, r = t.protocol || "https:", i = t.port ? `:${t.port}` : "", o = `${r}//${n}${i}`;
    return new go.URL(e, o);
  }
}
function Sc(e, t) {
  const n = Hr(t), r = Tc(e, t);
  return jo(r, n), n;
}
function jo(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class yo extends Vp.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, n = "sha512", r = "base64") {
    super(), this.expected = t, this.algorithm = n, this.encoding = r, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, _c.createHash)(n);
  }
  // noinspection JSUnusedGlobalSymbols
  _transform(t, n, r) {
    this.digester.update(t), r(null, t);
  }
  // noinspection JSUnusedGlobalSymbols
  _flush(t) {
    if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
      try {
        this.validate();
      } catch (n) {
        t(n);
        return;
      }
    t(null);
  }
  validate() {
    if (this._actual == null)
      throw (0, ra.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, ra.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
fe.DigestTransform = yo;
function Zp(e, t, n) {
  return e != null && t != null && e !== t ? (n(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function sn(e, t) {
  const n = e.headers[t];
  return n == null ? null : Array.isArray(n) ? n.length === 0 ? null : n[n.length - 1] : n;
}
function em(e, t) {
  if (!Zp(sn(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const n = [];
  if (e.options.onProgress != null) {
    const s = sn(t, "content-length");
    s != null && n.push(new Yp.ProgressCallbackTransform(parseInt(s, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const r = e.options.sha512;
  r != null ? n.push(new yo(r, "sha512", r.length === 128 && !r.includes("+") && !r.includes("Z") && !r.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && n.push(new yo(e.options.sha2, "sha256", "hex"));
  const i = (0, Gp.createWriteStream)(e.destination);
  n.push(i);
  let o = t;
  for (const s of n)
    s.on("error", (a) => {
      i.close(), e.options.cancellationToken.cancelled || e.callback(a);
    }), o = o.pipe(s);
  i.on("finish", () => {
    i.close(e.callback);
  });
}
function Hr(e, t, n) {
  n != null && (e.method = n), e.headers = { ...e.headers };
  const r = e.headers;
  return t != null && (r.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), r["User-Agent"] == null && (r["User-Agent"] = "electron-builder"), (n == null || n === "GET" || r["Cache-Control"] == null) && (r["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function bc(e) {
  const t = Mo(e);
  return Ac.some((n) => t.includes(n)) || zp.some((n) => t.endsWith(n));
}
function Cc(e) {
  return `${(0, _c.createHash)("sha256").update(e).digest("hex")} (sha256 hash)`;
}
function Zt(e, t) {
  return JSON.stringify(e, (n, r) => bc(n) || t != null && t.has(n) ? typeof r == "string" ? Cc(r) : "<stripped sensitive data>" : r, 2);
}
var ni = {};
Object.defineProperty(ni, "__esModule", { value: !0 });
ni.MemoLazy = void 0;
class tm {
  constructor(t, n) {
    this.selector = t, this.creator = n, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && Rc(this.selected, t))
      return this._value;
    this.selected = t;
    const n = this.creator(t);
    return this.value = n, n;
  }
  set value(t) {
    this._value = t;
  }
}
ni.MemoLazy = tm;
function Rc(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), o = Object.keys(t);
    return i.length === o.length && i.every((s) => Rc(e[s], t[s]));
  }
  return e === t;
}
var er = {};
Object.defineProperty(er, "__esModule", { value: !0 });
er.githubUrl = nm;
er.githubTagPrefix = rm;
er.getS3LikeProviderBaseUrl = im;
function nm(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function rm(e) {
  var t;
  return e.tagNamePrefix ? e.tagNamePrefix : !((t = e.vPrefixedTagName) !== null && t !== void 0) || t ? "v" : "";
}
function im(e) {
  const t = e.provider;
  if (t === "s3")
    return om(e);
  if (t === "spaces")
    return sm(e);
  throw new Error(`Not supported provider: ${t}`);
}
function om(e) {
  let t;
  if (e.accelerate == !0)
    t = `https://${e.bucket}.s3-accelerate.amazonaws.com`;
  else if (e.endpoint != null)
    t = `${e.endpoint}/${e.bucket}`;
  else if (e.bucket.includes(".")) {
    if (e.region == null)
      throw new Error(`Bucket name "${e.bucket}" includes a dot, but S3 region is missing`);
    e.region === "us-east-1" ? t = `https://s3.amazonaws.com/${e.bucket}` : t = `https://s3-${e.region}.amazonaws.com/${e.bucket}`;
  } else e.region === "cn-north-1" ? t = `https://${e.bucket}.s3.${e.region}.amazonaws.com.cn` : t = `https://${e.bucket}.s3.amazonaws.com`;
  return Oc(t, e.path);
}
function Oc(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function sm(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return Oc(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var Ho = {};
Object.defineProperty(Ho, "__esModule", { value: !0 });
Ho.retry = Ic;
const am = yt;
async function Ic(e, t) {
  var n;
  const { retries: r, interval: i, backoff: o = 0, attempt: s = 0, shouldRetry: a, cancellationToken: c = new am.CancellationToken() } = t;
  try {
    return await e();
  } catch (m) {
    if (await Promise.resolve((n = a == null ? void 0 : a(m)) !== null && n !== void 0 ? n : !0) && r > 0 && !c.cancelled)
      return await new Promise((l) => setTimeout(l, i + o * s)), await Ic(e, { ...t, retries: r - 1, attempt: s + 1 });
    throw m;
  }
}
var qo = {};
Object.defineProperty(qo, "__esModule", { value: !0 });
qo.parseDn = lm;
function lm(e) {
  let t = !1, n = null, r = "", i = 0;
  e = e.trim();
  const o = /* @__PURE__ */ new Map();
  for (let s = 0; s <= e.length; s++) {
    if (s === e.length) {
      n !== null && o.set(n, r);
      break;
    }
    const a = e[s];
    if (t) {
      if (a === '"') {
        t = !1;
        continue;
      }
    } else {
      if (a === '"') {
        t = !0;
        continue;
      }
      if (a === "\\") {
        s++;
        const c = parseInt(e.slice(s, s + 2), 16);
        Number.isNaN(c) ? r += e[s] : (s++, r += String.fromCharCode(c));
        continue;
      }
      if (n === null && a === "=") {
        n = r, r = "";
        continue;
      }
      if (a === "," || a === ";" || a === "+") {
        n !== null && o.set(n, r), n = null, r = "";
        continue;
      }
    }
    if (a === " " && !t) {
      if (r.length === 0)
        continue;
      if (s > i) {
        let c = s;
        for (; e[c] === " "; )
          c++;
        i = c;
      }
      if (i >= e.length || e[i] === "," || e[i] === ";" || n === null && e[i] === "=" || n !== null && e[i] === "+") {
        s = i - 1;
        continue;
      }
    }
    r += a;
  }
  return o;
}
var cn = {};
Object.defineProperty(cn, "__esModule", { value: !0 });
cn.nil = cn.UUID = void 0;
const Nc = Jn, Pc = dn, cm = "options.name must be either a string or a Buffer", ia = (0, Nc.randomBytes)(16);
ia[0] = ia[0] | 1;
const kr = {}, V = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  kr[t] = e, V[e] = t;
}
class kt {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const n = kt.check(t);
    if (!n)
      throw new Error("not a UUID");
    this.version = n.version, n.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, n) {
    return um(t, "sha1", 80, n);
  }
  toString() {
    return this.ascii == null && (this.ascii = fm(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, n = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (kr[t[14] + t[15]] & 240) >> 4,
        variant: oa((kr[t[19] + t[20]] & 224) >> 5),
        format: "ascii"
      } : !1;
    if (Buffer.isBuffer(t)) {
      if (t.length < n + 16)
        return !1;
      let r = 0;
      for (; r < 16 && t[n + r] === 0; r++)
        ;
      return r === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
        version: (t[n + 6] & 240) >> 4,
        variant: oa((t[n + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, Pc.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const n = Buffer.allocUnsafe(16);
    let r = 0;
    for (let i = 0; i < 16; i++)
      n[i] = kr[t[r++] + t[r++]], (i === 3 || i === 5 || i === 7 || i === 9) && (r += 1);
    return n;
  }
}
cn.UUID = kt;
kt.OID = kt.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function oa(e) {
  switch (e) {
    case 0:
    case 1:
    case 3:
      return "ncs";
    case 4:
    case 5:
      return "rfc4122";
    case 6:
      return "microsoft";
    default:
      return "future";
  }
}
var Pn;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(Pn || (Pn = {}));
function um(e, t, n, r, i = Pn.ASCII) {
  const o = (0, Nc.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, Pc.newError)(cm, "ERR_INVALID_UUID_NAME");
  o.update(r), o.update(e);
  const a = o.digest();
  let c;
  switch (i) {
    case Pn.BINARY:
      a[6] = a[6] & 15 | n, a[8] = a[8] & 63 | 128, c = a;
      break;
    case Pn.OBJECT:
      a[6] = a[6] & 15 | n, a[8] = a[8] & 63 | 128, c = new kt(a);
      break;
    default:
      c = V[a[0]] + V[a[1]] + V[a[2]] + V[a[3]] + "-" + V[a[4]] + V[a[5]] + "-" + V[a[6] & 15 | n] + V[a[7]] + "-" + V[a[8] & 63 | 128] + V[a[9]] + "-" + V[a[10]] + V[a[11]] + V[a[12]] + V[a[13]] + V[a[14]] + V[a[15]];
      break;
  }
  return c;
}
function fm(e) {
  return V[e[0]] + V[e[1]] + V[e[2]] + V[e[3]] + "-" + V[e[4]] + V[e[5]] + "-" + V[e[6]] + V[e[7]] + "-" + V[e[8]] + V[e[9]] + "-" + V[e[10]] + V[e[11]] + V[e[12]] + V[e[13]] + V[e[14]] + V[e[15]];
}
cn.nil = new kt("00000000-0000-0000-0000-000000000000");
var tr = {}, Dc = {};
(function(e) {
  (function(t) {
    t.parser = function(d, u) {
      return new r(d, u);
    }, t.SAXParser = r, t.SAXStream = f, t.createStream = m, t.MAX_BUFFER_LENGTH = 64 * 1024;
    var n = [
      "comment",
      "sgmlDecl",
      "textNode",
      "tagName",
      "doctype",
      "procInstName",
      "procInstBody",
      "entity",
      "attribName",
      "attribValue",
      "cdata",
      "script"
    ];
    t.EVENTS = [
      "text",
      "processinginstruction",
      "sgmldeclaration",
      "doctype",
      "comment",
      "opentagstart",
      "attribute",
      "opentag",
      "closetag",
      "opencdata",
      "cdata",
      "closecdata",
      "error",
      "end",
      "ready",
      "script",
      "opennamespace",
      "closenamespace"
    ];
    function r(d, u) {
      if (!(this instanceof r))
        return new r(d, u);
      var S = this;
      o(S), S.q = S.c = "", S.bufferCheckPosition = t.MAX_BUFFER_LENGTH, S.encoding = null, S.opt = u || {}, S.opt.lowercase = S.opt.lowercase || S.opt.lowercasetags, S.looseCase = S.opt.lowercase ? "toLowerCase" : "toUpperCase", S.opt.maxEntityCount = S.opt.maxEntityCount || 512, S.opt.maxEntityDepth = S.opt.maxEntityDepth || 4, S.entityCount = S.entityDepth = 0, S.tags = [], S.closed = S.closedRoot = S.sawRoot = !1, S.tag = S.error = null, S.strict = !!d, S.noscript = !!(d || S.opt.noscript), S.state = y.BEGIN, S.strictEntities = S.opt.strictEntities, S.ENTITIES = S.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), S.attribList = [], S.opt.xmlns && (S.ns = Object.create(A)), S.opt.unquotedAttributeValues === void 0 && (S.opt.unquotedAttributeValues = !d), S.trackPosition = S.opt.position !== !1, S.trackPosition && (S.position = S.line = S.column = 0), Y(S, "onready");
    }
    Object.create || (Object.create = function(d) {
      function u() {
      }
      u.prototype = d;
      var S = new u();
      return S;
    }), Object.keys || (Object.keys = function(d) {
      var u = [];
      for (var S in d) d.hasOwnProperty(S) && u.push(S);
      return u;
    });
    function i(d) {
      for (var u = Math.max(t.MAX_BUFFER_LENGTH, 10), S = 0, _ = 0, W = n.length; _ < W; _++) {
        var te = d[n[_]].length;
        if (te > u)
          switch (n[_]) {
            case "textNode":
              D(d);
              break;
            case "cdata":
              C(d, "oncdata", d.cdata), d.cdata = "";
              break;
            case "script":
              C(d, "onscript", d.script), d.script = "";
              break;
            default:
              k(d, "Max buffer length exceeded: " + n[_]);
          }
        S = Math.max(S, te);
      }
      var se = t.MAX_BUFFER_LENGTH - S;
      d.bufferCheckPosition = se + d.position;
    }
    function o(d) {
      for (var u = 0, S = n.length; u < S; u++)
        d[n[u]] = "";
    }
    function s(d) {
      D(d), d.cdata !== "" && (C(d, "oncdata", d.cdata), d.cdata = ""), d.script !== "" && (C(d, "onscript", d.script), d.script = "");
    }
    r.prototype = {
      end: function() {
        G(this);
      },
      write: cr,
      resume: function() {
        return this.error = null, this;
      },
      close: function() {
        return this.write(null);
      },
      flush: function() {
        s(this);
      }
    };
    var a;
    try {
      a = require("stream").Stream;
    } catch {
      a = function() {
      };
    }
    a || (a = function() {
    });
    var c = t.EVENTS.filter(function(d) {
      return d !== "error" && d !== "end";
    });
    function m(d, u) {
      return new f(d, u);
    }
    function l(d, u) {
      if (d.length >= 2) {
        if (d[0] === 255 && d[1] === 254)
          return "utf-16le";
        if (d[0] === 254 && d[1] === 255)
          return "utf-16be";
      }
      return d.length >= 3 && d[0] === 239 && d[1] === 187 && d[2] === 191 ? "utf8" : d.length >= 4 ? d[0] === 60 && d[1] === 0 && d[2] === 63 && d[3] === 0 ? "utf-16le" : d[0] === 0 && d[1] === 60 && d[2] === 0 && d[3] === 63 ? "utf-16be" : "utf8" : u ? "utf8" : null;
    }
    function f(d, u) {
      if (!(this instanceof f))
        return new f(d, u);
      a.apply(this), this._parser = new r(d, u), this.writable = !0, this.readable = !0;
      var S = this;
      this._parser.onend = function() {
        S.emit("end");
      }, this._parser.onerror = function(_) {
        S.emit("error", _), S._parser.error = null;
      }, this._decoder = null, this._decoderBuffer = null, c.forEach(function(_) {
        Object.defineProperty(S, "on" + _, {
          get: function() {
            return S._parser["on" + _];
          },
          set: function(W) {
            if (!W)
              return S.removeAllListeners(_), S._parser["on" + _] = W, W;
            S.on(_, W);
          },
          enumerable: !0,
          configurable: !1
        });
      });
    }
    f.prototype = Object.create(a.prototype, {
      constructor: {
        value: f
      }
    }), f.prototype._decodeBuffer = function(d, u) {
      if (this._decoderBuffer && (d = Buffer.concat([this._decoderBuffer, d]), this._decoderBuffer = null), !this._decoder) {
        var S = l(d, u);
        if (!S)
          return this._decoderBuffer = d, "";
        this._parser.encoding = S, this._decoder = new TextDecoder(S);
      }
      return this._decoder.decode(d, { stream: !u });
    }, f.prototype.write = function(d) {
      if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(d))
        d = this._decodeBuffer(d, !1);
      else if (this._decoderBuffer) {
        var u = this._decodeBuffer(Buffer.alloc(0), !0);
        u && (this._parser.write(u), this.emit("data", u));
      }
      return this._parser.write(d.toString()), this.emit("data", d), !0;
    }, f.prototype.end = function(d) {
      if (d && d.length && this.write(d), this._decoderBuffer) {
        var u = this._decodeBuffer(Buffer.alloc(0), !0);
        u && (this._parser.write(u), this.emit("data", u));
      } else if (this._decoder) {
        var S = this._decoder.decode();
        S && (this._parser.write(S), this.emit("data", S));
      }
      return this._parser.end(), !0;
    }, f.prototype.on = function(d, u) {
      var S = this;
      return !S._parser["on" + d] && c.indexOf(d) !== -1 && (S._parser["on" + d] = function() {
        var _ = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        _.splice(0, 0, d), S.emit.apply(S, _);
      }), a.prototype.on.call(S, d, u);
    };
    var h = "[CDATA[", g = "DOCTYPE", w = "http://www.w3.org/XML/1998/namespace", E = "http://www.w3.org/2000/xmlns/", A = { xml: w, xmlns: E }, T = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, O = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, $ = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, B = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function q(d) {
      return d === " " || d === `
` || d === "\r" || d === "	";
    }
    function J(d) {
      return d === '"' || d === "'";
    }
    function Q(d) {
      return d === ">" || q(d);
    }
    function oe(d, u) {
      return d.test(u);
    }
    function U(d, u) {
      return !oe(d, u);
    }
    var y = 0;
    t.STATE = {
      BEGIN: y++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: y++,
      // leading whitespace
      TEXT: y++,
      // general stuff
      TEXT_ENTITY: y++,
      // &amp and such.
      OPEN_WAKA: y++,
      // <
      SGML_DECL: y++,
      // <!BLARG
      SGML_DECL_QUOTED: y++,
      // <!BLARG foo "bar
      DOCTYPE: y++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: y++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: y++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: y++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: y++,
      // <!-
      COMMENT: y++,
      // <!--
      COMMENT_ENDING: y++,
      // <!-- blah -
      COMMENT_ENDED: y++,
      // <!-- blah --
      CDATA: y++,
      // <![CDATA[ something
      CDATA_ENDING: y++,
      // ]
      CDATA_ENDING_2: y++,
      // ]]
      PROC_INST: y++,
      // <?hi
      PROC_INST_BODY: y++,
      // <?hi there
      PROC_INST_ENDING: y++,
      // <?hi "there" ?
      OPEN_TAG: y++,
      // <strong
      OPEN_TAG_SLASH: y++,
      // <strong /
      ATTRIB: y++,
      // <a
      ATTRIB_NAME: y++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: y++,
      // <a foo _
      ATTRIB_VALUE: y++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: y++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: y++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: y++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: y++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: y++,
      // <foo bar=&quot
      CLOSE_TAG: y++,
      // </a
      CLOSE_TAG_SAW_WHITE: y++,
      // </a   >
      SCRIPT: y++,
      // <script> ...
      SCRIPT_ENDING: y++
      // <script> ... <
    }, t.XML_ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'"
    }, t.ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'",
      AElig: 198,
      Aacute: 193,
      Acirc: 194,
      Agrave: 192,
      Aring: 197,
      Atilde: 195,
      Auml: 196,
      Ccedil: 199,
      ETH: 208,
      Eacute: 201,
      Ecirc: 202,
      Egrave: 200,
      Euml: 203,
      Iacute: 205,
      Icirc: 206,
      Igrave: 204,
      Iuml: 207,
      Ntilde: 209,
      Oacute: 211,
      Ocirc: 212,
      Ograve: 210,
      Oslash: 216,
      Otilde: 213,
      Ouml: 214,
      THORN: 222,
      Uacute: 218,
      Ucirc: 219,
      Ugrave: 217,
      Uuml: 220,
      Yacute: 221,
      aacute: 225,
      acirc: 226,
      aelig: 230,
      agrave: 224,
      aring: 229,
      atilde: 227,
      auml: 228,
      ccedil: 231,
      eacute: 233,
      ecirc: 234,
      egrave: 232,
      eth: 240,
      euml: 235,
      iacute: 237,
      icirc: 238,
      igrave: 236,
      iuml: 239,
      ntilde: 241,
      oacute: 243,
      ocirc: 244,
      ograve: 242,
      oslash: 248,
      otilde: 245,
      ouml: 246,
      szlig: 223,
      thorn: 254,
      uacute: 250,
      ucirc: 251,
      ugrave: 249,
      uuml: 252,
      yacute: 253,
      yuml: 255,
      copy: 169,
      reg: 174,
      nbsp: 160,
      iexcl: 161,
      cent: 162,
      pound: 163,
      curren: 164,
      yen: 165,
      brvbar: 166,
      sect: 167,
      uml: 168,
      ordf: 170,
      laquo: 171,
      not: 172,
      shy: 173,
      macr: 175,
      deg: 176,
      plusmn: 177,
      sup1: 185,
      sup2: 178,
      sup3: 179,
      acute: 180,
      micro: 181,
      para: 182,
      middot: 183,
      cedil: 184,
      ordm: 186,
      raquo: 187,
      frac14: 188,
      frac12: 189,
      frac34: 190,
      iquest: 191,
      times: 215,
      divide: 247,
      OElig: 338,
      oelig: 339,
      Scaron: 352,
      scaron: 353,
      Yuml: 376,
      fnof: 402,
      circ: 710,
      tilde: 732,
      Alpha: 913,
      Beta: 914,
      Gamma: 915,
      Delta: 916,
      Epsilon: 917,
      Zeta: 918,
      Eta: 919,
      Theta: 920,
      Iota: 921,
      Kappa: 922,
      Lambda: 923,
      Mu: 924,
      Nu: 925,
      Xi: 926,
      Omicron: 927,
      Pi: 928,
      Rho: 929,
      Sigma: 931,
      Tau: 932,
      Upsilon: 933,
      Phi: 934,
      Chi: 935,
      Psi: 936,
      Omega: 937,
      alpha: 945,
      beta: 946,
      gamma: 947,
      delta: 948,
      epsilon: 949,
      zeta: 950,
      eta: 951,
      theta: 952,
      iota: 953,
      kappa: 954,
      lambda: 955,
      mu: 956,
      nu: 957,
      xi: 958,
      omicron: 959,
      pi: 960,
      rho: 961,
      sigmaf: 962,
      sigma: 963,
      tau: 964,
      upsilon: 965,
      phi: 966,
      chi: 967,
      psi: 968,
      omega: 969,
      thetasym: 977,
      upsih: 978,
      piv: 982,
      ensp: 8194,
      emsp: 8195,
      thinsp: 8201,
      zwnj: 8204,
      zwj: 8205,
      lrm: 8206,
      rlm: 8207,
      ndash: 8211,
      mdash: 8212,
      lsquo: 8216,
      rsquo: 8217,
      sbquo: 8218,
      ldquo: 8220,
      rdquo: 8221,
      bdquo: 8222,
      dagger: 8224,
      Dagger: 8225,
      bull: 8226,
      hellip: 8230,
      permil: 8240,
      prime: 8242,
      Prime: 8243,
      lsaquo: 8249,
      rsaquo: 8250,
      oline: 8254,
      frasl: 8260,
      euro: 8364,
      image: 8465,
      weierp: 8472,
      real: 8476,
      trade: 8482,
      alefsym: 8501,
      larr: 8592,
      uarr: 8593,
      rarr: 8594,
      darr: 8595,
      harr: 8596,
      crarr: 8629,
      lArr: 8656,
      uArr: 8657,
      rArr: 8658,
      dArr: 8659,
      hArr: 8660,
      forall: 8704,
      part: 8706,
      exist: 8707,
      empty: 8709,
      nabla: 8711,
      isin: 8712,
      notin: 8713,
      ni: 8715,
      prod: 8719,
      sum: 8721,
      minus: 8722,
      lowast: 8727,
      radic: 8730,
      prop: 8733,
      infin: 8734,
      ang: 8736,
      and: 8743,
      or: 8744,
      cap: 8745,
      cup: 8746,
      int: 8747,
      there4: 8756,
      sim: 8764,
      cong: 8773,
      asymp: 8776,
      ne: 8800,
      equiv: 8801,
      le: 8804,
      ge: 8805,
      sub: 8834,
      sup: 8835,
      nsub: 8836,
      sube: 8838,
      supe: 8839,
      oplus: 8853,
      otimes: 8855,
      perp: 8869,
      sdot: 8901,
      lceil: 8968,
      rceil: 8969,
      lfloor: 8970,
      rfloor: 8971,
      lang: 9001,
      rang: 9002,
      loz: 9674,
      spades: 9824,
      clubs: 9827,
      hearts: 9829,
      diams: 9830
    }, Object.keys(t.ENTITIES).forEach(function(d) {
      var u = t.ENTITIES[d], S = typeof u == "number" ? String.fromCharCode(u) : u;
      t.ENTITIES[d] = S;
    });
    for (var H in t.STATE)
      t.STATE[t.STATE[H]] = H;
    y = t.STATE;
    function Y(d, u, S) {
      d[u] && d[u](S);
    }
    function ee(d) {
      var u = d && d.match(/(?:^|\s)encoding\s*=\s*(['"])([^'"]+)\1/i);
      return u ? u[2] : null;
    }
    function I(d) {
      return d ? d.toLowerCase().replace(/[^a-z0-9]/g, "") : null;
    }
    function R(d, u) {
      const S = I(d), _ = I(u);
      return !S || !_ ? !0 : _ === "utf16" ? S === "utf16le" || S === "utf16be" : S === _;
    }
    function P(d, u) {
      if (!(!d.strict || !d.encoding || !u || u.name !== "xml")) {
        var S = ee(u.body);
        S && !R(d.encoding, S) && F(
          d,
          "XML declaration encoding " + S + " does not match detected stream encoding " + d.encoding.toUpperCase()
        );
      }
    }
    function C(d, u, S) {
      d.textNode && D(d), Y(d, u, S);
    }
    function D(d) {
      d.textNode = N(d.opt, d.textNode), d.textNode && Y(d, "ontext", d.textNode), d.textNode = "";
    }
    function N(d, u) {
      return d.trim && (u = u.trim()), d.normalize && (u = u.replace(/\s+/g, " ")), u;
    }
    function k(d, u) {
      return D(d), d.trackPosition && (u += `
Line: ` + d.line + `
Column: ` + d.column + `
Char: ` + d.c), u = new Error(u), d.error = u, Y(d, "onerror", u), d;
    }
    function G(d) {
      return d.sawRoot && !d.closedRoot && F(d, "Unclosed root tag"), d.state !== y.BEGIN && d.state !== y.BEGIN_WHITESPACE && d.state !== y.TEXT && k(d, "Unexpected end"), D(d), d.c = "", d.closed = !0, Y(d, "onend"), r.call(d, d.strict, d.opt), d;
    }
    function F(d, u) {
      if (typeof d != "object" || !(d instanceof r))
        throw new Error("bad call to strictFail");
      d.strict && k(d, u);
    }
    function z(d) {
      d.strict || (d.tagName = d.tagName[d.looseCase]());
      var u = d.tags[d.tags.length - 1] || d, S = d.tag = { name: d.tagName, attributes: {} };
      d.opt.xmlns && (S.ns = u.ns), d.attribList.length = 0, C(d, "onopentagstart", S);
    }
    function ce(d, u) {
      var S = d.indexOf(":"), _ = S < 0 ? ["", d] : d.split(":"), W = _[0], te = _[1];
      return u && d === "xmlns" && (W = "xmlns", te = ""), { prefix: W, local: te };
    }
    function M(d) {
      if (d.strict || (d.attribName = d.attribName[d.looseCase]()), d.attribList.indexOf(d.attribName) !== -1 || d.tag.attributes.hasOwnProperty(d.attribName)) {
        d.attribName = d.attribValue = "";
        return;
      }
      if (d.opt.xmlns) {
        var u = ce(d.attribName, !0), S = u.prefix, _ = u.local;
        if (S === "xmlns")
          if (_ === "xml" && d.attribValue !== w)
            F(
              d,
              "xml: prefix must be bound to " + w + `
Actual: ` + d.attribValue
            );
          else if (_ === "xmlns" && d.attribValue !== E)
            F(
              d,
              "xmlns: prefix must be bound to " + E + `
Actual: ` + d.attribValue
            );
          else {
            var W = d.tag, te = d.tags[d.tags.length - 1] || d;
            W.ns === te.ns && (W.ns = Object.create(te.ns)), W.ns[_] = d.attribValue;
          }
        d.attribList.push([d.attribName, d.attribValue]);
      } else
        d.tag.attributes[d.attribName] = d.attribValue, C(d, "onattribute", {
          name: d.attribName,
          value: d.attribValue
        });
      d.attribName = d.attribValue = "";
    }
    function we(d, u) {
      if (d.opt.xmlns) {
        var S = d.tag, _ = ce(d.tagName);
        S.prefix = _.prefix, S.local = _.local, S.uri = S.ns[_.prefix] || "", S.prefix && !S.uri && (F(
          d,
          "Unbound namespace prefix: " + JSON.stringify(d.tagName)
        ), S.uri = _.prefix);
        var W = d.tags[d.tags.length - 1] || d;
        S.ns && W.ns !== S.ns && Object.keys(S.ns).forEach(function(bt) {
          C(d, "onopennamespace", {
            prefix: bt,
            uri: S.ns[bt]
          });
        });
        for (var te = 0, se = d.attribList.length; te < se; te++) {
          var _e = d.attribList[te], ve = _e[0], Be = _e[1], ue = ce(ve, !0), je = ue.prefix, vi = ue.local, ur = je === "" ? "" : S.ns[je] || "", yn = {
            name: ve,
            value: Be,
            prefix: je,
            local: vi,
            uri: ur
          };
          je && je !== "xmlns" && !ur && (F(
            d,
            "Unbound namespace prefix: " + JSON.stringify(je)
          ), yn.uri = je), d.tag.attributes[ve] = yn, C(d, "onattribute", yn);
        }
        d.attribList.length = 0;
      }
      d.tag.isSelfClosing = !!u, d.sawRoot = !0, d.tags.push(d.tag), C(d, "onopentag", d.tag), u || (!d.noscript && d.tagName.toLowerCase() === "script" ? d.state = y.SCRIPT : d.state = y.TEXT, d.tag = null, d.tagName = ""), d.attribName = d.attribValue = "", d.attribList.length = 0;
    }
    function gn(d) {
      if (!d.tagName) {
        F(d, "Weird empty close tag."), d.textNode += "</>", d.state = y.TEXT;
        return;
      }
      if (d.script) {
        if (d.tagName !== "script") {
          d.script += "</" + d.tagName + ">", d.tagName = "", d.state = y.SCRIPT;
          return;
        }
        C(d, "onscript", d.script), d.script = "";
      }
      var u = d.tags.length, S = d.tagName;
      d.strict || (S = S[d.looseCase]());
      for (var _ = S; u--; ) {
        var W = d.tags[u];
        if (W.name !== _)
          F(d, "Unexpected close tag");
        else
          break;
      }
      if (u < 0) {
        F(d, "Unmatched closing tag: " + d.tagName), d.textNode += "</" + d.tagName + ">", d.state = y.TEXT;
        return;
      }
      d.tagName = S;
      for (var te = d.tags.length; te-- > u; ) {
        var se = d.tag = d.tags.pop();
        d.tagName = d.tag.name, C(d, "onclosetag", d.tagName);
        var _e = {};
        for (var ve in se.ns)
          _e[ve] = se.ns[ve];
        var Be = d.tags[d.tags.length - 1] || d;
        d.opt.xmlns && se.ns !== Be.ns && Object.keys(se.ns).forEach(function(ue) {
          var je = se.ns[ue];
          C(d, "onclosenamespace", { prefix: ue, uri: je });
        });
      }
      u === 0 && (d.closedRoot = !0), d.tagName = d.attribValue = d.attribName = "", d.attribList.length = 0, d.state = y.TEXT;
    }
    function Me(d) {
      var u = d.entity, S = u.toLowerCase(), _, W = "";
      return d.ENTITIES[u] ? d.ENTITIES[u] : d.ENTITIES[S] ? d.ENTITIES[S] : (u = S, u.charAt(0) === "#" && (u.charAt(1) === "x" ? (u = u.slice(2), _ = parseInt(u, 16), W = _.toString(16)) : (u = u.slice(1), _ = parseInt(u, 10), W = _.toString(10))), u = u.replace(/^0+/, ""), isNaN(_) || W.toLowerCase() !== u || _ < 0 || _ > 1114111 ? (F(d, "Invalid character entity"), "&" + d.entity + ";") : String.fromCodePoint(_));
    }
    function En(d, u) {
      u === "<" ? (d.state = y.OPEN_WAKA, d.startTagPosition = d.position) : q(u) || (F(d, "Non-whitespace before first tag."), d.textNode = u, d.state = y.TEXT);
    }
    function Gt(d, u) {
      var S = "";
      return u < d.length && (S = d.charAt(u)), S;
    }
    function cr(d) {
      var u = this;
      if (this.error)
        throw this.error;
      if (u.closed)
        return k(
          u,
          "Cannot write after close. Assign an onready handler."
        );
      if (d === null)
        return G(u);
      typeof d == "object" && (d = d.toString());
      for (var S = 0, _ = ""; _ = Gt(d, S++), u.c = _, !!_; )
        switch (u.trackPosition && (u.position++, _ === `
` ? (u.line++, u.column = 0) : u.column++), u.state) {
          case y.BEGIN:
            if (u.state = y.BEGIN_WHITESPACE, _ === "\uFEFF")
              continue;
            En(u, _);
            continue;
          case y.BEGIN_WHITESPACE:
            En(u, _);
            continue;
          case y.TEXT:
            if (u.sawRoot && !u.closedRoot) {
              for (var te = S - 1; _ && _ !== "<" && _ !== "&"; )
                _ = Gt(d, S++), _ && u.trackPosition && (u.position++, _ === `
` ? (u.line++, u.column = 0) : u.column++);
              u.textNode += d.substring(te, S - 1);
            }
            _ === "<" && !(u.sawRoot && u.closedRoot && !u.strict) ? (u.state = y.OPEN_WAKA, u.startTagPosition = u.position) : (!q(_) && (!u.sawRoot || u.closedRoot) && F(u, "Text data outside of root node."), _ === "&" ? u.state = y.TEXT_ENTITY : u.textNode += _);
            continue;
          case y.SCRIPT:
            _ === "<" ? u.state = y.SCRIPT_ENDING : u.script += _;
            continue;
          case y.SCRIPT_ENDING:
            _ === "/" ? u.state = y.CLOSE_TAG : (u.script += "<" + _, u.state = y.SCRIPT);
            continue;
          case y.OPEN_WAKA:
            if (_ === "!")
              u.state = y.SGML_DECL, u.sgmlDecl = "";
            else if (!q(_)) if (oe(T, _))
              u.state = y.OPEN_TAG, u.tagName = _;
            else if (_ === "/")
              u.state = y.CLOSE_TAG, u.tagName = "";
            else if (_ === "?")
              u.state = y.PROC_INST, u.procInstName = u.procInstBody = "";
            else {
              if (F(u, "Unencoded <"), u.startTagPosition + 1 < u.position) {
                var W = u.position - u.startTagPosition;
                _ = new Array(W).join(" ") + _;
              }
              u.textNode += "<" + _, u.state = y.TEXT;
            }
            continue;
          case y.SGML_DECL:
            if (u.sgmlDecl + _ === "--") {
              u.state = y.COMMENT, u.comment = "", u.sgmlDecl = "";
              continue;
            }
            u.doctype && u.doctype !== !0 && u.sgmlDecl ? (u.state = y.DOCTYPE_DTD, u.doctype += "<!" + u.sgmlDecl + _, u.sgmlDecl = "") : (u.sgmlDecl + _).toUpperCase() === h ? (C(u, "onopencdata"), u.state = y.CDATA, u.sgmlDecl = "", u.cdata = "") : (u.sgmlDecl + _).toUpperCase() === g ? (u.state = y.DOCTYPE, (u.doctype || u.sawRoot) && F(
              u,
              "Inappropriately located doctype declaration"
            ), u.doctype = "", u.sgmlDecl = "") : _ === ">" ? (C(u, "onsgmldeclaration", u.sgmlDecl), u.sgmlDecl = "", u.state = y.TEXT) : (J(_) && (u.state = y.SGML_DECL_QUOTED), u.sgmlDecl += _);
            continue;
          case y.SGML_DECL_QUOTED:
            _ === u.q && (u.state = y.SGML_DECL, u.q = ""), u.sgmlDecl += _;
            continue;
          case y.DOCTYPE:
            _ === ">" ? (u.state = y.TEXT, C(u, "ondoctype", u.doctype), u.doctype = !0) : (u.doctype += _, _ === "[" ? u.state = y.DOCTYPE_DTD : J(_) && (u.state = y.DOCTYPE_QUOTED, u.q = _));
            continue;
          case y.DOCTYPE_QUOTED:
            u.doctype += _, _ === u.q && (u.q = "", u.state = y.DOCTYPE);
            continue;
          case y.DOCTYPE_DTD:
            _ === "]" ? (u.doctype += _, u.state = y.DOCTYPE) : _ === "<" ? (u.state = y.OPEN_WAKA, u.startTagPosition = u.position) : J(_) ? (u.doctype += _, u.state = y.DOCTYPE_DTD_QUOTED, u.q = _) : u.doctype += _;
            continue;
          case y.DOCTYPE_DTD_QUOTED:
            u.doctype += _, _ === u.q && (u.state = y.DOCTYPE_DTD, u.q = "");
            continue;
          case y.COMMENT:
            _ === "-" ? u.state = y.COMMENT_ENDING : u.comment += _;
            continue;
          case y.COMMENT_ENDING:
            _ === "-" ? (u.state = y.COMMENT_ENDED, u.comment = N(u.opt, u.comment), u.comment && C(u, "oncomment", u.comment), u.comment = "") : (u.comment += "-" + _, u.state = y.COMMENT);
            continue;
          case y.COMMENT_ENDED:
            _ !== ">" ? (F(u, "Malformed comment"), u.comment += "--" + _, u.state = y.COMMENT) : u.doctype && u.doctype !== !0 ? u.state = y.DOCTYPE_DTD : u.state = y.TEXT;
            continue;
          case y.CDATA:
            for (var te = S - 1; _ && _ !== "]"; )
              _ = Gt(d, S++), _ && u.trackPosition && (u.position++, _ === `
` ? (u.line++, u.column = 0) : u.column++);
            u.cdata += d.substring(te, S - 1), _ === "]" && (u.state = y.CDATA_ENDING);
            continue;
          case y.CDATA_ENDING:
            _ === "]" ? u.state = y.CDATA_ENDING_2 : (u.cdata += "]" + _, u.state = y.CDATA);
            continue;
          case y.CDATA_ENDING_2:
            _ === ">" ? (u.cdata && C(u, "oncdata", u.cdata), C(u, "onclosecdata"), u.cdata = "", u.state = y.TEXT) : _ === "]" ? u.cdata += "]" : (u.cdata += "]]" + _, u.state = y.CDATA);
            continue;
          case y.PROC_INST:
            _ === "?" ? u.state = y.PROC_INST_ENDING : q(_) ? u.state = y.PROC_INST_BODY : u.procInstName += _;
            continue;
          case y.PROC_INST_BODY:
            if (!u.procInstBody && q(_))
              continue;
            _ === "?" ? u.state = y.PROC_INST_ENDING : u.procInstBody += _;
            continue;
          case y.PROC_INST_ENDING:
            if (_ === ">") {
              const Be = {
                name: u.procInstName,
                body: u.procInstBody
              };
              P(u, Be), C(u, "onprocessinginstruction", Be), u.procInstName = u.procInstBody = "", u.state = y.TEXT;
            } else
              u.procInstBody += "?" + _, u.state = y.PROC_INST_BODY;
            continue;
          case y.OPEN_TAG:
            oe(O, _) ? u.tagName += _ : (z(u), _ === ">" ? we(u) : _ === "/" ? u.state = y.OPEN_TAG_SLASH : (q(_) || F(u, "Invalid character in tag name"), u.state = y.ATTRIB));
            continue;
          case y.OPEN_TAG_SLASH:
            _ === ">" ? (we(u, !0), gn(u)) : (F(
              u,
              "Forward-slash in opening tag not followed by >"
            ), u.state = y.ATTRIB);
            continue;
          case y.ATTRIB:
            if (q(_))
              continue;
            _ === ">" ? we(u) : _ === "/" ? u.state = y.OPEN_TAG_SLASH : oe(T, _) ? (u.attribName = _, u.attribValue = "", u.state = y.ATTRIB_NAME) : F(u, "Invalid attribute name");
            continue;
          case y.ATTRIB_NAME:
            _ === "=" ? u.state = y.ATTRIB_VALUE : _ === ">" ? (F(u, "Attribute without value"), u.attribValue = u.attribName, M(u), we(u)) : q(_) ? u.state = y.ATTRIB_NAME_SAW_WHITE : oe(O, _) ? u.attribName += _ : F(u, "Invalid attribute name");
            continue;
          case y.ATTRIB_NAME_SAW_WHITE:
            if (_ === "=")
              u.state = y.ATTRIB_VALUE;
            else {
              if (q(_))
                continue;
              F(u, "Attribute without value"), u.tag.attributes[u.attribName] = "", u.attribValue = "", C(u, "onattribute", {
                name: u.attribName,
                value: ""
              }), u.attribName = "", _ === ">" ? we(u) : oe(T, _) ? (u.attribName = _, u.state = y.ATTRIB_NAME) : (F(u, "Invalid attribute name"), u.state = y.ATTRIB);
            }
            continue;
          case y.ATTRIB_VALUE:
            if (q(_))
              continue;
            J(_) ? (u.q = _, u.state = y.ATTRIB_VALUE_QUOTED) : (u.opt.unquotedAttributeValues || k(u, "Unquoted attribute value"), u.state = y.ATTRIB_VALUE_UNQUOTED, u.attribValue = _);
            continue;
          case y.ATTRIB_VALUE_QUOTED:
            if (_ !== u.q) {
              _ === "&" ? u.state = y.ATTRIB_VALUE_ENTITY_Q : u.attribValue += _;
              continue;
            }
            M(u), u.q = "", u.state = y.ATTRIB_VALUE_CLOSED;
            continue;
          case y.ATTRIB_VALUE_CLOSED:
            q(_) ? u.state = y.ATTRIB : _ === ">" ? we(u) : _ === "/" ? u.state = y.OPEN_TAG_SLASH : oe(T, _) ? (F(u, "No whitespace between attributes"), u.attribName = _, u.attribValue = "", u.state = y.ATTRIB_NAME) : F(u, "Invalid attribute name");
            continue;
          case y.ATTRIB_VALUE_UNQUOTED:
            if (!Q(_)) {
              _ === "&" ? u.state = y.ATTRIB_VALUE_ENTITY_U : u.attribValue += _;
              continue;
            }
            M(u), _ === ">" ? we(u) : u.state = y.ATTRIB;
            continue;
          case y.CLOSE_TAG:
            if (u.tagName)
              _ === ">" ? gn(u) : oe(O, _) ? u.tagName += _ : u.script ? (u.script += "</" + u.tagName + _, u.tagName = "", u.state = y.SCRIPT) : (q(_) || F(u, "Invalid tagname in closing tag"), u.state = y.CLOSE_TAG_SAW_WHITE);
            else {
              if (q(_))
                continue;
              U(T, _) ? u.script ? (u.script += "</" + _, u.state = y.SCRIPT) : F(u, "Invalid tagname in closing tag.") : u.tagName = _;
            }
            continue;
          case y.CLOSE_TAG_SAW_WHITE:
            if (q(_))
              continue;
            _ === ">" ? gn(u) : F(u, "Invalid characters in closing tag");
            continue;
          case y.TEXT_ENTITY:
          case y.ATTRIB_VALUE_ENTITY_Q:
          case y.ATTRIB_VALUE_ENTITY_U:
            var se, _e;
            switch (u.state) {
              case y.TEXT_ENTITY:
                se = y.TEXT, _e = "textNode";
                break;
              case y.ATTRIB_VALUE_ENTITY_Q:
                se = y.ATTRIB_VALUE_QUOTED, _e = "attribValue";
                break;
              case y.ATTRIB_VALUE_ENTITY_U:
                se = y.ATTRIB_VALUE_UNQUOTED, _e = "attribValue";
                break;
            }
            if (_ === ";") {
              var ve = Me(u);
              u.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(ve) ? ((u.entityCount += 1) > u.opt.maxEntityCount && k(
                u,
                "Parsed entity count exceeds max entity count"
              ), (u.entityDepth += 1) > u.opt.maxEntityDepth && k(
                u,
                "Parsed entity depth exceeds max entity depth"
              ), u.entity = "", u.state = se, u.write(ve), u.entityDepth -= 1) : (u[_e] += ve, u.entity = "", u.state = se);
            } else oe(u.entity.length ? B : $, _) ? u.entity += _ : (F(u, "Invalid character in entity name"), u[_e] += "&" + u.entity + _, u.entity = "", u.state = se);
            continue;
          default:
            throw new Error(u, "Unknown state: " + u.state);
        }
      return u.position >= u.bufferCheckPosition && i(u), u;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var d = String.fromCharCode, u = Math.floor, S = function() {
        var _ = 16384, W = [], te, se, _e = -1, ve = arguments.length;
        if (!ve)
          return "";
        for (var Be = ""; ++_e < ve; ) {
          var ue = Number(arguments[_e]);
          if (!isFinite(ue) || // `NaN`, `+Infinity`, or `-Infinity`
          ue < 0 || // not a valid Unicode code point
          ue > 1114111 || // not a valid Unicode code point
          u(ue) !== ue)
            throw RangeError("Invalid code point: " + ue);
          ue <= 65535 ? W.push(ue) : (ue -= 65536, te = (ue >> 10) + 55296, se = ue % 1024 + 56320, W.push(te, se)), (_e + 1 === ve || W.length > _) && (Be += d.apply(null, W), W.length = 0);
        }
        return Be;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: S,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = S;
    }();
  })(e);
})(Dc);
Object.defineProperty(tr, "__esModule", { value: !0 });
tr.XElement = void 0;
tr.parseXml = mm;
const dm = Dc, Tr = dn;
class $c {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, Tr.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!pm(t))
      throw (0, Tr.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const n = this.attributes === null ? null : this.attributes[t];
    if (n == null)
      throw (0, Tr.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return n;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, n = !1, r = null) {
    const i = this.elementOrNull(t, n);
    if (i === null)
      throw (0, Tr.newError)(r || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, n = !1) {
    if (this.elements === null)
      return null;
    for (const r of this.elements)
      if (sa(r, t, n))
        return r;
    return null;
  }
  getElements(t, n = !1) {
    return this.elements === null ? [] : this.elements.filter((r) => sa(r, t, n));
  }
  elementValueOrEmpty(t, n = !1) {
    const r = this.elementOrNull(t, n);
    return r === null ? "" : r.value;
  }
}
tr.XElement = $c;
const hm = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function pm(e) {
  return hm.test(e);
}
function sa(e, t, n) {
  const r = e.name;
  return r === t || n === !0 && r.length === t.length && r.toLowerCase() === t.toLowerCase();
}
function mm(e) {
  let t = null;
  const n = dm.parser(!0, {}), r = [];
  return n.onopentag = (i) => {
    const o = new $c(i.name);
    if (o.attributes = i.attributes, t === null)
      t = o;
    else {
      const s = r[r.length - 1];
      s.elements == null && (s.elements = []), s.elements.push(o);
    }
    r.push(o);
  }, n.onclosetag = () => {
    r.pop();
  }, n.ontext = (i) => {
    r.length > 0 && (r[r.length - 1].value = i);
  }, n.oncdata = (i) => {
    const o = r[r.length - 1];
    o.value = i, o.isCData = !0;
  }, n.onerror = (i) => {
    throw i;
  }, n.write(e), t;
}
var Ht = {};
Object.defineProperty(Ht, "__esModule", { value: !0 });
Ht.mapToObject = Fc;
Ht.isValidKey = ri;
Ht.asArray = gm;
Ht.deepAssign = ym;
Ht.objectToArgs = vm;
function Fc(e) {
  const t = {};
  for (const [n, r] of e)
    ri(n) && (r instanceof Map ? t[n] = Fc(r) : t[n] = r);
  return t;
}
function ri(e) {
  return ["__proto__", "prototype", "constructor"].includes(e) ? !1 : ["string", "number", "symbol", "boolean"].includes(typeof e) || e === null;
}
function gm(e) {
  return e == null ? [] : Array.isArray(e) ? e : [e];
}
function aa(e) {
  if (Array.isArray(e))
    return !1;
  const t = typeof e;
  return t === "object" || t === "function";
}
function Em(e, t, n) {
  const r = t[n];
  if (r === void 0)
    return;
  const i = e[n];
  i == null || r == null || !aa(i) || !aa(r) ? Array.isArray(i) && Array.isArray(r) ? e[n] = Array.from(new Set(i.concat(r))) : e[n] = r : e[n] = xc(i, r);
}
function xc(e, t) {
  if (e !== t)
    for (const n of Object.getOwnPropertyNames(t))
      ri(n) && Em(e, t, n);
  return e;
}
function ym(e, ...t) {
  for (const n of t)
    n != null && xc(e, n);
  return e;
}
const wm = /^[a-zA-Z][a-zA-Z0-9-]*$/, _m = /[\0\r\n]/;
function vm(e) {
  const t = Object.entries(e).reduce((n, [r, i]) => {
    if (!ri(r) || i == null)
      return n;
    if (!wm.test(r))
      throw new Error(`objectToArgs: unsafe flag name rejected: ${JSON.stringify(r)}`);
    if (_m.test(i))
      throw new Error(`objectToArgs: value for --${r} contains a null byte or newline`);
    return n.concat([`--${r}`, i]);
  }, []);
  return Object.freeze(t);
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.objectToArgs = e.deepAssign = e.asArray = e.mapToObject = e.isValidKey = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubTagPrefix = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.isSensitiveFieldName = e.HttpExecutor = e.hashSensitiveValue = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0;
  var t = yt;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var n = dn;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return n.newError;
  } });
  var r = fe;
  Object.defineProperty(e, "configureRequestOptions", { enumerable: !0, get: function() {
    return r.configureRequestOptions;
  } }), Object.defineProperty(e, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
    return r.configureRequestOptionsFromUrl;
  } }), Object.defineProperty(e, "configureRequestUrl", { enumerable: !0, get: function() {
    return r.configureRequestUrl;
  } }), Object.defineProperty(e, "createHttpError", { enumerable: !0, get: function() {
    return r.createHttpError;
  } }), Object.defineProperty(e, "DigestTransform", { enumerable: !0, get: function() {
    return r.DigestTransform;
  } }), Object.defineProperty(e, "HttpError", { enumerable: !0, get: function() {
    return r.HttpError;
  } }), Object.defineProperty(e, "hashSensitiveValue", { enumerable: !0, get: function() {
    return r.hashSensitiveValue;
  } }), Object.defineProperty(e, "HttpExecutor", { enumerable: !0, get: function() {
    return r.HttpExecutor;
  } }), Object.defineProperty(e, "isSensitiveFieldName", { enumerable: !0, get: function() {
    return r.isSensitiveFieldName;
  } }), Object.defineProperty(e, "parseJson", { enumerable: !0, get: function() {
    return r.parseJson;
  } }), Object.defineProperty(e, "safeGetHeader", { enumerable: !0, get: function() {
    return r.safeGetHeader;
  } }), Object.defineProperty(e, "safeStringifyJson", { enumerable: !0, get: function() {
    return r.safeStringifyJson;
  } });
  var i = ni;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var o = Zn;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return o.ProgressCallbackTransform;
  } });
  var s = er;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return s.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return s.githubUrl;
  } }), Object.defineProperty(e, "githubTagPrefix", { enumerable: !0, get: function() {
    return s.githubTagPrefix;
  } });
  var a = Ho;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return a.retry;
  } });
  var c = qo;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return c.parseDn;
  } });
  var m = cn;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return m.UUID;
  } });
  var l = tr;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return l.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return l.XElement;
  } });
  var f = Ht;
  Object.defineProperty(e, "isValidKey", { enumerable: !0, get: function() {
    return f.isValidKey;
  } }), Object.defineProperty(e, "mapToObject", { enumerable: !0, get: function() {
    return f.mapToObject;
  } }), Object.defineProperty(e, "asArray", { enumerable: !0, get: function() {
    return f.asArray;
  } }), Object.defineProperty(e, "deepAssign", { enumerable: !0, get: function() {
    return f.deepAssign;
  } }), Object.defineProperty(e, "objectToArgs", { enumerable: !0, get: function() {
    return f.objectToArgs;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
})(de);
var ye = {}, Go = {}, We = {};
function Lc(e) {
  return typeof e > "u" || e === null;
}
function Am(e) {
  return typeof e == "object" && e !== null;
}
function Tm(e) {
  return Array.isArray(e) ? e : Lc(e) ? [] : [e];
}
function Sm(e, t) {
  if (t) {
    const n = Object.keys(t);
    for (let r = 0, i = n.length; r < i; r += 1) {
      const o = n[r];
      e[o] = t[o];
    }
  }
  return e;
}
function bm(e, t) {
  let n = "";
  for (let r = 0; r < t; r += 1)
    n += e;
  return n;
}
function Cm(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
We.isNothing = Lc;
We.isObject = Am;
We.toArray = Tm;
We.repeat = bm;
We.isNegativeZero = Cm;
We.extend = Sm;
function Uc(e, t) {
  let n = "";
  const r = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (n += 'in "' + e.mark.name + '" '), n += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (n += `

` + e.mark.snippet), r + " " + n) : r;
}
function Bn(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = Uc(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
Bn.prototype = Object.create(Error.prototype);
Bn.prototype.constructor = Bn;
Bn.prototype.toString = function(t) {
  return this.name + ": " + Uc(this, t);
};
var nr = Bn;
const Cn = We;
function Ui(e, t, n, r, i) {
  let o = "", s = "";
  const a = Math.floor(i / 2) - 1;
  return r - t > a && (o = " ... ", t = r - a + o.length), n - r > a && (s = " ...", n = r + a - s.length), {
    str: o + e.slice(t, n).replace(/\t/g, "→") + s,
    pos: r - t + o.length
    // relative position
  };
}
function ki(e, t) {
  return Cn.repeat(" ", t - e.length) + e;
}
function Rm(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  const n = /\r?\n|\r|\0/g, r = [0], i = [];
  let o, s = -1;
  for (; o = n.exec(e.buffer); )
    i.push(o.index), r.push(o.index + o[0].length), e.position <= o.index && s < 0 && (s = r.length - 2);
  s < 0 && (s = r.length - 1);
  let a = "";
  const c = Math.min(e.line + t.linesAfter, i.length).toString().length, m = t.maxLength - (t.indent + c + 3);
  for (let f = 1; f <= t.linesBefore && !(s - f < 0); f++) {
    const h = Ui(
      e.buffer,
      r[s - f],
      i[s - f],
      e.position - (r[s] - r[s - f]),
      m
    );
    a = Cn.repeat(" ", t.indent) + ki((e.line - f + 1).toString(), c) + " | " + h.str + `
` + a;
  }
  const l = Ui(e.buffer, r[s], i[s], e.position, m);
  a += Cn.repeat(" ", t.indent) + ki((e.line + 1).toString(), c) + " | " + l.str + `
`, a += Cn.repeat("-", t.indent + c + 3 + l.pos) + `^
`;
  for (let f = 1; f <= t.linesAfter && !(s + f >= i.length); f++) {
    const h = Ui(
      e.buffer,
      r[s + f],
      i[s + f],
      e.position - (r[s] - r[s + f]),
      m
    );
    a += Cn.repeat(" ", t.indent) + ki((e.line + f + 1).toString(), c) + " | " + h.str + `
`;
  }
  return a.replace(/\n$/, "");
}
var Om = Rm;
const la = nr, Im = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
], Nm = [
  "scalar",
  "sequence",
  "mapping"
];
function Pm(e) {
  const t = {};
  return e !== null && Object.keys(e).forEach(function(n) {
    e[n].forEach(function(r) {
      t[String(r)] = n;
    });
  }), t;
}
function Dm(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(n) {
    if (Im.indexOf(n) === -1)
      throw new la('Unknown option "' + n + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(n) {
    return n;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = Pm(t.styleAliases || null), Nm.indexOf(this.kind) === -1)
    throw new la('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var Pe = Dm;
const Tn = nr, Mi = Pe;
function ca(e, t) {
  const n = [];
  return e[t].forEach(function(r) {
    let i = n.length;
    n.forEach(function(o, s) {
      o.tag === r.tag && o.kind === r.kind && o.multi === r.multi && (i = s);
    }), n[i] = r;
  }), n;
}
function $m() {
  const e = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  };
  function t(n) {
    n.multi ? (e.multi[n.kind].push(n), e.multi.fallback.push(n)) : e[n.kind][n.tag] = e.fallback[n.tag] = n;
  }
  for (let n = 0, r = arguments.length; n < r; n += 1)
    arguments[n].forEach(t);
  return e;
}
function wo(e) {
  return this.extend(e);
}
wo.prototype.extend = function(t) {
  let n = [], r = [];
  if (t instanceof Mi)
    r.push(t);
  else if (Array.isArray(t))
    r = r.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (n = n.concat(t.implicit)), t.explicit && (r = r.concat(t.explicit));
  else
    throw new Tn("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  n.forEach(function(o) {
    if (!(o instanceof Mi))
      throw new Tn("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new Tn("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new Tn("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), r.forEach(function(o) {
    if (!(o instanceof Mi))
      throw new Tn("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  const i = Object.create(wo.prototype);
  return i.implicit = (this.implicit || []).concat(n), i.explicit = (this.explicit || []).concat(r), i.compiledImplicit = ca(i, "implicit"), i.compiledExplicit = ca(i, "explicit"), i.compiledTypeMap = $m(i.compiledImplicit, i.compiledExplicit), i;
};
var kc = wo;
const Fm = Pe;
var Mc = new Fm("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
});
const xm = Pe;
var Bc = new xm("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
});
const Lm = Pe;
var jc = new Lm("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
});
const Um = kc;
var Hc = new Um({
  explicit: [
    Mc,
    Bc,
    jc
  ]
});
const km = Pe;
function Mm(e) {
  if (e === null) return !0;
  const t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function Bm() {
  return null;
}
function jm(e) {
  return e === null;
}
var qc = new km("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: Mm,
  construct: Bm,
  predicate: jm,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
});
const Hm = Pe;
function qm(e) {
  if (e === null) return !1;
  const t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function Gm(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function Vm(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Gc = new Hm("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: qm,
  construct: Gm,
  predicate: Vm,
  represent: {
    lowercase: function(e) {
      return e ? "true" : "false";
    },
    uppercase: function(e) {
      return e ? "TRUE" : "FALSE";
    },
    camelcase: function(e) {
      return e ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
});
const Wm = We, Ym = Pe;
function zm(e) {
  return e >= 48 && e <= 57 || e >= 65 && e <= 70 || e >= 97 && e <= 102;
}
function Xm(e) {
  return e >= 48 && e <= 55;
}
function Km(e) {
  return e >= 48 && e <= 57;
}
function Jm(e) {
  if (e === null) return !1;
  const t = e.length;
  let n = 0, r = !1;
  if (!t) return !1;
  let i = e[n];
  if ((i === "-" || i === "+") && (i = e[++n]), i === "0") {
    if (n + 1 === t) return !0;
    if (i = e[++n], i === "b") {
      for (n++; n < t; n++) {
        if (i = e[n], i !== "0" && i !== "1") return !1;
        r = !0;
      }
      return r && Number.isFinite(Rn(e));
    }
    if (i === "x") {
      for (n++; n < t; n++) {
        if (!zm(e.charCodeAt(n))) return !1;
        r = !0;
      }
      return r && Number.isFinite(Rn(e));
    }
    if (i === "o") {
      for (n++; n < t; n++) {
        if (!Xm(e.charCodeAt(n))) return !1;
        r = !0;
      }
      return r && Number.isFinite(Rn(e));
    }
  }
  for (; n < t; n++) {
    if (!Km(e.charCodeAt(n)))
      return !1;
    r = !0;
  }
  return r ? Number.isFinite(Rn(e)) : !1;
}
function Rn(e) {
  let t = e, n = 1, r = t[0];
  if ((r === "-" || r === "+") && (r === "-" && (n = -1), t = t.slice(1), r = t[0]), t === "0") return 0;
  if (r === "0") {
    if (t[1] === "b") return n * parseInt(t.slice(2), 2);
    if (t[1] === "x") return n * parseInt(t.slice(2), 16);
    if (t[1] === "o") return n * parseInt(t.slice(2), 8);
  }
  return n * parseInt(t, 10);
}
function Qm(e) {
  return Rn(e);
}
function Zm(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !Wm.isNegativeZero(e);
}
var Vc = new Ym("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: Jm,
  construct: Qm,
  predicate: Zm,
  represent: {
    binary: function(e) {
      return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
    },
    octal: function(e) {
      return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
    },
    decimal: function(e) {
      return e.toString(10);
    },
    hexadecimal: function(e) {
      return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
});
const Wc = We, eg = Pe, tg = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9]+)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
), ng = new RegExp(
  "^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function rg(e) {
  return e === null || !tg.test(e) ? !1 : Number.isFinite(parseFloat(e, 10)) ? !0 : ng.test(e);
}
function ig(e) {
  let t = e.toLowerCase();
  const n = t[0] === "-" ? -1 : 1;
  return "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? n === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : n * parseFloat(t, 10);
}
const og = /^[-+]?[0-9]+e/;
function sg(e, t) {
  if (isNaN(e))
    switch (t) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  else if (Number.POSITIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  else if (Number.NEGATIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  else if (Wc.isNegativeZero(e))
    return "-0.0";
  const n = e.toString(10);
  return og.test(n) ? n.replace("e", ".e") : n;
}
function ag(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || Wc.isNegativeZero(e));
}
var Yc = new eg("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: rg,
  construct: ig,
  predicate: ag,
  represent: sg,
  defaultStyle: "lowercase"
}), zc = Hc.extend({
  implicit: [
    qc,
    Gc,
    Vc,
    Yc
  ]
}), Xc = zc;
const lg = Pe, Kc = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), Jc = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function cg(e) {
  return e === null ? !1 : Kc.exec(e) !== null || Jc.exec(e) !== null;
}
function ug(e) {
  let t = 0, n = null, r = Kc.exec(e);
  if (r === null && (r = Jc.exec(e)), r === null) throw new Error("Date resolve error");
  const i = +r[1], o = +r[2] - 1, s = +r[3];
  if (!r[4])
    return new Date(Date.UTC(i, o, s));
  const a = +r[4], c = +r[5], m = +r[6];
  if (r[7]) {
    for (t = r[7].slice(0, 3); t.length < 3; )
      t += "0";
    t = +t;
  }
  if (r[9]) {
    const f = +r[10], h = +(r[11] || 0);
    n = (f * 60 + h) * 6e4, r[9] === "-" && (n = -n);
  }
  const l = new Date(Date.UTC(i, o, s, a, c, m, t));
  return n && l.setTime(l.getTime() - n), l;
}
function fg(e) {
  return e.toISOString();
}
var Qc = new lg("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: cg,
  construct: ug,
  instanceOf: Date,
  represent: fg
});
const dg = Pe;
function hg(e) {
  return e === "<<" || e === null;
}
var Zc = new dg("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: hg
});
const pg = Pe, Vo = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function mg(e) {
  if (e === null) return !1;
  let t = 0;
  const n = e.length, r = Vo;
  for (let i = 0; i < n; i++) {
    const o = r.indexOf(e.charAt(i));
    if (!(o > 64)) {
      if (o < 0) return !1;
      t += 6;
    }
  }
  return t % 8 === 0;
}
function gg(e) {
  const t = e.replace(/[\r\n=]/g, ""), n = t.length, r = Vo;
  let i = 0;
  const o = [];
  for (let a = 0; a < n; a++)
    a % 4 === 0 && a && (o.push(i >> 16 & 255), o.push(i >> 8 & 255), o.push(i & 255)), i = i << 6 | r.indexOf(t.charAt(a));
  const s = n % 4 * 6;
  return s === 0 ? (o.push(i >> 16 & 255), o.push(i >> 8 & 255), o.push(i & 255)) : s === 18 ? (o.push(i >> 10 & 255), o.push(i >> 2 & 255)) : s === 12 && o.push(i >> 4 & 255), new Uint8Array(o);
}
function Eg(e) {
  let t = "", n = 0;
  const r = e.length, i = Vo;
  for (let s = 0; s < r; s++)
    s % 3 === 0 && s && (t += i[n >> 18 & 63], t += i[n >> 12 & 63], t += i[n >> 6 & 63], t += i[n & 63]), n = (n << 8) + e[s];
  const o = r % 3;
  return o === 0 ? (t += i[n >> 18 & 63], t += i[n >> 12 & 63], t += i[n >> 6 & 63], t += i[n & 63]) : o === 2 ? (t += i[n >> 10 & 63], t += i[n >> 4 & 63], t += i[n << 2 & 63], t += i[64]) : o === 1 && (t += i[n >> 2 & 63], t += i[n << 4 & 63], t += i[64], t += i[64]), t;
}
function yg(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var eu = new pg("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: mg,
  construct: gg,
  predicate: yg,
  represent: Eg
});
const wg = Pe, _g = Object.prototype.hasOwnProperty, vg = Object.prototype.toString;
function Ag(e) {
  if (e === null) return !0;
  const t = [], n = e;
  for (let r = 0, i = n.length; r < i; r += 1) {
    const o = n[r];
    let s = !1;
    if (vg.call(o) !== "[object Object]") return !1;
    let a;
    for (a in o)
      if (_g.call(o, a))
        if (!s) s = !0;
        else return !1;
    if (!s) return !1;
    if (t.indexOf(a) === -1) t.push(a);
    else return !1;
  }
  return !0;
}
function Tg(e) {
  return e !== null ? e : [];
}
var tu = new wg("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Ag,
  construct: Tg
});
const Sg = Pe, bg = Object.prototype.toString;
function Cg(e) {
  if (e === null) return !0;
  const t = e, n = new Array(t.length);
  for (let r = 0, i = t.length; r < i; r += 1) {
    const o = t[r];
    if (bg.call(o) !== "[object Object]") return !1;
    const s = Object.keys(o);
    if (s.length !== 1) return !1;
    n[r] = [s[0], o[s[0]]];
  }
  return !0;
}
function Rg(e) {
  if (e === null) return [];
  const t = e, n = new Array(t.length);
  for (let r = 0, i = t.length; r < i; r += 1) {
    const o = t[r], s = Object.keys(o);
    n[r] = [s[0], o[s[0]]];
  }
  return n;
}
var nu = new Sg("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: Cg,
  construct: Rg
});
const Og = Pe, Ig = Object.prototype.hasOwnProperty;
function Ng(e) {
  if (e === null) return !0;
  const t = e;
  for (const n in t)
    if (Ig.call(t, n) && t[n] !== null)
      return !1;
  return !0;
}
function Pg(e) {
  return e !== null ? e : {};
}
var ru = new Og("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: Ng,
  construct: Pg
}), Wo = Xc.extend({
  implicit: [
    Qc,
    Zc
  ],
  explicit: [
    eu,
    tu,
    nu,
    ru
  ]
});
const $t = We, iu = nr, Dg = Om, $g = Wo, Ve = Object.prototype.hasOwnProperty, qr = 1, ou = 2, su = 3, Gr = 4, Bi = 1, Fg = 2, ua = 3, xg = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, Lg = /[\x85\u2028\u2029]/, Ug = /[,\[\]{}]/, au = /^(?:!|!!|![0-9A-Za-z-]+!)$/, lu = /^(?:!|[^,\[\]{}])(?:%[0-9a-f]{2}|[0-9a-z\-#;/?:@&=+$,_.!~*'()\[\]])*$/i;
function fa(e) {
  return Object.prototype.toString.call(e);
}
function Ze(e) {
  return e === 10 || e === 13;
}
function it(e) {
  return e === 9 || e === 32;
}
function Fe(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function en(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function kg(e) {
  if (e >= 48 && e <= 57)
    return e - 48;
  const t = e | 32;
  return t >= 97 && t <= 102 ? t - 97 + 10 : -1;
}
function Mg(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function Bg(e) {
  return e >= 48 && e <= 57 ? e - 48 : -1;
}
function da(e) {
  switch (e) {
    case 48:
      return "\0";
    case 97:
      return "\x07";
    case 98:
      return "\b";
    case 116:
      return "	";
    case 9:
      return "	";
    case 110:
      return `
`;
    case 118:
      return "\v";
    case 102:
      return "\f";
    case 114:
      return "\r";
    case 101:
      return "\x1B";
    case 32:
      return " ";
    case 34:
      return '"';
    case 47:
      return "/";
    case 92:
      return "\\";
    case 78:
      return "";
    case 95:
      return " ";
    case 76:
      return "\u2028";
    case 80:
      return "\u2029";
    default:
      return "";
  }
}
function jg(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function cu(e, t, n) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: n
  }) : e[t] = n;
}
const uu = new Array(256), fu = new Array(256);
for (let e = 0; e < 256; e++)
  uu[e] = da(e) ? 1 : 0, fu[e] = da(e);
function Hg(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || $g, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.maxDepth = typeof t.maxDepth == "number" ? t.maxDepth : 100, this.maxMergeSeqLength = typeof t.maxMergeSeqLength == "number" ? t.maxMergeSeqLength : 20, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.depth = 0, this.firstTabInLine = -1, this.documents = [], this.anchorMapTransactions = [];
}
function du(e, t) {
  const n = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return n.snippet = Dg(n), new iu(t, n);
}
function L(e, t) {
  throw du(e, t);
}
function Vr(e, t) {
  e.onWarning && e.onWarning.call(null, du(e, t));
}
function Ft(e, t, n) {
  const r = e.anchorMapTransactions;
  if (r.length !== 0) {
    const i = r[r.length - 1];
    Ve.call(i, t) || (i[t] = {
      existed: Ve.call(e.anchorMap, t),
      value: e.anchorMap[t]
    });
  }
  e.anchorMap[t] = n;
}
function qg(e) {
  e.anchorMapTransactions.push(/* @__PURE__ */ Object.create(null));
}
function Gg(e) {
  const t = e.anchorMapTransactions.pop(), n = e.anchorMapTransactions;
  if (n.length === 0) return;
  const r = n[n.length - 1], i = Object.keys(t);
  for (let o = 0, s = i.length; o < s; o += 1) {
    const a = i[o];
    Ve.call(r, a) || (r[a] = t[a]);
  }
}
function Vg(e) {
  const t = e.anchorMapTransactions.pop(), n = Object.keys(t);
  for (let r = n.length - 1; r >= 0; r -= 1) {
    const i = t[n[r]];
    i.existed ? e.anchorMap[n[r]] = i.value : delete e.anchorMap[n[r]];
  }
}
function hu(e) {
  return {
    position: e.position,
    line: e.line,
    lineStart: e.lineStart,
    lineIndent: e.lineIndent,
    firstTabInLine: e.firstTabInLine,
    tag: e.tag,
    anchor: e.anchor,
    kind: e.kind,
    result: e.result
  };
}
function ha(e, t) {
  e.position = t.position, e.line = t.line, e.lineStart = t.lineStart, e.lineIndent = t.lineIndent, e.firstTabInLine = t.firstTabInLine, e.tag = t.tag, e.anchor = t.anchor, e.kind = t.kind, e.result = t.result;
}
const pa = {
  YAML: function(t, n, r) {
    t.version !== null && L(t, "duplication of %YAML directive"), r.length !== 1 && L(t, "YAML directive accepts exactly one argument");
    const i = /^([0-9]+)\.([0-9]+)$/.exec(r[0]);
    i === null && L(t, "ill-formed argument of the YAML directive");
    const o = parseInt(i[1], 10), s = parseInt(i[2], 10);
    o !== 1 && L(t, "unacceptable YAML version of the document"), t.version = r[0], t.checkLineBreaks = s < 2, s !== 1 && s !== 2 && Vr(t, "unsupported YAML version of the document");
  },
  TAG: function(t, n, r) {
    let i;
    r.length !== 2 && L(t, "TAG directive accepts exactly two arguments");
    const o = r[0];
    i = r[1], au.test(o) || L(t, "ill-formed tag handle (first argument) of the TAG directive"), Ve.call(t.tagMap, o) && L(t, 'there is a previously declared suffix for "' + o + '" tag handle'), lu.test(i) || L(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      i = decodeURIComponent(i);
    } catch {
      L(t, "tag prefix is malformed: " + i);
    }
    t.tagMap[o] = i;
  }
};
function gt(e, t, n, r) {
  if (t < n) {
    const i = e.input.slice(t, n);
    if (r)
      for (let o = 0, s = i.length; o < s; o += 1) {
        const a = i.charCodeAt(o);
        a === 9 || a >= 32 && a <= 1114111 || L(e, "expected valid JSON character");
      }
    else xg.test(i) && L(e, "the stream contains non-printable characters");
    e.result += i;
  }
}
function ma(e, t, n, r) {
  $t.isObject(n) || L(e, "cannot merge mappings; the provided source object is unacceptable");
  const i = Object.keys(n);
  for (let o = 0, s = i.length; o < s; o += 1) {
    const a = i[o];
    Ve.call(t, a) || (cu(t, a, n[a]), r[a] = !0);
  }
}
function tn(e, t, n, r, i, o, s, a, c) {
  if (Array.isArray(i)) {
    i = Array.prototype.slice.call(i);
    for (let m = 0, l = i.length; m < l; m += 1)
      Array.isArray(i[m]) && L(e, "nested arrays are not supported inside keys"), typeof i == "object" && fa(i[m]) === "[object Object]" && (i[m] = "[object Object]");
  }
  if (typeof i == "object" && fa(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), r === "tag:yaml.org,2002:merge")
    if (Array.isArray(o)) {
      o.length > e.maxMergeSeqLength && L(e, "merge sequence length exceeded maxMergeSeqLength (" + e.maxMergeSeqLength + ")");
      const m = /* @__PURE__ */ new Set();
      for (let l = 0, f = o.length; l < f; l += 1) {
        const h = o[l];
        m.has(h) || (m.add(h), ma(e, t, h, n));
      }
    } else
      ma(e, t, o, n);
  else
    !e.json && !Ve.call(n, i) && Ve.call(t, i) && (e.line = s || e.line, e.lineStart = a || e.lineStart, e.position = c || e.position, L(e, "duplicated mapping key")), cu(t, i, o), delete n[i];
  return t;
}
function Yo(e) {
  const t = e.input.charCodeAt(e.position);
  t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : L(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function ae(e, t, n) {
  let r = 0, i = e.input.charCodeAt(e.position);
  for (; i !== 0; ) {
    for (; it(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (Ze(i))
      for (Yo(e), i = e.input.charCodeAt(e.position), r++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return n !== -1 && r !== 0 && e.lineIndent < n && Vr(e, "deficient indentation"), r;
}
function ii(e) {
  let t = e.position, n = e.input.charCodeAt(t);
  return !!((n === 45 || n === 46) && n === e.input.charCodeAt(t + 1) && n === e.input.charCodeAt(t + 2) && (t += 3, n = e.input.charCodeAt(t), n === 0 || Fe(n)));
}
function zo(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += $t.repeat(`
`, t - 1));
}
function Wg(e, t, n) {
  let r, i, o, s, a, c;
  const m = e.kind, l = e.result;
  let f = e.input.charCodeAt(e.position);
  if (Fe(f) || en(f) || f === 35 || f === 38 || f === 42 || f === 33 || f === 124 || f === 62 || f === 39 || f === 34 || f === 37 || f === 64 || f === 96)
    return !1;
  if (f === 63 || f === 45) {
    const h = e.input.charCodeAt(e.position + 1);
    if (Fe(h) || n && en(h))
      return !1;
  }
  for (e.kind = "scalar", e.result = "", r = i = e.position, o = !1; f !== 0; ) {
    if (f === 58) {
      const h = e.input.charCodeAt(e.position + 1);
      if (Fe(h) || n && en(h))
        break;
    } else if (f === 35) {
      const h = e.input.charCodeAt(e.position - 1);
      if (Fe(h))
        break;
    } else {
      if (e.position === e.lineStart && ii(e) || n && en(f))
        break;
      if (Ze(f))
        if (s = e.line, a = e.lineStart, c = e.lineIndent, ae(e, !1, -1), e.lineIndent >= t) {
          o = !0, f = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = i, e.line = s, e.lineStart = a, e.lineIndent = c;
          break;
        }
    }
    o && (gt(e, r, i, !1), zo(e, e.line - s), r = i = e.position, o = !1), it(f) || (i = e.position + 1), f = e.input.charCodeAt(++e.position);
  }
  return gt(e, r, i, !1), e.result ? !0 : (e.kind = m, e.result = l, !1);
}
function Yg(e, t) {
  let n, r, i = e.input.charCodeAt(e.position);
  if (i !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (i = e.input.charCodeAt(e.position)) !== 0; )
    if (i === 39)
      if (gt(e, n, e.position, !0), i = e.input.charCodeAt(++e.position), i === 39)
        n = e.position, e.position++, r = e.position;
      else
        return !0;
    else Ze(i) ? (gt(e, n, r, !0), zo(e, ae(e, !1, t)), n = r = e.position) : e.position === e.lineStart && ii(e) ? L(e, "unexpected end of the document within a single quoted scalar") : (e.position++, it(i) || (r = e.position));
  L(e, "unexpected end of the stream within a single quoted scalar");
}
function zg(e, t) {
  let n, r, i, o = e.input.charCodeAt(e.position);
  if (o !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (o = e.input.charCodeAt(e.position)) !== 0; ) {
    if (o === 34)
      return gt(e, n, e.position, !0), e.position++, !0;
    if (o === 92) {
      if (gt(e, n, e.position, !0), o = e.input.charCodeAt(++e.position), Ze(o))
        ae(e, !1, t);
      else if (o < 256 && uu[o])
        e.result += fu[o], e.position++;
      else if ((i = Mg(o)) > 0) {
        let s = i, a = 0;
        for (; s > 0; s--)
          o = e.input.charCodeAt(++e.position), (i = kg(o)) >= 0 ? a = (a << 4) + i : L(e, "expected hexadecimal character");
        e.result += jg(a), e.position++;
      } else
        L(e, "unknown escape sequence");
      n = r = e.position;
    } else Ze(o) ? (gt(e, n, r, !0), zo(e, ae(e, !1, t)), n = r = e.position) : e.position === e.lineStart && ii(e) ? L(e, "unexpected end of the document within a double quoted scalar") : (e.position++, it(o) || (r = e.position));
  }
  L(e, "unexpected end of the stream within a double quoted scalar");
}
function Xg(e, t) {
  let n = !0, r, i, o;
  const s = e.tag;
  let a;
  const c = e.anchor;
  let m, l, f, h;
  const g = /* @__PURE__ */ Object.create(null);
  let w, E, A, T = e.input.charCodeAt(e.position);
  if (T === 91)
    m = 93, h = !1, a = [];
  else if (T === 123)
    m = 125, h = !0, a = {};
  else
    return !1;
  for (e.anchor !== null && Ft(e, e.anchor, a), T = e.input.charCodeAt(++e.position); T !== 0; ) {
    if (ae(e, !0, t), T = e.input.charCodeAt(e.position), T === m)
      return e.position++, e.tag = s, e.anchor = c, e.kind = h ? "mapping" : "sequence", e.result = a, !0;
    if (n ? T === 44 && L(e, "expected the node content, but found ','") : L(e, "missed comma between flow collection entries"), E = w = A = null, l = f = !1, T === 63) {
      const O = e.input.charCodeAt(e.position + 1);
      Fe(O) && (l = f = !0, e.position++, ae(e, !0, t));
    }
    r = e.line, i = e.lineStart, o = e.position, un(e, t, qr, !1, !0), E = e.tag, w = e.result, ae(e, !0, t), T = e.input.charCodeAt(e.position), (f || e.line === r) && T === 58 && (l = !0, T = e.input.charCodeAt(++e.position), ae(e, !0, t), un(e, t, qr, !1, !0), A = e.result), h ? tn(e, a, g, E, w, A, r, i, o) : l ? a.push(tn(e, null, g, E, w, A, r, i, o)) : a.push(w), ae(e, !0, t), T = e.input.charCodeAt(e.position), T === 44 ? (n = !0, T = e.input.charCodeAt(++e.position)) : n = !1;
  }
  L(e, "unexpected end of the stream within a flow collection");
}
function Kg(e, t) {
  let n, r = Bi, i = !1, o = !1, s = t, a = 0, c = !1, m, l = e.input.charCodeAt(e.position);
  if (l === 124)
    n = !1;
  else if (l === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; l !== 0; )
    if (l = e.input.charCodeAt(++e.position), l === 43 || l === 45)
      Bi === r ? r = l === 43 ? ua : Fg : L(e, "repeat of a chomping mode identifier");
    else if ((m = Bg(l)) >= 0)
      m === 0 ? L(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : o ? L(e, "repeat of an indentation width identifier") : (s = t + m - 1, o = !0);
    else
      break;
  if (it(l)) {
    do
      l = e.input.charCodeAt(++e.position);
    while (it(l));
    if (l === 35)
      do
        l = e.input.charCodeAt(++e.position);
      while (!Ze(l) && l !== 0);
  }
  for (; l !== 0; ) {
    for (Yo(e), e.lineIndent = 0, l = e.input.charCodeAt(e.position); (!o || e.lineIndent < s) && l === 32; )
      e.lineIndent++, l = e.input.charCodeAt(++e.position);
    if (!o && e.lineIndent > s && (s = e.lineIndent), Ze(l)) {
      a++;
      continue;
    }
    if (!o && s === 0 && L(e, "missing indentation for block scalar"), e.lineIndent < s) {
      r === ua ? e.result += $t.repeat(`
`, i ? 1 + a : a) : r === Bi && i && (e.result += `
`);
      break;
    }
    n ? it(l) ? (c = !0, e.result += $t.repeat(`
`, i ? 1 + a : a)) : c ? (c = !1, e.result += $t.repeat(`
`, a + 1)) : a === 0 ? i && (e.result += " ") : e.result += $t.repeat(`
`, a) : e.result += $t.repeat(`
`, i ? 1 + a : a), i = !0, o = !0, a = 0;
    const f = e.position;
    for (; !Ze(l) && l !== 0; )
      l = e.input.charCodeAt(++e.position);
    gt(e, f, e.position, !1);
  }
  return !0;
}
function ga(e, t) {
  const n = e.tag, r = e.anchor, i = [];
  let o = !1;
  if (e.firstTabInLine !== -1) return !1;
  e.anchor !== null && Ft(e, e.anchor, i);
  let s = e.input.charCodeAt(e.position);
  for (; s !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation")), s === 45); ) {
    const a = e.input.charCodeAt(e.position + 1);
    if (!Fe(a))
      break;
    if (o = !0, e.position++, ae(e, !0, -1) && e.lineIndent <= t) {
      i.push(null), s = e.input.charCodeAt(e.position);
      continue;
    }
    const c = e.line;
    if (un(e, t, su, !1, !0), i.push(e.result), ae(e, !0, -1), s = e.input.charCodeAt(e.position), (e.line === c || e.lineIndent > t) && s !== 0)
      L(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return o ? (e.tag = n, e.anchor = r, e.kind = "sequence", e.result = i, !0) : !1;
}
function pu(e, t, n) {
  let r, i, o, s;
  const a = e.tag, c = e.anchor, m = {}, l = /* @__PURE__ */ Object.create(null);
  let f = null, h = null, g = null, w = !1, E = !1;
  if (e.firstTabInLine !== -1) return !1;
  e.anchor !== null && Ft(e, e.anchor, m);
  let A = e.input.charCodeAt(e.position);
  for (; A !== 0; ) {
    !w && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation"));
    const T = e.input.charCodeAt(e.position + 1), O = e.line;
    if ((A === 63 || A === 58) && Fe(T))
      A === 63 ? (w && (tn(e, m, l, f, h, null, i, o, s), f = h = g = null), E = !0, w = !0, r = !0) : w ? (w = !1, r = !0) : L(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, A = T;
    else {
      if (i = e.line, o = e.lineStart, s = e.position, !un(e, n, ou, !1, !0))
        break;
      if (e.line === O) {
        for (A = e.input.charCodeAt(e.position); it(A); )
          A = e.input.charCodeAt(++e.position);
        if (A === 58)
          A = e.input.charCodeAt(++e.position), Fe(A) || L(e, "a whitespace character is expected after the key-value separator within a block mapping"), w && (tn(e, m, l, f, h, null, i, o, s), f = h = g = null), E = !0, w = !1, r = !1, f = e.tag, h = e.result;
        else if (E)
          L(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = a, e.anchor = c, !0;
      } else if (E)
        L(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = a, e.anchor = c, !0;
    }
    if ((e.line === O || e.lineIndent > t) && (w && (i = e.line, o = e.lineStart, s = e.position), un(e, t, Gr, !0, r) && (w ? h = e.result : g = e.result), w || (tn(e, m, l, f, h, g, i, o, s), f = h = g = null), ae(e, !0, -1), A = e.input.charCodeAt(e.position)), (e.line === O || e.lineIndent > t) && A !== 0)
      L(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return w && tn(e, m, l, f, h, null, i, o, s), E && (e.tag = a, e.anchor = c, e.kind = "mapping", e.result = m), E;
}
function Jg(e) {
  let t = !1, n = !1, r, i, o = e.input.charCodeAt(e.position);
  if (o !== 33) return !1;
  e.tag !== null && L(e, "duplication of a tag property"), o = e.input.charCodeAt(++e.position), o === 60 ? (t = !0, o = e.input.charCodeAt(++e.position)) : o === 33 ? (n = !0, r = "!!", o = e.input.charCodeAt(++e.position)) : r = "!";
  let s = e.position;
  if (t) {
    do
      o = e.input.charCodeAt(++e.position);
    while (o !== 0 && o !== 62);
    e.position < e.length ? (i = e.input.slice(s, e.position), o = e.input.charCodeAt(++e.position)) : L(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; o !== 0 && !Fe(o); )
      o === 33 && (n ? L(e, "tag suffix cannot contain exclamation marks") : (r = e.input.slice(s - 1, e.position + 1), au.test(r) || L(e, "named tag handle cannot contain such characters"), n = !0, s = e.position + 1)), o = e.input.charCodeAt(++e.position);
    i = e.input.slice(s, e.position), Ug.test(i) && L(e, "tag suffix cannot contain flow indicator characters");
  }
  i && !lu.test(i) && L(e, "tag name cannot contain such characters: " + i);
  try {
    i = decodeURIComponent(i);
  } catch {
    L(e, "tag name is malformed: " + i);
  }
  return t ? e.tag = i : Ve.call(e.tagMap, r) ? e.tag = e.tagMap[r] + i : r === "!" ? e.tag = "!" + i : r === "!!" ? e.tag = "tag:yaml.org,2002:" + i : L(e, 'undeclared tag handle "' + r + '"'), !0;
}
function Qg(e) {
  let t = e.input.charCodeAt(e.position);
  if (t !== 38) return !1;
  e.anchor !== null && L(e, "duplication of an anchor property"), t = e.input.charCodeAt(++e.position);
  const n = e.position;
  for (; t !== 0 && !Fe(t) && !en(t); )
    t = e.input.charCodeAt(++e.position);
  return e.position === n && L(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(n, e.position), !0;
}
function Zg(e) {
  let t = e.input.charCodeAt(e.position);
  if (t !== 42) return !1;
  t = e.input.charCodeAt(++e.position);
  const n = e.position;
  for (; t !== 0 && !Fe(t) && !en(t); )
    t = e.input.charCodeAt(++e.position);
  e.position === n && L(e, "name of an alias node must contain at least one character");
  const r = e.input.slice(n, e.position);
  return Ve.call(e.anchorMap, r) || L(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], ae(e, !0, -1), !0;
}
function e0(e, t, n, r) {
  const i = hu(e);
  return qg(e), ha(e, t), e.tag = null, e.anchor = null, e.kind = null, e.result = null, pu(e, n, r) && e.kind === "mapping" ? (Gg(e), !0) : (Vg(e), ha(e, i), !1);
}
function un(e, t, n, r, i) {
  let o, s, a = 1, c = !1, m = !1, l = null, f, h, g;
  e.depth >= e.maxDepth && L(e, "nesting exceeded maxDepth (" + e.maxDepth + ")"), e.depth += 1, e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null;
  const w = o = s = Gr === n || su === n;
  if (r && ae(e, !0, -1) && (c = !0, e.lineIndent > t ? a = 1 : e.lineIndent === t ? a = 0 : e.lineIndent < t && (a = -1)), a === 1)
    for (; ; ) {
      const E = e.input.charCodeAt(e.position), A = hu(e);
      if (c && (E === 33 && e.tag !== null || E === 38 && e.anchor !== null) || !Jg(e) && !Qg(e))
        break;
      l === null && (l = A), ae(e, !0, -1) ? (c = !0, s = w, e.lineIndent > t ? a = 1 : e.lineIndent === t ? a = 0 : e.lineIndent < t && (a = -1)) : s = !1;
    }
  if (s && (s = c || i), a === 1 || Gr === n)
    if (qr === n || ou === n ? h = t : h = t + 1, g = e.position - e.lineStart, a === 1)
      if (s && (ga(e, g) || pu(e, g, h)) || Xg(e, h))
        m = !0;
      else {
        const E = e.input.charCodeAt(e.position);
        l !== null && w && !s && E !== 124 && E !== 62 && e0(
          e,
          l,
          l.position - l.lineStart,
          h
        ) || o && Kg(e, h) || Yg(e, h) || zg(e, h) ? m = !0 : Zg(e) ? (m = !0, (e.tag !== null || e.anchor !== null) && L(e, "alias node should not have any properties")) : Wg(e, h, qr === n) && (m = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && Ft(e, e.anchor, e.result);
      }
    else a === 0 && (m = s && ga(e, g));
  if (e.tag === null)
    e.anchor !== null && Ft(e, e.anchor, e.result);
  else if (e.tag === "?") {
    e.result !== null && e.kind !== "scalar" && L(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"');
    for (let E = 0, A = e.implicitTypes.length; E < A; E += 1)
      if (f = e.implicitTypes[E], f.resolve(e.result)) {
        e.result = f.construct(e.result), e.tag = f.tag, e.anchor !== null && Ft(e, e.anchor, e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (Ve.call(e.typeMap[e.kind || "fallback"], e.tag))
      f = e.typeMap[e.kind || "fallback"][e.tag];
    else {
      f = null;
      const E = e.typeMap.multi[e.kind || "fallback"];
      for (let A = 0, T = E.length; A < T; A += 1)
        if (e.tag.slice(0, E[A].tag.length) === E[A].tag) {
          f = E[A];
          break;
        }
    }
    f || L(e, "unknown tag !<" + e.tag + ">"), e.result !== null && f.kind !== e.kind && L(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + f.kind + '", not "' + e.kind + '"'), f.resolve(e.result, e.tag) ? (e.result = f.construct(e.result, e.tag), e.anchor !== null && Ft(e, e.anchor, e.result)) : L(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.depth -= 1, e.tag !== null || e.anchor !== null || m;
}
function t0(e) {
  const t = e.position;
  let n = !1, r;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (r = e.input.charCodeAt(e.position)) !== 0 && (ae(e, !0, -1), r = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || r !== 37)); ) {
    n = !0, r = e.input.charCodeAt(++e.position);
    let i = e.position;
    for (; r !== 0 && !Fe(r); )
      r = e.input.charCodeAt(++e.position);
    const o = e.input.slice(i, e.position), s = [];
    for (o.length < 1 && L(e, "directive name must not be less than one character in length"); r !== 0; ) {
      for (; it(r); )
        r = e.input.charCodeAt(++e.position);
      if (r === 35) {
        do
          r = e.input.charCodeAt(++e.position);
        while (r !== 0 && !Ze(r));
        break;
      }
      if (Ze(r)) break;
      for (i = e.position; r !== 0 && !Fe(r); )
        r = e.input.charCodeAt(++e.position);
      s.push(e.input.slice(i, e.position));
    }
    r !== 0 && Yo(e), Ve.call(pa, o) ? pa[o](e, o, s) : Vr(e, 'unknown document directive "' + o + '"');
  }
  if (ae(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, ae(e, !0, -1)) : n && L(e, "directives end mark is expected"), un(e, e.lineIndent - 1, Gr, !1, !0), ae(e, !0, -1), e.checkLineBreaks && Lg.test(e.input.slice(t, e.position)) && Vr(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && ii(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, ae(e, !0, -1));
    return;
  }
  e.position < e.length - 1 && L(e, "end of the stream or a document separator is expected");
}
function mu(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  const n = new Hg(e, t), r = e.indexOf("\0");
  for (r !== -1 && (n.position = r, L(n, "null byte is not allowed in input")), n.input += "\0"; n.input.charCodeAt(n.position) === 32; )
    n.lineIndent += 1, n.position += 1;
  for (; n.position < n.length - 1; )
    t0(n);
  return n.documents;
}
function n0(e, t, n) {
  t !== null && typeof t == "object" && typeof n > "u" && (n = t, t = null);
  const r = mu(e, n);
  if (typeof t != "function")
    return r;
  for (let i = 0, o = r.length; i < o; i += 1)
    t(r[i]);
}
function r0(e, t) {
  const n = mu(e, t);
  if (n.length !== 0) {
    if (n.length === 1)
      return n[0];
    throw new iu("expected a single document in the stream, but found more");
  }
}
Go.loadAll = n0;
Go.load = r0;
var gu = {};
const oi = We, rr = nr, i0 = Wo, Eu = Object.prototype.toString, yu = Object.prototype.hasOwnProperty, Xo = 65279, o0 = 9, jn = 10, s0 = 13, a0 = 32, l0 = 33, c0 = 34, _o = 35, u0 = 37, f0 = 38, d0 = 39, h0 = 42, wu = 44, p0 = 45, Wr = 58, m0 = 61, g0 = 62, E0 = 63, y0 = 64, _u = 91, vu = 93, w0 = 96, Au = 123, _0 = 124, Tu = 125, Se = {};
Se[0] = "\\0";
Se[7] = "\\a";
Se[8] = "\\b";
Se[9] = "\\t";
Se[10] = "\\n";
Se[11] = "\\v";
Se[12] = "\\f";
Se[13] = "\\r";
Se[27] = "\\e";
Se[34] = '\\"';
Se[92] = "\\\\";
Se[133] = "\\N";
Se[160] = "\\_";
Se[8232] = "\\L";
Se[8233] = "\\P";
const v0 = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
], A0 = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function T0(e, t) {
  if (t === null) return {};
  const n = {}, r = Object.keys(t);
  for (let i = 0, o = r.length; i < o; i += 1) {
    let s = r[i], a = String(t[s]);
    s.slice(0, 2) === "!!" && (s = "tag:yaml.org,2002:" + s.slice(2));
    const c = e.compiledTypeMap.fallback[s];
    c && yu.call(c.styleAliases, a) && (a = c.styleAliases[a]), n[s] = a;
  }
  return n;
}
function S0(e) {
  let t, n;
  const r = e.toString(16).toUpperCase();
  if (e <= 255)
    t = "x", n = 2;
  else if (e <= 65535)
    t = "u", n = 4;
  else if (e <= 4294967295)
    t = "U", n = 8;
  else
    throw new rr("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + t + oi.repeat("0", n - r.length) + r;
}
const b0 = 1, Hn = 2;
function C0(e) {
  this.schema = e.schema || i0, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = oi.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = T0(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? Hn : b0, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function Ea(e, t) {
  const n = oi.repeat(" ", t);
  let r = 0, i = "";
  const o = e.length;
  for (; r < o; ) {
    let s;
    const a = e.indexOf(`
`, r);
    a === -1 ? (s = e.slice(r), r = o) : (s = e.slice(r, a + 1), r = a + 1), s.length && s !== `
` && (i += n), i += s;
  }
  return i;
}
function vo(e, t) {
  return `
` + oi.repeat(" ", e.indent * t);
}
function R0(e, t) {
  for (let n = 0, r = e.implicitTypes.length; n < r; n += 1)
    if (e.implicitTypes[n].resolve(t))
      return !0;
  return !1;
}
function Yr(e) {
  return e === a0 || e === o0;
}
function qn(e) {
  return e >= 32 && e <= 126 || e >= 161 && e <= 55295 && e !== 8232 && e !== 8233 || e >= 57344 && e <= 65533 && e !== Xo || e >= 65536 && e <= 1114111;
}
function ya(e) {
  return qn(e) && e !== Xo && // - b-char
  e !== s0 && e !== jn;
}
function wa(e, t, n) {
  const r = ya(e), i = r && !Yr(e);
  return (
    // ns-plain-safe
    (n ? r : r && // - c-flow-indicator
    e !== wu && e !== _u && e !== vu && e !== Au && e !== Tu) && // ns-plain-char
    e !== _o && // false on '#'
    !(t === Wr && !i) || // false on ': '
    ya(t) && !Yr(t) && e === _o || // change to true on '[^ ]#'
    t === Wr && i
  );
}
function O0(e) {
  return qn(e) && e !== Xo && !Yr(e) && // - s-white
  // - (c-indicator ::=
  // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
  e !== p0 && e !== E0 && e !== Wr && e !== wu && e !== _u && e !== vu && e !== Au && e !== Tu && // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
  e !== _o && e !== f0 && e !== h0 && e !== l0 && e !== _0 && e !== m0 && e !== g0 && e !== d0 && e !== c0 && // | “%” | “@” | “`”)
  e !== u0 && e !== y0 && e !== w0;
}
function I0(e) {
  return !Yr(e) && e !== Wr;
}
function On(e, t) {
  const n = e.charCodeAt(t);
  let r;
  return n >= 55296 && n <= 56319 && t + 1 < e.length && (r = e.charCodeAt(t + 1), r >= 56320 && r <= 57343) ? (n - 55296) * 1024 + r - 56320 + 65536 : n;
}
function Su(e) {
  return /^\n* /.test(e);
}
const bu = 1, Ao = 2, Cu = 3, Ru = 4, Jt = 5;
function N0(e, t, n, r, i, o, s, a) {
  let c, m = 0, l = null, f = !1, h = !1;
  const g = r !== -1;
  let w = -1, E = O0(On(e, 0)) && I0(On(e, e.length - 1));
  if (t || s)
    for (c = 0; c < e.length; m >= 65536 ? c += 2 : c++) {
      if (m = On(e, c), !qn(m))
        return Jt;
      E = E && wa(m, l, a), l = m;
    }
  else {
    for (c = 0; c < e.length; m >= 65536 ? c += 2 : c++) {
      if (m = On(e, c), m === jn)
        f = !0, g && (h = h || // Foldable line = too long, and not more-indented.
        c - w - 1 > r && e[w + 1] !== " ", w = c);
      else if (!qn(m))
        return Jt;
      E = E && wa(m, l, a), l = m;
    }
    h = h || g && c - w - 1 > r && e[w + 1] !== " ";
  }
  return !f && !h ? E && !s && !i(e) ? bu : o === Hn ? Jt : Ao : n > 9 && Su(e) ? Jt : s ? o === Hn ? Jt : Ao : h ? Ru : Cu;
}
function P0(e, t, n, r, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === Hn ? '""' : "''";
    if (!e.noCompatMode && (v0.indexOf(t) !== -1 || A0.test(t)))
      return e.quotingType === Hn ? '"' + t + '"' : "'" + t + "'";
    const o = e.indent * Math.max(1, n), s = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), a = r || // No block styles in flow mode.
    e.flowLevel > -1 && n >= e.flowLevel;
    function c(m) {
      return R0(e, m);
    }
    switch (N0(
      t,
      a,
      e.indent,
      s,
      c,
      e.quotingType,
      e.forceQuotes && !r,
      i
    )) {
      case bu:
        return t;
      case Ao:
        return "'" + t.replace(/'/g, "''") + "'";
      case Cu:
        return "|" + _a(t, e.indent) + va(Ea(t, o));
      case Ru:
        return ">" + _a(t, e.indent) + va(Ea(D0(t, s), o));
      case Jt:
        return '"' + $0(t) + '"';
      default:
        throw new rr("impossible error: invalid scalar style");
    }
  }();
}
function _a(e, t) {
  const n = Su(e) ? String(t) : "", r = e[e.length - 1] === `
`, o = r && (e[e.length - 2] === `
` || e === `
`) ? "+" : r ? "" : "-";
  return n + o + `
`;
}
function va(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function D0(e, t) {
  const n = /(\n+)([^\n]*)/g;
  let r = function() {
    let a = e.indexOf(`
`);
    return a = a !== -1 ? a : e.length, n.lastIndex = a, Aa(e.slice(0, a), t);
  }(), i = e[0] === `
` || e[0] === " ", o, s;
  for (; s = n.exec(e); ) {
    const a = s[1], c = s[2];
    o = c[0] === " ", r += a + (!i && !o && c !== "" ? `
` : "") + Aa(c, t), i = o;
  }
  return r;
}
function Aa(e, t) {
  if (e === "" || e[0] === " ") return e;
  const n = / [^ ]/g;
  let r, i = 0, o, s = 0, a = 0, c = "";
  for (; r = n.exec(e); )
    a = r.index, a - i > t && (o = s > i ? s : a, c += `
` + e.slice(i, o), i = o + 1), s = a;
  return c += `
`, e.length - i > t && s > i ? c += e.slice(i, s) + `
` + e.slice(s + 1) : c += e.slice(i), c.slice(1);
}
function $0(e) {
  let t = "", n = 0;
  for (let r = 0; r < e.length; n >= 65536 ? r += 2 : r++) {
    n = On(e, r);
    const i = Se[n];
    !i && qn(n) ? (t += e[r], n >= 65536 && (t += e[r + 1])) : t += i || S0(n);
  }
  return t;
}
function F0(e, t, n) {
  let r = "";
  const i = e.tag;
  for (let o = 0, s = n.length; o < s; o += 1) {
    let a = n[o];
    e.replacer && (a = e.replacer.call(n, String(o), a)), (ot(e, t, a, !1, !1) || typeof a > "u" && ot(e, t, null, !1, !1)) && (r !== "" && (r += "," + (e.condenseFlow ? "" : " ")), r += e.dump);
  }
  e.tag = i, e.dump = "[" + r + "]";
}
function Ta(e, t, n, r) {
  let i = "";
  const o = e.tag;
  for (let s = 0, a = n.length; s < a; s += 1) {
    let c = n[s];
    e.replacer && (c = e.replacer.call(n, String(s), c)), (ot(e, t + 1, c, !0, !0, !1, !0) || typeof c > "u" && ot(e, t + 1, null, !0, !0, !1, !0)) && ((!r || i !== "") && (i += vo(e, t)), e.dump && jn === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  }
  e.tag = o, e.dump = i || "[]";
}
function x0(e, t, n) {
  let r = "";
  const i = e.tag, o = Object.keys(n);
  for (let s = 0, a = o.length; s < a; s += 1) {
    let c = "";
    r !== "" && (c += ", "), e.condenseFlow && (c += '"');
    const m = o[s];
    let l = n[m];
    e.replacer && (l = e.replacer.call(n, m, l)), ot(e, t, m, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), ot(e, t, l, !1, !1) && (c += e.dump, r += c));
  }
  e.tag = i, e.dump = "{" + r + "}";
}
function L0(e, t, n, r) {
  let i = "";
  const o = e.tag, s = Object.keys(n);
  if (e.sortKeys === !0)
    s.sort();
  else if (typeof e.sortKeys == "function")
    s.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new rr("sortKeys must be a boolean or a function");
  for (let a = 0, c = s.length; a < c; a += 1) {
    let m = "";
    (!r || i !== "") && (m += vo(e, t));
    const l = s[a];
    let f = n[l];
    if (e.replacer && (f = e.replacer.call(n, l, f)), !ot(e, t + 1, l, !0, !0, !0))
      continue;
    const h = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024;
    h && (e.dump && jn === e.dump.charCodeAt(0) ? m += "?" : m += "? "), m += e.dump, h && (m += vo(e, t)), ot(e, t + 1, f, !0, h) && (e.dump && jn === e.dump.charCodeAt(0) ? m += ":" : m += ": ", m += e.dump, i += m);
  }
  e.tag = o, e.dump = i || "{}";
}
function Sa(e, t, n) {
  const r = n ? e.explicitTypes : e.implicitTypes;
  for (let i = 0, o = r.length; i < o; i += 1) {
    const s = r[i];
    if ((s.instanceOf || s.predicate) && (!s.instanceOf || typeof t == "object" && t instanceof s.instanceOf) && (!s.predicate || s.predicate(t))) {
      if (n ? s.multi && s.representName ? e.tag = s.representName(t) : e.tag = s.tag : e.tag = "?", s.represent) {
        const a = e.styleMap[s.tag] || s.defaultStyle;
        let c;
        if (Eu.call(s.represent) === "[object Function]")
          c = s.represent(t, a);
        else if (yu.call(s.represent, a))
          c = s.represent[a](t, a);
        else
          throw new rr("!<" + s.tag + '> tag resolver accepts not "' + a + '" style');
        e.dump = c;
      }
      return !0;
    }
  }
  return !1;
}
function ot(e, t, n, r, i, o, s) {
  e.tag = null, e.dump = n, Sa(e, n, !1) || Sa(e, n, !0);
  const a = Eu.call(e.dump), c = r;
  r && (r = e.flowLevel < 0 || e.flowLevel > t);
  const m = a === "[object Object]" || a === "[object Array]";
  let l, f;
  if (m && (l = e.duplicates.indexOf(n), f = l !== -1), (e.tag !== null && e.tag !== "?" || f || e.indent !== 2 && t > 0) && (i = !1), f && e.usedDuplicates[l])
    e.dump = "*ref_" + l;
  else {
    if (m && f && !e.usedDuplicates[l] && (e.usedDuplicates[l] = !0), a === "[object Object]")
      r && Object.keys(e.dump).length !== 0 ? (L0(e, t, e.dump, i), f && (e.dump = "&ref_" + l + e.dump)) : (x0(e, t, e.dump), f && (e.dump = "&ref_" + l + " " + e.dump));
    else if (a === "[object Array]")
      r && e.dump.length !== 0 ? (e.noArrayIndent && !s && t > 0 ? Ta(e, t - 1, e.dump, i) : Ta(e, t, e.dump, i), f && (e.dump = "&ref_" + l + e.dump)) : (F0(e, t, e.dump), f && (e.dump = "&ref_" + l + " " + e.dump));
    else if (a === "[object String]")
      e.tag !== "?" && P0(e, e.dump, t, o, c);
    else {
      if (a === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new rr("unacceptable kind of an object to dump " + a);
    }
    if (e.tag !== null && e.tag !== "?") {
      let h = encodeURI(
        e.tag[0] === "!" ? e.tag.slice(1) : e.tag
      ).replace(/!/g, "%21");
      e.tag[0] === "!" ? h = "!" + h : h.slice(0, 18) === "tag:yaml.org,2002:" ? h = "!!" + h.slice(18) : h = "!<" + h + ">", e.dump = h + " " + e.dump;
    }
  }
  return !0;
}
function U0(e, t) {
  const n = [], r = [];
  To(e, n, r);
  const i = r.length;
  for (let o = 0; o < i; o += 1)
    t.duplicates.push(n[r[o]]);
  t.usedDuplicates = new Array(i);
}
function To(e, t, n) {
  if (e !== null && typeof e == "object") {
    const r = t.indexOf(e);
    if (r !== -1)
      n.indexOf(r) === -1 && n.push(r);
    else if (t.push(e), Array.isArray(e))
      for (let i = 0, o = e.length; i < o; i += 1)
        To(e[i], t, n);
    else {
      const i = Object.keys(e);
      for (let o = 0, s = i.length; o < s; o += 1)
        To(e[i[o]], t, n);
    }
  }
}
function k0(e, t) {
  t = t || {};
  const n = new C0(t);
  n.noRefs || U0(e, n);
  let r = e;
  return n.replacer && (r = n.replacer.call({ "": r }, "", r)), ot(n, 0, r, !0, !0) ? n.dump + `
` : "";
}
gu.dump = k0;
const Ou = Go, M0 = gu;
function Ko(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
ye.Type = Pe;
ye.Schema = kc;
ye.FAILSAFE_SCHEMA = Hc;
ye.JSON_SCHEMA = zc;
ye.CORE_SCHEMA = Xc;
ye.DEFAULT_SCHEMA = Wo;
ye.load = Ou.load;
ye.loadAll = Ou.loadAll;
ye.dump = M0.dump;
ye.YAMLException = nr;
ye.types = {
  binary: eu,
  float: Yc,
  map: jc,
  null: qc,
  pairs: nu,
  set: ru,
  timestamp: Qc,
  bool: Gc,
  int: Vc,
  merge: Zc,
  omap: tu,
  seq: Bc,
  str: Mc
};
ye.safeLoad = Ko("safeLoad", "load");
ye.safeLoadAll = Ko("safeLoadAll", "loadAll");
ye.safeDump = Ko("safeDump", "dump");
var si = {};
Object.defineProperty(si, "__esModule", { value: !0 });
si.Lazy = void 0;
class B0 {
  constructor(t) {
    this._value = null, this.creator = t;
  }
  get hasValue() {
    return this.creator == null;
  }
  get value() {
    if (this.creator == null)
      return this._value;
    const t = this.creator();
    return this.value = t, t;
  }
  set value(t) {
    this._value = t, this.creator = null;
  }
}
si.Lazy = B0;
var So = { exports: {} };
const j0 = "2.0.0", Iu = 256, H0 = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, q0 = 16, G0 = Iu - 6, V0 = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var ai = {
  MAX_LENGTH: Iu,
  MAX_SAFE_COMPONENT_LENGTH: q0,
  MAX_SAFE_BUILD_LENGTH: G0,
  MAX_SAFE_INTEGER: H0,
  RELEASE_TYPES: V0,
  SEMVER_SPEC_VERSION: j0,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const W0 = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var li = W0;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: n,
    MAX_SAFE_BUILD_LENGTH: r,
    MAX_LENGTH: i
  } = ai, o = li;
  t = e.exports = {};
  const s = t.re = [], a = t.safeRe = [], c = t.src = [], m = t.safeSrc = [], l = t.t = {};
  let f = 0;
  const h = "[a-zA-Z0-9-]", g = [
    ["\\s", 1],
    ["\\d", i],
    [h, r]
  ], w = (A) => {
    for (const [T, O] of g)
      A = A.split(`${T}*`).join(`${T}{0,${O}}`).split(`${T}+`).join(`${T}{1,${O}}`);
    return A;
  }, E = (A, T, O) => {
    const $ = w(T), B = f++;
    o(A, B, T), l[A] = B, c[B] = T, m[B] = $, s[B] = new RegExp(T, O ? "g" : void 0), a[B] = new RegExp($, O ? "g" : void 0);
  };
  E("NUMERICIDENTIFIER", "0|[1-9]\\d*"), E("NUMERICIDENTIFIERLOOSE", "\\d+"), E("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${h}*`), E("MAINVERSION", `(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})`), E("MAINVERSIONLOOSE", `(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})`), E("PRERELEASEIDENTIFIER", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIER]})`), E("PRERELEASEIDENTIFIERLOOSE", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIERLOOSE]})`), E("PRERELEASE", `(?:-(${c[l.PRERELEASEIDENTIFIER]}(?:\\.${c[l.PRERELEASEIDENTIFIER]})*))`), E("PRERELEASELOOSE", `(?:-?(${c[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[l.PRERELEASEIDENTIFIERLOOSE]})*))`), E("BUILDIDENTIFIER", `${h}+`), E("BUILD", `(?:\\+(${c[l.BUILDIDENTIFIER]}(?:\\.${c[l.BUILDIDENTIFIER]})*))`), E("FULLPLAIN", `v?${c[l.MAINVERSION]}${c[l.PRERELEASE]}?${c[l.BUILD]}?`), E("FULL", `^${c[l.FULLPLAIN]}$`), E("LOOSEPLAIN", `[v=\\s]*${c[l.MAINVERSIONLOOSE]}${c[l.PRERELEASELOOSE]}?${c[l.BUILD]}?`), E("LOOSE", `^${c[l.LOOSEPLAIN]}$`), E("GTLT", "((?:<|>)?=?)"), E("XRANGEIDENTIFIERLOOSE", `${c[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), E("XRANGEIDENTIFIER", `${c[l.NUMERICIDENTIFIER]}|x|X|\\*`), E("XRANGEPLAIN", `[v=\\s]*(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:${c[l.PRERELEASE]})?${c[l.BUILD]}?)?)?`), E("XRANGEPLAINLOOSE", `[v=\\s]*(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:${c[l.PRERELEASELOOSE]})?${c[l.BUILD]}?)?)?`), E("XRANGE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAIN]}$`), E("XRANGELOOSE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAINLOOSE]}$`), E("COERCEPLAIN", `(^|[^\\d])(\\d{1,${n}})(?:\\.(\\d{1,${n}}))?(?:\\.(\\d{1,${n}}))?`), E("COERCE", `${c[l.COERCEPLAIN]}(?:$|[^\\d])`), E("COERCEFULL", c[l.COERCEPLAIN] + `(?:${c[l.PRERELEASE]})?(?:${c[l.BUILD]})?(?:$|[^\\d])`), E("COERCERTL", c[l.COERCE], !0), E("COERCERTLFULL", c[l.COERCEFULL], !0), E("LONETILDE", "(?:~>?)"), E("TILDETRIM", `(\\s*)${c[l.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", E("TILDE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAIN]}$`), E("TILDELOOSE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAINLOOSE]}$`), E("LONECARET", "(?:\\^)"), E("CARETTRIM", `(\\s*)${c[l.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", E("CARET", `^${c[l.LONECARET]}${c[l.XRANGEPLAIN]}$`), E("CARETLOOSE", `^${c[l.LONECARET]}${c[l.XRANGEPLAINLOOSE]}$`), E("COMPARATORLOOSE", `^${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]})$|^$`), E("COMPARATOR", `^${c[l.GTLT]}\\s*(${c[l.FULLPLAIN]})$|^$`), E("COMPARATORTRIM", `(\\s*)${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]}|${c[l.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", E("HYPHENRANGE", `^\\s*(${c[l.XRANGEPLAIN]})\\s+-\\s+(${c[l.XRANGEPLAIN]})\\s*$`), E("HYPHENRANGELOOSE", `^\\s*(${c[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[l.XRANGEPLAINLOOSE]})\\s*$`), E("STAR", "(<|>)?=?\\s*\\*"), E("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), E("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(So, So.exports);
var ir = So.exports;
const Y0 = Object.freeze({ loose: !0 }), z0 = Object.freeze({}), X0 = (e) => e ? typeof e != "object" ? Y0 : e : z0;
var Jo = X0;
const ba = /^[0-9]+$/, Nu = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const n = ba.test(e), r = ba.test(t);
  return n && r && (e = +e, t = +t), e === t ? 0 : n && !r ? -1 : r && !n ? 1 : e < t ? -1 : 1;
}, K0 = (e, t) => Nu(t, e);
var Pu = {
  compareIdentifiers: Nu,
  rcompareIdentifiers: K0
};
const Sr = li, { MAX_LENGTH: Ca, MAX_SAFE_INTEGER: br } = ai, { safeRe: Cr, t: Rr } = ir, J0 = Jo, { compareIdentifiers: ji } = Pu;
let Q0 = class Je {
  constructor(t, n) {
    if (n = J0(n), t instanceof Je) {
      if (t.loose === !!n.loose && t.includePrerelease === !!n.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Ca)
      throw new TypeError(
        `version is longer than ${Ca} characters`
      );
    Sr("SemVer", t, n), this.options = n, this.loose = !!n.loose, this.includePrerelease = !!n.includePrerelease;
    const r = t.trim().match(n.loose ? Cr[Rr.LOOSE] : Cr[Rr.FULL]);
    if (!r)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +r[1], this.minor = +r[2], this.patch = +r[3], this.major > br || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > br || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > br || this.patch < 0)
      throw new TypeError("Invalid patch version");
    r[4] ? this.prerelease = r[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const o = +i;
        if (o >= 0 && o < br)
          return o;
      }
      return i;
    }) : this.prerelease = [], this.build = r[5] ? r[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (Sr("SemVer.compare", this.version, this.options, t), !(t instanceof Je)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new Je(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof Je || (t = new Je(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof Je || (t = new Je(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let n = 0;
    do {
      const r = this.prerelease[n], i = t.prerelease[n];
      if (Sr("prerelease compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return ji(r, i);
    } while (++n);
  }
  compareBuild(t) {
    t instanceof Je || (t = new Je(t, this.options));
    let n = 0;
    do {
      const r = this.build[n], i = t.build[n];
      if (Sr("build compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return ji(r, i);
    } while (++n);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, n, r) {
    if (t.startsWith("pre")) {
      if (!n && r === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (n) {
        const i = `-${n}`.match(this.options.loose ? Cr[Rr.PRERELEASELOOSE] : Cr[Rr.PRERELEASE]);
        if (!i || i[1] !== n)
          throw new Error(`invalid identifier: ${n}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", n, r);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", n, r);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", n, r), this.inc("pre", n, r);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", n, r), this.inc("pre", n, r);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const i = Number(r) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [i];
        else {
          let o = this.prerelease.length;
          for (; --o >= 0; )
            typeof this.prerelease[o] == "number" && (this.prerelease[o]++, o = -2);
          if (o === -1) {
            if (n === this.prerelease.join(".") && r === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(i);
          }
        }
        if (n) {
          let o = [n, i];
          r === !1 && (o = [n]), ji(this.prerelease[0], n) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var De = Q0;
const Ra = De, Z0 = (e, t, n = !1) => {
  if (e instanceof Ra)
    return e;
  try {
    return new Ra(e, t);
  } catch (r) {
    if (!n)
      return null;
    throw r;
  }
};
var hn = Z0;
const eE = hn, tE = (e, t) => {
  const n = eE(e, t);
  return n ? n.version : null;
};
var nE = tE;
const rE = hn, iE = (e, t) => {
  const n = rE(e.trim().replace(/^[=v]+/, ""), t);
  return n ? n.version : null;
};
var oE = iE;
const Oa = De, sE = (e, t, n, r, i) => {
  typeof n == "string" && (i = r, r = n, n = void 0);
  try {
    return new Oa(
      e instanceof Oa ? e.version : e,
      n
    ).inc(t, r, i).version;
  } catch {
    return null;
  }
};
var aE = sE;
const Ia = hn, lE = (e, t) => {
  const n = Ia(e, null, !0), r = Ia(t, null, !0), i = n.compare(r);
  if (i === 0)
    return null;
  const o = i > 0, s = o ? n : r, a = o ? r : n, c = !!s.prerelease.length;
  if (!!a.prerelease.length && !c) {
    if (!a.patch && !a.minor)
      return "major";
    if (a.compareMain(s) === 0)
      return a.minor && !a.patch ? "minor" : "patch";
  }
  const l = c ? "pre" : "";
  return n.major !== r.major ? l + "major" : n.minor !== r.minor ? l + "minor" : n.patch !== r.patch ? l + "patch" : "prerelease";
};
var cE = lE;
const uE = De, fE = (e, t) => new uE(e, t).major;
var dE = fE;
const hE = De, pE = (e, t) => new hE(e, t).minor;
var mE = pE;
const gE = De, EE = (e, t) => new gE(e, t).patch;
var yE = EE;
const wE = hn, _E = (e, t) => {
  const n = wE(e, t);
  return n && n.prerelease.length ? n.prerelease : null;
};
var vE = _E;
const Na = De, AE = (e, t, n) => new Na(e, n).compare(new Na(t, n));
var Ye = AE;
const TE = Ye, SE = (e, t, n) => TE(t, e, n);
var bE = SE;
const CE = Ye, RE = (e, t) => CE(e, t, !0);
var OE = RE;
const Pa = De, IE = (e, t, n) => {
  const r = new Pa(e, n), i = new Pa(t, n);
  return r.compare(i) || r.compareBuild(i);
};
var Qo = IE;
const NE = Qo, PE = (e, t) => e.sort((n, r) => NE(n, r, t));
var DE = PE;
const $E = Qo, FE = (e, t) => e.sort((n, r) => $E(r, n, t));
var xE = FE;
const LE = Ye, UE = (e, t, n) => LE(e, t, n) > 0;
var ci = UE;
const kE = Ye, ME = (e, t, n) => kE(e, t, n) < 0;
var Zo = ME;
const BE = Ye, jE = (e, t, n) => BE(e, t, n) === 0;
var Du = jE;
const HE = Ye, qE = (e, t, n) => HE(e, t, n) !== 0;
var $u = qE;
const GE = Ye, VE = (e, t, n) => GE(e, t, n) >= 0;
var es = VE;
const WE = Ye, YE = (e, t, n) => WE(e, t, n) <= 0;
var ts = YE;
const zE = Du, XE = $u, KE = ci, JE = es, QE = Zo, ZE = ts, ey = (e, t, n, r) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e === n;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e !== n;
    case "":
    case "=":
    case "==":
      return zE(e, n, r);
    case "!=":
      return XE(e, n, r);
    case ">":
      return KE(e, n, r);
    case ">=":
      return JE(e, n, r);
    case "<":
      return QE(e, n, r);
    case "<=":
      return ZE(e, n, r);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Fu = ey;
const ty = De, ny = hn, { safeRe: Or, t: Ir } = ir, ry = (e, t) => {
  if (e instanceof ty)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let n = null;
  if (!t.rtl)
    n = e.match(t.includePrerelease ? Or[Ir.COERCEFULL] : Or[Ir.COERCE]);
  else {
    const c = t.includePrerelease ? Or[Ir.COERCERTLFULL] : Or[Ir.COERCERTL];
    let m;
    for (; (m = c.exec(e)) && (!n || n.index + n[0].length !== e.length); )
      (!n || m.index + m[0].length !== n.index + n[0].length) && (n = m), c.lastIndex = m.index + m[1].length + m[2].length;
    c.lastIndex = -1;
  }
  if (n === null)
    return null;
  const r = n[2], i = n[3] || "0", o = n[4] || "0", s = t.includePrerelease && n[5] ? `-${n[5]}` : "", a = t.includePrerelease && n[6] ? `+${n[6]}` : "";
  return ny(`${r}.${i}.${o}${s}${a}`, t);
};
var iy = ry;
class oy {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const n = this.map.get(t);
    if (n !== void 0)
      return this.map.delete(t), this.map.set(t, n), n;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, n) {
    if (!this.delete(t) && n !== void 0) {
      if (this.map.size >= this.max) {
        const i = this.map.keys().next().value;
        this.delete(i);
      }
      this.map.set(t, n);
    }
    return this;
  }
}
var sy = oy, Hi, Da;
function ze() {
  if (Da) return Hi;
  Da = 1;
  const e = /\s+/g;
  class t {
    constructor(R, P) {
      if (P = i(P), R instanceof t)
        return R.loose === !!P.loose && R.includePrerelease === !!P.includePrerelease ? R : new t(R.raw, P);
      if (R instanceof o)
        return this.raw = R.value, this.set = [[R]], this.formatted = void 0, this;
      if (this.options = P, this.loose = !!P.loose, this.includePrerelease = !!P.includePrerelease, this.raw = R.trim().replace(e, " "), this.set = this.raw.split("||").map((C) => this.parseRange(C.trim())).filter((C) => C.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const C = this.set[0];
        if (this.set = this.set.filter((D) => !E(D[0])), this.set.length === 0)
          this.set = [C];
        else if (this.set.length > 1) {
          for (const D of this.set)
            if (D.length === 1 && A(D[0])) {
              this.set = [D];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let R = 0; R < this.set.length; R++) {
          R > 0 && (this.formatted += "||");
          const P = this.set[R];
          for (let C = 0; C < P.length; C++)
            C > 0 && (this.formatted += " "), this.formatted += P[C].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(R) {
      const C = ((this.options.includePrerelease && g) | (this.options.loose && w)) + ":" + R, D = r.get(C);
      if (D)
        return D;
      const N = this.options.loose, k = N ? c[m.HYPHENRANGELOOSE] : c[m.HYPHENRANGE];
      R = R.replace(k, Y(this.options.includePrerelease)), s("hyphen replace", R), R = R.replace(c[m.COMPARATORTRIM], l), s("comparator trim", R), R = R.replace(c[m.TILDETRIM], f), s("tilde trim", R), R = R.replace(c[m.CARETTRIM], h), s("caret trim", R);
      let G = R.split(" ").map((M) => O(M, this.options)).join(" ").split(/\s+/).map((M) => H(M, this.options));
      N && (G = G.filter((M) => (s("loose invalid filter", M, this.options), !!M.match(c[m.COMPARATORLOOSE])))), s("range list", G);
      const F = /* @__PURE__ */ new Map(), z = G.map((M) => new o(M, this.options));
      for (const M of z) {
        if (E(M))
          return [M];
        F.set(M.value, M);
      }
      F.size > 1 && F.has("") && F.delete("");
      const ce = [...F.values()];
      return r.set(C, ce), ce;
    }
    intersects(R, P) {
      if (!(R instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((C) => T(C, P) && R.set.some((D) => T(D, P) && C.every((N) => D.every((k) => N.intersects(k, P)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(R) {
      if (!R)
        return !1;
      if (typeof R == "string")
        try {
          R = new a(R, this.options);
        } catch {
          return !1;
        }
      for (let P = 0; P < this.set.length; P++)
        if (ee(this.set[P], R, this.options))
          return !0;
      return !1;
    }
  }
  Hi = t;
  const n = sy, r = new n(), i = Jo, o = ui(), s = li, a = De, {
    safeRe: c,
    t: m,
    comparatorTrimReplace: l,
    tildeTrimReplace: f,
    caretTrimReplace: h
  } = ir, { FLAG_INCLUDE_PRERELEASE: g, FLAG_LOOSE: w } = ai, E = (I) => I.value === "<0.0.0-0", A = (I) => I.value === "", T = (I, R) => {
    let P = !0;
    const C = I.slice();
    let D = C.pop();
    for (; P && C.length; )
      P = C.every((N) => D.intersects(N, R)), D = C.pop();
    return P;
  }, O = (I, R) => (I = I.replace(c[m.BUILD], ""), s("comp", I, R), I = J(I, R), s("caret", I), I = B(I, R), s("tildes", I), I = oe(I, R), s("xrange", I), I = y(I, R), s("stars", I), I), $ = (I) => !I || I.toLowerCase() === "x" || I === "*", B = (I, R) => I.trim().split(/\s+/).map((P) => q(P, R)).join(" "), q = (I, R) => {
    const P = R.loose ? c[m.TILDELOOSE] : c[m.TILDE];
    return I.replace(P, (C, D, N, k, G) => {
      s("tilde", I, C, D, N, k, G);
      let F;
      return $(D) ? F = "" : $(N) ? F = `>=${D}.0.0 <${+D + 1}.0.0-0` : $(k) ? F = `>=${D}.${N}.0 <${D}.${+N + 1}.0-0` : G ? (s("replaceTilde pr", G), F = `>=${D}.${N}.${k}-${G} <${D}.${+N + 1}.0-0`) : F = `>=${D}.${N}.${k} <${D}.${+N + 1}.0-0`, s("tilde return", F), F;
    });
  }, J = (I, R) => I.trim().split(/\s+/).map((P) => Q(P, R)).join(" "), Q = (I, R) => {
    s("caret", I, R);
    const P = R.loose ? c[m.CARETLOOSE] : c[m.CARET], C = R.includePrerelease ? "-0" : "";
    return I.replace(P, (D, N, k, G, F) => {
      s("caret", I, D, N, k, G, F);
      let z;
      return $(N) ? z = "" : $(k) ? z = `>=${N}.0.0${C} <${+N + 1}.0.0-0` : $(G) ? N === "0" ? z = `>=${N}.${k}.0${C} <${N}.${+k + 1}.0-0` : z = `>=${N}.${k}.0${C} <${+N + 1}.0.0-0` : F ? (s("replaceCaret pr", F), N === "0" ? k === "0" ? z = `>=${N}.${k}.${G}-${F} <${N}.${k}.${+G + 1}-0` : z = `>=${N}.${k}.${G}-${F} <${N}.${+k + 1}.0-0` : z = `>=${N}.${k}.${G}-${F} <${+N + 1}.0.0-0`) : (s("no pr"), N === "0" ? k === "0" ? z = `>=${N}.${k}.${G}${C} <${N}.${k}.${+G + 1}-0` : z = `>=${N}.${k}.${G}${C} <${N}.${+k + 1}.0-0` : z = `>=${N}.${k}.${G} <${+N + 1}.0.0-0`), s("caret return", z), z;
    });
  }, oe = (I, R) => (s("replaceXRanges", I, R), I.split(/\s+/).map((P) => U(P, R)).join(" ")), U = (I, R) => {
    I = I.trim();
    const P = R.loose ? c[m.XRANGELOOSE] : c[m.XRANGE];
    return I.replace(P, (C, D, N, k, G, F) => {
      s("xRange", I, C, D, N, k, G, F);
      const z = $(N), ce = z || $(k), M = ce || $(G), we = M;
      return D === "=" && we && (D = ""), F = R.includePrerelease ? "-0" : "", z ? D === ">" || D === "<" ? C = "<0.0.0-0" : C = "*" : D && we ? (ce && (k = 0), G = 0, D === ">" ? (D = ">=", ce ? (N = +N + 1, k = 0, G = 0) : (k = +k + 1, G = 0)) : D === "<=" && (D = "<", ce ? N = +N + 1 : k = +k + 1), D === "<" && (F = "-0"), C = `${D + N}.${k}.${G}${F}`) : ce ? C = `>=${N}.0.0${F} <${+N + 1}.0.0-0` : M && (C = `>=${N}.${k}.0${F} <${N}.${+k + 1}.0-0`), s("xRange return", C), C;
    });
  }, y = (I, R) => (s("replaceStars", I, R), I.trim().replace(c[m.STAR], "")), H = (I, R) => (s("replaceGTE0", I, R), I.trim().replace(c[R.includePrerelease ? m.GTE0PRE : m.GTE0], "")), Y = (I) => (R, P, C, D, N, k, G, F, z, ce, M, we) => ($(C) ? P = "" : $(D) ? P = `>=${C}.0.0${I ? "-0" : ""}` : $(N) ? P = `>=${C}.${D}.0${I ? "-0" : ""}` : k ? P = `>=${P}` : P = `>=${P}${I ? "-0" : ""}`, $(z) ? F = "" : $(ce) ? F = `<${+z + 1}.0.0-0` : $(M) ? F = `<${z}.${+ce + 1}.0-0` : we ? F = `<=${z}.${ce}.${M}-${we}` : I ? F = `<${z}.${ce}.${+M + 1}-0` : F = `<=${F}`, `${P} ${F}`.trim()), ee = (I, R, P) => {
    for (let C = 0; C < I.length; C++)
      if (!I[C].test(R))
        return !1;
    if (R.prerelease.length && !P.includePrerelease) {
      for (let C = 0; C < I.length; C++)
        if (s(I[C].semver), I[C].semver !== o.ANY && I[C].semver.prerelease.length > 0) {
          const D = I[C].semver;
          if (D.major === R.major && D.minor === R.minor && D.patch === R.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Hi;
}
var qi, $a;
function ui() {
  if ($a) return qi;
  $a = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(l, f) {
      if (f = n(f), l instanceof t) {
        if (l.loose === !!f.loose)
          return l;
        l = l.value;
      }
      l = l.trim().split(/\s+/).join(" "), s("comparator", l, f), this.options = f, this.loose = !!f.loose, this.parse(l), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, s("comp", this);
    }
    parse(l) {
      const f = this.options.loose ? r[i.COMPARATORLOOSE] : r[i.COMPARATOR], h = l.match(f);
      if (!h)
        throw new TypeError(`Invalid comparator: ${l}`);
      this.operator = h[1] !== void 0 ? h[1] : "", this.operator === "=" && (this.operator = ""), h[2] ? this.semver = new a(h[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(l) {
      if (s("Comparator.test", l, this.options.loose), this.semver === e || l === e)
        return !0;
      if (typeof l == "string")
        try {
          l = new a(l, this.options);
        } catch {
          return !1;
        }
      return o(l, this.operator, this.semver, this.options);
    }
    intersects(l, f) {
      if (!(l instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(l.value, f).test(this.value) : l.operator === "" ? l.value === "" ? !0 : new c(this.value, f).test(l.semver) : (f = n(f), f.includePrerelease && (this.value === "<0.0.0-0" || l.value === "<0.0.0-0") || !f.includePrerelease && (this.value.startsWith("<0.0.0") || l.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && l.operator.startsWith(">") || this.operator.startsWith("<") && l.operator.startsWith("<") || this.semver.version === l.semver.version && this.operator.includes("=") && l.operator.includes("=") || o(this.semver, "<", l.semver, f) && this.operator.startsWith(">") && l.operator.startsWith("<") || o(this.semver, ">", l.semver, f) && this.operator.startsWith("<") && l.operator.startsWith(">")));
    }
  }
  qi = t;
  const n = Jo, { safeRe: r, t: i } = ir, o = Fu, s = li, a = De, c = ze();
  return qi;
}
const ay = ze(), ly = (e, t, n) => {
  try {
    t = new ay(t, n);
  } catch {
    return !1;
  }
  return t.test(e);
};
var fi = ly;
const cy = ze(), uy = (e, t) => new cy(e, t).set.map((n) => n.map((r) => r.value).join(" ").trim().split(" "));
var fy = uy;
const dy = De, hy = ze(), py = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new hy(t, n);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    o.test(s) && (!r || i.compare(s) === -1) && (r = s, i = new dy(r, n));
  }), r;
};
var my = py;
const gy = De, Ey = ze(), yy = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new Ey(t, n);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    o.test(s) && (!r || i.compare(s) === 1) && (r = s, i = new gy(r, n));
  }), r;
};
var wy = yy;
const Gi = De, _y = ze(), Fa = ci, vy = (e, t) => {
  e = new _y(e, t);
  let n = new Gi("0.0.0");
  if (e.test(n) || (n = new Gi("0.0.0-0"), e.test(n)))
    return n;
  n = null;
  for (let r = 0; r < e.set.length; ++r) {
    const i = e.set[r];
    let o = null;
    i.forEach((s) => {
      const a = new Gi(s.semver.version);
      switch (s.operator) {
        case ">":
          a.prerelease.length === 0 ? a.patch++ : a.prerelease.push(0), a.raw = a.format();
        case "":
        case ">=":
          (!o || Fa(a, o)) && (o = a);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${s.operator}`);
      }
    }), o && (!n || Fa(n, o)) && (n = o);
  }
  return n && e.test(n) ? n : null;
};
var Ay = vy;
const Ty = ze(), Sy = (e, t) => {
  try {
    return new Ty(e, t).range || "*";
  } catch {
    return null;
  }
};
var by = Sy;
const Cy = De, xu = ui(), { ANY: Ry } = xu, Oy = ze(), Iy = fi, xa = ci, La = Zo, Ny = ts, Py = es, Dy = (e, t, n, r) => {
  e = new Cy(e, r), t = new Oy(t, r);
  let i, o, s, a, c;
  switch (n) {
    case ">":
      i = xa, o = Ny, s = La, a = ">", c = ">=";
      break;
    case "<":
      i = La, o = Py, s = xa, a = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (Iy(e, t, r))
    return !1;
  for (let m = 0; m < t.set.length; ++m) {
    const l = t.set[m];
    let f = null, h = null;
    if (l.forEach((g) => {
      g.semver === Ry && (g = new xu(">=0.0.0")), f = f || g, h = h || g, i(g.semver, f.semver, r) ? f = g : s(g.semver, h.semver, r) && (h = g);
    }), f.operator === a || f.operator === c || (!h.operator || h.operator === a) && o(e, h.semver))
      return !1;
    if (h.operator === c && s(e, h.semver))
      return !1;
  }
  return !0;
};
var ns = Dy;
const $y = ns, Fy = (e, t, n) => $y(e, t, ">", n);
var xy = Fy;
const Ly = ns, Uy = (e, t, n) => Ly(e, t, "<", n);
var ky = Uy;
const Ua = ze(), My = (e, t, n) => (e = new Ua(e, n), t = new Ua(t, n), e.intersects(t, n));
var By = My;
const jy = fi, Hy = Ye;
var qy = (e, t, n) => {
  const r = [];
  let i = null, o = null;
  const s = e.sort((l, f) => Hy(l, f, n));
  for (const l of s)
    jy(l, t, n) ? (o = l, i || (i = l)) : (o && r.push([i, o]), o = null, i = null);
  i && r.push([i, null]);
  const a = [];
  for (const [l, f] of r)
    l === f ? a.push(l) : !f && l === s[0] ? a.push("*") : f ? l === s[0] ? a.push(`<=${f}`) : a.push(`${l} - ${f}`) : a.push(`>=${l}`);
  const c = a.join(" || "), m = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < m.length ? c : t;
};
const ka = ze(), rs = ui(), { ANY: Vi } = rs, Sn = fi, is = Ye, Gy = (e, t, n = {}) => {
  if (e === t)
    return !0;
  e = new ka(e, n), t = new ka(t, n);
  let r = !1;
  e: for (const i of e.set) {
    for (const o of t.set) {
      const s = Wy(i, o, n);
      if (r = r || s !== null, s)
        continue e;
    }
    if (r)
      return !1;
  }
  return !0;
}, Vy = [new rs(">=0.0.0-0")], Ma = [new rs(">=0.0.0")], Wy = (e, t, n) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Vi) {
    if (t.length === 1 && t[0].semver === Vi)
      return !0;
    n.includePrerelease ? e = Vy : e = Ma;
  }
  if (t.length === 1 && t[0].semver === Vi) {
    if (n.includePrerelease)
      return !0;
    t = Ma;
  }
  const r = /* @__PURE__ */ new Set();
  let i, o;
  for (const g of e)
    g.operator === ">" || g.operator === ">=" ? i = Ba(i, g, n) : g.operator === "<" || g.operator === "<=" ? o = ja(o, g, n) : r.add(g.semver);
  if (r.size > 1)
    return null;
  let s;
  if (i && o) {
    if (s = is(i.semver, o.semver, n), s > 0)
      return null;
    if (s === 0 && (i.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const g of r) {
    if (i && !Sn(g, String(i), n) || o && !Sn(g, String(o), n))
      return null;
    for (const w of t)
      if (!Sn(g, String(w), n))
        return !1;
    return !0;
  }
  let a, c, m, l, f = o && !n.includePrerelease && o.semver.prerelease.length ? o.semver : !1, h = i && !n.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  f && f.prerelease.length === 1 && o.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const g of t) {
    if (l = l || g.operator === ">" || g.operator === ">=", m = m || g.operator === "<" || g.operator === "<=", i) {
      if (h && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === h.major && g.semver.minor === h.minor && g.semver.patch === h.patch && (h = !1), g.operator === ">" || g.operator === ">=") {
        if (a = Ba(i, g, n), a === g && a !== i)
          return !1;
      } else if (i.operator === ">=" && !Sn(i.semver, String(g), n))
        return !1;
    }
    if (o) {
      if (f && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === f.major && g.semver.minor === f.minor && g.semver.patch === f.patch && (f = !1), g.operator === "<" || g.operator === "<=") {
        if (c = ja(o, g, n), c === g && c !== o)
          return !1;
      } else if (o.operator === "<=" && !Sn(o.semver, String(g), n))
        return !1;
    }
    if (!g.operator && (o || i) && s !== 0)
      return !1;
  }
  return !(i && m && !o && s !== 0 || o && l && !i && s !== 0 || h || f);
}, Ba = (e, t, n) => {
  if (!e)
    return t;
  const r = is(e.semver, t.semver, n);
  return r > 0 ? e : r < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, ja = (e, t, n) => {
  if (!e)
    return t;
  const r = is(e.semver, t.semver, n);
  return r < 0 ? e : r > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var Yy = Gy;
const Wi = ir, Ha = ai, zy = De, qa = Pu, Xy = hn, Ky = nE, Jy = oE, Qy = aE, Zy = cE, ew = dE, tw = mE, nw = yE, rw = vE, iw = Ye, ow = bE, sw = OE, aw = Qo, lw = DE, cw = xE, uw = ci, fw = Zo, dw = Du, hw = $u, pw = es, mw = ts, gw = Fu, Ew = iy, yw = ui(), ww = ze(), _w = fi, vw = fy, Aw = my, Tw = wy, Sw = Ay, bw = by, Cw = ns, Rw = xy, Ow = ky, Iw = By, Nw = qy, Pw = Yy;
var Lu = {
  parse: Xy,
  valid: Ky,
  clean: Jy,
  inc: Qy,
  diff: Zy,
  major: ew,
  minor: tw,
  patch: nw,
  prerelease: rw,
  compare: iw,
  rcompare: ow,
  compareLoose: sw,
  compareBuild: aw,
  sort: lw,
  rsort: cw,
  gt: uw,
  lt: fw,
  eq: dw,
  neq: hw,
  gte: pw,
  lte: mw,
  cmp: gw,
  coerce: Ew,
  Comparator: yw,
  Range: ww,
  satisfies: _w,
  toComparators: vw,
  maxSatisfying: Aw,
  minSatisfying: Tw,
  minVersion: Sw,
  validRange: bw,
  outside: Cw,
  gtr: Rw,
  ltr: Ow,
  intersects: Iw,
  simplifyRange: Nw,
  subset: Pw,
  SemVer: zy,
  re: Wi.re,
  src: Wi.src,
  tokens: Wi.t,
  SEMVER_SPEC_VERSION: Ha.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Ha.RELEASE_TYPES,
  compareIdentifiers: qa.compareIdentifiers,
  rcompareIdentifiers: qa.rcompareIdentifiers
}, or = {}, zr = { exports: {} };
zr.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", i = 1, o = 2, s = 9007199254740991, a = "[object Arguments]", c = "[object Array]", m = "[object AsyncFunction]", l = "[object Boolean]", f = "[object Date]", h = "[object Error]", g = "[object Function]", w = "[object GeneratorFunction]", E = "[object Map]", A = "[object Number]", T = "[object Null]", O = "[object Object]", $ = "[object Promise]", B = "[object Proxy]", q = "[object RegExp]", J = "[object Set]", Q = "[object String]", oe = "[object Symbol]", U = "[object Undefined]", y = "[object WeakMap]", H = "[object ArrayBuffer]", Y = "[object DataView]", ee = "[object Float32Array]", I = "[object Float64Array]", R = "[object Int8Array]", P = "[object Int16Array]", C = "[object Int32Array]", D = "[object Uint8Array]", N = "[object Uint8ClampedArray]", k = "[object Uint16Array]", G = "[object Uint32Array]", F = /[\\^$.*+?()[\]{}|]/g, z = /^\[object .+?Constructor\]$/, ce = /^(?:0|[1-9]\d*)$/, M = {};
  M[ee] = M[I] = M[R] = M[P] = M[C] = M[D] = M[N] = M[k] = M[G] = !0, M[a] = M[c] = M[H] = M[l] = M[Y] = M[f] = M[h] = M[g] = M[E] = M[A] = M[O] = M[q] = M[J] = M[Q] = M[y] = !1;
  var we = typeof Re == "object" && Re && Re.Object === Object && Re, gn = typeof self == "object" && self && self.Object === Object && self, Me = we || gn || Function("return this")(), En = t && !t.nodeType && t, Gt = En && !0 && e && !e.nodeType && e, cr = Gt && Gt.exports === En, d = cr && we.process, u = function() {
    try {
      return d && d.binding && d.binding("util");
    } catch {
    }
  }(), S = u && u.isTypedArray;
  function _(p, v) {
    for (var b = -1, x = p == null ? 0 : p.length, K = 0, j = []; ++b < x; ) {
      var ie = p[b];
      v(ie, b, p) && (j[K++] = ie);
    }
    return j;
  }
  function W(p, v) {
    for (var b = -1, x = v.length, K = p.length; ++b < x; )
      p[K + b] = v[b];
    return p;
  }
  function te(p, v) {
    for (var b = -1, x = p == null ? 0 : p.length; ++b < x; )
      if (v(p[b], b, p))
        return !0;
    return !1;
  }
  function se(p, v) {
    for (var b = -1, x = Array(p); ++b < p; )
      x[b] = v(b);
    return x;
  }
  function _e(p) {
    return function(v) {
      return p(v);
    };
  }
  function ve(p, v) {
    return p.has(v);
  }
  function Be(p, v) {
    return p == null ? void 0 : p[v];
  }
  function ue(p) {
    var v = -1, b = Array(p.size);
    return p.forEach(function(x, K) {
      b[++v] = [K, x];
    }), b;
  }
  function je(p, v) {
    return function(b) {
      return p(v(b));
    };
  }
  function vi(p) {
    var v = -1, b = Array(p.size);
    return p.forEach(function(x) {
      b[++v] = x;
    }), b;
  }
  var ur = Array.prototype, yn = Function.prototype, bt = Object.prototype, Ai = Me["__core-js_shared__"], ds = yn.toString, Ke = bt.hasOwnProperty, hs = function() {
    var p = /[^.]+$/.exec(Ai && Ai.keys && Ai.keys.IE_PROTO || "");
    return p ? "Symbol(src)_1." + p : "";
  }(), ps = bt.toString, Zu = RegExp(
    "^" + ds.call(Ke).replace(F, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), ms = cr ? Me.Buffer : void 0, fr = Me.Symbol, gs = Me.Uint8Array, Es = bt.propertyIsEnumerable, ef = ur.splice, Ct = fr ? fr.toStringTag : void 0, ys = Object.getOwnPropertySymbols, tf = ms ? ms.isBuffer : void 0, nf = je(Object.keys, Object), Ti = Vt(Me, "DataView"), wn = Vt(Me, "Map"), Si = Vt(Me, "Promise"), bi = Vt(Me, "Set"), Ci = Vt(Me, "WeakMap"), _n = Vt(Object, "create"), rf = It(Ti), of = It(wn), sf = It(Si), af = It(bi), lf = It(Ci), ws = fr ? fr.prototype : void 0, Ri = ws ? ws.valueOf : void 0;
  function Rt(p) {
    var v = -1, b = p == null ? 0 : p.length;
    for (this.clear(); ++v < b; ) {
      var x = p[v];
      this.set(x[0], x[1]);
    }
  }
  function cf() {
    this.__data__ = _n ? _n(null) : {}, this.size = 0;
  }
  function uf(p) {
    var v = this.has(p) && delete this.__data__[p];
    return this.size -= v ? 1 : 0, v;
  }
  function ff(p) {
    var v = this.__data__;
    if (_n) {
      var b = v[p];
      return b === r ? void 0 : b;
    }
    return Ke.call(v, p) ? v[p] : void 0;
  }
  function df(p) {
    var v = this.__data__;
    return _n ? v[p] !== void 0 : Ke.call(v, p);
  }
  function hf(p, v) {
    var b = this.__data__;
    return this.size += this.has(p) ? 0 : 1, b[p] = _n && v === void 0 ? r : v, this;
  }
  Rt.prototype.clear = cf, Rt.prototype.delete = uf, Rt.prototype.get = ff, Rt.prototype.has = df, Rt.prototype.set = hf;
  function tt(p) {
    var v = -1, b = p == null ? 0 : p.length;
    for (this.clear(); ++v < b; ) {
      var x = p[v];
      this.set(x[0], x[1]);
    }
  }
  function pf() {
    this.__data__ = [], this.size = 0;
  }
  function mf(p) {
    var v = this.__data__, b = hr(v, p);
    if (b < 0)
      return !1;
    var x = v.length - 1;
    return b == x ? v.pop() : ef.call(v, b, 1), --this.size, !0;
  }
  function gf(p) {
    var v = this.__data__, b = hr(v, p);
    return b < 0 ? void 0 : v[b][1];
  }
  function Ef(p) {
    return hr(this.__data__, p) > -1;
  }
  function yf(p, v) {
    var b = this.__data__, x = hr(b, p);
    return x < 0 ? (++this.size, b.push([p, v])) : b[x][1] = v, this;
  }
  tt.prototype.clear = pf, tt.prototype.delete = mf, tt.prototype.get = gf, tt.prototype.has = Ef, tt.prototype.set = yf;
  function Ot(p) {
    var v = -1, b = p == null ? 0 : p.length;
    for (this.clear(); ++v < b; ) {
      var x = p[v];
      this.set(x[0], x[1]);
    }
  }
  function wf() {
    this.size = 0, this.__data__ = {
      hash: new Rt(),
      map: new (wn || tt)(),
      string: new Rt()
    };
  }
  function _f(p) {
    var v = pr(this, p).delete(p);
    return this.size -= v ? 1 : 0, v;
  }
  function vf(p) {
    return pr(this, p).get(p);
  }
  function Af(p) {
    return pr(this, p).has(p);
  }
  function Tf(p, v) {
    var b = pr(this, p), x = b.size;
    return b.set(p, v), this.size += b.size == x ? 0 : 1, this;
  }
  Ot.prototype.clear = wf, Ot.prototype.delete = _f, Ot.prototype.get = vf, Ot.prototype.has = Af, Ot.prototype.set = Tf;
  function dr(p) {
    var v = -1, b = p == null ? 0 : p.length;
    for (this.__data__ = new Ot(); ++v < b; )
      this.add(p[v]);
  }
  function Sf(p) {
    return this.__data__.set(p, r), this;
  }
  function bf(p) {
    return this.__data__.has(p);
  }
  dr.prototype.add = dr.prototype.push = Sf, dr.prototype.has = bf;
  function st(p) {
    var v = this.__data__ = new tt(p);
    this.size = v.size;
  }
  function Cf() {
    this.__data__ = new tt(), this.size = 0;
  }
  function Rf(p) {
    var v = this.__data__, b = v.delete(p);
    return this.size = v.size, b;
  }
  function Of(p) {
    return this.__data__.get(p);
  }
  function If(p) {
    return this.__data__.has(p);
  }
  function Nf(p, v) {
    var b = this.__data__;
    if (b instanceof tt) {
      var x = b.__data__;
      if (!wn || x.length < n - 1)
        return x.push([p, v]), this.size = ++b.size, this;
      b = this.__data__ = new Ot(x);
    }
    return b.set(p, v), this.size = b.size, this;
  }
  st.prototype.clear = Cf, st.prototype.delete = Rf, st.prototype.get = Of, st.prototype.has = If, st.prototype.set = Nf;
  function Pf(p, v) {
    var b = mr(p), x = !b && Wf(p), K = !b && !x && Oi(p), j = !b && !x && !K && Os(p), ie = b || x || K || j, he = ie ? se(p.length, String) : [], me = he.length;
    for (var ne in p)
      Ke.call(p, ne) && !(ie && // Safari 9 has enumerable `arguments.length` in strict mode.
      (ne == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      K && (ne == "offset" || ne == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      j && (ne == "buffer" || ne == "byteLength" || ne == "byteOffset") || // Skip index properties.
      jf(ne, me))) && he.push(ne);
    return he;
  }
  function hr(p, v) {
    for (var b = p.length; b--; )
      if (Ss(p[b][0], v))
        return b;
    return -1;
  }
  function Df(p, v, b) {
    var x = v(p);
    return mr(p) ? x : W(x, b(p));
  }
  function vn(p) {
    return p == null ? p === void 0 ? U : T : Ct && Ct in Object(p) ? Mf(p) : Vf(p);
  }
  function _s(p) {
    return An(p) && vn(p) == a;
  }
  function vs(p, v, b, x, K) {
    return p === v ? !0 : p == null || v == null || !An(p) && !An(v) ? p !== p && v !== v : $f(p, v, b, x, vs, K);
  }
  function $f(p, v, b, x, K, j) {
    var ie = mr(p), he = mr(v), me = ie ? c : at(p), ne = he ? c : at(v);
    me = me == a ? O : me, ne = ne == a ? O : ne;
    var xe = me == O, He = ne == O, Ae = me == ne;
    if (Ae && Oi(p)) {
      if (!Oi(v))
        return !1;
      ie = !0, xe = !1;
    }
    if (Ae && !xe)
      return j || (j = new st()), ie || Os(p) ? As(p, v, b, x, K, j) : Uf(p, v, me, b, x, K, j);
    if (!(b & i)) {
      var Le = xe && Ke.call(p, "__wrapped__"), Ue = He && Ke.call(v, "__wrapped__");
      if (Le || Ue) {
        var lt = Le ? p.value() : p, nt = Ue ? v.value() : v;
        return j || (j = new st()), K(lt, nt, b, x, j);
      }
    }
    return Ae ? (j || (j = new st()), kf(p, v, b, x, K, j)) : !1;
  }
  function Ff(p) {
    if (!Rs(p) || qf(p))
      return !1;
    var v = bs(p) ? Zu : z;
    return v.test(It(p));
  }
  function xf(p) {
    return An(p) && Cs(p.length) && !!M[vn(p)];
  }
  function Lf(p) {
    if (!Gf(p))
      return nf(p);
    var v = [];
    for (var b in Object(p))
      Ke.call(p, b) && b != "constructor" && v.push(b);
    return v;
  }
  function As(p, v, b, x, K, j) {
    var ie = b & i, he = p.length, me = v.length;
    if (he != me && !(ie && me > he))
      return !1;
    var ne = j.get(p);
    if (ne && j.get(v))
      return ne == v;
    var xe = -1, He = !0, Ae = b & o ? new dr() : void 0;
    for (j.set(p, v), j.set(v, p); ++xe < he; ) {
      var Le = p[xe], Ue = v[xe];
      if (x)
        var lt = ie ? x(Ue, Le, xe, v, p, j) : x(Le, Ue, xe, p, v, j);
      if (lt !== void 0) {
        if (lt)
          continue;
        He = !1;
        break;
      }
      if (Ae) {
        if (!te(v, function(nt, Nt) {
          if (!ve(Ae, Nt) && (Le === nt || K(Le, nt, b, x, j)))
            return Ae.push(Nt);
        })) {
          He = !1;
          break;
        }
      } else if (!(Le === Ue || K(Le, Ue, b, x, j))) {
        He = !1;
        break;
      }
    }
    return j.delete(p), j.delete(v), He;
  }
  function Uf(p, v, b, x, K, j, ie) {
    switch (b) {
      case Y:
        if (p.byteLength != v.byteLength || p.byteOffset != v.byteOffset)
          return !1;
        p = p.buffer, v = v.buffer;
      case H:
        return !(p.byteLength != v.byteLength || !j(new gs(p), new gs(v)));
      case l:
      case f:
      case A:
        return Ss(+p, +v);
      case h:
        return p.name == v.name && p.message == v.message;
      case q:
      case Q:
        return p == v + "";
      case E:
        var he = ue;
      case J:
        var me = x & i;
        if (he || (he = vi), p.size != v.size && !me)
          return !1;
        var ne = ie.get(p);
        if (ne)
          return ne == v;
        x |= o, ie.set(p, v);
        var xe = As(he(p), he(v), x, K, j, ie);
        return ie.delete(p), xe;
      case oe:
        if (Ri)
          return Ri.call(p) == Ri.call(v);
    }
    return !1;
  }
  function kf(p, v, b, x, K, j) {
    var ie = b & i, he = Ts(p), me = he.length, ne = Ts(v), xe = ne.length;
    if (me != xe && !ie)
      return !1;
    for (var He = me; He--; ) {
      var Ae = he[He];
      if (!(ie ? Ae in v : Ke.call(v, Ae)))
        return !1;
    }
    var Le = j.get(p);
    if (Le && j.get(v))
      return Le == v;
    var Ue = !0;
    j.set(p, v), j.set(v, p);
    for (var lt = ie; ++He < me; ) {
      Ae = he[He];
      var nt = p[Ae], Nt = v[Ae];
      if (x)
        var Is = ie ? x(Nt, nt, Ae, v, p, j) : x(nt, Nt, Ae, p, v, j);
      if (!(Is === void 0 ? nt === Nt || K(nt, Nt, b, x, j) : Is)) {
        Ue = !1;
        break;
      }
      lt || (lt = Ae == "constructor");
    }
    if (Ue && !lt) {
      var gr = p.constructor, Er = v.constructor;
      gr != Er && "constructor" in p && "constructor" in v && !(typeof gr == "function" && gr instanceof gr && typeof Er == "function" && Er instanceof Er) && (Ue = !1);
    }
    return j.delete(p), j.delete(v), Ue;
  }
  function Ts(p) {
    return Df(p, Xf, Bf);
  }
  function pr(p, v) {
    var b = p.__data__;
    return Hf(v) ? b[typeof v == "string" ? "string" : "hash"] : b.map;
  }
  function Vt(p, v) {
    var b = Be(p, v);
    return Ff(b) ? b : void 0;
  }
  function Mf(p) {
    var v = Ke.call(p, Ct), b = p[Ct];
    try {
      p[Ct] = void 0;
      var x = !0;
    } catch {
    }
    var K = ps.call(p);
    return x && (v ? p[Ct] = b : delete p[Ct]), K;
  }
  var Bf = ys ? function(p) {
    return p == null ? [] : (p = Object(p), _(ys(p), function(v) {
      return Es.call(p, v);
    }));
  } : Kf, at = vn;
  (Ti && at(new Ti(new ArrayBuffer(1))) != Y || wn && at(new wn()) != E || Si && at(Si.resolve()) != $ || bi && at(new bi()) != J || Ci && at(new Ci()) != y) && (at = function(p) {
    var v = vn(p), b = v == O ? p.constructor : void 0, x = b ? It(b) : "";
    if (x)
      switch (x) {
        case rf:
          return Y;
        case of:
          return E;
        case sf:
          return $;
        case af:
          return J;
        case lf:
          return y;
      }
    return v;
  });
  function jf(p, v) {
    return v = v ?? s, !!v && (typeof p == "number" || ce.test(p)) && p > -1 && p % 1 == 0 && p < v;
  }
  function Hf(p) {
    var v = typeof p;
    return v == "string" || v == "number" || v == "symbol" || v == "boolean" ? p !== "__proto__" : p === null;
  }
  function qf(p) {
    return !!hs && hs in p;
  }
  function Gf(p) {
    var v = p && p.constructor, b = typeof v == "function" && v.prototype || bt;
    return p === b;
  }
  function Vf(p) {
    return ps.call(p);
  }
  function It(p) {
    if (p != null) {
      try {
        return ds.call(p);
      } catch {
      }
      try {
        return p + "";
      } catch {
      }
    }
    return "";
  }
  function Ss(p, v) {
    return p === v || p !== p && v !== v;
  }
  var Wf = _s(/* @__PURE__ */ function() {
    return arguments;
  }()) ? _s : function(p) {
    return An(p) && Ke.call(p, "callee") && !Es.call(p, "callee");
  }, mr = Array.isArray;
  function Yf(p) {
    return p != null && Cs(p.length) && !bs(p);
  }
  var Oi = tf || Jf;
  function zf(p, v) {
    return vs(p, v);
  }
  function bs(p) {
    if (!Rs(p))
      return !1;
    var v = vn(p);
    return v == g || v == w || v == m || v == B;
  }
  function Cs(p) {
    return typeof p == "number" && p > -1 && p % 1 == 0 && p <= s;
  }
  function Rs(p) {
    var v = typeof p;
    return p != null && (v == "object" || v == "function");
  }
  function An(p) {
    return p != null && typeof p == "object";
  }
  var Os = S ? _e(S) : xf;
  function Xf(p) {
    return Yf(p) ? Pf(p) : Lf(p);
  }
  function Kf() {
    return [];
  }
  function Jf() {
    return !1;
  }
  e.exports = zf;
})(zr, zr.exports);
var Dw = zr.exports;
Object.defineProperty(or, "__esModule", { value: !0 });
or.DownloadedUpdateHelper = void 0;
or.createTempUpdateFile = Uw;
const $w = Jn, Fw = vt, Ga = Dw, Pt = Tt, Dn = Z;
class xw {
  constructor(t) {
    this.cacheDir = t, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
  }
  get downloadedFileInfo() {
    return this._downloadedFileInfo;
  }
  get file() {
    return this._file;
  }
  get packageFile() {
    return this._packageFile;
  }
  get cacheDirForPendingUpdate() {
    return Dn.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, n, r, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return Ga(this.versionInfo, n) && Ga(this.fileInfo.info, r.info) && await (0, Pt.pathExists)(t) ? t : null;
    const o = await this.getValidCachedUpdateFile(r, i);
    return o === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = o, o);
  }
  async setDownloadedFile(t, n, r, i, o, s) {
    this._file = t, this._packageFile = n, this.versionInfo = r, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: o,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, s && await (0, Pt.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, Pt.emptyDir)(this.cacheDirForPendingUpdate);
    } catch {
    }
  }
  /**
   * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
   * @param fileInfo
   * @param logger
   */
  async getValidCachedUpdateFile(t, n) {
    const r = this.getUpdateInfoFile();
    if (!await (0, Pt.pathExists)(r))
      return null;
    let o;
    try {
      o = await (0, Pt.readJson)(r);
    } catch (m) {
      let l = "No cached update info available";
      return m.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), l += ` (error on read: ${m.message})`), n.info(l), null;
    }
    if (!((o == null ? void 0 : o.fileName) !== null))
      return n.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== o.sha512)
      return n.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${o.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const a = Dn.join(this.cacheDirForPendingUpdate, o.fileName);
    if (!await (0, Pt.pathExists)(a))
      return n.info("Cached update file doesn't exist"), null;
    const c = await Lw(a);
    return t.info.sha512 !== c ? (n.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${c}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = o, a);
  }
  getUpdateInfoFile() {
    return Dn.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
or.DownloadedUpdateHelper = xw;
function Lw(e, t = "sha512", n = "base64", r) {
  return new Promise((i, o) => {
    const s = (0, $w.createHash)(t);
    s.on("error", o).setEncoding(n), (0, Fw.createReadStream)(e, {
      ...r,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", o).on("end", () => {
      s.end(), i(s.read());
    }).pipe(s, { end: !1 });
  });
}
async function Uw(e, t, n) {
  let r = 0, i = Dn.join(t, e);
  for (let o = 0; o < 3; o++)
    try {
      return await (0, Pt.unlink)(i), i;
    } catch (s) {
      if (s.code === "ENOENT")
        return i;
      n.warn(`Error on remove temp update file: ${s}`), i = Dn.join(t, `${r++}-${e}`);
    }
  return i;
}
var di = {}, os = {};
Object.defineProperty(os, "__esModule", { value: !0 });
os.getAppCacheDir = Mw;
const Yi = Z, kw = Jr;
function Mw() {
  const e = (0, kw.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || Yi.join(e, "AppData", "Local") : process.platform === "darwin" ? t = Yi.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || Yi.join(e, ".cache"), t;
}
Object.defineProperty(di, "__esModule", { value: !0 });
di.ElectronAppAdapter = void 0;
const Va = Z, Bw = os;
class jw {
  constructor(t = Ut.app) {
    this.app = t;
  }
  whenReady() {
    return this.app.whenReady();
  }
  get version() {
    return this.app.getVersion();
  }
  get name() {
    return this.app.getName();
  }
  get isPackaged() {
    return this.app.isPackaged === !0;
  }
  get appUpdateConfigPath() {
    return this.isPackaged ? Va.join(process.resourcesPath, "app-update.yml") : Va.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, Bw.getAppCacheDir)();
  }
  quit() {
    this.app.quit();
  }
  relaunch() {
    this.app.relaunch();
  }
  onQuit(t) {
    this.app.once("quit", (n, r) => t(r));
  }
}
di.ElectronAppAdapter = jw;
var Uu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = n;
  const t = de;
  e.NET_SESSION_NAME = "electron-updater";
  function n() {
    return Ut.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class r extends t.HttpExecutor {
    constructor(o) {
      super(), this.proxyLoginCallback = o, this.cachedSession = null;
    }
    async download(o, s, a) {
      return await a.cancellationToken.createPromise((c, m, l) => {
        const f = {
          headers: a.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(o, f), (0, t.configureRequestOptions)(f), this.doDownload(f, {
          destination: s,
          options: a,
          onCancel: l,
          callback: (h) => {
            h == null ? c(s) : m(h);
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(o, s) {
      o.headers && o.headers.Host && (o.host = o.headers.Host, delete o.headers.Host), this.cachedSession == null && (this.cachedSession = n());
      const a = Ut.net.request({
        ...o,
        session: this.cachedSession
      });
      return a.on("response", s), this.proxyLoginCallback != null && a.on("login", this.proxyLoginCallback), a;
    }
    addRedirectHandlers(o, s, a, c, m) {
      o.on("redirect", (l, f, h) => {
        o.abort(), c > this.maxRedirects ? a(this.createMaxRedirectError()) : m(t.HttpExecutor.prepareRedirectUrlOptions(h, s));
      });
    }
  }
  e.ElectronHttpExecutor = r;
})(Uu);
var sr = {}, Xe = {};
Object.defineProperty(Xe, "__esModule", { value: !0 });
Xe.newBaseUrl = Hw;
Xe.newUrlFromBase = qw;
Xe.getChannelFilename = Gw;
const ku = At;
function Hw(e) {
  const t = new ku.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function qw(e, t, n = !1) {
  const r = new ku.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? r.search = i : n && (r.search = `noCache=${Date.now().toString(32)}`), r;
}
function Gw(e) {
  return `${e}.yml`;
}
var le = {}, Vw = "[object Symbol]", Mu = /[\\^$.*+?()[\]{}|]/g, Ww = RegExp(Mu.source), Yw = typeof Re == "object" && Re && Re.Object === Object && Re, zw = typeof self == "object" && self && self.Object === Object && self, Xw = Yw || zw || Function("return this")(), Kw = Object.prototype, Jw = Kw.toString, Wa = Xw.Symbol, Ya = Wa ? Wa.prototype : void 0, za = Ya ? Ya.toString : void 0;
function Qw(e) {
  if (typeof e == "string")
    return e;
  if (e_(e))
    return za ? za.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function Zw(e) {
  return !!e && typeof e == "object";
}
function e_(e) {
  return typeof e == "symbol" || Zw(e) && Jw.call(e) == Vw;
}
function t_(e) {
  return e == null ? "" : Qw(e);
}
function n_(e) {
  return e = t_(e), e && Ww.test(e) ? e.replace(Mu, "\\$&") : e;
}
var Bu = n_;
Object.defineProperty(le, "__esModule", { value: !0 });
le.Provider = void 0;
le.findFile = a_;
le.parseUpdateInfo = l_;
le.getFileList = ju;
le.resolveFiles = c_;
const wt = de, r_ = ye, i_ = At, Xr = Xe, o_ = Bu;
class s_ {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  // By default, the blockmap file is in the same directory as the main file
  // But some providers may have a different blockmap file, so we need to override this method
  getBlockMapFiles(t, n, r, i = null) {
    const o = (0, Xr.newUrlFromBase)(`${t.pathname}.blockmap`, t);
    return [(0, Xr.newUrlFromBase)(`${t.pathname.replace(new RegExp(o_(r), "g"), n)}.blockmap`, i ? new i_.URL(i) : t), o];
  }
  get isUseMultipleRangeRequest() {
    return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
  }
  getChannelFilePrefix() {
    if (this.runtimeOptions.platform === "linux") {
      const t = process.env.TEST_UPDATER_ARCH || process.arch;
      return "-linux" + (t === "x64" ? "" : `-${t}`);
    } else
      return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
  }
  // due to historical reasons for windows we use channel name without platform specifier
  getDefaultChannelName() {
    return this.getCustomChannelName("latest");
  }
  getCustomChannelName(t) {
    return `${t}${this.getChannelFilePrefix()}`;
  }
  get fileExtraDownloadHeaders() {
    return null;
  }
  setRequestHeaders(t) {
    this.requestHeaders = t;
  }
  /**
   * Method to perform API request only to resolve update info, but not to download update.
   */
  httpRequest(t, n, r) {
    return this.executor.request(this.createRequestOptions(t, n), r);
  }
  createRequestOptions(t, n) {
    const r = {};
    return this.requestHeaders == null ? n != null && (r.headers = n) : r.headers = n == null ? this.requestHeaders : { ...this.requestHeaders, ...n }, (0, wt.configureRequestUrl)(t, r), r;
  }
}
le.Provider = s_;
function a_(e, t, n) {
  var r;
  if (e.length === 0)
    throw (0, wt.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const i = e.filter((s) => s.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`)), o = (r = i.find((s) => [s.url.pathname, s.info.url].some((a) => a.includes(process.arch)))) !== null && r !== void 0 ? r : i.shift();
  return o || (n == null ? e[0] : e.find((s) => !n.some((a) => s.url.pathname.toLowerCase().endsWith(`.${a.toLowerCase()}`))));
}
function l_(e, t, n) {
  if (e == null)
    throw (0, wt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let r;
  try {
    r = (0, r_.load)(e);
  } catch (i) {
    throw (0, wt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return r;
}
function ju(e) {
  const t = e.files;
  if (t != null && t.length > 0)
    return t;
  if (e.path != null)
    return [
      {
        url: e.path,
        sha2: e.sha2,
        sha512: e.sha512
      }
    ];
  throw (0, wt.newError)(`No files provided: ${(0, wt.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function c_(e, t, n = (r) => r) {
  const i = ju(e).map((a) => {
    if (a.sha2 == null && a.sha512 == null)
      throw (0, wt.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, wt.safeStringifyJson)(a)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, Xr.newUrlFromBase)(n(a.url), t),
      info: a
    };
  }), o = e.packages, s = o == null ? null : o[process.arch] || o.ia32;
  return s != null && (i[0].packageInfo = {
    ...s,
    path: (0, Xr.newUrlFromBase)(n(s.path), t).href
  }), i;
}
Object.defineProperty(sr, "__esModule", { value: !0 });
sr.GenericProvider = void 0;
const Xa = de, zi = Xe, Xi = le;
class u_ extends Xi.Provider {
  constructor(t, n, r) {
    super(r), this.configuration = t, this.updater = n, this.baseUrl = (0, zi.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, zi.getChannelFilename)(this.channel), n = (0, zi.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let r = 0; ; r++)
      try {
        return (0, Xi.parseUpdateInfo)(await this.httpRequest(n), t, n);
      } catch (i) {
        if (i instanceof Xa.HttpError && i.statusCode === 404)
          throw (0, Xa.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        if (i.code === "ECONNREFUSED" && r < 3) {
          await new Promise((o, s) => {
            try {
              setTimeout(o, 1e3 * r);
            } catch (a) {
              s(a);
            }
          });
          continue;
        }
        throw i;
      }
  }
  resolveFiles(t) {
    return (0, Xi.resolveFiles)(t, this.baseUrl);
  }
}
sr.GenericProvider = u_;
var hi = {}, pi = {};
Object.defineProperty(pi, "__esModule", { value: !0 });
pi.BitbucketProvider = void 0;
const Ka = de, Ki = Xe, Ji = le;
class f_ extends Ji.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n;
    const { owner: i, slug: o } = t;
    this.baseUrl = (0, Ki.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${o}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new Ka.CancellationToken(), n = (0, Ki.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, Ki.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, void 0, t);
      return (0, Ji.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, Ka.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Ji.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: n } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${n}, channel: ${this.channel})`;
  }
}
pi.BitbucketProvider = f_;
var _t = {};
Object.defineProperty(_t, "__esModule", { value: !0 });
_t.GitHubProvider = _t.BaseGitHubProvider = void 0;
_t.computeReleaseNotes = qu;
const rt = de, Qe = Lu, d_ = At, nn = Xe, bo = le, Qi = /\/tag\/(v?[^/]+)$/;
class Hu extends bo.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, nn.newBaseUrl)((0, rt.githubUrl)(t, n));
    const i = n === "github.com" ? "api.github.com" : n;
    this.baseApiUrl = (0, nn.newBaseUrl)((0, rt.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const n = this.options.host;
    return n && !["github.com", "api.github.com"].includes(n) ? `/api/v3${t}` : t;
  }
}
_t.BaseGitHubProvider = Hu;
class h_ extends Hu {
  constructor(t, n, r) {
    super(t, "github.com", r), this.options = t, this.updater = n;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, n, r, i, o;
    const s = new rt.CancellationToken(), a = await this.httpRequest((0, nn.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, s), c = (0, rt.parseXml)(a);
    let m = c.element("entry", !1, "No published versions on GitHub"), l = null;
    try {
      if (this.updater.allowPrerelease) {
        const A = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((n = Qe.prerelease(this.updater.currentVersion)) === null || n === void 0 ? void 0 : n[0]) || null;
        if (A === null)
          l = Qi.exec(m.element("link").attribute("href"))[1];
        else
          for (const T of c.getElements("entry")) {
            const O = Qi.exec(T.element("link").attribute("href"));
            if (O === null)
              continue;
            const $ = O[1];
            if (!Qe.valid($))
              continue;
            const B = ((r = Qe.prerelease($)) === null || r === void 0 ? void 0 : r[0]) || null, q = !A || ["alpha", "beta"].includes(A), J = B !== null && !["alpha", "beta"].includes(String(B));
            if (q && !J && !(A === "beta" && B === "alpha")) {
              l = $, m = T;
              break;
            }
            if (B && B === A) {
              l = $, m = T;
              break;
            }
          }
      } else {
        l = await this.getLatestTagName(s);
        for (const A of c.getElements("entry")) {
          const T = Qi.exec(A.element("link").attribute("href"));
          if (T != null && T[1] === l) {
            m = A;
            break;
          }
        }
      }
    } catch (A) {
      throw (0, rt.newError)(`Cannot parse releases feed: ${A.stack || A.message},
XML:
${a}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (l == null)
      throw (0, rt.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let f, h = "", g = "";
    const w = async (A) => {
      h = (0, nn.getChannelFilename)(A), g = (0, nn.newUrlFromBase)(this.getBaseDownloadPath(String(l), h), this.baseUrl);
      const T = this.createRequestOptions(g);
      try {
        return await this.executor.request(T, s);
      } catch (O) {
        throw O instanceof rt.HttpError && O.statusCode === 404 ? (0, rt.newError)(`Cannot find ${h} in the latest release artifacts (${g}): ${O.stack || O.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : O;
      }
    };
    try {
      let A = this.channel;
      this.updater.allowPrerelease && (!((i = Qe.prerelease(l)) === null || i === void 0) && i[0]) && (A = this.getCustomChannelName(String((o = Qe.prerelease(l)) === null || o === void 0 ? void 0 : o[0]))), f = await w(A);
    } catch (A) {
      if (this.updater.allowPrerelease)
        f = await w(this.getDefaultChannelName());
      else
        throw A;
    }
    const E = (0, bo.parseUpdateInfo)(f, h, g);
    return E.releaseName == null && (E.releaseName = m.elementValueOrEmpty("title")), E.releaseNotes == null && (E.releaseNotes = qu(this.updater.currentVersion, this.updater.fullChangelog, c, m)), {
      tag: l,
      ...E
    };
  }
  async getLatestTagName(t) {
    const n = this.options, r = n.host == null || n.host === "github.com" ? (0, nn.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new d_.URL(`${this.computeGithubBasePath(`/repos/${n.owner}/${n.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(r, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, rt.newError)(`Unable to find latest version on GitHub (${r}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, bo.resolveFiles)(t, this.baseUrl, (n) => this.getBaseDownloadPath(t.tag, n.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, n) {
    return `${this.basePath}/download/${t}/${n}`;
  }
}
_t.GitHubProvider = h_;
function Ja(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function qu(e, t, n, r) {
  if (!t)
    return Ja(r);
  const i = /\/tag\/v?([^/]+)$/;
  let o;
  try {
    o = i.exec(r.element("link").attribute("href"))[1], o = Qe.valid(o) ? o : void 0;
  } catch {
  }
  if (o == null)
    return null;
  const s = [];
  for (const a of n.getElements("entry")) {
    let c;
    try {
      const f = i.exec(a.element("link").attribute("href"));
      if (!f)
        continue;
      c = f[1];
    } catch {
      continue;
    }
    if (!Qe.valid(c))
      continue;
    const m = Qe.gt(c, e.raw), l = Qe.lte(c, o);
    m && l && s.push({
      version: c,
      note: Ja(a)
    });
  }
  return s.sort((a, c) => Qe.rcompare(a.version, c.version));
}
var mi = {};
Object.defineProperty(mi, "__esModule", { value: !0 });
mi.GitLabProvider = void 0;
const ge = de, Zi = At, p_ = Bu, Nr = Xe, eo = le;
class m_ extends eo.Provider {
  /**
   * Normalizes filenames by replacing spaces and underscores with dashes.
   *
   * This is a workaround to handle filename formatting differences between tools:
   * - electron-builder formats filenames like "test file.txt" as "test-file.txt"
   * - GitLab may provide asset URLs using underscores, such as "test_file.txt"
   *
   * Because of this mismatch, we can't reliably extract the correct filename from
   * the asset path without normalization. This function ensures consistent matching
   * across different filename formats by converting all spaces and underscores to dashes.
   *
   * @param filename The filename to normalize
   * @returns The normalized filename with spaces and underscores replaced by dashes
   */
  normalizeFilename(t) {
    return t.replace(/ |_/g, "-");
  }
  constructor(t, n, r) {
    super({
      ...r,
      // GitLab might not support multiple range requests efficiently
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.updater = n, this.cachedLatestVersion = null;
    const o = t.host || "gitlab.com";
    this.baseApiUrl = (0, Nr.newBaseUrl)(`https://${o}/api/v4`);
  }
  createRequestOptions(t, n) {
    const r = super.createRequestOptions(t, n);
    return r.redirect = "manual", r;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = new ge.CancellationToken(), n = (0, Nr.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl), r = { Accept: "application/json", ...this.setAuthHeaderForToken(this.options.token || null) };
    let i;
    try {
      i = await this.httpRequest(n, r, t);
    } catch (g) {
      throw (0, ge.newError)(`Unable to find latest release on GitLab (${n}): ${g.stack || g.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
    if (!i)
      throw (0, ge.newError)("No published releases on GitLab", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let o;
    try {
      o = JSON.parse(i);
    } catch (g) {
      throw (0, ge.newError)(`Unable to parse latest release response from GitLab (${n}): response was not valid JSON: ${g.stack || g.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
    if (o.upcoming_release)
      throw (0, ge.newError)("Latest GitLab release is scheduled but not yet published", "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    const s = o.tag_name;
    let a = null, c = "", m = null;
    const l = async (g) => {
      c = (0, Nr.getChannelFilename)(g);
      const w = o.assets.links.find((T) => T.name === c);
      if (!w)
        throw (0, ge.newError)(`Cannot find ${c} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      m = new Zi.URL(w.direct_asset_url);
      const E = this.setAuthHeaderForToken(this.options.token || null), A = Object.keys(E).length ? E : void 0;
      try {
        const T = await this.httpRequest(m, A, t);
        if (!T)
          throw (0, ge.newError)(`Empty response from ${m}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        return T;
      } catch (T) {
        throw T instanceof ge.HttpError && T.statusCode === 404 ? (0, ge.newError)(`Cannot find ${c} in the latest release artifacts (${m}): ${T.stack || T.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : T;
      }
    };
    try {
      a = await l(this.channel);
    } catch (g) {
      if (this.channel !== this.getDefaultChannelName())
        a = await l(this.getDefaultChannelName());
      else
        throw g;
    }
    if (!a)
      throw (0, ge.newError)(`Unable to parse channel data from ${c}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    const f = (0, eo.parseUpdateInfo)(a, c, m);
    f.releaseName == null && (f.releaseName = o.name), f.releaseNotes == null && (f.releaseNotes = o.description || null);
    const h = {
      tag: s,
      assets: this.convertAssetsToMap(o.assets),
      ...f
    };
    return this.cachedLatestVersion = h, h;
  }
  /**
   * Utility function to convert GitlabReleaseAsset to Map<string, string>
   * Maps asset names to their download URLs
   */
  convertAssetsToMap(t) {
    const n = /* @__PURE__ */ new Map();
    for (const r of t.links)
      n.set(this.normalizeFilename(r.name), r.direct_asset_url);
    return n;
  }
  /**
   * Find blockmap file URL in assets map for a specific filename
   */
  findBlockMapInAssets(t, n) {
    const r = [`${n}.blockmap`, `${this.normalizeFilename(n)}.blockmap`];
    for (const i of r) {
      const o = t.get(i);
      if (o)
        return new Zi.URL(o);
    }
    return null;
  }
  async fetchReleaseInfoByVersion(t) {
    const n = new ge.CancellationToken(), r = [`v${t}`, t];
    for (const i of r) {
      const o = (0, Nr.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(i)}`, this.baseApiUrl);
      try {
        const s = { Accept: "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, a = await this.httpRequest(o, s, n);
        if (a)
          return JSON.parse(a);
      } catch (s) {
        if (s instanceof ge.HttpError && s.statusCode === 404)
          continue;
        throw (0, ge.newError)(`Unable to find release ${i} on GitLab (${o}): ${s.stack || s.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
      }
    }
    throw (0, ge.newError)(`Unable to find release with version ${t} (tried: ${r.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
  }
  setAuthHeaderForToken(t) {
    const n = {};
    return t != null && (t.startsWith("Bearer") ? n.authorization = t : n["PRIVATE-TOKEN"] = t), n;
  }
  /**
   * Get version info for blockmap files, using cache when possible
   */
  async getVersionInfoForBlockMap(t) {
    if (this.cachedLatestVersion && this.cachedLatestVersion.version === t)
      return this.cachedLatestVersion.assets;
    const n = await this.fetchReleaseInfoByVersion(t);
    return n && n.assets ? this.convertAssetsToMap(n.assets) : null;
  }
  /**
   * Find blockmap URLs from version assets
   */
  async findBlockMapUrlsFromAssets(t, n, r) {
    let i = null, o = null;
    const s = await this.getVersionInfoForBlockMap(n);
    s && (i = this.findBlockMapInAssets(s, r));
    const a = await this.getVersionInfoForBlockMap(t);
    if (a) {
      const c = r.replace(new RegExp(p_(n), "g"), t);
      o = this.findBlockMapInAssets(a, c);
    }
    return [o, i];
  }
  async getBlockMapFiles(t, n, r, i = null) {
    if (this.options.uploadTarget === "project_upload") {
      const o = t.pathname.split("/").pop() || "", [s, a] = await this.findBlockMapUrlsFromAssets(n, r, o);
      if (!a)
        throw (0, ge.newError)(`Cannot find blockmap file for ${r} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      if (!s)
        throw (0, ge.newError)(`Cannot find blockmap file for ${n} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      return [s, a];
    } else
      return super.getBlockMapFiles(t, n, r, i);
  }
  resolveFiles(t) {
    return (0, eo.getFileList)(t).map((n) => {
      const i = [
        n.url,
        // Original filename
        this.normalizeFilename(n.url)
        // Normalized filename (spaces/underscores → dashes)
      ].find((s) => t.assets.has(s)), o = i ? t.assets.get(i) : void 0;
      if (!o)
        throw (0, ge.newError)(`Cannot find asset "${n.url}" in GitLab release assets. Available assets: ${Array.from(t.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new Zi.URL(o),
        info: n
      };
    });
  }
  toString() {
    return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
  }
}
mi.GitLabProvider = m_;
var gi = {};
Object.defineProperty(gi, "__esModule", { value: !0 });
gi.KeygenProvider = void 0;
const Qa = de, to = Xe, no = le;
class g_ extends no.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, to.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new Qa.CancellationToken(), n = (0, to.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, to.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, no.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, Qa.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, no.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: n, platform: r } = this.configuration;
    return `Keygen (account: ${t}, product: ${n}, platform: ${r}, channel: ${this.channel})`;
  }
}
gi.KeygenProvider = g_;
var Ei = {};
Object.defineProperty(Ei, "__esModule", { value: !0 });
Ei.PrivateGitHubProvider = void 0;
const Yt = de, E_ = ye, y_ = Z, Za = At, el = Xe, w_ = _t, __ = le;
class v_ extends w_.BaseGitHubProvider {
  constructor(t, n, r, i) {
    super(t, "api.github.com", i), this.updater = n, this.token = r;
  }
  createRequestOptions(t, n) {
    const r = super.createRequestOptions(t, n);
    return r.redirect = "manual", r;
  }
  async getLatestVersion() {
    const t = new Yt.CancellationToken(), n = (0, el.getChannelFilename)(this.getDefaultChannelName()), r = await this.getLatestVersionInfo(t), i = r.assets.find((a) => a.name === n);
    if (i == null)
      throw (0, Yt.newError)(`Cannot find ${n} in the release ${r.html_url || r.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const o = new Za.URL(i.url);
    let s;
    try {
      s = (0, E_.load)(await this.httpRequest(o, this.configureHeaders("application/octet-stream"), t));
    } catch (a) {
      throw a instanceof Yt.HttpError && a.statusCode === 404 ? (0, Yt.newError)(`Cannot find ${n} in the latest release artifacts (${o}): ${a.stack || a.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : a;
    }
    return s.assets = r.assets, s;
  }
  get fileExtraDownloadHeaders() {
    return this.configureHeaders("application/octet-stream");
  }
  configureHeaders(t) {
    return {
      accept: t,
      authorization: `token ${this.token}`
    };
  }
  async getLatestVersionInfo(t) {
    const n = this.updater.allowPrerelease;
    let r = this.basePath;
    n || (r = `${r}/latest`);
    const i = (0, el.newUrlFromBase)(r, this.baseUrl);
    try {
      const o = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      if (n) {
        const s = o.filter((a) => !a.draft);
        return s.find((a) => a.prerelease) || s[0];
      } else
        return o;
    } catch (o) {
      throw (0, Yt.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, __.getFileList)(t).map((n) => {
      const r = y_.posix.basename(n.url).replace(/ /g, "-"), i = t.assets.find((o) => o != null && o.name === r);
      if (i == null)
        throw (0, Yt.newError)(`Cannot find asset "${r}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new Za.URL(i.url),
        info: n
      };
    });
  }
}
Ei.PrivateGitHubProvider = v_;
Object.defineProperty(hi, "__esModule", { value: !0 });
hi.isUrlProbablySupportMultiRangeRequests = Gu;
hi.createClient = R_;
const Pr = de, A_ = pi, tl = sr, T_ = _t, S_ = mi, b_ = gi, C_ = Ei;
function Gu(e) {
  return !e.includes("s3.amazonaws.com");
}
function R_(e, t, n) {
  if (typeof e == "string")
    throw (0, Pr.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const r = e.provider;
  switch (r) {
    case "github": {
      const i = e, o = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return o == null ? new T_.GitHubProvider(i, t, n) : new C_.PrivateGitHubProvider(i, t, o, n);
    }
    case "bitbucket":
      return new A_.BitbucketProvider(e, t, n);
    case "gitlab":
      return new S_.GitLabProvider(e, t, n);
    case "keygen":
      return new b_.KeygenProvider(e, t, n);
    case "s3":
    case "spaces":
      return new tl.GenericProvider({
        provider: "generic",
        url: (0, Pr.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...n,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new tl.GenericProvider(i, t, {
        ...n,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && Gu(i.url)
      });
    }
    case "custom": {
      const i = e, o = i.updateProvider;
      if (!o)
        throw (0, Pr.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new o(i, t, n);
    }
    default:
      throw (0, Pr.newError)(`Unsupported provider: ${r}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var yi = {}, ar = {}, pn = {}, qt = {};
Object.defineProperty(qt, "__esModule", { value: !0 });
qt.OperationKind = void 0;
qt.computeOperations = O_;
var xt;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(xt || (qt.OperationKind = xt = {}));
function O_(e, t, n) {
  const r = rl(e.files), i = rl(t.files);
  let o = null;
  const s = t.files[0], a = [], c = s.name, m = r.get(c);
  if (m == null)
    throw new Error(`no file ${c} in old blockmap`);
  const l = i.get(c);
  let f = 0;
  const { checksumToOffset: h, checksumToOldSize: g } = N_(r.get(c), m.offset, n);
  let w = s.offset;
  for (let E = 0; E < l.checksums.length; w += l.sizes[E], E++) {
    const A = l.sizes[E], T = l.checksums[E];
    let O = h.get(T);
    O != null && g.get(T) !== A && (n.warn(`Checksum ("${T}") matches, but size differs (old: ${g.get(T)}, new: ${A})`), O = void 0), O === void 0 ? (f++, o != null && o.kind === xt.DOWNLOAD && o.end === w ? o.end += A : (o = {
      kind: xt.DOWNLOAD,
      start: w,
      end: w + A
      // oldBlocks: null,
    }, nl(o, a, T, E))) : o != null && o.kind === xt.COPY && o.end === O ? o.end += A : (o = {
      kind: xt.COPY,
      start: O,
      end: O + A
      // oldBlocks: [checksum]
    }, nl(o, a, T, E));
  }
  return f > 0 && n.info(`File${s.name === "file" ? "" : " " + s.name} has ${f} changed blocks`), a;
}
const I_ = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function nl(e, t, n, r) {
  if (I_ && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const o = [i.start, i.end, e.start, e.end].reduce((s, a) => s < a ? s : a);
      throw new Error(`operation (block index: ${r}, checksum: ${n}, kind: ${xt[e.kind]}) overlaps previous operation (checksum: ${n}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - o} until ${i.end - o} and ${e.start - o} until ${e.end - o}`);
    }
  }
  t.push(e);
}
function N_(e, t, n) {
  const r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let o = t;
  for (let s = 0; s < e.checksums.length; s++) {
    const a = e.checksums[s], c = e.sizes[s], m = i.get(a);
    if (m === void 0)
      r.set(a, o), i.set(a, c);
    else if (n.debug != null) {
      const l = m === c ? "(same size)" : `(size: ${m}, this size: ${c})`;
      n.debug(`${a} duplicated in blockmap ${l}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    o += c;
  }
  return { checksumToOffset: r, checksumToOldSize: i };
}
function rl(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    t.set(n.name, n);
  return t;
}
Object.defineProperty(pn, "__esModule", { value: !0 });
pn.DataSplitter = void 0;
pn.copyData = Vu;
const Dr = de, P_ = vt, D_ = Kn, $_ = qt, il = Buffer.from(`\r
\r
`);
var ft;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(ft || (ft = {}));
function Vu(e, t, n, r, i) {
  const o = (0, P_.createReadStream)("", {
    fd: n,
    autoClose: !1,
    start: e.start,
    // end is inclusive
    end: e.end - 1
  });
  o.on("error", r), o.once("end", i), o.pipe(t, {
    end: !1
  });
}
class F_ extends D_.Writable {
  constructor(t, n, r, i, o, s, a, c) {
    super(), this.out = t, this.options = n, this.partIndexToTaskIndex = r, this.partIndexToLength = o, this.finishHandler = s, this.grandTotalBytes = a, this.onProgress = c, this.start = Date.now(), this.nextUpdate = this.start + 1e3, this.transferred = 0, this.delta = 0, this.partIndex = -1, this.headerListBuffer = null, this.readState = ft.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
  }
  get isFinished() {
    return this.partIndex === this.partIndexToLength.length;
  }
  // noinspection JSUnusedGlobalSymbols
  _write(t, n, r) {
    if (this.isFinished) {
      console.error(`Trailing ignored data: ${t.length} bytes`);
      return;
    }
    this.handleData(t).then(() => {
      if (this.onProgress) {
        const i = Date.now();
        (i >= this.nextUpdate || this.transferred === this.grandTotalBytes) && this.grandTotalBytes && (i - this.start) / 1e3 && (this.nextUpdate = i + 1e3, this.onProgress({
          total: this.grandTotalBytes,
          delta: this.delta,
          transferred: this.transferred,
          percent: this.transferred / this.grandTotalBytes * 100,
          bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
        }), this.delta = 0);
      }
      r();
    }).catch(r);
  }
  async handleData(t) {
    let n = 0;
    if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
      throw (0, Dr.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const r = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= r, n = r;
    } else if (this.remainingPartDataCount > 0) {
      const r = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= r, await this.processPartData(t, 0, r), n = r;
    }
    if (n !== t.length) {
      if (this.readState === ft.HEADER) {
        const r = this.searchHeaderListEnd(t, n);
        if (r === -1)
          return;
        n = r, this.readState = ft.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === ft.BODY)
          this.readState = ft.INIT;
        else {
          this.partIndex++;
          let s = this.partIndexToTaskIndex.get(this.partIndex);
          if (s == null)
            if (this.isFinished)
              s = this.options.end;
            else
              throw (0, Dr.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const a = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (a < s)
            await this.copyExistingData(a, s);
          else if (a > s)
            throw (0, Dr.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (n = this.searchHeaderListEnd(t, n), n === -1) {
            this.readState = ft.HEADER;
            return;
          }
        }
        const r = this.partIndexToLength[this.partIndex], i = n + r, o = Math.min(i, t.length);
        if (await this.processPartStarted(t, n, o), this.remainingPartDataCount = r - (o - n), this.remainingPartDataCount > 0)
          return;
        if (n = i + this.boundaryLength, n >= t.length) {
          this.ignoreByteCount = this.boundaryLength - (t.length - i);
          return;
        }
      }
    }
  }
  copyExistingData(t, n) {
    return new Promise((r, i) => {
      const o = () => {
        if (t === n) {
          r();
          return;
        }
        const s = this.options.tasks[t];
        if (s.kind !== $_.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        Vu(s, this.out, this.options.oldFileFd, i, () => {
          t++, o();
        });
      };
      o();
    });
  }
  searchHeaderListEnd(t, n) {
    const r = t.indexOf(il, n);
    if (r !== -1)
      return r + il.length;
    const i = n === 0 ? t : t.slice(n);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, Dr.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
    this.actualPartLength = 0;
  }
  processPartStarted(t, n, r) {
    return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(t, n, r);
  }
  processPartData(t, n, r) {
    this.actualPartLength += r - n, this.transferred += r - n, this.delta += r - n;
    const i = this.out;
    return i.write(n === 0 && t.length === r ? t : t.slice(n, r)) ? Promise.resolve() : new Promise((o, s) => {
      i.on("error", s), i.once("drain", () => {
        i.removeListener("error", s), o();
      });
    });
  }
}
pn.DataSplitter = F_;
var wi = {};
Object.defineProperty(wi, "__esModule", { value: !0 });
wi.executeTasksUsingMultipleRangeRequests = x_;
wi.checkIsRangesSupported = Ro;
const Co = de, ol = pn, sl = qt;
function x_(e, t, n, r, i) {
  const o = (s) => {
    if (s >= t.length) {
      e.fileMetadataBuffer != null && n.write(e.fileMetadataBuffer), n.end();
      return;
    }
    const a = s + 1e3;
    L_(e, {
      tasks: t,
      start: s,
      end: Math.min(t.length, a),
      oldFileFd: r
    }, n, () => o(a), i);
  };
  return o;
}
function L_(e, t, n, r, i) {
  let o = "bytes=", s = 0, a = 0;
  const c = /* @__PURE__ */ new Map(), m = [];
  for (let h = t.start; h < t.end; h++) {
    const g = t.tasks[h];
    g.kind === sl.OperationKind.DOWNLOAD && (o += `${g.start}-${g.end - 1}, `, c.set(s, h), s++, m.push(g.end - g.start), a += g.end - g.start);
  }
  if (s <= 1) {
    const h = (g) => {
      if (g >= t.end) {
        r();
        return;
      }
      const w = t.tasks[g++];
      if (w.kind === sl.OperationKind.COPY)
        (0, ol.copyData)(w, n, t.oldFileFd, i, () => h(g));
      else {
        const E = e.createRequestOptions();
        E.headers.Range = `bytes=${w.start}-${w.end - 1}`;
        const A = e.httpExecutor.createRequest(E, (T) => {
          T.on("error", i), Ro(T, i) && (T.pipe(n, {
            end: !1
          }), T.once("end", () => h(g)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(A, i), A.end();
      }
    };
    h(t.start);
    return;
  }
  const l = e.createRequestOptions();
  l.headers.Range = o.substring(0, o.length - 2);
  const f = e.httpExecutor.createRequest(l, (h) => {
    if (!Ro(h, i))
      return;
    const g = (0, Co.safeGetHeader)(h, "content-type"), w = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(g);
    if (w == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${g}"`));
      return;
    }
    const E = new ol.DataSplitter(n, t, c, w[1] || w[2], m, r, a, e.options.onProgress);
    E.on("error", i), h.pipe(E), h.on("end", () => {
      setTimeout(() => {
        f.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(f, i), f.end();
}
function Ro(e, t) {
  if (e.statusCode >= 400)
    return t((0, Co.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const n = (0, Co.safeGetHeader)(e, "accept-ranges");
    if (n == null || n === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var _i = {};
Object.defineProperty(_i, "__esModule", { value: !0 });
_i.ProgressDifferentialDownloadCallbackTransform = void 0;
const U_ = Kn;
var rn;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(rn || (rn = {}));
class k_ extends U_.Transform {
  constructor(t, n, r) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = n, this.onProgress = r, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = rn.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, n, r) {
    if (this.cancellationToken.cancelled) {
      r(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == rn.COPY) {
      r(null, t);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), r(null, t);
  }
  beginFileCopy() {
    this.operationType = rn.COPY;
  }
  beginRangeDownload() {
    this.operationType = rn.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
  }
  endRangeDownload() {
    this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    });
  }
  // Called when we are 100% done with the connection/download
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, this.transferred = 0, t(null);
  }
}
_i.ProgressDifferentialDownloadCallbackTransform = k_;
Object.defineProperty(ar, "__esModule", { value: !0 });
ar.DifferentialDownloader = void 0;
const bn = de, ro = Tt, M_ = vt, B_ = pn, j_ = At, $r = qt, al = wi, H_ = _i;
class q_ {
  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(t, n, r) {
    this.blockAwareFileInfo = t, this.httpExecutor = n, this.options = r, this.fileMetadataBuffer = null, this.logger = r.logger;
  }
  createRequestOptions() {
    const t = {
      headers: {
        ...this.options.requestHeaders,
        accept: "*/*"
      }
    };
    return (0, bn.configureRequestUrl)(this.options.newUrl, t), (0, bn.configureRequestOptions)(t), t;
  }
  doDownload(t, n) {
    if (t.version !== n.version)
      throw new Error(`version is different (${t.version} - ${n.version}), full download is required`);
    const r = this.logger, i = (0, $r.computeOperations)(t, n, r);
    r.debug != null && r.debug(JSON.stringify(i, null, 2));
    let o = 0, s = 0;
    for (const c of i) {
      const m = c.end - c.start;
      c.kind === $r.OperationKind.DOWNLOAD ? o += m : s += m;
    }
    const a = this.blockAwareFileInfo.size;
    if (o + s + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== a)
      throw new Error(`Internal error, size mismatch: downloadSize: ${o}, copySize: ${s}, newSize: ${a}`);
    return r.info(`Full: ${ll(a)}, To download: ${ll(o)} (${Math.round(o / (a / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const n = [], r = () => Promise.all(n.map((i) => (0, ro.close)(i.descriptor).catch((o) => {
      this.logger.error(`cannot close file "${i.path}": ${o}`);
    })));
    return this.doDownloadFile(t, n).then(r).catch((i) => r().catch((o) => {
      try {
        this.logger.error(`cannot close files: ${o}`);
      } catch (s) {
        try {
          console.error(s);
        } catch {
        }
      }
      throw i;
    }).then(() => {
      throw i;
    }));
  }
  async doDownloadFile(t, n) {
    const r = await (0, ro.open)(this.options.oldFile, "r");
    n.push({ descriptor: r, path: this.options.oldFile });
    const i = await (0, ro.open)(this.options.newFile, "w");
    n.push({ descriptor: i, path: this.options.newFile });
    const o = (0, M_.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((s, a) => {
      const c = [];
      let m;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const T = [];
        let O = 0;
        for (const B of t)
          B.kind === $r.OperationKind.DOWNLOAD && (T.push(B.end - B.start), O += B.end - B.start);
        const $ = {
          expectedByteCounts: T,
          grandTotal: O
        };
        m = new H_.ProgressDifferentialDownloadCallbackTransform($, this.options.cancellationToken, this.options.onProgress), c.push(m);
      }
      const l = new bn.DigestTransform(this.blockAwareFileInfo.sha512);
      l.isValidateOnEnd = !1, c.push(l), o.on("finish", () => {
        o.close(() => {
          n.splice(1, 1);
          try {
            l.validate();
          } catch (T) {
            a(T);
            return;
          }
          s(void 0);
        });
      }), c.push(o);
      let f = null;
      for (const T of c)
        T.on("error", a), f == null ? f = T : f = f.pipe(T);
      const h = c[0];
      let g;
      if (this.options.isUseMultipleRangeRequest) {
        g = (0, al.executeTasksUsingMultipleRangeRequests)(this, t, h, r, a), g(0);
        return;
      }
      let w = 0, E = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const A = this.createRequestOptions();
      A.redirect = "manual", g = (T) => {
        var O, $;
        if (T >= t.length) {
          this.fileMetadataBuffer != null && h.write(this.fileMetadataBuffer), h.end();
          return;
        }
        const B = t[T++];
        if (B.kind === $r.OperationKind.COPY) {
          m && m.beginFileCopy(), (0, B_.copyData)(B, h, r, a, () => g(T));
          return;
        }
        const q = `bytes=${B.start}-${B.end - 1}`;
        A.headers.range = q, ($ = (O = this.logger) === null || O === void 0 ? void 0 : O.debug) === null || $ === void 0 || $.call(O, `download range: ${q}`), m && m.beginRangeDownload();
        const J = this.httpExecutor.createRequest(A, (Q) => {
          Q.on("error", a), Q.on("aborted", () => {
            a(new Error("response has been aborted by the server"));
          }), Q.statusCode >= 400 && a((0, bn.createHttpError)(Q)), Q.pipe(h, {
            end: !1
          }), Q.once("end", () => {
            m && m.endRangeDownload(), ++w === 100 ? (w = 0, setTimeout(() => g(T), 1e3)) : g(T);
          });
        });
        J.on("redirect", (Q, oe, U) => {
          this.logger.info(`Redirect to ${G_(U)}`), E = U, (0, bn.configureRequestUrl)(new j_.URL(E), A), J.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(J, a), J.end();
      }, g(0);
    });
  }
  async readRemoteBytes(t, n) {
    const r = Buffer.allocUnsafe(n + 1 - t), i = this.createRequestOptions();
    i.headers.range = `bytes=${t}-${n}`;
    let o = 0;
    if (await this.request(i, (s) => {
      s.copy(r, o), o += s.length;
    }), o !== r.length)
      throw new Error(`Received data length ${o} is not equal to expected ${r.length}`);
    return r;
  }
  request(t, n) {
    return new Promise((r, i) => {
      const o = this.httpExecutor.createRequest(t, (s) => {
        (0, al.checkIsRangesSupported)(s, i) && (s.on("error", i), s.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), s.on("data", n), s.on("end", () => r()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(o, i), o.end();
    });
  }
}
ar.DifferentialDownloader = q_;
function ll(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function G_(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(yi, "__esModule", { value: !0 });
yi.GenericDifferentialDownloader = void 0;
const V_ = ar;
class W_ extends V_.DifferentialDownloader {
  download(t, n) {
    return this.doDownload(t, n);
  }
}
yi.GenericDifferentialDownloader = W_;
var St = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = r;
  const t = de;
  Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } }), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded";
  class n {
    constructor(o) {
      this.emitter = o;
    }
    /**
     * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
     */
    login(o) {
      r(this.emitter, "login", o);
    }
    progress(o) {
      r(this.emitter, e.DOWNLOAD_PROGRESS, o);
    }
    updateDownloaded(o) {
      r(this.emitter, e.UPDATE_DOWNLOADED, o);
    }
    updateCancelled(o) {
      r(this.emitter, "update-cancelled", o);
    }
  }
  e.UpdaterSignal = n;
  function r(i, o, s) {
    i.on(o, s);
  }
})(St);
Object.defineProperty(Et, "__esModule", { value: !0 });
Et.NoOpLogger = Et.AppUpdater = void 0;
const be = de, Y_ = Jn, z_ = Jr, X_ = Ol, qe = Tt, K_ = ye, io = si, ke = Z, Dt = Lu, cl = or, J_ = di, ul = Uu, Q_ = sr, oo = hi, so = Nl, Z_ = yi, zt = St;
class ss extends X_.EventEmitter {
  /**
   * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
   */
  get channel() {
    return this._channel;
  }
  /**
   * Set the update channel. Overrides `channel` in the update configuration.
   *
   * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
   */
  set channel(t) {
    if (this._channel != null) {
      if (typeof t != "string")
        throw (0, be.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, be.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
    }
    this._channel = t, this.allowDowngrade = !0;
  }
  /**
   *  Shortcut for explicitly adding auth tokens to request headers
   */
  addAuthHeader(t) {
    this.requestHeaders = Object.assign({}, this.requestHeaders, {
      authorization: t
    });
  }
  // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  get netSession() {
    return (0, ul.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new Wu();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new io.Lazy(() => this.loadUpdateConfig());
  }
  /**
   * Allows developer to override default logic for determining if an update is supported.
   * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
   */
  get isUpdateSupported() {
    return this._isUpdateSupported;
  }
  set isUpdateSupported(t) {
    t && (this._isUpdateSupported = t);
  }
  /**
   * Allows developer to override default logic for determining if the user is below the rollout threshold.
   * The default logic compares the staging percentage with numerical representation of user ID.
   * An override can define custom logic, or bypass it if needed.
   */
  get isUserWithinRollout() {
    return this._isUserWithinRollout;
  }
  set isUserWithinRollout(t) {
    t && (this._isUserWithinRollout = t);
  }
  constructor(t, n) {
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new zt.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (o) => this.checkIfUpdateSupported(o), this._isUserWithinRollout = (o) => this.isStagingMatch(o), this.clientPromise = null, this.stagingUserIdPromise = new io.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new io.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (o) => {
      this._logger.error(`Error: ${o.stack || o.message}`);
    }), n == null ? (this.app = new J_.ElectronAppAdapter(), this.httpExecutor = new ul.ElectronHttpExecutor((o, s) => this.emit("login", o, s))) : (this.app = n, this.httpExecutor = null);
    const r = this.app.version, i = (0, Dt.parse)(r);
    if (i == null)
      throw (0, be.newError)(`App version is not a valid semver version: "${r}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = ev(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
  }
  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  getFeedURL() {
    return "Deprecated. Do not use it.";
  }
  /**
   * Configure update provider. If value is `string`, [GenericServerOptions](https://www.electron.build/publish#genericserveroptions) will be set with value as `url`.
   * @param options If you want to override configuration in the `app-update.yml`.
   */
  setFeedURL(t) {
    const n = this.createProviderRuntimeOptions();
    let r;
    typeof t == "string" ? r = new Q_.GenericProvider({ provider: "generic", url: t }, this, {
      ...n,
      isUseMultipleRangeRequest: (0, oo.isUrlProbablySupportMultiRangeRequests)(t)
    }) : r = (0, oo.createClient)(t, this, n), this.clientPromise = Promise.resolve(r);
  }
  /**
   * Asks the server whether there is an update.
   * @returns null if the updater is disabled, otherwise info about the latest version
   */
  checkForUpdates() {
    if (!this.isUpdaterActive())
      return Promise.resolve(null);
    let t = this.checkForUpdatesPromise;
    if (t != null)
      return this._logger.info("Checking for update (already in progress)"), t;
    const n = () => this.checkForUpdatesPromise = null;
    return this._logger.info("Checking for update"), t = this.doCheckForUpdates().then((r) => (n(), r)).catch((r) => {
      throw n(), this.emit("error", r, `Cannot check for updates: ${(r.stack || r).toString()}`), r;
    }), this.checkForUpdatesPromise = t, t;
  }
  isUpdaterActive() {
    return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
  }
  // noinspection JSUnusedGlobalSymbols
  checkForUpdatesAndNotify(t) {
    return this.checkForUpdates().then((n) => n != null && n.downloadPromise ? (n.downloadPromise.then(() => {
      const r = ss.formatDownloadNotification(n.updateInfo.version, this.app.name, t);
      new Ut.Notification(r).show();
    }), n) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), n));
  }
  static formatDownloadNotification(t, n, r) {
    return r == null && (r = {
      title: "A new update is ready to install",
      body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
    }), r = {
      title: r.title.replace("{appName}", n).replace("{version}", t),
      body: r.body.replace("{appName}", n).replace("{version}", t)
    }, r;
  }
  async isStagingMatch(t) {
    const n = t.stagingPercentage;
    let r = n;
    if (r == null)
      return !0;
    if (r = parseInt(r, 10), isNaN(r))
      return this._logger.warn(`Staging percentage is NaN: ${n}`), !0;
    r = r / 100;
    const i = await this.stagingUserIdPromise.value, s = be.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${r}, percentage: ${s}, user id: ${i}`), s < r;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const n = (0, Dt.parse)(t.version);
    if (n == null)
      throw (0, be.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const r = this.currentVersion;
    if ((0, Dt.eq)(n, r) || !await Promise.resolve(this.isUpdateSupported(t)) || !await Promise.resolve(this.isUserWithinRollout(t)))
      return !1;
    const o = (0, Dt.gt)(n, r), s = (0, Dt.lt)(n, r);
    return o ? !0 : this.allowDowngrade && s;
  }
  checkIfUpdateSupported(t) {
    const n = t == null ? void 0 : t.minimumSystemVersion, r = (0, z_.release)();
    if (n)
      try {
        if ((0, Dt.lt)(r, n))
          return this._logger.info(`Current OS version ${r} is less than the minimum OS version required ${n} for version ${r}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${r}) with minimum OS version(${n}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((r) => (0, oo.createClient)(r, this, this.createProviderRuntimeOptions())));
    const t = await this.clientPromise, n = await this.stagingUserIdPromise.value;
    return t.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": n })), {
      info: await t.getLatestVersion(),
      provider: t
    };
  }
  createProviderRuntimeOptions() {
    return {
      isUseMultipleRangeRequest: !0,
      platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
      executor: this.httpExecutor
    };
  }
  async doCheckForUpdates() {
    this.emit("checking-for-update");
    const t = await this.getUpdateInfoAndProvider(), n = t.info;
    if (!await this.isUpdateAvailable(n))
      return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${n.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", n), {
        isUpdateAvailable: !1,
        versionInfo: n,
        updateInfo: n
      };
    this.updateInfoAndProvider = t, this.onUpdateAvailable(n);
    const r = new be.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: n,
      updateInfo: n,
      cancellationToken: r,
      downloadPromise: this.autoDownload ? this.downloadUpdate(r) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, be.asArray)(t.files).map((n) => n.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new be.CancellationToken()) {
    const n = this.updateInfoAndProvider;
    if (n == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, be.asArray)(n.info.files).map((i) => i.url).join(", ")}`);
    const r = (i) => {
      if (!(i instanceof be.CancellationError))
        try {
          this.dispatchError(i);
        } catch (o) {
          this._logger.warn(`Cannot dispatch error event: ${o.stack || o}`);
        }
      return i;
    };
    return this.downloadPromise = this.doDownloadUpdate({
      updateInfoAndProvider: n,
      requestHeaders: this.computeRequestHeaders(n.provider),
      cancellationToken: t,
      disableWebInstaller: this.disableWebInstaller,
      disableDifferentialDownload: this.disableDifferentialDownload
    }).catch((i) => {
      throw r(i);
    }).finally(() => {
      this.downloadPromise = null;
    }), this.downloadPromise;
  }
  dispatchError(t) {
    this.emit("error", t, (t.stack || t).toString());
  }
  dispatchUpdateDownloaded(t) {
    this.emit(zt.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, K_.load)(await (0, qe.readFile)(this._appUpdateConfigPath, "utf-8"));
  }
  computeRequestHeaders(t) {
    const n = t.fileExtraDownloadHeaders;
    if (n != null) {
      const r = this.requestHeaders;
      return r == null ? n : {
        ...n,
        ...r
      };
    }
    return this.computeFinalHeaders({ accept: "*/*" });
  }
  async getOrCreateStagingUserId() {
    const t = ke.join(this.app.userDataPath, ".updaterId");
    try {
      const r = await (0, qe.readFile)(t, "utf-8");
      if (be.UUID.check(r))
        return r;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${r}`);
    } catch (r) {
      r.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${r}`);
    }
    const n = be.UUID.v5((0, Y_.randomBytes)(4096), be.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${n}`);
    try {
      await (0, qe.outputFile)(t, n);
    } catch (r) {
      this._logger.warn(`Couldn't write out staging user ID: ${r}`);
    }
    return n;
  }
  /** @internal */
  get isAddNoCacheQuery() {
    const t = this.requestHeaders;
    if (t == null)
      return !0;
    for (const n of Object.keys(t)) {
      const r = n.toLowerCase();
      if (r === "authorization" || r === "private-token")
        return !1;
    }
    return !0;
  }
  async getOrCreateDownloadHelper() {
    let t = this.downloadedUpdateHelper;
    if (t == null) {
      const n = (await this.configOnDisk.value).updaterCacheDirName, r = this._logger;
      n == null && r.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
      const i = ke.join(this.app.baseCachePath, n || this.app.name);
      r.debug != null && r.debug(`updater cache dir: ${i}`), t = new cl.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
    }
    return t;
  }
  async executeDownload(t) {
    const n = t.fileInfo, r = {
      headers: t.downloadUpdateOptions.requestHeaders,
      cancellationToken: t.downloadUpdateOptions.cancellationToken,
      sha2: n.info.sha2,
      sha512: n.info.sha512
    };
    this.listenerCount(zt.DOWNLOAD_PROGRESS) > 0 && (r.onProgress = (O) => this.emit(zt.DOWNLOAD_PROGRESS, O));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, o = i.version, s = n.packageInfo;
    function a() {
      const O = decodeURIComponent(t.fileInfo.url.pathname);
      return O.toLowerCase().endsWith(`.${t.fileExtension.toLowerCase()}`) ? ke.basename(O) : ke.basename(t.fileInfo.info.url);
    }
    const c = await this.getOrCreateDownloadHelper(), m = c.cacheDirForPendingUpdate;
    await (0, qe.mkdir)(m, { recursive: !0 });
    const l = a();
    let f = ke.join(m, l);
    const h = s == null ? null : ke.join(m, `package-${o}${ke.extname(s.path) || ".7z"}`), g = async (O) => {
      await c.setDownloadedFile(f, h, i, n, l, O), await t.done({
        ...i,
        downloadedFile: f
      });
      const $ = ke.join(m, "current.blockmap");
      return await (0, qe.pathExists)($) && await (0, qe.copyFile)($, ke.join(c.cacheDir, "current.blockmap")), h == null ? [f] : [f, h];
    }, w = this._logger, E = await c.validateDownloadedPath(f, i, n, w);
    if (E != null)
      return f = E, await g(!1);
    const A = async () => (await c.clear().catch(() => {
    }), await (0, qe.unlink)(f).catch(() => {
    })), T = await (0, cl.createTempUpdateFile)(`temp-${l}`, m, w);
    try {
      await t.task(T, r, h, A), await (0, be.retry)(() => (0, qe.rename)(T, f), {
        retries: 60,
        interval: 500,
        shouldRetry: (O) => O instanceof Error && /^EBUSY:/.test(O.message) ? !0 : (w.warn(`Cannot rename temp file to final file: ${O.message || O.stack}`), !1)
      });
    } catch (O) {
      throw await A(), O instanceof be.CancellationError && (w.info("cancelled"), this.emit("update-cancelled", i)), O;
    }
    return w.info(`New version ${o} has been downloaded to ${f}`), await g(!0);
  }
  async differentialDownloadInstaller(t, n, r, i, o) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const s = n.updateInfoAndProvider.provider, a = await s.getBlockMapFiles(t.url, this.app.version, n.updateInfoAndProvider.info.version, this.previousBlockmapBaseUrlOverride);
      this._logger.info(`Download block maps (old: "${a[0]}", new: ${a[1]})`);
      const c = async (w) => {
        const E = await this.httpExecutor.downloadToBuffer(w, {
          headers: n.requestHeaders,
          cancellationToken: n.cancellationToken
        });
        if (E == null || E.length === 0)
          throw new Error(`Blockmap "${w.href}" is empty`);
        try {
          return JSON.parse((0, so.gunzipSync)(E).toString());
        } catch (A) {
          throw new Error(`Cannot parse blockmap "${w.href}", error: ${A}`);
        }
      }, m = {
        newUrl: t.url,
        oldFile: ke.join(this.downloadedUpdateHelper.cacheDir, o),
        logger: this._logger,
        newFile: r,
        isUseMultipleRangeRequest: s.isUseMultipleRangeRequest,
        requestHeaders: n.requestHeaders,
        cancellationToken: n.cancellationToken
      };
      this.listenerCount(zt.DOWNLOAD_PROGRESS) > 0 && (m.onProgress = (w) => this.emit(zt.DOWNLOAD_PROGRESS, w));
      const l = async (w, E) => {
        const A = ke.join(E, "current.blockmap");
        await (0, qe.outputFile)(A, (0, so.gzipSync)(JSON.stringify(w)));
      }, f = async (w) => {
        const E = ke.join(w, "current.blockmap");
        try {
          if (await (0, qe.pathExists)(E))
            return JSON.parse((0, so.gunzipSync)(await (0, qe.readFile)(E)).toString());
        } catch (A) {
          this._logger.warn(`Cannot parse blockmap "${E}", error: ${A}`);
        }
        return null;
      }, h = await c(a[1]);
      await l(h, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
      let g = await f(this.downloadedUpdateHelper.cacheDir);
      return g == null && (g = await c(a[0])), await new Z_.GenericDifferentialDownloader(t.info, this.httpExecutor, m).download(g, h), !1;
    } catch (s) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), this._testOnlyOptions != null)
        throw s;
      return !0;
    }
  }
}
Et.AppUpdater = ss;
function ev(e) {
  const t = (0, Dt.prerelease)(e);
  return t != null && t.length > 0;
}
class Wu {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  info(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  warn(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error(t) {
  }
}
Et.NoOpLogger = Wu;
Object.defineProperty(jt, "__esModule", { value: !0 });
jt.BaseUpdater = void 0;
const fl = Kr, ao = Z, tv = Et;
class nv extends tv.AppUpdater {
  constructor(t, n) {
    super(t, n), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, n = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? n : this.autoRunAppAfterInstall) ? setImmediate(() => {
      Ut.autoUpdater.emit("before-quit-for-update"), this.app.quit();
    }) : this.quitAndInstallCalled = !1;
  }
  executeDownload(t) {
    return super.executeDownload({
      ...t,
      done: (n) => (this.dispatchUpdateDownloaded(n), this.addQuitHandler(), Promise.resolve())
    });
  }
  get installerPath() {
    return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
  }
  // must be sync (because quit even handler is not async)
  install(t = !1, n = !1) {
    if (this.quitAndInstallCalled)
      return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
    const r = this.downloadedUpdateHelper, i = this.installerPath, o = r == null ? null : r.downloadedFileInfo;
    if (i == null || o == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    this.quitAndInstallCalled = !0;
    try {
      return this._logger.info(`Install: isSilent: ${t}, isForceRunAfter: ${n}`), this.doInstall({
        isSilent: t,
        isForceRunAfter: n,
        isAdminRightsRequired: o.isAdminRightsRequired
      });
    } catch (s) {
      return this.dispatchError(s), !1;
    }
  }
  addQuitHandler() {
    this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((t) => {
      if (this.quitAndInstallCalled) {
        this._logger.info("Update installer has already been triggered. Quitting application.");
        return;
      }
      if (!this.autoInstallOnAppQuit) {
        this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
        return;
      }
      if (t !== 0) {
        this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${t}`);
        return;
      }
      this._logger.info("Auto install update on quit"), this.install(!0, !1);
    }));
  }
  /**
   * Strips relative-path entries from a PATH string.
   * Prevents PATH-poisoning where a writable directory earlier in PATH shadows
   * a trusted package manager binary.
   */
  sanitizeEnvPath(t) {
    return t.split(ao.delimiter).filter((n) => ao.isAbsolute(n)).join(ao.delimiter);
  }
  spawnSyncLog(t, n = [], r = {}) {
    var i;
    this._logger.info(`Executing: ${t} with args: ${n}`);
    const o = { ...process.env, ...r }, s = (0, fl.spawnSync)(t, n, {
      env: { ...o, PATH: this.sanitizeEnvPath((i = o.PATH) !== null && i !== void 0 ? i : "") },
      encoding: "utf-8",
      shell: !0
    }), { error: a, status: c, stdout: m, stderr: l } = s;
    if (a != null)
      throw this._logger.error(l), a;
    if (c != null && c !== 0)
      throw this._logger.error(l), new Error(`Command ${t} exited with code ${c}`);
    return m.trim();
  }
  /**
   * This handles both node 8 and node 10 way of emitting error when spawning a process
   *   - node 8: Throws the error
   *   - node 10: Emit the error(Need to listen with on)
   */
  // https://github.com/electron-userland/electron-builder/issues/1129
  // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
  async spawnLog(t, n = [], r = void 0, i = "ignore") {
    return this._logger.info(`Executing: ${t} with args: ${n}`), new Promise((o, s) => {
      try {
        const a = { stdio: i, env: r, detached: !0 }, c = (0, fl.spawn)(t, n, a);
        c.on("error", (m) => {
          s(m);
        }), c.unref(), c.pid !== void 0 && o(!0);
      } catch (a) {
        s(a);
      }
    });
  }
}
jt.BaseUpdater = nv;
var Gn = {}, lr = {};
Object.defineProperty(lr, "__esModule", { value: !0 });
lr.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const Xt = Tt, rv = ar, iv = Nl;
class ov extends rv.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, n = t.size, r = n - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(r, n - 1);
    const i = Yu(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await sv(this.options.oldFile), i);
  }
}
lr.FileWithEmbeddedBlockMapDifferentialDownloader = ov;
function Yu(e) {
  return JSON.parse((0, iv.inflateRawSync)(e).toString());
}
async function sv(e) {
  const t = await (0, Xt.open)(e, "r");
  try {
    const n = (await (0, Xt.fstat)(t)).size, r = Buffer.allocUnsafe(4);
    await (0, Xt.read)(t, r, 0, r.length, n - r.length);
    const i = Buffer.allocUnsafe(r.readUInt32BE(0));
    return await (0, Xt.read)(t, i, 0, i.length, n - r.length - i.length), await (0, Xt.close)(t), Yu(i);
  } catch (n) {
    throw await (0, Xt.close)(t), n;
  }
}
Object.defineProperty(Gn, "__esModule", { value: !0 });
Gn.AppImageUpdater = void 0;
const lo = de, dl = Kr, av = Tt, lv = vt, Kt = Z, cv = jt, uv = lr, fv = le, hl = St;
class dv extends cv.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, fv.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        const s = process.env.APPIMAGE;
        if (s == null)
          throw (0, lo.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(r, s, i, n, t)) && await this.httpExecutor.download(r.url, i, o), await (0, av.chmod)(i, 493);
      }
    });
  }
  async downloadDifferential(t, n, r, i, o) {
    try {
      const s = {
        newUrl: t.url,
        oldFile: n,
        logger: this._logger,
        newFile: r,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: o.requestHeaders,
        cancellationToken: o.cancellationToken
      };
      return this.listenerCount(hl.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (a) => this.emit(hl.DOWNLOAD_PROGRESS, a)), await new uv.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, s).download(), !1;
    } catch (s) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const n = process.env.APPIMAGE;
    if (n == null)
      throw (0, lo.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    if (!Kt.isAbsolute(n) || n.includes("\0"))
      throw (0, lo.newError)(`APPIMAGE env is not a valid absolute path: "${n}"`, "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, lv.unlinkSync)(n);
    let r;
    const i = Kt.basename(n), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    Kt.basename(o) === i || !/\d+\.\d+\.\d+/.test(i) ? r = n : r = Kt.join(Kt.dirname(n), Kt.basename(o)), (0, dl.execFileSync)("mv", ["-f", o, r]), r !== n && this.emit("appimage-filename-updated", r);
    const s = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(r, [], s) : (s.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, dl.execFileSync)(r, [], { env: s })), !0;
  }
}
Gn.AppImageUpdater = dv;
var Vn = {}, mn = {};
Object.defineProperty(mn, "__esModule", { value: !0 });
mn.LinuxUpdater = void 0;
const hv = jt, pv = /^[a-zA-Z0-9_-]+$/;
class mv extends hv.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /**
   * Returns true if the current process is running as root.
   */
  isRunningAsRoot() {
    var t;
    return ((t = process.getuid) === null || t === void 0 ? void 0 : t.call(process)) === 0;
  }
  /**
   * Sanitizes the installer path for use with shell:true spawn calls.
   * Backslash-escapes metacharacters that have special meaning in POSIX shell.
   * Note: paths containing single-quotes (') are not supported.
   */
  get installerPath() {
    const t = super.installerPath;
    return t == null ? null : t.replace(/\\/g, "\\\\").replace(/([`$!" ;|&()<>])/g, "\\$1").replace(/[\n\r]/g, "");
  }
  runCommandWithSudoIfNeeded(t) {
    if (this.isRunningAsRoot())
      return this._logger.info("Running as root, no need to use sudo"), this.spawnSyncLog(t[0], t.slice(1));
    const { name: n } = this.app, i = `"${n.replace(/["`$\\!\n\r;|&<>(){}*?[\]#~]/g, "")} would like to update"`, o = this.sudoWithArgs(i);
    this._logger.info(`Running as non-root user, using sudo to install: ${o}`);
    let s = '"';
    return (/pkexec/i.test(o[0]) || o[0] === "sudo") && (s = ""), this.spawnSyncLog(o[0], [...o.length > 1 ? o.slice(1) : [], `${s}/bin/bash`, "-c", `'${t.join(" ")}'${s}`]);
  }
  sudoWithArgs(t) {
    const n = this.determineSudoCommand(), r = [n];
    return /kdesudo/i.test(n) ? (r.push("--comment", t), r.push("-c")) : /gksudo/i.test(n) ? r.push("--message", t) : /pkexec/i.test(n) && r.push("--disable-internal-agent"), r;
  }
  hasCommand(t) {
    try {
      return this.spawnSyncLog("command", ["-v", t]), !0;
    } catch {
      return !1;
    }
  }
  determineSudoCommand() {
    const t = ["gksudo", "kdesudo", "pkexec", "beesu"];
    for (const n of t)
      if (this.hasCommand(n))
        return n;
    return "sudo";
  }
  /**
   * Detects the package manager to use based on the available commands.
   * Allows overriding the default behavior by setting the ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER environment variable.
   * If the environment variable is set, it will be used directly. (This is useful for testing each package manager logic path.)
   * Otherwise, it checks for the presence of the specified package manager commands in the order provided.
   * @param pms - An array of package manager commands to check for, in priority order.
   * @returns The detected package manager command or "unknown" if none are found.
   */
  detectPackageManager(t) {
    var n;
    let r = t;
    const i = (n = process.env.ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER) === null || n === void 0 ? void 0 : n.trim();
    i && (pv.test(i) ? r = [i] : this._logger.warn(`ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER "${i}" contains unsafe characters. Ignoring override.`));
    for (const a of r)
      if (this.hasCommand(a))
        return a;
    const o = i ? `ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER override "${i}", ` : "", s = t[0];
    return this._logger.warn(`No package manager found in the list: ${o}${t.join(", ")}. Utilizing default: ${s}`), s;
  }
}
mn.LinuxUpdater = mv;
Object.defineProperty(Vn, "__esModule", { value: !0 });
Vn.DebUpdater = void 0;
const gv = le, pl = St, Ev = mn;
class as extends Ev.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, gv.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(pl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(pl.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(r.url, i, o);
      }
    });
  }
  doInstall(t) {
    const n = this.installerPath;
    if (n == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    if (!this.hasCommand("dpkg") && !this.hasCommand("apt"))
      return this.dispatchError(new Error("Neither dpkg nor apt command found. Cannot install .deb package.")), !1;
    const r = ["dpkg", "apt"], i = this.detectPackageManager(r);
    try {
      as.installWithCommandRunner(i, n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (o) {
      return this.dispatchError(o), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, n, r, i) {
    var o;
    if (t === "dpkg")
      try {
        r(["dpkg", "-i", n]);
      } catch (s) {
        i.warn((o = s.message) !== null && o !== void 0 ? o : s), i.warn("dpkg installation failed, trying to fix broken dependencies with apt-get"), r(["apt-get", "install", "-f", "-y"]);
      }
    else if (t === "apt")
      i.warn("Using apt to install a local .deb. This may fail for unsigned packages unless properly configured."), r([
        "apt",
        "install",
        "-y",
        "--allow-unauthenticated",
        // needed for unsigned .debs
        "--allow-downgrades",
        // allow lower version installs
        "--allow-change-held-packages",
        n
      ]);
    else
      throw new Error(`Package manager ${t} not supported`);
  }
}
Vn.DebUpdater = as;
var Wn = {};
Object.defineProperty(Wn, "__esModule", { value: !0 });
Wn.PacmanUpdater = void 0;
const ml = St, yv = le, wv = mn;
class ls extends wv.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, yv.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(ml.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(ml.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(r.url, i, o);
      }
    });
  }
  doInstall(t) {
    const n = this.installerPath;
    if (n == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    try {
      ls.installWithCommandRunner(n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (r) {
      return this.dispatchError(r), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, n, r) {
    var i;
    try {
      n(["pacman", "-U", "--noconfirm", t]);
    } catch (o) {
      r.warn((i = o.message) !== null && i !== void 0 ? i : o), r.warn("pacman installation failed, attempting to update package database and retry");
      try {
        n(["pacman", "-Sy", "--noconfirm"]), n(["pacman", "-U", "--noconfirm", t]);
      } catch (s) {
        throw r.error("Retry after pacman -Sy failed"), s;
      }
    }
  }
}
Wn.PacmanUpdater = ls;
var Yn = {};
Object.defineProperty(Yn, "__esModule", { value: !0 });
Yn.RpmUpdater = void 0;
const gl = St, _v = le, vv = mn;
class cs extends vv.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, _v.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(gl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(gl.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(r.url, i, o);
      }
    });
  }
  doInstall(t) {
    const n = this.installerPath;
    if (n == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const r = ["zypper", "dnf", "yum", "rpm"], i = this.detectPackageManager(r);
    try {
      cs.installWithCommandRunner(i, n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (o) {
      return this.dispatchError(o), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, n, r, i) {
    if (t === "zypper")
      return r(["zypper", "--non-interactive", "--no-refresh", "install", "--allow-unsigned-rpm", "-f", n]);
    if (t === "dnf")
      return r(["dnf", "install", "--nogpgcheck", "-y", n]);
    if (t === "yum")
      return r(["yum", "install", "--nogpgcheck", "-y", n]);
    if (t === "rpm")
      return i.warn("Installing with rpm only (no dependency resolution)."), r(["rpm", "-Uvh", "--replacepkgs", "--replacefiles", "--nodeps", n]);
    throw new Error(`Package manager ${t} not supported`);
  }
}
Yn.RpmUpdater = cs;
var zn = {};
Object.defineProperty(zn, "__esModule", { value: !0 });
zn.MacUpdater = void 0;
const El = de, co = Tt, Av = vt, yl = Z, Tv = ed, Sv = Et, bv = le, wl = Kr, _l = Jn;
class us extends Sv.AppUpdater {
  constructor(t, n) {
    super(t, n), this.nativeUpdater = Ut.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (r) => {
      this._logger.warn(r), this.emit("error", r);
    }), this.nativeUpdater.on("update-downloaded", () => {
      this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
    });
  }
  /** Filters update files to the appropriate architecture.
   * On arm64 Macs (including Rosetta), arm64 files are preferred when available.
   * On x64 Macs, arm64 files are excluded. */
  static filterFilesForArch(t, n) {
    const r = (i) => {
      var o;
      return i.url.pathname.includes("arm64") || ((o = i.info.url) === null || o === void 0 ? void 0 : o.includes("arm64"));
    };
    return n && t.some(r) ? t.filter((i) => n === r(i)) : t.filter((i) => !r(i));
  }
  debug(t) {
    this._logger.debug != null && this._logger.debug(t);
  }
  closeServerIfExists() {
    this.server && (this.debug("Closing proxy server"), this.server.close((t) => {
      t && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
    }));
  }
  async doDownloadUpdate(t) {
    let n = t.updateInfoAndProvider.provider.resolveFiles(t.updateInfoAndProvider.info);
    const r = this._logger, i = "sysctl.proc_translated";
    let o = !1;
    try {
      this.debug("Checking for macOS Rosetta environment"), o = (0, wl.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), r.info(`Checked for macOS Rosetta environment (isRosetta=${o})`);
    } catch (l) {
      r.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${l}`);
    }
    let s = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const f = (0, wl.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      r.info(`Checked 'uname -a': arm64=${f}`), s = s || f;
    } catch (l) {
      r.warn(`uname shell command to check for arm64 failed: ${l}`);
    }
    s = s || process.arch === "arm64" || o, n = us.filterFilesForArch(n, s);
    const a = (0, bv.findFile)(n, "zip", ["pkg", "dmg"]);
    if (a == null)
      throw (0, El.newError)(`ZIP file not provided: ${(0, El.safeStringifyJson)(n)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const c = t.updateInfoAndProvider.provider, m = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: a,
      downloadUpdateOptions: t,
      task: async (l, f) => {
        const h = yl.join(this.downloadedUpdateHelper.cacheDir, m), g = () => (0, co.pathExistsSync)(h) ? !t.disableDifferentialDownload : (r.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let w = !0;
        g() && (w = await this.differentialDownloadInstaller(a, t, l, c, m)), w && await this.httpExecutor.download(a.url, l, f);
      },
      done: async (l) => {
        if (!t.disableDifferentialDownload)
          try {
            const f = yl.join(this.downloadedUpdateHelper.cacheDir, m);
            await (0, co.copyFile)(l.downloadedFile, f);
          } catch (f) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${f.message}`);
          }
        return this.updateDownloaded(a, l);
      }
    });
  }
  async updateDownloaded(t, n) {
    var r;
    const i = n.downloadedFile, o = (r = t.info.size) !== null && r !== void 0 ? r : (await (0, co.stat)(i)).size, s = this._logger, a = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${a})`), this.server = (0, Tv.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${a})`), this.server.on("close", () => {
      s.info(`Proxy server for native Squirrel.Mac is closed (${a})`);
    });
    const c = (m) => {
      const l = m.address();
      return typeof l == "string" ? l : `http://127.0.0.1:${l == null ? void 0 : l.port}`;
    };
    return await new Promise((m, l) => {
      const f = (0, _l.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), h = Buffer.from(`autoupdater:${f}`, "ascii"), g = `/${(0, _l.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (w, E) => {
        const A = w.url;
        if (s.info(`${A} requested`), A === "/") {
          if (!w.headers.authorization || w.headers.authorization.indexOf("Basic ") === -1) {
            E.statusCode = 401, E.statusMessage = "Invalid Authentication Credentials", E.end(), s.warn("No authenthication info");
            return;
          }
          const $ = w.headers.authorization.split(" ")[1], B = Buffer.from($, "base64").toString("ascii"), [q, J] = B.split(":");
          if (q !== "autoupdater" || J !== f) {
            E.statusCode = 401, E.statusMessage = "Invalid Authentication Credentials", E.end(), s.warn("Invalid authenthication credentials");
            return;
          }
          const Q = Buffer.from(`{ "url": "${c(this.server)}${g}" }`);
          E.writeHead(200, { "Content-Type": "application/json", "Content-Length": Q.length }), E.end(Q);
          return;
        }
        if (!A.startsWith(g)) {
          s.warn(`${A} requested, but not supported`), E.writeHead(404), E.end();
          return;
        }
        s.info(`${g} requested by Squirrel.Mac, pipe ${i}`);
        let T = !1;
        E.on("finish", () => {
          T || (this.nativeUpdater.removeListener("error", l), m([]));
        });
        const O = (0, Av.createReadStream)(i);
        O.on("error", ($) => {
          try {
            E.end();
          } catch (B) {
            s.warn(`cannot end response: ${B}`);
          }
          T = !0, this.nativeUpdater.removeListener("error", l), l(new Error(`Cannot pipe "${i}": ${$}`));
        }), E.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": o
        }), O.pipe(E);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${a})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${c(this.server)}, ${a})`), this.nativeUpdater.setFeedURL({
          url: c(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${h.toString("base64")}`
          }
        }), this.dispatchUpdateDownloaded(n), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", l), this.nativeUpdater.checkForUpdates()) : m([]);
      });
    });
  }
  handleUpdateDownloaded() {
    this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
  }
  quitAndInstall() {
    this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
  }
}
zn.MacUpdater = us;
var Xn = {}, fs = {};
Object.defineProperty(fs, "__esModule", { value: !0 });
fs.verifySignature = Rv;
const vl = de, zu = Kr, Cv = Jr, Al = Z;
function Xu(e, t) {
  return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", e], {
    shell: !0,
    timeout: t
  }];
}
function Rv(e, t, n) {
  return new Promise((r, i) => {
    const o = t.replace(/'/g, "''");
    n.info(`Verifying signature ${o}`), (0, zu.execFile)(...Xu(`"Get-AuthenticodeSignature -LiteralPath '${o}' | ConvertTo-Json -Compress"`, 20 * 1e3), (s, a, c) => {
      var m;
      try {
        if (s != null || c) {
          uo(n, s, c, i), r(null);
          return;
        }
        const l = Ov(a);
        if (l.Status === 0) {
          try {
            const w = Al.normalize(l.Path), E = Al.normalize(t);
            if (n.info(`LiteralPath: ${w}. Update Path: ${E}`), w !== E) {
              uo(n, new Error(`LiteralPath of ${w} is different than ${E}`), c, i), r(null);
              return;
            }
          } catch (w) {
            n.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(m = w.message) !== null && m !== void 0 ? m : w.stack}`);
          }
          const h = (0, vl.parseDn)(l.SignerCertificate.Subject);
          let g = !1;
          for (const w of e) {
            const E = (0, vl.parseDn)(w);
            if (E.size ? g = Array.from(E.keys()).every((T) => E.get(T) === h.get(T)) : w === h.get("CN") && (n.warn(`Signature validated using only CN ${w}. Please add your full Distinguished Name (DN) to publisherNames configuration`), g = !0), g) {
              r(null);
              return;
            }
          }
        }
        const f = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(l, (h, g) => h === "RawData" ? void 0 : g, 2);
        n.warn(`Sign verification failed, installer signed with incorrect certificate: ${f}`), r(f);
      } catch (l) {
        uo(n, l, null, i), r(null);
        return;
      }
    });
  });
}
function Ov(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const n = t.SignerCertificate;
  return n != null && (delete n.Archived, delete n.Extensions, delete n.Handle, delete n.HasPrivateKey, delete n.SubjectName), t;
}
function uo(e, t, n, r) {
  if (Iv()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || n}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, zu.execFileSync)(...Xu("ConvertTo-Json test", 10 * 1e3));
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && r(t), n && r(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${n}. Failing signature validation due to unknown stderr.`));
}
function Iv() {
  const e = Cv.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(Xn, "__esModule", { value: !0 });
Xn.NsisUpdater = void 0;
const Fr = de, Tl = Z, Nv = jt, Pv = lr, Sl = St, Dv = le, $v = Tt, Fv = fs, bl = At;
class xv extends Nv.BaseUpdater {
  constructor(t, n) {
    super(t, n), this._verifyUpdateCodeSignature = (r, i) => (0, Fv.verifySignature)(r, i, this._logger);
  }
  /**
   * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
   * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
   */
  get verifyUpdateCodeSignature() {
    return this._verifyUpdateCodeSignature;
  }
  set verifyUpdateCodeSignature(t) {
    t && (this._verifyUpdateCodeSignature = t);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, Dv.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: r,
      task: async (i, o, s, a) => {
        const c = r.packageInfo, m = c != null && s != null;
        if (m && t.disableWebInstaller)
          throw (0, Fr.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !m && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (m || t.disableDifferentialDownload || await this.differentialDownloadInstaller(r, t, i, n, Fr.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(r.url, i, o);
        const l = await this.verifySignature(i);
        if (l != null)
          throw await a(), (0, Fr.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${l}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (m && await this.differentialDownloadWebPackage(t, c, s, n))
          try {
            await this.httpExecutor.download(new bl.URL(c.path), s, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: c.sha512
            });
          } catch (f) {
            try {
              await (0, $v.unlink)(s);
            } catch {
            }
            throw f;
          }
      }
    });
  }
  // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
  // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
  // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
  async verifySignature(t) {
    let n;
    try {
      if (n = (await this.configOnDisk.value).publisherName, n == null)
        return null;
    } catch (r) {
      if (r.code === "ENOENT")
        return null;
      throw r;
    }
    return await this._verifyUpdateCodeSignature(Array.isArray(n) ? n : [n], t);
  }
  doInstall(t) {
    const n = this.installerPath;
    if (n == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const r = ["--updated"];
    t.isSilent && r.push("/S"), t.isForceRunAfter && r.push("--force-run"), this.installDirectory && r.push(`/D=${this.installDirectory}`);
    const i = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
    i != null && r.push(`--package-file=${i}`);
    const o = () => {
      this.spawnLog(Tl.join(process.resourcesPath, "elevate.exe"), [n].concat(r)).catch((s) => this.dispatchError(s));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), o(), !0) : (this.spawnLog(n, r).catch((s) => {
      const a = s.code;
      this._logger.info(`Cannot run installer: error code: ${a}, error message: "${s.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), a === "UNKNOWN" || a === "EACCES" ? o() : a === "ENOENT" ? Ut.shell.openPath(n).catch((c) => this.dispatchError(c)) : this.dispatchError(s);
    }), !0);
  }
  async differentialDownloadWebPackage(t, n, r, i) {
    if (n.blockMapSize == null)
      return !0;
    try {
      const o = {
        newUrl: new bl.URL(n.path),
        oldFile: Tl.join(this.downloadedUpdateHelper.cacheDir, Fr.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: r,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(Sl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(Sl.DOWNLOAD_PROGRESS, s)), await new Pv.FileWithEmbeddedBlockMapDifferentialDownloader(n, this.httpExecutor, o).download();
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "win32";
    }
    return !1;
  }
}
Xn.NsisUpdater = xv;
(function(e) {
  var t = Re && Re.__createBinding || (Object.create ? function(A, T, O, $) {
    $ === void 0 && ($ = O);
    var B = Object.getOwnPropertyDescriptor(T, O);
    (!B || ("get" in B ? !T.__esModule : B.writable || B.configurable)) && (B = { enumerable: !0, get: function() {
      return T[O];
    } }), Object.defineProperty(A, $, B);
  } : function(A, T, O, $) {
    $ === void 0 && ($ = O), A[$] = T[O];
  }), n = Re && Re.__exportStar || function(A, T) {
    for (var O in A) O !== "default" && !Object.prototype.hasOwnProperty.call(T, O) && t(T, A, O);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const r = Tt, i = Z;
  var o = jt;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return o.BaseUpdater;
  } });
  var s = Et;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return s.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return s.NoOpLogger;
  } });
  var a = le;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return a.Provider;
  } });
  var c = Gn;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return c.AppImageUpdater;
  } });
  var m = Vn;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return m.DebUpdater;
  } });
  var l = Wn;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return l.PacmanUpdater;
  } });
  var f = Yn;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return f.RpmUpdater;
  } });
  var h = zn;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return h.MacUpdater;
  } });
  var g = Xn;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return g.NsisUpdater;
  } }), n(St, e);
  let w;
  function E() {
    if (process.platform === "win32")
      w = new Xn.NsisUpdater();
    else if (process.platform === "darwin")
      w = new zn.MacUpdater();
    else {
      w = new Gn.AppImageUpdater();
      try {
        const A = i.join(process.resourcesPath, "package-type");
        if (!(0, r.existsSync)(A))
          return w;
        switch ((0, r.readFileSync)(A).toString().trim()) {
          case "deb":
            w = new Vn.DebUpdater();
            break;
          case "rpm":
            w = new Yn.RpmUpdater();
            break;
          case "pacman":
            w = new Wn.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (A) {
        console.warn("Unable to detect 'package-type' for autoUpdater (rpm/deb/pacman support). If you'd like to expand support, please consider contributing to electron-builder", A.message);
      }
    }
    return w;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => w || E()
  });
})(Fn);
const Ku = mt.dirname(td(import.meta.url));
process.env.APP_ROOT = mt.join(Ku, "..");
const Oo = process.env.VITE_DEV_SERVER_URL, Zv = mt.join(process.env.APP_ROOT, "dist-electron"), Ju = mt.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Oo ? mt.join(process.env.APP_ROOT, "public") : Ju;
$n.commandLine.appendSwitch("no-proxy-server");
let Ce;
function Qu() {
  Ce = new Cl({
    icon: mt.join(process.env.VITE_PUBLIC, "favicon.ico"),
    width: 1200,
    height: 800,
    show: !1,
    backgroundColor: "#ffffff",
    webPreferences: {
      preload: mt.join(Ku, "preload.js"),
      nodeIntegration: !1,
      contextIsolation: !0
    }
  }), Ce.webContents.on("did-finish-load", () => {
    Ce == null || Ce.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), Ce.once("ready-to-show", () => {
    Ce == null || Ce.maximize(), Ce == null || Ce.show();
  }), Oo ? Ce.loadURL(Oo) : Ce.loadFile(mt.join(Ju, "index.html"));
}
$n.on("window-all-closed", () => {
  process.platform !== "darwin" && ($n.quit(), Ce = null);
});
$n.on("activate", () => {
  Cl.getAllWindows().length === 0 && Qu();
});
$n.whenReady().then(() => {
  Qu(), Fn.autoUpdater.checkForUpdatesAndNotify();
});
Fn.autoUpdater.on("update-available", () => {
  console.log("Update available.");
});
Fn.autoUpdater.on("update-downloaded", () => {
  console.log("Update downloaded. It will be installed on restart."), Qf.showMessageBox({
    type: "info",
    title: "Update Ready",
    message: "A new version of RNS Prime has been downloaded. Restart the application to apply the updates.",
    buttons: ["Restart", "Later"]
  }).then((e) => {
    e.response === 0 && Fn.autoUpdater.quitAndInstall();
  });
});
export {
  Zv as MAIN_DIST,
  Ju as RENDERER_DIST,
  Oo as VITE_DEV_SERVER_URL
};
