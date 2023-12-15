import { useColorModeValue } from '@chakra-ui/react';
import ApexChart from 'react-apexcharts';

export const Chart = ({ title, series }: { title: string; series: ApexAxisChartSeries }) => (
  <ApexChart
    options={{
      title: { text: title },
      chart: {
        foreColor: useColorModeValue('gray.900', 'white'),
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false,
        },
      },
      grid: {
        show: false,
      },
      xaxis: {
        type: 'category',
      },
      stroke: {
        width: 3,
        curve: 'smooth',
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 100],
          colorStops: [
            {
              offset: 0,
              color: '#d55b6d',
              opacity: 1,
            },
            { offset: 100, color: '#8c3bdd', opacity: 1 },
          ],
        },
      },
    }}
    series={series}
    type="line"
    height={200}
  />
);
