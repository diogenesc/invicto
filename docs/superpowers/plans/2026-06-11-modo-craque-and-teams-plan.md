# Modo Craque e Expansão de Times Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the "Modo Craque" (expert mode) game option where player overalls are hidden under a lock icon during the draft and revealed at the end, and expand the historical teams database from 16 to 32 squads.

**Architecture:** Add gameMode and revealed states to App.jsx with localStorage persistence. Modify MainMenu.jsx to include a game mode selection step using cards. Modify PlayerDraft.jsx, SoccerField.jsx, and App.jsx to hide stats during the draft in "craque" mode, and present a Satisfaction Reveal button before starting simulation. Expand database.js with 16 new squads.

**Tech Stack:** React 18, CSS (Vanilla), Vite.

---

### Task 1: Expand Database with 16 New Historical Squads

**Files:**
- Modify: `src/data/database.js`

- [ ] **Step 1: Append new team objects to `BR_TEAMS`**

Add the following 16 new teams to the end of the `BR_TEAMS` array in `src/data/database.js`:

```javascript
  {
    id: "gremio-2017",
    name: "Grêmio",
    year: 2017,
    flag: "🔵",
    squad: [
      { id: "grohe-2017", name: "Marcelo Grohe", positions: ["GOL"], number: 1, force: 86, legend: true },
      { id: "edilson-2017", name: "Edilson", positions: ["LD"], number: 2, force: 80, legend: false },
      { id: "geromel-2017", name: "Pedro Geromel", positions: ["ZAG"], number: 3, force: 87, legend: true },
      { id: "kannemann-2017", name: "Walter Kannemann", positions: ["ZAG"], number: 4, force: 85, legend: false },
      { id: "cortez-2017", name: "Bruno Cortez", positions: ["LE"], number: 6, force: 78, legend: false },
      { id: "arthur-2017", name: "Arthur", positions: ["MC", "VOL"], number: 8, force: 86, legend: true },
      { id: "jailson-2017", name: "Jailson", positions: ["VOL"], number: 5, force: 79, legend: false },
      { id: "ramiro-2017", name: "Ramiro", positions: ["MC", "PD"], number: 17, force: 80, legend: false },
      { id: "luan-2017", name: "Luan", positions: ["MEI", "CA"], number: 7, force: 89, legend: true },
      { id: "fernandinho-2017", name: "Fernandinho", positions: ["PE", "PD"], number: 11, force: 81, legend: false },
      { id: "barrios-2017", name: "Lucas Barrios", positions: ["CA"], number: 18, force: 82, legend: false }
    ]
  },
  {
    id: "vasco-2011",
    name: "Vasco",
    year: 2011,
    flag: "💢",
    squad: [
      { id: "prass-2011", name: "Fernando Prass", positions: ["GOL"], number: 1, force: 83, legend: false },
      { id: "fagner-2011", name: "Fagner", positions: ["LD"], number: 2, force: 82, legend: false },
      { id: "dede-2011", name: "Dedé", positions: ["ZAG"], number: 3, force: 87, legend: true },
      { id: "anderson-2011", name: "Anderson Martins", positions: ["ZAG"], number: 4, force: 82, legend: false },
      { id: "ramon-2011", name: "Ramon", positions: ["LE"], number: 6, force: 79, legend: false },
      { id: "romulo-2011", name: "Rômulo", positions: ["VOL"], number: 5, force: 81, legend: false },
      { id: "jumar-2011", name: "Jumar", positions: ["VOL", "MC"], number: 8, force: 77, legend: false },
      { id: "allan-2011", name: "Allan", positions: ["MC", "LD"], number: 15, force: 80, legend: false },
      { id: "felipe-2011", name: "Felipe", positions: ["MEI", "LE"], number: 6, force: 85, legend: true },
      { id: "diego-souza-2011", name: "Diego Souza", positions: ["MEI", "CA"], number: 10, force: 86, legend: true },
      { id: "aleandro-2011", name: "Alecsandro", positions: ["CA"], number: 9, force: 81, legend: false }
    ]
  },
  {
    id: "athletico-2019",
    name: "Athletico-PR",
    year: 2019,
    flag: "🌪️",
    squad: [
      { id: "santos-2019", name: "Santos", positions: ["GOL"], number: 1, force: 84, legend: false },
      { id: "madson-2019", name: "Madson", positions: ["LD"], number: 2, force: 79, legend: false },
      { id: "heleno-2019", name: "Thiago Heleno", positions: ["ZAG"], number: 44, force: 83, legend: false },
      { id: "pereira-2019", name: "Léo Pereira", positions: ["ZAG"], number: 4, force: 81, legend: false },
      { id: "azevedo-2019", name: "Márcio Azevedo", positions: ["LE"], number: 6, force: 78, legend: false },
      { id: "wellington-2019", name: "Wellington", positions: ["VOL"], number: 5, force: 79, legend: false },
      { id: "bruno-g-2019", name: "Bruno Guimarães", positions: ["MC"], number: 39, force: 86, legend: true },
      { id: "cittadini-2019", name: "Léo Cittadini", positions: ["MC", "MEI"], number: 18, force: 80, legend: false },
      { id: "nikao-2019", name: "Nikão", positions: ["PD", "MEI"], number: 11, force: 84, legend: true },
      { id: "rony-2019", name: "Rony", positions: ["PE", "PD"], number: 7, force: 82, legend: false },
      { id: "ruben-2019", name: "Marco Ruben", positions: ["CA"], number: 9, force: 83, legend: false }
    ]
  },
  {
    id: "bahia-1988",
    name: "Bahia",
    year: 1988,
    flag: "🇧🇦",
    squad: [
      { id: "ronaldo-1988", name: "Ronaldo", positions: ["GOL"], number: 1, force: 82, legend: false },
      { id: "tarantini-1988", name: "Tarantini", positions: ["LD"], number: 2, force: 79, legend: false },
      { id: "marcelo-1988", name: "João Marcelo", positions: ["ZAG"], number: 3, force: 81, legend: false },
      { id: "claudir-1988", name: "Claudir", positions: ["ZAG"], number: 4, force: 80, legend: false },
      { id: "robson-1988", name: "Paulo Robson", positions: ["LE"], number: 6, force: 79, legend: false },
      { id: "rodrigues-1988", name: "Paulo Rodrigues", positions: ["VOL"], number: 5, force: 80, legend: false },
      { id: "sergipano-1988", name: "Gil Sergipano", positions: ["MC"], number: 8, force: 81, legend: false },
      { id: "bobo-1988", name: "Bobô", positions: ["MEI"], number: 10, force: 88, legend: true },
      { id: "zecarlos-1988", name: "Zé Carlos", positions: ["MEI", "PD"], number: 7, force: 82, legend: false },
      { id: "charles-1988", name: "Charles", positions: ["CA"], number: 9, force: 84, legend: true },
      { id: "marquinhos-1988", name: "Marquinhos", positions: ["PE"], number: 11, force: 80, legend: false }
    ]
  },
  {
    id: "fortaleza-2023",
    name: "Fortaleza",
    year: 2023,
    flag: "🦁",
    squad: [
      { id: "ricardo-2023", name: "João Ricardo", positions: ["GOL"], number: 1, force: 81, legend: false },
      { id: "tinga-2023", name: "Tinga", positions: ["LD", "ZAG"], number: 2, force: 81, legend: false },
      { id: "britez-2023", name: "Emanuel Brítez", positions: ["ZAG", "LD"], number: 19, force: 80, legend: false },
      { id: "titi-2023", name: "Titi", positions: ["ZAG"], number: 4, force: 79, legend: false },
      { id: "pacheco-2023", name: "Bruno Pacheco", positions: ["LE"], number: 6, force: 80, legend: false },
      { id: "welison-2023", name: "Zé Welison", positions: ["VOL"], number: 17, force: 79, legend: false },
      { id: "alexandre-2023", name: "Caio Alexandre", positions: ["MC", "VOL"], number: 8, force: 81, legend: false },
      { id: "pochettino-2023", name: "Tomás Pochettino", positions: ["MEI", "MC"], number: 7, force: 82, legend: false },
      { id: "marinho-2023", name: "Marinho", positions: ["PD"], number: 12, force: 81, legend: false },
      { id: "guilherme-2023", name: "Guilherme", positions: ["PE"], number: 29, force: 79, legend: false },
      { id: "lucero-2023", name: "Juan Martín Lucero", positions: ["CA"], number: 9, force: 83, legend: false }
    ]
  },
  {
    id: "goias-2005",
    name: "Goiás",
    year: 2005,
    flag: "🟢",
    squad: [
      { id: "harlei-2005", name: "Harlei", positions: ["GOL"], number: 1, force: 84, legend: false },
      { id: "dias-2005", name: "Rafael Dias", positions: ["LD"], number: 2, force: 77, legend: false },
      { id: "leone-2005", name: "André Leone", positions: ["ZAG"], number: 3, force: 80, legend: false },
      { id: "wescley-2005", name: "Wescley", positions: ["ZAG"], number: 4, force: 78, legend: false },
      { id: "jadilson-2005", name: "Jadílson", positions: ["LE"], number: 6, force: 82, legend: false },
      { id: "cleber-2005", name: "Cléber Gaúcho", positions: ["VOL"], number: 5, force: 79, legend: false },
      { id: "amaral-2005", name: "Amaral", positions: ["VOL"], number: 8, force: 78, legend: false },
      { id: "tabata-2005", name: "Rodrigo Tabata", positions: ["MEI"], number: 10, force: 83, legend: false },
      { id: "danilo-2005", name: "Danilo", positions: ["MEI", "PE"], number: 7, force: 81, legend: false },
      { id: "roni-2005", name: "Roni", positions: ["CA"], number: 9, force: 80, legend: false },
      { id: "souza-2005", name: "Souza", positions: ["CA"], number: 11, force: 85, legend: true }
    ]
  },
  {
    id: "sport-2008",
    name: "Sport",
    year: 2008,
    flag: "🦁",
    squad: [
      { id: "magrao-2008", name: "Magrão", positions: ["GOL"], number: 1, force: 84, legend: false },
      { id: "diogo-2008", name: "Diogo", positions: ["LD"], number: 2, force: 77, legend: false },
      { id: "igor-2008", name: "Igor", positions: ["ZAG"], number: 3, force: 79, legend: false },
      { id: "durval-2008", name: "Durval", positions: ["ZAG"], number: 4, force: 83, legend: true },
      { id: "dutra-2008", name: "Dutra", positions: ["LE"], number: 6, force: 80, legend: false },
      { id: "paulista-2008", name: "Daniel Paulista", positions: ["VOL"], number: 5, force: 79, legend: false },
      { id: "goiano-2008", name: "Sandro Goiano", positions: ["VOL"], number: 8, force: 78, legend: false },
      { id: "kassio-2008", name: "Kássio", positions: ["MC", "MEI"], number: 17, force: 77, legend: false },
      { id: "bala-2008", name: "Carlinhos Bala", positions: ["MEI", "PD"], number: 11, force: 84, legend: true },
      { id: "enilton-2008", name: "Enílton", positions: ["CA"], number: 9, force: 79, legend: false },
      { id: "machado-2008", name: "Leandro Machado", positions: ["CA"], number: 99, force: 81, legend: false }
    ]
  },
  {
    id: "vitoria-2013",
    name: "Vitória",
    year: 2013,
    flag: "🦁",
    squad: [
      { id: "wilson-2013", name: "Wilson", positions: ["GOL"], number: 1, force: 81, legend: false },
      { id: "ayrton-2013", name: "Ayrton", positions: ["LD"], number: 2, force: 78, legend: false },
      { id: "vramos-2013", name: "Victor Ramos", positions: ["ZAG"], number: 3, force: 79, legend: false },
      { id: "kadu-2013", name: "Kadu", positions: ["ZAG"], number: 4, force: 78, legend: false },
      { id: "juan-2013", name: "Juan", positions: ["LE"], number: 6, force: 81, legend: false },
      { id: "caceres-2013", name: "Cáceres", positions: ["VOL"], number: 5, force: 80, legend: false },
      { id: "lcaceres-2013", name: "Luis Cáceres", positions: ["MC"], number: 8, force: 79, legend: false },
      { id: "escudero-2013", name: "Damián Escudero", positions: ["MEI"], number: 10, force: 83, legend: false },
      { id: "marquinhos-2013", name: "Marquinhos", positions: ["PD", "PE"], number: 7, force: 81, legend: false },
      { id: "biancucchi-2013", name: "Maxi Biancucchi", positions: ["PE", "CA"], number: 11, force: 82, legend: false },
      { id: "dinei-2013", name: "Dinei", positions: ["CA"], number: 9, force: 82, legend: false }
    ]
  },
  {
    id: "guarani-1978",
    name: "Guarani",
    year: 1978,
    flag: "🏹",
    squad: [
      { id: "neneca-1978", name: "Neneca", positions: ["GOL"], number: 1, force: 83, legend: false },
      { id: "mauro-1978", name: "Mauro", positions: ["LD"], number: 2, force: 79, legend: false },
      { id: "gomes-1978", name: "Gomes", positions: ["ZAG"], number: 3, force: 81, legend: false },
      { id: "edson-1978", name: "Edson", positions: ["ZAG"], number: 4, force: 80, legend: false },
      { id: "miranda-1978", name: "Miranda", positions: ["LE"], number: 6, force: 80, legend: false },
      { id: "zecarlos-1978", name: "Zé Carlos", positions: ["VOL"], number: 5, force: 82, legend: false },
      { id: "renato-1978", name: "Renato", positions: ["MC", "MEI"], number: 8, force: 85, legend: true },
      { id: "zenon-1978", name: "Zenon", positions: ["MEI"], number: 10, force: 87, legend: true },
      { id: "capitao-1978", name: "Capitão", positions: ["PD"], number: 7, force: 80, legend: false },
      { id: "careca-1978", name: "Careca", positions: ["CA"], number: 9, force: 90, legend: true },
      { id: "bozo-1978", name: "Bozó", positions: ["PE"], number: 11, force: 81, legend: false }
    ]
  },
  {
    id: "coritiba-2011",
    name: "Coritiba",
    year: 2011,
    flag: "🟢",
    squad: [
      { id: "bastos-2011", name: "Edson Bastos", positions: ["GOL"], number: 1, force: 80, legend: false },
      { id: "jonas-2011", name: "Jonas", positions: ["LD"], number: 2, force: 79, legend: false },
      { id: "jeci-2011", name: "Jeci", positions: ["ZAG"], number: 3, force: 78, legend: false },
      { id: "emerson-2011", name: "Emerson", positions: ["ZAG"], number: 4, force: 80, legend: false },
      { id: "mendes-2011", name: "Lucas Mendes", positions: ["LE", "ZAG"], number: 6, force: 79, legend: false },
      { id: "willian-2011", name: "Willian Farias", positions: ["VOL"], number: 5, force: 79, legend: false },
      { id: "gago-2011", name: "Léo Gago", positions: ["VOL", "MC"], number: 8, force: 79, legend: false },
      { id: "rafinha-2011", name: "Rafinha", positions: ["MEI", "PE"], number: 7, force: 85, legend: true },
      { id: "davi-2011", name: "Davi", positions: ["MEI"], number: 10, force: 81, legend: false },
      { id: "maurelio-2011", name: "Marcos Aurélio", positions: ["PE", "CA"], number: 11, force: 81, legend: false },
      { id: "bill-2011", name: "Bill", positions: ["CA"], number: 9, force: 80, legend: false }
    ]
  },
  {
    id: "bragantino-2021",
    name: "Bragantino",
    year: 2021,
    flag: "🐂",
    squad: [
      { id: "cleiton-2021", name: "Cleiton", positions: ["GOL"], number: 18, force: 81, legend: false },
      { id: "aderlan-2021", name: "Aderlan", positions: ["LD"], number: 2, force: 79, legend: false },
      { id: "ortiz-2021", name: "Léo Ortiz", positions: ["ZAG"], number: 3, force: 84, legend: true },
      { id: "fbruno-2021", name: "Fabrício Bruno", positions: ["ZAG"], number: 14, force: 82, legend: false },
      { id: "candido-2021", name: "Luan Cândido", positions: ["LE"], number: 6, force: 80, legend: false },
      { id: "jadsom-2021", name: "Jadsom", positions: ["VOL"], number: 5, force: 78, legend: false },
      { id: "evangelista-2021", name: "Lucas Evangelista", positions: ["MC"], number: 8, force: 81, legend: false },
      { id: "praxedes-2021", name: "Praxedes", positions: ["MEI", "MC"], number: 25, force: 80, legend: false },
      { id: "artur-2021", name: "Artur", positions: ["PD"], number: 7, force: 85, legend: true },
      { id: "helinho-2021", name: "Helinho", positions: ["PE", "PD"], number: 11, force: 80, legend: false },
      { id: "ytalo-2021", name: "Ytalo", positions: ["CA"], number: 15, force: 81, legend: false }
    ]
  },
  {
    id: "chapecoense-2016",
    name: "Chapecoense",
    year: 2016,
    flag: "🟢",
    squad: [
      { id: "danilo-2016", name: "Danilo", positions: ["GOL"], number: 1, force: 85, legend: true },
      { id: "gimenez-2016", name: "Gimenez", positions: ["LD"], number: 2, force: 78, legend: false },
      { id: "neto-2016", name: "Neto", positions: ["ZAG"], number: 4, force: 82, legend: false },
      { id: "thiego-2016", name: "Thiego", positions: ["ZAG"], number: 3, force: 81, legend: false },
      { id: "dener-2016", name: "Dener", positions: ["LE"], number: 6, force: 80, legend: false },
      { id: "josimar-2016", name: "Josimar", positions: ["VOL"], number: 5, force: 79, legend: false },
      { id: "gil-2016", name: "Gil", positions: ["VOL", "MC"], number: 8, force: 79, legend: false },
      { id: "csantana-2016", name: "Cleber Santana", positions: ["MEI", "MC"], number: 88, force: 84, legend: true },
      { id: "ananias-2016", name: "Ananias", positions: ["PD", "MEI"], number: 11, force: 80, legend: false },
      { id: "lgomes-2016", name: "Lucas Gomes", positions: ["PE"], number: 7, force: 80, legend: false },
      { id: "kempes-2016", name: "Kempes", positions: ["CA"], number: 9, force: 81, legend: false }
    ]
  },
  {
    id: "criciuma-1991",
    name: "Criciúma",
    year: 1991,
    flag: "🐯",
    squad: [
      { id: "alexandre-1991", name: "Alexandre", positions: ["GOL"], number: 1, force: 80, legend: false },
      { id: "sarandi-1991", name: "Sarandi", positions: ["LD"], number: 2, force: 77, legend: false },
      { id: "vilmar-1991", name: "Vilmar", positions: ["ZAG"], number: 3, force: 79, legend: false },
      { id: "altair-1991", name: "Altair", positions: ["ZAG"], number: 4, force: 79, legend: false },
      { id: "ita-1991", name: "Itá", positions: ["LE"], number: 6, force: 81, legend: false },
      { id: "gelson-1991", name: "Gelson", positions: ["VOL"], number: 5, force: 80, legend: false },
      { id: "rcavalo-1991", name: "Roberto Cavalo", positions: ["VOL"], number: 8, force: 82, legend: false },
      { id: "zroberto-1991", name: "Zé Roberto", positions: ["MEI"], number: 7, force: 79, legend: false },
      { id: "grizzo-1991", name: "Grizzo", positions: ["MEI"], number: 10, force: 84, legend: true },
      { id: "jlenzi-1991", name: "Jairo Lenzi", positions: ["PE"], number: 11, force: 82, legend: false },
      { id: "soares-1991", name: "Soares", positions: ["CA"], number: 9, force: 82, legend: false }
    ]
  },
  {
    id: "juventude-1999",
    name: "Juventude",
    year: 1999,
    flag: "🟢",
    squad: [
      { id: "donizete-1999", name: "Donizete", positions: ["GOL"], number: 1, force: 79, legend: false },
      { id: "teixeira-1999", name: "Marcos Teixeira", positions: ["LD"], number: 2, force: 77, legend: false },
      { id: "capone-1999", name: "Capone", positions: ["ZAG"], number: 3, force: 81, legend: false },
      { id: "picoli-1999", name: "Picoli", positions: ["ZAG"], number: 4, force: 80, legend: false },
      { id: "edson-1999", name: "Édson", positions: ["LE"], number: 6, force: 78, legend: false },
      { id: "roberto-1999", name: "Roberto", positions: ["VOL"], number: 5, force: 79, legend: false },
      { id: "lauro-1999", name: "Lauro", positions: ["VOL", "MC"], number: 8, force: 80, legend: false },
      { id: "wallace-1999", name: "Wallace", positions: ["MC"], number: 7, force: 78, legend: false },
      { id: "mabilia-1999", name: "Mabília", positions: ["MEI"], number: 10, force: 81, legend: false },
      { id: "mauricio-1999", name: "Maurício", positions: ["CA"], number: 9, force: 80, legend: false },
      { id: "christian-1999", name: "Christian", positions: ["CA"], number: 11, force: 84, legend: true }
    ]
  },
  {
    id: "paysandu-2003",
    name: "Paysandu",
    year: 2003,
    flag: "🛩️",
    squad: [
      { id: "ronaldo-2003", name: "Ronaldo", positions: ["GOL"], number: 1, force: 80, legend: false },
      { id: "baiano-2003", name: "Baiano", positions: ["LD"], number: 2, force: 78, legend: false },
      { id: "jorginho-2003", name: "Jorginho", positions: ["ZAG"], number: 3, force: 79, legend: false },
      { id: "lima-2003", name: "Lima", positions: ["ZAG"], number: 4, force: 78, legend: false },
      { id: "souza-2003", name: "Souza", positions: ["LE"], number: 6, force: 78, legend: false },
      { id: "sandro-2003", name: "Sandro", positions: ["VOL"], number: 5, force: 80, legend: false },
      { id: "vanderson-2003", name: "Vânderson", positions: ["VOL"], number: 8, force: 81, legend: false },
      { id: "harison-2003", name: "Harison", positions: ["MEI"], number: 7, force: 80, legend: false },
      { id: "welber-2003", name: "Welber", positions: ["MEI", "PD"], number: 11, force: 80, legend: false },
      { id: "iarley-2003", name: "Iarley", positions: ["CA", "PE"], number: 10, force: 85, legend: true },
      { id: "robgol-2003", name: "Robgol", positions: ["CA"], number: 9, force: 84, legend: true }
    ]
  },
  {
    id: "ceara-2020",
    name: "Ceará",
    year: 2020,
    flag: "🏁",
    squad: [
      { id: "richard-2020", name: "Richard", positions: ["GOL"], number: 91, force: 80, legend: false },
      { id: "xavier-2020", name: "Samuel Xavier", positions: ["LD"], number: 22, force: 80, legend: false },
      { id: "pagnussat-2020", name: "Tiago Pagnussat", positions: ["ZAG"], number: 36, force: 79, legend: false },
      { id: "lotavio-2020", name: "Luiz Otávio", positions: ["ZAG"], number: 3, force: 81, legend: false },
      { id: "bpacheco-2020", name: "Bruno Pacheco", positions: ["LE"], number: 6, force: 80, legend: false },
      { id: "sobral-2020", name: "Fernando Sobral", positions: ["VOL", "MC"], number: 88, force: 81, legend: false },
      { id: "charles-2020", name: "Charles", positions: ["VOL"], number: 35, force: 79, legend: false },
      { id: "vina-2020", name: "Vina", positions: ["MEI"], number: 29, force: 86, legend: true },
      { id: "lima-2020", name: "Lima", positions: ["MEI", "PE", "PD"], number: 45, force: 80, legend: false },
      { id: "chu-2020", name: "Léo Chú", positions: ["PE"], number: 26, force: 79, legend: false },
      { id: "cleber-2020", name: "Cléber", positions: ["CA"], number: 39, force: 80, legend: false }
    ]
  }
```

