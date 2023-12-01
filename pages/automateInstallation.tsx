import React, { useState, CSSProperties, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import { getAuthUserId } from '../utils/auth';

const spinnerStyle: CSSProperties = {
    border: '5px solid rgba(0,0,0,.3)',
    borderTop: '5px solid #3498db',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s ease-in-out infinite',
};

const errorSymbolStyle: CSSProperties = {
    width: '50px',
    height: '50px',
    backgroundColor: '#f44336',
    borderRadius: '50%',
    position: 'relative',
    display: 'inline-block',
};

const AutomateInstallation: React.FC = () => {
    const session: Session | null = useSession().data; 

    const [userId, setUserId] = useState<string | null>(null);
    const [orgName, setOrgName] = useState<string>('');
    const [provider, setProvider] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [command, setCommand] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const fetchedUserId = getAuthUserId(session);
        setUserId(fetchedUserId);
    }, []);

    const handleButtonClick = async () => {
        if (!userId) {
            setStatus('User ID not found.');
            return;
        }

        setIsLoading(true);
        setError(false);
        try {
            const response = await fetch('/api/start-process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, orgName, provider }),
            });
            const data = await response.json();
            setStatus(data.message); //Currently we don't set any message in data but as soon as we merge Tapish's code, we will be setting this value and based on that only we'll process further.

            if (data.success) {
                setCommand('Please run these commands: docker pull dpu:v1.0.3 & docker run dpu:v1.0.3');
            }
        } catch (error) {
            console.error('Error starting process:', error);
            setStatus('Failed to start process');
            setError(true);
        }
        setIsLoading(false);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Organization Name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Provider"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
            />
            <button onClick={handleButtonClick} disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Start Process'}
            </button>
            {isLoading && <div style={spinnerStyle}></div>}
            {error && <div style={errorSymbolStyle}></div>}
            {status && <p>Status: {status}</p>}
            {command && <p>{command}</p>}
        </div>
    );
};

export default AutomateInstallation;
