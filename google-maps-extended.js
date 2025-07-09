// Comprehensive Google Maps Features Extension
class GoogleMapsExtended extends GoogleMapsApp {
    constructor() {
        super();

        // Extended properties
        this.savedPlaces = JSON.parse(localStorage.getItem('savedPlaces') || '[]');
        this.recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        this.userSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
        this.measurementPoints = [];
        this.measurementPolyline = null;
        this.isMeasuring = false;
        this.trafficLayer = null;
        this.nearbyMarkers = [];
        this.contextMenuPosition = null;

        // Initialize extended features
        this.initExtendedFeatures();
    }

    initExtendedFeatures() {
        this.initContextMenu();
        this.initTooltips();
        this.initKeyboardShortcuts();
        this.initAdvancedSearch();
        this.initOfflineSupport();
        this.initVoiceCommands();
        this.loadUserSettings();
    }

    // Context Menu Functionality
    initContextMenu() {
        this.map.on('contextmenu', (e) => {
            this.showContextMenu(e);
        });

        document.addEventListener('click', () => {
            this.hideContextMenu();
        });

        // Context menu event listeners
        document.getElementById('directions-from-here').addEventListener('click', () => {
            this.directionsFromHere();
        });

        document.getElementById('directions-to-here').addEventListener('click', () => {
            this.directionsToHere();
        });

        document.getElementById('whats-here').addEventListener('click', () => {
            this.whatsHere();
        });

        document.getElementById('add-missing-place').addEventListener('click', () => {
            this.addMissingPlace();
        });

        document.getElementById('measure-distance').addEventListener('click', () => {
            this.startMeasuring();
        });

        document.getElementById('street-view-here').addEventListener('click', () => {
            this.openStreetView();
        });
    }

    showContextMenu(e) {
        const contextMenu = document.getElementById('context-menu');
        this.contextMenuPosition = e.latlng;

        contextMenu.style.left = e.containerPoint.x + 'px';
        contextMenu.style.top = e.containerPoint.y + 'px';
        contextMenu.style.display = 'block';

        e.originalEvent.preventDefault();
    }

    hideContextMenu() {
        document.getElementById('context-menu').style.display = 'none';
    }

