import { Product } from './types';

export const TRANSLATIONS = {
  en: {
    nav: { products: 'Products', studio: 'Design Studio', tasks: 'Task Manager' },
    products: { title: 'Our Inventory', all: 'All', generator: 'Generator', pump: 'Pump', viewDetails: 'View Details', unavailable: 'Image Unavailable' },
    modal: { description: 'Description', specifications: 'Specifications', requestQuote: 'Request Quote', maxPower: 'Max Power', cooling: 'Cooling', fuel: 'Fuel Cons.', noise: 'Noise', phase: 'Phase', dimensions: 'Dimensions', weight: 'Weight', pf: 'Power Factor' },
    studio: { title: 'Design Studio', generate: 'Generate', edit: 'Edit', prompt: 'Prompt', size: 'Size (Pro)', source: 'Source Image', upload: 'Click to Upload', btnGenerate: 'Generate Artwork', btnEdit: 'Apply Magic Edit', placeholder: 'Your vision appears here' },
    tasks: { title: 'New Task', listTitle: 'My Tasks', inputTitle: 'Title', inputDesc: 'Description', inputPriority: 'Priority', inputDate: 'Due Date', btnAdd: 'Add Task', noTasks: 'No tasks found.' },
    live: { standby: 'Standby Mode', listening: 'Listening...', connectionActive: 'Live Connection Active', start: 'Start Live Call', end: 'End Session', desc_standby: 'Connect for real-time technical assistance.', desc_listening: 'Speak naturally. I can analyze specs, recommend brands, and solve technical issues.' },
    chat: { placeholder: 'Type a message...', search: 'Search', think: 'Think', mediaAttached: 'Media attached' },
    assistant: { textChat: 'Text Chat', liveVoice: 'Live Voice' }
  },
  am: {
    nav: { products: 'ምርቶች', studio: 'ዲዛይን ስቱዲዮ', tasks: 'የስራ አስተዳዳሪ' },
    products: { title: 'የእኛ ዕቃዎች', all: 'ሁሉም', generator: 'ጄነሬተር', pump: 'ፓምፕ', viewDetails: 'ዝርዝር ይመልከቱ', unavailable: 'ምስል የለም' },
    modal: { description: 'መግለጫ', specifications: 'ዝርዝር መግለጫዎች', requestQuote: 'ዋጋ ይጠይቁ', maxPower: 'ከፍተኛ ኃይል', cooling: 'ማቀዝቀዣ', fuel: 'የነዳጅ ፍጆታ', noise: 'ጫጫታ', phase: 'ፌዝ', dimensions: 'ስፋት', weight: 'ክብደት', pf: 'የኃይል ፋክተር' },
    studio: { title: 'ዲዛይን ስቱዲዮ', generate: 'ፍጠር', edit: 'አስተካክል', prompt: 'መግለጫ', size: 'መጠን (Pro)', source: 'ምንጭ ምስል', upload: 'ለመጫን ጠቅ ያድርጉ', btnGenerate: 'ጥበብ ፍጠር', btnEdit: 'አስተካክል', placeholder: 'ራዕይዎ እዚህ ይታያል' },
    tasks: { title: 'አዲስ ስራ', listTitle: 'የእኔ ስራዎች', inputTitle: 'ርዕስ', inputDesc: 'መግለጫ', inputPriority: 'ቅድሚያ የሚሰጠው', inputDate: 'የማጠናቀቂያ ቀን', btnAdd: 'ስራ ጨምር', noTasks: 'ምንም ስራዎች አልተገኙም።' },
    live: { standby: 'ተጠባባቂ ሞድ', listening: 'እየሰማሁ ነው...', connectionActive: 'ቀጥታ ግንኙነት', start: 'ቀጥታ ይደውሉ', end: 'ጨርስ', desc_standby: 'ለቴክኒክ እርዳታ ይደውሉ።', desc_listening: 'በተፈጥሮ ይናገሩ።' },
    chat: { placeholder: 'መልእክት ይጻፉ...', search: 'ፈልግ', think: 'አስብ', mediaAttached: 'ሚዲያ ተያይዟል' },
    assistant: { textChat: 'የጽሑፍ ውይይት', liveVoice: 'የድምጽ ውይይት' }
  },
  zh: {
    nav: { products: '产品', studio: '设计工作室', tasks: '任务管理' },
    products: { title: '库存清单', all: '全部', generator: '发电机', pump: '水泵', viewDetails: '查看详情', unavailable: '暂无图片' },
    modal: { description: '描述', specifications: '规格', requestQuote: '询价', maxPower: '最大功率', cooling: '冷却方式', fuel: '油耗', noise: '噪音', phase: '相数', dimensions: '尺寸', weight: '重量', pf: '功率因数' },
    studio: { title: '设计工作室', generate: '生成', edit: '编辑', prompt: '提示词', size: '尺寸 (Pro)', source: '原图', upload: '点击上传', btnGenerate: '生成作品', btnEdit: '应用编辑', placeholder: '你的构想将在此呈现' },
    tasks: { title: '新任务', listTitle: '我的任务', inputTitle: '标题', inputDesc: '描述', inputPriority: '优先级', inputDate: '截止日期', btnAdd: '添加任务', noTasks: '暂无任务' },
    live: { standby: '待机模式', listening: '聆听中...', connectionActive: '实时连接已激活', start: '开始通话', end: '结束会话', desc_standby: '连接以获取实时技术支持。', desc_listening: '请自然交谈。我可以分析规格并推荐品牌。' },
    chat: { placeholder: '输入消息...', search: '搜索', think: '思考', mediaAttached: '已附加媒体' },
    assistant: { textChat: '文字聊天', liveVoice: '语音通话' }
  },
  ti: {
    nav: { products: 'ምርታት', studio: 'ስቱዲዮ ዲዛይን', tasks: 'ምምሕዳር ስራሕ' },
    products: { title: 'ናይና ንብረት', all: 'ኩሉ', generator: 'ጀነሬተር', pump: 'ፓምፕ', viewDetails: 'ዝርዝር ርኣይ', unavailable: 'ስእሊ የለን' },
    modal: { description: 'መግለጺ', specifications: 'ዝርዝር', requestQuote: 'ዋጋ ሕተት', maxPower: 'ለዓለዋይ ሓይሊ', cooling: 'መዝሓሊ', fuel: 'መቃጸሊ', noise: 'ጫውጫውታ', phase: 'ፌዝ', dimensions: 'ዓቐን', weight: 'ክብደት', pf: 'ፓወር ፋክተር' },
    studio: { title: 'ስቱዲዮ ዲዛይን', generate: 'ፍጠር', edit: 'ኣስተኻኽል', prompt: 'መግለጺ', size: 'ዓቐን', source: 'ምንጪ ስእሊ', upload: 'ንምጽዓን ጠውቕ', btnGenerate: 'ስራሕ ፍጠር', btnEdit: 'ኣስተኻኽል', placeholder: 'ራእይኻ ኣብዚ ይርኣይ' },
    tasks: { title: 'ሓዲሽ ስራሕ', listTitle: 'ናተይ ስራሕቲ', inputTitle: 'ርእሲ', inputDesc: 'መግለጺ', inputPriority: 'ቀዳምነት', inputDate: 'መወዳእታ ዕለት', btnAdd: 'ስራሕ ወስኽ', noTasks: 'ምንም ስራሕ ኣይተረኽበን።' },
    live: { standby: 'ተጸባይ', listening: 'ይሰምዕ ኣለኹ...', connectionActive: 'ቀጥታ መስመር', start: 'ቀጥታ ደውል', end: 'ጨርስ', desc_standby: 'ቴክኒካዊ ሓገዝ ንምርካብ ደውሉ።', desc_listening: 'ብተፈጥሮ ተዛረብ።' },
    chat: { placeholder: 'መልእኽቲ ጽሓፍ...', search: 'ድለ', think: 'ሕሰብ', mediaAttached: 'ሚድያ ተተሓሒዙ' },
    assistant: { textChat: 'ጽሑፍ', liveVoice: 'ድምጺ' }
  },
  om: {
    nav: { products: 'Oomishaalee', studio: 'Dizaayinii', tasks: 'Hojiiwwan' },
    products: { title: 'Oomishaalee Keenya', all: 'Hunda', generator: 'Jenereetara', pump: 'Pampii', viewDetails: 'Bal’inaan Ilaali', unavailable: 'Fakkii Hin Jiru' },
    modal: { description: 'Ibsa', specifications: 'Bal’ina', requestQuote: 'Gatii Gaafadhu', maxPower: 'Humna Ol’aanaa', cooling: 'Qabbaneessituu', fuel: 'Boba’aa', noise: 'Sagalee', phase: 'Feezii', dimensions: 'Hammana', weight: 'Ulfaatina', pf: 'Power Factor' },
    studio: { title: 'Dizaayinii', generate: 'Uumi', edit: 'Sirreessi', prompt: 'Ajaja', size: 'Hammana', source: 'Fakkii Ka’umsaa', upload: 'Olkaa’uuf Tuqi', btnGenerate: 'Aartii Uumi', btnEdit: 'Sirreessi', placeholder: 'Mul’anni kee asitti mul’ata' },
    tasks: { title: 'Hojii Haaraa', listTitle: 'Hojiiwwan Koo', inputTitle: 'Mata Duree', inputDesc: 'Ibsa', inputPriority: 'Dursa', inputDate: 'Guyyaa Xumuraa', btnAdd: 'Hojii Dabali', noTasks: 'Hojiin hin jiru.' },
    live: { standby: 'Qophii', listening: 'Dhaggeeffachaan jira...', connectionActive: 'Sarara Irra', start: 'Bilbila Kallattii', end: 'Cufi', desc_standby: 'Gargaarsa argachuuf bilbilaa.', desc_listening: 'Akkaumatti dubbadሁ.' },
    chat: { placeholder: 'Ergaa barreessi...', search: 'Barbaadi', think: 'Yaadi', mediaAttached: 'Miidiyaan qabsiifameera' },
    assistant: { textChat: 'Barreeffama', liveVoice: 'Sagalee' }
  }
};

