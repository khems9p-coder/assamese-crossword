// Puzzle content. Every word is [doodle key, Assamese answer, English answer,
// Assamese hint word, English hint word]. A clue square shows the hint word,
// or sometimes the doodle instead.
// The grid is built automatically from the whole list (buildLevel in app.js).
// Assamese answers fill one syllable per square; English answers one letter per square.

window.THEMES = [
  { id: "animals", as: "পশু", en: "Animals", words: [
    ["elephant", "হাতী", "ELEPHANT", "শুঁৰ", "TRUNK"], ["rhino", "গঁড়", "RHINO", "এশিঙীয়া", "ONE HORN"], ["tiger", "বাঘ", "TIGER", "ডোৰাকটা", "STRIPES"],
    ["cat", "মেকুৰী", "CAT", "মিঁয়াও", "MEOW"], ["dog", "কুকুৰ", "DOG", "ভুকে", "BARKS"], ["cow", "গৰু", "COW", "হাম্বা", "MOO"],
    ["monkey", "বান্দৰ", "MONKEY", "গছে গছে", "SWINGS"], ["fish", "মাছ", "FISH", "সাঁতোৰে", "SWIMS"], ["rabbit", "শহাপহু", "RABBIT", "দীঘল কাণ", "LONG EARS"],
    ["snake", "সাপ", "SNAKE", "নাগ", "HISS"]
  ]},
  { id: "birds", as: "চৰাই আৰু পোক", en: "Birds & bugs", words: [
    ["duck", "হাঁহ", "DUCK", "জলচৰ", "QUACK"], ["rooster", "কুকুৰা", "ROOSTER", "পুৱাৰ ডাক", "DAWN CALL"], ["owl", "ফেঁচা", "OWL", "নিশাচৰ", "NIGHT BIRD"],
    ["parrot", "ভাটৌ", "PARROT", "কথা কয়", "TALKS"], ["crow", "কাউৰী", "CROW", "কা কা", "CAW"], ["pigeon", "কপৌ", "PIGEON", "শান্তিৰ চিন", "PEACE BIRD"],
    ["butterfly", "পখিলা", "BUTTERFLY", "ৰঙীন পাখি", "WINGS"], ["bee", "মৌমাখি", "BEE", "মৌ", "HONEY MAKER"], ["ant", "পৰুৱা", "ANT", "সৰু পোক", "TINY WORKER"]
  ]},
  { id: "food", as: "খাদ্য", en: "Food", words: [
    ["rice", "ভাত", "RICE", "চাউল", "GRAIN"], ["tea", "চাহ", "TEA", "গৰম পানীয়", "HOT DRINK"], ["mango", "আম", "MANGO", "ফলৰ ৰজা", "KING OF FRUITS"],
    ["banana", "কল", "BANANA", "দীঘল ফল", "YELLOW FRUIT"], ["egg", "কণী", "EGG", "কুকুৰাই পাৰে", "HEN LAYS"], ["milk", "গাখীৰ", "MILK", "বগা পানীয়", "WHITE DRINK"],
    ["honey", "মৌ", "HONEY", "মিঠা", "SWEET"], ["coconut", "নাৰিকল", "COCONUT", "কঠিন খোলা", "HARD SHELL"], ["chilli", "জলকীয়া", "CHILLI", "জ্বলা", "HOT"],
    ["pineapple", "আনাৰস", "PINEAPPLE", "কাঁইটীয়া ফল", "SPIKY FRUIT"]
  ]},
  { id: "body", as: "শৰীৰ", en: "The body", words: [
    ["eye", "চকু", "EYE", "দৃষ্টি", "SEE"], ["ear", "কাণ", "EAR", "শুনা", "HEAR"], ["nose", "নাক", "NOSE", "গোন্ধ", "SMELL"],
    ["tooth", "দাঁত", "TOOTH", "চোবোৱা", "BITE"], ["hand", "হাত", "HAND", "পাঁচ আঙুলি", "FIVE FINGERS"], ["foot", "ভৰি", "FOOT", "খোজ", "WALK"],
    ["hair", "চুলি", "HAIR", "মূৰত গজে", "ON HEAD"], ["lips", "ওঁঠ", "LIPS", "মুখ", "MOUTH"], ["bone", "হাড়", "BONE", "কংকাল", "SKELETON"]
  ]},
  { id: "nature", as: "প্ৰকৃতি", en: "Nature", words: [
    ["sun", "সূৰ্য", "SUN", "দিনৰ পোহৰ", "DAYLIGHT"], ["moon", "জোন", "MOON", "ৰাতিৰ পোহৰ", "NIGHT LIGHT"], ["star", "তৰা", "STAR", "জিলিকে", "TWINKLE"],
    ["cloud", "ডাৱৰ", "CLOUD", "বৰষুণ আনে", "BRINGS RAIN"], ["rain", "বৰষুণ", "RAIN", "বাৰিষা", "MONSOON"], ["tree", "গছ", "TREE", "ছাঁ", "SHADE"],
    ["flower", "ফুল", "FLOWER", "পাহি", "PETALS"], ["mountain", "পাহাৰ", "MOUNTAIN", "শিখৰ", "PEAK"], ["river", "নদী", "RIVER", "ব্ৰহ্মপুত্ৰ", "FLOWS"],
    ["rainbow", "ৰামধেনু", "RAINBOW", "সাত ৰং", "SEVEN COLOURS"], ["leaf", "পাত", "LEAF", "সেউজ", "FOLIAGE"]
  ]},
  { id: "home", as: "ঘৰ", en: "Home", words: [
    ["house", "ঘৰ", "HOUSE", "বাসস্থান", "HOME"], ["door", "দুৱাৰ", "DOOR", "প্ৰৱেশ", "ENTRY"], ["window", "খিড়িকী", "WINDOW", "বতাহ-পোহৰ", "AIR & LIGHT"],
    ["chair", "চকী", "CHAIR", "আসন", "SEAT"], ["bed", "বিচনা", "BED", "শুবলৈ", "SLEEP"], ["clock", "ঘড়ী", "CLOCK", "সময়", "TIME"],
    ["key", "চাবি", "KEY", "তলা খোলে", "OPENS LOCK"], ["umbrella", "ছাতি", "UMBRELLA", "বৰষুণত লাগে", "RAIN COVER"], ["mirror", "আইনা", "MIRROR", "প্ৰতিবিম্ব", "REFLECTION"],
    ["lamp", "চাকি", "LAMP", "বন্তি", "DIYA"]
  ]},
  { id: "school", as: "বিদ্যালয়", en: "School", words: [
    ["book", "কিতাপ", "BOOK", "পঢ়া", "READ"], ["pen", "কলম", "PEN", "চিয়াঁহী", "INK"], ["pencil", "পেঞ্চিল", "PENCIL", "লিখা-মচা", "WRITE & ERASE"],
    ["notebook", "বহী", "NOTEBOOK", "খাতা", "COPY"], ["letter", "চিঠি", "LETTER", "ডাক", "POST"], ["bell", "ঘণ্টা", "BELL", "টিং টিং", "RING"],
    ["scissors", "কেঁচি", "SCISSORS", "কাটে", "CUT"], ["computer", "কম্পিউটাৰ", "COMPUTER", "গণক যন্ত্ৰ", "PC"], ["bag", "মোনা", "BAG", "বস্তু ভৰাওঁ", "CARRY ALL"]
  ]},
  { id: "colours", as: "ৰং", en: "Colours", words: [
    ["red", "ৰঙা", "RED", "তেজ", "BLOOD"], ["blue", "নীলা", "BLUE", "আকাশ", "SKY"], ["green", "সেউজীয়া", "GREEN", "পাত", "LEAF"],
    ["yellow", "হালধীয়া", "YELLOW", "হালধি", "TURMERIC"], ["pink", "গোলাপী", "PINK", "পদুম", "ROSE"],
    ["orange", "কমলা", "ORANGE", "টেঙা", "CITRUS"], ["purple", "বেঙুনীয়া", "PURPLE", "জামু", "BRINJAL"]
  ]},
  { id: "transport", as: "যান-বাহন", en: "Transport", words: [
    ["car", "গাড়ী", "CAR", "চালক", "DRIVE"], ["bus", "বাছ", "BUS", "যাত্ৰীবাহী", "PUBLIC RIDE"], ["train", "ৰেল", "TRAIN", "ষ্টেচন", "RAILS"],
    ["plane", "উৰাজাহাজ", "PLANE", "আকাশত উৰে", "FLIES"], ["boat", "নাও", "BOAT", "বঠা", "OARS"], ["bicycle", "চাইকেল", "BICYCLE", "পেডেল", "PEDALS"],
    ["ship", "জাহাজ", "SHIP", "সাগৰ", "SEA"], ["truck", "ট্ৰাক", "TRUCK", "মাল বয়", "CARGO"]
  ]},
  { id: "assam", as: "আমাৰ অসম", en: "Our Assam", words: [
    ["japi", "জাপি", "JAPI", "টুপী", "ASSAM HAT"], ["dhol", "ঢোল", "DHOL", "বিহুৰ বাদ্য", "DRUM"], ["pepa", "পেঁপা", "PEPA", "মহৰ শিং", "HORN PIPE"],
    ["gamosa", "গামোচা", "GAMOSA", "বিহুৱান", "TOWEL"], ["xorai", "শৰাই", "XORAI", "বটা", "OFFERING TRAY"], ["bamboo", "বাঁহ", "BAMBOO", "বাঁহনি", "TALL GRASS"],
    ["rhino", "গঁড়", "RHINO", "এশিঙীয়া", "ONE HORN"], ["tea", "চাহ", "TEA", "গৰম পানীয়", "HOT DRINK"], ["boat", "নাও", "BOAT", "বঠা", "OARS"]
  ]}
];
