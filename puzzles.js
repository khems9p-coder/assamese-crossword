// Puzzle content. Every word is [doodle key, Assamese answer, English answer].
// The doodle (icons.js) is the clue. The grid is built automatically from the
// list (buildGrid in app.js), so a new puzzle only needs a theme and its words.
// Assamese answers fill one syllable per square; English answers one letter per square.

window.THEMES = [
  { id: "animals", as: "পশু", en: "Animals", words: [
    ["elephant", "হাতী", "ELEPHANT"], ["rhino", "গঁড়", "RHINO"], ["tiger", "বাঘ", "TIGER"],
    ["cat", "মেকুৰী", "CAT"], ["dog", "কুকুৰ", "DOG"], ["cow", "গৰু", "COW"],
    ["monkey", "বান্দৰ", "MONKEY"], ["fish", "মাছ", "FISH"], ["rabbit", "শহাপহু", "RABBIT"],
    ["snake", "সাপ", "SNAKE"]
  ]},
  { id: "birds", as: "চৰাই আৰু পোক", en: "Birds & bugs", words: [
    ["duck", "হাঁহ", "DUCK"], ["rooster", "কুকুৰা", "ROOSTER"], ["owl", "ফেঁচা", "OWL"],
    ["parrot", "ভাটৌ", "PARROT"], ["crow", "কাউৰী", "CROW"], ["pigeon", "কপৌ", "PIGEON"],
    ["butterfly", "পখিলা", "BUTTERFLY"], ["bee", "মৌমাখি", "BEE"], ["ant", "পৰুৱা", "ANT"]
  ]},
  { id: "food", as: "খাদ্য", en: "Food", words: [
    ["rice", "ভাত", "RICE"], ["tea", "চাহ", "TEA"], ["mango", "আম", "MANGO"],
    ["banana", "কল", "BANANA"], ["egg", "কণী", "EGG"], ["milk", "গাখীৰ", "MILK"],
    ["honey", "মৌ", "HONEY"], ["coconut", "নাৰিকল", "COCONUT"], ["chilli", "জলকীয়া", "CHILLI"],
    ["pineapple", "আনাৰস", "PINEAPPLE"]
  ]},
  { id: "body", as: "শৰীৰ", en: "The body", words: [
    ["eye", "চকু", "EYE"], ["ear", "কাণ", "EAR"], ["nose", "নাক", "NOSE"],
    ["tooth", "দাঁত", "TOOTH"], ["hand", "হাত", "HAND"], ["foot", "ভৰি", "FOOT"],
    ["hair", "চুলি", "HAIR"], ["lips", "ওঁঠ", "LIPS"], ["bone", "হাড়", "BONE"]
  ]},
  { id: "nature", as: "প্ৰকৃতি", en: "Nature", words: [
    ["sun", "সূৰ্য", "SUN"], ["moon", "জোন", "MOON"], ["star", "তৰা", "STAR"],
    ["cloud", "ডাৱৰ", "CLOUD"], ["rain", "বৰষুণ", "RAIN"], ["tree", "গছ", "TREE"],
    ["flower", "ফুল", "FLOWER"], ["mountain", "পাহাৰ", "MOUNTAIN"], ["river", "নদী", "RIVER"],
    ["rainbow", "ৰামধেনু", "RAINBOW"], ["leaf", "পাত", "LEAF"]
  ]},
  { id: "home", as: "ঘৰ", en: "Home", words: [
    ["house", "ঘৰ", "HOUSE"], ["door", "দুৱাৰ", "DOOR"], ["window", "খিড়িকী", "WINDOW"],
    ["chair", "চকী", "CHAIR"], ["bed", "বিচনা", "BED"], ["clock", "ঘড়ী", "CLOCK"],
    ["key", "চাবি", "KEY"], ["umbrella", "ছাতি", "UMBRELLA"], ["mirror", "আইনা", "MIRROR"],
    ["lamp", "চাকি", "LAMP"]
  ]},
  { id: "school", as: "বিদ্যালয়", en: "School", words: [
    ["book", "কিতাপ", "BOOK"], ["pen", "কলম", "PEN"], ["pencil", "পেঞ্চিল", "PENCIL"],
    ["notebook", "বহী", "NOTEBOOK"], ["letter", "চিঠি", "LETTER"], ["bell", "ঘণ্টা", "BELL"],
    ["scissors", "কেঁচি", "SCISSORS"], ["computer", "কম্পিউটাৰ", "COMPUTER"], ["bag", "মোনা", "BAG"]
  ]},
  { id: "colours", as: "ৰং", en: "Colours", words: [
    ["red", "ৰঙা", "RED"], ["blue", "নীলা", "BLUE"], ["green", "সেউজীয়া", "GREEN"],
    ["yellow", "হালধীয়া", "YELLOW"], ["pink", "গোলাপী", "PINK"],
    ["orange", "কমলা", "ORANGE"], ["purple", "বেঙুনীয়া", "PURPLE"]
  ]},
  { id: "transport", as: "যান-বাহন", en: "Transport", words: [
    ["car", "গাড়ী", "CAR"], ["bus", "বাছ", "BUS"], ["train", "ৰেল", "TRAIN"],
    ["plane", "উৰাজাহাজ", "PLANE"], ["boat", "নাও", "BOAT"], ["bicycle", "চাইকেল", "BICYCLE"],
    ["ship", "জাহাজ", "SHIP"], ["truck", "ট্ৰাক", "TRUCK"]
  ]},
  { id: "assam", as: "আমাৰ অসম", en: "Our Assam", words: [
    ["japi", "জাপি", "JAPI"], ["dhol", "ঢোল", "DHOL"], ["pepa", "পেঁপা", "PEPA"],
    ["gamosa", "গামোচা", "GAMOSA"], ["xorai", "শৰাই", "XORAI"], ["bamboo", "বাঁহ", "BAMBOO"],
    ["rhino", "গঁড়", "RHINO"], ["tea", "চাহ", "TEA"], ["boat", "নাও", "BOAT"]
  ]}
];
