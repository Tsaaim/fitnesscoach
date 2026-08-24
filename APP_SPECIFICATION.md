# 📋 Spezifikation & Entwicklungsauftrag: Simon's Fitness & Progress Web-App

> **Ziel für den Antigravity Agent:**  
> Entwickle eine moderne, responsive Single-Page Web-App (SPA), die über **GitHub Pages** gehostet werden kann. Die App dient als personalisiertes Coaching- & Tracking-Dashboard für Simon (27 Jahre, Lehramtsstudent, Musiker/klassischer Gesang, Startgewicht 104 kg, Start-Bauchumfang 110 cm, Zielgewicht 80 kg, Coach: Matthias).

---

## 1. Projektübersicht & Kontext

* **Athlet:** Simon (27 Jahre, ~8h Schreibtischarbeit, Job mit Kistentragen/Bücken)
* **Coach:** Matthias
* **Startgewicht:** 104 kg | **Start-Bauchumfang:** 110 cm | **Zielgewicht:** 80 kg (-24 kg über 8–10 Monate)
* **Besondere Schwerpunkte:**
  1. **Rückenschutz & LWS-Entlastung:** Gesäß-/Rumpfaktivierung als Ausgleich zum Kistenheben und langen Sitzen.
  2. **Klassischer Gesang:** Stärkung der Atemstütze (*Appoggio*, *Transversus abdominis*, Zwerchfellmobilität).
  3. **Low-Barrier & Zeiteffizienz:** Kein Fitnessstudio, 15-Minuten Bodyweight-Zirkel zuhause, Spaziergänge als Cardio.
* **Hosting-Ziel:** 100% statisch lauffähig auf **GitHub Pages** (ohne komplexen Build-Server, direkt als `index.html`, CSS, JS oder via CDN wie Tailwind & Chart.js).

---

## 2. Technische Anforderungen (Tech-Stack)