- [ ] **Step 2: Save database changes**
- [ ] **Step 3: Manually verify file syntax**

Ensure the commas and brackets are perfectly balanced.
Run build to check syntax: `npm run build`
Expected: Success.

- [ ] **Step 4: Commit database changes**

```bash
git add src/data/database.js
git commit -m "feat: add 16 new historical squads to database"
```

---

### Task 2: Implement Game Mode Selection (Normal vs Craque) in Menu

**Files:**
- Modify: `src/components/MainMenu.jsx`

- [ ] **Step 1: Update MainMenu to select game mode**

Add the gameMode and setGameMode props, and render Mode Selection cards before the "Iniciar" button:

```jsx
// src/components/MainMenu.jsx
// Modify props signature:
export default function MainMenu({
  formation,
  setFormation,
  playingStyle,
  setPlayingStyle,
  gameMode = 'normal',
  setGameMode,
  onStart
}) {
  // Add game mode choices:
  const MODES = [
    { id: 'normal', name: 'Normal', desc: 'Atributos e médias visíveis durante todo o draft' },
    { id: 'craque', name: 'Modo Craque ✨', desc: 'Atributos e médias ocultos por 🔒 até fechar os 11 titulares' }
  ];

  // In the return statement, insert the layout:
  // (Insert before the <button className="start-game-btn">)
  return (
    <div className="menu-container">
      {/* ... existing code ... */}

      <div className="menu-section">
        <h3>3. Escolha o Modo de Jogo</h3>
        <div className="options-grid">
          {MODES.map(m => (
            <button
              key={m.id}
              className={`menu-option-card ${gameMode === m.id ? 'active' : ''}`}
              onClick={() => setGameMode(m.id)}
            >
              <div className="option-title">{m.name}</div>
              <div className="option-desc">{m.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <button className="start-game-btn" onClick={onStart}>
        INICIAR INVICTO RUN 🎲
      </button>
      {/* ... existing code ... */}
    </div>
  );
}
```

