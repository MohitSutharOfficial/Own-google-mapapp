// Mobile-specific enhancements for FindMyMap application

document.addEventListener('DOMContentLoaded', function () {
    // Initialize mobile features
    initMobileFeatures();

    // Fix mobile toggle functionality
    fixMobileToggle();

    // Initialize floating action buttons
    initFloatingActionButtons();

    // Add modern search functionality
    enhanceModernSearch();

    // Add smooth scroll effects
    addSmoothScrollEffects();

    // Debug: Add console logging to check if elements exist
    console.log('Modern UI Debug: DOM loaded');

    // Check if elements exist
    const searchContainer = document.querySelector('.modern-search-container');
    const floatingBtn = document.querySelector('.floating-menu-btn');
    const sidebar = document.querySelector('.modern-sidebar');
    const fabBtns = document.querySelectorAll('.fab-btn');

    console.log('Search container:', searchContainer);
    console.log('Floating button:', floatingBtn);
    console.log('Sidebar:', sidebar);
    console.log('FAB buttons:', fabBtns);

    // Force show elements
    if (searchContainer) {
        searchContainer.style.display = 'block';
        searchContainer.style.visibility = 'visible';
        console.log('Search container made visible');
    }

    if (floatingBtn) {
        floatingBtn.style.display = 'flex';
        floatingBtn.style.visibility = 'visible';
        console.log('Floating button made visible');
    }

    if (sidebar) {
        sidebar.style.display = 'flex';
        sidebar.style.visibility = 'visible';
        console.log('Sidebar made visible');
    }

    fabBtns.forEach((btn, index) => {
        btn.style.display = 'flex';
        btn.style.visibility = 'visible';
        console.log(`FAB button ${index} made visible`);
    });
});

// Simplified Modern UI Initialization
document.addEventListener('DOMContentLoaded', function () {
    console.log('Initializing simplified modern UI...');

    // Initialize floating menu button
    const floatingMenuBtn = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('controls-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (floatingMenuBtn && sidebar) {
        floatingMenuBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            console.log('Floating menu clicked');

            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                if (overlay) overlay.style.display = 'none';
            } else {
                sidebar.classList.add('active');
                if (overlay) overlay.style.display = 'block';
            }
        });
    }

    // Initialize floating action buttons
    const locateFab = document.getElementById('locate-fab');
    const layersFab = document.getElementById('layers-fab');

    if (locateFab) {
        locateFab.addEventListener('click', function () {
            console.log('Locate FAB clicked');
            if (typeof locateUser === 'function') {
                locateUser();
            }
        });
    }

    if (layersFab) {
        layersFab.addEventListener('click', function () {
            console.log('Layers FAB clicked');
            // Toggle layers control visibility
            const layersControl = document.querySelector('.map-layers-control');
            if (layersControl) {
                layersControl.classList.toggle('visible');
            }
        });
    }

    // Initialize search functionality
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.querySelector('.search-clear-btn');

    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                console.log('Search triggered');
                if (typeof searchLocation === 'function') {
                    searchLocation();
                }
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            console.log('Clear search clicked');
            searchInput.value = '';
            if (typeof searchMarker !== 'undefined' && searchMarker && typeof map !== 'undefined') {
                map.removeLayer(searchMarker);
                searchMarker = null;
            }
        });
    }

    // Close sidebar when clicking overlay
    if (overlay) {
        overlay.addEventListener('click', function () {
            sidebar.classList.remove('active');
            overlay.style.display = 'none';
        });
    }

    console.log('Modern UI initialized successfully');
});

/**
 * Initialize all mobile-specific features
 */
function initMobileFeatures() {
    // Add bottom sheet for directions
    createBottomSheet();

    // Add swipe gestures for map interaction
    initSwipeGestures();

    // Add quick action buttons
    createQuickActionButtons();

    // Add autocomplete for search
    enhanceSearchWithAutocomplete();

    // Add pull-to-refresh functionality
    initPullToRefresh();

    // Add haptic feedback for buttons
    initHapticFeedback();
}

/**
 * Create a bottom sheet component for directions and information
 */
