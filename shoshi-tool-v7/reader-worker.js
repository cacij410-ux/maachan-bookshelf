let tokenizer=null;let loading=null;
function kataToHira(s){return String(s||'').replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));}
async function getTokenizer(){
  if(tokenizer) return tokenizer;
  if(loading) return loading;
  loading=new Promise((resolve,reject)=>{
    try{
      importScripts('https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/build/kuromoji.js');
      kuromoji.builder({dicPath:'https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/'}).build((err,t)=>{
        if(err) reject(err); else {tokenizer=t; resolve(t);}
      });
    }catch(e){reject(e)}
  });
  return loading;
}
async function reading(text){
  if(!String(text||'').trim()) return '';
  const t=await getTokenizer();
  return t.tokenize(text).map(x=>x.reading?kataToHira(x.reading):x.surface_form).join('');
}
self.onmessage=async e=>{
  const {id,title,author}=e.data||{};
  try{
    const [titleReading,authorReading]=await Promise.all([reading(title),reading(author)]);
    self.postMessage({id,titleReading,authorReading,ok:true});
  }catch(err){
    self.postMessage({id,titleReading:'',authorReading:'',ok:false,error:String(err&&err.message||err)});
  }
};