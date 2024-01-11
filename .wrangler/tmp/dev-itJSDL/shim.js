// .wrangler/tmp/bundle-4hiFPO/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// ../../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}

// build/worker/shim.mjs
import z from "./7746dacbfb7587cc161d79adb560a3e079922146-index.wasm";
import De from "./7746dacbfb7587cc161d79adb560a3e079922146-index.wasm";
var N = Object.defineProperty;
var U = (e, t) => {
  for (var n in t)
    N(e, n, { get: t[n], enumerable: true });
};
var l = {};
U(l, { IntoUnderlyingByteSource: () => T, IntoUnderlyingSink: () => q, IntoUnderlyingSource: () => L, MinifyConfig: () => S, PipeOptions: () => v, PolishConfig: () => G, QueuingStrategy: () => C, R2Range: () => F, ReadableStreamGetReaderOptions: () => R, RequestRedirect: () => Q, __wbg_abort_5f06bf3b2954cf33: () => bt, __wbg_append_1be1d651f9ecf2eb: () => ht, __wbg_buffer_610b70c8fd30da2d: () => ye, __wbg_buffer_cf65c07de34b9a08: () => Ht, __wbg_byobRequest_a3c74c3694777d1b: () => pe, __wbg_byteLength_1fef7842ca4200fa: () => we, __wbg_byteOffset_ede786cfcf88d3dd: () => me, __wbg_bytesliteral_efe7d360639bf32b: () => de, __wbg_call_9495de66fdbe016b: () => at, __wbg_call_95d1ea488d03e4e8: () => Ut, __wbg_cf_23036f27554431ca: () => rt, __wbg_close_045ed342139beb7d: () => he, __wbg_close_a41954830b65c455: () => je, __wbg_done_1ebec03bbd919843: () => Et, __wbg_enqueue_3a8a8e67e44d2567: () => Ae, __wbg_fetch_661ffba2a4f2519c: () => te, __wbg_fetch_6a2624d7f767e331: () => ee, __wbg_get_baf4855f9a986186: () => Dt, __wbg_getwithrefkey_5e6d9547403deab8: () => Ct, __wbg_globalThis_87cbb8506fecf3a9: () => Yt, __wbg_global_c85a9259e621f3db: () => Zt, __wbg_has_3feea89d34bd7ad5: () => Qt, __wbg_headers_6093927dc359903e: () => At, __wbg_headers_ab5251d2727ac41e: () => nt, __wbg_instanceof_ArrayBuffer_a69f02ee4c4f5065: () => se, __wbg_instanceof_Error_749a7378f4439ee0: () => Oe, __wbg_instanceof_Response_fb3a4df648c1859b: () => yt, __wbg_instanceof_Uint8Array_01cebe79ca606cca: () => ce, __wbg_iterator_55f114446221aa5a: () => Wt, __wbg_json_011ff959f0891c9a: () => Lt, __wbg_length_27a2afe8ab42b09f: () => It, __wbg_log_25a8cf5a4a9635f7: () => ot, __wbg_log_7bb108d119bafbc1: () => Ee, __wbg_method_d1ee174c753ca2be: () => tt, __wbg_new_15d3966e9981a196: () => xe, __wbg_new_537b7341ce90bb31: () => Vt, __wbg_new_9d3a9ce4282a18a8: () => $t, __wbg_new_a16bcd3b8d000a4f: () => ne, __wbg_new_f1c3a9c2533a55b8: () => _t, __wbg_new_f9876326328f45ed: () => lt, __wbg_newnoargs_2b8b6bd7753c76ba: () => Gt, __wbg_newwithbyteoffsetandlength_9fb2f11355ecadf5: () => Jt, __wbg_newwithlength_b56c882b57805732: () => it, __wbg_newwithoptbuffersourceandinit_4d2fa6d435ff2a63: () => ut, __wbg_newwithoptreadablestreamandinit_a0b4dc209bd176be: () => ft, __wbg_newwithoptstrandinit_1a4621d99c54e7c3: () => st, __wbg_newwithstrandinit_c45f0dc6da26fd03: () => ke, __wbg_next_88560ec06a094dea: () => kt, __wbg_next_b7d530c04fd8b217: () => zt, __wbg_resolve_fd40f858d9db1a04: () => ae, __wbg_respond_f4778bef04e912a6: () => ge, __wbg_self_e7c1f827057f6584: () => Kt, __wbg_set_17499e8aa4003ebd: () => Pt, __wbg_set_6aa458a4ebdb65cb: () => wt, __wbg_set_a5d34c36a1a4ebd1: () => Me, __wbg_signal_686bf5a4acff74a1: () => xt, __wbg_status_d483a4ac847f380a: () => mt, __wbg_stringify_029a979dfb73aa17: () => Ot, __wbg_text_f61464d781b099f0: () => qt, __wbg_then_ec5db6d509eb475f: () => be, __wbg_then_f753623316e2873a: () => fe, __wbg_toString_cec163b212643722: () => Te, __wbg_url_8ec2534cdfacb103: () => jt, __wbg_url_bd2775644ef804ec: () => et, __wbg_value_6ac8da5cc5b3efda: () => Mt, __wbg_view_d1a31268af734e5d: () => le, __wbg_window_a09ec664e14b1b81: () => Xt, __wbindgen_boolean_get: () => oe, __wbindgen_cb_drop: () => pt, __wbindgen_closure_wrapper1059: () => Le, __wbindgen_debug_string: () => ie, __wbindgen_error_new: () => dt, __wbindgen_in: () => Rt, __wbindgen_is_function: () => Nt, __wbindgen_is_object: () => St, __wbindgen_is_undefined: () => Ft, __wbindgen_jsval_loose_eq: () => re, __wbindgen_memory: () => Bt, __wbindgen_number_get: () => _e, __wbindgen_number_new: () => qe, __wbindgen_object_clone_ref: () => vt, __wbindgen_object_drop_ref: () => ct, __wbindgen_string_get: () => Tt, __wbindgen_string_new: () => gt, __wbindgen_throw: () => ue, fetch: () => $, getMemory: () => B });
function W() {
  return "bytes";
}
var I = new WebAssembly.Instance(z, { "./index_bg.js": l });
var _ = I.exports;
function B() {
  return _.memory;
}
var w = new Array(128).fill(void 0);
w.push(void 0, null, true, false);
function r(e) {
  return w[e];
}
var y = w.length;
function H(e) {
  e < 132 || (w[e] = y, y = e);
}
function d(e) {
  let t = r(e);
  return H(e), t;
}
var J = typeof TextDecoder > "u" ? (0, module.require)("util").TextDecoder : TextDecoder;
var D = new J("utf-8", { ignoreBOM: true, fatal: true });
D.decode();
var j = null;
function E() {
  return (j === null || j.byteLength === 0) && (j = new Uint8Array(_.memory.buffer)), j;
}
function g(e, t) {
  return D.decode(E().subarray(e, e + t));
}
function c(e) {
  y === w.length && w.push(w.length + 1);
  let t = y;
  return y = w[t], w[t] = e, t;
}
var h = 0;
var P = typeof TextEncoder > "u" ? (0, module.require)("util").TextEncoder : TextEncoder;
var M = new P("utf-8");
var V = typeof M.encodeInto == "function" ? function(e, t) {
  return M.encodeInto(e, t);
} : function(e, t) {
  let n = M.encode(e);
  return t.set(n), { read: e.length, written: n.length };
};
function m(e, t, n) {
  if (n === void 0) {
    let a = M.encode(e), x = t(a.length);
    return E().subarray(x, x + a.length).set(a), h = a.length, x;
  }
  let o = e.length, s = t(o), b = E(), u = 0;
  for (; u < o; u++) {
    let a = e.charCodeAt(u);
    if (a > 127)
      break;
    b[s + u] = a;
  }
  if (u !== o) {
    u !== 0 && (e = e.slice(u)), s = n(s, o, o = u + e.length * 3);
    let a = E().subarray(s + u, s + o), x = V(e, a);
    u += x.written;
  }
  return h = u, s;
}
function p(e) {
  return e == null;
}
var A = null;
function f() {
  return (A === null || A.byteLength === 0) && (A = new Int32Array(_.memory.buffer)), A;
}
var k = null;
function K() {
  return (k === null || k.byteLength === 0) && (k = new Float64Array(_.memory.buffer)), k;
}
function O(e) {
  let t = typeof e;
  if (t == "number" || t == "boolean" || e == null)
    return `${e}`;
  if (t == "string")
    return `"${e}"`;
  if (t == "symbol") {
    let s = e.description;
    return s == null ? "Symbol" : `Symbol(${s})`;
  }
  if (t == "function") {
    let s = e.name;
    return typeof s == "string" && s.length > 0 ? `Function(${s})` : "Function";
  }
  if (Array.isArray(e)) {
    let s = e.length, b = "[";
    s > 0 && (b += O(e[0]));
    for (let u = 1; u < s; u++)
      b += ", " + O(e[u]);
    return b += "]", b;
  }
  let n = /\[object ([^\]]+)\]/.exec(toString.call(e)), o;
  if (n.length > 1)
    o = n[1];
  else
    return toString.call(e);
  if (o == "Object")
    try {
      return "Object(" + JSON.stringify(e) + ")";
    } catch {
      return "Object";
    }
  return e instanceof Error ? `${e.name}: ${e.message}
${e.stack}` : o;
}
function X(e, t, n, o) {
  let s = { a: e, b: t, cnt: 1, dtor: n }, b = (...u) => {
    s.cnt++;
    let a = s.a;
    s.a = 0;
    try {
      return o(a, s.b, ...u);
    } finally {
      --s.cnt === 0 ? _.__wbindgen_export_2.get(s.dtor)(a, s.b) : s.a = a;
    }
  };
  return b.original = s, b;
}
function Y(e, t, n) {
  _.__wbindgen_export_3(e, t, c(n));
}
function $(e, t, n) {
  let o = _.fetch(c(e), c(t), c(n));
  return d(o);
}
function i(e, t) {
  try {
    return e.apply(this, t);
  } catch (n) {
    _.__wbindgen_export_4(c(n));
  }
}
function Z(e, t, n, o) {
  _.__wbindgen_export_5(e, t, c(n), c(o));
}
var G = Object.freeze({ Off: 0, 0: "Off", Lossy: 1, 1: "Lossy", Lossless: 2, 2: "Lossless" });
var Q = Object.freeze({ Error: 0, 0: "Error", Follow: 1, 1: "Follow", Manual: 2, 2: "Manual" });
var T = class {
  __destroy_into_raw() {
    let t = this.ptr;
    return this.ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    _.__wbg_intounderlyingbytesource_free(t);
  }
  get type() {
    let t = _.intounderlyingbytesource_type(this.ptr);
    return d(t);
  }
  get autoAllocateChunkSize() {
    return _.intounderlyingbytesource_autoAllocateChunkSize(this.ptr) >>> 0;
  }
  start(t) {
    _.intounderlyingbytesource_start(this.ptr, c(t));
  }
  pull(t) {
    let n = _.intounderlyingbytesource_pull(this.ptr, c(t));
    return d(n);
  }
  cancel() {
    let t = this.__destroy_into_raw();
    _.intounderlyingbytesource_cancel(t);
  }
};
var q = class {
  __destroy_into_raw() {
    let t = this.ptr;
    return this.ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    _.__wbg_intounderlyingsink_free(t);
  }
  write(t) {
    let n = _.intounderlyingsink_write(this.ptr, c(t));
    return d(n);
  }
  close() {
    let t = this.__destroy_into_raw(), n = _.intounderlyingsink_close(t);
    return d(n);
  }
  abort(t) {
    let n = this.__destroy_into_raw(), o = _.intounderlyingsink_abort(n, c(t));
    return d(o);
  }
};
var L = class {
  __destroy_into_raw() {
    let t = this.ptr;
    return this.ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    _.__wbg_intounderlyingsource_free(t);
  }
  pull(t) {
    let n = _.intounderlyingsource_pull(this.ptr, c(t));
    return d(n);
  }
  cancel() {
    let t = this.__destroy_into_raw();
    _.intounderlyingsource_cancel(t);
  }
};
var S = class {
  __destroy_into_raw() {
    let t = this.ptr;
    return this.ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    _.__wbg_minifyconfig_free(t);
  }
  get js() {
    return _.__wbg_get_minifyconfig_js(this.ptr) !== 0;
  }
  set js(t) {
    _.__wbg_set_minifyconfig_js(this.ptr, t);
  }
  get html() {
    return _.__wbg_get_minifyconfig_html(this.ptr) !== 0;
  }
  set html(t) {
    _.__wbg_set_minifyconfig_html(this.ptr, t);
  }
  get css() {
    return _.__wbg_get_minifyconfig_css(this.ptr) !== 0;
  }
  set css(t) {
    _.__wbg_set_minifyconfig_css(this.ptr, t);
  }
};
var v = class {
  __destroy_into_raw() {
    let t = this.ptr;
    return this.ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    _.__wbg_pipeoptions_free(t);
  }
  get preventClose() {
    return _.pipeoptions_preventClose(this.ptr) !== 0;
  }
  get preventCancel() {
    return _.pipeoptions_preventCancel(this.ptr) !== 0;
  }
  get preventAbort() {
    return _.pipeoptions_preventAbort(this.ptr) !== 0;
  }
  get signal() {
    let t = _.pipeoptions_signal(this.ptr);
    return d(t);
  }
};
var C = class {
  __destroy_into_raw() {
    let t = this.ptr;
    return this.ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    _.__wbg_queuingstrategy_free(t);
  }
  get highWaterMark() {
    return _.queuingstrategy_highWaterMark(this.ptr);
  }
};
var F = class {
  __destroy_into_raw() {
    let t = this.ptr;
    return this.ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    _.__wbg_r2range_free(t);
  }
  get offset() {
    try {
      let o = _.__wbindgen_add_to_stack_pointer(-16);
      _.__wbg_get_r2range_offset(o, this.ptr);
      var t = f()[o / 4 + 0], n = f()[o / 4 + 1];
      return t === 0 ? void 0 : n >>> 0;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set offset(t) {
    _.__wbg_set_r2range_offset(this.ptr, !p(t), p(t) ? 0 : t);
  }
  get length() {
    try {
      let o = _.__wbindgen_add_to_stack_pointer(-16);
      _.__wbg_get_r2range_length(o, this.ptr);
      var t = f()[o / 4 + 0], n = f()[o / 4 + 1];
      return t === 0 ? void 0 : n >>> 0;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set length(t) {
    _.__wbg_set_r2range_length(this.ptr, !p(t), p(t) ? 0 : t);
  }
  get suffix() {
    try {
      let o = _.__wbindgen_add_to_stack_pointer(-16);
      _.__wbg_get_r2range_suffix(o, this.ptr);
      var t = f()[o / 4 + 0], n = f()[o / 4 + 1];
      return t === 0 ? void 0 : n >>> 0;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set suffix(t) {
    _.__wbg_set_r2range_suffix(this.ptr, !p(t), p(t) ? 0 : t);
  }
};
var R = class {
  __destroy_into_raw() {
    let t = this.ptr;
    return this.ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    _.__wbg_readablestreamgetreaderoptions_free(t);
  }
  get mode() {
    let t = _.readablestreamgetreaderoptions_mode(this.ptr);
    return d(t);
  }
};
function tt(e, t) {
  let n = r(t).method, o = m(n, _.__wbindgen_export_0, _.__wbindgen_export_1), s = h;
  f()[e / 4 + 1] = s, f()[e / 4 + 0] = o;
}
function et(e, t) {
  let n = r(t).url, o = m(n, _.__wbindgen_export_0, _.__wbindgen_export_1), s = h;
  f()[e / 4 + 1] = s, f()[e / 4 + 0] = o;
}
function nt(e) {
  let t = r(e).headers;
  return c(t);
}
function rt(e) {
  let t = r(e).cf;
  return p(t) ? 0 : c(t);
}
function ot(e, t) {
  console.log(g(e, t));
}
function _t() {
  return i(function() {
    let e = new Headers();
    return c(e);
  }, arguments);
}
function ct(e) {
  d(e);
}
function st() {
  return i(function(e, t, n) {
    let o = new Response(e === 0 ? void 0 : g(e, t), r(n));
    return c(o);
  }, arguments);
}
function it(e) {
  let t = new Uint8Array(e >>> 0);
  return c(t);
}
function ut() {
  return i(function(e, t) {
    let n = new Response(r(e), r(t));
    return c(n);
  }, arguments);
}
function ft() {
  return i(function(e, t) {
    let n = new Response(r(e), r(t));
    return c(n);
  }, arguments);
}
function at() {
  return i(function(e, t, n) {
    let o = r(e).call(r(t), r(n));
    return c(o);
  }, arguments);
}
function bt(e) {
  r(e).abort();
}
function pt(e) {
  let t = d(e).original;
  return t.cnt-- == 1 ? (t.a = 0, true) : false;
}
function gt(e, t) {
  let n = g(e, t);
  return c(n);
}
function dt(e, t) {
  let n = new Error(g(e, t));
  return c(n);
}
function lt() {
  let e = new Object();
  return c(e);
}
function wt() {
  return i(function(e, t, n) {
    return Reflect.set(r(e), r(t), r(n));
  }, arguments);
}
function ht() {
  return i(function(e, t, n, o, s) {
    r(e).append(g(t, n), g(o, s));
  }, arguments);
}
function xt(e) {
  let t = r(e).signal;
  return c(t);
}
function yt(e) {
  let t;
  try {
    t = r(e) instanceof Response;
  } catch {
    t = false;
  }
  return t;
}
function mt(e) {
  return r(e).status;
}
function jt(e, t) {
  let n = r(t).url, o = m(n, _.__wbindgen_export_0, _.__wbindgen_export_1), s = h;
  f()[e / 4 + 1] = s, f()[e / 4 + 0] = o;
}
function At(e) {
  let t = r(e).headers;
  return c(t);
}
function kt() {
  return i(function(e) {
    let t = r(e).next();
    return c(t);
  }, arguments);
}
function Et(e) {
  return r(e).done;
}
function Mt(e) {
  let t = r(e).value;
  return c(t);
}
function Ot() {
  return i(function(e) {
    let t = JSON.stringify(r(e));
    return c(t);
  }, arguments);
}
function Tt(e, t) {
  let n = r(t), o = typeof n == "string" ? n : void 0;
  var s = p(o) ? 0 : m(o, _.__wbindgen_export_0, _.__wbindgen_export_1), b = h;
  f()[e / 4 + 1] = b, f()[e / 4 + 0] = s;
}
function qt() {
  return i(function(e) {
    let t = r(e).text();
    return c(t);
  }, arguments);
}
function Lt() {
  return i(function(e) {
    let t = r(e).json();
    return c(t);
  }, arguments);
}
function St(e) {
  let t = r(e);
  return typeof t == "object" && t !== null;
}
function vt(e) {
  let t = r(e);
  return c(t);
}
function Ct(e, t) {
  let n = r(e)[r(t)];
  return c(n);
}
function Ft(e) {
  return r(e) === void 0;
}
function Rt(e, t) {
  return r(e) in r(t);
}
function $t(e, t) {
  try {
    var n = { a: e, b: t }, o = (b, u) => {
      let a = n.a;
      n.a = 0;
      try {
        return Z(a, n.b, b, u);
      } finally {
        n.a = a;
      }
    };
    let s = new Promise(o);
    return c(s);
  } finally {
    n.a = n.b = 0;
  }
}
function Wt() {
  return c(Symbol.iterator);
}
function Dt() {
  return i(function(e, t) {
    let n = Reflect.get(r(e), r(t));
    return c(n);
  }, arguments);
}
function Nt(e) {
  return typeof r(e) == "function";
}
function Ut() {
  return i(function(e, t) {
    let n = r(e).call(r(t));
    return c(n);
  }, arguments);
}
function zt(e) {
  let t = r(e).next;
  return c(t);
}
function It(e) {
  return r(e).length;
}
function Bt() {
  let e = _.memory;
  return c(e);
}
function Ht(e) {
  let t = r(e).buffer;
  return c(t);
}
function Jt(e, t, n) {
  let o = new Uint8Array(r(e), t >>> 0, n >>> 0);
  return c(o);
}
function Pt(e, t, n) {
  r(e).set(r(t), n >>> 0);
}
function Vt(e) {
  let t = new Uint8Array(r(e));
  return c(t);
}
function Kt() {
  return i(function() {
    let e = self.self;
    return c(e);
  }, arguments);
}
function Xt() {
  return i(function() {
    let e = window.window;
    return c(e);
  }, arguments);
}
function Yt() {
  return i(function() {
    let e = globalThis.globalThis;
    return c(e);
  }, arguments);
}
function Zt() {
  return i(function() {
    let e = global.global;
    return c(e);
  }, arguments);
}
function Gt(e, t) {
  let n = new Function(g(e, t));
  return c(n);
}
function Qt() {
  return i(function(e, t) {
    return Reflect.has(r(e), r(t));
  }, arguments);
}
function te(e, t) {
  let n = r(e).fetch(r(t));
  return c(n);
}
function ee(e) {
  let t = fetch(r(e));
  return c(t);
}
function ne() {
  return i(function() {
    let e = new AbortController();
    return c(e);
  }, arguments);
}
function re(e, t) {
  return r(e) == r(t);
}
function oe(e) {
  let t = r(e);
  return typeof t == "boolean" ? t ? 1 : 0 : 2;
}
function _e(e, t) {
  let n = r(t), o = typeof n == "number" ? n : void 0;
  K()[e / 8 + 1] = p(o) ? 0 : o, f()[e / 4 + 0] = !p(o);
}
function ce(e) {
  let t;
  try {
    t = r(e) instanceof Uint8Array;
  } catch {
    t = false;
  }
  return t;
}
function se(e) {
  let t;
  try {
    t = r(e) instanceof ArrayBuffer;
  } catch {
    t = false;
  }
  return t;
}
function ie(e, t) {
  let n = O(r(t)), o = m(n, _.__wbindgen_export_0, _.__wbindgen_export_1), s = h;
  f()[e / 4 + 1] = s, f()[e / 4 + 0] = o;
}
function ue(e, t) {
  throw new Error(g(e, t));
}
function fe(e, t, n) {
  let o = r(e).then(r(t), r(n));
  return c(o);
}
function ae(e) {
  let t = Promise.resolve(r(e));
  return c(t);
}
function be(e, t) {
  let n = r(e).then(r(t));
  return c(n);
}
function pe(e) {
  let t = r(e).byobRequest;
  return p(t) ? 0 : c(t);
}
function ge(e, t) {
  r(e).respond(t >>> 0);
}
function de() {
  let e = W();
  return c(e);
}
function le(e) {
  let t = r(e).view;
  return p(t) ? 0 : c(t);
}
function we(e) {
  return r(e).byteLength;
}
function he(e) {
  r(e).close();
}
function xe(e, t) {
  let n = new Error(g(e, t));
  return c(n);
}
function ye(e) {
  let t = r(e).buffer;
  return c(t);
}
function me(e) {
  return r(e).byteOffset;
}
function je(e) {
  r(e).close();
}
function Ae(e, t) {
  r(e).enqueue(r(t));
}
function ke() {
  return i(function(e, t, n) {
    let o = new Request(g(e, t), r(n));
    return c(o);
  }, arguments);
}
function Ee(e) {
  console.log(r(e));
}
function Me() {
  return i(function(e, t, n, o, s) {
    r(e).set(g(t, n), g(o, s));
  }, arguments);
}
function Oe(e) {
  let t;
  try {
    t = r(e) instanceof Error;
  } catch {
    t = false;
  }
  return t;
}
function Te(e) {
  let t = r(e).toString();
  return c(t);
}
function qe(e) {
  return c(e);
}
function Le(e, t, n) {
  let o = X(e, t, 75, Y);
  return c(o);
}
var Ne = { fetch: $, scheduled: void 0, queue: void 0 };

// ../../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
var jsonError = async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
};
var middleware_miniflare3_json_error_default = jsonError;
var wrap = void 0;

// .wrangler/tmp/bundle-4hiFPO/middleware-insertion-facade.js
var envWrappers = [wrap].filter(Boolean);
var facade = {
  ...Ne,
  envWrappers,
  middleware: [
    middleware_miniflare3_json_error_default,
    ...Ne.middleware ? Ne.middleware : []
  ].filter(Boolean)
};
var middleware_insertion_facade_default = facade;

// .wrangler/tmp/bundle-4hiFPO/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
var __facade_modules_fetch__ = function(request, env, ctx) {
  if (middleware_insertion_facade_default.fetch === void 0)
    throw new Error("Handler does not export a fetch() function.");
  return middleware_insertion_facade_default.fetch(request, env, ctx);
};
function getMaskedEnv(rawEnv) {
  let env = rawEnv;
  if (middleware_insertion_facade_default.envWrappers && middleware_insertion_facade_default.envWrappers.length > 0) {
    for (const wrapFn of middleware_insertion_facade_default.envWrappers) {
      env = wrapFn(env);
    }
  }
  return env;
}
var registeredMiddleware = false;
var facade2 = {
  ...middleware_insertion_facade_default.tail && {
    tail: maskHandlerEnv(middleware_insertion_facade_default.tail)
  },
  ...middleware_insertion_facade_default.trace && {
    trace: maskHandlerEnv(middleware_insertion_facade_default.trace)
  },
  ...middleware_insertion_facade_default.scheduled && {
    scheduled: maskHandlerEnv(middleware_insertion_facade_default.scheduled)
  },
  ...middleware_insertion_facade_default.queue && {
    queue: maskHandlerEnv(middleware_insertion_facade_default.queue)
  },
  ...middleware_insertion_facade_default.test && {
    test: maskHandlerEnv(middleware_insertion_facade_default.test)
  },
  ...middleware_insertion_facade_default.email && {
    email: maskHandlerEnv(middleware_insertion_facade_default.email)
  },
  fetch(request, rawEnv, ctx) {
    const env = getMaskedEnv(rawEnv);
    if (middleware_insertion_facade_default.middleware && middleware_insertion_facade_default.middleware.length > 0) {
      if (!registeredMiddleware) {
        registeredMiddleware = true;
        for (const middleware of middleware_insertion_facade_default.middleware) {
          __facade_register__(middleware);
        }
      }
      const __facade_modules_dispatch__ = function(type, init) {
        if (type === "scheduled" && middleware_insertion_facade_default.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return middleware_insertion_facade_default.scheduled(controller, env, ctx);
        }
      };
      return __facade_invoke__(
        request,
        env,
        ctx,
        __facade_modules_dispatch__,
        __facade_modules_fetch__
      );
    } else {
      return __facade_modules_fetch__(request, env, ctx);
    }
  }
};
function maskHandlerEnv(handler) {
  return (data, env, ctx) => handler(data, getMaskedEnv(env), ctx);
}
var middleware_loader_entry_default = facade2;
export {
  T as IntoUnderlyingByteSource,
  q as IntoUnderlyingSink,
  L as IntoUnderlyingSource,
  S as MinifyConfig,
  v as PipeOptions,
  G as PolishConfig,
  C as QueuingStrategy,
  F as R2Range,
  R as ReadableStreamGetReaderOptions,
  Q as RequestRedirect,
  bt as __wbg_abort_5f06bf3b2954cf33,
  ht as __wbg_append_1be1d651f9ecf2eb,
  ye as __wbg_buffer_610b70c8fd30da2d,
  Ht as __wbg_buffer_cf65c07de34b9a08,
  pe as __wbg_byobRequest_a3c74c3694777d1b,
  we as __wbg_byteLength_1fef7842ca4200fa,
  me as __wbg_byteOffset_ede786cfcf88d3dd,
  de as __wbg_bytesliteral_efe7d360639bf32b,
  at as __wbg_call_9495de66fdbe016b,
  Ut as __wbg_call_95d1ea488d03e4e8,
  rt as __wbg_cf_23036f27554431ca,
  he as __wbg_close_045ed342139beb7d,
  je as __wbg_close_a41954830b65c455,
  Et as __wbg_done_1ebec03bbd919843,
  Ae as __wbg_enqueue_3a8a8e67e44d2567,
  te as __wbg_fetch_661ffba2a4f2519c,
  ee as __wbg_fetch_6a2624d7f767e331,
  Dt as __wbg_get_baf4855f9a986186,
  Ct as __wbg_getwithrefkey_5e6d9547403deab8,
  Yt as __wbg_globalThis_87cbb8506fecf3a9,
  Zt as __wbg_global_c85a9259e621f3db,
  Qt as __wbg_has_3feea89d34bd7ad5,
  At as __wbg_headers_6093927dc359903e,
  nt as __wbg_headers_ab5251d2727ac41e,
  se as __wbg_instanceof_ArrayBuffer_a69f02ee4c4f5065,
  Oe as __wbg_instanceof_Error_749a7378f4439ee0,
  yt as __wbg_instanceof_Response_fb3a4df648c1859b,
  ce as __wbg_instanceof_Uint8Array_01cebe79ca606cca,
  Wt as __wbg_iterator_55f114446221aa5a,
  Lt as __wbg_json_011ff959f0891c9a,
  It as __wbg_length_27a2afe8ab42b09f,
  ot as __wbg_log_25a8cf5a4a9635f7,
  Ee as __wbg_log_7bb108d119bafbc1,
  tt as __wbg_method_d1ee174c753ca2be,
  xe as __wbg_new_15d3966e9981a196,
  Vt as __wbg_new_537b7341ce90bb31,
  $t as __wbg_new_9d3a9ce4282a18a8,
  ne as __wbg_new_a16bcd3b8d000a4f,
  _t as __wbg_new_f1c3a9c2533a55b8,
  lt as __wbg_new_f9876326328f45ed,
  Gt as __wbg_newnoargs_2b8b6bd7753c76ba,
  Jt as __wbg_newwithbyteoffsetandlength_9fb2f11355ecadf5,
  it as __wbg_newwithlength_b56c882b57805732,
  ut as __wbg_newwithoptbuffersourceandinit_4d2fa6d435ff2a63,
  ft as __wbg_newwithoptreadablestreamandinit_a0b4dc209bd176be,
  st as __wbg_newwithoptstrandinit_1a4621d99c54e7c3,
  ke as __wbg_newwithstrandinit_c45f0dc6da26fd03,
  kt as __wbg_next_88560ec06a094dea,
  zt as __wbg_next_b7d530c04fd8b217,
  ae as __wbg_resolve_fd40f858d9db1a04,
  ge as __wbg_respond_f4778bef04e912a6,
  Kt as __wbg_self_e7c1f827057f6584,
  Pt as __wbg_set_17499e8aa4003ebd,
  wt as __wbg_set_6aa458a4ebdb65cb,
  Me as __wbg_set_a5d34c36a1a4ebd1,
  xt as __wbg_signal_686bf5a4acff74a1,
  mt as __wbg_status_d483a4ac847f380a,
  Ot as __wbg_stringify_029a979dfb73aa17,
  qt as __wbg_text_f61464d781b099f0,
  be as __wbg_then_ec5db6d509eb475f,
  fe as __wbg_then_f753623316e2873a,
  Te as __wbg_toString_cec163b212643722,
  jt as __wbg_url_8ec2534cdfacb103,
  et as __wbg_url_bd2775644ef804ec,
  Mt as __wbg_value_6ac8da5cc5b3efda,
  le as __wbg_view_d1a31268af734e5d,
  Xt as __wbg_window_a09ec664e14b1b81,
  oe as __wbindgen_boolean_get,
  pt as __wbindgen_cb_drop,
  Le as __wbindgen_closure_wrapper1059,
  ie as __wbindgen_debug_string,
  dt as __wbindgen_error_new,
  Rt as __wbindgen_in,
  Nt as __wbindgen_is_function,
  St as __wbindgen_is_object,
  Ft as __wbindgen_is_undefined,
  re as __wbindgen_jsval_loose_eq,
  Bt as __wbindgen_memory,
  _e as __wbindgen_number_get,
  qe as __wbindgen_number_new,
  vt as __wbindgen_object_clone_ref,
  ct as __wbindgen_object_drop_ref,
  Tt as __wbindgen_string_get,
  gt as __wbindgen_string_new,
  ue as __wbindgen_throw,
  middleware_loader_entry_default as default,
  $ as fetch,
  B as getMemory,
  De as wasmModule
};
//# sourceMappingURL=shim.js.map
