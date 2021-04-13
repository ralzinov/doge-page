// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"node_modules/txtgen/dist/txtgen.min.js":[function(require,module,exports) {
var define;
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// txtgen@2.2.8, by @ndaidong - built on Sun, 08 Nov 2020 08:54:01 GMT - published under MIT license
!function (e, n) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? n(exports) : "function" == typeof define && define.amd ? define(["exports"], n) : n((e = "undefined" != typeof globalThis ? globalThis : e || self).txtgen = {});
}(this, function (e) {
  var n = new Date().getTimezoneOffset(),
      t = (function () {
    var e = Math.abs(n / 60);
    ["GMT", n < 0 ? "+" : "-", String(e).padStart(4, "0")].join("");
  }(), function () {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return _toConsumableArray(new Set(e));
  });
  var a = ["alligator", "ant", "bear", "bee", "bird", "camel", "cat", "cheetah", "chicken", "chimpanzee", "cow", "crocodile", "deer", "dog", "dolphin", "duck", "eagle", "elephant", "fish", "fly", "fox", "frog", "giraffe", "goat", "goldfish", "hamster", "hippopotamus", "horse", "kangaroo", "kitten", "lion", "lobster", "monkey", "octopus", "owl", "panda", "pig", "puppy", "rabbit", "rat", "scorpion", "seal", "shark", "sheep", "snail", "snake", "spider", "squirrel", "tiger", "turtle", "wolf", "zebra", "apple", "apricot", "banana", "blackberry", "blueberry", "cherry", "cranberry", "currant", "fig", "grape", "grapefruit", "grapes", "kiwi", "kumquat", "lemon", "lime", "melon", "nectarine", "orange", "peach", "pear", "persimmon", "pineapple", "plum", "pomegranate", "prune", "raspberry", "strawberry", "tangerine", "watermelon"],
      i = ["adaptable", "adventurous", "affable", "affectionate", "agreeable", "alert", "alluring", "ambitious", "ambitious", "amiable", "amicable", "amused", "amusing", "boundless", "brave", "brave", "bright", "bright", "broad-minded", "calm", "calm", "capable", "careful", "charming", "charming", "cheerful", "coherent", "comfortable", "communicative", "compassionate", "confident", "conscientious", "considerate", "convivial", "cooperative", "courageous", "courageous", "courteous", "creative", "credible", "cultured", "dashing", "dazzling", "debonair", "decisive", "decisive", "decorous", "delightful", "detailed", "determined", "determined", "diligent", "diligent", "diplomatic", "discreet", "discreet", "dynamic", "dynamic", "eager", "easygoing", "efficient", "elated", "eminent", "emotional", "enchanting", "encouraging", "endurable", "energetic", "energetic", "entertaining", "enthusiastic", "enthusiastic", "excellent", "excited", "exclusive", "exuberant", "exuberant", "fabulous", "fair", "fair-minded", "faithful", "faithful", "fantastic", "fearless", "fearless", "fine", "forceful", "frank", "frank", "friendly", "friendly", "funny", "funny", "generous", "generous", "gentle", "gentle", "glorious", "good", "good", "gregarious", "happy", "hard-working", "harmonious", "helpful", "helpful", "hilarious", "honest", "honorable", "humorous", "imaginative", "impartial", "impartial", "independent", "industrious", "instinctive", "intellectual", "intelligent", "intuitive", "inventive", "jolly", "joyous", "kind", "kind", "kind-hearted", "knowledgeable", "level", "likeable", "lively", "lovely", "loving", "loving", "loyal", "lucky", "mature", "modern", "modest", "neat", "nice", "nice", "obedient", "optimistic", "painstaking", "passionate", "patient", "peaceful", "perfect", "persistent", "philosophical", "pioneering", "placid", "placid", "plausible", "pleasant", "plucky", "plucky", "polite", "powerful", "practical", "pro-active", "productive", "protective", "proud", "punctual", "quick-witted", "quiet", "quiet", "rational", "receptive", "reflective", "reliable", "relieved", "reserved", "resolute", "resourceful", "responsible", "rhetorical", "righteous", "romantic", "romantic", "sedate", "seemly", "selective", "self-assured", "self-confident", "self-disciplined", "sensible", "sensitive", "sensitive", "shrewd", "shy", "silly", "sincere", "sincere", "skillful", "smiling", "sociable", "splendid", "steadfast", "stimulating", "straightforward", "successful", "succinct", "sympathetic", "talented", "thoughtful", "thoughtful", "thrifty", "tidy", "tough", "tough", "trustworthy", "unassuming", "unbiased", "understanding", "unusual", "upbeat", "versatile", "vigorous", "vivacious", "warm", "warmhearted", "willing", "willing", "wise", "witty", "witty", "wonderful"],
      o = ["a", "e", "i", "o", "u", "y"],
      s = ["the {{noun}} is {{a_noun}}", "{{a_noun}} is {{an_adjective}} {{noun}}", "the first {{adjective}} {{noun}} is, in its own way, {{a_noun}}", "their {{noun}} was, in this moment, {{an_adjective}} {{noun}}", "{{a_noun}} is {{a_noun}} from the right perspective", "the literature would have us believe that {{an_adjective}} {{noun}} is not but {{a_noun}}", "{{an_adjective}} {{noun}} is {{a_noun}} of the mind", "the {{adjective}} {{noun}} reveals itself as {{an_adjective}} {{noun}} to those who look", "authors often misinterpret the {{noun}} as {{an_adjective}} {{noun}}, when in actuality it feels more like {{an_adjective}} {{noun}}", "we can assume that any instance of {{a_noun}} can be construed as {{an_adjective}} {{noun}}", "they were lost without the {{adjective}} {{noun}} that composed their {{noun}}", "the {{adjective}} {{noun}} comes from {{an_adjective}} {{noun}}", "{{a_noun}} can hardly be considered {{an_adjective}} {{noun}} without also being {{a_noun}}", "few can name {{an_adjective}} {{noun}} that isn't {{an_adjective}} {{noun}}", "some posit the {{adjective}} {{noun}} to be less than {{adjective}}", "{{a_noun}} of the {{noun}} is assumed to be {{an_adjective}} {{noun}}", "{{a_noun}} sees {{a_noun}} as {{an_adjective}} {{noun}}", "the {{noun}} of {{a_noun}} becomes {{an_adjective}} {{noun}}", "{{a_noun}} is {{a_noun}}'s {{noun}}", "{{a_noun}} is the {{noun}} of {{a_noun}}", "{{an_adjective}} {{noun}}'s {{noun}} comes with it the thought that the {{adjective}} {{noun}} is {{a_noun}}", "{{nouns}} are {{adjective}} {{nouns}}", "{{adjective}} {{nouns}} show us how {{nouns}} can be {{nouns}}", "before {{nouns}}, {{nouns}} were only {{nouns}}", "those {{nouns}} are nothing more than {{nouns}}", "some {{adjective}} {{nouns}} are thought of simply as {{nouns}}", "one cannot separate {{nouns}} from {{adjective}} {{nouns}}", "the {{nouns}} could be said to resemble {{adjective}} {{nouns}}", "{{an_adjective}} {{noun}} without {{nouns}} is truly a {{noun}} of {{adjective}} {{nouns}}"],
      r = ["to be more specific, ", "in recent years, ", "however, ", "by the way", "of course, ", "some assert that ", "if this was somewhat unclear, ", "unfortunately, that is wrong; on the contrary, ", "it's very tricky, if not impossible, ", "this could be, or perhaps ", "this is not to discredit the idea that ", "we know that ", "it's an undeniable fact, really; ", "framed in a different way, ", "what we don't know for sure is whether or not ", "as far as we can estimate, ", "as far as he is concerned, ", "the zeitgeist contends that ", "though we assume the latter, ", "far from the truth, ", "extending this logic, ", "nowhere is it disputed that ", "in modern times ", "in ancient times ", "recent controversy aside, ", "washing and polishing the car,", "having been a gymnast, ", "after a long day at school and work, ", "waking to the buzz of the alarm clock, ", "draped neatly on a hanger, ", "shouting with happiness, "];
  var u;

  var l = function l(e) {
    u = e;
  };

  l(Math.random);

  var c = function c() {
    return u();
  },
      d = function d(e, n) {
    var t = e,
        a = n - e + 1;
    return Math.floor(c() * a) + t;
  },
      h = function h(e) {
    var n;

    for (; !n;) {
      n = e[d(0, e.length - 1)];
    }

    return n;
  },
      g = function g(e) {
    var n = "a";
    return e.match(/^(a|e|i|o)/) && (n = "an"), "".concat(n, " ").concat(e);
  },
      p = ["noun", "a_noun", "nouns", "adjective", "an_adjective"],
      f = {
    noun: function noun() {
      return h(a);
    },
    a_noun: function a_noun() {
      return g(h(a));
    },
    nouns: function nouns() {
      return (e = h(a)).endsWith("s") ? e : (e.match(/(ss|ish|ch|x|us)$/) ? e += "e" : e.endsWith("y") && !o.includes(e.charAt(e.length - 2)) && (e = e.slice(0, e.length - 1), e += "ie"), e + "s");
      var e;
    },
    adjective: function adjective() {
      return h(i);
    },
    an_adjective: function an_adjective() {
      return g(h(i));
    }
  },
      m = function m() {
    return function (e) {
      var n = e;
      var t = e.match(/\{\{(.+?)\}\}/g);
      if (t && t.length) for (var _e = 0; _e < t.length; _e++) {
        var _a = t[_e].replace("{{", "").replace("}}", "").replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").replace(/\r?\n|\r/g, " ").replace(/\s\s+|\r/g, " ");

        var _i = void 0;

        p.includes(_a) && (_i = f[_a]()), n = n.replace(t[_e], _i);
      }
      return n;
    }(h(s));
  },
      v = function v() {
    var e = (c() < .33 ? h(r) : "") + m();
    return e = e.charAt(0).toUpperCase() + e.slice(1), e += function () {
      var e = ".......!?!?;...".split("");
      return h(e);
    }(), e;
  },
      b = function b() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    e || (e = d(3, 10));
    var n = Math.min(e, 15),
        t = [];

    for (; t.length < n;) {
      var _e2 = v();

      t.push(_e2);
    }

    return t.join(" ");
  };

  e.addAdjectives = function () {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var n = i.concat(e);
    return (i = t(n)).length;
  }, e.addNouns = function () {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var n = a.concat(e);
    return (a = t(n)).length;
  }, e.addTemplates = function () {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var n = s.concat(e);
    return (s = t(n)).length;
  }, e.article = function () {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    e || (e = d(3, 10));
    var n = Math.min(e, 15),
        t = [];

    for (; t.length < n;) {
      var _e3 = b();

      t.push(_e3);
    }

    return t.join("\n\n");
  }, e.getAdjectives = function () {
    return _toConsumableArray(i);
  }, e.getNouns = function () {
    return _toConsumableArray(a);
  }, e.getTemplates = function () {
    return _toConsumableArray(s);
  }, e.paragraph = b, e.sentence = v, e.setAdjectives = function () {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return (i = t(e)).length;
  }, e.setNouns = function () {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return (a = t(e)).length;
  }, e.setRandom = l, e.setTemplates = function () {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return (s = t(e)).length;
  }, Object.defineProperty(e, "__esModule", {
    value: !0
  });
});
},{}],"node_modules/pluralize/pluralize.js":[function(require,module,exports) {
var define;
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* global define */
(function (root, pluralize) {
  /* istanbul ignore else */
  if (typeof require === 'function' && (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && (typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object') {
    // Node.
    module.exports = pluralize();
  } else if (typeof define === 'function' && define.amd) {
    // AMD, registers as an anonymous module.
    define(function () {
      return pluralize();
    });
  } else {
    // Browser global.
    root.pluralize = pluralize();
  }
})(this, function () {
  // Rule storage - pluralize and singularize need to be run sequentially,
  // while other rules can be optimized using an object for instant lookups.
  var pluralRules = [];
  var singularRules = [];
  var uncountables = {};
  var irregularPlurals = {};
  var irregularSingles = {};
  /**
   * Sanitize a pluralization rule to a usable regular expression.
   *
   * @param  {(RegExp|string)} rule
   * @return {RegExp}
   */

  function sanitizeRule(rule) {
    if (typeof rule === 'string') {
      return new RegExp('^' + rule + '$', 'i');
    }

    return rule;
  }
  /**
   * Pass in a word token to produce a function that can replicate the case on
   * another word.
   *
   * @param  {string}   word
   * @param  {string}   token
   * @return {Function}
   */


  function restoreCase(word, token) {
    // Tokens are an exact match.
    if (word === token) return token; // Lower cased words. E.g. "hello".

    if (word === word.toLowerCase()) return token.toLowerCase(); // Upper cased words. E.g. "WHISKY".

    if (word === word.toUpperCase()) return token.toUpperCase(); // Title cased words. E.g. "Title".

    if (word[0] === word[0].toUpperCase()) {
      return token.charAt(0).toUpperCase() + token.substr(1).toLowerCase();
    } // Lower cased words. E.g. "test".


    return token.toLowerCase();
  }
  /**
   * Interpolate a regexp string.
   *
   * @param  {string} str
   * @param  {Array}  args
   * @return {string}
   */


  function interpolate(str, args) {
    return str.replace(/\$(\d{1,2})/g, function (match, index) {
      return args[index] || '';
    });
  }
  /**
   * Replace a word using a rule.
   *
   * @param  {string} word
   * @param  {Array}  rule
   * @return {string}
   */


  function replace(word, rule) {
    return word.replace(rule[0], function (match, index) {
      var result = interpolate(rule[1], arguments);

      if (match === '') {
        return restoreCase(word[index - 1], result);
      }

      return restoreCase(match, result);
    });
  }
  /**
   * Sanitize a word by passing in the word and sanitization rules.
   *
   * @param  {string}   token
   * @param  {string}   word
   * @param  {Array}    rules
   * @return {string}
   */


  function sanitizeWord(token, word, rules) {
    // Empty string or doesn't need fixing.
    if (!token.length || uncountables.hasOwnProperty(token)) {
      return word;
    }

    var len = rules.length; // Iterate over the sanitization rules and use the first one to match.

    while (len--) {
      var rule = rules[len];
      if (rule[0].test(word)) return replace(word, rule);
    }

    return word;
  }
  /**
   * Replace a word with the updated word.
   *
   * @param  {Object}   replaceMap
   * @param  {Object}   keepMap
   * @param  {Array}    rules
   * @return {Function}
   */


  function replaceWord(replaceMap, keepMap, rules) {
    return function (word) {
      // Get the correct token and case restoration functions.
      var token = word.toLowerCase(); // Check against the keep object map.

      if (keepMap.hasOwnProperty(token)) {
        return restoreCase(word, token);
      } // Check against the replacement map for a direct word replacement.


      if (replaceMap.hasOwnProperty(token)) {
        return restoreCase(word, replaceMap[token]);
      } // Run all the rules against the word.


      return sanitizeWord(token, word, rules);
    };
  }
  /**
   * Check if a word is part of the map.
   */


  function checkWord(replaceMap, keepMap, rules, bool) {
    return function (word) {
      var token = word.toLowerCase();
      if (keepMap.hasOwnProperty(token)) return true;
      if (replaceMap.hasOwnProperty(token)) return false;
      return sanitizeWord(token, token, rules) === token;
    };
  }
  /**
   * Pluralize or singularize a word based on the passed in count.
   *
   * @param  {string}  word      The word to pluralize
   * @param  {number}  count     How many of the word exist
   * @param  {boolean} inclusive Whether to prefix with the number (e.g. 3 ducks)
   * @return {string}
   */


  function pluralize(word, count, inclusive) {
    var pluralized = count === 1 ? pluralize.singular(word) : pluralize.plural(word);
    return (inclusive ? count + ' ' : '') + pluralized;
  }
  /**
   * Pluralize a word.
   *
   * @type {Function}
   */


  pluralize.plural = replaceWord(irregularSingles, irregularPlurals, pluralRules);
  /**
   * Check if a word is plural.
   *
   * @type {Function}
   */

  pluralize.isPlural = checkWord(irregularSingles, irregularPlurals, pluralRules);
  /**
   * Singularize a word.
   *
   * @type {Function}
   */

  pluralize.singular = replaceWord(irregularPlurals, irregularSingles, singularRules);
  /**
   * Check if a word is singular.
   *
   * @type {Function}
   */

  pluralize.isSingular = checkWord(irregularPlurals, irregularSingles, singularRules);
  /**
   * Add a pluralization rule to the collection.
   *
   * @param {(string|RegExp)} rule
   * @param {string}          replacement
   */

  pluralize.addPluralRule = function (rule, replacement) {
    pluralRules.push([sanitizeRule(rule), replacement]);
  };
  /**
   * Add a singularization rule to the collection.
   *
   * @param {(string|RegExp)} rule
   * @param {string}          replacement
   */


  pluralize.addSingularRule = function (rule, replacement) {
    singularRules.push([sanitizeRule(rule), replacement]);
  };
  /**
   * Add an uncountable word rule.
   *
   * @param {(string|RegExp)} word
   */


  pluralize.addUncountableRule = function (word) {
    if (typeof word === 'string') {
      uncountables[word.toLowerCase()] = true;
      return;
    } // Set singular and plural references for the word.


    pluralize.addPluralRule(word, '$0');
    pluralize.addSingularRule(word, '$0');
  };
  /**
   * Add an irregular word definition.
   *
   * @param {string} single
   * @param {string} plural
   */


  pluralize.addIrregularRule = function (single, plural) {
    plural = plural.toLowerCase();
    single = single.toLowerCase();
    irregularSingles[single] = plural;
    irregularPlurals[plural] = single;
  };
  /**
   * Irregular rules.
   */


  [// Pronouns.
  ['I', 'we'], ['me', 'us'], ['he', 'they'], ['she', 'they'], ['them', 'them'], ['myself', 'ourselves'], ['yourself', 'yourselves'], ['itself', 'themselves'], ['herself', 'themselves'], ['himself', 'themselves'], ['themself', 'themselves'], ['is', 'are'], ['was', 'were'], ['has', 'have'], ['this', 'these'], ['that', 'those'], // Words ending in with a consonant and `o`.
  ['echo', 'echoes'], ['dingo', 'dingoes'], ['volcano', 'volcanoes'], ['tornado', 'tornadoes'], ['torpedo', 'torpedoes'], // Ends with `us`.
  ['genus', 'genera'], ['viscus', 'viscera'], // Ends with `ma`.
  ['stigma', 'stigmata'], ['stoma', 'stomata'], ['dogma', 'dogmata'], ['lemma', 'lemmata'], ['schema', 'schemata'], ['anathema', 'anathemata'], // Other irregular rules.
  ['ox', 'oxen'], ['axe', 'axes'], ['die', 'dice'], ['yes', 'yeses'], ['foot', 'feet'], ['eave', 'eaves'], ['goose', 'geese'], ['tooth', 'teeth'], ['quiz', 'quizzes'], ['human', 'humans'], ['proof', 'proofs'], ['carve', 'carves'], ['valve', 'valves'], ['looey', 'looies'], ['thief', 'thieves'], ['groove', 'grooves'], ['pickaxe', 'pickaxes'], ['passerby', 'passersby']].forEach(function (rule) {
    return pluralize.addIrregularRule(rule[0], rule[1]);
  });
  /**
   * Pluralization rules.
   */

  [[/s?$/i, 's'], [/[^\u0000-\u007F]$/i, '$0'], [/([^aeiou]ese)$/i, '$1'], [/(ax|test)is$/i, '$1es'], [/(alias|[^aou]us|t[lm]as|gas|ris)$/i, '$1es'], [/(e[mn]u)s?$/i, '$1s'], [/([^l]ias|[aeiou]las|[ejzr]as|[iu]am)$/i, '$1'], [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1i'], [/(alumn|alg|vertebr)(?:a|ae)$/i, '$1ae'], [/(seraph|cherub)(?:im)?$/i, '$1im'], [/(her|at|gr)o$/i, '$1oes'], [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i, '$1a'], [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i, '$1a'], [/sis$/i, 'ses'], [/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i, '$1$2ves'], [/([^aeiouy]|qu)y$/i, '$1ies'], [/([^ch][ieo][ln])ey$/i, '$1ies'], [/(x|ch|ss|sh|zz)$/i, '$1es'], [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, '$1ices'], [/\b((?:tit)?m|l)(?:ice|ouse)$/i, '$1ice'], [/(pe)(?:rson|ople)$/i, '$1ople'], [/(child)(?:ren)?$/i, '$1ren'], [/eaux$/i, '$0'], [/m[ae]n$/i, 'men'], ['thou', 'you']].forEach(function (rule) {
    return pluralize.addPluralRule(rule[0], rule[1]);
  });
  /**
   * Singularization rules.
   */

  [[/s$/i, ''], [/(ss)$/i, '$1'], [/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i, '$1fe'], [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, '$1f'], [/ies$/i, 'y'], [/\b([pl]|zomb|(?:neck|cross)?t|coll|faer|food|gen|goon|group|lass|talk|goal|cut)ies$/i, '$1ie'], [/\b(mon|smil)ies$/i, '$1ey'], [/\b((?:tit)?m|l)ice$/i, '$1ouse'], [/(seraph|cherub)im$/i, '$1'], [/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:her|at|gr)o|[aeiou]ris)(?:es)?$/i, '$1'], [/(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i, '$1sis'], [/(movie|twelve|abuse|e[mn]u)s$/i, '$1'], [/(test)(?:is|es)$/i, '$1is'], [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1us'], [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i, '$1um'], [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i, '$1on'], [/(alumn|alg|vertebr)ae$/i, '$1a'], [/(cod|mur|sil|vert|ind)ices$/i, '$1ex'], [/(matr|append)ices$/i, '$1ix'], [/(pe)(rson|ople)$/i, '$1rson'], [/(child)ren$/i, '$1'], [/(eau)x?$/i, '$1'], [/men$/i, 'man']].forEach(function (rule) {
    return pluralize.addSingularRule(rule[0], rule[1]);
  });
  /**
   * Uncountable rules.
   */

  [// Singular words with no plurals.
  'adulthood', 'advice', 'agenda', 'aid', 'aircraft', 'alcohol', 'ammo', 'analytics', 'anime', 'athletics', 'audio', 'bison', 'blood', 'bream', 'buffalo', 'butter', 'carp', 'cash', 'chassis', 'chess', 'clothing', 'cod', 'commerce', 'cooperation', 'corps', 'debris', 'diabetes', 'digestion', 'elk', 'energy', 'equipment', 'excretion', 'expertise', 'firmware', 'flounder', 'fun', 'gallows', 'garbage', 'graffiti', 'hardware', 'headquarters', 'health', 'herpes', 'highjinks', 'homework', 'housework', 'information', 'jeans', 'justice', 'kudos', 'labour', 'literature', 'machinery', 'mackerel', 'mail', 'media', 'mews', 'moose', 'music', 'mud', 'manga', 'news', 'only', 'personnel', 'pike', 'plankton', 'pliers', 'police', 'pollution', 'premises', 'rain', 'research', 'rice', 'salmon', 'scissors', 'series', 'sewage', 'shambles', 'shrimp', 'software', 'species', 'staff', 'swine', 'tennis', 'traffic', 'transportation', 'trout', 'tuna', 'wealth', 'welfare', 'whiting', 'wildebeest', 'wildlife', 'you', /pok[eé]mon$/i, // Regexes.
  /[^aeiou]ese$/i, // "chinese", "japanese"
  /deer$/i, // "deer", "reindeer"
  /fish$/i, // "fish", "blowfish", "angelfish"
  /measles$/i, /o[iu]s$/i, // "carnivorous"
  /pox$/i, // "chickpox", "smallpox"
  /sheep$/i].forEach(pluralize.addUncountableRule);
  return pluralize;
});
},{}],"node_modules/nouns/index.js":[function(require,module,exports) {
const nouns = [
  "aardvark",
  "abacus",
  "abbey",
  "abdomen",
  "ability",
  "abolishment",
  "abroad",
  "abuse",
  "accelerant",
  "accelerator",
  "access",
  "accident",
  "accommodation",
  "accompanist",
  "accordion",
  "account",
  "accountant",
  "achiever",
  "acid",
  "acknowledgment",
  "acoustic",
  "acoustics",
  "acrylic",
  "act",
  "action",
  "activity",
  "actor",
  "actress",
  "acupuncture",
  "ad",
  "adapter",
  "addiction",
  "addition",
  "address",
  "adjustment",
  "administration",
  "adrenalin",
  "adult",
  "adulthood",
  "advance",
  "advancement",
  "advantage",
  "advertisement",
  "advertising",
  "advice",
  "affair",
  "affect",
  "aftermath",
  "afternoon",
  "aftershave",
  "aftershock",
  "afterthought",
  "age",
  "agency",
  "agenda",
  "agent",
  "aggression",
  "aglet",
  "agreement",
  "aid",
  "air",
  "airbag",
  "airbus",
  "airfare",
  "airforce",
  "airline",
  "airmail",
  "airplane",
  "airport",
  "airship",
  "alarm",
  "alb",
  "albatross",
  "alcohol",
  "alcove",
  "alder",
  "algebra",
  "alibi",
  "allergist",
  "alley",
  "alligator",
  "alloy",
  "almanac",
  "almond",
  "alpaca",
  "alpenglow",
  "alpenhorn",
  "alpha",
  "alphabet",
  "alternative",
  "altitude",
  "alto",
  "aluminium",
  "aluminum",
  "ambassador",
  "ambition",
  "ambulance",
  "amendment",
  "amount",
  "amusement",
  "anagram",
  "analgesia",
  "analog",
  "analogue",
  "analogy",
  "analysis",
  "analyst",
  "anatomy",
  "anesthesiology",
  "anethesiologist",
  "anger",
  "angiosperm",
  "angle",
  "angora",
  "angstrom",
  "anguish",
  "animal",
  "anime",
  "ankle",
  "anklet",
  "annual",
  "anorak",
  "answer",
  "ant",
  "anteater",
  "antechamber",
  "antelope",
  "anthony",
  "anthropology",
  "antler",
  "anxiety",
  "anybody",
  "anything",
  "anywhere",
  "apartment",
  "ape",
  "aperitif",
  "apology",
  "apparatus",
  "apparel",
  "appeal",
  "appearance",
  "appendix",
  "applause",
  "apple",
  "applewood",
  "appliance",
  "application",
  "appointment",
  "approval",
  "apron",
  "apse",
  "aquifer",
  "arch",
  "archaeology",
  "archeology",
  "archer",
  "architect",
  "architecture",
  "arch-rival",
  "area",
  "argument",
  "arithmetic",
  "arm",
  "armadillo",
  "armament",
  "armchair",
  "armoire",
  "armor",
  "arm-rest",
  "army",
  "arrival",
  "arrow",
  "art",
  "artichoke",
  "article",
  "artificer",
  "ascot",
  "ash",
  "ashram",
  "ashtray",
  "aside",
  "ask",
  "asparagus",
  "aspect",
  "asphalt",
  "assignment",
  "assist",
  "assistance",
  "assistant",
  "associate",
  "association",
  "assumption",
  "asterisk",
  "astrakhan",
  "astrolabe",
  "astrologer",
  "astrology",
  "astronomy",
  "atelier",
  "athlete",
  "athletics",
  "atmosphere",
  "atom",
  "atrium",
  "attachment",
  "attack",
  "attempt",
  "attendant",
  "attention",
  "attenuation",
  "attic",
  "attitude",
  "attorney",
  "attraction",
  "audience",
  "auditorium",
  "aunt",
  "author",
  "authorisation",
  "authority",
  "authorization",
  "automaton",
  "avalanche",
  "avenue",
  "average",
  "award",
  "awareness",
  "azimuth",
  "babe",
  "baboon",
  "babushka",
  "baby",
  "back",
  "backbone",
  "backdrop",
  "background",
  "backpack",
  "bacon",
  "bad",
  "badge",
  "badger",
  "bafflement",
  "bag",
  "bagel",
  "baggage",
  "bagpipe",
  "bail",
  "bait",
  "bake",
  "baker",
  "bakery",
  "bakeware",
  "balaclava",
  "balalaika",
  "balance",
  "balcony",
  "ball",
  "ballet",
  "balloon",
  "ballpark",
  "bamboo",
  "banana",
  "band",
  "bandana",
  "bandanna",
  "bandolier",
  "bangle",
  "banjo",
  "bank",
  "bankbook",
  "banker",
  "banquette",
  "baobab",
  "bar",
  "barbeque",
  "barber",
  "barbiturate",
  "barge",
  "baritone",
  "barium",
  "barn",
  "barometer",
  "barracks",
  "barstool",
  "base",
  "baseball",
  "basement",
  "basin",
  "basis",
  "basket",
  "basketball",
  "bass",
  "bassinet",
  "bassoon",
  "bat",
  "bath",
  "bather",
  "bathhouse",
  "bathrobe",
  "bathroom",
  "bathtub",
  "batter",
  "battery",
  "batting",
  "battle",
  "battleship",
  "bay",
  "bayou",
  "beach",
  "bead",
  "beak",
  "beam",
  "bean",
  "beanie",
  "beanstalk",
  "bear",
  "beard",
  "beast",
  "beat",
  "beautiful",
  "beauty",
  "beaver",
  "bed",
  "bedroom",
  "bee",
  "beech",
  "beef",
  "beer",
  "beet",
  "beetle",
  "beggar",
  "beginner",
  "beginning",
  "begonia",
  "behavior",
  "beheading",
  "behest",
  "being",
  "belfry",
  "belief",
  "believe",
  "bell",
  "belligerency",
  "bellows",
  "belly",
  "belt",
  "bench",
  "bend",
  "beneficiary",
  "benefit",
  "bengal",
  "beret",
  "berry",
  "bestseller",
  "best-seller",
  "bet",
  "beverage",
  "beyond",
  "bibliography",
  "bicycle",
  "bid",
  "bidet",
  "bifocals",
  "big",
  "big-rig",
  "bijou",
  "bike",
  "bikini",
  "bill",
  "billboard",
  "bin",
  "biology",
  "biplane",
  "birch",
  "bird",
  "birdbath",
  "birdcage",
  "birdhouse",
  "bird-watcher",
  "birth",
  "birthday",
  "bit",
  "bite",
  "bitter",
  "black",
  "blackberry",
  "blackboard",
  "blackfish",
  "bladder",
  "blade",
  "blame",
  "blank",
  "blanket",
  "blazer",
  "blight",
  "blind",
  "blinker",
  "blister",
  "blizzard",
  "block",
  "blocker",
  "blood",
  "bloodflow",
  "bloom",
  "bloomers",
  "blossom",
  "blouse",
  "blow",
  "blowgun",
  "blowhole",
  "blue",
  "blueberry",
  "boar",
  "board",
  "boat",
  "boat-building",
  "boatload",
  "boatyard",
  "bobcat",
  "body",
  "bog",
  "bolero",
  "bolt",
  "bomb",
  "bomber",
  "bondsman",
  "bone",
  "bongo",
  "bonnet",
  "bonsai",
  "bonus",
  "boogeyman",
  "book",
  "bookcase",
  "bookend",
  "booklet",
  "booster",
  "boot",
  "bootee",
  "bootie",
  "boots",
  "booty",
  "border",
  "bore",
  "bosom",
  "boss",
  "botany",
  "bother",
  "bottle",
  "bottling",
  "bottom",
  "bottom-line",
  "boudoir",
  "bough",
  "boundary",
  "bow",
  "bower",
  "bowl",
  "bowler",
  "bowling",
  "bowtie",
  "box",
  "boxer",
  "boxspring",
  "boy",
  "boyfriend",
  "bra",
  "brace",
  "bracelet",
  "bracket",
  "brain",
  "brake",
  "branch",
  "brand",
  "brandy",
  "brass",
  "brassiere",
  "bratwurst",
  "brave",
  "bread",
  "breadcrumb",
  "break",
  "breakfast",
  "breakpoint",
  "breast",
  "breastplate",
  "breath",
  "breeze",
  "bribery",
  "brick",
  "bricklaying",
  "bridge",
  "brief",
  "briefs",
  "brilliant",
  "british",
  "broad",
  "broccoli",
  "brochure",
  "broiler",
  "broker",
  "brome",
  "bronchitis",
  "bronco",
  "bronze",
  "brooch",
  "brood",
  "brook",
  "broom",
  "brother",
  "brother-in-law",
  "brow",
  "brown",
  "brush",
  "brushfire",
  "brushing",
  "bubble",
  "bucket",
  "buckle",
  "bud",
  "buddy",
  "budget",
  "buffer",
  "buffet",
  "bug",
  "buggy",
  "bugle",
  "building",
  "bulb",
  "bull",
  "bulldozer",
  "bullet",
  "bull-fighter",
  "bumper",
  "bun",
  "bunch",
  "bungalow",
  "bunghole",
  "bunkhouse",
  "burglar",
  "burlesque",
  "burn",
  "burn-out",
  "burst",
  "bus",
  "bush",
  "business",
  "bust",
  "bustle",
  "butane",
  "butcher",
  "butter",
  "button",
  "buy",
  "buyer",
  "buzzard",
  "cabana",
  "cabbage",
  "cabin",
  "cabinet",
  "cable",
  "caboose",
  "cacao",
  "cactus",
  "caddy",
  "cadet",
  "cafe",
  "caftan",
  "cake",
  "calcification",
  "calculation",
  "calculator",
  "calculus",
  "calendar",
  "calf",
  "calico",
  "call",
  "calm",
  "camel",
  "cameo",
  "camera",
  "camp",
  "campaign",
  "campanile",
  "can",
  "canal",
  "cancel",
  "cancer",
  "candelabra",
  "candidate",
  "candle",
  "candy",
  "cane",
  "cannon",
  "canoe",
  "canon",
  "canopy",
  "canteen",
  "canvas",
  "cap",
  "cape",
  "capital",
  "capitulation",
  "capon",
  "cappelletti",
  "cappuccino",
  "captain",
  "caption",
  "car",
  "caravan",
  "carbon",
  "card",
  "cardboard",
  "cardigan",
  "care",
  "career",
  "cargo",
  "carload",
  "carnation",
  "carol",
  "carotene",
  "carp",
  "carpenter",
  "carpet",
  "carport",
  "carriage",
  "carrier",
  "carrot",
  "carry",
  "cart",
  "cartilage",
  "cartload",
  "cartoon",
  "cartridge",
  "cascade",
  "case",
  "casement",
  "cash",
  "cashier",
  "casino",
  "casserole",
  "cassock",
  "cast",
  "castanet",
  "castanets",
  "castle",
  "cat",
  "catacomb",
  "catamaran",
  "catch",
  "category",
  "caterpillar",
  "cathedral",
  "catsup",
  "cattle",
  "cauliflower",
  "cause",
  "caution",
  "cave",
  "c-clamp",
  "cd",
  "ceiling",
  "celebration",
  "celeriac",
  "celery",
  "celeste",
  "cell",
  "cellar",
  "cello",
  "celsius",
  "cement",
  "cemetery",
  "cenotaph",
  "census",
  "cent",
  "center",
  "centimeter",
  "centurion",
  "century",
  "cephalopod",
  "ceramic",
  "cereal",
  "certification",
  "cesspool",
  "chafe",
  "chain",
  "chainstay",
  "chair",
  "chairlift",
  "chairman",
  "chairperson",
  "chaise",
  "chalet",
  "chalice",
  "chalk",
  "challenge",
  "champion",
  "championship",
  "chance",
  "chandelier",
  "change",
  "channel",
  "chaos",
  "chap",
  "chapel",
  "chapter",
  "character",
  "chard",
  "charge",
  "charity",
  "charlatan",
  "charles",
  "charm",
  "chart",
  "chastity",
  "chasuble",
  "chateau",
  "chauffeur",
  "chauvinist",
  "check",
  "checkroom",
  "cheek",
  "cheetah",
  "chef",
  "chemical",
  "chemistry",
  "cheque",
  "cherries",
  "cherry",
  "chess",
  "chest",
  "chick",
  "chicken",
  "chicory",
  "chief",
  "chiffonier",
  "child",
  "childhood",
  "children",
  "chill",
  "chime",
  "chimpanzee",
  "chin",
  "chino",
  "chip",
  "chipmunk",
  "chit-chat",
  "chivalry",
  "chive",
  "chocolate",
  "choice",
  "choker",
  "chop",
  "chopstick",
  "chord",
  "chowder",
  "chrome",
  "chromolithograph",
  "chronograph",
  "chronometer",
  "chub",
  "chug",
  "church",
  "churn",
  "cicada",
  "cigarette",
  "cinema",
  "circle",
  "circulation",
  "circumference",
  "cirrus",
  "citizenship",
  "city",
  "civilisation",
  "claim",
  "clam",
  "clank",
  "clapboard",
  "clarinet",
  "clasp",
  "class",
  "classic",
  "classroom",
  "clause",
  "clave",
  "clavicle",
  "clavier",
  "cleaner",
  "cleat",
  "cleavage",
  "clef",
  "cleric",
  "clerk",
  "click",
  "client",
  "cliff",
  "climate",
  "climb",
  "clip",
  "clipper",
  "cloak",
  "cloakroom",
  "clock",
  "clockwork",
  "clogs",
  "cloister",
  "close",
  "closet",
  "cloth",
  "clothes",
  "clothing",
  "cloud",
  "cloudburst",
  "cloudy",
  "clove",
  "clover",
  "club",
  "clue",
  "clutch",
  "coach",
  "coal",
  "coast",
  "coat",
  "cob",
  "cobweb",
  "cockpit",
  "cockroach",
  "cocktail",
  "cocoa",
  "cod",
  "code",
  "codon",
  "codpiece",
  "coevolution",
  "coffee",
  "coffin",
  "coil",
  "coin",
  "coinsurance",
  "coke",
  "cold",
  "coliseum",
  "collar",
  "collection",
  "college",
  "collision",
  "colloquia",
  "colon",
  "colonisation",
  "colony",
  "color",
  "colt",
  "column",
  "columnist",
  "comb",
  "combat",
  "combination",
  "combine",
  "comfort",
  "comfortable",
  "comic",
  "comma",
  "command",
  "comment",
  "commerce",
  "commercial",
  "commission",
  "committee",
  "common",
  "communicant",
  "communication",
  "community",
  "company",
  "comparison",
  "compassion",
  "competition",
  "competitor",
  "complaint",
  "complement",
  "complex",
  "component",
  "comportment",
  "composer",
  "composition",
  "compost",
  "comprehension",
  "compulsion",
  "computer",
  "comradeship",
  "concentrate",
  "concept",
  "concern",
  "concert",
  "conclusion",
  "concrete",
  "condition",
  "condominium",
  "condor",
  "conductor",
  "cone",
  "confectionery",
  "conference",
  "confidence",
  "confirmation",
  "conflict",
  "confusion",
  "conga",
  "congo",
  "congress",
  "congressman",
  "congressperson",
  "conifer",
  "connection",
  "consent",
  "consequence",
  "consideration",
  "consist",
  "console",
  "consonant",
  "conspirator",
  "constant",
  "constellation",
  "construction",
  "consul",
  "consulate",
  "contact",
  "contact lens",
  "contagion",
  "content",
  "contest",
  "context",
  "continent",
  "contract",
  "contrail",
  "contrary",
  "contribution",
  "control",
  "convection",
  "conversation",
  "convert",
  "convertible",
  "cook",
  "cookie",
  "cooking",
  "coonskin",
  "cope",
  "cop-out",
  "copper",
  "co-producer",
  "copy",
  "copyright",
  "copywriter",
  "cord",
  "corduroy",
  "cork",
  "cormorant",
  "corn",
  "corner",
  "cornerstone",
  "cornet",
  "corral",
  "correspondent",
  "corridor",
  "corruption",
  "corsage",
  "cost",
  "costume",
  "cot",
  "cottage",
  "cotton",
  "couch",
  "cougar",
  "cough",
  "council",
  "councilman",
  "councilor",
  "councilperson",
  "count",
  "counter",
  "counter-force",
  "countess",
  "country",
  "county",
  "couple",
  "courage",
  "course",
  "court",
  "cousin",
  "covariate",
  "cover",
  "coverall",
  "cow",
  "cowbell",
  "cowboy",
  "crab",
  "crack",
  "cracker",
  "crackers",
  "cradle",
  "craft",
  "craftsman",
  "crash",
  "crate",
  "cravat",
  "craw",
  "crawdad",
  "crayfish",
  "crayon",
  "crazy",
  "cream",
  "creative",
  "creator",
  "creature",
  "creche",
  "credenza",
  "credit",
  "creditor",
  "creek",
  "creme brulee",
  "crest",
  "crew",
  "crib",
  "cribbage",
  "cricket",
  "cricketer",
  "crime",
  "criminal",
  "crinoline",
  "criteria",
  "criterion",
  "criticism",
  "crocodile",
  "crocus",
  "croissant",
  "crook",
  "crop",
  "cross",
  "cross-contamination",
  "cross-stitch",
  "crotch",
  "croup",
  "crow",
  "crowd",
  "crown",
  "crude",
  "crush",
  "cry",
  "crystallography",
  "cub",
  "cuckoo",
  "cucumber",
  "cuff-links",
  "cultivar",
  "cultivator",
  "culture",
  "culvert",
  "cummerbund",
  "cup",
  "cupboard",
  "cupcake",
  "cupola",
  "curio",
  "curl",
  "curler",
  "currency",
  "current",
  "cursor",
  "curtain",
  "curve",
  "cushion",
  "custard",
  "customer",
  "cut",
  "cuticle",
  "cutlet",
  "cutover",
  "cutting",
  "cyclamen",
  "cycle",
  "cyclone",
  "cylinder",
  "cymbal",
  "cymbals",
  "cynic",
  "cyst",
  "cytoplasm",
  "dad",
  "daffodil",
  "dagger",
  "dahlia",
  "daisy",
  "damage",
  "dame",
  "dance",
  "dancer",
  "dancing",
  "danger",
  "daniel",
  "dare",
  "dark",
  "dart",
  "dash",
  "dashboard",
  "data",
  "database",
  "date",
  "daughter",
  "david",
  "day",
  "daybed",
  "dead",
  "deadline",
  "deal",
  "dealer",
  "dear",
  "death",
  "deathwatch",
  "debate",
  "debt",
  "debtor",
  "decade",
  "decimal",
  "decision",
  "deck",
  "declination",
  "decongestant",
  "decrease",
  "decryption",
  "dedication",
  "deep",
  "deer",
  "defense",
  "deficit",
  "definition",
  "deformation",
  "degree",
  "delay",
  "delete",
    "delight",
  "delivery",
  "demand",
  "demur",
  "den",
  "denim",
  "dentist",
  "deodorant",
  "department",
  "departure",
  "dependent",
  "deployment",
  "deposit",
  "depression",
  "depressive",
  "depth",
  "deputy",
  "derby",
  "derrick",
  "description",
  "desert",
  "design",
  "designer",
  "desire",
  "desk",
  "dessert",
  "destiny",
  "destroyer",
  "destruction",
  "detail",
  "detainment",
  "detective",
  "detention",
  "determination",
  "development",
  "deviance",
  "device",
  "devil",
  "dew",
  "dhow",
  "diadem",
  "diamond",
  "diaphragm",
  "diarist",
  "dibble",
  "dickey",
  "dictaphone",
  "diction",
  "dictionary",
  "diet",
  "difference",
  "differential",
  "difficulty",
  "dig",
  "digestion",
  "digger",
  "digital",
  "dignity",
  "dilapidation",
  "dill",
  "dime",
  "dimension",
  "dimple",
  "diner",
  "dinghy",
  "dinner",
  "dinosaur",
  "diploma",
  "dipstick",
  "direction",
  "director",
  "dirndl",
  "dirt",
  "disadvantage",
  "disarmament",
  "disaster",
  "discipline",
  "disco",
  "disconnection",
  "discount",
  "discovery",
  "discrepancy",
  "discussion",
  "disease",
  "disembodiment",
  "disengagement",
  "disguise",
  "disgust",
  "dish",
  "dishes",
  "dishwasher",
  "disk",
  "display",
  "disposer",
  "distance",
  "distribution",
  "distributor",
  "district",
  "divan",
  "diver",
  "divide",
  "divider",
  "diving",
  "division",
  "dock",
  "doctor",
  "document",
  "doe",
  "dog",
  "dogsled",
  "dogwood",
  "doll",
  "dollar",
  "dolman",
  "dolphin",
  "domain",
  "donkey",
  "door",
  "doorknob",
  "doorpost",
  "dory",
  "dot",
  "double",
  "doubling",
  "doubt",
  "doubter",
  "downforce",
  "downgrade",
  "downtown",
  "draft",
  "drag",
  "dragon",
  "dragonfly",
  "dragster",
  "drain",
  "drake",
  "drama",
  "dramaturge",
  "draw",
  "drawbridge",
  "drawer",
  "drawing",
  "dream",
  "dredger",
  "dress",
  "dresser",
  "dressing",
  "drill",
  "drink",
  "drive",
  "driver",
  "driveway",
  "driving",
  "drizzle",
  "dromedary",
  "drop",
  "drug",
  "drum",
  "drummer",
  "drunk",
  "dry",
  "dryer",
  "duck",
  "duckling",
  "dud",
  "due",
  "duffel",
  "dugout",
  "dulcimer",
  "dumbwaiter",
  "dump",
  "dump truck",
  "dune buggy",
  "dungarees",
  "dungeon",
  "duplexer",
  "dust",
  "dust storm",
  "duster",
  "duty",
  "dwarf",
  "dwelling",
  "dynamo",
  "eagle",
  "ear",
  "eardrum",
  "earmuffs",
  "earplug",
  "earrings",
  "earth",
  "earthquake",
  "earthworm",
  "ease",
  "easel",
  "east",
  "eat",
  "eave",
  "eavesdropper",
  "e-book",
  "ecclesia",
  "eclipse",
  "ecliptic",
  "economics",
  "economy",
  "ecumenist",
  "eddy",
  "edge",
  "edger",
  "editor",
  "editorial",
  "education",
  "edward",
  "eel",
  "effacement",
  "effect",
  "effective",
  "efficacy",
  "efficiency",
  "effort",
  "egg",
  "egghead",
  "eggnog",
  "eggplant",
  "eight",
  "ejector",
  "elbow",
  "election",
  "electricity",
  "electrocardiogram",
  "element",
  "elephant",
  "elevator",
  "elixir",
  "elk",
  "ellipse",
  "elm",
  "elongation",
  "embossing",
  "emergence",
  "emergency",
  "emergent",
  "emery",
  "emotion",
  "emphasis",
  "employ",
  "employee",
  "employer",
  "employment",
  "empowerment",
  "emu",
  "encirclement",
  "encyclopedia",
  "end",
  "endothelium",
  "enemy",
  "energy",
  "engine",
  "engineer",
  "engineering",
  "enigma",
  "enjoyment",
  "enquiry",
  "entertainment",
  "enthusiasm",
  "entrance",
  "entry",
  "environment",
  "envy",
  "epauliere",
  "epee",
  "ephemera",
  "ephemeris",
  "epoch",
  "eponym",
  "epoxy",
  "equal",
  "equinox",
  "equipment",
  "equivalent",
  "era",
  "e-reader",
  "error",
  "escape",
  "ese",
  "espadrille",
  "espalier",
  "essay",
  "establishment",
  "estate",
  "estimate",
  "estrogen",
  "estuary",
  "ethernet",
  "ethics",
  "euphonium",
  "eurocentrism",
  "europe",
  "evaluator",
  "evening",
  "evening-wear",
  "event",
  "eviction",
  "evidence",
  "evocation",
  "evolution",
  "exam",
  "examination",
  "examiner",
  "example",
  "exchange",
  "excitement",
  "exclamation",
  "excuse",
  "executor",
  "exercise",
  "exhaust",
  "ex-husband",
  "exile",
  "existence",
  "exit",
  "expansion",
  "expansionism",
  "experience",
  "expert",
  "explanation",
  "exposition",
  "expression",
  "extension",
  "extent",
  "external",
  "extreme",
  "ex-wife",
  "eye",
  "eyeball",
  "eyebrow",
  "eyebrows",
  "eyeglasses",
  "eyelash",
  "eyelashes",
  "eyelid",
  "eyelids",
  "eyeliner",
  "eyestrain",
  "face",
  "facelift",
  "facet",
  "facilities",
  "facsimile",
  "fact",
  "factor",
  "factory",
  "faculty",
  "fahrenheit",
  "fail",
  "failure",
  "fairies",
  "fairy",
  "faith",
  "fall",
  "falling-out",
  "fame",
  "familiar",
  "family",
  "fan",
  "fang",
  "fanlight",
  "fanny",
  "fanny-pack",
  "farm",
  "farmer",
  "fascia",
  "fat",
  "father",
  "father-in-law",
  "fatigues",
  "faucet",
  "fault",
  "fawn",
  "fax",
  "fear",
  "feast",
  "feather",
  "feature",
  "fedelini",
  "fedora",
  "fee",
  "feed",
  "feedback",
  "feel",
  "feeling",
  "feet",
  "felony",
  "female",
  "fen",
  "fence",
  "fencing",
  "fender",
  "ferry",
  "ferryboat",
  "fertilizer",
  "few",
  "fiber",
  "fiberglass",
  "fibre",
  "fiction",
  "fiddle",
  "field",
  "fifth",
  "fight",
  "fighter",
  "figure",
  "figurine",
  "file",
  "fill",
  "filly",
  "film",
  "filth",
  "final",
  "finance",
  "find",
  "finding",
  "fine",
  "finger",
  "fingernail",
  "finish",
  "finisher",
  "fir",
  "fire",
  "fireman",
  "fireplace",
  "firewall",
  "fish",
  "fishbone",
  "fisherman",
  "fishery",
  "fishing",
  "fishmonger",
  "fishnet",
  "fisting",
  "fix",
  "fixture",
  "flag",
  "flame",
  "flanker",
  "flare",
  "flash",
  "flat",
  "flatboat",
  "flavor",
  "flax",
  "fleck",
  "fleece",
  "flesh",
  "flight",
  "flintlock",
  "flip-flops",
  "flock",
  "flood",
  "floor",
  "floozie",
  "flour",
  "flow",
  "flower",
  "flu",
  "flugelhorn",
  "fluke",
  "flute",
  "fly",
  "flytrap",
  "foam",
  "fob",
  "focus",
  "fog",
  "fold",
  "folder",
  "following",
  "fondue",
  "font",
  "food",
  "foot",
  "football",
  "footnote",
  "footrest",
  "foot-rest",
  "footstool",
  "foray",
  "force",
  "forearm",
  "forebear",
  "forecast",
  "forehead",
  "forest",
  "forestry",
  "forever",
  "forgery",
  "fork",
  "form",
  "formal",
  "format",
  "former",
  "fort",
  "fortnight",
  "fortress",
  "fortune",
  "forum",
  "foundation",
  "fountain",
  "fowl",
  "fox",
  "foxglove",
  "fragrance",
  "frame",
  "fratricide",
  "fraudster",
  "frazzle",
  "freckle",
  "freedom",
  "freeplay",
  "freeze",
  "freezer",
  "freight",
  "freighter",
  "freon",
  "fresco",
  "friction",
  "fridge",
  "friend",
  "friendship",
  "frigate",
  "fringe",
  "frock",
  "frog",
  "front",
  "frost",
  "frown",
  "fruit",
  "frustration",
  "fuel",
  "fulfillment",
  "full",
  "fun",
  "function",
  "fundraising",
  "funeral",
  "funny",
  "fur",
  "furnace",
  "furniture",
  "fusarium",
  "futon",
  "future",
  "gaffer",
  "gain",
  "gaiters",
  "gale",
  "gall-bladder",
  "gallery",
  "galley",
  "gallon",
  "galn",
  "galoshes",
  "game",
  "gamebird",
  "gamma-ray",
  "gander",
  "gap",
  "garage",
  "garb",
  "garbage",
  "garden",
  "garlic",
  "garment",
  "garter",
  "gas",
  "gasoline",
  "gastropod",
  "gate",
  "gateway",
  "gather",
  "gauge",
  "gauntlet",
  "gazebo",
  "gazelle",
  "gear",
  "gearshift",
  "geese",
  "gelding",
  "gem",
  "gemsbok",
  "gender",
  "gene",
  "general",
  "genetics",
  "geography",
  "geology",
  "geometry",
  "george",
  "geranium",
  "gerbil",
  "geyser",
  "gherkin",
  "ghost",
  "giant",
  "gift",
  "gigantism",
  "ginseng",
  "giraffe",
  "girdle",
  "girl",
  "girlfriend",
  "git",
  "give",
  "glad",
  "gladiolus",
  "gland",
  "glass",
  "glasses",
  "glen",
  "glider",
  "gliding",
  "glockenspiel",
  "glove",
  "gloves",
  "glue",
  "glut",
  "go",
  "goal",
  "goat",
  "gobbler",
  "god",
  "godmother",
  "goggles",
  "go-kart",
  "gold",
  "goldfish",
  "golf",
  "gondola",
  "gong",
  "good",
  "goodbye",
  "good-bye",
  "goodie",
  "goose",
  "gopher",
  "gore-tex",
  "gorilla",
  "gosling",
  "gossip",
  "governance",
  "government",
  "governor",
  "gown",
  "grab",
  "grab-bag",
  "grade",
  "grain",
  "gram",
  "grammar",
  "grand",
  "granddaughter",
  "grandfather",
  "grandmom",
  "grandmother",
  "grandson",
  "granny",
  "grape",
  "grapefruit",
  "graph",
  "graphic",
  "grass",
  "grasshopper",
  "grassland",
  "gratitude",
  "gray",
  "grease",
  "great",
  "great-grandfather",
  "great-grandmother",
  "greek",
  "green",
  "greenhouse",
  "grenade",
  "grey",
  "grief",
  "grill",
  "grip",
  "grit",
  "grocery",
  "ground",
  "group",
  "grouper",
  "grouse",
  "growth",
  "guarantee",
  "guard",
  "guess",
  "guest",
  "guestbook",
  "guidance",
  "guide",
  "guilt",
  "guilty",
  "guitar",
  "guitarist",
  "gum",
  "gumshoes",
  "gun",
  "gutter",
  "guy",
  "gym",
  "gymnast",
  "gymnastics",
  "gynaecology",
  "gyro",
  "habit",
  "hacienda",
  "hacksaw",
  "hackwork",
  "hail",
  "hair",
  "haircut",
  "half",
  "half-brother",
  "half-sister",
  "halibut",
  "hall",
  "hallway",
  "hamaki",
  "hamburger",
  "hammer",
  "hammock",
  "hamster",
  "hand",
  "handball",
  "hand-holding",
  "handicap",
  "handle",
  "handlebar",
  "handmaiden",
  "handsaw",
  "hang",
  "happiness",
  "harbor",
  "harbour",
  "hardboard",
  "hardcover",
  "hardening",
  "hardhat",
  "hard-hat",
  "hardware",
  "harm",
  "harmonica",
  "harmony",
  "harp",
  "harpooner",
  "harpsichord",
  "hassock",
  "hat",
  "hatbox",
  "hatchet",
  "hate",
  "hatred",
  "haunt",
  "haversack",
  "hawk",
  "hay",
  "head",
  "headlight",
  "headline",
  "headrest",
  "health",
  "hearing",
  "heart",
  "heartache",
  "hearth",
  "hearthside",
  "heart-throb",
  "heartwood",
  "heat",
  "heater",
  "heaven",
  "heavy",
  "hedge",
  "hedgehog",
  "heel",
  "height",
  "heirloom",
  "helen",
  "helicopter",
  "helium",
  "hell",
  "hellcat",
  "hello",
  "helmet",
  "helo",
  "help",
  "hemp",
  "hen",
  "herb",
  "heron",
  "herring",
  "hexagon",
  "heyday",
  "hide",
  "high",
  "highlight",
  "high-rise",
  "highway",
  "hill",
  "hip",
  "hippodrome",
  "hippopotamus",
  "hire",
  "history",
  "hit",
  "hive",
  "hobbies",
  "hobbit",
  "hobby",
  "hockey",
  "hoe",
  "hog",
  "hold",
  "hole",
  "holiday",
  "home",
  "homework",
  "homogenate",
  "homonym",
  "honesty",
  "honey",
  "honeybee",
  "honoree",
  "hood",
  "hoof",
  "hook",
  "hope",
  "hops",
  "horn",
  "hornet",
  "horror",
  "horse",
  "hose",
  "hosiery",
  "hospice",
  "hospital",
  "hospitality",
  "host",
  "hostel",
  "hostess",
  "hot",
  "hot-dog",
  "hotel",
  "hour",
  "hourglass",
  "house",
  "houseboat",
  "housework",
  "housing",
  "hovel",
  "hovercraft",
  "howitzer",
  "hub",
  "hubcap",
  "hugger",
  "human",
  "humidity",
  "humor",
  "humour",
  "hunger",
  "hunt",
  "hurdler",
  "hurricane",
  "hurry",
  "hurt",
  "husband",
  "hut",
  "hutch",
  "hyacinth",
  "hybridisation",
  "hydrant",
  "hydraulics",
  "hydrofoil",
  "hydrogen",
  "hyena",
  "hygienic",
  "hyphenation",
  "hypochondria",
  "hypothermia",
  "ice",
  "icebreaker",
  "icecream",
  "ice-cream",
  "icicle",
  "icon",
  "idea",
  "ideal",
  "if",
  "igloo",
  "ikebana",
  "illegal",
  "image",
  "imagination",
  "impact",
  "implement",
  "importance",
  "impress",
  "impression",
  "imprisonment",
  "improvement",
  "impudence",
  "impulse",
  "inbox",
  "incandescence",
  "inch",
  "incident",
  "income",
  "increase",
  "independence",
  "independent",
  "index",
  "indication",
  "indigence",
  "individual",
  "industry",
  "inevitable",
  "infancy",
  "inflammation",
  "inflation",
  "influence",
  "information",
  "infusion",
  "inglenook",
  "ingrate",
  "initial",
  "initiative",
  "in-joke",
  "injury",
  "injustice",
  "ink",
  "in-laws",
  "inlay",
  "inn",
  "innervation",
  "innocence",
  "innocent",
  "input",
  "inquiry",
  "inscription",
  "insect",
  "inside",
  "insolence",
  "inspection",
  "inspector",
  "instance",
  "instruction",
  "instrument",
  "instrumentalist",
  "instrumentation",
  "insulation",
  "insurance",
  "insurgence",
  "intelligence",
  "intention",
  "interaction",
  "interactive",
  "interest",
  "interferometer",
  "interior",
  "interloper",
  "internal",
  "international",
  "internet",
  "interpreter",
  "intervenor",
  "interview",
  "interviewer",
  "intestine",
  "intestines",
  "introduction",
  "invention",
  "inventor",
  "inventory",
  "investment",
  "invite",
  "invoice",
  "iridescence",
  "iris",
  "iron",
  "ironclad",
  "irony",
  "island",
  "issue",
  "it",
  "item",
  "jackal",
  "jacket",
  "jaguar",
  "jail",
  "jailhouse",
  "jam",
  "james",
  "jar",
  "jasmine",
  "jaw",
  "jealousy",
  "jeans",
  "jeep",
  "jeff",
  "jelly",
  "jellyfish",
  "jet",
  "jewel",
  "jewelry",
  "jiffy",
  "job",
  "jockey",
  "jodhpurs",
  "joey",
  "jogging",
  "join",
  "joint",
  "joke",
  "jot",
  "journey",
  "joy",
  "judge",
  "judgment",
  "judo",
  "juggernaut",
  "juice",
  "jumbo",
  "jump",
  "jumper",
  "jumpsuit",
  "junior",
  "junk",
  "junker",
  "junket",
  "jury",
  "justice",
  "jute",
  "kale",
  "kamikaze",
  "kangaroo",
  "karate",
  "karen",
  "kayak",
  "kazoo",
  "keep",
  "kendo",
  "ketch",
  "ketchup",
  "kettle",
  "kettledrum",
  "key",
  "keyboard",
  "keyboarding",
  "keystone",
  "kick",
  "kick-off",
  "kid",
  "kidney",
  "kidneys",
  "kielbasa",
  "kill",
  "kilogram",
  "kilometer",
  "kilt",
  "kimono",
  "kind",
  "kindness",
  "king",
  "kingfish",
  "kiosk",
  "kiss",
  "kitchen",
  "kite",
  "kitten",
  "kitty",
  "kleenex",
  "klomps",
  "knee",
  "kneejerk",
  "knickers",
  "knife",
  "knife-edge",
  "knight",
  "knitting",
  "knot",
  "knowledge",
  "knuckle",
  "koala",
  "kohlrabi",
  "lab",
  "laborer",
  "labour",
  "lace",
  "lack",
  "lacquerware",
  "ladder",
  "lady",
  "ladybug",
  "lake",
  "lamb",
  "lamp",
  "lan",
  "lanai",
  "land",
  "landform",
  "landmine",
  "landscape",
  "language",
  "lantern",
  "lap",
  "laparoscope",
  "lapdog",
  "laptop",
  "larch",
  "larder",
  "lark",
  "laryngitis",
  "lasagna",
  "latency",
  "latex",
  "lathe",
  "latte",
  "laugh",
  "laughter",
  "laundry",
  "lava",
  "law",
  "lawn",
  "lawsuit",
  "lawyer",
  "lay",
  "layer",
  "lead",
  "leader",
  "leadership",
  "leading",
  "leaf",
  "league",
  "leaker",
  "learning",
  "leash",
  "leather",
  "leave",
  "leaver",
  "lecture",
  "leek",
  "leg",
  "legal",
  "legging",
  "legume",
  "lei",
  "leisure",
  "lemon",
  "lemonade",
  "lemur",
  "length",
  "lentil",
  "leprosy",
  "lesson",
  "let",
  "letter",
  "lettuce",
  "level",
  "lever",
  "leverage",
  "license",
  "lie",
  "lier",
  "life",
  "lift",
  "light",
  "lighting",
  "lightning",
  "lilac",
  "lily",
  "limit",
  "limo",
  "line",
  "linen",
  "liner",
  "linguistics",
  "link",
  "linseed",
  "lion",
  "lip",
  "lipstick",
  "liquid",
  "liquor",
  "lisa",
  "list",
  "listen",
  "literature",
  "litigation",
  "litter",
  "liver",
  "livestock",
  "living",
  "lizard",
  "llama",
  "load",
  "loaf",
  "loafer",
  "loan",
  "lobotomy",
  "lobster",
  "local",
  "location",
  "lock",
  "locker",
  "locket",
  "locomotive",
  "locust",
  "loft",
  "log",
  "loggia",
  "logic",
  "loincloth",
  "loneliness",
  "long",
  "look",
  "loss",
  "lot",
  "lotion",
  "lounge",
  "lout",
  "love",
  "low",
  "loyalty",
  "luck",
  "luggage",
  "lumber",
  "lumberman",
  "lunch",
  "luncheonette",
  "lunchroom",
  "lung",
  "lunge",
  "lute",
  "luttuce",
  "lycra",
  "lye",
  "lymphocyte",
  "lynx",
  "lyocell",
  "lyre",
  "lyric",
  "macadamia",
  "macaroni",
  "machine",
  "machinery",
  "macrame",
  "macrofauna",
  "maelstrom",
  "maestro",
  "magazine",
  "magic",
  "maid",
  "maiden",
  "mail",
  "mailbox",
  "mailman",
  "main",
  "maintenance",
  "major",
  "major-league",
  "make",
  "makeup",
  "male",
  "mall",
  "mallet",
  "mambo",
  "mammoth",
  "man",
  "management",
  "manager",
  "mandarin",
  "mandolin",
  "mangrove",
  "manhunt",
  "maniac",
  "manicure",
  "mankind",
  "manner",
  "manor",
  "mansard",
  "manservant",
  "mansion",
  "mantel",
  "mantle",
  "mantua",
  "manufacturer",
  "manx",
  "many",
  "map",
  "maple",
  "maraca",
  "maracas",
  "marble",
  "mare",
  "margin",
  "mariachi",
  "marimba",
  "mark",
  "market",
  "marketing",
  "marksman",
  "marriage",
  "marsh",
  "marshland",
  "marxism",
  "mascara",
  "mask",
  "mass",
  "massage",
  "master",
  "mastication",
  "mastoid",
  "mat",
  "match",
  "mate",
  "material",
  "math",
  "mathematics",
  "matter",
  "mattock",
  "mattress",
  "maximum",
  "maybe",
  "mayonnaise",
  "mayor",
  "meal",
  "meaning",
  "measles",
  "measure",
  "measurement",
  "meat",
  "mechanic",
  "media",
  "medicine",
  "medium",
  "meet",
  "meeting",
  "megaliac",
  "melody",
  "member",
  "membership",
  "memory",
  "men",
  "menorah",
  "mention",
  "menu",
  "mercury",
  "mess",
  "message",
  "metal",
  "metallurgist",
  "meteor",
  "meteorology",
  "meter",
  "methane",
  "method",
  "methodology",
  "metro",
  "metronome",
  "mezzanine",
  "mice",
  "microlending",
  "microwave",
  "mid-course",
  "middle",
  "middleman",
  "midi",
  "midline",
  "midnight",
  "midwife",
  "might",
  "migrant",
  "mile",
  "milk",
  "milkshake",
  "millennium",
  "millimeter",
  "millisecond",
  "mime",
  "mimosa",
  "mind",
  "mine",
  "mini",
  "minibus",
  "minimum",
  "minion",
  "mini-skirt",
  "minister",
  "minor",
  "minor-league",
  "mint",
  "minute",
  "mirror",
  "miscarriage",
  "miscommunication",
  "misfit",
  "misogyny",
  "misplacement",
  "misreading",
  "miss",
  "missile",
  "mission",
  "mist",
  "mistake",
  "mister",
  "miter",
  "mitten",
  "mix",
  "mixer",
  "mixture",
  "moat",
  "mobile",
  "moccasins",
  "mocha",
  "mode",
  "model",
  "modem",
  "mole",
  "mom",
  "moment",
  "monastery",
  "monasticism",
  "money",
  "monger",
  "monitor",
  "monkey",
  "monocle",
  "monotheism",
  "monsoon",
  "monster",
  "month",
  "mood",
  "moon",
  "moonscape",
  "moonshine",
  "mop",
  "morning",
  "morsel",
  "mortgage",
  "mortise",
  "mosque",
  "mosquito",
  "most",
  "motel",
  "moth",
  "mother",
  "mother-in-law",
  "motion",
  "motor",
  "motorboat",
  "motorcar",
  "motorcycle",
  "mound",
  "mountain",
  "mouse",
  "mouser",
  "mousse",
  "moustache",
  "mouth",
  "mouton",
  "move",
  "mover",
  "movie",
  "mower",
  "mud",
  "mug",
  "mukluk",
  "mule",
  "multimedia",
  "muscle",
  "musculature",
  "museum",
  "music",
  "music-box",
  "music-making",
  "mustache",
  "mustard",
  "mutt",
  "mycoplasma",
  "n",
  "nail",
  "name",
  "naming",
  "nanoparticle",
  "napkin",
  "nasty",
  "nation",
  "national",
  "native",
  "natural",
  "naturalisation",
  "nature",
  "neat",
  "necessary",
  "neck",
  "necklace",
  "necktie",
  "need",
  "needle",
  "negative",
  "negligee",
  "negotiation",
  "neologism",
  "neon",
  "nephew",
  "nerve",
  "nest",
  "net",
  "netball",
  "netbook",
  "netsuke",
  "network",
  "neurobiologist",
  "neuropathologist",
  "neuropsychiatry",
  "news",
  "newspaper",
  "newsprint",
  "newsstand",
  "nexus",
  "nicety",
  "niche",
  "nickel",
  "niece",
  "night",
  "nightclub",
  "nightgown",
  "nightingale",
  "nightlight",
  "nitrogen",
  "nobody",
  "node",
  "noise",
  "nonbeliever",
  "nonconformist",
  "nondisclosure",
  "nonsense",
  "noodle",
  "normal",
  "norse",
  "north",
  "nose",
  "note",
  "notebook",
  "nothing",
  "notice",
  "notify",
  "notoriety",
  "nougat",
  "novel",
  "nudge",
  "number",
  "numeracy",
  "numeric",
  "numismatist",
  "nurse",
  "nursery",
  "nurture",
  "nut",
  "nutrition",
  "nylon",
  "oak",
  "oar",
  "oasis",
  "oatmeal",
  "obedience",
  "obesity",
  "obi",
  "object",
  "objective",
  "obligation",
  "oboe",
  "observation",
  "observatory",
  "occasion",
  "occupation",
  "ocean",
  "ocelot",
  "octagon",
  "octave",
  "octavo",
  "octet",
  "octopus",
  "odometer",
  "oeuvre",
  "offence",
  "offer",
  "office",
  "officer",
  "official",
  "off-ramp",
  "oil",
  "okra",
  "oldie",
  "olive",
  "omega",
  "omelet",
  "oncology",
  "one",
  "onion",
  "open",
  "opening",
  "opera",
  "operation",
  "ophthalmologist",
  "opinion",
  "opium",
  "opossum",
  "opportunist",
  "opportunity",
  "opposite",
  "option",
  "orange",
  "orangutan",
  "orator",
  "orchard",
  "orchestra",
  "orchid",
  "order",
  "ordinary",
  "ordination",
  "organ",
  "organisation",
  "organization",
  "original",
  "ornament",
  "osmosis",
  "osprey",
  "ostrich",
  "other",
  "others",
  "ott",
  "otter",
  "ounce",
  "outback",
  "outcome",
  "outfit",
  "outhouse",
  "outlay",
  "output",
  "outrigger",
  "outset",
  "outside",
  "oval",
  "ovary",
  "oven",
  "overcharge",
  "overclocking",
  "overcoat",
  "overexertion",
  "overflight",
  "overnighter",
  "overshoot",
  "owl",
  "owner",
  "ox",
  "oxen",
  "oxford",
  "oxygen",
  "oyster",
  "pace",
  "pacemaker",
  "pack",
  "package",
  "packet",
  "pad",
  "paddle",
  "paddock",
  "page",
  "pagoda",
  "pail",
  "pain",
  "paint",
  "painter",
  "painting",
  "paintwork",
  "pair",
  "pajama",
  "pajamas",
  "palm",
  "pamphlet",
  "pan",
  "pancake",
  "pancreas",
  "panda",
  "panic",
  "pannier",
  "panpipe",
  "pansy",
  "panther",
  "panties",
  "pantologist",
  "pantology",
  "pantry",
  "pants",
  "pantsuit",
  "panty",
  "pantyhose",
  "paper",
  "paperback",
  "parable",
  "parachute",
  "parade",
  "parallelogram",
  "paramedic",
  "parcel",
  "parchment",
  "pard",
  "parent",
  "parentheses",
  "park",
  "parka",
  "parking",
  "parrot",
  "parsnip",
  "part",
  "participant",
  "particle",
  "particular",
  "partner",
  "partridge",
  "party",
  "pass",
  "passage",
  "passbook",
  "passenger",
  "passion",
  "passive",
  "past",
  "pasta",
  "paste",
  "pastor",
  "pastoralist",
  "pastry",
  "patch",
  "path",
  "patience",
  "patient",
  "patina",
  "patio",
  "patriarch",
  "patricia",
  "patrimony",
  "patriot",
  "patrol",
  "pattern",
  "pause",
  "pavement",
  "pavilion",
  "paw",
  "pawnshop",
  "pay",
  "payee",
  "payment",
  "pea",
  "peace",
  "peach",
  "peacoat",
  "peacock",
  "peak",
  "peanut",
  "pear",
  "pearl",
  "pedal",
  "peen",
  "peer",
  "peer-to-peer",
  "pegboard",
  "pelican",
  "pelt",
  "pen",
  "penalty",
  "pencil",
  "pendant",
  "pendulum",
  "penicillin",
  "pension",
  "pentagon",
  "peony",
  "people",
  "pepper",
  "percentage",
  "perception",
  "perch",
  "performance",
  "perfume",
  "period",
  "periodical",
  "peripheral",
  "permafrost",
  "permission",
  "permit",
  "perp",
  "person",
  "personal",
  "personality",
  "perspective",
  "pest",
  "pet",
  "petal",
  "petticoat",
  "pew",
  "pha",
  "pharmacist",
  "pharmacopoeia",
  "phase",
  "pheasant",
  "philosopher",
  "philosophy",
  "phone",
  "photo",
  "photographer",
  "phrase",
  "physical",
  "physics",
  "pianist",
  "piano",
  "piccolo",
  "pick",
  "pickax",
  "picket",
  "pickle",
  "picture",
  "pie",
  "piece",
  "pier",
  "piety",
  "pig",
  "pigeon",
  "pike",
  "pile",
  "pilgrimage",
  "pillbox",
  "pillow",
  "pilot",
  "pimp",
  "pimple",
  "pin",
  "pinafore",
  "pince-nez",
  "pine",
  "pineapple",
  "pinecone",
  "ping",
  "pink",
  "pinkie",
  "pinstripe",
  "pint",
  "pinto",
  "pinworm",
  "pioneer",
  "pipe",
  "piracy",
  "piss",
  "pitch",
  "pitching",
  "pith",
  "pizza",
  "place",
  "plain",
  "plan",
  "plane",
  "planet",
  "plant",
  "plantation",
  "planter",
  "plaster",
  "plasterboard",
  "plastic",
  "plate",
  "platform",
  "platinum",
  "platypus",
  "play",
  "player",
  "playground",
  "playroom",
  "pleasure",
  "pleated",
  "plenty",
  "plier",
  "plot",
  "plough",
  "plover",
  "plow",
  "plowman",
  "plume",
  "plunger",
  "plywood",
  "pneumonia",
  "pocket",
  "pocketbook",
  "pocket-watch",
  "poem",
  "poet",
  "poetry",
  "poignance",
  "point",
  "poison",
  "poisoning",
  "pole",
  "polenta",
  "police",
  "policeman",
  "policy",
  "polish",
  "politics",
  "pollution",
  "polo",
  "polyester",
  "pompom",
  "poncho",
  "pond",
  "pony",
  "poof",
  "pool",
  "pop",
  "popcorn",
  "poppy",
  "popsicle",
  "population",
  "populist",
  "porch",
  "porcupine",
  "port",
  "porter",
  "portfolio",
  "porthole",
  "position",
  "positive",
  "possession",
  "possibility",
  "possible",
  "post",
  "postage",
  "postbox",
  "poster",
  "pot",
  "potato",
  "potential",
  "potty",
  "pouch",
  "poultry",
  "pound",
  "pounding",
  "poverty",
  "powder",
  "power",
  "practice",
  "precedent",
  "precipitation",
  "preface",
  "preference",
  "prelude",
  "premeditation",
  "premier",
  "preoccupation",
  "preparation",
  "presence",
  "present",
  "presentation",
  "president",
  "press",
  "pressroom",
  "pressure",
  "pressurisation",
  "price",
  "pride",
  "priest",
  "priesthood",
  "primary",
  "primate",
  "prince",
  "princess",
  "principal",
  "principle",
  "print",
  "printer",
  "prior",
  "priority",
  "prison",
  "private",
  "prize",
  "prizefight",
  "probation",
  "problem",
  "procedure",
  "process",
  "processing",
  "produce",
  "producer",
  "product",
  "production",
  "profession",
  "professional",
  "professor",
  "profile",
  "profit",
  "program",
  "progress",
  "project",
  "promise",
  "promotion",
  "prompt",
  "pronunciation",
  "proof",
  "proof-reader",
  "propane",
  "property",
  "proposal",
  "prose",
  "prosecution",
  "protection",
  "protest",
  "protocol",
  "prow",
  "pruner",
  "pseudoscience",
  "psychiatrist",
  "psychoanalyst",
  "psychologist",
  "psychology",
  "ptarmigan",
  "public",
  "publicity",
  "publisher",
  "pudding",
  "puddle",
  "puffin",
  "pull",
  "pulley",
  "puma",
  "pump",
  "pumpkin",
  "pumpkinseed",
  "punch",
  "punctuation",
  "punishment",
  "pupa",
  "pupil",
  "puppy",
  "purchase",
  "puritan",
  "purple",
  "purpose",
  "purse",
  "push",
  "pusher",
  "put",
  "pvc",
  "pyjama",
  "pyramid",
  "quadrant",
  "quail",
  "quality",
  "quantity",
  "quart",
  "quarter",
  "quartz",
  "queen",
  "question",
  "quicksand",
  "quiet",
  "quill",
  "quilt",
  "quince",
  "quit",
  "quiver",
  "quotation",
  "quote",
  "rabbi",
  "rabbit",
  "raccoon",
  "race",
  "racer",
  "racing",
  "racism",
  "racist",
  "rack",
  "radar",
  "radiator",
  "radio",
  "radiosonde",
  "radish",
  "raffle",
  "raft",
  "rag",
  "rage",
  "rail",
  "railway",
  "raiment",
  "rain",
  "rainbow",
  "raincoat",
  "rainmaker",
  "rainstorm",
  "raise",
  "rake",
  "ram",
  "rambler",
  "ramie",
  "ranch",
  "random",
  "randomisation",
  "range",
  "rank",
  "raspberry",
  "rat",
  "rate",
  "ratio",
  "raven",
  "ravioli",
  "raw",
  "rawhide",
  "ray",
  "rayon",
  "reach",
  "reactant",
  "reaction",
  "read",
  "reading",
  "reality",
  "reamer",
  "rear",
  "reason",
  "receipt",
  "reception",
  "recess",
  "recipe",
  "recliner",
  "recognition",
  "recommendation",
  "record",
  "recorder",
  "recording",
  "recover",
  "recreation",
  "recruit",
  "rectangle",
  "red",
  "redesign",
  "rediscovery",
  "reduction",
  "reef",
  "refectory",
  "reference",
  "reflection",
  "refrigerator",
  "refund",
  "refuse",
  "region",
  "register",
  "regret",
  "regular",
  "regulation",
  "reindeer",
  "reinscription",
  "reject",
  "relation",
  "relationship",
  "relative",
  "relaxation",
  "release",
  "reliability",
  "relief",
  "religion",
  "relish",
  "reminder",
  "remote",
  "remove",
  "rent",
  "repair",
  "reparation",
  "repeat",
  "replace",
  "replacement",
  "replication",
  "reply",
  "report",
  "representative",
  "reprocessing",
  "republic",
  "reputation",
  "request",
  "requirement",
  "resale",
  "research",
  "reserve",
  "resident",
  "resist",
  "resolution",
  "resolve",
  "resort",
  "resource",
  "respect",
  "respite",
  "respond",
  "response",
  "responsibility",
  "rest",
  "restaurant",
  "result",
  "retailer",
  "rethinking",
  "retina",
  "retouch",
  "return",
  "reveal",
  "revenant",
  "revenge",
  "revenue",
  "review",
  "revolution",
  "revolve",
  "revolver",
  "reward",
  "rheumatism",
  "rhinoceros",
  "rhyme",
  "rhythm",
  "rice",
  "rich",
  "riddle",
  "ride",
  "rider",
  "ridge",
  "rifle",
  "right",
  "rim",
  "ring",
  "ringworm",
  "rip",
  "ripple",
  "rise",
  "riser",
  "risk",
  "river",
  "riverbed",
  "rivulet",
  "road",
  "roadway",
  "roast",
  "robe",
  "robin",
  "rock",
  "rocker",
  "rocket",
  "rocket-ship",
  "rod",
  "role",
  "roll",
  "roller",
  "roof",
  "room",
  "rooster",
  "root",
  "rope",
  "rose",
  "rostrum",
  "rotate",
  "rough",
  "round",
  "roundabout",
  "route",
  "router",
  "routine",
  "row",
  "rowboat",
  "royal",
  "rub",
  "rubber",
  "rubbish",
  "rubric",
  "ruckus",
  "ruffle",
  "rugby",
  "ruin",
  "rule",
  "rum",
  "run",
  "runaway",
  "runner",
  "rush",
  "rutabaga",
  "ruth",
  "ry",
  "sabre",
  "sack",
  "sad",
  "saddle",
  "safe",
  "safety",
  "sage",
  "sail",
  "sailboat",
  "sailor",
  "salad",
  "salary",
  "sale",
  "salesman",
  "salmon",
  "salon",
  "saloon",
  "salt",
  "samovar",
  "sampan",
  "sample",
  "samurai",
  "sand",
  "sandals",
  "sandbar",
  "sandwich",
  "sardine",
  "sari",
  "sarong",
  "sash",
  "satellite",
  "satin",
  "satire",
  "satisfaction",
  "sauce",
  "sausage",
  "save",
  "saving",
  "savings",
  "savior",
  "saviour",
  "saw",
  "saxophone",
  "scale",
  "scallion",
  "scanner",
  "scarecrow",
  "scarf",
  "scarification",
  "scene",
  "scenery",
  "scent",
  "schedule",
  "scheme",
  "schizophrenic",
  "schnitzel",
  "school",
  "schoolhouse",
  "schooner",
  "science",
  "scimitar",
  "scissors",
  "scooter",
  "score",
  "scorn",
  "scow",
  "scraper",
  "scratch",
  "screamer",
  "screen",
  "screenwriting",
  "screw",
  "screwdriver",
  "screw-up",
  "scrim",
  "scrip",
  "script",
  "sculpting",
  "sculpture",
  "sea",
  "seafood",
  "seagull",
  "seal",
  "seaplane",
  "search",
  "seashore",
  "seaside",
  "season",
  "seat",
  "second",
  "secret",
  "secretariat",
  "secretary",
  "section",
  "sectional",
  "sector",
  "secure",
  "security",
  "seed",
  "seeder",
  "segment",
  "select",
  "selection",
  "self",
  "sell",
  "semicircle",
  "semicolon",
  "senator",
  "senior",
  "sense",
  "sensitive",
  "sentence",
  "sepal",
  "septicaemia",
  "series",
  "servant",
  "serve",
  "server",
  "service",
  "session",
  "set",
  "setting",
  "settler",
  "sewer",
  "sex",
  "shack",
  "shade",
  "shadow",
  "shadowbox",
  "shake",
  "shakedown",
  "shaker",
  "shallot",
  "shame",
  "shampoo",
  "shanty",
  "shape",
  "share",
  "shark",
  "sharon",
  "shawl",
  "she",
  "shearling",
  "shears",
  "sheath",
  "shed",
  "sheep",
  "sheet",
  "shelf",
  "shell",
  "shelter",
  "sherry",
  "shield",
  "shift",
  "shin",
  "shine",
  "shingle",
  "ship",
  "shirt",
  "shirtdress",
  "shoat",
  "shock",
  "shoe",
  "shoehorn",
  "shoe-horn",
  "shoelace",
  "shoemaker",
  "shoes",
  "shoestring",
  "shofar",
  "shoot",
  "shootdown",
  "shop",
  "shopper",
  "shopping",
  "shore",
  "shortage",
  "shorts",
  "shortwave",
  "shot",
  "shoulder",
  "shovel",
  "show",
  "shower",
  "show-stopper",
  "shred",
  "shrimp",
  "shrine",
  "sibling",
  "sick",
  "side",
  "sideboard",
  "sideburns",
  "sidecar",
  "sidestream",
  "sidewalk",
  "siding",
  "sign",
  "signal",
  "signature",
  "signet",
  "significance",
  "signup",
  "silence",
  "silica",
  "silk",
  "silkworm",
  "sill",
  "silly",
  "silo",
  "silver",
  "simple",
  "sing",
  "singer",
  "single",
  "sink",
  "sir",
  "sister",
  "sister-in-law",
  "sitar",
  "site",
  "situation",
  "size",
  "skate",
  "skiing",
  "skill",
  "skin",
  "skirt",
  "skull",
  "skullcap",
  "skullduggery",
  "skunk",
  "sky",
  "skylight",
  "skyscraper",
  "skywalk",
  "slapstick",
  "slash",
  "slave",
  "sled",
  "sledge",
  "sleep",
  "sleet",
  "sleuth",
  "slice",
  "slide",
  "slider",
  "slime",
  "slip",
  "slipper",
  "slippers",
  "slope",
  "sloth",
  "smash",
  "smell",
  "smelting",
  "smile",
  "smock",
  "smog",
  "smoke",
  "smoking",
  "smuggling",
  "snail",
  "snake",
  "snakebite",
  "sneakers",
  "sneeze",
  "snob",
  "snorer",
  "snow",
  "snowboarding",
  "snowflake",
  "snowman",
  "snowmobiling",
  "snowplow",
  "snowstorm",
  "snowsuit",
  "snuggle",
  "soap",
  "soccer",
  "society",
  "sociology",
  "sock",
  "socks",
  "soda",
  "sofa",
  "soft",
  "softball",
  "softdrink",
  "softening",
  "software",
  "soil",
  "soldier",
  "solid",
  "solitaire",
  "solution",
  "sombrero",
  "somersault",
  "somewhere",
  "son",
  "song",
  "songbird",
  "sonnet",
  "soot",
  "soprano",
  "sorbet",
  "sorrow",
  "sort",
  "soulmate",
  "sound",
  "soup",
  "source",
  "sourwood",
  "sousaphone",
  "south",
  "south america",
  "south korea",
  "sow",
  "soy",
  "soybean",
  "space",
  "spacing",
  "spade",
  "spaghetti",
  "spandex",
  "spank",
  "spare",
  "spark",
  "sparrow",
  "spasm",
  "speaker",
  "speakerphone",
  "spear",
  "special",
  "specialist",
  "specific",
  "spectacle",
  "spectacles",
  "spectrograph",
  "speech",
  "speed",
  "speedboat",
  "spell",
  "spelling",
  "spend",
  "sphere",
  "sphynx",
  "spider",
  "spike",
  "spinach",
  "spine",
  "spiral",
  "spirit",
  "spiritual",
  "spite",
  "spleen",
  "split",
  "sponge",
  "spoon",
  "sport",
  "spot",
  "spotlight",
  "spray",
  "spread",
  "spring",
  "sprinter",
  "sprout",
  "spruce",
  "spume",
  "spur",
  "spy",
  "square",
  "squash",
  "squatter",
  "squeegee",
  "squid",
  "squirrel",
  "stable",
  "stack",
  "stacking",
  "stadium",
  "staff",
  "stag",
  "stage",
  "stain",
  "stair",
  "staircase",
  "stallion",
  "stamen",
  "stamina",
  "stamp",
  "stance",
  "stand",
  "standard",
  "standoff",
  "star",
  "start",
  "starter",
  "state",
  "statement",
  "station",
  "station-wagon",
  "statistic",
  "status",
  "stay",
  "steak",
  "steal",
  "steam",
  "steamroller",
  "steel",
  "steeple",
  "stem",
  "stencil",
  "step",
  "step-aunt",
  "step-brother",
  "stepdaughter",
  "step-daughter",
  "step-father",
  "step-grandfather",
  "step-grandmother",
  "stepmother",
  "step-mother",
  "stepping-stone",
  "steps",
  "step-sister",
  "stepson",
  "step-son",
  "step-uncle",
  "stew",
  "stick",
  "stiletto",
  "still",
  "stinger",
  "stitch",
  "stock",
  "stocking",
  "stockings",
  "stock-in-trade",
  "stole",
  "stomach",
  "stone",
  "stonework",
  "stool",
  "stop",
  "stopsign",
  "stopwatch",
  "storage",
  "store",
  "storey",
  "storm",
  "story",
  "storyboard",
  "story-telling",
  "stove",
  "strain",
  "strait",
  "stranger",
  "strap",
  "strategy",
  "straw",
  "strawberry",
  "stream",
  "street",
  "streetcar",
  "strength",
  "stress",
  "stretch",
  "strike",
  "string",
  "strip",
  "stroke",
  "structure",
  "struggle",
  "stud",
  "student",
  "studio",
  "study",
  "stuff",
  "stumbling",
  "stupid",
  "stupidity",
  "sturgeon",
  "style",
  "styling",
  "stylus",
  "subcomponent",
  "subconscious",
  "subject",
  "submarine",
  "subroutine",
  "subsidence",
  "substance",
  "suburb",
  "subway",
  "success",
  "suck",
  "suede",
  "suffocation",
  "sugar",
  "suggestion",
  "suit",
  "suitcase",
  "sultan",
  "summer",
  "sun",
  "sunbeam",
  "sunbonnet",
  "sunday",
  "sundial",
  "sunflower",
  "sunglasses",
  "sunlamp",
  "sunroom",
  "sunshine",
  "supermarket",
  "supply",
  "support",
  "supporter",
  "suppression",
  "surface",
  "surfboard",
  "surgeon",
  "surgery",
  "surname",
  "surprise",
  "surround",
  "survey",
  "sushi",
  "suspect",
  "suspenders",
  "sustainment",
  "SUV",
  "swallow",
  "swamp",
  "swan",
  "swath",
  "sweat",
  "sweater",
  "sweats",
  "sweatshirt",
  "sweatshop",
  "sweatsuit",
  "swedish",
  "sweet",
  "sweets",
  "swell",
  "swim",
  "swimming",
  "swimsuit",
  "swing",
  "swiss",
  "switch",
  "switchboard",
  "swivel",
  "sword",
  "swordfish",
  "sycamore",
  "symmetry",
  "sympathy",
  "syndicate",
  "synergy",
  "synod",
  "syrup",
  "system",
  "tabby",
  "tabernacle",
  "table",
  "tablecloth",
  "tabletop",
  "tachometer",
  "tackle",
  "tadpole",
  "tail",
  "tailor",
  "tailspin",
  "tale",
  "talk",
  "tam",
  "tambour",
  "tambourine",
  "tam-o'-shanter",
  "tandem",
  "tangerine",
  "tank",
  "tanker",
  "tankful",
  "tank-top",
  "tap",
  "tard",
  "target",
  "task",
  "tassel",
  "taste",
  "tatami",
  "tattler",
  "tattoo",
  "tavern",
  "tax",
  "taxi",
  "taxicab",
  "tea",
  "teach",
  "teacher",
  "teaching",
  "team",
  "tear",
  "technologist",
  "technology",
  "teen",
  "teeth",
  "telephone",
  "telescreen",
  "teletype",
  "television",
  "tell",
  "teller",
  "temp",
  "temper",
  "temperature",
  "temple",
  "tempo",
  "temporariness",
  "temporary",
  "temptress",
  "tendency",
  "tenement",
  "tennis",
  "tenor",
  "tension",
  "tent",
  "tepee",
  "term",
  "terracotta",
  "terrapin",
  "territory",
  "test",
  "text",
  "textbook",
  "texture",
  "thanks",
  "thaw",
  "theater",
  "theism",
  "theme",
  "theory",
  "therapist",
  "thermals",
  "thermometer",
  "thigh",
  "thing",
  "thinking",
  "thirst",
  "thistle",
  "thomas",
  "thong",
  "thongs",
  "thorn",
  "thought",
  "thread",
  "thrill",
  "throat",
  "throne",
  "thrush",
  "thumb",
  "thunder",
  "thunderbolt",
  "thunderhead",
  "thunderstorm",
  "tiara",
  "tic",
  "ticket",
  "tie",
  "tiger",
  "tight",
  "tights",
  "tile",
  "till",
  "timbale",
  "timber",
  "time",
  "timeline",
  "timeout",
  "timer",
  "timpani",
  "tin",
  "tinderbox",
  "tinkle",
  "tintype",
  "tip",
  "tire",
  "tissue",
  "titanium",
  "title",
  "toad",
  "toast",
  "today",
  "toe",
  "toenail",
  "toga",
  "togs",
  "toilet",
  "tolerance",
  "tom",
  "tomato",
  "tomography",
  "tomorrow",
  "tom-tom",
  "ton",
  "tone",
  "tongue",
  "tonight",
  "tool",
  "toot",
  "tooth",
  "toothbrush",
  "toothpaste",
  "toothpick",
  "top",
  "top-hat",
  "topic",
  "topsail",
  "toque",
  "torchiere",
  "toreador",
  "tornado",
  "torso",
  "tortellini",
  "tortoise",
  "tosser",
  "total",
  "tote",
  "touch",
  "tough",
  "tough-guy",
  "tour",
  "tourist",
  "towel",
  "tower",
  "town",
  "townhouse",
  "tow-truck",
  "toy",
  "trachoma",
  "track",
  "tracksuit",
  "tractor",
  "trade",
  "tradition",
  "traditionalism",
  "traffic",
  "trail",
  "trailer",
  "train",
  "trainer",
  "training",
  "tram",
  "tramp",
  "transaction",
  "transition",
  "translation",
  "transmission",
  "transom",
  "transport",
  "transportation",
  "trapdoor",
  "trapezium",
  "trapezoid",
  "trash",
  "travel",
  "tray",
  "treat",
  "treatment",
  "tree",
  "trellis",
  "tremor",
  "trench",
  "trial",
  "triangle",
  "tribe",
  "trick",
  "trigonometry",
  "trim",
  "trinket",
  "trip",
  "tripod",
  "trolley",
  "trombone",
  "trooper",
  "trouble",
  "trousers",
  "trout",
  "trove",
  "trowel",
  "truck",
  "truckit",
  "trumpet",
  "trunk",
  "trust",
  "truth",
  "try",
  "t-shirt",
  "tsunami",
  "tub",
  "tuba",
  "tube",
  "tugboat",
  "tulip",
  "tummy",
  "tuna",
  "tune",
  "tune-up",
  "tunic",
  "tunnel",
  "turban",
  "turkish",
  "turn",
  "turnip",
  "turnover",
  "turnstile",
  "turret",
  "turtle",
  "tussle",
  "tutu",
  "tuxedo",
  "tv",
  "twig",
  "twilight",
  "twine",
  "twist",
  "twister",
  "two",
  "type",
  "typewriter",
  "typhoon",
  "tyvek",
  "ukulele",
  "umbrella",
  "unblinking",
  "uncle",
  "underclothes",
  "underground",
  "underneath",
  "underpants",
  "underpass",
  "undershirt",
  "understanding",
  "underwear",
  "underwire",
  "unemployment",
  "unibody",
  "uniform",
  "union",
  "unique",
  "unit",
  "unity",
  "university",
  "upper",
  "upstairs",
  "urn",
  "usage",
  "use",
  "user",
  "usher",
  "usual",
  "utensil",
  "vacation",
  "vacuum",
  "vagrant",
  "valance",
  "validity",
  "valley",
  "valuable",
  "value",
  "van",
  "vane",
  "vanity",
  "variation",
  "variety",
  "vase",
  "vast",
  "vault",
  "vaulting",
  "veal",
  "vegetable",
  "vegetarianism",
  "vegetation",
  "vehicle",
  "veil",
  "vein",
  "veldt",
  "vellum",
  "velodrome",
  "velvet",
  "vengeance",
  "venom",
  "veranda",
  "verdict",
  "vermicelli",
  "verse",
  "version",
  "vertigo",
  "verve",
  "vessel",
  "vest",
  "vestment",
  "vibe",
  "vibraphone",
  "vibration",
  "video",
  "view",
  "villa",
  "village",
  "vineyard",
  "vinyl",
  "viola",
  "violence",
  "violet",
  "violin",
  "virginal",
  "virtue",
  "virus",
  "viscose",
  "vise",
  "vision",
  "visit",
  "visitor",
  "visor",
  "visual",
  "vitality",
  "vixen",
  "voice",
  "volcano",
  "volleyball",
  "volume",
  "voyage",
  "vulture",
  "wad",
  "wafer",
  "waffle",
  "waist",
  "waistband",
  "wait",
  "waiter",
  "waitress",
  "wake",
  "walk",
  "walker",
  "walkway",
  "wall",
  "wallaby",
  "wallet",
  "walnut",
  "walrus",
  "wampum",
  "wannabe",
  "war",
  "warden",
  "warlock",
  "warmth",
  "warm-up",
  "warning",
  "wash",
  "washbasin",
  "washcloth",
  "washer",
  "washtub",
  "wasp",
  "waste",
  "wastebasket",
  "watch",
  "watchmaker",
  "water",
  "waterbed",
  "waterfall",
  "waterskiing",
  "waterspout",
  "wave",
  "wax",
  "way",
  "weakness",
  "wealth",
  "weapon",
  "wear",
  "weasel",
  "weather",
  "web",
  "wedding",
  "wedge",
  "weed",
  "weeder",
  "weedkiller",
  "week",
  "weekend",
  "weekender",
  "weight",
  "weird",
  "welcome",
  "welfare",
  "well",
  "west",
  "western",
  "wet-bar",
  "wetsuit",
  "whale",
  "wharf",
  "wheat",
  "wheel",
  "whereas",
  "while",
  "whip",
  "whirlpool",
  "whirlwind",
  "whisker",
  "whiskey",
  "whistle",
  "white",
  "whole",
  "wholesale",
  "wholesaler",
  "whorl",
  "width",
  "wife",
  "wilderness",
  "wildlife",
  "will",
  "willow",
  "win",
  "wind",
  "windage",
  "wind-chime",
  "window",
  "windscreen",
  "windshield",
  "wine",
  "wing",
  "wingman",
  "wingtip",
  "winner",
  "winter",
  "wire",
  "wisdom",
  "wiseguy",
  "wish",
  "wisteria",
  "witch",
  "witch-hunt",
  "withdrawal",
  "witness",
  "wolf",
  "wombat",
  "women",
  "wonder",
  "wood",
  "woodland",
  "woodshed",
  "woodwind",
  "wool",
  "woolen",
  "word",
  "work",
  "workbench",
  "worker",
  "workhorse",
  "working",
  "worklife",
  "workshop",
  "world",
  "worm",
  "worry",
  "worth",
  "worthy",
  "wound",
  "wrap",
  "wraparound",
  "wrecker",
  "wren",
  "wrench",
  "wrestler",
  "wrinkle",
  "wrist",
  "writer",
  "writing",
  "wrong",
  "xylophone",
  "yacht",
  "yak",
  "yam",
  "yard",
  "yarmulke",
  "yarn",
  "yawl",
  "year",
  "yeast",
  "yellow",
  "yesterday",
  "yew",
  "yin",
  "yoga",
  "yogurt",
  "yoke",
  "you",
  "young",
  "youth",
  "yurt",
  "zampone",
  "zebra",
  "zebrafish",
  "zephyr",
  "ziggurat",
  "zinc",
  "zipper",
  "zither",
  "zone",
  "zoo",
  "zoologist",
  "zoology",
  "zoot-suit",
  "zucchini",
];
const length = nouns.length;
const one = _ => nouns[Math.floor(Math.random() * length)];

module.exports = { nouns, one };

},{}],"src/dogeify.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dogeify = void 0;

var _pluralize = _interopRequireDefault(require("pluralize"));

var _nouns = require("nouns");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Patched clone of https://github.com/jozsefsallai/dogeify
 * to make it work in browser
 */
var Dogeify = /*#__PURE__*/function () {
  function Dogeify() {
    _classCallCheck(this, Dogeify);

    this.ADJECTIVES = 'so such very much many how'.split(' ');
    this.EMOTIONS = 'wow amaze excite'.split(' ');
    this.forbiddenPhrases = ['re', 've', '/'];
    this.allNouns = [];
  }

  _createClass(Dogeify, [{
    key: "getSentences",
    value:
    /**
     * getSentences()
     * Turns the provided string into an array of sentences
     * @param {String} str
     * @returns {Array}
     */
    function getSentences(str) {
      var acceptedPunctuations = ['.', '!', '?'];

      if (!acceptedPunctuations.includes(str[str.length - 1])) {
        str += '.';
      }

      str = str.toLowerCase().match(/[^.!?]+[.!?]+/g);

      if (str && str.length) {
        str = str.map(function (sentence) {
          if (sentence && sentence[0] === ' ') {
            return sentence.slice(1);
          }

          return sentence;
        });
      }

      return str;
    }
  }, {
    key: "isWordForbidden",
    value:
    /**
     * isWordForbidden()
     * Checks if a word should be forbidden or ignored
     * @param {String} word
     * @returns {Boolean}
     */
    function isWordForbidden(word) {
      return this.forbiddenPhrases.includes(word) || !!(this.ignore && this.ignore.includes(word));
    }
    /**
     * getNouns()
     * Returns an array of the nouns in a sentence
     * @param {String} sentence
     * @returns {Array}
     */

  }, {
    key: "getNouns",
    value: function getNouns(sentence) {
      var _this = this;

      return sentence.split(/\/| /g).map(function (word) {
        return word.replace(/[^a-zA-Z0-9\-']+/g, '');
      }).filter(function (word) {
        return _this.allNouns.includes(word) && !_this.isWordForbidden(word);
      });
    }
  }, {
    key: "correctSpelling",
    value:
    /**
     * correctSpelling()
     * Replaces some common word parts into dogespeak
     * @param {String} word
     * @returns {String}
     */
    function correctSpelling(word) {
      return word.replace(/er$/, 'ar').replace('ph', 'f').replace('cious', 'shus').replace('stion', 'schun').replace('tion', 'shun').replace('doge', 'dog').replace('dog', 'doge');
    }
  }, {
    key: "getAdjective",
    value:
    /**
     * getAdjective()
     * Returns a random adjective from the ADJECTIVES array
     * @returns {String}
     */
    function getAdjective() {
      var idx = Math.floor(Math.random() * this.ADJECTIVES.length);
      return this.ADJECTIVES[idx];
    }
  }, {
    key: "getEmotion",
    value:
    /**
     * getEmotion()
     * Returns a random emotion from the EMOTIONS array
     * @returns {String}
     */
    function getEmotion() {
      var idx = Math.floor(Math.random() * this.EMOTIONS.length);
      return this.EMOTIONS[idx];
    }
  }, {
    key: "fixPhrases",
    value:
    /**
     * fixPhrases()
     * Converts the spelling of an array of words and turns them
     * into phrases
     * @param {Array} phrases
     * @returns {Array}
     */
    function fixPhrases(phrases) {
      var _this2 = this;

      return phrases.map(function (phrase) {
        var newPhrase = _this2.correctSpelling(phrase);

        newPhrase = "".concat(_this2.getAdjective(), " ").concat(newPhrase, ".");
        return newPhrase;
      });
    }
  }, {
    key: "fillNouns",
    value:
    /**
     * fillNouns()
     * Fills the allNouns array with all nouns
     */
    function fillNouns() {
      this.allNouns = [].concat(_toConsumableArray(_nouns.nouns), _toConsumableArray(_nouns.nouns.map(function (n) {
        return (0, _pluralize.default)(n);
      })));
    }
    /**
     * init()
     * Initializes the dogeifying process
     * @param {String} str
     * @returns {String}
     */

  }, {
    key: "init",
    value: function () {
      var _init = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(str) {
        var _this3 = this;

        var opts,
            sentences,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                opts = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};

                if (opts) {
                  Object.assign(this, opts);
                }

                _context.next = 4;
                return this.fillNouns();

              case 4:
                sentences = this.getSentences(str);

                if (!sentences) {
                  sentences = [];
                }

                if (sentences.length) {
                  sentences = sentences.map(function (sentence) {
                    var nouns = _this3.getNouns(sentence);

                    if (nouns && nouns.length) {
                      nouns = _this3.fixPhrases(nouns);
                    } else {
                      nouns = [];
                    }

                    nouns.push("".concat(_this3.getEmotion(), "."));
                    return nouns.join(' ');
                  });
                } else {
                  sentences.push("".concat(this.getEmotion(), "."));
                }

                return _context.abrupt("return", sentences.join(' '));

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init(_x) {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }]);

  return Dogeify;
}();

exports.Dogeify = Dogeify;
},{"pluralize":"node_modules/pluralize/pluralize.js","nouns":"node_modules/nouns/index.js"}],"node_modules/css-color-names/css-color-names.json":[function(require,module,exports) {
module.exports = {
  "aliceblue": "#f0f8ff",
  "antiquewhite": "#faebd7",
  "aqua": "#00ffff",
  "aquamarine": "#7fffd4",
  "azure": "#f0ffff",
  "beige": "#f5f5dc",
  "bisque": "#ffe4c4",
  "black": "#000000",
  "blanchedalmond": "#ffebcd",
  "blue": "#0000ff",
  "blueviolet": "#8a2be2",
  "brown": "#a52a2a",
  "burlywood": "#deb887",
  "cadetblue": "#5f9ea0",
  "chartreuse": "#7fff00",
  "chocolate": "#d2691e",
  "coral": "#ff7f50",
  "cornflowerblue": "#6495ed",
  "cornsilk": "#fff8dc",
  "crimson": "#dc143c",
  "cyan": "#00ffff",
  "darkblue": "#00008b",
  "darkcyan": "#008b8b",
  "darkgoldenrod": "#b8860b",
  "darkgray": "#a9a9a9",
  "darkgreen": "#006400",
  "darkgrey": "#a9a9a9",
  "darkkhaki": "#bdb76b",
  "darkmagenta": "#8b008b",
  "darkolivegreen": "#556b2f",
  "darkorange": "#ff8c00",
  "darkorchid": "#9932cc",
  "darkred": "#8b0000",
  "darksalmon": "#e9967a",
  "darkseagreen": "#8fbc8f",
  "darkslateblue": "#483d8b",
  "darkslategray": "#2f4f4f",
  "darkslategrey": "#2f4f4f",
  "darkturquoise": "#00ced1",
  "darkviolet": "#9400d3",
  "deeppink": "#ff1493",
  "deepskyblue": "#00bfff",
  "dimgray": "#696969",
  "dimgrey": "#696969",
  "dodgerblue": "#1e90ff",
  "firebrick": "#b22222",
  "floralwhite": "#fffaf0",
  "forestgreen": "#228b22",
  "fuchsia": "#ff00ff",
  "gainsboro": "#dcdcdc",
  "ghostwhite": "#f8f8ff",
  "goldenrod": "#daa520",
  "gold": "#ffd700",
  "gray": "#808080",
  "green": "#008000",
  "greenyellow": "#adff2f",
  "grey": "#808080",
  "honeydew": "#f0fff0",
  "hotpink": "#ff69b4",
  "indianred": "#cd5c5c",
  "indigo": "#4b0082",
  "ivory": "#fffff0",
  "khaki": "#f0e68c",
  "lavenderblush": "#fff0f5",
  "lavender": "#e6e6fa",
  "lawngreen": "#7cfc00",
  "lemonchiffon": "#fffacd",
  "lightblue": "#add8e6",
  "lightcoral": "#f08080",
  "lightcyan": "#e0ffff",
  "lightgoldenrodyellow": "#fafad2",
  "lightgray": "#d3d3d3",
  "lightgreen": "#90ee90",
  "lightgrey": "#d3d3d3",
  "lightpink": "#ffb6c1",
  "lightsalmon": "#ffa07a",
  "lightseagreen": "#20b2aa",
  "lightskyblue": "#87cefa",
  "lightslategray": "#778899",
  "lightslategrey": "#778899",
  "lightsteelblue": "#b0c4de",
  "lightyellow": "#ffffe0",
  "lime": "#00ff00",
  "limegreen": "#32cd32",
  "linen": "#faf0e6",
  "magenta": "#ff00ff",
  "maroon": "#800000",
  "mediumaquamarine": "#66cdaa",
  "mediumblue": "#0000cd",
  "mediumorchid": "#ba55d3",
  "mediumpurple": "#9370db",
  "mediumseagreen": "#3cb371",
  "mediumslateblue": "#7b68ee",
  "mediumspringgreen": "#00fa9a",
  "mediumturquoise": "#48d1cc",
  "mediumvioletred": "#c71585",
  "midnightblue": "#191970",
  "mintcream": "#f5fffa",
  "mistyrose": "#ffe4e1",
  "moccasin": "#ffe4b5",
  "navajowhite": "#ffdead",
  "navy": "#000080",
  "oldlace": "#fdf5e6",
  "olive": "#808000",
  "olivedrab": "#6b8e23",
  "orange": "#ffa500",
  "orangered": "#ff4500",
  "orchid": "#da70d6",
  "palegoldenrod": "#eee8aa",
  "palegreen": "#98fb98",
  "paleturquoise": "#afeeee",
  "palevioletred": "#db7093",
  "papayawhip": "#ffefd5",
  "peachpuff": "#ffdab9",
  "peru": "#cd853f",
  "pink": "#ffc0cb",
  "plum": "#dda0dd",
  "powderblue": "#b0e0e6",
  "purple": "#800080",
  "rebeccapurple": "#663399",
  "red": "#ff0000",
  "rosybrown": "#bc8f8f",
  "royalblue": "#4169e1",
  "saddlebrown": "#8b4513",
  "salmon": "#fa8072",
  "sandybrown": "#f4a460",
  "seagreen": "#2e8b57",
  "seashell": "#fff5ee",
  "sienna": "#a0522d",
  "silver": "#c0c0c0",
  "skyblue": "#87ceeb",
  "slateblue": "#6a5acd",
  "slategray": "#708090",
  "slategrey": "#708090",
  "snow": "#fffafa",
  "springgreen": "#00ff7f",
  "steelblue": "#4682b4",
  "tan": "#d2b48c",
  "teal": "#008080",
  "thistle": "#d8bfd8",
  "tomato": "#ff6347",
  "turquoise": "#40e0d0",
  "violet": "#ee82ee",
  "wheat": "#f5deb3",
  "white": "#ffffff",
  "whitesmoke": "#f5f5f5",
  "yellow": "#ffff00",
  "yellowgreen": "#9acd32"
}
;
},{}],"src/index.js":[function(require,module,exports) {
"use strict";

require("regenerator-runtime/runtime");

var _txtgen = require("txtgen");

var _dogeify = require("./dogeify");

var _cssColorNames = _interopRequireDefault(require("css-color-names"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DOGE_WIDTH = 500;
var DOGE_HEIGHT = 500;
var COLORS = Object.entries(_cssColorNames.default);

var rand = function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var debounce = function debounce(f, ms) {
  var isCooldown = false;
  return function () {
    if (isCooldown) return;
    f.apply(this, arguments);
    isCooldown = true;
    setTimeout(function () {
      return isCooldown = false;
    }, ms);
  };
};

var placePhrases = function placePhrases() {
  var _document$body$getCli = document.body.getClientRects()[0],
      width = _document$body$getCli.width,
      height = _document$body$getCli.height;
  var amount = width > 900 ? 4 : 2;
  Promise.all(Array.from({
    length: amount
  }).map(function () {
    return new _dogeify.Dogeify().init((0, _txtgen.sentence)());
  })).then(function (sentencies) {
    var container = document.createDocumentFragment();
    sentencies.flatMap(function (text) {
      return text.split('. ');
    }).forEach(function (phrase) {
      var _COLORS$rand;

      var phraseNode = document.createElement('span');
      phraseNode.className = 'phrase';
      phraseNode.style.left = "".concat(rand(0, width - 50), "px");
      phraseNode.style.top = "".concat(rand(0, height - 50), "px");
      phraseNode.style.color = (_COLORS$rand = COLORS[rand(0, COLORS.length)]) === null || _COLORS$rand === void 0 ? void 0 : _COLORS$rand[1];
      phraseNode.innerText = phrase;
      container.appendChild(phraseNode);
    });
    document.body.append(container);
  });
};

var positionDoge = function positionDoge() {
  var _document$body$getCli2 = document.body.getClientRects()[0],
      width = _document$body$getCli2.width,
      height = _document$body$getCli2.height;
  var dogeEl = document.querySelector('#doge-container');
  dogeEl.style.left = "".concat(rand(0, width - DOGE_WIDTH), "px");
  dogeEl.style.top = "".concat(rand(0, height - DOGE_HEIGHT), "px");
};

var initBg = function initBg() {
  document.body.style.backgroundImage = "url(\"https://picsum.photos/1980/1024?rand=".concat(Math.random(), "\")");
};

var clearPhrases = function clearPhrases() {
  document.querySelectorAll('.phrase').forEach(function (element) {
    element.remove();
  });
};

var init = function init() {
  initBg();
  positionDoge();
  clearPhrases();
  placePhrases();
};

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', debounce(init, 1000));
},{"regenerator-runtime/runtime":"node_modules/regenerator-runtime/runtime.js","txtgen":"node_modules/txtgen/dist/txtgen.min.js","./dogeify":"src/dogeify.js","css-color-names":"node_modules/css-color-names/css-color-names.json"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "33793" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map