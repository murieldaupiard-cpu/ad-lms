export type AlphabetExample = {
  key: string;
  label: string;
  type: string;
  letters: string;
};

export type AlphabetLesson = {
  letter: string;
  lower: string;
  ipa: string;
  word: string;
  spoken: string;
  examples: AlphabetExample[];
};

function ex(key: string, label: string, type: string) {
  return { key, label, type, letters: label.toUpperCase().replace(/[^A-Z]/g, "") };
}

export const alphabetLessons: Record<string, AlphabetLesson> = {
  a: { letter: "A", lower: "a", ipa: "/ eɪ /", word: "apple", spoken: "ay", examples: [ex("a-amelia-anderson", "Amelia Anderson", "Name"), ex("a-administrative-assistant", "Administrative Assistant", "Job title"), ex("a-atlas-services", "Atlas Services", "Company"), ex("a-australia", "Australia", "Country"), ex("a-amsterdam", "Amsterdam", "City")] },
  b: { letter: "B", lower: "b", ipa: "/ biː /", word: "banana", spoken: "bee", examples: [ex("b-benjamin-brown", "Benjamin Brown", "Name"), ex("b-business-analyst", "Business Analyst", "Job title"), ex("b-bluebird-services", "Bluebird Services", "Company"), ex("b-belgium", "Belgium", "Country"), ex("b-berlin", "Berlin", "City")] },
  c: { letter: "C", lower: "c", ipa: "/ siː /", word: "cat", spoken: "see", examples: [ex("c-charlotte-clark", "Charlotte Clark", "Name"), ex("c-customer-advisor", "Customer Advisor", "Job title"), ex("c-coral-consulting", "Coral Consulting", "Company"), ex("c-canada", "Canada", "Country"), ex("c-copenhagen", "Copenhagen", "City")] },
  d: { letter: "D", lower: "d", ipa: "/ diː /", word: "dog", spoken: "dee", examples: [ex("d-daniel-davis", "Daniel Davis", "Name"), ex("d-data-analyst", "Data Analyst", "Job title"), ex("d-diamond-services", "Diamond Services", "Company"), ex("d-denmark", "Denmark", "Country"), ex("d-dublin", "Dublin", "City")] },
  e: { letter: "E", lower: "e", ipa: "/ iː /", word: "elephant", spoken: "ee", examples: [ex("e-emily-evans", "Emily Evans", "Name"), ex("e-events-coordinator", "Events Coordinator", "Job title"), ex("e-eclipse-solutions", "Eclipse Solutions", "Company"), ex("e-estonia", "Estonia", "Country"), ex("e-edinburgh", "Edinburgh", "City")] },
  f: { letter: "F", lower: "f", ipa: "/ ef /", word: "fish", spoken: "eff", examples: [ex("f-fiona-foster", "Fiona Foster", "Name"), ex("f-flight-attendant", "Flight Attendant", "Job title"), ex("f-falcon-services", "Falcon Services", "Company"), ex("f-finland", "Finland", "Country"), ex("f-florence", "Florence", "City")] },
  g: { letter: "G", lower: "g", ipa: "/ dʒiː /", word: "grape", spoken: "gee", examples: [ex("g-george-green", "George Green", "Name"), ex("g-guest-relations-agent", "Guest Relations Agent", "Job title"), ex("g-global-gateway", "Global Gateway", "Company"), ex("g-germany", "Germany", "Country"), ex("g-geneva", "Geneva", "City")] },
  h: { letter: "H", lower: "h", ipa: "/ eɪtʃ /", word: "hotel", spoken: "aitch", examples: [ex("h-hannah-harris", "Hannah Harris", "Name"), ex("h-human-resources-assistant", "Human Resources Assistant", "Job title"), ex("h-horizon-services", "Horizon Services", "Company"), ex("h-hungary", "Hungary", "Country"), ex("h-helsinki", "Helsinki", "City")] },
  i: { letter: "I", lower: "i", ipa: "/ aɪ /", word: "ice", spoken: "eye", examples: [ex("i-isabella-irving", "Isabella Irving", "Name"), ex("i-it-support-agent", "IT Support Agent", "Job title"), ex("i-island-solutions", "Island Solutions", "Company"), ex("i-iceland", "Iceland", "Country"), ex("i-istanbul", "Istanbul", "City")] },
  j: { letter: "J", lower: "j", ipa: "/ dʒeɪ /", word: "juice", spoken: "jay", examples: [ex("j-james-johnson", "James Johnson", "Name"), ex("j-junior-accountant", "Junior Accountant", "Job title"), ex("j-jade-services", "Jade Services", "Company"), ex("j-japan", "Japan", "Country"), ex("j-johannesburg", "Johannesburg", "City")] },
  k: { letter: "K", lower: "k", ipa: "/ keɪ /", word: "key", spoken: "kay", examples: [ex("k-karen-king", "Karen King", "Name"), ex("k-kitchen-manager", "Kitchen Manager", "Job title"), ex("k-kingston-services", "Kingston Services", "Company"), ex("k-kenya", "Kenya", "Country"), ex("k-kyoto", "Kyoto", "City")] },
  l: { letter: "L", lower: "l", ipa: "/ el /", word: "lemon", spoken: "el", examples: [ex("l-laura-lewis", "Laura Lewis", "Name"), ex("l-logistics-assistant", "Logistics Assistant", "Job title"), ex("l-lighthouse-services", "Lighthouse Services", "Company"), ex("l-luxembourg", "Luxembourg", "Country"), ex("l-london", "London", "City")] },
  m: { letter: "M", lower: "m", ipa: "/ em /", word: "mango", spoken: "em", examples: [ex("m-michael-morgan", "Michael Morgan", "Name"), ex("m-marketing-manager", "Marketing Manager", "Job title"), ex("m-metro-solutions", "Metro Solutions", "Company"), ex("m-mexico", "Mexico", "Country"), ex("m-madrid", "Madrid", "City")] },
  n: { letter: "N", lower: "n", ipa: "/ en /", word: "nose", spoken: "en", examples: [ex("n-natalie-nelson", "Natalie Nelson", "Name"), ex("n-night-auditor", "Night Auditor", "Job title"), ex("n-nova-services", "Nova Services", "Company"), ex("n-norway", "Norway", "Country"), ex("n-nairobi", "Nairobi", "City")] },
  o: { letter: "O", lower: "o", ipa: "/ əʊ /", word: "orange", spoken: "oh", examples: [ex("o-olivia-owens", "Olivia Owens", "Name"), ex("o-office-manager", "Office Manager", "Job title"), ex("o-oceanic-services", "Oceanic Services", "Company"), ex("o-oman", "Oman", "Country"), ex("o-oslo", "Oslo", "City")] },
  p: { letter: "P", lower: "p", ipa: "/ piː /", word: "pear", spoken: "pee", examples: [ex("p-peter-parker", "Peter Parker", "Name"), ex("p-project-coordinator", "Project Coordinator", "Job title"), ex("p-pacific-services", "Pacific Services", "Company"), ex("p-portugal", "Portugal", "Country"), ex("p-paris", "Paris", "City")] },
  q: { letter: "Q", lower: "q", ipa: "/ kjuː /", word: "queen", spoken: "cue", examples: [ex("q-quinn-quincy", "Quinn Quincy", "Name"), ex("q-quality-controller", "Quality Controller", "Job title"), ex("q-quantum-services", "Quantum Services", "Company"), ex("q-qatar", "Qatar", "Country"), ex("q-quebec-city", "Quebec City", "City")] },
  r: { letter: "R", lower: "r", ipa: "/ ɑː /", word: "radio", spoken: "ar", examples: [ex("r-rachel-roberts", "Rachel Roberts", "Name"), ex("r-reception-agent", "Reception Agent", "Job title"), ex("r-riviera-services", "Riviera Services", "Company"), ex("r-romania", "Romania", "Country"), ex("r-rome", "Rome", "City")] },
  s: { letter: "S", lower: "s", ipa: "/ es /", word: "sun", spoken: "ess", examples: [ex("s-sarah-smith", "Sarah Smith", "Name"), ex("s-sales-assistant", "Sales Assistant", "Job title"), ex("s-summit-services", "Summit Services", "Company"), ex("s-spain", "Spain", "Country"), ex("s-stockholm", "Stockholm", "City")] },
  t: { letter: "T", lower: "t", ipa: "/ tiː /", word: "taxi", spoken: "tee", examples: [ex("t-thomas-taylor", "Thomas Taylor", "Name"), ex("t-travel-advisor", "Travel Advisor", "Job title"), ex("t-titan-services", "Titan Services", "Company"), ex("t-thailand", "Thailand", "Country"), ex("t-tokyo", "Tokyo", "City")] },
  u: { letter: "U", lower: "u", ipa: "/ juː /", word: "umbrella", spoken: "you", examples: [ex("u-ursula-underwood", "Ursula Underwood", "Name"), ex("u-user-support-agent", "User Support Agent", "Job title"), ex("u-unity-services", "Unity Services", "Company"), ex("u-uruguay", "Uruguay", "Country"), ex("u-utrecht", "Utrecht", "City")] },
  v: { letter: "V", lower: "v", ipa: "/ viː /", word: "violin", spoken: "vee", examples: [ex("v-victoria-vaughan", "Victoria Vaughan", "Name"), ex("v-vehicle-coordinator", "Vehicle Coordinator", "Job title"), ex("v-vision-services", "Vision Services", "Company"), ex("v-vietnam", "Vietnam", "Country"), ex("v-venice", "Venice", "City")] },
  w: { letter: "W", lower: "w", ipa: "/ ˈdʌbəl juː /", word: "water", spoken: "double you", examples: [ex("w-william-walker", "William Walker", "Name"), ex("w-warehouse-assistant", "Warehouse Assistant", "Job title"), ex("w-western-services", "Western Services", "Company"), ex("w-wales", "Wales", "Country"), ex("w-warsaw", "Warsaw", "City")] },
  x: { letter: "X", lower: "x", ipa: "/ eks /", word: "x-ray", spoken: "ex", examples: [ex("x-xavier-xu", "Xavier Xu", "Name"), ex("x-x-ray-technician", "X-ray Technician", "Job title"), ex("x-xerox", "Xerox", "Company"), ex("x-xiamen-china", "Xiamen China", "Place"), ex("x-xi-an", "Xi An", "City")] },
  y: { letter: "Y", lower: "y", ipa: "/ waɪ /", word: "yellow", spoken: "why", examples: [ex("y-yasmin-young", "Yasmin Young", "Name"), ex("y-youth-worker", "Youth Worker", "Job title"), ex("y-yellowstone-services", "Yellowstone Services", "Company"), ex("y-yemen", "Yemen", "Country"), ex("y-yokohama", "Yokohama", "City")] },
  z: { letter: "Z", lower: "z", ipa: "/ zed /", word: "zebra", spoken: "zed", examples: [ex("z-zoe-zimmerman", "Zoe Zimmerman", "Name"), ex("z-zone-manager", "Zone Manager", "Job title"), ex("z-zenith-services", "Zenith Services", "Company"), ex("z-zimbabwe", "Zimbabwe", "Country"), ex("z-zurich", "Zurich", "City")] },
};

export const alphabetOrder = Object.keys(alphabetLessons);