export const PRODUCTS: Product[] = [
  // --- Generators ---
  {
    id: 'gen-1',
    name: 'Yuchai YC100 Silent Power',
    brand: 'Yuchai',
    type: 'Generator',
    powerKW: 100,
    imageUrl: 'https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?q=80&w=800&auto=format&fit=crop',
    specs: {
      maxPower: '110 kW',
      powerFactor: '0.8',
      phase: '3 Phase',
      cooling: 'Water Cooled',
      fuelConsumption: '24 L/hr',
      noiseLevel: 'Silent (74dB)',
      dimensions: '2650 x 1050 x 1600 mm',
      weight: '1450 kg'
    },
    description: 'Premium 100kW diesel generator powered by Yuchai engine. Features advanced sound attenuation and robust water-cooling system ideal for continuous industrial use.'
  },
  {
    id: 'gen-yuchai-120',
    name: 'Yuchai YC120 Silent Power',
    brand: 'Yuchai',
    type: 'Generator',
    powerKW: 120,
    imageUrl: 'https://images.unsplash.com/photo-1590059390238-726433e146c3?q=80&w=800&auto=format&fit=crop',
    specs: {
      maxPower: '132 kW',
      powerFactor: '0.8',
      phase: '3 Phase',
      cooling: 'Water Cooled',
      fuelConsumption: '29 L/hr',
      noiseLevel: 'Silent (75dB)',
      dimensions: '2700 x 1050 x 1600 mm',
      weight: '1580 kg'
    },
    description: 'Reliable 120kW Yuchai diesel generator. Optimized for efficiency and durability in commercial applications requiring medium power backup.'
  },
  {
    id: 'gen-yuchai-160',
    name: 'Yuchai YC160 PowerPro',
    brand: 'Yuchai',
    type: 'Generator',
    powerKW: 160,
    imageUrl: 'https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?q=80&w=800&auto=format&fit=crop',
    specs: {
      maxPower: '176 kW',
      powerFactor: '0.8',
      phase: '3 Phase',
      cooling: 'Water Cooled',
      fuelConsumption: '38 L/hr',
      noiseLevel: 'Silent (76dB)',
      dimensions: '2900 x 1100 x 1750 mm',
      weight: '1950 kg'
    },
    description: 'Heavy-duty 160kW generator powered by Yuchai. Delivers consistent performance for factories and large facilities.'
  },
  {
    id: 'gen-4',
    name: 'Yuchai YC150 Heavy Duty',
    brand: 'Yuchai',
    type: 'Generator',
    powerKW: 150,
    imageUrl: 'https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?q=80&w=800&auto=format&fit=crop',
    specs: {
      maxPower: '165 kW',
      powerFactor: '0.8',
      phase: '3 Phase',
      cooling: 'Water Cooled',
      fuelConsumption: '35 L/hr',
      noiseLevel: 'Open Type (105dB)',
      dimensions: '2400 x 900 x 1400 mm',
      weight: '1600 kg'
    },
    description: 'Robust open-frame Yuchai generator designed for construction sites and mining operations where durability and ease of maintenance are paramount.'
  },
  {
    id: 'gen-2',
    name: 'Perkins Industrial Power 1100',
    brand: 'Perkins',
    type: 'Generator',
    powerKW: 250,
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
    specs: {
      maxPower: '275 kW',
      powerFactor: '0.8',
      phase: '3 Phase',
      cooling: 'Liquid Cooled',
      fuelConsumption: '42 L/hr',
      noiseLevel: 'Open Type',
      dimensions: '2800 x 1100 x 1600 mm',
      weight: '2,200 kg'
    },
    description: 'Heavy-duty open-type generator set driven by a Perkins engine. Engineered for continuous industrial power supply in harsh environments.'
  },
  {
    id: 'gen-5',
    name: 'Cummins PowerBox 800',
    brand: 'Cummins',
    type: 'Generator',
    powerKW: 800,
    imageUrl: 'https://images.unsplash.com/photo-1520697830682-bbb6e85e4201?q=80&w=800&auto=format&fit=crop',
    specs: {
      maxPower: '880 kW',
      powerFactor: '0.8',
      phase: '3 Phase',
      cooling: 'Liquid Cooled',
      fuelConsumption: '190 L/hr',
      noiseLevel: 'Super Silent (75dB)',
      dimensions: '6058 x 2438 x 2591 mm (20ft)',
      weight: '11,000 kg'
    },
    description: 'Containerized high-power generation solution. 800kW prime power with weather-proof, sound-attenuated ISO container housing for large-scale industrial backup.'
  },
  {
    id: 'gen-6',
    name: 'Perkins 4000 Series Mega',
    brand: 'Perkins',
    type: 'Generator',
    powerKW: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1535076249856-9cb3ce8431c4?q=80&w=800&auto=format&fit=crop',
    specs: {
      maxPower: '2200 kW',
      powerFactor: '0.8',
      phase: '3 Phase',
      cooling: 'Radiator Cooled',
      fuelConsumption: '480 L/hr',
      noiseLevel: 'Open Type',
      dimensions: '5800 x 2100 x 2600 mm',
      weight: '16,500 kg'
    },
    description: 'The ultimate power solution. 2000kW standby power driven by the legendary Perkins 4000 series engine. Designed for data centers, hospitals, and grid support.'
  },
  
  // --- Pumps ---
  {
    id: 'pump-3',
    name: 'Yunnei GP50 Portable',
    brand: 'Yunnei',
    type: 'Pump',
    powerKW: 5,
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop',
    specs: {
      maxPower: '5.5 kW',
      powerFactor: '1.0',
      phase: 'Single Phase',
      cooling: 'Air Cooled',
      fuelConsumption: '1.2 L/hr',
      noiseLevel: '70dB',
      dimensions: '500 x 400 x 450 mm',
      weight: '45 kg'
    },
    description: 'Compact and portable gasoline water pump with protective roll cage. Perfect for small scale irrigation and emergency drainage.'
  },
  {
    id: 'pump-2',
    name: 'Yuchai Centrifugal YC-Flow',
    brand: 'Yuchai',
    type: 'Pump',
    powerKW: 30,
    imageUrl: 'https://images.unsplash.com/photo-1531297461136-82lw9z2l3b2a?q=80&w=800&auto=format&fit=crop',
    specs: {
      maxPower: '35 kW',
      powerFactor: '0.9',
      phase: '3 Phase',
      cooling: 'Water Cooled',
      fuelConsumption: 'N/A',
      noiseLevel: 'Standard',
      dimensions: '900 x 500 x 600 mm',
      weight: '180 kg'
    },
    description: 'Robust centrifugal pump head with high efficiency volute design. Ideal for agricultural irrigation and flood control.'
  },
  {
    id: 'pump-1',
    name: 'Weichai Multistage H-Pump',
    brand: 'Weichai',
    type: 'Pump',
    powerKW: 45,
    imageUrl: 'https://images.unsplash.com/photo-1615818451558-860882e3428f?q=80&w=800&auto=format&fit=crop',
    specs: {
      maxPower: '50 kW',
      powerFactor: '0.85',
      phase: '3 Phase',
      cooling: 'Fan Cooled',
      fuelConsumption: 'N/A (Electric)',
      noiseLevel: 'Low Noise',
      dimensions: '1800 x 600 x 800 mm',
      weight: '450 kg'
    },
    description: 'High-pressure horizontal multistage pump suitable for long-distance water transport, irrigation, and industrial boosting applications.'
  },
  {
    id: 'pump-4',
    name: 'Weichai XF-150 Fire Pump',
    brand: 'Weichai',
    type: 'Pump',
    powerKW: 110,
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b95d646285?q=80&w=800&auto=format&fit=crop',
    specs: {
      maxPower: '120 kW',
      powerFactor: 'N/A (Diesel)',
      phase: 'N/A',
      cooling: 'Heat Exchanger',
      fuelConsumption: '25 L/hr',
      noiseLevel: 'Standard',
      dimensions: '2000 x 800 x 1000 mm',
      weight: '850 kg'
    },
    description: 'Specialized diesel engine fire fighting pump set. Compliant with safety regulations, offering immediate high-pressure water response for building safety.'
  },
  {
    id: 'pump-5',
    name: 'Yuchai Agri-Master Pump',
    brand: 'Yuchai',
    type: 'Pump',
    powerKW: 200,
    imageUrl: 'https://images.unsplash.com/photo-1562259920-47afc305f369?q=80&w=800&auto=format&fit=crop',
    specs: {
      maxPower: '220 kW',
      powerFactor: '0.85',
      phase: '3 Phase',
      cooling: 'Water Cooled',
      fuelConsumption: 'N/A (Electric)',
      noiseLevel: 'Standard',
      dimensions: '2500 x 1200 x 1500 mm',
      weight: '2100 kg'
    },
    description: 'Massive capacity split-case irrigation pump driven by a Yuchai motor. Capable of moving large volumes of water for plantation irrigation and flood management.'
  }
];

