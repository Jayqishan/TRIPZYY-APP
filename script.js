// Enhanced Travel Planner JavaScript - TRIPZYY Updates

// Global Variables
let currentTripData = {};
let mapInstance = null;
let markers = [];
let currentPhotos = [];

// Enhanced predefined data for better user experience
const DESTINATIONS = {
    domestic: [
        'Goa', 'Manali', 'Udaipur', 'Jaipur', 'Kerala', 'Shimla', 'Darjeeling', 
        'Rishikesh', 'Agra', 'Varanasi', 'Mumbai', 'Delhi', 'Bangalore', 'Mysore',
        'Hampi', 'Ooty', 'Munnar', 'Ladakh', 'Andaman', 'Rajasthan'
    ],
    international: [
        'Paris', 'London', 'Tokyo', 'New York', 'Dubai', 'Thailand', 'Singapore', 
        'Bali', 'Rome', 'Barcelona', 'Amsterdam', 'Sydney', 'Hong Kong', 'Seoul',
        'Switzerland', 'Norway', 'Iceland', 'Greece', 'Turkey', 'Malaysia'
    ]
};

// NEW: Destination recommendations based on budget and people
const DESTINATION_RECOMMENDATIONS = {
    domestic: {
        budget: {
            1: { min: 5000, max: 15000, destinations: ['Rishikesh', 'Hampi', 'Darjeeling', 'Ooty'] },
            2: { min: 12000, max: 25000, destinations: ['Goa', 'Manali', 'Shimla', 'Kerala'] },
            3: { min: 20000, max: 35000, destinations: ['Rajasthan', 'Agra', 'Varanasi', 'Mumbai'] },
            4: { min: 30000, max: 50000, destinations: ['Udaipur', 'Jaipur', 'Ladakh', 'Andaman'] },
            5: { min: 40000, max: 65000, destinations: ['Kerala', 'Goa', 'Rajasthan', 'Bangalore'] }
        }
    },
    international: {
        budget: {
            1: { min: 40000, max: 80000, destinations: ['Thailand', 'Malaysia', 'Singapore', 'Bali'] },
            2: { min: 80000, max: 150000, destinations: ['Dubai', 'Hong Kong', 'Seoul', 'Tokyo'] },
            3: { min: 120000, max: 220000, destinations: ['Paris', 'London', 'Rome', 'Barcelona'] },
            4: { min: 160000, max: 300000, destinations: ['Switzerland', 'Norway', 'Iceland', 'Australia'] },
            5: { min: 200000, max: 400000, destinations: ['New York', 'Greece', 'Turkey', 'Amsterdam'] }
        }
    }
};

// Budget breakdown remains the same but simplified (removed budget category dependency)
const BUDGET_BREAKDOWN = {
    accommodation: 35,
    food: 25,
    transport: 20,
    activities: 15,
    shopping: 5
};

// Detailed budget breakdown for each category
const DETAILED_EXPENSES = {
    accommodation: {
        'Budget Hotels/Hostels': 0.4,
        'Mid-range Hotels': 0.35,
        'Service Charges & Tips': 0.15,
        'Booking Platform Fees': 0.1
    },
    food: {
        'Local Restaurants': 0.5,
        'Street Food & Snacks': 0.2,
        'Fine Dining': 0.2,
        'Beverages & Drinks': 0.1
    },
    transport: {
        'Flight/Train Tickets': 0.6,
        'Local Transport': 0.25,
        'Taxi/Auto Fares': 0.15
    },
    activities: {
        'Sightseeing Tours': 0.4,
        'Adventure Activities': 0.3,
        'Museum/Monument Entries': 0.2,
        'Entertainment': 0.1
    },
    shopping: {
        'Local Handicrafts': 0.4,
        'Clothing & Accessories': 0.35,
        'Souvenirs': 0.25
    }
};

// Enhanced Travel Tips with Local Info (same as before)
const ENHANCED_TRAVEL_TIPS = {
    'goa': {
        localFood: [
            'Fish Curry Rice - Authentic Goan staple',
            'Bebinca - Traditional layered dessert', 
            'Chorizo Pao - Spicy sausage bread',
            'Solkadhi - Refreshing coconut drink'
        ],
        safetyTips: [
            'Avoid isolated beaches after sunset',
            'Don\'t drink tap water, use bottled water',
            'Beware of overcharging by taxi drivers',
            'Keep valuables safe on crowded beaches'
        ],
        bestTime: 'November to March - Cool and dry weather, perfect for beaches and sightseeing.',
        budgetFriendly: [
            'Visit free beaches like Arambol and Vagator',
            'Use local buses instead of taxis',
            'Eat at beach shacks for authentic food',
            'Stay in hostels or guesthouses',
            'Rent a scooter for local transport'
        ],
        avoid: [
            'Expensive beach clubs in South Goa',
            'Tourist trap restaurants near hotels',
            'Overpriced water sports at popular beaches',
            'Shopping at airport or hotel stores'
        ]
    },
    'manali': {
        localFood: [
            'Dham - Traditional Himachali feast',
            'Siddu - Steamed wheat bread with ghee',
            'Momos - Tibetan dumplings',
            'Trout Fish - Fresh mountain fish'
        ],
        safetyTips: [
            'Carry warm clothes even in summer',
            'Be cautious on mountain roads',
            'Check weather before trekking',
            'Stay hydrated at high altitude'
        ],
        bestTime: 'March to June for pleasant weather, December to February for snow activities.',
        budgetFriendly: [
            'Trek to free viewpoints like Jogini Falls',
            'Use local buses for Rohtang Pass',
            'Stay in Old Manali for cheaper options',
            'Visit Hadimba Temple (free entry)',
            'Explore local markets for souvenirs'
        ],
        avoid: [
            'Peak season hotel rates (May-June)',
            'Expensive adventure sports packages',
            'Tourist taxi services',
            'Restaurants on Mall Road'
        ]
    },
    'paris': {
        localFood: [
            'Croissants - Best from local boulangeries',
            'Escargot - Traditional snails dish',
            'Macarons - Colorful French cookies',
            'Wine and Cheese - Classic French pairing'
        ],
        safetyTips: [
            'Watch for pickpockets in tourist areas',
            'Keep emergency numbers handy',
            'Use licensed taxis or public transport',
            'Stay aware in crowded metro stations'
        ],
        bestTime: 'April to June and September to November - Mild weather and fewer crowds.',
        budgetFriendly: [
            'Visit free museums on first Sunday',
            'Use public transport with weekly passes',
            'Picnic in parks with local food',
            'Walk along Seine river',
            'Visit free attractions like Sacré-Cœur'
        ],
        avoid: [
            'Tourist restaurants near Eiffel Tower',
            'Expensive Seine river dinner cruises',
            'Shopping on Champs-Élysées',
            'Hotel breakfast (expensive)'
        ]
    }
};

// Hotel recommendations data (same as before)
const HOTEL_RECOMMENDATIONS = {
    'goa': [
        {
            name: 'Beach Paradise Resort',
            rating: 4.2,
            price: 3500,
            distance: '2 km from Baga Beach',
            amenities: ['Free WiFi', 'Pool', 'Restaurant', 'AC'],
            description: 'Comfortable beachside resort with great amenities.',
            image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
            name: 'Backpacker\'s Haven Hostel',
            rating: 4.0,
            price: 800,
            distance: '1.5 km from Calangute Beach',
            amenities: ['Free WiFi', 'Common Kitchen', 'Lockers'],
            description: 'Budget-friendly hostel perfect for backpackers.',
            image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400'
        }
    ],
    'manali': [
        {
            name: 'Mountain View Hotel',
            rating: 4.3,
            price: 4000,
            distance: '3 km from Mall Road',
            amenities: ['Heating', 'Mountain View', 'Restaurant', 'Parking'],
            description: 'Cozy hotel with stunning mountain views.',
            image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
            name: 'Old Manali Guesthouse',
            rating: 3.8,
            price: 1500,
            distance: '500m from Old Manali Market',
            amenities: ['Free WiFi', 'Garden', 'Fireplace'],
            description: 'Traditional guesthouse in the heart of Old Manali.',
            image: 'https://images.pexels.com/photos/775219/pexels-photo-775219.jpeg?auto=compress&cs=tinysrgb&w=400'
        }
    ]
};

