const diveDestinations = [
  ["Ras Mohammed", "Egypt"], ["SS Thistlegorm", "Egypt"], ["Elphinstone Reef", "Egypt"],
  ["Blue Corner", "Palau"], ["German Channel", "Palau"], ["Ulong Channel", "Palau"],
  ["Cape Kri", "Indonesia"], ["Batu Bolong", "Indonesia"], ["USAT Liberty", "Indonesia"],
  ["Bunaken", "Indonesia"], ["Lembeh Strait", "Indonesia"], ["Melissa's Garden", "Indonesia"],
  ["Crystal Bay", "Indonesia"], ["Alor", "Indonesia"], ["Wakatobi", "Indonesia"],
  ["Maaya Thila", "Maldives"], ["Fish Head", "Maldives"], ["Kandooma Thila", "Maldives"],
  ["Fotteyo Kandu", "Maldives"], ["Miyaru Kandu", "Maldives"],
  ["Richelieu Rock", "Thailand"], ["Koh Bon", "Thailand"], ["Sail Rock", "Thailand"],
  ["Chumphon Pinnacle", "Thailand"], ["Hin Daeng", "Thailand"],
  ["Tubbataha Reefs", "Philippines"], ["Apo Island", "Philippines"], ["Verde Island", "Philippines"],
  ["Monad Shoal", "Philippines"], ["Sardine Run, Moalboal", "Philippines"], ["Anilao", "Philippines"],
  ["Great Blue Hole", "Belize"], ["Half Moon Caye Wall", "Belize"],
  ["Palancar Reef", "Mexico"], ["Santa Rosa Wall", "Mexico"], ["Cabo Pulmo", "Mexico"],
  ["Socorro Island", "Mexico"], ["La Paz", "Mexico"],
  ["Bloody Bay Wall", "Cayman Islands"], ["USS Kittiwake", "Cayman Islands"],
  ["Bari Reef", "Bonaire"], ["Salt Pier", "Bonaire"], ["Tugboat", "Curaçao"],
  ["Molinere Sculpture Park", "Grenada"], ["Champagne Reef", "Dominica"],
  ["Anse Chastanet", "Saint Lucia"], ["Columbus Isle", "Bahamas"],
  ["Rainbow Reef", "Fiji"], ["Beqa Lagoon", "Fiji"], ["Great White Wall", "Fiji"],
  ["SS President Coolidge", "Vanuatu"], ["Million Dollar Point", "Vanuatu"],
  ["Tiputa Pass", "French Polynesia"], ["South Pass, Fakarava", "French Polynesia"],
  ["Tikehau", "French Polynesia"], ["Niue's Coral Reefs", "Niue"],
  ["Cod Hole", "Australia"], ["Osprey Reef", "Australia"], ["Ningaloo Reef", "Australia"],
  ["SS Yongala", "Australia"], ["Fish Rock Cave", "Australia"], ["Poor Knights Islands", "New Zealand"],
  ["Gordon Rocks", "Ecuador"], ["Darwin Island", "Ecuador"], ["Wolf Island", "Ecuador"],
  ["Cocos Island", "Costa Rica"], ["Caño Island", "Costa Rica"], ["Coiba", "Panama"],
  ["Aliwal Shoal", "South Africa"], ["Sodwana Bay", "South Africa"], ["Protea Banks", "South Africa"],
  ["Two Mile Reef", "Mozambique"], ["Manta Reef, Tofo", "Mozambique"],
  ["Mnemba Atoll", "Tanzania"], ["Chumbe Reef", "Tanzania"], ["Watamu", "Kenya"],
  ["Aldabra Atoll", "Seychelles"], ["St Pierre Islet", "Seychelles"],
  ["Blue Bay", "Mauritius"], ["Nosy Tanikely", "Madagascar"],
  ["SS Umbria", "Sudan"], ["Seven Sisters", "Jordan"], ["Musandam", "Oman"],
  ["Daymaniyat Islands", "Oman"], ["Fujairah", "United Arab Emirates"],
  ["Blue Hole, Gozo", "Malta"], ["Cirkewwa", "Malta"], ["Medes Islands", "Spain"],
  ["El Hierro", "Spain"], ["Cabo de Palos", "Spain"], ["Grouper Cave, Lavezzi", "France"],
  ["Portofino", "Italy"], ["Ustica", "Italy"], ["Vis Island", "Croatia"],
  ["MS Zenobia", "Cyprus"], ["Garajau", "Portugal"], ["Princess Alice Bank", "Portugal"],
  ["Silfra", "Iceland"], ["Scapa Flow", "United Kingdom"], ["Lundy Island", "United Kingdom"],
  ["Saltstraumen", "Norway"], ["Gullmarsfjord", "Sweden"], ["Los Coroneles", "Colombia"],
  ["Roatán's West End Wall", "Honduras"], ["Utila", "Honduras"],
  ["Sipadan", "Malaysia"], ["Mabul", "Malaysia"], ["Layang-Layang", "Malaysia"],
  ["Atauro Island", "Timor-Leste"], ["Dili's Coast", "Timor-Leste"],
  ["Chandelier Cave", "Palau"], ["Kimbe Bay", "Papua New Guinea"],
  ["Milne Bay", "Papua New Guinea"], ["Chuuk Lagoon", "Micronesia"],
  ["Yap", "Micronesia"], ["Bikini Atoll", "Marshall Islands"],
  ["Kerama Islands", "Japan"], ["Ishigaki", "Japan"], ["Green Island", "Taiwan"],
  ["Jeju Island", "South Korea"], ["Hikkaduwa", "Sri Lanka"], ["Andaman Islands", "India"]
];

