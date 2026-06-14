/**
 * Tea Spirit Web Quiz — 8 題 × 4 選 1
 * 計分邏輯移植自 GameManager.gd calculate_final_tea()
 */

const CATEGORY_NAMES = ["場景元素", "身體元素", "心靈元素", "感官元素"];

const QUESTIONS = [
  {
    id: 0,
    text: "你希望今天設計的茶精靈能在什麼時候登場？",
    options: ["享用餐點時", "卯足精力工作時", "放鬆心情時", "跟朋友會面時"],
    question_type: 0,
    mapping: {
      0: { dim: "Scene", val: "Meal", score: 2 },
      1: { dim: "Scene", val: "Work", score: 2 },
      2: { dim: "Scene", val: "Relax", score: 2 },
      3: { dim: "Scene", val: "Social", score: 2 },
    },
  },
  {
    id: 1,
    text: "你的茶精靈拿著充電線走來，你想請他幫你充多少電？",
    options: ["充滿 100%！", "充個 50% 就好", "開啟飛航模式", "直接關機休息"],
    question_type: 1,
    mapping: {
      0: { dim: "Caffeine", val: "High", score: 2 },
      1: { dim: "Caffeine", val: "Medium", score: 2 },
      2: { dim: "Caffeine", val: "Low", score: 2 },
      3: { dim: "Caffeine", val: "None", score: 2 },
    },
  },
  {
    id: 2,
    text: "茶精靈握住你的手，他感覺到你的手腳...？",
    options: ["冰冰涼涼的", "發燙、手心有汗", "悶悶的、黏黏的", "溫暖乾燥、很舒服"],
    question_type: 1,
    mapping: {
      0: { dim: "Nature", val: "Warm", score: 1 },
      1: { dim: "Nature", val: "Cool", score: 1 },
      2: { dim: "Nature", val: "MoveQi", score: 1 },
      3: { dim: "Nature", val: "Neutral", score: 1 },
    },
  },
  {
    id: 3,
    text: "茶精靈躺在你的肚子上，他感應到了什麼？",
    options: ["一顆飽脹的大石頭", "一陣空虛的咕嚕聲", "一層油膩膩的感覺", "一條平靜的小溪流"],
    question_type: 1,
    mapping: {
      0: { dim: "Digestion", val: "Digest", score: 2 },
      1: { dim: "Digestion", val: "WarmStomach", score: 2 },
      2: { dim: "Digestion", val: "Degrease", score: 2 },
      3: { dim: "Digestion", val: "Moisturize", score: 2 },
    },
  },
  {
    id: 4,
    text: "茶精靈張開雙臂擁抱你，你希望那個擁抱的觸感是？",
    options: ["像厚棉被一樣", "像一陣涼爽的風", "像結實的拍背", "像輕柔的羽毛"],
    question_type: 2,
    mapping: {
      0: { dim: "Body", val: "Full", score: 1 },
      1: { dim: "Body", val: "Light", score: 1 },
      2: { dim: "Body", val: "Strong", score: 1 },
      3: { dim: "Body", val: "Smooth", score: 1 },
    },
  },
  {
    id: 5,
    text: "茶精靈看進你的腦袋裡，發現你的思緒正在...",
    options: ["像無頭蒼蠅亂飛", "像當機的電腦畫面", "像在做白日夢", "像入定的老僧"],
    question_type: 2,
    mapping: {
      0: { dim: "Mind", val: "Energize", score: 1 },
      1: { dim: "Mind", val: "Relax", score: 1 },
      2: { dim: "Mind", val: "Creative", score: 1 },
      3: { dim: "Mind", val: "Enjoy", score: 1 },
    },
  },
  {
    id: 6,
    text: "茶精靈準備施展魔法加點甜味，你會對他說？",
    options: ["多加一點！我現在需要快樂", "一點點就好，像微風一樣", "不用了，我喜歡大人的原味", "給我一種酸酸甜甜的驚喜"],
    question_type: 3,
    mapping: {
      0: { dim: "Sweet", val: "Heavy", score: 1 },
      1: { dim: "Sweet", val: "Light", score: 1 },
      2: { dim: "Sweet", val: "None", score: 1 },
      3: { dim: "Sweet", val: "Tangy", score: 1 },
    },
  },
  {
    id: 7,
    text: "茶精靈消失在空氣中，留下了一抹味道，那是...",
    options: ["雨後草地的青草香", "盛開花園的芬芳", "剛剝開的新鮮果皮味", "烘焙過的堅果暖香"],
    question_type: 3,
    mapping: {
      0: { dim: "Aroma", val: "Herbal", score: 1 },
      1: { dim: "Aroma", val: "Floral", score: 1 },
      2: { dim: "Aroma", val: "Fruity", score: 1 },
      3: { dim: "Aroma", val: "Roasty", score: 1 },
    },
  },
];

