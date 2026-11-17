#!/usr/bin/env python3
"""Build YouTube Shorts from the DrDonut stream.

Usage:
  python3 -I build.py SOURCE.mp4            # render all clips from the full stream
  python3 -I build.py SOURCE.mp4 --only 1,3  # render some clips
  python3 -I build.py --test                 # self-test on a generated dummy video

Needs ffmpeg. Captions are timed from ../transcript.txt (YouTube auto-captions,
~1-3s accuracy); sound effects are synthesized with ffmpeg (no downloaded assets).
"""
import json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
TRANSCRIPT = os.path.join(HERE, "..", "transcript.txt")
OUT = os.path.join(HERE, "..", "..", "final_clips")
SFX = os.path.join(HERE, "sfx")
CLIPS = json.load(open(os.path.join(HERE, "clips.json")))


def run(cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)


def make_sfx():
    os.makedirs(SFX, exist_ok=True)
    specs = {
        # quick airy swoosh for the intro
        "whoosh.wav": "anoisesrc=d=0.45:c=pink:a=0.5,highpass=f=600,lowpass=f=5000,"
                      "afade=t=in:d=0.2,afade=t=out:st=0.2:d=0.25",
        # deep "vine boom" style hit for the punchline
        "boom.wav": "sine=f=55:d=1.2,volume=2.5,afade=t=out:st=0.05:d=1.1,"
                    "aecho=0.6:0.5:60:0.3",
        # short pop for caption emphasis / laughs
        "pop.wav": "sine=f=900:d=0.08,afade=t=out:d=0.08,volume=0.6",
        # comedic fart: low buzzy tone with a wobble, falling pitch, a bit of noise
        "fart.wav": "aevalsrc='0.9*sin(2*PI*(95-30*t)*t)*(0.6+0.4*sin(2*PI*28*t))*(1+0.3*sin(2*PI*7*t))+0.15*(random(0)-0.5)':d=0.9:s=44100,"
                    "lowpass=f=700,afade=t=in:d=0.03,afade=t=out:st=0.55:d=0.35,volume=2",
    }
    for name, flt in specs.items():
        p = os.path.join(SFX, name)
        if not os.path.exists(p):
            run(["ffmpeg", "-y", "-f", "lavfi", "-i", flt, "-ar", "44100", "-ac", "2", p])


def load_words():
    """Turn rolling captions into (time, word) pairs, spreading each line's new words evenly."""
    lines = [(int(h) * 3600 + int(m) * 60 + int(s), t.replace("&gt;&gt;", "").replace("&amp;", "&"))
             for h, m, s, t in re.findall(r"\[(\d+):(\d+):(\d+)\] (.*)", open(TRANSCRIPT).read())]
    segs, prev = [], ""
    for sec, t in lines:
        k = next((n for n in range(min(len(prev), len(t)), 0, -1) if prev.endswith(t[:n])), 0)
        new = t[k:].strip()
        if new:
            segs.append((sec, new))
        prev = t
    words = []
    for i, (sec, text) in enumerate(segs):
        end = segs[i + 1][0] if i + 1 < len(segs) else sec + 3
        end = min(max(end, sec + 1), sec + 6)
        toks = text.split()
        for j, w in enumerate(toks):
            words.append((sec + (end - sec) * j / len(toks), w))
    return words


def ts(x):
    x = max(0, x)
    return f"{int(x // 3600)}:{int(x % 3600 // 60):02d}:{x % 60:05.2f}"


def make_ass(clip, words, path):
    a, b = clip["start"], clip["end"]
    sel = [(t - a, w) for t, w in words if a <= t < b]
    head = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: C0,DejaVu Sans,86,&H0000E5FF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,6,2,2,60,60,420,1
Style: C1,DejaVu Sans,86,&H0040FF5A,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,6,2,2,60,60,420,1
Style: C2,DejaVu Sans,86,&H00FFE600,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,6,2,2,60,60,420,1
Style: C3,DejaVu Sans,86,&H00B469FF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,6,2,2,60,60,420,1
Style: Hit,DejaVu Sans,96,&H003030FF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,6,2,2,60,60,420,1
Style: Title,DejaVu Sans,72,&H00FFFFFF,&H00FFFFFF,&H00000000,&HC0000000,-1,0,0,0,100,100,0,0,3,18,0,8,60,60,220,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    ev = [f"Dialogue: 1,{ts(0)},{ts(3.0)},Title,,0,0,0,,{{\\fad(150,300)}}{clip['title'].upper()}"]
    hot = [h.lower() for h in clip.get("highlight", [])]
    i = 0
    while i < len(sel):
        chunk = sel[i:i + 3]
        st = chunk[0][0]
        en = sel[i + 3][0] if i + 3 < len(sel) else min(st + 1.5, b - a)
        en = max(en, st + 0.3)
        text = " ".join(re.sub(r"[\[\]]", "", w) for _, w in chunk).upper()
        style = "Hit" if any(h in text.lower() for h in hot) else f"C{(i // 3) % 4}"
        # small pop-in scale animation on each chunk
        boom = [e.lower() for e in clip.get("expand", [])]
        if any(e in text.lower() for e in boom):
            # joke punchline: burst to 160% then settle at 130%
            anim = "{\\fscx60\\fscy60\\t(0,180,\\fscx160\\fscy160)\\t(180,420,\\fscx130\\fscy130)}"
            style = "Hit"
            if i + 3 >= len(sel):
                en = max(en, st + 1.4)
        else:
            anim = "{\\fscx80\\fscy80\\t(0,90,\\fscx100\\fscy100)}"
        ev.append(f"Dialogue: 0,{ts(st)},{ts(en)},{style},,0,0,0,,{anim}{text}")
        i += 3
    open(path, "w").write(head + "\n".join(ev) + "\n")


