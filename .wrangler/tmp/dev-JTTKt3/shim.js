// .wrangler/tmp/bundle-bi5Q8T/checked-fetch.js
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
import W from "./f084aea1a045614af673ba3f9ae09fcd806d188f-index.wasm";
import rn from "./f084aea1a045614af673ba3f9ae09fcd806d188f-index.wasm";
var D = Object.defineProperty;
var N = (e, t) => {
  for (var n in t)
    D(e, n, { get: t[n], enumerable: true });
};
var w = {};
N(w, { IntoUnderlyingByteSource: () => O, IntoUnderlyingSink: () => q, IntoUnderlyingSource: () => S, MinifyConfig: () => L, PipeOptions: () => C, PolishConfig: () => Q, QueuingStrategy: () => F, R2Range: () => I, ReadableStreamGetReaderOptions: () => R, RequestRedirect: () => tt, __wbg_abort_de75e4ab5136bcee: () => ht, __wbg_all_2b78e889ce8a546b: () => re, __wbg_append_fac652007989b765: () => Ft, __wbg_bind_01b74990dad5c1f3: () => Ye, __wbg_buffer_4e79326814bdd393: () => We, __wbg_buffer_55ba7a6b1b92e2ac: () => ae, __wbg_byobRequest_08c18cee35def1f4: () => Ie, __wbg_byteLength_5299848ed3264181: () => Be, __wbg_byteOffset_b69b0a07afccce19: () => Ue, __wbg_call_557a2f2deacc4912: () => zt, __wbg_call_587b30eea3e09332: () => lt, __wbg_cause_52959bcad93f9e0f: () => xt, __wbg_cf_703652f0d2c5b8d1: () => _t, __wbg_close_da7e6fb9d9851e5a: () => De, __wbg_close_e9110ca16e2567db: () => ze, __wbg_constructor_f2623999a1f453eb: () => ft, __wbg_done_b6abb27d42b63867: () => Vt, __wbg_enqueue_d71a1a518e21f5c3: () => He, __wbg_error_a7e23606158b68b9: () => Pe, __wbg_error_f673cd9e40bac8a7: () => ue, __wbg_fetch_621998933558ad27: () => ke, __wbg_fetch_6a2624d7f767e331: () => Me, __wbg_getTime_40bd09e020e8bc8c: () => ie, __wbg_get_7303ed2ef026b2f5: () => ce, __wbg_get_f53c921291c381bd: () => st, __wbg_getwithrefkey_5e6d9547403deab8: () => Qt, __wbg_globalThis_b70c095388441f2d: () => ye, __wbg_global_1c72617491ed7194: () => me, __wbg_has_40b8c976775c8ead: () => Ae, __wbg_headers_1eff4f53324496e6: () => rt, __wbg_headers_2de03c88f895093b: () => Nt, __wbg_instanceof_ArrayBuffer_ef2632aa0d4bfff8: () => Oe, __wbg_instanceof_Error_fac23a8832b241da: () => Ot, __wbg_instanceof_Response_7ade9a5a066d1a55: () => $t, __wbg_instanceof_Uint8Array_1349640af2da2e88: () => Ee, __wbg_isSafeInteger_2088b01008075470: () => Tt, __wbg_iterator_7c7e58f62eb84700: () => Wt, __wbg_json_682f3a71d443960d: () => Gt, __wbg_length_0aab7ffd65ad19ed: () => be, __wbg_length_820c786973abdd8a: () => oe, __wbg_log_dc06ec929fc95a20: () => Zt, __wbg_message_eab7d45ec69a2135: () => qt, __wbg_method_e15eb9cf1c32cdbb: () => et, __wbg_name_2a8bae31363c6a51: () => bt, __wbg_new0_494c19a27871d56f: () => se, __wbg_new_0394642eae39db16: () => Ke, __wbg_new_09938a7d020f049b: () => we, __wbg_new_143b41b4342650bb: () => gt, __wbg_new_2b55e405e4af4986: () => fe, __wbg_new_2b6fea4ea03b1b95: () => Lt, __wbg_new_668956ac1089f8cf: () => It, __wbg_new_87297f22973157c8: () => Ne, __wbg_newnoargs_c9e6043b8ad84109: () => je, __wbg_newwithbyteoffsetandlength_88d1d8be5df94b9b: () => pe, __wbg_newwithlength_89eeca401d8918c2: () => pt, __wbg_newwithoptbuffersourceandinit_6c49960a834dd7cf: () => dt, __wbg_newwithoptreadablestreamandinit_d238e5b972c7b57f: () => wt, __wbg_newwithoptstrandinit_ff70839f3334d3aa: () => at, __wbg_newwithstrandinit_a4cd16dfaafcf625: () => Je, __wbg_next_ec061e48a0e72a96: () => Pt, __wbg_next_f4bc0e96ea67da68: () => Jt, __wbg_prepare_545a7ed280576b99: () => ee, __wbg_push_109cfc26d02582dd: () => Xe, __wbg_resolve_ae38ad63c43ff98b: () => Ce, __wbg_respond_8fadc5f5c9d95422: () => Re, __wbg_results_c7ad1ae0ae681ab4: () => _e, __wbg_run_5e881e547261fe1f: () => Et, __wbg_self_742dd6eab3e9211e: () => xe, __wbg_set_07da13cc24b69217: () => Ct, __wbg_set_3698e3ca519b3c3c: () => de, __wbg_set_76353df4722f4954: () => St, __wbg_signal_bcb55e86063f8860: () => Rt, __wbg_status_d2b2d0889f7e970f: () => Bt, __wbg_stringify_d06ad2addc54d51e: () => Xt, __wbg_text_65fa1887e8f7b4ac: () => Yt, __wbg_then_835b073a479138e5: () => Le, __wbg_then_8df675b8bb5d5e3c: () => Fe, __wbg_toString_506566b763774a16: () => Ve, __wbg_url_3325e0ef088003ca: () => nt, __wbg_url_59cb32ef6a837521: () => Dt, __wbg_value_2f4ef2036bfad28e: () => Kt, __wbg_view_231340b0dd8a2484: () => $e, __wbg_window_c409e731db53a0e2: () => he, __wbindgen_bigint_from_i64: () => At, __wbindgen_bigint_get_as_i64: () => jt, __wbindgen_boolean_get: () => ve, __wbindgen_cb_drop: () => yt, __wbindgen_closure_wrapper1208: () => Ze, __wbindgen_debug_string: () => qe, __wbindgen_error_new: () => vt, __wbindgen_in: () => te, __wbindgen_is_bigint: () => mt, __wbindgen_is_function: () => Ut, __wbindgen_is_object: () => Ht, __wbindgen_is_undefined: () => ut, __wbindgen_jsval_eq: () => kt, __wbindgen_jsval_loose_eq: () => Te, __wbindgen_memory: () => ge, __wbindgen_number_get: () => Mt, __wbindgen_number_new: () => ne, __wbindgen_object_clone_ref: () => le, __wbindgen_object_drop_ref: () => it, __wbindgen_string_get: () => ot, __wbindgen_string_new: () => ct, __wbindgen_throw: () => Se, fetch: () => $, getMemory: () => z });
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
    let g = v.encode(e), y = t(g.length) >>> 0;
    return T().subarray(y, y + g.length).set(g), x = g.length, y;
  }
  let _ = e.length, s = t(_) >>> 0, b = T(), f = 0;
  for (; f < _; f++) {
    let g = e.charCodeAt(f);
    if (g > 127)
      break;
    b[s + f] = g;
  }
  if (f !== _) {
    f !== 0 && (e = e.slice(f)), s = n(s, _, _ = f + e.length * 3) >>> 0;
    let g = T().subarray(s + f, s + _), y = J(e, g);
    f += y.written;
  }
  return x = f, s;
}
function a(e) {
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
    let g = s.a;
    s.a = 0;
    try {
      return _(g, s.b, ...f);
    } finally {
      --s.cnt === 0 ? c.__wbindgen_export_2.get(s.dtor)(g, s.b) : s.a = g;
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
    c.__wbg_set_r2range_offset(this.__wbg_ptr, !a(t), a(t) ? 0 : t);
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
    c.__wbg_set_r2range_length(this.__wbg_ptr, !a(t), a(t) ? 0 : t);
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
    c.__wbg_set_r2range_suffix(this.__wbg_ptr, !a(t), a(t) ? 0 : t);
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
  return a(t) ? 0 : o(t);
}
function ot(e, t) {
  let n = r(t), _ = typeof n == "string" ? n : void 0;
  var s = a(_) ? 0 : h(_, c.__wbindgen_export_0, c.__wbindgen_export_1), b = x;
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
function gt() {
  return u(function() {
    let e = new Headers();
    return o(e);
  }, arguments);
}
function at() {
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
  let t = r(e).cause;
  return o(t);
}
function ht(e) {
  r(e).abort();
}
function yt(e) {
  let t = d(e).original;
  return t.cnt-- == 1 ? (t.a = 0, true) : false;
}
function mt(e) {
  return typeof r(e) == "bigint";
}
function jt(e, t) {
  let n = r(t), _ = typeof n == "bigint" ? n : void 0;
  K()[e / 8 + 1] = a(_) ? BigInt(0) : _, i()[e / 4 + 0] = !a(_);
}
function At(e) {
  return o(e);
}
function kt(e, t) {
  return r(e) === r(t);
}
function Mt(e, t) {
  let n = r(t), _ = typeof n == "number" ? n : void 0;
  X()[e / 8 + 1] = a(_) ? 0 : _, i()[e / 4 + 0] = !a(_);
}
function Tt(e) {
  return Number.isSafeInteger(r(e));
}
function vt(e, t) {
  let n = new Error(p(e, t));
  return o(n);
}
function Et(e) {
  let t = r(e).run();
  return o(t);
}
function Ot(e) {
  let t;
  try {
    t = r(e) instanceof Error;
  } catch {
    t = false;
  }
  return t;
}
function qt(e) {
  let t = r(e).message;
  return o(t);
}
function St() {
  return u(function(e, t, n, _, s) {
    r(e).set(p(t, n), p(_, s));
  }, arguments);
}
function Lt() {
  let e = new Object();
  return o(e);
}
function Ct() {
  return u(function(e, t, n) {
    return Reflect.set(r(e), r(t), r(n));
  }, arguments);
}
function Ft() {
  return u(function(e, t, n, _, s) {
    r(e).append(p(t, n), p(_, s));
  }, arguments);
}
function It() {
  return u(function() {
    let e = new AbortController();
    return o(e);
  }, arguments);
}
function Rt(e) {
  let t = r(e).signal;
  return o(t);
}
function $t(e) {
  let t;
  try {
    t = r(e) instanceof Response;
  } catch {
    t = false;
  }
  return t;
}
function Bt(e) {
  return r(e).status;
}
function Dt(e, t) {
  let n = r(t).url, _ = h(n, c.__wbindgen_export_0, c.__wbindgen_export_1), s = x;
  i()[e / 4 + 1] = s, i()[e / 4 + 0] = _;
}
function Nt(e) {
  let t = r(e).headers;
  return o(t);
}
function Wt() {
  return o(Symbol.iterator);
}
function Ut(e) {
  return typeof r(e) == "function";
}
function zt() {
  return u(function(e, t) {
    let n = r(e).call(r(t));
    return o(n);
  }, arguments);
}
function Ht(e) {
  let t = r(e);
  return typeof t == "object" && t !== null;
}
function Jt(e) {
  let t = r(e).next;
  return o(t);
}
function Pt() {
  return u(function(e) {
    let t = r(e).next();
    return o(t);
  }, arguments);
}
function Vt(e) {
  return r(e).done;
}
function Kt(e) {
  let t = r(e).value;
  return o(t);
}
function Xt() {
  return u(function(e) {
    let t = JSON.stringify(r(e));
    return o(t);
  }, arguments);
}
function Yt() {
  return u(function(e) {
    let t = r(e).text();
    return o(t);
  }, arguments);
}
function Zt(e) {
  console.log(r(e));
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
function ee(e, t, n) {
  let _ = r(e).prepare(p(t, n));
  return o(_);
}
function ne(e) {
  return o(e);
}
function re(e) {
  let t = r(e).all();
  return o(t);
}
function _e(e) {
  let t = r(e).results;
  return a(t) ? 0 : o(t);
}
function oe(e) {
  return r(e).length;
}
function ce(e, t) {
  let n = r(e)[t >>> 0];
  return o(n);
}
function se() {
  return o(/* @__PURE__ */ new Date());
}
function ie(e) {
  return r(e).getTime();
}
function ue(e, t) {
  let n = r(t).error;
  var _ = a(n) ? 0 : h(n, c.__wbindgen_export_0, c.__wbindgen_export_1), s = x;
  i()[e / 4 + 1] = s, i()[e / 4 + 0] = _;
}
function fe(e, t) {
  try {
    var n = { a: e, b: t }, _ = (b, f) => {
      let g = n.a;
      n.a = 0;
      try {
        return G(g, n.b, b, f);
      } finally {
        n.a = g;
      }
    };
    let s = new Promise(_);
    return o(s);
  } finally {
    n.a = n.b = 0;
  }
}
function be(e) {
  return r(e).length;
}
function ge() {
  let e = c.memory;
  return o(e);
}
function ae(e) {
  let t = r(e).buffer;
  return o(t);
}
function pe(e, t, n) {
  let _ = new Uint8Array(r(e), t >>> 0, n >>> 0);
  return o(_);
}
function de(e, t, n) {
  r(e).set(r(t), n >>> 0);
}
function we(e) {
  let t = new Uint8Array(r(e));
  return o(t);
}
function le(e) {
  let t = r(e);
  return o(t);
}
function xe() {
  return u(function() {
    let e = self.self;
    return o(e);
  }, arguments);
}
function he() {
  return u(function() {
    let e = window.window;
    return o(e);
  }, arguments);
}
function ye() {
  return u(function() {
    let e = globalThis.globalThis;
    return o(e);
  }, arguments);
}
function me() {
  return u(function() {
    let e = global.global;
    return o(e);
  }, arguments);
}
function je(e, t) {
  let n = new Function(p(e, t));
  return o(n);
}
function Ae() {
  return u(function(e, t) {
    return Reflect.has(r(e), r(t));
  }, arguments);
}
function ke(e, t) {
  let n = r(e).fetch(r(t));
  return o(n);
}
function Me(e) {
  let t = fetch(r(e));
  return o(t);
}
function Te(e, t) {
  return r(e) == r(t);
}
function ve(e) {
  let t = r(e);
  return typeof t == "boolean" ? t ? 1 : 0 : 2;
}
function Ee(e) {
  let t;
  try {
    t = r(e) instanceof Uint8Array;
  } catch {
    t = false;
  }
  return t;
}
function Oe(e) {
  let t;
  try {
    t = r(e) instanceof ArrayBuffer;
  } catch {
    t = false;
  }
  return t;
}
function qe(e, t) {
  let n = E(r(t)), _ = h(n, c.__wbindgen_export_0, c.__wbindgen_export_1), s = x;
  i()[e / 4 + 1] = s, i()[e / 4 + 0] = _;
}
function Se(e, t) {
  throw new Error(p(e, t));
}
function Le(e, t, n) {
  let _ = r(e).then(r(t), r(n));
  return o(_);
}
function Ce(e) {
  let t = Promise.resolve(r(e));
  return o(t);
}
function Fe(e, t) {
  let n = r(e).then(r(t));
  return o(n);
}
function Ie(e) {
  let t = r(e).byobRequest;
  return a(t) ? 0 : o(t);
}
function Re(e, t) {
  r(e).respond(t >>> 0);
}
function $e(e) {
  let t = r(e).view;
  return a(t) ? 0 : o(t);
}
function Be(e) {
  return r(e).byteLength;
}
function De(e) {
  r(e).close();
}
function Ne(e, t) {
  let n = new Error(p(e, t));
  return o(n);
}
function We(e) {
  let t = r(e).buffer;
  return o(t);
}
function Ue(e) {
  return r(e).byteOffset;
}
function ze(e) {
  r(e).close();
}
function He(e, t) {
  r(e).enqueue(r(t));
}
function Je() {
  return u(function(e, t, n) {
    let _ = new Request(p(e, t), r(n));
    return o(_);
  }, arguments);
}
function Pe(e) {
  console.error(r(e));
}
function Ve(e) {
  let t = r(e).toString();
  return o(t);
}
function Ke() {
  let e = new Array();
  return o(e);
}
function Xe(e, t) {
  return r(e).push(r(t));
}
function Ye() {
  return u(function(e, t) {
    let n = r(e).bind(...d(t));
    return o(n);
  }, arguments);
}
function Ze(e, t, n) {
  let _ = Y(e, t, 103, Z);
  return o(_);
}
var _n = { fetch: $, scheduled: void 0, queue: void 0 };
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
  ht as __wbg_abort_de75e4ab5136bcee,
  re as __wbg_all_2b78e889ce8a546b,
  Ft as __wbg_append_fac652007989b765,
  Ye as __wbg_bind_01b74990dad5c1f3,
  We as __wbg_buffer_4e79326814bdd393,
  ae as __wbg_buffer_55ba7a6b1b92e2ac,
  Ie as __wbg_byobRequest_08c18cee35def1f4,
  Be as __wbg_byteLength_5299848ed3264181,
  Ue as __wbg_byteOffset_b69b0a07afccce19,
  zt as __wbg_call_557a2f2deacc4912,
  lt as __wbg_call_587b30eea3e09332,
  xt as __wbg_cause_52959bcad93f9e0f,
  _t as __wbg_cf_703652f0d2c5b8d1,
  De as __wbg_close_da7e6fb9d9851e5a,
  ze as __wbg_close_e9110ca16e2567db,
  ft as __wbg_constructor_f2623999a1f453eb,
  Vt as __wbg_done_b6abb27d42b63867,
  He as __wbg_enqueue_d71a1a518e21f5c3,
  Pe as __wbg_error_a7e23606158b68b9,
  ue as __wbg_error_f673cd9e40bac8a7,
  ke as __wbg_fetch_621998933558ad27,
  Me as __wbg_fetch_6a2624d7f767e331,
  ie as __wbg_getTime_40bd09e020e8bc8c,
  ce as __wbg_get_7303ed2ef026b2f5,
  st as __wbg_get_f53c921291c381bd,
  Qt as __wbg_getwithrefkey_5e6d9547403deab8,
  ye as __wbg_globalThis_b70c095388441f2d,
  me as __wbg_global_1c72617491ed7194,
  Ae as __wbg_has_40b8c976775c8ead,
  rt as __wbg_headers_1eff4f53324496e6,
  Nt as __wbg_headers_2de03c88f895093b,
  Oe as __wbg_instanceof_ArrayBuffer_ef2632aa0d4bfff8,
  Ot as __wbg_instanceof_Error_fac23a8832b241da,
  $t as __wbg_instanceof_Response_7ade9a5a066d1a55,
  Ee as __wbg_instanceof_Uint8Array_1349640af2da2e88,
  Tt as __wbg_isSafeInteger_2088b01008075470,
  Wt as __wbg_iterator_7c7e58f62eb84700,
  Gt as __wbg_json_682f3a71d443960d,
  be as __wbg_length_0aab7ffd65ad19ed,
  oe as __wbg_length_820c786973abdd8a,
  Zt as __wbg_log_dc06ec929fc95a20,
  qt as __wbg_message_eab7d45ec69a2135,
  et as __wbg_method_e15eb9cf1c32cdbb,
  bt as __wbg_name_2a8bae31363c6a51,
  se as __wbg_new0_494c19a27871d56f,
  Ke as __wbg_new_0394642eae39db16,
  we as __wbg_new_09938a7d020f049b,
  gt as __wbg_new_143b41b4342650bb,
  fe as __wbg_new_2b55e405e4af4986,
  Lt as __wbg_new_2b6fea4ea03b1b95,
  It as __wbg_new_668956ac1089f8cf,
  Ne as __wbg_new_87297f22973157c8,
  je as __wbg_newnoargs_c9e6043b8ad84109,
  pe as __wbg_newwithbyteoffsetandlength_88d1d8be5df94b9b,
  pt as __wbg_newwithlength_89eeca401d8918c2,
  dt as __wbg_newwithoptbuffersourceandinit_6c49960a834dd7cf,
  wt as __wbg_newwithoptreadablestreamandinit_d238e5b972c7b57f,
  at as __wbg_newwithoptstrandinit_ff70839f3334d3aa,
  Je as __wbg_newwithstrandinit_a4cd16dfaafcf625,
  Pt as __wbg_next_ec061e48a0e72a96,
  Jt as __wbg_next_f4bc0e96ea67da68,
  ee as __wbg_prepare_545a7ed280576b99,
  Xe as __wbg_push_109cfc26d02582dd,
  Ce as __wbg_resolve_ae38ad63c43ff98b,
  Re as __wbg_respond_8fadc5f5c9d95422,
  _e as __wbg_results_c7ad1ae0ae681ab4,
  Et as __wbg_run_5e881e547261fe1f,
  xe as __wbg_self_742dd6eab3e9211e,
  Ct as __wbg_set_07da13cc24b69217,
  de as __wbg_set_3698e3ca519b3c3c,
  St as __wbg_set_76353df4722f4954,
  Rt as __wbg_signal_bcb55e86063f8860,
  Bt as __wbg_status_d2b2d0889f7e970f,
  Xt as __wbg_stringify_d06ad2addc54d51e,
  Yt as __wbg_text_65fa1887e8f7b4ac,
  Le as __wbg_then_835b073a479138e5,
  Fe as __wbg_then_8df675b8bb5d5e3c,
  Ve as __wbg_toString_506566b763774a16,
  nt as __wbg_url_3325e0ef088003ca,
  Dt as __wbg_url_59cb32ef6a837521,
  Kt as __wbg_value_2f4ef2036bfad28e,
  $e as __wbg_view_231340b0dd8a2484,
  he as __wbg_window_c409e731db53a0e2,
  At as __wbindgen_bigint_from_i64,
  jt as __wbindgen_bigint_get_as_i64,
  ve as __wbindgen_boolean_get,
  yt as __wbindgen_cb_drop,
  Ze as __wbindgen_closure_wrapper1208,
  qe as __wbindgen_debug_string,
  vt as __wbindgen_error_new,
  te as __wbindgen_in,
  mt as __wbindgen_is_bigint,
  Ut as __wbindgen_is_function,
  Ht as __wbindgen_is_object,
  ut as __wbindgen_is_undefined,
  kt as __wbindgen_jsval_eq,
  Te as __wbindgen_jsval_loose_eq,
  ge as __wbindgen_memory,
  Mt as __wbindgen_number_get,
  ne as __wbindgen_number_new,
  le as __wbindgen_object_clone_ref,
  it as __wbindgen_object_drop_ref,
  ot as __wbindgen_string_get,
  ct as __wbindgen_string_new,
  Se as __wbindgen_throw,
  _n as default,
  $ as fetch,
  z as getMemory,
  rn as wasmModule
};
//# sourceMappingURL=shim.js.map
