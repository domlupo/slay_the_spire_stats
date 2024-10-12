import Chart from "chart.js/auto";
import parseJson, { JSONError } from "parse-json";

type StsFile = {
  // TODO: name of file
  character: Character;
  goldPerFloor: number[];
  floorReached: number;
  // TODO: items_purged
  playtimeSeconds: number;
  isAscensionMode: boolean;
  // TODO: campfire_choices
  neowCost: NeowCost;
  // TODO: master_deck
  relics: Relic[]; // TODO: verify what is relic start is it [] or undefined
  floorsPotionsUsed: number[];
  damageTaken: DamageTaken[];
  potionsObtained: PotionObtained[];
  floorPaths: FloorPath[];
  // TODO: items_purchased
  campfireRests: number;
  floorsItemsPurchased: number[];
  floorsHp: number[];
  // TODO: gold is this start or end gold?
  neowBonus: NeowBonus;
  isDaily: boolean;
  isSeeded: boolean;
  campfireUpgrades: number;
  // TODO: win_rate How does this differ than victor field?
  // TODO: timestamp is this epoch start or end time of run
  // TODO: build_version Not sure what this represents. It could be the last game change update e.g. card change.
  // or it could be the last time this file format changed.
  purgesPurchased: number;
  won: boolean;
  floorsMaxHp: number[];
  // TODO: card_choices
  relicsObtained: RelicObtained[];
  // TODO: event_choices
  bossRelicChoices: BossRelicChoice[];
  floorsItemPurged: number[];
  isEndless: boolean;
  floorsPotionsSpawned: number[];
  killedBy: Battle;
  ascensionLevel: number;
};

enum Character {
  Error,
  Ironclad,
  Silent,
  Defect,
  Watcher,
}

enum NeowCost {
  Error,
  NoPick, // TODO: verify '' -> no pick
  Curse,
  None,
  NoGold,
  PercentDamage,
  TenPercentHpLoss,
}

enum Relic {
  Error,
  Akabeko,
  Anchor,
  AncientTeaSet,
  ArtOfWar,
  Astrolabe,
  BagOfMarbles,
  BagOfPreparation,
  BirdFacedUrn,
  BlackBlood,
  BlackStar,
  BloodVial,
  BlueCandle,
  Boot,
  BottledFlame,
  BottledLightning,
  BottledTornado,
  Brimstone,
  BronzeScales,
  BurningBlood,
  BustedCrown,
  Cables,
  Calipers,
  CallingBell,
  CaptainsWheel,
  Cauldron,
  CentennialPuzzle,
  CeramicFish,
  ChampionBelt,
  CharonsAshes,
  ChemicalX,
  CloakClasp,
  ClockworkSouvenir,
  CoffeeDripper,
  CrackedCore,
  CultistMask,
  CursedKey,
  Damaru,
  DarkstonePeriapt,
  DataDisk,
  DeadBranch,
  DollysMirror,
  DreamCatcher,
  DuVuDoll,
  Ectoplasm,
  EmotionChip,
  EmptyCage,
  Enchiridion,
  EternalFeather,
  FossilizedHelix,
  FrozenEggTwo,
  FrozenEye,
  FrozenCore,
  FusionHammer,
  GamblingChip,
  Ginger,
  Girya,
  GoldenIdol,
  GoldenEye,
  GremlinHorn,
  HandDrill,
  HappyFlower,
  HolyWater,
  HornCleat,
  HoveringKite,
  IceCream,
  IncenseBurner,
  InkBottle,
  Inserter,
  JuzuBracelet,
  Kunai,
  Lantern,
  LeesWaffle,
  LetterOpener,
  LizardTail,
  MagicFlower,
  Mango,
  MarkOfPain,
  MarkOfTheBloom,
  Matryoshka,
  MawBank,
  MealTicket,
  MeatOnTheBone,
  MedicalKit,
  MembershipCard,
  MercuryHourglass,
  MoltenEggTwo,
  MummifiedHand,
  MutagenicStrength,
  Necronomicon,
  NeowsBlessing,
  NilrysCodex,
  NinjaScroll,
  NlothsGift,
  NuclearBattery,
  Nunchaku,
  OddMushroom,
  OddlySmoothStone,
  OldCoin,
  Omamori,
  OrangePellets,
  Orichalcum,
  OrnamentalFan,
  Orrery,
  PandorasBox,
  Pantograph,
  PaperCrane,
  PaperFrog,
  PeacePipe,
  Pear,
  PenNib,
  PhilosophersStone,
  Pocketwatch,
  PotionBelt,
  PrayerWheel,
  PreservedInsect,
  PureWater,
  QuestionCard,
  RedMask,
  RedSkull,
  RegalPillow,
  RingOfTheSerpent,
  RingofTheSnake,
  RunicCapacitor,
  RunicCube,
  RunicDome,
  RunicPyramid,
  SacredBark,
  SelfFormingClay,
  Shovel,
  Shuriken,
  SingingBowl,
  SlaversCollar,
  Sling,
  SmilingMask,
  SnakeSkull,
  SneckoEye,
  Sozu,
  StoneCalendar,
  StrangeSpoon,
  Strawberry,
  StrikeDummy,
  Sundial,
  SymbioticVirus,
  TeardropLocket,
  TheCourier,
  TheSpecimen,
  TheAbacus,
  ThreadAndNeedle,
  Tingsha,
  TinyChest,
  Torii,
  ToughBandages,
  ToxicEggTwo,
  ToyOrnithopter,
  TungstenRod,
  Turnip,
  TwistedFunnel,
  UnceasingTop,
  Vajra,
  VelvetChoker,
  VioletLotus,
  WarPaint,
  WarpedTongs,
  Whetstone,
  WhiteBeastStatue,
  WingedGreaves,
  WristBlade,
}

type DamageTaken = {
  damage: number;
  enemies: Battle;
  floor: number;
  turns: number;
};

type PotionObtained = {
  floor: number;
  potion: Potion;
};

