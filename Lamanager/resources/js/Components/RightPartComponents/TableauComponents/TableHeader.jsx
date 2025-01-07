import React from 'react';
import { traitementNom } from '../../../utils.js';

function TableHeader({ enseignement, nbGroupe, nbCM, nbTD, nbTP, groupNames }) {
    return (
        <>
            <tr>
                <th
                    className="border border-black p-2"
                    style={{ width: `${100 / (nbGroupe + 2)}%`, height: '100px' }}
                    rowSpan="2"
                >
                    {traitementNom(enseignement.nom)}
                </th>
                <th
                    className="border border-black p-2"
                    style={{ width: `${100 / (nbGroupe + 2)*(nbCM)}%` }}
                    colSpan={nbCM}
                >
                    CM
                </th>
                <th
                    className="border border-black p-2"
                    style={{ width: `${100 / (nbGroupe + 2)*(nbTD)}%` }}
                    colSpan={nbTD}
                >
                    TD
                </th>
                <th
                    className="border border-black p-2"
                    style={{ width: `${100 / (nbGroupe + 2)*(nbTP)}%` }}
                    colSpan={nbTP}
                >
                    TP
                </th>
            </tr>
            <tr>
                {groupNames.map((nom, index) => (
                    <th
                        key={index}
                        className="border border-black p-2"
                        style={{ height: '50px', width: `${100 / (nbGroupe + 2)}%` }}
                    >
                        {nom}
                    </th>
                ))}
            </tr>
        </>
    );
}

export default TableHeader;
