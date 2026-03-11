import { useEffect } from "react";
import { useLocation, Link,  useNavigate} from "react-router-dom";

import Footer from "../components/Footer";

{/* Icons */}
import { FaArrowRight,  FaCircleCheck, FaHandHoldingHeart, } from "react-icons/fa6";
import { IoChatbubbles, IoSearch, IoCalendarNumber, IoHome  } from "react-icons/io5";
import { MdOutlineShield } from "react-icons/md";
import { LuHandshake, } from "react-icons/lu";



function LandingPage () {

    const navigate = useNavigate();

    // useEffect(() => {
    //     const user = localStorage.getItem('furever_user');
    //     if(user){
    //         const userInfo = JSON.parse(user);
    //         {userInfo.role === 'adopter' && 
    //             navigate('/adopter-dashboard')
    //         }
    //         {userInfo.role === 'rehomer' && 
    //             navigate('/rehomer-dashboard')
    //         }
    //     }
    // })

    const { hash } = useLocation();

    useEffect(() => {
        // If the URL has a #hash (like #how-it-works)
        if (hash) {
            const element = document.getElementById(hash.replace("#", ""));
            if (element) {
                // Wait a tiny bit for page to load, then scroll
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 100);
            }
        }
    }, [hash]);

    const handleAbout = (e) => {
        e.preventDefault(); // Stop standard link behavior
        
        if (location.pathname === "/") {
            // If on homepage, find the section and scroll immediately
            const element = document.getElementById("about");
            if (element) {
                // The setTimeout ensures the browser doesn't get confused
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 10);
            }
        } else {
            // If on another page (like Browse), go to home with the hash
            navigate("/#about");
        }
    };

    return (
        <>
        <main className="flex flex-col h-full w-full">

        {/* Hero section */}
        <section className="animate-[fade-in-up_1s_ease-in-out] flex flex-col justify-center h-170 bg-[url(/src/assets/heroBackground6.png)] bg-cover bg-center gap-8 bg-white px-12 mb-12">

            <div className="flex text-8xl font-bold text-title items-center w-180">
                <h2>
                    Adopt. Love. Care.
                </h2>
            </div>
            <p className="text-xl text-subtitle w-145">Adopt lovable pets from verified shelters and rescue organizations. Safe, simple, and compassionate adoption-made easy.</p>

            <p className="font-semibold text-subtitle">Browse pets freely. Create an account to adopt or post a pet.</p>

            <div className="flex gap-4">
                <Link to="/browse-pets" className="flex justify-center items-center gap-2 bg-button text-white hover:bg-hovered-button px-8 py-3 rounded-full duration-300 cursor-pointer">
                    Browse Pets <FaArrowRight />
                </Link>
                <a 
                    href="/#about" 
                    className="flex justify-center items-center gap-2 px-8 py-3 rounded-full border-2 border-gray-200 cursor-pointer hover:-translate-y-1 duration-300"
                    onClick={handleAbout}
                >
                    About
                </a>
            </div>
            
        </section>
        
        {/* About */}
        <section id="about" className=" scroll-mt-24 grid grid-cols-2 px-12 my-8">

            <div className="flex flex-col gap-4">
                <h2 className="text-4xl font-semibold text-title">What is FurEver?</h2>

                <p className="w-140 text-subtitle">
                    FurEver is a web-based pet adoption portal that connects people who want to adopt pets with responsible pet rehomers. It provides a safe, simple, and transparent way to browse adoptable pets, communicate with rehomers, and apply for adoption—all in one platform.
                </p>

                <p className="w-120 text-subtitle">
                    Our goal is to help pets find loving homes while ensuring that the adoption process is ethical, secure, and trustworthy.
                </p>
            </div>


            <div className="flex flex-col gap-2 pb-4">
                <h2 className="text-4xl font-semibold text-title">Why use FurEver?</h2>
            
                <div className="grid grid-cols-2 gap-5 justify-items-center">
                    
                    <div className='p-4 flex flex-col justify-start gap-3'>
                        <span className="font-semibold text-title border-t pt-2">Direct Pet-to-Person Adoption</span>
                        <p className=" text-subtitle text-sm">Adopt directly from verified pet rehomers, including individuals, shelters, and rescue groups.</p>
                    </div>
                    <div className='p-4 flex flex-col justify-start gap-3'>
                        <span className="font-semibold text-title border-t pt-2">Safe & Transparent Process</span>
                        <p className="text-sm text-subtitle">Every step of the adoption journey is guided and trackable to ensure safety for both adopters and pets..</p>
                    </div>
                    <div className='p-4 flex flex-col justify-start gap-3'>
                        <span className="font-semibold text-title border-t pt-2">Pet-Based Communication</span>
                        <p className="text-sm text-subtitle">Chat with the rehomer of a specific pet to ask questions, schedule meet-ups, and understand the pet’s needs.</p>
                    </div>
                    <div className='p-4 flex flex-col justify-start gap-3'>
                        <span className="font-semibold text-title border-t pt-2">Simple & User-Friendly Platform</span>
                        <p className="text-sm text-subtitle">Browse, apply, and adopt with ease using an intuitive and accessible interface.</p>
                    </div>
                </div>
            </div>

            <div className="col-span-2 flex flex-col gap-12 items-center">

                <h2 className="text-4xl font-semibold text-title">How FurEver Works</h2>

                <div className="grid grid-cols-5 gap-5 text-sm px-8">
                    <div className="flex flex-col gap-4 items-center text-center shadow-md px-4 py-8 rounded-2xl">
                        <div className="flex items-center justify-center gap-2 border-b border-gray-400 w-full pb-1">
                            <h4 className="text-lg font-semibold text-title">
                                Browse Pets
                            </h4>
                            
                        </div>
                        <p className="text-left">
                           Explore a wide range of adoptable pets posted by verified rehomers.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 items-center text-center shadow-md px-4 py-8 rounded-2xl">
                        <div className="flex items-center justify-center gap-2 border-b border-gray-400 w-full pb-1">
                            <h4 className="text-lg font-semibold text-title">
                                View Pet Details
                            </h4>
                        </div>
                        <p className="text-left">
                            Check each pet’s profile, including photos, description, health status, and adoption requirements.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 items-center text-center shadow-md px-4 py-8 rounded-2xl">
                        <div className="flex items-center justify-center gap-2 border-b border-gray-400 w-full pb-1">
                            <h4 className="text-lg font-semibold text-title">
                                Chat with the Rehomer
                            </h4>
                        </div>
                        <p className="text-left">
                            Start a conversation about a specific pet to ask questions and schedule visits.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 items-center text-center shadow-md px-4 py-8 rounded-2xl">
                        <div className="flex items-center justify-center gap-2 border-b border-gray-400 w-full pb-1">
                            <h4 className="text-lg font-semibold text-title">
                                Submit Adoption Application
                            </h4>
                        </div>
                        <p className="text-left">
                            Apply directly through the platform for a smooth and organized process.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 items-center text-center shadow-md px-4 py-8 rounded-2xl">
                        <div className="flex items-center justify-center gap-2 border-b border-gray-400 w-full pb-1">
                            <h4 className="text-lg font-semibold text-title">
                                Adopt & Bring Home Your New Friend
                            </h4>
                        </div>
                        <p className="text-left">
                            Finalize the adoption and welcome your new companion into your family.
                        </p>
                    </div>
                </div>
            </div>

        </section>

        {/* Our Mission */}
        <section className="flex items-center justify-end my-8 bg-[url(/src/assets/missionBg.png)] bg-cover bg-center h-165 bg-white">
            <div className="pr-27 flex flex-col justify-center gap-6">
                <span className="text-green-400 text-lg font-semibold">OUR PURPOSE</span>
                <h3 className="text-5xl font-semibold w-120 text-title">Connecting hearts, one paw at a time.</h3>
                <div className="flex flex-col gap-2">
                    <p className="text-subtitle w-125">
                        FurEver connects loving adopters with trusted shelters to create safe, simple, and responsible pet adoptions.
                    </p>
                    <span>we aim to:</span>
                    <ul className="list-disc">
                        <li>Reduce homeless animals</li>
                        <li>Prevent scams and unsafe adoptions</li>
                        <li>Promote responsible pet ownership</li>
                    </ul>
                </div>
                <div className="flex gap-8">
                    <div className="flex flex-col items-center gap-2">
                        <MdOutlineShield className="size-6 text-green-300"/>
                        <p className="text-sm text-subtitle font-semibold">SAFETY</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <LuHandshake className="size-6 text-blue-300"/>
                        <p className="text-sm text-subtitle font-semibold">TRUST</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <FaHandHoldingHeart className="size-6 text-red-300"/>
                        <p className="text-sm text-subtitle font-semibold">CARE</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <FaCircleCheck className="size-6 text-violet-300"/>
                        <p className="text-sm text-subtitle font-semibold">RESPONSIBILITY</p>
                    </div>
                </div>
                <Link to="/mission" className="text-center bg-button text-white px-6 py-4 rounded-full hover:bg-hovered-button duration-400 cursor-pointer font-semibold w-70">
                    Learn About Our Mission
                </Link> 
            </div>  
        </section>

        {/* Call to Action */}
        <section className="h-105 bg-black mx-10 rounded-[4vw] flex flex-col items-center justify-center gap-10 text-white">
            <div className="flex flex-col w-full items-center gap-4">
                <h4 className="text-5xl font-semibold w-120 text-center">
                    Give pet a second chance at life. 
                </h4>
                <p className="text-lg">Start your adoption journey today and help create more forever homes.</p>
            </div>
            <Link to="/create-account" className="border border-gray-50 text-white px-8 py-3 rounded-full hover:scale-104 duration-400 cursor-pointer font-semibold text-lg">
                Sign Up
            </Link>
        </section>

        </main>
        <Footer />
        </>
    );
}   

export default LandingPage;