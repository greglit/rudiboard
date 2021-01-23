<script>
  import { Pie } from 'vue-chartjs'
  import ChartDataLabels from 'chartjs-plugin-datalabels';

  export default {
    extends: Pie,
    props: ['pieData'],
    data () {
      return {
        chartData: {
          labels: ["Wins", "Draws", "Losses",],
          datasets: [{
              borderWidth: 1,
              borderColor: [
              'rgba(0,180,81,1)',
              'rgba(92,107,192, 1)',
              'rgba(255,90,78,1)',           
              ],
              backgroundColor: [
              'rgba(0,180,81, 0.2)',
              'rgba(92,107,192, 0.2)',
              'rgba(255,90,78, 0.2)',                
              ],
              data: this.pieData
            }]
        },
        options: {
          legend: {
            display: true
          },
          responsive: true,
          maintainAspectRatio: false
        }
      }
    },
    mounted () {
      this.renderChart(this.chartData, this.options)
    }
  }
</script>