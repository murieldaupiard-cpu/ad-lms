export type SymbolItem={char:string;name:string;aliases:string[];spoken?:string};
export const symbols:SymbolItem[]=[
{char:"@",name:"at",aliases:["at","at sign"]},{char:".",name:"dot",aliases:["dot","full stop","period"]},{char:"_",name:"underscore",aliases:["underscore"]},{char:"-",name:"dash",aliases:["dash","hyphen"]},{char:"/",name:"slash",aliases:["slash","forward slash"]},{char:"#",name:"hash",aliases:["hash","number sign"]},{char:"%",name:"percent",aliases:["percent","percent sign"]},{char:"+",name:"plus",aliases:["plus","plus sign"]},{char:"=",name:"equals",aliases:["equals","equal sign"]},{char:"?",name:"question mark",aliases:["question mark"]},{char:"!",name:"exclamation mark",aliases:["exclamation mark","exclamation point"]},{char:":",name:"colon",aliases:["colon"]},{char:"()",name:"brackets",aliases:["brackets","round brackets","parentheses"]},{char:"'",name:"apostrophe",aliases:["apostrophe","single quote"]},{char:'""',name:"quote unquote",spoken:"quote, unquote",aliases:["quote unquote","quote on quote","quote and quote","quote and unquote","open quote close quote","quotation marks","double quotes"]},{char:",",name:"comma",aliases:["comma"]}];
export const confusingGroups=[["-","_"],[".",","],[":","?"]];
export const symbolByChar=(char:string)=>symbols.find(s=>s.char===char||("()".includes(char)&&s.char==="()")||('""'.includes(char)&&s.char==='""'))!;
export const professionalSequences=[
{spoken:["contact","at","cadga","dot","com"],answer:"contact@cadga.com",label:"Email address"},
{spoken:["www","dot","cadga","dot","com","slash","docs","slash","123"],answer:"www.cadga.com/docs/123",label:"Web address"},
{spoken:["CADGA","dash","974","dash","A12"],answer:"CADGA-974-A12",label:"Booking reference"},
{spoken:["support","underscore","cadga","at","mail","dot","com"],answer:"support_cadga@mail.com",label:"Support email"}
];
export const emailChallengeSequences=[
{spoken:["contact","at","cadga","dot","com"],answer:"contact@cadga.com",label:"Email address 1"},
{spoken:["booking","at","cadga","dot","F","R"],answer:"booking@cadga.fr",label:"Email address 2"},
{spoken:["customer","dot","service","at","cadga","dot","com"],answer:"customer.service@cadga.com",label:"Email address 3"},
{spoken:["support","underscore","cadga","at","mail","dot","com"],answer:"support_cadga@mail.com",label:"Email address 4"},
{spoken:["training","dash","team","at","cadga","dot","com"],answer:"training-team@cadga.com",label:"Email address 5"}
];