enum Potion {
  Error,
  Ambrosia,
  Ancient,
  Attack,
  BlessingOfTheForge,
  Block,
  Blood,
  BottledMiracle,
  Colorless,
  Cultist,
  Cunning,
  Dexterity,
  DistilledChaos,
  Duplication,
  Elixir,
  Energy,
  EntropicBrew,
  EssenceOfDarkness,
  EssenceOfSteel,
  Explosive,
  Fairy,
  Fear,
  Fire,
  Focus,
  FruitJuice,
  GamblersBrew,
  GhostInAJar,
  HeartOfIron,
  LiquidBronze,
  LiquidMemories,
  Poison,
  PotionOfCapacity,
  Power,
  Regen,
  Skill,
  SmokeBomb,
  SneckoOil,
  Speed,
  Stance,
  Steroid,
  Strength,
  Swift,
  Weak,
}

enum FloorPath {
  Error,
  Boss,
  BossReward,
  Elite,
  Event,
  Monster,
  RestSite,
  Shop,
  Treasure,
}

enum NeowBonus {
  None,
  Error,
  BossRelic,
  OneHundredGold,
  OneRandomRareCard,
  OneRareRelic,
  RandomColorless,
  RandomColorlessTwo,
  RandomCommonRelic,
  RemoveOneCard,
  RemoveTwoCard,
  TenPercentHpBonus,
  ThreeCards,
  ThreeEnemyKill,
  ThreeRareCards,
  ThreeSmallPotions,
  TransformCard,
  TransformTwoCards,
  TwentyPercentHpBonus,
  TwoHundredFiftyGold,
  UpgradeCard,
}

type RelicObtained = {
  relic: Relic;
  floor: number;
};

type BossRelicChoice = {
  picked: BossRelic;
  notPicked: BossRelic[];
};

enum BossRelic {
  Error,
  None,
  Astrolabe,
  BlackBlood,
  BlackStar,
  BustedCrown,
  CallingBell,
  CoffeeDripper,
  CursedKey,
  Ectoplasm,
  EmptyCage,
  FrozenCore,
  FusionHammer,
  HolyWater,
  HoveringKite,
  Inserter,
  MarkOfPain,
  NuclearBattery,
  PandorasBox,
  PhilosophersStone,
  RingOfTheSerpent,
  RunicCube,
  RunicDome,
  RunicPyramid,
  SacredBark,
  SlaversCollar,
  SneckoEye,
  Sozu,
  TinyHouse,
  VelvetChoker,
  VioletLotus,
  WristBlade,
}

enum Battle {
  None,
  Error,
  TwoFungiBeasts,
  TwoLouse,
  TwoOrbWalkers,
  TwoTheives,
  ThreeByrds,
  ThreeCultists,
  ThreeDarklings,
  ThreeLouse,
  ThreeSentries,
  ThreeShapes,
  FourShapes,
  Automaton,
  AwakenedOne,
  BlueSlaver,
  BookOfStabbing,
  CenturionAndHealer,
  Champ,
  Chosen,
  ChosenAndByrds,
  Collector,
  ColosseumNobs,
  ColosseumSlavers,
  Cultist,
  CultistAndChosen,
  DonuAndDeca,
  ExordiumThugs,
  ExordiumWildlife,
  GiantHead,
  GremlinGang,
  GremlinLeader,
  GremlinNob,
  Hexaghost,
  JawWorm,
  JawWormHorde,
  Lagavulin,
  LagavulinEvent,
  LargeSlime,
  Looter,
  LotsOfSlimes,
  MaskedBandits,
  Maw,
  MindBloomBossBattle,
  Nemesis,
  OrbWalker,
  RedSlaver,
  Reptomancer,
  SentryAndSphere,
  ShellParasite,
  ShelledParasiteAndFungi,
  ShieldAndSpear,
  Slavers,
  SlimeBoss,
  SmallSlimes,
  SnakePlant,
  Snecko,
  SphereAndTwoShapes,
  SphericGuardian,
  SpireGrowth,
  TheGuardian,
  TheHeart,
  TheMushroomLair,
  TimeEater,
  Transient,
  WrithingMass,
}

const fileInput: HTMLElement = document.getElementById("data")!;
fileInput.addEventListener("change", (e: Event) => {
  let uploadedFiles = (<HTMLInputElement>e.target).files!;
  parseFiles(uploadedFiles);
});

// parses slay the spire .run json files
function parseFiles(files: FileList) {
  // need to filter expected non run files DEFECT, IRONCLAD, THE_SILENT, WATCHER
  let runFiles = [...files].filter((f) => f.name.includes(".run"));

  let readFiles: Promise<string | ArrayBuffer>[] = [];
  for (let i = 0; i < runFiles.length; i++) {
    let run = runFiles[i];
    let readFile: Promise<string | ArrayBuffer> = new Promise(
      (resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result!);
        };
        reader.onerror = () => {
          throw reject;
        };
        reader.readAsText(run);
      },
    );
    readFiles.push(readFile);
  }

  Promise.all(readFiles)
    .then((files) => {
      let stsFiles: StsFile[] = [];
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        if (typeof file === "string") {
          // TOOD: define a type for json format
          stsFiles.push(parseFile(file));
        } else {
          // skip ArrayBuffers
        }
      }
      graph(filter(stsFiles));
    })
    .catch((e) => {
      console.log(e);
    });
}