const RECIPES = [
  { name: "Lemon Black Tea", materials: ["Lemon", "Black Tea"] },
  { name: "Peach Oolong Tea", materials: ["Peach", "Oolong Tea"] },
  { name: "Hawthorn Black Tea", materials: ["Hawthorn", "Black Tea"] },
  { name: "Jasmine Green Tea", materials: ["Jasmine", "Green Tea"] },
  { name: "Chamomile Green Tea", materials: ["Chamomile", "Green Tea"] },
  { name: "Osmanthus Black Tea", materials: ["Osmanthus", "Black Tea"] },
  { name: "Jasmine Lemon Green Tea", materials: ["Jasmine", "Lemon", "Green Tea"] },
  { name: "Osmanthus Pear Oolong Tea", materials: ["Osmanthus", "Asian Pear", "Oolong Tea"] },
  { name: "Rose Hawthorn Black Tea", materials: ["Rose", "Hawthorn", "Black Tea"] },
];

/** RECIPES 索引 → 中文名、圖片 stem、分享頁編號 */
const RECIPE_META = [
  { nameZh: "檸檬紅茶", imageStem: "檸檬紅茶", imageSuffix: "_P", sharePage: 4 },
  { nameZh: "蜜桃烏龍茶", imageStem: "蜜桃烏龍", imageSuffix: "_", sharePage: 5 },
  { nameZh: "山楂紅茶", imageStem: "山楂紅茶", imageSuffix: "_", sharePage: 6 },
  { nameZh: "茉莉花綠茶", imageStem: "茉莉花綠茶", imageSuffix: "_P", sharePage: 1 },
  { nameZh: "洋甘菊綠茶", imageStem: "洋甘菊綠茶", imageSuffix: "_", sharePage: 2 },
  { nameZh: "桂花紅茶", imageStem: "桂花紅茶", imageSuffix: "_", sharePage: 3 },
  { nameZh: "茉莉花檸檬綠茶", imageStem: "茉莉花檸檬綠茶", imageSuffix: "_", sharePage: 7 },
  { nameZh: "桂花雪梨烏龍茶", imageStem: "桂花雪梨烏龍茶", imageSuffix: "_P", sharePage: 8 },
  { nameZh: "玫瑰山楂紅茶", imageStem: "玫瑰山楂紅茶", imageSuffix: "_P", sharePage: 9 },
];

const BASE_MATERIALS = ["Oolong Tea", "Black Tea", "Green Tea"];
const FLOWER_MATERIALS = ["Jasmine", "Osmanthus", "Rose", "Chamomile"];
const FRUIT_MATERIALS = ["Lemon", "Peach", "Hawthorn", "Asian Pear"];
const SAME_ATTR_FRUIT_PAIRS = [["Lemon", "Hawthorn"], ["Peach", "Asian Pear"]];
const TARGET_KEY_TO_DISPLAY = {
  Oolong: "Oolong Tea",
  Black: "Black Tea",
  Green: "Green Tea",
  Pear: "Asian Pear",
};

const SPAWN_COUNTS_KEY = "teaSpiritRecipeSpawnCounts";

function getRecipeImages(recipeIndex) {
  const meta = RECIPE_META[recipeIndex];
  const s = meta.imageSuffix;
  return [
    `${meta.imageStem}${s}1.png`,
    `${meta.imageStem}${s}2.png`,
  ];
}

