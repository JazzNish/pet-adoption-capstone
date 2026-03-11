import React, { useState, useEffect } from 'react';
import { FiEdit2, FiEye, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

export default function MyPets() {
    const [pets, setPets] = useState([]);
    const [filter, setFilter] = useState('All Pets');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [imageFiles, setImageFiles] = useState([]); 
    const [imagePreviews, setImagePreviews] = useState([]);

    // Get the logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem('furever_user'));

    // --- FORM STATE ---
    const [formData, setFormData] = useState({
        name: '',
        species: 'Dog',
        breed: '',
        age: '',
        ageUnit: 'Years', 
        weight: '',       
        weightUnit: 'kg', 
        gender: 'Male', 
        location: '',   
        healthInfo: '', 
        description: '',
        imageUrls: [] 
    });

    // --- FETCH PETS ON LOAD ---
    useEffect(() => {
        if (user && user.id) {
            fetchPets();
        }
    }, [user]);

    // --- FETCH PETS LOGIC ---
    const fetchPets = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/pets/my-pets/${user.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setPets(data);
            }
        } catch (error) {
            console.error("Network error! Backend didn't answer.");
        }
    };

    // --- AUTO GET LOCATION ---
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsFetchingLocation(true);

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await res.json();
                
                const address = data.address;
                const city = address.city || address.town || address.village || "";
                const region = address.state || address.region || "";
                const formattedLocation = `${city}, ${region}`.replace(/^, /, '').trim();
                
                setFormData({ ...formData, location: formattedLocation || data.display_name });
            } catch (error) {
                alert("Could not convert coordinates to an address.");
            } finally {
                setIsFetchingLocation(false);
            }
        }, () => {
            alert("Please allow location access in your browser pop-up.");
            setIsFetchingLocation(false);
        });
    };

    // --- SUBMIT NEW PET (CLOUDINARY) ---
    const handleAddPet = async (e) => {
        e.preventDefault();
        
        if (imageFiles.length === 0) {
            alert("Please select at least one image for the pet!");
            return;
        }

        setIsLoading(true);

        try {
            // Upload ALL images to Cloudinary at the same time!
            const uploadPromises = imageFiles.map(async (file) => {
                const uploadData = new FormData();
                uploadData.append("file", file);
                uploadData.append("upload_preset", "furever_images"); 

                const res = await fetch(`https://api.cloudinary.com/v1_1/dpuuysbjr/image/upload`, {
                    method: "POST",
                    body: uploadData,
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error.message);
                return data.secure_url;
            });

            // Wait for all uploads to finish and get the array of URLs
            const uploadedImageUrls = await Promise.all(uploadPromises);

            // NOW SEND EVERYTHING TO MONGODB
            const petPayload = { 
                ...formData, 
                imageUrls: uploadedImageUrls,
                owner: user.id 
            };
            
            const token = localStorage.getItem('token'); 

            const res = await fetch('http://localhost:5000/api/pets', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(petPayload)
            });
            
            if (res.ok) {
                setIsModalOpen(false); 
                // Reset everything
                setFormData({ name: '', species: 'Dog', breed: '', age: '', ageUnit: 'Years', weight: '', weightUnit: 'kg', gender: 'Male', location: '', healthInfo: '', description: '', imageUrls: [] });
                setImageFiles([]);
                setImagePreviews([]);
                fetchPets(); // Refresh the grid!
            } else {
                const errorData = await res.json();
                alert(`Failed to save pet: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error saving pet or uploading image:", error);
            alert("An error occurred while uploading. Check console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper functions for styling
    const getStatusStyle = (status) => status === 'Available' ? 'text-green-600' : status === 'Pending' ? 'text-yellow-600' : 'text-gray-500';
    const getStatusDot = (status) => status === 'Available' ? 'bg-green-500' : status === 'Pending' ? 'bg-yellow-500' : 'bg-gray-400';

    // Filter Logic
    const filteredPets = pets.filter(pet => filter === 'All Pets' ? true : pet.status === filter);

    return (
        <div className="min-h-screen p-8 lg:p-12">
            <div className="max-w-7xl mx-auto">
                
                {/* --- HEADER --- */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-[#1E293B] mb-2 tracking-tight">Manage Your Pets</h1>
                        <p className="text-gray-500 font-medium">Keep track of your current residents and their adoption journey.</p>
                    </div>
                </div>

                {/* --- FILTERS --- */}
                <div className="flex gap-3 mb-8">
                    {['All Pets', 'Available', 'Pending', 'Adopted'].map((f) => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 rounded-full font-semibold text-sm border ${filter === f ? 'bg-[#1E293B] text-white border-[#1E293B]' : 'bg-white text-gray-600 border-gray-200'}`}>
                            {f}
                        </button>
                    ))}
                </div>

                {/* --- PET GRID --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredPets.map((pet) => (
                        <div key={pet._id} className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 flex flex-col">
                            <div className="relative h-48 w-full bg-gray-100">
                                {/* Use the first image in the array as the thumbnail! */}
                                <img src={pet.imageUrls?.[0] || pet.imageUrl} alt={pet.name} className={`w-full h-full object-cover ${pet.status === 'Adopted' ? 'grayscale opacity-80' : ''}`} />
                                <div className="absolute top-3 left-3 bg-white/95 px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm">
                                    <div className={`size-2 rounded-full ${getStatusDot(pet.status)}`}></div>
                                    <span className={getStatusStyle(pet.status)}>{pet.status}</span>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                                    <h3 className="text-white text-2xl font-bold">{pet.name}</h3>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex justify-between items-center mb-5">
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-400 tracking-wider">SPECIES</p>
                                        <p className="font-bold text-gray-800">{pet.species}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] font-bold text-gray-400 tracking-wider">AGE</p>
                                        <p className="font-bold text-gray-800">{pet.age} {pet.ageUnit}</p>
                                    </div>
                                </div>
                                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between px-2">
                                    <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-500"><FiEdit2 /><span className="text-[11px] font-bold">Edit</span></button>
                                    <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-800"><FiEye /><span className="text-[11px] font-bold">View</span></button>
                                    <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-red-500"><FiTrash2 /><span className="text-[11px] font-bold">Delete</span></button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div onClick={() => setIsModalOpen(true)} className="border-2 border-dashed border-gray-200 rounded-[24px] p-6 flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer min-h-[350px]">
                        <div className="size-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 mb-4"><FiPlus className="size-6" /></div>
                        <h3 className="text-lg font-bold text-[#1E293B]">List a new pet</h3>
                    </div>
                </div>

                {/* --- ADD PET MODAL --- */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                        <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative animate-[fade-in-up_0.3s_ease-out]">
                            
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 bg-gray-100 p-2 rounded-full">
                                <FiX className="size-5" />
                            </button>

                            <h2 className="text-3xl font-bold text-title mb-6">Add a New Pet</h2>

                            <form onSubmit={handleAddPet} className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="text-sm font-bold text-gray-700 block mb-1">Pet's Name</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:border-[#F97316]" placeholder="e.g. Luna" />
                                </div>
                                <div className="col-span-2 sm:col-span-1 grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-sm font-bold text-gray-700 block mb-1">Species</label>
                                        <select value={formData.species} onChange={e => setFormData({...formData, species: e.target.value})} className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:border-[#F97316]">
                                            <option value="Dog">Dog</option>
                                            <option value="Cat">Cat</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#1c1e21] mb-1">Gender</label>
                                        <select 
                                            value={formData.gender}
                                            onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                            className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-gray-500 font-medium"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-span-2 sm:col-span-1">
                                    <label className="text-sm font-bold text-gray-700 block mb-1">Breed</label>
                                    <input type="text" value={formData.breed} onChange={e => setFormData({...formData, breed: e.target.value})} className="w-full border border-gray-300 p-3 rounded-xl outline-none" placeholder="e.g. Golden Retriever" />
                                </div>
                                
                                <div className="col-span-2 sm:col-span-1 grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-sm font-bold text-gray-700 block mb-1">Age</label>
                                        <input type="number" required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full border border-gray-300 p-3 rounded-xl outline-none" placeholder="e.g. 2" min={1}/>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-700 block mb-1">Unit</label>
                                        <select value={formData.ageUnit} onChange={e => setFormData({...formData, ageUnit: e.target.value})} className="w-full border border-gray-300 p-3 rounded-xl outline-none">
                                            <option value="Months">Months</option>
                                            <option value="Years">Years</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#1c1e21] mb-2">Weight</label>
                                    <div className="flex gap-1">
                                        <input 
                                            type="number" required min="0" step="0.1" placeholder="e.g. 5"
                                            value={formData.weight}
                                            onChange={(e) => setFormData({...formData, weight: e.target.value})}
                                            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-gray-500 font-medium"
                                        />
                                        <select 
                                            value={formData.weightUnit}
                                            onChange={(e) => setFormData({...formData, weightUnit: e.target.value})}
                                            className="border border-gray-200 rounded-xl p-2 outline-none focus:border-gray-500 font-bold"
                                        >
                                            <option value="kg">kg</option>
                                            <option value="lbs">lbs</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-span-2 sm:col-span-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-sm font-bold text-gray-700">Location</label>
                                        <button 
                                            type="button" 
                                            onClick={handleGetLocation}
                                            disabled={isFetchingLocation}
                                            className="text-[11px] font-bold text-[#F97316] hover:text-[#EA580C] bg-[#F97316]/10 px-2 py-1 rounded-md transition-colors disabled:opacity-50"
                                        >
                                            {isFetchingLocation ? "Locating..." : "📍 Get My Location"}
                                        </button>
                                    </div>
                                    <input 
                                        type="text" required 
                                        value={formData.location} 
                                        onChange={e => setFormData({...formData, location: e.target.value})} 
                                        className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:border-[#F97316]" 
                                        placeholder="e.g. Quezon City, Metro Manila" 
                                    />
                                </div>

                                {/* Health Information Box */}
                                <div className='col-span-2'>
                                    <label className="block text-sm font-bold text-[#1c1e21] mb-2">Health & Medical Info</label>
                                    <textarea 
                                        required rows="2"
                                        placeholder="e.g. Fully vaccinated, dewormed, and spayed/neutered."
                                        value={formData.healthInfo}
                                        onChange={(e) => setFormData({...formData, healthInfo: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-gray-500 resize-none font-medium"
                                    ></textarea>
                                </div>

                                {/* 🚨 THE NEW MAGIC APPEND IMAGE SECTION 🚨 */}
                                <div className="col-span-2">
                                    <label className="text-sm font-bold text-gray-700 block mb-2">Pet Photos (1 to 5)</label>
                                    
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        multiple 
                                        required={imageFiles.length === 0} 
                                        onChange={(e) => {
                                            const newFiles = Array.from(e.target.files);
                                            // THIS LINE RIGHT HERE COMBINES OLD AND NEW PICTURES!
                                            const combinedFiles = [...imageFiles, ...newFiles]; 

                                            if (combinedFiles.length > 5) {
                                                alert("You can only upload a maximum of 5 images.");
                                                return;
                                            }

                                            setImageFiles(combinedFiles);
                                            setImagePreviews(combinedFiles.map(file => URL.createObjectURL(file)));
                                            
                                            // Reset the HTML input so you can click the same file twice if needed
                                            e.target.value = ''; 
                                        }} 
                                        className="w-full border border-gray-300 p-2.5 rounded-xl outline-none text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#F97316]/10 file:text-[#F97316] hover:file:bg-[#F97316]/20 transition-colors cursor-pointer mb-3" 
                                    />

                                    {/* Previews Grid */}
                                    {imagePreviews.length > 0 && (
                                        <div className="relative border border-gray-200 rounded-xl p-4 bg-gray-50">
                                            <button 
                                                type="button" 
                                                onClick={() => { setImageFiles([]); setImagePreviews([]); }}
                                                className="absolute top-2 right-2 bg-white p-1.5 rounded-full text-red-500 hover:bg-red-50 shadow-sm z-10"
                                            >
                                                <FiX className="size-4" />
                                            </button>
                                            
                                            <div className="flex gap-3 overflow-x-auto pr-8">
                                                {imagePreviews.map((src, index) => (
                                                    <img key={index} src={src} alt="Preview" className="h-24 w-24 object-cover rounded-xl border border-gray-200 flex-shrink-0 shadow-sm" />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <label className="text-sm font-bold text-gray-700 block mb-1">Description</label>
                                    <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 p-3 rounded-xl outline-none resize-none" placeholder="Tell us about their personality!"></textarea>
                                </div>

                                <div className="col-span-2 mt-4">
                                    <button disabled={isLoading} type="submit" className="w-full bg-[#1E293B] hover:bg-black text-white font-bold py-4 rounded-xl transition-colors shadow-sm disabled:opacity-70">
                                        {isLoading ? "Saving Pet..." : "List Pet for Adoption"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}