- [ ] **Step 2: Commit MainMenu changes**

```bash
git add src/components/MainMenu.jsx
git commit -m "feat: add game mode cards to MainMenu"
```

---

### Task 3: Manage Game Mode State and Persistence

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add gameMode and revealed states with localStorage support**

Modify `src/App.jsx` to load and save `gameMode` and `revealed` states:

```javascript
// src/App.jsx:24-35 (approx)
  const [screen, setScreen] = useState(savedState.screen || 'menu');
  const [formation, setFormation] = useState(savedState.formation || '4-3-3');
  const [playingStyle, setPlayingStyle] = useState(savedState.playingStyle || 'balanced');
  const [gameMode, setGameMode] = useState(savedState.gameMode || 'normal');
  const [revealed, setRevealed] = useState(savedState.revealed || false);
  const [lineup, setLineup] = useState(savedState.lineup || {});
```

Modify the `useEffect` hook to include these states in localStorage:

```javascript
// src/App.jsx:37-54 (approx)
  useEffect(() => {
    const stateToSave = {
      screen,
      formation,
      playingStyle,
      gameMode,
      revealed,
      lineup,
      reRolls,
      streak,
      history,
      currentDraw,
      selectedPlayer
    };
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Error saving state", e);
    }
  }, [screen, formation, playingStyle, gameMode, revealed, lineup, reRolls, streak, history, currentDraw, selectedPlayer]);
```

