// Puzzle content. Every word is [doodle key, Assamese answer, English answer,
// Assamese hint word, English hint word] and optionally [Assamese clue, English clue].
// A clue square shows the short hint word, or sometimes the doodle; the full clue,
// when given, shows under the board. Use null as the doodle key for words with no picture.
// Answers with a space are filled without it (প্ৰাচীন অসম → প্ৰাচীনঅসম).
// The grid is built automatically from the whole list (buildLevel in app.js).
// Assamese answers fill one syllable per square; English answers one letter per square.

window.THEMES = [
  { id: "animals", as: "পশু", en: "Animals", words: [
    ["elephant", "হাতী", "ELEPHANT", "শুঁৰ", "TRUNK"], ["rhino", "গঁড়", "RHINO", "এশিঙীয়া", "ONE HORN"], ["tiger", "বাঘ", "TIGER", "ডোৰাকটা", "STRIPES"],
    ["cat", "মেকুৰী", "CAT", "মিঁয়াও", "MEOW"], ["dog", "কুকুৰ", "DOG", "ভুকে", "BARKS"], ["cow", "গৰু", "COW", "হাম্বা", "MOO"],
    ["monkey", "বান্দৰ", "MONKEY", "মানুহৰ পুৰ্ব পুৰুষ", "SWINGS"], ["fish", "মাছ", "FISH", "সাঁতোৰে", "SWIMS"], ["rabbit", "শহাপহু", "RABBIT", "দীঘল কাণ", "LONG EARS"],
    ["snake", "সাপ", "SNAKE", "সৰিসৃপ প্ৰজাতি", "HISS"]
  ]},
  { id: "birds", as: "চৰাই আৰু পোক", en: "Birds & bugs", words: [
    ["duck", "হাঁহ", "DUCK", "কোমোৰাৰ লগত খাবলৈ ভাল", "QUACK"], ["rooster", "কুকুৰা", "ROOSTER", "পুৱাৰ ডাক", "DAWN CALL"], ["owl", "ফেঁচা", "OWL", "নিশাচৰ", "NIGHT BIRD"],
    ["parrot", "ভাটৌ", "PARROT", "কথা কোৱা চৰাই", "TALKS"], ["crow", "কাউৰী", "CROW", "কা কা", "A BLACK BIRD"], ["pigeon", "কপৌ", "PIGEON", "শান্তিৰ চিন", "PEACE BIRD"],
    ["butterfly", "পখিলা", "BUTTERFLY", "ৰঙীন পাখি", "WINGS"], ["bee", "মৌমাখি", "BEE", "গুণগুণায়", "HONEY MAKER"], ["ant", "পৰুৱা", "ANT", "সৰু পোক", "TINY WORKER"]
  ]},
  { id: "food", as: "খাদ্য", en: "Food", words: [
    ["rice", "ভাত", "RICE", "চাউল", "GRAIN"], ["tea", "চাহ", "TEA", "গৰম পানীয়", "HOT DRINK"], ["mango", "আম", "MANGO", "ফলৰ ৰজা", "KING OF FRUITS"],
    ["banana", "কল", "BANANA", "দীঘল ফল", "YELLOW FRUIT"], ["egg", "কণী", "EGG", "কুকুৰাই পাৰে", "HEN LAYS"], ["milk", "গাখীৰ", "MILK", "বগা পানীয়", "WHITE DRINK"],
    ["honey", "মৌ", "HONEY", "মিঠা", "SWEET"], ["coconut", "নাৰিকল", "COCONUT", "কঠিন খোলা", "HARD SHELL"], ["chilli", "জলকীয়া", "CHILLI", "জ্বলা", "HOT"],
    ["pineapple", "আনাৰস", "PINEAPPLE", "কাঁইটীয়া ফল", "SPIKY FRUIT"]
  ]},
  { id: "body", as: "শৰীৰ", en: "The body", words: [
    ["eye", "চকু", "EYE", "দৃষ্টি", "SEE"], ["ear", "কাণ", "EAR", "শুনা", "LISTEN"], ["nose", "নাক", "NOSE", "গোন্ধ", "SMELL"],
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
    ["yellow", "হালধীয়া", "YELLOW", "হালধি", "TURMERIC"], ["pink", "গোলাপী", "PINK", "গোলাপ", "ROSE"],
    ["orange", "কমলা", "ORANGE", "টেঙা", "CITRUS"], ["purple", "বেঙুনীয়া", "PURPLE", "জামু", "BRINJAL"]
  ]},
  { id: "transport", as: "যান-বাহন", en: "Transport", words: [
    ["car", "গাড়ী", "CAR", "চালক", "DRIVE"], ["bus", "বাছ", "BUS", "যাত্ৰীবাহী", "PUBLIC RIDE"], ["train", "ৰেল", "TRAIN", "ষ্টেচন", "RAILS"],
    ["plane", "উৰাজাহাজ", "PLANE", "আকাশত উৰে", "FLIES"], ["boat", "নাও", "BOAT", "বঠা", "OARS"], ["bicycle", "চাইকেল", "BICYCLE", "পেডেল", "PEDALS"],
    ["ship", "জাহাজ", "SHIP", "সাগৰ", "SEA"], ["truck", "ট্ৰাক", "TRUCK", "মাল বয়", "CARGO"]
  ]},
  { id: "history", as: "অসমৰ ইতিহাস", en: "Assam history", words: [
    [null, "প্ৰাচীন অসম", "Ancient Assam", "আদি কাল", "ANCIENT ERA", "পুৰণি কালৰ অসম", "Assam in ancient times"],
    [null, "কামৰূপ", "Kamarupa", "প্ৰাচীন ৰাজ্য", "OLD KINGDOM", "অসমৰ প্ৰাচীন ৰাজ্য", "Ancient kingdom of Assam"],
    [null, "প্ৰাগজ্যোতিষপুৰ", "Pragjyotishpura", "পুৰণি নগৰ", "OLD CITY", "গুৱাহাটীৰ সৈতে জড়িত প্ৰাচীন নাম", "Ancient name associated with Guwahati"],
    [null, "চৰাইদেউ", "Charaideo", "প্ৰথম ৰাজধানী", "FIRST CAPITAL", "আহোম ৰাজ্যৰ প্ৰথম ৰাজধানী", "First capital of the Ahom kingdom"],
    [null, "আহোম ৰাজ্য", "Ahom kingdom", "১২২৮", "1228", "১২২৮ চনত প্ৰতিষ্ঠিত ঐতিহাসিক ৰাজ্য", "Historic kingdom founded in 1228"],
    [null, "বুৰঞ্জী", "Buranji", "ইতিবৃত্ত", "CHRONICLES", "অসমৰ ঐতিহাসিক ইতিবৃত্ত", "Historical chronicles of Assam"],
    [null, "শৰাইঘাট", "Saraighat", "১৬৭১ৰ ৰণ", "1671 BATTLE", "১৬৭১ চনৰ বিখ্যাত যুদ্ধৰ স্থান", "Site of the famous 1671 battle"],
    [null, "লাচিত বৰফুকন", "Lachit Borphukan", "বীৰ সেনাপতি", "BRAVE GENERAL", "শৰাইঘাট যুদ্ধৰ আহোম সেনাপতি", "Ahom general at the Battle of Saraighat"],
    [null, "মোমাই তামুলী বৰবৰুৱা", "Momai Tamuli Borbarua", "প্ৰশাসক", "ADMINISTRATOR", "গুৰুত্বপূৰ্ণ আহোম প্ৰশাসক", "Important Ahom administrator"],
    [null, "স্বৰ্গদেউ", "Swargadeo", "ৰজাৰ উপাধি", "KINGS' TITLE", "আহোম ৰজাসকলৰ উপাধি", "Title used by Ahom kings"],
    [null, "চাওলুং চুকাফা", "Chaolung Sukapha", "প্ৰতিষ্ঠাপক", "FOUNDER", "আহোম ৰাজ্যৰ প্ৰতিষ্ঠাপক", "Founder of the Ahom kingdom"],
    [null, "চুহুংমুং", "Suhungmung", "ডিহিঙীয়া ৰজা", "DIHINGIA RAJA", "ডিহিঙীয়া ৰজা নামেৰেও জনাজাত আহোম ৰজা", "Ahom king also known as Dihingia Raja"],
    [null, "প্ৰতাপ সিংহ", "Pratap Singha", "দক্ষ শাসক", "ABLE RULER", "প্ৰশাসন শক্তিশালী কৰা আহোম ৰজা", "Ahom king who strengthened administration"],
    [null, "গদাধৰ সিংহ", "Gadadhar Singha", "আহোম ৰজা", "AHOM KING", "ৰংঘৰৰ পূৰ্বৰ গাঁথনি নিৰ্মাণ কৰা আহোম ৰজা", "Ahom king who founded the Rang Ghar's predecessor structure"],
    [null, "ৰুদ্ৰ সিংহ", "Rudra Singha", "ৰাজ্য বিস্তাৰ", "EXPANSION", "ৰাজ্য বিস্তাৰ আৰু সাংস্কৃতিক উন্নয়নৰ সৈতে জড়িত আহোম ৰজা", "Ahom king associated with expansion and cultural development"],
    [null, "শিৱ সিংহ", "Siva Singha", "ফুলেশ্বৰীৰ ৰজা", "PHULESWARI'S KING", "কুঁৱৰী ফুলেশ্বৰীৰ প্ৰভাৱৰ সময়ৰ আহোম ৰজা", "Ahom king during the influence of Queen Phuleswari"],
    [null, "ফুলেশ্বৰী", "Phuleswari", "প্ৰভাৱশালী কুঁৱৰী", "POWERFUL QUEEN", "প্ৰভাৱশালী আহোম কুঁৱৰী", "Influential Ahom queen"],
    [null, "অম্বিকা", "Ambika", "শিৱদৌল", "SIVA DOL", "শিৱদৌলৰ সৈতে জড়িত কুঁৱৰী", "Queen associated with the Siva Dol"],
    [null, "জয়মতী", "Joymoti", "ত্যাগ", "SACRIFICE", "ত্যাগৰ বাবে স্মৰণীয় আহোম কুঁৱৰী", "Ahom princess remembered for sacrifice"],
    [null, "গদাপাণি", "Gadapani", "চুপাতফা", "SUPAATPHAA", "চুপাতফা নামেৰেও জনাজাত পৰৱৰ্তী আহোম ৰজা", "Later Ahom king, also known as Supaatphaa"],
    [null, "পুষ্পলতা দাস", "Pushpalata Das", "স্বাধীনতা সংগ্ৰামী", "FREEDOM FIGHTER", "স্বাধীনতা সংগ্ৰামী আৰু সমাজকৰ্মী", "Freedom fighter and social worker"],
    [null, "অম্বিকাগিৰী ৰায়চৌধুৰী", "Ambikagiri Raichoudhury", "কবি", "POET", "কবি আৰু জাতীয়তাবাদী", "Poet and nationalist"],
    [null, "চন্দ্ৰপ্ৰভা শইকীয়ানী", "Chandraprabha Saikiani", "নাৰী অধিকাৰ", "WOMEN'S RIGHTS", "নাৰী অধিকাৰ কৰ্মী আৰু স্বাধীনতা সংগ্ৰামী", "Women's rights activist and freedom fighter"],
    [null, "হৰিনাৰায়ণ দত্তবৰুৱা", "Harinarayan Dutta Baruah", "জাতীয়তাবাদী", "NATIONALIST", "অসমীয়া জাতীয়তাবাদী ব্যক্তিত্ব", "Assamese nationalist figure"],
    [null, "সিদ্ধিনাথ শৰ্মা", "Siddhinath Sarma", "আন্দোলনৰ নেতা", "MOVEMENT LEADER", "স্বাধীনতা আন্দোলনৰ নেতা", "Freedom movement leader"]
  ]},
  { id: "assam", as: "আমাৰ অসম", en: "Our Assam", words: [
    ["japi", "জাপি", "JAPI", "টুপী", "ASSAM HAT"], ["dhol", "ঢোল", "DHOL", "বিহুৰ বাদ্য", "DRUM"], ["pepa", "পেঁপা", "PEPA", "মহৰ শিং", "HORN PIPE"],
    ["gamosa", "গামোচা", "GAMOSA", "বিহুৱান", "TOWEL"], ["xorai", "শৰাই", "XORAI", "বটা", "OFFERING TRAY"], ["bamboo", "বাঁহ", "BAMBOO", "দীঘল ঘাঁহ", "TALL GRASS"],
    ["rhino", "গঁড়", "RHINO", "এশিঙীয়া", "ONE HORN"], ["tea", "চাহ", "TEA", "গৰম পানীয়", "HOT DRINK"], ["boat", "নাও", "BOAT", "বঠা", "OARS"]
  ]},
  { id: "birds", as: "অসমৰ চৰাই", en: "Birds of Assam", words: [
    [null,  "দেওহাঁহ", "Wood duck", "ৰাজ্যিক চৰাই", "STATE BIRD", "অসমৰ ৰাজ্যিক চৰাই", "State bird of Assam"],
    [null,  "ধনেশ", "Hornbill", "শিঙা ঠোঁট", "HORNED BEAK", "ঠোঁটৰ ওপৰত শিঙৰ দৰে খোল থকা ডাঙৰ চৰাই", "Large bird with a casque on its beak"],
    [null,  "হাড়গিলা", "Adjutant", "বিপন্ন বগ", "RARE STORK", "পূৰ্ণিমা দেৱী বৰ্মনে ৰক্ষা কৰা বিপন্ন চৰাই", "Endangered stork protected by Purnima Devi Barman"],
    [null,  "কুলি", "Koel", "বহাগৰ মাত", "SPRING CALL", "বহাগ বিহুৰ বতৰত মাত দিয়া চৰাই", "Bird whose call marks Bohag Bihu"],
    [null,  "শালিকা", "Myna", "চহৰৰ চৰাই", "TOWN BIRD", "ঘৰৰ ওচৰত দেখা হালধীয়া ঠোঁটৰ চৰাই", "Common yellow-billed bird near homes"],
    [null,  "বগলী", "Egret", "বগা চৰাই", "WHITE BIRD", "পথাৰত দেখা দীঘল ঠেঙৰ বগা চৰাই", "Long-legged white bird of paddy fields"],
    [null,  "চিলা", "Kite", "আকাশৰ চিকাৰী", "SKY HUNTER", "আকাশত ঘূৰি ঘূৰি উৰা চিকাৰী চৰাই", "Bird of prey that circles in the sky"],
    [null,  "শগুন", "Vulture", "মৰাখোৱা", "SCAVENGER", "মৰা জন্তু খোৱা ডাঙৰ চৰাই", "Large bird that feeds on dead animals"],
    [null,  "কাঠৰোকা", "Woodpecker", "গছ খুটে", "TAPS TREES", "ঠোঁটেৰে গছ খুটি খুটি খোৱা চৰাই", "Bird that pecks holes in tree trunks"],
    [null,  "মাছৰোকা", "Kingfisher", "মাছ ধৰে", "FISH CATCHER", "পানীত জাপ মাৰি মাছ ধৰা ৰঙীন চৰাই", "Bright bird that dives to catch fish"],
    [null,  "ঘনচিৰিকা", "Sparrow", "সৰু চৰাই", "SMALL BIRD", "ঘৰৰ চুকে-কোণে বাহ সজা সৰু চৰাই", "Small brown bird that nests in houses"],
    [null,  "বুলবুলি", "Bulbul", "গীতি চৰাই", "SONGBIRD", "মিঠা মাতৰ সৰু চৰাই", "Small songbird with a sweet call"],
    [null,  "সাৰস", "Sarus", "ওখ চৰাই", "TALL BIRD", "পৃথিৱীৰ আটাইতকৈ ওখ উৰিব পৰা চৰাই", "World's tallest flying bird"]
  ]},
  { id: "fish", as: "অসমৰ মাছ", en: "Fish of Assam", words: [
    [null,  "ৰৌ", "Rohu", "ডাঙৰ মাছ", "BIG CARP", "অসমীয়া আঞ্জাৰ জনপ্ৰিয় ডাঙৰ মাছ", "Popular carp in Assamese curry"],
    [null,  "ইলিহ", "Hilsa", "মাছৰ ৰজা", "FISH KING", "নদীলৈ উজাই অহা জনপ্ৰিয় মাছ", "Prized fish that swims upriver to breed"],
    [null,  "মাগুৰ", "Magur", "খোজকঢ়া মাছ", "CATFISH", "গোঁফ থকা জনপ্ৰিয় মাছ", "Popular whiskered catfish"],
    [null,  "শিঙি", "Singhi", "কাঁইট মাছ", "STINGER", "কাঁইটেৰে বিন্ধা গোঁফ থকা মাছ", "Catfish with a painful sting"],
    [null,  "বৰালি", "Borali", "বৰ মাছ", "GIANT CATFISH", "নদীৰ ডাঙৰ চিকাৰী মাছ", "Large predatory river catfish"],
    [null,  "চিতল", "Chital", "পাখি পিঠি", "FEATHERBACK", "পিঠি পাখিৰ দৰে চেপেটা মাছ", "Flat fish with a feather-like back"],
    [null,  "কাৱৈ", "Koi", "শুকানতো জীয়ে", "HARDY PERCH", "পানীৰ বাহিৰতো জীয়াই থাকিব পৰা মাছ", "Perch that can survive out of water"],
    [null,  "শল", "Sol", "সাপৰ দৰে মূৰ", "SNAKEHEAD", "সাপৰ দৰে মূৰ থকা ডাঙৰ মাছ", "Large fish with a snake-like head"],
    [null,  "গৰৈ", "Goroi", "সৰু শল", "SMALL SNAKEHEAD", "শলৰ দৰে সৰু মাছ", "Small spotted snakehead fish"],
    [null,  "পুঠি", "Puthi", "সৰু মাছ", "SMALL FRY", "সৰু ৰূপালী মাছ", "Small silvery barb"],
    [null,  "ভকুৱা", "Catla", "ডাঙৰ মূৰ", "BIG HEAD", "ডাঙৰ মূৰৰ কাৰ্প মাছ", "Big-headed carp"],
    [null,  "মিৰিকা", "Mrigal", "পুখুৰীৰ মাছ", "POND CARP", "পুখুৰীত পোহা কাৰ্প মাছ", "Carp raised in village ponds"]
  ]},
  { id: "traditions", as: "পৰম্পৰা", en: "Traditions", words: [
    [null,  "বহাগ বিহু", "Bohag Bihu", "নৱবৰ্ষ", "NEW YEAR", "এপ্ৰিল মাহৰ অসমীয়া নৱবৰ্ষৰ উৎসৱ", "Assamese new year festival in April"],
    [null,  "মাঘ বিহু", "Magh Bihu", "ভোগালী", "FEAST BIHU", "জানুৱাৰীৰ খোৱা-বোৱাৰ বিহু", "Feasting harvest festival in January"],
    [null,  "কাতি বিহু", "Kati Bihu", "কঙালী", "LAMP BIHU", "অক্টোবৰত চাকি জ্বলোৱা বিহু", "Bihu of lamps in October"],
    [null,  "উৰুকা", "Uruka", "ভোজৰ নিশা", "FEAST NIGHT", "মাঘ বিহুৰ আগনিশাৰ ভোজ", "Feast night before Magh Bihu"],
    [null,  "মেজি", "Meji", "জুই", "BONFIRE", "মাঘ বিহুত জ্বলোৱা খৰিৰ ঘৰ", "Bonfire burnt on Magh Bihu"],
    [null,  "ভেলাঘৰ", "Bhelaghar", "খেৰৰ ঘৰ", "STRAW HUT", "উৰুকাৰ বাবে সজা অস্থায়ী ঘৰ", "Temporary hut built for Uruka"],
    [null,  "গৰু বিহু", "Goru Bihu", "গৰু গা ধোৱা", "CATTLE DAY", "বহাগ বিহুৰ প্ৰথম দিন, গৰু গা ধুওৱা হয়", "First day of Bohag Bihu, when cattle are bathed"],
    [null,  "হুঁচৰি", "Husori", "ঘৰে ঘৰে গীত", "CAROLS", "ঘৰে ঘৰে গোৱা বিহুৰ গীত", "Bihu songs sung from house to house"],
    [null,  "ভাওনা", "Bhaona", "নাট", "DRAMA", "শংকৰদেৱৰ পৰম্পৰাৰ নাট্যানুষ্ঠান", "Traditional drama in Sankardeva's style"],
    [null,  "নামঘৰ", "Namghar", "প্ৰাৰ্থনা গৃহ", "PRAYER HALL", "গাঁৱৰ প্ৰাৰ্থনা গৃহ", "Village prayer hall"],
    [null,  "সত্ৰ", "Satra", "মঠ", "MONASTERY", "বৈষ্ণৱ ধৰ্মৰ অনুষ্ঠান", "Vaishnavite monastery"],
    [null,  "জোৰোণ", "Joron", "বিয়াৰ আগৰ", "BEFORE WEDDING", "কইনাক উপহাৰ দিয়া বিয়াৰ আগৰ অনুষ্ঠান", "Pre-wedding gift ceremony for the bride"],
    [null,  "তামোলপাণ", "Tamul pan", "আদৰণি", "WELCOME", "আলহীক আগবঢ়োৱা তামোল আৰু পাণ", "Areca nut and betel leaf offered to guests"],
    [null,  "জলপান", "Jolpan", "ৰাতিপুৱাৰ আহাৰ", "BREAKFAST", "চিৰা, দৈ, গুড়েৰে পৰম্পৰাগত ৰাতিপুৱাৰ আহাৰ", "Traditional breakfast of flattened rice, curd and jaggery"]
  ]},
  { id: "sports", as: "খেল", en: "Sports", words: [
    [null,  "হিমা দাস", "Hima Das", "ধিং এক্সপ্ৰেছ", "DHING EXPRESS", "ধিং এক্সপ্ৰেছ নামে জনাজাত দৌৰবিদ", "Sprinter called the Dhing Express"],
    [null,  "লাভলীনা বৰগোহাঁই", "Lovlina Borgohain", "অলিম্পিক পদক", "OLYMPIC MEDAL", "টকিঅ' অলিম্পিকত ব্ৰঞ্জ পোৱা মুষ্টিযুঁজাৰু", "Boxer who won Olympic bronze at Tokyo 2020"],
    [null,  "শিৱ থাপা", "Shiva Thapa", "মুষ্টিযুঁজাৰু", "BOXER", "গুৱাহাটীৰ মুষ্টিযুঁজাৰু", "Boxer from Guwahati"],
    [null,  "ৰিয়ান পৰাগ", "Riyan Parag", "ক্ৰিকেটাৰ", "CRICKETER", "আইপিএলত খেলা গুৱাহাটীৰ ক্ৰিকেটাৰ", "Cricketer from Guwahati who plays in the IPL"],
    [null,  "ভোগেশ্বৰ বৰুৱা", "Bhogeswar Baruah", "এছিয়াড সোণ", "ASIAD GOLD", "১৯৬৬ চনৰ এছিয়ান গেমছত সোণ পোৱা প্ৰথম অসমীয়া", "First Assamese to win Asian Games gold (1966)"],
    [null,  "ফুটবল", "Football", "বল খেল", "KICK BALL", "ভৰিৰে বল খেলা খেল", "Game played by kicking a ball"],
    [null,  "ক্ৰিকেট", "Cricket", "বেট আৰু বল", "BAT AND BALL", "বেট আৰু বলেৰে খেলা খেল", "Game played with bat and ball"],
    [null,  "হকী", "Hockey", "লাঠি খেল", "STICK GAME", "বেকা লাঠিৰে খেলা খেল", "Game played with curved sticks"],
    [null,  "বেডমিণ্টন", "Badminton", "চাটল", "SHUTTLE", "ৰেকেট আৰু চাটলেৰে খেলা খেল", "Game played with rackets and a shuttlecock"],
    [null,  "কাবাডী", "Kabaddi", "দম খেল", "RAID GAME", "উশাহ বন্ধ কৰি ৰেইড কৰা খেল", "Raiding game played holding the breath"],
    [null,  "দবা", "Chess", "ৰজা-মন্ত্ৰী", "KING AND QUEEN", "চৌষষ্ঠি ঘৰৰ বুদ্ধিৰ খেল", "Strategy game on 64 squares"],
    [null,  "নাওখেল", "Boat race", "নাওৰ দৌৰ", "RIVER RACE", "নদীত নাও বাই খেলা পৰম্পৰাগত খেল", "Traditional race of boats on a river"],
    [null,  "কণীযুঁজ", "Egg fight", "বিহুৰ খেল", "BIHU GAME", "বহাগ বিহুত কণী খুন্দাখুন্দি কৰা খেল", "Bihu game of knocking eggs together"]
  ]},
  { id: "singers", as: "শিল্পী", en: "Singers", words: [
    [null,  "ভূপেন হাজৰিকা", "Bhupen Hazarika", "সুধাকণ্ঠ", "SUDHAKANTHA", "২০১৯ চনত ভাৰতৰত্ন পোৱা সুধাকণ্ঠ", "Sudhakantha, awarded the Bharat Ratna in 2019"],
    [null,  "জুবিন গাৰ্গ", "Zubeen Garg", "য়া আলি", "YA ALI", "'য়া আলি' গীতৰ বাবে জনাজাত শিল্পী", "Singer known for 'Ya Ali'"],
    [null,  "পাপন", "Papon", "অংগৰাগ", "ANGARAG", "অংগৰাগ মহন্তৰ মঞ্চ নাম", "Stage name of Angarag Mahanta"],
    [null,  "খগেন মহন্ত", "Khagen Mahanta", "লোকগীত", "FOLK SINGER", "বিহুগীতৰ শিল্পী, পাপনৰ পিতৃ", "Bihu folk singer, father of Papon"],
    [null,  "অৰ্চনা মহন্ত", "Archana Mahanta", "খগেনৰ পত্নী", "KHAGEN'S WIFE", "লোকগীতৰ শিল্পী, খগেন মহন্তৰ পত্নী", "Folk singer, wife of Khagen Mahanta"],
    [null,  "প্ৰতিমা বৰুৱা পাণ্ডে", "Pratima Barua Pandey", "গোৱালপৰীয়া", "GOALPARIYA", "গোৱালপৰীয়া লোকগীতৰ শিল্পী", "Singer of Goalpariya folk songs"],
    [null,  "দীপালী বৰঠাকুৰ", "Dipali Borthakur", "পদ্মশ্ৰী", "PADMA SHRI", "১৯৯৮ চনত পদ্মশ্ৰী পোৱা গায়িকা", "Singer awarded the Padma Shri in 1998"],
    [null,  "জয়ন্ত হাজৰিকা", "Jayanta Hazarika", "ভূপেনৰ ভাই", "BHUPEN'S BROTHER", "ভূপেন হাজৰিকাৰ ভাই, গায়ক", "Singer, younger brother of Bhupen Hazarika"],
    [null,  "কল্পনা পাটোৱাৰী", "Kalpana Patowary", "ভোজপুৰী", "BHOJPURI", "বৰপেটাৰ ভোজপুৰী গায়িকা", "Bhojpuri singer from Barpeta"]
  ]},
  { id: "movies", as: "অসমীয়া চলচ্চিত্ৰ", en: "Assamese movies", words: [
    [null,  "ভিলেজ ৰকষ্টাৰ্ছ", "Village Rockstars", "অস্কাৰলৈ", "OSCAR ENTRY", "ৰীমা দাসৰ ছবি, অস্কাৰলৈ ভাৰতৰ প্ৰৱেশ", "Rima Das film, India's Oscar entry"],
    [null,  "বুলবুল কেন চিং", "Bulbul Can Sing", "ৰীমা দাস", "RIMA DAS", "কিশোৰীৰ কাহিনীৰে ৰীমা দাসৰ ছবি (২০১৮)", "Rima Das film about a teenage girl (2018)"],
    [null,  "আমিষ", "Aamis", "ভাস্কৰ", "BHASKAR", "ভাস্কৰ হাজৰিকাৰ ছবি (২০১৯)", "Bhaskar Hazarika film (2019)"],
    [null,  "কথানদী", "Kothanodi", "সাধুকথা", "FOLK TALES", "সাধুকথাৰে ভাস্কৰ হাজৰিকাৰ ছবি (২০১৫)", "Bhaskar Hazarika's folk-tale film (2015)"],
    [null,  "ৰত্নাকৰ", "Ratnakar", "যতীন বৰা", "JATIN BORA", "যতীন বৰাৰ ছবি (২০১৯)", "Jatin Bora film (2019)"],
    [null,  "কাঞ্চনজংঘা", "Kanchanjangha", "জুবিনৰ ছবি", "ZUBEEN FILM", "জুবিন গাৰ্গৰ ছবি (২০১৯)", "Zubeen Garg film (2019)"],
    [null,  "মিছন চাইনা", "Mission China", "একশ্যন", "ACTION", "জুবিন গাৰ্গৰ একশ্যন ছবি (২০১৭)", "Zubeen Garg action film (2017)"],
    [null,  "ডক্টৰ বেজবৰুৱা", "Dr Bezbaruah", "ৰহস্য", "THRILLER", "ব্ৰজেন বৰুৱাৰ ৰহস্য ছবি (১৯৬৯)", "Brajen Barua thriller (1969)"],
    [null,  "জ্যোতি চিত্ৰবন", "Jyoti Chitraban", "ষ্টুডিঅ'", "STUDIO", "জ্যোতিপ্ৰসাদৰ নামত নামকৰণ কৰা চলচ্চিত্ৰ ষ্টুডিঅ'", "Film studio named after Jyoti Prasad Agarwala"],
    [null,  "চলচ্চিত্ৰ", "Cinema", "ৰূপালী পৰ্দা", "SILVER SCREEN", "ছবিঘৰত চোৱা ছবি", "Films shown in a theatre"]
  ]},
  { id: "culture", as: "কলা আৰু সংস্কৃতি", en: "Art and culture", words: [
    [null,  "জ্যোতিপ্ৰসাদ আগৰৱালা", "Jyoti Prasad Agarwala", "ৰূপকোঁৱৰ", "RUPKONWAR", "প্ৰথম অসমীয়া চলচ্চিত্ৰৰ নিৰ্মাতা ৰূপকোঁৱৰ", "Rupkonwar, maker of the first Assamese film"],
    [null,  "বিষ্ণুপ্ৰসাদ ৰাভা", "Bishnu Prasad Rabha", "কলাগুৰু", "KALAGURU", "কলাগুৰু, শিল্পী আৰু বিপ্লৱী", "Kalaguru, artist and revolutionary"],
    [null,  "লক্ষ্মীনাথ বেজবৰুৱা", "Lakshminath Bezbaroa", "ৰসৰাজ", "RASARAJ", "'অ' মোৰ আপোনাৰ দেশ'ৰ ৰচয়িতা ৰসৰাজ", "Rasaraj, writer of 'O Mur Apunar Desh'"],
    [null,  "শংকৰদেৱ", "Sankardeva", "মহাপুৰুষ", "SAINT", "অসমত নৱ-বৈষ্ণৱ ধৰ্মৰ প্ৰৱৰ্তক", "Saint who founded Neo-Vaishnavism in Assam"],
    [null,  "মাধৱদেৱ", "Madhavdeva", "নামঘোষা", "NAMGHOSA", "শংকৰদেৱৰ শিষ্য, নামঘোষাৰ ৰচয়িতা", "Disciple of Sankardeva, wrote Namghosa"],
    [null,  "সত্ৰীয়া", "Sattriya", "শাস্ত্ৰীয় নৃত্য", "CLASSICAL DANCE", "শংকৰদেৱে প্ৰৱৰ্তন কৰা শাস্ত্ৰীয় নৃত্য", "Classical dance created by Sankardeva"],
    [null,  "অংকীয়া নাট", "Ankiya Naat", "এক অংকৰ নাট", "ONE-ACT PLAY", "শংকৰদেৱৰ এক অংকৰ নাট", "One-act plays by Sankardeva"],
    [null,  "বৰগীত", "Borgeet", "ভক্তিগীত", "HYMNS", "শংকৰদেৱ আৰু মাধৱদেৱৰ ভক্তিগীত", "Devotional songs of Sankardeva and Madhavdeva"],
    [null,  "ওজাপালি", "Ojapali", "গীত-নৃত্য", "SONG AND DANCE", "ওজা আৰু পালিৰ কাহিনী-গীত", "Narrative performance by a lead singer and chorus"],
    [null,  "দেওধনী", "Deodhani", "দৰঙৰ নৃত্য", "DARRANG DANCE", "দৰঙৰ ধৰ্মীয় নৃত্য", "Ritual dance of Darrang"],
    [null,  "বাগৰুম্বা", "Bagurumba", "পখিলা নৃত্য", "BUTTERFLY DANCE", "বড়ো জনগোষ্ঠীৰ পখিলা নৃত্য", "Bodo butterfly dance"],
    [null,  "ঝুমুৰ", "Jhumur", "চাহ নৃত্য", "TEA DANCE", "চাহ জনগোষ্ঠীৰ নৃত্য", "Dance of the tea community"],
    [null,  "মুখা শিল্প", "Mask craft", "মাজুলীৰ মুখা", "MAJULI MASKS", "মাজুলীৰ মুখা সজা শিল্প", "Mask making craft of Majuli"],
    [null,  "কাঁহ", "Bell metal", "সৰ্থেবাৰী", "SARTHEBARI", "সৰ্থেবাৰীৰ বিখ্যাত ধাতু শিল্প", "Metal craft famous in Sarthebari"],
    [null,  "মুগা", "Muga", "সোণালী ৰেচম", "GOLDEN SILK", "অসমৰ সোণালী ৰেচম", "Golden silk of Assam"],
    [null,  "এৰি", "Eri", "অহিংসা ৰেচম", "AHIMSA SILK", "অহিংসা ৰেচম বুলি জনাজাত কাপোৰ", "Silk known as ahimsa silk"],
    [null,  "পাট", "Pat", "বগা ৰেচম", "WHITE SILK", "নুনি গছৰ পলুৰ ৰেচম", "Mulberry silk of Assam"],
    [null,  "চাঁচিপাত", "Sanchipat", "পুথিৰ পাত", "MANUSCRIPT", "পুৰণি পুথি লিখা চাঁচি গছৰ বাকলি", "Agar bark used for old manuscripts"]
  ]},
  { id: "awards", as: "বঁটা", en: "Awards", words: [
    [null,  "ভাৰতৰত্ন", "Bharat Ratna", "শ্ৰেষ্ঠ সন্মান", "TOP HONOUR", "ভূপেন হাজৰিকাই পোৱা দেশৰ সৰ্বোচ্চ অসামৰিক বঁটা", "India's highest civilian award, given to Bhupen Hazarika"],
    [null,  "অসম বৈভৱ", "Assam Baibhav", "সৰ্বোচ্চ", "HIGHEST", "অসম চৰকাৰৰ সৰ্বোচ্চ অসামৰিক বঁটা", "Highest civilian award of the Assam government"],
    [null,  "অসম সৌৰভ", "Assam Saurav", "দ্বিতীয়", "SECOND", "অসম চৰকাৰৰ দ্বিতীয় সৰ্বোচ্চ অসামৰিক বঁটা", "Second highest civilian award of Assam"],
    [null,  "অসম গৌৰৱ", "Assam Gaurav", "তৃতীয়", "THIRD", "অসম চৰকাৰৰ তৃতীয় সৰ্বোচ্চ অসামৰিক বঁটা", "Third highest civilian award of Assam"],
    [null,  "জ্ঞানপীঠ", "Jnanpith", "সাহিত্য", "LITERATURE", "বীৰেন্দ্ৰ কুমাৰ ভট্টাচাৰ্য, মামণি ৰয়চম গোস্বামী, নীলমণি ফুকনে পোৱা বঁটা", "Literary award won by three Assamese writers"],
    [null,  "পদ্মশ্ৰী", "Padma Shri", "অসামৰিক", "CIVILIAN", "দেশৰ চতুৰ্থ সৰ্বোচ্চ অসামৰিক বঁটা", "India's fourth highest civilian award"],
    [null,  "সাহিত্য অকাডেমী", "Sahitya Akademi", "লিখকৰ বঁটা", "WRITERS' AWARD", "ভাৰতীয় ভাষাৰ সাহিত্যৰ জাতীয় বঁটা", "National award for literature in Indian languages"],
    [null,  "শংকৰদেৱ বঁটা", "Sankardev Award", "সংস্কৃতি", "CULTURE", "শ্ৰীমন্ত শংকৰদেৱৰ নামত দিয়া বঁটা", "Award named after Srimanta Sankardeva"],
    [null,  "লাচিত বঁটা", "Lachit medal", "শ্ৰেষ্ঠ কেডেট", "BEST CADET", "এনডিএৰ শ্ৰেষ্ঠ কেডেটক দিয়া সোণৰ পদক", "Gold medal for the best cadet at the NDA"],
    [null,  "বিষ্ণু ৰাভা বঁটা", "Bishnu Rabha Award", "কলাগুৰুৰ নামত", "IN KALAGURU'S NAME", "কলাগুৰুৰ নামত দিয়া বঁটা", "Award in memory of Kalaguru"]
  ]},
  { id: "policies", as: "চৰকাৰী আঁচনি", en: "Government schemes", words: [
    [null,  "অৰুণোদই", "Orunodoi", "মাহিলী সাহায্য", "MONTHLY AID", "দুখীয়া পৰিয়ালৰ মহিলাক মাহে মাহে ধন দিয়া আঁচনি (২০২০)", "Monthly cash support for women of poor families (2020)"],
    [null,  "নিযুত মইনা", "Nijut Moina", "ছাত্ৰী", "GIRL STUDENTS", "উচ্চ শিক্ষাৰ বাবে ছাত্ৰীক মাহিলী সাহায্য", "Monthly support for girl students in higher studies"],
    [null,  "নিযুত বাবু", "Nijut Babu", "ছাত্ৰ", "BOY STUDENTS", "স্নাতক-স্নাতকোত্তৰ ছাত্ৰক মাহিলী সাহায্য", "Monthly support for male UG and PG students"],
    [null,  "মিছন বসুন্ধৰা", "Mission Basundhara", "মাটি", "LAND", "মাটিৰ পট্টা আৰু ভূমি ৰেকৰ্ডৰ আঁচনি", "Land patta and land records mission"],
    [null,  "মহিলা উদ্যমিতা", "Mahila Udyamita", "স্বনিযুক্তি", "SELF-EMPLOYED", "আত্মসহায়ক গোটৰ মহিলাক ব্যৱসায়ৰ সাহায্য", "Business support for women in self-help groups"],
    [null,  "আনন্দৰাম বৰুৱা বঁটা", "Anundoram Borooah", "মেট্ৰিকৰ মেধা", "CLASS 10 MERIT", "মেট্ৰিকত ভাল ফল কৰা ছাত্ৰ-ছাত্ৰীৰ বঁটা", "Award for top results in Class 10"],
    [null,  "বাণীকান্ত কাকতি", "Banikanta Kakati", "দ্বাদশৰ মেধা", "CLASS 12 MERIT", "উচ্চতৰ মাধ্যমিকৰ মেধা বঁটা", "Merit award for Class 12 results"],
    [null,  "গুণোৎসৱ", "Gunotsav", "বিদ্যালয়", "SCHOOLS", "বিদ্যালয়ৰ শিক্ষাৰ মান জোখা কাৰ্যসূচী", "Programme that grades the quality of schools"]
  ]},
  { id: "world", as: "বিশ্বৰ সাধাৰণ জ্ঞান", en: "World general knowledge", words: [
    [null,  "এভাৰেষ্ট", "Everest", "ওখ শৃংগ", "HIGHEST PEAK", "পৃথিৱীৰ আটাইতকৈ ওখ পৰ্বত", "World's highest mountain"],
    [null,  "নীল নদ", "Nile", "দীঘল নদী", "LONG RIVER", "পৃথিৱীৰ আটাইতকৈ দীঘল নদী", "World's longest river"],
    [null,  "প্ৰশান্ত মহাসাগৰ", "Pacific", "ডাঙৰ সাগৰ", "BIG OCEAN", "পৃথিৱীৰ আটাইতকৈ ডাঙৰ মহাসাগৰ", "World's largest ocean"],
    [null,  "এছিয়া", "Asia", "ডাঙৰ মহাদেশ", "BIG CONTINENT", "আটাইতকৈ ডাঙৰ মহাদেশ", "Largest continent"],
    [null,  "ছাহাৰা", "Sahara", "মৰুভূমি", "DESERT", "আটাইতকৈ ডাঙৰ উষ্ণ মৰুভূমি", "Largest hot desert"],
    [null,  "আমাজন", "Amazon", "বৰ্ষাৰণ্য", "RAINFOREST", "পৃথিৱীৰ আটাইতকৈ ডাঙৰ বৰ্ষাৰণ্য", "World's largest rainforest"],
    [null,  "জাপান", "Japan", "সূৰ্যোদয়", "SUNRISE LAND", "সূৰ্যোদয়ৰ দেশ", "Land of the rising sun"],
    [null,  "অলিম্পিক", "Olympics", "চাৰি বছৰ", "FOUR YEARS", "প্ৰতি চাৰি বছৰত হোৱা বিশ্ব ক্ৰীড়া", "World games held every four years"],
    [null,  "বৃহস্পতি", "Jupiter", "ডাঙৰ গ্ৰহ", "BIG PLANET", "সৌৰজগতৰ আটাইতকৈ ডাঙৰ গ্ৰহ", "Largest planet"],
    [null,  "মংগল", "Mars", "ৰঙা গ্ৰহ", "RED PLANET", "ৰঙা গ্ৰহ", "The red planet"],
    [null,  "অক্সিজেন", "Oxygen", "উশাহৰ গেছ", "BREATH GAS", "উশাহত লোৱা গেছ", "Gas we breathe in"],
    [null,  "ভেটিকান", "Vatican", "সৰু দেশ", "SMALL STATE", "পৃথিৱীৰ আটাইতকৈ সৰু দেশ", "World's smallest country"],
    [null,  "ৰাছিয়া", "Russia", "ডাঙৰ দেশ", "BIG COUNTRY", "আয়তনত আটাইতকৈ ডাঙৰ দেশ", "Largest country by area"],
    [null,  "এণ্টাৰ্কটিকা", "Antarctica", "বৰফৰ মহাদেশ", "ICE CONTINENT", "দক্ষিণ মেৰুৰ বৰফৰ মহাদেশ", "Icy continent at the South Pole"]
  ]},
  { id: "words", as: "অন্যান্য দৰকাৰী শব্দ", en: "Other useful words", words: [
    [null,  "নমস্কাৰ", "Namaskar", "সম্ভাষণ", "GREETING", "হাত যোৰ কৰি দিয়া সম্ভাষণ", "Greeting with joined palms"],
    [null,  "ধন্যবাদ", "Thanks", "কৃতজ্ঞতা", "GRATITUDE", "কৃতজ্ঞতা জনোৱা শব্দ", "Word of gratitude"],
    [null,  "বন্ধু", "Friend", "লগৰীয়া", "PAL", "বিপদৰ লগৰীয়া", "Companion you trust"],
    [null,  "বজাৰ", "Market", "কিনা-বেচা", "SHOPPING", "বস্তু কিনা-বেচা কৰা ঠাই", "Place to buy and sell"],
    [null,  "চিকিৎসালয়", "Hospital", "ৰোগী", "PATIENTS", "ৰোগীৰ চিকিৎসা হোৱা ঠাই", "Place where the sick are treated"],
    [null,  "ৰাস্তা", "Road", "পথ", "WAY", "গাড়ী-মটৰ চলা পথ", "Path for vehicles"],
    [null,  "আজি", "Today", "এই দিন", "THIS DAY", "এই দিনটো", "This very day"],
    [null,  "কালি", "Yesterday", "যোৱা দিন", "DAY BEFORE", "আজিৰ আগৰ দিন", "The day before today"],
    [null,  "কাইলৈ", "Tomorrow", "অহা দিন", "NEXT DAY", "আজিৰ পিছৰ দিন", "The day after today"],
    [null,  "সপ্তাহ", "Week", "সাত দিন", "SEVEN DAYS", "সাত দিনৰ সময়", "Seven days"],
    [null,  "মাহ", "Month", "ত্ৰিশ দিন", "THIRTY DAYS", "প্ৰায় ত্ৰিশ দিনৰ সময়", "About thirty days"],
    [null,  "বছৰ", "Year", "বাৰ মাহ", "TWELVE MONTHS", "বাৰ মাহৰ সময়", "Twelve months"],
    [null,  "সুখ", "Happiness", "আনন্দ", "JOY", "দুখৰ বিপৰীত", "Opposite of sorrow"],
    [null,  "দুখ", "Sorrow", "বেজাৰ", "SADNESS", "সুখৰ বিপৰীত", "Opposite of happiness"],
    [null,  "উত্তৰ", "North", "ভূটানৰ ফাল", "BHUTAN SIDE", "অসমৰ পৰা ভূটান যি দিশত", "Direction of Bhutan from Assam"],
    [null,  "দক্ষিণ", "South", "উত্তৰৰ বিপৰীত", "OPPOSITE NORTH", "উত্তৰৰ বিপৰীত দিশ", "Opposite of north"],
    [null,  "পূব", "East", "সূৰ্য উঠে", "SUNRISE", "সূৰ্য উদয় হোৱা দিশ", "Where the sun rises"],
    [null,  "পশ্চিম", "West", "সূৰ্য মাৰ যায়", "SUNSET", "সূৰ্য মাৰ যোৱা দিশ", "Where the sun sets"],
    [null,  "দেওবাৰ", "Sunday", "বন্ধৰ দিন", "HOLIDAY", "সপ্তাহৰ বন্ধৰ দিন", "Weekly holiday"],
    [null,  "সোমবাৰ", "Monday", "কামৰ দিন", "WORKDAY", "দেওবাৰৰ পিছৰ দিন", "Day after Sunday"],
    [null,  "ভাষা", "Language", "কথাৰ মাধ্যম", "SPEECH", "অসমীয়া এটা ___", "Assamese is one"],
    [null,  "শিক্ষা", "Education", "জ্ঞান", "KNOWLEDGE", "বিদ্যালয়ত পোৱা জ্ঞান", "What school gives"]
  ]}
];
