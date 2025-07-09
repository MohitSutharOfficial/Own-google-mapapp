// Advanced Analytics and Business Intelligence Dashboard
class AdvancedAnalyticsDashboard {
    constructor() {
        this.chartInstances = new Map();
        this.realTimeData = new Map();
        this.kpiMetrics = new Map();
        this.analyticsFilters = {
            dateRange: 'week',
            regions: [],
            businessUnits: [],
            metrics: []
        };
        this.reportScheduler = new ReportScheduler();
        this.predictiveAnalytics = new PredictiveAnalytics();

        this.initDashboard();
    }

    initDashboard() {
        this.createAdvancedDashboard();
        this.setupChartingLibrary();
        this.initRealTimeUpdates();
        this.setupAnalyticsFilters();
        this.loadInitialData();
    }

    createAdvancedDashboard() {
        const dashboardHTML = `
            <div class="advanced-analytics-dashboard" id="advanced-analytics-dashboard" style="display: none;">
                <div class="dashboard-header">
                    <div class="header-title">
                        <h1>Business Intelligence Dashboard</h1>
                        <span class="last-updated">Last updated: <span id="last-updated-time">--</span></span>
                    </div>
                    <div class="dashboard-actions">
                        <div class="date-range-selector">
                            <select id="analytics-date-range">
                                <option value="today">Today</option>
                                <option value="week" selected>This Week</option>
                                <option value="month">This Month</option>
                                <option value="quarter">This Quarter</option>
                                <option value="year">This Year</option>
                                <option value="custom">Custom Range</option>
                            </select>
                        </div>
                        <button class="dashboard-btn" id="export-dashboard-btn">
                            <i class="material-icons">download</i>
                            Export
                        </button>
                        <button class="dashboard-btn" id="schedule-report-btn">
                            <i class="material-icons">schedule</i>
                            Schedule
                        </button>
                        <button class="dashboard-btn" id="refresh-data-btn">
                            <i class="material-icons">refresh</i>
                            Refresh
                        </button>
                    </div>
                </div>
                
                <!-- KPI Overview Cards -->
                <div class="kpi-grid">
                    <div class="kpi-card revenue-card">
                        <div class="kpi-header">
                            <h3>Total Revenue</h3>
                            <i class="material-icons">attach_money</i>
                        </div>
                        <div class="kpi-value" id="total-revenue">$0</div>
                        <div class="kpi-change positive" id="revenue-change">+0%</div>
                        <div class="kpi-chart">
                            <canvas id="revenue-trend-chart" width="100" height="40"></canvas>
                        </div>
                    </div>
                    
                    <div class="kpi-card locations-card">
                        <div class="kpi-header">
                            <h3>Active Locations</h3>
                            <i class="material-icons">location_on</i>
                        </div>
                        <div class="kpi-value" id="active-locations">0</div>
                        <div class="kpi-change positive" id="locations-change">+0%</div>
                        <div class="kpi-chart">
                            <canvas id="locations-trend-chart" width="100" height="40"></canvas>
                        </div>
                    </div>
                    
                    <div class="kpi-card fleet-card">
                        <div class="kpi-header">
                            <h3>Fleet Efficiency</h3>
                            <i class="material-icons">local_shipping</i>
                        </div>
                        <div class="kpi-value" id="fleet-efficiency">0%</div>
                        <div class="kpi-change negative" id="efficiency-change">-0%</div>
                        <div class="kpi-chart">
                            <canvas id="fleet-trend-chart" width="100" height="40"></canvas>
                        </div>
                    </div>
                    
                    <div class="kpi-card customers-card">
                        <div class="kpi-header">
                            <h3>Customer Visits</h3>
                            <i class="material-icons">people</i>
                        </div>
                        <div class="kpi-value" id="customer-visits">0</div>
                        <div class="kpi-change positive" id="visits-change">+0%</div>
                        <div class="kpi-chart">
                            <canvas id="customers-trend-chart" width="100" height="40"></canvas>
                        </div>
                    </div>
                </div>
                
                <!-- Main Charts Section -->
                <div class="charts-section">
                    <div class="chart-row">
                        <div class="chart-container large">
                            <div class="chart-header">
                                <h3>Revenue by Region</h3>
                                <div class="chart-controls">
                                    <select id="revenue-chart-type">
                                        <option value="bar">Bar Chart</option>
                                        <option value="line">Line Chart</option>
                                        <option value="area">Area Chart</option>
                                    </select>
                                </div>
                            </div>
                            <canvas id="revenue-by-region-chart"></canvas>
                        </div>
                        
                        <div class="chart-container medium">
                            <div class="chart-header">
                                <h3>Performance Distribution</h3>
                            </div>
                            <canvas id="performance-distribution-chart"></canvas>
                        </div>
                    </div>
                    
                    <div class="chart-row">
                        <div class="chart-container medium">
                            <div class="chart-header">
                                <h3>Customer Heatmap</h3>
                                <div class="chart-controls">
                                    <button class="toggle-btn" id="toggle-heatmap-3d">3D View</button>
                                </div>
                            </div>
                            <div id="customer-heatmap-container"></div>
                        </div>
                        
                        <div class="chart-container medium">
                            <div class="chart-header">
                                <h3>Predictive Analytics</h3>
                                <div class="chart-controls">
                                    <select id="prediction-model">
                                        <option value="linear">Linear Regression</option>
                                        <option value="polynomial">Polynomial</option>
                                        <option value="exponential">Exponential</option>
                                    </select>
                                </div>
                            </div>
                            <canvas id="predictive-analytics-chart"></canvas>
                        </div>
                    </div>
                </div>
                
                <!-- Data Tables Section -->
                <div class="data-tables-section">
                    <div class="table-container">
                        <div class="table-header">
                            <h3>Top Performing Locations</h3>
                            <div class="table-controls">
                                <input type="text" id="location-search" placeholder="Search locations...">
                                <select id="location-sort">
                                    <option value="revenue">Sort by Revenue</option>
                                    <option value="visits">Sort by Visits</option>
                                    <option value="efficiency">Sort by Efficiency</option>
                                </select>
                            </div>
                        </div>
                        <div class="table-wrapper">
                            <table class="data-table" id="locations-table">
                                <thead>
                                    <tr>
                                        <th>Location</th>
                                        <th>Revenue</th>
                                        <th>Visits</th>
                                        <th>Efficiency</th>
                                        <th>Trend</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="locations-table-body">
                                    <!-- Dynamic content -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <!-- Alerts and Insights -->
                <div class="insights-section">
                    <div class="alerts-panel">
                        <h3>Smart Alerts</h3>
                        <div class="alerts-list" id="smart-alerts">
                            <!-- Dynamic alerts -->
                        </div>
                    </div>
                    
                    <div class="insights-panel">
                        <h3>AI Insights</h3>
                        <div class="insights-list" id="ai-insights">
                            <!-- Dynamic insights -->
                        </div>
                    </div>
                </div>
                
                <!-- Custom Report Builder -->
                <div class="report-builder-section">
                    <div class="builder-header">
                        <h3>Custom Report Builder</h3>
                        <button class="btn-primary" id="create-custom-report">Create New Report</button>
                    </div>
                    <div class="report-templates">
                        <div class="template-card" data-template="executive">
                            <h4>Executive Summary</h4>
                            <p>High-level KPIs and strategic metrics</p>
                        </div>
                        <div class="template-card" data-template="operational">
                            <h4>Operational Report</h4>
                            <p>Detailed operational metrics and performance</p>
                        </div>
                        <div class="template-card" data-template="financial">
                            <h4>Financial Analysis</h4>
                            <p>Revenue, costs, and financial performance</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Report Scheduler Modal -->
            <div class="report-scheduler-modal" id="report-scheduler-modal" style="display: none;">
                <div class="scheduler-container">
                    <div class="scheduler-header">
                        <h3>Schedule Automated Report</h3>
                        <button class="close-btn" id="close-scheduler">&times;</button>
                    </div>
                    <div class="scheduler-form">
                        <div class="form-group">
                            <label>Report Type</label>
                            <select id="scheduled-report-type">
                                <option value="executive">Executive Summary</option>
                                <option value="operational">Operational Report</option>
                                <option value="financial">Financial Analysis</option>
                                <option value="custom">Custom Report</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Frequency</label>
                            <select id="report-frequency">
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Recipients</label>
                            <input type="text" id="report-recipients" placeholder="email1@company.com, email2@company.com">
                        </div>
                        <div class="form-group">
                            <label>Format</label>
                            <div class="checkbox-group">
                                <label><input type="checkbox" value="pdf" checked> PDF</label>
                                <label><input type="checkbox" value="excel"> Excel</label>
                                <label><input type="checkbox" value="powerpoint"> PowerPoint</label>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button class="btn-secondary" id="cancel-schedule">Cancel</button>
                            <button class="btn-primary" id="save-schedule">Schedule Report</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', dashboardHTML);
        this.setupEventListeners();
    }

    setupChartingLibrary() {
        // Load Chart.js if not already loaded
        if (typeof Chart === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = () => this.initCharts();
            document.head.appendChild(script);
        } else {
            this.initCharts();
        }
    }

    initCharts() {
        // Revenue by Region Chart
        this.createRevenueByRegionChart();

        // Performance Distribution Chart
        this.createPerformanceDistributionChart();

        // Predictive Analytics Chart
        this.createPredictiveAnalyticsChart();

        // KPI Trend Charts
        this.createKPITrendCharts();

        // Customer Heatmap
        this.createCustomerHeatmap();
    }

    createRevenueByRegionChart() {
        const ctx = document.getElementById('revenue-by-region-chart').getContext('2d');

        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Africa'],
                datasets: [{
                    label: 'Current Period',
                    data: [1250000, 980000, 756000, 423000, 287000, 156000],
                    backgroundColor: 'rgba(66, 133, 244, 0.8)',
                    borderColor: 'rgba(66, 133, 244, 1)',
                    borderWidth: 1
                }, {
                    label: 'Previous Period',
                    data: [1150000, 920000, 689000, 398000, 267000, 134000],
                    backgroundColor: 'rgba(52, 168, 83, 0.8)',
                    borderColor: 'rgba(52, 168, 83, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) {
                                return '$' + (value / 1000) + 'K';
                            }
                        }
                    }
                }
            }
        });

        this.chartInstances.set('revenue-by-region', chart);
    }

    createPerformanceDistributionChart() {
        const ctx = document.getElementById('performance-distribution-chart').getContext('2d');

        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Excellent', 'Good', 'Average', 'Below Average', 'Poor'],
                datasets: [{
                    data: [23, 35, 28, 10, 4],
                    backgroundColor: [
                        '#4CAF50',
                        '#8BC34A',
                        '#FFC107',
                        '#FF9800',
                        '#F44336'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });

        this.chartInstances.set('performance-distribution', chart);
    }

    createPredictiveAnalyticsChart() {
        const ctx = document.getElementById('predictive-analytics-chart').getContext('2d');

        // Generate historical and predicted data
        const historicalData = this.generateHistoricalData();
        const predictedData = this.generatePredictedData();

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [...historicalData.labels, ...predictedData.labels],
                datasets: [{
                    label: 'Historical Revenue',
                    data: [...historicalData.data, ...Array(predictedData.data.length).fill(null)],
                    borderColor: 'rgba(66, 133, 244, 1)',
                    backgroundColor: 'rgba(66, 133, 244, 0.1)',
                    borderWidth: 2,
                    fill: true
                }, {
                    label: 'Predicted Revenue',
                    data: [...Array(historicalData.data.length).fill(null), ...predictedData.data],
                    borderColor: 'rgba(255, 193, 7, 1)',
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) {
                                return '$' + (value / 1000) + 'K';
                            }
                        }
                    }
                }
            }
        });

        this.chartInstances.set('predictive-analytics', chart);
    }

    createKPITrendCharts() {
        const kpiCharts = [
            { id: 'revenue-trend-chart', data: [120, 135, 128, 142, 156, 149, 163] },
            { id: 'locations-trend-chart', data: [45, 47, 46, 48, 52, 54, 56] },
            { id: 'fleet-trend-chart', data: [87, 89, 86, 88, 91, 89, 92] },
            { id: 'customers-trend-chart', data: [2340, 2567, 2456, 2678, 2891, 2934, 3012] }
        ];

        kpiCharts.forEach(({ id, data }) => {
            const ctx = document.getElementById(id).getContext('2d');
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        data: data,
                        borderColor: 'rgba(66, 133, 244, 1)',
                        backgroundColor: 'rgba(66, 133, 244, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    },
                    elements: {
                        point: { radius: 0 }
                    }
                }
            });

            this.chartInstances.set(id.replace('-chart', ''), chart);
        });
    }

    createCustomerHeatmap() {
        // Create a simple heatmap visualization
        const container = document.getElementById('customer-heatmap-container');
        const heatmapData = this.generateHeatmapData();

        container.innerHTML = `
            <div class="heatmap-grid">
                ${heatmapData.map(row =>
            `<div class="heatmap-row">
                        ${row.map(cell =>
                `<div class="heatmap-cell" style="opacity: ${cell.intensity}" title="${cell.value} customers"></div>`
            ).join('')}
                    </div>`
        ).join('')}
            </div>
        `;
    }

    generateHistoricalData() {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const data = [];
        let baseValue = 100000;

        for (let i = 0; i < months.length; i++) {
            baseValue += Math.random() * 20000 - 10000;
            data.push(Math.max(50000, baseValue));
        }

        return { labels: months, data: data };
    }

    generatePredictedData() {
        const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const data = [];
        let baseValue = 140000;
        const growthRate = 0.05;

        for (let i = 0; i < months.length; i++) {
            baseValue *= (1 + growthRate + (Math.random() * 0.02 - 0.01));
            data.push(baseValue);
        }

        return { labels: months, data: data };
    }

    generateHeatmapData() {
        const rows = 8;
        const cols = 12;
        const data = [];

        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
                const intensity = Math.random();
                row.push({
                    intensity: intensity,
                    value: Math.floor(intensity * 1000)
                });
            }
            data.push(row);
        }

        return data;
    }

    setupEventListeners() {
        // Date range selector
        document.getElementById('analytics-date-range').addEventListener('change', (e) => {
            this.updateDateRange(e.target.value);
        });

        // Chart type selector
        document.getElementById('revenue-chart-type').addEventListener('change', (e) => {
            this.updateChartType('revenue-by-region', e.target.value);
        });

        // Export dashboard
        document.getElementById('export-dashboard-btn').addEventListener('click', () => {
            this.exportDashboard();
        });

        // Schedule report
        document.getElementById('schedule-report-btn').addEventListener('click', () => {
            this.showReportScheduler();
        });

        // Refresh data
        document.getElementById('refresh-data-btn').addEventListener('click', () => {
            this.refreshDashboardData();
        });

        // Report scheduler modal
        document.getElementById('close-scheduler').addEventListener('click', () => {
            this.hideReportScheduler();
        });

        document.getElementById('save-schedule').addEventListener('click', () => {
            this.saveReportSchedule();
        });
    }

    updateDateRange(range) {
        this.analyticsFilters.dateRange = range;
        this.refreshDashboardData();
    }

    updateChartType(chartId, type) {
        const chart = this.chartInstances.get(chartId);
        if (chart) {
            chart.config.type = type;
            chart.update();
        }
    }

    refreshDashboardData() {
        // Show loading state
        this.showLoadingState();

        // Simulate API call
        setTimeout(() => {
            this.updateKPIValues();
            this.updateCharts();
            this.updateDataTables();
            this.updateAlertsAndInsights();
            this.hideLoadingState();
            this.updateLastUpdatedTime();
        }, 1500);
    }

    updateKPIValues() {
        // Simulate KPI updates
        const kpis = [
            { id: 'total-revenue', value: '$2.85M', change: '+12.3%', positive: true },
            { id: 'active-locations', value: '156', change: '+8.1%', positive: true },
            { id: 'fleet-efficiency', value: '89.2%', change: '-2.1%', positive: false },
            { id: 'customer-visits', value: '23,456', change: '+15.7%', positive: true }
        ];

        kpis.forEach(kpi => {
            document.getElementById(kpi.id).textContent = kpi.value;
            const changeElement = document.getElementById(kpi.id.replace('total-', '').replace('active-', '').replace('fleet-', '').replace('customer-', '') + '-change');
            if (changeElement) {
                changeElement.textContent = kpi.change;
                changeElement.className = `kpi-change ${kpi.positive ? 'positive' : 'negative'}`;
            }
        });
    }

    updateCharts() {
        // Update chart data with new values
        this.chartInstances.forEach((chart, id) => {
            if (chart.data && chart.data.datasets) {
                chart.data.datasets.forEach(dataset => {
                    dataset.data = dataset.data.map(value =>
                        value + (Math.random() * 20000 - 10000)
                    );
                });
                chart.update();
            }
        });
    }

    updateDataTables() {
        const tableBody = document.getElementById('locations-table-body');
        const sampleData = [
            { name: 'Downtown Store', revenue: '$245K', visits: '1,234', efficiency: '92%', trend: '↗' },
            { name: 'Mall Location', revenue: '$189K', visits: '2,156', efficiency: '87%', trend: '↗' },
            { name: 'Airport Branch', revenue: '$167K', visits: '987', efficiency: '94%', trend: '↘' },
            { name: 'Suburb Office', revenue: '$134K', visits: '756', efficiency: '89%', trend: '↗' },
            { name: 'Business District', revenue: '$112K', visits: '567', efficiency: '85%', trend: '→' }
        ];

        tableBody.innerHTML = sampleData.map(location => `
            <tr>
                <td>${location.name}</td>
                <td>${location.revenue}</td>
                <td>${location.visits}</td>
                <td>${location.efficiency}</td>
                <td class="trend-cell">${location.trend}</td>
                <td>
                    <button class="action-btn" onclick="viewLocationDetails('${location.name}')">
                        <i class="material-icons">visibility</i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    updateAlertsAndInsights() {
        const alertsContainer = document.getElementById('smart-alerts');
        const insightsContainer = document.getElementById('ai-insights');

        const alerts = [
            { type: 'warning', message: 'Fleet efficiency decreased by 2.1% this week', time: '2 hours ago' },
            { type: 'success', message: 'Revenue target exceeded by $150K this month', time: '4 hours ago' },
            { type: 'info', message: 'New high-traffic location identified in downtown area', time: '1 day ago' }
        ];

        const insights = [
            { message: 'Customer traffic peaks between 2-4 PM on weekdays', confidence: '95%' },
            { message: 'Revenue correlation with weather patterns: 0.73', confidence: '87%' },
            { message: 'Predicted 18% increase in Q4 based on current trends', confidence: '82%' }
        ];

        alertsContainer.innerHTML = alerts.map(alert => `
            <div class="alert-item ${alert.type}">
                <div class="alert-content">
                    <div class="alert-message">${alert.message}</div>
                    <div class="alert-time">${alert.time}</div>
                </div>
            </div>
        `).join('');

        insightsContainer.innerHTML = insights.map(insight => `
            <div class="insight-item">
                <div class="insight-message">${insight.message}</div>
                <div class="insight-confidence">Confidence: ${insight.confidence}</div>
            </div>
        `).join('');
    }

    showLoadingState() {
        const dashboard = document.getElementById('advanced-analytics-dashboard');
        dashboard.classList.add('loading');
    }

    hideLoadingState() {
        const dashboard = document.getElementById('advanced-analytics-dashboard');
        dashboard.classList.remove('loading');
    }

    updateLastUpdatedTime() {
        document.getElementById('last-updated-time').textContent = new Date().toLocaleTimeString();
    }

    exportDashboard() {
        // In a real implementation, this would generate PDF/Excel exports
        const exportData = {
            timestamp: new Date().toISOString(),
            dateRange: this.analyticsFilters.dateRange,
            kpis: this.getKPIData(),
            charts: this.getChartData()
        };

        // Create and download JSON file for demo
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `dashboard-export-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);

        this.showNotification('Dashboard exported successfully', 'success');
    }

    showReportScheduler() {
        document.getElementById('report-scheduler-modal').style.display = 'flex';
    }

    hideReportScheduler() {
        document.getElementById('report-scheduler-modal').style.display = 'none';
    }

    saveReportSchedule() {
        const schedule = {
            type: document.getElementById('scheduled-report-type').value,
            frequency: document.getElementById('report-frequency').value,
            recipients: document.getElementById('report-recipients').value.split(',').map(email => email.trim()),
            formats: Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value)
        };

        // In real implementation, save to backend
        console.log('Report scheduled:', schedule);
        this.showNotification('Report scheduled successfully', 'success');
        this.hideReportScheduler();
    }

    getKPIData() {
        return {
            revenue: document.getElementById('total-revenue').textContent,
            locations: document.getElementById('active-locations').textContent,
            efficiency: document.getElementById('fleet-efficiency').textContent,
            visits: document.getElementById('customer-visits').textContent
        };
    }

    getChartData() {
        const chartData = {};
        this.chartInstances.forEach((chart, id) => {
            chartData[id] = chart.data;
        });
        return chartData;
    }

    showNotification(message, type = 'info') {
        if (window.enterpriseMaps && window.enterpriseMaps.showNotification) {
            window.enterpriseMaps.showNotification(message, type);
        } else {
            console.log(`${type}: ${message}`);
        }
    }

    show() {
        document.getElementById('advanced-analytics-dashboard').style.display = 'block';
        this.refreshDashboardData();
    }

    hide() {
        document.getElementById('advanced-analytics-dashboard').style.display = 'none';
    }
}

// Supporting Classes
class ReportScheduler {
    constructor() {
        this.scheduledReports = new Map();
    }

    scheduleReport(config) {
        const reportId = `report_${Date.now()}`;
        this.scheduledReports.set(reportId, {
            ...config,
            id: reportId,
            created: new Date().toISOString(),
            nextRun: this.calculateNextRun(config.frequency)
        });
        return reportId;
    }

    calculateNextRun(frequency) {
        const now = new Date();
        switch (frequency) {
            case 'daily': return new Date(now.getTime() + 24 * 60 * 60 * 1000);
            case 'weekly': return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            case 'monthly': return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
            case 'quarterly': return new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
            default: return now;
        }
    }
}

class PredictiveAnalytics {
    constructor() {
        this.models = new Map();
    }

    generatePrediction(data, model = 'linear') {
        switch (model) {
            case 'linear':
                return this.linearRegression(data);
            case 'polynomial':
                return this.polynomialRegression(data);
            case 'exponential':
                return this.exponentialRegression(data);
            default:
                return this.linearRegression(data);
        }
    }

    linearRegression(data) {
        // Simple linear regression implementation
        const n = data.length;
        const sumX = data.reduce((sum, _, i) => sum + i, 0);
        const sumY = data.reduce((sum, val) => sum + val, 0);
        const sumXY = data.reduce((sum, val, i) => sum + i * val, 0);
        const sumXX = data.reduce((sum, _, i) => sum + i * i, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        return data.map((_, i) => slope * (i + data.length) + intercept);
    }

    polynomialRegression(data) {
        // Simplified polynomial regression
        return data.map((val, i) => val * (1 + 0.1 * Math.sin(i * 0.5)));
    }

    exponentialRegression(data) {
        // Simplified exponential regression
        const growthRate = 0.05;
        return data.map((val, i) => val * Math.pow(1 + growthRate, i + 1));
    }
}

// Initialize advanced analytics dashboard
window.advancedAnalytics = new AdvancedAnalyticsDashboard();
