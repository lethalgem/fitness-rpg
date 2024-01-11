// .wrangler/tmp/bundle-lqvSdc/checked-fetch.js
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

// build/worker/shim.mjs
import N from "./430d3544bb92085d9d555ed1de915b5b5a5267ff-index.wasm";
import he from "./430d3544bb92085d9d555ed1de915b5b5a5267ff-index.wasm";
var W = Object.defineProperty;
var D = (e, t) => {
  for (var n in t)
    W(e, n, { get: t[n], enumerable: true });
};
var a = {};
D(a, { IntoUnderlyingByteSource: () => q, IntoUnderlyingSink: () => T, IntoUnderlyingSource: () => L, MinifyConfig: () => S, PipeOptions: () => v, PolishConfig: () => Z, QueuingStrategy: () => C, R2Range: () => F, ReadableStreamGetReaderOptions: () => $, RequestRedirect: () => G, __wbg_all_2b78e889ce8a546b: () => Mt, __wbg_buffer_4e79326814bdd393: () => ne, __wbg_buffer_55ba7a6b1b92e2ac: () => Dt, __wbg_byobRequest_08c18cee35def1f4: () => Yt, __wbg_byteLength_5299848ed3264181: () => Qt, __wbg_byteOffset_b69b0a07afccce19: () => re, __wbg_call_587b30eea3e09332: () => dt, __wbg_cause_52959bcad93f9e0f: () => ie, __wbg_cf_703652f0d2c5b8d1: () => nt, __wbg_close_da7e6fb9d9851e5a: () => te, __wbg_close_e9110ca16e2567db: () => _e, __wbg_constructor_f2623999a1f453eb: () => it, __wbg_dump_3aaddc556066b01a: () => yt, __wbg_enqueue_d71a1a518e21f5c3: () => oe, __wbg_error_a7e23606158b68b9: () => se, __wbg_get_7303ed2ef026b2f5: () => Tt, __wbg_get_f53c921291c381bd: () => ot, __wbg_getwithrefkey_5e6d9547403deab8: () => vt, __wbg_headers_1eff4f53324496e6: () => et, __wbg_instanceof_ArrayBuffer_ef2632aa0d4bfff8: () => jt, __wbg_instanceof_Error_fac23a8832b241da: () => xt, __wbg_instanceof_Uint8Array_1349640af2da2e88: () => Ht, __wbg_isSafeInteger_2088b01008075470: () => $t, __wbg_length_0aab7ffd65ad19ed: () => Rt, __wbg_length_820c786973abdd8a: () => qt, __wbg_log_dc06ec929fc95a20: () => At, __wbg_message_eab7d45ec69a2135: () => mt, __wbg_method_e15eb9cf1c32cdbb: () => Q, __wbg_name_2a8bae31363c6a51: () => ut, __wbg_new_09938a7d020f049b: () => kt, __wbg_new_143b41b4342650bb: () => ft, __wbg_new_2b55e405e4af4986: () => It, __wbg_new_2b6fea4ea03b1b95: () => ue, __wbg_new_87297f22973157c8: () => ee, __wbg_newwithbyteoffsetandlength_88d1d8be5df94b9b: () => Nt, __wbg_newwithlength_89eeca401d8918c2: () => gt, __wbg_newwithoptbuffersourceandinit_6c49960a834dd7cf: () => at, __wbg_newwithoptreadablestreamandinit_d238e5b972c7b57f: () => pt, __wbg_newwithoptstrandinit_ff70839f3334d3aa: () => bt, __wbg_prepare_545a7ed280576b99: () => Et, __wbg_resolve_ae38ad63c43ff98b: () => Kt, __wbg_respond_8fadc5f5c9d95422: () => Zt, __wbg_results_c7ad1ae0ae681ab4: () => Ot, __wbg_set_07da13cc24b69217: () => be, __wbg_set_3698e3ca519b3c3c: () => Ut, __wbg_set_76353df4722f4954: () => ht, __wbg_then_835b073a479138e5: () => Vt, __wbg_then_8df675b8bb5d5e3c: () => Xt, __wbg_toString_506566b763774a16: () => ce, __wbg_url_3325e0ef088003ca: () => tt, __wbg_view_231340b0dd8a2484: () => Gt, __wbindgen_boolean_get: () => Bt, __wbindgen_cb_drop: () => wt, __wbindgen_closure_wrapper832: () => ge, __wbindgen_debug_string: () => Pt, __wbindgen_error_new: () => lt, __wbindgen_in: () => Ct, __wbindgen_is_object: () => Lt, __wbindgen_is_undefined: () => ct, __wbindgen_jsval_loose_eq: () => zt, __wbindgen_memory: () => Wt, __wbindgen_number_get: () => Ft, __wbindgen_number_new: () => fe, __wbindgen_object_clone_ref: () => St, __wbindgen_object_drop_ref: () => st, __wbindgen_string_get: () => rt, __wbindgen_string_new: () => _t, __wbindgen_throw: () => Jt, fetch: () => I, getMemory: () => z });
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
var h = 0;
var m = null;
function A() {
  return (m === null || m.byteLength === 0) && (m = new Uint8Array(_.memory.buffer)), m;
}
var B = typeof TextEncoder > "u" ? (0, module.require)("util").TextEncoder : TextEncoder;
var E = new B("utf-8");
var H = typeof E.encodeInto == "function" ? function(e, t) {
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
    let b = A().subarray(c + i, c + o), y = H(e, b);
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
var P = typeof TextDecoder > "u" ? (0, module.require)("util").TextDecoder : TextDecoder;
var R = new P("utf-8", { ignoreBOM: true, fatal: true });
R.decode();
function w(e, t) {
  return e = e >>> 0, R.decode(A().subarray(e, e + t));
}
var x = d.length;
function s(e) {
  x === d.length && d.push(d.length + 1);
  let t = x;
  return x = d[t], d[t] = e, t;
}
function J(e) {
  e < 132 || (d[e] = x, x = e);
}
function p(e) {
  let t = r(e);
  return J(e), t;
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
function rt(e, t) {
  let n = r(t), o = typeof n == "string" ? n : void 0;
  var c = g(o) ? 0 : M(o, _.__wbindgen_export_0, _.__wbindgen_export_1), u = h;
  f()[e / 4 + 1] = u, f()[e / 4 + 0] = c;
}
function _t(e, t) {
  let n = w(e, t);
  return s(n);
}
function ot() {
  return l(function(e, t) {
    let n = Reflect.get(r(e), r(t));
    return s(n);
  }, arguments);
}
function st(e) {
  p(e);
}
function ct(e) {
  return r(e) === void 0;
}
function it(e) {
  let t = r(e).constructor;
  return s(t);
}
function ut(e) {
  let t = r(e).name;
  return s(t);
}
function ft() {
  return l(function() {
    let e = new Headers();
    return s(e);
  }, arguments);
}
function bt() {
  return l(function(e, t, n) {
    let o = new Response(e === 0 ? void 0 : w(e, t), r(n));
    return s(o);
  }, arguments);
}
function gt(e) {
  let t = new Uint8Array(e >>> 0);
  return s(t);
}
function at() {
  return l(function(e, t) {
    let n = new Response(r(e), r(t));
    return s(n);
  }, arguments);
}
function pt() {
  return l(function(e, t) {
    let n = new Response(r(e), r(t));
    return s(n);
  }, arguments);
}
function dt() {
  return l(function(e, t, n) {
    let o = r(e).call(r(t), r(n));
    return s(o);
  }, arguments);
}
function wt(e) {
  let t = p(e).original;
  return t.cnt-- == 1 ? (t.a = 0, true) : false;
}
function lt(e, t) {
  let n = new Error(w(e, t));
  return s(n);
}
function ht() {
  return l(function(e, t, n, o, c) {
    r(e).set(w(t, n), w(o, c));
  }, arguments);
}
function yt(e) {
  let t = r(e).dump();
  return s(t);
}
function xt(e) {
  let t;
  try {
    t = r(e) instanceof Error;
  } catch {
    t = false;
  }
  return t;
}
function mt(e) {
  let t = r(e).message;
  return s(t);
}
function jt(e) {
  let t;
  try {
    t = r(e) instanceof ArrayBuffer;
  } catch {
    t = false;
  }
  return t;
}
function kt(e) {
  let t = new Uint8Array(r(e));
  return s(t);
}
function At(e) {
  console.log(r(e));
}
function Et(e, t, n) {
  let o = r(e).prepare(w(t, n));
  return s(o);
}
function Mt(e) {
  let t = r(e).all();
  return s(t);
}
function Ot(e) {
  let t = r(e).results;
  return g(t) ? 0 : s(t);
}
function qt(e) {
  return r(e).length;
}
function Tt(e, t) {
  let n = r(e)[t >>> 0];
  return s(n);
}
function Lt(e) {
  let t = r(e);
  return typeof t == "object" && t !== null;
}
function St(e) {
  let t = r(e);
  return s(t);
}
function vt(e, t) {
  let n = r(e)[r(t)];
  return s(n);
}
function Ct(e, t) {
  return r(e) in r(t);
}
function Ft(e, t) {
  let n = r(t), o = typeof n == "number" ? n : void 0;
  V()[e / 8 + 1] = g(o) ? 0 : o, f()[e / 4 + 0] = !g(o);
}
function $t(e) {
  return Number.isSafeInteger(r(e));
}
function It(e, t) {
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
function Rt(e) {
  return r(e).length;
}
function Wt() {
  let e = _.memory;
  return s(e);
}
function Dt(e) {
  let t = r(e).buffer;
  return s(t);
}
function Nt(e, t, n) {
  let o = new Uint8Array(r(e), t >>> 0, n >>> 0);
  return s(o);
}
function Ut(e, t, n) {
  r(e).set(r(t), n >>> 0);
}
function zt(e, t) {
  return r(e) == r(t);
}
function Bt(e) {
  let t = r(e);
  return typeof t == "boolean" ? t ? 1 : 0 : 2;
}
function Ht(e) {
  let t;
  try {
    t = r(e) instanceof Uint8Array;
  } catch {
    t = false;
  }
  return t;
}
function Pt(e, t) {
  let n = O(r(t)), o = M(n, _.__wbindgen_export_0, _.__wbindgen_export_1), c = h;
  f()[e / 4 + 1] = c, f()[e / 4 + 0] = o;
}
function Jt(e, t) {
  throw new Error(w(e, t));
}
function Vt(e, t, n) {
  let o = r(e).then(r(t), r(n));
  return s(o);
}
function Kt(e) {
  let t = Promise.resolve(r(e));
  return s(t);
}
function Xt(e, t) {
  let n = r(e).then(r(t));
  return s(n);
}
function Yt(e) {
  let t = r(e).byobRequest;
  return g(t) ? 0 : s(t);
}
function Zt(e, t) {
  r(e).respond(t >>> 0);
}
function Gt(e) {
  let t = r(e).view;
  return g(t) ? 0 : s(t);
}
function Qt(e) {
  return r(e).byteLength;
}
function te(e) {
  r(e).close();
}
function ee(e, t) {
  let n = new Error(w(e, t));
  return s(n);
}
function ne(e) {
  let t = r(e).buffer;
  return s(t);
}
function re(e) {
  return r(e).byteOffset;
}
function _e(e) {
  r(e).close();
}
function oe(e, t) {
  r(e).enqueue(r(t));
}
function se(e) {
  console.error(r(e));
}
function ce(e) {
  let t = r(e).toString();
  return s(t);
}
function ie(e) {
  let t = r(e).cause;
  return s(t);
}
function ue() {
  let e = new Object();
  return s(e);
}
function fe(e) {
  return s(e);
}
function be() {
  return l(function(e, t, n) {
    return Reflect.set(r(e), r(t), r(n));
  }, arguments);
}
function ge(e, t, n) {
  let o = K(e, t, 60, X);
  return s(o);
}
var ye = { fetch: I, scheduled: void 0, queue: void 0 };
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
  Mt as __wbg_all_2b78e889ce8a546b,
  ne as __wbg_buffer_4e79326814bdd393,
  Dt as __wbg_buffer_55ba7a6b1b92e2ac,
  Yt as __wbg_byobRequest_08c18cee35def1f4,
  Qt as __wbg_byteLength_5299848ed3264181,
  re as __wbg_byteOffset_b69b0a07afccce19,
  dt as __wbg_call_587b30eea3e09332,
  ie as __wbg_cause_52959bcad93f9e0f,
  nt as __wbg_cf_703652f0d2c5b8d1,
  te as __wbg_close_da7e6fb9d9851e5a,
  _e as __wbg_close_e9110ca16e2567db,
  it as __wbg_constructor_f2623999a1f453eb,
  yt as __wbg_dump_3aaddc556066b01a,
  oe as __wbg_enqueue_d71a1a518e21f5c3,
  se as __wbg_error_a7e23606158b68b9,
  Tt as __wbg_get_7303ed2ef026b2f5,
  ot as __wbg_get_f53c921291c381bd,
  vt as __wbg_getwithrefkey_5e6d9547403deab8,
  et as __wbg_headers_1eff4f53324496e6,
  jt as __wbg_instanceof_ArrayBuffer_ef2632aa0d4bfff8,
  xt as __wbg_instanceof_Error_fac23a8832b241da,
  Ht as __wbg_instanceof_Uint8Array_1349640af2da2e88,
  $t as __wbg_isSafeInteger_2088b01008075470,
  Rt as __wbg_length_0aab7ffd65ad19ed,
  qt as __wbg_length_820c786973abdd8a,
  At as __wbg_log_dc06ec929fc95a20,
  mt as __wbg_message_eab7d45ec69a2135,
  Q as __wbg_method_e15eb9cf1c32cdbb,
  ut as __wbg_name_2a8bae31363c6a51,
  kt as __wbg_new_09938a7d020f049b,
  ft as __wbg_new_143b41b4342650bb,
  It as __wbg_new_2b55e405e4af4986,
  ue as __wbg_new_2b6fea4ea03b1b95,
  ee as __wbg_new_87297f22973157c8,
  Nt as __wbg_newwithbyteoffsetandlength_88d1d8be5df94b9b,
  gt as __wbg_newwithlength_89eeca401d8918c2,
  at as __wbg_newwithoptbuffersourceandinit_6c49960a834dd7cf,
  pt as __wbg_newwithoptreadablestreamandinit_d238e5b972c7b57f,
  bt as __wbg_newwithoptstrandinit_ff70839f3334d3aa,
  Et as __wbg_prepare_545a7ed280576b99,
  Kt as __wbg_resolve_ae38ad63c43ff98b,
  Zt as __wbg_respond_8fadc5f5c9d95422,
  Ot as __wbg_results_c7ad1ae0ae681ab4,
  be as __wbg_set_07da13cc24b69217,
  Ut as __wbg_set_3698e3ca519b3c3c,
  ht as __wbg_set_76353df4722f4954,
  Vt as __wbg_then_835b073a479138e5,
  Xt as __wbg_then_8df675b8bb5d5e3c,
  ce as __wbg_toString_506566b763774a16,
  tt as __wbg_url_3325e0ef088003ca,
  Gt as __wbg_view_231340b0dd8a2484,
  Bt as __wbindgen_boolean_get,
  wt as __wbindgen_cb_drop,
  ge as __wbindgen_closure_wrapper832,
  Pt as __wbindgen_debug_string,
  lt as __wbindgen_error_new,
  Ct as __wbindgen_in,
  Lt as __wbindgen_is_object,
  ct as __wbindgen_is_undefined,
  zt as __wbindgen_jsval_loose_eq,
  Wt as __wbindgen_memory,
  Ft as __wbindgen_number_get,
  fe as __wbindgen_number_new,
  St as __wbindgen_object_clone_ref,
  st as __wbindgen_object_drop_ref,
  rt as __wbindgen_string_get,
  _t as __wbindgen_string_new,
  Jt as __wbindgen_throw,
  ye as default,
  I as fetch,
  z as getMemory,
  he as wasmModule
};
//# sourceMappingURL=shim.js.map
