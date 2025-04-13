<template>
    <div>
        <div class="pull-right">
            <paginate :page-count="pagination.pages" :click-handler="method" :prev-text="'Previous'" :next-text="'Next'"
                :container-class="'pagination'" :page-class="'page-item'" :page-link-class="'page-link'"
                :prev-class="'page-item prev'" :prev-link-class="'page-link'" :next-class="'page-item next'"
                :next-link-class="'page-link'" v-model="page">
            </paginate>
        </div>
    </div>
</template>
<script>
    import Paginate from 'vuejs-paginate'
    export default {
        props: ['pagination', 'method'],
        data() {
            return {
                page: 1,
            }
        },
        components: {
            'Paginate': Paginate
        }
    }
</script>

<style>
    .pagination {
        display: flex;
        justify-content: center;
    }
</style>