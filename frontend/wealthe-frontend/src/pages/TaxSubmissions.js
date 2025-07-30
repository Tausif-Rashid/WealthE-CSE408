import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import MessageDialog from '../components/MessageDialog';
import { getTaxSubmissions, generateTaxPdf, downloadPdf } from '../utils/api';
import './TaxSubmissions.css';

const TaxSubmissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState('info');
    const navigate = useNavigate();

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const data = await getTaxSubmissions();
            setSubmissions(data);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const generatePdf = async (submissionId) => {
        try {
            const data = await generateTaxPdf(submissionId);

            if (data.success) {
                setDialogMessage('PDF generated successfully!');
                setDialogType('success');
                setDialogOpen(true);
                
                // Download the PDF using the new api function
                if (data.fileName) {
                    try {
                        const blob = await downloadPdf(data.fileName);
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
            <div className="tax-submissions-container">
                <div className="tax-submissions-loading">
                    <div className="spinner"></div>
                    <p>Loading submissions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="tax-submissions-container">
            <div className="tax-submissions-header">
                <h1>Previous Tax Submissions</h1>
                <button 
                    className="tax-submissions-back-btn"
                    onClick={() => navigate('/dashboard')}
                >
                    ← Back to Dashboard
                </button>
            </div>

            {submissions.length === 0 ? (
                <div className="tax-submissions-empty">
                    <p>No tax submissions found.</p>
                    <button 
                        className="tax-submissions-new-btn"
                        onClick={() => navigate('/tax-form')}
                    >
                        Create New Tax Form
                    </button>
                </div>
            ) : (
                <div className="tax-submissions-content">
                    <div className="tax-submissions-table-container">
                        <table className="tax-submissions-table">
                            <thead>
                                <tr>
                                    <th>Submission ID</th>
                                    <th>Submission Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((submission) => (
                                    <tr key={submission.id}>
                                        <td>{submission.id}</td>
                                        <td>{formatDate(submission.date)}</td>
                                        <td>
                                            <span className={`status-badge ${submission.doneSubmit ? 'completed' : 'pending'}`}>
                                                {submission.done_submit ? 'Completed' : 'Pending'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="tax-submissions-pdf-btn"
                                                onClick={() => generatePdf(submission.id)}
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

export default TaxSubmissions; 