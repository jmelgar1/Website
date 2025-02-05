import React from 'react';
import Planet from './Planet';
import { PLANETS } from '../config/planets.config.js';

const Mars = ({ isFocused, onFocus, onDrag }) => {
    return (
        <Planet
            {...PLANETS.mars}
            isFocused={isFocused}
            onFocus={onFocus}
            onDrag={onDrag}
        />
    );
};

export default Mars;