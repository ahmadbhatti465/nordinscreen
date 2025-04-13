<template>
  <div id="wrapper">
    <!-- <CommonHeader></CommonHeader> -->

    <div class="">
      <div class="container">
        <div class="card">
          <div class="card-header">
            <CommonSubNav></CommonSubNav>
          </div>
          <!-- <div class="card-header">>Bots Page</div> -->
          <div class="card-body">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommonHeader from '../CommonHeader.vue'
import CommonFooter from '../CommonFooter.vue'
import CommonSubNav from '../CommonSubNav.vue'

export default {
  name: 'account-settings-page',
  components: {
    CommonHeader: CommonHeader,
    CommonFooter: CommonFooter,
    CommonSubNav: CommonSubNav,
  },
  data() {
    return {
      bots: [],
    }
  },
  watch: {},
}
</script>

<style>

</style>