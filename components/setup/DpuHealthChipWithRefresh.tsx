import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Button from '../Button';
import Chip from '../Chip';

interface DpuHealthStates {
    [key: string]: string;
}

const dpuHealthStates: DpuHealthStates = {
    START: 'yellow',
    FAILED: 'red',
    SUCCESS: 'green',
    INACTIVE: 'grey',
};

interface DpuHealthChipWithRefreshProps {
    userId: string;
}
const DpuHealthChipWithRefresh: React.FC<DpuHealthChipWithRefreshProps> = ({ userId }) => {
    const [healthStatus, setHealthStatus] = useState<keyof typeof dpuHealthStates>('INACTIVE');
    const [isLoading, setIsLoading] = useState(false);

    const fetchDpuHealth = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('/api/docs/getDpuHealth', { user_id: userId });
            const { healthStatus, healthTs } = response.data;
            console.log(`[DpuHealthChipWithRefresh] healthStatus: ${healthStatus}, response.data = ${JSON.stringify(response.data)}`)
            if (dpuHealthStates[healthStatus]) {
                setHealthStatus(healthStatus);
            } else {
                setHealthStatus('INACTIVE');
            }
        } catch (error) {
            console.error('Error fetching DPU health status:', error);
            setHealthStatus('INACTIVE');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDpuHealth();
    }, [userId]);

    const displayHealthStatus = String(healthStatus);
    return (
        <div className="flex items-center gap-0 border p-1">
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
