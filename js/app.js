document.addEventListener('DOMContentLoaded', () => {
    // 1. Init Chart
    initChart();
    
    // 2. Bind Workout Events
    bindWorkoutEvents();
    
    // 3. Bind UI Events
    bindEvents();
    
    // 4. Update UI with Data
    updateDashboard();
});

// --- UI Binding & Event Listeners ---
function bindEvents() {
    // Modals
    const modalCheckin = document.getElementById('modal-checkin');
    const modalSettings = document.getElementById('modal-settings');
    const overlay = document.getElementById('modal-overlay');

    const openModal = (modal) => {
        overlay.classList.remove('hidden');
        modal.classList.remove('hidden');
        // small delay for transition
        setTimeout(() => {
            overlay.classList.add('overlay-open');
            modal.classList.add('modal-open');
        }, 10);
    };

    const closeModal = (modal) => {
        overlay.classList.remove('overlay-open');
        modal.classList.remove('modal-open');
        setTimeout(() => {
            overlay.classList.add('hidden');
            modal.classList.add('hidden');
        }, 300);
        document.getElementById('btn-share-whatsapp').classList.add('hidden'); // reset share button
    };

    document.getElementById('btn-open-checkin').addEventListener('click', () => {
        // Set today's date
        document.getElementById('input-date').value = new Date().toISOString().split('T')[0];
        
        // Pre-fill with latest values if exist
        const latest = getLatestEntry();
        if (latest) {
            document.getElementById('input-weight').value = latest.weight;
            document.getElementById('input-waist').value = latest.waist;
        }
        
        openModal(modalCheckin);
    });
    
    document.getElementById('btn-close-checkin').addEventListener('click', () => closeModal(modalCheckin));
    
    document.getElementById('btn-sync-modal').addEventListener('click', () => openModal(modalSettings));
    document.getElementById('btn-close-settings').addEventListener('click', () => closeModal(modalSettings));

    overlay.addEventListener('click', () => {
        closeModal(modalCheckin);
        closeModal(modalSettings);
    });

    // Checkin Form Submit
    document.getElementById('checkin-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const entry = {
            date: document.getElementById('input-date').value,
            weight: parseFloat(document.getElementById('input-weight').value),
            waist: parseInt(document.getElementById('input-waist').value, 10),
            workouts: parseInt(document.getElementById('input-workouts').value, 10),
            note: document.getElementById('input-note').value
        };
        
        const saved = saveCheckin(entry);
        updateDashboard();
        
        // Show Share Button
        const shareBtn = document.getElementById('btn-share-whatsapp');
        shareBtn.classList.remove('hidden');
        
        shareBtn.onclick = () => {
            const report = generateWhatsAppReport(saved);
            navigator.clipboard.writeText(report).then(() => {
                const originalHtml = shareBtn.innerHTML;
                shareBtn.innerHTML = '<i data-lucide="check" class="w-5 h-5 mr-2"></i> Kopiert!';
                lucide.createIcons();
                setTimeout(() => {
                    shareBtn.innerHTML = originalHtml;
                    lucide.createIcons();
                    closeModal(modalCheckin);
                }, 2000);
            }).catch(err => {
                alert("Konnte Text nicht kopieren. Bitte manuell markieren.");
            });
        };
    });

    // Settings Buttons
    document.getElementById('btn-export-data').addEventListener('click', exportJSON);
    
    document.getElementById('input-import-data').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        importJSON(file, (success) => {
            if (success) {
                updateDashboard();
                closeModal(modalSettings);
                alert("Daten erfolgreich importiert!");
            }
        });
        e.target.value = ''; // reset
    });

    document.getElementById('btn-demo-data').addEventListener('click', () => {
        if (confirm('Aktuelle Daten werden überschrieben. Demo-Daten laden?')) {
            loadDemoData();
            updateDashboard();
            closeModal(modalSettings);
        }
    });

    document.getElementById('btn-clear-data').addEventListener('click', () => {
        if (confirm('Wirklich alle Daten löschen? Dies kann nicht rückgängig gemacht werden.')) {
            clearData();
            updateDashboard();
            closeModal(modalSettings);
        }
    });

    // Chart Type Selector
    document.getElementById('chart-type-selector').addEventListener('change', (e) => {
        updateChart(e.target.value);
    });
}

