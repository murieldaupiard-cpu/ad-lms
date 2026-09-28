export type NumberTrace={buildCorrect:number;buildAttempts:number;speakCorrect:number;speakAttempts:number;validationCorrect:number;validationAttempts:number;weak:number[];completed:string[]};
const empty:NumberTrace={buildCorrect:0,buildAttempts:0,speakCorrect:0,speakAttempts:0,validationCorrect:0,validationAttempts:0,weak:[],completed:[]};
export function readTrace():NumberTrace{if(typeof window==="undefined")return empty;try{return {...empty,...JSON.parse(localStorage.getItem("cadga-numbers-trace")||"{}")}}catch{return empty}}
export function saveTrace(next:Partial<NumberTrace>){const current=readTrace(),value={...current,...next};localStorage.setItem("cadga-numbers-trace",JSON.stringify(value));window.dispatchEvent(new Event("numbers-progress"));return value}
export function markComplete(step:string){const t=readTrace();saveTrace({completed:Array.from(new Set([...t.completed,step]))})}
