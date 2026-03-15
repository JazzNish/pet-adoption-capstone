import { useState, useEffect } from "react";
import PetCard from "../../components/PetCard";
import { FaMapMarkerAlt, FaTimes } from 'react-icons/fa';

// --- NEW LEAFLET IMPORTS ---
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- FIX FOR LEAFLET ICONS IN REACT ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function BrowsePets() {
    // --- STATE ---
    const [pets, setPets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [savedPetIds, setSavedPetIds] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem('furever_user'));
    const token = localStorage.getItem('token');

    // --- FILTER STATE ---
    const [searchTerm, setSearchTerm] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [genderFilter, setGenderFilter] = useState(""); 
    const [maxAge, setMaxAge] = useState(20); 
    const [mapMarker, setMapMarker] = useState(null);

    // --- FETCH PETS AND SAVED PETS (WITH AUTO-REFRESH) ---
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // 1. Silently fetch the main pet list
                const petRes = await fetch("https://pet-adoption-capstone.onrender.com/api/pets");
                if (petRes.ok) {
                    const petData = await petRes.json();
                    setPets(petData);
                }

                // 2. Silently fetch their saved pets (if they are logged in)
                if (currentUser) {
                    const savedRes = await fetch('https://pet-adoption-capstone.onrender.com/api/users/saved-pets', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (savedRes.ok) {
                        const savedPets = await savedRes.json();
                        setSavedPetIds(savedPets.map(pet => pet._id)); 
                    }
                }
            } catch (error) {
                console.error("Failed to fetch data silently", error);
            } finally {
                setIsLoading(false); 
            }
        };

        fetchAllData();
        const intervalId = setInterval(fetchAllData, 5000);
        return () => clearInterval(intervalId);
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSavePet = async (petId, e) => {
        e.preventDefault(); 
        if (!currentUser) {
            alert("Please log in to save pets!");
            return;
        }

        try {
            const res = await fetch(`https://pet-adoption-capstone.onrender.com/api/users/save-pet/${petId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const updatedSavedIds = await res.json();
                setSavedPetIds(updatedSavedIds); 
            }
        } catch (error) {
            console.error("Error saving pet", error);
        }
    };

    // --- MAP CLICK HANDLER COMPONENT ---
    function MapClickHandler({ setLocationFilter, setMapMarker }) {
        useMapEvents({
            click: async (e) => {
                const { lat, lng } = e.latlng;
                setMapMarker({ lat, lng }); 

                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                    const data = await res.json();
                    
                    const address = data.address;
                    const city = address.city || address.town || address.village || "";
                    
                    if (city) {
                        setLocationFilter(city); 
                    }
                } catch (error) {
                    console.error("Error fetching location:", error);
                }
            }
        });
        return null;
    }

    // --- FILTER LOGIC ---
    const filteredPets = pets.filter(pet => {
        
        // 🚨 THE SAFETY NET: Instantly hide any pet that is Pending or Adopted!
        if (pet.status !== 'Available') return false;

        // 1. Search Logic (Name, Breed, or Location)
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = searchTerm === "" || 
            (pet.name && pet.name.toLowerCase().includes(searchLower)) ||
            (pet.breed && pet.breed.toLowerCase().includes(searchLower)) ||
            (pet.location && pet.location.toLowerCase().includes(searchLower));

        // 2. Location Logic
        const matchesLocation = locationFilter === "" || 
            (pet.location && pet.location.toLowerCase().includes(locationFilter.toLowerCase()));

        // 3. Gender Logic (Radio Buttons)
        const matchesGender = genderFilter === "" || pet.gender === genderFilter;

        // 4. Age Logic (Slider)
        const ageInMonths = pet.ageUnit === 'Years' ? pet.age * 12 : pet.age;
        const maxAgeInMonths = maxAge * 12;
        const matchesAge = ageInMonths <= maxAgeInMonths;

        return matchesSearch && matchesLocation && matchesGender && matchesAge;
    });


    // --- RESET FILTERS ---
    const handleReset = () => {
        setSearchTerm("");
        setLocationFilter(""); // Clears location too!
        setMapMarker(null);
        setGenderFilter("");
        setMaxAge(20);
    };

    return (
        <>
        <section className="flex animate-[fade-in-up_0.5s_ease-out]">  
            {/* SIDEBAR */}
            <section className="my-2 mx-4 w-72 fixed h-[calc(100vh-100px)] overflow-y-auto flex border border-gray-200 rounded-xl bg-white">
                <div className="w-full px-5 flex flex-col gap-6 text-sm py-6">
                    
                    <div className="flex justify-between items-center">
                        <span className="text-title font-bold text-xs tracking-wider uppercase text-gray-500">Filters</span>
                        <button onClick={handleReset} className="text-subtitle bg-gray-100 p-1 rounded-md cursor-pointer text-xs font-bold transition-opacity">
                            Reset All
                        </button>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-title font-bold text-xs text-gray-600">Search</label>
                        <input 
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Breed, Name, Location..."
                            className="border border-gray-300 outline-none p-2.5 rounded-lg focus:border-[#F97316] transition-colors bg-gray-50 text-sm" 
                        />
                    </div>

                    <div className="h-px bg-gray-100 w-full"></div>

                   {/* LOCATION MAP UI */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <label className="text-subtitle font-bold text-xs">Map Location</label>
                            {locationFilter && (
                                <span className="text-star font-bold text-[10px] bg-cover px-2 py-0.5 rounded border border-gray-200">
                                    {locationFilter}
                                </span>
                            )}
                        </div>
                        
                        <div className="h-40 w-full rounded-xl overflow-hidden border border-gray-200/60 shadow-sm relative z-0">
                            <MapContainer center={[14.6760, 121.0437]} zoom={11} scrollWheelZoom={true} className="h-full w-full">
                                <TileLayer
                                    attribution='&copy; OpenStreetMap'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <MapClickHandler setLocationFilter={setLocationFilter} setMapMarker={setMapMarker} />
                                {mapMarker && <Marker position={mapMarker} />}
                            </MapContainer>

                            {mapMarker && (
                                <button 
                                    onClick={() => { setLocationFilter(""); setMapMarker(null); }}
                                    className="absolute top-2 right-2 z-[1000] bg-white p-1.5 rounded-md text-red-500 hover:bg-red-50 shadow-md border border-gray-200 transition-colors"
                                    title="Clear map filter"
                                >
                                    <FaTimes className="size-3" />
                                </button>
                            )}
                        </div>
                        <p className="text-[10px] text-gray-400 italic">Click anywhere on the map to filter by city</p>
                    </div>

                    <div className="h-px bg-gray-100 w-full"></div>

                    {/* GENDER RADIO BUTTONS */}
                    <div className="flex flex-col gap-2">
                        <label className="text-title font-bold text-xs text-gray-600">Gender</label>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            {["All", "Male", "Female"].map(g => (
                                <button
                                    key={g}
                                    onClick={() => setGenderFilter(g === "All" ? "" : g)}
                                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all duration-300 ${
                                        genderFilter === (g === "All" ? "" : g) 
                                        ? 'bg-white text-title shadow-sm' 
                                        : 'text-gray-500 hover:text-gray-800'
                                    }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 w-full"></div>

                    {/* AGE SLIDER */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <label className="text-title font-bold text-xs text-gray-600">Max Age</label>
                            <span className="text-subtitle font-bold text-xs bg-gray-100 px-2 py-1 rounded-md">
                                {maxAge === "20" ? "Any Age" : `Up to ${maxAge} yrs`}
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min="1" 
                            max="20" 
                            step="1"
                            value={maxAge} 
                            onChange={(e) => setMaxAge(e.target.value)}
                            className="w-full accent-title mt-2 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 font-semibold px-1 mt-1">
                            <span>1 yr</span>
                            <span>20+ yrs</span>
                        </div>
                    </div>

                </div>
            </section>

            {/* MAIN CONTENT AREA */}
            <section className="flex flex-col gap-6 my-4 ml-80 w-full pr-8">
                
                <div className="flex justify-between mx-2 items-center py-6">
                    <div>
                        <h2 className="text-2xl font-extrabold text-title mb-1">Available Pets</h2>
                        <p className="text-subtitle font-medium">Help give a loving animal their forever home.</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl border border-gray-200">
                        <p className="text-subtitle font-bold">{filteredPets.length} pets found</p> 
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-32">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316]"></div>
                        </div>
                    ) : filteredPets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm"> 
                            <span className="text-2xl font-bold text-gray-800 mb-2">No Pets found</span>
                            <span className="text-gray-500 font-medium">Try adjusting your search or filters!</span>
                            <button onClick={handleReset} className="mt-6 bg-[#1E293B] hover:bg-black text-white px-6 py-2.5 rounded-full font-bold transition-colors">
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filteredPets.map(pet => (
                                <PetCard 
                                    key={pet._id}
                                    id={pet._id}
                                    image={pet.imageUrls?.[0] || pet.imageUrl} 
                                    name={pet.name}
                                    breed={pet.breed || "Mixed Breed"} 
                                    location={pet.location}
                                    isSaved={savedPetIds.includes(pet._id)} 
                                    onSave={(e) => handleSavePet(pet._id, e)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

        </section>
        </>
    );
}

export default BrowsePets;