import React, { useState, useEffect } from 'react';
import MessageDialog from '../../components/MessageDialog';
import { getAllTaxSubmissions, generateTaxPdfadmin, downloadPdf, downloadPdfAdmin } from '../../utils/api';
import './AdminFiles.css';

const AdminFiles = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState('info');

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const data = await getAllTaxSubmissions();
            setSubmissions(data);
        } catch (error) {
            console.error('Error fetching submissions:', error);
            setDialogMessage('Error fetching submissions');
            setDialogType('error');
            setDialogOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const generatePdf = async (submissionId,userId) => {
        try {
            const data = await generateTaxPdfadmin(submissionId, userId);

            if (data.success) {
                setDialogMessage('PDF generated successfully!');
                setDialogType('success');
                setDialogOpen(true);
                
                                 // Download the PDF using the admin api function
                 if (data.fileName) {
                     try {
                         const blob = await downloadPdfAdmin(data.fileName, userId);
                         const url = window.URL.createObjectURL(blob);
                         const a = document.createElement('a');
                         a.href = url;
                         a.download = data.fileName;
                         document.body.appendChild(a);
                         a.click();
                         window.URL.revokeObjectURL(url);
                         document.body.removeChild(a);
                     } catch (downloadError) {
                         console.error('Error downloading PDF:', downloadError);
                         setDialogMessage('PDF generated but download failed');
                         setDialogType('error');
                         setDialogOpen(true);
                     }
                 }
            } else {
                setDialogMessage(data.message || 'Failed to generate PDF');
                setDialogType('error');
                setDialogOpen(true);
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            setDialogMessage('Error generating PDF');
            setDialogType('error');
            setDialogOpen(true);
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="admin-files-container">
                <div className="admin-files-loading">
                    <div className="spinner"></div>
                    <p>Loading submissions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-files-container">
            <div className="admin-files-header">
                <h1>All Tax Submissions</h1>
                <p>View and download tax submissions from all users</p>
            </div>

            {submissions.length === 0 ? (
                <div className="admin-files-empty">
                    <p>No tax submissions found.</p>
                </div>
            ) : (
                <div className="admin-files-content">
                    <div className="admin-files-table-container">
                        <table className="admin-files-table">
                            <thead>
                                <tr>
                                    <th>Submission ID</th>
                                    <th>User ID</th>
                                    <th>User Email</th>
                                    <th>Submission Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((submission) => (
                                    <tr key={submission.id}>
                                        <td>{submission.id}</td>
                                        <td>{submission.user_id}</td>
                                        <td>{submission.user_email || 'N/A'}</td>
                                        <td>{formatDate(submission.date)}</td>
                                        <td>
                                            <span className={`status-badge ${submission.done_submit ? 'completed' : 'pending'}`}>
                                                {submission.done_submit ? 'Completed' : 'Pending'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="admin-files-pdf-btn"
                                                onClick={() => generatePdf(submission.id, submission.user_id)}
                                                disabled={!submission.done_submit}
                                            >
                                                Get PDF
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <MessageDialog
                isOpen={dialogOpen}
                message={dialogMessage}
                type={dialogType}
                onClose={handleDialogClose}
            />
        </div>
    );
};

export default AdminFiles; 