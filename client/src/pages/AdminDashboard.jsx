import { useState, useEffect } from "react";
import { FaUsers, FaUserShield, FaBuilding, FaBan, FaPaw } from "react-icons/fa";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        adopters: 0,
        rehomers: 0,
        banned: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Change to your live Render link when ready!
                const response = await fetch('http://localhost:5000/api/admin/stats', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    // A reusable component for our stat cards
    const StatCard = ({ title, count, icon, color }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-xl text-white ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-extrabold text-gray-900">{isLoading ? "..." : count}</h3>
            </div>
        </div>
    );

    return (
        <div className="animate-[fade-in-up_0.5s_ease-in-out]">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back, Admin. Here is what is happening on FurEver today.</p>
            </div>

            {/* --- STATS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    title="Total Users" 
                    count={stats.users} 
                    icon={<FaUsers className="size-6" />} 
                    color="bg-blue-500" 
                />
                <StatCard 
                    title="Adopters" 
                    count={stats.adopters} 
                    icon={<FaUserShield className="size-6" />} 
                    color="bg-emerald-500" 
                />
                <StatCard 
                    title="Rehomers" 
                    count={stats.rehomers} 
                    icon={<FaBuilding className="size-6" />} 
                    color="bg-purple-500" 
                />
                <StatCard 
                    title="Suspended" 
                    count={stats.banned} 
                    icon={<FaBan className="size-6" />} 
                    color="bg-red-500" 
                />
            </div>

            {/* --- QUICK ACTIONS & PLACEHOLDERS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FaPaw className="text-orange-500" /> Pet Statistics
                    </h2>
                    <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-500">
                        Pet tracking will be connected here once the Pet Database is live!
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Recent System Alerts</h2>
                    <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-500">
                        No critical alerts at this time.
                    </div>
                </div>
            </div>
        </div>
    );
}