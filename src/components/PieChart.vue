<script>
  import { Pie } from 'vue-chartjs'

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
              'rgba(0, 153, 0,1)',
              'rgba(255, 153, 51, 1)',
              'rgba(255, 0, 0, 1)',           
              ],
              backgroundColor: [
              'rgba(0, 153, 0, 0.2)',
              'rgba(255, 153, 51, 0.2)',
              'rgba(255, 0, 0, 0.2)',                
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