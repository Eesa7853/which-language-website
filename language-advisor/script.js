/* ---------------------------------------------------------
   Local dev config (gitignored) — never let a missing
   config.local.js (e.g. a fresh clone with no key set up yet)
   crash the whole page.
--------------------------------------------------------- */
let GEMINI_CONFIG_KEY = null;
try {
  const config = await import("./config.local.js");
  GEMINI_CONFIG_KEY = config.GEMINI_API_KEY || null;
} catch {
  GEMINI_CONFIG_KEY = null;
}

/* ---------------------------------------------------------
   Storage helpers — localStorage can throw (private browsing,
   disabled storage, locked-down browsers); never let that crash
   the whole page.
--------------------------------------------------------- */
function safeGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeSet(key, value) {
  try { localStorage.setItem(key, value); return true; } catch { return false; }
}
function safeRemove(key) {
  try { localStorage.removeItem(key); } catch { /* ignore */ }
}

/* ---------------------------------------------------------
   Hero code-window — clickable language pills swap the snippet
--------------------------------------------------------- */
const HERO_SNIPPETS = {
  python: {
    file: "recommend.py",
    html: `<span class="code-kw">def</span> <span class="code-fn">recommend</span>(goal):
    <span class="code-kw">if</span> <span class="code-str">"web"</span> <span class="code-kw">in</span> goal:
        <span class="code-kw">return</span> <span class="code-str">"JavaScript"</span>
    <span class="code-kw">if</span> <span class="code-str">"data"</span> <span class="code-kw">in</span> goal <span class="code-kw">or</span> <span class="code-str">"ai"</span> <span class="code-kw">in</span> goal:
        <span class="code-kw">return</span> <span class="code-str">"Python"</span>
    <span class="code-kw">if</span> <span class="code-str">"mobile"</span> <span class="code-kw">in</span> goal:
        <span class="code-kw">return</span> <span class="code-str">"Dart / Flutter"</span>
    <span class="code-kw">return</span> <span class="code-str">"it depends"</span> <span class="code-emoji">✨</span>`
  },
  javascript: {
    file: "recommend.js",
    html: `<span class="code-kw">function</span> <span class="code-fn">recommend</span>(goal) {
  <span class="code-kw">if</span> (goal.<span class="code-fn">includes</span>(<span class="code-str">"web"</span>)) <span class="code-kw">return</span> <span class="code-str">"JavaScript"</span>;
  <span class="code-kw">if</span> (goal.<span class="code-fn">includes</span>(<span class="code-str">"data"</span>) <span class="code-kw">||</span> goal.<span class="code-fn">includes</span>(<span class="code-str">"ai"</span>)) <span class="code-kw">return</span> <span class="code-str">"Python"</span>;
  <span class="code-kw">if</span> (goal.<span class="code-fn">includes</span>(<span class="code-str">"mobile"</span>)) <span class="code-kw">return</span> <span class="code-str">"Dart / Flutter"</span>;
  <span class="code-kw">return</span> <span class="code-str">"it depends"</span> <span class="code-emoji">✨</span>;
}`
  },
  rust: {
    file: "recommend.rs",
    html: `<span class="code-kw">fn</span> <span class="code-fn">recommend</span>(goal: &str) -> &str {
    <span class="code-kw">if</span> goal.<span class="code-fn">contains</span>(<span class="code-str">"web"</span>) { <span class="code-kw">return</span> <span class="code-str">"JavaScript"</span>; }
    <span class="code-kw">if</span> goal.<span class="code-fn">contains</span>(<span class="code-str">"data"</span>) <span class="code-kw">||</span> goal.<span class="code-fn">contains</span>(<span class="code-str">"ai"</span>) { <span class="code-kw">return</span> <span class="code-str">"Python"</span>; }
    <span class="code-kw">if</span> goal.<span class="code-fn">contains</span>(<span class="code-str">"mobile"</span>) { <span class="code-kw">return</span> <span class="code-str">"Dart / Flutter"</span>; }
    <span class="code-str">"it depends"</span> <span class="code-emoji">✨</span>
}`
  },
  go: {
    file: "recommend.go",
    html: `<span class="code-kw">func</span> <span class="code-fn">recommend</span>(goal <span class="code-kw">string</span>) <span class="code-kw">string</span> {
    <span class="code-kw">if</span> strings.<span class="code-fn">Contains</span>(goal, <span class="code-str">"web"</span>) { <span class="code-kw">return</span> <span class="code-str">"JavaScript"</span> }
    <span class="code-kw">if</span> strings.<span class="code-fn">Contains</span>(goal, <span class="code-str">"data"</span>) <span class="code-kw">||</span> strings.<span class="code-fn">Contains</span>(goal, <span class="code-str">"ai"</span>) { <span class="code-kw">return</span> <span class="code-str">"Python"</span> }
    <span class="code-kw">if</span> strings.<span class="code-fn">Contains</span>(goal, <span class="code-str">"mobile"</span>) { <span class="code-kw">return</span> <span class="code-str">"Dart / Flutter"</span> }
    <span class="code-kw">return</span> <span class="code-str">"it depends"</span> <span class="code-emoji">✨</span>
}`
  },
  swift: {
    file: "recommend.swift",
    html: `<span class="code-kw">func</span> <span class="code-fn">recommend</span>(_ goal: String) -> String {
    <span class="code-kw">if</span> goal.<span class="code-fn">contains</span>(<span class="code-str">"web"</span>) { <span class="code-kw">return</span> <span class="code-str">"JavaScript"</span> }
    <span class="code-kw">if</span> goal.<span class="code-fn">contains</span>(<span class="code-str">"data"</span>) <span class="code-kw">||</span> goal.<span class="code-fn">contains</span>(<span class="code-str">"ai"</span>) { <span class="code-kw">return</span> <span class="code-str">"Python"</span> }
    <span class="code-kw">if</span> goal.<span class="code-fn">contains</span>(<span class="code-str">"mobile"</span>) { <span class="code-kw">return</span> <span class="code-str">"Dart / Flutter"</span> }
    <span class="code-kw">return</span> <span class="code-str">"it depends"</span> <span class="code-emoji">✨</span>
}`
  },
  sql: {
    file: "recommend.sql",
    html: `<span class="code-kw">SELECT CASE</span>
  <span class="code-kw">WHEN</span> goal <span class="code-kw">LIKE</span> <span class="code-str">'%web%'</span> <span class="code-kw">THEN</span> <span class="code-str">'JavaScript'</span>
  <span class="code-kw">WHEN</span> goal <span class="code-kw">LIKE</span> <span class="code-str">'%data%'</span> <span class="code-kw">OR</span> goal <span class="code-kw">LIKE</span> <span class="code-str">'%ai%'</span> <span class="code-kw">THEN</span> <span class="code-str">'Python'</span>
  <span class="code-kw">WHEN</span> goal <span class="code-kw">LIKE</span> <span class="code-str">'%mobile%'</span> <span class="code-kw">THEN</span> <span class="code-str">'Dart / Flutter'</span>
  <span class="code-kw">ELSE</span> <span class="code-str">'it depends'</span> <span class="code-emoji">✨</span>
<span class="code-kw">END AS</span> language <span class="code-kw">FROM</span> goals;`
  }
};

const codeWindowFile = document.getElementById("code-window-file");
const codeWindowBody = document.getElementById("code-window-body");
const codeWindowPills = document.getElementById("code-window-pills");

if (codeWindowPills) {
  codeWindowPills.querySelectorAll(".code-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      const snippet = HERO_SNIPPETS[pill.dataset.lang];
      if (!snippet) return;
      codeWindowPills.querySelectorAll(".code-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      codeWindowFile.textContent = snippet.file;
      codeWindowBody.innerHTML = snippet.html;
    });
  });
}