function createBottomSheet() {
    // Create bottom sheet container
    const bottomSheet = document.createElement('div');
    bottomSheet.id = 'mobile-bottom-sheet';
    bottomSheet.className = 'mobile-bottom-sheet';

    // Create handle for dragging
    const handle = document.createElement('div');
    handle.className = 'bottom-sheet-handle';

    // Create content container
    const content = document.createElement('div');
    content.className = 'bottom-sheet-content';
    content.innerHTML = `
        <div class="bottom-sheet-header">
            <h5>Route Information</h5>
            <button class="bottom-sheet-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="bottom-sheet-body" id="bottom-sheet-body">
            <div class="placeholder-content">
                <p>Search for a location or tap on the map to see directions</p>
            </div>
        </div>
    `;

    // Assemble bottom sheet
    bottomSheet.appendChild(handle);
    bottomSheet.appendChild(content);

    // Add to document
    document.body.appendChild(bottomSheet);

    // Initialize bottom sheet behavior
    initBottomSheetBehavior(bottomSheet, handle);

    // Add close button functionality
    const closeBtn = bottomSheet.querySelector('.bottom-sheet-close');
    closeBtn.addEventListener('click', function () {
        bottomSheet.classList.remove('expanded');
        bottomSheet.classList.remove('peek');
    });
}

/**
 * Initialize the draggable behavior of the bottom sheet
 * @param {HTMLElement} sheet - The bottom sheet element
 * @param {HTMLElement} handle - The drag handle element
 */
function initBottomSheetBehavior(sheet, handle) {
    let startY = 0;
    let startHeight = 0;
    let sheetHeight = sheet.offsetHeight;
    const minHeight = 60; // Height when minimized
    const peekHeight = 200; // Height when in peek state
    const maxHeight = window.innerHeight * 0.8; // Maximum height (80% of viewport)

    // Set initial state
    sheet.style.height = `${minHeight}px`;
    sheet.classList.add('collapsed');

    // Touch start event
    handle.addEventListener('touchstart', function (e) {
        startY = e.touches[0].clientY;
        startHeight = sheet.offsetHeight;
        sheet.classList.add('dragging');
        e.preventDefault();
    });

    // Touch move event
    handle.addEventListener('touchmove', function (e) {
        const deltaY = startY - e.touches[0].clientY;
        const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY));
        sheet.style.height = `${newHeight}px`;
    });

    // Touch end event
    handle.addEventListener('touchend', function () {
        sheet.classList.remove('dragging');
        const currentHeight = sheet.offsetHeight;

        // Determine which state to snap to
        if (currentHeight < (minHeight + peekHeight) / 2) {
            // Collapse
            sheet.style.height = `${minHeight}px`;
            sheet.classList.add('collapsed');
            sheet.classList.remove('peek');
            sheet.classList.remove('expanded');
        } else if (currentHeight < (peekHeight + maxHeight) / 2) {
            // Peek
            sheet.style.height = `${peekHeight}px`;
            sheet.classList.remove('collapsed');
            sheet.classList.add('peek');
            sheet.classList.remove('expanded');
        } else {
            // Expand
            sheet.style.height = `${maxHeight}px`;
            sheet.classList.remove('collapsed');
            sheet.classList.remove('peek');
            sheet.classList.add('expanded');
        }
    });

    // Double tap to expand/collapse
    handle.addEventListener('dblclick', function () {
        if (sheet.classList.contains('expanded')) {
            // Collapse to peek
            sheet.style.height = `${peekHeight}px`;
            sheet.classList.remove('expanded');
            sheet.classList.add('peek');
        } else {
            // Expand
            sheet.style.height = `${maxHeight}px`;
            sheet.classList.remove('collapsed');
            sheet.classList.remove('peek');
            sheet.classList.add('expanded');
        }
    });
}

/**
 * Initialize swipe gestures for map interaction
 */
function initSwipeGestures() {
    const map = document.getElementById('map');
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    // Minimum distance for a swipe
    const minSwipeDistance = 50;

    map.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, false);

    map.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Determine if it's a horizontal or vertical swipe
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (Math.abs(deltaX) > minSwipeDistance) {
                const controlsSidebar = document.getElementById('controls-sidebar');
                if (controlsSidebar) {
                    if (deltaX > 0) {
                        // Right swipe - open sidebar if closed
                        if (!controlsSidebar.classList.contains('active')) {
                            controlsSidebar.classList.add('active');
                        }
                    } else {
                        // Left swipe - close sidebar if open
                        if (controlsSidebar.classList.contains('active')) {
                            controlsSidebar.classList.remove('active');
                        }
                    }
                }
            }
        } else {
            // Vertical swipe
            if (Math.abs(deltaY) > minSwipeDistance) {
                const bottomSheet = document.getElementById('mobile-bottom-sheet');
                if (bottomSheet) {
                    if (deltaY > 0) {
                        // Swipe up - expand bottom sheet
                        const maxHeight = window.innerHeight * 0.8;
                        bottomSheet.style.height = `${maxHeight}px`;
                        bottomSheet.classList.remove('collapsed');
                        bottomSheet.classList.remove('peek');
                        bottomSheet.classList.add('expanded');
                    } else {
                        // Swipe down - collapse bottom sheet
                        bottomSheet.style.height = '60px';
                        bottomSheet.classList.add('collapsed');
                        bottomSheet.classList.remove('peek');
                        bottomSheet.classList.remove('expanded');
                    }
                }
            }
        }
    }
}

