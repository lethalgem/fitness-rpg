// .wrangler/tmp/bundle-T1j9ea/checked-fetch.js
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
import D from "./bc071410d68d416d3b1f36938c42394d12d4d8fb-index.wasm";
import Xe from "./bc071410d68d416d3b1f36938c42394d12d4d8fb-index.wasm";
var N = Object.defineProperty;
var W = (e, t) => {
  for (var n in t)
    N(e, n, { get: t[n], enumerable: true });
};
var w = {};
W(w, { IntoUnderlyingByteSource: () => T, IntoUnderlyingSink: () => v, IntoUnderlyingSource: () => q, MinifyConfig: () => S, PipeOptions: () => L, PolishConfig: () => Z, QueuingStrategy: () => C, R2Range: () => F, ReadableStreamGetReaderOptions: () => R, RequestRedirect: () => G, __wbg_abort_de75e4ab5136bcee: () => wt, __wbg_all_2b78e889ce8a546b: () => jt, __wbg_append_fac652007989b765: () => Ct, __wbg_bind_01b74990dad5c1f3: () => Kt, __wbg_buffer_4e79326814bdd393: () => Re, __wbg_buffer_55ba7a6b1b92e2ac: () => ce, __wbg_byobRequest_08c18cee35def1f4: () => ve, __wbg_byteLength_5299848ed3264181: () => Le, __wbg_byteOffset_b69b0a07afccce19: () => $e, __wbg_call_557a2f2deacc4912: () => ne, __wbg_call_587b30eea3e09332: () => dt, __wbg_cause_52959bcad93f9e0f: () => ze, __wbg_cf_703652f0d2c5b8d1: () => nt, __wbg_close_da7e6fb9d9851e5a: () => Ce, __wbg_close_e9110ca16e2567db: () => Ie, __wbg_constructor_f2623999a1f453eb: () => it, __wbg_done_b6abb27d42b63867: () => Dt, __wbg_enqueue_d71a1a518e21f5c3: () => Ne, __wbg_error_a7e23606158b68b9: () => De, __wbg_error_f673cd9e40bac8a7: () => Gt, __wbg_fetch_621998933558ad27: () => le, __wbg_fetch_6a2624d7f767e331: () => xe, __wbg_get_7303ed2ef026b2f5: () => Et, __wbg_get_f53c921291c381bd: () => ot, __wbg_getwithrefkey_5e6d9547403deab8: () => Ot, __wbg_globalThis_b70c095388441f2d: () => ge, __wbg_global_1c72617491ed7194: () => pe, __wbg_has_40b8c976775c8ead: () => we, __wbg_headers_1eff4f53324496e6: () => et, __wbg_headers_2de03c88f895093b: () => Nt, __wbg_instanceof_ArrayBuffer_ef2632aa0d4bfff8: () => Ae, __wbg_instanceof_Error_fac23a8832b241da: () => Yt, __wbg_instanceof_Response_7ade9a5a066d1a55: () => Rt, __wbg_instanceof_Uint8Array_1349640af2da2e88: () => je, __wbg_isSafeInteger_2088b01008075470: () => qt, __wbg_iterator_7c7e58f62eb84700: () => te, __wbg_json_682f3a71d443960d: () => Ht, __wbg_length_0aab7ffd65ad19ed: () => _e, __wbg_length_820c786973abdd8a: () => kt, __wbg_log_dc06ec929fc95a20: () => yt, __wbg_message_eab7d45ec69a2135: () => Zt, __wbg_method_e15eb9cf1c32cdbb: () => Q, __wbg_name_2a8bae31363c6a51: () => ut, __wbg_new_0394642eae39db16: () => Pt, __wbg_new_09938a7d020f049b: () => ue, __wbg_new_143b41b4342650bb: () => ft, __wbg_new_2b55e405e4af4986: () => Qt, __wbg_new_2b6fea4ea03b1b95: () => St, __wbg_new_668956ac1089f8cf: () => he, __wbg_new_87297f22973157c8: () => Fe, __wbg_newnoargs_c9e6043b8ad84109: () => de, __wbg_newwithbyteoffsetandlength_88d1d8be5df94b9b: () => se, __wbg_newwithlength_89eeca401d8918c2: () => at, __wbg_newwithoptbuffersourceandinit_6c49960a834dd7cf: () => gt, __wbg_newwithoptreadablestreamandinit_d238e5b972c7b57f: () => pt, __wbg_newwithoptstrandinit_ff70839f3334d3aa: () => bt, __wbg_newwithstrandinit_a4cd16dfaafcf625: () => We, __wbg_next_ec061e48a0e72a96: () => Wt, __wbg_next_f4bc0e96ea67da68: () => re, __wbg_prepare_545a7ed280576b99: () => mt, __wbg_push_109cfc26d02582dd: () => Vt, __wbg_resolve_ae38ad63c43ff98b: () => Oe, __wbg_respond_8fadc5f5c9d95422: () => qe, __wbg_results_c7ad1ae0ae681ab4: () => At, __wbg_run_5e881e547261fe1f: () => Xt, __wbg_self_742dd6eab3e9211e: () => be, __wbg_set_07da13cc24b69217: () => Lt, __wbg_set_3698e3ca519b3c3c: () => ie, __wbg_set_76353df4722f4954: () => ht, __wbg_signal_bcb55e86063f8860: () => Ft, __wbg_status_d2b2d0889f7e970f: () => $t, __wbg_stringify_d06ad2addc54d51e: () => zt, __wbg_text_65fa1887e8f7b4ac: () => Bt, __wbg_then_835b073a479138e5: () => Me, __wbg_then_8df675b8bb5d5e3c: () => Te, __wbg_toString_506566b763774a16: () => Ue, __wbg_url_3325e0ef088003ca: () => tt, __wbg_url_59cb32ef6a837521: () => It, __wbg_value_2f4ef2036bfad28e: () => Ut, __wbg_view_231340b0dd8a2484: () => Se, __wbg_window_c409e731db53a0e2: () => ae, __wbindgen_boolean_get: () => me, __wbindgen_cb_drop: () => lt, __wbindgen_closure_wrapper1083: () => Be, __wbindgen_debug_string: () => ke, __wbindgen_error_new: () => xt, __wbindgen_in: () => Tt, __wbindgen_is_function: () => ee, __wbindgen_is_object: () => Mt, __wbindgen_is_undefined: () => st, __wbindgen_jsval_loose_eq: () => ye, __wbindgen_memory: () => oe, __wbindgen_number_get: () => vt, __wbindgen_number_new: () => Jt, __wbindgen_object_clone_ref: () => fe, __wbindgen_object_drop_ref: () => ct, __wbindgen_string_get: () => rt, __wbindgen_string_new: () => _t, __wbindgen_throw: () => Ee, fetch: () => $, getMemory: () => z });
var U = new WebAssembly.Instance(D, { "./index_bg.js": w });
var c = U.exports;
function z() {
  return c.memory;
}
var l = new Array(128).fill(void 0);
l.push(void 0, null, true, false);
function r(e) {
  return l[e];
}
var x = 0;
var j = null;
function E() {
  return (j === null || j.byteLength === 0) && (j = new Uint8Array(c.memory.buffer)), j;
}
var B = typeof TextEncoder > "u" ? (0, module.require)("util").TextEncoder : TextEncoder;
var M = new B("utf-8");
var H = typeof M.encodeInto == "function" ? function(e, t) {
  return M.encodeInto(e, t);
} : function(e, t) {
  let n = M.encode(e);
  return t.set(n), { read: e.length, written: n.length };
};
function h(e, t, n) {
  if (n === void 0) {
    let a = M.encode(e), y = t(a.length) >>> 0;
    return E().subarray(y, y + a.length).set(a), x = a.length, y;
  }
  let _ = e.length, s = t(_) >>> 0, b = E(), f = 0;
  for (; f < _; f++) {
    let a = e.charCodeAt(f);
    if (a > 127)
      break;
    b[s + f] = a;
  }
  if (f !== _) {
    f !== 0 && (e = e.slice(f)), s = n(s, _, _ = f + e.length * 3) >>> 0;
    let a = E().subarray(s + f, s + _), y = H(e, a);
    f += y.written;
  }
  return x = f, s;
}
function g(e) {
  return e == null;
}
var A = null;
function u() {
  return (A === null || A.byteLength === 0) && (A = new Int32Array(c.memory.buffer)), A;
}
var J = typeof TextDecoder > "u" ? (0, module.require)("util").TextDecoder : TextDecoder;
var I = new J("utf-8", { ignoreBOM: true, fatal: true });
I.decode();
function p(e, t) {
  return e = e >>> 0, I.decode(E().subarray(e, e + t));
}
var m = l.length;
function o(e) {
  m === l.length && l.push(l.length + 1);
  let t = m;
  return m = l[t], l[t] = e, t;
}
function P(e) {
  e < 132 || (l[e] = m, m = e);
}
function d(e) {
  let t = r(e);
  return P(e), t;
}
var k = null;
function V() {
  return (k === null || k.byteLength === 0) && (k = new Float64Array(c.memory.buffer)), k;
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
    for (let f = 1; f < s; f++)
      b += ", " + O(e[f]);
    return b += "]", b;
  }
  let n = /\[object ([^\]]+)\]/.exec(toString.call(e)), _;
  if (n.length > 1)
    _ = n[1];
  else
    return toString.call(e);
  if (_ == "Object")
    try {
      return "Object(" + JSON.stringify(e) + ")";
    } catch {
      return "Object";
    }
  return e instanceof Error ? `${e.name}: ${e.message}
${e.stack}` : _;
}
function K(e, t, n, _) {
  let s = { a: e, b: t, cnt: 1, dtor: n }, b = (...f) => {
    s.cnt++;
    let a = s.a;
    s.a = 0;
    try {
      return _(a, s.b, ...f);
    } finally {
      --s.cnt === 0 ? c.__wbindgen_export_2.get(s.dtor)(a, s.b) : s.a = a;
    }
  };
  return b.original = s, b;
}
function X(e, t, n) {
  c.__wbindgen_export_3(e, t, o(n));
}
function $(e, t, n) {
  let _ = c.fetch(o(e), o(t), o(n));
  return d(_);
}
function i(e, t) {
  try {
    return e.apply(this, t);
  } catch (n) {
    c.__wbindgen_export_4(o(n));
  }
}
function Y(e, t, n, _) {
  c.__wbindgen_export_5(e, t, o(n), o(_));
}
var Z = Object.freeze({ Off: 0, 0: "Off", Lossy: 1, 1: "Lossy", Lossless: 2, 2: "Lossless" });
var G = Object.freeze({ Error: 0, 0: "Error", Follow: 1, 1: "Follow", Manual: 2, 2: "Manual" });
var T = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    c.__wbg_intounderlyingbytesource_free(t);
  }
  get type() {
    let t, n;
    try {
      let b = c.__wbindgen_add_to_stack_pointer(-16);
      c.intounderlyingbytesource_type(b, this.__wbg_ptr);
      var _ = u()[b / 4 + 0], s = u()[b / 4 + 1];
      return t = _, n = s, p(_, s);
    } finally {
      c.__wbindgen_add_to_stack_pointer(16), c.__wbindgen_export_6(t, n);
    }
  }
  get autoAllocateChunkSize() {
    return c.intounderlyingbytesource_autoAllocateChunkSize(this.__wbg_ptr) >>> 0;
  }
  start(t) {
    c.intounderlyingbytesource_start(this.__wbg_ptr, o(t));
  }
  pull(t) {
    let n = c.intounderlyingbytesource_pull(this.__wbg_ptr, o(t));
    return d(n);
  }
  cancel() {
    let t = this.__destroy_into_raw();
    c.intounderlyingbytesource_cancel(t);
  }
};
var v = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    c.__wbg_intounderlyingsink_free(t);
  }
  write(t) {
    let n = c.intounderlyingsink_write(this.__wbg_ptr, o(t));
    return d(n);
  }
  close() {
    let t = this.__destroy_into_raw(), n = c.intounderlyingsink_close(t);
    return d(n);
  }
  abort(t) {
    let n = this.__destroy_into_raw(), _ = c.intounderlyingsink_abort(n, o(t));
    return d(_);
  }
};
var q = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    c.__wbg_intounderlyingsource_free(t);
  }
  pull(t) {
    let n = c.intounderlyingsource_pull(this.__wbg_ptr, o(t));
    return d(n);
  }
  cancel() {
    let t = this.__destroy_into_raw();
    c.intounderlyingsource_cancel(t);
  }
};
var S = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    c.__wbg_minifyconfig_free(t);
  }
  get js() {
    return c.__wbg_get_minifyconfig_js(this.__wbg_ptr) !== 0;
  }
  set js(t) {
    c.__wbg_set_minifyconfig_js(this.__wbg_ptr, t);
  }
  get html() {
    return c.__wbg_get_minifyconfig_html(this.__wbg_ptr) !== 0;
  }
  set html(t) {
    c.__wbg_set_minifyconfig_html(this.__wbg_ptr, t);
  }
  get css() {
    return c.__wbg_get_minifyconfig_css(this.__wbg_ptr) !== 0;
  }
  set css(t) {
    c.__wbg_set_minifyconfig_css(this.__wbg_ptr, t);
  }
};
var L = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    c.__wbg_pipeoptions_free(t);
  }
  get preventClose() {
    return c.pipeoptions_preventClose(this.__wbg_ptr) !== 0;
  }
  get preventCancel() {
    return c.pipeoptions_preventCancel(this.__wbg_ptr) !== 0;
  }
  get preventAbort() {
    return c.pipeoptions_preventAbort(this.__wbg_ptr) !== 0;
  }
  get signal() {
    let t = c.pipeoptions_signal(this.__wbg_ptr);
    return d(t);
  }
};
var C = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    c.__wbg_queuingstrategy_free(t);
  }
  get highWaterMark() {
    return c.queuingstrategy_highWaterMark(this.__wbg_ptr);
  }
};
var F = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    c.__wbg_r2range_free(t);
  }
  get offset() {
    try {
      let _ = c.__wbindgen_add_to_stack_pointer(-16);
      c.__wbg_get_r2range_offset(_, this.__wbg_ptr);
      var t = u()[_ / 4 + 0], n = u()[_ / 4 + 1];
      return t === 0 ? void 0 : n >>> 0;
    } finally {
      c.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set offset(t) {
    c.__wbg_set_r2range_offset(this.__wbg_ptr, !g(t), g(t) ? 0 : t);
  }
  get length() {
    try {
      let _ = c.__wbindgen_add_to_stack_pointer(-16);
      c.__wbg_get_r2range_length(_, this.__wbg_ptr);
      var t = u()[_ / 4 + 0], n = u()[_ / 4 + 1];
      return t === 0 ? void 0 : n >>> 0;
    } finally {
      c.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set length(t) {
    c.__wbg_set_r2range_length(this.__wbg_ptr, !g(t), g(t) ? 0 : t);
  }
  get suffix() {
    try {
      let _ = c.__wbindgen_add_to_stack_pointer(-16);
      c.__wbg_get_r2range_suffix(_, this.__wbg_ptr);
      var t = u()[_ / 4 + 0], n = u()[_ / 4 + 1];
      return t === 0 ? void 0 : n >>> 0;
    } finally {
      c.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set suffix(t) {
    c.__wbg_set_r2range_suffix(this.__wbg_ptr, !g(t), g(t) ? 0 : t);
  }
};
var R = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    c.__wbg_readablestreamgetreaderoptions_free(t);
  }
  get mode() {
    let t = c.readablestreamgetreaderoptions_mode(this.__wbg_ptr);
    return d(t);
  }
};
function Q(e, t) {
  let n = r(t).method, _ = h(n, c.__wbindgen_export_0, c.__wbindgen_export_1), s = x;
  u()[e / 4 + 1] = s, u()[e / 4 + 0] = _;
}
function tt(e, t) {
  let n = r(t).url, _ = h(n, c.__wbindgen_export_0, c.__wbindgen_export_1), s = x;
  u()[e / 4 + 1] = s, u()[e / 4 + 0] = _;
}
function et(e) {
  let t = r(e).headers;
  return o(t);
}
function nt(e) {
  let t = r(e).cf;
  return g(t) ? 0 : o(t);
}
function rt(e, t) {
  let n = r(t), _ = typeof n == "string" ? n : void 0;
  var s = g(_) ? 0 : h(_, c.__wbindgen_export_0, c.__wbindgen_export_1), b = x;
  u()[e / 4 + 1] = b, u()[e / 4 + 0] = s;
}
function _t(e, t) {
  let n = p(e, t);
  return o(n);
}
function ot() {
  return i(function(e, t) {
    let n = Reflect.get(r(e), r(t));
    return o(n);
  }, arguments);
}
function ct(e) {
  d(e);
}
function st(e) {
  return r(e) === void 0;
}
function it(e) {
  let t = r(e).constructor;
  return o(t);
}
function ut(e) {
  let t = r(e).name;
  return o(t);
}
function ft() {
  return i(function() {
    let e = new Headers();
    return o(e);
  }, arguments);
}
function bt() {
  return i(function(e, t, n) {
    let _ = new Response(e === 0 ? void 0 : p(e, t), r(n));
    return o(_);
  }, arguments);
}
function at(e) {
  let t = new Uint8Array(e >>> 0);
  return o(t);
}
function gt() {
  return i(function(e, t) {
    let n = new Response(r(e), r(t));
    return o(n);
  }, arguments);
}
function pt() {
  return i(function(e, t) {
    let n = new Response(r(e), r(t));
    return o(n);
  }, arguments);
}
function dt() {
  return i(function(e, t, n) {
    let _ = r(e).call(r(t), r(n));
    return o(_);
  }, arguments);
}
function wt(e) {
  r(e).abort();
}
function lt(e) {
  let t = d(e).original;
  return t.cnt-- == 1 ? (t.a = 0, true) : false;
}
function xt(e, t) {
  let n = new Error(p(e, t));
  return o(n);
}
function ht() {
  return i(function(e, t, n, _, s) {
    r(e).set(p(t, n), p(_, s));
  }, arguments);
}
function yt(e) {
  console.log(r(e));
}
function mt(e, t, n) {
  let _ = r(e).prepare(p(t, n));
  return o(_);
}
function jt(e) {
  let t = r(e).all();
  return o(t);
}
function At(e) {
  let t = r(e).results;
  return g(t) ? 0 : o(t);
}
function kt(e) {
  return r(e).length;
}
function Et(e, t) {
  let n = r(e)[t >>> 0];
  return o(n);
}
function Mt(e) {
  let t = r(e);
  return typeof t == "object" && t !== null;
}
function Ot(e, t) {
  let n = r(e)[r(t)];
  return o(n);
}
function Tt(e, t) {
  return r(e) in r(t);
}
function vt(e, t) {
  let n = r(t), _ = typeof n == "number" ? n : void 0;
  V()[e / 8 + 1] = g(_) ? 0 : _, u()[e / 4 + 0] = !g(_);
}
function qt(e) {
  return Number.isSafeInteger(r(e));
}
function St() {
  let e = new Object();
  return o(e);
}
function Lt() {
  return i(function(e, t, n) {
    return Reflect.set(r(e), r(t), r(n));
  }, arguments);
}
function Ct() {
  return i(function(e, t, n, _, s) {
    r(e).append(p(t, n), p(_, s));
  }, arguments);
}
function Ft(e) {
  let t = r(e).signal;
  return o(t);
}
function Rt(e) {
  let t;
  try {
    t = r(e) instanceof Response;
  } catch {
    t = false;
  }
  return t;
}
function $t(e) {
  return r(e).status;
}
function It(e, t) {
  let n = r(t).url, _ = h(n, c.__wbindgen_export_0, c.__wbindgen_export_1), s = x;
  u()[e / 4 + 1] = s, u()[e / 4 + 0] = _;
}
function Nt(e) {
  let t = r(e).headers;
  return o(t);
}
function Wt() {
  return i(function(e) {
    let t = r(e).next();
    return o(t);
  }, arguments);
}
function Dt(e) {
  return r(e).done;
}
function Ut(e) {
  let t = r(e).value;
  return o(t);
}
function zt() {
  return i(function(e) {
    let t = JSON.stringify(r(e));
    return o(t);
  }, arguments);
}
function Bt() {
  return i(function(e) {
    let t = r(e).text();
    return o(t);
  }, arguments);
}
function Ht() {
  return i(function(e) {
    let t = r(e).json();
    return o(t);
  }, arguments);
}
function Jt(e) {
  return o(e);
}
function Pt() {
  let e = new Array();
  return o(e);
}
function Vt(e, t) {
  return r(e).push(r(t));
}
function Kt() {
  return i(function(e, t) {
    let n = r(e).bind(...d(t));
    return o(n);
  }, arguments);
}
function Xt(e) {
  let t = r(e).run();
  return o(t);
}
function Yt(e) {
  let t;
  try {
    t = r(e) instanceof Error;
  } catch {
    t = false;
  }
  return t;
}
function Zt(e) {
  let t = r(e).message;
  return o(t);
}
function Gt(e, t) {
  let n = r(t).error;
  var _ = g(n) ? 0 : h(n, c.__wbindgen_export_0, c.__wbindgen_export_1), s = x;
  u()[e / 4 + 1] = s, u()[e / 4 + 0] = _;
}
function Qt(e, t) {
  try {
    var n = { a: e, b: t }, _ = (b, f) => {
      let a = n.a;
      n.a = 0;
      try {
        return Y(a, n.b, b, f);
      } finally {
        n.a = a;
      }
    };
    let s = new Promise(_);
    return o(s);
  } finally {
    n.a = n.b = 0;
  }
}
function te() {
  return o(Symbol.iterator);
}
function ee(e) {
  return typeof r(e) == "function";
}
function ne() {
  return i(function(e, t) {
    let n = r(e).call(r(t));
    return o(n);
  }, arguments);
}
function re(e) {
  let t = r(e).next;
  return o(t);
}
function _e(e) {
  return r(e).length;
}
function oe() {
  let e = c.memory;
  return o(e);
}
function ce(e) {
  let t = r(e).buffer;
  return o(t);
}
function se(e, t, n) {
  let _ = new Uint8Array(r(e), t >>> 0, n >>> 0);
  return o(_);
}
function ie(e, t, n) {
  r(e).set(r(t), n >>> 0);
}
function ue(e) {
  let t = new Uint8Array(r(e));
  return o(t);
}
function fe(e) {
  let t = r(e);
  return o(t);
}
function be() {
  return i(function() {
    let e = self.self;
    return o(e);
  }, arguments);
}
function ae() {
  return i(function() {
    let e = window.window;
    return o(e);
  }, arguments);
}
function ge() {
  return i(function() {
    let e = globalThis.globalThis;
    return o(e);
  }, arguments);
}
function pe() {
  return i(function() {
    let e = global.global;
    return o(e);
  }, arguments);
}
function de(e, t) {
  let n = new Function(p(e, t));
  return o(n);
}
function we() {
  return i(function(e, t) {
    return Reflect.has(r(e), r(t));
  }, arguments);
}
function le(e, t) {
  let n = r(e).fetch(r(t));
  return o(n);
}
function xe(e) {
  let t = fetch(r(e));
  return o(t);
}
function he() {
  return i(function() {
    let e = new AbortController();
    return o(e);
  }, arguments);
}
function ye(e, t) {
  return r(e) == r(t);
}
function me(e) {
  let t = r(e);
  return typeof t == "boolean" ? t ? 1 : 0 : 2;
}
function je(e) {
  let t;
  try {
    t = r(e) instanceof Uint8Array;
  } catch {
    t = false;
  }
  return t;
}
function Ae(e) {
  let t;
  try {
    t = r(e) instanceof ArrayBuffer;
  } catch {
    t = false;
  }
  return t;
}
function ke(e, t) {
  let n = O(r(t)), _ = h(n, c.__wbindgen_export_0, c.__wbindgen_export_1), s = x;
  u()[e / 4 + 1] = s, u()[e / 4 + 0] = _;
}
function Ee(e, t) {
  throw new Error(p(e, t));
}
function Me(e, t, n) {
  let _ = r(e).then(r(t), r(n));
  return o(_);
}
function Oe(e) {
  let t = Promise.resolve(r(e));
  return o(t);
}
function Te(e, t) {
  let n = r(e).then(r(t));
  return o(n);
}
function ve(e) {
  let t = r(e).byobRequest;
  return g(t) ? 0 : o(t);
}
function qe(e, t) {
  r(e).respond(t >>> 0);
}
function Se(e) {
  let t = r(e).view;
  return g(t) ? 0 : o(t);
}
function Le(e) {
  return r(e).byteLength;
}
function Ce(e) {
  r(e).close();
}
function Fe(e, t) {
  let n = new Error(p(e, t));
  return o(n);
}
function Re(e) {
  let t = r(e).buffer;
  return o(t);
}
function $e(e) {
  return r(e).byteOffset;
}
function Ie(e) {
  r(e).close();
}
function Ne(e, t) {
  r(e).enqueue(r(t));
}
function We() {
  return i(function(e, t, n) {
    let _ = new Request(p(e, t), r(n));
    return o(_);
  }, arguments);
}
function De(e) {
  console.error(r(e));
}
function Ue(e) {
  let t = r(e).toString();
  return o(t);
}
function ze(e) {
  let t = r(e).cause;
  return o(t);
}
function Be(e, t, n) {
  let _ = K(e, t, 70, X);
  return o(_);
}
var Ye = { fetch: $, scheduled: void 0, queue: void 0 };
export {
  T as IntoUnderlyingByteSource,
  v as IntoUnderlyingSink,
  q as IntoUnderlyingSource,
  S as MinifyConfig,
  L as PipeOptions,
  Z as PolishConfig,
  C as QueuingStrategy,
  F as R2Range,
  R as ReadableStreamGetReaderOptions,
  G as RequestRedirect,
  wt as __wbg_abort_de75e4ab5136bcee,
  jt as __wbg_all_2b78e889ce8a546b,
  Ct as __wbg_append_fac652007989b765,
  Kt as __wbg_bind_01b74990dad5c1f3,
  Re as __wbg_buffer_4e79326814bdd393,
  ce as __wbg_buffer_55ba7a6b1b92e2ac,
  ve as __wbg_byobRequest_08c18cee35def1f4,
  Le as __wbg_byteLength_5299848ed3264181,
  $e as __wbg_byteOffset_b69b0a07afccce19,
  ne as __wbg_call_557a2f2deacc4912,
  dt as __wbg_call_587b30eea3e09332,
  ze as __wbg_cause_52959bcad93f9e0f,
  nt as __wbg_cf_703652f0d2c5b8d1,
  Ce as __wbg_close_da7e6fb9d9851e5a,
  Ie as __wbg_close_e9110ca16e2567db,
  it as __wbg_constructor_f2623999a1f453eb,
  Dt as __wbg_done_b6abb27d42b63867,
  Ne as __wbg_enqueue_d71a1a518e21f5c3,
  De as __wbg_error_a7e23606158b68b9,
  Gt as __wbg_error_f673cd9e40bac8a7,
  le as __wbg_fetch_621998933558ad27,
  xe as __wbg_fetch_6a2624d7f767e331,
  Et as __wbg_get_7303ed2ef026b2f5,
  ot as __wbg_get_f53c921291c381bd,
  Ot as __wbg_getwithrefkey_5e6d9547403deab8,
  ge as __wbg_globalThis_b70c095388441f2d,
  pe as __wbg_global_1c72617491ed7194,
  we as __wbg_has_40b8c976775c8ead,
  et as __wbg_headers_1eff4f53324496e6,
  Nt as __wbg_headers_2de03c88f895093b,
  Ae as __wbg_instanceof_ArrayBuffer_ef2632aa0d4bfff8,
  Yt as __wbg_instanceof_Error_fac23a8832b241da,
  Rt as __wbg_instanceof_Response_7ade9a5a066d1a55,
  je as __wbg_instanceof_Uint8Array_1349640af2da2e88,
  qt as __wbg_isSafeInteger_2088b01008075470,
  te as __wbg_iterator_7c7e58f62eb84700,
  Ht as __wbg_json_682f3a71d443960d,
  _e as __wbg_length_0aab7ffd65ad19ed,
  kt as __wbg_length_820c786973abdd8a,
  yt as __wbg_log_dc06ec929fc95a20,
  Zt as __wbg_message_eab7d45ec69a2135,
  Q as __wbg_method_e15eb9cf1c32cdbb,
  ut as __wbg_name_2a8bae31363c6a51,
  Pt as __wbg_new_0394642eae39db16,
  ue as __wbg_new_09938a7d020f049b,
  ft as __wbg_new_143b41b4342650bb,
  Qt as __wbg_new_2b55e405e4af4986,
  St as __wbg_new_2b6fea4ea03b1b95,
  he as __wbg_new_668956ac1089f8cf,
  Fe as __wbg_new_87297f22973157c8,
  de as __wbg_newnoargs_c9e6043b8ad84109,
  se as __wbg_newwithbyteoffsetandlength_88d1d8be5df94b9b,
  at as __wbg_newwithlength_89eeca401d8918c2,
  gt as __wbg_newwithoptbuffersourceandinit_6c49960a834dd7cf,
  pt as __wbg_newwithoptreadablestreamandinit_d238e5b972c7b57f,
  bt as __wbg_newwithoptstrandinit_ff70839f3334d3aa,
  We as __wbg_newwithstrandinit_a4cd16dfaafcf625,
  Wt as __wbg_next_ec061e48a0e72a96,
  re as __wbg_next_f4bc0e96ea67da68,
  mt as __wbg_prepare_545a7ed280576b99,
  Vt as __wbg_push_109cfc26d02582dd,
  Oe as __wbg_resolve_ae38ad63c43ff98b,
  qe as __wbg_respond_8fadc5f5c9d95422,
  At as __wbg_results_c7ad1ae0ae681ab4,
  Xt as __wbg_run_5e881e547261fe1f,
  be as __wbg_self_742dd6eab3e9211e,
  Lt as __wbg_set_07da13cc24b69217,
  ie as __wbg_set_3698e3ca519b3c3c,
  ht as __wbg_set_76353df4722f4954,
  Ft as __wbg_signal_bcb55e86063f8860,
  $t as __wbg_status_d2b2d0889f7e970f,
  zt as __wbg_stringify_d06ad2addc54d51e,
  Bt as __wbg_text_65fa1887e8f7b4ac,
  Me as __wbg_then_835b073a479138e5,
  Te as __wbg_then_8df675b8bb5d5e3c,
  Ue as __wbg_toString_506566b763774a16,
  tt as __wbg_url_3325e0ef088003ca,
  It as __wbg_url_59cb32ef6a837521,
  Ut as __wbg_value_2f4ef2036bfad28e,
  Se as __wbg_view_231340b0dd8a2484,
  ae as __wbg_window_c409e731db53a0e2,
  me as __wbindgen_boolean_get,
  lt as __wbindgen_cb_drop,
  Be as __wbindgen_closure_wrapper1083,
  ke as __wbindgen_debug_string,
  xt as __wbindgen_error_new,
  Tt as __wbindgen_in,
  ee as __wbindgen_is_function,
  Mt as __wbindgen_is_object,
  st as __wbindgen_is_undefined,
  ye as __wbindgen_jsval_loose_eq,
  oe as __wbindgen_memory,
  vt as __wbindgen_number_get,
  Jt as __wbindgen_number_new,
  fe as __wbindgen_object_clone_ref,
  ct as __wbindgen_object_drop_ref,
  rt as __wbindgen_string_get,
  _t as __wbindgen_string_new,
  Ee as __wbindgen_throw,
  Ye as default,
  $ as fetch,
  z as getMemory,
  Xe as wasmModule
};
//# sourceMappingURL=shim.js.map
