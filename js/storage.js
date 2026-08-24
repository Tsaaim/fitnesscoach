const STORAGE_KEY = 'simon_fitness_history';

// Start baseline
const BASELINE = {
    weight: 104.0,
    waist: 110
};

// Target
const TARGET = {
    weight: 80.0
};

function getHistory() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveHistory(data) {
    // Sort by date descending (newest first)
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function saveCheckin(entry) {
    const history = getHistory();
    // Generate simple ID if not exists
    if (!entry.id) {
        entry.id = Date.now().toString();
    }
    
    // Check if entry with same date exists (update it)
    const existingIndex = history.findIndex(e => e.date === entry.date);
    if (existingIndex >= 0) {
        entry.id = history[existingIndex].id; // keep old id
        history[existingIndex] = entry;
    } else {
        history.push(entry);
    }
    
    saveHistory(history);
    return entry;
}

function deleteCheckin(id) {
    let history = getHistory();
    history = history.filter(e => e.id !== id);
    saveHistory(history);
}

function getLatestEntry() {
    const history = getHistory();
    return history.length > 0 ? history[0] : null;
}

function generateWhatsAppReport(entry) {
    const history = getHistory();
    
    // Calculate difference to baseline
    const weightDiff = (entry.weight - BASELINE.weight).toFixed(1);
    const weightTrend = weightDiff <= 0 ? `${weightDiff} kg` : `+${weightDiff} kg`;
    
    const waistDiff = entry.waist - BASELINE.waist;
    const waistTrend = waistDiff <= 0 ? `${waistDiff} cm` : `+${waistDiff} cm`;
    
    // Format Date (DD.MM.YYYY)
    const dateObj = new Date(entry.date);
    const dateStr = dateObj.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

    let msg = `*Check-in: ${dateStr}*\n\n`;
    msg += `⚖️ Gewicht: ${entry.weight} kg (${weightTrend})\n`;
    msg += `📏 Bauch: ${entry.waist} cm (${waistTrend})\n`;
    msg += `🔥 Workouts: ${entry.workouts}/3\n`;
    if (entry.note && entry.note.trim() !== '') {
        msg += `📝 Notiz: ${entry.note}\n`;
    }
    return msg;
}

function exportJSON() {
    const data = getHistory();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `simon_fitness_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function importJSON(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (Array.isArray(data)) {
                saveHistory(data);
                callback(true);
            } else {
                alert("Ungültiges Dateiformat. Array erwartet.");
                callback(false);
            }
        } catch (err) {
            alert("Fehler beim Lesen der JSON-Datei.");
            callback(false);
        }
    };
    reader.readAsText(file);
}

function loadDemoData() {
    const demoData = [
        { id: "1", date: getOffsetDateString(-28), weight: 104.0, waist: 110, workouts: 0, note: "Startpunkt" },
        { id: "2", date: getOffsetDateString(-21), weight: 103.1, waist: 109, workouts: 2, note: "Erste Woche, lief gut!" },
        { id: "3", date: getOffsetDateString(-14), weight: 102.5, waist: 108, workouts: 3, note: "Rücken fühlt sich stabiler an." },
        { id: "4", date: getOffsetDateString(-7), weight: 101.8, waist: 106, workouts: 3, note: "Kistenheben klappt besser." },
        { id: "5", date: getOffsetDateString(0), weight: 101.2, waist: 105, workouts: 2, note: "Etwas Stress in der Uni." }
    ];
    saveHistory(demoData);
}

function clearData() {
    localStorage.removeItem(STORAGE_KEY);
}

// Helper to get a date string X days from today
function getOffsetDateString(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split('T')[0];
}
