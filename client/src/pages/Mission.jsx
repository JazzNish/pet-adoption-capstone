
{/* icons */}
import { BsPersonCheckFill, BsFillClipboard2PlusFill, BsShieldFillCheck, } from "react-icons/bs";
import { LuSearchCheck, LuArchive, LuCircleX, LuBookOpenText  } from "react-icons/lu";
import { MdHandshake, MdOutlineLockPerson, MdChecklistRtl, MdOutlineGroups  } from "react-icons/md";
import { FaShieldHeart } from "react-icons/fa6";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { BiHide } from "react-icons/bi";
import { GoChecklist, GoShield, } from "react-icons/go";

function OurMission() {
    return (
        <>
        <section className="my-8 flex flex-col gap-18 items-center">

            <div className="w-250 relative text-center text-white flex flex-col gap-12 items-center justify-center rounded-xl py-18 overflow-hidden isolate">

                <div className="absolute inset-0 -z-10 bg-[url(/src/assets/playing.png)] bg-cover bg-center brightness-50"></div>

                <h1 className="text-6xl font-bold w-250">Rehoming with Responsibility, Not Urgency</h1>
                <p className="w-140 text-lg ">
                    We are redefining pet adoption by priotizing welfare, transparency and ethical home-to-home rehoming over speed and convenience.
                </p>
            </div>
            
            <div className="w-260 flex bg-white rounded-xl px-6 py-4 gap-5 border-l-5 border-paw-fill">
                <div className="flex justify-center items-center">
                    <span className="bg-orange-100 text-paw-outline p-3 rounded-full">
                        <BsPersonCheckFill />
                    </span>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-sm text-paw-fill font-semibold">THE FUREVER STANDARD</span>
                    <p className="font-semibold text-stone-500 w-210">
                        <q>Instead of rushing a pet into the first available home, FurEver ensures that the environment, lifestyle, and readiness of the adopter are evaluated first to ensure a permanent match.</q>
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-8 items-center justify-center">

                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl font-semibold text-paw-outline text-center">How FurEver Protects Every Adoption</h2>
                    <p className="text-stone-500 text-lg w-180 text-center">
                        Our structured 4-step workflow is designed to ensure safety, verify intent, and secure the best outcome for every pet.
                    </p>
                </div>

                <div className="grid grid-cols-4 gap-4 w-260">
                    <div className="relative flex flex-col gap-6 items-center">
                        <div class="absolute left-1/2 top-8 w-full h-0.5 bg-gray-200"></div>
                        <span className="bg-white text-paw-highlight rounded-full py-4 px-6 flex items-center justify-center hover:scale-105 duration-300 z-1">
                            <LuSearchCheck className="size-8"/>
                        </span>
                        <div className="flex flex-col gap-3 bg-white px-4 py-8 rounded-lg items-center text-center">
                            <span className="text-sm text-paw-outline bg-orange-100 font-semibold px-3 py-1 rounded-full">STEP 1</span>
                            <h4 className="font-semibold">Browse</h4>
                            <p className="text-sm text-stone-500">
                                Safe Discovery via read-only profiles preventing spam and impulsive contact.
                            </p>
                        </div>
                    </div>
                    <div className="relative flex flex-col gap-6 items-center">
                         <div class="absolute left-1/2 top-8 w-full h-0.5 bg-gray-200"></div>
                        <span className="bg-white text-paw-highlight rounded-full py-4 px-6 flex items-center justify-center hover:scale-105 duration-300 z-1">
                            <BsFillClipboard2PlusFill className="size-8"/>
                        </span>
                        <div className="flex flex-col gap-3 bg-white px-4 py-8 rounded-lg items-center text-center">
                            <span className="text-sm text-paw-outline bg-orange-100 font-semibold px-3 py-1 rounded-full">STEP 2</span>
                            <h4 className="font-semibold">Apply</h4>
                            <p className="text-sm text-stone-500">
                                Intent Questionnaire required to demonstrate readiness and compatibility.
                            </p>
                        </div>
                    </div>
                    <div className="relative flex flex-col gap-6 items-center">
                         <div class="absolute left-1/2 top-8 w-full h-0.5 bg-gray-200"></div>
                        <span className="bg-white text-paw-highlight rounded-full py-4 px-6 flex items-center justify-center hover:scale-105 duration-300 z-1">
                            <BsShieldFillCheck className="size-8"/>
                        </span>
                        <div className="flex flex-col gap-3 bg-white px-4 py-8 rounded-lg items-center text-center">
                            <span className="text-sm text-paw-outline bg-orange-100 font-semibold px-3 py-1 rounded-full">STEP 3</span>
                            <h4 className="font-semibold">Verify</h4>
                            <p className="text-sm text-stone-500">
                                Mutual Verification unlocks secure messaging and confirms real identities.
                            </p>
                        </div>
                    </div>
                    <div className="relative flex flex-col gap-6 items-center">
                        <span className="bg-white text-paw-highlight rounded-full py-4 px-6 flex items-center justify-center hover:scale-105 duration-300">
                            <MdHandshake className="size-8"/>
                        </span>
                        <div className="flex flex-col gap-3 bg-white px-4 py-8 rounded-lg items-center text-center">
                            <span className="text-sm text-paw-outline bg-orange-100 font-semibold px-3 py-1 rounded-full">STEP 4</span>
                            <h4 className="font-semibold">Safe Handover</h4>
                            <p className="text-sm text-stone-500">
                                Guided Completion protocol ensures a documented, ethical transfer.
                            </p>
                        </div>
                    </div>  
                </div>

            </div>

            <div className="text-center flex flex-col items-center gap-4">
                <span className="bg-red-100 p-4  rounded-full">
                    <FaShieldHeart className="size-7 text-red-400"/>
                </span>
                <h3 className="text-3xl font-semibold text-paw-outline">Protection is Our Mission</h3>
                <p className="w-180 text-stone-500 text-lg">
                    At FurEver, "security" means more than just secure servers and data protection. It means active protection for the vulnerable animals in our system. We have built a digital safety net ensuring that safeguards extent directly to the pets themselves - preventing impulse decision and ensuring they land in homes that are truly ready.
                </p>
            </div>

            <div className="bg-blue-600 text-white flex items-center gap-6 px-8 py-12 w-260 rounded-xl">
                <div className="flex items-center">
                    <span className="bg-blue-500 p-3 rounded-full">
                        <LuArchive className="size-12"/>
                    </span>
                </div>
                <div className="flex flex-col gap-4">
                    <h3 className="text-4xl font-semibold">Why FurEver Is Not a Marketplace</h3>
                    <p className="w-180 text-stone-100">
                        Unlike traditional classifieds or social groups, FurEver is not designed for fast browsing, instant messaging, or impulse decisions. We reject the "add to cart" mentality for living beings. Every interaction is structured to protect animal welfare and prevent exploitation.
                    </p>
                </div>
            </div>

            <div className="w-260 grid grid-cols-2 gap-6">

                <div className="flex flex-col gap-7 bg-white p-8 rounded-xl border-1 border-gray-200">
                    <div className="flex gap-2 items-center">
                        <MdOutlineLockPerson className="text-blue-600 size-10"/>
                         <h3 className="text-2xl font-semibold">Scam Preventionby Design</h3>
                    </div>
                    <p className="text-stone-500">
                        We eliminate common online adoption scams at the source. By restricting direct contact until mutual verification occurs, we remove the anonymity that bad actors thrive on.
                    </p>
                    <div>
                        <ul className="flex flex-col gap-4">
                            <li className="flex items-center gap-6">
                                <IoShieldCheckmarkOutline className="size-9 text-blue-600"/>
                                <p className="text-gray-500">
                                    <span className="font-semibold text-stone-500">Identity Verification: </span> 
                                    Every user must pass verification before initiating contact.
                                </p>
                            </li>
                            <li className="flex items-center gap-6">
                                <BiHide className="size-12 text-blue-600"/>
                                <p className="text-gray-500">
                                    <span className="font-semibold text-stone-500">Controlled Privacy: </span> 
                                    Personal contact info is never public; it's shared only when safety criteria are met.
                                </p>
                            </li>
                            <li className="flex items-center gap-6">
                                <LuCircleX className="size-10 text-blue-600"/>
                                <p className="text-gray-500">
                                    <span className="font-semibold text-stone-500">Zero Direct Solicitation: </span> 
                                    Our system prevents unauthorized messaging and predatory behavior.
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col gap-7 bg-orange-100 p-8 rounded-xl border-1 border-orange-200">
                    <div className="flex gap-2 items-center">
                        <MdOutlineGroups  className="text-orange-400 size-10"/>
                         <h3 className="text-2xl font-semibold">Human Responsibility First</h3>
                    </div>
                    <p className="text-stone-500">
                        Adoption is a lifetime commitment. FurEver requires rigorous readiness checks to ensure that every potential adopter is prepared for the long-term responsibility of pet ownership.
                    </p>
                    <div>
                        <ul className="flex flex-col gap-4">
                            <li className="flex items-center gap-6">
                                <MdChecklistRtl className="size-9 text-orange-400"/>
                                <p className="text-gray-500">
                                    Every user must pass verification before initiating contact.
                                </p>
                            </li>
                            <li className="flex items-center gap-6">
                                <GoChecklist className="size-12 text-orange-400"/>
                                <p className="text-gray-500">
                                    Personal contact info is never public; it's shared only when safety criteria are met.
                                </p>
                            </li>
                            <li className="flex items-center gap-6">
                                <LuBookOpenText className="size-10 text-orange-400"/>
                                <p className="text-gray-500">
                                    Our system prevents unauthorized messaging and predatory behavior.
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>

            <div className="w-260 flex bg-white rounded-xl p-6 gap-6 border-l-5 border-red-500">
                <div className="flex justify-center items-center">
                    <span className="bg-red-100 text-red-500 p-4 rounded-full">
                        <GoShield className="size-7"/>
                    </span>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-2xl font-semibold">Real-World Protection Scenario</span>
                    <p className="text-stone-500 w-212">
                        Consider this frequent online threat: <span className="font-semibold text-black">"A bad actor attempts a fake listing."</span> On most sites, this listing goes live instantly. On FurEver, <span className="text-orange-400">our multi-factor identity verification blocks the entry immediately</span>. The result? The community is never exposed to the risk, preserving trust and safety for everyone involved.
                    </p>
                </div>
            </div>



        </section>
        </>
    );
}

export default OurMission;