// .wrangler/tmp/bundle-ZjO3r0/checked-fetch.js
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
import I from "./18a93efaa911d04651b939dc71a5ce07279b39ef-index.wasm";
import fe from "./18a93efaa911d04651b939dc71a5ce07279b39ef-index.wasm";
var U = Object.defineProperty;
var z = (e, t) => {
  for (var n in t)
    U(e, n, { get: t[n], enumerable: true });
};
var d = {};
z(d, { IntoUnderlyingByteSource: () => q, IntoUnderlyingSink: () => T, IntoUnderlyingSource: () => L, MinifyConfig: () => C, PipeOptions: () => F, PolishConfig: () => G, QueuingStrategy: () => S, R2Range: () => v, ReadableStreamGetReaderOptions: () => $, RequestRedirect: () => Q, __wbg_buffer_610b70c8fd30da2d: () => Pt, __wbg_buffer_cf65c07de34b9a08: () => Et, __wbg_byobRequest_a3c74c3694777d1b: () => Rt, __wbg_byteLength_1fef7842ca4200fa: () => Nt, __wbg_byteOffset_ede786cfcf88d3dd: () => Jt, __wbg_bytesliteral_efe7d360639bf32b: () => zt, __wbg_call_9495de66fdbe016b: () => ft, __wbg_cf_23036f27554431ca: () => rt, __wbg_close_045ed342139beb7d: () => Bt, __wbg_close_a41954830b65c455: () => Vt, __wbg_enqueue_3a8a8e67e44d2567: () => Kt, __wbg_getwithrefkey_5e6d9547403deab8: () => yt, __wbg_headers_ab5251d2727ac41e: () => nt, __wbg_instanceof_ArrayBuffer_a69f02ee4c4f5065: () => St, __wbg_instanceof_Error_749a7378f4439ee0: () => Zt, __wbg_instanceof_Uint8Array_01cebe79ca606cca: () => Ft, __wbg_json_011ff959f0891c9a: () => dt, __wbg_length_27a2afe8ab42b09f: () => At, __wbg_log_7bb108d119bafbc1: () => Xt, __wbg_method_d1ee174c753ca2be: () => tt, __wbg_new_15d3966e9981a196: () => Ht, __wbg_new_537b7341ce90bb31: () => qt, __wbg_new_9d3a9ce4282a18a8: () => jt, __wbg_new_f1c3a9c2533a55b8: () => ot, __wbg_new_f9876326328f45ed: () => Qt, __wbg_newwithbyteoffsetandlength_9fb2f11355ecadf5: () => Mt, __wbg_newwithlength_b56c882b57805732: () => it, __wbg_newwithoptbuffersourceandinit_4d2fa6d435ff2a63: () => ct, __wbg_newwithoptreadablestreamandinit_a0b4dc209bd176be: () => ut, __wbg_newwithoptstrandinit_1a4621d99c54e7c3: () => st, __wbg_resolve_fd40f858d9db1a04: () => Wt, __wbg_respond_f4778bef04e912a6: () => Ut, __wbg_set_17499e8aa4003ebd: () => Ot, __wbg_set_6aa458a4ebdb65cb: () => ee, __wbg_set_a5d34c36a1a4ebd1: () => Yt, __wbg_then_ec5db6d509eb475f: () => Dt, __wbg_then_f753623316e2873a: () => gt, __wbg_toString_cec163b212643722: () => Gt, __wbg_url_bd2775644ef804ec: () => et, __wbg_view_d1a31268af734e5d: () => It, __wbindgen_boolean_get: () => Lt, __wbindgen_cb_drop: () => pt, __wbindgen_closure_wrapper151: () => ne, __wbindgen_debug_string: () => vt, __wbindgen_error_new: () => bt, __wbindgen_in: () => mt, __wbindgen_is_object: () => wt, __wbindgen_is_undefined: () => xt, __wbindgen_jsval_loose_eq: () => Tt, __wbindgen_memory: () => kt, __wbindgen_number_get: () => Ct, __wbindgen_number_new: () => te, __wbindgen_object_clone_ref: () => ht, __wbindgen_object_drop_ref: () => _t, __wbindgen_string_get: () => lt, __wbindgen_string_new: () => at, __wbindgen_throw: () => $t, fetch: () => W, getMemory: () => B });
function D() {
  return "bytes";
}
var N = new WebAssembly.Instance(I, { "./index_bg.js": d });
var r = N.exports;
function B() {
  return r.memory;
}
var g = new Array(128).fill(void 0);
g.push(void 0, null, true, false);
function _(e) {
  return g[e];
}
var x = g.length;
function H(e) {
  e < 132 || (g[e] = x, x = e);
}
function b(e) {
  let t = _(e);
  return H(e), t;
}
var P = typeof TextDecoder > "u" ? (0, module.require)("util").TextDecoder : TextDecoder;
var R = new P("utf-8", { ignoreBOM: true, fatal: true });
R.decode();
var m = null;
function k() {
  return (m === null || m.byteLength === 0) && (m = new Uint8Array(r.memory.buffer)), m;
}
function w(e, t) {
  return R.decode(k().subarray(e, e + t));
}
function s(e) {
  x === g.length && g.push(g.length + 1);
  let t = x;
  return x = g[t], g[t] = e, t;
}
var h = 0;
var J = typeof TextEncoder > "u" ? (0, module.require)("util").TextEncoder : TextEncoder;
var E = new J("utf-8");
var V = typeof E.encodeInto == "function" ? function(e, t) {
  return E.encodeInto(e, t);
} : function(e, t) {
  let n = E.encode(e);
  return t.set(n), { read: e.length, written: n.length };
};
function M(e, t, n) {
  if (n === void 0) {
    let u = E.encode(e), y = t(u.length);
    return k().subarray(y, y + u.length).set(u), h = u.length, y;
  }
  let o = e.length, i = t(o), p = k(), c = 0;
  for (; c < o; c++) {
    let u = e.charCodeAt(c);
    if (u > 127)
      break;
    p[i + c] = u;
  }
  if (c !== o) {
    c !== 0 && (e = e.slice(c)), i = n(i, o, o = c + e.length * 3);
    let u = k().subarray(i + c, i + o), y = V(e, u);
    c += y.written;
  }
  return h = c, i;
}
function a(e) {
  return e == null;
}
var j = null;
function f() {
  return (j === null || j.byteLength === 0) && (j = new Int32Array(r.memory.buffer)), j;
}
var A = null;
function K() {
  return (A === null || A.byteLength === 0) && (A = new Float64Array(r.memory.buffer)), A;
}
function O(e) {
  let t = typeof e;
  if (t == "number" || t == "boolean" || e == null)
    return `${e}`;
  if (t == "string")
    return `"${e}"`;
  if (t == "symbol") {
    let i = e.description;
    return i == null ? "Symbol" : `Symbol(${i})`;
  }
  if (t == "function") {
    let i = e.name;
    return typeof i == "string" && i.length > 0 ? `Function(${i})` : "Function";
  }
  if (Array.isArray(e)) {
    let i = e.length, p = "[";
    i > 0 && (p += O(e[0]));
    for (let c = 1; c < i; c++)
      p += ", " + O(e[c]);
    return p += "]", p;
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
  let i = { a: e, b: t, cnt: 1, dtor: n }, p = (...c) => {
    i.cnt++;
    let u = i.a;
    i.a = 0;
    try {
      return o(u, i.b, ...c);
    } finally {
      --i.cnt === 0 ? r.__wbindgen_export_2.get(i.dtor)(u, i.b) : i.a = u;
    }
  };
  return p.original = i, p;
}
function Y(e, t, n) {
  r.__wbindgen_export_3(e, t, s(n));
}
function W(e, t, n) {
  let o = r.fetch(s(e), s(t), s(n));
  return b(o);
}
function l(e, t) {
  try {
    return e.apply(this, t);
  } catch (n) {
    r.__wbindgen_export_4(s(n));
  }
}
function Z(e, t, n, o) {
  r.__wbindgen_export_5(e, t, s(n), s(o));
}
var G = Object.freeze({ Off: 0, 0: "Off", Lossy: 1, 1: "Lossy", Lossless: 2, 2: "Lossless" });
var Q = Object.freeze({ Error: 0, 0: "Error", Follow: 1, 1: "Follow", Manual: 2, 2: "Manual" });
var q = class {
  __destroy_into_raw() {
    let t = this.ptr;
    return this.ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_intounderlyingbytesource_free(t);
  }
  get type() {
    let t = r.intounderlyingbytesource_type(this.ptr);
    return b(t);
  }
  get autoAllocateChunkSize() {
    return r.intounderlyingbytesource_autoAllocateChunkSize(this.ptr) >>> 0;
  }
  start(t) {
    r.intounderlyingbytesource_start(this.ptr, s(t));
  }
  pull(t) {
    let n = r.intounderlyingbytesource_pull(this.ptr, s(t));
    return b(n);
  }
  cancel() {
    let t = this.__destroy_into_raw();
    r.intounderlyingbytesource_cancel(t);
  }
};
var T = class {
  __destroy_into_raw() {
    let t = this.ptr;
    return this.ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_intounderlyingsink_free(t);
  }
  write(t) {
    let n = r.intounderlyingsink_write(this.ptr, s(t));
    return b(n);
  }
  close() {
    let t = this.__destroy_into_raw(), n = r.intounderlyingsink_close(t);
    return b(n);
  }
  abort(t) {
    let n = this.__destroy_into_raw(), o = r.intounderlyingsink_abort(n, s(t));
    return b(o);
  }
};
var L = class {
  __destroy_into_raw() {
    let t = this.ptr;
    return this.ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_intounderlyingsource_free(t);
  }
  pull(t) {
    let n = r.intounderlyingsource_pull(this.ptr, s(t));
    return b(n);
  }
  cancel() {
    let t = this.__destroy_into_raw();
    r.intounderlyingsource_cancel(t);
  }
};
var C = class {
  __destroy_into_raw() {
    let t = this.ptr;
    return this.ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_minifyconfig_free(t);
  }
  get js() {
    return r.__wbg_get_minifyconfig_js(this.ptr) !== 0;
  }
  set js(t) {
    r.__wbg_set_minifyconfig_js(this.ptr, t);
  }
  get html() {
    return r.__wbg_get_minifyconfig_html(this.ptr) !== 0;
  }
  set html(t) {
    r.__wbg_set_minifyconfig_html(this.ptr, t);
  }
  get css() {
    return r.__wbg_get_minifyconfig_css(this.ptr) !== 0;
  }
  set css(t) {
    r.__wbg_set_minifyconfig_css(this.ptr, t);
  }
};
var F = class {
  __destroy_into_raw() {
    let t = this.ptr;
    return this.ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_pipeoptions_free(t);
  }
  get preventClose() {
    return r.pipeoptions_preventClose(this.ptr) !== 0;
  }
  get preventCancel() {
    return r.pipeoptions_preventCancel(this.ptr) !== 0;
  }
  get preventAbort() {
    return r.pipeoptions_preventAbort(this.ptr) !== 0;
  }
  get signal() {
    let t = r.pipeoptions_signal(this.ptr);
    return b(t);
  }
};
var S = class {
  __destroy_into_raw() {
    let t = this.ptr;
    return this.ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_queuingstrategy_free(t);
  }
  get highWaterMark() {
    return r.queuingstrategy_highWaterMark(this.ptr);
  }
};
var v = class {
  __destroy_into_raw() {
    let t = this.ptr;
    return this.ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_r2range_free(t);
  }
  get offset() {
    try {
      let o = r.__wbindgen_add_to_stack_pointer(-16);
      r.__wbg_get_r2range_offset(o, this.ptr);
      var t = f()[o / 4 + 0], n = f()[o / 4 + 1];
      return t === 0 ? void 0 : n >>> 0;
    } finally {
      r.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set offset(t) {
    r.__wbg_set_r2range_offset(this.ptr, !a(t), a(t) ? 0 : t);
  }
  get length() {
    try {
      let o = r.__wbindgen_add_to_stack_pointer(-16);
      r.__wbg_get_r2range_length(o, this.ptr);
      var t = f()[o / 4 + 0], n = f()[o / 4 + 1];
      return t === 0 ? void 0 : n >>> 0;
    } finally {
      r.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set length(t) {
    r.__wbg_set_r2range_length(this.ptr, !a(t), a(t) ? 0 : t);
  }
  get suffix() {
    try {
      let o = r.__wbindgen_add_to_stack_pointer(-16);
      r.__wbg_get_r2range_suffix(o, this.ptr);
      var t = f()[o / 4 + 0], n = f()[o / 4 + 1];
      return t === 0 ? void 0 : n >>> 0;
    } finally {
      r.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set suffix(t) {
    r.__wbg_set_r2range_suffix(this.ptr, !a(t), a(t) ? 0 : t);
  }
};
var $ = class {
  __destroy_into_raw() {
    let t = this.ptr;
    return this.ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_readablestreamgetreaderoptions_free(t);
  }
  get mode() {
    let t = r.readablestreamgetreaderoptions_mode(this.ptr);
    return b(t);
  }
};
function tt(e, t) {
  let n = _(t).method, o = M(n, r.__wbindgen_export_0, r.__wbindgen_export_1), i = h;
  f()[e / 4 + 1] = i, f()[e / 4 + 0] = o;
}
function et(e, t) {
  let n = _(t).url, o = M(n, r.__wbindgen_export_0, r.__wbindgen_export_1), i = h;
  f()[e / 4 + 1] = i, f()[e / 4 + 0] = o;
}
function nt(e) {
  let t = _(e).headers;
  return s(t);
}
function rt(e) {
  let t = _(e).cf;
  return a(t) ? 0 : s(t);
}
function ot() {
  return l(function() {
    let e = new Headers();
    return s(e);
  }, arguments);
}
function _t(e) {
  b(e);
}
function st() {
  return l(function(e, t, n) {
    let o = new Response(e === 0 ? void 0 : w(e, t), _(n));
    return s(o);
  }, arguments);
}
function it(e) {
  let t = new Uint8Array(e >>> 0);
  return s(t);
}
function ct() {
  return l(function(e, t) {
    let n = new Response(_(e), _(t));
    return s(n);
  }, arguments);
}
function ut() {
  return l(function(e, t) {
    let n = new Response(_(e), _(t));
    return s(n);
  }, arguments);
}
function ft() {
  return l(function(e, t, n) {
    let o = _(e).call(_(t), _(n));
    return s(o);
  }, arguments);
}
function pt(e) {
  let t = b(e).original;
  return t.cnt-- == 1 ? (t.a = 0, true) : false;
}
function at(e, t) {
  let n = w(e, t);
  return s(n);
}
function bt(e, t) {
  let n = new Error(w(e, t));
  return s(n);
}
function dt() {
  return l(function(e) {
    let t = _(e).json();
    return s(t);
  }, arguments);
}
function gt(e, t, n) {
  let o = _(e).then(_(t), _(n));
  return s(o);
}
function lt(e, t) {
  let n = _(t), o = typeof n == "string" ? n : void 0;
  var i = a(o) ? 0 : M(o, r.__wbindgen_export_0, r.__wbindgen_export_1), p = h;
  f()[e / 4 + 1] = p, f()[e / 4 + 0] = i;
}
function wt(e) {
  let t = _(e);
  return typeof t == "object" && t !== null;
}
function ht(e) {
  let t = _(e);
  return s(t);
}
function yt(e, t) {
  let n = _(e)[_(t)];
  return s(n);
}
function xt(e) {
  return _(e) === void 0;
}
function mt(e, t) {
  return _(e) in _(t);
}
function jt(e, t) {
  try {
    var n = { a: e, b: t }, o = (p, c) => {
      let u = n.a;
      n.a = 0;
      try {
        return Z(u, n.b, p, c);
      } finally {
        n.a = u;
      }
    };
    let i = new Promise(o);
    return s(i);
  } finally {
    n.a = n.b = 0;
  }
}
function At(e) {
  return _(e).length;
}
function kt() {
  let e = r.memory;
  return s(e);
}
function Et(e) {
  let t = _(e).buffer;
  return s(t);
}
function Mt(e, t, n) {
  let o = new Uint8Array(_(e), t >>> 0, n >>> 0);
  return s(o);
}
function Ot(e, t, n) {
  _(e).set(_(t), n >>> 0);
}
function qt(e) {
  let t = new Uint8Array(_(e));
  return s(t);
}
function Tt(e, t) {
  return _(e) == _(t);
}
function Lt(e) {
  let t = _(e);
  return typeof t == "boolean" ? t ? 1 : 0 : 2;
}
function Ct(e, t) {
  let n = _(t), o = typeof n == "number" ? n : void 0;
  K()[e / 8 + 1] = a(o) ? 0 : o, f()[e / 4 + 0] = !a(o);
}
function Ft(e) {
  let t;
  try {
    t = _(e) instanceof Uint8Array;
  } catch {
    t = false;
  }
  return t;
}
function St(e) {
  let t;
  try {
    t = _(e) instanceof ArrayBuffer;
  } catch {
    t = false;
  }
  return t;
}
function vt(e, t) {
  let n = O(_(t)), o = M(n, r.__wbindgen_export_0, r.__wbindgen_export_1), i = h;
  f()[e / 4 + 1] = i, f()[e / 4 + 0] = o;
}
function $t(e, t) {
  throw new Error(w(e, t));
}
function Wt(e) {
  let t = Promise.resolve(_(e));
  return s(t);
}
function Dt(e, t) {
  let n = _(e).then(_(t));
  return s(n);
}
function Rt(e) {
  let t = _(e).byobRequest;
  return a(t) ? 0 : s(t);
}
function Ut(e, t) {
  _(e).respond(t >>> 0);
}
function zt() {
  let e = D();
  return s(e);
}
function It(e) {
  let t = _(e).view;
  return a(t) ? 0 : s(t);
}
function Nt(e) {
  return _(e).byteLength;
}
function Bt(e) {
  _(e).close();
}
function Ht(e, t) {
  let n = new Error(w(e, t));
  return s(n);
}
function Pt(e) {
  let t = _(e).buffer;
  return s(t);
}
function Jt(e) {
  return _(e).byteOffset;
}
function Vt(e) {
  _(e).close();
}
function Kt(e, t) {
  _(e).enqueue(_(t));
}
function Xt(e) {
  console.log(_(e));
}
function Yt() {
  return l(function(e, t, n, o, i) {
    _(e).set(w(t, n), w(o, i));
  }, arguments);
}
function Zt(e) {
  let t;
  try {
    t = _(e) instanceof Error;
  } catch {
    t = false;
  }
  return t;
}
function Gt(e) {
  let t = _(e).toString();
  return s(t);
}
function Qt() {
  let e = new Object();
  return s(e);
}
function te(e) {
  return s(e);
}
function ee() {
  return l(function(e, t, n) {
    return Reflect.set(_(e), _(t), _(n));
  }, arguments);
}
function ne(e, t, n) {
  let o = X(e, t, 57, Y);
  return s(o);
}
var pe = { fetch: W, scheduled: void 0, queue: void 0 };

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

// .wrangler/tmp/bundle-ZjO3r0/middleware-insertion-facade.js
var envWrappers = [wrap].filter(Boolean);
var facade = {
  ...pe,
  envWrappers,
  middleware: [
    middleware_miniflare3_json_error_default,
    ...pe.middleware ? pe.middleware : []
  ].filter(Boolean)
};
var middleware_insertion_facade_default = facade;

// .wrangler/tmp/bundle-ZjO3r0/middleware-loader.entry.ts
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
  C as MinifyConfig,
  F as PipeOptions,
  G as PolishConfig,
  S as QueuingStrategy,
  v as R2Range,
  $ as ReadableStreamGetReaderOptions,
  Q as RequestRedirect,
  Pt as __wbg_buffer_610b70c8fd30da2d,
  Et as __wbg_buffer_cf65c07de34b9a08,
  Rt as __wbg_byobRequest_a3c74c3694777d1b,
  Nt as __wbg_byteLength_1fef7842ca4200fa,
  Jt as __wbg_byteOffset_ede786cfcf88d3dd,
  zt as __wbg_bytesliteral_efe7d360639bf32b,
  ft as __wbg_call_9495de66fdbe016b,
  rt as __wbg_cf_23036f27554431ca,
  Bt as __wbg_close_045ed342139beb7d,
  Vt as __wbg_close_a41954830b65c455,
  Kt as __wbg_enqueue_3a8a8e67e44d2567,
  yt as __wbg_getwithrefkey_5e6d9547403deab8,
  nt as __wbg_headers_ab5251d2727ac41e,
  St as __wbg_instanceof_ArrayBuffer_a69f02ee4c4f5065,
  Zt as __wbg_instanceof_Error_749a7378f4439ee0,
  Ft as __wbg_instanceof_Uint8Array_01cebe79ca606cca,
  dt as __wbg_json_011ff959f0891c9a,
  At as __wbg_length_27a2afe8ab42b09f,
  Xt as __wbg_log_7bb108d119bafbc1,
  tt as __wbg_method_d1ee174c753ca2be,
  Ht as __wbg_new_15d3966e9981a196,
  qt as __wbg_new_537b7341ce90bb31,
  jt as __wbg_new_9d3a9ce4282a18a8,
  ot as __wbg_new_f1c3a9c2533a55b8,
  Qt as __wbg_new_f9876326328f45ed,
  Mt as __wbg_newwithbyteoffsetandlength_9fb2f11355ecadf5,
  it as __wbg_newwithlength_b56c882b57805732,
  ct as __wbg_newwithoptbuffersourceandinit_4d2fa6d435ff2a63,
  ut as __wbg_newwithoptreadablestreamandinit_a0b4dc209bd176be,
  st as __wbg_newwithoptstrandinit_1a4621d99c54e7c3,
  Wt as __wbg_resolve_fd40f858d9db1a04,
  Ut as __wbg_respond_f4778bef04e912a6,
  Ot as __wbg_set_17499e8aa4003ebd,
  ee as __wbg_set_6aa458a4ebdb65cb,
  Yt as __wbg_set_a5d34c36a1a4ebd1,
  Dt as __wbg_then_ec5db6d509eb475f,
  gt as __wbg_then_f753623316e2873a,
  Gt as __wbg_toString_cec163b212643722,
  et as __wbg_url_bd2775644ef804ec,
  It as __wbg_view_d1a31268af734e5d,
  Lt as __wbindgen_boolean_get,
  pt as __wbindgen_cb_drop,
  ne as __wbindgen_closure_wrapper151,
  vt as __wbindgen_debug_string,
  bt as __wbindgen_error_new,
  mt as __wbindgen_in,
  wt as __wbindgen_is_object,
  xt as __wbindgen_is_undefined,
  Tt as __wbindgen_jsval_loose_eq,
  kt as __wbindgen_memory,
  Ct as __wbindgen_number_get,
  te as __wbindgen_number_new,
  ht as __wbindgen_object_clone_ref,
  _t as __wbindgen_object_drop_ref,
  lt as __wbindgen_string_get,
  at as __wbindgen_string_new,
  $t as __wbindgen_throw,
  middleware_loader_entry_default as default,
  W as fetch,
  B as getMemory,
  fe as wasmModule
};
//# sourceMappingURL=shim.js.map
