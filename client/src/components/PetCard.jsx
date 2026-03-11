import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaHeart } from 'react-icons/fa';

const PetCard = ({
    id,
    image, 
    name = 'Pet Name',
    breed = 'Breed',
    age = 'Age',
    gender = 'Gender',
    location = 'Location',
    status = 'Available', // 👈 Added status prop!
    isSaved, 
    onSave   
}) => {

    const isAvailable = status === 'Available';

    return (
        <div className="bg-white overflow-hidden relative rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full">
            
            {/* Image Section */}
            <div className="relative w-full h-56 overflow-hidden bg-gray-50">
                <img
                    src={image}
                    alt={name}
                    className={`object-center object-cover w-full h-full transition-all duration-300 ${!isAvailable ? 'grayscale opacity-75 blur-[1px]' : ''}`}
                />
                
                {/* 🚨 THE UNAVAILABLE OVERLAY 🚨 */}
                {!isAvailable && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                        <span className="bg-white/90 backdrop-blur-sm text-[#1c1e21] font-black px-4 py-2 rounded-xl text-sm uppercase tracking-wider shadow-lg">
                            {status === 'Pending' ? 'Adoption Pending' : 'Adopted'}
                        </span>
                    </div>
                )}

                {/* The dynamic heart button (Stays above the overlay so they can still unsave it!) */}
                <button 
                    onClick={onSave} 
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all shadow-sm z-20"
                >
                    <FaHeart className={isSaved ? "text-red-500 size-5" : "text-gray-300 size-5 hover:text-red-300 transition-colors"} />
                </button>
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-1">
                {/* Name */}
                <h2 className={`font-black text-xl mb-1 ${!isAvailable ? 'text-gray-400' : 'text-[#1c1e21]'}`}>
                    {name}
                </h2>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-gray-500 font-medium text-sm mb-4">
                    <FaMapMarkerAlt className={isAvailable ? "text-red-500" : "text-gray-400"} />
                    <span>{location}</span>
                </div>

                {/* Buttons - Pushed to the bottom */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                    {isAvailable ? (
                        <Link 
                            to={`/pet-details/${id}`} 
                            className="block w-full bg-white hover:bg-gray-50 border border-gray-200 text-[#1c1e21] font-bold py-2.5 rounded-xl transition-colors text-center shadow-sm"
                        >
                            View Details
                        </Link>
                    ) : (
                        <button 
                            disabled 
                            className="w-full bg-gray-50 border border-gray-100 text-gray-400 font-bold py-2.5 rounded-xl cursor-not-allowed"
                        >
                            No Longer Available
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PetCard;