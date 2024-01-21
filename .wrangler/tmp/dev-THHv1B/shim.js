// .wrangler/tmp/bundle-0vC0HT/checked-fetch.js
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
import D from "./187dba623c785c6e6ffc7efa67c4bc7ee028e631-index.wasm";
import Be from "./187dba623c785c6e6ffc7efa67c4bc7ee028e631-index.wasm";
var N = Object.defineProperty;
var W = (e, t) => {
  for (var n in t)
    N(e, n, { get: t[n], enumerable: true });
};
var d = {};
W(d, { IntoUnderlyingByteSource: () => T, IntoUnderlyingSink: () => q, IntoUnderlyingSource: () => S, MinifyConfig: () => v, PipeOptions: () => L, PolishConfig: () => Z, QueuingStrategy: () => C, R2Range: () => F, ReadableStreamGetReaderOptions: () => R, RequestRedirect: () => G, __wbg_abort_de75e4ab5136bcee: () => wt, __wbg_all_2b78e889ce8a546b: () => jt, __wbg_append_fac652007989b765: () => Ct, __wbg_buffer_4e79326814bdd393: () => Oe, __wbg_buffer_55ba7a6b1b92e2ac: () => Gt, __wbg_byobRequest_08c18cee35def1f4: () => me, __wbg_byteLength_5299848ed3264181: () => Ae, __wbg_byteOffset_b69b0a07afccce19: () => Te, __wbg_call_557a2f2deacc4912: () => Kt, __wbg_call_587b30eea3e09332: () => dt, __wbg_cause_52959bcad93f9e0f: () => Re, __wbg_cf_703652f0d2c5b8d1: () => nt, __wbg_close_da7e6fb9d9851e5a: () => Ee, __wbg_close_e9110ca16e2567db: () => qe, __wbg_constructor_f2623999a1f453eb: () => it, __wbg_done_b6abb27d42b63867: () => Dt, __wbg_enqueue_d71a1a518e21f5c3: () => Se, __wbg_error_a7e23606158b68b9: () => Le, __wbg_fetch_621998933558ad27: () => ue, __wbg_fetch_6a2624d7f767e331: () => fe, __wbg_get_7303ed2ef026b2f5: () => Et, __wbg_get_f53c921291c381bd: () => ot, __wbg_getwithrefkey_5e6d9547403deab8: () => Ot, __wbg_globalThis_b70c095388441f2d: () => oe, __wbg_global_1c72617491ed7194: () => ce, __wbg_has_40b8c976775c8ead: () => ie, __wbg_headers_1eff4f53324496e6: () => et, __wbg_headers_2de03c88f895093b: () => Nt, __wbg_instanceof_ArrayBuffer_ef2632aa0d4bfff8: () => de, __wbg_instanceof_Error_fac23a8832b241da: () => Ce, __wbg_instanceof_Response_7ade9a5a066d1a55: () => Rt, __wbg_instanceof_Uint8Array_1349640af2da2e88: () => pe, __wbg_isSafeInteger_2088b01008075470: () => St, __wbg_iterator_7c7e58f62eb84700: () => Pt, __wbg_json_682f3a71d443960d: () => Ht, __wbg_length_0aab7ffd65ad19ed: () => Yt, __wbg_length_820c786973abdd8a: () => At, __wbg_log_dc06ec929fc95a20: () => yt, __wbg_method_e15eb9cf1c32cdbb: () => Q, __wbg_name_2a8bae31363c6a51: () => ut, __wbg_new_09938a7d020f049b: () => ee, __wbg_new_143b41b4342650bb: () => ft, __wbg_new_2b55e405e4af4986: () => Jt, __wbg_new_2b6fea4ea03b1b95: () => vt, __wbg_new_668956ac1089f8cf: () => be, __wbg_new_87297f22973157c8: () => Me, __wbg_newnoargs_c9e6043b8ad84109: () => se, __wbg_newwithbyteoffsetandlength_88d1d8be5df94b9b: () => Qt, __wbg_newwithlength_89eeca401d8918c2: () => at, __wbg_newwithoptbuffersourceandinit_6c49960a834dd7cf: () => gt, __wbg_newwithoptreadablestreamandinit_d238e5b972c7b57f: () => pt, __wbg_newwithoptstrandinit_ff70839f3334d3aa: () => bt, __wbg_newwithstrandinit_a4cd16dfaafcf625: () => ve, __wbg_next_ec061e48a0e72a96: () => Wt, __wbg_next_f4bc0e96ea67da68: () => Xt, __wbg_prepare_545a7ed280576b99: () => mt, __wbg_resolve_ae38ad63c43ff98b: () => xe, __wbg_respond_8fadc5f5c9d95422: () => je, __wbg_results_c7ad1ae0ae681ab4: () => kt, __wbg_self_742dd6eab3e9211e: () => re, __wbg_set_07da13cc24b69217: () => Lt, __wbg_set_3698e3ca519b3c3c: () => te, __wbg_set_76353df4722f4954: () => xt, __wbg_signal_bcb55e86063f8860: () => Ft, __wbg_status_d2b2d0889f7e970f: () => $t, __wbg_stringify_d06ad2addc54d51e: () => zt, __wbg_text_65fa1887e8f7b4ac: () => Bt, __wbg_then_835b073a479138e5: () => he, __wbg_then_8df675b8bb5d5e3c: () => ye, __wbg_toString_506566b763774a16: () => Fe, __wbg_url_3325e0ef088003ca: () => tt, __wbg_url_59cb32ef6a837521: () => It, __wbg_value_2f4ef2036bfad28e: () => Ut, __wbg_view_231340b0dd8a2484: () => ke, __wbg_window_c409e731db53a0e2: () => _e, __wbindgen_boolean_get: () => ge, __wbindgen_cb_drop: () => lt, __wbindgen_closure_wrapper1102: () => Ie, __wbindgen_debug_string: () => we, __wbindgen_error_new: () => ht, __wbindgen_in: () => Tt, __wbindgen_is_function: () => Vt, __wbindgen_is_object: () => Mt, __wbindgen_is_undefined: () => st, __wbindgen_jsval_loose_eq: () => ae, __wbindgen_memory: () => Zt, __wbindgen_number_get: () => qt, __wbindgen_number_new: () => $e, __wbindgen_object_clone_ref: () => ne, __wbindgen_object_drop_ref: () => ct, __wbindgen_string_get: () => rt, __wbindgen_string_new: () => _t, __wbindgen_throw: () => le, fetch: () => $, getMemory: () => z });
var U = new WebAssembly.Instance(D, { "./index_bg.js": d });
var c = U.exports;
function z() {
  return c.memory;
}
var l = new Array(128).fill(void 0);
l.push(void 0, null, true, false);
function r(e) {
  return l[e];
}
var h = 0;
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
function m(e, t, n) {
  if (n === void 0) {
    let a = M.encode(e), x = t(a.length) >>> 0;
    return E().subarray(x, x + a.length).set(a), h = a.length, x;
  }
  let _ = e.length, s = t(_) >>> 0, b = E(), u = 0;
  for (; u < _; u++) {
    let a = e.charCodeAt(u);
    if (a > 127)
      break;
    b[s + u] = a;
  }
  if (u !== _) {
    u !== 0 && (e = e.slice(u)), s = n(s, _, _ = u + e.length * 3) >>> 0;
    let a = E().subarray(s + u, s + _), x = H(e, a);
    u += x.written;
  }
  return h = u, s;
}
function g(e) {
  return e == null;
}
var k = null;
function f() {
  return (k === null || k.byteLength === 0) && (k = new Int32Array(c.memory.buffer)), k;
}
var J = typeof TextDecoder > "u" ? (0, module.require)("util").TextDecoder : TextDecoder;
var I = new J("utf-8", { ignoreBOM: true, fatal: true });
I.decode();
function p(e, t) {
  return e = e >>> 0, I.decode(E().subarray(e, e + t));
}
var y = l.length;
function o(e) {
  y === l.length && l.push(l.length + 1);
  let t = y;
  return y = l[t], l[t] = e, t;
}
function P(e) {
  e < 132 || (l[e] = y, y = e);
}
function w(e) {
  let t = r(e);
  return P(e), t;
}
var A = null;
function V() {
  return (A === null || A.byteLength === 0) && (A = new Float64Array(c.memory.buffer)), A;
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
  let s = { a: e, b: t, cnt: 1, dtor: n }, b = (...u) => {
    s.cnt++;
    let a = s.a;
    s.a = 0;
    try {
      return _(a, s.b, ...u);
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
  return w(_);
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
      var _ = f()[b / 4 + 0], s = f()[b / 4 + 1];
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
    return w(n);
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
    return w(n);
  }
  close() {
    let t = this.__destroy_into_raw(), n = c.intounderlyingsink_close(t);
    return w(n);
  }
  abort(t) {
    let n = this.__destroy_into_raw(), _ = c.intounderlyingsink_abort(n, o(t));
    return w(_);
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
    return w(n);
  }
  cancel() {
    let t = this.__destroy_into_raw();
    c.intounderlyingsource_cancel(t);
  }
};
var v = class {
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
    return w(t);
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
      var t = f()[_ / 4 + 0], n = f()[_ / 4 + 1];
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
      var t = f()[_ / 4 + 0], n = f()[_ / 4 + 1];
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
      var t = f()[_ / 4 + 0], n = f()[_ / 4 + 1];
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
    return w(t);
  }
};
function Q(e, t) {
  let n = r(t).method, _ = m(n, c.__wbindgen_export_0, c.__wbindgen_export_1), s = h;
  f()[e / 4 + 1] = s, f()[e / 4 + 0] = _;
}
function tt(e, t) {
  let n = r(t).url, _ = m(n, c.__wbindgen_export_0, c.__wbindgen_export_1), s = h;
  f()[e / 4 + 1] = s, f()[e / 4 + 0] = _;
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
  var s = g(_) ? 0 : m(_, c.__wbindgen_export_0, c.__wbindgen_export_1), b = h;
  f()[e / 4 + 1] = b, f()[e / 4 + 0] = s;
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
  w(e);
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
  let t = w(e).original;
  return t.cnt-- == 1 ? (t.a = 0, true) : false;
}
function ht(e, t) {
  let n = new Error(p(e, t));
  return o(n);
}
function xt() {
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
function kt(e) {
  let t = r(e).results;
  return g(t) ? 0 : o(t);
}
function At(e) {
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
function qt(e, t) {
  let n = r(t), _ = typeof n == "number" ? n : void 0;
  V()[e / 8 + 1] = g(_) ? 0 : _, f()[e / 4 + 0] = !g(_);
}
function St(e) {
  return Number.isSafeInteger(r(e));
}
function vt() {
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
  let n = r(t).url, _ = m(n, c.__wbindgen_export_0, c.__wbindgen_export_1), s = h;
  f()[e / 4 + 1] = s, f()[e / 4 + 0] = _;
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
function Jt(e, t) {
  try {
    var n = { a: e, b: t }, _ = (b, u) => {
      let a = n.a;
      n.a = 0;
      try {
        return Y(a, n.b, b, u);
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
function Pt() {
  return o(Symbol.iterator);
}
function Vt(e) {
  return typeof r(e) == "function";
}
function Kt() {
  return i(function(e, t) {
    let n = r(e).call(r(t));
    return o(n);
  }, arguments);
}
function Xt(e) {
  let t = r(e).next;
  return o(t);
}
function Yt(e) {
  return r(e).length;
}
function Zt() {
  let e = c.memory;
  return o(e);
}
function Gt(e) {
  let t = r(e).buffer;
  return o(t);
}
function Qt(e, t, n) {
  let _ = new Uint8Array(r(e), t >>> 0, n >>> 0);
  return o(_);
}
function te(e, t, n) {
  r(e).set(r(t), n >>> 0);
}
function ee(e) {
  let t = new Uint8Array(r(e));
  return o(t);
}
function ne(e) {
  let t = r(e);
  return o(t);
}
function re() {
  return i(function() {
    let e = self.self;
    return o(e);
  }, arguments);
}
function _e() {
  return i(function() {
    let e = window.window;
    return o(e);
  }, arguments);
}
function oe() {
  return i(function() {
    let e = globalThis.globalThis;
    return o(e);
  }, arguments);
}
function ce() {
  return i(function() {
    let e = global.global;
    return o(e);
  }, arguments);
}
function se(e, t) {
  let n = new Function(p(e, t));
  return o(n);
}
function ie() {
  return i(function(e, t) {
    return Reflect.has(r(e), r(t));
  }, arguments);
}
function ue(e, t) {
  let n = r(e).fetch(r(t));
  return o(n);
}
function fe(e) {
  let t = fetch(r(e));
  return o(t);
}
function be() {
  return i(function() {
    let e = new AbortController();
    return o(e);
  }, arguments);
}
function ae(e, t) {
  return r(e) == r(t);
}
function ge(e) {
  let t = r(e);
  return typeof t == "boolean" ? t ? 1 : 0 : 2;
}
function pe(e) {
  let t;
  try {
    t = r(e) instanceof Uint8Array;
  } catch {
    t = false;
  }
  return t;
}
function de(e) {
  let t;
  try {
    t = r(e) instanceof ArrayBuffer;
  } catch {
    t = false;
  }
  return t;
}
function we(e, t) {
  let n = O(r(t)), _ = m(n, c.__wbindgen_export_0, c.__wbindgen_export_1), s = h;
  f()[e / 4 + 1] = s, f()[e / 4 + 0] = _;
}
function le(e, t) {
  throw new Error(p(e, t));
}
function he(e, t, n) {
  let _ = r(e).then(r(t), r(n));
  return o(_);
}
function xe(e) {
  let t = Promise.resolve(r(e));
  return o(t);
}
function ye(e, t) {
  let n = r(e).then(r(t));
  return o(n);
}
function me(e) {
  let t = r(e).byobRequest;
  return g(t) ? 0 : o(t);
}
function je(e, t) {
  r(e).respond(t >>> 0);
}
function ke(e) {
  let t = r(e).view;
  return g(t) ? 0 : o(t);
}
function Ae(e) {
  return r(e).byteLength;
}
function Ee(e) {
  r(e).close();
}
function Me(e, t) {
  let n = new Error(p(e, t));
  return o(n);
}
function Oe(e) {
  let t = r(e).buffer;
  return o(t);
}
function Te(e) {
  return r(e).byteOffset;
}
function qe(e) {
  r(e).close();
}
function Se(e, t) {
  r(e).enqueue(r(t));
}
function ve() {
  return i(function(e, t, n) {
    let _ = new Request(p(e, t), r(n));
    return o(_);
  }, arguments);
}
function Le(e) {
  console.error(r(e));
}
function Ce(e) {
  let t;
  try {
    t = r(e) instanceof Error;
  } catch {
    t = false;
  }
  return t;
}
function Fe(e) {
  let t = r(e).toString();
  return o(t);
}
function Re(e) {
  let t = r(e).cause;
  return o(t);
}
function $e(e) {
  return o(e);
}
function Ie(e, t, n) {
  let _ = K(e, t, 86, X);
  return o(_);
}
var He = { fetch: $, scheduled: void 0, queue: void 0 };
export {
  T as IntoUnderlyingByteSource,
  q as IntoUnderlyingSink,
  S as IntoUnderlyingSource,
  v as MinifyConfig,
  L as PipeOptions,
  Z as PolishConfig,
  C as QueuingStrategy,
  F as R2Range,
  R as ReadableStreamGetReaderOptions,
  G as RequestRedirect,
  wt as __wbg_abort_de75e4ab5136bcee,
  jt as __wbg_all_2b78e889ce8a546b,
  Ct as __wbg_append_fac652007989b765,
  Oe as __wbg_buffer_4e79326814bdd393,
  Gt as __wbg_buffer_55ba7a6b1b92e2ac,
  me as __wbg_byobRequest_08c18cee35def1f4,
  Ae as __wbg_byteLength_5299848ed3264181,
  Te as __wbg_byteOffset_b69b0a07afccce19,
  Kt as __wbg_call_557a2f2deacc4912,
  dt as __wbg_call_587b30eea3e09332,
  Re as __wbg_cause_52959bcad93f9e0f,
  nt as __wbg_cf_703652f0d2c5b8d1,
  Ee as __wbg_close_da7e6fb9d9851e5a,
  qe as __wbg_close_e9110ca16e2567db,
  it as __wbg_constructor_f2623999a1f453eb,
  Dt as __wbg_done_b6abb27d42b63867,
  Se as __wbg_enqueue_d71a1a518e21f5c3,
  Le as __wbg_error_a7e23606158b68b9,
  ue as __wbg_fetch_621998933558ad27,
  fe as __wbg_fetch_6a2624d7f767e331,
  Et as __wbg_get_7303ed2ef026b2f5,
  ot as __wbg_get_f53c921291c381bd,
  Ot as __wbg_getwithrefkey_5e6d9547403deab8,
  oe as __wbg_globalThis_b70c095388441f2d,
  ce as __wbg_global_1c72617491ed7194,
  ie as __wbg_has_40b8c976775c8ead,
  et as __wbg_headers_1eff4f53324496e6,
  Nt as __wbg_headers_2de03c88f895093b,
  de as __wbg_instanceof_ArrayBuffer_ef2632aa0d4bfff8,
  Ce as __wbg_instanceof_Error_fac23a8832b241da,
  Rt as __wbg_instanceof_Response_7ade9a5a066d1a55,
  pe as __wbg_instanceof_Uint8Array_1349640af2da2e88,
  St as __wbg_isSafeInteger_2088b01008075470,
  Pt as __wbg_iterator_7c7e58f62eb84700,
  Ht as __wbg_json_682f3a71d443960d,
  Yt as __wbg_length_0aab7ffd65ad19ed,
  At as __wbg_length_820c786973abdd8a,
  yt as __wbg_log_dc06ec929fc95a20,
  Q as __wbg_method_e15eb9cf1c32cdbb,
  ut as __wbg_name_2a8bae31363c6a51,
  ee as __wbg_new_09938a7d020f049b,
  ft as __wbg_new_143b41b4342650bb,
  Jt as __wbg_new_2b55e405e4af4986,
  vt as __wbg_new_2b6fea4ea03b1b95,
  be as __wbg_new_668956ac1089f8cf,
  Me as __wbg_new_87297f22973157c8,
  se as __wbg_newnoargs_c9e6043b8ad84109,
  Qt as __wbg_newwithbyteoffsetandlength_88d1d8be5df94b9b,
  at as __wbg_newwithlength_89eeca401d8918c2,
  gt as __wbg_newwithoptbuffersourceandinit_6c49960a834dd7cf,
  pt as __wbg_newwithoptreadablestreamandinit_d238e5b972c7b57f,
  bt as __wbg_newwithoptstrandinit_ff70839f3334d3aa,
  ve as __wbg_newwithstrandinit_a4cd16dfaafcf625,
  Wt as __wbg_next_ec061e48a0e72a96,
  Xt as __wbg_next_f4bc0e96ea67da68,
  mt as __wbg_prepare_545a7ed280576b99,
  xe as __wbg_resolve_ae38ad63c43ff98b,
  je as __wbg_respond_8fadc5f5c9d95422,
  kt as __wbg_results_c7ad1ae0ae681ab4,
  re as __wbg_self_742dd6eab3e9211e,
  Lt as __wbg_set_07da13cc24b69217,
  te as __wbg_set_3698e3ca519b3c3c,
  xt as __wbg_set_76353df4722f4954,
  Ft as __wbg_signal_bcb55e86063f8860,
  $t as __wbg_status_d2b2d0889f7e970f,
  zt as __wbg_stringify_d06ad2addc54d51e,
  Bt as __wbg_text_65fa1887e8f7b4ac,
  he as __wbg_then_835b073a479138e5,
  ye as __wbg_then_8df675b8bb5d5e3c,
  Fe as __wbg_toString_506566b763774a16,
  tt as __wbg_url_3325e0ef088003ca,
  It as __wbg_url_59cb32ef6a837521,
  Ut as __wbg_value_2f4ef2036bfad28e,
  ke as __wbg_view_231340b0dd8a2484,
  _e as __wbg_window_c409e731db53a0e2,
  ge as __wbindgen_boolean_get,
  lt as __wbindgen_cb_drop,
  Ie as __wbindgen_closure_wrapper1102,
  we as __wbindgen_debug_string,
  ht as __wbindgen_error_new,
  Tt as __wbindgen_in,
  Vt as __wbindgen_is_function,
  Mt as __wbindgen_is_object,
  st as __wbindgen_is_undefined,
  ae as __wbindgen_jsval_loose_eq,
  Zt as __wbindgen_memory,
  qt as __wbindgen_number_get,
  $e as __wbindgen_number_new,
  ne as __wbindgen_object_clone_ref,
  ct as __wbindgen_object_drop_ref,
  rt as __wbindgen_string_get,
  _t as __wbindgen_string_new,
  le as __wbindgen_throw,
  He as default,
  $ as fetch,
  z as getMemory,
  Be as wasmModule
};
//# sourceMappingURL=shim.js.map
