import React from 'react';
import Planet from '../Planet';
import { PLANETS } from '../../config/planets.config.js';

const Earth = ({ isFocused, onFocus, onDrag }) => {
    return (
        <Planet
            {...PLANETS.earth}
            isFocused={isFocused}
            onFocus={onFocus}
            onDrag={onDrag}
        />
    );
};

export default Earth;