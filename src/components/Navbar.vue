<template>
    <b-navbar v-if="$route.name != 'invite'" size="sm" sticky variant="light" type="light" class="shadow" style="height:50px" :print="true">
      <b-container>
        <b-navbar-brand to="/" class="my-n2">
          <img src="../../public/rudicon.png" class="d-inline-block align-top logo" alt="rudiboard">
          <span v-if="$route.params.boardName == undefined" class="ml-2" style="font-size:18pt">Rudiboard</span>
        </b-navbar-brand>
        <b-navbar-nav v-if="$route.params.boardName != undefined" class="abs-center-x">
          <b-nav-text>
            <h1 class="text-center mb-0 board-title marker">
              <router-link :to="'/board/'+$route.params.boardName+'/'+$route.params.boardId">
                {{$route.params.boardName}}
              </router-link>
            </h1>
          </b-nav-text>
        </b-navbar-nav>
        <b-navbar-nav v-if="$route.params.boardName != undefined" class="ml-auto m-n1">
          <b-nav-item right>
            <b-button variant="secondary border-0" size="sm" v-b-modal.shareModal>
              <b-icon-share-fill/>
            </b-button>
          </b-nav-item>
        </b-navbar-nav>
      </b-container>
      <b-modal hide-footer size="lg" id="shareModal" title="Share this board with others">
        <b-container class="m-0 p-0" ref="container">
            <b-form>
              <b-form-group label-size="sm" label="Share the link:">
                <b-input-group>
                  <b-input-group-prepend>
                    <b-button disabled variant="rudi">
                      <b-icon-link45deg/>
                    </b-button>
                  </b-input-group-prepend>
                  <b-form-input disabled v-model="boardurl"></b-form-input>
                  <b-input-group-append>
                    <b-button variant="outline-primary" @click="copyToClipboard(boardurl)">
                      <b-icon-files/>
                      Copy
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
              <b-form-group label-size="sm" :label="`Enter board code on ${siteurl}`">
                <b-input-group>
                  <b-input-group-prepend>
                    <b-button disabled variant="rudi">
                      <b-icon-key/>
                    </b-button>
                  </b-input-group-prepend>
                  <b-form-input disabled v-model="$route.params.boardId"></b-form-input>
                  <b-input-group-append>
                    <b-button variant="outline-primary" @click="copyToClipboard($route.params.boardId)">
                      <b-icon-files/>
                      Copy
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
              <b-form-group label-size="sm" label="Join via QR-Code">
                <b-button-group class="w-100">
                  <b-button variant="outline-primary" @click="showQR = !showQR">{{showQR? 'Hide' : 'Show'}} QR-Code</b-button>
                  <b-button variant="outline-primary" :to="'/invite/'+$route.params.boardName+'/'+$route.params.boardId">
                    <b-icon-printer class="mr-2"/>Print invitation
                  </b-button>
                </b-button-group>
                <b-card v-if="showQR" bg-variant="" class="mt-1">
                  <qrcode-vue :value="boardurl" :size="230" level="H" class="mx-auto" style="width:230px;"/>
                  <img src="../../public/rudicon.png" class="qr-logo mx-auto" alt="rudiboard">
                </b-card>
              </b-form-group>
            </b-form>
          <b-alert show variant="rudi" class="mt-3">
            <p>Share your thoughts and ideas or report issues:</p>
            <p style="font-size:14pt;">
              <a href="mailto:rudiboard@gregl.it">
                <b-badge class="mr-1" variant="info"><b-icon-envelope-open class="mr-1"/>rudiboard@gregl.it </b-badge>
              </a>
              <a href="https://github.com/greglit/rudiboard">
                <b-badge class="mr-1" variant="info"><b-icon-github class="mr-1"/>greglit/rudiboard</b-badge>
              </a>
            </p>
            <p>Share your love and support for Rudiboard:</p>
            <form action="https://www.paypal.com/donate" method="post" target="_top" class="mx-auto" style="width:100px">
              <input type="hidden" name="hosted_button_id" value="9AJSPC3S83C9W" />
              <input type="image" src="https://www.paypalobjects.com/en_US/DK/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
              <img alt="" border="0" src="https://www.paypal.com/en_DE/i/scr/pixel.gif" width="1" height="1" />
            </form>
          </b-alert>
        </b-container>
      </b-modal>
    </b-navbar>
</template>

<script>
import QrcodeVue from 'qrcode.vue'

export default {
  name: 'Navbar',
  components: {
    QrcodeVue,
  },
  data() {
    return {
      siteurl : 'rudiboard.gregl.it',
      showQR : false
    }
  },
  computed: {
    boardurl() {
      return `https://${this.siteurl}/board/${this.$route.params.boardName}/${this.$route.params.boardId}`;
    }
  },
  methods: {
    copyToClipboard(value) {
      let container = this.$refs.container
      this.$copyText(value, container).then((e) => {
        this.makeToast(`Copied "${value}" to the clipboard!`);
      }, (error) => {
        console.log('failed to copy:'+e)
      })
    },
  },
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
.logo {
  height: 35px;
  width: 35px;
}
.board-title {
  color: white;
}

.abs-center-x {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>
