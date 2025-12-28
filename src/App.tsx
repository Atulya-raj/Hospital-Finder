import { useState, useEffect } from "react";
import "./App.css";

type Hospital = {
  id: number;
  name: string;
  address: string;
  pincode: string;
  latitude?: string;
  longitude?: string;
};

function App() {
  const [pincode, setPincode] = useState("");
  const [searchedPincode, setSearchedPincode] = useState("");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          console.log("✅ User location obtained:", {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("❌ Location access denied:", error.message);
        }
      );
    } else {
      console.log("❌ Geolocation not supported by browser");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pincode.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setSearchedPincode(pincode);

    try {
      const res = await fetch(
        `http://localhost:5000/api/hospitals?pincode=${encodeURIComponent(
          pincode
        )}`
      );

      if (!res.ok) {
        console.error("Backend error", res.status);
        setHospitals([]);
        setIsLoading(false);
        return;
      }

      const data = await res.json();

      console.log("📦 Full API response:", data);

      const records = data.records || [];

      console.log(`📋 Found ${records.length} records`);

      // Log first record to see structure
      if (records.length > 0) {
        console.log("🔍 First record structure:", records[0]);
      }

      const mappedHospitals = records.map((rec: any, index: number) => {
        const hospital = {
          id: index,
          name: rec.hospital_name || rec.name || "Unknown Hospital",
          address:
            rec._address_original_first_line ||
            rec._location ||
            rec.address ||
            "Address not available",
          pincode: rec._pincode || rec.pincode || pincode,
          latitude: rec._location_coordinates
            ? rec._location_coordinates.split(",")[0]?.trim()
            : rec.latitude || rec.lat,
          longitude: rec._location_coordinates
            ? rec._location_coordinates.split(",")[1]?.trim()
            : rec.longitude || rec.lng || rec.lon,
        };
        
        console.log(`🏥 Hospital ${index + 1}:`, {
          name: hospital.name,
          lat: hospital.latitude,
          lng: hospital.longitude,
        });

        return hospital;
      });

      setHospitals(mappedHospitals);
    } catch (err) {
      console.error("Fetch error:", err);
      setHospitals([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Open Google Maps with directions
  const openInGoogleMaps = (hospital: Hospital) => {
    console.log("🗺️ Map button clicked!");
    console.log("Hospital data:", hospital);
    console.log("User location:", userLocation);

    const { latitude, longitude, name, address } = hospital;

    // Try multiple methods to open maps
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        console.log("✅ Valid coordinates found:", { lat, lng });

        // Method 1: Try with user location (directions)
        if (userLocation) {
          const mapsUrl = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${lat},${lng}`;
          console.log("🔗 Opening URL (with directions):", mapsUrl);
          window.open(mapsUrl, "_blank");
          return;
        }

        // Method 2: Just show the location
        const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        console.log("🔗 Opening URL (location only):", mapsUrl);
        window.open(mapsUrl, "_blank");
        return;
      } else {
        console.log("❌ Invalid coordinates (NaN):", { latitude, longitude });
      }
    } else {
      console.log("❌ No coordinates available");
    }

    // Fallback: Search by name and address
    const query = `${name}, ${address}`;
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
      query
    )}`;
    console.log("🔗 Opening URL (fallback search):", mapsUrl);
    window.open(mapsUrl, "_blank");
  };

  // Get distance display for a hospital
  const getDistanceDisplay = (hospital: Hospital): string | null => {
    if (!userLocation || !hospital.latitude || !hospital.longitude) {
      return null;
    }

    const lat = parseFloat(hospital.latitude);
    const lng = parseFloat(hospital.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return null;
    }

    const distance = calculateDistance(userLocation.lat, userLocation.lng, lat, lng);

    return distance < 1
      ? `${(distance * 1000).toFixed(0)} m away`
      : `${distance.toFixed(1)} km away`;
  };

  return (
    <>
      {/* Background orbs for animated gradient effect */}
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <div className="bg-orb bg-orb-3"></div>

      <div className="app">
        <h1 className="app-title">Hospital Finder</h1>

        <form className="search-form" onSubmit={handleSubmit}>
          <label className="search-label">
            Which pincode do you want to search for?
            <input
              className="search-input"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter pincode (e.g., 800002)"
              disabled={isLoading}
            />
          </label>
          <button className="search-button" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="button-spinner"></span>
                Searching...
              </>
            ) : (
              "Search"
            )}
          </button>
        </form>

        {isLoading ? (
          <div className="loading-state">
            <div className="loading-animation">
              <div className="hospital-pulse">
                <div className="pulse-ring pulse-ring-1"></div>
                <div className="pulse-ring pulse-ring-2"></div>
                <div className="pulse-ring pulse-ring-3"></div>
                <div className="hospital-icon-center">
                  <span className="hospital-plus">+</span>
                </div>
              </div>
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <h3 className="loading-title">Searching for hospitals...</h3>
            <p className="loading-text">
              Looking up hospitals in pincode <strong>{searchedPincode}</strong>
            </p>
          </div>
        ) : hospitals.length === 0 ? (
          <div className="empty-state">
            {!hasSearched ? (
              <>
                <div className="empty-icon-wrapper">
                  <div className="hospital-icon">
                    <div className="hospital-building">
                      <div className="hospital-cross">+</div>
                      <div className="hospital-windows">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                    <div className="search-animation">
                      <div className="search-circle"></div>
                      <div className="search-handle"></div>
                    </div>
                  </div>
                </div>
                <h3 className="empty-title">Ready to Search</h3>
                <p className="empty-text">
                  Enter a pincode above to find hospitals in your area
                </p>
              </>
            ) : (
              <>
                <div className="empty-icon-wrapper">
                  <div className="not-found-icon">
                    <div className="magnifying-glass">
                      <div className="glass-lens">
                        <div className="sad-face">
                          <span className="eye"></span>
                          <span className="eye"></span>
                          <span className="mouth"></span>
                        </div>
                      </div>
                      <div className="glass-handle"></div>
                    </div>
                    <div className="question-marks">
                      <span>?</span>
                      <span>?</span>
                      <span>?</span>
                    </div>
                  </div>
                </div>
                <h3 className="empty-title">No Hospitals Found</h3>
                <p className="empty-text">
                  We couldn't find any hospitals registered for pincode{" "}
                  <strong>{searchedPincode}</strong>
                </p>
                <div className="empty-suggestions">
                  <p className="suggestion-title">💡 Try these tips:</p>
                  <ul className="suggestion-list">
                    <li>Check if the pincode is entered correctly</li>
                    <li>Search for nearby pincodes in your area</li>
                    <li>Try a larger city or district pincode</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        ) : (
          <ul className="results-list">
            {hospitals.map((h) => (
              <li className="result-item" key={h.id}>
                <div className="hospital-info">
                  <span className="hospital-name">{h.name}</span>
                  <span className="hospital-address">{h.address}</span>
                  <div className="hospital-meta">
                    <span className="hospital-pincode">{h.pincode}</span>
                    {getDistanceDisplay(h) && (
                      <span className="hospital-distance">
                        {getDistanceDisplay(h)}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="map-button"
                  onClick={() => {
                    console.log("🖱️ Button clicked for:", h.name);
                    openInGoogleMaps(h);
                  }}
                  title="View on Google Maps"
                  type="button"
                >
                  <svg
                    className="map-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span className="map-button-text">View on Map</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default App;
