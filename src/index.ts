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
  masterDeck: Card[];
  relics: Relic[]; // TODO: verify what is relic start is it [] or undefined
  floorsPotionsUsed: number[];
  damageTaken: DamageTaken[];
  potionsObtained: PotionObtained[];
  floorPaths: FloorPath[];
  itemsPurchased: ItemPurchase[];
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
  won: boolean; // This field is always set. Starts as false. Becomes true once finishing act 3 or finishing act 4. Does not become true if you die to heart.
  floorsMaxHp: number[];
  cardChoices: CardChoice[];
  relicsObtained: RelicObtained[];
  // TODO: event_choices
  bossRelicChoices: BossRelicChoice[];
  floorsItemPurged: number[];
  isEndless: boolean;
  floorsPotionsSpawned: number[];
  killedBy: Battle; // This field is not set until death occurs. e.g. abandoning a run does not set it.
  ascensionLevel: number;
};

type ItemPurchase = {
  item?: Card | Relic | Potion;
  selection: ItemSelection;
};

enum ItemSelection {
  Error,
  Card,
  Relic,
  Potion,
}

enum Character {
  Error,
  Ironclad,
  Silent,
  Defect,
  Watcher,
}

type CardChoice = {
  picked?: Card;
  notPicked: Card[];
  floor: number;
  selection: CardSelection;
};

enum CardSelection {
  Card,
  Skip,
  SingingBowl,
}

type Card = {
  name: CardName;
  upgraded: boolean; // Searing blow can be upgraded multiple times. Fixing this edge case is low priority.
  // Ignore multiple card version edge case e.g. WraithForm, etc
};

enum CardName {
  Error,
  None,
  AThousandCuts,
  Accuracy,
  Acrobatics,
  Adaptation,
  Adrenaline,
  AfterImage,
  Aggregate,
  AllForOne,
  AllOutAttack,
  Alpha,
  Amplify,
  Anger,
  Apotheosis,
  Armaments,
  AscendersBane,
  AutoShields,
  Backflip,
  Backstab,
  BallLightning,
  BandageUp,
  Bane,
  Barrage,
  Barricade,
  Bash,
  BattleTrance,
  BattleHymn,
  BeamCell,
  Berserk,
  Beta,
  BiasedCognition,
  Bite,
  BladeDance,
  Blasphemy,
  Blizzard,
  BloodForBlood,
  Bloodletting,
  Bludgeon,
  Blur,
  BodySlam,
  BootSequence,
  BouncingFlask,
  BowlingBash,
  Brilliance,
  Brutality,
  Buffer,
  BulletTime,
  BurningPact,
  Burst,
  CalculatedGamble,
  Caltrops,
  Capacitor,
  Carnage,
  CarveReality,
  Catalyst,
  Chaos,
  Chill,
  Choke,
  Chrysalis,
  Clash,
  ClearTheMind,
  Cleave,
  CloakAndDagger,
  Clothesline,
  Clumsy,
  ColdSnap,
  Collect,
  Combust,
  CompileDriver,
  Concentrate,
  Conclude,
  ConjureBlade,
  Consecrate,
  ConserveBattery,
  Consume,
  Coolheaded,
  CoreSurge,
  CorpseExplosion,
  Corruption,
  CreativeAI,
  Crescendo,
  CripplingPoison,
  CrushJoints,
  CurseOfTheBell,
  CutThroughFate,
  DaggerSpray,
  DaggerThrow,
  DarkEmbrace,
  DarkShackles,
  Darkness,
  Dash,
  DeadlyPoison,
  Decay,
  DeceiveReality,
  DeepBreath,
  Defend,
  Deflect,
  Defragment,
  DemonForm,
  DeusExMachina,
  DevaForm,
  Devotion,
  DieDieDie,
  Disarm,
  Discovery,
  Distraction,
  DodgeAndRoll,
  DoomAndGloom,
  Doppelganger,
  DoubleEnergy,
  DoubleTap,
  Doubt,
  DramaticEntrance,
  Dropkick,
  DualWield,
  Dualcast,
  EchoForm,
  Electrodynamics,
  EmptyBody,
  EmptyFist,
  EmptyMind,
  EndlessAgony,
  Enlightenment,
  Entrench,
  Envenom,
  Eruption,
  EscapePlan,
  Establishment,
  Evaluate,
  Eviscerate,
  Evolve,
  Exhume,
  Expertise,
  FTL,
  Fasting,
  FearNoEvil,
  Feed,
  FeelNoPain,
  FiendFire,
  Finesse,
  Finisher,
  FireBreathing,
  Fission,
  FlameBarrier,
  Flechettes,
  Flex,
  FlurryOfBlows,
  FlyingKnee,
  FlyingSleeves,
  FollowUp,
  Footwork,
  ForceField,
  ForeignInfluence,
  Fusion,
  Gash,
  GeneticAlgorithm,
  Ghostly,
  GhostlyArmor,
  Glacier,
  GlassKnife,
  GoForTheEyes,
  GrandFinale,
  Halt,
  HandOfGreed,
  Havoc,
  Headbutt,
  Heatsinks,
  HeavyBlade,
  HeelHook,
  HelloWorld,
  Hemokinesis,
  Hologram,
  Hyperbeam,
  Immolate,
  Impatience,
  Impervious,
  Indignation,
  InfernalBlade,
  InfiniteBlades,
  Inflame,
  Injury,
  InnerPeace,
  Intimidate,
  IronWave,
  Judgement,
  Juggernaut,
  JustLucky,
  Leap,
  LegSweep,
  LessonLearned,
  LikeWater,
  LimitBreak,
  Lockon,
  Loop,
  MachineLearning,
  Madness,
  Magnetism,
  Malaise,
  MasterOfStrategy,
  MasterfulStab,
  MasterReality,
  Mayhem,
  Meditate,
  Melter,
  MentalFortress,
  Metallicize,
  Metamorphosis,
  MeteorStrike,
  MindBlast,
  MultiCast,
  Necronomicurse,
  Neutralize,
  NightTerror,
  Nirvana,
  NoxiousFumes,
  Offering,
  Omega,
  Omniscience,
  Outmaneuver,
  Panacea,
  Panache,
  PanicButton,
  Parasite,
  PerfectedStrike,
  Perseverance,
  PhantasmalKiller,
  PiercingWail,
  PoisonedStab,
  PommelStrike,
  PowerThrough,
  Pray,
  Predator,
  Prepared,
  PressurePoints,
  Prostrate,
  Protect,
  Pummel,
  Purity,
  QuickSlash,
  Rage,
  Ragnarok,
  Rainbow,
  Rampage,
  ReachHeaven,
  Reaper,
  Reboot,
  Rebound,
  RecklessCharge,
  Recycle,
  Redo,
  Reflex,
  ReinforcedBody,
  Reprogram,
  RiddleWithHoles,
  RipAndTear,
  Rupture,
  SadisticNature,
  Sanctity,
  SandsOfTime,
  SashWhip,
  Scrape,
  Scrawl,
  SearingBlow,
  SecondWind,
  SecretTechnique,
  SecretWeapon,
  SeeingRed,
  Seek,
  SelfRepair,
  Sentinel,
  Setup,
  SeverSoul,
  Shockwave,
  ShrugItOff,
  SignatureMove,
  Skewer,
  Skim,
  Slice,
  SpiritShield,
  SpotWeakness,
  Stack,
  StaticDischarge,
  Steam,
  SteamPower,
  Storm,
  StormOfSteel,
  Streamline,
  Strike,
  Study,
  SuckerPunch,
  Sunder,
  Survivor,
  SweepingBeam,
  Swivel,
  SwordBoomerang,
  Tactician,
  TalkToTheHand,
  Tantrum,
  Tempest,
  Terror,
  TheBomb,
  ThinkingAhead,
  ThirdEye,
  ThunderStrike,
  Thunderclap,
  ToolsOfTheTrade,
  Transmutation,
  TrueGrit,
  Turbo,
  TwinStrike,
  UnderhandedStrike,
  Undo,
  Unload,
  Uppercut,
  Vault,
  Vengeance,
  Venomology,
  Vigilance,
  Violence,
  Wallop,
  Warcry,
  WaveOfTheHand,
  Weave,
  WellLaidPlans,
  WheelKick,
  Whirlwind,
  WhiteNoise,
  WildStrike,
  Wish,
  WindmillStrike,
  Wireheading,
  Worship,
  WraithForm,
  Wreathofflame,
  Writhe,
  Zap,
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
      analyzeStats(filter(stsFiles));
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

