import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";

const starterStories = [
  { title: "The art of noticing", slug: "the-art-of-noticing", excerpt: "A small case for looking a little closer, and letting the ordinary become extraordinary.", category: "Mindful living", tags: ["Mindfulness", "Creativity"], authorId: "margin-editors", authorName: "Margin Editors", content: `There is a particular kind of magic that arrives when we stop moving long enough to see what is already here. The light moving across the kitchen wall. The tiny green life pushing through a crack in the pavement. The neighbour who always hums while watering their plants.\n\nWe have become very good at looking past things. Our attention is constantly tugged towards the next alert, the next deadline, the next bright thing promising to be more interesting than this one. Noticing is a quiet rebellion against that hurry.\n\n## Begin with what is near\n\nYou do not need a mountain view or a perfect morning routine. Start with your immediate world. Notice the weather before checking the forecast. Listen to the full sound of a kettle. Ask one more question when someone tells you about their day.\n\n> Attention is the beginning of devotion.\n\nOver time, these small acts build a kind of inner archive: a collection of colours, moments, and small human details that belong only to you. The world is not always spectacular. Most of it is made of ordinary days. What a gift, then, to learn how to see them.` },
  { title: "Small rituals, softer mornings", slug: "small-rituals-softer-mornings", excerpt: "A gentler start does not need a complicated routine. Sometimes it begins with one small promise.", category: "Slow living", tags: ["Rituals", "Wellbeing"], authorId: "margin-editors", authorName: "Margin Editors", content: `I used to think a good morning had to be engineered. A perfect sequence, a full checklist, an impressive streak of habits completed before the world woke up. It was exhausting before breakfast.\n\nNow I keep a much smaller promise: the first ten minutes are mine. I open a window, make tea, and give the day a little space before I ask it for anything. Some mornings I read a page. Some mornings I just watch the sparrows argue about the balcony.\n\n## Make the ritual smaller\n\nA ritual works best when it can survive a real life. Put your favourite mug somewhere you can reach it. Leave a book face-up on the table. Choose one song that makes your shoulders drop. Make the first step so easy that a sleepy version of you can still do it.\n\n> A softer morning is not a productivity hack. It is a way of arriving.\n\nThe point is not to get every morning right. The point is to have a familiar door back to yourself.` },
  { title: "The city is a walking book", slug: "the-city-is-a-walking-book", excerpt: "Read your neighbourhood like a book: one overlooked doorway, tiny garden, and corner shop at a time.", category: "Field notes", tags: ["Travel", "Observation"], authorId: "margin-editors", authorName: "Margin Editors", content: `A city tells its story in fragments. The faded lettering above a tailor shop. A jacaranda tree leaning over a wall. A hand-written sign taped to a bakery window, announcing that someone’s grandmother made today’s biscuits.\n\nWhen we travel, we often collect destinations. When we walk, we collect details. The second kind of collection has a lovely way of changing the first: the place becomes more than its landmarks and begins to feel lived in.\n\n## Take the long way\n\nChoose a route you know and walk it at half your usual speed. Look up at the upper floors. Read the old shop signs. Notice which doors are propped open and which plants have claimed the pavement. Let one turn be decided by curiosity rather than efficiency.\n\n> A familiar place can still surprise you when you stop asking it to be familiar.` },
  { title: "Make things badly, on purpose", slug: "make-things-badly-on-purpose", excerpt: "Permission to make an imperfect first draft, a lopsided pot, or a song no one else will hear.", category: "Creative practice", tags: ["Creativity", "Process"], authorId: "margin-editors", authorName: "Margin Editors", content: `The first sketch is not a referendum on your talent. The first paragraph is not proof that you should quit writing. And the first attempt at a new skill is almost always awkward, because learning is visible before it becomes fluent.\n\nStill, we treat beginnings like auditions. We want the early version to demonstrate the promise of the final one. That pressure makes it hard to begin at all.\n\n## Lower the stakes\n\nTry making something that is not allowed to be good. Give yourself fifteen minutes and a deliberately unimportant outcome. Draw with your non-dominant hand. Write a story about a spoon. Take ten photographs of the colour yellow.\n\n> A finished imperfect thing can teach you what a perfect imaginary thing never will.\n\nPlay is not the opposite of serious work. It is often the path that lets serious work begin.` },
];
let seedPromise: Promise<void> | null = null;
async function ensureStarterStories() {
  if (!seedPromise) seedPromise = (async () => {
    if (await Post.estimatedDocumentCount() > 0) return;
    try { await Post.insertMany(starterStories, { ordered: false }); }
    catch (error) { if (!(error instanceof Error) || !error.message.includes("E11000")) throw error; }
  })();
  await seedPromise;
}

function publicDemoStories() {
  const now = new Date("2026-10-17T09:00:00.000Z");
  return starterStories.map((story, index) => ({
    ...story,
    imageUrl: undefined,
    _id: `margin-demo-${index + 1}`,
    likes: [] as string[],
    comments: [] as { _id: string; authorName: string; body: string; createdAt: Date }[],
    publishedAt: new Date(now.getTime() - index * 4 * 86400000),
    createdAt: new Date(now.getTime() - index * 4 * 86400000),
    updatedAt: new Date(now.getTime() - index * 4 * 86400000),
  }));
}

export async function getPosts(query?: string, tag?: string) {
  const text = query?.trim().toLowerCase() || "";
  const fallback = () => publicDemoStories().filter(post =>
    (!tag || post.tags.includes(tag)) &&
    (!text || `${post.title} ${post.excerpt} ${post.content} ${post.tags.join(" ")} ${post.category}`.toLowerCase().includes(text))
  );

  if (!process.env.MONGODB_URI) return fallback();

  try {
    await connectDB();
    await ensureStarterStories();
    const filter: Record<string, unknown> = {};
    if (tag) filter.tags = tag;
    if (query?.trim()) {
      const q = query.trim().slice(0, 100);
      filter.$or = [
        { title: { $regex: escapeRegex(q), $options: "i" } },
        { excerpt: { $regex: escapeRegex(q), $options: "i" } },
        { content: { $regex: escapeRegex(q), $options: "i" } },
        { tags: { $regex: escapeRegex(q), $options: "i" } },
      ];
    }
    return await Post.find(filter).select("-imageData -imageMimeType").sort({ publishedAt: -1 }).limit(100).lean();
  } catch (error) {
    console.error("[margin] MongoDB story query failed; serving read-only starter stories.", error instanceof Error ? error.name : "UnknownError");
    return fallback();
  }
}

export async function getPostBySlug(slug: string) {
  const fallback = () => publicDemoStories().find(post => post.slug === slug) || null;
  if (!process.env.MONGODB_URI) return fallback();
  try {
    await connectDB();
    await ensureStarterStories();
    return await Post.findOne({ slug }).select("-imageData -imageMimeType").lean();
  } catch (error) {
    console.error("[margin] MongoDB story lookup failed; using read-only starter content.", error instanceof Error ? error.name : "UnknownError");
    return fallback();
  }
}
function escapeRegex(text: string) { return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
