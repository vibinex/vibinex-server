import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Button from '../Button';
import Chip from '../Chip';

interface DpuHealthStates {
    [key: string]: string;
}

const dpuHealthStates: DpuHealthStates = {
    healthy: 'green',
    stale: 'yellow',
    'never-seen': 'grey',
    error: 'red',
};

interface DpuHealthChipWithRefreshProps {
    userId: string;
}
const DpuHealthChipWithRefresh: React.FC<DpuHealthChipWithRefreshProps> = ({ userId }) => {
    const [healthStatus, setHealthStatus] = useState<keyof typeof dpuHealthStates>('never-seen');
    const [isLoading, setIsLoading] = useState(false);

    const fetchDpuHealth = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('/api/docs/getDpuHealth', { user_id: userId });
            const { healthState } = response.data;
            if (dpuHealthStates[healthState]) {
                setHealthStatus(healthState);
            } else {
                setHealthStatus('error');
            }
        } catch (error) {
            console.error('Error fetching DPU health status:', error);
            setHealthStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDpuHealth();
    }, [userId]);

    const displayHealthStatus = String(healthStatus);
    return (
        <div className="flex flex-row justify-center items-center border rounded-full p-2">
            DPU Status:
            <Button variant="text" onClick={fetchDpuHealth} disabled={isLoading}>
                {isLoading ? (
                    <div className='inline-block border-4 border-t-secondary rounded-full w-4 h-4 animate-spin'></div>
                ) : (
                    <span style={{ fontSize: '1.25rem' }}>&#x21bb;</span> // Display the refresh icon
                )}
            </Button>
            <Chip
                name={displayHealthStatus.charAt(0).toUpperCase() + displayHealthStatus.slice(1)}
                disabled={false}
                className={`bg-${dpuHealthStates[healthStatus]}`}
                circleColor={dpuHealthStates[healthStatus]}
            />
        </div>
    );
};

export default DpuHealthChipWithRefresh;
