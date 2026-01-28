<template>
    <Layout title="极客番茄">
        <Header/>

        <div class="container">
            <div class="empty-list">
                <!--<img src="~asset/images/comm/empty.svg">-->
                <div class="text">{{text}}</div>
                <Button @click="goHome">Continue Shopping</Button>
            </div>
        </div>

    </Layout>
</template>

<script>
import {Button} from 'element-ui'

import Header from 'component/header/header'

export default {    
    components: {Header, Button},
    data() {
        return {
            text: ''
        }
    },
    computed: {},
    created() {
        const {msg} = this

        this.text = msg || 'error, Please try again later!'
    },
    mounted() {},
    methods: {
        goHome() {
            window.location.href = '/'
        }
    }
}
</script>

<style lang="stylus">
@import '~theme/tools.styl'
@import '~theme/pub'
@import '~theme/ele'

.el-button--default
    background-color: $color_geektomato !important
    border-color: $color_geektomato !important
    color: #fff
    &:focus,
    &:hover
        color: #fff
        opacity: .8

.container
    display: flex
    margin-top: 50px
    .empty-list
        text-align: center
        margin: 100px auto
        .text
            color: #656565
            margin: 32px 0
            font-size: 18px
        .el-button
            width: 320px

</style>
