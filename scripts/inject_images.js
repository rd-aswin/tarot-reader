const fs = require('fs');
let code = fs.readFileSync('src/lib/tarot/deck.ts', 'utf8');
code = code.replace(/(number:\s*(\d+),[\s\S]*?archetype:\s*"[^"]*",)/g, (match, p1, p2) => {
  const num = parseInt(p2, 10).toString().padStart(2, '0');
  return p1 + '\n    imageFile: "m' + num + '.jpg",';
});
// Add import and export for full deck
if (!code.includes('MINOR_ARCANA')) {
  code = 'import { MINOR_ARCANA } from "./minorArcana";\n' + code;
  code += '\nexport const FULL_DECK: TarotCard[] = [...MAJOR_ARCANA, ...MINOR_ARCANA];\n';
}
fs.writeFileSync('src/lib/tarot/deck.ts', code);
