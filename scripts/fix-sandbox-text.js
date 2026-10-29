const fs = require('fs');
const path = 'src/components/QaSandbox.tsx';
let content = fs.readFileSync(path, 'utf8');
// Replace the Kishore third-person reference with first person
content = content.replace(/Kishore&apos;s real-world testing/g, 'my testing');
fs.writeFileSync(path, content, 'utf8');
console.log('Done');
