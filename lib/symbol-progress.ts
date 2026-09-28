export type SymbolTrace={identifyCorrect:number;identifyAttempts:number;typeCorrect:number;typeAttempts:number;speakCorrect:number;speakAttempts:number;weak:string[];completed:string[]};
const blank:SymbolTrace={identifyCorrect:0,identifyAttempts:0,typeCorrect:0,typeAttempts:0,speakCorrect:0,speakAttempts:0,weak:[],completed:[]};
export function readSymbolTrace():SymbolTrace{if(typeof window==="undefined")return blank;try{return {...blank,...JSON.parse(localStorage.getItem("cadga-symbol-trace")||"{}")}}catch{return blank}}
export function saveSymbolTrace(patch:Partial<SymbolTrace>){const value={...readSymbolTrace(),...patch};localStorage.setItem("cadga-symbol-trace",JSON.stringify(value));window.dispatchEvent(new Event("symbol-progress"));return value}
export function completeSymbolStep(step:string){const t=readSymbolTrace();saveSymbolTrace({completed:Array.from(new Set([...t.completed,step]))})}
