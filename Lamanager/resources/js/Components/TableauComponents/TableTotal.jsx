import React from 'react';



function TableTotal({ nbGroupe, nbCM, nbTD, nbTP, clickedCells, setPopupTotal }) {


    const categories = [
        { width: nbCM, label: 'CM' },
        { width: nbTD, label: 'TD' },
        { width: nbTP, label: 'TP' }
    ];

    function extractedTotalColumn(clickedCells, startIndex, width, groupTotals) {
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

    }

    function addEmptyGroup(groupTotals,label){
        if (label === categories[1].label) {
            for (let i = 0; i < nbTD; i++) {
                if (groupTotals[i] == null) {
                    groupTotals[i] = 0;
                }
            }
        }
        if (label === categories[2].label) {
            for (let i = 0; i < nbTP; i++) {
                if (groupTotals[i] == null) {
                    groupTotals[i] = 0;
                }
            }
        }
    }

    const calculateTotal = (startIndex, width, groupTotals) => {

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

    function getTotalCase(index, width, total, color, label, groupTotals) {
        if (label === "CM"){
            return (
                <td
                    key={index}
                    className="border border-black p-2"
                    style={{
                        width: `${100 / (nbGroupe + 2) * width}%`,
                        color: color
                    }}>
                    {total}
                </td>);
        }
        else {
        return (
            <td
                key={index}
                className="border border-black p-2"
                style={{
                    width: `${100 / (nbGroupe + 2) * width}%`,
                    color: color
                }}

                    onMouseEnter={(e) => handleMouseEnter(e, label, groupTotals, total)}
                    onMouseLeave={handleMouseLeave}



            >
                {total}
            </td>);}
    }
    function handleMouseEnter(event, label, groupTotals, total) {
        const cell = event.target; // Récupère la cellule cible
        const rect = cell.getBoundingClientRect();
        let content; // Initialisez comme un tableau pour accumuler les strings
        let color_list = [];
        let max_total = 0;
        for (let i = 0; i < Object.keys(groupTotals).length; i++){
            if (groupTotals[i] > max_total){
                max_total = groupTotals[i];

            }
        }

        content = Object.entries(groupTotals).map(([groupIndex, total]) => {
            if (total < max_total){
                color_list.push("red");
            }
            else {
                color_list.push("black");
            }
            const hours = Math.floor(total / 60);
            const minutes = total % 60;
            const time = minutes > 0 ? `${hours}h${minutes}` : `${hours}h`;
            return `${label}${parseInt(groupIndex) + 1}: ${time}`;
        })

        setPopupTotal({
            visible: true,
            x: rect.left, // Centré horizontalement
            y: rect.top - rect.height/2, // Position juste au-dessus de la cellule
            width: rect.width,
            height: rect.height / 2,
            content: content,
            frontSize: 16,
            total: total,
            color_list : color_list
        });
    }

    function handleMouseLeave() {
        setPopupTotal({ visible: false, x: 0, y: 0, content: '' });
    }
    return (
        <>
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
                {categories.map(({ width, label }, index) => {
                    const startIndex = index === 0 ? 0 :
                                     index === 1 ? nbCM :
                                     nbCM + nbTD;
                    const groupTotals = {};
                    extractedTotalColumn(clickedCells, startIndex, width, groupTotals);

                    addEmptyGroup(groupTotals,label);


                    const total = calculateTotal(startIndex, width, groupTotals);

                    const totals = Object.values(groupTotals);

                    if (totals.length !== 0) {
                        const firstTotal = totals[0];

                    if ((totals.length === width) && (totals.every(total => total === firstTotal))) {
                    return getTotalCase(index, width, total, "black",label, groupTotals);
                    }}
                    else {
                        return getTotalCase(index, width, total,"black", label, groupTotals);
                    }
                    return getTotalCase(index, width, total,"red", label, groupTotals);
                })}
            </tr>
        </tbody>
    </>

    );
}

export default TableTotal;
