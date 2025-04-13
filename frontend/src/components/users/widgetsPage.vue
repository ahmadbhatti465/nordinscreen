<template>
  <div id="wrapper">
    <CommonSidebar :userId="userId"></CommonSidebar>

    <div class="main p-0">
      <CommonHeader :userId="userId" title="Widgets" subtitle="" :loading="loading"></CommonHeader>
    </div>

    <main class="main">

      <div class="">
        <div class="row">
          <!-- <div class="col-1"></div> -->

          <div class="col-lg-8 col-md-10" style="padding: 0px;">

            <div>
              <section class="section dashboard">
                <div class="content-row row">
                  <!-- Left side columns -->
                  <div class="col-lg-12">
                    <div class="row">
                      <div class="pagetitle" style="position: relative">
                        <h1>&nbsp;</h1>
                        <a style="text-decoration: none; cursor: pointer;" data-bs-toggle="modal"
                          data-bs-target="#addWidgetModal">
                          <div class="action">
                            <div style="display: flex; align-items: center;">
                              <span class="action-icon" style="">
                                <i class="bx bxs-plus-circle"></i>
                              </span>
                              <h5 style="margin-left: 5px;">Add Widget</h5>
                            </div>
                          </div>

                        </a>
                        <hr style="color: grey" />
                      </div>
                      <!-- End Page Title -->
                    </div>
                    <div class="row">
                      <div class="col">
                        <div class="d-flex justify-content-between" style="color: red;">
                          <div>


                          </div>
                          <div>
                            <!-- Switch Grid View and Table view -->

                            <button class="btn btn-primary"
                              v-on:click="viewType = viewType == 'table' ? 'grid' : 'table'"
                              style="margin-bottom: 10px;" data-toggle="tooltip" data-placement="top"
                              title="Switch View">
                              <span v-if="viewType == 'table'">
                                <i class="bi bi-grid"></i>
                              </span>
                              <span v-else>
                                <i class="bi bi-list"></i>
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="widgets.length == 0" class="nodata">
                      <img src="../../assets/images/nodata.png" id="nodata_image" alt='' /><br />
                      <span>No Data Now</span>
                    </div>
                    <div class="row">
                      <div v-if="widgets.length > 0">
                        <div v-if="viewType == 'table'" class="table-responsive">
                          <table class="table table-bordered">
                            <thead>
                              <tr class="text-center text-nowrap fw-bold">
                                <td></td>
                                <td>Name</td>
                                <td>Type</td>
                                <td>Token</td>
                                <td>Op</td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(widget, index) in widgets" :key="widget._id">
                                <td class="fw-bold">{{ index + 1 }}</td>
                                <td>
                                  <!-- <router-link :to="'/user/view-widget/' + widget._id" class="viewBotLink"> -->{{
                                    widget.name
                                  }}<!-- </router-link> -->
                                </td>
                                <td>
                                  {{ widget.type }}
                                </td>
                                <td>
                                  {{ widget.token }}
                                </td>
                                <td>
                                  <!-- toggle status -->

                                  <a href="javascript:;" v-on:click="editWidget = widget" data-bs-toggle="modal"
                                    data-bs-target="#editWidgetModal">Edit</a>

                                  <span>&nbsp;|&nbsp;
                                    <a href="javascript:;" v-on:click="deleteWidget(widget._id, index)"
                                      class="deleteBotLink">Delete</a></span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div v-else>
                          <!--  -->
                          <!-- GridView for Bots -->
                          <!--  -->
                          <div class="container">
                            <div class="row">


                              <div class="col-xl-4 mb-4 mb-lg-4" v-for="(widget, index) in widgets" :key="widget._id">

                                <div class="card" style="border: 1px solid #dee2e6; position: relative">
                                  <div :id="'device_loading_' + index" style="display: none;">
                                    <div class="spin"
                                      style="display: flex; justify-content: center; align-items: center; position: absolute; width: 100%; height: 100%; background: rgba(0,0,0,0.5); color: white; font-size: xx-large;">
                                      <i class='bx bx-loader-circle'></i>
                                    </div>
                                  </div>
                                  <div class="card-body">
                                    <div style="position: relative">
                                      <span style="position: absolute; left: 0px; margin-top: 5px; font-size: 22px;">
                                        <a href="javascript:;" v-on:click="editWidget = widget" data-bs-toggle="modal"
                                          data-bs-target="#editWidgetModal"><i class="bx bx-edit"></i></a>
                                      </span>
                                      <span style="position: absolute; right: 0px; margin-top: 5px; font-size: 22px;">
                                        <a href="javascript:;" v-on:click="deleteWidget(widget._id, index)"><i
                                            class="bi bi-trash"></i></a>
                                      </span>
                                    </div>
                                    <div class="d-flex flex-column text-center align-items-center">

                                      <div class="flex-grow-1 pt-4">
                                        <span class="d-block text-muted" style="font-size: x-small;">
                                          {{ ((+new Date() - +new Date(widget.createdAt)) / 1000 / 60 / 60 /
                                            24).toFixed(0) }}
                                          days old
                                        </span>
                                        <!-- <h5>{{ widget.name }}</h5> -->
                                        <div class="mb-4">
                                          <span class="badge rounded-pill"
                                            style="background-color: var(--secondary-color-2);">
                                            active
                                          </span>

                                        </div>

                                      </div>
                                    </div>

                                    <div class="bot-img">
                                      <!-- <img class="img" src="../../assets/img/shelly_plugs.png" alt=""> -->
                                      <div>
                                        <span
                                          style="display: inline-block; background: #fff; height: 75px; width: 75px; border-radius: 50%; padding: 20px; box-shadow: #dee2e6 2px 2px 10px;">
                                          <i style="font-size:xx-large" class='bx bxs-widget'></i>
                                        </span>
                                      </div>
                                      <h5 style="margin-top: 5px; ">
                                        {{ widget.name }}</h5>
                                    </div>
                                    <div style="text-align: center;">
                                      <span style="color: lightgray;">Token:</span> <br />
                                      <span style="cursor: pointer;" @click="copyToken(widget.token)">{{ widget.token }} <i class='fs-5 bx bx-copy'></i></span>
                                    </div>
                                  </div>

                                  <!--Footer states-->
                                  <div class="card-footer py-0 border-top"
                                    style="color: black; background-color: rgba(0,0,0, 0.03); border-top: 1px solid lightgray !important;">
                                    <div class="row">
                                      <div class="col text-center p-3">
                                        <h4 class="fs-5 mb-1">
                                          <span>{{ widget.groupsIds.length }} Group{{ widget.groupsIds.length > 1 ? 's' : ''}}</span>
                                        </h4>

                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>

                        <!-- Pagination -->
                        <div>
                          <!-- <pagination :pagination="pagination" :method="getWidgets"></pagination> -->
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- End Left side columns -->
                </div>
              </section>
            </div>
          </div>
          <div class="col-lg-4 col-md-4 d-none d-md-block">
            <RightSideBar></RightSideBar>
          </div>

        </div>
      </div>
      <!-- End #main -->
      <AddWidgetModal :loading="loading" @added-widget="addedWidget" @set-loading="setLoading"></AddWidgetModal>
      <EditWidgetModal :loading="loading" :widget="editWidget" @updated-widget="updatedWidget" @set-loading="setLoading"></EditWidgetModal>

      <div v-if="loading">
        <div class="loading-overlay"></div>
        <div class="processing">
          <i class='bx bx-loader-circle'></i>
        </div>
      </div>
      <!-- <CommonFooter></CommonFooter> -->
    </main>
  </div>
