import React from 'react';
import { VictoryChart, VictoryStack, VictoryBar, VictoryAxis, VictoryTheme, VictoryTooltip, VictoryVoronoiContainer, VictoryLabel, VictoryLegend } from 'victory';

const HistogrammeGroupe = ({ data }) => {

  const sanitizeData = (data) => {
  return data.map(item => {
    const sanitizedItem = { ...item };
    ['CM', 'TD', 'TP'].forEach(type => {
      if (isNaN(sanitizedItem[type])) {
        sanitizedItem[type] = 0;
      }
    });
    return sanitizedItem;
  });
};

  const sanitizedData = sanitizeData(data);

  console.log("les data pour l'histogramme groupe", sanitizedData);

  const chartWidth = window.innerWidth * 0.9;
  const chartHeight = window.innerHeight * 0.9;
  const numberOfBars = data.length;
  const dynamicDomainPadding = Math.max(10, chartWidth / (numberOfBars * 2)); 
  
  const formattedData = sanitizedData.map(item => ({
    semaine: item.semaine,
    CM: item.CM,
    TD: item.TD,
    TP: item.TP,
  }));

  return (
    <VictoryChart theme={VictoryTheme.material} domainPadding={dynamicDomainPadding} containerComponent={<VictoryVoronoiContainer />} width={window.innerWidth * 0.9} height={window.innerHeight * 0.9}>
      
      <VictoryLegend
        orientation="horizontal"
        gutter={20}
        style={{ border: { stroke: "black" }, title: { fontSize: 24 }, labels: { fontSize: 18 } }}
        data={[
          { name: "CM", symbol: { fill: "#FFCE6E" } },
          { name: "TD", symbol: { fill: "#FF6D88" } },
          { name: "TP", symbol: { fill: "#62C4FB" } }
        ]}
      />

      <VictoryAxis
        tickValues={formattedData.map(item => item.semaine)}
        tickFormat={formattedData.map(item => item.semaine)}
        style={{
            grid: { stroke: "none" } // Supprimer les lignes verticales
        }}
      />
      <VictoryAxis
        dependentAxis
        tickFormat={(x) => `${x}h`}
     
      />
      <VictoryLabel
        x={window.innerWidth * 0.4}
        y={window.innerHeight * 0.9}  
        style={{ fontSize: 30 }}
        textAnchor="middle"
        text="Répartition des heures par type de cours"
      />
      <VictoryStack>
      <VictoryBar
          data={formattedData}
          x="semaine"
          y="CM"
          style={{ data: { fill: "#FFCE6E" } }}
          labels={({ datum }) => `CM : ${datum.CM}h`}
          labelComponent={<VictoryTooltip style={{ fontSize: 15 }} />}
        />
        <VictoryBar
          data={formattedData}
          x="semaine"
          y="TD"
          style={{ data: { fill: "#FF6D88" } }}
          labels={({ datum }) => `TD : ${datum.TD}h`}
          labelComponent={<VictoryTooltip style={{ fontSize: 15 }} />}
        />
        <VictoryBar
          data={formattedData}
          x="semaine"
          y="TP"
          style={{ data: { fill: "#62C4FB" } }}
          labels={({ datum }) => `TP : ${datum.TP}h`}
          labelComponent={<VictoryTooltip style={{ fontSize: 15 }} />}
        />

      </VictoryStack>
    </VictoryChart>
  );
};

export default HistogrammeGroupe;