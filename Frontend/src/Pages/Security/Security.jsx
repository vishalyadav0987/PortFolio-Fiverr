import React, { useEffect } from 'react';
import './Security.css'
import razorpayImg from '../../assets/razorpayicon.svg'
import soc from '../../assets/soc.svg'
import iso from '../../assets/iso.svg'


const Security = () => {
    useEffect(()=>{
        window.scrollTo(0,0)
    },[])
    return (
        <div className="security-container">
            <div className="security-header">
                <ShieldIcon />
                <h1>VY Security Center</h1>
                <p>Enterprise-grade protection for all transactions and communications</p>
            </div>

            <div className="security-grid">
                {/* Payment Security */}
                <div className="security-card">
                    <div className="card-header">
                        <CreditCardIcon />
                        <h3>Payment Protection</h3>
                    </div>
                    <ul>
                        <li><span>✓</span> PCI-DSS Certified Razorpay Integration</li>
                        <li><span>✓</span> 256-bit SSL Encryption</li>
                        <li><span>✓</span> Escrow Payment System</li>
                        <li><span>✓</span> Fraud Detection System</li>
                    </ul>
                    <div className="security-status">
                        <div className="status-bar" style={{ width: '100%' }}></div>
                        <span>Active Monitoring</span>
                    </div>
                </div>

                {/* Data Protection */}
                <div className="security-card">
                    <div className="card-header">
                        <LockIcon />
                        <h3>Data Security</h3>
                    </div>
                    <div className="encryption-badge">
                        <EyeOffIcon />
                        <span>AES-256 Encryption</span>
                    </div>
                    <div className="data-protection">
                        <div className="protection-item">
                            <span>Messages</span>
                            <div className="protection-status active">E2E Encrypted</div>
                        </div>
                        <div className="protection-item">
                            <span>Files</span>
                            <div className="protection-status active">IPFS Storage</div>
                        </div>
                        <div className="protection-item">
                            <span>Credentials</span>
                            <div className="protection-status active">Bcrypt Hashed</div>
                        </div>
                    </div>
                </div>

                {/* Account Security */}
                <div className="security-card">
                    <div className="card-header">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
                            fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                        <h3>Account Protection</h3>
                    </div>
                    <div className="security-features">
                        <div className="feature-item">
                            <span>2FA Authentication</span>
                            <div className="toggle active">Enabled</div>
                        </div>
                        <div className="feature-item">
                            <span>Login Alerts</span>
                            <div className="toggle active">Enabled</div>
                        </div>
                        <div className="feature-item">
                            <span>Device Management</span>
                            <div className="toggle">3 Devices</div>
                        </div>
                    </div>
                </div>

                {/* Review System */}
                <div className="security-card">
                    <div className="card-header">
                        <MessageIcon />
                        <h3>Trust & Verification</h3>
                    </div>
                    <div className="verification-system">
                        <div className="verification-step completed">
                            <span>1</span>
                            <p>Client Identity Verification</p>
                        </div>
                        <div className="verification-step completed">
                            <span>2</span>
                            <p>Transaction Validation</p>
                        </div>
                        <div className="verification-step completed">
                            <span>3</span>
                            <p>Post-completion Review</p>
                        </div>
                    </div>
                </div>

                {/* New Card 2: Session Security */}
                <div className="security-card">
                    <div className="card-header">
                        <SessionSecurityIcon />
                        <h3>Session Security</h3>
                    </div>
                    <div className="session-list">
                        <div className="session-item active">
                            <span>Chrome • Windows</span>
                            <span>192.168.1.1</span>
                            <span>Now</span>
                        </div>
                        <div className="session-item">
                            <span>Safari • iOS</span>
                            <span>203.45.67.89</span>
                            <span>2h ago</span>
                        </div>
                    </div>
                    <button className="security-btn">
                        Manage Sessions →
                    </button>
                </div>


                {/* New Card 3: Compliance */}
                <div className="security-card">
                    <div className="card-header">
                        <ShieldIcon />
                        <h3>Compliance</h3>
                    </div>
                    <div className="compliance-list">
                        <div className="compliance-item">
                            <span>GDPR</span>
                            <div className="compliance-status full">Full Compliance</div>
                        </div>
                        <div className="compliance-item">
                            <span>PCI DSS</span>
                            <div className="compliance-status partial">Level 1</div>
                        </div>
                        <div className="compliance-item">
                            <span>ISO 27001</span>
                            <div className="compliance-status pending">In Progress</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="security-footer">
                <p>24/7 Security Monitoring • Automated Backups • GDPR Compliance</p>
                <div className="compliance-badges">
                    <img src={iso} alt="ISO 27001" />
                    <img src={soc} alt="SOC2" style={{
                        filter:"invert(1)"
                    }}/>
                    <img src={razorpayImg} alt="SOC2"  style={{
                        filter:"brightness(5)"
                    }}/>
                </div>
            </div>
        </div>
    );
};

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
        fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
        fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);

const CreditCardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
        fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>
);

const MessageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
        fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
);



const SessionSecurityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

export default Security;