// API Keys
const WEATHER_API_KEY = "9a4acb8d47cf4c86a5943744250604";
const PIXABAY_API_KEY = "49779190-56ac3b8e27bb9397dd241c851";

// UPDATED: Groq AI API Key (using provided key)
const GROQ_API_KEY = "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";

// DOM Elements
const form = document.getElementById('plannerForm');
const loadingSection = document.getElementById('loading');
const resultsSection = document.getElementById('results');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const toast = document.getElementById('toast');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    form.addEventListener('submit', handleFormSubmit);
    
    // Enhanced form animations
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (this.parentElement) {
                this.parentElement.style.transform = 'translateY(-2px)';
                this.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }
        });
        
        input.addEventListener('blur', function() {
            if (this.parentElement) {
                this.parentElement.style.transform = 'translateY(0)';
                this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }
        });
    });

    // NEW: People count input handler with recommendations
    const peopleInput = document.getElementById('people');
    const budgetInput = document.getElementById('budget');
    
    if (peopleInput && budgetInput) {
        peopleInput.addEventListener('input', updatePeopleRecommendation);
        budgetInput.addEventListener('input', updatePeopleRecommendation);
    }

    // Date validation for travel calendar
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    if (startDateInput && endDateInput) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        startDateInput.min = today;
        endDateInput.min = today;
        
        startDateInput.addEventListener('change', function() {
            endDateInput.min = this.value;
            calculateTripDuration();
        });
        
        endDateInput.addEventListener('change', function() {
            calculateTripDuration();
        });
    }

    // Initialize dark mode preference
    if (window.darkMode) {
        document.body.classList.add('dark');
        const modeIcon = document.getElementById('mode-icon');
        if (modeIcon) modeIcon.textContent = '☀';
    }
});

// NEW: Update people recommendation based on budget and people count
function updatePeopleRecommendation() {
    const peopleInput = document.getElementById('people');
    const budgetInput = document.getElementById('budget');
    const recommendationEl = document.getElementById('people-recommendation');
    
    if (!peopleInput || !budgetInput || !recommendationEl) return;
    
    const people = parseInt(peopleInput.value);
    const budget = parseInt(budgetInput.value);
    
    if (people && budget && people >= 1 && people <= 10) {
        const perPersonBudget = Math.floor(budget / people);
        const recommendations = getDestinationRecommendations(budget, people);
        
        if (recommendations.length > 0) {
            recommendationEl.innerHTML = `
                <strong>Perfect! </strong>With ₹${budget.toLocaleString()} for ${people} ${people === 1 ? 'person' : 'people'} (₹${perPersonBudget.toLocaleString()}/person), you can visit: 
                <br><strong>${recommendations.join(', ')}</strong>
            `;
            recommendationEl.classList.add('show');
        } else {
            recommendationEl.innerHTML = `
                <strong>Budget Tip: </strong>₹${perPersonBudget.toLocaleString()}/person. Consider adjusting your budget for better destination options!
            `;
            recommendationEl.classList.add('show');
        }
    } else {
        recommendationEl.classList.remove('show');
    }
}

// NEW: Get destination recommendations based on budget and people
function getDestinationRecommendations(totalBudget, people) {
    const perPersonBudget = Math.floor(totalBudget / people);
    const recommendations = [];
    
    // Check domestic destinations
    const domesticRanges = DESTINATION_RECOMMENDATIONS.domestic.budget;
    for (let personCount in domesticRanges) {
        const range = domesticRanges[personCount];
        if (people <= parseInt(personCount) && perPersonBudget >= range.min && perPersonBudget <= range.max) {
            recommendations.push(...range.destinations);
            break;
        }
    }
    
    // Check international destinations if budget is higher
    if (perPersonBudget >= 40000) {
        const internationalRanges = DESTINATION_RECOMMENDATIONS.international.budget;
        for (let personCount in internationalRanges) {
            const range = internationalRanges[personCount];
            if (people <= parseInt(personCount) && perPersonBudget >= range.min && perPersonBudget <= range.max) {
                recommendations.push(...range.destinations);
                break;
            }
        }
    }
    
    // Remove duplicates and return first 4 recommendations
    return [...new Set(recommendations)].slice(0, 4);
}

// Calculate trip duration automatically
function calculateTripDuration() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const daysInput = document.getElementById('days');
    
    if (startDate && endDate && daysInput) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDiff = end - start;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
        
        if (daysDiff > 0) {
            daysInput.value = daysDiff;
            showToast(`📅 Trip duration auto-calculated: ${daysDiff} days`);
        }
    }
}

// Enhanced Form Submission Handler (removed travelType and budgetCategory)
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const tripData = {
        budget: parseInt(formData.get('budget')),
        days: parseInt(formData.get('days')),
        destination: formData.get('destination').trim(),
        people: parseInt(formData.get('people')),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate')
    };

    // Auto-detect travel type based on destination
    const allDomestic = [...DESTINATIONS.domestic];
    const allInternational = [...DESTINATIONS.international];
    
    const isDomestic = allDomestic.some(dest => 
        tripData.destination.toLowerCase().includes(dest.toLowerCase())
    );
    const isInternational = allInternational.some(dest => 
        tripData.destination.toLowerCase().includes(dest.toLowerCase())
    );
    
    if (isDomestic) {
        tripData.travelType = 'domestic';
    } else if (isInternational) {
        tripData.travelType = 'international';
    } else {
        // Default to domestic for unknown destinations
        tripData.travelType = 'domestic';
    }

    currentTripData = tripData;
    
    showLoading();
    
    try {
        await generateTravelPlan(tripData);
        showResults();
    } catch (error) {
        console.error('Error generating travel plan:', error);
        showToast('❌ Error generating travel plan. Please try again!');
        hideLoading();
    }
}

// Show Loading State
function showLoading() {
    const travelFormEl = document.getElementById('travel-form');
    if (travelFormEl) travelFormEl.style.display = 'none';
    if (loadingSection) {
        loadingSection.classList.remove('loading-hidden');
        loadingSection.style.display = 'block';
    }
    if (resultsSection) resultsSection.classList.add('results-hidden');
}

// Hide Loading State
function hideLoading() {
    if (loadingSection) loadingSection.classList.add('loading-hidden');
    setTimeout(() => {
        if (loadingSection) loadingSection.style.display = 'none';
    }, 300);
}

// Show Results
function showResults() {
    hideLoading();
    if (resultsSection) {
        resultsSection.classList.remove('results-hidden');
        resultsSection.style.display = 'block';
        // Smooth scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Enhanced Generate Travel Plan (updated for removed fields)
async function generateTravelPlan(tripData) {
    const { budget, days, destination, people, travelType, startDate, endDate } = tripData;
    
    // Update destination header
    updateDestinationHeader(destination, people);
    
    // Load destination image and photos
    await loadDestinationImage(destination);
    await loadDestinationPhotos(destination);
    
    // Show season information if dates are selected
    if (startDate && endDate) {
        showSeasonInformation(destination, startDate, endDate);
    }
    
    // Generate budget breakdown (simplified)
    generateBudgetBreakdown(budget, days, people);
    
    // Load hotel recommendations
    await loadHotelRecommendations(destination, people);
    
    // Load enhanced weather data with forecast
    await loadEnhancedWeatherData(destination);
    
    // Load tourist attractions directly (no load button)
    await loadTouristAttractions(destination);
    
    // Initialize simplified map
    await initializeSimplifiedMap(destination);
    
    // Generate enhanced travel tips
    generateEnhancedTravelTips(destination.toLowerCase(), travelType);
}

// Update Destination Header (updated for people count)
function updateDestinationHeader(destination, people) {
    const destNameEl = document.getElementById('destination-name');
    const destTypeEl = document.getElementById('destination-type');
    if (destNameEl) destNameEl.textContent = destination;
    if (destTypeEl) destTypeEl.textContent = `Perfect for ${people} ${people === 1 ? 'Traveler' : 'Travelers'}`;
}

// Load Destination Image (same as before)
async function loadDestinationImage(destination) {
    const img = document.getElementById("destination-photo"); 
    if (!img) return;
    
    const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(destination)}&image_type=photo&orientation=horizontal&per_page=5&safesearch=true`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch Pixabay API");

        const data = await response.json();

        if (data.hits && data.hits.length > 0) {
            const bestImage = data.hits.find(hit => hit.largeImageURL) || data.hits[0];
            img.src = bestImage.largeImageURL || bestImage.webformatURL;
            img.alt = `Beautiful view of ${destination}`;
        } else {
            img.src = `https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=800`;
            img.alt = `Beautiful view of ${destination}`;
        }

    } catch (error) {
        console.error("Error loading Pixabay image:", error);
        img.src = `https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=800`;
        img.alt = `Beautiful view of ${destination}`;
    }
}

// Load destination photos for gallery (same as before)
async function loadDestinationPhotos(destination) {
    try {
        const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(destination + ' travel')}&image_type=photo&per_page=20&safesearch=true`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error("Failed to fetch photos");
        
        const data = await response.json();
        
        if (data.hits && data.hits.length > 0) {
            currentPhotos = data.hits.map(hit => ({
                url: hit.largeImageURL || hit.webformatURL,
                thumb: hit.previewURL,
                tags: hit.tags
            }));
        } else {
            currentPhotos = generateFallbackPhotos(destination);
        }
    } catch (error) {
        console.error("Error loading destination photos:", error);
        currentPhotos = generateFallbackPhotos(destination);
    }
}

