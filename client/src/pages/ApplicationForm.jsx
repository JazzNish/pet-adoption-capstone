import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPaperPlane, FaSpinner } from 'react-icons/fa';

export default function ApplicationForm() {
    const { petId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [pet, setPet] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 👇 1. ADD THE NEW FIELDS TO STATE
    const [formData, setFormData] = useState({
        contactNumber: '',
        salary: '',
        livingSituation: 'Own House',
        otherPets: 'None',
        experience: '',
        reason: ''
    });

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const res = await fetch(`pet-adoption-capstone.vercel.app/api/pets/${petId}`);
                if (res.ok) setPet(await res.json());
            } catch (error) {
                console.error("Failed to load pet:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPet();
    }, [petId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('pet-adoption-capstone.vercel.app/api/applications/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                // 👇 2. SEND THE FULL DATA TO BACKEND
                body: JSON.stringify({
                    petId: pet._id,
                    rehomerId: pet.owner._id || pet.owner,
                    ...formData,
                    salary: Number(formData.salary)
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert("Application submitted successfully! The Rehomer will review it soon.");
                navigate('/my-applications'); 
            } else {
                alert(data.message || "Failed to submit application.");
            }
        } catch (error) {
            console.error("Submit error:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="min-h-screen flex justify-center items-center"><FaSpinner className="animate-spin size-12 text-[#1c1e21]" /></div>;

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#fdfdfd] py-10 px-4 sm:px-6 lg:px-8 animate-[fade-in-up_0.3s_ease-out]">
            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)]">
                
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-[#1c1e21] transition-colors p-2 bg-gray-50 rounded-full">
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-[#1c1e21]">Adoption Application</h1>
                        <p className="text-gray-500 font-medium text-sm">You are applying to adopt <span className="font-bold text-[#1c1e21]">{pet?.name}</span></p>
                    </div>
                </div>

                {/* Pet Preview */}
                <div className="flex items-center gap-4 p-4 mb-8 bg-gray-50 rounded-2xl border border-gray-100">
                    <img src={pet?.imageUrls?.[0] || pet?.imageUrl} alt={pet?.name} className="size-16 rounded-xl object-cover" />
                    <div>
                        <h3 className="font-bold text-[#1c1e21]">{pet?.name}</h3>
                        <p className="text-sm text-gray-500 font-medium">{pet?.breed}</p>
                    </div>
                </div>

                {/* The Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Contact Number */}
                        <div>
                            <label className="block text-sm font-bold text-[#1c1e21] mb-2">Contact Number</label>
                            <input 
                                type="tel" required placeholder="e.g. 09123456789"
                                value={formData.contactNumber}
                                onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-gray-500 transition-colors bg-gray-50 focus:bg-white font-medium"
                            />
                        </div>
                        {/* Salary */}
                        <div>
                            <label className="block text-sm font-bold text-[#1c1e21] mb-2">Monthly Salary (₱)</label>
                            <input 
                                type="number" required min="0" placeholder="e.g. 25000"
                                value={formData.salary}
                                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-gray-500 transition-colors bg-gray-50 focus:bg-white font-medium"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Living Situation */}
                        <div>
                            <label className="block text-sm font-bold text-[#1c1e21] mb-2">Where will the pet live?</label>
                            <select 
                                value={formData.livingSituation}
                                onChange={(e) => setFormData({...formData, livingSituation: e.target.value})}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-gray-500 transition-colors bg-gray-50 focus:bg-white font-medium"
                            >
                                <option value="Own House">Own House</option>
                                <option value="Renting - Pet Friendly">Renting (Pet Friendly)</option>
                                <option value="Apartment/Condo">Apartment / Condo</option>
                            </select>
                        </div>
                        {/* Other Pets */}
                        <div>
                            <label className="block text-sm font-bold text-[#1c1e21] mb-2">Other pets at home?</label>
                            <input 
                                type="text" required placeholder="e.g. None, or 1 Cat"
                                value={formData.otherPets}
                                onChange={(e) => setFormData({...formData, otherPets: e.target.value})}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-gray-500 transition-colors bg-gray-50 focus:bg-white font-medium"
                            />
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-bold text-[#1c1e21] mb-2">Why do you want to adopt this pet?</label>
                        <textarea 
                            required rows="3" placeholder="Tell the rehomer why you are the perfect match..."
                            value={formData.reason}
                            onChange={(e) => setFormData({...formData, reason: e.target.value})}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-gray-500 transition-colors bg-gray-50 focus:bg-white resize-none"
                        ></textarea>
                    </div>

                    {/* Experience */}
                    <div>
                        <label className="block text-sm font-bold text-[#1c1e21] mb-2">Previous pet experience?</label>
                        <textarea 
                            required rows="3" placeholder="Have you owned a pet before? How many hours will they be alone?"
                            value={formData.experience}
                            onChange={(e) => setFormData({...formData, experience: e.target.value})}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-gray-500 transition-colors bg-gray-50 focus:bg-white resize-none"
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-[#1c1e21] hover:bg-black text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-70 mt-4"
                    >
                        {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                    </button>
                </form>

            </div>
        </div>
    );
}