import React from 'react';

function TableTotal({ nbGroupe, nbCM, nbTD, nbTP, longueurSemaines, clickedCells }) {
    const categories = [
        { width: nbCM },
        { width: nbTD },
        { width: nbTP }
    ];

    const calculateTotal = (startIndex, width) => {
        const groupTotals = {};
        
        Object.entries(clickedCells).forEach(([key, cell]) => {
            if (cell?.clicked) {
                const [_, colIndex] = key.split('-').map(Number);
                if (colIndex >= startIndex && colIndex < startIndex + width) {
                    if (cell.text) {
                        const [timeStr] = cell.text.split(' - ');
                        const [hours, minutes] = timeStr.split('h').map(num => parseInt(num) || 0);
                        if (!isNaN(hours)) {
                            const totalMinutes = hours * 60 + minutes;
                            const groupIndex = colIndex - startIndex;
                            groupTotals[groupIndex] = (groupTotals[groupIndex] || 0) + totalMinutes;
                        }
                    }
                }
            }
        });

        const totals = Object.values(groupTotals);
        if (totals.length === width) {
            const firstTotal = totals[0];
            if (totals.every(total => total === firstTotal)) {
                const hours = Math.floor(firstTotal / 60);
                const minutes = firstTotal % 60;
                return minutes > 0 ? `${hours}h${minutes}` : `${hours}h`;
            }
        }

        const possibleTotals = new Set(totals);
        let maxValidTotal = 0;

        for (const total of possibleTotals) {
            const groupsWithTotal = totals.filter(t => t >= total).length;
            if (groupsWithTotal === width && total > maxValidTotal) {
                maxValidTotal = total;
            }
        }
        
        const hours = Math.floor(maxValidTotal / 60);
        const minutes = maxValidTotal % 60;
        return minutes > 0 ? `${hours}h${minutes}` : `${hours}h`;
    };

    return (
        <tbody>
            <tr>
                <td 
                    className="border border-black p-2" 
                    style={{ 
                        height: '70px',
                        width: `${100 / (nbGroupe + 2)}%` 
                    }}
                >
                    Total
                </td>
                {categories.map(({ width }, index) => {
                    const startIndex = index === 0 ? 0 : 
                                     index === 1 ? nbCM : 
                                     nbCM + nbTD;
                    const total = calculateTotal(startIndex, width);
                    
                    return (
                        <td
                            key={index}
                            className="border border-black p-2"
                            style={{ 
                                width: `${100 / (nbGroupe + 2) * width}%`
                            }}
                        >
                            {total}
                        </td>
                    );
                })}
            </tr>
        </tbody>
    );
}

export default TableTotal;