- [ ] **Step 2: Reset state on start game**

Modify `handleStartGame` to reset `revealed` to false:

```javascript
// src/App.jsx:59-67 (approx)
  const handleStartGame = () => {
    setLineup({});
    setReRolls(3);
    setStreak(0);
    setHistory([]);
    setCurrentDraw(null);
    setSelectedPlayer(null);
    setRevealed(false);
    setScreen('draft');
  };
```

- [ ] **Step 3: Pass props to MainMenu and PlayerDraft**

In the return block of `App.jsx`, update the rendering of `<MainMenu>` and `<PlayerDraft>`:

```jsx
// MainMenu rendering
<MainMenu
  formation={formation}
  setFormation={setFormation}
  playingStyle={playingStyle}
  setPlayingStyle={setPlayingStyle}
  gameMode={gameMode}
  setGameMode={setGameMode}
  onStart={handleStartGame}
/>

// PlayerDraft rendering
<PlayerDraft
  formation={formation}
  lineup={lineup}
  currentDraw={currentDraw}
  onRoll={handleRoll}
  onReRollTeam={handleReRollTeam}
  onReRollYear={handleReRollYear}
  reRolls={reRolls}
  selectedPlayer={selectedPlayer}
  setSelectedPlayer={setSelectedPlayer}
  teamStats={teamStats}
  isComplete={isLineupComplete()}
  gameMode={gameMode}
  revealed={revealed}
  setRevealed={setRevealed}
/>
```

