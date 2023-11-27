import React, { useState } from 'react';
import './LoadingStyles.css';

const AutomateInstallation: React.FC = () => {
    const [status, setStatus] = useState<string>('');
    const [command, setCommand] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const handleButtonClick = async () => {
        setIsLoading(true);
        setError(false);
        try {
            const response = await fetch('/api/start-process');
            const data = await response.json();
            setStatus(data.message);
        } catch (error) {
            console.error('Error starting process:', error);
            setStatus('Failed to start process');
            setError(true);
        }
        setIsLoading(false);
    };

    return (
        <div>
            <button onClick={handleButtonClick} disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Start Process'}
            </button>
            {isLoading && <div id="spinner"></div>}
            {error && <div id="error-symbol"></div>}
            {status && <p>Status: {status}</p>}
            {command && <p>{command}</p>}
        </div>
    );
};

export default AutomateInstallation;
