<template>
    <b-navbar size="sm" sticky variant="light" type="light" class="shadow">
      <b-container>
        <b-navbar-brand to="/" class="my-n2">
          <img src="../../public/rudicon.png" class="d-inline-block align-top logo" alt="rudiboard">
          <span v-if="$route.params.boardName == undefined" class="ml-2">rudiboard</span>
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
        <a :href="`https://rudiboard.netlify.app/board/${$route.params.boardName}/${$route.params.boardId}`">
          
        </a>
        <b-row>
          <b-col>
            <span>Board code</span><h5>{{$route.params.boardId}}</h5>
          </b-col>
          <b-col class="float-right">
            <b-button>Copy link</b-button>
          </b-col>
        </b-row>
        
      </b-modal>
    </b-navbar>
</template>

<script>
export default {
  name: 'Navbar',
}
</script>

<style scoped>
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
