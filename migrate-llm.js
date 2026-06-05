const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/KISHORE S/OneDrive/socbiz/amazon-genie/src/ai/graph/nodes';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const p = path.join(dir, file);
  let c = fs.readFileSync(p, 'utf-8');
  
  // Some files might only use getLLM (like cart builder?), wait, cart-builder-node.ts doesn't use it, grep didn't show it.
  if (c.includes('withStructuredOutput')) {
    c = c.replace(/import \{ getLLM \} from "\.\.\/\.\.\/providers\/openrouter";/, 'import { getStructuredLLM } from "../../providers/openrouter";');
    
    // Replace the getLLM(true) variant first
    c = c.replace(/const llm = getLLM\(true\);.*?const structuredLlm = llm\.withStructuredOutput\((.*?)\);/s, 'const structuredLlm = getStructuredLLM($1, true);');
    
    // Replace the getLLM() variant
    c = c.replace(/const llm = getLLM\(\);.*?const structuredLlm = llm\.withStructuredOutput\((.*?)\);/s, 'const structuredLlm = getStructuredLLM($1);');
    
    fs.writeFileSync(p, c);
    console.log(`Updated ${file}`);
  }
});
