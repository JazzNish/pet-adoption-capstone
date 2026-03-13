import Report from "../models/report.js"
// 👇 Fetch all unresolved reports
export const getPendingReports = async (req, res) => {
    try {
        const reports = await Report.find({ status: 'Pending' })
            .populate('reporterId', 'name email')
            .sort({ createdAt: 1 }); // Oldest reports first
            
        res.status(200).json(reports);
    } catch (error) {
        console.error("Fetch Reports Error:", error);
        res.status(500).json({ message: "Server error fetching reports." });
    }
};

// 👇 Dismiss a report or mark it as resolved
export const updateReportStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const report = await Report.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );

        if (!report) {
            return res.status(404).json({ message: "Report not found." });
        }

        res.status(200).json({ message: `Report marked as ${status}.`, report });
    } catch (error) {
        console.error("Update Report Error:", error);
        res.status(500).json({ message: "Server error updating report status." });
    }
};