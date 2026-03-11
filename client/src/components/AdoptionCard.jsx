import React from 'react';
// Assuming you are using react-icons based on previous code
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

function AdoptionCard() {
    // 1. Define the steps
    const steps = ["App", "Review", "Interview", "Meetup", "Final"];
    
    // 2. Set current step (0-indexed). 2 means "Interview"
    const currentStepIndex = 2; 

    // Calculate percentage for the blue line to fill
    const progressPercentage = (currentStepIndex / (steps.length - 1)) * 100;

    return (
        <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">

            <div className="p-4">
                {/* --- 1. HEADER SECTION --- */}
                <div className="flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                        {/* Pet Avatar */}
                        <div className="rounded-2xl flex items-center justify-center overflow-hidden">
                            {/* Replace with actual pet image */}
                            <img 
                                src="/src/assets/barnaby.jpg" 
                                alt="Max" 
                                className="h-20 w-25 object-cover object-center rounded-xl"
                            />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-title">Max</h2>
                            <p className="text-subtitle">Golden Retriever • 2 years</p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="bg-[#f4f3ee] text-title px-3 py-2 rounded-full font-semibold text-sm">
                        In Progress: 60%
                    </div>
                </div>

                {/* --- 2. PROGRESS BAR SECTION --- */}
                <div className="my-8 relative px-4">
                    
                    {/* The gray background line (Future steps) */}
                    <div className="absolute top-4 left-4 right-4 h-1.5 bg-[#E8E8E8] z-0 rounded-full"></div>

                    {/* The active line (Completed steps) */}
                    <div 
                        className="absolute top-4 left-4 h-1.5 bg-[#1d3557] z-0 rounded-full transition-all duration-700 ease-in-out"
                        style={{ width: `calc(${progressPercentage}% - 2rem)` }}
                    ></div>

                    {/* The Dots and Text */}
                    <div className="flex justify-between relative z-10">
                        {steps.map((step, index) => {
                            const isCompleted = index < currentStepIndex;
                            const isCurrent = index === currentStepIndex;
                            const isFuture = index > currentStepIndex;

                            return (
                                <div key={step} className="flex flex-col items-center relative w-12">
                                    
                                    {/* The Circle Indicator */}
                                    <div className="h-9 flex items-center justify-center">
                                        {isCompleted && (
                                            <div className="size-6 bg-[#1d3557] rounded-full shadow-sm"></div>
                                        )}
                                        {isCurrent && (
                                            // The "Halo" effect for the current step
                                            <div className="size-10 bg-[#f2f4f3] rounded-full flex items-center justify-center">
                                                <div className="size-6 border-[3px] border-[#2b2d42] bg-white rounded-full"></div>
                                            </div>
                                        )}
                                        {isFuture && (
                                            <div className="size-6 bg-[#E8E8E8] border border-gray-300 rounded-full shadow-inner"></div>
                                        )}
                                    </div>

                                    {/* The Text Label */}
                                    <span className={`absolute top-12 text-sm font-bold tracking-wide ${
                                        isCompleted || isCurrent ? "text-subtitle" : "text-[#A0A0A0]"
                                    }`}>
                                        {step}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* --- 3. ACTION BOX SECTION --- */}
                <div className="border border-gray-300 rounded-2xl p-6 flex justify-between items-center">
                    <div>
                        <p className="text-title text-sm font-bold tracking-widest uppercase mb-1">
                            Next Step
                        </p>
                        <h3 className="text-subtitle font-semibold">
                            Confirm Interview Schedule
                        </h3>
                    </div>
                    
                    <button className="bg-[#4285F4] hover:bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                        <IoChatbubbleEllipsesOutline className="size-5" />
                        Open Messages
                    </button>
                </div>

            </div>
        </div>
    );
}

export default AdoptionCard;