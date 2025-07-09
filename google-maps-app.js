// Google Maps-like Application JavaScript
class GoogleMapsApp {
    constructor() {
        this.map = null;
        this.userMarker = null;
        this.searchMarker = null;
        this.routeControl = null;
        this.currentRoute = null;
        this.isNavigating = false;
        this.searchSuggestions = [];
        this.currentLayer = 'standard';

        // Map layers
        this.mapLayers = {
            standard: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }),
            satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '© Esri',
                maxZoom: 19
            }),
            terrain: L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png', {
                attribution: '© Stamen Design, © OpenStreetMap contributors',
                maxZoom: 18
            }),
            transit: L.tileLayer('https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38', {
                attribution: '© Thunderforest, © OpenStreetMap contributors',
                maxZoom: 19
            })
        };

        this.init();
    }

    init() {
        this.initMap();
        this.initEventListeners();
        this.initControls();
    }

    initMap() {
        // Initialize the map
        this.map = L.map('map', {
            zoomControl: false,
            attributionControl: false
        }).setView([51.505, -0.09], 13);

        // Add default layer
        this.mapLayers.standard.addTo(this.map);

        // Add zoom control to bottom right
        L.control.zoom({
            position: 'bottomright'
        }).addTo(this.map);

        // Map click handler for placing markers
        this.map.on('click', (e) => {
            this.handleMapClick(e);
        });

        // Try to get user location
        this.getUserLocation();
    }

    initEventListeners() {
        // Menu button
        document.getElementById('menu-btn').addEventListener('click', () => {
            this.toggleSidePanel();
        });

        // Search functionality
        const searchInput = document.getElementById('search-input');
        const searchClear = document.getElementById('search-clear');

        searchInput.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(e.target.value);
            }
        });

        searchInput.addEventListener('focus', () => {
            this.showSearchSuggestions();
        });

        searchClear.addEventListener('click', () => {
            this.clearSearch();
        });

        // Directions functionality
        document.getElementById('directions-btn').addEventListener('click', () => {
            this.toggleDirections();
        });

        document.getElementById('close-directions').addEventListener('click', () => {
            this.closeDirections();
        });

        document.getElementById('swap-directions').addEventListener('click', () => {
            this.swapDirections();
        });

        document.getElementById('get-directions').addEventListener('click', () => {
            this.calculateRoute();
        });

        // Transportation mode buttons
        document.querySelectorAll('.route-mode').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setTransportMode(e.currentTarget.dataset.mode);
            });
        });

        // Bottom controls
        document.getElementById('my-location-btn').addEventListener('click', () => {
            this.getUserLocation();
        });

        document.getElementById('layers-btn').addEventListener('click', () => {
            this.toggleLayerControl();
        });

        // Layer options
        document.querySelectorAll('.layer-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.switchLayer(e.currentTarget.dataset.layer);
            });
        });

        // Navigation controls
        document.getElementById('start-navigation').addEventListener('click', () => {
            this.startNavigation();
        });

        document.getElementById('stop-navigation').addEventListener('click', () => {
            this.stopNavigation();
        });

        // Close panels when clicking outside
        document.addEventListener('click', (e) => {
            this.handleOutsideClick(e);
        });
    }

    initControls() {
        // Initialize any additional controls or UI elements
        this.updateLayerDisplay();
    }

    toggleSidePanel() {
        const sidePanel = document.getElementById('side-panel');
        sidePanel.classList.toggle('open');
    }

    handleSearchInput(value) {
        const searchClear = document.getElementById('search-clear');

        if (value.trim()) {
            searchClear.style.display = 'flex';
            this.getSuggestions(value);
        } else {
            searchClear.style.display = 'none';
            this.hideSuggestions();
        }
    }

    async getSuggestions(query) {
        if (query.length < 3) return;

        try {
            // Using Nominatim for search suggestions
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`);
            const data = await response.json();

            this.searchSuggestions = data.map(item => ({
                name: item.display_name,
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon),
                type: item.type
            }));

            this.displaySuggestions();
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }

    displaySuggestions() {
        const suggestionsDiv = document.getElementById('search-suggestions');

        if (this.searchSuggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        suggestionsDiv.innerHTML = '';

        this.searchSuggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.innerHTML = `
                <span class="material-icons suggestion-icon">place</span>
                <span>${suggestion.name}</span>
            `;

            item.addEventListener('click', () => {
                this.selectSuggestion(suggestion);
            });

            suggestionsDiv.appendChild(item);
        });

        suggestionsDiv.style.display = 'block';
    }

    selectSuggestion(suggestion) {
        document.getElementById('search-input').value = suggestion.name;
        this.performSearch(suggestion.name, suggestion.lat, suggestion.lng);
        this.hideSuggestions();
    }

    showSearchSuggestions() {
        const searchValue = document.getElementById('search-input').value;
        if (searchValue.trim() && this.searchSuggestions.length > 0) {
            document.getElementById('search-suggestions').style.display = 'block';
        }
    }

    hideSuggestions() {
        document.getElementById('search-suggestions').style.display = 'none';
    }

    async performSearch(query, lat = null, lng = null) {
        if (!query.trim()) return;

        this.showLoading();

        try {
            if (lat && lng) {
                // Use provided coordinates
                this.showSearchResult(query, lat, lng);
            } else {
                // Search for the location
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`);
                const data = await response.json();

                if (data.length > 0) {
                    const result = data[0];
                    this.showSearchResult(result.display_name, parseFloat(result.lat), parseFloat(result.lon));
                } else {
                    this.showError('Location not found');
                }
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showError('Search failed. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    showSearchResult(name, lat, lng) {
        // Remove previous search marker
        if (this.searchMarker) {
            this.map.removeLayer(this.searchMarker);
        }

        // Add new marker
        this.searchMarker = L.marker([lat, lng]).addTo(this.map);
        this.searchMarker.bindPopup(name).openPopup();

        // Center map on result
        this.map.setView([lat, lng], 15);

        // Update directions inputs if directions panel is open
        if (document.getElementById('directions-panel').classList.contains('open')) {
            document.getElementById('destination-input').value = name;
        }
    }

    clearSearch() {
        document.getElementById('search-input').value = '';
        document.getElementById('search-clear').style.display = 'none';
        this.hideSuggestions();

        if (this.searchMarker) {
            this.map.removeLayer(this.searchMarker);
            this.searchMarker = null;
        }
    }

    toggleDirections() {
        const panel = document.getElementById('directions-panel');
        panel.classList.toggle('open');

        if (panel.classList.contains('open')) {
            // Focus on origin input
            document.getElementById('origin-input').focus();
        }
    }

    closeDirections() {
        document.getElementById('directions-panel').classList.remove('open');
        this.clearRoute();
    }

    swapDirections() {
        const originInput = document.getElementById('origin-input');
        const destinationInput = document.getElementById('destination-input');

        const temp = originInput.value;
        originInput.value = destinationInput.value;
        destinationInput.value = temp;
    }

    setTransportMode(mode) {
        document.querySelectorAll('.route-mode').forEach(btn => {
            btn.classList.remove('active');
        });

        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

        // Recalculate route if one exists
        if (this.currentRoute) {
            this.calculateRoute();
        }
    }

    async calculateRoute() {
        const origin = document.getElementById('origin-input').value;
        const destination = document.getElementById('destination-input').value;

        if (!origin || !destination) {
            this.showError('Please enter both origin and destination');
            return;
        }

        this.showLoading();

        try {
            // Geocode origin and destination
            const [originCoords, destCoords] = await Promise.all([
                this.geocodeLocation(origin),
                this.geocodeLocation(destination)
            ]);

            if (!originCoords || !destCoords) {
                this.showError('Could not find one or more locations');
                return;
            }

            // Calculate route using the existing routing.js functionality
            const routeData = await this.getDetailedRoute(originCoords, destCoords);

            this.displayRoute(routeData, originCoords, destCoords);
            this.showRouteSummary(routeData);

        } catch (error) {
            console.error('Route calculation error:', error);
            this.showError('Failed to calculate route');
        } finally {
            this.hideLoading();
        }
    }

    async geocodeLocation(location) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(location)}`);
            const data = await response.json();

            if (data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                };
            }

            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    }

    // Integrate the existing routing functionality
    async getDetailedRoute(pointA, pointB) {
        try {
            const coordinates = `${pointA.lng},${pointA.lat};${pointB.lng},${pointB.lat}`;
            const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&steps=true&annotations=true`);
            const data = await response.json();

            if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
                throw new Error('Could not calculate route');
            }

            const route = data.routes[0];
            const legs = route.legs[0];

            const steps = legs.steps.map(step => ({
                instruction: step.maneuver.type === 'arrive' ? 'Arrive at destination' :
                    step.maneuver.instruction || this.getInstructionText(step.maneuver),
                distance: step.distance,
                duration: step.duration,
                name: step.name || '',
                type: step.maneuver.type,
                modifier: step.maneuver.modifier
            }));

            return {
                distance: route.distance / 1000,
                duration: Math.round(route.duration / 60),
                geometry: route.geometry,
                steps: steps
            };
        } catch (error) {
            console.error('Error calculating detailed route:', error);
            throw error;
        }
    }

    getInstructionText(maneuver) {
        const type = maneuver.type;
        const modifier = maneuver.modifier;

        switch (type) {
            case 'turn':
                return `Turn ${modifier}`;
            case 'continue':
                return 'Continue straight';
            case 'depart':
                return 'Head ' + (modifier || 'straight');
            case 'arrive':
                return 'Arrive at destination';
            case 'merge':
                return 'Merge';
            case 'ramp':
                return 'Take ramp';
            default:
                return 'Continue';
        }
    }

    displayRoute(routeData, origin, destination) {
        // Clear existing route
        this.clearRoute();

        // Decode polyline and display route
        const routeCoords = this.decodePolyline(routeData.geometry);

        this.currentRoute = L.polyline(routeCoords, {
            color: '#1a73e8',
            weight: 5,
            opacity: 0.8
        }).addTo(this.map);

        // Add markers for origin and destination
        const originMarker = L.marker([origin.lat, origin.lng], {
            icon: this.createCustomIcon('#34a853', 'A')
        }).addTo(this.map);

        const destMarker = L.marker([destination.lat, destination.lng], {
            icon: this.createCustomIcon('#ea4335', 'B')
        }).addTo(this.map);

        // Fit map to route bounds
        const group = new L.featureGroup([this.currentRoute, originMarker, destMarker]);
        this.map.fitBounds(group.getBounds(), { padding: [50, 50] });

        // Store markers for cleanup
        this.routeMarkers = [originMarker, destMarker];
    }

    createCustomIcon(color, text) {
        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${color}; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${text}</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
    }

    decodePolyline(encoded) {
        let index = 0;
        const len = encoded.length;
        const coordinates = [];
        let lat = 0;
        let lng = 0;

        while (index < len) {
            let shift = 0;
            let result = 0;
            let byte;

            do {
                byte = encoded.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += dlat;

            shift = 0;
            result = 0;

            do {
                byte = encoded.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += dlng;

            coordinates.push([lat / 1e5, lng / 1e5]);
        }

        return coordinates;
    }

    showRouteSummary(routeData) {
        const routeSummary = document.getElementById('route-summary');
        routeSummary.style.display = 'block';
        routeSummary.classList.add('visible');

        document.getElementById('route-distance').textContent =
            routeData.distance < 1 ?
                `${Math.round(routeData.distance * 1000)} m` :
                `${routeData.distance.toFixed(1)} km`;

        document.getElementById('route-duration').textContent =
            routeData.duration < 60 ?
                `${routeData.duration} min` :
                `${Math.floor(routeData.duration / 60)}h ${routeData.duration % 60}m`;

        // Display route steps
        const stepsContainer = document.getElementById('route-steps');
        stepsContainer.innerHTML = '';

        routeData.steps.forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'route-step';

            const icon = this.getStepIcon(step.type);
            const distance = step.distance < 1000 ?
                `${Math.round(step.distance)} m` :
                `${(step.distance / 1000).toFixed(1)} km`;

            stepDiv.innerHTML = `
                <span class="material-icons step-icon">${icon}</span>
                <div class="step-content">
                    <div class="step-instruction">${step.instruction}</div>
                    <div class="step-distance">${distance}</div>
                </div>
            `;

            stepsContainer.appendChild(stepDiv);
        });

        // Show start navigation button
        document.getElementById('start-navigation').style.display = 'block';
    }

    getStepIcon(type) {
        switch (type) {
            case 'turn':
                return 'turn_right';
            case 'continue':
                return 'straight';
            case 'depart':
                return 'directions';
            case 'arrive':
                return 'place';
            case 'merge':
                return 'merge_type';
            case 'ramp':
                return 'ramp_right';
            default:
                return 'directions';
        }
    }

    clearRoute() {
        if (this.currentRoute) {
            this.map.removeLayer(this.currentRoute);
            this.currentRoute = null;
        }

        if (this.routeMarkers) {
            this.routeMarkers.forEach(marker => this.map.removeLayer(marker));
            this.routeMarkers = null;
        }

        document.getElementById('start-navigation').style.display = 'none';
    }

    startNavigation() {
        if (!this.currentRoute) return;

        this.isNavigating = true;
        document.getElementById('navigation-ui').classList.add('active');
        document.getElementById('directions-panel').classList.remove('open');

        // Start simulated navigation
        this.simulateNavigation();
    }

    stopNavigation() {
        this.isNavigating = false;
        document.getElementById('navigation-ui').classList.remove('active');
    }

    simulateNavigation() {
        if (!this.isNavigating) return;

        // This is a simplified navigation simulation
        // In a real app, you'd use GPS tracking and real-time updates
        const steps = document.querySelectorAll('.route-step');
        let currentStep = 0;

        const updateNavigation = () => {
            if (!this.isNavigating || currentStep >= steps.length) return;

            const step = steps[currentStep];
            const instruction = step.querySelector('.step-instruction').textContent;
            const distance = step.querySelector('.step-distance').textContent;

            document.getElementById('nav-instruction').textContent = instruction;
            document.getElementById('nav-distance').textContent = distance;

            currentStep++;

            if (currentStep < steps.length) {
                setTimeout(updateNavigation, 5000); // Update every 5 seconds for demo
            } else {
                document.getElementById('nav-instruction').textContent = 'You have arrived at your destination';
                setTimeout(() => this.stopNavigation(), 3000);
            }
        };

        updateNavigation();
    }

    getUserLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser');
            return;
        }

        this.showLoading();

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                // Remove previous user marker
                if (this.userMarker) {
                    this.map.removeLayer(this.userMarker);
                }

                // Add user location marker
                this.userMarker = L.marker([lat, lng], {
                    icon: L.divIcon({
                        className: 'user-location-marker',
                        html: '<div style="background: #1a73e8; border: 3px solid white; border-radius: 50%; width: 16px; height: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                        iconSize: [16, 16],
                        iconAnchor: [8, 8]
                    })
                }).addTo(this.map);

                this.map.setView([lat, lng], 15);
                this.hideLoading();

                // Update origin in directions if panel is open
                if (document.getElementById('directions-panel').classList.contains('open')) {
                    document.getElementById('origin-input').value = 'Your location';
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                this.showError('Unable to get your location');
                this.hideLoading();
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    }

    toggleLayerControl() {
        const layerControl = document.getElementById('layer-control');
        layerControl.classList.toggle('open');
    }

    switchLayer(layerType) {
        // Remove current layer
        Object.values(this.mapLayers).forEach(layer => {
            if (this.map.hasLayer(layer)) {
                this.map.removeLayer(layer);
            }
        });

        // Add new layer
        this.mapLayers[layerType].addTo(this.map);
        this.currentLayer = layerType;

        // Update UI
        this.updateLayerDisplay();

        // Close layer control
        document.getElementById('layer-control').classList.remove('open');
    }

    updateLayerDisplay() {
        document.querySelectorAll('.layer-option').forEach(option => {
            option.classList.remove('active');
        });

        document.querySelector(`[data-layer="${this.currentLayer}"]`).classList.add('active');
    }

    handleMapClick(e) {
        // Handle map clicks for placing custom markers or other interactions
        const { lat, lng } = e.latlng;

        // If directions panel is open and no destination is set, use clicked point
        if (document.getElementById('directions-panel').classList.contains('open')) {
            const destInput = document.getElementById('destination-input');
            if (!destInput.value.trim()) {
                // Reverse geocode the clicked point
                this.reverseGeocode(lat, lng).then(address => {
                    destInput.value = address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
                });
            }
        }
    }

    async reverseGeocode(lat, lng) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            return data.display_name || null;
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return null;
        }
    }

    handleOutsideClick(e) {
        // Close suggestions if clicking outside search
        if (!e.target.closest('.search-container')) {
            this.hideSuggestions();
        }

        // Close layer control if clicking outside
        if (!e.target.closest('.layer-control') && !e.target.closest('#layers-btn')) {
            document.getElementById('layer-control').classList.remove('open');
        }

        // Close side panel if clicking outside
        if (!e.target.closest('.side-panel') && !e.target.closest('#menu-btn')) {
            document.getElementById('side-panel').classList.remove('open');
        }
    }

    showLoading() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.style.display = 'block';
            spinner.classList.add('visible');
        }
    }

    hideLoading() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.style.display = 'none';
            spinner.classList.remove('visible');
        }
    }

    showError(message) {
        // Simple error notification - could be enhanced with a proper toast system
        alert(message);
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.googleMapsApp = new GoogleMapsApp();
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleMapsApp;
}