function parseFile(file: string): StsFile {
  let json = JSON.parse(file);

  let character: Character = Character.Error;
  let characterString: string = json.character_chosen;
  if (characterString === "IRONCLAD") {
    character = Character.Ironclad;
  } else if (characterString === "THE_SILENT") {
    character = Character.Silent;
  } else if (characterString === "DEFECT") {
    character = Character.Defect;
  } else if (characterString === "WATCHER") {
    character = Character.Watcher;
  } else {
    console.log("unexpected character chosen: ", characterString);
  }

  let neowCost: NeowCost = NeowCost.Error;
  let neowCostString: string = json.neow_cost;
  if (neowCostString === "") {
    neowCost = NeowCost.NoPick;
  } else if (neowCostString === "CURSE") {
    neowCost = NeowCost.Curse;
  } else if (neowCostString === "NONE") {
    neowCost = NeowCost.None;
  } else if (neowCostString === "NO_GOLD") {
    neowCost = NeowCost.NoGold;
  } else if (neowCostString === "PERCENT_DAMAGE") {
    neowCost = NeowCost.PercentDamage;
  } else if (neowCostString === "TEN_PERCENT_HP_LOSS") {
    neowCost = NeowCost.TenPercentHpLoss;
  } else {
    console.log("unexpected neow cost", neowCost);
  }

  let relics: Relic[] = [];
  let relicStrings: string[] = json.relics;
  for (let i = 0; i < relicStrings.length; i++) {
    relics.push(parseRelic(relicStrings[i]));
  }

  let floorPaths: FloorPath[] = [];
  let pathPerFloor = json.path_per_floor;
  for (let i = 0; i < pathPerFloor.length; i++) {
    let path = pathPerFloor[i];
    if (path === null) {
      floorPaths.push(FloorPath.BossReward);
    } else if (path === "B") {
      floorPaths.push(FloorPath.Boss);
    } else if (path === "M") {
      floorPaths.push(FloorPath.Monster);
    } else if (path === "E") {
      floorPaths.push(FloorPath.Elite);
    } else if (path === "?") {
      floorPaths.push(FloorPath.Event);
    } else if (path === "R") {
      floorPaths.push(FloorPath.RestSite);
    } else if (path === "$") {
      floorPaths.push(FloorPath.Shop);
    } else if (path === "T") {
      floorPaths.push(FloorPath.Treasure);
    } else {
      console.log("unexpected floor path: ", path);
    }
  }

  let damageTaken: DamageTaken[] = [];
  for (let i = 0; i < json.damage_taken.length; i++) {
    damageTaken.push({
      damage: json.damage_taken[i].damage,
      enemies: parseBattle(json.damage_taken[i].enemies),
      floor: json.damage_taken[i].floor,
      turns: json.damage_taken[i].turns,
    });
  }

  let potionsObtained: PotionObtained[] = [];
  for (let i = 0; i < json.potions_obtained.length; i++) {
    let potion = Potion.Error;
    let potionString: string = json.potions_obtained[i].key;
    if (potionString === "Ambrosia") {
      potion = Potion.Ambrosia;
    } else if (potionString === "Ancient Potion") {
      potion = Potion.Ancient;
    } else if (potionString === "AttackPotion") {
      potion = Potion.Attack;
    } else if (potionString === "BlessingOfTheForge") {
      potion = Potion.BlessingOfTheForge;
    } else if (potionString === "Block Potion") {
      potion = Potion.Block;
    } else if (potionString === "BloodPotion") {
      potion = Potion.Blood;
    } else if (potionString === "BottledMiracle") {
      potion = Potion.BottledMiracle;
    } else if (potionString === "ColorlessPotion") {
      potion = Potion.Colorless;
    } else if (potionString === "CultistPotion") {
      potion = Potion.Cultist;
    } else if (potionString === "CunningPotion") {
      potion = Potion.Cunning;
    } else if (potionString === "Dexterity Potion") {
      potion = Potion.Dexterity;
    } else if (potionString === "DistilledChaos") {
      potion = Potion.DistilledChaos;
    } else if (potionString === "DuplicationPotion") {
      potion = Potion.Duplication;
    } else if (potionString === "ElixirPotion") {
      potion = Potion.Elixir;
    } else if (potionString === "Energy Potion") {
      potion = Potion.Energy;
    } else if (potionString === "EntropicBrew") {
      potion = Potion.EntropicBrew;
    } else if (potionString === "EssenceOfDarkness") {
      potion = Potion.EssenceOfDarkness;
    } else if (potionString === "EssenceOfSteel") {
      potion = Potion.EssenceOfSteel;
    } else if (potionString === "Explosive Potion") {
      potion = Potion.Explosive;
    } else if (potionString === "FairyPotion") {
      potion = Potion.Fairy;
    } else if (potionString === "FearPotion") {
      potion = Potion.Fear;
    } else if (potionString === "Fire Potion") {
      potion = Potion.Fire;
    } else if (potionString === "FocusPotion") {
      potion = Potion.Focus;
    } else if (potionString === "Fruit Juice") {
      potion = Potion.FruitJuice;
    } else if (potionString === "GamblersBrew") {
      potion = Potion.GamblersBrew;
    } else if (potionString === "GhostInAJar") {
      potion = Potion.GhostInAJar;
    } else if (potionString === "HeartOfIron") {
      potion = Potion.HeartOfIron;
    } else if (potionString === "LiquidBronze") {
      potion = Potion.LiquidBronze;
    } else if (potionString === "LiquidMemories") {
      potion = Potion.LiquidMemories;
    } else if (potionString === "Poison Potion") {
      potion = Potion.Poison;
    } else if (potionString === "PotionOfCapacity") {
      potion = Potion.PotionOfCapacity;
    } else if (potionString === "PowerPotion") {
      potion = Potion.Power;
    } else if (potionString === "Regen Potion") {
      potion = Potion.Regen;
    } else if (potionString === "SkillPotion") {
      potion = Potion.Skill;
    } else if (potionString === "SmokeBomb") {
      potion = Potion.SmokeBomb;
    } else if (potionString === "SneckoOil") {
      potion = Potion.SneckoOil;
    } else if (potionString === "SpeedPotion") {
      potion = Potion.Speed;
    } else if (potionString === "StancePotion") {
      potion = Potion.Stance;
    } else if (potionString === "SteroidPotion") {
      potion = Potion.Steroid;
    } else if (potionString === "Strength Potion") {
      potion = Potion.Strength;
    } else if (potionString === "Swift Potion") {
      potion = Potion.Swift;
    } else if (potionString === "Weak Potion") {
      potion = Potion.Weak;
    } else {
      console.log("unexpected potion: " + potionString);
    }
    potionsObtained.push({
      potion,
      floor: json.potions_obtained[i].floor,
    });
  }

  let neowBonus: NeowBonus = NeowBonus.Error;
  let neowBonusString: string = json.neow_bonus;
  if (neowBonusString === "") {
    neowBonus = NeowBonus.None;
  } else if (neowBonusString === "BOSS_RELIC") {
    neowBonus = NeowBonus.BossRelic;
  } else if (neowBonusString === "HUNDRED_GOLD") {
    neowBonus = NeowBonus.OneHundredGold;
  } else if (neowBonusString === "ONE_RANDOM_RARE_CARD") {
    neowBonus = NeowBonus.OneRandomRareCard;
  } else if (neowBonusString === "ONE_RARE_RELIC") {
    neowBonus = NeowBonus.OneRareRelic;
  } else if (neowBonusString === "RANDOM_COLORLESS") {
    neowBonus = NeowBonus.RandomColorless;
  } else if (neowBonusString === "RANDOM_COLORLESS_2") {
    neowBonus = NeowBonus.RandomColorlessTwo;
  } else if (neowBonusString === "RANDOM_COMMON_RELIC") {
    neowBonus = NeowBonus.RandomCommonRelic;
  } else if (neowBonusString === "REMOVE_CARD") {
    neowBonus = NeowBonus.RemoveOneCard;
  } else if (neowBonusString === "REMOVE_TWO") {
    neowBonus = NeowBonus.RemoveTwoCard;
  } else if (neowBonusString === "TEN_PERCENT_HP_BONUS") {
    neowBonus = NeowBonus.TenPercentHpBonus;
  } else if (neowBonusString === "THREE_CARDS") {
    neowBonus = NeowBonus.ThreeCards;
  } else if (neowBonusString === "THREE_ENEMY_KILL") {
    neowBonus = NeowBonus.ThreeEnemyKill;
  } else if (neowBonusString === "THREE_RARE_CARDS") {
    neowBonus = NeowBonus.ThreeRareCards;
  } else if (neowBonusString === "THREE_SMALL_POTIONS") {
    neowBonus = NeowBonus.ThreeSmallPotions;
  } else if (neowBonusString === "TRANSFORM_CARD") {
    neowBonus = NeowBonus.TransformCard;
  } else if (neowBonusString === "TRANSFORM_TWO_CARDS") {
    neowBonus = NeowBonus.TransformTwoCards;
  } else if (neowBonusString === "TWENTY_PERCENT_HP_BONUS") {
    neowBonus = NeowBonus.TwentyPercentHpBonus;
  } else if (neowBonusString === "TWO_FIFTY_GOLD") {
    neowBonus = NeowBonus.TwoHundredFiftyGold;
  } else if (neowBonusString === "UPGRADE_CARD") {
    neowBonus = NeowBonus.UpgradeCard;
  } else {
    console.log("unexpected neow bonus: ", neowBonus);
  }

  let relicsObtained: RelicObtained[] = [];
  for (let i = 0; i < json.relics_obtained.length; i++) {
    relicsObtained.push({
      relic: parseRelic(json.relics_obtained[i].key),
      floor: json.relics_obtained[i].floor,
    });
  }

  let bossRelicChoices: BossRelicChoice[] = [];
  for (let i = 0; i < json.boss_relics.length; i++) {
    let notPicked: BossRelic[] = [];
    let notPickedStrings: string[] = json.boss_relics[i].not_picked;
    for (let j = 0; j < notPicked.length; j++) {
      notPicked.push(parseBossRelic(notPickedStrings[j]));
    }
    let bossRelicChoice: BossRelicChoice = {
      picked: parseBossRelic(json.boss_relics[i].picked),
      notPicked,
    };
    bossRelicChoices.push(bossRelicChoice);
  }

  return {
    character,
    goldPerFloor: json.gold_per_floor,
    floorReached: json.floor_reached,
    playtimeSeconds: json.playtime,
    isAscensionMode: json.is_ascension_mode,
    neowCost: json.neow_cost,
    relics,
    floorsPotionsUsed: json.potions_floor_usage,
    damageTaken,
    potionsObtained,
    floorPaths,
    campfireRests: json.campfire_rested,
    floorsItemsPurchased: json.item_purchase_floors,
    floorsHp: json.current_hp_per_floor,
    neowBonus,
    isDaily: json.is_daily,
    isSeeded: json.chose_seed,
    campfireUpgrades: json.campfire_upgraded,
    purgesPurchased: json.purchased_purges,
    won: json.victory,
    floorsMaxHp: json.max_hp_per_floor,
    relicsObtained,
    bossRelicChoices,
    floorsItemPurged: json.items_purged_floors,
    isEndless: json.is_endless,
    floorsPotionsSpawned: json.potions_floor_spawned,
    killedBy: parseBattle(json.killed_by),
    ascensionLevel: json.ascension_level,
  };
}

