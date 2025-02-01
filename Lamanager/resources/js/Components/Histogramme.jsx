import React from "react";
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme, VictoryTooltip, VictoryVoronoiContainer, VictoryLabel } from 'victory';

const Histogramme = ({ data }) => {
  console.log("les data pour l'histogramme", data);
  const chartWidth = window.innerWidth * 0.9;
  const chartHeight = window.innerHeight * 0.9;
  const numberOfBars = data.length;const dynamicDomainPadding = numberOfBars === 1 ? chartWidth / 2 : Math.max(10, chartWidth / (numberOfBars * 2));
  const barWidth = numberOfBars === 1 ? chartWidth / 6 : undefined;
  return (
    <VictoryChart
      theme={VictoryTheme.material}
      domainPadding={dynamicDomainPadding}
      containerComponent={<VictoryVoronoiContainer />}
      width={chartWidth}
      height={chartHeight}
    >
      <VictoryAxis
        tickValues={data.map(item => item.semaine)}
        tickFormat={data.map(item => item.semaine)}
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
        y={window.innerHeight * 0}  
        style={{ fontSize: 30 }}
        textAnchor="middle"
        text="Heures par semaine"
      />
      <VictoryBar
        data={data}
        x="semaine"
        y="heures"
        barWidth={barWidth}
        style={{ data: { fill: ({ datum }) => datum.couleur } }}
        labels={({ datum }) => `${datum.heures}h`}
        labelComponent={<VictoryTooltip style={{ fontSize: 20 }} />}
      />
    </VictoryChart>
  );
};

export default Histogramme;
