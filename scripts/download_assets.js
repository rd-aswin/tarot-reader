const fs = require('fs');
const path = require('path');
const https = require('https');

const CARDS_DIR = path.join(__dirname, '..', 'public', 'cards');
const TAROT_JSON_PATH = path.join(__dirname, '..', 'scratch_tarot.json');
const TS_OUTPUT_PATH = path.join(__dirname, '..', 'src', 'lib', 'tarot', 'minorArcana.ts');

const SUIT_MAP = {
  wands: 'w',
  cups: 'c',
  swords: 's',
  pentacles: 'p',
  coins: 'p',
  major: 'm'
};

const ELEMENT_MAP = {
  wands: 'fire',
  cups: 'water',
  swords: 'air',
  pentacles: 'earth',
  coins: 'earth',
  major: 'spirit'
};

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) return resolve(); // Skip if already exists
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'NodeJS' } }, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        return downloadImage(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Reading scratch_tarot.json...');
  const rawData = fs.readFileSync(TAROT_JSON_PATH, 'utf-8');
  const data = JSON.parse(rawData.replace(/^\uFEFF/, ''));
  
  let minorArcanaTS = `import { TarotCard } from "./types";\n\nexport const MINOR_ARCANA: TarotCard[] = [\n`;
  
  console.log('Processing cards & downloading images...');
  for (const card of data.tarot_interpretations) {
    const suit = card.suit;
    
    // Determine image filename (e.g. m00.jpg, c01.jpg, etc.)
    let imgPrefix = SUIT_MAP[suit];
    let imgNumStr = '';
    
    if (suit === 'major') {
      imgNumStr = card.rank.toString().padStart(2, '0');
    } else {
      let num = card.rank;
      if (num === 'page') num = 11;
      else if (num === 'knight') num = 12;
      else if (num === 'queen') num = 13;
      else if (num === 'king') num = 14;
      imgNumStr = num.toString().padStart(2, '0');
    }
    
    const imgFilename = `${imgPrefix}${imgNumStr}.jpg`;
    const imgUrl = `https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/${imgFilename}`;
    const destPath = path.join(CARDS_DIR, imgFilename);
    
    try {
      await downloadImage(imgUrl, destPath);
      console.log(`Downloaded ${imgFilename}`);
    } catch (e) {
      console.error(`Failed to download ${imgFilename}: ${e.message}`);
    }

    // Only process Minors for the TS file (we already have custom Majors)
    if (suit !== 'major') {
      const normalizedSuit = suit === 'coins' ? 'pentacles' : suit;
      const element = ELEMENT_MAP[normalizedSuit];
      let cardNum = card.rank;
      if (cardNum === 'page') cardNum = 11;
      if (cardNum === 'knight') cardNum = 12;
      if (cardNum === 'queen') cardNum = 13;
      if (cardNum === 'king') cardNum = 14;

      const slug = card.name.toLowerCase().replace(/\s+/g, '-');
      
      minorArcanaTS += `  {
    id: "minor-${normalizedSuit}-${cardNum}-${slug}",
    name: "${card.name}",
    number: ${cardNum},
    arcana: "minor",
    suit: "${normalizedSuit}",
    element: "${element}",
    archetype: "${card.keywords[0] || ''}",
    imageFile: "${imgFilename}",
    keywords: {
      upright: ${JSON.stringify(card.meanings.light.slice(0, 4))},
      reversed: ${JSON.stringify(card.meanings.shadow.slice(0, 4))}
    },
    summary: {
      upright: ${JSON.stringify(card.fortune_telling[0] || card.meanings.light[0])},
      reversed: ${JSON.stringify(card.fortune_telling[1] || card.meanings.shadow[0])}
    }
  },\n`;
    }
  }
  
  minorArcanaTS += `];\n`;
  fs.writeFileSync(TS_OUTPUT_PATH, minorArcanaTS);
  console.log('Successfully generated minorArcana.ts!');
}

run().catch(console.error);
