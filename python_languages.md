# Python Languages & Implementations

"Python" isn't just one thing under the hood — there are several distinct implementations and dialects of the language, each built for a different purpose (speed, embedded devices, running in a browser, integrating with another platform, and so on). Here's a rundown of the main ones.

## Core / General-Purpose Implementations

**CPython**
The original and by far the most widely used implementation of Python, written in C. When people say "Python," they almost always mean CPython. It's the reference implementation — the one that defines how the language behaves — and it's what you get by default from python.org.

**PyPy**
A fast, alternative implementation of Python written in Python (RPython, a restricted subset) with a Just-In-Time (JIT) compiler. PyPy can run several times faster than CPython on long-running programs because it compiles hot code paths to machine code at runtime, rather than interpreting them every time.

**Stackless Python**
A variant of CPython that removes the C call stack, enabling lightweight "microthreads" (tasklets) and cheap concurrency without the overhead of OS threads. It's used in some game engines and networking software where massive numbers of lightweight tasks are needed.

**Pyston**
A performance-oriented fork of CPython (originally started at Dropbox) that adds just-in-time compilation and other optimizations while staying closely compatible with CPython and its C extensions.

## Cross-Platform / Interop Implementations

**Jython**
An implementation of Python that runs on the Java Virtual Machine (JVM). Jython compiles Python code to Java bytecode, so it can seamlessly import and use Java classes and libraries, making it useful for embedding Python in Java applications.

**IronPython**
An implementation of Python built on the .NET / Common Language Runtime (CLR). It allows Python code to interoperate directly with .NET libraries and other .NET languages like C#.

**GraalPy (formerly GraalPython)**
A high-performance implementation of Python built on GraalVM. It supports interoperability with other GraalVM languages (Java, JavaScript, Ruby, R, etc.) and aims for strong performance via GraalVM's JIT compiler.

**RustPython**
A Python interpreter written entirely in Rust. It can be embedded in Rust applications or compiled to WebAssembly, letting Python code run in places a typical CPython build can't easily go.

## Embedded / Lightweight Implementations

**MicroPython**
A lean, efficient implementation of Python 3 designed to run on microcontrollers and other resource-constrained/embedded hardware (e.g., Raspberry Pi Pico, ESP32). It implements a subset of the standard library suited to small devices.

**CircuitPython**
Adafruit's fork of MicroPython, tailored for education and ease of use on their hardware boards, with extra libraries for sensors, displays, and other electronics.

## Browser-Based Implementations

**Brython**
An implementation of Python 3 that runs directly in the web browser, translating Python code to JavaScript so it can execute client-side in place of (or alongside) JavaScript.

**Skulpt**
A JavaScript implementation of Python aimed primarily at in-browser, educational use — it's what powers a number of online Python teaching tools.

**Pyodide**
A port of CPython to WebAssembly, allowing the actual CPython interpreter (along with many popular scientific packages) to run in the browser or in Node.js.

## Compilers / Supersets (not standalone implementations, but often grouped in)

**Cython**
A superset of Python that lets you add optional static type declarations and compiles Python (or Python-like) code down to C, producing extensions that can be dramatically faster than plain CPython — widely used for performance-critical libraries (e.g., much of the scientific Python stack relies on it under the hood).

**Nuitka**
A Python compiler that translates Python code into C, then compiles it into a standalone executable or extension module, aiming for full CPython compatibility with better performance and easier distribution.

---

### Quick comparison

| Name | Written In | Runs On | Best For |
|---|---|---|---|
| CPython | C | Native | General use, the default |
| PyPy | RPython | Native | Long-running, CPU-heavy programs |
| Stackless Python | C | Native | Lightweight concurrency |
| Jython | Java | JVM | Java interop |
| IronPython | C# | .NET/CLR | .NET interop |
| GraalPy | Java | GraalVM | Polyglot interop, performance |
| RustPython | Rust | Native/WASM | Embedding in Rust, WebAssembly |
| MicroPython | C | Microcontrollers | Embedded/IoT devices |
| CircuitPython | C | Microcontrollers | Education, Adafruit hardware |
| Brython | Python→JS | Browser | Client-side web scripting |
| Skulpt | JavaScript | Browser | Educational tools |
| Pyodide | C (WASM) | Browser/Node.js | Scientific computing in-browser |
| Cython | C | Native | Speeding up Python via C extensions |
| Nuitka | C | Native | Compiling Python to standalone executables |
