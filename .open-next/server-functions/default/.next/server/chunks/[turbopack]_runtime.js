const RUNTIME_PUBLIC_PATH = "server/chunks/[turbopack]_runtime.js";
const RELATIVE_ROOT_PATH = "..";
const ASSET_PREFIX = "/";
const WORKER_FORWARDED_GLOBALS = ["NEXT_DEPLOYMENT_ID","NEXT_CLIENT_ASSET_SUFFIX"];
// Apply forwarded globals from workerData if running in a worker thread
if (typeof require !== 'undefined') {
    try {
        const { workerData } = require('worker_threads');
        if (workerData?.__turbopack_globals__) {
            Object.assign(globalThis, workerData.__turbopack_globals__);
            // Remove internal data so it's not visible to user code
            delete workerData.__turbopack_globals__;
        }
    } catch (_) {
        // Not in a worker thread context, ignore
    }
}
/**
 * This file contains runtime types and functions that are shared between all
 * TurboPack ECMAScript runtimes.
 *
 * It will be prepended to the runtime code of each runtime.
 */ /* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="./runtime-types.d.ts" />
/**
 * Describes why a module was instantiated.
 * Shared between browser and Node.js runtimes.
 */ var SourceType = /*#__PURE__*/ function(SourceType) {
    /**
   * The module was instantiated because it was included in an evaluated chunk's
   * runtime.
   * SourceData is a ChunkPath.
   */ SourceType[SourceType["Runtime"] = 0] = "Runtime";
    /**
   * The module was instantiated because a parent module imported it.
   * SourceData is a ModuleId.
   */ SourceType[SourceType["Parent"] = 1] = "Parent";
    /**
   * The module was instantiated because it was included in a chunk's hot module
   * update.
   * SourceData is an array of ModuleIds or undefined.
   */ SourceType[SourceType["Update"] = 2] = "Update";
    return SourceType;
}(SourceType || {});
/**
 * Flag indicating which module object type to create when a module is merged. Set to `true`
 * by each runtime that uses ModuleWithDirection (browser dev-base.ts, nodejs dev-base.ts,
 * nodejs build-base.ts). Browser production (build-base.ts) leaves it as `false` since it
 * uses plain Module objects.
 */ let createModuleWithDirectionFlag = false;
const REEXPORTED_OBJECTS = new WeakMap();
/**
 * Constructs the `__turbopack_context__` object for a module.
 */ function Context(module, exports) {
    this.m = module;
    // We need to store this here instead of accessing it from the module object to:
    // 1. Make it available to factories directly, since we rewrite `this` to
    //    `__turbopack_context__.e` in CJS modules.
    // 2. Support async modules which rewrite `module.exports` to a promise, so we
    //    can still access the original exports object from functions like
    //    `esmExport`
    // Ideally we could find a new approach for async modules and drop this property altogether.
    this.e = exports;
}
const contextPrototype = Context.prototype;
const hasOwnProperty = Object.prototype.hasOwnProperty;
const toStringTag = typeof Symbol !== 'undefined' && Symbol.toStringTag;
function defineProp(obj, name, options) {
    if (!hasOwnProperty.call(obj, name)) Object.defineProperty(obj, name, options);
}
function getOverwrittenModule(moduleCache, id) {
    let module = moduleCache[id];
    if (!module) {
        if (createModuleWithDirectionFlag) {
            // set in development modes for hmr support
            module = createModuleWithDirection(id);
        } else {
            module = createModuleObject(id);
        }
        moduleCache[id] = module;
    }
    return module;
}
/**
 * Creates the module object. Only done here to ensure all module objects have the same shape.
 */ function createModuleObject(id) {
    return {
        exports: {},
        error: undefined,
        id,
        namespaceObject: undefined
    };
}
function createModuleWithDirection(id) {
    return {
        exports: {},
        error: undefined,
        id,
        namespaceObject: undefined,
        parents: [],
        children: []
    };
}
const BindingTag_Value = 0;
/**
 * Adds the getters to the exports object.
 */ function esm(exports, bindings) {
    defineProp(exports, '__esModule', {
        value: true
    });
    if (toStringTag) defineProp(exports, toStringTag, {
        value: 'Module'
    });
    let i = 0;
    while(i < bindings.length){
        const propName = bindings[i++];
        const tagOrFunction = bindings[i++];
        if (typeof tagOrFunction === 'number') {
            if (tagOrFunction === BindingTag_Value) {
                defineProp(exports, propName, {
                    value: bindings[i++],
                    enumerable: true,
                    writable: false
                });
            } else {
                throw new Error(`unexpected tag: ${tagOrFunction}`);
            }
        } else {
            const getterFn = tagOrFunction;
            if (typeof bindings[i] === 'function') {
                const setterFn = bindings[i++];
                defineProp(exports, propName, {
                    get: getterFn,
                    set: setterFn,
                    enumerable: true
                });
            } else {
                defineProp(exports, propName, {
                    get: getterFn,
                    enumerable: true
                });
            }
        }
    }
    Object.seal(exports);
}
/**
 * Makes the module an ESM with exports
 */ function esmExport(bindings, id) {
    let module;
    let exports;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
        exports = module.exports;
    } else {
        module = this.m;
        exports = this.e;
    }
    module.namespaceObject = exports;
    esm(exports, bindings);
}
contextPrototype.s = esmExport;
function ensureDynamicExports(module, exports) {
    let reexportedObjects = REEXPORTED_OBJECTS.get(module);
    if (!reexportedObjects) {
        REEXPORTED_OBJECTS.set(module, reexportedObjects = []);
        module.exports = module.namespaceObject = new Proxy(exports, {
            get (target, prop) {
                if (hasOwnProperty.call(target, prop) || prop === 'default' || prop === '__esModule') {
                    return Reflect.get(target, prop);
                }
                for (const obj of reexportedObjects){
                    const value = Reflect.get(obj, prop);
                    if (value !== undefined) return value;
                }
                return undefined;
            },
            ownKeys (target) {
                const keys = Reflect.ownKeys(target);
                for (const obj of reexportedObjects){
                    for (const key of Reflect.ownKeys(obj)){
                        if (key !== 'default' && !keys.includes(key)) keys.push(key);
                    }
                }
                return keys;
            }
        });
    }
    return reexportedObjects;
}
/**
 * Dynamically exports properties from an object
 */ function dynamicExport(object, id) {
    let module;
    let exports;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
        exports = module.exports;
    } else {
        module = this.m;
        exports = this.e;
    }
    const reexportedObjects = ensureDynamicExports(module, exports);
    if (typeof object === 'object' && object !== null) {
        reexportedObjects.push(object);
    }
}
contextPrototype.j = dynamicExport;
function exportValue(value, id) {
    let module;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
    } else {
        module = this.m;
    }
    module.exports = value;
}
contextPrototype.v = exportValue;
function exportNamespace(namespace, id) {
    let module;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
    } else {
        module = this.m;
    }
    module.exports = module.namespaceObject = namespace;
}
contextPrototype.n = exportNamespace;
function createGetter(obj, key) {
    return ()=>obj[key];
}
/**
 * @returns prototype of the object
 */ const getProto = Object.getPrototypeOf ? (obj)=>Object.getPrototypeOf(obj) : (obj)=>obj.__proto__;
