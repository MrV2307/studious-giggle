"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type SavedStory = { slug: string; title: string; savedAt: number };
const STORAGE_KEY = "margin:saved-stories:v1";
const NOTES_KEY = "margin:field-notes:v1";
const PROMPTS = [
  "Describe a place you know well as if you have arrived there for the first time.",
  "Write about a tiny object that has quietly outlasted several chapters of your life.",
  "What ordinary sound would you miss if it disappeared tomorrow?",
  "Tell a story that begins with a door left open and ends with a new question.",
  "List five details from today that would usually go unnoticed.",
  "Write a letter to your future self about something you are learning slowly.",
  "Choose a colour and follow it through a room, a street, and a memory.",
  "Describe a small ritual without using the words routine, habit, or comfort.",
  "Write the first paragraph of an essay titled: The Long Way Home.",
  "What would change if you gave one unfinished idea fifteen curious minutes?",
];

function readSavedStories(): SavedStory[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is SavedStory =>
        !!item &&
        typeof item.slug === "string" &&
        /^[a-z0-9-]+$/i.test(item.slug) &&
        typeof item.title === "string" &&
        typeof item.savedAt === "number",
    );
  } catch {
    return [];
  }
}

export default function FieldKit() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState<SavedStory[]>([]);
  const [promptIndex, setPromptIndex] = useState(0);
  const [notes, setNotes] = useState("");
  const [notesLoaded, setNotesLoaded] = useState(false);
  const [noteStatus, setNoteStatus] = useState("Notes stay in this browser.");
  const [status, setStatus] = useState("");
  const [fontScale, setFontScale] = useState(1);
  const [focusMode, setFocusMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const [readingStats, setReadingStats] = useState<{ words: number; minutes: number } | null>(null);

  const refreshSaved = useCallback(() => setSaved(readSavedStories()), []);

  useEffect(() => {
    refreshSaved();
    const handleChange = () => refreshSaved();
    window.addEventListener("storage", handleChange);
    window.addEventListener("margin:saved-stories-change", handleChange);
    return () => {
      window.removeEventListener("storage", handleChange);
      window.removeEventListener("margin:saved-stories-change", handleChange);
    };
  }, [refreshSaved]);

  useEffect(() => {
    try {
      setNotes(window.localStorage.getItem(NOTES_KEY) || "");
    } catch {
      setNoteStatus("Browser storage is unavailable. Copy important notes elsewhere.");
    } finally {
      setNotesLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!notesLoaded) return;
    const timeout = window.setTimeout(() => {
      try {
        window.localStorage.setItem(NOTES_KEY, notes);
        setNoteStatus("Saved locally · " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      } catch {
        setNoteStatus("Browser storage unavailable. Copy important notes elsewhere.");
      }
    }, 220);
    return () => window.clearTimeout(timeout);
  }, [notes, notesLoaded]);

  useEffect(() => {
    document.documentElement.style.setProperty("--margin-reader-scale", String(fontScale));
  }, [fontScale]);

  useEffect(() => {
    document.documentElement.classList.toggle("margin-focus-mode", focusMode);
    return () => document.documentElement.classList.remove("margin-focus-mode");
  }, [focusMode]);

  useEffect(() => {
    if (!pathname.startsWith("/blogs/")) setFocusMode(false);
    const update = () => {
      const article = document.querySelector<HTMLElement>(".article-body");
      if (article) {
        const words = (article.innerText || article.textContent || "").trim().split(/\s+/).filter(Boolean).length;
        setReadingStats(words ? { words, minutes: Math.max(1, Math.ceil(words / 200)) } : null);
      } else {
        setReadingStats(null);
      }
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setProgress(Math.max(0, Math.min(100, Math.round((window.scrollY / max) * 100))));
    };
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };
    update();
    const main = document.querySelector("main");
    const observer = main && "MutationObserver" in window ? new MutationObserver(update) : null;
    if (main && observer) observer.observe(main, { childList: true, subtree: true, characterData: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      observer?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  function changeFont(delta: number) {
    setFontScale((current) => Math.max(0.86, Math.min(1.4, Math.round((current + delta) * 100) / 100)));
    setStatus("Reader text size updated.");
  }

  function toggleFocus() {
    if (!pathname.startsWith("/blogs/")) {
      setStatus("Open any story to use focus reading.");
      setOpen(true);
      return;
    }
    setFocusMode((current) => !current);
    setStatus(focusMode ? "Focus reading off." : "Focus reading on. Open Field Kit to return.");
  }

  function newPrompt() {
    setPromptIndex((current) => {
      if (PROMPTS.length < 2) return 0;
      const next = Math.floor(Math.random() * (PROMPTS.length - 1));
      return next >= current ? next + 1 : next;
    });
  }

  async function copyText(value: string, message: string) {
    if (!value) {
      setStatus("There is nothing to copy yet.");
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      setStatus(message);
    } catch {
      setStatus("Clipboard access is blocked in this browser.");
    }
  }

  function removeSaved(slug: string) {
    const next = saved.filter((story) => story.slug !== slug);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSaved(next);
      window.dispatchEvent(new Event("margin:saved-stories-change"));
      setStatus("Removed from your reading list.");
    } catch {
      setStatus("Could not update the reading list in this browser.");
    }
  }

  const hasArticle = pathname.startsWith("/blogs/");

  return (
    <>
      <button
        className="margin-fieldkit-trigger"
        type="button"
        aria-controls="margin-fieldkit"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="kit-glyph" aria-hidden="true">✳</span>
        <span>Field kit</span>
        <span className="kit-count" aria-label={`${saved.length} saved stories`}>{saved.length}</span>
      </button>

      <aside
        id="margin-fieldkit"
        className={`margin-fieldkit ${open ? "is-open" : ""}`}
        role="dialog"
        aria-label="Margin Field Kit"
        aria-hidden={!open}
      >
        <div className="kit-header">
          <div>
            <div className="kit-kicker">Margin / useful things</div>
            <h2>Your field kit.</h2>
            <p>Tools for reading, collecting, and making.</p>
          </div>
          <button className="kit-close" type="button" onClick={() => setOpen(false)} aria-label="Close Field Kit">×</button>
        </div>

        <div className="kit-progress">
          <div><span>PAGE PROGRESS</span><strong>{progress}%</strong></div>
          <span className="kit-progress-track"><span style={{ width: `${progress}%` }} /></span>
        </div>

        <div className="kit-read-status">
          <strong>{readingStats ? "You are in a story" : "Reading room"}</strong>
          <span>{readingStats ? `${readingStats.words.toLocaleString()} words · about ${readingStats.minutes} min at 200 words/min` : "Browse the journal, save stories for later, or open a writing prompt."}</span>
        </div>

        <div className="kit-tool-grid">
          <button className={`kit-tool ${focusMode ? "is-active" : ""}`} type="button" onClick={toggleFocus} aria-pressed={focusMode}>
            ◎ &nbsp; {focusMode ? "Exit focus mode" : "Focus reading"}
          </button>
          <button className="kit-tool" type="button" onClick={() => changeFont(-0.08)}>A− &nbsp; Smaller type</button>
          <button className="kit-tool" type="button" onClick={() => changeFont(0.08)}>A+ &nbsp; Larger type</button>
          <button className="kit-tool" type="button" onClick={() => copyText(window.location.href, "Page link copied.")}>↗ &nbsp; Copy page link</button>
        </div>

        <section className="kit-section">
          <div className="kit-section-head">
            <h3>Writing prompt</h3>
            <button type="button" onClick={newPrompt}>NEW PROMPT ↻</button>
          </div>
          <p className="kit-prompt">{PROMPTS[promptIndex]}</p>
          <div className="kit-prompt-actions">
            <button className="kit-tool" type="button" onClick={() => copyText(PROMPTS[promptIndex], "Prompt copied.")}>Copy prompt ↗</button>
            <Link className="kit-tool" href="/write" onClick={() => setOpen(false)}>Open writing desk</Link>
          </div>
        </section>

        <section className="kit-section">
          <div className="kit-section-head">
            <h3>Saved for later</h3>
            <span>{saved.length} {saved.length === 1 ? "story" : "stories"}</span>
          </div>
          {saved.length ? (
            <div className="kit-saved-list">
              {saved.map((story) => (
                <div className="kit-saved-item" key={story.slug}>
                  <Link href={`/blogs/${encodeURIComponent(story.slug)}`} onClick={() => setOpen(false)}>{story.title}</Link>
                  <button type="button" onClick={() => removeSaved(story.slug)} aria-label={`Remove ${story.title} from saved stories`}>REMOVE</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="kit-empty">Your reading list is empty. Use “Save for later” on any story card.</p>
          )}
        </section>

        <section className="kit-section">
          <div className="kit-section-head">
            <h3>Private field notes</h3>
            <span>THIS BROWSER ONLY</span>
          </div>
          <textarea
            className="kit-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            maxLength={5000}
            placeholder="A sentence to remember, a question to follow, a thought for later…"
            aria-label="Private notes stored in this browser"
          />
          <span className="kit-note-status" aria-live="polite">{noteStatus}</span>
        </section>
        <p className="margin-fieldkit-note">Saved stories and field notes live in this browser on this device. They are not sent to a server.</p>
        {status && <p className="kit-status" role="status">{status}</p>}
      </aside>
    </>
  );
}
