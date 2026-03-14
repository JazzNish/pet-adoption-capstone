import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCheckCircle, FaCamera, FaSignOutAlt, FaSpinner, FaIdCard, FaClock, FaExclamationTriangle } from 'react-icons/fa';

export default function ProfileSettings() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('furever_user')) || {};
    const token = localStorage.getItem('token');

    // --- PROFILE STATE ---
    const [name, setName] = useState(user.name || "");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(user.profilePicture || "/src/assets/noUser.png");
    
    // --- ID STATE ---
    const [idVerificationStatus, setIdVerificationStatus] = useState(user.idVerificationStatus || 'unverified');
    const [idFile, setIdFile] = useState(null);
    const [idPreview, setIdPreview] = useState(null);

    // --- LOADING STATES ---
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isUploadingId, setIsUploadingId] = useState(false);

    const fileInputRef = useRef(null);
    const idInputRef = useRef(null);

    // --- FETCH FRESH STATUS ON LOAD ---
    useEffect(() => {
        if (!user.id) return;

        const fetchFreshStatus = async () => {
            try {
                // Ask the database for the absolute newest info
                const res = await fetch(`https://pet-adoption-capstone.onrender.com/api/users/${user.id}/public`);
                if (res.ok) {
                    const freshData = await res.json();
                    
                    // We only want to update if the status ACTUALLY changed 
                    // (e.g. going from 'pending' to 'verified')
                    setIdVerificationStatus((prevStatus) => {
                        if (prevStatus !== freshData.idVerificationStatus) {
                            // Update LocalStorage silently in the background!
                            const updatedUser = { ...user, idVerificationStatus: freshData.idVerificationStatus };
                            localStorage.setItem('furever_user', JSON.stringify(updatedUser));
                            
                            // Return the new status to update the screen instantly!
                            return freshData.idVerificationStatus;
                        }
                        return prevStatus;
                    });
                }
            } catch (error) {
                console.error("Failed to fetch fresh user data", error);
            }
        };

        // 1. Check right away when they open the page
        fetchFreshStatus();

        // 2. THE MAGIC: Silently check again every 5 seconds!
        const intervalId = setInterval(fetchFreshStatus, 5000);

        // 3. Clean up the timer if they leave the settings page
        return () => clearInterval(intervalId);
    }, [user.id]);


    // --- HANDLERS ---
    const handleLogout = () => {
        localStorage.removeItem("furever_user");
        localStorage.removeItem("token");
        navigate('/');
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleIdSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIdFile(file);
            setIdPreview(URL.createObjectURL(file));
        }
    };

    // --- SAVE PROFILE (NAME & PHOTO) ---
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);

        try {
            let finalImageUrl = user.profilePicture;

            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append("file", imageFile);
                uploadData.append("upload_preset", "furever_images"); // 👈 PASTE PRESET HERE

                const cloudinaryRes = await fetch(
                    `https://api.cloudinary.com/v1_1/dpuuysbjr/image/upload`, // 👈 PASTE CLOUD NAME HERE
                    { method: "POST", body: uploadData }
                );
                const cloudinaryData = await cloudinaryRes.json();
                if (!cloudinaryRes.ok) throw new Error("Image upload failed");
                finalImageUrl = cloudinaryData.secure_url;
            }

            const res = await fetch('https://pet-adoption-capstone.onrender.com/api/users/profile', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, profilePicture: finalImageUrl })
            });

            const data = await res.json();
            if (res.ok) {
                const updatedUser = { ...user, name: data.name, profilePicture: data.profilePicture };
                localStorage.setItem('furever_user', JSON.stringify(updatedUser));
                alert("Profile updated successfully!");
                window.location.reload(); 
            } else {
                alert(data.message || "Failed to update profile");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while saving.");
        } finally {
            setIsSavingProfile(false);
        }
    };

    // --- SUBMIT ID FOR VERIFICATION ---
    const handleSubmitId = async (e) => {
        e.preventDefault();
        if (!idFile) return alert("Please select an image of your ID first.");

        setIsUploadingId(true);
        try {
            // 1. Upload ID to Cloudinary
            const uploadData = new FormData();
            uploadData.append("file", idFile);
            uploadData.append("upload_preset", "furever_images"); // 👈 PASTE PRESET HERE

            const cloudinaryRes = await fetch(
                `https://api.cloudinary.com/v1_1/dpuuysbjr/image/upload`, // 👈 PASTE CLOUD NAME HERE
                { method: "POST", body: uploadData }
            );
            const cloudinaryData = await cloudinaryRes.json();
            if (!cloudinaryRes.ok) throw new Error("ID upload failed");

            // 2. Send URL to backend to trigger "Pending" status
            const res = await fetch('https://pet-adoption-capstone.onrender.com/api/users/submit-id', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ idDocumentUrl: cloudinaryData.secure_url })
            });

            const data = await res.json();
            if (res.ok) {
                // Update local status to Pending
                const updatedUser = { ...user, idVerificationStatus: 'pending' };
                localStorage.setItem('furever_user', JSON.stringify(updatedUser));
                setIdVerificationStatus('pending');
                alert("ID submitted successfully! An admin will review it shortly.");
            } else {
                alert(data.message || "Failed to submit ID");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while uploading your ID.");
        } finally {
            setIsUploadingId(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 animate-[fade-in-up_0.4s_ease-out]">
            <div className="max-w-3xl mx-auto space-y-8">
                
                <div>
                    <h1 className="text-3xl font-extrabold text-title">Account Settings</h1>
                    <p className="text-subtitle font-medium mt-1">Manage your profile and verification status.</p>
                </div>

                <div className="">
                    
                    {/* --- PROFILE SECTION --- */}
                    <div className="p-8 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-title flex items-center gap-2 mb-6">
                            <FaUser className="text-star" /> Public Profile
                        </h2>
                        
                        <form onSubmit={handleSaveProfile} className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="flex flex-col items-center gap-3">
                                <div 
                                    className="relative size-32 rounded-full overflow-hidden border-4 border-cover group cursor-pointer shadow-sm"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <FaCamera className="text-white size-8" />
                                    </div>
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleImageSelect} className="hidden" accept="image/*" />
                                <span className="text-xs text-subtitle font-semibold">Click to change photo</span>
                            </div>

                            <div className="flex-1 w-full space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-subtitle mb-1">Full Name</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-star text-title font-medium transition-colors bg-cover/30" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-subtitle mb-1">Email Address</label>
                                    <input type="email" value={user.email || ""} disabled className="w-full border border-gray-200 rounded-xl p-3 outline-none bg-gray-50 text-gray-500 font-medium cursor-not-allowed" />
                                </div>
                                <button type="submit" disabled={isSavingProfile} className="mt-4 bg-button hover:bg-hovered-button text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-70 flex items-center gap-2">
                                    {isSavingProfile && <FaSpinner className="animate-spin" />}
                                    {isSavingProfile ? "Saving..." : "Save Profile"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* --- IDENTITY VERIFICATION SECTION --- */}
                    <div className="p-8 border-b border-gray-100 bg-cover/30">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-title flex items-center gap-2 mb-1">
                                    <FaIdCard className="text-star" /> Identity Verification
                                </h2>
                                <p className="text-sm text-subtitle font-medium max-w-lg">
                                    To ensure the safety of our pets, all users must provide a valid government-issued ID before they can post or apply to adopt.
                                </p>
                            </div>
                        </div>

                        {/* STATUS: VERIFIED */}
                        {idVerificationStatus === 'verified' && (
                            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center gap-4">
                                <div className="bg-green-100 p-3 rounded-full text-green-600"><FaCheckCircle className="size-6" /></div>
                                <div>
                                    <h3 className="text-green-800 font-bold text-lg">Identity Verified</h3>
                                    <p className="text-green-600 text-sm font-medium">Thank you! You have full access to adopt and rehome pets.</p>
                                </div>
                            </div>
                        )}

                        {/* STATUS: PENDING */}
                        {idVerificationStatus === 'pending' && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 flex items-center gap-4">
                                <div className="bg-yellow-100 p-3 rounded-full text-yellow-600"><FaClock className="size-6" /></div>
                                <div>
                                    <h3 className="text-yellow-800 font-bold text-lg">Verification Pending Review</h3>
                                    <p className="text-yellow-600 text-sm font-medium">We received your ID. Our team is reviewing it and will update your status shortly.</p>
                                </div>
                            </div>
                        )}

                        {/* STATUS: UNVERIFIED */}
                        {(idVerificationStatus === 'unverified' || !idVerificationStatus) && (
                            <div className="bg-white border border-red-200 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4 text-red-500">
                                    <FaExclamationTriangle className="size-5" />
                                    <h3 className="font-bold">Verification Required</h3>
                                </div>
                                
                                <form onSubmit={handleSubmitId}>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => idInputRef.current.click()}>
                                        {idPreview ? (
                                            <img src={idPreview} alt="ID Preview" className="h-40 object-contain rounded-lg shadow-sm" />
                                        ) : (
                                            <>
                                                <FaCamera className="size-8 text-gray-300 mb-3" />
                                                <p className="text-title font-bold">Click to upload Government ID</p>
                                                <p className="text-xs text-subtitle mt-1">Driver's License, Passport, or National ID</p>
                                            </>
                                        )}
                                        <input type="file" ref={idInputRef} onChange={handleIdSelect} className="hidden" accept="image/*" />
                                    </div>
                                    
                                    <button type="submit" disabled={isUploadingId || !idFile} className="mt-4 w-full bg-button hover:bg-hovered-button text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center gap-2">
                                        {isUploadingId && <FaSpinner className="animate-spin" />}
                                        {isUploadingId ? "Uploading ID..." : "Submit ID for Verification"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* --- DANGER ZONE --- */}
                    <div className="p-8 bg-red-50/50 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-red-600">Log Out of FurEver</h3>
                            <p className="text-xs text-red-400 font-medium">You will need to sign back in to access your account.</p>
                        </div>
                        <button onClick={handleLogout} className="bg-white text-red-500 border border-red-200 hover:bg-red-50 font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-sm">
                            <FaSignOutAlt /> Log Out
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}