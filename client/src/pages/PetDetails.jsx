import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    FaArrowLeft, FaMapMarkerAlt, FaVenusMars, FaExpand, FaTimes,
    FaBirthdayCake, FaPaw, FaStethoscope, FaInfoCircle, FaSpinner , FaWeightHanging,
} from 'react-icons/fa';
import { LuClipboardList } from "react-icons/lu";

export default function PetDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [pet, setPet] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Grab user to determine which button to show
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('furever_user')));

    // 👇 ADD THIS NEW EFFECT: Silently grab their freshest verification status!
    useEffect(() => {
        const fetchPetDetails = async () => {
            try {
                const res = await fetch(`https://pet-adoption-capstone.onrender.com/api/pets/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    
                    // 🕵️‍♂️ Tracker so we can see EXACTLY what the database sent!
                    console.log("DATABASE PET DATA:", data);

                    // 🛡️ The Safety Wrapper: Unwraps the data if it's hiding!
                    if (Array.isArray(data)) {
                        setPet(data[0]); // If it's an array, grab the first pet
                    } else if (data && data.pet) {
                        setPet(data.pet); // If it's wrapped in a 'pet' object, unwrap it
                    } else {
                        setPet(data); // If it's perfectly normal, use it as is
                    }
                }
            } catch (error) {
                console.error("Failed to fetch pet details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPetDetails();
    }, [id]);

    if (isLoading) return <div className="min-h-screen flex justify-center items-center"><FaSpinner className="animate-spin size-12 text-[#1c1e21]" /></div>;
    
    if (!pet) return <div className="min-h-screen flex justify-center items-center text-xl font-bold">Pet not found.</div>;

    return (
        <div className="min-h-[calc(100vh-80px)] bg-white py-10 px-4 sm:px-6 lg:px-8 animate-[fade-in-up_0.4s_ease-out] ">
            <div className="max-w-6xl mx-auto ">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative">
                    
                    {/* LEFT COLUMN: Photos */}
                    <div className="space-y-4 lg:sticky lg:top-24 h-fit ">
                        {/* Main Big Image (Now Clickable!) */}
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#1c1e21] transition-colors font-bold mb-6">
                            <FaArrowLeft /> Back to Browse
                        </button>
                        <div 
                            className="aspect-square rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50 relative group cursor-pointer"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <img 
                                src={pet.imageUrls?.[activeImageIndex] || "https://via.placeholder.com/600"} 
                                alt={pet.name} 
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white font-bold tracking-wider flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                                    <FaExpand /> CLICK TO EXPAND
                                </span>
                            </div>
                        </div>

                        {/* Thumbnails Row */}
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
                            <h1 className="text-2xl font-bold text-title mb-2">{pet.name}</h1>
                            <p className="flex items-center gap-2 text-gray-500 font-bold text-lg">
                                <FaMapMarkerAlt className="text-subtitle" /> {pet.location || "Location not specified"}
                            </p>
                        </div>

                        {/* Quick Info Grid */}
                        <div className="grid grid-cols-4 gap-4 mb-5">
                            <div className="p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                                <FaPaw className="size-6 text-subtitle mb-2" />
                                <span className="text-xs text-subtitle font-bold uppercase tracking-wider mb-1">Breed</span>
                                <span className="font-semibold text-title">{pet.breed || "Mixed"}</span>
                            </div>
                            <div className="p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                                <FaBirthdayCake className="size-6 text-subtitle mb-2" />
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Age</span>
                                <span className="font-semibold text-title">{pet.age ? `${pet.age} yrs` : "Unknown"}</span>
                            </div>
                            <div className="p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                                <FaVenusMars className="size-6 text-subtitle mb-2" />
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Gender</span>
                                <span className="font-semibold text-title">{pet.gender || "Unknown"}</span>
                            </div>
                            <div className="p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                                <FaWeightHanging className="size-6 text-subtitle mb-2"  />
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Weight</span>
                                <span className="font-semibold text-title">{pet.weight ? `${pet.weight} ${pet.weightUnit}` : "Unknown"}</span>
                            </div>
                        </div>

                        {/* About / Personality */}
                        <div className="mb-8">
                            <h2 className="text-xl font-black text-[#1c1e21] flex items-center gap-2 mb-3">
                                <FaInfoCircle className="text-gray-400" /> About {pet.name}
                            </h2>
                            <p className="text-subtitle font-medium bg-white p-4 border-b border-gray-200">
                                {pet.description || "No description provided by the rehomer."}
                            </p>
                        </div>

                        {/* Health Information */}
                        <div className="mb-8">
                            <h2 className="text-xl font-black text-[#1c1e21] flex items-center gap-2 mb-3">
                                <FaStethoscope className="text-gray-400" /> Health & Medical
                            </h2>
                            <p className="text-subtitle font-medium bg-white p-4 border-b border-gray-200">
                                {pet.healthInfo || "Vaccinated, dewormed, and in good health."}
                            </p>
                        </div>

                        {/* 👇 THE CLICKABLE REHOMER PROFILE CARD 👇 */}
                        <Link 
                            to={`/profile/${pet.owner?._id}`} 
                             className="flex justify-between items-center text-subtitle font-medium bg-white p-4 border-b border-gray-200"
                        >
                            <div className="flex items-center gap-4">
                                <img 
                                    src={pet.owner?.profilePicture || "/src/assets/noUser.png"} 
                                    alt="Rehomer" 
                                    className="size-14 rounded-full object-cover border-2 border-white shadow-sm"
                                    referrerPolicy="no-referrer"
                                />
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Listed By</p>
                                    <h3 className="font-bold text-[#1c1e21] text-lg group-hover:text-blue-600 transition-colors">
                                        {pet.owner?.name || "Anonymous Rehomer"}
                                    </h3>
                                </div>
                            </div>
                            <div className="text-sm font-bold text-gray-400 group-hover:text-blue-600 transition-colors">
                                View Profile &rarr;
                            </div>
                        </Link>

                        {/* --- DYNAMIC CALL TO ACTION BUTTON --- */}
                        <div className="mt-auto pt-6 border-t border-gray-100">
                            {pet.status !== 'Available' ? (
                                <div className="w-full bg-gray-100 text-gray-500 font-bold py-4 rounded-xl flex items-center justify-center text-center border border-gray-200">
                                    {pet.status === 'Pending' ? 'Adoption Pending' : 'Adopted'}
                                </div>
                            ) : !currentUser ? (
                                <Link 
                                    to="/log-in"
                                    className="w-full bg-[#1c1e21] hover:bg-black text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                                >
                                    Log in to Adopt {pet.name}
                                </Link>
                            ) : currentUser.role === 'rehomer' ? (
                                <div className="w-full bg-gray-100 text-gray-500 font-bold py-4 rounded-xl flex items-center justify-center text-center border border-gray-200">
                                    Adopter accounts only.
                                </div>
                            ) : currentUser.idVerificationStatus !== 'verified' ? (
                                <Link 
                                    to="/profile-settings" 
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                                >
                                    Verify ID to Adopt
                                </Link>
                            ) : (
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

            {/* FULL SCREEN IMAGE MODAL */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out animate-[fade-in_0.2s_ease-out]"
                    onClick={() => setIsModalOpen(false)}
                >
                    <button 
                        className="absolute top-6 right-6 text-white bg-black/50 hover:bg-black p-3 rounded-full transition-colors"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <FaTimes className="size-6" />
                    </button>
                    <img 
                        src={pet.imageUrls?.[activeImageIndex] || "https://via.placeholder.com/600"} 
                        alt="Zoomed Pet" 
                        className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
                    />
                </div>
            )}
        </div>
    );

}