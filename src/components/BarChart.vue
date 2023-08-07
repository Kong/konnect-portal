<template>
    <Bar 
      v-if="loaded"
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
  </template>
    
    <script>
    import { Bar } from 'vue-chartjs'
    import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
    
    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
    
    export default {
      name: 'BarChart',
      components: { Bar },
      data: () => ({
        loaded: false,
        chartData: 
        {
          labels: [],
          datasets: [
            {
              label: 'Access Stats',
              backgroundColor: '#f87979',
              data: []
            }
          ]
        },
        chartOptions: {
          responsive: true
        }
      }),
      async mounted () {
        this.loaded = false;
        try {
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              "aggs": {
                "access_stats": {
                  "date_histogram": {
                    "field": "@timestamp",
                    "calendar_interval": "1d"
                  }
                }
              }
            })
          };
          const stats = await fetch("https://elk.service-connectivity.com/kong-*/_search?size=0", requestOptions)
            .then(response => response.json());
          //console.log(data);
          this.chartData.datasets[0].data = stats.aggregations.access_stats.buckets.map(row => row.doc_count);
          this.chartData.labels = stats.aggregations.access_stats.buckets.map(row => row.key_as_string);
          console.log(this.chartData.datasets.data);
          this.loaded = true;
        } catch (e) {
          console.error(e)
        }
      },
    }
    </script>