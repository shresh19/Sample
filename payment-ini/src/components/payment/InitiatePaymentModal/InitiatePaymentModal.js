import React, { useState, useEffect } from 'react';
import { DollarSign, X, Loader, Send, Eye } from 'lucide-react';
import PaymentPreview from '../PaymentPreview/PaymentPreview';
import './InitiatePaymentModal.css';

const InitiatePaymentModal = ({ isOpen, batch, employees, onConfirm, onDraft, onClose, isProcessing }) => {
    const [debitAccount, setDebitAccount] = useState('');
    const [payrollType, setPayrollType] = useState('Monthly Salary');
    const [currency, setCurrency] = useState('INR');
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    
    useEffect(() => {
        if (isOpen) {
            setDebitAccount('');
            setPayrollType('Monthly Salary');
            setCurrency('INR');
            setIsPreviewVisible(false);
        }
    }, [isOpen]);

    if (!isOpen || !batch) return null;
    
    const isBatchEmpty = employees.length === 0;
    const isFormValid = debitAccount.trim().length >= 5 && !isBatchEmpty;

    const paymentDetails = {
        debitAccount: debitAccount.trim(),
        payrollType,
        currency,
        batchId: batch.id,
        batchName: batch.name,
        date: new Date().toLocaleDateString('en-US') 
    };

    const handleSubmit = () => {
        if (isFormValid) {
            onConfirm(batch, paymentDetails);
        }
    };
    
    const handleDraft = () => {
        onDraft(batch, paymentDetails);
    };

    return (
        <div className="paymentModalOverlay">
            <div className="paymentModalContent">
                <div className="modalHeader">
                    <h3 className="modalTitle">
                        <DollarSign />
                        Initiate Payment: {batch.name}
                    </h3>
                    <button onClick={onClose} className="closeButton" disabled={isProcessing}>
                        <X />
                    </button>
                </div>
                
                {isBatchEmpty && (
                     <div className="batchEmptyError">
                         <p><b>Cannot submit payment:</b> The batch has no assigned employees.</p>
                     </div>
                )}

                <div className="modalBodyGrid">
                    <div className="formColumn">
                        <h4 className="columnTitle">Payment Details</h4>
                        
                        <div className="formGroup">
                            <label>Batch ID/No. / Name</label>
                            <input type="text" value={batch.name} disabled />
                        </div>

                        <div className="formGroup">
                            <label htmlFor="debitAccount">Debit Account*</label>
                            <input 
                                type="text" 
                                id="debitAccount" 
                                value={debitAccount} 
                                onChange={(e) => setDebitAccount(e.target.value)} 
                                placeholder="e.g., 9876543210 (Bank Account)" 
                                required
                            />
                        </div>

                        <div className="formGroup">
                            <label htmlFor="payrollType">Payroll Type</label>
                            <select 
                                id="payrollType" 
                                value={payrollType} 
                                onChange={(e) => setPayrollType(e.target.value)} 
                            >
                                <option value="Monthly Salary">Monthly Salary</option>
                                <option value="Bonus">Bonus</option>
                                <option value="Commission">Commission</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        
                        <div className="formGroup">
                            <label htmlFor="currency">Currency</label>
                            <select 
                                id="currency" 
                                value={currency} 
                                onChange={(e) => setCurrency(e.target.value)} 
                            >
                                <option value="INR">INR</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>
                        
                        <div className="formGroup">
                            <label>Date (Initiation)</label>
                            <input type="text" value={new Date().toLocaleDateString('en-US')} disabled />
                        </div>
                    </div>
                    
                    <div className="previewColumn">
                        {isPreviewVisible ? (
                            <PaymentPreview batch={batch} employees={employees} paymentDetails={paymentDetails} />
                        ) : (
                            <div className="previewPlaceholder">
                                <p>Click 'Show Preview' to generate the payment summary.</p>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => setIsPreviewVisible(prev => !prev)}
                            className="button previewButton"
                        >
                            <Eye />
                            {isPreviewVisible ? 'Hide Preview' : 'Show Preview'}
                        </button>
                    </div>
                </div>

                <div className="modalFooter">
                    <button
                        onClick={handleDraft}
                        disabled={isProcessing}
                        className="button button-secondary"
                    >
                        Draft
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="button button-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid || isProcessing}
                        className="button button-success"
                    >
                        {isProcessing ? (
                            <>
                                <Loader className="loader" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Send />
                                Submit Payment
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InitiatePaymentModal;