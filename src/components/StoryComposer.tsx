"use client";

import Image from "next/image";
import { type ChangeEvent, Fragment, useEffect, useMemo, useRef, useState } from "react";

type StoryAction = (formData: FormData) => void | Promise<void>;

const writingPrompts = [
  "Describe a tiny detail that changed the way you saw an ordinary day.",
  "Write about something you once misunderstood, and what changed your mind.",
  "Start with: “I nearly walked past it.”",
  "Describe a place through its sounds, without naming the place.",
  "What is a small thing you wish more people noticed?",
  "Write a note to the version of you who was just starting something difficult.",
  "Tell the story of an object that has quietly stayed with you.",
  "Begin with a question you do not yet know how to answer."
];

function inlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g);
  return parts.map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (link) return <a key={index} href={link[2]} target="_blank" rel="noreferrer">{link[1]}</a>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    return <Fragment key={index}>{part}</Fragment>;
  });
}

function MarkdownPreview({ value }: { value: string }) {
  const blocks = value.trim().split(/\n\s*\n/).filter(Boolean);
  if (!blocks.length) {
    return <div className="story-preview-empty"><span aria-hidden="true">✳</span><p>Your story preview will take shape here as you write.</p></div>;
  }
  return (
    <div className="story-markdown-preview">
      {blocks.map((block, index) => {
        const lines = block.split("\n");
        const heading = lines.length === 1 ? lines[0].match(/^(#{1,3})\s+(.+)$/) : null;
        if (heading) {
          const children = inlineMarkdown(heading[2]);
          if (heading[1].length === 1) return <h2 key={index}>{children}</h2>;
          if (heading[1].length === 2) return <h3 key={index}>{children}</h3>;
          return <h4 key={index}>{children}</h4>;
        }
        if (lines.every(line => /^\s*[-*]\s+/.test(line))) {
          return <ul key={index}>{lines.map((line, i) => <li key={i}>{inlineMarkdown(line.replace(/^\s*[-*]\s+/, ""))}</li>)}</ul>;
        }
        if (lines.every(line => /^\s*\d+\.\s+/.test(line))) {
          return <ol key={index}>{lines.map((line, i) => <li key={i}>{inlineMarkdown(line.replace(/^\s*\d+\.\s+/, ""))}</li>)}</ol>;
        }
        if (lines.every(line => /^\s*>/.test(line))) {
          return <blockquote key={index}>{lines.map((line, i) => <Fragment key={i}>{i > 0 && <br />}{inlineMarkdown(line.replace(/^\s*>\s?/, ""))}</Fragment>)}</blockquote>;
        }
        return <p key={index}>{lines.map((line, i) => <Fragment key={i}>{i > 0 && <br />}{inlineMarkdown(line)}</Fragment>)}</p>;
      })}
    </div>
  );
}

export default function StoryComposer({ action }: { action: StoryAction }) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Field notes");
  const [tags, setTags] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState("");
  const [coverError, setCoverError] = useState("");
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [focusMode, setFocusMode] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const wordCount = useMemo(() => content.trim() ? content.trim().split(/\s+/).length : 0, [content]);
  const readMinutes = wordCount ? Math.max(1, Math.ceil(wordCount / 200)) : 0;

  useEffect(() => {
    if (!coverFile) {
      setCoverUrl("");
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  function handleCoverChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0] || null;
    setCoverError("");
    if (!file) {
      setCoverFile(null);
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
      setCoverFile(null);
      setCoverError("Please choose a JPG, PNG, WebP, or AVIF image.");
      event.currentTarget.value = "";
      return;
    }
    if (file.size > 1_500_000) {
      setCoverFile(null);
      setCoverError("This image is larger than 1.5 MB. Choose a smaller file so the journal stays quick to load.");
      event.currentTarget.value = "";
      return;
    }
    setCoverFile(file);
  }

  function insertMarkup(before: string, after = "") {
    const textarea = bodyRef.current;
    const start = textarea?.selectionStart ?? content.length;
    const end = textarea?.selectionEnd ?? content.length;
    const selected = content.slice(start, end) || "your text";
    setContent(content.slice(0, start) + before + selected + after + content.slice(end));
    window.requestAnimationFrame(() => {
      if (!textarea) return;
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  function insertPrompt() {
    setContent(current => current.trim()
      ? `${current.trimEnd()}\n\n${writingPrompts[promptIndex]}\n\n`
      : `${writingPrompts[promptIndex]}\n\n`);
    setMode("write");
    window.requestAnimationFrame(() => bodyRef.current?.focus());
  }

  return (
    <form action={action} className={`story-composer ${focusMode ? "is-focus-mode" : ""}`} encType="multipart/form-data">
      <div className="composer-topline">
        <div><span className="composer-kicker">YOUR NOTEBOOK / NEW ENTRY</span><p>Nothing has to be perfect on the first pass.</p></div>
        <button className="writer-quiet-button" type="button" aria-pressed={focusMode} onClick={() => setFocusMode(value => !value)}>{focusMode ? "Exit focus mode ↗" : "◉ Focus mode"}</button>
      </div>

      <div className="composer-grid">
        <section className="composer-main" aria-label="Story text editor">
          <div className="writer-field field">
            <div className="writer-label-row"><label htmlFor="title">Give it a title</label><span aria-live="polite">{title.length}/130</span></div>
            <input id="title" name="title" value={title} onChange={event => setTitle(event.target.value)} required maxLength={130} placeholder="Something worth keeping…" autoComplete="off" aria-describedby="title-guidance" />
            <small id="title-guidance">A clear title is plenty. A clever one is optional.</small>
          </div>

          <div className="writer-field field">
            <div className="writer-label-row"><label htmlFor="excerpt">The little introduction</label><span aria-live="polite">{excerpt.length}/260</span></div>
            <textarea id="excerpt" name="excerpt" value={excerpt} onChange={event => setExcerpt(event.target.value)} required maxLength={260} rows={3} placeholder="Give someone a small reason to keep reading…" aria-describedby="excerpt-guidance" />
            <small id="excerpt-guidance">This appears on story cards and at the top of your article.</small>
          </div>

          <div className="writer-body-field writer-field field">
            <div className="writer-label-row writer-body-label"><label htmlFor="content">The story itself</label><span className="writer-markdown-note">Markdown supported</span></div>
            <div className="writer-editor-toolbar" role="group" aria-label="Insert Markdown formatting">
              <button type="button" disabled={mode !== "write"} onClick={() => insertMarkup("## ")} aria-label="Insert a level two heading">H2</button>
              <button type="button" disabled={mode !== "write"} onClick={() => insertMarkup("**", "**")} aria-label="Make selected text bold"><strong>B</strong></button>
              <button type="button" disabled={mode !== "write"} onClick={() => insertMarkup("*", "*")} aria-label="Make selected text italic"><em>I</em></button>
              <button type="button" disabled={mode !== "write"} onClick={() => insertMarkup("> ")} aria-label="Start a quote">“ ”</button>
              <button type="button" disabled={mode !== "write"} onClick={() => insertMarkup("- ")} aria-label="Start a bullet point">• List</button>
              <button type="button" disabled={mode !== "write"} onClick={() => insertMarkup("[", "](https://example.com)")} aria-label="Insert a link">↗ Link</button>
            </div>
            <div className="writer-mode-tabs" role="group" aria-label="Choose writing view">
              <button type="button" className={mode === "write" ? "is-active" : ""} aria-pressed={mode === "write"} onClick={() => setMode("write")}>Write</button>
              <button type="button" className={mode === "preview" ? "is-active" : ""} aria-pressed={mode === "preview"} onClick={() => setMode("preview")}>Preview ↗</button>
            </div>
            {mode === "write" ? (
              <textarea
                ref={bodyRef}
                id="content"
                name="content"
                value={content}
                onChange={event => setContent(event.target.value)}
                required
                maxLength={50000}
                rows={19}
                className="body-input writer-body-input"
                placeholder={"Begin anywhere. A moment, a question, a tiny thing you noticed…\n\n## A thought to follow\n\nLet the next sentence be enough."}
                aria-describedby="story-body-guidance story-metrics"
              />
            ) : (
              <input type="hidden" name="content" value={content} />
              <div className="writer-preview-panel" aria-label="Live story preview">
                <div className="writer-preview-eyebrow">{category} / MARGIN JOURNAL</div>
                <h2>{title.trim() || "A story in progress"}</h2>
                {excerpt.trim() && <p className="writer-preview-excerpt">{excerpt}</p>}
                <MarkdownPreview value={content} />
              </div>
            )}
            <div className="writer-story-metrics" id="story-metrics" aria-live="polite">
              <span><strong>{wordCount.toLocaleString()}</strong> words</span><span aria-hidden="true">·</span><span>{readMinutes ? `About ${readMinutes} min read` : "Reading time appears as you write"}</span><span className="writer-metric-spacer" /><span>{content.length.toLocaleString()}/50,000 characters</span>
            </div>
            <small id="story-body-guidance">Use blank lines between paragraphs. Markdown headings, lists, quotes, emphasis, code, and links are supported.</small>
          </div>
        </section>

        <aside className="composer-side" aria-label="Publishing details and writing prompts">
          <section className="composer-side-card cover-card">
            <div className="side-card-heading"><span className="side-card-index">01 / VISUAL</span><h2>Set the scene.</h2><p>Every story needs a cover of its own.</p></div>
            <label className="cover-dropzone" htmlFor="coverImage">
              {coverUrl ? (
                <Image src={coverUrl} alt="Preview of your selected story cover" width={960} height={600} unoptimized className="cover-preview-image" />
              ) : (
                <span className="cover-drop-empty"><span aria-hidden="true">↥</span><strong>Choose a cover image</strong><small>JPG · PNG · WebP · AVIF</small></span>
              )}
              {coverUrl && <span className="cover-change-chip">Change image ↗</span>}
            </label>
            <input id="coverImage" name="coverImage" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required onChange={handleCoverChange} aria-describedby="cover-guidance cover-error" className="cover-file-input" />
            <div id="cover-guidance" className="cover-guidance">Max 1.5 MB · use an image you have permission to publish.</div>
            {coverFile && <p className="cover-file-name" role="status">{coverFile.name} · {(coverFile.size / 1024).toFixed(0)} KB</p>}
            {coverError && <p id="cover-error" className="cover-validation-error" role="alert">{coverError}</p>}
            {!coverError && <span id="cover-error" className="cover-error-reserved" aria-hidden="true" />}
          </section>

          <section className="composer-side-card">
            <div className="side-card-heading"><span className="side-card-index">02 / DETAILS</span><h2>Find its place.</h2></div>
            <div className="field writer-field"><label htmlFor="category">Category</label><select id="category" name="category" value={category} onChange={event => setCategory(event.target.value)}><option>Mindful living</option><option>Slow living</option><option>Field notes</option><option>Creative practice</option><option>Reading room</option><option>Personal essay</option></select></div>
            <div className="field writer-field"><div className="writer-label-row"><label htmlFor="tags">Tags</label><span>Optional</span></div><input id="tags" name="tags" value={tags} onChange={event => setTags(event.target.value)} maxLength={200} placeholder="Writing, Reflection, Ideas" /><small>Separate tags with commas (up to 8).</small></div>
            <div className="story-url-note"><span aria-hidden="true">↗</span><span>Your story gets a readable web address from its title.</span></div>
          </section>

          <section className="composer-side-card prompt-card">
            <div className="side-card-heading"><span className="side-card-index">03 / WHEN STUCK</span><h2>A small nudge.</h2></div>
            <p className="writer-prompt-text">{writingPrompts[promptIndex]}</p>
            <div className="writer-prompt-actions">
              <button type="button" className="writer-quiet-button" onClick={() => setPromptIndex(current => (current + 1) % writingPrompts.length)}>Another prompt ↻</button>
              <button type="button" className="writer-prompt-insert" onClick={insertPrompt}>Add to my draft ↗</button>
            </div>
          </section>

          <button className="btn writer-publish-button" type="submit">Publish this story <span aria-hidden="true">↗</span></button>
          <p className="writer-publish-note">Your story is checked before it goes live. You can edit it later.</p>
        </aside>
      </div>
    </form>
  );
}