/**
 * Create floating quick action buttons for common actions
 */
function createQuickActionButtons() {
    // Create container for quick action buttons
    const quickActions = document.createElement('div');
    quickActions.className = 'quick-action-buttons';

    // Define buttons to add
    const buttons = [
        { icon: 'fa-location-arrow', label: 'My Location', id: 'quick-locate-btn' },
        { icon: 'fa-layer-group', label: 'Map Layers', id: 'quick-layers-btn' },
        { icon: 'fa-directions', label: 'Directions', id: 'quick-directions-btn' }
    ];

    // Create buttons
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = 'quick-action-btn';
        button.id = btn.id;
        button.innerHTML = `<i class="fas ${btn.icon}"></i><span>${btn.label}</span>`;
        quickActions.appendChild(button);
    });

    // Add to document
    document.body.appendChild(quickActions);

    // Add event listeners
    document.getElementById('quick-locate-btn').addEventListener('click', function () {
        locateUser();
    });

    document.getElementById('quick-layers-btn').addEventListener('click', function () {
        // Toggle map layers panel
        const layersControl = document.querySelector('.map-layers-control');
        if (layersControl) {
            layersControl.classList.toggle('visible');
        }
    });

    document.getElementById('quick-directions-btn').addEventListener('click', function () {
        // Show directions panel
        const bottomSheet = document.getElementById('mobile-bottom-sheet');
        if (bottomSheet) {
            const peekHeight = 200;
            bottomSheet.style.height = `${peekHeight}px`;
            bottomSheet.classList.remove('collapsed');
            bottomSheet.classList.add('peek');
            bottomSheet.classList.remove('expanded');
        }
    });
}

/**
 * Enhance search with autocomplete functionality
 */
function enhanceSearchWithAutocomplete() {
    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear');

    if (!searchInput) return;

    // Create autocomplete container
    const autocompleteContainer = document.createElement('div');
    autocompleteContainer.className = 'autocomplete-container';
    autocompleteContainer.style.display = 'none';
    searchInput.parentNode.appendChild(autocompleteContainer);

    // Add event listeners
    searchInput.addEventListener('input', debounce(function () {
        const query = searchInput.value.trim();
        if (query.length < 3) {
            autocompleteContainer.style.display = 'none';
            return;
        }

        // Fetch autocomplete suggestions
        fetchAutocompleteSuggestions(query, autocompleteContainer);
    }, 300));

    // Clear button functionality
    if (searchClear) {
        searchClear.addEventListener('click', function () {
            searchInput.value = '';
            autocompleteContainer.style.display = 'none';
        });
    }

    // Close autocomplete when clicking outside
    document.addEventListener('click', function (e) {
        if (!searchInput.contains(e.target) && !autocompleteContainer.contains(e.target)) {
            autocompleteContainer.style.display = 'none';
        }
    });
}

/**
 * Fetch autocomplete suggestions from Nominatim API
 * @param {string} query - The search query
 * @param {HTMLElement} container - The container to display results
 */