/* ---------------------------------------------------------
   Language data
--------------------------------------------------------- */
const LANGUAGES = [
  {
    id: "python",
    name: "Python",
    tagline: "Reads almost like English. The default choice for beginners, data, and AI.",
    difficulty: "Beginner",
    tags: ["web", "data", "ai", "automation", "beginner-friendly"],
    example: `<span class="code-kw">match</span> command:
    <span class="code-kw">case</span> <span class="code-str">"start"</span>:
        <span class="code-fn">run</span>()
    <span class="code-kw">case</span> <span class="code-str">"stop"</span>:
        <span class="code-fn">halt</span>()
    <span class="code-kw">case</span> _:
        <span class="code-fn">print</span>(<span class="code-str">"unknown"</span>)`,
    resources: [
      { label: "Official docs & tutorial", type: "Docs", url: "https://docs.python.org/3/tutorial/" },
      { label: "freeCodeCamp: Scientific Computing with Python", type: "Free course", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/" },
      { label: "Codecademy: Learn Python 3", type: "Interactive course", url: "https://www.codecademy.com/learn/learn-python-3" },
      { label: "Build an MCP server (official Python SDK)", type: "Real project", url: "https://github.com/modelcontextprotocol/python-sdk" }
    ],
    project: "Write a script that renames/organizes files in a folder, or build a simple MCP server with the official SDK once you know the basics."
  },
  {
    id: "javascript",
    name: "JavaScript",
    tagline: "The language of the web. Runs in every browser and, via Node.js, on servers too.",
    difficulty: "Beginner",
    tags: ["web", "beginner-friendly", "career"],
    example: `<span class="code-kw">switch</span> (fruit) {
  <span class="code-kw">case</span> <span class="code-str">"apple"</span>:
    <span class="code-fn">console</span>.<span class="code-fn">log</span>(<span class="code-str">"$0.59/lb"</span>);
    <span class="code-kw">break</span>;
  <span class="code-kw">default</span>:
    <span class="code-fn">console</span>.<span class="code-fn">log</span>(<span class="code-str">"not sure"</span>);
}`,
    resources: [
      { label: "MDN JavaScript guide", type: "Docs", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
      { label: "javascript.info — modern tutorial", type: "Free course", url: "https://javascript.info/" },
      { label: "freeCodeCamp: JS Algorithms & Data Structures", type: "Free course", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
      { label: "Official MCP SDK (JS/TypeScript)", type: "Real project", url: "https://github.com/modelcontextprotocol/typescript-sdk" }
    ],
    project: "Build a to-do list app that runs entirely in the browser using HTML, CSS, and JavaScript."
  },
  {
    id: "typescript",
    name: "TypeScript",
    tagline: "JavaScript with a safety net — adds types that catch bugs before you run the code.",
    difficulty: "Moderate",
    tags: ["web", "career"],
    example: `<span class="code-kw">interface</span> <span class="code-fn">User</span> {
  name: <span class="code-kw">string</span>;
  age: <span class="code-kw">number</span>;
}`,
    resources: [
      { label: "Official TypeScript handbook", type: "Docs", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
      { label: "TypeScript docs — full site", type: "Docs", url: "https://www.typescriptlang.org/docs/" },
      { label: "Total TypeScript — free tutorials", type: "Free course", url: "https://www.totaltypescript.com/" },
      { label: "Official MCP SDK for TypeScript", type: "Real project", url: "https://github.com/modelcontextprotocol/typescript-sdk" }
    ],
    project: "Take a small JavaScript project you've built and convert it to TypeScript, fixing the type errors it surfaces."
  },
  {
    id: "java",
    name: "Java",
    tagline: "Verbose but rock-solid. Runs banks, Android apps, and half the enterprise world.",
    difficulty: "Moderate",
    tags: ["mobile", "career", "enterprise"],
    example: `<span class="code-kw">switch</span> (day) {
    <span class="code-kw">case</span> 1 -> System.out.<span class="code-fn">println</span>(<span class="code-str">"Mon"</span>);
    <span class="code-kw">case</span> 2 -> System.out.<span class="code-fn">println</span>(<span class="code-str">"Tue"</span>);
    <span class="code-kw">default</span> -> System.out.<span class="code-fn">println</span>(<span class="code-str">"Other"</span>);
}`,
    resources: [
      { label: "dev.java — official learning path", type: "Docs", url: "https://dev.java/learn/" },
      { label: "Oracle Java documentation", type: "Docs", url: "https://docs.oracle.com/en/java/" },
      { label: "Codecademy: Learn Java", type: "Interactive course", url: "https://www.codecademy.com/learn/learn-java" },
      { label: "Official MCP SDK for Java", type: "Real project", url: "https://github.com/modelcontextprotocol/java-sdk" }
    ],
    project: "Build a simple command-line inventory or library-catalog system using classes and collections."
  },
  {
    id: "csharp",
    name: "C#",
    tagline: "Microsoft's flagship language — game dev with Unity, desktop apps, and enterprise backends.",
    difficulty: "Moderate",
    tags: ["games", "desktop", "career", "enterprise"],
    example: `<span class="code-kw">using var</span> file = File.<span class="code-fn">OpenText</span>(<span class="code-str">"data.txt"</span>);
Console.<span class="code-fn">WriteLine</span>(file.<span class="code-fn">ReadLine</span>());`,
    resources: [
      { label: "Microsoft Learn: C# first steps", type: "Free course", url: "https://learn.microsoft.com/en-us/training/paths/csharp-first-steps/" },
      { label: "Official C# documentation", type: "Docs", url: "https://learn.microsoft.com/en-us/dotnet/csharp/" },
      { label: ".NET learning hub", type: "Docs", url: "https://dotnet.microsoft.com/en-us/learn" },
      { label: "Official MCP SDK for C#", type: "Real project", url: "https://github.com/modelcontextprotocol/csharp-sdk" }
    ],
    project: "Make a small 2D game in Unity, or a desktop utility app with Windows Forms/.NET."
  },
  {
    id: "cpp",
    name: "C++",
    tagline: "Maximum control and speed. Powers game engines, browsers, and performance-critical systems.",
    difficulty: "Steep",
    tags: ["games", "systems", "performance"],
    example: `<span class="code-kw">if</span> (<span class="code-kw">auto</span> it = m.<span class="code-fn">find</span>(key); it != m.<span class="code-fn">end</span>()) {
    <span class="code-fn">use</span>(it->second);
}`,
    resources: [
      { label: "learncpp.com — full free course", type: "Free course", url: "https://www.learncpp.com/" },
      { label: "cppreference — the language reference", type: "Docs", url: "https://en.cppreference.com/" },
      { label: "cplusplus.com tutorial", type: "Docs", url: "https://cplusplus.com/doc/tutorial/" },
      { label: "Lightweight C++ MCP SDK", type: "Real project", url: "https://github.com/hkr04/cpp-mcp" }
    ],
    project: "Implement a simple linked list or a text-based game like tic-tac-toe from scratch, managing memory yourself."
  },
  {
    id: "c",
    name: "C",
    tagline: "The bedrock of modern computing. Understand C and you understand how computers actually work.",
    difficulty: "Steep",
    tags: ["systems", "performance"],
    example: `<span class="code-kw">for</span> (<span class="code-kw">int</span> i = 0; i &lt; 5; i++) {
    <span class="code-fn">printf</span>(<span class="code-str">"%d\\n"</span>, i);
}`,
    resources: [
      { label: "Learn-C.org — interactive tutorial", type: "Free course", url: "https://www.learn-c.org/" },
      { label: "Beej's Guide to C Programming", type: "Free course", url: "https://beej.us/guide/bgc/" },
      { label: "cppreference — C reference", type: "Docs", url: "https://en.cppreference.com/w/c" },
      { label: "Cross-platform C SDK for MCP", type: "Real project", url: "https://github.com/micl2e2/mcpc" }
    ],
    project: "Write a program that manages memory manually — like a basic dynamic array or a tiny key-value store."
  },
  {
    id: "go",
    name: "Go",
    tagline: "Simple syntax, built-in concurrency, fast compiles. A favorite for backend and cloud infrastructure.",
    difficulty: "Moderate",
    tags: ["web", "systems", "career"],
    example: `<span class="code-kw">func</span> <span class="code-fn">readFile</span>() {
    f, _ := os.<span class="code-fn">Open</span>(<span class="code-str">"data.txt"</span>)
    <span class="code-kw">defer</span> f.<span class="code-fn">Close</span>()
}`,
    resources: [
      { label: "A Tour of Go — official interactive tour", type: "Interactive course", url: "https://go.dev/tour/welcome/1" },
      { label: "Official Go documentation", type: "Docs", url: "https://go.dev/doc/" },
      { label: "Go by Example", type: "Free course", url: "https://gobyexample.com/" },
      { label: "Official MCP SDK for Go", type: "Real project", url: "https://github.com/modelcontextprotocol/go-sdk" }
    ],
    project: "Build a small REST API for a notes app, or a CLI tool that fetches and formats data from a public API."
  },
  {
    id: "rust",
    name: "Rust",
    tagline: "C++-level performance with a compiler that refuses to let you write memory-unsafe code.",
    difficulty: "Steep",
    tags: ["systems", "performance", "career"],
    example: `<span class="code-kw">let</span> Some(x) = maybe_value <span class="code-kw">else</span> {
    <span class="code-kw">return</span>;
};`,
    resources: [
      { label: "The Rust Book — official free book", type: "Free course", url: "https://doc.rust-lang.org/book/" },
      { label: "Rust by Example", type: "Free course", url: "https://doc.rust-lang.org/rust-by-example/" },
      { label: "rust-lang.org/learn", type: "Docs", url: "https://www.rust-lang.org/learn" },
      { label: "Official MCP SDK for Rust", type: "Real project", url: "https://github.com/modelcontextprotocol/rust-sdk" }
    ],
    project: "Build a command-line tool (like a file search utility) and fight the borrow checker until it compiles."
  },
  {
    id: "swift",
    name: "Swift",
    tagline: "Apple's language for building iOS, iPadOS, and macOS apps.",
    difficulty: "Moderate",
    tags: ["mobile", "career"],
    example: `<span class="code-kw">guard let</span> name = person[<span class="code-str">"name"</span>] <span class="code-kw">else</span> {
    <span class="code-kw">return</span>
}
<span class="code-fn">print</span>(<span class="code-str">"Hello \\(name)!"</span>)`,
    resources: [
      { label: "100 Days of SwiftUI (free)", type: "Free course", url: "https://www.hackingwithswift.com/100" },
      { label: "Official Swift documentation", type: "Docs", url: "https://www.swift.org/documentation/" },
      { label: "Apple's SwiftUI tutorials", type: "Interactive course", url: "https://developer.apple.com/tutorials/swiftui" },
      { label: "Official MCP SDK for Swift", type: "Real project", url: "https://github.com/modelcontextprotocol/swift-sdk" }
    ],
    project: "Build a simple iOS app — a habit tracker or unit converter — using SwiftUI."
  },
  {
    id: "kotlin",
    name: "Kotlin",
    tagline: "The modern, official language for Android development. Also runs anywhere Java does.",
    difficulty: "Moderate",
    tags: ["mobile", "career"],
    example: `<span class="code-kw">val</span> result = <span class="code-kw">when</span> (x) {
    1 -> <span class="code-str">"one"</span>
    2 -> <span class="code-str">"two"</span>
    <span class="code-kw">else</span> -> <span class="code-str">"other"</span>
}`,
    resources: [
      { label: "Kotlin official docs & getting started", type: "Docs", url: "https://kotlinlang.org/docs/getting-started.html" },
      { label: "kotlinlang.org — full documentation", type: "Docs", url: "https://kotlinlang.org/docs/home.html" },
      { label: "Android developer courses (Google)", type: "Free course", url: "https://developer.android.com/courses" },
      { label: "Official MCP SDK for Kotlin", type: "Real project", url: "https://github.com/modelcontextprotocol/kotlin-sdk" }
    ],
    project: "Build a basic Android app, like a tip calculator or a shopping list."
  },
  {
    id: "dart",
    name: "Dart / Flutter",
    tagline: "Google's language + framework for building one app that runs on iOS, Android, web, and desktop.",
    difficulty: "Moderate",
    tags: ["mobile", "web"],
    example: `<span class="code-kw">switch</span> (command) {
  <span class="code-kw">case</span> <span class="code-str">'OPEN'</span>:
    <span class="code-fn">openDoor</span>();
  <span class="code-kw">case</span> <span class="code-str">'CLOSED'</span>:
    <span class="code-fn">closeDoor</span>();
}`,
    resources: [
      { label: "Official Dart guides", type: "Docs", url: "https://dart.dev/guides" },
      { label: "Flutter — learn to build apps", type: "Free course", url: "https://flutter.dev/learn" },
      { label: "Dart tutorials", type: "Docs", url: "https://dart.dev/tutorials" },
      { label: "MCP SDK for Dart", type: "Real project", url: "https://github.com/leehack/mcp_dart" }
    ],
    project: "Build one small app (like a countdown timer) and run it on both Android and iOS from the same codebase."
  },
  {
    id: "php",
    name: "PHP",
    tagline: "Powers a huge share of the web (including WordPress). Unglamorous, extremely employable.",
    difficulty: "Beginner",
    tags: ["web", "career"],
    example: `<span class="code-kw">foreach</span> ($items <span class="code-kw">as</span> $key => $value) {
    <span class="code-fn">echo</span> <span class="code-str">"$key: $value"</span>;
}`,
    resources: [
      { label: "Official PHP manual — getting started", type: "Docs", url: "https://www.php.net/manual/en/getting-started.php" },
      { label: "freeCodeCamp: The PHP Handbook", type: "Free course", url: "https://www.freecodecamp.org/news/the-php-handbook/" },
      { label: "Laracasts (Laravel/PHP screencasts)", type: "Course", url: "https://laracasts.com/" },
      { label: "Official MCP SDK for PHP", type: "Real project", url: "https://github.com/modelcontextprotocol/php-sdk" }
    ],
    project: "Build a simple contact form that saves submissions to a database, without a framework first."
  },
  {
    id: "ruby",
    name: "Ruby",
    tagline: "Designed for programmer happiness. Clean syntax, and the backbone of the Ruby on Rails framework.",
    difficulty: "Beginner",
    tags: ["web", "beginner-friendly"],
    example: `<span class="code-kw">unless</span> authenticated
  <span class="code-fn">redirect_to_login</span>
<span class="code-kw">end</span>`,
    resources: [
      { label: "Official Ruby documentation", type: "Docs", url: "https://www.ruby-lang.org/en/documentation/" },
      { label: "Codecademy: Learn Ruby", type: "Interactive course", url: "https://www.codecademy.com/learn/learn-ruby" },
      { label: "Ruby Koans — learn by fixing tests", type: "Free course", url: "https://rubykoans.com/" },
      { label: "Official MCP SDK for Ruby", type: "Real project", url: "https://github.com/modelcontextprotocol/ruby-sdk" }
    ],
    project: "Build a command-line quiz game or a simple blog backend with Ruby on Rails."
  },
  {
    id: "sql",
    name: "SQL",
    tagline: "Not a general-purpose language, but essential: how you talk to almost every database.",
    difficulty: "Beginner",
    tags: ["data", "career"],
    example: `<span class="code-kw">SELECT CASE</span>
  <span class="code-kw">WHEN</span> age &lt; 18 <span class="code-kw">THEN</span> <span class="code-str">'minor'</span>
  <span class="code-kw">ELSE</span> <span class="code-str">'adult'</span>
<span class="code-kw">END</span>
<span class="code-kw">FROM</span> users;`,
    resources: [
      { label: "SQLBolt — interactive lessons", type: "Interactive course", url: "https://sqlbolt.com/" },
      { label: "Khan Academy: Intro to SQL", type: "Free course", url: "https://www.khanacademy.org/computing/computer-programming/sql" },
      { label: "Mode's SQL tutorial", type: "Free course", url: "https://mode.com/sql-tutorial/" },
      { label: "Official MCP reference servers (database access)", type: "Real project", url: "https://github.com/modelcontextprotocol/servers" }
    ],
    project: "Load a public dataset (like movie ratings) into a database and write queries to answer questions about it."
  },
  {
    id: "r",
    name: "R",
    tagline: "Built by and for statisticians. Deep roots in academia, research, and statistical analysis.",
    difficulty: "Moderate",
    tags: ["data", "ai"],
    example: `i &lt;- 1
<span class="code-kw">repeat</span> {
  <span class="code-fn">print</span>(i)
  <span class="code-kw">if</span> (i >= 5) <span class="code-kw">break</span>
  i &lt;- i + 1
}`,
    resources: [
      { label: "R for Data Science (free book)", type: "Free course", url: "https://r4ds.hadley.nz/" },
      { label: "swirl — learn R interactively, in R", type: "Interactive course", url: "https://swirlstats.com/" },
      { label: "The R Project — official site", type: "Docs", url: "https://www.r-project.org/" },
      { label: "MCP for R, from Posit (RStudio)", type: "Real project", url: "https://github.com/posit-dev/mcptools" }
    ],
    project: "Take a public CSV dataset and produce a short statistical report with a few charts using ggplot2."
  },
  {
    id: "lua",
    name: "Lua",
    tagline: "A tiny, fast scripting language embedded inside bigger programs — best known as how Roblox games are built.",
    difficulty: "Beginner",
    tags: ["games", "automation", "beginner-friendly"],
    example: `<span class="code-kw">local</span> i = 1
<span class="code-kw">repeat</span>
  <span class="code-fn">print</span>(i)
  i = i + 1
<span class="code-kw">until</span> i > 5`,
    resources: [
      { label: "Programming in Lua (free official book)", type: "Free course", url: "https://www.lua.org/pil/contents.html" },
      { label: "Learn X in Y minutes: Lua", type: "Docs", url: "https://learnxinyminutes.com/docs/lua/" },
      { label: "Official Lua 5.4 reference manual", type: "Docs", url: "https://www.lua.org/manual/5.4/" },
      { label: "Roblox Creator Docs (Luau)", type: "Real project", url: "https://create.roblox.com/docs/luau" },
      { label: "MCP implementation in Lua", type: "Real project", url: "https://github.com/dennisonbertram/mcp-lua" }
    ],
    project: "Build a simple script in Roblox Studio (Luau) that reacts to a player action, or write a small config/plugin script for Neovim."
  },
  {
    id: "bash",
    name: "Bash / Shell",
    tagline: "The scripting glue of every Unix system — a few lines here save you hours of repetitive manual work.",
    difficulty: "Beginner",
    tags: ["automation", "systems", "beginner-friendly"],
    example: `<span class="code-kw">until</span> [ <span class="code-str">"$done"</span> = <span class="code-str">"true"</span> ]; <span class="code-kw">do</span>
  <span class="code-fn">check_status</span>
<span class="code-kw">done</span>`,
    resources: [
      { label: "GNU Bash reference manual", type: "Docs", url: "https://www.gnu.org/software/bash/manual/bash.html" },
      { label: "Learn Shell — free interactive tutorial", type: "Interactive course", url: "https://www.learnshell.org/" },
      { label: "Codecademy: Learn Bash Scripting", type: "Interactive course", url: "https://www.codecademy.com/learn/bash-scripting" },
      { label: "MCP server framework for Bash", type: "Real project", url: "https://github.com/yaniv-golan/mcp-bash-framework" }
    ],
    project: "Write a script that backs up a folder on a schedule, or one that automatically renames and sorts a messy Downloads folder."
  },
  {
    id: "scala",
    name: "Scala",
    tagline: "Java's JVM power meets functional programming — the language behind Spark and a lot of big-data infrastructure.",
    difficulty: "Steep",
    tags: ["data", "enterprise", "career"],
    example: `<span class="code-kw">val</span> doubled = <span class="code-kw">for</span>
  x &lt;- 1 <span class="code-kw">to</span> 5
<span class="code-kw">yield</span> x * 2`,
    resources: [
      { label: "Official Scala documentation", type: "Docs", url: "https://docs.scala-lang.org/" },
      { label: "Tour of Scala — interactive intro", type: "Interactive course", url: "https://docs.scala-lang.org/tour/tour-of-scala.html" },
      { label: "The Scala 3 Book (free)", type: "Free course", url: "https://docs.scala-lang.org/scala3/book/introduction.html" },
      { label: "MCP server in Scala", type: "Real project", url: "https://github.com/windymelt/mcp-scala" }
    ],
    project: "Write a small command-line tool that processes a list of records using Scala's collections and pattern matching."
  },
  {
    id: "elixir",
    name: "Elixir",
    tagline: "Built for systems that can't go down — a concurrent, fault-tolerant language behind Discord's real-time infrastructure.",
    difficulty: "Moderate",
    tags: ["web", "career"],
    example: `<span class="code-kw">cond do</span>
  score >= 90 -> <span class="code-str">"A"</span>
  score >= 80 -> <span class="code-str">"B"</span>
  <span class="code-kw">true</span> -> <span class="code-str">"F"</span>
<span class="code-kw">end</span>`,
    resources: [
      { label: "Official Elixir getting-started guide", type: "Docs", url: "https://hexdocs.pm/elixir/introduction.html" },
      { label: "Elixir School — free lessons", type: "Free course", url: "https://elixirschool.com/" },
      { label: "elixir-lang.org learning hub", type: "Docs", url: "https://elixir-lang.org/learning/" },
      { label: "Anubis MCP — Elixir MCP SDK", type: "Real project", url: "https://github.com/zoedsoupe/anubis-mcp" }
    ],
    project: "Build a simple real-time chat room with Phoenix Channels, or a small worker pool that never crashes the whole app."
  },
  {
    id: "julia",
    name: "Julia",
    tagline: "Reads almost like Python, runs almost like C — built specifically for fast numerical and scientific computing.",
    difficulty: "Moderate",
    tags: ["data", "ai", "performance"],
    example: `<span class="code-kw">if</span> x &lt; y
    <span class="code-fn">println</span>(<span class="code-str">"less"</span>)
<span class="code-kw">elseif</span> x > y
    <span class="code-fn">println</span>(<span class="code-str">"greater"</span>)
<span class="code-kw">else</span>
    <span class="code-fn">println</span>(<span class="code-str">"equal"</span>)
<span class="code-kw">end</span>`,
    resources: [
      { label: "Official Julia documentation", type: "Docs", url: "https://docs.julialang.org/" },
      { label: "Getting Started with Julia (official)", type: "Free course", url: "https://julialang.org/learning/getting-started/" },
      { label: "JuliaAcademy — free courses", type: "Free course", url: "https://julialang.org/learning/" },
      { label: "ModelContextProtocol.jl — MCP server SDK", type: "Real project", url: "https://github.com/JuliaSMLM/ModelContextProtocol.jl" }
    ],
    project: "Take a numerical dataset and benchmark a hand-written loop against Julia's built-in vectorized operations."
  },
  {
    id: "zig",
    name: "Zig",
    tagline: "A modern, minimal alternative to C — full manual control over memory, without decades of historical baggage.",
    difficulty: "Steep",
    tags: ["systems", "performance"],
    example: `<span class="code-kw">const</span> file = <span class="code-kw">try</span> <span class="code-fn">openFile</span>();
<span class="code-kw">defer</span> file.<span class="code-fn">close</span>();`,
    resources: [
      { label: "Official Zig documentation", type: "Docs", url: "https://ziglang.org/documentation/master/" },
      { label: "ziglearn.org — free guide", type: "Free course", url: "https://ziglearn.org/" },
      { label: "Official Zig learning hub", type: "Docs", url: "https://ziglang.org/learn/getting-started/" },
      { label: "mcp.zig — MCP library for Zig", type: "Real project", url: "https://github.com/muhammad-fiaz/mcp.zig" }
    ],
    project: "Implement a basic memory allocator or a small command-line tool, managing every allocation by hand."
  },
  {
    id: "solidity",
    name: "Solidity",
    tagline: "The language of Ethereum smart contracts — code that moves real money, so mistakes are genuinely expensive.",
    difficulty: "Moderate",
    tags: ["career", "blockchain"],
    example: `<span class="code-kw">try</span> feed.<span class="code-fn">getData</span>(token) <span class="code-kw">returns</span> (uint v) {
    <span class="code-kw">return</span> v;
} <span class="code-kw">catch</span> {
    <span class="code-kw">return</span> 0;
}`,
    resources: [
      { label: "Official Solidity documentation", type: "Docs", url: "https://docs.soliditylang.org/" },
      { label: "CryptoZombies — free interactive course", type: "Interactive course", url: "https://cryptozombies.io/" },
      { label: "Full Blockchain & Solidity course (freeCodeCamp)", type: "Free course", url: "https://github.com/smartcontractkit/full-blockchain-solidity-course-js" },
      { label: "OpenZeppelin Contracts — industry-standard library", type: "Real project", url: "https://github.com/OpenZeppelin/openzeppelin-contracts" }
    ],
    project: "Write and deploy a simple ERC-20 token or a basic voting smart contract to a testnet."
  }
];

/* ---------------------------------------------------------
   Quiz definition
   Each option adds points to languages via `scores`.
--------------------------------------------------------- */
const QUIZ = [
  {
    question: "What do you mainly want to build or do?",
    key: "goal",
    options: [
      { label: "Websites & web apps", sub: "Anything that runs in a browser", scores: { javascript: 3, typescript: 2, python: 2, php: 2, ruby: 2, go: 1, elixir: 1 } },
      { label: "Mobile apps", sub: "iOS, Android, or both", scores: { swift: 3, kotlin: 3, dart: 3, javascript: 1 } },
      { label: "Data analysis, AI, or machine learning", sub: "Working with numbers, models, and datasets", scores: { python: 4, r: 3, sql: 2, julia: 2, scala: 1 } },
      { label: "Games", sub: "2D, 3D, big or small", scores: { csharp: 3, cpp: 3, python: 1, lua: 2 } },
      { label: "Automate boring tasks / scripts", sub: "Save yourself time on repetitive stuff", scores: { python: 4, javascript: 2, bash: 3 } },
      { label: "Desktop software", sub: "Apps that run natively on a computer", scores: { csharp: 3, java: 2, cpp: 2, python: 1 } },
      { label: "Systems, hardware, or performance-critical software", sub: "Operating systems, embedded devices, engines", scores: { c: 3, cpp: 3, rust: 3, go: 1, zig: 3 } },
      { label: "I'm not sure yet — I just want to start coding", sub: "Give me something forgiving and widely useful", scores: { python: 3, javascript: 2 } }
    ]
  },
  {
    question: "Any prior programming experience?",
    key: "experience",
    options: [
      { label: "None at all", sub: "This would be my first language", scores: { python: 2, javascript: 1, ruby: 1 } },
      { label: "A little", sub: "I've done a tutorial or a class", scores: { python: 1, javascript: 1, typescript: 1 } },
      { label: "Yes, I know at least one language well", sub: "Looking to add a new one", scores: { rust: 2, go: 2, cpp: 1, kotlin: 1, zig: 1, elixir: 1 } }
    ]
  },
  {
    question: "What matters most to you right now?",
    key: "priority",
    options: [
      { label: "Getting hired / switching careers fast", sub: "Job-market demand is the priority", scores: { javascript: 2, python: 2, java: 2, sql: 2, csharp: 1, scala: 1 } },
      { label: "Learning fundamentals deeply", sub: "I want to really understand how computers work", scores: { c: 3, cpp: 2, rust: 1, zig: 2 } },
      { label: "Building something fun quickly", sub: "I want to see results fast and stay motivated", scores: { python: 2, javascript: 2, ruby: 2 } },
      { label: "Long-term depth in one ecosystem", sub: "I'm fine with a slower ramp-up for more power later", scores: { rust: 2, cpp: 2, go: 1, kotlin: 1, scala: 1, zig: 1 } }
    ]
  },
  {
    question: "How do you feel about strict rules vs. quick, forgiving code?",
    key: "style",
    options: [
      { label: "Forgiving and quick to see results", sub: "Fewer rules, faster feedback loop", scores: { python: 2, javascript: 2, ruby: 2, php: 1 } },
      { label: "I don't mind a stricter, more structured language", sub: "I'm fine with more setup if it prevents bugs", scores: { typescript: 2, java: 2, csharp: 2, rust: 2, go: 1, cpp: 1, scala: 2 } }
    ]
  }
];

/* ---------------------------------------------------------
   Free-text goal matcher ("Just ask")
--------------------------------------------------------- */
const GOAL_KEYWORDS = [
  { patterns: ["calculator"], scores: { python: 3, javascript: 1, csharp: 1 } },
  { patterns: ["website", "web app", "web application", "webpage", "web page", "landing page"], scores: { javascript: 3, python: 1, php: 1 } },
  { patterns: ["blog"], scores: { javascript: 2, php: 2, python: 1 } },
  { patterns: ["portfolio"], scores: { javascript: 3 } },
  { patterns: ["todo", "to-do", "task list", "task manager"], scores: { javascript: 2, python: 2 } },
  { patterns: ["video game", "2d game", "3d game", "game"], scores: { csharp: 3, python: 2, cpp: 1, lua: 1 } },
  { patterns: ["roblox"], scores: { lua: 4 } },
  { patterns: ["neovim", "nvim", "vim plugin", "wow addon", "world of warcraft addon", "game mod", "lua script", "lua"], scores: { lua: 4 } },
  { patterns: ["mobile app", "android app", "android"], scores: { kotlin: 3, java: 1 } },
  { patterns: ["ios app", "iphone app", "ios"], scores: { swift: 3 } },
  { patterns: ["cross-platform app", "cross platform app", "flutter"], scores: { dart: 3 } },
  { patterns: ["discord bot", "telegram bot", "chatbot", "bot"], scores: { python: 3, javascript: 1 } },
  { patterns: ["scraper", "web scraping", "scrape"], scores: { python: 3 } },
  { patterns: ["automate", "automation", "script"], scores: { python: 3, bash: 2 } },
  { patterns: ["bash script", "shell script", "cron job", "cron", "linux script", "terminal automation"], scores: { bash: 4 } },
  { patterns: ["data analysis", "data science", "spreadsheet", "chart", "visualization", "dataset"], scores: { python: 3, r: 2, julia: 1 } },
  { patterns: ["numerical computing", "scientific computing", "simulation"], scores: { julia: 4 } },
  { patterns: ["big data", "spark", "data pipeline"], scores: { scala: 4 } },
  { patterns: ["elixir", "phoenix framework", "erlang"], scores: { elixir: 4 } },
  { patterns: ["zig"], scores: { zig: 4 } },
  { patterns: ["smart contract", "solidity", "ethereum", "web3", "nft", "crypto token"], scores: { solidity: 4 } },
  { patterns: ["machine learning", "ai model", "neural network", "deep learning", "artificial intelligence"], scores: { python: 4 } },
  { patterns: ["rest api", "backend", "api", "server"], scores: { javascript: 2, python: 2, go: 2 } },
  { patterns: ["database", "sql", "query"], scores: { sql: 4 } },
  { patterns: ["desktop app", "desktop application", "gui"], scores: { csharp: 2, java: 1, python: 1 } },
  { patterns: ["browser extension", "chrome extension"], scores: { javascript: 3 } },
  { patterns: ["excel"], scores: { python: 3 } },
  { patterns: ["quiz app", "trivia"], scores: { javascript: 2, python: 1 } },
  { patterns: ["weather app"], scores: { javascript: 2, python: 1 } },
  { patterns: ["ecommerce", "e-commerce", "online store", "online shop"], scores: { javascript: 2, php: 1 } },
  { patterns: ["operating system", "kernel", "embedded", "microcontroller", "arduino", "raspberry pi", "driver"], scores: { c: 3 } },
  { patterns: ["game engine", "performance critical", "systems programming"], scores: { cpp: 2, rust: 2 } },
  { patterns: ["wordpress"], scores: { php: 3 } },
  { patterns: ["ruby on rails", "rails app"], scores: { ruby: 3 } },
  { patterns: ["ipad app", "macos app", "swiftui"], scores: { swift: 3 } },
  { patterns: ["spring boot", "enterprise app"], scores: { java: 3 } }
];

function matchGoal(text) {
  const lower = text.toLowerCase();
  const scores = {};
  const matched = [];
  GOAL_KEYWORDS.forEach(entry => {
    const hit = entry.patterns.find(p => lower.includes(p));
    if (hit) {
      matched.push(hit);
      Object.entries(entry.scores).forEach(([id, pts]) => {
        scores[id] = (scores[id] || 0) + pts;
      });
    }
  });
  return { scores, matched };
}

function renderAskResult(text) {
  const askResult = document.getElementById("ask-result");
  const { scores, matched } = matchGoal(text);
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  if (!ranked.length) {
    askResult.innerHTML = `<p class="ask-empty">I couldn't quite place that from the words used — try adding a bit more detail (e.g. "website", "mobile app", "game", "automate a task"), or take the <a href="#quiz">full quiz</a> instead.</p>`;
    askResult.classList.remove("hidden");
    return;
  }

  const top = LANGUAGES.find(l => l.id === ranked[0][0]);
  const alts = ranked.slice(1, 3).map(([id]) => LANGUAGES.find(l => l.id === id)).filter(Boolean);
  const uniqueMatched = [...new Set(matched)];

  askResult.innerHTML = `
    <div class="result-eyebrow">Because you mentioned "${escapeHtml(uniqueMatched.join(", "))}"</div>
    <h2 class="result-lang-name">${top.name}</h2>
    <p class="result-tagline">${top.tagline}</p>
    <div class="result-resources">${top.resources.map(resourceRow).join("")}</div>
    <p class="result-project"><strong>First project idea:</strong> ${top.project}</p>
    <div class="result-btn-row">
      <button id="ask-track-btn" class="btn btn-primary btn-small" data-id="${top.id}">Track my progress with ${top.name}</button>
      ${shareButtonHtml("ask-share-btn")}
    </div>
    ${alts.length ? `
      <div class="result-alts">
        <div class="result-alts-label">Also worth a look</div>
        ${alts.map(l => `<a class="alt-chip" href="#lang-${l.id}">${l.name} &rarr;</a>`).join("")}
      </div>
    ` : ""}
  `;
  askResult.classList.remove("hidden");

  document.getElementById("ask-track-btn").addEventListener("click", () => startTracking(top.id));
  wireShareButton("ask-share-btn", top);
  askResult.querySelectorAll(".result-alts a").forEach(a => {
    a.addEventListener("click", () => {
      setTimeout(() => {
        const id = a.getAttribute("href").slice(1);
        const card = document.getElementById(id);
        if (card) card.classList.add("expanded");
      }, 300);
    });
  });
}

const askInput = document.getElementById("ask-input");
const askBtn = document.getElementById("ask-btn");

askBtn.addEventListener("click", () => {
  const text = askInput.value.trim();
  if (!text) return;
  renderAskResult(text);
});

askInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    askBtn.click();
  }
});

/* ---------------------------------------------------------
   Quiz engine
--------------------------------------------------------- */
let currentStep = 0;
const answers = [];
const totalScores = {};

const quizCard = document.getElementById("quiz-card");
const quizBody = document.getElementById("quiz-body");
const quizProgressBar = document.getElementById("quiz-progress-bar");
const resultCard = document.getElementById("result-card");
const resultBody = document.getElementById("result-body");
const restartBtn = document.getElementById("restart-btn");

function renderStep() {
  const step = QUIZ[currentStep];
  quizProgressBar.style.width = `${(currentStep / QUIZ.length) * 100}%`;

  const optionsHtml = step.options.map((opt, i) => `
    <button class="quiz-option" data-index="${i}">
      ${opt.label}
      <span class="opt-sub">${opt.sub}</span>
    </button>
  `).join("");

  quizBody.innerHTML = `
    <div class="quiz-step-label">Question ${currentStep + 1} of ${QUIZ.length}</div>
    <h2 class="quiz-question">${step.question}</h2>
    <div class="quiz-options">${optionsHtml}</div>
    ${currentStep > 0 ? '<button class="quiz-back">&larr; Back</button>' : ""}
  `;

  quizBody.querySelectorAll(".quiz-option").forEach(btn => {
    btn.addEventListener("click", () => selectOption(parseInt(btn.dataset.index, 10)));
  });

  const backBtn = quizBody.querySelector(".quiz-back");
  if (backBtn) backBtn.addEventListener("click", goBack);
}

function selectOption(index) {
  const step = QUIZ[currentStep];
  const opt = step.options[index];
  answers[currentStep] = index;

  Object.entries(opt.scores).forEach(([lang, pts]) => {
    totalScores[lang] = (totalScores[lang] || 0) + pts;
  });

  if (currentStep < QUIZ.length - 1) {
    currentStep++;
    renderStep();
  } else {
    showResult();
  }
}

function goBack() {
  const step = QUIZ[currentStep];
  const prevIndex = answers[currentStep];
  if (prevIndex !== undefined) {
    const opt = step.options[prevIndex];
    Object.entries(opt.scores).forEach(([lang, pts]) => {
      totalScores[lang] -= pts;
    });
  }
  currentStep--;
  renderStep();
}

function resourceRow(r) {
  return `<a class="resource-link" href="${r.url}" target="_blank" rel="noopener noreferrer">
    ${r.label} <span class="rtype">${r.type}</span>
  </a>`;
}

function shareButtonHtml(id) {
  return `<button type="button" id="${id}" class="btn btn-ghost btn-small share-btn">Share this result</button>`;
}

function wireShareButton(id, lang) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const url = `${location.origin}${location.pathname}#lang-${lang.id}`;
    const text = `I got recommended to learn ${lang.name} on "Which Language?" — ${lang.tagline}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Which Language?", text, url });
        return;
      } catch {
        return; // user cancelled the native share sheet — don't fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      btn.textContent = "Copied!";
      setTimeout(() => { btn.textContent = "Share this result"; }, 1500);
    } catch {
      btn.textContent = "Couldn't copy — select the text manually";
    }
  });
}

function showResult() {
  quizProgressBar.style.width = "100%";
  const ranked = Object.entries(totalScores).sort((a, b) => b[1] - a[1]);

  let topId = ranked.length ? ranked[0][0] : "python";
  const top = LANGUAGES.find(l => l.id === topId);
  const alts = ranked.slice(1, 4)
    .map(([id]) => LANGUAGES.find(l => l.id === id))
    .filter(Boolean);

  const goalAnswer = QUIZ[0].options[answers[0]];
  const styleAnswer = QUIZ[3].options[answers[3]];

  resultBody.innerHTML = `
    <div class="result-eyebrow">Your recommendation</div>
    <h2 class="result-lang-name">${top.name}</h2>
    <p class="result-tagline">${top.tagline}</p>
    <div class="result-why">
      Based on your answers &mdash; wanting to build <strong>${goalAnswer.label.toLowerCase()}</strong>
      and preferring <strong>${styleAnswer.label.toLowerCase()}</strong> &mdash;
      ${top.name} is the strongest fit. It's rated <strong>${top.difficulty}</strong> difficulty to get started with.
    </div>
    <div class="result-resources">${top.resources.map(resourceRow).join("")}</div>
    <p class="result-project"><strong>First project idea:</strong> ${top.project}</p>
    <div class="result-btn-row">
      <button id="track-lang-btn" class="btn btn-primary btn-small" data-id="${top.id}">Track my progress with ${top.name}</button>
      ${shareButtonHtml("quiz-share-btn")}
    </div>
    ${alts.length ? `
      <div class="result-alts">
        <div class="result-alts-label">Also worth a look</div>
        ${alts.map(l => `<a class="alt-chip" href="#lang-${l.id}">${l.name} &rarr;</a>`).join("")}
      </div>
    ` : ""}
  `;

  quizCard.classList.add("hidden");
  resultCard.classList.remove("hidden");

  resultCard.querySelectorAll(".result-alts a").forEach(a => {
    a.addEventListener("click", (e) => {
      setTimeout(() => {
        const id = a.getAttribute("href").slice(1);
        const card = document.getElementById(id);
        if (card) card.classList.add("expanded");
      }, 300);
    });
  });

  document.getElementById("track-lang-btn").addEventListener("click", () => startTracking(top.id));
  wireShareButton("quiz-share-btn", top);
}

function restartQuiz() {
  currentStep = 0;
  answers.length = 0;
  Object.keys(totalScores).forEach(k => delete totalScores[k]);
  resultCard.classList.add("hidden");
  quizCard.classList.remove("hidden");
  renderStep();
}

restartBtn.addEventListener("click", restartQuiz);

/* ---------------------------------------------------------
   Library section
--------------------------------------------------------- */
const langGrid = document.getElementById("lang-grid");
const searchInput = document.getElementById("search-input");
const tagFiltersEl = document.getElementById("tag-filters");

const ALL_TAGS = [...new Set(LANGUAGES.flatMap(l => l.tags))].sort();
let activeTag = null;

function renderTagFilters() {
  const allBtn = `<button class="tag-filter-btn ${activeTag === null ? "active" : ""}" data-tag="">All</button>`;
  const tagBtns = ALL_TAGS.map(tag =>
    `<button class="tag-filter-btn ${activeTag === tag ? "active" : ""}" data-tag="${tag}">${tag}</button>`
  ).join("");
  tagFiltersEl.innerHTML = allBtn + tagBtns;

  tagFiltersEl.querySelectorAll(".tag-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeTag = btn.dataset.tag || null;
      renderTagFilters();
      renderLibrary();
    });
  });
}

function renderLibrary() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = LANGUAGES.filter(l => {
    const matchesQuery = !query ||
      l.name.toLowerCase().includes(query) ||
      l.tagline.toLowerCase().includes(query) ||
      l.tags.some(t => t.includes(query));
    const matchesTag = !activeTag || l.tags.includes(activeTag);
    return matchesQuery && matchesTag;
  });

  langGrid.innerHTML = filtered.map(l => `
    <div class="card lang-card" id="lang-${l.id}" data-id="${l.id}">
      <div class="lang-card-top">
        <h3>${l.name}</h3>
        <label class="compare-check">
          <input type="checkbox" class="compare-checkbox" data-id="${l.id}" ${compareSelection.includes(l.id) ? "checked" : ""}>
          Compare
        </label>
      </div>
      <span class="difficulty-pill difficulty-${l.difficulty}">${l.difficulty}</span>
      <p class="lang-tagline">${l.tagline}</p>
      <div class="lang-tags">${l.tags.map(t => `<span>${t}</span>`).join("")}</div>
      <div class="lang-card-actions">
        <button type="button" class="btn btn-primary btn-small track-btn" data-id="${l.id}">+ Track</button>
        <button type="button" class="btn btn-ghost btn-small resources-toggle-btn">Resources &amp; project</button>
      </div>
      <div class="lang-resources">
        ${l.example ? `<pre class="lang-example"><code>${l.example}</code></pre>` : ""}
        ${l.resources.map(resourceRow).join("")}
        <p class="lang-project"><strong>Project idea:</strong> ${l.project}</p>
      </div>
    </div>
  `).join("") || `<p style="color:var(--text-faint)">No languages match that search.</p>`;

  langGrid.querySelectorAll(".resources-toggle-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = btn.closest(".lang-card");
      card.classList.toggle("expanded");
      btn.textContent = card.classList.contains("expanded") ? "Hide resources" : "Resources & project";
    });
  });

  langGrid.querySelectorAll(".compare-checkbox").forEach(box => {
    box.addEventListener("click", (e) => e.stopPropagation());
    box.addEventListener("change", () => toggleCompare(box.dataset.id));
  });

  langGrid.querySelectorAll(".track-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      startTracking(btn.dataset.id);
    });
  });
}

searchInput.addEventListener("input", renderLibrary);

/* ---------------------------------------------------------
   Compare languages
--------------------------------------------------------- */
let compareSelection = [];
const comparePanel = document.getElementById("compare-panel");

function toggleCompare(id) {
  if (compareSelection.includes(id)) {
    compareSelection = compareSelection.filter(x => x !== id);
  } else {
    if (compareSelection.length >= 3) return;
    compareSelection.push(id);
  }
  renderLibrary();
  renderComparePanel();
}

function renderComparePanel() {
  if (compareSelection.length < 2) {
    comparePanel.innerHTML = "";
    comparePanel.classList.add("hidden");
    return;
  }
  const langs = compareSelection.map(id => LANGUAGES.find(l => l.id === id)).filter(Boolean);
  comparePanel.classList.remove("hidden");
  comparePanel.innerHTML = `
    <div class="compare-panel-head">
      <h3>Comparing ${langs.length} languages</h3>
      <button id="clear-compare-btn" class="btn btn-ghost btn-small">Clear</button>
    </div>
    <div class="compare-table-wrap">
      <table class="compare-table">
        <thead><tr><th></th>${langs.map(l => `<th>${l.name}</th>`).join("")}</tr></thead>
        <tbody>
          <tr><td>Difficulty</td>${langs.map(l => `<td><span class="difficulty-pill difficulty-${l.difficulty}">${l.difficulty}</span></td>`).join("")}</tr>
          <tr><td>Tags</td>${langs.map(l => `<td><div class="compare-tags">${l.tags.map(t => `<span>${t}</span>`).join("")}</div></td>`).join("")}</tr>
          <tr><td>Description</td>${langs.map(l => `<td>${l.tagline}</td>`).join("")}</tr>
          <tr><td>First project</td>${langs.map(l => `<td>${l.project}</td>`).join("")}</tr>
        </tbody>
      </table>
    </div>
  `;
  document.getElementById("clear-compare-btn").addEventListener("click", () => {
    compareSelection = [];
    renderLibrary();
    renderComparePanel();
  });
}

/* ---------------------------------------------------------
   Learning progress tracker
--------------------------------------------------------- */
const PROGRESS_KEY = "learningProgress";
const progressCard = document.getElementById("progress-card");

function getProgress() {
  try {
    return JSON.parse(safeGet(PROGRESS_KEY));
  } catch {
    return null;
  }
}

function setProgress(p) {
  safeSet(PROGRESS_KEY, JSON.stringify(p));
}

function startTracking(languageId) {
  setProgress({ languageId, startedAt: new Date().toISOString(), checkedKeys: [] });
  renderProgress();
  document.getElementById("progress").scrollIntoView({ behavior: "smooth" });
}

function stopTracking() {
  safeRemove(PROGRESS_KEY);
  renderProgress();
}

function toggleChecked(key) {
  const p = getProgress();
  if (!p) return;
  const i = p.checkedKeys.indexOf(key);
  if (i === -1) p.checkedKeys.push(key); else p.checkedKeys.splice(i, 1);
  setProgress(p);
  renderProgress();
}

function renderProgress() {
  const p = getProgress();
  if (!p) {
    progressCard.innerHTML = `
      <p class="progress-empty">You're not tracking a language yet. Take the <a href="#quiz">quiz</a> or pick one from the <a href="#library">library</a> below, then hit "Track this language" to start a checklist.</p>
    `;
    return;
  }

  const lang = LANGUAGES.find(l => l.id === p.languageId);
  if (!lang) {
    stopTracking();
    return;
  }

  const items = [
    ...lang.resources.map((r, i) => ({ key: `resource-${i}`, label: r.label })),
    { key: "project", label: `Project: ${lang.project}` }
  ];
  const doneCount = items.filter(it => p.checkedKeys.includes(it.key)).length;
  const pct = Math.round((doneCount / items.length) * 100);
  const startedDate = new Date(p.startedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

  progressCard.innerHTML = `
    <div class="progress-head">
      <div>
        <div class="progress-eyebrow">Currently learning</div>
        <h3 class="progress-lang-name">${lang.name}</h3>
        <p class="progress-started">Started ${startedDate}</p>
      </div>
      <button id="stop-tracking-btn" class="btn btn-ghost btn-small">Switch language</button>
    </div>
    <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
    <p class="progress-pct">${doneCount} of ${items.length} done (${pct}%)</p>
    <div class="progress-checklist">
      ${items.map(it => `
        <label class="progress-item">
          <input type="checkbox" data-key="${it.key}" ${p.checkedKeys.includes(it.key) ? "checked" : ""}>
          <span>${it.label}</span>
        </label>
      `).join("")}
    </div>
    ${pct === 100 ? `<p class="progress-complete">You've worked through everything here — nice work. Maybe it's time to pick your next language.</p>` : ""}
  `;

  document.getElementById("stop-tracking-btn").addEventListener("click", stopTracking);
  progressCard.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener("change", () => toggleChecked(cb.dataset.key));
  });
}

/* ---------------------------------------------------------
   Code Photo Checker
--------------------------------------------------------- */
const KEY_STORAGE = "codeChecker.apiKey";

const keySetup = document.getElementById("key-setup");
const apiKeyInput = document.getElementById("api-key-input");
const saveKeyBtn = document.getElementById("save-key-btn");
const keyStatus = document.getElementById("key-status");
const checkerForm = document.getElementById("checker-form");
const changeKeyBtn = document.getElementById("change-key-btn");
const uploadDropzone = document.getElementById("upload-dropzone");
const photoInput = document.getElementById("photo-input");
const uploadLabel = document.getElementById("upload-label");
const photoPreview = document.getElementById("photo-preview");
const langHint = document.getElementById("lang-hint");
const checkBtn = document.getElementById("check-btn");
const checkerStatus = document.getElementById("checker-status");
const checkerResults = document.getElementById("checker-results");

let resizedImageDataUrl = null;

function populateLangHint() {
  LANGUAGES.forEach(l => {
    const opt = document.createElement("option");
    opt.value = l.name;
    opt.textContent = l.name;
    langHint.appendChild(opt);
  });
}

function showKeyStatus(msg, kind) {
  keyStatus.textContent = msg;
  keyStatus.className = "key-status" + (kind ? ` ${kind}` : "");
}

function refreshKeyUI() {
  const key = safeGet(KEY_STORAGE);
  if (key) {
    keySetup.classList.add("hidden");
    checkerForm.classList.remove("hidden");
  } else {
    keySetup.classList.remove("hidden");
    checkerForm.classList.add("hidden");
  }
}

saveKeyBtn.addEventListener("click", () => {
  const key = apiKeyInput.value.trim();
  if (!key.startsWith("sk-ant-")) {
    showKeyStatus("That doesn't look like an Anthropic API key (should start with sk-ant-).", "bad");
    return;
  }
  if (!safeSet(KEY_STORAGE, key)) {
    showKeyStatus("Couldn't save the key — this browser may be blocking local storage (private/incognito mode, or storage disabled).", "bad");
    return;
  }
  apiKeyInput.value = "";
  showKeyStatus("");
  refreshKeyUI();
});

changeKeyBtn.addEventListener("click", () => {
  safeRemove(KEY_STORAGE);
  refreshKeyUI();
});

uploadDropzone.addEventListener("click", (e) => {
  if (e.target !== photoInput) photoInput.click();
});

photoInput.addEventListener("change", async () => {
  const file = photoInput.files[0];
  if (!file) return;
  uploadLabel.textContent = "Processing photo…";
  try {
    resizedImageDataUrl = await resizeImage(file, 1600, 0.85);
    photoPreview.src = resizedImageDataUrl;
    photoPreview.classList.remove("hidden");
    uploadLabel.textContent = file.name;
    checkBtn.disabled = false;
  } catch (err) {
    uploadLabel.textContent = "Choose or take a photo of your code";
    showCheckerError("Couldn't read that image. Try a different photo.");
  }
});

function resetCheckerForm() {
  resizedImageDataUrl = null;
  photoInput.value = "";
  photoPreview.classList.add("hidden");
  photoPreview.src = "";
  uploadLabel.textContent = "Choose or take a photo of your code";
  checkBtn.disabled = true;
  clearCheckerStatus();
  checkerResults.classList.add("hidden");
  checkerResults.innerHTML = "";
}

function resizeImage(file, maxDim, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function showCheckerError(msg) {
  checkerStatus.classList.remove("hidden");
  checkerStatus.classList.add("error");
  checkerStatus.innerHTML = msg;
  checkerResults.classList.add("hidden");
}

function showCheckerLoading() {
  checkerStatus.classList.remove("hidden", "error");
  checkerStatus.innerHTML = `<span class="spinner"></span>Reading your code and checking for mistakes…`;
  checkerResults.classList.add("hidden");
}

function clearCheckerStatus() {
  checkerStatus.classList.add("hidden");
  checkerStatus.innerHTML = "";
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderCheckerResults(data) {
  const hasMistakes = data.has_mistakes && data.mistakes && data.mistakes.length > 0;

  const mistakesHtml = hasMistakes ? data.mistakes.map(m => `
    <div class="mistake-item">
      <div class="mistake-line">${escapeHtml(m.line || "General")}</div>
      <div class="mistake-desc">${escapeHtml(m.description)}</div>
      <div class="mistake-fix"><strong>Fix:</strong> ${escapeHtml(m.fix)}</div>
    </div>
  `).join("") : "";

  checkerResults.innerHTML = `
    <div class="result-summary-row">
      <span class="result-badge ${hasMistakes ? "issues" : "clean"}">
        ${hasMistakes ? `${data.mistakes.length} issue${data.mistakes.length === 1 ? "" : "s"} found` : "Looks correct"}
      </span>
      ${data.detected_language ? `<span class="result-lang-tag">${escapeHtml(data.detected_language)}</span>` : ""}
    </div>
    <p class="result-summary-text">${escapeHtml(data.summary || "")}</p>
    ${hasMistakes ? `<div class="mistake-list">${mistakesHtml}</div>` : ""}
    ${data.corrected_code ? `
      <div class="corrected-code-label">${hasMistakes ? "Corrected code" : "Your code"}</div>
      <pre class="corrected-code">${escapeHtml(data.corrected_code)}</pre>
    ` : ""}
    <div class="checker-actions">
      ${data.corrected_code ? `<button type="button" id="copy-code-btn" class="btn btn-ghost btn-small">Copy corrected code</button>` : ""}
      <button type="button" id="check-another-btn" class="btn btn-ghost btn-small">Check another photo</button>
    </div>
  `;
  checkerResults.classList.remove("hidden");

  const copyBtn = document.getElementById("copy-code-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(data.corrected_code);
        copyBtn.textContent = "Copied!";
        setTimeout(() => { copyBtn.textContent = "Copy corrected code"; }, 1500);
      } catch {
        copyBtn.textContent = "Couldn't copy — select the text manually";
      }
    });
  }

  document.getElementById("check-another-btn").addEventListener("click", resetCheckerForm);
}

const CORRECTION_SCHEMA = {
  type: "object",
  properties: {
    detected_language: { type: "string", description: "The programming language identified in the photo" },
    has_mistakes: { type: "boolean" },
    mistakes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          line: { type: "string", description: "Line number or location, e.g. 'Line 12' or 'General'" },
          description: { type: "string", description: "What is wrong" },
          fix: { type: "string", description: "How to fix it" }
        },
        required: ["line", "description", "fix"],
        additionalProperties: false
      }
    },
    corrected_code: { type: "string", description: "The full code, corrected. If there were no mistakes, this is the original code cleanly transcribed." },
    summary: { type: "string", description: "One or two friendly sentences summarizing the result, for a beginner" }
  },
  required: ["detected_language", "has_mistakes", "mistakes", "corrected_code", "summary"],
  additionalProperties: false
};

checkBtn.addEventListener("click", async () => {
  if (!resizedImageDataUrl) return;
  const apiKey = safeGet(KEY_STORAGE);
  if (!apiKey) {
    refreshKeyUI();
    return;
  }

  checkBtn.disabled = true;
  showCheckerLoading();

  try {
    const { default: Anthropic } = await import("https://esm.sh/@anthropic-ai/sdk@0.68.0");
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

    const base64Data = resizedImageDataUrl.split(",")[1];
    const langNote = langHint.value ? `The person believes this is ${langHint.value} code.` : "Figure out the language from the photo.";
    const selectedModel = document.getElementById("model-select").value || "claude-opus-5";

    const response = await client.messages.create({
      model: selectedModel,
      max_tokens: 4096,
      output_config: { format: { type: "json_schema", schema: CORRECTION_SCHEMA } },
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: "image/jpeg", data: base64Data } },
          {
            type: "text",
            text: `This photo shows code someone wrote while learning to program. ${langNote} Carefully transcribe it, then check it for syntax errors, typos, and clear logic mistakes. Be encouraging and specific — point to exact lines. If the code is already correct, say so plainly rather than inventing issues.`
          }
        ]
      }]
    });

    if (response.stop_reason === "refusal") {
      showCheckerError("Claude declined to process this photo. Try a clearer photo of code only.");
      return;
    }

    const textBlock = response.content.find(b => b.type === "text");
    if (!textBlock) {
      showCheckerError("Didn't get a readable response back. Try again.");
      return;
    }

    const data = JSON.parse(textBlock.text);
    clearCheckerStatus();
    renderCheckerResults(data);
  } catch (err) {
    console.error(err);
    if (err && err.status === 401) {
      showCheckerError("That API key was rejected. <button id='fix-key-btn' class='btn btn-ghost btn-small'>Use a different key</button>");
      document.getElementById("fix-key-btn")?.addEventListener("click", changeKeyBtn.click.bind(changeKeyBtn));
    } else if (err && err.status === 429) {
      showCheckerError("Rate limited by the API — wait a moment and try again.");
    } else {
      showCheckerError("Something went wrong reaching Claude's API: " + escapeHtml(err.message || String(err)));
    }
  } finally {
    checkBtn.disabled = false;
  }
});

/* ---------------------------------------------------------
   Ask the assistant (conversational, uses the same API key)
--------------------------------------------------------- */
const assistantKeySetup = document.getElementById("assistant-key-setup");
const assistantKeyInput = document.getElementById("assistant-key-input");
const assistantSaveKeyBtn = document.getElementById("assistant-save-key-btn");
const assistantKeyStatus = document.getElementById("assistant-key-status");
const assistantChat = document.getElementById("assistant-chat");
const assistantMessagesEl = document.getElementById("assistant-messages");
const assistantInput = document.getElementById("assistant-input");
const assistantSendBtn = document.getElementById("assistant-send-btn");
const assistantResetBtn = document.getElementById("assistant-reset-btn");
const assistantChangeKeyBtn = document.getElementById("assistant-change-key-btn");

let assistantMessages = [];

const ASSISTANT_SYSTEM_PROMPT = `You are a friendly, concise programming-language advisor embedded in a website called "Which Language?". Help the visitor figure out which language(s) to learn or use for their goal.

Here is the language library this site covers — prefer recommending from this list since the site links out to these exact resources. If nothing here truly fits, you may mention another language, but say so explicitly.

${JSON.stringify(LANGUAGES.map(l => ({ id: l.id, name: l.name, tagline: l.tagline, difficulty: l.difficulty, tags: l.tags })))}

Guidelines:
- Ask a short clarifying question ONLY if the goal is genuinely ambiguous; otherwise just answer.
- Recommend one primary language and, at most, one alternative — not a long list.
- Give a one or two sentence reason grounded in their actual goal, not generic praise.
- Keep responses short: 2-5 sentences for a typical answer, longer only if genuinely needed.
- Use **bold** only for language names. No headers, no bullet-point walls for a simple answer.
- Never mention that you are an AI, never break character, no filler like "Great question!".
- If the person asks for a video, tutorial, or something to watch, use search to find one real, currently available, well-regarded tutorial video and share its direct link in your reply. Never invent or guess a video title or URL from memory — only mention a video if you actually searched for it.`;

function formatAssistantText(text) {
  let safe = escapeHtml(text);
  safe = safe.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  safe = safe.replace(/`([^`]+)`/g, "<code>$1</code>");
  safe = safe.replace(/\n/g, "<br>");
  return safe;
}

function appendAssistantBubble(role, text) {
  const div = document.createElement("div");
  div.className = `assistant-msg assistant-msg-${role}`;
  div.innerHTML = formatAssistantText(text);
  assistantMessagesEl.appendChild(div);
  assistantMessagesEl.scrollTop = assistantMessagesEl.scrollHeight;
  return div;
}

function resetAssistantChat() {
  assistantMessages = [];
  assistantMessagesEl.innerHTML = "";
  appendAssistantBubble("assistant", "Hi! Tell me what you're trying to build, and I'll help you pick a language.");
}

const GEMINI_KEY_STORAGE = "geminiAssistant.apiKey";

function refreshAssistantKeyUI() {
  const key = GEMINI_CONFIG_KEY || safeGet(GEMINI_KEY_STORAGE);
  if (key) {
    assistantKeySetup.classList.add("hidden");
    assistantChat.classList.remove("hidden");
    if (assistantMessagesEl.children.length === 0) {
      resetAssistantChat();
    }
  } else {
    assistantKeySetup.classList.remove("hidden");
    assistantChat.classList.add("hidden");
  }
}

assistantSaveKeyBtn.addEventListener("click", () => {
  const key = assistantKeyInput.value.trim();
  if (!key) {
    assistantKeyStatus.textContent = "Enter a Gemini API key.";
    assistantKeyStatus.className = "key-status bad";
    return;
  }
  if (!safeSet(GEMINI_KEY_STORAGE, key)) {
    assistantKeyStatus.textContent = "Couldn't save the key — this browser may be blocking local storage.";
    assistantKeyStatus.className = "key-status bad";
    return;
  }
  assistantKeyInput.value = "";
  assistantKeyStatus.textContent = "";
  assistantKeyStatus.className = "key-status";
  refreshAssistantKeyUI();
});

assistantChangeKeyBtn.addEventListener("click", () => {
  safeRemove(GEMINI_KEY_STORAGE);
  refreshAssistantKeyUI();
});

assistantResetBtn.addEventListener("click", resetAssistantChat);

function extractMentionedLanguages(rawText) {
  const boldMatches = [...rawText.matchAll(/\*\*(.+?)\*\*/g)].map(m => m[1].trim().toLowerCase());
  const found = [];
  boldMatches.forEach(name => {
    const lang = LANGUAGES.find(l => {
      const fullName = l.name.toLowerCase();
      const segments = fullName.split("/").map(s => s.trim());
      return fullName === name || segments.includes(name);
    });
    if (lang && !found.includes(lang)) found.push(lang);
  });
  return found;
}

function appendAssistantActions(afterEl, languages) {
  const row = document.createElement("div");
  row.className = "assistant-actions";
  languages.forEach(lang => {
    const trackBtn = document.createElement("button");
    trackBtn.type = "button";
    trackBtn.className = "assistant-action-btn";
    trackBtn.textContent = `Track ${lang.name}`;
    trackBtn.addEventListener("click", () => startTracking(lang.id));
    row.appendChild(trackBtn);

    const viewLink = document.createElement("a");
    viewLink.href = `#lang-${lang.id}`;
    viewLink.className = "assistant-action-btn";
    viewLink.textContent = `${lang.name} resources`;
    viewLink.addEventListener("click", () => {
      setTimeout(() => {
        const card = document.getElementById(`lang-${lang.id}`);
        if (card) card.classList.add("expanded");
      }, 300);
    });
    row.appendChild(viewLink);
  });
  afterEl.insertAdjacentElement("afterend", row);
  assistantMessagesEl.scrollTop = assistantMessagesEl.scrollHeight;
  return row;
}

function appendAssistantSources(afterEl, sources, searchEntryHtml) {
  const wrap = document.createElement("div");
  wrap.className = "assistant-sources";

  const label = document.createElement("div");
  label.className = "assistant-sources-label";
  label.textContent = "Sources";
  wrap.appendChild(label);

  sources.slice(0, 5).forEach(s => {
    const link = document.createElement("a");
    link.href = s.uri;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "assistant-source-link";
    link.textContent = s.title;
    wrap.appendChild(link);
  });

  // Google requires Search Suggestion chips to be shown as-provided when
  // grounding is used — this HTML comes directly from the API response.
  if (searchEntryHtml) {
    const entry = document.createElement("div");
    entry.className = "assistant-search-entry";
    entry.innerHTML = searchEntryHtml;
    wrap.appendChild(entry);
  }

  afterEl.insertAdjacentElement("afterend", wrap);
  assistantMessagesEl.scrollTop = assistantMessagesEl.scrollHeight;
  return wrap;
}

async function callGemini(apiKey, systemPrompt, contents, useSearch) {
  const body = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: { maxOutputTokens: 1024 }
  };
  // Merely including this tool trips this API's quota check even when the
  // model never invokes it — so only attach it for messages that actually
  // look like a video/search request, keeping normal chat unaffected by
  // that quota.
  if (useSearch) body.tools = [{ google_search: {} }];

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }
  );
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data?.error?.message || `Gemini API error (${res.status})`);
    err.status = res.status;
    throw err;
  }
  const candidate = data.candidates && data.candidates[0];
  if (!candidate) return { text: "", blocked: true, sources: [], searchEntryHtml: null };
  if (candidate.finishReason === "SAFETY" || candidate.finishReason === "PROHIBITED_CONTENT") {
    return { text: "", blocked: true, sources: [], searchEntryHtml: null };
  }
  const text = ((candidate.content && candidate.content.parts) || []).map(p => p.text || "").join("");

  // Google Search grounding: extract real source links so we never trust a
  // model-written URL. Defensive — grounding metadata shape isn't something
  // we could live-verify (quota-blocked while building this), so bail to an
  // empty list rather than throw if the shape doesn't match what's expected.
  let sources = [];
  let searchEntryHtml = null;
  try {
    const gm = candidate.groundingMetadata;
    if (gm) {
      sources = (gm.groundingChunks || [])
        .map(c => c.web)
        .filter(w => w && w.uri)
        .map(w => ({ uri: w.uri, title: w.title || w.uri }));
      searchEntryHtml = (gm.searchEntryPoint && gm.searchEntryPoint.renderedContent) || null;
    }
  } catch {
    sources = [];
    searchEntryHtml = null;
  }

  return { text, blocked: false, sources, searchEntryHtml };
}