Also pass `gameMode` and `revealed` to `<SoccerField>`:

```jsx
<SoccerField
  formation={formation}
  lineup={lineup}
  activePlayer={selectedPlayer}
  onSelectSlot={handleSelectSlot}
  gameMode={gameMode}
  revealed={revealed}
/>
```

- [ ] **Step 4: Commit App changes**

```bash
git add src/App.jsx
git commit -m "feat: manage gameMode and revealed states in App.jsx"
```

---

### Task 4: Hide Player Ratings on the Soccer Field

**Files:**
- Modify: `src/components/SoccerField.jsx`

- [ ] **Step 1: Ocultar rating com cadeado no campo**

Modify `src/components/SoccerField.jsx` to receive `gameMode` and `revealed` and show `🔒` for forces:

```jsx
// src/components/SoccerField.jsx
// Modify props:
export default function SoccerField({ formation, lineup, activePlayer, onSelectSlot, gameMode = 'normal', revealed = false }) {

// In the player rendering inside the map loop:
// Replace player-force rendering:
<div className="player-badge">
  <span className="player-force">
    {gameMode === 'craque' && !revealed ? '🔒' : player.force}
  </span>
  <span className="player-name">{player.name}</span>
  <span className="player-club-year">{player.flag} {player.year}</span>
</div>
```