function parseBattle(battleString: undefined | string): Battle {
  let battle = Battle.Error;
  battleString =
    battleString === undefined
      ? undefined
      : battleString.toLowerCase().replace(/\s+/g, "");
  if (battleString === undefined) {
    battle = Battle.None;
  } else if (battleString === "2fungibeasts") {
    battle = Battle.TwoFungiBeasts;
  } else if (battleString === "2louse") {
    battle = Battle.TwoLouse;
  } else if (battleString === "2orbwalkers") {
    battle = Battle.TwoOrbWalkers;
  } else if (battleString === "2thieves") {
    battle = Battle.TwoTheives;
  } else if (battleString === "3byrds") {
    battle = Battle.ThreeByrds;
  } else if (battleString === "3cultists") {
    battle = Battle.ThreeCultists;
  } else if (battleString === "3darklings") {
    battle = Battle.ThreeDarklings;
  } else if (battleString === "3louse") {
    battle = Battle.ThreeLouse;
  } else if (battleString === "3sentries") {
    battle = Battle.ThreeSentries;
  } else if (battleString === "3shapes") {
    battle = Battle.ThreeShapes;
  } else if (battleString === "4shapes") {
    battle = Battle.FourShapes;
  } else if (battleString === "automaton") {
    battle = Battle.Automaton;
  } else if (battleString === "awakenedone") {
    battle = Battle.AwakenedOne;
  } else if (battleString === "blueslaver") {
    battle = Battle.BlueSlaver;
  } else if (battleString === "bookofstabbing") {
    battle = Battle.BookOfStabbing;
  } else if (battleString === "centurionandhealer") {
    battle = Battle.CenturionAndHealer;
  } else if (battleString === "champ") {
    battle = Battle.Champ;
  } else if (battleString === "chosen") {
    battle = Battle.Chosen;
  } else if (battleString === "chosenandbyrds") {
    battle = Battle.ChosenAndByrds;
  } else if (battleString === "collector") {
    battle = Battle.Collector;
  } else if (battleString === "colosseumnobs") {
    battle = Battle.ColosseumNobs;
  } else if (battleString === "colosseumslavers") {
    battle = Battle.ColosseumSlavers;
  } else if (battleString === "cultist") {
    battle = Battle.Cultist;
  } else if (battleString === "cultistandchosen") {
    battle = Battle.CultistAndChosen;
  } else if (battleString === "donuanddeca") {
    battle = Battle.DonuAndDeca;
  } else if (battleString === "exordiumthugs") {
    battle = Battle.ExordiumThugs;
  } else if (battleString === "exordiumwildlife") {
    battle = Battle.ExordiumWildlife;
  } else if (battleString === "gianthead") {
    battle = Battle.GiantHead;
  } else if (battleString === "gremlingang") {
    battle = Battle.GremlinGang;
  } else if (battleString === "gremlinleader") {
    battle = Battle.GremlinLeader;
  } else if (battleString === "gremlinnob") {
    battle = Battle.GremlinNob;
  } else if (battleString === "hexaghost") {
    battle = Battle.Hexaghost;
  } else if (battleString === "jawworm") {
    battle = Battle.JawWorm;
  } else if (battleString === "jawwormhorde") {
    battle = Battle.JawWormHorde;
  } else if (battleString === "lagavulin") {
    battle = Battle.Lagavulin;
  } else if (battleString === "lagavulinevent") {
    battle = Battle.LagavulinEvent;
  } else if (battleString === "largeslime") {
    battle = Battle.LargeSlime;
  } else if (battleString === "looter") {
    battle = Battle.Looter;
  } else if (battleString === "lotsofslimes") {
    battle = Battle.LotsOfSlimes;
  } else if (battleString === "maskedbandits") {
    battle = Battle.MaskedBandits;
  } else if (battleString === "maw") {
    battle = Battle.Maw;
  } else if (battleString === "mindbloombossbattle") {
    battle = Battle.MindBloomBossBattle;
  } else if (battleString === "nemesis") {
    battle = Battle.Nemesis;
  } else if (battleString === "orbwalker") {
    battle = Battle.OrbWalker;
  } else if (battleString === "redslaver") {
    battle = Battle.RedSlaver;
  } else if (battleString === "reptomancer") {
    battle = Battle.Reptomancer;
  } else if (battleString === "sentryandsphere") {
    battle = Battle.SentryAndSphere;
  } else if (battleString === "shellparasite") {
    battle = Battle.ShellParasite;
  } else if (battleString === "shelledparasiteandfungi") {
    battle = Battle.ShelledParasiteAndFungi;
  } else if (battleString === "shieldandspear") {
    battle = Battle.ShieldAndSpear;
  } else if (battleString === "slavers") {
    battle = Battle.Slavers;
  } else if (battleString === "slimeboss") {
    battle = Battle.SlimeBoss;
  } else if (battleString === "smallslimes") {
    battle = Battle.SmallSlimes;
  } else if (battleString === "snakeplant") {
    battle = Battle.SnakePlant;
  } else if (battleString === "snecko") {
    battle = Battle.Snecko;
  } else if (battleString === "sphereand2shapes") {
    battle = Battle.SphereAndTwoShapes;
  } else if (battleString === "sphericguardian") {
    battle = Battle.SphericGuardian;
  } else if (battleString === "spiregrowth") {
    battle = Battle.SpireGrowth;
  } else if (battleString === "theguardian") {
    battle = Battle.TheGuardian;
  } else if (battleString === "theheart") {
    battle = Battle.TheHeart;
  } else if (battleString === "themushroomlair") {
    battle = Battle.TheMushroomLair;
  } else if (battleString === "timeeater") {
    battle = Battle.TimeEater;
  } else if (battleString === "transient") {
    battle = Battle.Transient;
  } else if (battleString === "writhingmass") {
    battle = Battle.WrithingMass;
  } else {
    console.log("unexpected battle: ", battleString);
  }
  return battle;
}