def render(clip, src, words, test=False):
    os.makedirs(OUT, exist_ok=True)
    n = clip["id"]
    ass = os.path.join(HERE, f"clip_{n}.ass")
    make_ass(clip, words, ass)
    dur = clip["end"] - clip["start"]
    out = os.path.join(OUT, f"clip_{n}_{clip['slug']}.mp4")
    punch = max(0.0, clip["punch"] - clip["start"])
    pops = [max(0.0, t - clip["start"]) for t, w in words
            if clip["start"] <= t < clip["end"] and "laughter" in w.lower()][:4]
    sfx_in = ["-i", f"{SFX}/whoosh.wav", "-i", f"{SFX}/boom.wav"] + sum(
        (["-i", f"{SFX}/pop.wav"] for _ in pops), [])
    mix = [f"[1:a]volume=0.8[w]", f"[2:a]adelay={int(punch*1000)}|{int(punch*1000)},volume=0.9[bm]"]
    labels = ["[a0]", "[w]", "[bm]"]
    if clip.get("fart") is not None:
        ft = int(max(0.0, clip["fart"] - clip["start"]) * 1000)
        sfx_in += ["-i", f"{SFX}/fart.wav"]
        k = 3 + len(pops)
        mix.append(f"[{k}:a]adelay={ft}|{ft},volume=1.2[ft]")
        labels.append("[ft]")
    for k, t in enumerate(pops):
        mix.append(f"[{3+k}:a]adelay={int(t*1000)}|{int(t*1000)}[p{k}]")
        labels.append(f"[p{k}]")
    # Video: blurred full-frame background + centered sharp 16:9 frame (keeps the
    # streamer's facecam & game both visible), punch-in zoom at the punchline, captions.
    vf = (f"[0:v]split[bg][fg];"
          f"[bg]fps=30,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=25:2,eq=brightness=-0.08[bgb];"
          f"[fg]fps=30,scale=1080:-2,"
          f"zoompan=z='if(between(it,{punch:.2f},{punch+1.2:.2f}),1.18,1)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x608:fps=30[fgz];"
          f"[bgb][fgz]overlay=0:(H-h)/2-120,ass='{ass}'[v]")
    af = f"[0:a]loudnorm=I=-14:TP=-1.5:LRA=11[a0];" + ";".join(mix) + ";" + "".join(labels) + \
         f"amix=inputs={len(labels)}:normalize=0:duration=first,alimiter=limit=0.95[a]"
    seek = ["-ss", str(0 if test else clip["start"]), "-t", str(dur)]
    run(["ffmpeg", "-y", *seek, "-i", src, *sfx_in,
         "-filter_complex", vf + ";" + af, "-map", "[v]", "-map", "[a]",
         "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-r", "30", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "192k", "-t", str(dur), "-movflags", "+faststart", out])
    return out


def main():
    args = sys.argv[1:]
    make_sfx()
    words = load_words()
    if "--test" in args:
        dummy = os.path.join(HERE, "dummy.mp4")
        run(["ffmpeg", "-y", "-f", "lavfi", "-i", "testsrc2=s=1280x720:r=30:d=60",
             "-f", "lavfi", "-i", "sine=f=220:d=60", "-shortest", "-c:v", "libx264",
             "-preset", "ultrafast", "-c:a", "aac", dummy])
        c = dict(CLIPS[0]); c["end"] = c["start"] + 20; c["punch"] = c["start"] + 8
        print("test ->", render(c, dummy, words, test=True)); return
    if not args:
        sys.exit(__doc__)
    src = args[0]
    only = None
    if "--only" in args:
        only = {int(x) for x in args[args.index("--only") + 1].split(",")}
    for c in CLIPS:
        if only and c["id"] not in only:
            continue
        print("rendering", c["id"], c["title"], "...", flush=True)
        print("  ->", render(c, src, words))


if __name__ == "__main__":
    main()