// --- Data & Dashboard Update ---
function updateDashboard() {
    const latest = getLatestEntry();
    
    // Update KPIs
    const elWeight = document.getElementById('kpi-weight');
    const elWeightDiff = document.getElementById('kpi-weight-diff');
    const elWaist = document.getElementById('kpi-waist');
    
    if (latest) {
        elWeight.textContent = latest.weight.toFixed(1);
        
        const diff = latest.weight - BASELINE.weight;
        const diffText = diff > 0 ? `+${diff.toFixed(1)} kg` : `${diff.toFixed(1)} kg`;
        elWeightDiff.textContent = diffText;
        
        // Color based on progress
        if (diff > 0) {
            elWeightDiff.parentElement.classList.replace('text-emerald-400', 'text-red-400');
            elWeightDiff.parentElement.innerHTML = `<i data-lucide="trending-up" class="w-3 h-3 mr-1"></i> <span>${diffText}</span>`;
        } else {
            elWeightDiff.parentElement.classList.replace('text-red-400', 'text-emerald-400');
            elWeightDiff.parentElement.innerHTML = `<i data-lucide="trending-down" class="w-3 h-3 mr-1"></i> <span>${diffText}</span>`;
        }

        elWaist.textContent = latest.waist;
    } else {
        elWeight.textContent = BASELINE.weight.toFixed(1);
        elWeightDiff.textContent = '0.0 kg';
        elWaist.textContent = BASELINE.waist;
    }
    
    updateMilestones(latest ? latest.weight : BASELINE.weight);
    updateHistoryList();
    
    // Re-render Chart
    const currentChartType = document.getElementById('chart-type-selector').value;
    updateChart(currentChartType);
    
    lucide.createIcons();
}

function updateMilestones(currentWeight) {
    const start = BASELINE.weight; // 104
    const end = TARGET.weight; // 80
    const totalDiff = start - end; // 24
    
    // Progress percentage (0 to 100)
    let progress = ((start - currentWeight) / totalDiff) * 100;
    progress = Math.max(0, Math.min(100, progress));
    
    const bar = document.getElementById('milestone-progress-bar');
    bar.style.width = `${progress}%`;
    
    const text = document.getElementById('milestone-text');
    
    // Define Milestones
    const milestones = [
        { label: 'U100', val: 99.9 },
        { label: '95', val: 95.0 },
        { label: '90', val: 90.0 },
        { label: '85', val: 85.0 },
        { label: '80', val: 80.0 }
    ];
    
    // Clear old markers
    const markerContainer = document.getElementById('milestone-markers');
    markerContainer.innerHTML = '';
    
    let nextMilestone = null;
    
    milestones.forEach(m => {
        // Calculate position percentage
        const p = ((start - m.val) / totalDiff) * 100;
        
        const isReached = currentWeight <= m.val;
        
        if (!isReached && !nextMilestone) {
            nextMilestone = m;
        }

        const marker = document.createElement('div');
        marker.className = `absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 ${isReached ? 'bg-emerald-400 border-emerald-900' : 'bg-slate-700 border-slate-900'} shadow`;
        marker.style.left = `calc(${p}% - 6px)`; // center the dot
        
        markerContainer.appendChild(marker);
    });

    if (currentWeight <= end) {
        text.innerHTML = `<span class="text-emerald-400 font-bold">🎉 Ziel von 80 kg erreicht!</span>`;
    } else if (nextMilestone) {
        const toGo = (currentWeight - nextMilestone.val).toFixed(1);
        text.innerHTML = `Noch <span class="text-emerald-400 font-bold">${toGo} kg</span> bis <span class="text-white">${nextMilestone.label}</span>`;
    }
}

function updateHistoryList() {
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    
    const history = getHistory();
    
    if (history.length === 0) {
        list.innerHTML = '<p class="text-xs text-slate-500 italic">Noch keine Einträge vorhanden.</p>';
        return;
    }
    
    history.forEach(entry => {
        const d = new Date(entry.date);
        const dateStr = d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
        
        const div = document.createElement('div');
        div.className = 'flex justify-between items-center bg-slate-800/50 rounded-lg p-2 border border-slate-700/50';
        
        div.innerHTML = `
            <div>
                <div class="text-sm text-white font-semibold">${entry.weight} kg <span class="text-xs text-slate-400 font-normal ml-1">(${entry.waist}cm)</span></div>
                <div class="text-xs text-slate-500">${dateStr} • ${entry.workouts}/3 Workouts</div>
            </div>
            <button onclick="removeEntry('${entry.id}')" class="text-slate-500 hover:text-red-400 p-1 transition">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
        `;
        list.appendChild(div);
    });
}

// Global function for inline onclick handler
window.removeEntry = function(id) {
    if (confirm('Diesen Eintrag wirklich löschen?')) {
        deleteCheckin(id);
        updateDashboard();
    }
};