/** Prototypes that are not expanded for exports */ const LEAF_PROTOTYPES = [
    null,
    getProto({}),
    getProto([]),
    getProto(getProto)
];
/**
 * @param raw
 * @param ns
 * @param allowExportDefault
 *   * `false`: will have the raw module as default export
 *   * `true`: will have the default property as default export
 */ function interopEsm(raw, ns, allowExportDefault) {
    const bindings = [];
    let defaultLocation = -1;
    for(let current = raw; (typeof current === 'object' || typeof current === 'function') && !LEAF_PROTOTYPES.includes(current); current = getProto(current)){
        for (const key of Object.getOwnPropertyNames(current)){
            bindings.push(key, createGetter(raw, key));
            if (defaultLocation === -1 && key === 'default') {
                defaultLocation = bindings.length - 1;
            }
        }
    }
    // this is not really correct
    // we should set the `default` getter if the imported module is a `.cjs file`
    if (!(allowExportDefault && defaultLocation >= 0)) {
        // Replace the binding with one for the namespace itself in order to preserve iteration order.
        if (defaultLocation >= 0) {
            // Replace the getter with the value
            bindings.splice(defaultLocation, 1, BindingTag_Value, raw);
        } else {
            bindings.push('default', BindingTag_Value, raw);
        }
    }
    esm(ns, bindings);
    return ns;
}
function createNS(raw) {
    if (typeof raw === 'function') {
        return function(...args) {
            return raw.apply(this, args);
        };
    } else {
        return Object.create(null);
    }
}
function esmImport(id) {
    const module = getOrInstantiateModuleFromParent(id, this.m);
    // any ES module has to have `module.namespaceObject` defined.
    if (module.namespaceObject) return module.namespaceObject;
    // only ESM can be an async module, so we don't need to worry about exports being a promise here.
    const raw = module.exports;
    return module.namespaceObject = interopEsm(raw, createNS(raw), raw && raw.__esModule);
}
contextPrototype.i = esmImport;
function asyncLoader(moduleId) {
    const loader = this.r(moduleId);
    return loader(esmImport.bind(this));
}
contextPrototype.A = asyncLoader;
// Add a simple runtime require so that environments without one can still pass
// `typeof require` CommonJS checks so that exports are correctly registered.
const runtimeRequire = // @ts-ignore
typeof require === 'function' ? require : function require1() {
    throw new Error('Unexpected use of runtime require');
};
contextPrototype.t = runtimeRequire;
function commonJsRequire(id) {
    return getOrInstantiateModuleFromParent(id, this.m).exports;
}
contextPrototype.r = commonJsRequire;
/**
 * Remove fragments and query parameters since they are never part of the context map keys
 *
 * This matches how we parse patterns at resolving time.  Arguably we should only do this for
 * strings passed to `import` but the resolve does it for `import` and `require` and so we do
 * here as well.
 */ function parseRequest(request) {
    // Per the URI spec fragments can contain `?` characters, so we should trim it off first
    // https://datatracker.ietf.org/doc/html/rfc3986#section-3.5
    const hashIndex = request.indexOf('#');
    if (hashIndex !== -1) {
        request = request.substring(0, hashIndex);
    }
    const queryIndex = request.indexOf('?');
    if (queryIndex !== -1) {
        request = request.substring(0, queryIndex);
    }
    return request;
}
/**
 * `require.context` and require/import expression runtime.
 */ function moduleContext(map) {
    function moduleContext(id) {
        id = parseRequest(id);
        if (hasOwnProperty.call(map, id)) {
            return map[id].module();
        }
        const e = new Error(`Cannot find module '${id}'`);
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    }
    moduleContext.keys = ()=>{
        return Object.keys(map);
    };
    moduleContext.resolve = (id)=>{
        id = parseRequest(id);
        if (hasOwnProperty.call(map, id)) {
            return map[id].id();
        }
        const e = new Error(`Cannot find module '${id}'`);
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    };
    moduleContext.import = async (id)=>{
        return await moduleContext(id);
    };
    return moduleContext;
}
contextPrototype.f = moduleContext;
/**
 * Returns the path of a chunk defined by its data.
 */ function getChunkPath(chunkData) {
    return typeof chunkData === 'string' ? chunkData : chunkData.path;
}
function isPromise(maybePromise) {
    return maybePromise != null && typeof maybePromise === 'object' && 'then' in maybePromise && typeof maybePromise.then === 'function';
}
function isAsyncModuleExt(obj) {
    return turbopackQueues in obj;
}
function createPromise() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej)=>{
        reject = rej;
        resolve = res;
    });
    return {
        promise,
        resolve: resolve,
        reject: reject
    };
}
// Load the CompressedmoduleFactories of a chunk into the `moduleFactories` Map.
// The CompressedModuleFactories format is
// - 1 or more module ids
// - a module factory function
// So walking this is a little complex but the flat structure is also fast to
// traverse, we can use `typeof` operators to distinguish the two cases.
function installCompressedModuleFactories(chunkModules, offset, moduleFactories, newModuleId) {
    let i = offset;
    while(i < chunkModules.length){
        let end = i + 1;
        // Find our factory function
        while(end < chunkModules.length && typeof chunkModules[end] !== 'function'){
            end++;
        }
        if (end === chunkModules.length) {
            throw new Error('malformed chunk format, expected a factory function');
        }
        // Install the factory for each module ID that doesn't already have one.
        // When some IDs in this group already have a factory, reuse that existing
        // group factory for the missing IDs to keep all IDs in the group consistent.
        // Otherwise, install the factory from this chunk.
        const moduleFactoryFn = chunkModules[end];
        let existingGroupFactory = undefined;
        for(let j = i; j < end; j++){
            const id = chunkModules[j];
            const existingFactory = moduleFactories.get(id);
            if (existingFactory) {
                existingGroupFactory = existingFactory;
                break;
            }
        }
        const factoryToInstall = existingGroupFactory ?? moduleFactoryFn;
        let didInstallFactory = false;
        for(let j = i; j < end; j++){
            const id = chunkModules[j];
            if (!moduleFactories.has(id)) {
                if (!didInstallFactory) {
                    if (factoryToInstall === moduleFactoryFn) {
                        applyModuleFactoryName(moduleFactoryFn);
                    }
                    didInstallFactory = true;
                }
                moduleFactories.set(id, factoryToInstall);
                newModuleId?.(id);
            }
        }
        i = end + 1; // end is pointing at the last factory advance to the next id or the end of the array.
    }
}
// everything below is adapted from webpack
// https://github.com/webpack/webpack/blob/6be4065ade1e252c1d8dcba4af0f43e32af1bdc1/lib/runtime/AsyncModuleRuntimeModule.js#L13
const turbopackQueues = Symbol('turbopack queues');
const turbopackExports = Symbol('turbopack exports');
const turbopackError = Symbol('turbopack error');
function resolveQueue(queue) {
    if (queue && queue.status !== 1) {
        queue.status = 1;
        queue.forEach((fn)=>fn.queueCount--);
        queue.forEach((fn)=>fn.queueCount-- ? fn.queueCount++ : fn());
    }
}
function wrapDeps(deps) {
    return deps.map((dep)=>{
        if (dep !== null && typeof dep === 'object') {
            if (isAsyncModuleExt(dep)) return dep;
            if (isPromise(dep)) {
                const queue = Object.assign([], {
                    status: 0
                });
                const obj = {
                    [turbopackExports]: {},
                    [turbopackQueues]: (fn)=>fn(queue)
                };
                dep.then((res)=>{
                    obj[turbopackExports] = res;
                    resolveQueue(queue);
                }, (err)=>{
                    obj[turbopackError] = err;
                    resolveQueue(queue);
                });
                return obj;
            }
        }
        return {
            [turbopackExports]: dep,
            [turbopackQueues]: ()=>{}
        };
    });
}
function asyncModule(body, hasAwait) {
    const module = this.m;
    const queue = hasAwait ? Object.assign([], {
        status: -1
    }) : undefined;
    const depQueues = new Set();
    const { resolve, reject, promise: rawPromise } = createPromise();
    const promise = Object.assign(rawPromise, {
        [turbopackExports]: module.exports,
        [turbopackQueues]: (fn)=>{
            queue && fn(queue);
            depQueues.forEach(fn);
            promise['catch'](()=>{});
        }
    });
    const attributes = {
        get () {
            return promise;
        },
        set (v) {
            // Calling `esmExport` leads to this.
            if (v !== promise) {
                promise[turbopackExports] = v;
            }
        }
    };
    Object.defineProperty(module, 'exports', attributes);
    Object.defineProperty(module, 'namespaceObject', attributes);
    function handleAsyncDependencies(deps) {
        const currentDeps = wrapDeps(deps);
        const getResult = ()=>currentDeps.map((d)=>{
                if (d[turbopackError]) throw d[turbopackError];
                return d[turbopackExports];
            });
        const { promise, resolve } = createPromise();
        const fn = Object.assign(()=>resolve(getResult), {
            queueCount: 0
        });
        function fnQueue(q) {
            if (q !== queue && !depQueues.has(q)) {
                depQueues.add(q);
                if (q && q.status === 0) {
                    fn.queueCount++;
                    q.push(fn);
                }
            }
        }
        currentDeps.map((dep)=>dep[turbopackQueues](fnQueue));
        return fn.queueCount ? promise : getResult();
    }
    function asyncResult(err) {
        if (err) {
            reject(promise[turbopackError] = err);
        } else {
            resolve(promise[turbopackExports]);
        }
        resolveQueue(queue);
    }
    body(handleAsyncDependencies, asyncResult);
    if (queue && queue.status === -1) {
        queue.status = 0;
    }
}
contextPrototype.a = asyncModule;
/**
 * A pseudo "fake" URL object to resolve to its relative path.
 *
 * When UrlRewriteBehavior is set to relative, calls to the `new URL()` will construct url without base using this
 * runtime function to generate context-agnostic urls between different rendering context, i.e ssr / client to avoid
 * hydration mismatch.
 *
 * This is based on webpack's existing implementation:
 * https://github.com/webpack/webpack/blob/87660921808566ef3b8796f8df61bd79fc026108/lib/runtime/RelativeUrlRuntimeModule.js
 */ const relativeURL = function relativeURL(inputUrl) {
    const realUrl = new URL(inputUrl, 'x:/');
    const values = {};
    for(const key in realUrl)values[key] = realUrl[key];
    values.href = inputUrl;
    values.pathname = inputUrl.replace(/[?#].*/, '');
    values.origin = values.protocol = '';
    values.toString = values.toJSON = (..._args)=>inputUrl;
    for(const key in values)Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        value: values[key]
    });
};
relativeURL.prototype = URL.prototype;
contextPrototype.U = relativeURL;
/**
 * Utility function to ensure all variants of an enum are handled.
 */ function invariant(never, computeMessage) {
    throw new Error(`Invariant: ${computeMessage(never)}`);
}
/**
 * Constructs an error message for when a module factory is not available.
 */ function factoryNotAvailableMessage(moduleId, sourceType, sourceData) {
    let instantiationReason;
    switch(sourceType){
        case 0:
            instantiationReason = `as a runtime entry of chunk ${sourceData}`;
            break;
        case 1:
            instantiationReason = `because it was required from module ${sourceData}`;
            break;
        case 2:
            instantiationReason = 'because of an HMR update';
            break;
        default:
            invariant(sourceType, (sourceType)=>`Unknown source type: ${sourceType}`);
    }
    return `Module ${moduleId} was instantiated ${instantiationReason}, but the module factory is not available.`;
}
/**
 * A stub function to make `require` available but non-functional in ESM.
 */ function requireStub(_moduleId) {
    throw new Error('dynamic usage of require is not supported');
}
contextPrototype.z = requireStub;
// Make `globalThis` available to the module in a way that cannot be shadowed by a local variable.
contextPrototype.g = globalThis;
function applyModuleFactoryName(factory) {
    // Give the module factory a nice name to improve stack traces.
    Object.defineProperty(factory, 'name', {
        value: 'module evaluation'
    });
}
/// <reference path="../shared/runtime/runtime-utils.ts" />
/// A 'base' utilities to support runtime can have externals.
/// Currently this is for node.js / edge runtime both.
/// If a fn requires node.js specific behavior, it should be placed in `node-external-utils` instead.
async function externalImport(id) {
    let raw;
    try {
        switch (id) {
  case "next/dist/compiled/@vercel/og/index.node.js":
    raw = await import("next/dist/compiled/@vercel/og/index.edge.js");
    break;
  default:
    raw = await import(id);
};
    } catch (err) {
        // TODO(alexkirsz) This can happen when a client-side module tries to load
        // an external module we don't provide a shim for (e.g. querystring, url).
        // For now, we fail semi-silently, but in the future this should be a
        // compilation error.
        throw new Error(`Failed to load external module ${id}: ${err}`);
    }
    if (raw && raw.__esModule && raw.default && 'default' in raw.default) {
        return interopEsm(raw.default, createNS(raw), true);
    }
    return raw;
}
contextPrototype.y = externalImport;
function externalRequire(id, thunk, esm = false) {
    let raw;
    try {
        raw = thunk();
    } catch (err) {
        // TODO(alexkirsz) This can happen when a client-side module tries to load
        // an external module we don't provide a shim for (e.g. querystring, url).
        // For now, we fail semi-silently, but in the future this should be a
        // compilation error.
        throw new Error(`Failed to load external module ${id}: ${err}`);
    }
    if (!esm || raw.__esModule) {
        return raw;
    }
    return interopEsm(raw, createNS(raw), true);
}
externalRequire.resolve = (id, options)=>{
    return require.resolve(id, options);
};
contextPrototype.x = externalRequire;
/* eslint-disable @typescript-eslint/no-unused-vars */ const path = require('path');
const relativePathToRuntimeRoot = path.relative(RUNTIME_PUBLIC_PATH, '.');
// Compute the relative path to the `distDir`.
const relativePathToDistRoot = path.join(relativePathToRuntimeRoot, RELATIVE_ROOT_PATH);
const RUNTIME_ROOT = path.resolve(__filename, relativePathToRuntimeRoot);
// Compute the absolute path to the root, by stripping distDir from the absolute path to this file.
const ABSOLUTE_ROOT = path.resolve(__filename, relativePathToDistRoot);
/**
 * Returns an absolute path to the given module path.
 * Module path should be relative, either path to a file or a directory.
 *
 * This fn allows to calculate an absolute path for some global static values, such as
 * `__dirname` or `import.meta.url` that Turbopack will not embeds in compile time.
 * See ImportMetaBinding::code_generation for the usage.
 */ function resolveAbsolutePath(modulePath) {
    if (modulePath) {
        return path.join(ABSOLUTE_ROOT, modulePath);
    }
    return ABSOLUTE_ROOT;
}
Context.prototype.P = resolveAbsolutePath;
/* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="../shared/runtime/runtime-utils.ts" />
function readWebAssemblyAsResponse(path) {
    const { createReadStream } = require('fs');
    const { Readable } = require('stream');
    const stream = createReadStream(path);
    // @ts-ignore unfortunately there's a slight type mismatch with the stream.
    return new Response(Readable.toWeb(stream), {
        headers: {
            'content-type': 'application/wasm'
        }
    });
}
async function compileWebAssemblyFromPath(path) {
    const response = readWebAssemblyAsResponse(path);
    return await WebAssembly.compileStreaming(response);
}
async function instantiateWebAssemblyFromPath(path, importsObj) {
    const response = readWebAssemblyAsResponse(path);
    const { instance } = await WebAssembly.instantiateStreaming(response, importsObj);
    return instance.exports;
}
/* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="../../shared/runtime/runtime-utils.ts" />
/// <reference path="../../shared-node/base-externals-utils.ts" />
/// <reference path="../../shared-node/node-externals-utils.ts" />
/// <reference path="../../shared-node/node-wasm-utils.ts" />
/// <reference path="./nodejs-globals.d.ts" />
/**
 * Base Node.js runtime shared between production and development.
 * Contains chunk loading, module caching, and other non-HMR functionality.
 */ process.env.TURBOPACK = '1';
