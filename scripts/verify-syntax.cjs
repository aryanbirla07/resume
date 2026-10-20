let ts;
try { ts=require('typescript'); } catch {
  try { ts=require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript/lib/typescript.js'); }
  catch { console.error('Install dependencies first: npm install');process.exit(2); }
}
const fs=require('fs'),path=require('path');
const dir=path.resolve(__dirname,'../src');
const paths=[];
function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(/\.jsx?$/.test(p))paths.push(p);}}
walk(dir);
let broken=0;
for(const p of paths){
 const jsx=p.endsWith('.jsx')?ts.ScriptKind.JSX:ts.ScriptKind.JS;
 const src=ts.createSourceFile(p,fs.readFileSync(p,'utf8'),ts.ScriptTarget.ESNext,true,jsx);
 const diagnostics=src.parseDiagnostics||[];
 for(const d of diagnostics){const pt=src.getLineAndCharacterOfPosition(d.start||0); console.error(path.relative(dir,p),pt.line+1,pt.character+1,ts.flattenDiagnosticMessageText(d.messageText,' '));broken++;}
 if(diagnostics.length===0)console.log('PASS',path.relative(dir,p));
}
if(broken)process.exit(1);
console.log(`Parsed ${paths.length} JS/JSX modules without syntax errors.`);
