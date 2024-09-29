import Chart from "chart.js/auto";
import parseJson, { JSONError } from "parse-json";

type StsFile = {
  character: Character;
  goldPerFloor: number[];
  floorReached: number;
  // TODO: items_purged
  playtimeSeconds: number;
  isAscensionMode: boolean;
  // TODO: campfire_choices
  // TODO: neow_cost
  // TODO: master_deck
  // TODO: relics
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
  // TODO: timestamp  is this epoch start or end time of run
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
  // TODO: killed_by
  ascensionLevel: number;
};

enum Character {
  Ironclad,
  Silent,
  Defect,
  Watcher,
  Error,
}

enum FloorPath {
  Boss,
  BossReward,
  Elite,
  Event,
  Monster,
  RestSite,
  Shop,
  Treasure,
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
      console.log("error");
    });
}

function parseFile(file: string): StsFile {
  let json = JSON.parse(file);

  let character: Character;
  let characterChosen: string = json.character_chosen;
  if (characterChosen === "IRONCLAD") {
    character = Character.Ironclad;
  } else if (characterChosen === "THE_SILENT") {
    character = Character.Silent;
  } else if (characterChosen === "DEFECT") {
    character = Character.Defect;
  } else if (characterChosen === "WATCHER") {
    character = Character.Watcher;
  } else {
    character = Character.Error;
    console.log("unexpected character chosen: ", characterChosen);
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

  return {
    character,
    goldPerFloor: json.gold_per_floor,
    floorReached: json.floor_reached,
    playtimeSeconds: json.playtime,
    isAscensionMode: json.is_ascension_mode,
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
