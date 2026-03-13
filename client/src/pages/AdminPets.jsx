import { useState, useEffect } from "react";
import { FaTrash, FaEye } from "react-icons/fa";

export default function AdminPets() {
    const [pets, setPets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                // Testing locally first!
                const response = await fetch('http://localhost:5000/api/pets/admin/all', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setPets(data);
                }
            } catch (error) {
                console.error("Failed to fetch pets:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPets();
    }, []);

    const handleDeletePet = async (petId) => {
        if (!window.confirm("WARNING: Are you sure you want to remove this pet listing?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/pets/admin/${petId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            if (response.ok) {
                setPets(pets.filter(pet => pet._id !== petId));
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.error("Error deleting pet:", error);
        }
    };

    return (
        <div className="animate-[fade-in-up_0.5s_ease-in-out]">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Pet Listings</h1>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600 uppercase tracking-wider">
                                <th className="p-4 font-semibold">Pet Details</th>
                                <th className="p-4 font-semibold">Rehomer / Owner</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr><td colSpan="4" className="p-8 text-center text-gray-500">Loading pets...</td></tr>
                            ) : pets.length === 0 ? (
                                <tr><td colSpan="4" className="p-8 text-center text-gray-500">No pets have been listed on the platform yet.</td></tr>
                            ) : (
                                pets.map((pet) => (
                                    <tr key={pet._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 flex items-center gap-4">
                                            {pet.imageUrl ? (
                                                <img src={pet.imageUrl} alt={pet.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xs">No img</div>
                                            )}
                                            <div>
                                                <div className="font-bold text-gray-900">{pet.name}</div>
                                                <div className="text-sm text-gray-500">{pet.species} • {pet.breed}</div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {/* Using the populated data! */}
                                            <div className="font-bold text-gray-700">{pet.rehomerId?.name || "Unknown"}</div>
                                            <div className="text-sm text-gray-500">{pet.rehomerId?.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                pet.status === 'Available' ? 'bg-green-100 text-green-700' :
                                                pet.status === 'Adopted' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                                {pet.status}
                                            </span>
                                        </td>
                                        <td className="p-4 flex justify-end gap-3">
                                            <button 
                                                onClick={() => handleDeletePet(pet._id)}
                                                className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors font-bold text-sm flex items-center gap-2"
                                            >
                                                <FaTrash /> Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}