// Generate fallback photos (same as before)
function generateFallbackPhotos(destination) {
    const categories = ['landscape', 'architecture', 'culture', 'food', 'nature', 'sunset'];
    return categories.map(category => ({
        url: `https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=600`,
        thumb: `https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=300`,
        tags: `${destination} ${category}`
    }));
}

// Open photo gallery (same as before)
function openPhotoGallery() {
    const modal = document.getElementById('photo-gallery-modal');
    const title = document.getElementById('photo-gallery-title');
    const grid = document.getElementById('photo-gallery-grid');
    
    if (!modal || !title || !grid) return;
    
    title.textContent = `${currentTripData.destination} - Photo Gallery`;
    
    grid.innerHTML = currentPhotos.map((photo, index) => `
        <div class="gallery-photo" onclick="openPhotoViewer('${photo.url}')">
            <img src="${photo.thumb}" alt="${photo.tags}" loading="lazy">
        </div>
    `).join('');
    
    modal.classList.remove('photo-modal-hidden');
}

// Close photo gallery (same as before)
function closePhotoGallery() {
    const modal = document.getElementById('photo-gallery-modal');
    if (modal) {
        modal.classList.add('photo-modal-hidden');
    }
}

// Open photo viewer (same as before)
function openPhotoViewer(url) {
    window.open(url, '_blank');
}

// Show season information based on travel dates (same as before)
function showSeasonInformation(destination, startDate, endDate) {
    const seasonCard = document.getElementById('season-info-card');
    const seasonInfo = document.getElementById('season-info');
    
    if (!seasonCard || !seasonInfo) return;
    
    const start = new Date(startDate);
    const month = start.getMonth() + 1; // JavaScript months are 0-indexed
    
    let seasonData = getSeasonData(destination.toLowerCase(), month);
    
    seasonInfo.innerHTML = `
        <div class="season-info-content">
            <div class="season-main">
                <div class="season-icon">${seasonData.icon}</div>
                <div class="season-details">
                    <h4>${seasonData.season} Season</h4>
                    <p class="season-description">${seasonData.description}</p>
                    <div class="season-recommendation ${seasonData.recommendation.type}">
                        <strong>${seasonData.recommendation.text}</strong>
                    </div>
                </div>
            </div>
            <div class="season-stats">
                <div class="season-stat">
                    <span class="stat-label">Average Temp</span>
                    <span class="stat-value">${seasonData.temperature}</span>
                </div>
                <div class="season-stat">
                    <span class="stat-label">Crowd Level</span>
                    <span class="stat-value">${seasonData.crowdLevel}</span>
                </div>
                <div class="season-stat">
                    <span class="stat-label">Price Level</span>
                    <span class="stat-value">${seasonData.priceLevel}</span>
                </div>
            </div>
        </div>
    `;
    
    seasonCard.style.display = 'block';
}

// Get season data based on destination and month (same as before)
function getSeasonData(destination, month) {
    // Default season data
    let seasonData = {
        season: 'Pleasant',
        icon: '🌤',
        description: 'Good weather conditions for travel',
        temperature: '20-25°C',
        crowdLevel: 'Medium',
        priceLevel: 'Moderate',
        recommendation: {
            type: 'good',
            text: 'Good time to visit!'
        }
    };
    
    // Customize based on destination and month
    if (destination.includes('goa') || destination.includes('kerala')) {
        if (month >= 11 || month <= 3) {
            seasonData = {
                season: 'Peak',
                icon: '☀️',
                description: 'Perfect weather - cool and dry, ideal for beaches',
                temperature: '20-30°C',
                crowdLevel: 'High',
                priceLevel: 'Expensive',
                recommendation: {
                    type: 'excellent',
                    text: 'Excellent time to visit! Book early.'
                }
            };
        } else if (month >= 6 && month <= 9) {
            seasonData = {
                season: 'Monsoon',
                icon: '🌧',
                description: 'Heavy rains, but lush green landscapes',
                temperature: '24-28°C',
                crowdLevel: 'Low',
                priceLevel: 'Budget',
                recommendation: {
                    type: 'caution',
                    text: 'Caution: Heavy rains expected'
                }
            };
        }
    } else if (destination.includes('manali') || destination.includes('shimla')) {
        if (month >= 3 && month <= 6) {
            seasonData = {
                season: 'Peak',
                icon: '🌸',
                description: 'Pleasant weather, perfect for sightseeing',
                temperature: '15-25°C',
                crowdLevel: 'High',
                priceLevel: 'Expensive',
                recommendation: {
                    type: 'excellent',
                    text: 'Perfect time for mountain visits!'
                }
            };
        } else if (month >= 12 || month <= 2) {
            seasonData = {
                season: 'Winter',
                icon: '❄️',
                description: 'Cold with possible snowfall',
                temperature: '-5 to 10°C',
                crowdLevel: 'Medium',
                priceLevel: 'Moderate',
                recommendation: {
                    type: 'good',
                    text: 'Great for snow activities!'
                }
            };
        }
    }
    
    return seasonData;
}

// Generate Budget Breakdown (updated to remove budget category)
function generateBudgetBreakdown(budget, days, people) {
    const breakdown = BUDGET_BREAKDOWN;
    const budgetGrid = document.getElementById('budget-breakdown');
    
    // Calculate per person budget
    const perPersonBudget = Math.floor(budget / people);
    
    const categories = [
        { key: 'accommodation', icon: '🏨', name: 'Accommodation' },
        { key: 'food', icon: '🍽', name: 'Food & Dining' },
        { key: 'transport', icon: '🚗', name: 'Transportation' },
        { key: 'activities', icon: '🎯', name: 'Activities' },
        { key: 'shopping', icon: '🛍', name: 'Shopping' }
    ];
    
    budgetGrid.innerHTML = categories.map(category => {
        const amount = Math.round((budget * breakdown[category.key]) / 100);
        const dailyAmount = Math.round(amount / days);
        const perPersonAmount = Math.round(amount / people);
        
        return `
            <div class="budget-item" onclick="showBudgetDetails('${category.key}', ${amount}, '${category.name}')">
                <div class="budget-category">${category.icon} ${category.name}</div>
                <div class="budget-amount">₹${amount.toLocaleString()}</div>
                <div class="budget-percentage">${breakdown[category.key]}% • ₹${dailyAmount}/day • ₹${perPersonAmount}/person</div>
            </div>
        `;
    }).join('');
}

