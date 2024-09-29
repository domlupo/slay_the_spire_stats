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
  relics: Relic[];
  floorsPotionsUsed: number[];
  // TODO: damage_taken
  // TODO: potions_obtained
  floorPaths: FloorPath[];
  // TODO: items_purchased
  campfireRests: number;
  floorsItemsPurchased: number[];
  floorsHp: number[];
  // TODO: gold is this start or end gold?
  // TODO: neow_bonus
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
  // TODO: relics_obtained
  // TODO: event_choices
  // TODO: boss_relics
  floorsItemPurged: number[];
  isEndless: boolean;
  floorsPotionsSpawned: number[];
  killedBy: KilledBy;
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

enum KilledBy {
  None,
  Error,
  TwoOrbWalkers,
  ThreeByrds,
  ThreeCultists,
  ThreeDarklings,
  ThreeSentries,
  Automaton,
  AwakenedOne,
  BlueSlaver,
  BookOfStabbing,
  CenturionAndHealer,
  Champ,
  Chosen,
  ChosenAndByrds,
  Collector,
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
  Lagavulin,
  MaskedBandits,
  Nemesis,
  Reptomancer,
  ShelledParasiteAndFungi,
  ShieldAndSpear,
  Slavers,
  SlimeBoss,
  SnakePlant,
  SphereAndTwoShapes,
  TheGuardian,
  TheHeart,
  TimeEater,
  Transient,
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

  // TODO: verify what is relic start is it [] or undefined
  let relics: Relic[] = [];
  let relicStrings: string[] = json.relics;
  for (let i = 0; i < relicStrings.length; i++) {
    let relic = Relic.Error;
    let relicString = relicStrings[i].toLocaleLowerCase().replace(/\s+/g, "");
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
    relics.push(relic);
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

  let killedBy: KilledBy = KilledBy.Error;
  let killedByString: string =
    json.killed_by === undefined
      ? undefined
      : json.killed_by.toLowerCase().replace(/\s+/g, "");
  if (killedByString === undefined) {
    killedBy = KilledBy.None;
  } else if (killedByString === "2orbwalkers") {
    killedBy = KilledBy.TwoOrbWalkers;
  } else if (killedByString === "3byrds") {
    killedBy = KilledBy.ThreeByrds;
  } else if (killedByString === "3cultists") {
    killedBy = KilledBy.ThreeCultists;
  } else if (killedByString === "3darklings") {
    killedBy = KilledBy.ThreeDarklings;
  } else if (killedByString === "3sentries") {
    killedBy = KilledBy.ThreeSentries;
  } else if (killedByString === "automaton") {
    killedBy = KilledBy.Automaton;
  } else if (killedByString === "awakenedone") {
    killedBy = KilledBy.AwakenedOne;
  } else if (killedByString === "blueslaver") {
    killedBy = KilledBy.BlueSlaver;
  } else if (killedByString === "bookofstabbing") {
    killedBy = KilledBy.BookOfStabbing;
  } else if (killedByString === "centurionandhealer") {
    killedBy = KilledBy.CenturionAndHealer;
  } else if (killedByString === "champ") {
    killedBy = KilledBy.Champ;
  } else if (killedByString === "chosen") {
    killedBy = KilledBy.Chosen;
  } else if (killedByString === "chosenandbyrds") {
    killedBy = KilledBy.ChosenAndByrds;
  } else if (killedByString === "collector") {
    killedBy = KilledBy.Collector;
  } else if (killedByString === "cultist") {
    killedBy = KilledBy.Cultist;
  } else if (killedByString === "cultistandchosen") {
    killedBy = KilledBy.CultistAndChosen;
  } else if (killedByString === "donuanddeca") {
    killedBy = KilledBy.DonuAndDeca;
  } else if (killedByString === "exordiumthugs") {
    killedBy = KilledBy.ExordiumThugs;
  } else if (killedByString === "exordiumwildlife") {
    killedBy = KilledBy.ExordiumWildlife;
  } else if (killedByString === "gianthead") {
    killedBy = KilledBy.GiantHead;
  } else if (killedByString === "gremlingang") {
    killedBy = KilledBy.GremlinGang;
  } else if (killedByString === "gremlinleader") {
    killedBy = KilledBy.GremlinLeader;
  } else if (killedByString === "gremlinnob") {
    killedBy = KilledBy.GremlinNob;
  } else if (killedByString === "hexaghost") {
    killedBy = KilledBy.Hexaghost;
  } else if (killedByString === "lagavulin") {
    killedBy = KilledBy.Lagavulin;
  } else if (killedByString === "maskedbandits") {
    killedBy = KilledBy.MaskedBandits;
  } else if (killedByString === "nemesis") {
    killedBy = KilledBy.Nemesis;
  } else if (killedByString === "reptomancer") {
    killedBy = KilledBy.Reptomancer;
  } else if (killedByString === "shelledparasiteandfungi") {
    killedBy = KilledBy.ShelledParasiteAndFungi;
  } else if (killedByString === "shieldandspear") {
    killedBy = KilledBy.ShieldAndSpear;
  } else if (killedByString === "slavers") {
    killedBy = KilledBy.Slavers;
  } else if (killedByString === "slimeboss") {
    killedBy = KilledBy.SlimeBoss;
  } else if (killedByString === "snakeplant") {
    killedBy = KilledBy.SnakePlant;
  } else if (killedByString === "sphereand2shapes") {
    killedBy = KilledBy.SphereAndTwoShapes;
  } else if (killedByString === "theguardian") {
    killedBy = KilledBy.TheGuardian;
  } else if (killedByString === "theheart") {
    killedBy = KilledBy.TheHeart;
  } else if (killedByString === "timeeater") {
    killedBy = KilledBy.TimeEater;
  } else if (killedByString === "transient") {
    killedBy = KilledBy.Transient;
  } else {
    console.log("unexpected killed by: ", killedByString);
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
    floorPaths,
    campfireRests: json.campfire_rested,
    floorsItemsPurchased: json.item_purchase_floors,
    floorsHp: json.current_hp_per_floor,
    isDaily: json.is_daily,
    isSeeded: json.chose_seed,
    campfireUpgrades: json.campfire_upgraded,
    purgesPurchased: json.purchased_purges,
    won: json.victory,
    floorsMaxHp: json.max_hp_per_floor,
    floorsItemPurged: json.items_purged_floors,
    isEndless: false,
    floorsPotionsSpawned: json.potions_floor_spawned,
    killedBy,
    ascensionLevel: json.ascension_level,
  };
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
