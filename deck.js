(() => {
  const deck = document.getElementById("deck");
  const stage = deck.querySelector(".stage");
  const slides = [...stage.querySelectorAll(".slide")];
  const steps = slides.map(s => [...s.querySelectorAll(".s")]);
  const cur = document.getElementById("cur"), tot = document.getElementById("tot"), bar = document.getElementById("bar");
  const more = stage.querySelector(".more");
  const notesPanel = document.getElementById("notesPanel"), notesBody = document.getElementById("notesBody");
  const notesBtn = document.getElementById("notesBtn"), ovBtn = document.getElementById("ovBtn"), overview = document.getElementById("overview");
  tot.textContent = slides.length;

  let i = 0, k = 0; // bild, antal visade steg

  function render() {
    steps[i].forEach((el, j) => el.classList.toggle("on", j < k));
    more.classList.toggle("show", k < steps[i].length);
    cur.textContent = i + 1;
    bar.style.width = ((i + 1) / slides.length * 100) + "%";
    const n = slides[i].querySelector(".notes");
    notesBody.innerHTML = n ? n.innerHTML : "<p>Inga anteckningar.</p>";
    overview.querySelectorAll(".thumb").forEach((t, j) => t.setAttribute("aria-current", j === i));
  }

  function go(n, dir, revealAll) {
    if (n < 0 || n >= slides.length) return;
    slides[i].hidden = true;
    const s = slides[n];
    s.hidden = false;
    s.classList.remove("in-next", "in-prev", "play");
    void s.offsetWidth; // starta om animationen
    if (s.classList.contains("title-slide")) s.classList.add("play");
    else if (dir) s.classList.add(dir > 0 ? "in-next" : "in-prev");
    i = n;
    k = revealAll ? steps[i].length : 0;
    history.replaceState(null, "", "#" + (i + 1));
    render();
  }

  function next() {
    if (k < steps[i].length) { k++; render(); }
    else go(i + 1, 1, false);
  }
  function prev() {
    if (k > 0) { k--; render(); }
    else go(i - 1, -1, true);
  }

  // Start
  slides.forEach(s => s.hidden = true);
  const start = parseInt(location.hash.slice(1), 10);
  i = Number.isFinite(start) ? Math.min(Math.max(start - 1, 0), slides.length - 1) : 0;
  go(i, 0, false);

  // Knappar
  document.getElementById("prev").onclick = prev;
  document.getElementById("next").onclick = next;
  deck.addEventListener("click", e => {
    if (e.target.closest("a,button")) return;
    const r = deck.getBoundingClientRect();
    (e.clientX - r.left < r.width * 0.25) ? prev() : next();
  });

  // Helskärm
  const fs = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (deck.requestFullscreen) deck.requestFullscreen().catch(() => {});
  };
  document.getElementById("fs").onclick = fs;

  // Anteckningar
  const toggleNotes = () => {
    notesPanel.hidden = !notesPanel.hidden;
    notesBtn.setAttribute("aria-pressed", !notesPanel.hidden);
  };
  notesBtn.onclick = toggleNotes;

  // Översikt
  function buildOverview() {
    overview.innerHTML = "";
    slides.forEach((s, j) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "thumb";
      const frame = document.createElement("div"); frame.className = "frame";
      const st = document.createElement("div"); st.className = "stage";
      const c = s.cloneNode(true);
      c.hidden = false; c.classList.remove("in-next", "in-prev", "play");
      c.querySelectorAll(".notes").forEach(n => n.remove());
      c.removeAttribute("aria-label");
      st.appendChild(c); frame.appendChild(st); b.appendChild(frame);
      const h = s.querySelector("h2, .big");
      const lab = document.createElement("span"); lab.className = "label";
      lab.textContent = (j + 1) + ". " + (h ? h.textContent.replace(/\s+/g, " ").trim() : "");
      b.appendChild(lab);
      b.setAttribute("aria-label", "Gå till bild " + (j + 1));
      b.onclick = () => { go(j, j > i ? 1 : -1, false); toggleOverview(); deck.scrollIntoView({ block: "center" }); deck.focus({ preventScroll: true }); };
      overview.appendChild(b);
    });
    render();
  }
  const toggleOverview = () => {
    if (overview.hidden && !overview.children.length) buildOverview();
    overview.hidden = !overview.hidden;
    ovBtn.setAttribute("aria-pressed", !overview.hidden);
    if (!overview.hidden) render();
  };
  ovBtn.onclick = toggleOverview;

  // Tangentbord
  document.addEventListener("keydown", e => {
    if (e.target.matches("input,textarea") || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.closest(".thumb") && (e.key === " " || e.key === "Enter")) return;
    const key = e.key.toLowerCase();
    if (["arrowright", "pagedown", " ", "enter"].includes(key)) { e.preventDefault(); next(); }
    else if (["arrowleft", "pageup", "backspace"].includes(key)) { e.preventDefault(); prev(); }
    else if (key === "home") go(0, -1, false);
    else if (key === "end") go(slides.length - 1, 1, true);
    else if (key === "f") fs();
    else if (key === "n") toggleNotes();
    else if (key === "o") toggleOverview();
  });

  // Svep
  let x0 = null;
  deck.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
  deck.addEventListener("touchend", e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
    x0 = null;
  });
})();