// Show Budget Details Modal (same as before)
function showBudgetDetails(category, totalAmount, categoryName) {
    const modal = document.getElementById('budget-modal');
    const title = document.getElementById('modal-category-title');
    const content = document.getElementById('modal-category-content');
    
    if (!modal || !title || !content) return;
    
    title.textContent = `${categoryName} - Detailed Breakdown`;
    
    const expenses = DETAILED_EXPENSES[category];
    content.innerHTML = Object.entries(expenses).map(([expenseName, percentage]) => {
        const amount = Math.round(totalAmount * percentage);
        return `
            <div class="expense-item">
                <div class="expense-name">${expenseName}</div>
                <div class="expense-amount">₹${amount.toLocaleString()}</div>
            </div>
        `;
    }).join('');
    
    modal.classList.remove('budget-modal-hidden');
}

// Close Budget Modal (same as before)
function closeBudgetModal() {
    const modal = document.getElementById('budget-modal');
    if (modal) {
        modal.classList.add('budget-modal-hidden');
    }
}

// Load hotel recommendations (updated for people count)
async function loadHotelRecommendations(destination, people) {
    const hotelsGrid = document.getElementById('hotels-grid');
    if (!hotelsGrid) return;
    
    // Show loading state
    hotelsGrid.innerHTML = Array(3).fill(0).map(() => `
        <div class="hotel-card">
            <div style="height: 180px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center;">
                <div class="loading-spinner" style="width: 30px; height: 30px;"></div>
            </div>
            <div class="hotel-info">
                <div style="height: 20px; background: rgba(255,255,255,0.1); margin-bottom: 8px; border-radius: 4px;"></div>
                <div style="height: 40px; background: rgba(255,255,255,0.05); border-radius: 4px;"></div>
            </div>
        </div>
    `).join('');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const hotels = getHotelsForDestination(destination.toLowerCase(), people);
    
    hotelsGrid.innerHTML = hotels.map(hotel => `
        <div class="hotel-card" onclick="window.open('https://www.google.com/search?q=${encodeURIComponent(hotel.name + ' ' + destination + ' booking')}', '_blank')">
            <img src="${hotel.image}" alt="${hotel.name}" class="hotel-image" loading="lazy"
                 onerror="this.onerror=null; this.src='https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400';">
            <div class="hotel-info">
                <div class="hotel-header">
                    <div>
                        <h4 class="hotel-name">${hotel.name}</h4>
                        <div class="hotel-rating">
                            ${'⭐'.repeat(Math.floor(hotel.rating))} ${hotel.rating}
                        </div>
                    </div>
                    <div class="hotel-price">
                        ₹${hotel.price.toLocaleString()}
                        <div class="hotel-price-label">per night</div>
                    </div>
                </div>
                <p class="hotel-distance">📍 ${hotel.distance}</p>
                <div class="hotel-amenities">
                    ${hotel.amenities.map(amenity => `<span class="hotel-amenity">${amenity}</span>`).join('')}
                </div>
                <p class="hotel-description">${hotel.description} Perfect for ${people} ${people === 1 ? 'person' : 'people'}.</p>
            </div>
        </div>
    `).join('');
}

// Get hotels for destination (updated for people count)
function getHotelsForDestination(destination, people) {
    const hotels = HOTEL_RECOMMENDATIONS[destination] || generateGenericHotels(destination, people);
    
    // Filter hotels based on people count and adjust prices
    return hotels.map(hotel => ({
        ...hotel,
        price: hotel.price * (people > 2 ? 1.2 : 1), // Increase price for larger groups
        description: hotel.description
    })).slice(0, 3);
}

// Generate generic hotels (updated for people count)
function generateGenericHotels(destination, people) {
    const basePrices = [2000, 3500, 5000];
    const priceMultiplier = people > 2 ? 1.3 : 1;
    
    return [
        {
            name: `${destination} Central Hotel`,
            rating: 4.1,
            price: Math.round(basePrices[0] * priceMultiplier),
            distance: '2 km from city center',
            amenities: ['Free WiFi', 'Restaurant', 'AC', 'Parking'],
            description: 'Comfortable hotel with modern amenities in the heart of the city.',
            image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
            name: `${destination} Heritage Resort`,
            rating: 4.3,
            price: Math.round(basePrices[1] * priceMultiplier),
            distance: '1.5 km from main attractions',
            amenities: ['Pool', 'Spa', 'Room Service', 'Garden'],
            description: 'Beautiful resort offering a blend of tradition and luxury.',
            image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
            name: `Backpacker's ${destination}`,
            rating: 3.9,
            price: Math.round(basePrices[2] * priceMultiplier),
            distance: '500m from transport hub',
            amenities: ['Free WiFi', 'Common Kitchen', 'Lockers', 'Terrace'],
            description: 'Budget-friendly accommodation perfect for travelers.',
            image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400'
        }
    ];
}

// Enhanced Weather Data with 3-day Forecast (same as before)
async function loadEnhancedWeatherData(destination) {
    const weatherContainer = document.getElementById('weather-info');
    if (!weatherContainer) return;
    
    weatherContainer.innerHTML = `
        <div class="weather-loading">
            <div class="loading-spinner" style="width: 32px; height: 32px;"></div>
            <span>Loading weather forecast...</span>
        </div>
    `;

    try {
        // Get current weather and forecast
        const currentUrl = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(destination)}&aqi=yes`;
        const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(destination)}&days=4&aqi=no&alerts=no`;
        
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ]);
        
        if (!currentResponse.ok || !forecastResponse.ok) throw new Error('Weather API error');
        
        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        weatherContainer.innerHTML = `
            <div class="weather-current">
                <img src="${currentData.current.condition.icon}" alt="${currentData.current.condition.text}" class="weather-icon-large">
                <div>
                    <h4>${currentData.location.name}, ${currentData.location.country}</h4>
                    <p style="font-size: 1.1rem; margin: 8px 0;">${currentData.current.condition.text}</p>
                    <p style="font-size: 1.5rem; font-weight: bold; margin: 8px 0;">${currentData.current.temp_c}°C</p>
                    <p>💧 Humidity: ${currentData.current.humidity}% | 🌬 Wind: ${currentData.current.wind_kph} km/h</p>
                    <p>🌅 Local Time: ${currentData.location.localtime}</p>
                </div>
            </div>
            <div class="weather-forecast">
                ${forecastData.forecast.forecastday.slice(1, 4).map(day => `
                    <div class="forecast-day">
                        <div class="forecast-date">${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                        <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" class="forecast-icon">
                        <div class="forecast-temps">
                            <span class="forecast-high">${Math.round(day.day.maxtemp_c)}°</span>
                            <span class="forecast-low">${Math.round(day.day.mintemp_c)}°</span>
                        </div>
                        <div style="font-size: 0.8rem; opacity: 0.8; margin-top: 4px;">${day.day.condition.text}</div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        weatherContainer.innerHTML = `
            <div class="weather-error">
                <span>⚠ Unable to load weather data for ${destination}. Please try again later.</span>
            </div>
        `;
        console.error('Weather API error:', error);
    }
}

// Load Tourist Attractions directly (removed load button)
async function loadTouristAttractions(destination) {
    const attractionsGrid = document.getElementById('attractions-grid');
    if (!attractionsGrid) return;
    
    // Show loading state
    attractionsGrid.innerHTML = Array(4).fill(0).map(() => `
        <div class="attraction-card">
            <div style="height: 200px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center;">
                <div class="loading-spinner" style="width: 40px; height: 40px;"></div>
            </div>
            <div class="attraction-info">
                <div style="height: 20px; background: rgba(255,255,255,0.1); margin-bottom: 12px; border-radius: 4px;"></div>
                <div style="height: 60px; background: rgba(255,255,255,0.05); border-radius: 4px;"></div>
            </div>
        </div>
    `).join('');
    
    try {
        let attractions = await fetchWikipediaAttractions(destination);
        
        if (!attractions || attractions.length === 0) {
            attractions = await generatePixabayAttractions(destination);
        }
        
        if (attractions && attractions.length > 0) {
            attractionsGrid.innerHTML = attractions.map(attraction => `
                <div class="attraction-card" onclick="window.open('${attraction.url}', '_blank')">
                    <img src="${attraction.image}" alt="${attraction.title}" class="attraction-image" 
                         onerror="this.onerror=null; this.src='https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=300';">
                    <div class="attraction-info">
                        <h4 class="attraction-title">${attraction.title}</h4>
                        <p class="attraction-description">${attraction.description}</p>
                        <a href="${attraction.url}" class="attraction-link" target="_blank">Learn More →</a>
                    </div>
                </div>
            `).join('');
        } else {
            generateFallbackAttractions(destination, attractionsGrid);
        }
    } catch (error) {
        console.error('Error loading attractions:', error);
        generateFallbackAttractions(destination, attractionsGrid);
    }
}