async function sendAssistantMessage() {
  const text = assistantInput.value.trim();
  if (!text) return;
  const apiKey = GEMINI_CONFIG_KEY || safeGet(GEMINI_KEY_STORAGE);
  if (!apiKey) {
    refreshAssistantKeyUI();
    return;
  }

  assistantInput.value = "";
  appendAssistantBubble("user", text);
  assistantMessages.push({ role: "user", parts: [{ text }] });

  assistantSendBtn.disabled = true;
  const replyBubble = appendAssistantBubble("assistant", "Thinking…");
  replyBubble.classList.add("assistant-msg-loading");

  const wantsVideo = /\b(video|youtube|watch|tutorial)\b/i.test(text);

  try {
    let result;
    let searchFailed = false;
    try {
      result = await callGemini(apiKey, ASSISTANT_SYSTEM_PROMPT, assistantMessages, wantsVideo);
    } catch (searchErr) {
      if (!wantsVideo) throw searchErr;
      // Video search specifically failed (e.g. quota) — fall back to a
      // normal answer rather than failing the whole message. The base
      // system prompt's "don't invent a video" instruction isn't reliable
      // enough on its own once the search tool is gone from this call, so
      // spell it out explicitly for this one request.
      console.error(searchErr);
      searchFailed = true;
      const noSearchPrompt = ASSISTANT_SYSTEM_PROMPT + "\n\nIMPORTANT: Video search is unavailable for this reply. Do not name, describe, or link any specific video — not even one you recall from training. If the person asked for a video, say you can't look one up right now, then still answer their underlying language question normally.";
      result = await callGemini(apiKey, noSearchPrompt, assistantMessages, false);
    }
    replyBubble.classList.remove("assistant-msg-loading");

    if (result.blocked || !result.text) {
      replyBubble.innerHTML = formatAssistantText("I can't help with that one — try rephrasing your goal.");
      assistantMessages.push({ role: "model", parts: [{ text: "I can't help with that one." }] });
    } else {
      replyBubble.innerHTML = formatAssistantText(result.text)
        + (searchFailed ? '<br><span class="assistant-search-fallback-note">(couldn\'t search for a real video link right now — API quota)</span>' : "");
      assistantMessages.push({ role: "model", parts: [{ text: result.text }] });
      let afterEl = replyBubble;
      const mentioned = extractMentionedLanguages(result.text);
      if (mentioned.length) {
        afterEl = appendAssistantActions(afterEl, mentioned);
      }
      if (result.sources && result.sources.length) {
        appendAssistantSources(afterEl, result.sources, result.searchEntryHtml);
      }
    }
  } catch (err) {
    console.error(err);
    replyBubble.classList.remove("assistant-msg-loading");
    if (err && (err.status === 400 || err.status === 403)) {
      replyBubble.innerHTML = "That API key was rejected. Use the button below to try a different one.";
    } else if (err && err.status === 429) {
      replyBubble.innerHTML = "Rate limited by the API &mdash; wait a moment and try again.";
    } else {
      replyBubble.innerHTML = "Something went wrong reaching Gemini's API: " + escapeHtml(err.message || String(err));
    }
  } finally {
    assistantSendBtn.disabled = false;
  }
}

assistantSendBtn.addEventListener("click", sendAssistantMessage);
assistantInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendAssistantMessage();
  }
});

/* ---------------------------------------------------------
   Init
--------------------------------------------------------- */
renderStep();
renderTagFilters();
renderLibrary();
renderComparePanel();
renderProgress();
refreshAssistantKeyUI();
populateLangHint();
refreshKeyUI();
