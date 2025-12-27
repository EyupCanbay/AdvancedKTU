
/*
* Get location data from OpenStreetMap Nominatim API
* @param {string} query - The search query (e.g., address or place name)
* @returns {Promise} - Promise resolving to location data or null if not found
*/
async function getLocation(query, options = { limit: 3, countryCodes: 'tr' }) {
    const {
        limit = 5,
        addressDetails = true,
        countryCodes,
        viewbox
    } = options;

    // Build query parameters
    const params = new URLSearchParams({
        q: query,
        format: 'jsonv2',
        limit: Math.min(limit, 40), // Max 40 results
        addressdetails: addressDetails ? '1' : '0'
    });

    // Add optional parameters
    if (countryCodes) {
        params.append('countrycodes', countryCodes);
    }

    if (viewbox) {
        params.append('viewbox', viewbox);
    }

    const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'E-Atik-Koruyuculari/1.0' // Custom user agent
            }
        });

        if (!response.ok) {
            throw new Error(`Nominatim API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Transform response to our format
        if (data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon)
            };
        } else {
            return null;
        }

    } catch (error) {
        console.error('Location search failed:', error);
        throw new Error(`Konum arama başarısız: ${error.message}`);
    }
}

export { getLocation };