</template>

<script>
  import CommonHeader from '../CommonHeader.vue'
  import CommonSidebar from '../CommonSidebar.vue'
  import RightSideBar from './RightSideBar.vue'
  import AddWidgetModal from '../../tiny-components/AddWidgetModal.vue'
  import EditWidgetModal from '../../tiny-components/EditWidgetModal.vue'
  import axios from 'axios'

  export default {
    name: 'widgets-page',
    components: {
      CommonHeader: CommonHeader,
      CommonSidebar: CommonSidebar,
      RightSideBar: RightSideBar,
      AddWidgetModal: AddWidgetModal,
      EditWidgetModal: EditWidgetModal
    },
    props: ['userId'],
    data() {
      return {
        loading: true,
        viewType: 'grid',
        widgets: [],
        editWidget: {},
      }
    },
    watch: {},
    computed: {
      selectedUserId() {
        return this.$store.getters.adminSelectedUserId
      },
    },
    methods: {
      setLoading(value) {
        this.loading = value
      },
      addSelectedGroup(group) {
        //check if group._id is already in selectedGroups
        if (this.selectedGroups.find(x => x._id == group._id)) {
        } else if (group.name) {
          this.selectedGroups.push(group)
        }
      },
      removeSelectedGroup(index) {
        this.selectedGroups.splice(index, 1)
      },
      addedWidget(widget) {
        this.widgets.push(widget)
        //this.updateGroupsField++;
      },
      updatedWidget(widget) {
        let index = this.widgets.findIndex(x => x._id == widget._id)
        this.widgets[index] = widget
      },
      updatedGroup(data) {
        console.log("updatedGroup", data)
        this.editGroup = {};
        this.selectedGroups = [];
        this.updateGroupsField++;
      },
      getWidgets() {
        //if needs pagination try to match with devicesPage.vue
        let that = this;
        this.loading = true
        axios.get("/widget").then(function (data) {
          //console.log(data.data);
          that.widgets = data.data.widgets;

          that.loading = false
        }).catch(function (error) {
          that.loading = false
          if (error.response) {
            //that.$toaster.error(that.$capitalizedString(error.response.data.data));            
            console.error(error.response.data.data);
          } else {
            console.error('Error:', error.message);
          }
        })
      },
      deleteWidget(id, index) {
        let that = this;
        this.$confirm(
          {
            message: 'Do you really want to delete?',
            button: {
              no: 'No',
              yes: 'Yes'
            },
            callback: confirm => {
              if (confirm) {
                try {
                  that.loading = true
                  axios.delete("/widget", { data: { "id": id } })
                    .then(function (data) {
                      ////console.log(data);
                      that.$toaster.error('Widget Deleted.')
                      that.widgets.splice(index, 1)
                      that.loading = false
                      //that.selectedGroups.splice(index, 1)
                      //that.updateGroupsField++;
                      return true
                    })
                    .catch(function (msg) {
                      //console.log(msg)
                      that.$toaster.error('Something went wrong.')
                      that.loading = false
                      return false
                    })
                } catch (error) {
                  console.error(error);
                  that.$toaster.error('Something went wrong.')
                  that.loading = false
                }
              }
            }
          })

      },
      copyToken(token) {
        navigator.clipboard.writeText(token)
        this.$toaster.success("Copied to clipboard")
      }
    }, //
    mounted() {
      this.getWidgets()
    },
    created() {
      let that = this
    },
  }
</script>

<style scoped>
  .card {
    box-shadow: 0 20px 27px 0 rgb(0 0 0 / 5%);
  }

  .bot-img {
    text-align: center;
    margin-bottom: 20px;
  }

  .bot-img>img {
    width: 64px;
    height: 64px;
    opacity: 0.7;
    -webkit-filter: drop-shadow(0px 0px 2px #222);
    filter: drop-shadow(0px 0px 2px #222);
  }
</style>