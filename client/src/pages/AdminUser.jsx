import { useState, useEffect } from "react";
import { FaTrash, FaBan, FaCheckCircle } from "react-icons/fa";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch all users when the page loads
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // We will build this backend route next!
                const response = await fetch('http://localhost:5000/api/users', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                }
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleBanUser = async (userId, currentStatus) => {
        const confirmMsg = currentStatus === 'banned' 
            ? "Are you sure you want to UNBAN this user?" 
            : "Are you sure you want to BAN this user?";
            
        if (!window.confirm(confirmMsg)) return;

        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}/ban`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            if (response.ok) {
                // Instantly update the UI without refreshing the page!
                setUsers(users.map(user => 
                    user._id === userId ? { ...user, isBanned: !user.isBanned } : user
                ));
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.error("Error toggling ban:", error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("WARNING: Are you sure you want to permanently delete this user?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            if (response.ok) {
                // Remove the user from the table instantly!
                setUsers(users.filter(user => user._id !== userId));
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div className="animate-[fade-in-up_0.5s_ease-in-out]">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Users</h1>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600 uppercase tracking-wider">
                                <th className="p-4 font-semibold">Name / Email</th>
                                <th className="p-4 font-semibold">Role</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr><td colSpan="4" className="p-8 text-center text-gray-500">Loading users...</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan="4" className="p-8 text-center text-gray-500">No users found. (Check backend connection!)</td></tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="p-4 capitalize">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'rehomer' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {/* Status Badge */}
                                            {user.isBanned ? (
                                                <span className="flex items-center gap-1 text-red-600 font-semibold text-sm">
                                                    <FaBan /> Banned
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-green-600 font-semibold text-sm">
                                                    <FaCheckCircle /> Verified
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 flex justify-end gap-3">
                                            <button 
                                                onClick={() => handleBanUser(user._id, user.isBanned ? 'banned' : 'active')}
                                                className={`p-2 rounded-lg transition-colors font-bold text-sm ${
                                                    user.isBanned ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                                }`}
                                            >
                                                {user.isBanned ? "Unban" : "Ban"}
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors font-bold text-sm flex items-center gap-2"
                                            >
                                                <FaTrash /> Delete
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