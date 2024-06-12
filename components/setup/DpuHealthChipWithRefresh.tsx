import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Button from '../Button';
import Chip from '../Chip';

interface DpuHealthStates {
    [key: string]: string;
}

const dpuHealthStates: DpuHealthStates = {
    healthy: 'green',
    warning: 'yellow',
    error: 'red',
    unknown: 'grey',
};

interface DpuHealthChipWithRefreshProps {
    userId: string;
}
const DpuHealthChipWithRefresh: React.FC<DpuHealthChipWithRefreshProps> = ({ userId }) => {
    const [healthStatus, setHealthStatus] = useState<keyof typeof dpuHealthStates>('unknown');
    const [isLoading, setIsLoading] = useState(false);

    const fetchDpuHealth = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('/api/docs/getDpuHealth', { user_id: userId });
            const { healthStatus, healthTs } = response.data;
            if (dpuHealthStates[healthStatus]) {
                setHealthStatus(healthStatus);
            } else {
                setHealthStatus('unknown');
            }
        } catch (error) {
            console.error('Error fetching DPU health status:', error);
            setHealthStatus('unknown');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDpuHealth();
    }, [userId]);

    const displayHealthStatus = String(healthStatus);
    return (
        <div className="flex items-center gap-0">
            <Chip
                name={displayHealthStatus.charAt(0).toUpperCase() + displayHealthStatus.slice(1)}
                disabled={false}
                className={`bg-${dpuHealthStates[healthStatus]}`}
                circleColor={dpuHealthStates[healthStatus]}
            />
            <Button variant="text" onClick={fetchDpuHealth} disabled={isLoading}>
                {isLoading ? (
                    <div className='inline-block border-4 border-t-secondary rounded-full w-4 h-4 animate-spin'></div>
                ) : (
                    <span style={{ fontSize: '1.25rem' }}>&#x21bb;</span> // Display the refresh icon
                )}
            </Button>
        </div>
    );
};

export default DpuHealthChipWithRefresh;