1. **Frontend:** HTML5, Modern CSS / TailwindCSS (via CDN), Vanilla JavaScript (ES6+).
2. **Visualisierung:** [Chart.js](https://www.chartjs.org/) (via CDN) für interaktive Verlaufs-Diagramme.
3. **Icons:** Lucide Icons oder FontAwesome (via CDN).
4. **Datenhaltung:** `localStorage` im Browser für automatische Speicherung + **JSON Export/Import-Funktion** + **1-Klick WhatsApp Coach-Bericht**.
5. **Responsiveness & PWA:** Mobile-First! Perfekt bedienbar auf dem Smartphone (iOS Safari / Android Chrome) mit Dark Mode / Athletic Dark Theme (Smaragd/Cyan) und PWA-Homescreen-Installation.

---

## 3. Funktionale Komponenten & UI-Struktur

### A. Header & KPI-Dashboard (Hero-Bereich)
- **Status-Kacheln:**
  - Aktuelles Gewicht (kg) vs. Startgewicht (104 kg)
  - Gesamter Gewichtsverlust (- X kg)
  - Aktueller Bauchumfang (cm) vs. Start (110 cm)
  - Abgeschlossene Workouts diese Woche
- **Meilenstein-Fortschrittsbalken:**
  - Visualisierung der 5 Etappenziele:
    1. *U100 (99,9 kg)*
    2. *95 kg*
    3. *90 kg*
    4. *85 kg*
    5. *80 kg (Ziel)*

### B. Interaktiver Fortschritts-Graph (Chart.js)
- **Gewichtskurve:** Reale Messpunkte vs. gestrichelte Ideallinie/Zielkorridor Richtung 80 kg.
- **Bauchumfang-Kurve:** Zweite Achse oder umschaltbares Diagramm.
- **Filter/Zeitraum:** Ansicht aller Daten mit Tooltips für Datum, Notizen und Gewicht.

### C. Wöchentlicher Check-in (Schlankes Formular < 15 Sekunden)
- Einfaches, übersichtliches Eingabe-Modal/Formular ohne unnötige Slider:
  - Datum (Standard: Heute)
  - Gewicht (in kg, z. B. 104.0)
  - Bauchumfang (in cm, z. B. 110)
  - Workouts diese Woche absolviert (0–3)
  - Optionale kurze Notiz (z. B. "Gute Woche", "Viel Stress")
- **Historientabelle:** Liste aller vergangenen Einträge mit Möglichkeit zum Bearbeiten oder Löschen.
- **1-Klick WhatsApp Share:** Generiert einen sauberen Textbericht für Coach Matthias.

### D. Interaktiver 15-Minuten Workout-Hub ("Rückenstark & Gesang")
- **Übersicht der 5 Kernübungen:**
  1. *Box-Squats* (10–12 Wdh.) – Hebe-Muster für Kisten
  2. *Erhöhte Liegestütze* (8–10 Wdh.) – Druckkraft & Rumpfbrett
  3. *Glute Bridges* (10–12 Wdh., 2s Halten) – Gesäßaktivierung & LWS-Entlastung
  4. *Bird Dog* (8 Wdh./Seite) – Tiefe Rumpfstabilität & Gesangs-Atemstütze
  5. *Y-T-W Heben* (je 6 Wdh.) – Schulterblattfixierung & Haltungsaufrichtung
- **Interaktiver "Workout-Modus":**
  - Schritt-für-Schritt Workout-Player:
  - Runden-Zähler (Runde 1 von 3).
  - 45–60 Sekunden Pausen-Timer mit visuellem Countdown & Audio-Signal/Piepton.
  - Checkbox "Workout für heute abschließen" → erhöht automatisch den Wochenzähler.

### E. Quick-Guide & Hebe-Regeln (Job & Alltag)
- Aufklappbare Info-Cards:
  - **Kistenhebe-Regel:** "Kiste nah an den Körper, Bauch anspannen, aus den Beinen drücken."
  - **Gesangs- & Haltungs-Cues:** "Aufrechte BWS, Zwerchfellatmung, lockere Schultern."
  - **Die 3 goldenen Ernährungsregeln:** 3L Wasser, Protein-Anker, Smart Snacking.

### F. Backup, Export & Coach-Sync
- **JSON Export Button:** Lädt aktuellen Datenstand als `.json` Datei herunter.
- **JSON Import Button:** Ermöglicht das Wiederherstellen oder Einspielen von Daten.
- **Demo-Daten Lade-Button:** Zum schnellen Testen der Visualisierung (mit Startwert 103 kg).

---

## 4. Dateistruktur

Das Repository soll folgende Struktur aufweisen:

```text
├── index.html              # Hauptseite / App-Struktur mit allen Modulen
├── css/
│   └── style.css           # Custom Styling, Animationen & Dark Theme
├── js/
│   ├── app.js              # Haupt-App-Logik, Event-Listener & Navigation
│   ├── storage.js          # LocalStorage CRUD & Import/Export
│   ├── chart.js            # Chart.js Initialisierung & Update-Logik
│   └── workout.js          # Interaktiver Workout-Timer & Übungsabfolge
├── assets/                 # Icons / Favicon
├── fitness-coaching-plan-de.md # Das vollständige Coaching-Konzept
└── README.md               # Anleitung zur Nutzung und GitHub Pages Deployment
```

---

## 5. Akzeptanzkriterien für die Umsetzung

- [ ] Die App lässt sich ohne Build-Tools per Doppelklick auf `index.html` oder via lokalem Live-Server fehlerfrei im Browser öffnen.
- [ ] Responsive Ansicht auf Smartphone (Breiten 375px–430px) und Desktop getestet.
- [ ] Daten bleiben nach Neuladen der Seite im `localStorage` erhalten.
- [ ] Das Chart aktualisiert sich automatisch bei neuem Check-in.
- [ ] Der Workout-Timer funktioniert intuitiv mit Start/Pause/Reset und Rundenwechsel.
- [ ] Ausführliche `README.md` mit 3-Schritte-Anleitung für GitHub Pages Deployment liegt bei.
