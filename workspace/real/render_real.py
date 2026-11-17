import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "shorts"))
import build
build.OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "final")
meta = {c["id"]: c for c in build.CLIPS}
# file-relative trims & punchline times (from whisper word timings)
plan = {3: (13, 63, 42), 4: (7.5, 57.5, 47), 5: (16, 66, 63), 6: (11.5, 61.5, 59.3), 7: (0, 44, 33)}  # all <= 50s
build.make_sfx()
for n in map(int, sys.argv[1:] or plan):
    a, b, p = plan[n]
    words = [(w["s"], w["w"]) for w in json.load(open(f"clip{n}.words.json"))]
    c = dict(meta[n], start=a, end=b, punch=p)
    print(n, build.render(c, f"clip{n}.mp4", words), flush=True)