// Fetch attractions using Pixabay (same as before)
async function generatePixabayAttractions(destination) {
    try {
        const queries = [
            `${destination} landmarks`,
            `${destination} tourist attractions`,
            `${destination} monuments`,
            `${destination} architecture`
        ];
        
        const attractions = [];
        
        for (let i = 0; i < Math.min(4, queries.length); i++) {
            const query = queries[i];
            const response = await fetch(`https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&per_page=3&safesearch=true`);
            const data = await response.json();
            
            if (data.hits && data.hits.length > 0) {
                const hit = data.hits[0];
                attractions.push({
                    title: `${destination} ${['Historic Center', 'Cultural District', 'Landmark', 'Monument'][i]}`,
                    description: `Explore the beautiful ${['historic architecture and cultural heritage', 'vibrant arts scene and local culture', 'iconic landmarks and scenic beauty', 'traditional monuments and history'][i]} of ${destination}. A must-visit destination for travelers.`,
                    image: hit.largeImageURL || hit.webformatURL,
                    url: `https://www.google.com/search?q=${encodeURIComponent(destination + ' tourist attractions')}`
                });
            }
        }
        
        return attractions.length > 0 ? attractions : null;
    } catch (error) {
        console.error('Error fetching Pixabay attractions:', error);
        return null;
    }
}

// Fetch Wikipedia Attractions (same as before)
async function fetchWikipediaAttractions(destination) {
    try {
        const searchResponse = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/search/${encodeURIComponent(destination + ' attractions')}`
        );
        const searchData = await searchResponse.json();
        
        if (!searchData.pages || searchData.pages.length === 0) {
            return null;
        }
        
        const attractions = [];
        const maxAttractions = Math.min(4, searchData.pages.length);
        
        for (let i = 0; i < maxAttractions; i++) {
            try {
                const page = searchData.pages[i];
                const summaryResponse = await fetch(
                    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(page.title)}`
                );
                const summaryData = await summaryResponse.json();
                
                attractions.push({
                    title: summaryData.title,
                    description: (summaryData.extract ? summaryData.extract.substring(0, 150) : 'Discover this amazing attraction in ' + destination) + '...',
                    image: summaryData.thumbnail ? summaryData.thumbnail.source : 
                           `https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=300`,
                    url: summaryData.content_urls ? summaryData.content_urls.desktop.page : `https://en.wikipedia.org/wiki/${encodeURIComponent(summaryData.title)}`
                });
            } catch (error) {
                console.error('Error fetching attraction summary:', error);
                continue;
            }
        }
        
        return attractions.length > 0 ? attractions : null;
    } catch (error) {
        console.error('Error searching attractions:', error);
        return null;
    }
}

// Generate Fallback Attractions (same as before)
function generateFallbackAttractions(destination, container) {
    const fallbackAttractions = [
        {
            title: `Historic Center of ${destination}`,
            description: `Explore the beautiful historic center with its charming streets, local architecture, and cultural landmarks.`,
            image: `https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=300`
        },
        {
            title: `${destination} Cultural District`,
            description: `Discover local culture, museums, art galleries, and traditional markets in this vibrant district.`,
            image: `https://images.pexels.com/photos/1624125/pexels-photo-1624125.jpeg?auto=compress&cs=tinysrgb&w=300`
        },
        {
            title: `${destination} Natural Beauty`,
            description: `Experience the stunning natural landscapes, parks, gardens, and scenic viewpoints around the city.`,
            image: `https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=300`
        },
        {
            title: `Local Markets & Cuisine`,
            description: `Taste authentic local food, visit bustling markets, and experience the culinary delights of ${destination}.`,
            image: `https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300`
        }
    ];
    
    container.innerHTML = fallbackAttractions.map(attraction => `
        <div class="attraction-card">
            <img src="${attraction.image}" alt="${attraction.title}" class="attraction-image">
            <div class="attraction-info">
                <h4 class="attraction-title">${attraction.title}</h4>
                <p class="attraction-description">${attraction.description}</p>
                <span class="attraction-link">Popular Destination 🌟</span>
            </div>
        </div>
    `).join('');
}

// SIMPLIFIED: Initialize Map (removed traffic and route controls)
async function initializeSimplifiedMap(destination) {
    const mapContainer = document.getElementById('location-map');
    if (!mapContainer) return;

    try {
        if (mapInstance) {
            mapInstance.remove();
            mapInstance = null;
        }

        markers = [];

        const coordinates = await getCoordinates(destination);
        if (!coordinates) {
            throw new Error('Could not get coordinates for destination');
        }

        // Better map sizing for all devices
        const isMobile = window.innerWidth <= 768;
        mapInstance = L.map('location-map', {
            center: [coordinates.lat, coordinates.lon],
            zoom: isMobile ? 11 : 13,
            zoomControl: true,
            scrollWheelZoom: true
        });

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
            tileSize: 256
        }).addTo(mapInstance);

        // Add main destination marker
        const mainMarker = L.marker([coordinates.lat, coordinates.lon], {
            icon: L.divIcon({
                className: 'custom-marker destination-marker',
                html: '<div style="background: #e74c3c; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            })
        }).addTo(mapInstance);

        mainMarker.bindPopup(`<b>${destination}</b><br>Main Destination`).openPopup();
        markers.push(mainMarker);

        // Add attraction markers
        await addAttractionMarkers(destination, coordinates);
        
        // Add hotel markers
        await addHotelMarkers(destination, coordinates);

        // Proper map resizing after initialization
        setTimeout(() => {
            mapInstance.invalidateSize();
            if (markers.length > 1) {
                const group = new L.featureGroup(markers);
                mapInstance.fitBounds(group.getBounds().pad(0.1));
            }
        }, 300);

    } catch (error) {
        console.error('Error initializing map:', error);
        mapContainer.innerHTML = `
            <div style="height: 400px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.1); border-radius: 16px; color: rgba(255,255,255,0.8);">
                <div style="text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 16px;">🗺</div>
                    <div>Map temporarily unavailable</div>
                    <div style="font-size: 0.9rem; margin-top: 8px;">Please check your internet connection</div>
                </div>
            </div>
        `;
    }
}

