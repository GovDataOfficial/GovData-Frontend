// order of this array is important
export const stateListMap = [
  { id: "00", name: "Bundesgebiet" },
  { id: "08", name: "Baden-Württemberg" },
  { id: "09", name: "Bayern" },
  { id: "11", name: "Berlin" },
  { id: "12", name: "Brandenburg" },
  { id: "04", name: "Bremen" },
  { id: "02", name: "Hamburg" },
  { id: "06", name: "Hessen" },
  { id: "13", name: "Mecklenburg-Vorpommern" },
  { id: "03", name: "Niedersachsen" },
  { id: "05", name: "Nordrhein-Westfalen" },
  { id: "07", name: "Rheinland-Pfalz" },
  { id: "10", name: "Saarland" },
  { id: "14", name: "Sachsen" },
  { id: "15", name: "Sachsen-Anhalt" },
  { id: "01", name: "Schleswig-Holstein" },
  { id: "16", name: "Thüringen" },
];

export function findStateById(id: (typeof stateListMap)[number]["id"]) {
  return stateListMap.find((state) => state.id === id);
}