- [ ] **Step 2: Commit SoccerField changes**

```bash
git add src/components/SoccerField.jsx
git commit -m "feat: hide player overalls on soccer field when in craque mode"
```

---

### Task 5: Hide Player Ratings in Draft Cards and Box Score

**Files:**
- Modify: `src/components/PlayerDraft.jsx`

- [ ] **Step 1: Update props and hide stats in cards**

Update `PlayerDraft` arguments to include `gameMode`, `revealed`, and `setRevealed`.
In the player card mapping:

```jsx
// Replace player card rating rendering:
<div className="player-card-force">
  {gameMode === 'craque' && !revealed ? '🔒' : player.force}
</div>
```

- [ ] **Step 2: Hide ratings in Box Score and header**

In the Box Score rating badges (overall, att, def):

```jsx
// overall:
<span className="box-score-total-rating">
  {gameMode === 'craque' && !revealed ? '??' : teamStats.overall} rating
</span>

// att:
<span className="rating-val">
  {gameMode === 'craque' && !revealed ? '??' : teamStats.att}
</span>

// def:
<span className="rating-val">
  {gameMode === 'craque' && !revealed ? '??' : teamStats.def}
</span>
```

In the Box Score table rows:

```jsx
// Replace filled-row force cell:
<td className="force">
  {player ? (gameMode === 'craque' && !revealed ? '🔒' : player.force) : ''}
</td>
```

