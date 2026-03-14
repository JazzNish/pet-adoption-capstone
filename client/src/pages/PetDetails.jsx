import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    FaArrowLeft, FaMapMarkerAlt, FaVenusMars, 
    FaBirthdayCake, FaPaw, FaStethoscope, FaInfoCircle, FaSpinner , FaWeightHanging,
} from 'react-icons/fa';
import { LuClipboardList } from "react-icons/lu";

export default function PetDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [pet, setPet] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    
    // Grab user to determine which button to show
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('furever_user')));

    // 👇 ADD THIS NEW EFFECT: Silently grab their freshest verification status!
    useEffect(() => {
        const fetchFreshUser = async () => {
            if (!currentUser || !currentUser.id) return;
            try {
                const res = await fetch(`https://pet-adoption-capstone.onrender.com/api/users/${currentUser.id}/public`);
                if (res.ok) {
                    const freshData = await res.json();
                    
                    // If the database says they are verified now, update the page instantly!
                    if (freshData.idVerificationStatus !== currentUser.idVerificationStatus) {
                        const updatedUser = { ...currentUser, idVerificationStatus: freshData.idVerificationStatus };
                        setCurrentUser(updatedUser); // Updates the button on the screen
                        localStorage.setItem('furever_user', JSON.stringify(updatedUser)); // Updates browser memory
                    }
                }
            } catch (error) {
                console.error("Failed to check verification status", error);
            }
        };

        fetchFreshUser();
    }, [currentUser?.id]);

    if (isLoading) return <div className="min-h-screen flex justify-center items-center"><FaSpinner className="animate-spin size-12 text-[#1c1e21]" /></div>;
    
    if (!pet) return <div className="min-h-screen flex justify-center items-center text-xl font-bold">Pet not found.</div>;

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#fdfdfd] py-10 px-4 sm:px-6 lg:px-8 animate-[fade-in-up_0.4s_ease-out]">
            <div className="max-w-6xl mx-auto">
                
                {/* Back Button */}
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#1c1e21] transition-colors font-bold mb-6">
                    <FaArrowLeft /> Back to Browse
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    {/* LEFT COLUMN: Photos */}
                    {/* LEFT COLUMN: Photos */}
                    <div className="space-y-4">
                        {/* Main Big Image */}
                        <div className="aspect-square rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50 relative">
                            {/* Fallback to index 0 if something goes wrong, or a placeholder */}
                            <img 
                                src={pet.imageUrls?.[activeImageIndex] || "https://via.placeholder.com/600"} 
                                alt={pet.name} 
                                className="w-full h-full object-cover animate-[fade-in_0.3s_ease-out]"
                            />
                        </div>

                        {/* Thumbnails Row (Only show if there's more than 1 image) */}
                        {pet.imageUrls?.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto py-1">
                                {pet.imageUrls.map((url, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => setActiveImageIndex(index)}
                                        className={`relative h-20 w-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImageIndex === index ? 'border-[#1c1e21] shadow-md opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={url} alt={`${pet.name} ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Information */}
                    <div className="flex flex-col">
                        
                        {/* Header: Name & Location */}
                        <div className="mb-6">
                            <h1 className="text-4xl font-black text-[#1c1e21] mb-2">{pet.name}</h1>
                            <p className="flex items-center gap-2 text-gray-500 font-bold text-lg">
                                <FaMapMarkerAlt className="text-red-500" /> {pet.location || "Location not specified"}
                            </p>
                        </div>

                        {/* Quick Info Grid (Breed, Age, Gender) */}
                        <div className="grid grid-cols-4 gap-4 mb-8">
                            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                                <FaPaw className="size-6 text-blue-500 mb-2" />
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Breed</span>
                                <span className="font-bold text-[#1c1e21]">{pet.breed || "Mixed"}</span>
                            </div>
                            <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                                <FaBirthdayCake className="size-6 text-orange-500 mb-2" />
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Age</span>
                                <span className="font-bold text-[#1c1e21]">{pet.age ? `${pet.age} yrs` : "Unknown"}</span>
                            </div>
                            <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                                <FaVenusMars className="size-6 text-purple-500 mb-2" />
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Gender</span>
                                <span className="font-bold text-[#1c1e21]">{pet.gender || "Unknown"}</span>
                            </div>
                            <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                                <FaWeightHanging className="size-6 text-emerald-500 mb-2" />
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Weight</span>
                                <span className="font-bold text-[#1c1e21]">{pet.weight ? `${pet.weight} ${pet.weightUnit}` : "Unknown"}</span>
                            </div>
                        </div>

                        {/* About / Personality */}
                        <div className="mb-8">
                            <h2 className="text-xl font-black text-[#1c1e21] flex items-center gap-2 mb-3">
                                <FaInfoCircle className="text-gray-400" /> About {pet.name}
                            </h2>
                            <p className="text-gray-600 leading-relaxed font-medium bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                {pet.description || "No description provided by the rehomer."}
                            </p>
                        </div>

                        {/* Health Information */}
                        <div className="mb-10">
                            <h2 className="text-xl font-black text-[#1c1e21] flex items-center gap-2 mb-3">
                                <FaStethoscope className="text-gray-400" /> Health & Medical
                            </h2>
                            <p className="text-gray-600 leading-relaxed font-medium bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                {pet.healthInfo || "Vaccinated, dewormed, and in good health."}
                            </p>
                        </div>

                        {/* --- DYNAMIC CALL TO ACTION BUTTON --- */}
                        <div className="mt-auto pt-6 border-t border-gray-100">
                            {pet.status !== 'Available' ? (
                                // 🚨 STATE 0: Pet is no longer available!
                                <div className="w-full bg-gray-100 text-gray-500 font-bold py-4 rounded-xl flex items-center justify-center text-center border border-gray-200">
                                    {pet.status === 'Pending' ? 'Adoption Pending' : 'Adopted'}
                                </div>
                            ) : !currentUser ? (
                                // STATE 1: Not logged in
                                <Link 
                                    to="/log-in"
                                    className="w-full bg-[#1c1e21] hover:bg-black text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                                >
                                    Log in to Adopt {pet.name}
                                </Link>
                            ) : currentUser.role === 'rehomer' ? (
                                // STATE 2: Logged in as a Rehomer
                                <div className="w-full bg-gray-100 text-gray-500 font-bold py-4 rounded-xl flex items-center justify-center text-center border border-gray-200">
                                    Adopter accounts only.
                                </div>
                            ) : currentUser.idVerificationStatus !== 'verified' ? (
                                // STATE 3: Logged in as Adopter, but NOT VERIFIED
                                <Link 
                                    to="/profile-settings" 
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                                >
                                    Verify ID to Adopt
                                </Link>
                            ) : (
                                // STATE 4: Logged in as Adopter AND VERIFIED! (Show Application Button)
                                <Link 
                                    to={`/apply/${pet?._id}`}
                                    className="w-full bg-[#1c1e21] hover:bg-black text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                                >
                                    <LuClipboardList className="size-5" /> Apply to Adopt {pet?.name}
                                </Link>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}