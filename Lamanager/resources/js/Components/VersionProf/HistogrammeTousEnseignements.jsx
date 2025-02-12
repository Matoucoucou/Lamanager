import React from 'react';
import { VictoryChart, VictoryStack, VictoryBar, VictoryAxis, VictoryTheme, VictoryTooltip, VictoryVoronoiContainer, VictoryLabel, VictoryLegend } from 'victory';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const HistogrammeTousEnseignements = ({ data }) => {

  const enseignements = Object.keys(data[0]).filter(key => key !== 'semaine' && key !== 'total');

  const colors = enseignements.reduce((acc, enseignement) => {
    acc[enseignement] = getRandomColor();
    return acc;
  }, {});

  const sanitizedData = data.map(item => {
    const sanitizedItem = { ...item };
    enseignements.forEach(enseignement => {
      if (isNaN(sanitizedItem[enseignement])) {
        sanitizedItem[enseignement] = 0;
      }
    });
    return sanitizedItem;
  });

  const chartWidth = window.innerWidth * 1;
  const chartHeight = window.innerHeight * 1;
  const numberOfBars = sanitizedData.length;
  const dynamicDomainPadding = Math.max(10, chartWidth / (numberOfBars * 2));

  return (
    <VictoryChart theme={VictoryTheme.material} domainPadding={dynamicDomainPadding} containerComponent={<VictoryVoronoiContainer />} width={chartWidth} height={chartHeight}>
      <VictoryLegend
        orientation="horizontal"
        gutter={20}
        style={{ border: { stroke: "black" }, title: { fontSize: 20 }, labels: { fontSize: 20 } }}
        data={enseignements.map((enseignement, index) => ({
          name: enseignement,
          symbol: { fill: colors[enseignement] }
        }))}
      />
      
      <VictoryAxis
        tickValues={sanitizedData.map(item => item.semaine)}
        tickFormat={sanitizedData.map(item => item.semaine)}
        style={{
            grid: { stroke: "none" } // Supprimer les lignes verticales
        }}
      />
      <VictoryAxis
        dependentAxis
        tickFormat={(x) => `${x}h`}
      />
      <VictoryLabel
        x={window.innerWidth * 0.5}
        y={window.innerHeight * 1}  
        style={{ fontSize: 30 }}
        textAnchor="middle"
        text="Répartition des heures par enseignement"
      />
      <VictoryStack>
        {enseignements.map((enseignement, index) => (
          <VictoryBar
            key={index}
            data={sanitizedData}
            x="semaine"
            y={enseignement}
            style={{ data: { fill: colors[enseignement] } }}
            labels={({ datum }) => `${enseignement} : ${datum[enseignement]}h`}
            labelComponent={<VictoryTooltip style={{ fontSize: 15 }} />}
          />
        ))}
      </VictoryStack>
    </VictoryChart>
  );
};

export default HistogrammeTousEnseignements;