// .wrangler/tmp/bundle-dpvUlu/checked-fetch.js
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
import W from "./1ecb0ad556474e8efc19f1fa3abd99761cc27d49-index.wasm";
import on from "./1ecb0ad556474e8efc19f1fa3abd99761cc27d49-index.wasm";
var D = Object.defineProperty;
var N = (e, t) => {
  for (var n in t)
    D(e, n, { get: t[n], enumerable: true });
};
var w = {};
N(w, { IntoUnderlyingByteSource: () => O, IntoUnderlyingSink: () => q, IntoUnderlyingSource: () => S, MinifyConfig: () => L, PipeOptions: () => C, PolishConfig: () => Q, QueuingStrategy: () => F, R2Range: () => I, ReadableStreamGetReaderOptions: () => R, RequestRedirect: () => tt, __wbg_abort_de75e4ab5136bcee: () => xt, __wbg_all_2b78e889ce8a546b: () => ee, __wbg_append_fac652007989b765: () => Tt, __wbg_batch_2e5aca6f93be5ee8: () => Vt, __wbg_bind_01b74990dad5c1f3: () => Ge, __wbg_buffer_4e79326814bdd393: () => He, __wbg_buffer_55ba7a6b1b92e2ac: () => we, __wbg_byobRequest_08c18cee35def1f4: () => Be, __wbg_byteLength_5299848ed3264181: () => We, __wbg_byteOffset_b69b0a07afccce19: () => Je, __wbg_call_557a2f2deacc4912: () => It, __wbg_call_587b30eea3e09332: () => lt, __wbg_cause_52959bcad93f9e0f: () => Ze, __wbg_cf_703652f0d2c5b8d1: () => _t, __wbg_close_da7e6fb9d9851e5a: () => Ue, __wbg_close_e9110ca16e2567db: () => Pe, __wbg_constructor_f2623999a1f453eb: () => ft, __wbg_done_b6abb27d42b63867: () => Dt, __wbg_enqueue_d71a1a518e21f5c3: () => Ve, __wbg_error_a7e23606158b68b9: () => Xe, __wbg_error_f673cd9e40bac8a7: () => Zt, __wbg_fetch_621998933558ad27: () => ve, __wbg_fetch_6a2624d7f767e331: () => Ee, __wbg_getTime_40bd09e020e8bc8c: () => _e, __wbg_get_7303ed2ef026b2f5: () => Yt, __wbg_get_f53c921291c381bd: () => st, __wbg_getwithrefkey_5e6d9547403deab8: () => Qt, __wbg_globalThis_b70c095388441f2d: () => Ae, __wbg_global_1c72617491ed7194: () => ke, __wbg_has_40b8c976775c8ead: () => Te, __wbg_headers_1eff4f53324496e6: () => rt, __wbg_headers_2de03c88f895093b: () => Lt, __wbg_instanceof_ArrayBuffer_ef2632aa0d4bfff8: () => Le, __wbg_instanceof_Error_fac23a8832b241da: () => mt, __wbg_instanceof_Response_7ade9a5a066d1a55: () => Ot, __wbg_instanceof_Uint8Array_1349640af2da2e88: () => Se, __wbg_isArray_04e59fb73f78ab5b: () => Kt, __wbg_isSafeInteger_2088b01008075470: () => be, __wbg_iterator_7c7e58f62eb84700: () => Ct, __wbg_json_682f3a71d443960d: () => Gt, __wbg_length_0aab7ffd65ad19ed: () => pe, __wbg_length_820c786973abdd8a: () => Xt, __wbg_log_dc06ec929fc95a20: () => zt, __wbg_message_eab7d45ec69a2135: () => jt, __wbg_method_e15eb9cf1c32cdbb: () => et, __wbg_name_2a8bae31363c6a51: () => bt, __wbg_new0_494c19a27871d56f: () => re, __wbg_new_0394642eae39db16: () => Jt, __wbg_new_09938a7d020f049b: () => he, __wbg_new_143b41b4342650bb: () => at, __wbg_new_2b55e405e4af4986: () => ge, __wbg_new_2b6fea4ea03b1b95: () => kt, __wbg_new_668956ac1089f8cf: () => vt, __wbg_new_87297f22973157c8: () => ze, __wbg_newnoargs_c9e6043b8ad84109: () => Me, __wbg_newwithbyteoffsetandlength_88d1d8be5df94b9b: () => le, __wbg_newwithlength_89eeca401d8918c2: () => pt, __wbg_newwithoptbuffersourceandinit_6c49960a834dd7cf: () => dt, __wbg_newwithoptreadablestreamandinit_d238e5b972c7b57f: () => wt, __wbg_newwithoptstrandinit_ff70839f3334d3aa: () => gt, __wbg_newwithstrandinit_a4cd16dfaafcf625: () => Ke, __wbg_next_ec061e48a0e72a96: () => Bt, __wbg_next_f4bc0e96ea67da68: () => $t, __wbg_prepare_545a7ed280576b99: () => Ht, __wbg_push_109cfc26d02582dd: () => Pt, __wbg_resolve_ae38ad63c43ff98b: () => Re, __wbg_respond_8fadc5f5c9d95422: () => De, __wbg_results_c7ad1ae0ae681ab4: () => ne, __wbg_run_5e881e547261fe1f: () => oe, __wbg_self_742dd6eab3e9211e: () => me, __wbg_set_07da13cc24b69217: () => Mt, __wbg_set_3698e3ca519b3c3c: () => xe, __wbg_set_76353df4722f4954: () => At, __wbg_signal_bcb55e86063f8860: () => Et, __wbg_status_d2b2d0889f7e970f: () => qt, __wbg_stringify_d06ad2addc54d51e: () => Wt, __wbg_text_65fa1887e8f7b4ac: () => Ut, __wbg_then_835b073a479138e5: () => Ie, __wbg_then_8df675b8bb5d5e3c: () => $e, __wbg_toString_506566b763774a16: () => Ye, __wbg_url_3325e0ef088003ca: () => nt, __wbg_url_59cb32ef6a837521: () => St, __wbg_value_2f4ef2036bfad28e: () => Nt, __wbg_view_231340b0dd8a2484: () => Ne, __wbg_window_c409e731db53a0e2: () => je, __wbindgen_bigint_from_i64: () => ie, __wbindgen_bigint_get_as_i64: () => se, __wbindgen_boolean_get: () => qe, __wbindgen_cb_drop: () => ht, __wbindgen_closure_wrapper1140: () => Qe, __wbindgen_debug_string: () => Ce, __wbindgen_error_new: () => yt, __wbindgen_in: () => te, __wbindgen_is_bigint: () => ce, __wbindgen_is_function: () => Ft, __wbindgen_is_object: () => Rt, __wbindgen_is_undefined: () => ut, __wbindgen_jsval_eq: () => ue, __wbindgen_jsval_loose_eq: () => Oe, __wbindgen_memory: () => de, __wbindgen_number_get: () => fe, __wbindgen_number_new: () => ae, __wbindgen_object_clone_ref: () => ye, __wbindgen_object_drop_ref: () => it, __wbindgen_string_get: () => ot, __wbindgen_string_new: () => ct, __wbindgen_throw: () => Fe, fetch: () => $, getMemory: () => z });
var U = new WebAssembly.Instance(W, { "./index_bg.js": w });
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
function T() {
  return (j === null || j.byteLength === 0) && (j = new Uint8Array(c.memory.buffer)), j;
}
var H = typeof TextEncoder > "u" ? (0, module.require)("util").TextEncoder : TextEncoder;
var v = new H("utf-8");
var J = typeof v.encodeInto == "function" ? function(e, t) {
  return v.encodeInto(e, t);
} : function(e, t) {
  let n = v.encode(e);
  return t.set(n), { read: e.length, written: n.length };
};
function h(e, t, n) {
  if (n === void 0) {
    let a = v.encode(e), y = t(a.length) >>> 0;
    return T().subarray(y, y + a.length).set(a), x = a.length, y;
  }
  let _ = e.length, s = t(_) >>> 0, b = T(), f = 0;
  for (; f < _; f++) {
    let a = e.charCodeAt(f);
    if (a > 127)
      break;
    b[s + f] = a;
  }
  if (f !== _) {
    f !== 0 && (e = e.slice(f)), s = n(s, _, _ = f + e.length * 3) >>> 0;
    let a = T().subarray(s + f, s + _), y = J(e, a);
    f += y.written;
  }
  return x = f, s;
}
function g(e) {
  return e == null;
}
var A = null;
function i() {
  return (A === null || A.byteLength === 0) && (A = new Int32Array(c.memory.buffer)), A;
}
var P = typeof TextDecoder > "u" ? (0, module.require)("util").TextDecoder : TextDecoder;
var B = new P("utf-8", { ignoreBOM: true, fatal: true });
B.decode();
function p(e, t) {
  return e = e >>> 0, B.decode(T().subarray(e, e + t));
}
var m = l.length;
function o(e) {
  m === l.length && l.push(l.length + 1);
  let t = m;
  return m = l[t], l[t] = e, t;
}
function V(e) {
  e < 132 || (l[e] = m, m = e);
}
function d(e) {
  let t = r(e);
  return V(e), t;
}
var k = null;
function K() {
  return (k === null || k.byteLength === 0) && (k = new BigInt64Array(c.memory.buffer)), k;
}
var M = null;
function X() {
  return (M === null || M.byteLength === 0) && (M = new Float64Array(c.memory.buffer)), M;
}
function E(e) {
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
    s > 0 && (b += E(e[0]));
    for (let f = 1; f < s; f++)
      b += ", " + E(e[f]);
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
function Y(e, t, n, _) {
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
function Z(e, t, n) {
  c.__wbindgen_export_3(e, t, o(n));
}
function $(e, t, n) {
  let _ = c.fetch(o(e), o(t), o(n));
  return d(_);
}
function u(e, t) {
  try {
    return e.apply(this, t);
  } catch (n) {
    c.__wbindgen_export_4(o(n));
  }
}
function G(e, t, n, _) {
  c.__wbindgen_export_5(e, t, o(n), o(_));
}
var Q = Object.freeze({ Off: 0, 0: "Off", Lossy: 1, 1: "Lossy", Lossless: 2, 2: "Lossless" });
var tt = Object.freeze({ Error: 0, 0: "Error", Follow: 1, 1: "Follow", Manual: 2, 2: "Manual" });
var O = class {
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
      var _ = i()[b / 4 + 0], s = i()[b / 4 + 1];
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
var q = class {
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
var S = class {
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
var L = class {
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
var C = class {
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
var F = class {
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
var I = class {
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
      var t = i()[_ / 4 + 0], n = i()[_ / 4 + 1];
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
      var t = i()[_ / 4 + 0], n = i()[_ / 4 + 1];
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
      var t = i()[_ / 4 + 0], n = i()[_ / 4 + 1];
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
function et(e, t) {
  let n = r(t).method, _ = h(n, c.__wbindgen_export_0, c.__wbindgen_export_1), s = x;
  i()[e / 4 + 1] = s, i()[e / 4 + 0] = _;
}
function nt(e, t) {
  let n = r(t).url, _ = h(n, c.__wbindgen_export_0, c.__wbindgen_export_1), s = x;
  i()[e / 4 + 1] = s, i()[e / 4 + 0] = _;
}
function rt(e) {
  let t = r(e).headers;
  return o(t);
}
function _t(e) {
  let t = r(e).cf;
  return g(t) ? 0 : o(t);
}
function ot(e, t) {
  let n = r(t), _ = typeof n == "string" ? n : void 0;
  var s = g(_) ? 0 : h(_, c.__wbindgen_export_0, c.__wbindgen_export_1), b = x;
  i()[e / 4 + 1] = b, i()[e / 4 + 0] = s;
}
function ct(e, t) {
  let n = p(e, t);
  return o(n);
}
function st() {
  return u(function(e, t) {
    let n = Reflect.get(r(e), r(t));
    return o(n);
  }, arguments);
}
function it(e) {
  d(e);
}
function ut(e) {
  return r(e) === void 0;
}
function ft(e) {
  let t = r(e).constructor;
  return o(t);
}
function bt(e) {
  let t = r(e).name;
  return o(t);
}
function at() {
  return u(function() {
    let e = new Headers();
    return o(e);
  }, arguments);
}
function gt() {
  return u(function(e, t, n) {
    let _ = new Response(e === 0 ? void 0 : p(e, t), r(n));
    return o(_);
  }, arguments);
}
function pt(e) {
  let t = new Uint8Array(e >>> 0);
  return o(t);
}
function dt() {
  return u(function(e, t) {
    let n = new Response(r(e), r(t));
    return o(n);
  }, arguments);
}
function wt() {
  return u(function(e, t) {
    let n = new Response(r(e), r(t));
    return o(n);
  }, arguments);
}
function lt() {
  return u(function(e, t, n) {
    let _ = r(e).call(r(t), r(n));
    return o(_);
  }, arguments);
}
function xt(e) {
  r(e).abort();
}
function ht(e) {
  let t = d(e).original;
  return t.cnt-- == 1 ? (t.a = 0, true) : false;
}
function yt(e, t) {
  let n = new Error(p(e, t));
  return o(n);
}
function mt(e) {
  let t;
  try {
    t = r(e) instanceof Error;
  } catch {
    t = false;
  }
  return t;
}
function jt(e) {
  let t = r(e).message;
  return o(t);
}
function At() {
  return u(function(e, t, n, _, s) {
    r(e).set(p(t, n), p(_, s));
  }, arguments);
}
function kt() {
  let e = new Object();
  return o(e);
}
function Mt() {
  return u(function(e, t, n) {
    return Reflect.set(r(e), r(t), r(n));
  }, arguments);
}
function Tt() {
  return u(function(e, t, n, _, s) {
    r(e).append(p(t, n), p(_, s));
  }, arguments);
}
function vt() {
  return u(function() {
    let e = new AbortController();
    return o(e);
  }, arguments);
}
function Et(e) {
  let t = r(e).signal;
  return o(t);
}
function Ot(e) {
  let t;
  try {
    t = r(e) instanceof Response;
  } catch {
    t = false;
  }
  return t;
}
function qt(e) {
  return r(e).status;
}
function St(e, t) {
  let n = r(t).url, _ = h(n, c.__wbindgen_export_0, c.__wbindgen_export_1), s = x;
  i()[e / 4 + 1] = s, i()[e / 4 + 0] = _;
}
function Lt(e) {
  let t = r(e).headers;
  return o(t);
}
function Ct() {
  return o(Symbol.iterator);
}
function Ft(e) {
  return typeof r(e) == "function";
}
function It() {
  return u(function(e, t) {
    let n = r(e).call(r(t));
    return o(n);
  }, arguments);
}
function Rt(e) {
  let t = r(e);
  return typeof t == "object" && t !== null;
}
function $t(e) {
  let t = r(e).next;
  return o(t);
}
function Bt() {
  return u(function(e) {
    let t = r(e).next();
    return o(t);
  }, arguments);
}
function Dt(e) {
  return r(e).done;
}
function Nt(e) {
  let t = r(e).value;
  return o(t);
}
function Wt() {
  return u(function(e) {
    let t = JSON.stringify(r(e));
    return o(t);
  }, arguments);
}
function Ut() {
  return u(function(e) {
    let t = r(e).text();
    return o(t);
  }, arguments);
}
function zt(e) {
  console.log(r(e));
}
function Ht(e, t, n) {
  let _ = r(e).prepare(p(t, n));
  return o(_);
}
function Jt() {
  let e = new Array();
  return o(e);
}
function Pt(e, t) {
  return r(e).push(r(t));
}
function Vt(e, t) {
  let n = r(e).batch(d(t));
  return o(n);
}
function Kt(e) {
  return Array.isArray(r(e));
}
function Xt(e) {
  return r(e).length;
}
function Yt(e, t) {
  let n = r(e)[t >>> 0];
  return o(n);
}
function Zt(e, t) {
  let n = r(t).error;
  var _ = g(n) ? 0 : h(n, c.__wbindgen_export_0, c.__wbindgen_export_1), s = x;
  i()[e / 4 + 1] = s, i()[e / 4 + 0] = _;
}
function Gt() {
  return u(function(e) {
    let t = r(e).json();
    return o(t);
  }, arguments);
}
function Qt(e, t) {
  let n = r(e)[r(t)];
  return o(n);
}
function te(e, t) {
  return r(e) in r(t);
}
function ee(e) {
  let t = r(e).all();
  return o(t);
}
function ne(e) {
  let t = r(e).results;
  return g(t) ? 0 : o(t);
}
function re() {
  return o(/* @__PURE__ */ new Date());
}
function _e(e) {
  return r(e).getTime();
}
function oe(e) {
  let t = r(e).run();
  return o(t);
}
function ce(e) {
  return typeof r(e) == "bigint";
}
function se(e, t) {
  let n = r(t), _ = typeof n == "bigint" ? n : void 0;
  K()[e / 8 + 1] = g(_) ? BigInt(0) : _, i()[e / 4 + 0] = !g(_);
}
function ie(e) {
  return o(e);
}
function ue(e, t) {
  return r(e) === r(t);
}
function fe(e, t) {
  let n = r(t), _ = typeof n == "number" ? n : void 0;
  X()[e / 8 + 1] = g(_) ? 0 : _, i()[e / 4 + 0] = !g(_);
}
function be(e) {
  return Number.isSafeInteger(r(e));
}
function ae(e) {
  return o(e);
}
function ge(e, t) {
  try {
    var n = { a: e, b: t }, _ = (b, f) => {
      let a = n.a;
      n.a = 0;
      try {
        return G(a, n.b, b, f);
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
function pe(e) {
  return r(e).length;
}
function de() {
  let e = c.memory;
  return o(e);
}
function we(e) {
  let t = r(e).buffer;
  return o(t);
}
function le(e, t, n) {
  let _ = new Uint8Array(r(e), t >>> 0, n >>> 0);
  return o(_);
}
function xe(e, t, n) {
  r(e).set(r(t), n >>> 0);
}
function he(e) {
  let t = new Uint8Array(r(e));
  return o(t);
}
function ye(e) {
  let t = r(e);
  return o(t);
}
function me() {
  return u(function() {
    let e = self.self;
    return o(e);
  }, arguments);
}
function je() {
  return u(function() {
    let e = window.window;
    return o(e);
  }, arguments);
}
function Ae() {
  return u(function() {
    let e = globalThis.globalThis;
    return o(e);
  }, arguments);
}
function ke() {
  return u(function() {
    let e = global.global;
    return o(e);
  }, arguments);
}
function Me(e, t) {
  let n = new Function(p(e, t));
  return o(n);
}
function Te() {
  return u(function(e, t) {
    return Reflect.has(r(e), r(t));
  }, arguments);
}
function ve(e, t) {
  let n = r(e).fetch(r(t));
  return o(n);
}
function Ee(e) {
  let t = fetch(r(e));
  return o(t);
}
function Oe(e, t) {
  return r(e) == r(t);
}
function qe(e) {
  let t = r(e);
  return typeof t == "boolean" ? t ? 1 : 0 : 2;
}
function Se(e) {
  let t;
  try {
    t = r(e) instanceof Uint8Array;
  } catch {
    t = false;
  }
  return t;
}
function Le(e) {
  let t;
  try {
    t = r(e) instanceof ArrayBuffer;
  } catch {
    t = false;
  }
  return t;
}
function Ce(e, t) {
  let n = E(r(t)), _ = h(n, c.__wbindgen_export_0, c.__wbindgen_export_1), s = x;
  i()[e / 4 + 1] = s, i()[e / 4 + 0] = _;
}
function Fe(e, t) {
  throw new Error(p(e, t));
}
function Ie(e, t, n) {
  let _ = r(e).then(r(t), r(n));
  return o(_);
}
function Re(e) {
  let t = Promise.resolve(r(e));
  return o(t);
}
function $e(e, t) {
  let n = r(e).then(r(t));
  return o(n);
}
function Be(e) {
  let t = r(e).byobRequest;
  return g(t) ? 0 : o(t);
}
function De(e, t) {
  r(e).respond(t >>> 0);
}
function Ne(e) {
  let t = r(e).view;
  return g(t) ? 0 : o(t);
}
function We(e) {
  return r(e).byteLength;
}
function Ue(e) {
  r(e).close();
}
function ze(e, t) {
  let n = new Error(p(e, t));
  return o(n);
}
function He(e) {
  let t = r(e).buffer;
  return o(t);
}
function Je(e) {
  return r(e).byteOffset;
}
function Pe(e) {
  r(e).close();
}
function Ve(e, t) {
  r(e).enqueue(r(t));
}
function Ke() {
  return u(function(e, t, n) {
    let _ = new Request(p(e, t), r(n));
    return o(_);
  }, arguments);
}
function Xe(e) {
  console.error(r(e));
}
function Ye(e) {
  let t = r(e).toString();
  return o(t);
}
function Ze(e) {
  let t = r(e).cause;
  return o(t);
}
function Ge() {
  return u(function(e, t) {
    let n = r(e).bind(...d(t));
    return o(n);
  }, arguments);
}
function Qe(e, t, n) {
  let _ = Y(e, t, 72, Z);
  return o(_);
}
var cn = { fetch: $, scheduled: void 0, queue: void 0 };
export {
  O as IntoUnderlyingByteSource,
  q as IntoUnderlyingSink,
  S as IntoUnderlyingSource,
  L as MinifyConfig,
  C as PipeOptions,
  Q as PolishConfig,
  F as QueuingStrategy,
  I as R2Range,
  R as ReadableStreamGetReaderOptions,
  tt as RequestRedirect,
  xt as __wbg_abort_de75e4ab5136bcee,
  ee as __wbg_all_2b78e889ce8a546b,
  Tt as __wbg_append_fac652007989b765,
  Vt as __wbg_batch_2e5aca6f93be5ee8,
  Ge as __wbg_bind_01b74990dad5c1f3,
  He as __wbg_buffer_4e79326814bdd393,
  we as __wbg_buffer_55ba7a6b1b92e2ac,
  Be as __wbg_byobRequest_08c18cee35def1f4,
  We as __wbg_byteLength_5299848ed3264181,
  Je as __wbg_byteOffset_b69b0a07afccce19,
  It as __wbg_call_557a2f2deacc4912,
  lt as __wbg_call_587b30eea3e09332,
  Ze as __wbg_cause_52959bcad93f9e0f,
  _t as __wbg_cf_703652f0d2c5b8d1,
  Ue as __wbg_close_da7e6fb9d9851e5a,
  Pe as __wbg_close_e9110ca16e2567db,
  ft as __wbg_constructor_f2623999a1f453eb,
  Dt as __wbg_done_b6abb27d42b63867,
  Ve as __wbg_enqueue_d71a1a518e21f5c3,
  Xe as __wbg_error_a7e23606158b68b9,
  Zt as __wbg_error_f673cd9e40bac8a7,
  ve as __wbg_fetch_621998933558ad27,
  Ee as __wbg_fetch_6a2624d7f767e331,
  _e as __wbg_getTime_40bd09e020e8bc8c,
  Yt as __wbg_get_7303ed2ef026b2f5,
  st as __wbg_get_f53c921291c381bd,
  Qt as __wbg_getwithrefkey_5e6d9547403deab8,
  Ae as __wbg_globalThis_b70c095388441f2d,
  ke as __wbg_global_1c72617491ed7194,
  Te as __wbg_has_40b8c976775c8ead,
  rt as __wbg_headers_1eff4f53324496e6,
  Lt as __wbg_headers_2de03c88f895093b,
  Le as __wbg_instanceof_ArrayBuffer_ef2632aa0d4bfff8,
  mt as __wbg_instanceof_Error_fac23a8832b241da,
  Ot as __wbg_instanceof_Response_7ade9a5a066d1a55,
  Se as __wbg_instanceof_Uint8Array_1349640af2da2e88,
  Kt as __wbg_isArray_04e59fb73f78ab5b,
  be as __wbg_isSafeInteger_2088b01008075470,
  Ct as __wbg_iterator_7c7e58f62eb84700,
  Gt as __wbg_json_682f3a71d443960d,
  pe as __wbg_length_0aab7ffd65ad19ed,
  Xt as __wbg_length_820c786973abdd8a,
  zt as __wbg_log_dc06ec929fc95a20,
  jt as __wbg_message_eab7d45ec69a2135,
  et as __wbg_method_e15eb9cf1c32cdbb,
  bt as __wbg_name_2a8bae31363c6a51,
  re as __wbg_new0_494c19a27871d56f,
  Jt as __wbg_new_0394642eae39db16,
  he as __wbg_new_09938a7d020f049b,
  at as __wbg_new_143b41b4342650bb,
  ge as __wbg_new_2b55e405e4af4986,
  kt as __wbg_new_2b6fea4ea03b1b95,
  vt as __wbg_new_668956ac1089f8cf,
  ze as __wbg_new_87297f22973157c8,
  Me as __wbg_newnoargs_c9e6043b8ad84109,
  le as __wbg_newwithbyteoffsetandlength_88d1d8be5df94b9b,
  pt as __wbg_newwithlength_89eeca401d8918c2,
  dt as __wbg_newwithoptbuffersourceandinit_6c49960a834dd7cf,
  wt as __wbg_newwithoptreadablestreamandinit_d238e5b972c7b57f,
  gt as __wbg_newwithoptstrandinit_ff70839f3334d3aa,
  Ke as __wbg_newwithstrandinit_a4cd16dfaafcf625,
  Bt as __wbg_next_ec061e48a0e72a96,
  $t as __wbg_next_f4bc0e96ea67da68,
  Ht as __wbg_prepare_545a7ed280576b99,
  Pt as __wbg_push_109cfc26d02582dd,
  Re as __wbg_resolve_ae38ad63c43ff98b,
  De as __wbg_respond_8fadc5f5c9d95422,
  ne as __wbg_results_c7ad1ae0ae681ab4,
  oe as __wbg_run_5e881e547261fe1f,
  me as __wbg_self_742dd6eab3e9211e,
  Mt as __wbg_set_07da13cc24b69217,
  xe as __wbg_set_3698e3ca519b3c3c,
  At as __wbg_set_76353df4722f4954,
  Et as __wbg_signal_bcb55e86063f8860,
  qt as __wbg_status_d2b2d0889f7e970f,
  Wt as __wbg_stringify_d06ad2addc54d51e,
  Ut as __wbg_text_65fa1887e8f7b4ac,
  Ie as __wbg_then_835b073a479138e5,
  $e as __wbg_then_8df675b8bb5d5e3c,
  Ye as __wbg_toString_506566b763774a16,
  nt as __wbg_url_3325e0ef088003ca,
  St as __wbg_url_59cb32ef6a837521,
  Nt as __wbg_value_2f4ef2036bfad28e,
  Ne as __wbg_view_231340b0dd8a2484,
  je as __wbg_window_c409e731db53a0e2,
  ie as __wbindgen_bigint_from_i64,
  se as __wbindgen_bigint_get_as_i64,
  qe as __wbindgen_boolean_get,
  ht as __wbindgen_cb_drop,
  Qe as __wbindgen_closure_wrapper1140,
  Ce as __wbindgen_debug_string,
  yt as __wbindgen_error_new,
  te as __wbindgen_in,
  ce as __wbindgen_is_bigint,
  Ft as __wbindgen_is_function,
  Rt as __wbindgen_is_object,
  ut as __wbindgen_is_undefined,
  ue as __wbindgen_jsval_eq,
  Oe as __wbindgen_jsval_loose_eq,
  de as __wbindgen_memory,
  fe as __wbindgen_number_get,
  ae as __wbindgen_number_new,
  ye as __wbindgen_object_clone_ref,
  it as __wbindgen_object_drop_ref,
  ot as __wbindgen_string_get,
  ct as __wbindgen_string_new,
  Fe as __wbindgen_throw,
  cn as default,
  $ as fetch,
  z as getMemory,
  on as wasmModule
};
//# sourceMappingURL=shim.js.map
