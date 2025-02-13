import React from 'react';
import { useTableauVersionProf } from '../hooks/useTableauVersionProf';

export default function TableauVersionProf({ anneeId }) {
  const { processedData, loading, error } = useTableauVersionProf(anneeId);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <table className="w-full border-collapse border border-gray-200">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2">Enseignement</th>
          <th className="border p-2">CM</th>
          <th className="border p-2">TD</th>
          <th className="border p-2">TP</th>
          <th className="border p-2">Total</th>
          <th className="border p-2">Equivalent TD</th>
        </tr>
      </thead>
      <tbody>
        {processedData.length > 0 ? (
          processedData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border p-2 text-center">{row.enseignement}</td>
              <td className="border p-2 text-right">{row.CM.toFixed(2)}</td>
              <td className="border p-2 text-right">{row.TD.toFixed(2)}</td>
              <td className="border p-2 text-right">{row.TP.toFixed(2)}</td>
              <td className="border p-2 text-right">{row.total.toFixed(2)}</td>
              <td className="border p-2 text-right">{row.equivalentTD.toFixed(2)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center p-4">Aucune donnée disponible</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}