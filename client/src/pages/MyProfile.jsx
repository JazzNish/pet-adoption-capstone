import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaCalendarAlt, FaPaw, FaHome, FaEdit, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import PetCard from '../components/PetCard';

export default function MyProfile() {
    const localUser = JSON.parse(localStorage.getItem('furever_user'));
    const token = localStorage.getItem('token');
    
    // --- STATE ---
    const [profileUser, setProfileUser] = useState(null);
    const [userPets, setUserPets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('available'); 
    
    // Inline Edit State
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [aboutText, setAboutText] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchMyData = async () => {
            if (!localUser?.id) return;
            try {
                const userRes = await fetch(`https://pet-adoption-capstone.onrender.com/api/users/${localUser.id}/public`);
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setProfileUser(userData);
                    setAboutText(userData.about || "");
                }

                const petsRes = await fetch(`https://pet-adoption-capstone.onrender.com/api/pets/my-pets/${localUser.id}`);
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

        fetchMyData();
    }, [localUser?.id]);

    // --- SAVE ABOUT ME ---
    const handleSaveAbout = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('https://pet-adoption-capstone.onrender.com/api/users/profile', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ about: aboutText })
            });

            if (res.ok) {
                setProfileUser({ ...profileUser, about: aboutText });
                setIsEditingAbout(false);
            } else {
                alert("Failed to save description.");
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("Network error while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    // --- FILTER LOGIC & ROLE CHECK ---
    const isAdopter = profileUser?.role === 'adopter';
    const availablePets = userPets.filter(pet => pet.status === 'Available');
    const rehomedPets = userPets.filter(pet => pet.status === 'Adopted');

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-cover">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-star"></div>
            </div>
        );
    }

    if (!profileUser) return <div className="min-h-screen flex justify-center items-center bg-cover">Please log in.</div>;

    return (
        <div className="min-h-screen bg-cover pb-12 animate-[fade-in-up_0.4s_ease-out]">
            
            {/* --- HEADER --- */}
            <div className="h-64 w-full bg-button relative">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                
                {/* --- USER INFO CARD --- */}
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-200/60 p-8 mb-8">
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-20 sm:-mt-24 mb-6">
                        <div className="size-32 sm:size-40 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                            <img 
                                src={profileUser.profilePicture || "/src/assets/noUser.png"} 
                                alt={profileUser.name} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        
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

                    {/* --- INLINE EDIT ABOUT ME SECTION --- */}
                    {isEditingAbout ? (
                        <div className="mb-8 bg-cover/30 p-4 rounded-2xl border border-gray-200/60">
                            <label className="text-xs font-bold uppercase tracking-wider text-subtitle mb-2 block">Edit Your Description</label>
                            <textarea
                                value={aboutText}
                                onChange={(e) => setAboutText(e.target.value)}
                                className="w-full p-4 border border-gray-200 rounded-xl focus:border-star outline-none resize-none h-28 text-title font-medium bg-white shadow-inner transition-colors"
                                placeholder={isAdopter ? "Hi, I am looking for a new furry friend to join my family..." : "Hi, I am passionate about rescuing animals..."}
                            />
                            <div className="flex gap-3 mt-3">
                                <button onClick={handleSaveAbout} disabled={isSaving} className="bg-button hover:bg-hovered-button text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50">
                                    {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />} Save Changes
                                </button>
                                <button onClick={() => { setIsEditingAbout(false); setAboutText(profileUser.about || ""); }} className="bg-white border border-gray-300 text-title hover:bg-gray-50 px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
                                    <FaTimes /> Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-8 max-w-2xl group flex flex-col sm:flex-row items-start gap-4">
                            <p className="text-subtitle font-medium leading-relaxed">
                                {profileUser.about || `Hi, I'm ${profileUser.name}! ${isAdopter ? "I am excited to find a new pet to adopt!" : "I am passionate about helping animals find their perfect, loving forever homes."} Edit this description to tell others more about yourself!`}
                            </p>
                            <button 
                                onClick={() => setIsEditingAbout(true)} 
                                className="text-gray-400 hover:text-star opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-cover hover:bg-star/10 rounded-lg flex items-center gap-2 text-sm font-bold"
                            >
                                <FaEdit className="size-4" /> <span className="sm:hidden">Edit Description</span>
                            </button>
                        </div>
                    )}

                    {/* Quick Stats Row (Dynamically Changes based on Role) */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-gray-100 pt-8">
                        {!isAdopter && (
                            <div className="bg-cover/50 rounded-2xl p-4 border border-gray-100 flex items-center gap-4">
                                <div className="bg-white p-3 rounded-xl shadow-sm text-star"><FaPaw className="size-6" /></div>
                                <div>
                                    <p className="text-2xl font-black text-title">{availablePets.length}</p>
                                    <p className="text-xs font-bold text-subtitle uppercase tracking-wider">Looking for Home</p>
                                </div>
                            </div>
                        )}
                        <div className="bg-green-50/50 rounded-2xl p-4 border border-green-100 flex items-center gap-4">
                            <div className="bg-white p-3 rounded-xl shadow-sm text-green-500"><FaHome className="size-6" /></div>
                            <div>
                                <p className="text-2xl font-black text-title">{isAdopter ? userPets.length : rehomedPets.length}</p>
                                <p className="text-xs font-bold text-subtitle uppercase tracking-wider">
                                    {isAdopter ? "Adopted" : "Successfully Rehomed"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CONTENT TABS / HEADER --- */}
                {isAdopter ? (
                    <div className="mb-6 border-b border-gray-200/60 pb-4">
                        <h2 className="text-xl font-bold text-title">Adopted Pets ({userPets.length})</h2>
                    </div>
                ) : (
                    <div className="mb-6 flex gap-4 border-b border-gray-200/60 pb-px">
                        <button 
                            onClick={() => setActiveTab('available')}
                            className={`pb-4 px-2 font-bold text-sm transition-colors relative ${activeTab === 'available' ? 'text-star' : 'text-subtitle hover:text-title'}`}
                        >
                            My Available Pets ({availablePets.length})
                            {activeTab === 'available' && <div className="absolute bottom-0 left-0 w-full h-1 bg-star rounded-t-full"></div>}
                        </button>
                        
                        <button 
                            onClick={() => setActiveTab('rehomed')}
                            className={`pb-4 px-2 font-bold text-sm transition-colors relative ${activeTab === 'rehomed' ? 'text-title' : 'text-subtitle hover:text-title'}`}
                        >
                            My Success Stories ({rehomedPets.length})
                            {activeTab === 'rehomed' && <div className="absolute bottom-0 left-0 w-full h-1 bg-title rounded-t-full"></div>}
                        </button>
                    </div>
                )}

                {/* --- PET GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isAdopter ? (
                        // 🐶 ADOPTER GRID
                        userPets.length > 0 ? (
                            userPets.map(pet => (
                                <PetCard key={pet._id} id={pet._id} image={pet.imageUrl} name={pet.name} breed={pet.breed} location={pet.location} />
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-subtitle font-medium bg-white rounded-2xl border border-dashed border-gray-300">
                                You haven't adopted any pets yet! Check out the Browse Pets page to find your new best friend.
                            </div>
                        )
                    ) : (
                        // 🏡 REHOMER GRID
                        activeTab === 'available' ? (
                            availablePets.length > 0 ? (
                                availablePets.map(pet => (
                                    <PetCard key={pet._id} id={pet._id} image={pet.imageUrl} name={pet.name} breed={pet.breed} location={pet.location} />
                                ))
                            ) : (
                                <div className="col-span-full py-12 text-center text-subtitle font-medium bg-white rounded-2xl border border-dashed border-gray-300">
                                    You currently have no pets available for adoption.
                                </div>
                            )
                        ) : (
                            rehomedPets.length > 0 ? (
                                rehomedPets.map(pet => (
                                    <div key={pet._id} className="relative group">
                                        <div className="absolute top-4 left-4 z-10 bg-green-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md">Adopted</div>
                                        <div className="opacity-80 grayscale-[20%] transition-all group-hover:grayscale-0 group-hover:opacity-100">
                                            <PetCard id={pet._id} image={pet.imageUrl} name={pet.name} breed={pet.breed} location={pet.location} />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-12 text-center text-subtitle font-medium bg-white rounded-2xl border border-dashed border-gray-300">
                                    No success stories yet. You'll get there!
                                </div>
                            )
                        )
                    )}
                </div>

            </div>
        </div>
    );
}