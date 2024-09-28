import Chart from "chart.js/auto";
import parseJson, { JSONError } from "parse-json";

type StsFile = {
  character: Character;
};

enum Character {
  Ironclad,
  Silent,
  Defect,
  Watcher,
  Error,
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
      graph(stsFiles);
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
    console.log("unexpected character chosen");
  }

  return {
    character: character,
  };
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
