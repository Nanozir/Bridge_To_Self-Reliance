/* ===== Inställningar ===== */
// Skriv in e-postadressen här när den finns, t.ex. "kontakt@dindoman.se".
// Så länge fältet är tomt visas ingen e-postknapp.
const KONTAKT_EPOST = "ali.osman@hotmail.se";

/* ===== Veckornas innehåll (från kursledarhandboken) ===== */
const VECKOR = [
  {
    kort: "Nuläge och mål",
    tema: "Min situation och mina mål",
    fraga: "Var är jag och vart vill jag?",
    mal: "Förstå ditt nuläge, se dina styrkor och hinder och formulera ett konkret mål.",
    innehall: ["Vad betyder självständighet?", "Kartläggning av nuläget", "Mina styrkor och erfarenheter", "Ett konkret mål och ett första litet steg"],
    hem: "Ta ett konkret steg mot ditt mål före nästa träff. Nästa vecka pratar vi om vad som fungerade och vad som hindrade."
  },
  {
    kort: "Arbete och utbildning",
    tema: "Arbete och utbildning",
    fraga: "Vad kan jag och vilka vägar finns?",
    mal: "Se dina resurser, förstå vägar mot arbete eller utbildning och välja ett nästa steg.",
    innehall: ["Vad kan jag? Kompetens från jobb, studier, språk och föreningsliv", "Tänk som en arbetsgivare – rollspel två och två", "Underlag till ditt CV", "Utbildningsvägar och behörighet"],
    hem: "Välj något: uppdatera CV, sök relevanta jobb, kontakta en arbetsgivare eller undersök en utbildning."
  },
  {
    kort: "Samhället",
    tema: "Förstå samhället och hitta rätt",
    fraga: "Hur hittar jag rätt information och rätt stöd?",
    mal: "Träna på att hitta rätt samhällsfunktion, förstå viktig information och förbereda en kontakt själv.",
    innehall: ["Vem gör vad? Kommun, region och myndigheter", "Metoden STOPP – LÄS – HITTA – FRÅGA – AGERA", "Läsa och förstå ett viktigt brev", "Förbereda och öva ett telefonsamtal"],
    hem: "Genomför en samhällsaktivitet: hitta officiell information, förbered ett samtal eller läs ett viktigt brev."
  },
  {
    kort: "Motivation",
    tema: "Motivation och eget ansvar",
    fraga: "Vad kan jag påverka och hur går jag till handling?",
    mal: "Identifiera hinder, skilja på vad du kan och inte kan påverka och ta ett litet, realistiskt steg.",
    innehall: ["Vad är motivation?", "Vad kan jag påverka – och vad inte?", "Gör stora mål till mindre steg", "Ansvar utan skuldbeläggning"],
    hem: "Sjudagarsutmaningen: välj en konkret handling med datum och tid. Blev den inte gjord? Gör steget mindre och försök igen."
  },
  {
    kort: "Familj och relationer",
    tema: "Familj, föräldraskap, skola och samhälle",
    fraga: "Hur stärker jag kommunikation, ansvar och samarbete?",
    mal: "Stärka kommunikation och samarbete i familjen eller en annan viktig relation.",
    innehall: ["Lyssna innan du svarar: LYSSNA – FRÅGA – FÖRSTÅ – AGERA", "Stöd och ansvar", "Hem och skola som ett lag", "Anpassas för deltagare utan barn: partner, förälder, syskon eller vän"],
    hem: "Gör en sak som stärker kommunikationen: ett lugnt samtal, lyssna utan att avbryta eller klargör en skolfråga."
  },
  {
    kort: "Framtidsplan",
    tema: "Min framtidsplan",
    fraga: "Vad har jag lärt mig och vad gör jag de kommande 90 dagarna?",
    mal: "Se din utveckling, göra en plan för 30–90 dagar och lämna kursen med ett konkret första steg.",
    innehall: ["Tillbakablick på vecka 1", "Slutskattning", "Din 90-dagarsplan", "Första veckan efter kursen"],
    hem: "Ta ditt första planerade steg inom sju dagar efter kursen. Kursen slutar – men din väg fortsätter."
  }
];

