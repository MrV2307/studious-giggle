export type EditorialImageInput = { slug?: string; category?: string; title?: string; tags?: string[] };

const photos = {
  landscape: { src: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1800&q=85", alt: "Soft sunlight spilling over a misty green landscape" },
  botanical: { src: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1400&q=85", alt: "Leafy houseplant in natural window light" },
  coffee: { src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=85", alt: "Coffee and the small rituals around a quiet morning" },
  city: { src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1400&q=85", alt: "A city street seen from above, full of little details" },
  writing: { src: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=85", alt: "A notebook and writing desk ready for a first draft" },
  books: { src: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1400&q=85", alt: "Books gathered together on a well-loved shelf" },
  flowers: { src: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1400&q=85", alt: "Fresh flowers in soft natural light" },
  coast: { src: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1400&q=85", alt: "Ocean waves meeting the shore" },
} as const;

export type EditorialPhotoKey = keyof typeof photos;

export function photoForPost(post: EditorialImageInput): { src: string; alt: string } {
  const text = `${post.slug ?? ""} ${post.category ?? ""} ${post.title ?? ""} ${(post.tags ?? []).join(" ")}`.toLowerCase();
  if (/city|travel|street|place|neighbour|neighborhood|walk/.test(text)) return photos.city;
  if (/coffee|morning|ritual|tea|slow living|mug/.test(text)) return photos.coffee;
  if (/book|read|reading|library/.test(text)) return photos.books;
  if (/write|draft|creative|creativity|make things|art of/.test(text)) return photos.writing;
  if (/flower|garden|seed|bloom/.test(text)) return photos.flowers;
  if (/coast|ocean|sea|water/.test(text)) return photos.coast;
  if (/mindful|notic|plant|green|nature/.test(text)) return photos.botanical;
  return photos.landscape;
}

export function editorialPhoto(key: EditorialPhotoKey) { return photos[key]; }