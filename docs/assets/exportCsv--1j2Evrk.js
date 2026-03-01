function b(n,t){if(!n||!n.length)return;const s=Object.keys(n[0]),l=[s.join(","),...n.map(i=>s.map(d=>{const o=i[d];if(o==null)return"";const e=String(o);return e.includes(",")||e.includes('"')||e.includes(`
`)?`"${e.replace(/"/g,'""')}"`:e}).join(","))].join(`
`),u=new Blob([l],{type:"text/csv;charset=utf-8;"}),r=URL.createObjectURL(u),c=document.createElement("a");c.href=r,c.download=t.endsWith(".csv")?t:t+".csv",c.click(),URL.revokeObjectURL(r)}export{b as e};
