let progressChart = null;

function initChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    
    // Set global chart defaults for dark theme
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Inter', sans-serif";
    
    progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: false // We use our own UI for switching
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    titleColor: '#f8fafc',
                    bodyColor: '#cbd5e1',
                    borderColor: 'rgba(51, 65, 85, 0.8)',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y;
                                if (context.dataset.label === 'Gewicht' || context.dataset.label === 'Ziel') {
                                    label += ' kg';
                                } else if (context.dataset.label === 'Bauchumfang') {
                                    label += ' cm';
                                }
                            }
                            return label;
                        },
                        afterBody: function(context) {
                            // Extract note if exists
                            const dataIndex = context[0].dataIndex;
                            const datasetIndex = context[0].datasetIndex;
                            const customNote = progressChart.data.datasets[datasetIndex].notes?.[dataIndex];
                            if (customNote) {
                                return '\nNotiz: ' + customNote;
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(51, 65, 85, 0.3)',
                        drawBorder: false
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(51, 65, 85, 0.3)',
                        drawBorder: false
                    },
                    suggestedMin: 78,
                    suggestedMax: 106
                }
            }
        }
    });
}

function updateChart(dataType = 'weight') {
    if (!progressChart) return;
    
    // Get history and reverse it for chronological order in chart (left to right)
    const history = getHistory().slice().reverse();
    
    if (history.length === 0) {
        progressChart.data.labels = [];
        progressChart.data.datasets = [];
        progressChart.update();
        return;
    }

    const labels = history.map(entry => {
        const d = new Date(entry.date);
        return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
    });
    
    const notes = history.map(entry => entry.note || '');

    let datasets = [];

    if (dataType === 'weight') {
        const data = history.map(entry => entry.weight);
        const goalData = history.map(() => TARGET.weight); // Horizontal line at 80kg
        
        // Adjust Y scale limits
        const minWeight = Math.min(...data, TARGET.weight) - 2;
        const maxWeight = Math.max(...data, BASELINE.weight) + 2;
        progressChart.options.scales.y.suggestedMin = minWeight;
        progressChart.options.scales.y.suggestedMax = maxWeight;

        datasets = [
            {
                label: 'Gewicht',
                data: data,
                notes: notes,
                borderColor: '#10b981', // emerald-500
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                pointBackgroundColor: '#0f172a',
                pointBorderColor: '#10b981',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.3
            },
            {
                label: 'Ziel',
                data: goalData,
                borderColor: 'rgba(6, 182, 212, 0.5)', // cyan-500 with opacity
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false,
                tension: 0
            }
        ];
    } else if (dataType === 'waist') {
        const data = history.map(entry => entry.waist);
        
        // Adjust Y scale limits
        const minWaist = Math.min(...data) - 5;
        const maxWaist = Math.max(...data, BASELINE.waist) + 2;
        progressChart.options.scales.y.suggestedMin = minWaist;
        progressChart.options.scales.y.suggestedMax = maxWaist;

        datasets = [
            {
                label: 'Bauchumfang',
                data: data,
                notes: notes,
                borderColor: '#06b6d4', // cyan-500
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                borderWidth: 3,
                pointBackgroundColor: '#0f172a',
                pointBorderColor: '#06b6d4',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.3
            }
        ];
    }

    progressChart.data.labels = labels;
    progressChart.data.datasets = datasets;
    progressChart.update();
}
