// .wrangler/tmp/bundle-wB8qjG/checked-fetch.js
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
import N from "./185ebc60fb4fa518e6787489c6250faeac108d2e-index.wasm";
import de from "./185ebc60fb4fa518e6787489c6250faeac108d2e-index.wasm";
var W = Object.defineProperty;
var D = (e, t) => {
  for (var n in t)
    W(e, n, { get: t[n], enumerable: true });
};
var a = {};
D(a, { IntoUnderlyingByteSource: () => q, IntoUnderlyingSink: () => T, IntoUnderlyingSource: () => L, MinifyConfig: () => S, PipeOptions: () => v, PolishConfig: () => Z, QueuingStrategy: () => C, R2Range: () => F, ReadableStreamGetReaderOptions: () => $, RequestRedirect: () => G, __wbg_all_2b78e889ce8a546b: () => xt, __wbg_buffer_4e79326814bdd393: () => Gt, __wbg_buffer_55ba7a6b1b92e2ac: () => Ft, __wbg_byobRequest_08c18cee35def1f4: () => Jt, __wbg_byteLength_5299848ed3264181: () => Xt, __wbg_byteOffset_b69b0a07afccce19: () => Qt, __wbg_call_587b30eea3e09332: () => ut, __wbg_cause_52959bcad93f9e0f: () => oe, __wbg_cf_703652f0d2c5b8d1: () => nt, __wbg_close_da7e6fb9d9851e5a: () => Yt, __wbg_close_e9110ca16e2567db: () => te, __wbg_constructor_f2623999a1f453eb: () => wt, __wbg_enqueue_d71a1a518e21f5c3: () => ee, __wbg_error_a7e23606158b68b9: () => ne, __wbg_get_7303ed2ef026b2f5: () => At, __wbg_get_f53c921291c381bd: () => pt, __wbg_getwithrefkey_5e6d9547403deab8: () => Ot, __wbg_headers_1eff4f53324496e6: () => et, __wbg_instanceof_ArrayBuffer_ef2632aa0d4bfff8: () => Ut, __wbg_instanceof_Error_fac23a8832b241da: () => re, __wbg_instanceof_Uint8Array_1349640af2da2e88: () => Nt, __wbg_isSafeInteger_2088b01008075470: () => Lt, __wbg_length_0aab7ffd65ad19ed: () => vt, __wbg_length_820c786973abdd8a: () => kt, __wbg_method_e15eb9cf1c32cdbb: () => Q, __wbg_name_2a8bae31363c6a51: () => lt, __wbg_new_09938a7d020f049b: () => Rt, __wbg_new_143b41b4342650bb: () => rt, __wbg_new_2b55e405e4af4986: () => St, __wbg_new_2b6fea4ea03b1b95: () => se, __wbg_new_87297f22973157c8: () => Zt, __wbg_newwithbyteoffsetandlength_88d1d8be5df94b9b: () => $t, __wbg_newwithlength_89eeca401d8918c2: () => st, __wbg_newwithoptbuffersourceandinit_6c49960a834dd7cf: () => ct, __wbg_newwithoptreadablestreamandinit_d238e5b972c7b57f: () => it, __wbg_newwithoptstrandinit_ff70839f3334d3aa: () => ot, __wbg_prepare_545a7ed280576b99: () => yt, __wbg_resolve_ae38ad63c43ff98b: () => Ht, __wbg_respond_8fadc5f5c9d95422: () => Vt, __wbg_results_c7ad1ae0ae681ab4: () => jt, __wbg_set_07da13cc24b69217: () => ie, __wbg_set_3698e3ca519b3c3c: () => It, __wbg_set_76353df4722f4954: () => at, __wbg_then_835b073a479138e5: () => mt, __wbg_then_8df675b8bb5d5e3c: () => Pt, __wbg_toString_506566b763774a16: () => _e, __wbg_url_3325e0ef088003ca: () => tt, __wbg_view_231340b0dd8a2484: () => Kt, __wbindgen_boolean_get: () => Dt, __wbindgen_cb_drop: () => ft, __wbindgen_closure_wrapper163: () => ue, __wbindgen_debug_string: () => zt, __wbindgen_error_new: () => gt, __wbindgen_in: () => qt, __wbindgen_is_object: () => Et, __wbindgen_is_undefined: () => dt, __wbindgen_jsval_loose_eq: () => Wt, __wbindgen_memory: () => Ct, __wbindgen_number_get: () => Tt, __wbindgen_number_new: () => ce, __wbindgen_object_clone_ref: () => Mt, __wbindgen_object_drop_ref: () => _t, __wbindgen_string_get: () => ht, __wbindgen_string_new: () => bt, __wbindgen_throw: () => Bt, fetch: () => I, getMemory: () => z });
var U = new WebAssembly.Instance(N, { "./index_bg.js": a });
var _ = U.exports;
function z() {
  return _.memory;
}
var d = new Array(128).fill(void 0);
d.push(void 0, null, true, false);
function r(e) {
  return d[e];
}
var x = d.length;
function B(e) {
  e < 132 || (d[e] = x, x = e);
}
function p(e) {
  let t = r(e);
  return B(e), t;
}
var H = typeof TextDecoder > "u" ? (0, module.require)("util").TextDecoder : TextDecoder;
var R = new H("utf-8", { ignoreBOM: true, fatal: true });
R.decode();
var m = null;
function A() {
  return (m === null || m.byteLength === 0) && (m = new Uint8Array(_.memory.buffer)), m;
}
function w(e, t) {
  return e = e >>> 0, R.decode(A().subarray(e, e + t));
}
function s(e) {
  x === d.length && d.push(d.length + 1);
  let t = x;
  return x = d[t], d[t] = e, t;
}
var h = 0;
var P = typeof TextEncoder > "u" ? (0, module.require)("util").TextEncoder : TextEncoder;
var E = new P("utf-8");
var J = typeof E.encodeInto == "function" ? function(e, t) {
  return E.encodeInto(e, t);
} : function(e, t) {
  let n = E.encode(e);
  return t.set(n), { read: e.length, written: n.length };
};
function M(e, t, n) {
  if (n === void 0) {
    let b = E.encode(e), y = t(b.length) >>> 0;
    return A().subarray(y, y + b.length).set(b), h = b.length, y;
  }
  let o = e.length, c = t(o) >>> 0, u = A(), i = 0;
  for (; i < o; i++) {
    let b = e.charCodeAt(i);
    if (b > 127)
      break;
    u[c + i] = b;
  }
  if (i !== o) {
    i !== 0 && (e = e.slice(i)), c = n(c, o, o = i + e.length * 3) >>> 0;
    let b = A().subarray(c + i, c + o), y = J(e, b);
    i += y.written;
  }
  return h = i, c;
}
function g(e) {
  return e == null;
}
var j = null;
function f() {
  return (j === null || j.byteLength === 0) && (j = new Int32Array(_.memory.buffer)), j;
}
var k = null;
function V() {
  return (k === null || k.byteLength === 0) && (k = new Float64Array(_.memory.buffer)), k;
}
function O(e) {
  let t = typeof e;
  if (t == "number" || t == "boolean" || e == null)
    return `${e}`;
  if (t == "string")
    return `"${e}"`;
  if (t == "symbol") {
    let c = e.description;
    return c == null ? "Symbol" : `Symbol(${c})`;
  }
  if (t == "function") {
    let c = e.name;
    return typeof c == "string" && c.length > 0 ? `Function(${c})` : "Function";
  }
  if (Array.isArray(e)) {
    let c = e.length, u = "[";
    c > 0 && (u += O(e[0]));
    for (let i = 1; i < c; i++)
      u += ", " + O(e[i]);
    return u += "]", u;
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
function K(e, t, n, o) {
  let c = { a: e, b: t, cnt: 1, dtor: n }, u = (...i) => {
    c.cnt++;
    let b = c.a;
    c.a = 0;
    try {
      return o(b, c.b, ...i);
    } finally {
      --c.cnt === 0 ? _.__wbindgen_export_2.get(c.dtor)(b, c.b) : c.a = b;
    }
  };
  return u.original = c, u;
}
function X(e, t, n) {
  _.__wbindgen_export_3(e, t, s(n));
}
function I(e, t, n) {
  let o = _.fetch(s(e), s(t), s(n));
  return p(o);
}
function l(e, t) {
  try {
    return e.apply(this, t);
  } catch (n) {
    _.__wbindgen_export_4(s(n));
  }
}
function Y(e, t, n, o) {
  _.__wbindgen_export_5(e, t, s(n), s(o));
}
var Z = Object.freeze({ Off: 0, 0: "Off", Lossy: 1, 1: "Lossy", Lossless: 2, 2: "Lossless" });
var G = Object.freeze({ Error: 0, 0: "Error", Follow: 1, 1: "Follow", Manual: 2, 2: "Manual" });
var q = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    _.__wbg_intounderlyingbytesource_free(t);
  }
  get type() {
    let t, n;
    try {
      let u = _.__wbindgen_add_to_stack_pointer(-16);
      _.intounderlyingbytesource_type(u, this.__wbg_ptr);
      var o = f()[u / 4 + 0], c = f()[u / 4 + 1];
      return t = o, n = c, w(o, c);
    } finally {
      _.__wbindgen_add_to_stack_pointer(16), _.__wbindgen_export_6(t, n);
    }
  }
  get autoAllocateChunkSize() {
    return _.intounderlyingbytesource_autoAllocateChunkSize(this.__wbg_ptr) >>> 0;
  }
  start(t) {
    _.intounderlyingbytesource_start(this.__wbg_ptr, s(t));
  }
  pull(t) {
    let n = _.intounderlyingbytesource_pull(this.__wbg_ptr, s(t));
    return p(n);
  }
  cancel() {
    let t = this.__destroy_into_raw();
    _.intounderlyingbytesource_cancel(t);
  }
};
var T = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    _.__wbg_intounderlyingsink_free(t);
  }
  write(t) {
    let n = _.intounderlyingsink_write(this.__wbg_ptr, s(t));
    return p(n);
  }
  close() {
    let t = this.__destroy_into_raw(), n = _.intounderlyingsink_close(t);
    return p(n);
  }
  abort(t) {
    let n = this.__destroy_into_raw(), o = _.intounderlyingsink_abort(n, s(t));
    return p(o);
  }
};
var L = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    _.__wbg_intounderlyingsource_free(t);
  }
  pull(t) {
    let n = _.intounderlyingsource_pull(this.__wbg_ptr, s(t));
    return p(n);
  }
  cancel() {
    let t = this.__destroy_into_raw();
    _.intounderlyingsource_cancel(t);
  }
};
var S = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    _.__wbg_minifyconfig_free(t);
  }
  get js() {
    return _.__wbg_get_minifyconfig_js(this.__wbg_ptr) !== 0;
  }
  set js(t) {
    _.__wbg_set_minifyconfig_js(this.__wbg_ptr, t);
  }
  get html() {
    return _.__wbg_get_minifyconfig_html(this.__wbg_ptr) !== 0;
  }
  set html(t) {
    _.__wbg_set_minifyconfig_html(this.__wbg_ptr, t);
  }
  get css() {
    return _.__wbg_get_minifyconfig_css(this.__wbg_ptr) !== 0;
  }
  set css(t) {
    _.__wbg_set_minifyconfig_css(this.__wbg_ptr, t);
  }
};
var v = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    _.__wbg_pipeoptions_free(t);
  }
  get preventClose() {
    return _.pipeoptions_preventClose(this.__wbg_ptr) !== 0;
  }
  get preventCancel() {
    return _.pipeoptions_preventCancel(this.__wbg_ptr) !== 0;
  }
  get preventAbort() {
    return _.pipeoptions_preventAbort(this.__wbg_ptr) !== 0;
  }
  get signal() {
    let t = _.pipeoptions_signal(this.__wbg_ptr);
    return p(t);
  }
};
var C = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    _.__wbg_queuingstrategy_free(t);
  }
  get highWaterMark() {
    return _.queuingstrategy_highWaterMark(this.__wbg_ptr);
  }
};
var F = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    _.__wbg_r2range_free(t);
  }
  get offset() {
    try {
      let o = _.__wbindgen_add_to_stack_pointer(-16);
      _.__wbg_get_r2range_offset(o, this.__wbg_ptr);
      var t = f()[o / 4 + 0], n = f()[o / 4 + 1];
      return t === 0 ? void 0 : n >>> 0;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set offset(t) {
    _.__wbg_set_r2range_offset(this.__wbg_ptr, !g(t), g(t) ? 0 : t);
  }
  get length() {
    try {
      let o = _.__wbindgen_add_to_stack_pointer(-16);
      _.__wbg_get_r2range_length(o, this.__wbg_ptr);
      var t = f()[o / 4 + 0], n = f()[o / 4 + 1];
      return t === 0 ? void 0 : n >>> 0;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set length(t) {
    _.__wbg_set_r2range_length(this.__wbg_ptr, !g(t), g(t) ? 0 : t);
  }
  get suffix() {
    try {
      let o = _.__wbindgen_add_to_stack_pointer(-16);
      _.__wbg_get_r2range_suffix(o, this.__wbg_ptr);
      var t = f()[o / 4 + 0], n = f()[o / 4 + 1];
      return t === 0 ? void 0 : n >>> 0;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set suffix(t) {
    _.__wbg_set_r2range_suffix(this.__wbg_ptr, !g(t), g(t) ? 0 : t);
  }
};
var $ = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    _.__wbg_readablestreamgetreaderoptions_free(t);
  }
  get mode() {
    let t = _.readablestreamgetreaderoptions_mode(this.__wbg_ptr);
    return p(t);
  }
};
function Q(e, t) {
  let n = r(t).method, o = M(n, _.__wbindgen_export_0, _.__wbindgen_export_1), c = h;
  f()[e / 4 + 1] = c, f()[e / 4 + 0] = o;
}
function tt(e, t) {
  let n = r(t).url, o = M(n, _.__wbindgen_export_0, _.__wbindgen_export_1), c = h;
  f()[e / 4 + 1] = c, f()[e / 4 + 0] = o;
}
function et(e) {
  let t = r(e).headers;
  return s(t);
}
function nt(e) {
  let t = r(e).cf;
  return g(t) ? 0 : s(t);
}
function rt() {
  return l(function() {
    let e = new Headers();
    return s(e);
  }, arguments);
}
function _t(e) {
  p(e);
}
function ot() {
  return l(function(e, t, n) {
    let o = new Response(e === 0 ? void 0 : w(e, t), r(n));
    return s(o);
  }, arguments);
}
function st(e) {
  let t = new Uint8Array(e >>> 0);
  return s(t);
}
function ct() {
  return l(function(e, t) {
    let n = new Response(r(e), r(t));
    return s(n);
  }, arguments);
}
function it() {
  return l(function(e, t) {
    let n = new Response(r(e), r(t));
    return s(n);
  }, arguments);
}
function ut() {
  return l(function(e, t, n) {
    let o = r(e).call(r(t), r(n));
    return s(o);
  }, arguments);
}
function ft(e) {
  let t = p(e).original;
  return t.cnt-- == 1 ? (t.a = 0, true) : false;
}
function bt(e, t) {
  let n = w(e, t);
  return s(n);
}
function gt(e, t) {
  let n = new Error(w(e, t));
  return s(n);
}
function at() {
  return l(function(e, t, n, o, c) {
    r(e).set(w(t, n), w(o, c));
  }, arguments);
}
function pt() {
  return l(function(e, t) {
    let n = Reflect.get(r(e), r(t));
    return s(n);
  }, arguments);
}
function dt(e) {
  return r(e) === void 0;
}
function wt(e) {
  let t = r(e).constructor;
  return s(t);
}
function lt(e) {
  let t = r(e).name;
  return s(t);
}
function ht(e, t) {
  let n = r(t), o = typeof n == "string" ? n : void 0;
  var c = g(o) ? 0 : M(o, _.__wbindgen_export_0, _.__wbindgen_export_1), u = h;
  f()[e / 4 + 1] = u, f()[e / 4 + 0] = c;
}
function yt(e, t, n) {
  let o = r(e).prepare(w(t, n));
  return s(o);
}
function xt(e) {
  let t = r(e).all();
  return s(t);
}
function mt(e, t, n) {
  let o = r(e).then(r(t), r(n));
  return s(o);
}
function jt(e) {
  let t = r(e).results;
  return g(t) ? 0 : s(t);
}
function kt(e) {
  return r(e).length;
}
function At(e, t) {
  let n = r(e)[t >>> 0];
  return s(n);
}
function Et(e) {
  let t = r(e);
  return typeof t == "object" && t !== null;
}
function Mt(e) {
  let t = r(e);
  return s(t);
}
function Ot(e, t) {
  let n = r(e)[r(t)];
  return s(n);
}
function qt(e, t) {
  return r(e) in r(t);
}
function Tt(e, t) {
  let n = r(t), o = typeof n == "number" ? n : void 0;
  V()[e / 8 + 1] = g(o) ? 0 : o, f()[e / 4 + 0] = !g(o);
}
function Lt(e) {
  return Number.isSafeInteger(r(e));
}
function St(e, t) {
  try {
    var n = { a: e, b: t }, o = (u, i) => {
      let b = n.a;
      n.a = 0;
      try {
        return Y(b, n.b, u, i);
      } finally {
        n.a = b;
      }
    };
    let c = new Promise(o);
    return s(c);
  } finally {
    n.a = n.b = 0;
  }
}
function vt(e) {
  return r(e).length;
}
function Ct() {
  let e = _.memory;
  return s(e);
}
function Ft(e) {
  let t = r(e).buffer;
  return s(t);
}
function $t(e, t, n) {
  let o = new Uint8Array(r(e), t >>> 0, n >>> 0);
  return s(o);
}
function It(e, t, n) {
  r(e).set(r(t), n >>> 0);
}
function Rt(e) {
  let t = new Uint8Array(r(e));
  return s(t);
}
function Wt(e, t) {
  return r(e) == r(t);
}
function Dt(e) {
  let t = r(e);
  return typeof t == "boolean" ? t ? 1 : 0 : 2;
}
function Nt(e) {
  let t;
  try {
    t = r(e) instanceof Uint8Array;
  } catch {
    t = false;
  }
  return t;
}
function Ut(e) {
  let t;
  try {
    t = r(e) instanceof ArrayBuffer;
  } catch {
    t = false;
  }
  return t;
}
function zt(e, t) {
  let n = O(r(t)), o = M(n, _.__wbindgen_export_0, _.__wbindgen_export_1), c = h;
  f()[e / 4 + 1] = c, f()[e / 4 + 0] = o;
}
function Bt(e, t) {
  throw new Error(w(e, t));
}
function Ht(e) {
  let t = Promise.resolve(r(e));
  return s(t);
}
function Pt(e, t) {
  let n = r(e).then(r(t));
  return s(n);
}
function Jt(e) {
  let t = r(e).byobRequest;
  return g(t) ? 0 : s(t);
}
function Vt(e, t) {
  r(e).respond(t >>> 0);
}
function Kt(e) {
  let t = r(e).view;
  return g(t) ? 0 : s(t);
}
function Xt(e) {
  return r(e).byteLength;
}
function Yt(e) {
  r(e).close();
}
function Zt(e, t) {
  let n = new Error(w(e, t));
  return s(n);
}
function Gt(e) {
  let t = r(e).buffer;
  return s(t);
}
function Qt(e) {
  return r(e).byteOffset;
}
function te(e) {
  r(e).close();
}
function ee(e, t) {
  r(e).enqueue(r(t));
}
function ne(e) {
  console.error(r(e));
}
function re(e) {
  let t;
  try {
    t = r(e) instanceof Error;
  } catch {
    t = false;
  }
  return t;
}
function _e(e) {
  let t = r(e).toString();
  return s(t);
}
function oe(e) {
  let t = r(e).cause;
  return s(t);
}
function se() {
  let e = new Object();
  return s(e);
}
function ce(e) {
  return s(e);
}
function ie() {
  return l(function(e, t, n) {
    return Reflect.set(r(e), r(t), r(n));
  }, arguments);
}
function ue(e, t, n) {
  let o = K(e, t, 59, X);
  return s(o);
}
var we = { fetch: I, scheduled: void 0, queue: void 0 };

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

// .wrangler/tmp/bundle-wB8qjG/middleware-insertion-facade.js
var envWrappers = [wrap].filter(Boolean);
var facade = {
  ...we,
  envWrappers,
  middleware: [
    middleware_miniflare3_json_error_default,
    ...we.middleware ? we.middleware : []
  ].filter(Boolean)
};
var middleware_insertion_facade_default = facade;

// .wrangler/tmp/bundle-wB8qjG/middleware-loader.entry.ts
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
  q as IntoUnderlyingByteSource,
  T as IntoUnderlyingSink,
  L as IntoUnderlyingSource,
  S as MinifyConfig,
  v as PipeOptions,
  Z as PolishConfig,
  C as QueuingStrategy,
  F as R2Range,
  $ as ReadableStreamGetReaderOptions,
  G as RequestRedirect,
  xt as __wbg_all_2b78e889ce8a546b,
  Gt as __wbg_buffer_4e79326814bdd393,
  Ft as __wbg_buffer_55ba7a6b1b92e2ac,
  Jt as __wbg_byobRequest_08c18cee35def1f4,
  Xt as __wbg_byteLength_5299848ed3264181,
  Qt as __wbg_byteOffset_b69b0a07afccce19,
  ut as __wbg_call_587b30eea3e09332,
  oe as __wbg_cause_52959bcad93f9e0f,
  nt as __wbg_cf_703652f0d2c5b8d1,
  Yt as __wbg_close_da7e6fb9d9851e5a,
  te as __wbg_close_e9110ca16e2567db,
  wt as __wbg_constructor_f2623999a1f453eb,
  ee as __wbg_enqueue_d71a1a518e21f5c3,
  ne as __wbg_error_a7e23606158b68b9,
  At as __wbg_get_7303ed2ef026b2f5,
  pt as __wbg_get_f53c921291c381bd,
  Ot as __wbg_getwithrefkey_5e6d9547403deab8,
  et as __wbg_headers_1eff4f53324496e6,
  Ut as __wbg_instanceof_ArrayBuffer_ef2632aa0d4bfff8,
  re as __wbg_instanceof_Error_fac23a8832b241da,
  Nt as __wbg_instanceof_Uint8Array_1349640af2da2e88,
  Lt as __wbg_isSafeInteger_2088b01008075470,
  vt as __wbg_length_0aab7ffd65ad19ed,
  kt as __wbg_length_820c786973abdd8a,
  Q as __wbg_method_e15eb9cf1c32cdbb,
  lt as __wbg_name_2a8bae31363c6a51,
  Rt as __wbg_new_09938a7d020f049b,
  rt as __wbg_new_143b41b4342650bb,
  St as __wbg_new_2b55e405e4af4986,
  se as __wbg_new_2b6fea4ea03b1b95,
  Zt as __wbg_new_87297f22973157c8,
  $t as __wbg_newwithbyteoffsetandlength_88d1d8be5df94b9b,
  st as __wbg_newwithlength_89eeca401d8918c2,
  ct as __wbg_newwithoptbuffersourceandinit_6c49960a834dd7cf,
  it as __wbg_newwithoptreadablestreamandinit_d238e5b972c7b57f,
  ot as __wbg_newwithoptstrandinit_ff70839f3334d3aa,
  yt as __wbg_prepare_545a7ed280576b99,
  Ht as __wbg_resolve_ae38ad63c43ff98b,
  Vt as __wbg_respond_8fadc5f5c9d95422,
  jt as __wbg_results_c7ad1ae0ae681ab4,
  ie as __wbg_set_07da13cc24b69217,
  It as __wbg_set_3698e3ca519b3c3c,
  at as __wbg_set_76353df4722f4954,
  mt as __wbg_then_835b073a479138e5,
  Pt as __wbg_then_8df675b8bb5d5e3c,
  _e as __wbg_toString_506566b763774a16,
  tt as __wbg_url_3325e0ef088003ca,
  Kt as __wbg_view_231340b0dd8a2484,
  Dt as __wbindgen_boolean_get,
  ft as __wbindgen_cb_drop,
  ue as __wbindgen_closure_wrapper163,
  zt as __wbindgen_debug_string,
  gt as __wbindgen_error_new,
  qt as __wbindgen_in,
  Et as __wbindgen_is_object,
  dt as __wbindgen_is_undefined,
  Wt as __wbindgen_jsval_loose_eq,
  Ct as __wbindgen_memory,
  Tt as __wbindgen_number_get,
  ce as __wbindgen_number_new,
  Mt as __wbindgen_object_clone_ref,
  _t as __wbindgen_object_drop_ref,
  ht as __wbindgen_string_get,
  bt as __wbindgen_string_new,
  Bt as __wbindgen_throw,
  middleware_loader_entry_default as default,
  I as fetch,
  z as getMemory,
  de as wasmModule
};
//# sourceMappingURL=shim.js.map