function getShareUrl(recipeIndex) {
  const page = RECIPE_META[recipeIndex].sharePage;
  if (typeof window !== "undefined" && window.location) {
    const base = window.location.href.replace(/[^/]*$/, "");
    return `${base}TeaSpirit_${page}.html`;
  }
  return `TeaSpirit_${page}.html`;
}

function loadSpawnCounts() {
  try {
    const raw = localStorage.getItem(SPAWN_COUNTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSpawnCounts(counts) {
  try {
    localStorage.setItem(SPAWN_COUNTS_KEY, JSON.stringify(counts));
  } catch {
    /* ignore */
  }
}

function weightedRandom(weights) {
  let total = 0;
  for (const w of Object.values(weights)) total += w;
  if (total <= 0) return "";
  let r = Math.random() * total;
  let accum = 0;
  const keys = Object.keys(weights);
  for (const key of keys) {
    accum += weights[key];
    if (r <= accum) return key;
  }
  return keys[keys.length - 1] || "";
}

function isSameAttrFruit(a, b) {
  for (const pair of SAME_ATTR_FRUIT_PAIRS) {
    if (pair.includes(a) && pair.includes(b)) return true;
  }
  return false;
}

function scoreRecipe(recipe, targetBase, targetFlower, targetFruit) {
  const materials = recipe.materials || [];
  let recipeBase = "";
  let recipeFlower = "";
  let recipeFruit = "";
  for (const m of materials) {
    if (BASE_MATERIALS.includes(m)) recipeBase = m;
    else if (FLOWER_MATERIALS.includes(m)) recipeFlower = m;
    else if (FRUIT_MATERIALS.includes(m)) recipeFruit = m;
  }

  let total = 0;

  if (targetBase !== "None" && targetBase !== "") {
    if (recipeBase !== "") {
      if (recipeBase === targetBase) total += 10;
      else if (BASE_MATERIALS.includes(targetBase) && BASE_MATERIALS.includes(recipeBase)) total += 5;
    }
  }

  if (targetFlower === "None" || targetFlower === "") {
    if (recipeFlower === "") total += 4;
  } else if (recipeFlower !== "") {
    if (recipeFlower === targetFlower) total += 10;
    else if (FLOWER_MATERIALS.includes(targetFlower) && FLOWER_MATERIALS.includes(recipeFlower)) total += 5;
  }

  if (targetFruit === "None" || targetFruit === "") {
    if (recipeFruit === "") total += 4;
  } else if (recipeFruit !== "") {
    if (recipeFruit === targetFruit) total += 10;
    else if (isSameAttrFruit(recipeFruit, targetFruit)) total += 5;
  }

  return total;
}

function calculateFinalTea(answers) {
  const stateScores = {};
  const allDims = ["Scene", "Caffeine", "Nature", "Digestion", "Mind", "Body", "Sweet", "Aroma"];
  for (const d of allDims) stateScores[d] = {};

  for (const ans of answers) {
    const { dim, val, score } = ans;
    if (!dim) continue;
    if (!stateScores[dim]) stateScores[dim] = {};
    stateScores[dim][val] = (stateScores[dim][val] || 0) + score;
  }

  const getScore = (dim, val) => (stateScores[dim] && stateScores[dim][val]) || 0;

  const teaWeights = {
    Black: getScore("Caffeine", "High") + getScore("Mind", "Energize") + getScore("Body", "Full"),
    Green: getScore("Caffeine", "Low") + getScore("Mind", "Relax") + getScore("Body", "Light"),
    Oolong:
      getScore("Caffeine", "Medium") +
      getScore("Mind", "Creative") +
      getScore("Mind", "Enjoy") +
      getScore("Body", "Smooth"),
  };

  if (getScore("Caffeine", "None") > 0) teaWeights.Green += 2;
  teaWeights.Green += getScore("Aroma", "Herbal");
  teaWeights.Oolong += getScore("Aroma", "Roasty");

  const fruitGate =
    getScore("Aroma", "Fruity") > 0 ||
    getScore("Sweet", "Tangy") > 0 ||
    getScore("Digestion", "Degrease") > 0;
  const flowerGate =
    getScore("Aroma", "Floral") > 0 ||
    getScore("Mind", "Relax") > 0 ||
    getScore("Body", "Smooth") > 0;

  let fruitWeights = {};
  if (fruitGate) {
    fruitWeights = {
      Lemon: getScore("Digestion", "Degrease") + getScore("Sweet", "Tangy"),
      Peach: getScore("Digestion", "Moisturize") + getScore("Sweet", "Heavy"),
      Hawthorn: getScore("Digestion", "Digest") + getScore("Sweet", "Tangy"),
      Pear: getScore("Digestion", "Moisturize") + getScore("Sweet", "Light"),
    };
  }

  let flowerWeights = {};
  if (flowerGate) {
    flowerWeights = {
      Jasmine: getScore("Mind", "Energize") + getScore("Body", "Light") + getScore("Nature", "Cool"),
      Osmanthus: getScore("Mind", "Enjoy") + getScore("Body", "Full") + getScore("Nature", "Warm"),
      Rose: getScore("Mind", "Enjoy") + getScore("Body", "Smooth") + getScore("Nature", "Neutral"),
      Chamomile: getScore("Mind", "Relax") + getScore("Body", "Smooth") + getScore("Nature", "Warm"),
    };
    if (getScore("Caffeine", "None") > 0) flowerWeights.Chamomile += 2;
    flowerWeights.Chamomile += getScore("Aroma", "Herbal");
  }

  let targetBase = weightedRandom(teaWeights) || "Oolong";
  let targetFlower = "None";
  if (flowerGate) {
    targetFlower = weightedRandom(flowerWeights);
    if (!targetFlower) targetFlower = Object.keys(flowerWeights)[0] || "Jasmine";
  }
  let targetFruit = "None";
  if (fruitGate) {
    targetFruit = weightedRandom(fruitWeights);
    if (!targetFruit) targetFruit = Object.keys(fruitWeights)[0] || "Lemon";
  }

  const targetBaseDisplay = TARGET_KEY_TO_DISPLAY[targetBase] || targetBase;
  const targetFlowerDisplay = TARGET_KEY_TO_DISPLAY[targetFlower] || targetFlower;
  const targetFruitDisplay = TARGET_KEY_TO_DISPLAY[targetFruit] || targetFruit;

  let bestScore = -1;
  let bestIndices = [];
  for (let i = 0; i < RECIPES.length; i++) {
    const s = scoreRecipe(RECIPES[i], targetBaseDisplay, targetFlowerDisplay, targetFruitDisplay);
    if (s > bestScore) {
      bestScore = s;
      bestIndices = [i];
    } else if (s === bestScore) {
      bestIndices.push(i);
    }
  }

  if (bestIndices.length === 0) bestIndices = [0];

  const spawnCounts = loadSpawnCounts();
  let chosenIdx = bestIndices[0];
  if (bestIndices.length > 1) {
    let minCount = Infinity;
    for (const i of bestIndices) {
      const nameKey = RECIPES[i].name;
      const c = spawnCounts[nameKey] || 0;
      if (c < minCount) {
        minCount = c;
        chosenIdx = i;
      }
    }
  }
  const chosenName = RECIPES[chosenIdx].name;
  spawnCounts[chosenName] = (spawnCounts[chosenName] || 0) + 1;
  saveSpawnCounts(spawnCounts);

  return {
    recipeIndex: chosenIdx,
    recipeName: RECIPES[chosenIdx].name,
    nameZh: RECIPE_META[chosenIdx].nameZh,
    materials: [...RECIPES[chosenIdx].materials],
    images: getRecipeImages(chosenIdx),
    shareUrl: getShareUrl(chosenIdx),
  };
}

/** @type {typeof calculateFinalTea} */
export { QUESTIONS, CATEGORY_NAMES, calculateFinalTea, RECIPE_META };