function fetchAutocompleteSuggestions(query, container) {
    // Use Nominatim API for geocoding suggestions
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`)
        .then(response => response.json())
        .then(data => {
            // Clear previous results
            container.innerHTML = '';

            if (data.length === 0) {
                container.style.display = 'none';
                return;
            }

            // Create result items
            data.forEach(result => {
                const item = document.createElement('div');
                item.className = 'autocomplete-item';

                // Format display name
                const displayName = result.display_name;

                item.innerHTML = `
                    <i class="fas fa-map-marker-alt autocomplete-icon"></i>
                    <div class="autocomplete-text">
                        <div class="autocomplete-main">${displayName.split(',')[0]}</div>
                        <div class="autocomplete-secondary">${displayName.split(',').slice(1, 3).join(',')}</div>
                    </div>
                `;

                // Add click event
                item.addEventListener('click', function () {
                    const searchInput = document.getElementById('search-input');
                    searchInput.value = displayName;
                    container.style.display = 'none';

                    // Search for this location
                    searchLocation(result.lat, result.lon, displayName);
                });

                container.appendChild(item);
            });

            // Show container
            container.style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching autocomplete suggestions:', error);
            container.style.display = 'none';
        });
}

/**
 * Initialize pull-to-refresh functionality
 */
function initPullToRefresh() {
    const map = document.getElementById('map');
    let touchStartY = 0;
    let touchEndY = 0;
    let isPulling = false;
    let refreshIndicator = null;

    // Create refresh indicator
    function createRefreshIndicator() {
        refreshIndicator = document.createElement('div');
        refreshIndicator.className = 'pull-to-refresh-indicator';
        refreshIndicator.innerHTML = '<i class="fas fa-sync-alt"></i>';
        refreshIndicator.style.display = 'none';
        document.body.appendChild(refreshIndicator);
        return refreshIndicator;
    }

    refreshIndicator = createRefreshIndicator();

    map.addEventListener('touchstart', function (e) {
        // Only trigger when at top of map
        if (window.scrollY === 0) {
            touchStartY = e.touches[0].clientY;
            isPulling = true;
        }
    });

    map.addEventListener('touchmove', function (e) {
        if (!isPulling) return;

        touchEndY = e.touches[0].clientY;
        const pullDistance = touchEndY - touchStartY;

        // Show refresh indicator if pulling down
        if (pullDistance > 0 && pullDistance < 100) {
            refreshIndicator.style.display = 'flex';
            refreshIndicator.style.transform = `translateY(${pullDistance - 50}px) rotate(${pullDistance * 3}deg)`;
        }
    });

    map.addEventListener('touchend', function () {
        if (!isPulling) return;

        const pullDistance = touchEndY - touchStartY;

        // If pulled enough, refresh the map
        if (pullDistance > 60) {
            refreshIndicator.classList.add('refreshing');
            refreshMap();
        } else {
            // Hide indicator if not pulled enough
            refreshIndicator.style.display = 'none';
        }

        isPulling = false;
    });

    function refreshMap() {
        // Simulate refreshing the map data
        setTimeout(function () {
            // Reset the indicator
            refreshIndicator.classList.remove('refreshing');
            refreshIndicator.style.display = 'none';

            // Show toast notification
            showToast('Map refreshed', 'success');

            // Refresh user location if available
            if (typeof locateUser === 'function') {
                locateUser();
            }
        }, 1000);
    }
}

/**
 * Fix mobile toggle functionality
 * This function ensures the mobile menu toggle works correctly
 */
function fixMobileToggle() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const controlsSidebar = document.getElementById('controls-sidebar');
    const closeSidebar = document.getElementById('close-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (!mobileToggle || !controlsSidebar) return;

    // Remove any existing event listeners to prevent conflicts
    const newMobileToggle = mobileToggle.cloneNode(true);
    mobileToggle.parentNode.replaceChild(newMobileToggle, mobileToggle);

    // Add event listener to the mobile toggle button
    newMobileToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();

        // Toggle the sidebar
        controlsSidebar.classList.toggle('active');

        // Show/hide the overlay
        if (sidebarOverlay) {
            sidebarOverlay.style.display = controlsSidebar.classList.contains('active') ? 'block' : 'none';
        }

        // Add haptic feedback if available
        if ('vibrate' in navigator) {
            navigator.vibrate(20);
        }
    });

    // Make sure the close button works
    if (closeSidebar) {
        closeSidebar.addEventListener('click', function () {
            controlsSidebar.classList.remove('active');
            if (sidebarOverlay) {
                sidebarOverlay.style.display = 'none';
            }
        });
    }

    // Close sidebar when clicking on overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function () {
            controlsSidebar.classList.remove('active');
            sidebarOverlay.style.display = 'none';
        });
    }
}

/**
 * Initialize haptic feedback for buttons
 */
function initHapticFeedback() {
    // Add haptic feedback to all buttons
    const buttons = document.querySelectorAll('button');

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            // Check if vibration API is supported
            if ('vibrate' in navigator) {
                navigator.vibrate(20); // Short vibration
            }
        });
    });
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast (success, error, info, warning)
 */
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(toast => toast.remove());

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type} slide-in`;

    // Set icon based on type
    let icon = 'info-circle';
    switch (type) {
        case 'success': icon = 'check-circle'; break;
        case 'error': icon = 'exclamation-circle'; break;
        case 'warning': icon = 'exclamation-triangle'; break;
    }

    toast.innerHTML = `
        <div class="toast-icon"><i class="fas fa-${icon}"></i></div>
        <div class="toast-message">${message}</div>
    `;

    // Add to document
    document.body.appendChild(toast);

    // Remove after delay
    setTimeout(() => {
        toast.classList.remove('slide-in');
        toast.classList.add('slide-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce delay in milliseconds
 * @returns {Function} - The debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

/**
 * Initialize floating action buttons
 */
function initFloatingActionButtons() {
    const locateFab = document.getElementById('locate-fab');
    const layersFab = document.getElementById('layers-fab');

    if (locateFab) {
        locateFab.addEventListener('click', function () {
            // Add loading state
            locateFab.classList.add('loading');
            locateFab.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

            // Call locate function
            if (typeof locateUser === 'function') {
                locateUser();
            }

            // Reset button after 2 seconds
            setTimeout(() => {
                locateFab.classList.remove('loading');
                locateFab.innerHTML = '<i class="fas fa-location-arrow"></i>';
            }, 2000);

            // Add haptic feedback
            if ('vibrate' in navigator) {
                navigator.vibrate(10);
            }
        });
    }

    if (layersFab) {
        layersFab.addEventListener('click', function () {
            // Toggle map layers control
            const layersControl = document.querySelector('.map-layers-control');
            if (layersControl) {
                layersControl.classList.toggle('visible');
            }

            // Add haptic feedback
            if ('vibrate' in navigator) {
                navigator.vibrate(10);
            }
        });
    }
}

/**
 * Enhance modern search with better UX
 */
function enhanceModernSearch() {
    const searchInput = document.getElementById('search-input');
    const searchCard = document.querySelector('.search-card');
    const clearBtn = document.querySelector('.search-clear-btn');

    if (searchInput) {
        // Add focus effects
        searchInput.addEventListener('focus', function () {
            searchCard.style.transform = 'translateY(-2px)';
            searchCard.style.boxShadow = 'var(--shadow-xl)';
        });

        searchInput.addEventListener('blur', function () {
            searchCard.style.transform = 'translateY(0)';
            searchCard.style.boxShadow = 'var(--shadow-lg)';
        });

        // Show/hide clear button
        searchInput.addEventListener('input', function () {
            if (clearBtn) {
                clearBtn.style.opacity = this.value ? '1' : '0';
                clearBtn.style.pointerEvents = this.value ? 'auto' : 'none';
            }
        });

        // Clear functionality
        if (clearBtn) {
            clearBtn.addEventListener('click', function () {
                searchInput.value = '';
                clearBtn.style.opacity = '0';
                clearBtn.style.pointerEvents = 'none';
                searchInput.focus();

                // Remove search marker if exists
                if (typeof searchMarker !== 'undefined' && searchMarker) {
                    map.removeLayer(searchMarker);
                    searchMarker = null;
                }
            });
        }
    }
}

/**
 * Add smooth scroll effects and performance optimizations
 */
function addSmoothScrollEffects() {
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe section cards
    const sectionCards = document.querySelectorAll('.section-card');
    sectionCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Add scroll-based header effects
    let lastScrollY = window.scrollY;
    const searchContainer = document.querySelector('.modern-search-container');

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (searchContainer) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down
                searchContainer.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                searchContainer.style.transform = 'translateY(0)';
            }
        }

        lastScrollY = currentScrollY;
    }, { passive: true });
}

// Add keyboard shortcuts
document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }

    // Escape to close sidebar
    if (e.key === 'Escape') {
        const sidebar = document.getElementById('controls-sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (sidebar && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        }
    }
});

// Add touch gestures for better mobile experience
if ('ontouchstart' in window) {
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', function (e) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        // Swipe detection
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > 50) {
                const sidebar = document.getElementById('controls-sidebar');
                const overlay = document.getElementById('sidebar-overlay');

                if (diffX > 0) {
                    // Swipe left - close sidebar
                    if (sidebar && sidebar.classList.contains('active')) {
                        sidebar.classList.remove('active');
                        if (overlay) overlay.classList.remove('active');
                    }
                } else {
                    // Swipe right - open sidebar (only if at edge)
                    if (touchStartX < 20 && sidebar && !sidebar.classList.contains('active')) {
                        sidebar.classList.add('active');
                        if (overlay) overlay.classList.add('active');
                    }
                }
            }
        }
    });
}