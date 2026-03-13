import { Outlet, Navigate, Link } from "react-router-dom";

export default function AdminLayout() {
    // 1. Ultimate Security Check: Are they actually an admin?
    const user = JSON.parse(localStorage.getItem('furever_user'));
    const isAdmin = user?.role === 'admin';

    // If not an admin, kick them to the admin login page instantly
    if (!isAdmin) {
        return <Navigate to="/admin-login" replace />;
    }

    // 2. The Admin UI Shell
    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            
            {/* --- ADMIN SIDEBAR --- */}
            <aside className="w-64 bg-[#1A202C] text-white flex flex-col shadow-xl">
                <div className="p-6 text-2xl font-bold border-b border-gray-700">
                    FurEver Admin
                </div>
                
                <nav className="flex-1 p-4 flex flex-col gap-2">
                    <nav className="flex-1 p-4 flex flex-col gap-2">
                    <Link to="/admin" className="p-3 hover:bg-gray-800 rounded-lg transition-colors font-medium">
                        Dashboard Home
                    </Link>
                    {/* 👇 Added the new management links */}
                    <Link to="/admin/users" className="p-3 hover:bg-gray-800 rounded-lg transition-colors font-medium">
                        Manage Users
                    </Link>
                    <Link to="/admin/pets" className="p-3 hover:bg-gray-800 rounded-lg transition-colors font-medium">
                        Manage Pets
                    </Link>
                    <Link to="/admin/verifications" className="p-3 hover:bg-gray-800 rounded-lg transition-colors font-medium">
                        ID Verification
                    </Link>
                    <Link to="/admin/reports" className="p-3 hover:bg-gray-800 rounded-lg transition-colors font-medium">
                        Reports
                    </Link>
                </nav>
                    {/* You can add more admin links here later, like Manage Users or Review Pets! */}
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <button 
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('furever_user');
                            window.location.href = '/admin-login';
                        }}
                        className="w-full p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors font-bold"
                    >
                        Log Out
                    </button>
                </div>
            </aside>

            {/* --- ADMIN MAIN CONTENT AREA --- */}
            <main className="flex-1 p-8 overflow-y-auto">
                {/* The <Outlet /> is the magic portal where AdminDashboard will actually render */}
                <Outlet /> 
            </main>
        </div>
    );
}