// Get coordinates (same as before)
async function getCoordinates(destination) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}&limit=1`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon)
            };
        }
        return null;
    } catch (error) {
        console.error('Error getting coordinates:', error);
        return null;
    }
}

// Add attraction markers (same as before)
async function addAttractionMarkers(destination, centerCoords) {
    try {
        const overpassQuery = `
            [out:json][timeout:25];
            (
              node["tourism"~"^(attraction|museum|monument|castle|viewpoint)$"](around:10000,${centerCoords.lat},${centerCoords.lon});
              way["tourism"~"^(attraction|museum|monument|castle|viewpoint)$"](around:10000,${centerCoords.lat},${centerCoords.lon});
              relation["tourism"~"^(attraction|museum|monument|castle|viewpoint)$"](around:10000,${centerCoords.lat},${centerCoords.lon});
            );
            out center;
        `;

        const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
        const response = await fetch(overpassUrl);
        const data = await response.json();

        if (data && data.elements) {
            const attractions = data.elements.slice(0, 10);
            
            attractions.forEach(attraction => {
                let lat, lon;
                
                if (attraction.lat && attraction.lon) {
                    lat = attraction.lat;
                    lon = attraction.lon;
                } else if (attraction.center) {
                    lat = attraction.center.lat;
                    lon = attraction.center.lon;
                } else {
                    return;
                }

                const name = attraction.tags.name || attraction.tags.tourism || 'Tourist Attraction';
                
                const attractionMarker = L.marker([lat, lon], {
                    icon: L.divIcon({
                        className: 'custom-marker attraction-marker',
                        html: '<div style="background: #3498db; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
                        iconSize: [16, 16],
                        iconAnchor: [8, 8]
                    })
                }).addTo(mapInstance);

                attractionMarker.bindPopup(`<b>${name}</b><br>Tourist Attraction`);
                markers.push(attractionMarker);
            });
        }
    } catch (error) {
        console.error('Error adding attraction markers:', error);
        addDefaultMarkers(centerCoords);
    }
}

// Add hotel markers (updated for people count)
async function addHotelMarkers(destination, centerCoords) {
    const hotels = getHotelsForDestination(destination.toLowerCase(), currentTripData.people || 2);
    
    hotels.forEach((hotel, index) => {
        // Generate random coordinates near center for demo
        const lat = centerCoords.lat + (Math.random() - 0.5) * 0.01;
        const lon = centerCoords.lon + (Math.random() - 0.5) * 0.01;
        
        const hotelMarker = L.marker([lat, lon], {
            icon: L.divIcon({
                className: 'custom-marker hotel-marker',
                html: '<div style="background: #f39c12; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
                iconSize: [14, 14],
                iconAnchor: [7, 7]
            })
        }).addTo(mapInstance);

        hotelMarker.bindPopup(`<b>${hotel.name}</b><br>₹${hotel.price.toLocaleString()}/night<br>${hotel.rating} ⭐`);
        markers.push(hotelMarker);
    });
}

// Add default markers (same as before)
function addDefaultMarkers(centerCoords) {
    const defaultAttractions = [
        { name: 'Historic Center', offset: [0.005, 0.005] },
        { name: 'Cultural District', offset: [-0.005, 0.005] },
        { name: 'Local Market', offset: [0.003, -0.003] },
        { name: 'Scenic Viewpoint', offset: [-0.003, -0.005] }
    ];

    defaultAttractions.forEach(attraction => {
        const lat = centerCoords.lat + attraction.offset[0];
        const lon = centerCoords.lon + attraction.offset[1];
        
        const marker = L.marker([lat, lon], {
            icon: L.divIcon({
                className: 'custom-marker attraction-marker',
                html: '<div style="background: #3498db; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            })
        }).addTo(mapInstance);

        marker.bindPopup(`<b>${attraction.name}</b><br>Must-Visit Location`);
        markers.push(marker);
    });
}

// Enhanced Travel Tips with Local Information (same as before)
function generateEnhancedTravelTips(destination, travelType) {
    const tips = ENHANCED_TRAVEL_TIPS[destination] || generateGenericEnhancedTips(travelType, destination);
    
    // Update local food recommendations
    const localFoodList = document.getElementById('local-food');
    if (localFoodList) {
        localFoodList.innerHTML = tips.localFood.map(food => `<li>🍽 ${food}</li>`).join('');
    }
    
    // Update safety tips
    const safetyTipsList = document.getElementById('safety-tips');
    if (safetyTipsList) {
        safetyTipsList.innerHTML = tips.safetyTips.map(tip => `<li>🛡 ${tip}</li>`).join('');
    }
    
    // Update best time to visit
    const bestTimeEl = document.getElementById('best-time');
    if (bestTimeEl) {
        bestTimeEl.innerHTML = `
            <p><strong>🌟 ${tips.bestTime}</strong></p>
            <p style="margin-top: 8px; opacity: 0.8;">Plan your visit during these months for the best experience!</p>
        `;
    }
    
    // Update budget-friendly tips
    const budgetFriendlyList = document.getElementById('budget-friendly');
    if (budgetFriendlyList) {
        budgetFriendlyList.innerHTML = tips.budgetFriendly.map(tip => `<li>💡 ${tip}</li>`).join('');
    }
    
    // Update avoid spots
    const avoidSpotsList = document.getElementById('avoid-spots');
    if (avoidSpotsList) {
        avoidSpotsList.innerHTML = tips.avoid.map(tip => `<li>⚠ ${tip}</li>`).join('');
    }
}

// Generate generic enhanced tips (same as before)
function generateGenericEnhancedTips(travelType, destination) {
    const genericTips = {
        localFood: [
            `Traditional ${destination} cuisine`,
            'Local street food specialties',
            'Regional beverages and drinks',
            'Must-try local desserts'
        ],
        safetyTips: [
            'Keep copies of important documents',
            'Stay aware of your surroundings',
            'Use registered transportation services',
            'Keep emergency contacts handy'
        ],
        bestTime: travelType === 'domestic' ? 
            'October to March - Pleasant weather with comfortable temperatures' :
            'Check seasonal weather patterns - Spring and fall are usually ideal',
        budgetFriendly: [
            'Use public transportation instead of private taxis',
            'Book accommodation in advance for better deals',
            'Eat at local restaurants rather than hotel dining',
            'Look for free walking tours and attractions',
            'Travel during off-peak seasons for lower prices'
        ],
        avoid: [
            'Peak season hotel and flight bookings',
            'Tourist trap restaurants near major attractions',
            'Expensive guided tours (explore on your own)',
            'Airport food and shopping (overpriced)'
        ]
    };
    
    if (travelType === 'international') {
        genericTips.budgetFriendly = [
            'Book flights well in advance or look for deals',
            'Use public transport and walking instead of taxis',
            'Stay in hostels or budget accommodations',
            'Cook some meals if accommodation has kitchen',
            'Look for free museums and attractions'
        ];
        genericTips.avoid = [
            'Currency exchange at airports (poor rates)',
            'Tourist restaurants in main squares',
            'Expensive international roaming charges',
            'Peak season travel without advance booking'
        ];
    }
    
    return genericTips;
}

// Enhanced Surprise Me Functionality (updated to exclude removed fields)
function surpriseMe() {
    const allDestinations = [...DESTINATIONS.domestic, ...DESTINATIONS.international];
    const randomDestination = allDestinations[Math.floor(Math.random() * allDestinations.length)];
    
    // Fill form with random data
    const destEl = document.getElementById('destination');
    const peopleEl = document.getElementById('people');
    const budgetEl = document.getElementById('budget');
    const daysEl = document.getElementById('days');
    
    const randomPeople = Math.floor(Math.random() * 5) + 1; // 1-5 people
    const randomBudget = Math.floor(Math.random() * 50000) + 10000;
    const randomDays = Math.floor(Math.random() * 10) + 3;
    
    if (destEl) destEl.value = randomDestination;
    if (peopleEl) peopleEl.value = randomPeople;
    if (budgetEl) budgetEl.value = randomBudget;
    if (daysEl) daysEl.value = randomDays;
    
    // Trigger people recommendation update
    updatePeopleRecommendation();
    
    // Add fun animation to surprise button
    const surpriseBtn = event ? event.target.closest('.btn') : document.querySelector('.btn-secondary');
    if (surpriseBtn) {
        surpriseBtn.style.transform = 'rotate(360deg) scale(1.1)';
        setTimeout(() => {
            surpriseBtn.style.transform = '';
        }, 500);
    }
    
    showToast(`🎲 Surprise! How about ${randomDestination} for ${randomPeople} ${randomPeople === 1 ? 'person' : 'people'}?`);
}

// Save itinerary as PDF (updated for people count)
function saveItineraryPDF() {
    if (!currentTripData.destination) {
        showToast('❌ No itinerary to save. Generate a plan first!');
        return;
    }
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Set up fonts and colors
        doc.setFontSize(24);
        doc.setTextColor(0, 51, 102);
        doc.text('🌟 TRIPZYY ITINERARY', 20, 30);
        
        // Add line under title
        doc.setDrawColor(0, 51, 102);
        doc.line(20, 35, 190, 35);
        
        // Destination info section
        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40);
        doc.text('DESTINATION DETAILS', 20, 50);
        
        doc.setFontSize(12);
        doc.text(`📍 Destination: ${currentTripData.destination}`, 25, 65);
        doc.text(`👥 People: ${currentTripData.people} ${currentTripData.people === 1 ? 'person' : 'people'}`, 25, 75);
        doc.text(`💰 Total Budget: ₹${currentTripData.budget?.toLocaleString()}`, 25, 85);
        doc.text(`💰 Per Person: ₹${Math.floor(currentTripData.budget / currentTripData.people)?.toLocaleString()}`, 25, 95);
        doc.text(`📅 Duration: ${currentTripData.days} days`, 25, 105);
        
        if (currentTripData.startDate && currentTripData.endDate) {
            doc.text(`🗓 Travel Dates: ${currentTripData.startDate} to ${currentTripData.endDate}`, 25, 115);
        }
        
        // Budget breakdown section
        doc.setFontSize(16);
        doc.setTextColor(0, 51, 102);
        doc.text('💸 BUDGET BREAKDOWN', 20, 135);
        
        const breakdown = BUDGET_BREAKDOWN;
        let yPos = 150;
        
        doc.setFontSize(12);
        doc.setTextColor(40, 40, 40);
        
        Object.entries(breakdown).forEach(([category, percentage]) => {
            const amount = Math.round((currentTripData.budget * percentage) / 100);
            const dailyAmount = Math.round(amount / currentTripData.days);
            const perPersonAmount = Math.round(amount / currentTripData.people);
            
            const categoryNames = {
                'accommodation': '🏨 Accommodation',
                'food': '🍽 Food & Dining',
                'transport': '🚗 Transportation',
                'activities': '🎯 Activities',
                'shopping': '🛍 Shopping'
            };
            
            doc.text(`${categoryNames[category] || category}`, 25, yPos);
            doc.text(`₹${amount.toLocaleString()} (${percentage}%)`, 100, yPos);
            doc.text(`₹${dailyAmount}/day | ₹${perPersonAmount}/person`, 140, yPos);
            yPos += 12;
        });
        
        // Travel tips section
        doc.setFontSize(16);
        doc.setTextColor(0, 51, 102);
        doc.text('💡 TRAVEL TIPS', 20, yPos + 20);
        
        const tips = getTipsForDestination(currentTripData.destination.toLowerCase());
        
        yPos += 35;
        doc.setFontSize(14);
        doc.text('✅ Budget-Friendly Tips:', 25, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        tips.budgetFriendly.slice(0, 4).forEach((tip, index) => {
            const lines = doc.splitTextToSize(`• ${tip}`, 160);
            lines.forEach(line => {
                yPos += 6;
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(line, 30, yPos);
            });
        });
        
        // Add a new page for additional content if needed
        if (yPos > 200) {
            doc.addPage();
            yPos = 20;
        }
        
        yPos += 15;
        doc.setFontSize(14);
        doc.setTextColor(40, 40, 40);
        doc.text('❌ Places to Avoid:', 25, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        tips.avoid.slice(0, 3).forEach((tip, index) => {
            const lines = doc.splitTextToSize(`• ${tip}`, 160);
            lines.forEach(line => {
                yPos += 6;
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(line, 30, yPos);
            });
        });
        
        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text('Generated by TRIPZYY - Travel Smarter, Not Harder', 20, 285);
            doc.text(`Page ${i} of ${pageCount}`, 170, 285);
        }
        
        // Save the PDF
        doc.save(`${currentTripData.destination}-TRIPZYY-Itinerary.pdf`);
        showToast('📄 PDF saved successfully!');
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        showToast('❌ Error generating PDF. Please try again!');
    }
}

// Share via WhatsApp (updated for people count)
function shareViaWhatsApp() {
    if (!currentTripData.destination) {
        showToast('❌ No itinerary to share. Generate a plan first!');
        return;
    }
    
    const message = generateShareMessage();
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    showToast('📱 Opening WhatsApp...');
}

// Share via Email (same as before)
function shareViaEmail() {
    if (!currentTripData.destination) {
        showToast('❌ No itinerary to share. Generate a plan first!');
        return;
    }
    
    const message = generateShareMessage();
    const subject = `${currentTripData.destination} Travel Itinerary - TRIPZYY`;
    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.open(emailUrl, '_blank');
    showToast('📧 Opening email client...');
}

// Share on social media (updated for people count)
function shareOnSocial() {
    if (!currentTripData.destination) {
        showToast('❌ No itinerary to share. Generate a plan first!');
        return;
    }
    
    const message = `Just planned an amazing ${currentTripData.days}-day trip to ${currentTripData.destination} for ${currentTripData.people} ${currentTripData.people === 1 ? 'person' : 'people'}! 🌟 Budget: ₹${currentTripData.budget?.toLocaleString()} #TRIPZYY #${currentTripData.destination}`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(shareUrl, '_blank');
    showToast('📲 Opening Twitter...');
}

