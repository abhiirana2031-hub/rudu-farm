const fs = require("fs");
let text = fs.readFileSync("src/mockData/initialData.js", "utf8");
let index = text.indexOf("export const INITIAL_MILK_SALES = [");
if (index !== -1) {
    let endOfSales = text.indexOf("];", index);
    if (endOfSales !== -1) {
        let clean = text.slice(0, endOfSales + 2) + "\n\n";
        const additions = `export const INITIAL_SESSION_CONFIG = [
  { shift: "Morning", start: "05:00", end: "08:00" },
  { shift: "Evening", start: "17:00", end: "20:00" }
];

export const INITIAL_SESSIONS = [
  {
    id: "SES-1001",
    operatorId: "EMP101",
    operatorName: "Amit Kumar",
    shift: "Morning",
    scheduledStart: "05:00",
    scheduledEnd: "08:00",
    actualLogin: "05:02",
    actualLogout: "08:00",
    logoutReason: "Auto Logout",
    status: "Completed",
    entriesCount: 87,
    volumeLogged: 642.5,
    collectionValue: 37250,
    date: "2026-07-24"
  }
];\n`;
        fs.writeFileSync("src/mockData/initialData.js", clean + additions);
        console.log("Fixed cleanly");
    }
}
