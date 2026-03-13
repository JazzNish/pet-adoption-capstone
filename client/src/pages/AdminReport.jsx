import { useState, useEffect } from "react";
import { FaFlag, FaCheck, FaTimes, FaSearch } from "react-icons/fa";

export default function AdminReports() {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                // Testing locally
                const response = await fetch('http://localhost:5000/api/reports/admin/pending', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setReports(data);
                }
            } catch (error) {
                console.error("Failed to fetch reports:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReports();
    }, []);

    const handleUpdateStatus = async (reportId, newStatus) => {
        if (!window.confirm(`Are you sure you want to mark this report as ${newStatus}?`)) return;

        try {
            const response = await fetch(`http://localhost:5000/api/reports/admin/${reportId}/status`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                // Remove it from the pending list
                setReports(reports.filter(report => report._id !== reportId));
            }
        } catch (error) {
            console.error("Error updating report:", error);
        }
    };

    return (
        <div className="animate-[fade-in-up_0.5s_ease-in-out]">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaFlag className="text-red-500" /> Platform Reports
            </h1>

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600 uppercase tracking-wider">
                            <th className="p-4 font-semibold">Reported By</th>
                            <th className="p-4 font-semibold">Type</th>
                            <th className="p-4 font-semibold">Reason</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan="4" className="p-8 text-center text-gray-500">Loading reports...</td></tr>
                        ) : reports.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-12 text-center text-gray-500">
                                    <FaCheck className="size-12 mx-auto text-green-400 mb-4 opacity-50" />
                                    <p className="text-lg font-bold">Zero active reports!</p>
                                    <p className="text-sm">The platform is running smoothly.</p>
                                </td>
                            </tr>
                        ) : (
                            reports.map((report) => (
                                <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-900">{report.reporterId?.name || "Unknown User"}</div>
                                        <div className="text-sm text-gray-500">{report.reporterId?.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            report.itemType === 'Pet' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'
                                        }`}>
                                            {report.itemType}
                                        </span>
                                        <div className="text-xs text-gray-400 mt-1 font-mono">ID: {report.reportedItemId.slice(-6)}</div>
                                    </td>
                                    <td className="p-4 max-w-xs">
                                        <p className="text-sm text-gray-700 truncate">{report.reason}</p>
                                    </td>
                                    <td className="p-4 flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleUpdateStatus(report._id, 'Dismissed')}
                                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-bold text-sm flex items-center gap-1"
                                            title="Dismiss false report"
                                        >
                                            <FaTimes /> Dismiss
                                        </button>
                                        <button 
                                            onClick={() => handleUpdateStatus(report._id, 'Action Taken')}
                                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-bold text-sm flex items-center gap-1"
                                            title="Mark as resolved"
                                        >
                                            <FaCheck /> Resolve
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}