// Generate share message (updated for people count)
function generateShareMessage() {
    const { destination, budget, days, people } = currentTripData;
    const perPersonBudget = Math.floor(budget / people);
    
    return `🌟 TRIPZYY ITINERARY - ${destination?.toUpperCase()}

📍 Destination: ${destination}
👥 Travelers: ${people} ${people === 1 ? 'person' : 'people'}
💰 Total Budget: ₹${budget?.toLocaleString()}
💰 Per Person: ₹${perPersonBudget?.toLocaleString()}
📅 Duration: ${days} days

💸 BUDGET BREAKDOWN:
🏨 Accommodation: ₹${Math.round(budget * (BUDGET_BREAKDOWN?.accommodation || 0) / 100).toLocaleString()}
🍽 Food & Dining: ₹${Math.round(budget * (BUDGET_BREAKDOWN?.food || 0) / 100).toLocaleString()}
🚗 Transportation: ₹${Math.round(budget * (BUDGET_BREAKDOWN?.transport || 0) / 100).toLocaleString()}
🎯 Activities: ₹${Math.round(budget * (BUDGET_BREAKDOWN?.activities || 0) / 100).toLocaleString()}
🛍 Shopping: ₹${Math.round(budget * (BUDGET_BREAKDOWN?.shopping || 0) / 100).toLocaleString()}

Generated by TRIPZYY - Travel Smarter, Not Harder
Happy Travels! 🌟`;
}

function getTipsForDestination(destination) {
    return ENHANCED_TRAVEL_TIPS[destination] || generateGenericEnhancedTips(currentTripData.travelType, destination);
}

// Plan New Trip (same as before)
function planNewTrip() {
    // Reset form
    if (form) form.reset();
    currentTripData = {};
    currentPhotos = [];
    
    // Clean up map
    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
    }
    markers = [];
    
    // Hide results and show form
    if (resultsSection) resultsSection.classList.add('results-hidden');
    const travelFormEl = document.getElementById('travel-form');
    if (travelFormEl) travelFormEl.style.display = 'block';
    
    // Hide season info card
    const seasonCard = document.getElementById('season-info-card');
    if (seasonCard) seasonCard.style.display = 'none';
    
    // Hide people recommendation
    const recommendationEl = document.getElementById('people-recommendation');
    if (recommendationEl) recommendationEl.classList.remove('show');
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    showToast('🆕 Ready for a new adventure!');
}

// Dark Mode Toggle (same as before)
function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const modeIcon = document.getElementById('mode-icon');
    const isDark = document.body.classList.contains('dark');
    
    if (modeIcon) modeIcon.textContent = isDark ? '☀' : '🌙';
    
    // Save preference to in-memory storage
    window.darkMode = isDark;
    
    showToast(isDark ? '🌙 Dark mode enabled' : '☀ Light mode enabled');
}

// Chatbot Functions (updated with provided Groq API key)
function toggleChatbot() {
    if (chatbotWindow) chatbotWindow.classList.toggle('chatbot-hidden');
    
    if (chatbotWindow && !chatbotWindow.classList.contains('chatbot-hidden')) {
        if (chatbotInput) chatbotInput.focus();
    }
}