/* ===== Rita bron ===== */
const NS = "http://www.w3.org/2000/svg";
const svg = document.querySelector(".bridge-art");
const archesG = svg.querySelector(".arches");
const piersG = svg.querySelector(".piers");
const lampsG = svg.querySelector(".lamps");
const SPAN = 200, WATER = 226;

function el(name, attrs, parent) {
  const n = document.createElementNS(NS, name);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  parent.appendChild(n);
  return n;
}

el("rect", { class: "body", x: 0, y: 60, width: 1200, height: WATER - 60 }, archesG);
const arches = VECKOR.map((_, i) => {
  const x0 = i * SPAN + 12, x1 = (i + 1) * SPAN - 12;
  return el("path", { class: "arch", d: `M${x0} ${WATER} C${x0} 60 ${x1} 60 ${x1} ${WATER}` }, archesG);
});

const lamps = [];
for (let i = 0; i <= VECKOR.length; i++) {
  const x = Math.min(Math.max(i * SPAN, 10), 1190);
  el("line", { class: "lamp-post", x1: x, y1: 54, x2: x, y2: 22 }, lampsG);
  lamps.push(el("rect", { class: "lamp", x: x - 7, y: 6, width: 14, height: 18, rx: 3 }, lampsG));
}

/* ===== Knappar och panel ===== */
const spans = document.querySelector(".spans");
const panel = document.getElementById("vecka-panel");

const knappar = VECKOR.map((v, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "span-btn";
  b.id = `vecka-${i + 1}`;
  b.setAttribute("role", "tab");
  b.setAttribute("aria-controls", "vecka-panel");
  b.innerHTML = `<span class="num">${i + 1}</span><span class="lbl">${v.kort}</span>`;
  b.setAttribute("aria-label", `Vecka ${i + 1}: ${v.tema}`);
  b.addEventListener("click", () => valj(i));
  b.addEventListener("keydown", e => {
    let n = null;
    if (e.key === "ArrowRight") n = (i + 1) % VECKOR.length;
    if (e.key === "ArrowLeft") n = (i - 1 + VECKOR.length) % VECKOR.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = VECKOR.length - 1;
    if (n !== null) { e.preventDefault(); valj(n); knappar[n].focus(); }
  });
  spans.appendChild(b);
  return b;
});

function valj(i) {
  const v = VECKOR[i];
  knappar.forEach((b, j) => {
    const vald = j === i;
    b.setAttribute("aria-selected", vald);
    b.tabIndex = vald ? 0 : -1;
  });
  arches.forEach((a, j) => {
    a.classList.toggle("active", j === i);
    a.classList.toggle("passed", j < i);
  });
  panel.setAttribute("aria-labelledby", `vecka-${i + 1}`);
  panel.innerHTML = `
    <div>
      <p class="kicker">Vecka ${i + 1} av 6, cirka 2 timmar</p>
      <h3>${v.tema}</h3>
      <p class="question">${v.fraga}</p>
      <p>${v.mal}</p>
    </div>
    <div>
      <h4>Det här gör vi</h4>
      <ul>${v.innehall.map(x => `<li>${x}</li>`).join("")}</ul>
      <h4>Till nästa gång</h4>
      <p class="homework">${v.hem}</p>
    </div>`;
}
valj(0);

/* ===== Lyktorna tänds en gång när bron syns ===== */
const lugn = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function tand() { lamps.forEach((l, i) => setTimeout(() => l.classList.add("on"), lugn ? 0 : 180 * i)); }
if ("IntersectionObserver" in window && !lugn) {
  const io = new IntersectionObserver(e => {
    if (e[0].isIntersecting) { tand(); io.disconnect(); }
  }, { threshold: 0.5 });
  io.observe(svg);
} else { tand(); }

/* ===== E-post ===== */
if (KONTAKT_EPOST) {
  const k = document.getElementById("mejl-knapp");
  k.href = `mailto:${KONTAKT_EPOST}`;
  k.hidden = false;
}
