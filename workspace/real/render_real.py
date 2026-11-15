import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "shorts"))
import build
build.OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "final")
meta = {c["id"]: c for c in build.CLIPS}
# file-relative trims & punchline times (from whisper word timings)
plan = {3: (0, 62, 42), 4: (0, 60, 47), 5: (0, 66, 63), 6: (4, 63, 59), 7: (0, 44, 33)}
build.make_sfx()
for n in map(int, sys.argv[1:] or plan):
    a, b, p = plan[n]
    words = [(w["s"], w["w"]) for w in json.load(open(f"clip{n}.words.json"))]
    c = dict(meta[n], start=a, end=b, punch=p)
    print(n, build.render(c, f"clip{n}.mp4", words), flush=True)