const wheel = document.getElementById("dive-wheel");
const spinButton = document.getElementById("wheel-spin");
const wheelResult = document.getElementById("wheel-result");
const svgNamespace = "http://www.w3.org/2000/svg";
const sectorCount = 12;
let wheelCandidates = [];
let spinning = false;
let lastChoice = null;
const makeSvg = (tag, attributes) => {
  const element = document.createElementNS(svgNamespace, tag);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
};

function prepareWheel() {
  const pool = diveDestinations.filter(destination => destination !== lastChoice);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  wheelCandidates = pool.slice(0, sectorCount);
  const rotor = makeSvg("g", { id: "wheel-rotor" });
  wheelCandidates.forEach(([site, country], index) => {
    const start = (index * 30 - 90) * Math.PI / 180;
    const end = start + Math.PI / 6;
    const path = makeSvg("path", {
      d: `M200 200L${200 + 188 * Math.cos(start)} ${200 + 188 * Math.sin(start)}A188 188 0 0 1 ${200 + 188 * Math.cos(end)} ${200 + 188 * Math.sin(end)}Z`,
      fill: ["#246a77", "#357f84", "#145263", "#537e79"][index % 4],
      stroke: "#102f3d", "stroke-width": 2
    });
    const title = makeSvg("title", {});
    title.textContent = `${site}, ${country}`;
    path.append(title);
    const text = makeSvg("text", {
      x: 378, y: 204, transform: `rotate(${index * 30 - 75} 200 200)`,
      fill: "#fff3d8", "font-size": 10, "font-family": "Segoe UI, sans-serif", "text-anchor": "end"
    });
    text.textContent = site.length > 20 ? site.slice(0, 18) + "…" : site;
    rotor.append(path, text);
  });
  wheel.replaceChildren(rotor);
  wheel.append(makeSvg("circle", { cx:200, cy:200, r:28, fill:"#eaca85", stroke:"#102f3d", "stroke-width":5 }));
  return rotor;
}

document.getElementById("wheel-pool").textContent =
  `${diveDestinations.length} dive ideas across ${new Set(diveDestinations.map(([, country]) => country)).size} destinations. Twelve fresh possibilities on every spin.`;
document.getElementById("wheel-destinations").textContent =
  diveDestinations.map(([site, country]) => `${site} · ${country}`).join(" / ");
prepareWheel();
spinButton.addEventListener("click", async () => {
  if (spinning) return;
  spinning = true;
  spinButton.disabled = true;
  spinButton.textContent = "Finding your blue horizon…";
  wheelResult.textContent = "The ocean is choosing…";
  const rotor = prepareWheel();
  const chosenIndex = Math.floor(Math.random() * sectorCount);
  const rotation = 360 * 5 + 360 - (chosenIndex * 30 + 15);
  const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 4200;
  const animation = rotor.animate(
    [{ transform: "rotate(0deg)" }, { transform: `rotate(${rotation}deg)` }],
    { duration, easing: "cubic-bezier(.12,.7,.13,1)", fill: "forwards" }
  );
  rotor.style.transformOrigin = "200px 200px";
  await animation.finished;
  const [site, country] = wheelCandidates[chosenIndex];
  lastChoice = wheelCandidates[chosenIndex];
  const title = document.createElement("strong");
  title.textContent = site;
  const detail = document.createElement("p");
  detail.textContent = `${country} · Your next adventure starts with a little research.`;
  wheelResult.replaceChildren(title, detail);
  spinButton.textContent = "Spin again ↻";
  spinButton.disabled = false;
  spinning = false;
});
