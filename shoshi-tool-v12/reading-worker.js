importScripts('https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/build/kuromoji.js');
let tokenizer=null,building=null;
function kataToHira(s){return String(s||'').replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));}
function getTokenizer(){if(tokenizer)return Promise.resolve(tokenizer);if(building)return building;building=new Promise((resolve,reject)=>{kuromoji.builder({dicPath:'https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/'}).build((err,t)=>{if(err)return reject(err);tokenizer=t;resolve(t);});});return building;}
async function reading(text){if(!String(text||'').trim())return'';const t=await getTokenizer();return t.tokenize(text).map(x=>x.reading?kataToHira(x.reading):x.surface_form).join('');}
self.onmessage=async e=>{const {id,title,author}=e.data||{};try{const [titleReading,authorReading]=await Promise.all([reading(title),reading(author)]);self.postMessage({id,titleReading,authorReading});}catch(err){self.postMessage({id,error:String(err&&err.message||err)});}};