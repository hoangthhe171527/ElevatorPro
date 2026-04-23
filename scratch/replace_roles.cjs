const fs = require('fs');
const path = require('path');

function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
      let content = fs.readFileSync(p, 'utf-8');
      
      let modified = content
        .replace(/"ceo"/g, '"tech_manager"')
        .replace(/"pm"/g, '"tech_manager"')
        .replace(/"intake_operator"/g, '"service_dispatcher"');
        
      if (content !== modified) {
        fs.writeFileSync(p, modified);
        console.log(`Updated ${p}`);
      }
    }
  });
}

walk('src');