function parseRelic(relicString: string): Relic {
  let relic = Relic.Error;
  relicString = relicString.toLocaleLowerCase().replace(/\s+/g, "");
  if (relicString === "akabeko") {
    relic = Relic.Akabeko;
  } else if (relicString === "anchor") {
    relic = Relic.Anchor;
  } else if (relicString === "ancientteaset") {
    relic = Relic.AncientTeaSet;
  } else if (relicString === "artofwar") {
    relic = Relic.ArtOfWar;
  } else if (relicString === "astrolabe") {
    relic = Relic.Astrolabe;
  } else if (relicString === "bagofmarbles") {
    relic = Relic.BagOfMarbles;
  } else if (relicString === "bagofpreparation") {
    relic = Relic.BagOfPreparation;
  } else if (relicString === "birdfacedurn") {
    relic = Relic.BirdFacedUrn;
  } else if (relicString === "blackblood") {
    relic = Relic.BlackBlood;
  } else if (relicString === "blackstar") {
    relic = Relic.BlackStar;
  } else if (relicString === "bloodvial") {
    relic = Relic.BloodVial;
  } else if (relicString === "bluecandle") {
    relic = Relic.BlueCandle;
  } else if (relicString === "boot") {
    relic = Relic.Boot;
  } else if (relicString === "bottledflame") {
    relic = Relic.BottledFlame;
  } else if (relicString === "bottledlightning") {
    relic = Relic.BottledLightning;
  } else if (relicString === "bottledtornado") {
    relic = Relic.BottledTornado;
  } else if (relicString === "brimstone") {
    relic = Relic.Brimstone;
  } else if (relicString === "bronzescales") {
    relic = Relic.BronzeScales;
  } else if (relicString === "burningblood") {
    relic = Relic.BurningBlood;
  } else if (relicString === "bustedcrown") {
    relic = Relic.BustedCrown;
  } else if (relicString === "cables") {
    relic = Relic.Cables;
  } else if (relicString === "calipers") {
    relic = Relic.Calipers;
  } else if (relicString === "callingbell") {
    relic = Relic.CallingBell;
  } else if (relicString === "captainswheel") {
    relic = Relic.CaptainsWheel;
  } else if (relicString === "cauldron") {
    relic = Relic.Cauldron;
  } else if (relicString === "centennialpuzzle") {
    relic = Relic.CentennialPuzzle;
  } else if (relicString === "ceramicfish") {
    relic = Relic.CeramicFish;
  } else if (relicString === "championbelt") {
    relic = Relic.ChampionBelt;
  } else if (relicString === "charon'sashes") {
    relic = Relic.CharonsAshes;
  } else if (relicString === "chemicalx") {
    relic = Relic.ChemicalX;
  } else if (relicString === "cloakclasp") {
    relic = Relic.CloakClasp;
  } else if (relicString === "clockworksouvenir") {
    relic = Relic.ClockworkSouvenir;
  } else if (relicString === "coffeedripper") {
    relic = Relic.CoffeeDripper;
  } else if (relicString === "crackedcore") {
    relic = Relic.CrackedCore;
  } else if (relicString === "cultistmask") {
    relic = Relic.CultistMask;
  } else if (relicString === "cursedkey") {
    relic = Relic.CursedKey;
  } else if (relicString === "damaru") {
    relic = Relic.Damaru;
  } else if (relicString === "darkstoneperiapt") {
    relic = Relic.DarkstonePeriapt;
  } else if (relicString === "datadisk") {
    relic = Relic.DataDisk;
  } else if (relicString === "deadbranch") {
    relic = Relic.DeadBranch;
  } else if (relicString === "dollysmirror") {
    relic = Relic.DollysMirror;
  } else if (relicString === "dreamcatcher") {
    relic = Relic.DreamCatcher;
  } else if (relicString === "du-vudoll") {
    relic = Relic.DuVuDoll;
  } else if (relicString === "ectoplasm") {
    relic = Relic.Ectoplasm;
  } else if (relicString === "emotionchip") {
    relic = Relic.EmotionChip;
  } else if (relicString === "emptycage") {
    relic = Relic.EmptyCage;
  } else if (relicString === "enchiridion") {
    relic = Relic.Enchiridion;
  } else if (relicString === "eternalfeather") {
    relic = Relic.EternalFeather;
  } else if (relicString === "fossilizedhelix") {
    relic = Relic.FossilizedHelix;
  } else if (relicString === "frozenegg2") {
    relic = Relic.FrozenEggTwo;
  } else if (relicString === "frozeneye") {
    relic = Relic.FrozenEye;
  } else if (relicString === "frozencore") {
    relic = Relic.FrozenCore;
  } else if (relicString === "fusionhammer") {
    relic = Relic.FusionHammer;
  } else if (relicString === "gamblingchip") {
    relic = Relic.GamblingChip;
  } else if (relicString === "ginger") {
    relic = Relic.Ginger;
  } else if (relicString === "girya") {
    relic = Relic.Girya;
  } else if (relicString === "goldenidol") {
    relic = Relic.GoldenIdol;
  } else if (relicString === "goldeneye") {
    relic = Relic.GoldenEye;
  } else if (relicString === "gremlinhorn") {
    relic = Relic.GremlinHorn;
  } else if (relicString === "handdrill") {
    relic = Relic.HandDrill;
  } else if (relicString === "happyflower") {
    relic = Relic.HappyFlower;
  } else if (relicString === "holywater") {
    relic = Relic.HolyWater;
  } else if (relicString === "horncleat") {
    relic = Relic.HornCleat;
  } else if (relicString === "hoveringkite") {
    relic = Relic.HoveringKite;
  } else if (relicString === "icecream") {
    relic = Relic.IceCream;
  } else if (relicString === "incenseburner") {
    relic = Relic.IncenseBurner;
  } else if (relicString === "inkbottle") {
    relic = Relic.InkBottle;
  } else if (relicString === "inserter") {
    relic = Relic.Inserter;
  } else if (relicString === "juzubracelet") {
    relic = Relic.JuzuBracelet;
  } else if (relicString === "kunai") {
    relic = Relic.Kunai;
  } else if (relicString === "lantern") {
    relic = Relic.Lantern;
  } else if (relicString === "lee'swaffle") {
    relic = Relic.LeesWaffle;
  } else if (relicString === "letteropener") {
    relic = Relic.LetterOpener;
  } else if (relicString === "lizardtail") {
    relic = Relic.LizardTail;
  } else if (relicString === "magicflower") {
    relic = Relic.MagicFlower;
  } else if (relicString === "mango") {
    relic = Relic.Mango;
  } else if (relicString === "markofpain") {
    relic = Relic.MarkOfPain;
  } else if (relicString === "markofthebloom") {
    relic = Relic.MarkOfTheBloom;
  } else if (relicString === "matryoshka") {
    relic = Relic.Matryoshka;
  } else if (relicString === "mawbank") {
    relic = Relic.MawBank;
  } else if (relicString === "mealticket") {
    relic = Relic.MealTicket;
  } else if (relicString === "meatonthebone") {
    relic = Relic.MeatOnTheBone;
  } else if (relicString === "medicalkit") {
    relic = Relic.MedicalKit;
  } else if (relicString === "membershipcard") {
    relic = Relic.MembershipCard;
  } else if (relicString === "mercuryhourglass") {
    relic = Relic.MercuryHourglass;
  } else if (relicString === "moltenegg2") {
    relic = Relic.MoltenEggTwo;
  } else if (relicString === "mummifiedhand") {
    relic = Relic.MummifiedHand;
  } else if (relicString === "mutagenicstrength") {
    relic = Relic.MutagenicStrength;
  } else if (relicString === "necronomicon") {
    relic = Relic.Necronomicon;
  } else if (relicString === "neowsblessing") {
    relic = Relic.NeowsBlessing;
  } else if (relicString === "nilry'scodex") {
    relic = Relic.NilrysCodex;
  } else if (relicString === "ninjascroll") {
    relic = Relic.NinjaScroll;
  } else if (relicString === "nloth'sgift") {
    relic = Relic.NlothsGift;
  } else if (relicString === "nuclearbattery") {
    relic = Relic.NuclearBattery;
  } else if (relicString === "nunchaku") {
    relic = Relic.Nunchaku;
  } else if (relicString === "oddmushroom") {
    relic = Relic.OddMushroom;
  } else if (relicString === "oddlysmoothstone") {
    relic = Relic.OddlySmoothStone;
  } else if (relicString === "oldcoin") {
    relic = Relic.OldCoin;
  } else if (relicString === "omamori") {
    relic = Relic.Omamori;
  } else if (relicString === "orangepellets") {
    relic = Relic.OrangePellets;
  } else if (relicString === "orichalcum") {
    relic = Relic.Orichalcum;
  } else if (relicString === "ornamentalfan") {
    relic = Relic.OrnamentalFan;
  } else if (relicString === "orrery") {
    relic = Relic.Orrery;
  } else if (relicString === "pandora'sbox") {
    relic = Relic.PandorasBox;
  } else if (relicString === "pantograph") {
    relic = Relic.Pantograph;
  } else if (relicString === "papercrane") {
    relic = Relic.PaperCrane;
  } else if (relicString === "paperfrog") {
    relic = Relic.PaperFrog;
  } else if (relicString === "peacepipe") {
    relic = Relic.PeacePipe;
  } else if (relicString === "pear") {
    relic = Relic.Pear;
  } else if (relicString === "pennib") {
    relic = Relic.PenNib;
  } else if (relicString === "philosopher'sstone") {
    relic = Relic.PhilosophersStone;
  } else if (relicString === "pocketwatch") {
    relic = Relic.Pocketwatch;
  } else if (relicString === "potionbelt") {
    relic = Relic.PotionBelt;
  } else if (relicString === "prayerwheel") {
    relic = Relic.PrayerWheel;
  } else if (relicString === "preservedinsect") {
    relic = Relic.PreservedInsect;
  } else if (relicString === "purewater") {
    relic = Relic.PureWater;
  } else if (relicString === "questioncard") {
    relic = Relic.QuestionCard;
  } else if (relicString === "redmask") {
    relic = Relic.RedMask;
  } else if (relicString === "redskull") {
    relic = Relic.RedSkull;
  } else if (relicString === "regalpillow") {
    relic = Relic.RegalPillow;
  } else if (relicString === "ringoftheserpent") {
    relic = Relic.RingOfTheSerpent;
  } else if (relicString === "ringofthesnake") {
    relic = Relic.RingofTheSnake;
  } else if (relicString === "runiccapacitor") {
    relic = Relic.RunicCapacitor;
  } else if (relicString === "runiccube") {
    relic = Relic.RunicCube;
  } else if (relicString === "runicdome") {
    relic = Relic.RunicDome;
  } else if (relicString === "runicpyramid") {
    relic = Relic.RunicPyramid;
  } else if (relicString === "sacredbark") {
    relic = Relic.SacredBark;
  } else if (relicString === "selfformingclay") {
    relic = Relic.SelfFormingClay;
  } else if (relicString === "shovel") {
    relic = Relic.Shovel;
  } else if (relicString === "shuriken") {
    relic = Relic.Shuriken;
  } else if (relicString === "singingbowl") {
    relic = Relic.SingingBowl;
  } else if (relicString === "slaverscollar") {
    relic = Relic.SlaversCollar;
  } else if (relicString === "sling") {
    relic = Relic.Sling;
  } else if (relicString === "smilingmask") {
    relic = Relic.SmilingMask;
  } else if (relicString === "snakeskull") {
    relic = Relic.SnakeSkull;
  } else if (relicString === "sneckoeye") {
    relic = Relic.SneckoEye;
  } else if (relicString === "sozu") {
    relic = Relic.Sozu;
  } else if (relicString === "stonecalendar") {
    relic = Relic.StoneCalendar;
  } else if (relicString === "strangespoon") {
    relic = Relic.StrangeSpoon;
  } else if (relicString === "strawberry") {
    relic = Relic.Strawberry;
  } else if (relicString === "strikedummy") {
    relic = Relic.StrikeDummy;
  } else if (relicString === "sundial") {
    relic = Relic.Sundial;
  } else if (relicString === "symbioticvirus") {
    relic = Relic.SymbioticVirus;
  } else if (relicString === "teardroplocket") {
    relic = Relic.TeardropLocket;
  } else if (relicString === "thecourier") {
    relic = Relic.TheCourier;
  } else if (relicString === "thespecimen") {
    relic = Relic.TheSpecimen;
  } else if (relicString === "theabacus") {
    relic = Relic.TheAbacus;
  } else if (relicString === "threadandneedle") {
    relic = Relic.ThreadAndNeedle;
  } else if (relicString === "tingsha") {
    relic = Relic.Tingsha;
  } else if (relicString === "tinychest") {
    relic = Relic.TinyChest;
  } else if (relicString === "torii") {
    relic = Relic.Torii;
  } else if (relicString === "toughbandages") {
    relic = Relic.ToughBandages;
  } else if (relicString === "toxicegg2") {
    relic = Relic.ToxicEggTwo;
  } else if (relicString === "toyornithopter") {
    relic = Relic.ToyOrnithopter;
  } else if (relicString === "tungstenrod") {
    relic = Relic.TungstenRod;
  } else if (relicString === "turnip") {
    relic = Relic.Turnip;
  } else if (relicString === "twistedfunnel") {
    relic = Relic.TwistedFunnel;
  } else if (relicString === "unceasingtop") {
    relic = Relic.UnceasingTop;
  } else if (relicString === "vajra") {
    relic = Relic.Vajra;
  } else if (relicString === "velvetchoker") {
    relic = Relic.VelvetChoker;
  } else if (relicString === "violetlotus") {
    relic = Relic.VioletLotus;
  } else if (relicString === "warpaint") {
    relic = Relic.WarPaint;
  } else if (relicString === "warpedtongs") {
    relic = Relic.WarpedTongs;
  } else if (relicString === "whetstone") {
    relic = Relic.Whetstone;
  } else if (relicString === "whitebeaststatue") {
    relic = Relic.WhiteBeastStatue;
  } else if (relicString === "wingedgreaves") {
    relic = Relic.WingedGreaves;
  } else if (relicString === "wristblade") {
    relic = Relic.WristBlade;
  } else {
    console.log("unexpected relic: ", relicString);
  }
  return relic;
}