  let masterDeck: Card[] = [];
  let masterDeckStrings: string[] = json.master_deck;
  for (let i = 0; i < masterDeckStrings.length; i++) {
    masterDeck.push(parseCardAndLogError(masterDeckStrings[i]));
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
    relics.push(parseRelicAndLogError(relicStrings[i]));
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

  let itemsPurchased: ItemPurchase[] = [];
  for (let i = 0; i < json.items_purchased.length; i++) {
    itemsPurchased.push(parseItemPurchase(json.items_purchased[i]));
  }

  let potionsObtained: PotionObtained[] = [];
  for (let i = 0; i < json.potions_obtained.length; i++) {
    let potion = parsePotion(json.potions_obtained[i].key);
    if (potion === Potion.Error) {
      console.log("unexpected potion: " + json.potions_obtained[i].key);
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

  let cardChoices: CardChoice[] = [];
  for (let i = 0; i < json.card_choices.length; i++) {
    let notPicked: Card[] = [];
    for (let j = 0; j < json.card_choices[i].not_picked.length; j++) {
      notPicked.push(parseCardAndLogError(json.card_choices[i].not_picked[j]));
    }

    let floor: number = json.card_choices[i].floor;
    if (json.card_choices[i].picked === "SKIP") {
      cardChoices.push({
        notPicked,
        floor,
        selection: CardSelection.Skip,
      });
    } else if (json.card_choices[i].picked == "Singing Bowl") {
      cardChoices.push({
        notPicked,
        floor,
        selection: CardSelection.SingingBowl,
      });
    } else {
      cardChoices.push({
        picked: parseCardAndLogError(json.card_choices[i].picked),
        notPicked,
        floor,
        selection: CardSelection.Card,
      });
    }
  }

  let relicsObtained: RelicObtained[] = [];
  for (let i = 0; i < json.relics_obtained.length; i++) {
    relicsObtained.push({
      relic: parseRelicAndLogError(json.relics_obtained[i].key),
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
    masterDeck,
    relics,
    floorsPotionsUsed: json.potions_floor_usage,
    damageTaken,
    potionsObtained,
    floorPaths,
    itemsPurchased,
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
    cardChoices,
    relicsObtained,
    bossRelicChoices,
    floorsItemPurged: json.items_purged_floors,
    isEndless: json.is_endless,
    floorsPotionsSpawned: json.potions_floor_spawned,
    killedBy: parseBattle(json.killed_by),
    ascensionLevel: json.ascension_level,
  };
}

function parseItemPurchase(itemString: string): ItemPurchase {
  let itemPurchased: Card | Potion | Relic;
  itemPurchased = parseCard(itemString);
  if (itemPurchased.name !== CardName.Error) {
    return {
      item: itemPurchased,
      selection: ItemSelection.Card,
    };
  }
  itemPurchased = parseRelic(itemString);
  if (itemPurchased !== Relic.Error) {
    return {
      item: itemPurchased,
      selection: ItemSelection.Relic,
    };
  }
  itemPurchased = parsePotion(itemString);
  if (itemPurchased !== Potion.Error) {
    return {
      item: itemPurchased,
      selection: ItemSelection.Potion,
    };
  }
  console.log("unexpected item purchase : ", itemString);
  return {
    selection: ItemSelection.Error,
  };
}

function parsePotion(potionString: string): Potion {
  let potion = Potion.Error;
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
  }
  return potion;
}

function cardName(card: string, cardName: string): boolean {
  if (card.slice(-2) == "+1") {
    card = card.substring(0, card.length - 2);
  }
  if (card === cardName) {
    return true;
  }
  if (card.includes("searingblow") && cardName.includes("searingblow")) {
    return true;
  }
  return false;
}

function parseCardAndLogError(cardString: string): Card {
  let card = parseCard(cardString);
  if (card.name === CardName.Error) {
    console.log("unexpected card name: ", cardString);
  }
  return card;
}

function parseCard(cardString: undefined | string): Card {
  let name: CardName = CardName.Error;
  let upgraded: boolean = false;

  if (cardString != undefined && cardString.includes("+")) {
    upgraded = true;
  }

  cardString =
    cardString === undefined
      ? undefined
      : cardString.toLowerCase().replace(/\s+/g, "");

  if (cardString === undefined) {
    name = CardName.None;
  } else if (cardName(cardString, "athousandcuts")) {
    name = CardName.AThousandCuts;
  } else if (cardName(cardString, "accuracy")) {
    name = CardName.Accuracy;
  } else if (cardName(cardString, "acrobatics")) {
    name = CardName.Acrobatics;
  } else if (cardName(cardString, "adaptation")) {
    name = CardName.Adaptation;
  } else if (cardName(cardString, "adrenaline")) {
    name = CardName.Adrenaline;
  } else if (cardName(cardString, "afterimage")) {
    name = CardName.AfterImage;
  } else if (cardName(cardString, "aggregate")) {
    name = CardName.Aggregate;
  } else if (cardName(cardString, "allforone")) {
    name = CardName.AllForOne;
  } else if (cardName(cardString, "alloutattack")) {
    name = CardName.AllOutAttack;
  } else if (cardName(cardString, "alpha")) {
    name = CardName.Alpha;
  } else if (cardName(cardString, "amplify")) {
    name = CardName.Amplify;
  } else if (cardName(cardString, "anger")) {
    name = CardName.Anger;
  } else if (cardName(cardString, "apotheosis")) {
    name = CardName.Apotheosis;
  } else if (cardName(cardString, "armaments")) {
    name = CardName.Armaments;
  } else if (cardName(cardString, "ascendersbane")) {
    name = CardName.AscendersBane;
  } else if (cardName(cardString, "autoshields")) {
    name = CardName.AutoShields;
  } else if (cardName(cardString, "backflip")) {
    name = CardName.Backflip;
  } else if (cardName(cardString, "backstab")) {
    name = CardName.Backstab;
  } else if (cardName(cardString, "balllightning")) {
    name = CardName.BallLightning;
  } else if (cardName(cardString, "bandageup")) {
    name = CardName.BandageUp;
  } else if (cardName(cardString, "bane")) {
    name = CardName.Bane;
  } else if (cardName(cardString, "barrage")) {
    name = CardName.Barrage;
  } else if (cardName(cardString, "barricade")) {
    name = CardName.Barricade;
  } else if (cardName(cardString, "bash")) {
    name = CardName.Bash;
  } else if (cardName(cardString, "battletrance")) {
    name = CardName.BattleTrance;
  } else if (cardName(cardString, "battlehymn")) {
    name = CardName.BattleHymn;
  } else if (cardName(cardString, "beamcell")) {
    name = CardName.BeamCell;
  } else if (cardName(cardString, "berserk")) {
    name = CardName.Berserk;
  } else if (cardName(cardString, "beta")) {
    name = CardName.Beta;
  } else if (cardName(cardString, "biasedcognition")) {
    name = CardName.BiasedCognition;
  } else if (cardName(cardString, "bite")) {
    name = CardName.Bite;
  } else if (cardName(cardString, "bladedance")) {
    name = CardName.BladeDance;
  } else if (cardName(cardString, "blasphemy")) {
    name = CardName.Blasphemy;
  } else if (cardName(cardString, "blizzard")) {
    name = CardName.Blizzard;
  } else if (cardName(cardString, "bloodforblood")) {
    name = CardName.BloodForBlood;
  } else if (cardName(cardString, "bloodletting")) {
    name = CardName.Bloodletting;
  } else if (cardName(cardString, "bludgeon")) {
    name = CardName.Bludgeon;
  } else if (cardName(cardString, "blur")) {
    name = CardName.Blur;
  } else if (cardName(cardString, "bodyslam")) {
    name = CardName.BodySlam;
  } else if (cardName(cardString, "bootsequence")) {
    name = CardName.BootSequence;
  } else if (cardName(cardString, "bouncingflask")) {
    name = CardName.BouncingFlask;
  } else if (cardName(cardString, "bowlingbash")) {
    name = CardName.BowlingBash;
  } else if (cardName(cardString, "brilliance")) {
    name = CardName.Brilliance;
  } else if (cardName(cardString, "brutality")) {
    name = CardName.Brutality;
  } else if (cardName(cardString, "buffer")) {
    name = CardName.Buffer;
  } else if (cardName(cardString, "bullettime")) {
    name = CardName.BulletTime;
  } else if (cardName(cardString, "burningpact")) {
    name = CardName.BurningPact;
  } else if (cardName(cardString, "burst")) {
    name = CardName.Burst;
  } else if (cardName(cardString, "calculatedgamble")) {
    name = CardName.CalculatedGamble;
  } else if (cardName(cardString, "caltrops")) {
    name = CardName.Caltrops;
  } else if (cardName(cardString, "capacitor")) {
    name = CardName.Capacitor;
  } else if (cardName(cardString, "carnage")) {
    name = CardName.Carnage;
  } else if (cardName(cardString, "carvereality")) {
    name = CardName.CarveReality;
  } else if (cardName(cardString, "catalyst")) {
    name = CardName.Catalyst;
  } else if (cardName(cardString, "chaos")) {
    name = CardName.Chaos;
  } else if (cardName(cardString, "chill")) {
    name = CardName.Chill;
  } else if (cardName(cardString, "choke")) {
    name = CardName.Choke;
  } else if (cardName(cardString, "chrysalis")) {
    name = CardName.Chrysalis;
  } else if (cardName(cardString, "clash")) {
    name = CardName.Clash;
  } else if (cardName(cardString, "clearthemind")) {
    name = CardName.ClearTheMind;
  } else if (cardName(cardString, "cleave")) {
    name = CardName.Cleave;
  } else if (cardName(cardString, "cloakanddagger")) {
    name = CardName.CloakAndDagger;
  } else if (cardName(cardString, "clothesline")) {
    name = CardName.Clothesline;
  } else if (cardName(cardString, "clumsy")) {
    name = CardName.Clumsy;
  } else if (cardName(cardString, "coldsnap")) {
    name = CardName.ColdSnap;
  } else if (cardName(cardString, "collect")) {
    name = CardName.Collect;
  } else if (cardName(cardString, "combust")) {
    name = CardName.Combust;
  } else if (cardName(cardString, "compiledriver")) {
    name = CardName.CompileDriver;
  } else if (cardName(cardString, "concentrate")) {
    name = CardName.Concentrate;
  } else if (cardName(cardString, "conclude")) {
    name = CardName.Conclude;
  } else if (cardName(cardString, "conjureblade")) {
    name = CardName.ConjureBlade;
  } else if (cardName(cardString, "consecrate")) {
    name = CardName.Consecrate;
  } else if (cardName(cardString, "conservebattery")) {
    name = CardName.ConserveBattery;
  } else if (cardName(cardString, "consume")) {
    name = CardName.Consume;
  } else if (cardName(cardString, "coolheaded")) {
    name = CardName.Coolheaded;
  } else if (cardName(cardString, "coresurge")) {
    name = CardName.CoreSurge;
  } else if (cardName(cardString, "corpseexplosion")) {
    name = CardName.CorpseExplosion;
  } else if (cardName(cardString, "corruption")) {
    name = CardName.Corruption;
  } else if (cardName(cardString, "creativeai")) {
    name = CardName.CreativeAI;
  } else if (cardName(cardString, "crescendo")) {
    name = CardName.Crescendo;
  } else if (cardName(cardString, "cripplingpoison")) {
    name = CardName.CripplingPoison;
  } else if (cardName(cardString, "crushjoints")) {
    name = CardName.CrushJoints;
  } else if (cardName(cardString, "curseofthebell")) {
    name = CardName.CurseOfTheBell;
  } else if (cardName(cardString, "cutthroughfate")) {
    name = CardName.CutThroughFate;
  } else if (cardName(cardString, "daggerspray")) {
    name = CardName.DaggerSpray;
  } else if (cardName(cardString, "daggerthrow")) {
    name = CardName.DaggerThrow;
  } else if (cardName(cardString, "darkembrace")) {
    name = CardName.DarkEmbrace;
  } else if (cardName(cardString, "darkshackles")) {
    name = CardName.DarkShackles;
  } else if (cardName(cardString, "darkness")) {
    name = CardName.Darkness;
  } else if (cardName(cardString, "dash")) {
    name = CardName.Dash;
  } else if (cardName(cardString, "deadlypoison")) {
    name = CardName.DeadlyPoison;
  } else if (cardName(cardString, "decay")) {
    name = CardName.Decay;
  } else if (cardName(cardString, "deceivereality")) {
    name = CardName.DeceiveReality;
  } else if (cardName(cardString, "deepbreath")) {
    name = CardName.DeepBreath;
  } else if (
    cardName(cardString, "defend_b") ||
    cardName(cardString, "defend_r") ||
    cardName(cardString, "defend_g") ||
    cardName(cardString, "defend_p")
  ) {
    name = CardName.Defend;
  } else if (cardName(cardString, "deflect")) {
    name = CardName.Deflect;
  } else if (cardName(cardString, "defragment")) {
    name = CardName.Defragment;
  } else if (cardName(cardString, "demonform")) {
    name = CardName.DemonForm;
  } else if (cardName(cardString, "deusexmachina")) {
    name = CardName.DeusExMachina;
  } else if (cardName(cardString, "devaform")) {
    name = CardName.DevaForm;
  } else if (cardName(cardString, "devotion")) {
    name = CardName.Devotion;
  } else if (cardName(cardString, "diediedie")) {
    name = CardName.DieDieDie;
  } else if (cardName(cardString, "disarm")) {
    name = CardName.Disarm;
  } else if (cardName(cardString, "discovery")) {
    name = CardName.Discovery;
  } else if (cardName(cardString, "distraction")) {
    name = CardName.Distraction;
  } else if (cardName(cardString, "dodgeandroll")) {
    name = CardName.DodgeAndRoll;
  } else if (cardName(cardString, "doomandgloom")) {
    name = CardName.DoomAndGloom;
  } else if (cardName(cardString, "doppelganger")) {
    name = CardName.Doppelganger;
  } else if (cardName(cardString, "doubleenergy")) {
    name = CardName.DoubleEnergy;
  } else if (cardName(cardString, "doubletap")) {
    name = CardName.DoubleTap;
  } else if (cardName(cardString, "doubt")) {
    name = CardName.Doubt;
  } else if (cardName(cardString, "dramaticentrance")) {
    name = CardName.DramaticEntrance;
  } else if (cardName(cardString, "dropkick")) {
    name = CardName.Dropkick;
  } else if (cardName(cardString, "dualwield")) {
    name = CardName.DualWield;
  } else if (cardName(cardString, "dualcast")) {
    name = CardName.Dualcast;
  } else if (cardName(cardString, "echoform")) {
    name = CardName.EchoForm;
  } else if (cardName(cardString, "electrodynamics")) {
    name = CardName.Electrodynamics;
  } else if (cardName(cardString, "emptybody")) {
    name = CardName.EmptyBody;
  } else if (cardName(cardString, "emptyfist")) {
    name = CardName.EmptyFist;
  } else if (cardName(cardString, "emptymind")) {
    name = CardName.EmptyMind;
  } else if (cardName(cardString, "endlessagony")) {
    name = CardName.EndlessAgony;
  } else if (cardName(cardString, "enlightenment")) {
    name = CardName.Enlightenment;
  } else if (cardName(cardString, "entrench")) {
    name = CardName.Entrench;
  } else if (cardName(cardString, "envenom")) {
    name = CardName.Envenom;
  } else if (cardName(cardString, "eruption")) {
    name = CardName.Eruption;
  } else if (cardName(cardString, "escapeplan")) {
    name = CardName.EscapePlan;
  } else if (cardName(cardString, "establishment")) {
    name = CardName.Establishment;
  } else if (cardName(cardString, "evaluate")) {
    name = CardName.Evaluate;
  } else if (cardName(cardString, "eviscerate")) {
    name = CardName.Eviscerate;
  } else if (cardName(cardString, "evolve")) {
    name = CardName.Evolve;
  } else if (cardName(cardString, "exhume")) {
    name = CardName.Exhume;
  } else if (cardName(cardString, "expertise")) {
    name = CardName.Expertise;
  } else if (cardName(cardString, "ftl")) {
    name = CardName.FTL;
  } else if (cardName(cardString, "fasting2")) {
    name = CardName.Fasting;
  } else if (cardName(cardString, "fearnoevil")) {
    name = CardName.FearNoEvil;
  } else if (cardName(cardString, "feed")) {
    name = CardName.Feed;
  } else if (cardName(cardString, "feelnopain")) {
    name = CardName.FeelNoPain;
  } else if (cardName(cardString, "fiendfire")) {
    name = CardName.FiendFire;
  } else if (cardName(cardString, "finesse")) {
    name = CardName.Finesse;
  } else if (cardName(cardString, "finisher")) {
    name = CardName.Finisher;
  } else if (cardName(cardString, "firebreathing")) {
    name = CardName.FireBreathing;
  } else if (cardName(cardString, "fission")) {
    name = CardName.Fission;
  } else if (cardName(cardString, "flamebarrier")) {
    name = CardName.FlameBarrier;
  } else if (cardName(cardString, "flechettes")) {
    name = CardName.Flechettes;
  } else if (cardName(cardString, "flex")) {
    name = CardName.Flex;
  } else if (cardName(cardString, "flurryofblows")) {
    name = CardName.FlurryOfBlows;
  } else if (cardName(cardString, "flyingknee")) {
    name = CardName.FlyingKnee;
  } else if (cardName(cardString, "flyingsleeves")) {
    name = CardName.FlyingSleeves;
  } else if (cardName(cardString, "followup")) {
    name = CardName.FollowUp;
  } else if (cardName(cardString, "footwork")) {
    name = CardName.Footwork;
  } else if (cardName(cardString, "forcefield")) {
    name = CardName.ForceField;
  } else if (cardName(cardString, "foreigninfluence")) {
    name = CardName.ForeignInfluence;
  } else if (cardName(cardString, "fusion")) {
    name = CardName.Fusion;
  } else if (cardName(cardString, "gash")) {
    name = CardName.Gash;
  } else if (cardName(cardString, "geneticalgorithm")) {
    name = CardName.GeneticAlgorithm;
  } else if (cardName(cardString, "ghostly")) {
    name = CardName.Ghostly;
  } else if (cardName(cardString, "ghostlyarmor")) {
    name = CardName.GhostlyArmor;
  } else if (cardName(cardString, "glacier")) {
    name = CardName.Glacier;
  } else if (cardName(cardString, "glassknife")) {
    name = CardName.GlassKnife;
  } else if (cardName(cardString, "gofortheeyes")) {
    name = CardName.GoForTheEyes;
  } else if (cardName(cardString, "grandfinale")) {
    name = CardName.GrandFinale;
  } else if (cardName(cardString, "halt")) {
    name = CardName.Halt;
  } else if (cardName(cardString, "handofgreed")) {
    name = CardName.HandOfGreed;
  } else if (cardName(cardString, "havoc")) {
    name = CardName.Havoc;
  } else if (cardName(cardString, "headbutt")) {
    name = CardName.Headbutt;
  } else if (cardName(cardString, "heatsinks")) {
    name = CardName.Heatsinks;
  } else if (cardName(cardString, "heavyblade")) {
    name = CardName.HeavyBlade;
  } else if (cardName(cardString, "heelhook")) {
    name = CardName.HeelHook;
  } else if (cardName(cardString, "helloworld")) {
    name = CardName.HelloWorld;
  } else if (cardName(cardString, "hemokinesis")) {
    name = CardName.Hemokinesis;
  } else if (cardName(cardString, "hologram")) {
    name = CardName.Hologram;
  } else if (cardName(cardString, "hyperbeam")) {
    name = CardName.Hyperbeam;
  } else if (cardName(cardString, "immolate")) {
    name = CardName.Immolate;
  } else if (cardName(cardString, "impatience")) {
    name = CardName.Impatience;
  } else if (cardName(cardString, "impervious")) {
    name = CardName.Impervious;
  } else if (cardName(cardString, "indignation")) {
    name = CardName.Indignation;
  } else if (cardName(cardString, "infernalblade")) {
    name = CardName.InfernalBlade;
  } else if (cardName(cardString, "infiniteblades")) {
    name = CardName.InfiniteBlades;
  } else if (cardName(cardString, "inflame")) {
    name = CardName.Inflame;
  } else if (cardName(cardString, "injury")) {
    name = CardName.Injury;
  } else if (cardName(cardString, "innerpeace")) {
    name = CardName.InnerPeace;
  } else if (cardName(cardString, "intimidate")) {
    name = CardName.Intimidate;
  } else if (cardName(cardString, "ironwave")) {
    name = CardName.IronWave;
  } else if (cardName(cardString, "judgement")) {
    name = CardName.Judgement;
  } else if (cardName(cardString, "juggernaut")) {
    name = CardName.Juggernaut;
  } else if (cardName(cardString, "justlucky")) {
    name = CardName.JustLucky;
  } else if (cardName(cardString, "leap")) {
    name = CardName.Leap;
  } else if (cardName(cardString, "legsweep")) {
    name = CardName.LegSweep;
  } else if (cardName(cardString, "lessonlearned")) {
    name = CardName.LessonLearned;
  } else if (cardName(cardString, "likewater")) {
    name = CardName.LikeWater;
  } else if (cardName(cardString, "limitbreak")) {
    name = CardName.LimitBreak;
  } else if (cardName(cardString, "lockon")) {
    name = CardName.Lockon;
  } else if (cardName(cardString, "loop")) {
    name = CardName.Loop;
  } else if (cardName(cardString, "machinelearning")) {
    name = CardName.MachineLearning;
  } else if (cardName(cardString, "madness")) {
    name = CardName.Madness;
  } else if (cardName(cardString, "malaise")) {
    name = CardName.Malaise;
  } else if (cardName(cardString, "magnetism")) {
    name = CardName.Magnetism;
  } else if (cardName(cardString, "masterofstrategy")) {
    name = CardName.MasterOfStrategy;
  } else if (cardName(cardString, "masterfulstab")) {
    name = CardName.MasterfulStab;
  } else if (cardName(cardString, "masterreality")) {
    name = CardName.MasterReality;
  } else if (cardName(cardString, "mayhem")) {
    name = CardName.Mayhem;
  } else if (cardName(cardString, "meditate")) {
    name = CardName.Meditate;
  } else if (cardName(cardString, "melter")) {
    name = CardName.Melter;
  } else if (cardName(cardString, "mentalfortress")) {
    name = CardName.MentalFortress;
  } else if (cardName(cardString, "metallicize")) {
    name = CardName.Metallicize;
  } else if (cardName(cardString, "metamorphosis")) {
    name = CardName.Metamorphosis;
  } else if (cardName(cardString, "meteorstrike")) {
    name = CardName.MeteorStrike;
  } else if (cardName(cardString, "mindblast")) {
    name = CardName.MindBlast;
  } else if (cardName(cardString, "multi-cast")) {
    name = CardName.MultiCast;
  } else if (cardName(cardString, "necronomicurse")) {
    name = CardName.Necronomicurse;
  } else if (cardName(cardString, "neutralize")) {
    name = CardName.Neutralize;
  } else if (cardName(cardString, "nightterror")) {
    name = CardName.NightTerror;
  } else if (cardName(cardString, "nirvana")) {
    name = CardName.Nirvana;
  } else if (cardName(cardString, "noxiousfumes")) {
    name = CardName.NoxiousFumes;
  } else if (cardName(cardString, "offering")) {
    name = CardName.Offering;
  } else if (cardName(cardString, "omega")) {
    name = CardName.Omega;
  } else if (cardName(cardString, "omniscience")) {
    name = CardName.Omniscience;
  } else if (cardName(cardString, "outmaneuver")) {
    name = CardName.Outmaneuver;
  } else if (cardName(cardString, "panacea")) {
    name = CardName.Panacea;
  } else if (cardName(cardString, "panache")) {
    name = CardName.Panache;
  } else if (cardName(cardString, "panicbutton")) {
    name = CardName.PanicButton;
  } else if (cardName(cardString, "parasite")) {
    name = CardName.Parasite;
  } else if (cardName(cardString, "pathtovictory")) {
    name = CardName.PressurePoints;
  } else if (cardName(cardString, "perfectedstrike")) {
    name = CardName.PerfectedStrike;
  } else if (cardName(cardString, "perseverance")) {
    name = CardName.Perseverance;
  } else if (cardName(cardString, "phantasmalkiller")) {
    name = CardName.PhantasmalKiller;
  } else if (cardName(cardString, "piercingwail")) {
    name = CardName.PiercingWail;
  } else if (cardName(cardString, "poisonedstab")) {
    name = CardName.PoisonedStab;
  } else if (cardName(cardString, "pommelstrike")) {
    name = CardName.PommelStrike;
  } else if (cardName(cardString, "powerthrough")) {
    name = CardName.PowerThrough;
  } else if (cardName(cardString, "pray")) {
    name = CardName.Pray;
  } else if (cardName(cardString, "predator")) {
    name = CardName.Predator;
  } else if (cardName(cardString, "prepared")) {
    name = CardName.Prepared;
  } else if (cardName(cardString, "prostrate")) {
    name = CardName.Prostrate;
  } else if (cardName(cardString, "protect")) {
    name = CardName.Protect;
  } else if (cardName(cardString, "pummel")) {
    name = CardName.Pummel;
  } else if (cardName(cardString, "purity")) {
    name = CardName.Purity;
  } else if (cardName(cardString, "quickslash")) {
    name = CardName.QuickSlash;
  } else if (cardName(cardString, "rage")) {
    name = CardName.Rage;
  } else if (cardName(cardString, "ragnarok")) {
    name = CardName.Ragnarok;
  } else if (cardName(cardString, "rainbow")) {
    name = CardName.Rainbow;
  } else if (cardName(cardString, "rampage")) {
    name = CardName.Rampage;
  } else if (cardName(cardString, "reachheaven")) {
    name = CardName.ReachHeaven;
  } else if (cardName(cardString, "reaper")) {
    name = CardName.Reaper;
  } else if (cardName(cardString, "reboot")) {
    name = CardName.Reboot;
  } else if (cardName(cardString, "rebound")) {
    name = CardName.Rebound;
  } else if (cardName(cardString, "recklesscharge")) {
    name = CardName.RecklessCharge;
  } else if (cardName(cardString, "recycle")) {
    name = CardName.Recycle;
  } else if (cardName(cardString, "redo")) {
    name = CardName.Redo;
  } else if (cardName(cardString, "reflex")) {
    name = CardName.Reflex;
  } else if (cardName(cardString, "reinforcedbody")) {
    name = CardName.ReinforcedBody;
  } else if (cardName(cardString, "reprogram")) {
    name = CardName.Reprogram;
  } else if (cardName(cardString, "riddlewithholes")) {
    name = CardName.RiddleWithHoles;
  } else if (cardName(cardString, "ripandtear")) {
    name = CardName.RipAndTear;
  } else if (cardName(cardString, "rupture")) {
    name = CardName.Rupture;
  } else if (cardName(cardString, "sadisticnature")) {
    name = CardName.SadisticNature;
  } else if (cardName(cardString, "sanctity")) {
    name = CardName.Sanctity;
  } else if (cardName(cardString, "sandsoftime")) {
    name = CardName.SandsOfTime;
  } else if (cardName(cardString, "sashwhip")) {
    name = CardName.SashWhip;
  } else if (cardName(cardString, "scrape")) {
    name = CardName.Scrape;
  } else if (cardName(cardString, "scrawl")) {
    name = CardName.Scrawl;
  } else if (cardName(cardString, "searingblow")) {
    name = CardName.SearingBlow;
  } else if (cardName(cardString, "secondwind")) {
    name = CardName.SecondWind;
  } else if (cardName(cardString, "secrettechnique")) {
    name = CardName.SecretTechnique;
  } else if (cardName(cardString, "secretweapon")) {
    name = CardName.SecretWeapon;
  } else if (cardName(cardString, "seeingred")) {
    name = CardName.SeeingRed;
  } else if (cardName(cardString, "seek")) {
    name = CardName.Seek;
  } else if (cardName(cardString, "selfrepair")) {
    name = CardName.SelfRepair;
  } else if (cardName(cardString, "sentinel")) {
    name = CardName.Sentinel;
  } else if (cardName(cardString, "setup")) {
    name = CardName.Setup;
  } else if (cardName(cardString, "seversoul")) {
    name = CardName.SeverSoul;
  } else if (cardName(cardString, "shockwave")) {
    name = CardName.Shockwave;
  } else if (cardName(cardString, "shrugitoff")) {
    name = CardName.ShrugItOff;
  } else if (cardName(cardString, "signaturemove")) {
    name = CardName.SignatureMove;
  } else if (cardName(cardString, "skewer")) {
    name = CardName.Skewer;
  } else if (cardName(cardString, "skim")) {
    name = CardName.Skim;
  } else if (cardName(cardString, "slice")) {
    name = CardName.Slice;
  } else if (cardName(cardString, "spiritshield")) {
    name = CardName.SpiritShield;
  } else if (cardName(cardString, "spotweakness")) {
    name = CardName.SpotWeakness;
  } else if (cardName(cardString, "stack")) {
    name = CardName.Stack;
  } else if (cardName(cardString, "staticdischarge")) {
    name = CardName.StaticDischarge;
  } else if (cardName(cardString, "steam")) {
    name = CardName.Steam;
  } else if (cardName(cardString, "steampower")) {
    name = CardName.SteamPower;
  } else if (cardName(cardString, "storm")) {
    name = CardName.Storm;
  } else if (cardName(cardString, "stormofsteel")) {
    name = CardName.StormOfSteel;
  } else if (cardName(cardString, "streamline")) {
    name = CardName.Streamline;
  } else if (
    cardName(cardString, "strike_b") ||
    cardName(cardString, "strike_r") ||
    cardName(cardString, "strike_g") ||
    cardName(cardString, "strike_p")
  ) {
    name = CardName.Strike;
  } else if (cardName(cardString, "study")) {
    name = CardName.Study;
  } else if (cardName(cardString, "suckerpunch")) {
    name = CardName.SuckerPunch;
  } else if (cardName(cardString, "sunder")) {
    name = CardName.Sunder;
  } else if (cardName(cardString, "survivor")) {
    name = CardName.Survivor;
  } else if (cardName(cardString, "sweepingbeam")) {
    name = CardName.SweepingBeam;
  } else if (cardName(cardString, "swivel")) {
    name = CardName.Swivel;
  } else if (cardName(cardString, "swordboomerang")) {
    name = CardName.SwordBoomerang;
  } else if (cardName(cardString, "tactician")) {
    name = CardName.Tactician;
  } else if (cardName(cardString, "talktothehand")) {
    name = CardName.TalkToTheHand;
  } else if (cardName(cardString, "tantrum")) {
    name = CardName.Tantrum;
  } else if (cardName(cardString, "tempest")) {
    name = CardName.Tempest;
  } else if (cardName(cardString, "terror")) {
    name = CardName.Terror;
  } else if (cardName(cardString, "thebomb")) {
    name = CardName.TheBomb;
  } else if (cardName(cardString, "thinkingahead")) {
    name = CardName.ThinkingAhead;
  } else if (cardName(cardString, "thirdeye")) {
    name = CardName.ThirdEye;
  } else if (cardName(cardString, "thunderstrike")) {
    name = CardName.ThunderStrike;
  } else if (cardName(cardString, "thunderclap")) {
    name = CardName.Thunderclap;
  } else if (cardName(cardString, "toolsofthetrade")) {
    name = CardName.ToolsOfTheTrade;
  } else if (cardName(cardString, "transmutation")) {
    name = CardName.Transmutation;
  } else if (cardName(cardString, "truegrit")) {
    name = CardName.TrueGrit;
  } else if (cardName(cardString, "turbo")) {
    name = CardName.Turbo;
  } else if (cardName(cardString, "twinstrike")) {
    name = CardName.TwinStrike;
  } else if (cardName(cardString, "underhandedstrike")) {
    name = CardName.UnderhandedStrike;
  } else if (cardName(cardString, "undo")) {
    name = CardName.Undo;
  } else if (cardName(cardString, "unload")) {
    name = CardName.Unload;
  } else if (cardName(cardString, "uppercut")) {
    name = CardName.Uppercut;
  } else if (cardName(cardString, "vault")) {
    name = CardName.Vault;
  } else if (cardName(cardString, "vengeance")) {
    name = CardName.Vengeance;
  } else if (cardName(cardString, "venomology")) {
    name = CardName.Venomology;
  } else if (cardName(cardString, "vigilance")) {
    name = CardName.Vigilance;
  } else if (cardName(cardString, "violence")) {
    name = CardName.Violence;
  } else if (cardName(cardString, "wallop")) {
    name = CardName.Wallop;
  } else if (cardName(cardString, "warcry")) {
    name = CardName.Warcry;
  } else if (cardName(cardString, "waveofthehand")) {
    name = CardName.WaveOfTheHand;
  } else if (cardName(cardString, "weave")) {
    name = CardName.Weave;
  } else if (cardName(cardString, "welllaidplans")) {
    name = CardName.WellLaidPlans;
  } else if (cardName(cardString, "wheelkick")) {
    name = CardName.WheelKick;
  } else if (cardName(cardString, "whirlwind")) {
    name = CardName.Whirlwind;
  } else if (cardName(cardString, "whitenoise")) {
    name = CardName.WhiteNoise;
  } else if (cardName(cardString, "wildstrike")) {
    name = CardName.WildStrike;
  } else if (cardName(cardString, "wish")) {
    name = CardName.Wish;
  } else if (cardName(cardString, "windmillstrike")) {
    name = CardName.WindmillStrike;
  } else if (cardName(cardString, "wireheading")) {
    name = CardName.Wireheading;
  } else if (cardName(cardString, "worship")) {
    name = CardName.Worship;
  } else if (cardName(cardString, "wraithformv2")) {
    name = CardName.WraithForm;
  } else if (cardName(cardString, "wreathofflame")) {
    name = CardName.Wreathofflame;
  } else if (cardName(cardString, "writhe")) {
    name = CardName.Writhe;
  } else if (cardName(cardString, "zap")) {
    name = CardName.Zap;
  }
  return {
    name,
    upgraded,
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

function parseRelicAndLogError(relicString: string): Relic {
  let relic = parseRelic(relicString);
  if (relic === Relic.Error) {
    console.log("unexpected relic: ", relicString);
  }
  return relic;
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
  return files;
}

function analyzeStats(files: StsFile[]) {
  graphTotals(files);
  graphTopFives(files);
}

function graphTopFives(files: StsFile[]) {
  let killedBySum = new Map();
  let killedBySumIronclad = new Map();
  let killedBySumSilent = new Map();
  let killedBySumDefect = new Map();
  let killedBySumWatcher = new Map();

  let killedByRecord: Map<Battle, Record> = new Map();
  let killedByRecordIronClad: Map<Battle, Record> = new Map();
  let killedByRecordSilent: Map<Battle, Record> = new Map();
  let killedByRecordDefect: Map<Battle, Record> = new Map();
  let killedByRecordWatcher: Map<Battle, Record> = new Map();

  let damageTakenRecord: Map<Battle, Record> = new Map();
  let damageTakenRecordIronclad: Map<Battle, Record> = new Map();
  let damageTakenRecordSilent: Map<Battle, Record> = new Map();
  let damageTakenRecordDefect: Map<Battle, Record> = new Map();
  let damageTakenRecordWatcher: Map<Battle, Record> = new Map();

  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let character = file.character;
    incrementKilledByRecord(file.killedBy, true, killedByRecord);
    incrementKilledBy(file.killedBy, killedBySum);
    if (character == Character.Ironclad) {
      incrementKilledByRecord(file.killedBy, true, killedByRecordIronClad);
      incrementKilledBy(file.killedBy, killedBySumIronclad);
    } else if (character == Character.Silent) {
      incrementKilledByRecord(file.killedBy, true, killedByRecordSilent);
      incrementKilledBy(file.killedBy, killedBySumSilent);
    } else if (character == Character.Defect) {
      incrementKilledByRecord(file.killedBy, true, killedByRecordDefect);
      incrementKilledBy(file.killedBy, killedBySumDefect);
    } else if (character == Character.Watcher) {
      incrementKilledByRecord(file.killedBy, true, killedByRecordWatcher);
      incrementKilledBy(file.killedBy, killedBySumWatcher);
    }

    for (let j = 0; j < file.damageTaken.length; j++) {
      let damageTaken = file.damageTaken[j];
      // Hack to handle blasphemy. TODO: handle this edge case better this probably causes bugs.
      let damage = damageTaken.damage % 100000;
      incrementKilledByRecord(damageTaken.enemies, false, killedByRecord);
      incrementDamageTakenRecord(
        damageTaken.enemies,
        damage,
        damageTakenRecord,
      );
      if (character == Character.Ironclad) {
        incrementKilledByRecord(
          damageTaken.enemies,
          false,
          killedByRecordIronClad,
        );
        incrementDamageTakenRecord(
          damageTaken.enemies,
          damage,
          damageTakenRecordIronclad,
        );
      } else if (character == Character.Silent) {
        incrementKilledByRecord(
          damageTaken.enemies,
          false,
          killedByRecordSilent,
        );
        incrementDamageTakenRecord(
          damageTaken.enemies,
          damage,
          damageTakenRecordSilent,
        );
      } else if (character == Character.Defect) {
        incrementKilledByRecord(
          damageTaken.enemies,
          false,
          killedByRecordDefect,
        );
        incrementDamageTakenRecord(
          damageTaken.enemies,
          damage,
          damageTakenRecordDefect,
        );
      } else if (character == Character.Watcher) {
        incrementKilledByRecord(
          damageTaken.enemies,
          false,
          killedByRecordWatcher,
        );
        incrementDamageTakenRecord(
          damageTaken.enemies,
          damage,
          damageTakenRecordWatcher,
        );
      }
    }
  }

  let killedBySumTopFiveGraph = killedBySumTopFive(killedBySum);
  let killedByAverageTopFive = averageTopFive(killedByRecord);
  let averageDamageTakenTopFive = averageTopFive(damageTakenRecord);
  graphBarChart("killedBySumTopFive", killedBySumTopFiveGraph);
  graphBarChart("killedByAverageTopFive", killedByAverageTopFive);
  graphBarChart("damageTakenAverageTopFive", averageDamageTakenTopFive);

  let killedBySumTopFiveGraphIronclad = killedBySumTopFive(killedBySumIronclad);
  let killedByAverageTopFiveIronclad = averageTopFive(killedByRecordIronClad);
  let averageDamageTakenTopFiveIronclad = averageTopFive(
    damageTakenRecordIronclad,
  );
  graphBarChart("killedBySumTopFiveIronclad", killedBySumTopFiveGraphIronclad);
  graphBarChart(
    "killedByAverageTopFiveIronclad",
    killedByAverageTopFiveIronclad,
  );
  graphBarChart(
    "damageTakenAverageTopFiveIronclad",
    averageDamageTakenTopFiveIronclad,
  );

  let killedBySumTopFiveGraphSilent = killedBySumTopFive(killedBySumSilent);
  let killedByAverageTopFiveSilent = averageTopFive(killedByRecordSilent);
  let averageDamageTakenTopFiveSilent = averageTopFive(damageTakenRecordSilent);
  graphBarChart("killedBySumTopFiveSilent", killedBySumTopFiveGraphSilent);
  graphBarChart("killedByAverageTopFiveSilent", killedByAverageTopFiveSilent);
  graphBarChart(
    "damageTakenAverageTopFiveSilent",
    averageDamageTakenTopFiveSilent,
  );

  let killedBySumTopFiveGraphDefect = killedBySumTopFive(killedBySumDefect);
  let killedByAverageTopFiveDefect = averageTopFive(killedByRecordDefect);
  let averageDamageTakenTopFiveDefect = averageTopFive(damageTakenRecordDefect);
  graphBarChart("killedBySumTopFiveDefect", killedBySumTopFiveGraphDefect);
  graphBarChart("killedByAverageTopFiveDefect", killedByAverageTopFiveDefect);
  graphBarChart(
    "damageTakenAverageTopFiveDefect",
    averageDamageTakenTopFiveDefect,
  );

  let killedBySumTopFiveGraphWatcher = killedBySumTopFive(killedBySumWatcher);
  let killedByAverageTopFiveWatcher = averageTopFive(killedByRecordWatcher);
  let averageDamageTakenTopFiveWatcher = averageTopFive(
    damageTakenRecordWatcher,
  );
  graphBarChart("killedBySumTopFiveWatcher", killedBySumTopFiveGraphWatcher);
  graphBarChart("killedByAverageTopFiveWatcher", killedByAverageTopFiveWatcher);
  graphBarChart(
    "damageTakenAverageTopFiveWatcher",
    averageDamageTakenTopFiveWatcher,
  );
}

function graphBarChart(elementId: string, topFive: TopFive) {
  new Chart(document.getElementById(elementId)!, {
    type: "bar",
    data: {
      labels: topFive.label,
      datasets: [
        {
          label: "",
          data: topFive.data,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

function incrementKilledBy(battle: Battle, killedBy: Map<Battle, number>) {
  let count = killedBy.get(battle);
  if (count === undefined) {
    count = 0;
  }
  killedBy.set(battle, count + 1);
}

type Record = {
  sum: number;
  count: number;
};

function incrementKilledByRecord(
  battle: Battle,
  killedBy: boolean,
  killedByAverage: Map<Battle, Record>,
) {
  let tkr = killedByAverage.get(battle);
  if (tkr === undefined) {
    tkr = {
      sum: 0,
      count: 0,
    };
  }
  if (killedBy) {
    killedByAverage.set(battle, {
      sum: tkr.sum + 1,
      count: tkr.count,
    });
  } else {
    killedByAverage.set(battle, {
      sum: tkr.sum,
      count: tkr.count + 1,
    });
  }
}

function incrementDamageTakenRecord(
  battle: Battle,
  damage: number,
  damageTakenRecord: Map<Battle, Record>,
) {
  let dtr = damageTakenRecord.get(battle);
  if (dtr === undefined) {
    dtr = {
      sum: 0,
      count: 0,
    };
  }
  damageTakenRecord.set(battle, {
    sum: dtr.sum + damage,
    count: dtr.count + 1,
  });
}

type TopFive = {
  label: string[];
  data: number[];
};

function killedBySumTopFive(killedBy: Map<Battle, number>): TopFive {
  let sortedKilledBy = new Map(
    [...killedBy.entries()].sort((battle, kills) => kills[1] - battle[1]),
  );
  let battles: string[] = [];
  let kills: number[] = [];
  for (const [key, value] of sortedKilledBy) {
    if (key !== Battle.None) {
      battles.push(Battle[key]);
      kills.push(value);
    }
  }
  return {
    label: battles.slice(0, 5),
    data: kills.slice(0, 5),
  };
}

function averageTopFive(total: Map<Battle, Record>): TopFive {
  let battleAverages = new Map();
  for (const [key, value] of total) {
    if (key !== Battle.None) {
      battleAverages.set(key, value.sum / value.count);
    }
  }

  let sorted = new Map(
    [...battleAverages.entries()].sort((k, v) => v[1] - k[1]),
  );
  let battles: string[] = [];
  let averages: number[] = [];
  for (const [key, value] of sorted) {
    if (key !== Battle.None) {
      battles.push(Battle[key]);
      averages.push(value);
    }
  }
  return {
    label: battles.slice(0, 5),
    data: averages.slice(0, 5),
  };
}

function graphTotals(files: StsFile[]) {
  let ironcladDamageTaken: number = 0;
  let silentDamageTaken: number = 0;
  let defectDamageTaken: number = 0;
  let watcherDamageTaken: number = 0;

  let ironcladTurnsTaken: number = 0;
  let silentTurnsTaken: number = 0;
  let defectTurnsTaken: number = 0;
  let watcherTurnsTaken: number = 0;

  let ironcladWins: number = 0;
  let silentWins: number = 0;
  let defectWins: number = 0;
  let watcherWins: number = 0;

  let ironcladLosses: number = 0;
  let silentLosses: number = 0;
  let defectLosses: number = 0;
  let watcherLosses: number = 0;

  let ironcladCardPicks: number = 0;
  let silentCardPicks: number = 0;
  let defectCardPicks: number = 0;
  let watcherCardPicks: number = 0;

  let ironcladCardSkips: number = 0;
  let silentCardSkips: number = 0;
  let defectCardSkips: number = 0;
  let watcherCardSkips: number = 0;

  let ironcladPotionsUsed: number = 0;
  let silentPotionsUsed: number = 0;
  let defectPotionsUsed: number = 0;
  let watcherPotionsUsed: number = 0;

  let ironcladCardsPurchased: number = 0;
  let silentCardsPurchased: number = 0;
  let defectCardsPurchased: number = 0;
  let watcherCardsPurchased: number = 0;

  let ironcladRelicsPurchased: number = 0;
  let silentRelicsPurchased: number = 0;
  let defectRelicsPurchased: number = 0;
  let watcherRelicsPurchased: number = 0;

  let ironcladPotionsPurchased: number = 0;
  let silentPotionsPurchased: number = 0;
  let defectPotionsPurchased: number = 0;
  let watcherPotionsPurchased: number = 0;

  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let character = file.character;
    let damageTaken = 0;
    let turnsTaken = 0;
    let won = file.won;
    let cardPicks = 0;
    let cardSkips = 0;
    let potionsUsed = file.floorsPotionsUsed.length;
    let cardsPurchased = 0;
    let relicsPurchased = 0;
    let potionsPurchased = 0;

    for (let j = 0; j < file.damageTaken.length; j++) {
      damageTaken += file.damageTaken[j].damage;
      turnsTaken += file.damageTaken[j].turns;
    }

    for (let j = 0; j < file.cardChoices.length; j++) {
      let selection = file.cardChoices[j].selection;
      if (selection === CardSelection.Card) {
        cardPicks += 1;
      } else if (selection === CardSelection.Skip) {
        cardSkips += 1;
      }
    }

    for (let j = 0; j < file.itemsPurchased.length; j++) {
      let itemPurchased = file.itemsPurchased[j];
      if (itemPurchased.selection == ItemSelection.Card) {
        cardsPurchased += 1;
      } else if (itemPurchased.selection === ItemSelection.Relic) {
        relicsPurchased += 1;
      } else if (itemPurchased.selection === ItemSelection.Potion) {
        potionsPurchased += 1;
      }
    }

    if (character === Character.Ironclad) {
      ironcladDamageTaken += damageTaken;
      ironcladTurnsTaken += turnsTaken;
      ironcladCardPicks += cardPicks;
      ironcladCardSkips += cardSkips;
      ironcladPotionsUsed += potionsUsed;
      ironcladCardsPurchased += cardsPurchased;
      ironcladRelicsPurchased += relicsPurchased;
      ironcladPotionsPurchased += potionsPurchased;
      if (won) {
        ironcladWins += 1;
      } else {
        ironcladLosses += 1;
      }
    } else if (character === Character.Silent) {
      silentDamageTaken += damageTaken;
      silentTurnsTaken += turnsTaken;
      silentCardPicks += cardPicks;
      silentCardSkips += cardSkips;
      silentPotionsUsed += potionsUsed;
      silentCardsPurchased += cardsPurchased;
      silentRelicsPurchased += relicsPurchased;
      silentPotionsPurchased += potionsPurchased;
      if (won) {
        silentWins += 1;
      } else {
        silentLosses += 1;
      }
    } else if (character === Character.Defect) {
      defectDamageTaken += damageTaken;
      defectTurnsTaken += turnsTaken;
      defectCardPicks += cardPicks;
      defectCardSkips += cardSkips;
      defectPotionsUsed += potionsUsed;
      defectCardsPurchased += cardsPurchased;
      defectRelicsPurchased += relicsPurchased;
      defectPotionsPurchased += potionsPurchased;
      if (won) {
        defectWins += 1;
      } else {
        defectLosses += 1;
      }
    } else if (character === Character.Watcher) {
      // Hack to handle blasphemy. TODO: handle this edge case better this probably causes bugs.
      damageTaken = damageTaken % 100000;
      watcherDamageTaken += damageTaken;
      watcherTurnsTaken += turnsTaken;
      watcherCardPicks += cardPicks;
      watcherCardSkips += cardSkips;
      watcherPotionsUsed += potionsUsed;
      watcherCardsPurchased += cardsPurchased;
      watcherRelicsPurchased += relicsPurchased;
      watcherPotionsPurchased += potionsPurchased;
      if (won) {
        watcherWins += 1;
      } else {
        watcherLosses += 1;
      }
    }
  }

  let damageTakenData = [
    { damageTaken: "Ironclad Damage Taken", count: ironcladDamageTaken },
    { damageTaken: "Silent Damage Taken", count: silentDamageTaken },
    { damageTaken: "Defect Damage Taken", count: defectDamageTaken },
    { damageTaken: "Watcher Damage Taken", count: watcherDamageTaken },
  ];
  new Chart(document.getElementById("totalDamageTaken")!, {
    type: "doughnut",
    data: {
      datasets: [
        {
          label: "Damage",
          data: damageTakenData.map((row) => row.count),
          backgroundColor: [
            "rgb(255, 102, 102)",
            "rgb(102, 255, 178)",
            "rgb(102, 178, 255)",
            "rgb(178, 102, 255)",
          ],
        },
      ],
    },
  });

  let turnData = [
    { turnsTaken: "Ironclad Turns", count: ironcladTurnsTaken },
    { turnsTaken: "Silent Turns", count: silentTurnsTaken },
    { turnsTaken: "Defect Turns", count: defectTurnsTaken },
    { turnsTaken: "Watcher Turns", count: watcherTurnsTaken },
  ];
  new Chart(document.getElementById("totalTurns")!, {
    type: "doughnut",
    data: {
      datasets: [
        {
          label: "Turns",
          data: turnData.map((row) => row.count),
          backgroundColor: [
            "rgb(255, 102, 102)",
            "rgb(102, 255, 178)",
            "rgb(102, 178, 255)",
            "rgb(178, 102, 255)",
          ],
        },
      ],
    },
  });

  let winData = [
    { wins: "Ironclad Wins", count: ironcladWins },
    { wins: "Silent Wins", count: silentWins },
    { wins: "Defect Wins", count: defectWins },
    { wins: "Watcher Wins", count: watcherWins },
  ];
  new Chart(document.getElementById("totalWins")!, {
    type: "doughnut",
    data: {
      datasets: [
        {
          label: "Wins",
          data: winData.map((row) => row.count),
          backgroundColor: [
            "rgb(255, 102, 102)",
            "rgb(102, 255, 178)",
            "rgb(102, 178, 255)",
            "rgb(178, 102, 255)",
          ],
        },
      ],
    },
  });

  let lossesData = [
    { losses: "Ironclad Losses", count: ironcladLosses },
    { losses: "Silent Losses", count: silentLosses },
    { losses: "Defect Losses", count: defectLosses },
    { losses: "Watcher Losses", count: watcherLosses },
  ];
  new Chart(document.getElementById("totalLosses")!, {
    type: "doughnut",
    data: {
      datasets: [
        {
          label: "Losses",
          data: lossesData.map((row) => row.count),
          backgroundColor: [
            "rgb(255, 102, 102)",
            "rgb(102, 255, 178)",
            "rgb(102, 178, 255)",
            "rgb(178, 102, 255)",
          ],
        },
      ],
    },
  });

  let winRatioData = [
    {
      winRatio: "Ironclad Win Ratio",
      count: ironcladWins / (ironcladWins + ironcladLosses),
    },
    {
      winRatio: "Silent Win Ratio",
      count: silentWins / (silentWins + silentLosses),
    },
    {
      winRatio: "Defect Win Ratio",
      count: defectWins / (defectWins + defectLosses),
    },
    {
      winRatio: "Watcher Win Ratio",
      count: watcherWins / (watcherWins + watcherLosses),
    },
  ];
  new Chart(document.getElementById("totalWinRatios")!, {
    type: "doughnut",
    data: {
      datasets: [
        {
          label: "Win Ratios",
          data: winRatioData.map((row) => row.count),
          backgroundColor: [
            "rgb(255, 102, 102)",
            "rgb(102, 255, 178)",
            "rgb(102, 178, 255)",
            "rgb(178, 102, 255)",
          ],
        },
      ],
    },
  });

  let cardPicksData = [
    { cardPicks: "Ironclad Card Picks", count: ironcladCardPicks },
    { cardPicks: "Silent Card Picks", count: silentCardPicks },
    { cardPicks: "Defect Card Picks", count: defectCardPicks },
    { cardPicks: "Watcher Card Picsk", count: watcherCardPicks },
  ];
  new Chart(document.getElementById("totalCardPicks")!, {
    type: "doughnut",
    data: {
      datasets: [
        {
          label: "Card Picks",
          data: cardPicksData.map((row) => row.count),
          backgroundColor: [
            "rgb(255, 102, 102)",
            "rgb(102, 255, 178)",
            "rgb(102, 178, 255)",
            "rgb(178, 102, 255)",
          ],
        },
      ],
    },
  });

  let cardSkipsData = [
    { cardSkips: "Ironclad Card Skips", count: ironcladCardSkips },
    { cardSkips: "Silent Card Skips", count: silentCardSkips },
    { cardSkips: "Defect Card Skips", count: defectCardSkips },
    { cardSkips: "Watcher Card SKips", count: watcherCardSkips },
  ];
  new Chart(document.getElementById("totalCardSkips")!, {
    type: "doughnut",
    data: {
      datasets: [
        {
          label: "Card Skips",
          data: cardSkipsData.map((row) => row.count),
          backgroundColor: [
            "rgb(255, 102, 102)",
            "rgb(102, 255, 178)",
            "rgb(102, 178, 255)",
            "rgb(178, 102, 255)",
          ],
        },
      ],
    },
  });

  let potionsUsedData = [
    { potionsUsed: "Ironclad Potions Used", count: ironcladPotionsUsed },
    { potionsUsed: "Silent Potions Used", count: silentPotionsUsed },
    { potionsUsed: "Defect Potions Used", count: defectPotionsUsed },
    { potionsUsed: "Watcher Potions Used", count: watcherPotionsUsed },
  ];
  new Chart(document.getElementById("totalPotionsUsed")!, {
    type: "doughnut",
    data: {
      datasets: [
        {
          label: "Potions Used",
          data: potionsUsedData.map((row) => row.count),
          backgroundColor: [
            "rgb(255, 102, 102)",
            "rgb(102, 255, 178)",
            "rgb(102, 178, 255)",
            "rgb(178, 102, 255)",
          ],
        },
      ],
    },
  });

  let cardsPurchasedData = [
    {
      cardsPurchased: "Ironclad Cards Purchased",
      count: ironcladCardsPurchased,
    },
    { cardsPurchased: "Silent Cards Purchased", count: silentCardsPurchased },
    { cardsPurchased: "Defect Cards Purchased", count: defectCardsPurchased },
    { cardsPurchased: "Watcher Cards Purchased", count: watcherCardsPurchased },
  ];
  new Chart(document.getElementById("totalCardsPurchased")!, {
    type: "doughnut",
    data: {
      datasets: [
        {
          label: "Cards Purchased",
          data: cardsPurchasedData.map((row) => row.count),
          backgroundColor: [
            "rgb(255, 102, 102)",
            "rgb(102, 255, 178)",
            "rgb(102, 178, 255)",
            "rgb(178, 102, 255)",
          ],
        },
      ],
    },
  });

  let relicsPurchasedData = [
    {
      relicsPurchased: "Ironclad Relics Purchased",
      count: ironcladRelicsPurchased,
    },
    {
      relicsPurchased: "Silent Relics Purchased",
      count: silentRelicsPurchased,
    },
    {
      relicsPurchased: "Defect Relics Purchased",
      count: defectRelicsPurchased,
    },
    {
      relicsPurchased: "Watcher Relics Purchased",
      count: watcherRelicsPurchased,
    },
  ];
  new Chart(document.getElementById("totalRelicsPurchased")!, {
    type: "doughnut",
    data: {
      datasets: [
        {
          label: "Relics Purchased",
          data: relicsPurchasedData.map((row) => row.count),
          backgroundColor: [
            "rgb(255, 102, 102)",
            "rgb(102, 255, 178)",
            "rgb(102, 178, 255)",
            "rgb(178, 102, 255)",
          ],
        },
      ],
    },
  });

  let potionsPurchasedData = [
    {
      potionsPurchased: "Ironclad Potions Purchased",
      count: ironcladPotionsPurchased,
    },
    {
      potionsPurchased: "Silent Potions Purchased",
      count: silentPotionsPurchased,
    },
    {
      potionsPurchased: "Defect Potions Purchased",
      count: defectPotionsPurchased,
    },
    {
      potionsPurchased: "Watcher Potions Purchased",
      count: watcherPotionsPurchased,
    },
  ];
  new Chart(document.getElementById("totalPotionsPurchased")!, {
    type: "doughnut",
    data: {
      datasets: [
        {
          label: "Potions Purchased",
          data: potionsPurchasedData.map((row) => row.count),
          backgroundColor: [
            "rgb(255, 102, 102)",
            "rgb(102, 255, 178)",
            "rgb(102, 178, 255)",
            "rgb(178, 102, 255)",
          ],
        },
      ],
    },
  });
}