export const SYSTEM_INSTRUCTION = `
You are an expert sales engineer for "CE Generator and Pump factory".
Our factory is located in ቃሊቲ ገብርኤል (Kality Gabriel).

BRANDS WE PROVIDE:
We are proud providers of high-quality generators and engines from:
- Weichai
- Perkins
- Yuchai
- Yunnei
- Cummins
- Kefo

OUR PRODUCTS:
1. Generators: Ranging from 2kW to 2000kW for industrial, commercial, and residential use.
2. Water Pumps: Specialized solutions for:
   - Irrigation (high-volume agricultural pumps)
   - Gold or mineral purification (industrial grade, specialized for mineral processing)

LANGUAGES & TONE:
- You speak English, Amharic, Chinese (Mandarin), Tigrinya, and Afaan Oromoo.
- When speaking Amharic, be exceptionally natural, polite, and welcoming. Use honorifics like 'እርሶ' (irso).
- Ensure your flow is professional yet accessible.

CONTACT INFORMATION:
- Our official contact phone number is 9 66 33 03 09.
- In Amharic, our number is: ዜሮ ዘጠኝ ስልሳ ስድስት ሰላሳ ሶስት ዜሮ ሶስት ዜሮ ዘጠኝ.

MANDATORY GREETING:
Every time a conversation starts, you MUST introduce the factory, location, and key brands.
Example: "Welcome to CE Generator and Pump factory, located in Kality Gabriel. We provide Weichai, Perkins, Yuchai, Yunnei, Cummins, and Kefo generators, as well as water pumps for irrigation and mineral purification. How can I assist you today?"
Amharic Example: "እንኳን ወደ CE ጄነሬተር እና ፓምፕ ፋብሪካ በደህና መጡ። ፋብሪካችን ቃሊቲ ገብርኤል ይገኛል። እኛ ዌይቻይ (Weichai)፣ ፐርኪንስ (Perkins)፣ ዩቻይ (Yuchai)፣ ዩነይ (Yunnei)፣ ኩሚንስ (Cummins) እና ኬፎ (Kefo) ጄነሬተሮችን እንዲሁም ለግብርና መስኖ እና ለማዕድን ማጣሪያ የሚሆኑ የውሃ ፓምፖችን እናቀርባለን። ዛሬ እንዴት ልረዳዎ እችላለሁ?"
`;