import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function usePDFDownload() {
  const downloadTableauRecapitulatif = (processedTableauData) => {
    if (!processedTableauData || processedTableauData.length === 0) {
      console.error('No tableau data available');
      return;
    }

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Tableau Récapitulatif', 14, 22);
    
    // Prepare table data
    const tableData = processedTableauData.map(row => [
      row.enseignement, 
      row.CM.toFixed(2), 
      row.TD.toFixed(2), 
      row.TP.toFixed(2), 
      row.total.toFixed(2), 
      row.equivalentTD.toFixed(2)
    ]);

    // Add table using jspdf-autotable
    doc.autoTable({
      startY: 30,
      head: [['Enseignement', 'CM', 'TD', 'TP', 'Total', 'Equivalent TD']],
      body: tableData,
      theme: 'striped',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [200, 200, 200] }
    });

    // Save the PDF
    doc.save('tableau_recapitulatif.pdf');
  };

  const downloadTableauDetails = (processedDetailsData) => {
    if (!processedDetailsData || processedDetailsData.length === 0) {
      console.error('No details data available');
      return;
    }

    const doc = new jsPDF({
      orientation: 'landscape'
    });
    
    // Add title
    doc.setFontSize(18);
    doc.text('Tableau Détaillé par Semaine', 14, 22);
    
    // Get unique enseignement names
    const enseignementNames = [...new Set(processedDetailsData.flatMap(item => 
      item.enseignements.map(ens => ens.nom)
    ))];

    // Prepare table data
    const tableData = [
      // Header row
      ['Enseignement', ...processedDetailsData.map(item => item.semaine)],
      
      // Rows for each enseignement and type
      ...enseignementNames.flatMap(enseignementName => [
        // Enseignement name row
        [enseignementName, ...processedDetailsData.map(() => '')],
        
        // CM, TD, TP rows
        ...['CM', 'TD', 'TP'].map(type => [
          type,
          ...processedDetailsData.map(item => {
            const enseignement = item.enseignements.find(
              ens => ens.nom === enseignementName
            );
            return enseignement && enseignement[type] > 0 
              ? `${enseignement[type].toFixed(2)}h` 
              : '-';
          })
        ])
      ]),

      // Total row
      ['Total', ...processedDetailsData.map(item => `${item.total.toFixed(2)}h`)]
    ];

    // Add table using jspdf-autotable
    doc.autoTable({
      startY: 30,
      body: tableData,
      theme: 'plain',
      styles: { 
        fontSize: 10,
        cellPadding: 2,
        lineWidth: 0.5,
        lineColor: [200, 200, 200]
      },
      columnStyles: {
        0: { 
          fillColor: [240, 240, 240],
          fontStyle: 'bold'
        }
      },
      didParseCell: (data) => {
        // Style specific cells
        if (data.row.index === 0) {
          // Header row
          data.cell.styles.fillColor = [200, 200, 200];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });

    // Save the PDF
    doc.save('tableau_details_semaine.pdf');
  };

  return {
    downloadTableauRecapitulatif,
    downloadTableauDetails
  };
}