function parseBossRelic(bossRelicString: string): BossRelic {
  let bossRelic: BossRelic = BossRelic.Error;
  if (bossRelicString === undefined) {
    bossRelic = BossRelic.None;
  } else if (bossRelicString === "Astrolabe") {
    bossRelic = BossRelic.Astrolabe;
  } else if (bossRelicString === "Black Blood") {
    bossRelic = BossRelic.BlackBlood;
  } else if (bossRelicString === "Black Star") {
    bossRelic = BossRelic.BlackStar;
  } else if (bossRelicString === "Busted Crown") {
    bossRelic = BossRelic.BustedCrown;
  } else if (bossRelicString === "Calling Bell") {
    bossRelic = BossRelic.CallingBell;
  } else if (bossRelicString === "Coffee Dripper") {
    bossRelic = BossRelic.CoffeeDripper;
  } else if (bossRelicString === "Cursed Key") {
    bossRelic = BossRelic.CursedKey;
  } else if (bossRelicString === "Ectoplasm") {
    bossRelic = BossRelic.Ectoplasm;
  } else if (bossRelicString === "Empty Cage") {
    bossRelic = BossRelic.EmptyCage;
  } else if (bossRelicString === "FrozenCore") {
    bossRelic = BossRelic.FrozenCore;
  } else if (bossRelicString === "Fusion Hammer") {
    bossRelic = BossRelic.FusionHammer;
  } else if (bossRelicString === "HolyWater") {
    bossRelic = BossRelic.HolyWater;
  } else if (bossRelicString === "HoveringKite") {
    bossRelic = BossRelic.HoveringKite;
  } else if (bossRelicString === "Inserter") {
    bossRelic = BossRelic.Inserter;
  } else if (bossRelicString === "Mark of Pain") {
    bossRelic = BossRelic.MarkOfPain;
  } else if (bossRelicString === "Nuclear Battery") {
    bossRelic = BossRelic.NuclearBattery;
  } else if (bossRelicString === "Pandora's Box") {
    bossRelic = BossRelic.PandorasBox;
  } else if (bossRelicString === "Philosopher's Stone") {
    bossRelic = BossRelic.PhilosophersStone;
  } else if (bossRelicString === "Ring of the Serpent") {
    bossRelic = BossRelic.RingOfTheSerpent;
  } else if (bossRelicString === "Runic Cube") {
    bossRelic = BossRelic.RunicCube;
  } else if (bossRelicString === "Runic Dome") {
    bossRelic = BossRelic.RunicDome;
  } else if (bossRelicString === "Runic Pyramid") {
    bossRelic = BossRelic.RunicPyramid;
  } else if (bossRelicString === "SacredBark") {
    bossRelic = BossRelic.SacredBark;
  } else if (bossRelicString === "SlaversCollar") {
    bossRelic = BossRelic.SlaversCollar;
  } else if (bossRelicString === "Snecko Eye") {
    bossRelic = BossRelic.SneckoEye;
  } else if (bossRelicString === "Sozu") {
    bossRelic = BossRelic.Sozu;
  } else if (bossRelicString === "Tiny House") {
    bossRelic = BossRelic.TinyHouse;
  } else if (bossRelicString === "Velvet Choker") {
    bossRelic = BossRelic.VelvetChoker;
  } else if (bossRelicString === "VioletLotus") {
    bossRelic = BossRelic.VioletLotus;
  } else if (bossRelicString === "WristBlade") {
    bossRelic = BossRelic.WristBlade;
  } else {
    console.log("unexpected boss relic: ", bossRelicString);
  }
  return bossRelic;
}

function filter(files: StsFile[]): StsFile[] {
  // TODO: filter daily, seeded, endless, etc
  return files;
}

async function graph(files: StsFile[]) {
  let ironcladCount = 0;
  let silentCount = 0;
  let defectCount = 0;
  let watcherCount = 0;
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    if (file.character === Character.Ironclad) {
      ironcladCount++;
    } else if (file.character === Character.Silent) {
      silentCount++;
    } else if (file.character === Character.Defect) {
      defectCount++;
    } else if (file.character === Character.Watcher) {
      watcherCount++;
    }
  }
  const data = [
    { played: "Ironclad", count: ironcladCount },
    { played: "Silent", count: silentCount },
    { played: "Defect", count: defectCount },
    { played: "Watcher", count: watcherCount },
  ];

  new Chart(document.getElementById("graphs")!, {
    type: "bar",
    data: {
      labels: data.map((row) => row.played),
      datasets: [
        {
          label: "Times character played",
          data: data.map((row) => row.count),
        },
      ],
    },
  });
}
