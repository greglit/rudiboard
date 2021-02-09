<template>
  <div>
    <b-button class="mt-3" variant="outline-primary" @click="print()">
      <b-icon-printer class="mr-2"/>Print
    </b-button>
    <b-container ref="invite">
      <h1 class="display-2 marker mt-5 text-center">{{$route.params.boardName}}</h1>
      <h3 class="mt-5  text-center">Board Code</h3>
      <h1 class="display-1  text-center" style="font-family: monospace; margin-top:-25px; margin-bottom:-20px">{{$route.params.boardId}}</h1>
      <h3 class=" text-center">Enter on rudiboard.netlify.app</h3>
      <br>
      <h3 class=" text-center">Or simply scan the QR-Code:</h3>
      <b-card class="mt-1 mx-auto" style="width:350px">
        <qrcode-vue :value="boardurl" :size="300" level="H" class="mx-auto" style="width:300px;"/>
        <img src="../../public/rudicon.png" class="qr-logo mx-auto" alt="rudiboard">
      </b-card>
    </b-container>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import html2pdf from 'html2pdf.js'

export default {
  name: 'Invitation',
  components: {
    QrcodeVue,
  },
  data() {
    return {
      siteurl : 'rudiboard.netlify.app',
      showQR : false
    }
  },
  computed: {
    boardurl() {
      return `https://${this.siteurl}/board/${this.$route.params.boardName}/${this.$route.params.boardId}`;
    }
  },
  methods: {
    print() {
      let element = this.$refs.invite;
      html2pdf(element);
    },
  }
}
</script>

<style scoped>
.qr-logo{
  margin: auto;
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  height: 50px;
  width: 50px;
}
</style>