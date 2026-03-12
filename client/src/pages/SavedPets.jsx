import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaSpinner } from 'react-icons/fa';
import PetCard from '../components/PetCard';

export default function SavedPets() {
    const [savedPets, setSavedPets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('token');

    // --- FETCH THE SAVED PETS ---
    useEffect(() => {
        const fetchSavedPets = async () => {
            try {
                const res = await fetch('localhost:5000/api/users/saved-pets', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    setSavedPets(await res.json());
                }
            } catch (error) {
                console.error("Failed to load saved pets:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSavedPets();
    }, [token]);

    // --- REMOVE FROM SAVED LIST ---
    const handleUnsavePet = async (petId, e) => {
        e.preventDefault(); 
        
        try {
            const res = await fetch(`localhost:5000/api/users/save-pet/${petId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                // Instantly remove the pet from the screen without refreshing!
                setSavedPets(prevPets => prevPets.filter(pet => pet._id !== petId));
            }
        } catch (error) {
            console.error("Error unsaving pet:", error);
        }
    };

    if (isLoading) return <div className="min-h-screen flex justify-center items-center"><FaSpinner className="animate-spin size-12 text-[#1c1e21]" /></div>;

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#fdfdfd] py-10 px-4 sm:px-6 lg:px-8 animate-[fade-in-up_0.4s_ease-out]">
            <div className="max-w-6xl mx-auto">
                
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-[#1c1e21]">Saved Pets</h1>
                    <p className="text-gray-500 font-medium mt-1">Your personal wishlist of furry friends.</p>
                </div>

                {/* Grid or Empty State */}
                {savedPets.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-dashed border-gray-300 py-24 flex flex-col items-center justify-center text-center shadow-sm">
                        <FaHeartbeat className="size-16 text-gray-200 mb-4" />
                        <h2 className="text-2xl font-bold text-[#1c1e21]">No saved pets yet!</h2>
                        <p className="text-gray-500 font-medium mt-2 mb-6 max-w-sm">When you see a pet you love on the Browse Pets page, click the heart icon to save them here.</p>
                        <Link to="/browse-pets" className="bg-[#1c1e21] hover:bg-black text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-sm">
                            Browse Available Pets
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {savedPets.map(pet => (
                            <PetCard 
                                key={pet._id}
                                id={pet._id}
                                image={pet.imageUrl}
                                name={pet.name}
                                breed={pet.breed || "Mixed Breed"} 
                                location={pet.location}
                                status={pet.statues}
                                isSaved={true} // It's on the saved page, so it's always true!
                                onSave={(e) => handleUnsavePet(pet._id, e)} // Clicking it removes it
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}