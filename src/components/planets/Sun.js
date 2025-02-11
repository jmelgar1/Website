import React from 'react';
import Planet from '../Planet';
import { PLANETS } from '../../config/planets.config.js';

const Sun = ({ isFocused, onFocus, onDrag }) => {
    return (
        <Planet
            {...PLANETS.sun}
            isFocused={isFocused}
            onFocus={onFocus}
            onDrag={onDrag}
        />
    );
};

export default Sun;