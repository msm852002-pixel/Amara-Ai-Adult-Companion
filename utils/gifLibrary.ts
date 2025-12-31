
// Curated list of reliable Giphy URLs for various moods
const GIF_COLLECTION: Record<string, string[]> = {
  happy: [
    "https://media.giphy.com/media/l0MYt5q34Nw3I58bi/giphy.gif",
    "https://media.giphy.com/media/3o7abldj0b3rHzjcnK/giphy.gif",
    "https://media.giphy.com/media/DyQrKMpqkAhNHZ1iWe/giphy.gif",
    "https://media.giphy.com/media/chzz1FQgqhsaCnqDzp/giphy.gif"
  ],
  flirty: [
    "https://media.giphy.com/media/26FLdmIp6wJr91JQM/giphy.gif",
    "https://media.giphy.com/media/l4lQW9Ct0UQvD3bMc/giphy.gif",
    "https://media.giphy.com/media/3o7TKoWXm3okO1kgHC/giphy.gif",
    "https://media.giphy.com/media/108M7gCS1JSoO4/giphy.gif",
    "https://media.giphy.com/media/elRdobcE1tKq1nAqlF/giphy.gif"
  ],
  love: [
    "https://media.giphy.com/media/26BRv0ThflsKCqLXG/giphy.gif",
    "https://media.giphy.com/media/l0HlvUboeIugqb1ZB/giphy.gif",
    "https://media.giphy.com/media/R6gvnAxj2ISzJdbA63/giphy.gif",
    "https://media.giphy.com/media/3o7TKo68x5gK3Q5Pmo/giphy.gif"
  ],
  sassy: [
    "https://media.giphy.com/media/l0HlCqXxknf72KzWo/giphy.gif",
    "https://media.giphy.com/media/3oKIP8kNuTJJL3zT0I/giphy.gif",
    "https://media.giphy.com/media/10tkJMp58pQ3kY/giphy.gif"
  ],
  sad: [
    "https://media.giphy.com/media/26ufcVAp3AiJJsrIs/giphy.gif",
    "https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif",
    "https://media.giphy.com/media/7SF5scGB2AFrgsXP63/giphy.gif"
  ],
  surprised: [
    "https://media.giphy.com/media/5i7umUqAOYYEw/giphy.gif",
    "https://media.giphy.com/media/l0ExkEkBl7Grk78tO/giphy.gif",
    "https://media.giphy.com/media/tfUW8mhiFk8NlJhgEh/giphy.gif"
  ],
  shy: [
    "https://media.giphy.com/media/3oEjI4sFlp53wwkZUI/giphy.gif",
    "https://media.giphy.com/media/e1ESXynAnueNG/giphy.gif",
    "https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif"
  ],
  naughty: [
    "https://media.giphy.com/media/asHT7eh4AwG9G/giphy.gif",
    "https://media.giphy.com/media/wwvfpYmZzU74c/giphy.gif",
    "https://media.giphy.com/media/Gf3AUz3eBNbTG/giphy.gif"
  ]
};

export const getRandomGif = (category: string): string | null => {
  const normalizedCategory = category.toLowerCase().trim();
  const gifs = GIF_COLLECTION[normalizedCategory];
  
  if (!gifs || gifs.length === 0) {
    // Fallback for unknown categories if possible, or return null
    if (normalizedCategory === 'waiting') return "https://media.giphy.com/media/l0HlBO7eyxdzTZtbz2/giphy.gif";
    return null;
  }

  const randomIndex = Math.floor(Math.random() * gifs.length);
  return gifs[randomIndex];
};
