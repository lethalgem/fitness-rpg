// .wrangler/tmp/bundle-7QXPls/checked-fetch.js
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
import z from "./d97f34e4bea43e3ba714d4ec8290e74898d44aa8-index.wasm";
import Yt from "./d97f34e4bea43e3ba714d4ec8290e74898d44aa8-index.wasm";
var W = Object.defineProperty;
var D = (e, t) => {
  for (var n in t)
    W(e, n, { get: t[n], enumerable: true });
};
var g = {};
D(g, { IntoUnderlyingByteSource: () => M, IntoUnderlyingSink: () => T, IntoUnderlyingSource: () => q, MinifyConfig: () => L, PipeOptions: () => C, PolishConfig: () => X, QueuingStrategy: () => S, R2Range: () => v, ReadableStreamGetReaderOptions: () => $, RequestRedirect: () => Y, __wbg_buffer_4e79326814bdd393: () => Ct, __wbg_buffer_55ba7a6b1b92e2ac: () => lt, __wbg_byobRequest_08c18cee35def1f4: () => Ot, __wbg_byteLength_5299848ed3264181: () => Tt, __wbg_byteOffset_b69b0a07afccce19: () => St, __wbg_call_587b30eea3e09332: () => it, __wbg_cause_52959bcad93f9e0f: () => Wt, __wbg_cf_703652f0d2c5b8d1: () => tt, __wbg_close_da7e6fb9d9851e5a: () => qt, __wbg_close_e9110ca16e2567db: () => vt, __wbg_constructor_f2623999a1f453eb: () => bt, __wbg_enqueue_d71a1a518e21f5c3: () => $t, __wbg_error_a7e23606158b68b9: () => Rt, __wbg_get_f53c921291c381bd: () => ut, __wbg_headers_1eff4f53324496e6: () => Q, __wbg_instanceof_Error_fac23a8832b241da: () => zt, __wbg_length_0aab7ffd65ad19ed: () => at, __wbg_method_e15eb9cf1c32cdbb: () => Z, __wbg_name_2a8bae31363c6a51: () => gt, __wbg_new_143b41b4342650bb: () => et, __wbg_new_2b55e405e4af4986: () => dt, __wbg_new_2b6fea4ea03b1b95: () => Nt, __wbg_new_87297f22973157c8: () => Lt, __wbg_newwithbyteoffsetandlength_88d1d8be5df94b9b: () => ht, __wbg_newwithlength_89eeca401d8918c2: () => _t, __wbg_newwithoptbuffersourceandinit_6c49960a834dd7cf: () => ot, __wbg_newwithoptreadablestreamandinit_d238e5b972c7b57f: () => st, __wbg_newwithoptstrandinit_ff70839f3334d3aa: () => rt, __wbg_resolve_ae38ad63c43ff98b: () => jt, __wbg_respond_8fadc5f5c9d95422: () => At, __wbg_set_07da13cc24b69217: () => Pt, __wbg_set_3698e3ca519b3c3c: () => yt, __wbg_set_76353df4722f4954: () => Dt, __wbg_then_8df675b8bb5d5e3c: () => Et, __wbg_toString_506566b763774a16: () => It, __wbg_url_3325e0ef088003ca: () => G, __wbg_view_231340b0dd8a2484: () => Mt, __wbindgen_cb_drop: () => kt, __wbindgen_closure_wrapper760: () => Ut, __wbindgen_debug_string: () => xt, __wbindgen_is_undefined: () => ft, __wbindgen_memory: () => wt, __wbindgen_number_new: () => Ht, __wbindgen_object_clone_ref: () => Ft, __wbindgen_object_drop_ref: () => nt, __wbindgen_string_get: () => pt, __wbindgen_string_new: () => ct, __wbindgen_throw: () => mt, fetch: () => F, getMemory: () => N });
var I = new WebAssembly.Instance(z, { "./index_bg.js": g });
var r = I.exports;
function N() {
  return r.memory;
}
var a = new Array(128).fill(void 0);
a.push(void 0, null, true, false);
function o(e) {
  return a[e];
}
var x = a.length;
function H(e) {
  e < 132 || (a[e] = x, x = e);
}
function d(e) {
  let t = o(e);
  return H(e), t;
}
var P = typeof TextDecoder > "u" ? (0, module.require)("util").TextDecoder : TextDecoder;
var R = new P("utf-8", { ignoreBOM: true, fatal: true });
R.decode();
var m = null;
function k() {
  return (m === null || m.byteLength === 0) && (m = new Uint8Array(r.memory.buffer)), m;
}
function l(e, t) {
  return e = e >>> 0, R.decode(k().subarray(e, e + t));
}
function i(e) {
  x === a.length && a.push(a.length + 1);
  let t = x;
  return x = a[t], a[t] = e, t;
}
var h = 0;
var U = typeof TextEncoder > "u" ? (0, module.require)("util").TextEncoder : TextEncoder;
var E = new U("utf-8");
var J = typeof E.encodeInto == "function" ? function(e, t) {
  return E.encodeInto(e, t);
} : function(e, t) {
  let n = E.encode(e);
  return t.set(n), { read: e.length, written: n.length };
};
function O(e, t, n) {
  if (n === void 0) {
    let f = E.encode(e), y = t(f.length) >>> 0;
    return k().subarray(y, y + f.length).set(f), h = f.length, y;
  }
  let _ = e.length, s = t(_) >>> 0, u = k(), c = 0;
  for (; c < _; c++) {
    let f = e.charCodeAt(c);
    if (f > 127)
      break;
    u[s + c] = f;
  }
  if (c !== _) {
    c !== 0 && (e = e.slice(c)), s = n(s, _, _ = c + e.length * 3) >>> 0;
    let f = k().subarray(s + c, s + _), y = J(e, f);
    c += y.written;
  }
  return h = c, s;
}
function p(e) {
  return e == null;
}
var j = null;
function b() {
  return (j === null || j.byteLength === 0) && (j = new Int32Array(r.memory.buffer)), j;
}
function A(e) {
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
    let s = e.length, u = "[";
    s > 0 && (u += A(e[0]));
    for (let c = 1; c < s; c++)
      u += ", " + A(e[c]);
    return u += "]", u;
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
function V(e, t, n, _) {
  let s = { a: e, b: t, cnt: 1, dtor: n }, u = (...c) => {
    s.cnt++;
    let f = s.a;
    s.a = 0;
    try {
      return _(f, s.b, ...c);
    } finally {
      --s.cnt === 0 ? r.__wbindgen_export_2.get(s.dtor)(f, s.b) : s.a = f;
    }
  };
  return u.original = s, u;
}
function B(e, t, n) {
  r.__wbindgen_export_3(e, t, i(n));
}
function F(e, t, n) {
  let _ = r.fetch(i(e), i(t), i(n));
  return d(_);
}
function w(e, t) {
  try {
    return e.apply(this, t);
  } catch (n) {
    r.__wbindgen_export_4(i(n));
  }
}
function K(e, t, n, _) {
  r.__wbindgen_export_5(e, t, i(n), i(_));
}
var X = Object.freeze({ Off: 0, 0: "Off", Lossy: 1, 1: "Lossy", Lossless: 2, 2: "Lossless" });
var Y = Object.freeze({ Error: 0, 0: "Error", Follow: 1, 1: "Follow", Manual: 2, 2: "Manual" });
var M = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_intounderlyingbytesource_free(t);
  }
  get type() {
    let t, n;
    try {
      let u = r.__wbindgen_add_to_stack_pointer(-16);
      r.intounderlyingbytesource_type(u, this.__wbg_ptr);
      var _ = b()[u / 4 + 0], s = b()[u / 4 + 1];
      return t = _, n = s, l(_, s);
    } finally {
      r.__wbindgen_add_to_stack_pointer(16), r.__wbindgen_export_6(t, n);
    }
  }
  get autoAllocateChunkSize() {
    return r.intounderlyingbytesource_autoAllocateChunkSize(this.__wbg_ptr) >>> 0;
  }
  start(t) {
    r.intounderlyingbytesource_start(this.__wbg_ptr, i(t));
  }
  pull(t) {
    let n = r.intounderlyingbytesource_pull(this.__wbg_ptr, i(t));
    return d(n);
  }
  cancel() {
    let t = this.__destroy_into_raw();
    r.intounderlyingbytesource_cancel(t);
  }
};
var T = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_intounderlyingsink_free(t);
  }
  write(t) {
    let n = r.intounderlyingsink_write(this.__wbg_ptr, i(t));
    return d(n);
  }
  close() {
    let t = this.__destroy_into_raw(), n = r.intounderlyingsink_close(t);
    return d(n);
  }
  abort(t) {
    let n = this.__destroy_into_raw(), _ = r.intounderlyingsink_abort(n, i(t));
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
    r.__wbg_intounderlyingsource_free(t);
  }
  pull(t) {
    let n = r.intounderlyingsource_pull(this.__wbg_ptr, i(t));
    return d(n);
  }
  cancel() {
    let t = this.__destroy_into_raw();
    r.intounderlyingsource_cancel(t);
  }
};
var L = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_minifyconfig_free(t);
  }
  get js() {
    return r.__wbg_get_minifyconfig_js(this.__wbg_ptr) !== 0;
  }
  set js(t) {
    r.__wbg_set_minifyconfig_js(this.__wbg_ptr, t);
  }
  get html() {
    return r.__wbg_get_minifyconfig_html(this.__wbg_ptr) !== 0;
  }
  set html(t) {
    r.__wbg_set_minifyconfig_html(this.__wbg_ptr, t);
  }
  get css() {
    return r.__wbg_get_minifyconfig_css(this.__wbg_ptr) !== 0;
  }
  set css(t) {
    r.__wbg_set_minifyconfig_css(this.__wbg_ptr, t);
  }
};
var C = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_pipeoptions_free(t);
  }
  get preventClose() {
    return r.pipeoptions_preventClose(this.__wbg_ptr) !== 0;
  }
  get preventCancel() {
    return r.pipeoptions_preventCancel(this.__wbg_ptr) !== 0;
  }
  get preventAbort() {
    return r.pipeoptions_preventAbort(this.__wbg_ptr) !== 0;
  }
  get signal() {
    let t = r.pipeoptions_signal(this.__wbg_ptr);
    return d(t);
  }
};
var S = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_queuingstrategy_free(t);
  }
  get highWaterMark() {
    return r.queuingstrategy_highWaterMark(this.__wbg_ptr);
  }
};
var v = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_r2range_free(t);
  }
  get offset() {
    try {
      let _ = r.__wbindgen_add_to_stack_pointer(-16);
      r.__wbg_get_r2range_offset(_, this.__wbg_ptr);
      var t = b()[_ / 4 + 0], n = b()[_ / 4 + 1];
      return t === 0 ? void 0 : n >>> 0;
    } finally {
      r.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set offset(t) {
    r.__wbg_set_r2range_offset(this.__wbg_ptr, !p(t), p(t) ? 0 : t);
  }
  get length() {
    try {
      let _ = r.__wbindgen_add_to_stack_pointer(-16);
      r.__wbg_get_r2range_length(_, this.__wbg_ptr);
      var t = b()[_ / 4 + 0], n = b()[_ / 4 + 1];
      return t === 0 ? void 0 : n >>> 0;
    } finally {
      r.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set length(t) {
    r.__wbg_set_r2range_length(this.__wbg_ptr, !p(t), p(t) ? 0 : t);
  }
  get suffix() {
    try {
      let _ = r.__wbindgen_add_to_stack_pointer(-16);
      r.__wbg_get_r2range_suffix(_, this.__wbg_ptr);
      var t = b()[_ / 4 + 0], n = b()[_ / 4 + 1];
      return t === 0 ? void 0 : n >>> 0;
    } finally {
      r.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set suffix(t) {
    r.__wbg_set_r2range_suffix(this.__wbg_ptr, !p(t), p(t) ? 0 : t);
  }
};
var $ = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_readablestreamgetreaderoptions_free(t);
  }
  get mode() {
    let t = r.readablestreamgetreaderoptions_mode(this.__wbg_ptr);
    return d(t);
  }
};
function Z(e, t) {
  let n = o(t).method, _ = O(n, r.__wbindgen_export_0, r.__wbindgen_export_1), s = h;
  b()[e / 4 + 1] = s, b()[e / 4 + 0] = _;
}
function G(e, t) {
  let n = o(t).url, _ = O(n, r.__wbindgen_export_0, r.__wbindgen_export_1), s = h;
  b()[e / 4 + 1] = s, b()[e / 4 + 0] = _;
}
function Q(e) {
  let t = o(e).headers;
  return i(t);
}
function tt(e) {
  let t = o(e).cf;
  return p(t) ? 0 : i(t);
}
function et() {
  return w(function() {
    let e = new Headers();
    return i(e);
  }, arguments);
}
function nt(e) {
  d(e);
}
function rt() {
  return w(function(e, t, n) {
    let _ = new Response(e === 0 ? void 0 : l(e, t), o(n));
    return i(_);
  }, arguments);
}
function _t(e) {
  let t = new Uint8Array(e >>> 0);
  return i(t);
}
function ot() {
  return w(function(e, t) {
    let n = new Response(o(e), o(t));
    return i(n);
  }, arguments);
}
function st() {
  return w(function(e, t) {
    let n = new Response(o(e), o(t));
    return i(n);
  }, arguments);
}
function it() {
  return w(function(e, t, n) {
    let _ = o(e).call(o(t), o(n));
    return i(_);
  }, arguments);
}
function ct(e, t) {
  let n = l(e, t);
  return i(n);
}
function ut() {
  return w(function(e, t) {
    let n = Reflect.get(o(e), o(t));
    return i(n);
  }, arguments);
}
function ft(e) {
  return o(e) === void 0;
}
function bt(e) {
  let t = o(e).constructor;
  return i(t);
}
function gt(e) {
  let t = o(e).name;
  return i(t);
}
function pt(e, t) {
  let n = o(t), _ = typeof n == "string" ? n : void 0;
  var s = p(_) ? 0 : O(_, r.__wbindgen_export_0, r.__wbindgen_export_1), u = h;
  b()[e / 4 + 1] = u, b()[e / 4 + 0] = s;
}
function dt(e, t) {
  try {
    var n = { a: e, b: t }, _ = (u, c) => {
      let f = n.a;
      n.a = 0;
      try {
        return K(f, n.b, u, c);
      } finally {
        n.a = f;
      }
    };
    let s = new Promise(_);
    return i(s);
  } finally {
    n.a = n.b = 0;
  }
}
function at(e) {
  return o(e).length;
}
function wt() {
  let e = r.memory;
  return i(e);
}
function lt(e) {
  let t = o(e).buffer;
  return i(t);
}
function ht(e, t, n) {
  let _ = new Uint8Array(o(e), t >>> 0, n >>> 0);
  return i(_);
}
function yt(e, t, n) {
  o(e).set(o(t), n >>> 0);
}
function xt(e, t) {
  let n = A(o(t)), _ = O(n, r.__wbindgen_export_0, r.__wbindgen_export_1), s = h;
  b()[e / 4 + 1] = s, b()[e / 4 + 0] = _;
}
function mt(e, t) {
  throw new Error(l(e, t));
}
function jt(e) {
  let t = Promise.resolve(o(e));
  return i(t);
}
function kt(e) {
  let t = d(e).original;
  return t.cnt-- == 1 ? (t.a = 0, true) : false;
}
function Et(e, t) {
  let n = o(e).then(o(t));
  return i(n);
}
function Ot(e) {
  let t = o(e).byobRequest;
  return p(t) ? 0 : i(t);
}
function At(e, t) {
  o(e).respond(t >>> 0);
}
function Mt(e) {
  let t = o(e).view;
  return p(t) ? 0 : i(t);
}
function Tt(e) {
  return o(e).byteLength;
}
function qt(e) {
  o(e).close();
}
function Lt(e, t) {
  let n = new Error(l(e, t));
  return i(n);
}
function Ct(e) {
  let t = o(e).buffer;
  return i(t);
}
function St(e) {
  return o(e).byteOffset;
}
function vt(e) {
  o(e).close();
}
function $t(e, t) {
  o(e).enqueue(o(t));
}
function Ft(e) {
  let t = o(e);
  return i(t);
}
function Rt(e) {
  console.error(o(e));
}
function Wt(e) {
  let t = o(e).cause;
  return i(t);
}
function Dt() {
  return w(function(e, t, n, _, s) {
    o(e).set(l(t, n), l(_, s));
  }, arguments);
}
function zt(e) {
  let t;
  try {
    t = o(e) instanceof Error;
  } catch {
    t = false;
  }
  return t;
}
function It(e) {
  let t = o(e).toString();
  return i(t);
}
function Nt() {
  let e = new Object();
  return i(e);
}
function Ht(e) {
  return i(e);
}
function Pt() {
  return w(function(e, t, n) {
    return Reflect.set(o(e), o(t), o(n));
  }, arguments);
}
function Ut(e, t, n) {
  let _ = V(e, t, 48, B);
  return i(_);
}
var Zt = { fetch: F, scheduled: void 0, queue: void 0 };

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

// .wrangler/tmp/bundle-7QXPls/middleware-insertion-facade.js
var envWrappers = [wrap].filter(Boolean);
var facade = {
  ...Zt,
  envWrappers,
  middleware: [
    middleware_miniflare3_json_error_default,
    ...Zt.middleware ? Zt.middleware : []
  ].filter(Boolean)
};
var middleware_insertion_facade_default = facade;

// .wrangler/tmp/bundle-7QXPls/middleware-loader.entry.ts
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
  M as IntoUnderlyingByteSource,
  T as IntoUnderlyingSink,
  q as IntoUnderlyingSource,
  L as MinifyConfig,
  C as PipeOptions,
  X as PolishConfig,
  S as QueuingStrategy,
  v as R2Range,
  $ as ReadableStreamGetReaderOptions,
  Y as RequestRedirect,
  Ct as __wbg_buffer_4e79326814bdd393,
  lt as __wbg_buffer_55ba7a6b1b92e2ac,
  Ot as __wbg_byobRequest_08c18cee35def1f4,
  Tt as __wbg_byteLength_5299848ed3264181,
  St as __wbg_byteOffset_b69b0a07afccce19,
  it as __wbg_call_587b30eea3e09332,
  Wt as __wbg_cause_52959bcad93f9e0f,
  tt as __wbg_cf_703652f0d2c5b8d1,
  qt as __wbg_close_da7e6fb9d9851e5a,
  vt as __wbg_close_e9110ca16e2567db,
  bt as __wbg_constructor_f2623999a1f453eb,
  $t as __wbg_enqueue_d71a1a518e21f5c3,
  Rt as __wbg_error_a7e23606158b68b9,
  ut as __wbg_get_f53c921291c381bd,
  Q as __wbg_headers_1eff4f53324496e6,
  zt as __wbg_instanceof_Error_fac23a8832b241da,
  at as __wbg_length_0aab7ffd65ad19ed,
  Z as __wbg_method_e15eb9cf1c32cdbb,
  gt as __wbg_name_2a8bae31363c6a51,
  et as __wbg_new_143b41b4342650bb,
  dt as __wbg_new_2b55e405e4af4986,
  Nt as __wbg_new_2b6fea4ea03b1b95,
  Lt as __wbg_new_87297f22973157c8,
  ht as __wbg_newwithbyteoffsetandlength_88d1d8be5df94b9b,
  _t as __wbg_newwithlength_89eeca401d8918c2,
  ot as __wbg_newwithoptbuffersourceandinit_6c49960a834dd7cf,
  st as __wbg_newwithoptreadablestreamandinit_d238e5b972c7b57f,
  rt as __wbg_newwithoptstrandinit_ff70839f3334d3aa,
  jt as __wbg_resolve_ae38ad63c43ff98b,
  At as __wbg_respond_8fadc5f5c9d95422,
  Pt as __wbg_set_07da13cc24b69217,
  yt as __wbg_set_3698e3ca519b3c3c,
  Dt as __wbg_set_76353df4722f4954,
  Et as __wbg_then_8df675b8bb5d5e3c,
  It as __wbg_toString_506566b763774a16,
  G as __wbg_url_3325e0ef088003ca,
  Mt as __wbg_view_231340b0dd8a2484,
  kt as __wbindgen_cb_drop,
  Ut as __wbindgen_closure_wrapper760,
  xt as __wbindgen_debug_string,
  ft as __wbindgen_is_undefined,
  wt as __wbindgen_memory,
  Ht as __wbindgen_number_new,
  Ft as __wbindgen_object_clone_ref,
  nt as __wbindgen_object_drop_ref,
  pt as __wbindgen_string_get,
  ct as __wbindgen_string_new,
  mt as __wbindgen_throw,
  middleware_loader_entry_default as default,
  F as fetch,
  N as getMemory,
  Yt as wasmModule
};
//# sourceMappingURL=shim.js.map
