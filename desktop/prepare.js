// Copies the dashboard into the app as a fallback for PCs that cannot reach github.io.
// The Supabase library is bundled too, in case the CDN is blocked as well.
const fs = require('fs'), path = require('path');
const out = path.join(__dirname, 'app');
fs.mkdirSync(out, { recursive: true });
const cdn = /<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@[^"]+\/dist\/umd\/supabase\.js"><\/script>/;
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
if (!cdn.test(html)) throw new Error('Supabase script tag not found in index.html');
fs.writeFileSync(path.join(out, 'index.html'), html.replace(cdn, '<script src="supabase.js"></script>'));
fs.copyFileSync(require.resolve('@supabase/supabase-js/dist/umd/supabase.js'), path.join(out, 'supabase.js'));
for (const f of ['manifest.webmanifest']) fs.copyFileSync(path.join(__dirname, '..', f), path.join(out, f));
fs.cpSync(path.join(__dirname, '..', 'icons'), path.join(out, 'icons'), { recursive: true });
console.log('Bundled dashboard into app/');
