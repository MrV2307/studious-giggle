export type EditorialImageInput = { _id?: unknown; imageUrl?: string | null; slug?: string; category?: string; title?: string; tags?: string[] };

const photos = {
  landscape: { src: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1800&q=85", alt: "A view of Earth’s blue curve against the darkness of space" },
  botanical: { src: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1400&q=85", alt: "Sunlit leaves and soft green shapes in a botanical corner" },
  coffee: { src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1400&q=85", alt: "A richly textured coffee moment in warm morning light" },
  city: { src: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1400&q=85", alt: "A city skyline glowing against the blue hour" },
  writing: { src: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1400&q=85", alt: "An open notebook waiting for a first draft" },
  books: { src: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1400&q=85", alt: "A well-loved open book in a quiet reading space" },
  flowers: { src: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=1400&q=85", alt: "Fresh flowers arranged in soft natural light" },
  coast: { src: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=85", alt: "Deep blue ocean waves folding onto the shore" },
  architecture: { src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1400&q=85", alt: "Sculptural modern architecture seen in clean daylight" },
  food: { src: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1400&q=85", alt: "Fresh ingredients arranged across a colourful kitchen table" },
  art: { src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1400&q=85", alt: "A colourful artist’s workspace with paint and canvas" },
  mountain: { src: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1400&q=85", alt: "Mountain peaks layered against a wide open sky" },
  people: { src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=85", alt: "People sharing ideas around a collaborative table" },
  technology: { src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=85", alt: "A luminous view of global technology and connected systems" },
  interiors: { src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85", alt: "A thoughtful interior with warm materials and quiet light" },
  night: { src: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1400&q=85", alt: "A vivid nebula glowing within a deep field of stars" },
} as const;

export type EditorialPhotoKey = keyof typeof photos;

export function photoForPost(post: EditorialImageInput): { src: string; alt: string } {
  if (post.imageUrl) return { src: post.imageUrl, alt: post.title ? `Cover image for ${post.title}` : "Story cover image" };
  const text = `${post.slug ?? ""} ${post.category ?? ""} ${post.title ?? ""} ${(post.tags ?? []).join(" ")}`.toLowerCase();
  if (/cosmos|nebula|galaxy|universe|star|astronomy/.test(text)) return photos.night;
  if (/tech|digital|internet|device|ai|code/.test(text)) return photos.technology;
  if (/architecture|building|design|interior|home|space/.test(text)) return /interior|home|room/.test(text) ? photos.interiors : photos.architecture;
  if (/food|cook|recipe|meal|eat|kitchen/.test(text)) return photos.food;
  if (/people|friend|community|relationship|conversation/.test(text)) return photos.people;
  if (/mountain|hike|trail|climb/.test(text)) return photos.mountain;
  if (/night|sleep|dream|dark|evening|moon/.test(text)) return photos.night;
  if (/\bart\b|paint|draw|craft|creative|creativity|make things|colour|color/.test(text)) return photos.art;
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
