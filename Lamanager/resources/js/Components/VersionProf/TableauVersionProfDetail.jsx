import React, { useEffect } from 'react';
import { useTableauVersionProfDetail } from '../../hooks/useTableauVersionProfDetail';

export default function TableauVersionProfDetail({ 
  anneeId, 
  onDataReady 
}) {
  const { processedData, loading, error } = useTableauVersionProfDetail(anneeId);

  useEffect(() => {
    if (onDataReady && processedData.length > 0) {
      onDataReady(processedData);
    }
  }, [processedData, onDataReady]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <table className="w-full border-collapse border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-2" colSpan="2">Enseignement</th>
          {processedData.map(item => (
            <th key={item.semaine} className="border p-2">{item.semaine}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* Récupérer les noms uniques des enseignements */}
        {[...new Set(processedData.flatMap(item => 
          item.enseignements.map(ens => ens.nom)
        ))].map(enseignementName => (
          <>
            <tr key={enseignementName}>
              <th className="border p-2 font-bold" rowSpan={4}>{enseignementName}</th>
            </tr>
            {['CM', 'TD', 'TP'].map(type => (
              <tr key={`${enseignementName}-${type}`}>
                <th className="border p-2">{type}</th>
                {processedData.map(item => {
                  // Trouver l'enseignement correspondant
                  const enseignement = item.enseignements.find(
                    ens => ens.nom === enseignementName
                  );
                  return (
                    <td key={`${item.semaine}-${type}`} className="border p-2">
                      {enseignement ? (enseignement[type] > 0 ? `${enseignement[type].toFixed(2)}h` : '-') : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th className="bg-gray-100 border p-2" colSpan="2">Total</th>
          {processedData.map(item => (
            <td key={item.semaine} className="border p-2">
              {item.total.toFixed(2)+'h'}
            </td>
          ))}
        </tr>
      </tfoot>
    </table>
  )
}