    // Extended Event Listeners
    initEventListeners() {
        super.initEventListeners();

        // Extended control buttons
        document.getElementById('traffic-btn').addEventListener('click', () => {
            this.toggleTrafficPanel();
        });

        document.getElementById('nearby-btn').addEventListener('click', () => {
            this.toggleNearbyPanel();
        });

        document.getElementById('street-view-btn').addEventListener('click', () => {
            this.toggleStreetViewPanel();
        });

        document.getElementById('settings-btn').addEventListener('click', () => {
            this.toggleSettingsPanel();
        });

        // Panel close buttons
        document.getElementById('close-traffic').addEventListener('click', () => {
            this.closeTrafficPanel();
        });

        document.getElementById('close-nearby').addEventListener('click', () => {
            this.closeNearbyPanel();
        });

        document.getElementById('close-street-view').addEventListener('click', () => {
            this.closeStreetViewPanel();
        });

        document.getElementById('close-settings').addEventListener('click', () => {
            this.closeSettingsPanel();
        });

        document.getElementById('close-saved-places').addEventListener('click', () => {
            this.closeSavedPlacesPanel();
        });

        // Saved places functionality
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchPlaceCategory(e.target.dataset.category);
            });
        });

        document.getElementById('add-place-btn').addEventListener('click', () => {
            this.addNewPlace();
        });

        // Nearby places categories
        document.querySelectorAll('.nearby-category').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.searchNearbyPlaces(e.currentTarget.dataset.category);
            });
        });

        // Settings
        document.getElementById('voice-navigation').addEventListener('change', (e) => {
            this.updateSetting('voiceNavigation', e.target.checked);
        });

        document.getElementById('avoid-tolls').addEventListener('change', (e) => {
            this.updateSetting('avoidTolls', e.target.checked);
        });

        document.getElementById('avoid-highways').addEventListener('change', (e) => {
            this.updateSetting('avoidHighways', e.target.checked);
        });

        document.getElementById('show-traffic').addEventListener('change', (e) => {
            this.toggleTrafficLayer(e.target.checked);
        });

        document.getElementById('distance-unit').addEventListener('change', (e) => {
            this.updateSetting('distanceUnit', e.target.value);
        });

        // Share functionality
        document.getElementById('share-link').addEventListener('click', () => {
            this.shareLink();
        });

        document.getElementById('share-email').addEventListener('click', () => {
            this.shareEmail();
        });

        document.getElementById('share-embed').addEventListener('click', () => {
            this.shareEmbed();
        });

        document.getElementById('copy-url').addEventListener('click', () => {
            this.copyShareUrl();
        });

        document.getElementById('close-share-modal').addEventListener('click', () => {
            this.closeShareModal();
        });

        // Measurement tool
        document.getElementById('close-measurement').addEventListener('click', () => {
            this.stopMeasuring();
        });
    }

    // Traffic Functionality
    toggleTrafficPanel() {
        const panel = document.getElementById('traffic-panel');
        panel.classList.toggle('open');

        if (panel.classList.contains('open')) {
            this.loadTrafficIncidents();
        }
    }

    closeTrafficPanel() {
        document.getElementById('traffic-panel').classList.remove('open');
    }

    toggleTrafficLayer(show) {
        if (show) {
            this.addTrafficLayer();
        } else {
            this.removeTrafficLayer();
        }
    }

    addTrafficLayer() {
        // Simulated traffic layer - in real implementation, use traffic data API
        if (!this.trafficLayer) {
            this.trafficLayer = L.layerGroup();

            // Add some sample traffic indicators
            const trafficPoints = [
                { lat: 51.515, lng: -0.09, level: 'heavy' },
                { lat: 51.505, lng: -0.085, level: 'moderate' },
                { lat: 51.495, lng: -0.095, level: 'light' }
            ];

            trafficPoints.forEach(point => {
                const color = this.getTrafficColor(point.level);
                const circle = L.circle([point.lat, point.lng], {
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.5,
                    radius: 200
                });

                this.trafficLayer.addLayer(circle);
            });
        }

        this.trafficLayer.addTo(this.map);
    }

    removeTrafficLayer() {
        if (this.trafficLayer) {
            this.map.removeLayer(this.trafficLayer);
        }
    }

    getTrafficColor(level) {
        switch (level) {
            case 'light': return '#34a853';
            case 'moderate': return '#fbbc04';
            case 'heavy': return '#ea4335';
            case 'standstill': return '#9a1d05';
            default: return '#34a853';
        }
    }

    async loadTrafficIncidents() {
        const incidentsList = document.getElementById('incident-list');
        incidentsList.innerHTML = '<div class="loading-placeholder" style="height: 100px;"></div>';

        // Simulate API call
        setTimeout(() => {
            const incidents = [
                {
                    type: 'accident',
                    title: 'Traffic accident',
                    description: 'Multi-vehicle accident on Highway 101. Expect delays.',
                    severity: 'high'
                },
                {
                    type: 'construction',
                    title: 'Road construction',
                    description: 'Lane closure on Main Street. Use alternate route.',
                    severity: 'medium'
                },
                {
                    type: 'congestion',
                    title: 'Heavy traffic',
                    description: 'Unusually heavy traffic due to event.',
                    severity: 'low'
                }
            ];

            incidentsList.innerHTML = incidents.map(incident => `
                <div class="incident-item">
                    <span class="material-icons incident-icon">${this.getIncidentIcon(incident.type)}</span>
                    <div class="incident-content">
                        <div class="incident-title">${incident.title}</div>
                        <div class="incident-description">${incident.description}</div>
                    </div>
                </div>
            `).join('');
        }, 1000);
    }

    getIncidentIcon(type) {
        switch (type) {
            case 'accident': return 'warning';
            case 'construction': return 'construction';
            case 'congestion': return 'traffic';
            default: return 'info';
        }
    }

    // Nearby Places Functionality
    toggleNearbyPanel() {
        const panel = document.getElementById('nearby-panel');
        panel.classList.toggle('open');
    }

    closeNearbyPanel() {
        document.getElementById('nearby-panel').classList.remove('open');
    }

    async searchNearbyPlaces(category) {
        document.querySelectorAll('.nearby-category').forEach(btn => {
            btn.classList.remove('active');
        });

        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        const resultsContainer = document.getElementById('nearby-results');
        resultsContainer.innerHTML = '<div class="loading-placeholder" style="height: 200px;"></div>';

        try {
            const center = this.map.getCenter();
            const radius = 5000; // 5km radius

            // Use Overpass API for nearby places
            const query = this.buildOverpassQuery(category, center, radius);
            const response = await fetch('https://overpass-api.de/api/interpreter', {
                method: 'POST',
                body: query
            });

            const data = await response.json();
            this.displayNearbyResults(data.elements, category);

        } catch (error) {
            console.error('Error fetching nearby places:', error);
            this.showToast('Error loading nearby places', 'error');
            this.displayMockNearbyResults(category);
        }
    }

    buildOverpassQuery(category, center, radius) {
        const amenityMap = {
            'restaurant': 'restaurant',
            'gas_station': 'fuel',
            'atm': 'atm',
            'hospital': 'hospital',
            'shopping_mall': 'marketplace',
            'hotel': 'hotel'
        };

        const amenity = amenityMap[category] || category;

        return `
            [out:json][timeout:25];
            (
                node["amenity"="${amenity}"](around:${radius},${center.lat},${center.lng});
            );
            out center meta;
        `;
    }

    displayNearbyResults(places, category) {
        const resultsContainer = document.getElementById('nearby-results');

        if (places.length === 0) {
            resultsContainer.innerHTML = '<div style="text-align: center; color: #5f6368; padding: 40px;">No places found nearby</div>';
            return;
        }

        resultsContainer.innerHTML = places.slice(0, 10).map(place => {
            const name = place.tags?.name || 'Unnamed place';
            const address = this.formatAddress(place.tags);
            const rating = this.generateRandomRating();

            return `
                <div class="nearby-item" data-lat="${place.lat}" data-lng="${place.lon}">
                    <div class="nearby-item-icon">
                        <span class="material-icons">${this.getCategoryIcon(category)}</span>
                    </div>
                    <div class="nearby-item-info">
                        <div class="nearby-item-name">${name}</div>
                        <div class="nearby-item-details">${address}</div>
                        <div class="nearby-item-rating">
                            <span class="rating-stars">${'★'.repeat(Math.floor(rating))}</span>
                            <span class="rating-score">${rating.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Add click handlers for nearby items
        document.querySelectorAll('.nearby-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const lat = parseFloat(e.currentTarget.dataset.lat);
                const lng = parseFloat(e.currentTarget.dataset.lng);
                this.showPlaceOnMap(lat, lng, e.currentTarget.querySelector('.nearby-item-name').textContent);
            });
        });
    }

    displayMockNearbyResults(category) {
        // Fallback mock data when API fails
        const mockData = {
            restaurant: [
                { name: 'Pizza Palace', address: '123 Main St', rating: 4.2 },
                { name: 'Burger Barn', address: '456 Oak Ave', rating: 4.0 },
                { name: 'Sushi Central', address: '789 Pine St', rating: 4.5 }
            ],
            gas_station: [
                { name: 'Shell Station', address: '321 Highway Rd', rating: 3.8 },
                { name: 'BP Gas', address: '654 Market St', rating: 3.9 }
            ]
        };

        const places = mockData[category] || [];
        const resultsContainer = document.getElementById('nearby-results');

        resultsContainer.innerHTML = places.map(place => `
            <div class="nearby-item">
                <div class="nearby-item-icon">
                    <span class="material-icons">${this.getCategoryIcon(category)}</span>
                </div>
                <div class="nearby-item-info">
                    <div class="nearby-item-name">${place.name}</div>
                    <div class="nearby-item-details">${place.address}</div>
                    <div class="nearby-item-rating">
                        <span class="rating-stars">${'★'.repeat(Math.floor(place.rating))}</span>
                        <span class="rating-score">${place.rating}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    formatAddress(tags) {
        if (!tags) return 'Address not available';

        const parts = [];
        if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
        if (tags['addr:street']) parts.push(tags['addr:street']);
        if (tags['addr:city']) parts.push(tags['addr:city']);

        return parts.length > 0 ? parts.join(' ') : 'Address not available';
    }

    generateRandomRating() {
        return Math.random() * 2 + 3; // Random between 3.0 and 5.0
    }

    getCategoryIcon(category) {
        const icons = {
            restaurant: 'restaurant',
            gas_station: 'local_gas_station',
            atm: 'local_atm',
            hospital: 'local_hospital',
            shopping_mall: 'shopping_cart',
            hotel: 'hotel'
        };

        return icons[category] || 'place';
    }

    showPlaceOnMap(lat, lng, name) {
        this.map.setView([lat, lng], 16);

        // Remove existing nearby markers
        this.nearbyMarkers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.nearbyMarkers = [];

        // Add new marker
        const marker = L.marker([lat, lng]).addTo(this.map);
        marker.bindPopup(name).openPopup();
        this.nearbyMarkers.push(marker);

        // Close nearby panel
        this.closeNearbyPanel();
    }

    // Street View Functionality
    toggleStreetViewPanel() {
        const panel = document.getElementById('street-view-panel');
        panel.classList.toggle('open');

        if (panel.classList.contains('open')) {
            this.initStreetView();
        }
    }

    closeStreetViewPanel() {
        document.getElementById('street-view-panel').classList.remove('open');
    }

    initStreetView() {
        const streetViewCanvas = document.getElementById('street-view');

        // Simulate street view loading
        streetViewCanvas.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f5f5f5; color: #5f6368;">
                <div style="text-align: center;">
                    <div class="material-icons" style="font-size: 48px; margin-bottom: 16px;">streetview</div>
                    <div>Street View</div>
                    <div style="font-size: 12px; margin-top: 8px;">Click on a road to see street view</div>
                </div>
            </div>
        `;
    }

    openStreetView() {
        if (this.contextMenuPosition) {
            this.toggleStreetViewPanel();
            this.loadStreetViewForLocation(this.contextMenuPosition);
        }
        this.hideContextMenu();
    }

    loadStreetViewForLocation(latlng) {
        const streetViewCanvas = document.getElementById('street-view');

        // In a real implementation, you would integrate with Google Street View API
        streetViewCanvas.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #e8f4f8;">
                <div style="text-align: center; color: #1a73e8;">
                    <div class="material-icons" style="font-size: 48px; margin-bottom: 16px;">streetview</div>
                    <div>Street View at</div>
                    <div style="font-size: 12px; margin-top: 8px;">${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}</div>
                </div>
            </div>
        `;
    }

    // Settings Functionality
    toggleSettingsPanel() {
        const panel = document.getElementById('settings-panel');
        panel.classList.toggle('open');
    }

    closeSettingsPanel() {
        document.getElementById('settings-panel').classList.remove('open');
    }

    updateSetting(key, value) {
        this.userSettings[key] = value;
        localStorage.setItem('userSettings', JSON.stringify(this.userSettings));
        this.applySetting(key, value);
    }

    applySetting(key, value) {
        switch (key) {
            case 'voiceNavigation':
                // Enable/disable voice navigation
                break;
            case 'avoidTolls':
            case 'avoidHighways':
                // Update routing preferences
                if (this.currentRoute) {
                    this.recalculateRoute();
                }
                break;
            case 'distanceUnit':
                // Update distance display format
                this.updateDistanceDisplays();
                break;
        }
    }

    loadUserSettings() {
        // Apply saved settings
        Object.keys(this.userSettings).forEach(key => {
            const value = this.userSettings[key];
            this.applySetting(key, value);

            // Update UI elements
            const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = value;
                } else {
                    element.value = value;
                }
            }
        });
    }

    // Saved Places Functionality
    toggleSavedPlacesPanel() {
        const panel = document.getElementById('saved-places-panel');
        panel.classList.toggle('open');

        if (panel.classList.contains('open')) {
            this.loadSavedPlaces('favorites');
        }
    }

    closeSavedPlacesPanel() {
        document.getElementById('saved-places-panel').classList.remove('open');
    }

    switchPlaceCategory(category) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        this.loadSavedPlaces(category);
    }

    loadSavedPlaces(category) {
        const placesList = document.getElementById('places-list');
        let places = [];

        switch (category) {
            case 'favorites':
                places = this.savedPlaces.filter(p => p.category === 'favorite');
                break;
            case 'recent':
                places = this.recentSearches.slice(0, 10);
                break;
            case 'home-work':
                places = this.savedPlaces.filter(p => ['home', 'work'].includes(p.category));
                break;
        }

        placesList.innerHTML = places.map(place => `
            <div class="place-entry" data-lat="${place.lat}" data-lng="${place.lng}">
                <div class="place-icon">
                    <span class="material-icons">${this.getPlaceIcon(place.category)}</span>
                </div>
                <div class="place-info">
                    <div class="place-name">${place.name}</div>
                    <div class="place-address">${place.address || 'No address'}</div>
                </div>
                <div class="place-actions">
                    <button class="place-action-btn" onclick="app.navigateToPlace(${place.lat}, ${place.lng})">
                        <span class="material-icons">directions</span>
                    </button>
                    <button class="place-action-btn" onclick="app.removeSavedPlace('${place.id}')">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            </div>
        `).join('');

        // Add click handlers
        document.querySelectorAll('.place-entry').forEach(entry => {
            entry.addEventListener('click', (e) => {
                if (!e.target.closest('.place-actions')) {
                    const lat = parseFloat(e.currentTarget.dataset.lat);
                    const lng = parseFloat(e.currentTarget.dataset.lng);
                    this.map.setView([lat, lng], 16);
                    this.closeSavedPlacesPanel();
                }
            });
        });
    }

    getPlaceIcon(category) {
        const icons = {
            home: 'home',
            work: 'work',
            favorite: 'star',
            recent: 'history'
        };

        return icons[category] || 'place';
    }

    addNewPlace() {
        const center = this.map.getCenter();
        const placeName = prompt('Enter place name:');

        if (placeName) {
            const newPlace = {
                id: Date.now().toString(),
                name: placeName,
                lat: center.lat,
                lng: center.lng,
                category: 'favorite',
                address: `${center.lat.toFixed(6)}, ${center.lng.toFixed(6)}`
            };

            this.savedPlaces.push(newPlace);
            localStorage.setItem('savedPlaces', JSON.stringify(this.savedPlaces));
            this.loadSavedPlaces('favorites');
            this.showToast(`Added "${placeName}" to your places`, 'success');
        }
    }

    removeSavedPlace(id) {
        this.savedPlaces = this.savedPlaces.filter(p => p.id !== id);
        localStorage.setItem('savedPlaces', JSON.stringify(this.savedPlaces));
        this.loadSavedPlaces(document.querySelector('.category-btn.active').dataset.category);
        this.showToast('Place removed', 'success');
    }

    navigateToPlace(lat, lng) {
        document.getElementById('destination-input').value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        this.toggleDirections();
        this.closeSavedPlacesPanel();
    }

    // Context Menu Actions
    directionsFromHere() {
        if (this.contextMenuPosition) {
            const coords = `${this.contextMenuPosition.lat.toFixed(6)}, ${this.contextMenuPosition.lng.toFixed(6)}`;
            document.getElementById('origin-input').value = coords;
            this.toggleDirections();
        }
        this.hideContextMenu();
    }

    directionsToHere() {
        if (this.contextMenuPosition) {
            const coords = `${this.contextMenuPosition.lat.toFixed(6)}, ${this.contextMenuPosition.lng.toFixed(6)}`;
            document.getElementById('destination-input').value = coords;
            this.toggleDirections();
        }
        this.hideContextMenu();
    }

    async whatsHere() {
        if (this.contextMenuPosition) {
            this.showLoading();

            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.contextMenuPosition.lat}&lon=${this.contextMenuPosition.lng}`);
                const data = await response.json();

                const placeName = data.display_name || 'Unknown location';
                this.showToast(`Location: ${placeName}`, 'info');

            } catch (error) {
                this.showToast('Unable to get location information', 'error');
            } finally {
                this.hideLoading();
            }
        }
        this.hideContextMenu();
    }

    addMissingPlace() {
        if (this.contextMenuPosition) {
            const placeName = prompt('What is the name of this place?');
            if (placeName) {
                // In a real app, this would submit to a mapping service
                this.showToast(`Thank you for adding "${placeName}"!`, 'success');

                // Add as a saved place
                const newPlace = {
                    id: Date.now().toString(),
                    name: placeName,
                    lat: this.contextMenuPosition.lat,
                    lng: this.contextMenuPosition.lng,
                    category: 'favorite',
                    address: 'User-added location'
                };

                this.savedPlaces.push(newPlace);
                localStorage.setItem('savedPlaces', JSON.stringify(this.savedPlaces));
            }
        }
        this.hideContextMenu();
    }

    // Measurement Tool
    startMeasuring() {
        this.isMeasuring = true;
        this.measurementPoints = [];

        if (this.measurementPolyline) {
            this.map.removeLayer(this.measurementPolyline);
        }

        document.getElementById('measurement-tool').style.display = 'block';
        this.map.getContainer().style.cursor = 'crosshair';

        this.map.on('click', this.handleMeasurementClick.bind(this));
        this.hideContextMenu();
    }

    handleMeasurementClick(e) {
        if (!this.isMeasuring) return;

        this.measurementPoints.push([e.latlng.lat, e.latlng.lng]);

        if (this.measurementPoints.length > 1) {
            if (this.measurementPolyline) {
                this.map.removeLayer(this.measurementPolyline);
            }

            this.measurementPolyline = L.polyline(this.measurementPoints, {
                color: '#1a73e8',
                weight: 3,
                dashArray: '5, 10'
            }).addTo(this.map);
        }

        // Add measurement marker
        L.circleMarker([e.latlng.lat, e.latlng.lng], {
            color: '#1a73e8',
            fillColor: '#1a73e8',
            fillOpacity: 1,
            radius: 4
        }).addTo(this.map);

        this.updateMeasurementDisplay();
    }

    updateMeasurementDisplay() {
        if (this.measurementPoints.length < 2) return;

        let totalDistance = 0;
        for (let i = 1; i < this.measurementPoints.length; i++) {
            const point1 = L.latLng(this.measurementPoints[i - 1]);
            const point2 = L.latLng(this.measurementPoints[i]);
            totalDistance += point1.distanceTo(point2);
        }

        const unit = this.userSettings.distanceUnit || 'metric';
        const formattedDistance = this.formatDistance(totalDistance, unit);

        document.getElementById('measurement-distance').textContent = formattedDistance;
    }

    stopMeasuring() {
        this.isMeasuring = false;
        this.map.off('click', this.handleMeasurementClick);
        this.map.getContainer().style.cursor = '';
        document.getElementById('measurement-tool').style.display = 'none';

        if (this.measurementPolyline) {
            this.map.removeLayer(this.measurementPolyline);
        }

        // Remove measurement markers
        this.map.eachLayer(layer => {
            if (layer instanceof L.CircleMarker && layer.options.radius === 4) {
                this.map.removeLayer(layer);
            }
        });

        this.measurementPoints = [];
    }

    formatDistance(meters, unit = 'metric') {
        if (unit === 'imperial') {
            const feet = meters * 3.28084;
            if (feet < 5280) {
                return `${Math.round(feet)} ft`;
            } else {
                return `${(feet / 5280).toFixed(2)} mi`;
            }
        } else {
            if (meters < 1000) {
                return `${Math.round(meters)} m`;
            } else {
                return `${(meters / 1000).toFixed(2)} km`;
            }
        }
    }

    // Share Functionality
    shareLink() {
        document.getElementById('share-modal').style.display = 'flex';
        this.generateShareUrl();
    }

    shareEmail() {
        const url = this.generateShareUrl();
        const subject = 'Check out this location on Maps';
        const body = `I wanted to share this location with you: ${url}`;

        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }

    shareEmbed() {
        const embedCode = this.generateEmbedCode();
        navigator.clipboard.writeText(embedCode);
        this.showToast('Embed code copied to clipboard', 'success');
    }

    generateShareUrl() {
        const center = this.map.getCenter();
        const zoom = this.map.getZoom();
        const url = `${window.location.origin}${window.location.pathname}?lat=${center.lat}&lng=${center.lng}&zoom=${zoom}`;

        document.getElementById('share-url-input').value = url;
        return url;
    }

    generateEmbedCode() {
        const center = this.map.getCenter();
        const zoom = this.map.getZoom();

        return `<iframe src="${window.location.origin}${window.location.pathname}?lat=${center.lat}&lng=${center.lng}&zoom=${zoom}&embed=true" width="600" height="400" frameborder="0"></iframe>`;
    }

    copyShareUrl() {
        const input = document.getElementById('share-url-input');
        input.select();
        navigator.clipboard.writeText(input.value);
        this.showToast('Link copied to clipboard', 'success');
    }

    closeShareModal() {
        document.getElementById('share-modal').style.display = 'none';
    }

    // Toast Notifications
    showToast(message, type = 'info', duration = 3000) {
        const toastContainer = document.getElementById('toast-container');

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="material-icons">${this.getToastIcon(type)}</span>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, duration);
    }

    getToastIcon(type) {
        const icons = {
            success: 'check_circle',
            error: 'error',
            warning: 'warning',
            info: 'info'
        };

        return icons[type] || 'info';
    }

    // Advanced Search Features
    initAdvancedSearch() {
        const searchInput = document.getElementById('search-input');

        // Add search filters and advanced options
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && e.target.value.trim()) {
                e.preventDefault();
                this.showAdvancedSearchOptions();
            }
        });
    }

    showAdvancedSearchOptions() {
        // Implementation for advanced search filters
        // Category filters, distance radius, price range, etc.
    }

    // Keyboard Shortcuts
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'f':
                        e.preventDefault();
                        document.getElementById('search-input').focus();
                        break;
                    case 'd':
                        e.preventDefault();
                        this.toggleDirections();
                        break;
                    case 'm':
                        e.preventDefault();
                        this.getUserLocation();
                        break;
                    case 's':
                        e.preventDefault();
                        this.shareLink();
                        break;
                }
            }

            if (e.key === 'Escape') {
                this.closeAllPanels();
                this.hideContextMenu();
                if (this.isMeasuring) {
                    this.stopMeasuring();
                }
            }
        });
    }

    closeAllPanels() {
        document.querySelectorAll('.side-panel, .directions-panel, .traffic-panel, .nearby-panel, .street-view-panel, .settings-panel, .saved-places-panel').forEach(panel => {
            panel.classList.remove('open');
        });
    }

    // Tooltips
    initTooltips() {
        // Add hover tooltips for buttons and controls
        document.querySelectorAll('[title]').forEach(element => {
            element.addEventListener('mouseenter', this.showTooltip.bind(this));
            element.addEventListener('mouseleave', this.hideTooltip.bind(this));
        });
    }

    showTooltip(e) {
        // Implementation for custom tooltips
    }

    hideTooltip(e) {
        // Implementation for hiding tooltips
    }

    // Offline Support
    initOfflineSupport() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');
        }

        window.addEventListener('online', () => {
            this.showToast('Back online', 'success');
        });

        window.addEventListener('offline', () => {
            this.showToast('You are offline. Some features may not work.', 'warning');
        });
    }

    // Voice Commands (basic implementation)
    initVoiceCommands() {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                const command = event.results[0][0].transcript.toLowerCase();
                this.processVoiceCommand(command);
            };

            // Add voice search button
            const voiceBtn = document.createElement('button');
            voiceBtn.className = 'voice-search-btn';
            voiceBtn.innerHTML = '<span class="material-icons">mic</span>';
            voiceBtn.addEventListener('click', () => {
                recognition.start();
                this.showToast('Listening...', 'info', 1000);
            });

            document.querySelector('.search-box').appendChild(voiceBtn);
        }
    }

    processVoiceCommand(command) {
        if (command.includes('directions to')) {
            const destination = command.replace('directions to ', '');
            document.getElementById('destination-input').value = destination;
            this.toggleDirections();
        } else if (command.includes('search for')) {
            const query = command.replace('search for ', '');
            document.getElementById('search-input').value = query;
            this.performSearch(query);
        } else if (command.includes('my location')) {
            this.getUserLocation();
        }
    }

    // URL Parameters Support
    initFromUrlParams() {
        const params = new URLSearchParams(window.location.search);

        if (params.has('lat') && params.has('lng')) {
            const lat = parseFloat(params.get('lat'));
            const lng = parseFloat(params.get('lng'));
            const zoom = parseInt(params.get('zoom')) || 13;

            this.map.setView([lat, lng], zoom);
        }

        if (params.has('embed')) {
            // Hide UI elements for embed mode
            document.querySelector('.maps-header').style.display = 'none';
            document.querySelector('.bottom-controls').style.display = 'none';
        }
    }
}

// Initialize the extended Google Maps application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new GoogleMapsExtended();
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleMapsExtended;
}