function handleChatInput(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

// Send chat message to Groq AI (using provided API key)
async function sendChatMessage() {
    const message = chatbotInput ? chatbotInput.value.trim() : '';
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    if (chatbotInput) chatbotInput.value = '';
    
    // Add typing indicator
    const typingId = addChatMessage('🤖 Typing...', 'bot');
    
    try {
        const response = await getGroqAIResponse(message);
        
        // Remove typing indicator and add real response
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();
        addChatMessage(response, 'bot');
    } catch (error) {
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();
        addChatMessage('Sorry, I encountered an error. Please try asking something else!', 'bot');
        console.error('Chatbot error:', error);
    }
}

function addChatMessage(message, sender) {
    const messageDiv = document.createElement('div');
    const messageId = 'msg-' + Date.now();
    messageDiv.id = messageId;
    messageDiv.className = `chat-message ${sender}-message`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    
    if (chatbotMessages) {
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    return messageId;
}

// Groq AI API Integration (using provided API key)
async function getGroqAIResponse(query) {
    try {
        // Add destination and people context if available
        const contextualQuery = currentTripData.destination 
            ? `I'm planning a trip to ${currentTripData.destination} for ${currentTripData.people || 'some'} ${(currentTripData.people === 1) ? 'person' : 'people'}. ${query}` 
            : query;
        
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'mixtral-8x7b-32768', // Groq's fast model
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful travel assistant for TRIPZYY. Provide concise, practical travel advice and information. Keep responses under 150 words and be enthusiastic about travel. Focus on budget-friendly tips and group travel suggestions.'
                    },
                    {
                        role: 'user',
                        content: contextualQuery
                    }
                ],
                max_tokens: 150,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error('Groq API error');
        }
        
        const data = await response.json();
        return data.choices[0].message.content.trim();
        
    } catch (error) {
        console.error('Groq API error:', error);
        return getFallbackResponse(query);
    }
}

function getFallbackResponse(query) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('weather')) {
        return "Check the weather section above for current conditions and 3-day forecast! 🌤";
    } else if (lowerQuery.includes('budget')) {
        return "I've created a smart budget breakdown for your trip above. Check the per-person costs for your group! 💰";
    } else if (lowerQuery.includes('hotel') || lowerQuery.includes('stay')) {
        return "Check out the hotel recommendations section above! I've found great stays based on your group size. 🏨";
    } else if (lowerQuery.includes('attraction') || lowerQuery.includes('place')) {
        return "Check out the attractions section above for must-visit places! All attractions are automatically loaded when you select a destination. 🏛";
    } else if (lowerQuery.includes('map')) {
        return "Scroll down to see the interactive map with all locations pinned! Perfect for planning your route. 🗺";
    } else if (lowerQuery.includes('food')) {
        return "Check the Local Tips section for must-try local food recommendations! Great for group dining experiences. 🍽";
    } else if (lowerQuery.includes('photo') || lowerQuery.includes('gallery')) {
        return "Click the 'View Gallery' button in the destination header to see beautiful photos of your destination! 📸";
    } else if (lowerQuery.includes('share')) {
        return "You can share your itinerary via WhatsApp, email, or social media using the share buttons at the bottom! 📱";
    } else if (lowerQuery.includes('save')) {
        return "Save your itinerary as a PDF using the save button. Perfect for offline access during your trip! 💾";
    } else if (lowerQuery.includes('people') || lowerQuery.includes('group')) {
        return "TRIPZYY optimizes recommendations based on your group size! Larger groups get better hotel deals and group activity suggestions. 👥";
    } else {
        return "That's a great question! Check out your personalized travel plan above - it has tons of useful details including weather, hotels, and budget breakdowns for your group! ✨";
    }
}

// Toast Notification Function (same as before)
function showToast(message) {
    const toastMessage = document.getElementById('toast-message');
    if (!toastMessage || !toast) return;
    toastMessage.textContent = message;
    
    toast.classList.remove('toast-hidden');
    
    setTimeout(() => {
        toast.classList.add('toast-hidden');
    }, 3000);
}

// Add smooth animations on scroll (same as before)
window.addEventListener('scroll', function() {
    const cards = document.querySelectorAll('.glass-card');
    
    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const cardVisible = cardTop < window.innerHeight && cardTop > 0;
        
        if (cardVisible) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
});

// Close modal when clicking outside (same as before)
window.addEventListener('click', function(event) {
    const budgetModal = document.getElementById('budget-modal');
    const photoModal = document.getElementById('photo-gallery-modal');
    
    if (budgetModal && event.target === budgetModal) {
        closeBudgetModal();
    }
    
    if (photoModal && event.target === photoModal) {
        closePhotoGallery();
    }
});

// Handle responsive behavior (same as before)
window.addEventListener('resize', function() {
    // Adjust map view on resize with proper invalidation
    if (mapInstance) {
        setTimeout(() => {
            mapInstance.invalidateSize();
            if (markers.length > 1) {
                const group = new L.featureGroup(markers);
                mapInstance.fitBounds(group.getBounds().pad(0.1));
            }
        }, 100);
    }
    
    // Adjust chatbot position on mobile
    const chatbot = document.getElementById('chatbot-window');
    if (chatbot && !chatbot.classList.contains('chatbot-hidden')) {
        if (window.innerWidth <= 480) {
            chatbot.style.right = '10px';
            chatbot.style.width = '280px';
        } else {
            chatbot.style.right = '30px';
            chatbot.style.width = '350px';
        }
    }
});

// Handle network status for better UX (same as before)
window.addEventListener('online', function() {
    showToast('🌐 Back online! All features available.');
});

window.addEventListener('offline', function() {
    showToast('📴 You\'re offline. Some features may not work.');
});

// Keyboard shortcuts for better accessibility (same as before)
document.addEventListener('keydown', function(event) {
    // Escape key to close modals
    if (event.key === 'Escape') {
        const budgetModal = document.getElementById('budget-modal');
        const photoModal = document.getElementById('photo-gallery-modal');
        
        if (budgetModal && !budgetModal.classList.contains('budget-modal-hidden')) {
            closeBudgetModal();
        }
        
        if (photoModal && !photoModal.classList.contains('photo-modal-hidden')) {
            closePhotoGallery();
        }
        
        if (chatbotWindow && !chatbotWindow.classList.contains('chatbot-hidden')) {
            toggleChatbot();
        }
    }
    
    // Ctrl+Enter to submit form
    if (event.ctrlKey && event.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'SELECT')) {
            form.dispatchEvent(new Event('submit'));
        }
    }
});

// Initialize app (updated welcome message)
document.addEventListener('DOMContentLoaded', function() {
    // Add welcome message
    setTimeout(() => {
        showToast('✨ Welcome to TRIPZYY! Travel Smarter, Not Harder with AI assistance!');
    }, 1000);
    
    // Add subtle animations to buttons
    const buttons = document.querySelectorAll('.btn, .btn-mini');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (!this.style.transform.includes('scale')) {
                this.style.transform = 'translateY(-3px) scale(1.02)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add loading states to form inputs
    const allInputs = document.querySelectorAll('input, select');
    allInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
    
    // Check if user is on mobile for better UX
    if (window.innerWidth <= 768) {
        showToast('📱 Swipe and tap to explore your travel plan!');
    }
});

// Error handling for better UX (same as before)
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    showToast('⚠ Something went wrong. Please refresh and try again.');
});

// Performance optimization - lazy load images (same as before)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', lazyLoadImages);
} else {
    lazyLoadImages();
    
}
// Chatbot functionality - ADD THIS TO YOUR EXISTING script.js
async function sendChatMessage() {
    const input = document.getElementById('chatbot-input');
    const messagesContainer = document.getElementById('chatbot-messages');
    const message = input.value.trim();
    
    if (!message) return;

    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user-message';
    userMessage.innerHTML = `<p>${message}</p>`;
    messagesContainer.appendChild(userMessage);
    input.value = '';

    // Get destination context
    const destination = document.getElementById('destination')?.value || 
                       document.getElementById('destination-name')?.textContent || '';

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, destination })
        });

        const data = await response.json();
        
        const botMessage = document.createElement('div');
        botMessage.className = 'chat-message bot-message';
        botMessage.innerHTML = `<p>${data.message}</p>`;
        messagesContainer.appendChild(botMessage);
    } catch (error) {
        console.error('Chat error:', error);
    }

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function handleChatInput(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}
