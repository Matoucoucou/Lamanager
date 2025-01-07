import React from 'react';

export default function RightPart({ ComposantProp, ...props }) {
    return (
        <div className="Right">
            {ComposantProp && <ComposantProp {...props} />}
        </div>
    );
}