- [ ] **Step 3: Add the Reveal Button and action**

Replace the simulator button logic:

```jsx
// If draft is complete and revealed is false (in craque mode), show Reveal Button.
// Otherwise, show Simular button:
{isComplete && (
  gameMode === 'craque' && !revealed ? (
    <button 
      className="reveal-force-btn animate-pulse" 
      onClick={() => setRevealed(true)}
      style={{
        background: 'linear-gradient(90deg, #eab308, #ca8a04)',
        color: '#052e16',
        fontWeight: 'bold',
        padding: '15px',
        width: '100%',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        boxShadow: '0 4px 12px rgba(234, 179, 8, 0.3)',
        marginTop: '15px'
      }}
    >
      ✨ REVELAR FORÇA DO ELENCO ✨
    </button>
  ) : (
    /* We don't render the simulate button here because it's already rendered in App.jsx. Wait! In App.jsx, the button is rendered. Let's make sure. */
  )
)}
```

Wait! In `App.jsx`, lines 478-482 render the `go-simulate-btn`:
```jsx
{isComplete && (
  <button className="go-simulate-btn animate-pulse" onClick={handleStartSimulation}>
    INICIAR SIMULAÇÃO DO INVICTO RUN ➔
  </button>
)}
```
In `PlayerDraft.jsx`, we should render the "REVELAR" button, and in `App.jsx` we should only render the simulate button if `gameMode !== 'craque' || revealed === true`!
Let's make sure of this.
In `App.jsx`:
```jsx
{isComplete && (gameMode !== 'craque' || revealed) && (
  <button className="go-simulate-btn animate-pulse" onClick={handleStartSimulation}>
    INICIAR SIMULAÇÃO DO INVICTO RUN ➔
  </button>
)}
```
And in `PlayerDraft.jsx`, if `isComplete && gameMode === 'craque' && !revealed`, we render the "REVELAR FORÇA DO ELENCO" button!
Let's detail this in the steps.

- [ ] **Step 4: Commit PlayerDraft changes**

```bash
git add src/components/PlayerDraft.jsx
git commit -m "feat: implement statistics hiding and reveal button in PlayerDraft"
```

---

### Task 6: Add Styles for Selection and Buttons

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add animations/styles for cards and buttons**

Add styling in `src/index.css` for `menu-option-card.active` if needed, and clean up layouts.
Wait, let's look at `index.css` or the class name styles. The existing `.menu-option-card.active` style might already exist because the MainMenu uses it. Let's make sure it fits.

- [ ] **Step 2: Commit css changes**

```bash
git add src/index.css
git commit -m "style: add custom styles for Reveal button and animations"
```

---

### Task 7: Final End-to-End Build and Verification

- [ ] **Step 1: Run production build to verify bundle compilation**

Run: `npm run build`
Expected: Output compilation completes without warnings or errors.

- [ ] **Step 2: Launch development server**

Run: `npm run dev` or check visual behavior manually.
Verify all flows: Normal mode draft and Craque mode draft with Reveal action.
