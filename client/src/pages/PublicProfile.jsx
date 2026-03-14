import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaCalendarAlt, FaPaw, FaHome, FaArrowLeft } from 'react-icons/fa';
import PetCard from '../components/PetCard';

export default function PublicProfile() {
    const { id } = useParams(); // The ID of the user whose profile we are viewing
    
    // --- STATE ---
    const [profileUser, setProfileUser] = useState(null);
    const [userPets, setUserPets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('available'); // 'available' or 'rehomed'

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // 1. Fetch the user's public info
                const userRes = await fetch(`https://pet-adoption-capstone.onrender.com/api/users/${id}/public`);
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setProfileUser(userData);
                }

                // 2. Fetch all pets posted by this user
                const petsRes = await fetch(`https://pet-adoption-capstone.onrender.com/api/pets/my-pets/${id}`);
                if (petsRes.ok) {
                    const petsData = await petsRes.json();
                    setUserPets(petsData);
                }
            } catch (error) {
                console.error("Failed to load profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [id]);

    // --- FILTER PETS FOR TABS ---
    const availablePets = userPets.filter(pet => pet.status === 'Available');
    const rehomedPets = userPets.filter(pet => pet.status === 'Adopted'); // Assuming 'Adopted' is your success status!

    // --- LOADING STATE ---
    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-cover">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-star"></div>
            </div>
        );
    }

    // --- NOT FOUND STATE ---
    if (!profileUser) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-cover gap-4">
                <h1 className="text-3xl font-bold text-title">Profile not found!</h1>
                <Link to="/browse-pets" className="text-star font-bold hover:underline">Go back to Browse Pets</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cover pb-12 animate-[fade-in-up_0.4s_ease-out]">
            
            {/* --- HEADER / COVER PHOTO AREA --- */}
            <div className="h-64 w-full bg-button relative">
                {/* Decorative Pattern for Cover */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                
                {/* Back Button */}
                <div className="absolute top-6 left-6 lg:left-12 z-10">
                    <button onClick={() => window.history.back()} className="flex items-center gap-2 text-white/80 hover:text-white font-bold px-4 py-2 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full transition-all">
                        <FaArrowLeft /> Back
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                
                {/* --- USER INFO CARD --- */}
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-200/60 p-8 mb-8">
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-20 sm:-mt-24 mb-6">
                        {/* Huge Avatar */}
                        <div className="size-32 sm:size-40 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                            <img 
                                src={profileUser.profilePicture || "/src/assets/noUser.png"} 
                                alt={profileUser.name} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        
                        {/* Name & Badges */}
                        <div className="flex-1 pb-2">
                            <h1 className="text-3xl sm:text-4xl font-black text-title flex items-center gap-3">
                                {profileUser.name}
                                {profileUser.idVerificationStatus === 'verified' && (
                                    <span className="flex items-center gap-1 text-[11px] bg-green-50 text-green-600 border border-green-200 px-2.5 py-1 rounded-full uppercase tracking-wider font-bold shadow-sm">
                                        <FaCheckCircle className="size-3" /> Verified
                                    </span>
                                )}
                            </h1>
                            <p className="text-subtitle font-medium mt-1 flex items-center gap-2">
                                <FaCalendarAlt className="text-gray-400" /> Joined {new Date(profileUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* About Me (If you add an 'about' field to the database later, it goes here!) */}
                    <p className="text-subtitle font-medium max-w-2xl leading-relaxed mb-8">
                        {profileUser.about || `Hi, I'm ${profileUser.name}! I am passionate about helping animals find their perfect, loving forever homes. Check out my available pets below!`}
                    </p>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-gray-100 pt-8">
                        <div className="bg-cover/50 rounded-2xl p-4 border border-gray-100 flex items-center gap-4">
                            <div className="bg-white p-3 rounded-xl shadow-sm text-star"><FaPaw className="size-6" /></div>
                            <div>
                                <p className="text-2xl font-black text-title">{availablePets.length}</p>
                                <p className="text-xs font-bold text-subtitle uppercase tracking-wider">Looking for Home</p>
                            </div>
                        </div>
                        <div className="bg-green-50/50 rounded-2xl p-4 border border-green-100 flex items-center gap-4">
                            <div className="bg-white p-3 rounded-xl shadow-sm text-green-500"><FaHome className="size-6" /></div>
                            <div>
                                <p className="text-2xl font-black text-title">{rehomedPets.length}</p>
                                <p className="text-xs font-bold text-subtitle uppercase tracking-wider">Successfully Rehomed</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CONTENT TABS --- */}
                <div className="mb-6 flex gap-4 border-b border-gray-200/60 pb-px">
                    <button 
                        onClick={() => setActiveTab('available')}
                        className={`pb-4 px-2 font-bold text-sm transition-colors relative ${activeTab === 'available' ? 'text-star' : 'text-subtitle hover:text-title'}`}
                    >
                        Available Pets ({availablePets.length})
                        {activeTab === 'available' && <div className="absolute bottom-0 left-0 w-full h-1 bg-star rounded-t-full"></div>}
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('rehomed')}
                        className={`pb-4 px-2 font-bold text-sm transition-colors relative ${activeTab === 'rehomed' ? 'text-title' : 'text-subtitle hover:text-title'}`}
                    >
                        Success Stories ({rehomedPets.length})
                        {activeTab === 'rehomed' && <div className="absolute bottom-0 left-0 w-full h-1 bg-title rounded-t-full"></div>}
                    </button>
                </div>

                {/* --- PET GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeTab === 'available' ? (
                        availablePets.length > 0 ? (
                            availablePets.map(pet => (
                                <PetCard 
                                    key={pet._id} 
                                    id={pet._id} 
                                    image={pet.imageUrls?.[0] || pet.imageUrl} 
                                    name={pet.name} 
                                    breed={pet.breed} 
                                    location={pet.location} 
                                    status={pet.status} // 👈 MUST ADD THIS!
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-subtitle font-medium bg-white rounded-2xl border border-dashed border-gray-300">
                                {profileUser.name} currently has no pets available for adoption.
                            </div>
                        )
                    ) : (
                        rehomedPets.length > 0 ? (
                            rehomedPets.map(pet => (
                                <div key={pet._id} className="relative group">
                                    {/* Small visual overlay to show it's adopted! */}
                                    <div className="absolute top-4 left-4 z-10 bg-green-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md">
                                        Adopted
                                    </div>
                                    <div className="opacity-80 grayscale-[20%] transition-all group-hover:grayscale-0 group-hover:opacity-100">
                                        <PetCard 
                                            id={pet._id} 
                                            image={pet.imageUrls?.[0] || pet.imageUrl} 
                                            name={pet.name} 
                                            breed={pet.breed} 
                                            location={pet.location} 
                                            status={pet.status} // 👈 MUST ADD THIS!
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-subtitle font-medium bg-white rounded-2xl border border-dashed border-gray-300">
                                No success stories yet. Check back later!
                            </div>
                        )
                    )}
                </div>

            </div>
        </div>
    );
}