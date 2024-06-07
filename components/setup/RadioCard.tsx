import React from 'react';
import { RenderMarkdown } from '../RenderMarkdown';

interface RadioCardProps {
    value: string;
    label: string;
    selected: boolean;
    onSelect: (value: string) => void;
}

const RadioCard: React.FC<RadioCardProps> = ({ value, label, selected, onSelect }) => {
    return (
        <div
            className={`border p-4 rounded-lg cursor-pointer flex items-start ${selected ? 'border-blue-500' : 'border-gray-300'}`}
            onClick={() => onSelect(value)}
        >
            <input
                type="radio"
                id={value}
                value={value}
                checked={selected}
                onChange={() => onSelect(value)}
                className='mr-2'
            />
            <RenderMarkdown markdownText={label}/>
        </div>
    );
};

export default RadioCard;
