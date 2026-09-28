# Bro till självständighet – webbplats

Statisk sida (HTML, CSS, JS). Inga ramverk, inga externa tjänster, inga kakor. Typsnittet (Atkinson Hyperlegible Next, OFL-licens) ligger i `fonts/`.

## Publicera med GitHub Pages
1. Ladda upp alla filer i roten av repot (branch `main`).
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `/ (root)`.
3. Kontrollera att `CNAME` innehåller exakt er domän.
4. Hos domänleverantören (DNS):
   - A-poster för `@`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - CNAME för `www`: `nanozir.github.io`
5. Tillbaka i Settings → Pages: vänta tills DNS-kontrollen blir grön och kryssa i *Enforce HTTPS*.

## Ändra innehåll
- Veckornas texter och e-postadress: överst i `script.js`.
- Övrig text: `index.html`.
- Färger: variablerna överst i `style.css`.
