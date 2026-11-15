import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "shorts"))
import build
build.OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "final")
# n: (title, slug, start, end, punch, fart_or_None, highlight words) — times are file-relative
CL = {
 1: ("I can't giddy up", "giddy_up", 0, 74, 60, None, ["giddy", "idiot", "twice"]),
 2: ("I'm going to END STREAM", "end_stream", 0, 78, 75, None, ["end stream", "worked"]),
 3: ("Fans found Jettism", "fans", 0, 50, 30, None, ["biggest fan", "picture", "screaming"]),
 4: ("Go back to pulling my pearl", "pull_my_pearl", 1.5, 60, 58.0, None, ["pearl", "useless", "dork", "cheap"]),
 5: ("I know EVERYTHING about you", "everything_about_you", 0, 66, 52.3, None, ["revenge", "trap", "pvp", "everything"]),
 6: ("I just woke up and I'm scared", "woke_up_scared", 0, 75, 70, None, ["scared", "wrong account", "farted"]),
 7: ("You or Claude?", "you_or_claude", 0, 40, 12.5, None, ["claude", "prompts", "10"]),
 8: ("His mod is CODE ROTTED", "code_rot", 0, 52, 46.5, None, ["code", "rock", "fake", "claude"]),
}
over = json.load(open("overrides.json")) if os.path.exists("overrides.json") else {}
build.make_sfx()
for n in map(int, sys.argv[1:]):
    t, slug, a, b, p, f, hl = CL[n]
    o = over.get(str(n), {})
    a, b, p, f = o.get("start", a), o.get("end", b), o.get("punch", p), o.get("fart", f)
    words = [(w["s"], w["w"]) for w in json.load(open(f"clip{n}.words.json"))]
    c = dict(id=n, slug=slug, title=t, start=a, end=b, punch=p, fart=f, highlight=hl)
    src = f"clip{n}.mp4"
    print(n, build.render(c, src, words), flush=True)
