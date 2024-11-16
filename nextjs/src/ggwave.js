var ggwave_factory = (() => {
  var _scriptDir =
    typeof document !== "undefined" && document.currentScript
      ? document.currentScript.src
      : undefined;
  if (typeof __filename !== "undefined") _scriptDir = _scriptDir || __filename;
  return function (ggwave_factory) {
    ggwave_factory = ggwave_factory || {};

    var Module = typeof ggwave_factory !== "undefined" ? ggwave_factory : {};
    var objAssign = Object.assign;
    var readyPromiseResolve, readyPromiseReject;
    Module["ready"] = new Promise(function (resolve, reject) {
      readyPromiseResolve = resolve;
      readyPromiseReject = reject;
    });
    var moduleOverrides = objAssign({}, Module);
    var arguments_ = [];
    var thisProgram = "./this.program";
    var quit_ = (status, toThrow) => {
      throw toThrow;
    };
    var ENVIRONMENT_IS_WEB = typeof window === "object";
    var ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
    var ENVIRONMENT_IS_NODE =
      typeof process === "object" &&
      typeof process.versions === "object" &&
      typeof process.versions.node === "string";
    var scriptDirectory = "";
    function locateFile(path) {
      if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory);
      }
      return scriptDirectory + path;
    }
    var read_, readAsync, readBinary, setWindowTitle;
    function logExceptionOnExit(e) {
      if (e instanceof ExitStatus) return;
      let toLog = e;
      err("exiting due to exception: " + toLog);
    }
    var fs;
    var nodePath;
    var requireNodeFS;
    if (ENVIRONMENT_IS_NODE) {
      if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = require("path").dirname(scriptDirectory) + "/";
      } else {
        scriptDirectory = __dirname + "/";
      }
      requireNodeFS = () => {
        if (!nodePath) {
          fs = require("fs");
          nodePath = require("path");
        }
      };
      read_ = function shell_read(filename, binary) {
        var ret = tryParseAsDataURI(filename);
        if (ret) {
          return binary ? ret : ret.toString();
        }
        requireNodeFS();
        filename = nodePath["normalize"](filename);
        return fs.readFileSync(filename, binary ? null : "utf8");
      };
      readBinary = (filename) => {
        var ret = read_(filename, true);
        if (!ret.buffer) {
          ret = new Uint8Array(ret);
        }
        return ret;
      };
      readAsync = (filename, onload, onerror) => {
        var ret = tryParseAsDataURI(filename);
        if (ret) {
          onload(ret);
        }
        requireNodeFS();
        filename = nodePath["normalize"](filename);
        fs.readFile(filename, function (err, data) {
          if (err) onerror(err);
          else onload(data.buffer);
        });
      };
      if (process["argv"].length > 1) {
        thisProgram = process["argv"][1].replace(/\\/g, "/");
      }
      arguments_ = process["argv"].slice(2);
      process["on"]("uncaughtException", function (ex) {
        if (!(ex instanceof ExitStatus)) {
          throw ex;
        }
      });
      process["on"]("unhandledRejection", function (reason) {
        throw reason;
      });
      quit_ = (status, toThrow) => {
        if (keepRuntimeAlive()) {
          process["exitCode"] = status;
          throw toThrow;
        }
        logExceptionOnExit(toThrow);
        process["exit"](status);
      };
      Module["inspect"] = function () {
        return "[Emscripten Module object]";
      };
    } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
      if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href;
      } else if (typeof document !== "undefined" && document.currentScript) {
        scriptDirectory = document.currentScript.src;
      }
      if (_scriptDir) {
        scriptDirectory = _scriptDir;
      }
      if (scriptDirectory.indexOf("blob:") !== 0) {
        scriptDirectory = scriptDirectory.substr(
          0,
          scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1,
        );
      } else {
        scriptDirectory = "";
      }
      {
        read_ = (url) => {
          try {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            xhr.send(null);
            return xhr.responseText;
          } catch (err) {
            var data = tryParseAsDataURI(url);
            if (data) {
              return intArrayToString(data);
            }
            throw err;
          }
        };
        if (ENVIRONMENT_IS_WORKER) {
          readBinary = (url) => {
            try {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, false);
              xhr.responseType = "arraybuffer";
              xhr.send(null);
              return new Uint8Array(xhr.response);
            } catch (err) {
              var data = tryParseAsDataURI(url);
              if (data) {
                return data;
              }
              throw err;
            }
          };
        }
        readAsync = (url, onload, onerror) => {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, true);
          xhr.responseType = "arraybuffer";
          xhr.onload = () => {
            if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
              onload(xhr.response);
              return;
            }
            var data = tryParseAsDataURI(url);
            if (data) {
              onload(data.buffer);
              return;
            }
            onerror();
          };
          xhr.onerror = onerror;
          xhr.send(null);
        };
      }
      setWindowTitle = (title) => (document.title = title);
    } else {
    }
    var out = Module["print"] || console.log.bind(console);
    var err = Module["printErr"] || console.warn.bind(console);
    objAssign(Module, moduleOverrides);
    moduleOverrides = null;
    if (Module["arguments"]) arguments_ = Module["arguments"];
    if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
    if (Module["quit"]) quit_ = Module["quit"];
    var tempRet0 = 0;
    var setTempRet0 = (value) => {
      tempRet0 = value;
    };
    var wasmBinary;
    if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
    var noExitRuntime = Module["noExitRuntime"] || true;
    if (typeof WebAssembly !== "object") {
      abort("no native wasm support detected");
    }
    var wasmMemory;
    var ABORT = false;
    var EXITSTATUS;
    function assert(condition, text) {
      if (!condition) {
        abort(text);
      }
    }
    var UTF8Decoder =
      typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;
    function UTF8ArrayToString(heap, idx, maxBytesToRead) {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;
      while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
      if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
        return UTF8Decoder.decode(heap.subarray(idx, endPtr));
      } else {
        var str = "";
        while (idx < endPtr) {
          var u0 = heap[idx++];
          if (!(u0 & 128)) {
            str += String.fromCharCode(u0);
            continue;
          }
          var u1 = heap[idx++] & 63;
          if ((u0 & 224) == 192) {
            str += String.fromCharCode(((u0 & 31) << 6) | u1);
            continue;
          }
          var u2 = heap[idx++] & 63;
          if ((u0 & 240) == 224) {
            u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
          } else {
            u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heap[idx++] & 63);
          }
          if (u0 < 65536) {
            str += String.fromCharCode(u0);
          } else {
            var ch = u0 - 65536;
            str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
          }
        }
      }
      return str;
    }
    function UTF8ToString(ptr, maxBytesToRead) {
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
    }
    function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
      if (!(maxBytesToWrite > 0)) return 0;
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1;
      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
          var u1 = str.charCodeAt(++i);
          u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
        }
        if (u <= 127) {
          if (outIdx >= endIdx) break;
          heap[outIdx++] = u;
        } else if (u <= 2047) {
          if (outIdx + 1 >= endIdx) break;
          heap[outIdx++] = 192 | (u >> 6);
          heap[outIdx++] = 128 | (u & 63);
        } else if (u <= 65535) {
          if (outIdx + 2 >= endIdx) break;
          heap[outIdx++] = 224 | (u >> 12);
          heap[outIdx++] = 128 | ((u >> 6) & 63);
          heap[outIdx++] = 128 | (u & 63);
        } else {
          if (outIdx + 3 >= endIdx) break;
          heap[outIdx++] = 240 | (u >> 18);
          heap[outIdx++] = 128 | ((u >> 12) & 63);
          heap[outIdx++] = 128 | ((u >> 6) & 63);
          heap[outIdx++] = 128 | (u & 63);
        }
      }
      heap[outIdx] = 0;
      return outIdx - startIdx;
    }
    function stringToUTF8(str, outPtr, maxBytesToWrite) {
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    }
    function lengthBytesUTF8(str) {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343)
          u = (65536 + ((u & 1023) << 10)) | (str.charCodeAt(++i) & 1023);
        if (u <= 127) ++len;
        else if (u <= 2047) len += 2;
        else if (u <= 65535) len += 3;
        else len += 4;
      }
      return len;
    }
    var UTF16Decoder =
      typeof TextDecoder !== "undefined"
        ? new TextDecoder("utf-16le")
        : undefined;
    function UTF16ToString(ptr, maxBytesToRead) {
      var endPtr = ptr;
      var idx = endPtr >> 1;
      var maxIdx = idx + maxBytesToRead / 2;
      while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
      endPtr = idx << 1;
      if (endPtr - ptr > 32 && UTF16Decoder) {
        return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
      } else {
        var str = "";
        for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
          var codeUnit = HEAP16[(ptr + i * 2) >> 1];
          if (codeUnit == 0) break;
          str += String.fromCharCode(codeUnit);
        }
        return str;
      }
    }
    function stringToUTF16(str, outPtr, maxBytesToWrite) {
      if (maxBytesToWrite === undefined) {
        maxBytesToWrite = 2147483647;
      }
      if (maxBytesToWrite < 2) return 0;
      maxBytesToWrite -= 2;
      var startPtr = outPtr;
      var numCharsToWrite =
        maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
      for (var i = 0; i < numCharsToWrite; ++i) {
        var codeUnit = str.charCodeAt(i);
        HEAP16[outPtr >> 1] = codeUnit;
        outPtr += 2;
      }
      HEAP16[outPtr >> 1] = 0;
      return outPtr - startPtr;
    }
    function lengthBytesUTF16(str) {
      return str.length * 2;
    }
    function UTF32ToString(ptr, maxBytesToRead) {
      var i = 0;
      var str = "";
      while (!(i >= maxBytesToRead / 4)) {
        var utf32 = HEAP32[(ptr + i * 4) >> 2];
        if (utf32 == 0) break;
        ++i;
        if (utf32 >= 65536) {
          var ch = utf32 - 65536;
          str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
        } else {
          str += String.fromCharCode(utf32);
        }
      }
      return str;
    }
    function stringToUTF32(str, outPtr, maxBytesToWrite) {
      if (maxBytesToWrite === undefined) {
        maxBytesToWrite = 2147483647;
      }
      if (maxBytesToWrite < 4) return 0;
      var startPtr = outPtr;
      var endPtr = startPtr + maxBytesToWrite - 4;
      for (var i = 0; i < str.length; ++i) {
        var codeUnit = str.charCodeAt(i);
        if (codeUnit >= 55296 && codeUnit <= 57343) {
          var trailSurrogate = str.charCodeAt(++i);
          codeUnit =
            (65536 + ((codeUnit & 1023) << 10)) | (trailSurrogate & 1023);
        }
        HEAP32[outPtr >> 2] = codeUnit;
        outPtr += 4;
        if (outPtr + 4 > endPtr) break;
      }
      HEAP32[outPtr >> 2] = 0;
      return outPtr - startPtr;
    }
    function lengthBytesUTF32(str) {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        var codeUnit = str.charCodeAt(i);
        if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
        len += 4;
      }
      return len;
    }
    function alignUp(x, multiple) {
      if (x % multiple > 0) {
        x += multiple - (x % multiple);
      }
      return x;
    }
    var buffer,
      HEAP8,
      HEAPU8,
      HEAP16,
      HEAPU16,
      HEAP32,
      HEAPU32,
      HEAPF32,
      HEAPF64;
    function updateGlobalBufferAndViews(buf) {
      buffer = buf;
      Module["HEAP8"] = HEAP8 = new Int8Array(buf);
      Module["HEAP16"] = HEAP16 = new Int16Array(buf);
      Module["HEAP32"] = HEAP32 = new Int32Array(buf);
      Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
      Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
      Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
      Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
      Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
    }
    var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;
    var wasmTable;
    var __ATPRERUN__ = [];
    var __ATINIT__ = [];
    var __ATPOSTRUN__ = [];
    var runtimeInitialized = false;
    var runtimeKeepaliveCounter = 0;
    function keepRuntimeAlive() {
      return noExitRuntime || runtimeKeepaliveCounter > 0;
    }
    function preRun() {
      if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function")
          Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
          addOnPreRun(Module["preRun"].shift());
        }
      }
      callRuntimeCallbacks(__ATPRERUN__);
    }
    function initRuntime() {
      runtimeInitialized = true;
      callRuntimeCallbacks(__ATINIT__);
    }
    function postRun() {
      if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function")
          Module["postRun"] = [Module["postRun"]];
        while (Module["postRun"].length) {
          addOnPostRun(Module["postRun"].shift());
        }
      }
      callRuntimeCallbacks(__ATPOSTRUN__);
    }
    function addOnPreRun(cb) {
      __ATPRERUN__.unshift(cb);
    }
    function addOnInit(cb) {
      __ATINIT__.unshift(cb);
    }
    function addOnPostRun(cb) {
      __ATPOSTRUN__.unshift(cb);
    }
    var runDependencies = 0;
    var runDependencyWatcher = null;
    var dependenciesFulfilled = null;
    function addRunDependency(id) {
      runDependencies++;
      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }
    }
    function removeRunDependency(id) {
      runDependencies--;
      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }
      if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
        }
        if (dependenciesFulfilled) {
          var callback = dependenciesFulfilled;
          dependenciesFulfilled = null;
          callback();
        }
      }
    }
    Module["preloadedImages"] = {};
    Module["preloadedAudios"] = {};
    function abort(what) {
      {
        if (Module["onAbort"]) {
          Module["onAbort"](what);
        }
      }
      what = "Aborted(" + what + ")";
      err(what);
      ABORT = true;
      EXITSTATUS = 1;
      what += ". Build with -s ASSERTIONS=1 for more info.";
      var e = new WebAssembly.RuntimeError(what);
      readyPromiseReject(e);
      throw e;
    }
    var dataURIPrefix = "data:application/octet-stream;base64,";
    function isDataURI(filename) {
      return filename.startsWith(dataURIPrefix);
    }
    function isFileURI(filename) {
      return filename.startsWith("file://");
    }
    var wasmBinaryFile;
    wasmBinaryFile =
      "data:application/octet-stream;base64,AGFzbQEAAAAB5QEhYAN/f38AYAF/AX9gAX8AYAN/f38Bf2AFf39/f38AYAR/f39/AGAGf39/f39/AGACf38AYAAAYAV/f39/fwF/YAJ/fwF/YAN/fn8BfmAEf39/fwF/YAABf2ABfAF9YAF9AX1gAXwBfGACfH8BfGAGf3x/f39/AX9gCn9/f39/f39/f38AYAN/f3wAYAd/f39/f39/AGACfn8Bf2ADfHx/AXxgAnx8AXxgBX99f39/AX9gBn9/f39/fwF/YAJ9fwF/YAJ8fwF/YAd/f39/f39/AX9gBH9/fn4AYAN/f30AYAJ/fwF9Ap0BGgFhAWEAAAFhAWIAAAFhAWMABgFhAWQAEwFhAWUABAFhAWYAFAFhAWcACgFhAWgACAFhAWkAAAFhAWoAAgFhAWsAAgFhAWwADAFhAW0ABwFhAW4AAAFhAW8ABQFhAXAAAgFhAXEABgFhAXIACQFhAXMAFQFhAXQAAgFhAXUAAQFhAXYAAQFhAXcAAwFhAXgABwFhAXkABAFhAXoABwNtbAMDAAEABAMCAgENDg4BAAEWDwIQFxgZDxEIBAUAEAMADAEFBggFAwoAAAEaBREBAgAbHAkIAAEDAAkdCgAAHgQFBQUDBwEIChIBCwELAwEfIAECAQIFAAIHBwIHBwAICAIAAwkEBgYGBAQJDQQFAXABNjYFBwEBgAKAgAIGCQF/AUGw7sACCwchCAFBAgABQgA+AUMBAAFEACEBRQAnAUYAawFHAE4BSAB9CUEBAEEBCzWFAXRVT2ppVU9jbmFtXmyEAX58e3p5eHd2dXNycWhnZmVkYl8sSUlALEAsXX+CAVwsgAGDAVssgQFZWgqluwRsgQQBA38gAkGABE8EQCAAIAEgAhAWGiAADwsgACACaiEDAkAgACABc0EDcUUEQAJAIABBA3FFBEAgACECDAELIAJFBEAgACECDAELIAAhAgNAIAIgAS0AADoAACABQQFqIQEgAkEBaiICQQNxRQ0BIAIgA0kNAAsLAkAgA0F8cSIEQcAASQ0AIAIgBEFAaiIFSw0AA0AgAiABKAIANgIAIAIgASgCBDYCBCACIAEoAgg2AgggAiABKAIMNgIMIAIgASgCEDYCECACIAEoAhQ2AhQgAiABKAIYNgIYIAIgASgCHDYCHCACIAEoAiA2AiAgAiABKAIkNgIkIAIgASgCKDYCKCACIAEoAiw2AiwgAiABKAIwNgIwIAIgASgCNDYCNCACIAEoAjg2AjggAiABKAI8NgI8IAFBQGshASACQUBrIgIgBU0NAAsLIAIgBE8NAQNAIAIgASgCADYCACABQQRqIQEgAkEEaiICIARJDQALDAELIANBBEkEQCAAIQIMAQsgACADQQRrIgRLBEAgACECDAELIAAhAgNAIAIgAS0AADoAACACIAEtAAE6AAEgAiABLQACOgACIAIgAS0AAzoAAyABQQRqIQEgAkEEaiICIARNDQALCyACIANJBEADQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAiADRw0ACwsgAAvyAgICfwF+AkAgAkUNACAAIAE6AAAgACACaiIDQQFrIAE6AAAgAkEDSQ0AIAAgAToAAiAAIAE6AAEgA0EDayABOgAAIANBAmsgAToAACACQQdJDQAgACABOgADIANBBGsgAToAACACQQlJDQAgAEEAIABrQQNxIgRqIgMgAUH/AXFBgYKECGwiATYCACADIAIgBGtBfHEiBGoiAkEEayABNgIAIARBCUkNACADIAE2AgggAyABNgIEIAJBCGsgATYCACACQQxrIAE2AgAgBEEZSQ0AIAMgATYCGCADIAE2AhQgAyABNgIQIAMgATYCDCACQRBrIAE2AgAgAkEUayABNgIAIAJBGGsgATYCACACQRxrIAE2AgAgBCADQQRxQRhyIgRrIgJBIEkNACABrUKBgICAEH4hBSADIARqIQEDQCABIAU3AxggASAFNwMQIAEgBTcDCCABIAU3AwAgAUEgaiEBIAJBIGsiAkEfSw0ACwsgAAsjAQF/IwBBEGsiAyQAIAMgAjYCDCAAIAEgAhBCIANBEGokAAszAQF/IABBASAAGyEAAkADQCAAECciAQ0BQaTuACgCACIBBEAgAREIAAwBCwsQBwALIAELFwAgAC0AAEEgcUUEQCABIAIgABA4GgsLbwEBfyMAQYACayIFJAACQCACIANMDQAgBEGAwARxDQAgBSABQf8BcSACIANrIgJBgAIgAkGAAkkiARsQGxogAUUEQANAIAAgBUGAAhAeIAJBgAJrIgJB/wFLDQALCyAAIAUgAhAeCyAFQYACaiQAC3QBAX8gAkUEQCAAKAIEIAEoAgRGDwsgACABRgRAQQEPCyABKAIEIgItAAAh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BGsiAkEDSw0ACwsgAkUNAANAIAAgAS0AADoAACAAQQFqIQAgAUEBaiEBIAJBAWsiAg0ACwsLry4BD38gACAALQABIgwgACgCBGpBAWo2AhAgACgCHCgCACAALwEYaiABIAAtAAAiERAaGiAAIBE6ABQgAC0AACIEIAAoAhwoAgAgAC8BGGpqIAIgAC0AASIBEBoaIAAgASAEaiICOgAUIAAgAC0AICIBIAIgASACQf8BcUsbIgE6ACAgACgCKCgCACAALwEkaiAAKAIcKAIAIAAvARhqIAFB/wFxEBoaIAAgAToAICAAQQA6AKQBQQEhECAAIAAtAAFBAWo6AHQgACgCfCgCACAALwF4akEAOgAAIAAtAAEEQANAIBBB/wFxIgpBAWtB/wFvIQEgACgCHCgCACAALwEYaiIHLQAAIQICQCAALQAUIghBAkkNACABQf8BaiABIAFBAEgbQfArai0AACEGQQEhASAIQQFrIgRBAXEhBSAIQQJHBEAgBEF+cSEIQQAhDQNAIAFBAWohBCACQf8BcSICBH8gBkHwKWotAAAgAkHwKWotAABqQfArai0AAAVBAAsgASAHai0AAHNB/wFxIgIEfyAGQfApai0AACACQfApai0AAGpB8CtqLQAABUEACyECIAFBAmohASAEIAdqLQAAIAJzIQIgDUECaiINIAhHDQALCyAFRQ0AIAJB/wFxIgIEfyAGQfApai0AACACQfApai0AAGpB8CtqLQAABUEACyABIAdqLQAAcyECCyAAKAJ8KAIAIAAvAXhqIApqIAI6AAAgAC0AASAQQQFqIhBB/wFxTw0ACwsCQAJAIAAtAHQiBEUNACAMIBFqIRIgACgCfCgCACAALwF4aiECQQAhAQNAIAEgAmotAABFBEAgBCABQQFqIgFHDQEMAgsLIBJB/wFxIg8hBUEAIQFBACECIABBADoAOAJAIAAtAKQBRQ0AA0AgACgCrAEoAgAgAC8BqAFqIAFqLQAAIQggACgCQCgCACEEIAAgAkEBajoAOCAEIAAvATxqIAJB/wFxaiAIQX9zIAVqOgAAIAFBAWoiASAALQCkAU8NASAALQA4IQIMAAsACyAAKAKIASgCACAALwGEAWpBACAALQCCARAbGiAAKAKIASgCACAALwGEAWogACgCfCgCACAALwF4akEBaiAALQB0QQFrIgJB/wFxEBoaIAAgAjoAgAEgAC0ApAEiAQRAA0AgAkH/AXFBAUsEQEEAIQFBACAAKAJAKAIAIAAvATxqIAlqLQAAIgIgAkH/AUYbQfArai0AACEKA0BBACECIAAoAogBKAIAIAAvAYQBaiIFIAFB/wFxaiIILQAAIgQEQCAKQfApai0AACAEQfApai0AAGpB8CtqLQAAIQILIAggBSABQQFqIgFB/wFxai0AACACczoAACAALQCAASICQQFrIAFBGHRBGHVKDQALIAAtAKQBIQELIAlBAWoiCSABQf8BcUkNAAsLQQAhECAALQCkASEJIABBAToARCAAQQE6ADggAEFAaygCACgCACAALwE8akEBOgAAIAAoAkwoAgAgAC8BSGpBAToAACAJIAAtAAEiDUcEQCAALQCAASIBIA1rQf8BcUEAIAEgDUsbIQYDQCAAKAKIASgCACAALwGEAWoiDCAGIA5qIgpB/wFxai0AACENIAAtADgiB0ECTwRAIAAoAkAoAgAgAC8BPGohBUEBIQFBASECA0BBACELAkAgBSAHIAJBf3NqQf8BcWotAAAiCEUNACAMIAogAWtB/wFxai0AACIERQ0AIARB8ClqLQAAIAhB8ClqLQAAakHwK2otAAAhCwsgAkEBaiECIAsgDXMhDSABQQFqIgEgB0cNAAsLIAAoAkwoAgAhAiAAIAAtAEQiAUEBajoARCABIAIgAC8BSGpqQQA6AAAgDUH/AXEiCARAIAAtAEQiCyAALQA4IgFLBEAgACALOgBcIA1B/wFxIQhBACECA0AgACgCZCgCACAALwFgaiACaiAAKAJMKAIAIAAvAUhqIAJqLQAAIgEEfyAIQfApai0AACABQfApai0AAGpB8CtqLQAABUEACzoAACACQQFqIgIgAC0AREkNAAsgACAALQA4IgE6AERBACECAkAgAQRAIAhB8ClqLQAAQf8Bc0HwK2otAAAhBANAIAAoAkwoAgAgAC8BSGogAmogACgCQCgCACAALwE8aiACai0AACIBBH8gBEHwKWotAAAgAUHwKWotAABqQfArai0AAAVBAAs6AAAgAkEBaiICIAAtADgiAUkNAAsMAQtBACEBCyAAIAEgAC0AXCICIAEgAksbIgE6ADggACgCQCgCACAALwE8aiAAKAJkKAIAIAAvAWBqIAEQGhogACABOgA4IAAt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AAAFQQALIAIgBmotAABzIgEEfyAHQfApai0AACABQfApai0AAGpB8CtqLQAABUEACyEBIAJBAmohAiAFIAZqLQAAIAFzIQsgDkECaiIOIApHDQALCyAMRQ0AIAtB/wFxIgEEfyAHQfApai0AACABQfApai0AAGpB8CtqLQAABUEACyACIAZqLQAAcyELCyAAKAKsASgCACAALwGoAWogBGotAAAgACgCWCgCACAALwFUamogC0H/AXEiAQR/IAAoAkAoAgAgAC8BPGogBGotAABB8ClqLQAAQfArai0AAEHwKWotAAAgAUHwKWotAABqQfArai0AAEHwKWotAAAgCUH/AXFB8ClqLQAAa0H/AWpB//8DcUH/AXBB8CtqLQAABUEACzoAACAEQQFqIgQgAC0AOCIPSQ0ACyAALQBQIQILIAAgCC0AACIBIAIgASACQf8BcUsbIgE6ACBBACECIAAoAigoAgAgAC8BJGpBACABQf8BcRAbGiAILQAAIgkEQANAIAAoAigoAgAgAC8BJGogAC0AICACIAlrakH/AXFqIAgoAggoAgAgCC8BBGogAmotAAA6AAAgAkEBaiICIAgtAAAiCUkNAAsLIAAtAFAiCQRAQQAhAgNAIAAoAigoAgAgAC8BJGogAC0AICACIAlrakH/AXFqIgEgAS0AACAAKAJYKAIAIAAvAVRqIAJqLQAAczoAACACQQFqIgIgAC0AUCIJSQ0ACwsLIAAgEToAICADIAAoAigoAgAgAC8BJGogERAaGkEAIQELIAELlQQBAn9BASAALAAHIgEgAUEBShtBASAALQAJGyIBIAAsABMiAiABIAJIGyABIAAtABUbIgEgACwAHyICIAEgAkgbIAEgAC0AIRsiASAALAArIgIgASACSBsgASAALQAtGyIBIAAsADciAiABIAJIGyABIAAtADkbIgEgACwAQyICIAEgAkgbIAEgAC0ARRsiASAALABPIgIgASACSBsgASAALQBRGyIBIAAsAFsiAiABIAJIGyABIAAtAF0bIgEgACwAZyICIAEgAkgbIAEgAC0AaRsiASAALABzIgIgASACSBsgASAALQB1GyIBIAAsAH8iAiABIAJIGyABIAAtAIEBGyIBIAAsAIsBIgIgASACSBsgASAALQCNARsiASAALACXASICIAEgAkgbIAEgAC0AmQEb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ACIBQQRqNgIAIAAgASgCADYCAA8LIAIgAigCACIBQQRqNgIAIAAgATIBADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATMBADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATAAADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATEAADcDAA8LIAIgAigCAEEHakF4cSIBQQhqNgIAIAAgASsDADkDAA8LIAAgAkEAEQcACw8LIAIgAigCACIBQQRqNgIAIAAgATQCADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATUCADcDAA8LIAIgAigCAEEHakF4cSIBQQhqNgIAIAAgASkDADcDAAtyAQN/IAAoAgAsAABBMGtBCk8EQEEADwsDQCAAKAIAIQNBfyEBIAJBzJmz5gBNBEBBfyADLAAAQTBrIgEgAkEKbCICaiABQf////8HIAJrShshAQsgACADQQFqNgIAIAEhAiADLAABQTBrQQpJDQALIAILoxQCEX8BfiMAQdAAayIGJAAgBiABNgJMIAZBN2ohFSAGQThqIRNBACEBAkACQAJAAkADQCABQf////8HIA1rSg0BIAEgDWohDSAGKAJMIgohAQJAAkACQCAKLQAAIgkEQANAAkACQCAJQf8BcSIHRQRAIAEhCQwBCyAHQSVHDQEgASEJA0AgAS0AAUElRw0BIAYgAUECaiIHNgJMIAlBAWohCSABLQACIQsgByEBIAtBJUYNAAsLIAkgCmsiAUH/////ByANayIWSg0HIAAEQCAAIAogARAeCyABDQZBfyESQQEhBwJAIAYoAkwiASwAAUEwa0EKTw0AIAEtAAJBJEcNACABLAABQTBrIRJBASEUQQMhBwsgBiABIAdqIgE2AkxBACEOAkAgASwAACIMQSBrIgtBH0sEQCABIQcMAQsgASEHQQEgC3QiCEGJ0QRxRQ0AA0AgBiABQQFqIgc2AkwgCCAOciEOIAEsAAEiDEEgayILQSBPDQEgByEBQQEgC3QiCEGJ0QRxDQALCwJAIAxBKkYEQCAGAn8CQCAHLAABQTBrQQpPDQAgBigCTCIBLQACQSRHDQAgASwAAUECdCAEakHAAWtBCjYCACABLAABQQN0IANqQYADaygCACEPQQEhFCABQQNqDAELIBQNBkEAIRRBACEPIAAEQCACIAIoAgAiAUEEajYCACAB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AWoiCiARLADzASIOQQF0SA0ACwsgFiAEKAI8IgAgBSAObE5yRQRAIAQoAlwhBkEAIRYgA0EANgKcAiADQQA6AJQCIANBADYCkAIgA0EAOgCIAiADQQA2AoQCIANBADoA/AEgA0EANgL4ASADQQA6APABIANBADYC7AEgA0EAOgDkASADQQA2AuABIANBADoA2AEgA0EANgLUASADQQA6AMwBIANBADYCyAEgA0EAOgDAASADQQA2ArwBIANBADoAtAEgA0EANgKwASADQQA6AKgBIANBADYCpAEgA0EAOgCcASADQQA2ApgBIANBADoAkAEgA0EANgKMASADQQA6AIQBIANBADYCgAEgA0EAOgB4IANBADYCdCADQQA6AGwgA0EANgJoIANBADoAYCADQQA2AlwgA0EAOgBUIAMgAEEBayIKOgBBIANBAToAQCADQQA7AUxBACEOIAZFBEBBASEOIApB/wFxIgYgBkEcbGpBBGoQJyEGCyADIA46AEwgAyAGNgJEIANBADsBWCADIAY2AkggAyAAOgBWIAMgCTYCXCADQQA7AVQgAyAAOgBiIAMgCTYCaCADQYACOwFgIANBAzoAeSADIAk2AnQgA0GABDsBbCADIApBAXQiBjoAbiADIAY6AHogAyAAQf8BcSIOOwFkIAMgDkEBdCINOwFwIAMgDSAGQf4BcSIKaiINOwF8IANBgAg7AYQBIAMgCTYCgAEgA0EAOgB4IAMgBjoAhgEgAyAJNgKMASADQYAKOwGQASADIAA6AJIBIAMgCTYCmAEgA0GADDsBnAEgAyAGOgCeASADIAk2AqQBIANBgA47AagBIAMgBjoAqgEgAyAJNgKwASADQQg6ALUBIAMgCiANaiIAOwGIASADIAAgCmoiADsBlAEgAyAAIA5qIgA7AaABIAMgACAKaiIAOwGsASADIAAgCmoiADsBuAEgA0EAOgC0ASADIAY6ALYBIAMgCTYCvAEgAyAGOgDCASADQYASOwHAASADIAk2AsgBIAMgBjoAzgEgA0GAFDsBzAEgAyAJNgLUASADIAY6ANoBIANBgBY7AdgBIANBDDoA5QEgAyAJNgLgASADIAY6AOYBIAMgACAKaiIAOwHEASADIAAgCmoiADsB0AEgAyAAIApqIgA7AdwBIAMgACAKaiIAOwHoASADQQ06APEBIAMgCTYC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MHgrMHggMHgAc2FtcGxlRm9ybWF0T3V0AHNhbXBsZVJhdGVPdXQAW1VdIEZhc3Rlc3QAW01UXSBGYXN0ZXN0AFtEVF0gRmFzdGVzdABbVV0gRmFzdABbTVRdIEZhc3QAW0RUXSBGYXN0AHVuc2lnbmVkIHNob3J0AHR4UHJvdG9jb2xTZXRGcmVxU3RhcnQAcnhQcm90b2NvbFNldEZyZXFTdGFydAB1bnNpZ25lZCBpbnQAaW5pdABmbG9hdABTYW1wbGVGb3JtYXQAdWludDY0X3QAZ2V0RGVmYXVsdFBhcmFtZXRlcnMAdmVjdG9yAHVuc2lnbmVkIGNoYXIAc2FtcGxlRm9ybWF0SW5wAHNhbXBsZVJhdGVJbnAAX19jeGFfZ3VhcmRfYWNxdWlyZSBkZXRlY3RlZCByZWN1cnNpdmUgaW5pdGlhbGl6YXRpb24AbmFuAGJvb2wAdHhUb2dnbGVQcm90b2NvbAByeFRvZ2dsZVByb3RvY29sAGVtc2NyaXB0ZW46OnZhbABbVV0gTm9ybWFsAFtNVF0gTm9ybWFsAFtEVF0gTm9ybWFsAHBheWxvYWRMZW5ndGgAZGlzYWJsZUxvZwBlbmFibGVMb2cAdW5zaWduZWQgbG9uZwBzdGQ6OndzdHJpbmcAYmFzaWNfc3RyaW5nAHN0ZDo6c3RyaW5nAHN0ZDo6dTE2c3RyaW5nAHN0ZDo6dTMyc3RyaW5nAGluZgBzYW1wbGVSYXRlAHNhbXBsZXNQZXJGcmFtZQBkb3VibGUAZnJlZQBlbmNvZGUAZGVjb2RlAG9wZXJhdGluZ01vZGUAc291bmRNYXJrZXJUaHJlc2hvbGQAdm9pZABQcm90b2NvbElkAEdHV0FWRV9PUEVSQVRJTkdfTU9ERV9UWABHR1dBVkVfT1BFUkFUSU5HX01PREVfUlhfQU5EX1RYAEdHV0FWRV9PUEVSQVRJTkdfTU9ERV9SWABHR1dBVkVfUFJPVE9DT0xfTVRfRkFTVEVTVABHR1dBVkVfUFJPVE9DT0xfRFRfRkFTVEVTVABHR1dBVkVfUFJPVE9DT0xfQVVESUJMRV9GQVNURVNUAEdHV0FWRV9QUk9UT0NPTF9VTFRSQVNPVU5EX0ZBU1RFU1QAR0dXQVZFX1BST1RPQ09MX01UX0ZBU1QAR0dXQVZFX1BST1RPQ09MX0RUX0ZBU1QAR0dXQVZFX1BST1RPQ09MX0FVRElCTEVfRkFTVABHR1dBVkVfUFJPVE9DT0xfVUxUUkFTT1VORF9GQVNUAEdHV0FWRV9PUEVSQVRJTkdfTU9ERV9VU0VfRFNTAEdHV0FWRV9PUEVSQVRJTkdfTU9ERV9UWF9PTkxZX1RPTkVTAE5BTgBHR1dBVkVfUFJPVE9DT0xfTVRfTk9STUFMAEdHV0FWRV9QUk9UT0NPTF9EVF9OT1JNQUwAR0dXQVZFX1BST1RPQ09MX0FVRElCTEVfTk9STUFMAEdHV0FWRV9QUk9UT0NPTF9VTFRSQVNPVU5EX05PUk1BTABJTkYAR0dXQVZFX1NBTVBMRV9GT1JNQVRfVU5ERUZJTkVEAGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHNob3J0PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBzaG9ydD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8aW50PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBpbnQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGZsb2F0PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1aW50OF90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQ4X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVpbnQxNl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQxNl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1aW50MzJfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8aW50MzJfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8Y2hhcj4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgY2hhcj4Ac3RkOjpiYXNpY19zdHJpbmc8dW5zaWduZWQgY2hhcj4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8c2lnbmVkIGNoYXI+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGxvbmc+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVuc2lnbmVkIGxvbmc+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGRvdWJsZT4AR0dXQVZFX1BST1RPQ09MX0NVU1RPTV85AEdHV0FWRV9QUk9UT0NPTF9DVVNUT01fOABHR1dBVkVfU0FNUExFX0ZPUk1BVF9VOABHR1dBVkVfU0FNUExFX0ZPUk1BVF9JOABHR1dBVkVfUFJPVE9DT0xfQ1VTVE9NXzcAR0dXQVZFX1BST1RPQ09MX0NVU1RPTV82AEdHV0FWRV9TQU1QTEVfRk9STUFUX1UxNgBHR1dBVkVfU0FNUExFX0ZPUk1BVF9JMTYAR0dXQVZFX1BST1RPQ09MX0NVU1RPTV81AEdHV0FWRV9QUk9UT0NPTF9DVVNUT01fNABHR1dBVkVfUFJPVE9DT0xfQ1VTVE9NXzMAR0dXQVZFX1BST1RPQ09MX0NVU1RPTV8yAEdHV0FWRV9TQU1QTEVfRk9STUFUX0YzMgBHR1dBVkVfUFJPVE9DT0xfQ1VTVE9NXzEAR0dXQVZFX1BST1RPQ09MX0NVU1RPTV8wAC4AKG51bGwpAEVycm9yOiBjYXB0dXJlIHNhbXBsZSByYXRlICglZyBIeikgbXVzdCBiZSA+PSAlZyBIegoARXJyb3I6IGNhcHR1cmUgc2FtcGxlIHJhdGUgKCVnIEh6KSBtdXN0IGJlIDw9ICVnIEh6CgBFcnJvcjogZmFpbGVkIHRvIGNvbXB1dGUgdGhlIHNpemUgb2YgdGhlIHJlcXVpcmVkIG1lbW9yeQoAVHJ1bmNhdGluZyBkYXRhIGZyb20gJWQgdG8gJWQgYnl0ZXMKAENhbm5vdCBkZWNvZGUgd2hpbGUgdHJhbnNtaXR0aW5nCgBUeCBpcyBkaXNhYmxlZCAtIGNhbm5vdCB0cmFuc21pdCBkYXRhIHdpdGggdGhpcyBHR1dhdmUgaW5zdGFuY2UKAFJ4IGlzIGRpc2FibGVkIC0gY2Fubm90IHJlY2VpdmUgZGF0YSB3aXRoIHRoaXMgR0dXYXZlIGluc3RhbmNlCgBQcm90b2NvbCAlZCBpcyBub3QgZW5hYmxlZCAtIG1ha2Ugc3VyZSB0byBlbmFibGUgaXQgYmVmb3JlIGNyZWF0aW5nIHRoZSBpbnN0YW5jZQoATW9uby10b25lIHByb3RvY29scyB3aXRoIHZhcmlhYmxlIGxlbmd0aCBhcmUgbm90IHN1cHBvcnRlZAoARmFpbGVkIHRvIGluaXRpYWxpemUgVHggdHJhbnNtaXNzaW9uIGZvciBHR1dhdmUgaW5zdGFuY2UgJWQKAEludmFsaWQgR0dXYXZlIGluc3RhbmNlICVkCgBGYWlsZWQgdG8gZW5jb2RlIGRhdGEgLSBHR1dhdmUgaW5zdGFuY2UgJWQKAEZhaWxlZCB0byBkZWNvZGUgZGF0YSAtIEdHV2F2ZSBpbnN0YW5jZSAlZAoARmFpbGVkIHRvIGZyZWUgR0dXYXZlIGluc3RhbmNlIC0gaW52YWxpZCBHR1dhdmUgaW5zdGFuY2UgaWQgJWQKAG4gPSAlZCwgbkFjdHVhbCA9ICVkCgBSZWNlaXZlZCBlbmQgbWFya2VyLiBGcmFtZXMgbGVmdCA9ICVkLCByZWNvcmRlZCA9ICVkCgBFcnJvcjogZmFpbGVkIHRvIGFsbG9jYXRlIHRoZSByZXF1aXJlZCBtZW1vcnk6ICVkCgBJbnZhbGlkIHBheWxvYWQgbGVuZ3RoOiAlZCwgbWF4OiAlZAoASW52YWxpZCBzYW1wbGVzIHBlciBmcmFtZTogJWQsIG1heDogJWQKAEludmFsaWQgb3IgdW5zdXBwb3J0ZWQgcGxheWJhY2sgc2FtcGxlIGZvcm1hdDogJWQKAEludmFsaWQgb3IgdW5zdXBwb3J0ZWQgY2FwdHVyZSBzYW1wbGUgZm9ybWF0OiAlZAoASW52YWxpZCBzYW1wbGUgZm9ybWF0OiAlZAoATmVnYXRpdmUgZGF0YSBzaXplOiAlZAoARXJyb3I6IGZhaWxlZCB0byBhbGxvY2F0ZSBtZW1vcnkgLSBoZWFwU2l6ZTA6ICVkLCBoZWFwU2l6ZTogJWQKAEludmFsaWQgdm9sdW1lOiAlZAoASW52YWxpZCBwcm90b2NvbCBJRDogJWQKAFJlY2VpdmluZyBzb3VuZCBkYXRhIC4uLgoAQW5hbHl6aW5nIGNhcHR1cmVkIGRhdGEgLi4KAEZhaWxlZCB0byBjcmVhdGUgR0dXYXZlIGluc3RhbmNlIC0gcmVhY2hlZCBtYXhpbXVtIG51bWJlciBvZiBpbnN0YW5jZXMgKCVkKQoARmFpbHVyZSBkdXJpbmcgY2FwdHVyZSAtIHByb3ZpZGVkIGJ5dGVzICglZCkgYXJlIG5vdCBtdWx0aXBsZSBvZiBzYW1wbGUgc2l6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";
    if (!isDataURI(wasmBinaryFile)) {
      wasmBinaryFile = locateFile(wasmBinaryFile);
    }
    function getBinary(file) {
      try {
        if (file == wasmBinaryFile && wasmBinary) {
          return new Uint8Array(wasmBinary);
        }
        var binary = tryParseAsDataURI(file);
        if (binary) {
          return binary;
        }
        if (readBinary) {
          return readBinary(file);
        } else {
          throw "both async and sync fetching of the wasm failed";
        }
      } catch (err) {
        abort(err);
      }
    }
    function getBinaryPromise() {
      if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
        if (typeof fetch === "function" && !isFileURI(wasmBinaryFile)) {
          return fetch(wasmBinaryFile, { credentials: "same-origin" })
            .then(function (response) {
              if (!response["ok"]) {
                throw (
                  "failed to load wasm binary file at '" + wasmBinaryFile + "'"
                );
              }
              return response["arrayBuffer"]();
            })
            .catch(function () {
              return getBinary(wasmBinaryFile);
            });
        } else {
          if (readAsync) {
            return new Promise(function (resolve, reject) {
              readAsync(
                wasmBinaryFile,
                function (response) {
                  resolve(new Uint8Array(response));
                },
                reject,
              );
            });
          }
        }
      }
      return Promise.resolve().then(function () {
        return getBinary(wasmBinaryFile);
      });
    }
    function createWasm() {
      var info = { a: asmLibraryArg };
      function receiveInstance(instance, module) {
        var exports = instance.exports;
        Module["asm"] = exports;
        wasmMemory = Module["asm"]["A"];
        updateGlobalBufferAndViews(wasmMemory.buffer);
        wasmTable = Module["asm"]["C"];
        addOnInit(Module["asm"]["B"]);
        removeRunDependency("wasm-instantiate");
      }
      addRunDependency("wasm-instantiate");
      function receiveInstantiationResult(result) {
        receiveInstance(result["instance"]);
      }
      function instantiateArrayBuffer(receiver) {
        return getBinaryPromise()
          .then(function (binary) {
            return WebAssembly.instantiate(binary, info);
          })
          .then(function (instance) {
            return instance;
          })
          .then(receiver, function (reason) {
            err("failed to asynchronously prepare wasm: " + reason);
            abort(reason);
          });
      }
      function instantiateAsync() {
        if (
          !wasmBinary &&
          typeof WebAssembly.instantiateStreaming === "function" &&
          !isDataURI(wasmBinaryFile) &&
          !isFileURI(wasmBinaryFile) &&
          typeof fetch === "function"
        ) {
          return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(
            function (response) {
              var result = WebAssembly.instantiateStreaming(response, info);
              return result.then(receiveInstantiationResult, function (reason) {
                err("wasm streaming compile failed: " + reason);
                err("falling back to ArrayBuffer instantiation");
                return instantiateArrayBuffer(receiveInstantiationResult);
              });
            },
          );
        } else {
          return instantiateArrayBuffer(receiveInstantiationResult);
        }
      }
      if (Module["instantiateWasm"]) {
        try {
          var exports = Module["instantiateWasm"](info, receiveInstance);
          return exports;
        } catch (e) {
          err("Module.instantiateWasm callback failed with error: " + e);
          return false;
        }
      }
      instantiateAsync().catch(readyPromiseReject);
      return {};
    }
    function callRuntimeCallbacks(callbacks) {
      while (callbacks.length > 0) {
        var callback = callbacks.shift();
        if (typeof callback == "function") {
          callback(Module);
          continue;
        }
        var func = callback.func;
        if (typeof func === "number") {
          if (callback.arg === undefined) {
            getWasmTableEntry(func)();
          } else {
            getWasmTableEntry(func)(callback.arg);
          }
        } else {
          func(callback.arg === undefined ? null : callback.arg);
        }
      }
    }
    var wasmTableMirror = [];
    function getWasmTableEntry(funcPtr) {
      var func = wasmTableMirror[funcPtr];
      if (!func) {
        if (funcPtr >= wasmTableMirror.length)
          wasmTableMirror.length = funcPtr + 1;
        wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
      }
      return func;
    }
    var structRegistrations = {};
    function runDestructors(destructors) {
      while (destructors.length) {
        var ptr = destructors.pop();
        var del = destructors.pop();
        del(ptr);
      }
    }
    function simpleReadValueFromPointer(pointer) {
      return this["fromWireType"](HEAPU32[pointer >> 2]);
    }
    var awaitingDependencies = {};
    var registeredTypes = {};
    var typeDependencies = {};
    var char_0 = 48;
    var char_9 = 57;
    function makeLegalFunctionName(name) {
      if (undefined === name) {
        return "_unknown";
      }
      name = name.replace(/[^a-zA-Z0-9_]/g, "$");
      var f = name.charCodeAt(0);
      if (f >= char_0 && f <= char_9) {
        return "_" + name;
      } else {
        return name;
      }
    }
    function createNamedFunction(name, body) {
      name = makeLegalFunctionName(name);
      return new Function(
        "body",
        "return function " +
          name +
          "() {\n" +
          '    "use strict";' +
          "    return body.apply(this, arguments);\n" +
          "};\n",
      )(body);
    }
    function extendError(baseErrorType, errorName) {
      var errorClass = createNamedFunction(errorName, function (message) {
        this.name = errorName;
        this.message = message;
        var stack = new Error(message).stack;
        if (stack !== undefined) {
          this.stack =
            this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "");
        }
      });
      errorClass.prototype = Object.create(baseErrorType.prototype);
      errorClass.prototype.constructor = errorClass;
      errorClass.prototype.toString = function () {
        if (this.message === undefined) {
          return this.name;
        } else {
          return this.name + ": " + this.message;
        }
      };
      return errorClass;
    }
    var InternalError = undefined;
    function throwInternalError(message) {
      throw new InternalError(message);
    }
    function whenDependentTypesAreResolved(
      myTypes,
      dependentTypes,
      getTypeConverters,
    ) {
      myTypes.forEach(function (type) {
        typeDependencies[type] = dependentTypes;
      });
      function onComplete(typeConverters) {
        var myTypeConverters = getTypeConverters(typeConverters);
        if (myTypeConverters.length !== myTypes.length) {
          throwInternalError("Mismatched type converter count");
        }
        for (var i = 0; i < myTypes.length; ++i) {
          registerType(myTypes[i], myTypeConverters[i]);
        }
      }
      var typeConverters = new Array(dependentTypes.length);
      var unregisteredTypes = [];
      var registered = 0;
      dependentTypes.forEach(function (dt, i) {
        if (registeredTypes.hasOwnProperty(dt)) {
          typeConverters[i] = registeredTypes[dt];
        } else {
          unregisteredTypes.push(dt);
          if (!awaitingDependencies.hasOwnProperty(dt)) {
            awaitingDependencies[dt] = [];
          }
          awaitingDependencies[dt].push(function () {
            typeConverters[i] = registeredTypes[dt];
            ++registered;
            if (registered === unregisteredTypes.length) {
              onComplete(typeConverters);
            }
          });
        }
      });
      if (0 === unregisteredTypes.length) {
        onComplete(typeConverters);
      }
    }
    function __embind_finalize_value_object(structType) {
      var reg = structRegistrations[structType];
      delete structRegistrations[structType];
      var rawConstructor = reg.rawConstructor;
      var rawDestructor = reg.rawDestructor;
      var fieldRecords = reg.fields;
      var fieldTypes = fieldRecords
        .map(function (field) {
          return field.getterReturnType;
        })
        .concat(
          fieldRecords.map(function (field) {
            return field.setterArgumentType;
          }),
        );
      whenDependentTypesAreResolved(
        [structType],
        fieldTypes,
        function (fieldTypes) {
          var fields = {};
          fieldRecords.forEach(function (field, i) {
            var fieldName = field.fieldName;
            var getterReturnType = fieldTypes[i];
            var getter = field.getter;
            var getterContext = field.getterContext;
            var setterArgumentType = fieldTypes[i + fieldRecords.length];
            var setter = field.setter;
            var setterContext = field.setterContext;
            fields[fieldName] = {
              read: function (ptr) {
                return getterReturnType["fromWireType"](
                  getter(getterContext, ptr),
                );
              },
              write: function (ptr, o) {
                var destructors = [];
                setter(
                  setterContext,
                  ptr,
                  setterArgumentType["toWireType"](destructors, o),
                );
                runDestructors(destructors);
              },
            };
          });
          return [
            {
              name: reg.name,
              fromWireType: function (ptr) {
                var rv = {};
                for (var i in fields) {
                  rv[i] = fields[i].read(ptr);
                }
                rawDestructor(ptr);
                return rv;
              },
              toWireType: function (destructors, o) {
                for (var fieldName in fields) {
                  if (!(fieldName in o)) {
                    throw new TypeError('Missing field:  "' + fieldName + '"');
                  }
                }
                var ptr = rawConstructor();
                for (fieldName in fields) {
                  fields[fieldName].write(ptr, o[fieldName]);
                }
                if (destructors !== null) {
                  destructors.push(rawDestructor, ptr);
                }
                return ptr;
              },
              argPackAdvance: 8,
              readValueFromPointer: simpleReadValueFromPointer,
              destructorFunction: rawDestructor,
            },
          ];
        },
      );
    }
    function __embind_register_bigint(
      primitiveType,
      name,
      size,
      minRange,
      maxRange,
    ) {}
    function getShiftFromSize(size) {
      switch (size) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return 2;
        case 8:
          return 3;
        default:
          throw new TypeError("Unknown type size: " + size);
      }
    }
    function embind_init_charCodes() {
      var codes = new Array(256);
      for (var i = 0; i < 256; ++i) {
        codes[i] = String.fromCharCode(i);
      }
      embind_charCodes = codes;
    }
    var embind_charCodes = undefined;
    function readLatin1String(ptr) {
      var ret = "";
      var c = ptr;
      while (HEAPU8[c]) {
        ret += embind_charCodes[HEAPU8[c++]];
      }
      return ret;
    }
    var BindingError = undefined;
    function throwBindingError(message) {
      throw new BindingError(message);
    }
    function registerType(rawType, registeredInstance, options = {}) {
      if (!("argPackAdvance" in registeredInstance)) {
        throw new TypeError(
          "registerType registeredInstance requires argPackAdvance",
        );
      }
      var name = registeredInstance.name;
      if (!rawType) {
        throwBindingError(
          'type "' + name + '" must have a positive integer typeid pointer',
        );
      }
      if (registeredTypes.hasOwnProperty(rawType)) {
        if (options.ignoreDuplicateRegistrations) {
          return;
        } else {
          throwBindingError("Cannot register type '" + name + "' twice");
        }
      }
      registeredTypes[rawType] = registeredInstance;
      delete typeDependencies[rawType];
      if (awaitingDependencies.hasOwnProperty(rawType)) {
        var callbacks = awaitingDependencies[rawType];
        delete awaitingDependencies[rawType];
        callbacks.forEach(function (cb) {
          cb();
        });
      }
    }
    function __embind_register_bool(
      rawType,
      name,
      size,
      trueValue,
      falseValue,
    ) {
      var shift = getShiftFromSize(size);
      name = readLatin1String(name);
      registerType(rawType, {
        name: name,
        fromWireType: function (wt) {
          return !!wt;
        },
        toWireType: function (destructors, o) {
          return o ? trueValue : falseValue;
        },
        argPackAdvance: 8,
        readValueFromPointer: function (pointer) {
          var heap;
          if (size === 1) {
            heap = HEAP8;
          } else if (size === 2) {
            heap = HEAP16;
          } else if (size === 4) {
            heap = HEAP32;
          } else {
            throw new TypeError("Unknown boolean type size: " + name);
          }
          return this["fromWireType"](heap[pointer >> shift]);
        },
        destructorFunction: null,
      });
    }
    function __embind_register_constant(name, type, value) {
      name = readLatin1String(name);
      whenDependentTypesAreResolved([], [type], function (type) {
        type = type[0];
        Module[name] = type["fromWireType"](value);
        return [];
      });
    }
    var emval_free_list = [];
    var emval_handle_array = [
      {},
      { value: undefined },
      { value: null },
      { value: true },
      { value: false },
    ];
    function __emval_decref(handle) {
      if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
        emval_handle_array[handle] = undefined;
        emval_free_list.push(handle);
      }
    }
    function count_emval_handles() {
      var count = 0;
      for (var i = 5; i < emval_handle_array.length; ++i) {
        if (emval_handle_array[i] !== undefined) {
          ++count;
        }
      }
      return count;
    }
    function get_first_emval() {
      for (var i = 5; i < emval_handle_array.length; ++i) {
        if (emval_handle_array[i] !== undefined) {
          return emval_handle_array[i];
        }
      }
      return null;
    }
    function init_emval() {
      Module["count_emval_handles"] = count_emval_handles;
      Module["get_first_emval"] = get_first_emval;
    }
    var Emval = {
      toValue: function (handle) {
        if (!handle) {
          throwBindingError("Cannot use deleted val. handle = " + handle);
        }
        return emval_handle_array[handle].value;
      },
      toHandle: function (value) {
        switch (value) {
          case undefined: {
            return 1;
          }
          case null: {
            return 2;
          }
          case true: {
            return 3;
          }
          case false: {
            return 4;
          }
          default: {
            var handle = emval_free_list.length
              ? emval_free_list.pop()
              : emval_handle_array.length;
            emval_handle_array[handle] = { refcount: 1, value: value };
            return handle;
          }
        }
      },
    };
    function __embind_register_emval(rawType, name) {
      name = readLatin1String(name);
      registerType(rawType, {
        name: name,
        fromWireType: function (handle) {
          var rv = Emval.toValue(handle);
          __emval_decref(handle);
          return rv;
        },
        toWireType: function (destructors, value) {
          return Emval.toHandle(value);
        },
        argPackAdvance: 8,
        readValueFromPointer: simpleReadValueFromPointer,
        destructorFunction: null,
      });
    }
    function ensureOverloadTable(proto, methodName, humanName) {
      if (undefined === proto[methodName].overloadTable) {
        var prevFunc = proto[methodName];
        proto[methodName] = function () {
          if (
            !proto[methodName].overloadTable.hasOwnProperty(arguments.length)
          ) {
            throwBindingError(
              "Function '" +
                humanName +
                "' called with an invalid number of arguments (" +
                arguments.length +
                ") - expects one of (" +
                proto[methodName].overloadTable +
                ")!",
            );
          }
          return proto[methodName].overloadTable[arguments.length].apply(
            this,
            arguments,
          );
        };
        proto[methodName].overloadTable = [];
        proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
      }
    }
    function exposePublicSymbol(name, value, numArguments) {
      if (Module.hasOwnProperty(name)) {
        if (
          undefined === numArguments ||
          (undefined !== Module[name].overloadTable &&
            undefined !== Module[name].overloadTable[numArguments])
        ) {
          throwBindingError("Cannot register public name '" + name + "' twice");
        }
        ensureOverloadTable(Module, name, name);
        if (Module.hasOwnProperty(numArguments)) {
          throwBindingError(
            "Cannot register multiple overloads of a function with the same number of arguments (" +
              numArguments +
              ")!",
          );
        }
        Module[name].overloadTable[numArguments] = value;
      } else {
        Module[name] = value;
        if (undefined !== numArguments) {
          Module[name].numArguments = numArguments;
        }
      }
    }
    function enumReadValueFromPointer(name, shift, signed) {
      switch (shift) {
        case 0:
          return function (pointer) {
            var heap = signed ? HEAP8 : HEAPU8;
            return this["fromWireType"](heap[pointer]);
          };
        case 1:
          return function (pointer) {
            var heap = signed ? HEAP16 : HEAPU16;
            return this["fromWireType"](heap[pointer >> 1]);
          };
        case 2:
          return function (pointer) {
            var heap = signed ? HEAP32 : HEAPU32;
            return this["fromWireType"](heap[pointer >> 2]);
          };
        default:
          throw new TypeError("Unknown integer type: " + name);
      }
    }
    function __embind_register_enum(rawType, name, size, isSigned) {
      var shift = getShiftFromSize(size);
      name = readLatin1String(name);
      function ctor() {}
      ctor.values = {};
      registerType(rawType, {
        name: name,
        constructor: ctor,
        fromWireType: function (c) {
          return this.constructor.values[c];
        },
        toWireType: function (destructors, c) {
          return c.value;
        },
        argPackAdvance: 8,
        readValueFromPointer: enumReadValueFromPointer(name, shift, isSigned),
        destructorFunction: null,
      });
      exposePublicSymbol(name, ctor);
    }
    function getTypeName(type) {
      var ptr = ___getTypeName(type);
      var rv = readLatin1String(ptr);
      _free(ptr);
      return rv;
    }
    function requireRegisteredType(rawType, humanName) {
      var impl = registeredTypes[rawType];
      if (undefined === impl) {
        throwBindingError(
          humanName + " has unknown type " + getTypeName(rawType),
        );
      }
      return impl;
    }
    function __embind_register_enum_value(rawEnumType, name, enumValue) {
      var enumType = requireRegisteredType(rawEnumType, "enum");
      name = readLatin1String(name);
      var Enum = enumType.constructor;
      var Value = Object.create(enumType.constructor.prototype, {
        value: { value: enumValue },
        constructor: {
          value: createNamedFunction(
            enumType.name + "_" + name,
            function () {},
          ),
        },
      });
      Enum.values[enumValue] = Value;
      Enum[name] = Value;
    }
    function floatReadValueFromPointer(name, shift) {
      switch (shift) {
        case 2:
          return function (pointer) {
            return this["fromWireType"](HEAPF32[pointer >> 2]);
          };
        case 3:
          return function (pointer) {
            return this["fromWireType"](HEAPF64[pointer >> 3]);
          };
        default:
          throw new TypeError("Unknown float type: " + name);
      }
    }
    function __embind_register_float(rawType, name, size) {
      var shift = getShiftFromSize(size);
      name = readLatin1String(name);
      registerType(rawType, {
        name: name,
        fromWireType: function (value) {
          return value;
        },
        toWireType: function (destructors, value) {
          return value;
        },
        argPackAdvance: 8,
        readValueFromPointer: floatReadValueFromPointer(name, shift),
        destructorFunction: null,
      });
    }
    function new_(constructor, argumentList) {
      if (!(constructor instanceof Function)) {
        throw new TypeError(
          "new_ called with constructor type " +
            typeof constructor +
            " which is not a function",
        );
      }
      var dummy = createNamedFunction(
        constructor.name || "unknownFunctionName",
        function () {},
      );
      dummy.prototype = constructor.prototype;
      var obj = new dummy();
      var r = constructor.apply(obj, argumentList);
      return r instanceof Object ? r : obj;
    }
    function craftInvokerFunction(
      humanName,
      argTypes,
      classType,
      cppInvokerFunc,
      cppTargetFunc,
    ) {
      var argCount = argTypes.length;
      if (argCount < 2) {
        throwBindingError(
          "argTypes array size mismatch! Must at least get return value and 'this' types!",
        );
      }
      var isClassMethodFunc = argTypes[1] !== null && classType !== null;
      var needsDestructorStack = false;
      for (var i = 1; i < argTypes.length; ++i) {
        if (
          argTypes[i] !== null &&
          argTypes[i].destructorFunction === undefined
        ) {
          needsDestructorStack = true;
          break;
        }
      }
      var returns = argTypes[0].name !== "void";
      var argsList = "";
      var argsListWired = "";
      for (var i = 0; i < argCount - 2; ++i) {
        argsList += (i !== 0 ? ", " : "") + "arg" + i;
        argsListWired += (i !== 0 ? ", " : "") + "arg" + i + "Wired";
      }
      var invokerFnBody =
        "return function " +
        makeLegalFunctionName(humanName) +
        "(" +
        argsList +
        ") {\n" +
        "if (arguments.length !== " +
        (argCount - 2) +
        ") {\n" +
        "throwBindingError('function " +
        humanName +
        " called with ' + arguments.length + ' arguments, expected " +
        (argCount - 2) +
        " args!');\n" +
        "}\n";
      if (needsDestructorStack) {
        invokerFnBody += "var destructors = [];\n";
      }
      var dtorStack = needsDestructorStack ? "destructors" : "null";
      var args1 = [
        "throwBindingError",
        "invoker",
        "fn",
        "runDestructors",
        "retType",
        "classParam",
      ];
      var args2 = [
        throwBindingError,
        cppInvokerFunc,
        cppTargetFunc,
        runDestructors,
        argTypes[0],
        argTypes[1],
      ];
      if (isClassMethodFunc) {
        invokerFnBody +=
          "var thisWired = classParam.toWireType(" + dtorStack + ", this);\n";
      }
      for (var i = 0; i < argCount - 2; ++i) {
        invokerFnBody +=
          "var arg" +
          i +
          "Wired = argType" +
          i +
          ".toWireType(" +
          dtorStack +
          ", arg" +
          i +
          "); // " +
          argTypes[i + 2].name +
          "\n";
        args1.push("argType" + i);
        args2.push(argTypes[i + 2]);
      }
      if (isClassMethodFunc) {
        argsListWired =
          "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired;
      }
      invokerFnBody +=
        (returns ? "var rv = " : "") +
        "invoker(fn" +
        (argsListWired.length > 0 ? ", " : "") +
        argsListWired +
        ");\n";
      if (needsDestructorStack) {
        invokerFnBody += "runDestructors(destructors);\n";
      } else {
        for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
          var paramName = i === 1 ? "thisWired" : "arg" + (i - 2) + "Wired";
          if (argTypes[i].destructorFunction !== null) {
            invokerFnBody +=
              paramName +
              "_dtor(" +
              paramName +
              "); // " +
              argTypes[i].name +
              "\n";
            args1.push(paramName + "_dtor");
            args2.push(argTypes[i].destructorFunction);
          }
        }
      }
      if (returns) {
        invokerFnBody +=
          "var ret = retType.fromWireType(rv);\n" + "return ret;\n";
      } else {
      }
      invokerFnBody += "}\n";
      args1.push(invokerFnBody);
      var invokerFunction = new_(Function, args1).apply(null, args2);
      return invokerFunction;
    }
    function heap32VectorToArray(count, firstElement) {
      var array = [];
      for (var i = 0; i < count; i++) {
        array.push(HEAP32[(firstElement >> 2) + i]);
      }
      return array;
    }
    function replacePublicSymbol(name, value, numArguments) {
      if (!Module.hasOwnProperty(name)) {
        throwInternalError("Replacing nonexistant public symbol");
      }
      if (
        undefined !== Module[name].overloadTable &&
        undefined !== numArguments
      ) {
        Module[name].overloadTable[numArguments] = value;
      } else {
        Module[name] = value;
        Module[name].argCount = numArguments;
      }
    }
    function dynCallLegacy(sig, ptr, args) {
      var f = Module["dynCall_" + sig];
      return args && args.length
        ? f.apply(null, [ptr].concat(args))
        : f.call(null, ptr);
    }
    function dynCall(sig, ptr, args) {
      if (sig.includes("j")) {
        return dynCallLegacy(sig, ptr, args);
      }
      return getWasmTableEntry(ptr).apply(null, args);
    }
    function getDynCaller(sig, ptr) {
      var argCache = [];
      return function () {
        argCache.length = arguments.length;
        for (var i = 0; i < arguments.length; i++) {
          argCache[i] = arguments[i];
        }
        return dynCall(sig, ptr, argCache);
      };
    }
    function embind__requireFunction(signature, rawFunction) {
      signature = readLatin1String(signature);
      function makeDynCaller() {
        if (signature.includes("j")) {
          return getDynCaller(signature, rawFunction);
        }
        return getWasmTableEntry(rawFunction);
      }
      var fp = makeDynCaller();
      if (typeof fp !== "function") {
        throwBindingError(
          "unknown function pointer with signature " +
            signature +
            ": " +
            rawFunction,
        );
      }
      return fp;
    }
    var UnboundTypeError = undefined;
    function throwUnboundTypeError(message, types) {
      var unboundTypes = [];
      var seen = {};
      function visit(type) {
        if (seen[type]) {
          return;
        }
        if (registeredTypes[type]) {
          return;
        }
        if (typeDependencies[type]) {
          typeDependencies[type].forEach(visit);
          return;
        }
        unboundTypes.push(type);
        seen[type] = true;
      }
      types.forEach(visit);
      throw new UnboundTypeError(
        message + ": " + unboundTypes.map(getTypeName).join([", "]),
      );
    }
    function __embind_register_function(
      name,
      argCount,
      rawArgTypesAddr,
      signature,
      rawInvoker,
      fn,
    ) {
      var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      name = readLatin1String(name);
      rawInvoker = embind__requireFunction(signature, rawInvoker);
      exposePublicSymbol(
        name,
        function () {
          throwUnboundTypeError(
            "Cannot call " + name + " due to unbound types",
            argTypes,
          );
        },
        argCount - 1,
      );
      whenDependentTypesAreResolved([], argTypes, function (argTypes) {
        var invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1));
        replacePublicSymbol(
          name,
          craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn),
          argCount - 1,
        );
        return [];
      });
    }
    function integerReadValueFromPointer(name, shift, signed) {
      switch (shift) {
        case 0:
          return signed
            ? function readS8FromPointer(pointer) {
                return HEAP8[pointer];
              }
            : function readU8FromPointer(pointer) {
                return HEAPU8[pointer];
              };
        case 1:
          return signed
            ? function readS16FromPointer(pointer) {
                return HEAP16[pointer >> 1];
              }
            : function readU16FromPointer(pointer) {
                return HEAPU16[pointer >> 1];
              };
        case 2:
          return signed
            ? function readS32FromPointer(pointer) {
                return HEAP32[pointer >> 2];
              }
            : function readU32FromPointer(pointer) {
                return HEAPU32[pointer >> 2];
              };
        default:
          throw new TypeError("Unknown integer type: " + name);
      }
    }
    function __embind_register_integer(
      primitiveType,
      name,
      size,
      minRange,
      maxRange,
    ) {
      name = readLatin1String(name);
      if (maxRange === -1) {
        maxRange = 4294967295;
      }
      var shift = getShiftFromSize(size);
      var fromWireType = (value) => value;
      if (minRange === 0) {
        var bitshift = 32 - 8 * size;
        fromWireType = (value) => (value << bitshift) >>> bitshift;
      }
      var isUnsignedType = name.includes("unsigned");
      var checkAssertions = (value, toTypeName) => {};
      var toWireType;
      if (isUnsignedType) {
        toWireType = function (destructors, value) {
          checkAssertions(value, this.name);
          return value >>> 0;
        };
      } else {
        toWireType = function (destructors, value) {
          checkAssertions(value, this.name);
          return value;
        };
      }
      registerType(primitiveType, {
        name: name,
        fromWireType: fromWireType,
        toWireType: toWireType,
        argPackAdvance: 8,
        readValueFromPointer: integerReadValueFromPointer(
          name,
          shift,
          minRange !== 0,
        ),
        destructorFunction: null,
      });
    }
    function __embind_register_memory_view(rawType, dataTypeIndex, name) {
      var typeMapping = [
        Int8Array,
        Uint8Array,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        Float32Array,
        Float64Array,
      ];
      var TA = typeMapping[dataTypeIndex];
      function decodeMemoryView(handle) {
        handle = handle >> 2;
        var heap = HEAPU32;
        var size = heap[handle];
        var data = heap[handle + 1];
        return new TA(buffer, data, size);
      }
      name = readLatin1String(name);
      registerType(
        rawType,
        {
          name: name,
          fromWireType: decodeMemoryView,
          argPackAdvance: 8,
          readValueFromPointer: decodeMemoryView,
        },
        { ignoreDuplicateRegistrations: true },
      );
    }
    function __embind_register_std_string(rawType, name) {
      name = readLatin1String(name);
      var stdStringIsUTF8 = name === "std::string";
      registerType(rawType, {
        name: name,
        fromWireType: function (value) {
          var length = HEAPU32[value >> 2];
          var str;
          if (stdStringIsUTF8) {
            var decodeStartPtr = value + 4;
            for (var i = 0; i <= length; ++i) {
              var currentBytePtr = value + 4 + i;
              if (i == length || HEAPU8[currentBytePtr] == 0) {
                var maxRead = currentBytePtr - decodeStartPtr;
                var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
                if (str === undefined) {
                  str = stringSegment;
                } else {
                  str += String.fromCharCode(0);
                  str += stringSegment;
                }
                decodeStartPtr = currentBytePtr + 1;
              }
            }
          } else {
            var a = new Array(length);
            for (var i = 0; i < length; ++i) {
              a[i] = String.fromCharCode(HEAPU8[value + 4 + i]);
            }
            str = a.join("");
          }
          _free(value);
          return str;
        },
        toWireType: function (destructors, value) {
          if (value instanceof ArrayBuffer) {
            value = new Uint8Array(value);
          }
          var getLength;
          var valueIsOfTypeString = typeof value === "string";
          if (
            !(
              valueIsOfTypeString ||
              value instanceof Uint8Array ||
              value instanceof Uint8ClampedArray ||
              value instanceof Int8Array
            )
          ) {
            throwBindingError("Cannot pass non-string to std::string");
          }
          if (stdStringIsUTF8 && valueIsOfTypeString) {
            getLength = () => lengthBytesUTF8(value);
          } else {
            getLength = () => value.length;
          }
          var length = getLength();
          var ptr = _malloc(4 + length + 1);
          HEAPU32[ptr >> 2] = length;
          if (stdStringIsUTF8 && valueIsOfTypeString) {
            stringToUTF8(value, ptr + 4, length + 1);
          } else {
            if (valueIsOfTypeString) {
              for (var i = 0; i < length; ++i) {
                var charCode = value.charCodeAt(i);
                if (charCode > 255) {
                  _free(ptr);
                  throwBindingError(
                    "String has UTF-16 code units that do not fit in 8 bits",
                  );
                }
                HEAPU8[ptr + 4 + i] = charCode;
              }
            } else {
              for (var i = 0; i < length; ++i) {
                HEAPU8[ptr + 4 + i] = value[i];
              }
            }
          }
          if (destructors !== null) {
            destructors.push(_free, ptr);
          }
          return ptr;
        },
        argPackAdvance: 8,
        readValueFromPointer: simpleReadValueFromPointer,
        destructorFunction: function (ptr) {
          _free(ptr);
        },
      });
    }
    function __embind_register_std_wstring(rawType, charSize, name) {
      name = readLatin1String(name);
      var decodeString, encodeString, getHeap, lengthBytesUTF, shift;
      if (charSize === 2) {
        decodeString = UTF16ToString;
        encodeString = stringToUTF16;
        lengthBytesUTF = lengthBytesUTF16;
        getHeap = () => HEAPU16;
        shift = 1;
      } else if (charSize === 4) {
        decodeString = UTF32ToString;
        encodeString = stringToUTF32;
        lengthBytesUTF = lengthBytesUTF32;
        getHeap = () => HEAPU32;
        shift = 2;
      }
      registerType(rawType, {
        name: name,
        fromWireType: function (value) {
          var length = HEAPU32[value >> 2];
          var HEAP = getHeap();
          var str;
          var decodeStartPtr = value + 4;
          for (var i = 0; i <= length; ++i) {
            var currentBytePtr = value + 4 + i * charSize;
            if (i == length || HEAP[currentBytePtr >> shift] == 0) {
              var maxReadBytes = currentBytePtr - decodeStartPtr;
              var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
              if (str === undefined) {
                str = stringSegment;
              } else {
                str += String.fromCharCode(0);
                str += stringSegment;
              }
              decodeStartPtr = currentBytePtr + charSize;
            }
          }
          _free(value);
          return str;
        },
        toWireType: function (destructors, value) {
          if (!(typeof value === "string")) {
            throwBindingError(
              "Cannot pass non-string to C++ string type " + name,
            );
          }
          var length = lengthBytesUTF(value);
          var ptr = _malloc(4 + length + charSize);
          HEAPU32[ptr >> 2] = length >> shift;
          encodeString(value, ptr + 4, length + charSize);
          if (destructors !== null) {
            destructors.push(_free, ptr);
          }
          return ptr;
        },
        argPackAdvance: 8,
        readValueFromPointer: simpleReadValueFromPointer,
        destructorFunction: function (ptr) {
          _free(ptr);
        },
      });
    }
    function __embind_register_value_object(
      rawType,
      name,
      constructorSignature,
      rawConstructor,
      destructorSignature,
      rawDestructor,
    ) {
      structRegistrations[rawType] = {
        name: readLatin1String(name),
        rawConstructor: embind__requireFunction(
          constructorSignature,
          rawConstructor,
        ),
        rawDestructor: embind__requireFunction(
          destructorSignature,
          rawDestructor,
        ),
        fields: [],
      };
    }
    function __embind_register_value_object_field(
      structType,
      fieldName,
      getterReturnType,
      getterSignature,
      getter,
      getterContext,
      setterArgumentType,
      setterSignature,
      setter,
      setterContext,
    ) {
      structRegistrations[structType].fields.push({
        fieldName: readLatin1String(fieldName),
        getterReturnType: getterReturnType,
        getter: embind__requireFunction(getterSignature, getter),
        getterContext: getterContext,
        setterArgumentType: setterArgumentType,
        setter: embind__requireFunction(setterSignature, setter),
        setterContext: setterContext,
      });
    }
    function __embind_register_void(rawType, name) {
      name = readLatin1String(name);
      registerType(rawType, {
        isVoid: true,
        name: name,
        argPackAdvance: 0,
        fromWireType: function () {
          return undefined;
        },
        toWireType: function (destructors, o) {
          return undefined;
        },
      });
    }
    function __emval_incref(handle) {
      if (handle > 4) {
        emval_handle_array[handle].refcount += 1;
      }
    }
    function __emval_take_value(type, argv) {
      type = requireRegisteredType(type, "_emval_take_value");
      var v = type["readValueFromPointer"](argv);
      return Emval.toHandle(v);
    }
    function _abort() {
      abort("");
    }
    function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.copyWithin(dest, src, src + num);
    }
    function emscripten_realloc_buffer(size) {
      try {
        wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16);
        updateGlobalBufferAndViews(wasmMemory.buffer);
        return 1;
      } catch (e) {}
    }
    function _emscripten_resize_heap(requestedSize) {
      var oldSize = HEAPU8.length;
      requestedSize = requestedSize >>> 0;
      var maxHeapSize = 2147483648;
      if (requestedSize > maxHeapSize) {
        return false;
      }
      for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
        overGrownHeapSize = Math.min(
          overGrownHeapSize,
          requestedSize + 100663296,
        );
        var newSize = Math.min(
          maxHeapSize,
          alignUp(Math.max(requestedSize, overGrownHeapSize), 65536),
        );
        var replacement = emscripten_realloc_buffer(newSize);
        if (replacement) {
          return true;
        }
      }
      return false;
    }
    var SYSCALLS = {
      mappings: {},
      buffers: [null, [], []],
      printChar: function (stream, curr) {
        var buffer = SYSCALLS.buffers[stream];
        if (curr === 0 || curr === 10) {
          (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
          buffer.length = 0;
        } else {
          buffer.push(curr);
        }
      },
      varargs: undefined,
      get: function () {
        SYSCALLS.varargs += 4;
        var ret = HEAP32[(SYSCALLS.varargs - 4) >> 2];
        return ret;
      },
      getStr: function (ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },
      get64: function (low, high) {
        return low;
      },
    };
    function _fd_close(fd) {
      return 0;
    }
    function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {}
    function _fd_write(fd, iov, iovcnt, pnum) {
      var num = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAP32[iov >> 2];
        var len = HEAP32[(iov + 4) >> 2];
        iov += 8;
        for (var j = 0; j < len; j++) {
          SYSCALLS.printChar(fd, HEAPU8[ptr + j]);
        }
        num += len;
      }
      HEAP32[pnum >> 2] = num;
      return 0;
    }
    function _setTempRet0(val) {
      setTempRet0(val);
    }
    InternalError = Module["InternalError"] = extendError(
      Error,
      "InternalError",
    );
    embind_init_charCodes();
    BindingError = Module["BindingError"] = extendError(Error, "BindingError");
    init_emval();
    UnboundTypeError = Module["UnboundTypeError"] = extendError(
      Error,
      "UnboundTypeError",
    );
    var ASSERTIONS = false;
    function intArrayToString(array) {
      var ret = [];
      for (var i = 0; i < array.length; i++) {
        var chr = array[i];
        if (chr > 255) {
          if (ASSERTIONS) {
            assert(
              false,
              "Character code " +
                chr +
                " (" +
                String.fromCharCode(chr) +
                ")  at offset " +
                i +
                " not in 0x00-0xFF.",
            );
          }
          chr &= 255;
        }
        ret.push(String.fromCharCode(chr));
      }
      return ret.join("");
    }
    var decodeBase64 =
      typeof atob === "function"
        ? atob
        : function (input) {
            var keyStr =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            do {
              enc1 = keyStr.indexOf(input.charAt(i++));
              enc2 = keyStr.indexOf(input.charAt(i++));
              enc3 = keyStr.indexOf(input.charAt(i++));
              enc4 = keyStr.indexOf(input.charAt(i++));
              chr1 = (enc1 << 2) | (enc2 >> 4);
              chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
              chr3 = ((enc3 & 3) << 6) | enc4;
              output = output + String.fromCharCode(chr1);
              if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2);
              }
              if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3);
              }
            } while (i < input.length);
            return output;
          };
    function intArrayFromBase64(s) {
      if (typeof ENVIRONMENT_IS_NODE === "boolean" && ENVIRONMENT_IS_NODE) {
        var buf = Buffer.from(s, "base64");
        return new Uint8Array(
          buf["buffer"],
          buf["byteOffset"],
          buf["byteLength"],
        );
      }
      try {
        var decoded = decodeBase64(s);
        var bytes = new Uint8Array(decoded.length);
        for (var i = 0; i < decoded.length; ++i) {
          bytes[i] = decoded.charCodeAt(i);
        }
        return bytes;
      } catch (_) {
        throw new Error("Converting base64 string to bytes failed.");
      }
    }
    function tryParseAsDataURI(filename) {
      if (!isDataURI(filename)) {
        return;
      }
      return intArrayFromBase64(filename.slice(dataURIPrefix.length));
    }
    var asmLibraryArg = {
      p: __embind_finalize_value_object,
      s: __embind_register_bigint,
      y: __embind_register_bool,
      f: __embind_register_constant,
      x: __embind_register_emval,
      o: __embind_register_enum,
      a: __embind_register_enum_value,
      n: __embind_register_float,
      c: __embind_register_function,
      e: __embind_register_integer,
      b: __embind_register_memory_view,
      m: __embind_register_std_string,
      i: __embind_register_std_wstring,
      q: __embind_register_value_object,
      d: __embind_register_value_object_field,
      z: __embind_register_void,
      j: __emval_decref,
      k: __emval_incref,
      g: __emval_take_value,
      h: _abort,
      w: _emscripten_memcpy_big,
      u: _emscripten_resize_heap,
      v: _fd_close,
      r: _fd_seek,
      l: _fd_write,
      t: _setTempRet0,
    };
    var asm = createWasm();
    var ___wasm_call_ctors = (Module["___wasm_call_ctors"] = function () {
      return (___wasm_call_ctors = Module["___wasm_call_ctors"] =
        Module["asm"]["B"]).apply(null, arguments);
    });
    var _free = (Module["_free"] = function () {
      return (_free = Module["_free"] = Module["asm"]["D"]).apply(
        null,
        arguments,
      );
    });
    var _malloc = (Module["_malloc"] = function () {
      return (_malloc = Module["_malloc"] = Module["asm"]["E"]).apply(
        null,
        arguments,
      );
    });
    var ___getTypeName = (Module["___getTypeName"] = function () {
      return (___getTypeName = Module["___getTypeName"] =
        Module["asm"]["F"]).apply(null, arguments);
    });
    var ___embind_register_native_and_builtin_types = (Module[
      "___embind_register_native_and_builtin_types"
    ] = function () {
      return (___embind_register_native_and_builtin_types = Module[
        "___embind_register_native_and_builtin_types"
      ] =
        Module["asm"]["G"]).apply(null, arguments);
    });
    var dynCall_jiji = (Module["dynCall_jiji"] = function () {
      return (dynCall_jiji = Module["dynCall_jiji"] = Module["asm"]["H"]).apply(
        null,
        arguments,
      );
    });
    var calledRun;
    function ExitStatus(status) {
      this.name = "ExitStatus";
      this.message = "Program terminated with exit(" + status + ")";
      this.status = status;
    }
    dependenciesFulfilled = function runCaller() {
      if (!calledRun) run();
      if (!calledRun) dependenciesFulfilled = runCaller;
    };
    function run(args) {
      args = args || arguments_;
      if (runDependencies > 0) {
        return;
      }
      preRun();
      if (runDependencies > 0) {
        return;
      }
      function doRun() {
        if (calledRun) return;
        calledRun = true;
        Module["calledRun"] = true;
        if (ABORT) return;
        initRuntime();
        readyPromiseResolve(Module);
        if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
        postRun();
      }
      if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(function () {
          setTimeout(function () {
            Module["setStatus"]("");
          }, 1);
          doRun();
        }, 1);
      } else {
        doRun();
      }
    }
    Module["run"] = run;
    if (Module["preInit"]) {
      if (typeof Module["preInit"] == "function")
        Module["preInit"] = [Module["preInit"]];
      while (Module["preInit"].length > 0) {
        Module["preInit"].pop()();
      }
    }
    run();

    return ggwave_factory.ready;
  };
})();
if (typeof exports === "object" && typeof module === "object")
  module.exports = ggwave_factory;
else if (typeof define === "function" && define["amd"])
  define([], function () {
    return ggwave_factory;
  });
else if (typeof exports === "object")
  exports["ggwave_factory"] = ggwave_factory;