const url = require('url');
const moduleFactories = new Map();
const moduleCache = Object.create(null);
/**
 * Returns an absolute path to the given module's id.
 */ function resolvePathFromModule(moduleId) {
    const exported = this.r(moduleId);
    const exportedPath = exported?.default ?? exported;
    if (typeof exportedPath !== 'string') {
        return exported;
    }
    const strippedAssetPrefix = exportedPath.slice(ASSET_PREFIX.length);
    const resolved = path.resolve(RUNTIME_ROOT, strippedAssetPrefix);
    return url.pathToFileURL(resolved).href;
}
/**
 * Exports a URL value. No suffix is added in Node.js runtime.
 */ function exportUrl(urlValue, id) {
    exportValue.call(this, urlValue, id);
}
function loadRuntimeChunk(sourcePath, chunkData) {
    if (typeof chunkData === 'string') {
        loadRuntimeChunkPath(sourcePath, chunkData);
    } else {
        loadRuntimeChunkPath(sourcePath, chunkData.path);
    }
}
const loadedChunks = new Set();
const unsupportedLoadChunk = Promise.resolve(undefined);
const loadedChunk = Promise.resolve(undefined);
const chunkCache = new Map();
function clearChunkCache() {
    chunkCache.clear();
    loadedChunks.clear();
}
function loadRuntimeChunkPath(sourcePath, chunkPath) {
    if (!isJs(chunkPath)) {
        // We only support loading JS chunks in Node.js.
        // This branch can be hit when trying to load a CSS chunk.
        return;
    }
    if (loadedChunks.has(chunkPath)) {
        return;
    }
    try {
        const resolved = path.resolve(RUNTIME_ROOT, chunkPath);
        const chunkModules = requireChunk(chunkPath);
        installCompressedModuleFactories(chunkModules, 0, moduleFactories);
        loadedChunks.add(chunkPath);
    } catch (cause) {
        let errorMessage = `Failed to load chunk ${chunkPath}`;
        if (sourcePath) {
            errorMessage += ` from runtime for chunk ${sourcePath}`;
        }
        const error = new Error(errorMessage, {
            cause
        });
        error.name = 'ChunkLoadError';
        throw error;
    }
}
function loadChunkAsync(chunkData) {
    const chunkPath = typeof chunkData === 'string' ? chunkData : chunkData.path;
    if (!isJs(chunkPath)) {
        // We only support loading JS chunks in Node.js.
        // This branch can be hit when trying to load a CSS chunk.
        return unsupportedLoadChunk;
    }
    let entry = chunkCache.get(chunkPath);
    if (entry === undefined) {
        try {
            // resolve to an absolute path to simplify `require` handling
            const resolved = path.resolve(RUNTIME_ROOT, chunkPath);
            // TODO: consider switching to `import()` to enable concurrent chunk loading and async file io
            // However this is incompatible with hot reloading (since `import` doesn't use the require cache)
            const chunkModules = requireChunk(chunkPath);
            installCompressedModuleFactories(chunkModules, 0, moduleFactories);
            entry = loadedChunk;
        } catch (cause) {
            const errorMessage = `Failed to load chunk ${chunkPath} from module ${this.m.id}`;
            const error = new Error(errorMessage, {
                cause
            });
            error.name = 'ChunkLoadError';
            // Cache the failure promise, future requests will also get this same rejection
            entry = Promise.reject(error);
        }
        chunkCache.set(chunkPath, entry);
    }
    // TODO: Return an instrumented Promise that React can use instead of relying on referential equality.
    return entry;
}
contextPrototype.l = loadChunkAsync;
function loadChunkAsyncByUrl(chunkUrl) {
    const path1 = url.fileURLToPath(new URL(chunkUrl, RUNTIME_ROOT));
    return loadChunkAsync.call(this, path1);
}
contextPrototype.L = loadChunkAsyncByUrl;
async function loadWebAssembly(chunkPath, _edgeModule, imports) {
  const mod = await loadWasmChunk(chunkPath);
  const { exports } = await WebAssembly.instantiate(mod, imports);
  return exports;
}
contextPrototype.w = loadWebAssembly;
function loadWebAssemblyModule(chunkPath, _edgeModule) {
  return loadWasmChunk(chunkPath);
}
contextPrototype.u = loadWebAssemblyModule;
/**
 * Creates a Node.js worker thread by instantiating the given WorkerConstructor
 * with the appropriate path and options, including forwarded globals.
 *
 * @param WorkerConstructor The Worker constructor from worker_threads
 * @param workerPath Path to the worker entry chunk
 * @param workerOptions options to pass to the Worker constructor (optional)
 */ function createWorker(WorkerConstructor, workerPath, workerOptions) {
    // Build the forwarded globals object
    const forwardedGlobals = {};
    for (const name of WORKER_FORWARDED_GLOBALS){
        forwardedGlobals[name] = globalThis[name];
    }
    // Merge workerData with forwarded globals
    const existingWorkerData = workerOptions?.workerData || {};
    const options = {
        ...workerOptions,
        workerData: {
            ...typeof existingWorkerData === 'object' ? existingWorkerData : {},
            __turbopack_globals__: forwardedGlobals
        }
    };
    return new WorkerConstructor(workerPath, options);
}
const regexJsUrl = /\.js(?:\?[^#]*)?(?:#.*)?$/;
/**
 * Checks if a given path/URL ends with .js, optionally followed by ?query or #fragment.
 */ function isJs(chunkUrlOrPath) {
    return regexJsUrl.test(chunkUrlOrPath);
}
/* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="./runtime-base.ts" />
/**
 * Production Node.js runtime.
 * Uses ModuleWithDirection and simple module instantiation without HMR support.
 */ // moduleCache and moduleFactories are declared in runtime-base.ts
// this is read in runtime-utils.ts so it creates a module with direction for hmr
createModuleWithDirectionFlag = true;
const nodeContextPrototype = Context.prototype;
nodeContextPrototype.q = exportUrl;
nodeContextPrototype.M = moduleFactories;
// Cast moduleCache to ModuleWithDirection for production mode
nodeContextPrototype.c = moduleCache;
nodeContextPrototype.R = resolvePathFromModule;
nodeContextPrototype.b = createWorker;
nodeContextPrototype.C = clearChunkCache;
function instantiateModule(id, sourceType, sourceData) {
    const moduleFactory = moduleFactories.get(id);
    if (typeof moduleFactory !== 'function') {
        // This can happen if modules incorrectly handle HMR disposes/updates,
        // e.g. when they keep a `setTimeout` around which still executes old code
        // and contains e.g. a `require("something")` call.
        throw new Error(factoryNotAvailableMessage(id, sourceType, sourceData));
    }
    const module1 = createModuleWithDirection(id);
    const exports = module1.exports;
    moduleCache[id] = module1;
    const context = new Context(module1, exports);
    // NOTE(alexkirsz) This can fail when the module encounters a runtime error.
    try {
        moduleFactory(context, module1, exports);
    } catch (error) {
        module1.error = error;
        throw error;
    }
    ;
    module1.loaded = true;
    if (module1.namespaceObject && module1.exports !== module1.namespaceObject) {
        // in case of a circular dependency: cjs1 -> esm2 -> cjs1
        interopEsm(module1.exports, module1.namespaceObject);
    }
    return module1;
}
/**
 * Retrieves a module from the cache, or instantiate it if it is not cached.
 */ // @ts-ignore
function getOrInstantiateModuleFromParent(id, sourceModule) {
    const module1 = moduleCache[id];
    if (module1) {
        if (module1.error) {
            throw module1.error;
        }
        return module1;
    }
    return instantiateModule(id, SourceType.Parent, sourceModule.id);
}
/**
 * Instantiates a runtime module.
 */ function instantiateRuntimeModule(chunkPath, moduleId) {
    return instantiateModule(moduleId, SourceType.Runtime, chunkPath);
}
/**
 * Retrieves a module from the cache, or instantiate it as a runtime module if it is not cached.
 */ // @ts-ignore TypeScript doesn't separate this module space from the browser runtime
function getOrInstantiateRuntimeModule(chunkPath, moduleId) {
    const module1 = moduleCache[moduleId];
    if (module1) {
        if (module1.error) {
            throw module1.error;
        }
        return module1;
    }
    return instantiateRuntimeModule(chunkPath, moduleId);
}
module.exports = (sourcePath)=>({
        m: (id)=>getOrInstantiateRuntimeModule(sourcePath, id),
        c: (chunkData)=>loadRuntimeChunk(sourcePath, chunkData)
    });


//# sourceMappingURL=%5Bturbopack%5D_runtime.js.map

  function requireChunk(chunkPath) {
    switch(chunkPath) {
      case "server/chunks/ssr/[root-of-the-server]__05yuwwe._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__05yuwwe._.js");
      case "server/chunks/ssr/[root-of-the-server]__0p7xq8n._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0p7xq8n._.js");
      case "server/chunks/ssr/[root-of-the-server]__1gf8ql1._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1gf8ql1._.js");
      case "server/chunks/ssr/[root-of-the-server]__1gjw1u7._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1gjw1u7._.js");
      case "server/chunks/ssr/[turbopack]_runtime.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[turbopack]_runtime.js");
      case "server/chunks/ssr/_0byxch5._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_0byxch5._.js");
      case "server/chunks/ssr/_next-internal_server_app__not-found_page_actions_0pt47yr.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app__not-found_page_actions_0pt47yr.js");
      case "server/chunks/ssr/node_modules_0h91jdk._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_0h91jdk._.js");
      case "server/chunks/ssr/node_modules_1v83rds._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_1v83rds._.js");
      case "server/chunks/ssr/node_modules_@swc_helpers_cjs__interop_require_wildcard_cjs_07s0qsy._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_@swc_helpers_cjs__interop_require_wildcard_cjs_07s0qsy._.js");
      case "server/chunks/ssr/node_modules_next_dist_06e9fq1._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_06e9fq1._.js");
      case "server/chunks/ssr/node_modules_next_dist_0gqiype._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_0gqiype._.js");
      case "server/chunks/ssr/node_modules_next_dist_0uboya6._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_0uboya6._.js");
      case "server/chunks/ssr/node_modules_next_dist_172hvm-._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_172hvm-._.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_0p8s4lh._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_0p8s4lh._.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_builtin_unauthorized_0l_sp0x.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_builtin_unauthorized_0l_sp0x.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0rgv9cl.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0rgv9cl.js");
      case "server/chunks/ssr/[root-of-the-server]__057tebb._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__057tebb._.js");
      case "server/chunks/ssr/[root-of-the-server]__0y_88xg._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0y_88xg._.js");
      case "server/chunks/ssr/_next-internal_server_app__global-error_page_actions_0zi5s8-.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app__global-error_page_actions_0zi5s8-.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_builtin_global-error_0-o-goa.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_builtin_global-error_0-o-goa.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_06zp_1r.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_06zp_1r.js");
      case "server/chunks/ssr/[root-of-the-server]__02m31pt._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__02m31pt._.js");
      case "server/chunks/ssr/[root-of-the-server]__0quba7n._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0quba7n._.js");
      case "server/chunks/ssr/[root-of-the-server]__1v3ywx9._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1v3ywx9._.js");
      case "server/chunks/ssr/_20k38un._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_20k38un._.js");
      case "server/chunks/ssr/_next-internal_server_app_academy_certificates_page_actions_1hee9_o.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_academy_certificates_page_actions_1hee9_o.js");
      case "server/chunks/ssr/node_modules_0v-vk9n._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_0v-vk9n._.js");
      case "server/chunks/ssr/node_modules_next_1iemwhs._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_1iemwhs._.js");
      case "server/chunks/ssr/node_modules_next_1lnqo1a._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_1lnqo1a._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_18q0bsi.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_18q0bsi.js");
      case "server/chunks/ssr/src_app_academy_layout_tsx_05__zgh._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_academy_layout_tsx_05__zgh._.js");
      case "server/chunks/ssr/src_app_academy_layout_tsx_1ogdioy._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_academy_layout_tsx_1ogdioy._.js");
      case "server/chunks/ssr/src_lib_utils_ts_02vl9dh._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/src_lib_utils_ts_02vl9dh._.js");
      case "server/chunks/ssr/1oeh_server_app_academy_courses_[courseId]_lesson_[lessonId]_page_actions_0dcp5-l.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/1oeh_server_app_academy_courses_[courseId]_lesson_[lessonId]_page_actions_0dcp5-l.js");
      case "server/chunks/ssr/[root-of-the-server]__0zi67bn._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0zi67bn._.js");
      case "server/chunks/ssr/[root-of-the-server]__1gnwfd3._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1gnwfd3._.js");
      case "server/chunks/ssr/[root-of-the-server]__1ks88bl._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1ks88bl._.js");
      case "server/chunks/ssr/_1a-oser._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_1a-oser._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0fduvq8.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0fduvq8.js");
      case "server/chunks/ssr/[root-of-the-server]__0m3w-bw._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0m3w-bw._.js");
      case "server/chunks/ssr/_1qrabyy._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_1qrabyy._.js");
      case "server/chunks/ssr/_next-internal_server_app_academy_courses_[courseId]_page_actions_017fiub.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_academy_courses_[courseId]_page_actions_017fiub.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0s8ixlq.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0s8ixlq.js");
      case "server/chunks/ssr/[root-of-the-server]__0jh6mn7._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0jh6mn7._.js");
      case "server/chunks/ssr/_0ye64bm._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_0ye64bm._.js");
      case "server/chunks/ssr/_next-internal_server_app_academy_courses_page_actions_17ytf7_.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_academy_courses_page_actions_17ytf7_.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1w3zjc5.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1w3zjc5.js");
      case "server/chunks/ssr/[root-of-the-server]__09f3hjr._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__09f3hjr._.js");
      case "server/chunks/ssr/_0v4_s_r._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_0v4_s_r._.js");
      case "server/chunks/ssr/_21a4_h-._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_21a4_h-._.js");
      case "server/chunks/ssr/_next-internal_server_app_academy_dashboard_page_actions_13-f81q.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_academy_dashboard_page_actions_13-f81q.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1orvprr.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1orvprr.js");
      case "server/chunks/ssr/[root-of-the-server]__1-cw1vb._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1-cw1vb._.js");
      case "server/chunks/ssr/_0-7fb40._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_0-7fb40._.js");
      case "server/chunks/ssr/_next-internal_server_app_academy_documents_page_actions_1qvh-k-.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_academy_documents_page_actions_1qvh-k-.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_17mfju0.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_17mfju0.js");
      case "server/chunks/ssr/[root-of-the-server]__0n8meib._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0n8meib._.js");
      case "server/chunks/ssr/_0sa7wzh._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_0sa7wzh._.js");
      case "server/chunks/ssr/_next-internal_server_app_academy_favorites_page_actions_1ei1r99.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_academy_favorites_page_actions_1ei1r99.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0jdm6po.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0jdm6po.js");
      case "server/chunks/ssr/[root-of-the-server]__050h_yc._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__050h_yc._.js");
      case "server/chunks/ssr/_next-internal_server_app_academy_page_actions_1ewa425.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_academy_page_actions_1ewa425.js");
      case "server/chunks/ssr/node_modules_next_dist_1ypm6fc._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_1ypm6fc._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1op214g.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1op214g.js");
      case "server/chunks/ssr/[root-of-the-server]__18cd1eb._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__18cd1eb._.js");
      case "server/chunks/ssr/_0_k64m0._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_0_k64m0._.js");
      case "server/chunks/ssr/_next-internal_server_app_academy_profile_page_actions_041z6lo.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_academy_profile_page_actions_041z6lo.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0_7_9zn.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0_7_9zn.js");
      case "server/chunks/ssr/src_app_academy_profile_page_tsx_0rh9fw4._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_academy_profile_page_tsx_0rh9fw4._.js");
      case "server/chunks/ssr/[root-of-the-server]__1mq2x4g._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1mq2x4g._.js");
      case "server/chunks/ssr/_0h-i4cl._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_0h-i4cl._.js");
      case "server/chunks/ssr/_next-internal_server_app_academy_useful-sites_page_actions_1l4df0p.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_academy_useful-sites_page_actions_1l4df0p.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_19z_x95.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_19z_x95.js");
      case "server/chunks/ssr/[root-of-the-server]__02_nw92._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__02_nw92._.js");
      case "server/chunks/ssr/_1dqgdzh._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_1dqgdzh._.js");
      case "server/chunks/ssr/_1dvdhf7._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_1dvdhf7._.js");
      case "server/chunks/ssr/_next-internal_server_app_academy_workshops_[workshopId]_page_actions_07wdcva.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_academy_workshops_[workshopId]_page_actions_07wdcva.js");
      case "server/chunks/ssr/node_modules_0m2t6x9._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_0m2t6x9._.js");
      case "server/chunks/ssr/node_modules_104pf7_._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_104pf7_._.js");
      case "server/chunks/ssr/node_modules_@codesandbox_sandpack-client_dist_11y0g8d._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_@codesandbox_sandpack-client_dist_11y0g8d._.js");
      case "server/chunks/ssr/node_modules_@codesandbox_sandpack-client_dist_base-80a1f760_mjs_06zj44y._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_@codesandbox_sandpack-client_dist_base-80a1f760_mjs_06zj44y._.js");
      case "server/chunks/ssr/node_modules_@codesandbox_sandpack-client_dist_clients_node_index_mjs_18u4i7q._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_@codesandbox_sandpack-client_dist_clients_node_index_mjs_18u4i7q._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0ligu5-.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0ligu5-.js");
      case "server/chunks/ssr/[root-of-the-server]__20sw3yx._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__20sw3yx._.js");
      case "server/chunks/ssr/_1xfu49o._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_1xfu49o._.js");
      case "server/chunks/ssr/_next-internal_server_app_academy_workshops_page_actions_0sz6qj_.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_academy_workshops_page_actions_0sz6qj_.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_14dash3.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_14dash3.js");
      case "server/chunks/ssr/[root-of-the-server]__0u16zww._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0u16zww._.js");
      case "server/chunks/ssr/_1qdy2r4._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_1qdy2r4._.js");
      case "server/chunks/ssr/_1uanwe0._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_1uanwe0._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_badges_page_actions_0qf4euq.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_badges_page_actions_0qf4euq.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_16d-mgd.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_16d-mgd.js");
      case "server/chunks/ssr/src_app_admin_badges_page_tsx_0jd2nst._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_admin_badges_page_tsx_0jd2nst._.js");
      case "server/chunks/ssr/src_app_admin_layout_tsx_0gttrt6._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_admin_layout_tsx_0gttrt6._.js");
      case "server/chunks/ssr/[root-of-the-server]__0037ylb._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0037ylb._.js");
      case "server/chunks/ssr/_1763o27._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_1763o27._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_categories_page_actions_1t_6wtp.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_categories_page_actions_1t_6wtp.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1f3wetu.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1f3wetu.js");
      case "server/chunks/ssr/[root-of-the-server]__10k_ezs._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__10k_ezs._.js");
      case "server/chunks/ssr/_0s-nokn._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_0s-nokn._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_courses_page_actions_164dibr.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_courses_page_actions_164dibr.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_20bh0r0.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_20bh0r0.js");
      case "server/chunks/ssr/src_app_admin_courses_page_tsx_13u-w7p._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_admin_courses_page_tsx_13u-w7p._.js");
      case "server/chunks/ssr/[root-of-the-server]__0pxl2td._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0pxl2td._.js");
      case "server/chunks/ssr/_18p8c8g._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_18p8c8g._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_dashboard_page_actions_1fa04hu.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_dashboard_page_actions_1fa04hu.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0ahhoyh.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0ahhoyh.js");
      case "server/chunks/ssr/[root-of-the-server]__0u9ywsh._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0u9ywsh._.js");
      case "server/chunks/ssr/_0-vbo8a._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_0-vbo8a._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_documents_page_actions_1il4dil.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_documents_page_actions_1il4dil.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1c1uonc.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1c1uonc.js");
      case "server/chunks/ssr/[root-of-the-server]__1awjiya._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1awjiya._.js");
      case "server/chunks/ssr/_03xzlfr._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_03xzlfr._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_notifications_page_actions_19c_uz8.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_notifications_page_actions_19c_uz8.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0w0bxt0.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0w0bxt0.js");
      case "server/chunks/ssr/[root-of-the-server]__0e5ai1f._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0e5ai1f._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_page_actions_1mcickz.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_page_actions_1mcickz.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_16g38in.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_16g38in.js");
      case "server/chunks/ssr/[root-of-the-server]__1s6vyk5._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1s6vyk5._.js");
      case "server/chunks/ssr/_1okihf2._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_1okihf2._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_roles_page_actions_0bst8r-.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_roles_page_actions_0bst8r-.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1wulvhr.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1wulvhr.js");
      case "server/chunks/ssr/[root-of-the-server]__13vo_z5._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__13vo_z5._.js");
      case "server/chunks/ssr/_11ap_qe._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_11ap_qe._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_settings_page_actions_1roqeui.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_settings_page_actions_1roqeui.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0j77a6g.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0j77a6g.js");
      case "server/chunks/ssr/[root-of-the-server]__01tnaad._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__01tnaad._.js");
      case "server/chunks/ssr/_1u26vlw._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_1u26vlw._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_useful-sites_page_actions_1g-2s1r.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_useful-sites_page_actions_1g-2s1r.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1i1hv2t.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1i1hv2t.js");
      case "server/chunks/ssr/[root-of-the-server]__026v0mm._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__026v0mm._.js");
      case "server/chunks/ssr/_09nua__._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_09nua__._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_users_page_actions_1j4t7lq.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_users_page_actions_1j4t7lq.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1767nd1.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1767nd1.js");
      case "server/chunks/ssr/[root-of-the-server]__0sp-3t3._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0sp-3t3._.js");
      case "server/chunks/ssr/_0-s2-40._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_0-s2-40._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_workshops_page_actions_1yjfgd0.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_workshops_page_actions_1yjfgd0.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1aqpjea.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1aqpjea.js");
      case "server/chunks/ssr/src_app_admin_workshops_page_tsx_01vq_77._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_admin_workshops_page_tsx_01vq_77._.js");
      case "server/chunks/[externals]_next_dist_0iuj5m_._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[externals]_next_dist_0iuj5m_._.js");
      case "server/chunks/[root-of-the-server]__0xuaoik._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0xuaoik._.js");
      case "server/chunks/[turbopack]_runtime.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[turbopack]_runtime.js");
      case "server/chunks/_next-internal_server_app_api_v1_ai_chat_route_actions_1rj1qxw.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_ai_chat_route_actions_1rj1qxw.js");
      case "server/chunks/node_modules_next_dist_esm_build_templates_app-route_130swlg.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/node_modules_next_dist_esm_build_templates_app-route_130swlg.js");
      case "server/chunks/[root-of-the-server]__09kelfr._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__09kelfr._.js");
      case "server/chunks/_0fzu4-t._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_0fzu4-t._.js");
      case "server/chunks/_next-internal_server_app_api_v1_badges_[id]_route_actions_0-rq30e.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_badges_[id]_route_actions_0-rq30e.js");
      case "server/chunks/[root-of-the-server]__0xny2e7._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0xny2e7._.js");
      case "server/chunks/_next-internal_server_app_api_v1_badges_route_actions_1yc2jke.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_badges_route_actions_1yc2jke.js");
      case "server/chunks/[root-of-the-server]__0e7249r._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0e7249r._.js");
      case "server/chunks/_next-internal_server_app_api_v1_categories_[id]_route_actions_1c-kc60.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_categories_[id]_route_actions_1c-kc60.js");
      case "server/chunks/[root-of-the-server]__0dkkx_j._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0dkkx_j._.js");
      case "server/chunks/_next-internal_server_app_api_v1_categories_route_actions_16l3-ol.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_categories_route_actions_16l3-ol.js");
      case "server/chunks/[root-of-the-server]__1jjkrij._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1jjkrij._.js");
      case "server/chunks/_next-internal_server_app_api_v1_courses_[id]_lessons_route_actions_18pwltp.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_courses_[id]_lessons_route_actions_18pwltp.js");
      case "server/chunks/[root-of-the-server]__1f5jki9._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1f5jki9._.js");
      case "server/chunks/_next-internal_server_app_api_v1_courses_[id]_route_actions_0d__2dg.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_courses_[id]_route_actions_0d__2dg.js");
      case "server/chunks/[root-of-the-server]__15cj81n._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__15cj81n._.js");
      case "server/chunks/_next-internal_server_app_api_v1_courses_route_actions_1w1jlkg.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_courses_route_actions_1w1jlkg.js");
      case "server/chunks/[root-of-the-server]__10s374o._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__10s374o._.js");
      case "server/chunks/_next-internal_server_app_api_v1_documents_[id]_route_actions_1uf-euj.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_documents_[id]_route_actions_1uf-euj.js");
      case "server/chunks/[root-of-the-server]__0fjrz5l._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0fjrz5l._.js");
      case "server/chunks/_next-internal_server_app_api_v1_documents_route_actions_0d5ffz-.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_documents_route_actions_0d5ffz-.js");
      case "server/chunks/[root-of-the-server]__17bx8km._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__17bx8km._.js");
      case "server/chunks/_next-internal_server_app_api_v1_lessons_[id]_route_actions_1e2a9ne.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_lessons_[id]_route_actions_1e2a9ne.js");
      case "server/chunks/[root-of-the-server]__0xsaw-m._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0xsaw-m._.js");
      case "server/chunks/_next-internal_server_app_api_v1_notifications_[id]_read_route_actions_16snvg2.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_notifications_[id]_read_route_actions_16snvg2.js");
      case "server/chunks/[root-of-the-server]__0-e_3_1._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0-e_3_1._.js");
      case "server/chunks/_next-internal_server_app_api_v1_notifications_route_actions_1jv34bk.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_notifications_route_actions_1jv34bk.js");
      case "server/chunks/1oeh_server_app_api_v1_progress_course_[courseId]_route_actions_01k7m84.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/1oeh_server_app_api_v1_progress_course_[courseId]_route_actions_01k7m84.js");
      case "server/chunks/[root-of-the-server]__18rokdz._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__18rokdz._.js");
      case "server/chunks/[root-of-the-server]__11bl6ko._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__11bl6ko._.js");
      case "server/chunks/_next-internal_server_app_api_v1_progress_document_route_actions_0_t6u21.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_progress_document_route_actions_0_t6u21.js");
      case "server/chunks/[root-of-the-server]__0rgn9uc._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0rgn9uc._.js");
      case "server/chunks/_next-internal_server_app_api_v1_progress_lesson_route_actions_0l_7hcy.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_progress_lesson_route_actions_0l_7hcy.js");
      case "server/chunks/[root-of-the-server]__17r-63q._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__17r-63q._.js");
      case "server/chunks/_next-internal_server_app_api_v1_progress_profile_route_actions_0ct3a-u.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_progress_profile_route_actions_0ct3a-u.js");
      case "server/chunks/[root-of-the-server]__0-mjrd9._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0-mjrd9._.js");
      case "server/chunks/_next-internal_server_app_api_v1_progress_workshop_route_actions_03vlv_0.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_progress_workshop_route_actions_03vlv_0.js");
      case "server/chunks/[root-of-the-server]__0ahxq9b._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0ahxq9b._.js");
      case "server/chunks/_next-internal_server_app_api_v1_quizzes_course_[courseId]_route_actions_0a7iyty.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_quizzes_course_[courseId]_route_actions_0a7iyty.js");
      case "server/chunks/[root-of-the-server]__00jyd0o._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__00jyd0o._.js");
      case "server/chunks/_next-internal_server_app_api_v1_quizzes_submit_route_actions_0f19xmv.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_quizzes_submit_route_actions_0f19xmv.js");
      case "server/chunks/[root-of-the-server]__1zk1izr._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1zk1izr._.js");
      case "server/chunks/_next-internal_server_app_api_v1_stats_totals_route_actions_16sry8y.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_stats_totals_route_actions_16sry8y.js");
      case "server/chunks/[root-of-the-server]__0ko_4hk._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0ko_4hk._.js");
      case "server/chunks/_next-internal_server_app_api_v1_upload_route_actions_1msn9x3.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_upload_route_actions_1msn9x3.js");
      case "server/chunks/[root-of-the-server]__14z_goo._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__14z_goo._.js");
      case "server/chunks/_next-internal_server_app_api_v1_useful-sites_[id]_route_actions_1yqjud6.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_useful-sites_[id]_route_actions_1yqjud6.js");
      case "server/chunks/[root-of-the-server]__1lv4jvs._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1lv4jvs._.js");
      case "server/chunks/_next-internal_server_app_api_v1_useful-sites_route_actions_1pt7x-m.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_useful-sites_route_actions_1pt7x-m.js");
      case "server/chunks/[root-of-the-server]__16ndpqs._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__16ndpqs._.js");
      case "server/chunks/_next-internal_server_app_api_v1_user_stats_route_actions_1bp7nkn.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_user_stats_route_actions_1bp7nkn.js");
      case "server/chunks/[root-of-the-server]__033hcer._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__033hcer._.js");
      case "server/chunks/_next-internal_server_app_api_v1_users_[id]_route_actions_20gsbnm.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_users_[id]_route_actions_20gsbnm.js");
      case "server/chunks/[root-of-the-server]__0suqrpo._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0suqrpo._.js");
      case "server/chunks/_next-internal_server_app_api_v1_users_route_actions_16ybbrb.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_users_route_actions_16ybbrb.js");
      case "server/chunks/[root-of-the-server]__0b9ap5r._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0b9ap5r._.js");
      case "server/chunks/_next-internal_server_app_api_v1_workshops_[id]_route_actions_1kp-i-z.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_workshops_[id]_route_actions_1kp-i-z.js");
      case "server/chunks/[root-of-the-server]__1kxdlej._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1kxdlej._.js");
      case "server/chunks/_next-internal_server_app_api_v1_workshops_route_actions_0yls5l7.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_v1_workshops_route_actions_0yls5l7.js");
      case "server/chunks/_next-internal_server_app_favicon_ico_route_actions_0g2jjls.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_favicon_ico_route_actions_0g2jjls.js");
      case "server/chunks/node_modules_next_dist_esm_build_templates_app-route_12f2k_b.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/node_modules_next_dist_esm_build_templates_app-route_12f2k_b.js");
      case "server/chunks/ssr/[root-of-the-server]__14gt-ae._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__14gt-ae._.js");
      case "server/chunks/ssr/_00lv940._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_00lv940._.js");
      case "server/chunks/ssr/_next-internal_server_app_marketing_(auth)_forgot-password_page_actions_1fgywaj.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_marketing_(auth)_forgot-password_page_actions_1fgywaj.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_09_l8zp.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_09_l8zp.js");
      case "server/chunks/ssr/src_app_marketing_(auth)_layout_tsx_07pfr7_._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_marketing_(auth)_layout_tsx_07pfr7_._.js");
      case "server/chunks/ssr/[root-of-the-server]__214l1hr._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__214l1hr._.js");
      case "server/chunks/ssr/_0xl7qqa._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_0xl7qqa._.js");
      case "server/chunks/ssr/_next-internal_server_app_marketing_(auth)_login_page_actions_17nqpgs.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_marketing_(auth)_login_page_actions_17nqpgs.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_160lzdm.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_160lzdm.js");
      case "server/chunks/ssr/[root-of-the-server]__0_5minw._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0_5minw._.js");
      case "server/chunks/ssr/_12i6wlv._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_12i6wlv._.js");
      case "server/chunks/ssr/_1uo8b2v._.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_1uo8b2v._.js");
      case "server/chunks/ssr/_next-internal_server_app_marketing_page_actions_13r73ll.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_marketing_page_actions_13r73ll.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1ws_rxi.js": return require("/home/runner/work/siento-os/siento-os/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1ws_rxi.js");
      default:
        throw new Error(`Not found ${chunkPath}`);
    }
  }


  async function loadWasmChunk(chunkPath) {
    switch (chunkPath) {

      default:
        throw new Error(`Unknown wasm chunk: ${chunkPath}`);
    }
  }
