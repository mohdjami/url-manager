export default function createShortUrl(): any {
  const code = "qwertyuioplkjhgfdsazxcvbnm";
  let shortUrl = "";
  for (let i = 0; i < 6; i++) {
    shortUrl += code[Math.floor(Math.random() * code.length)];
  }
  return shortUrl;
}
