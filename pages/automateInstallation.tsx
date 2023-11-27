import React, { useState } from 'react';
import '../styles/loadingStyles.css';

const AutomateInstallation: React.FC = () => {
    const [status, setStatus] = useState<string>('');
    const [command, setCommand] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const handleButtonClick = async () => {
        setIsLoading(true);
        setError(false);
        try {
            const response = await fetch('/api/dpu/pubsub');
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
