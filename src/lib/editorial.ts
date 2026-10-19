export type EditorialImageInput = { _id?: unknown; imageUrl?: string; slug?: string; category?: string; title?: string; tags?: string[] };

const photos = {
  landscape: { src: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1800&q=85", alt: "Soft sunlight spilling over a misty green landscape" },
  botanical: { src: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1400&q=85", alt: "Leafy houseplant in natural window light" },
  coffee: { src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=85", alt: "Coffee and the small rituals around a quiet morning" },
  city: { src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1400&q=85", alt: "A city street full of small details" },
  writing: { src: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=85", alt: "A notebook and writing desk ready for a first draft" },
  books: { src: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1400&q=85", alt: "Books gathered on a well-loved shelf" },
  flowers: { src: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1400&q=85", alt: "Fresh flowers in soft natural light" },
  coast: { src: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1400&q=85", alt: "Ocean waves meeting the shore" },
  architecture: { src: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1400&q=85", alt: "Sculptural modern architecture and clean lines" },
  food: { src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=85", alt: "A colourful table of fresh food" },
  art: { src: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1400&q=85", alt: "Expressive colours on an artist's canvas" },
  mountain: { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85", alt: "Layered mountain peaks in clear air" },
  people: { src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=85", alt: "Friends sharing an unhurried moment outdoors" },
  technology: { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=85", alt: "A close view of electronic components and modern tools" },
  interiors: { src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=85", alt: "A calm, thoughtfully arranged interior" },
  night: { src: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1400&q=85", alt: "A quiet night sky above a distant horizon" },
} as const;

export type EditorialPhotoKey = keyof typeof photos;

export function photoForPost(post: EditorialImageInput): { src: string; alt: string } {
  if (post.imageUrl) return { src: post.imageUrl, alt: post.title ? `Cover image for ${post.title}` : "Story cover image" };
  const text = `${post.slug ?? ""} ${post.category ?? ""} ${post.title ?? ""} ${(post.tags ?? []).join(" ")}`.toLowerCase();
  if (/tech|digital|internet|device|ai|code/.test(text)) return photos.technology;
  if (/architecture|building|design|interior|home|space/.test(text)) return /interior|home|room/.test(text) ? photos.interiors : photos.architecture;
  if (/food|cook|recipe|meal|eat|kitchen/.test(text)) return photos.food;
  if (/people|friend|community|relationship|conversation/.test(text)) return photos.people;
  if (/mountain|hike|trail|climb/.test(text)) return photos.mountain;
  if (/night|sleep|dream|dark|evening|moon/.test(text)) return photos.night;
  if (/art|paint|draw|craft|creative|creativity|make things|colour|color/.test(text)) return photos.art;
  if (/city|travel|street|place|neighbour|neighborhood|walk/.test(text)) return photos.city;
  if (/coffee|morning|ritual|tea|slow living|mug/.test(text)) return photos.coffee;
  if (/book|read|reading|library/.test(text)) return photos.books;
  if (/write|draft|writing|essay|journal/.test(text)) return photos.writing;
  if (/flower|garden|seed|bloom/.test(text)) return photos.flowers;
  if (/coast|ocean|sea|water|beach/.test(text)) return photos.coast;
  if (/mindful|notic|plant|green|nature|wellbeing/.test(text)) return photos.botanical;
  return photos.landscape;
}

export function editorialPhoto(key: EditorialPhotoKey) { return photos[key]; }
