<template>
    <Dialog :visible.sync="show" 
        @close="close"
        class="blocked-dialog" 
        width="387px" top="214px">
        <div class="title" v-if="info[type].title">
            <div>{{info[type].title}}</div>
            <a href="javescript:;" @click="close"><i class="el-icon-close"></i></a>
        </div>
        <div class="content">{{info[type].content}}</div>
        <div class="btn-wrapper">
            <a href="javascript:;" class="btn" @click="confirm">
                <div class="loading" v-if="loading"></div>
                <span v-else>{{info[type].btn}}</span>
            </a>
        </div>
    </Dialog>
</template>

<script>
import {Dialog} from 'element-ui'
import axios from 'axios'
import tools from 'tools'
axios.defaults.headers.post['x-csrf-token'] = tools.getCookie('csrfToken')
export default {
    components: {Dialog},
    props: ['visible', 'type'],
    data() {
        return {
            info: {
                blocked: {
                    title: 'Account Blocked',
                    content: 'You are currently blocked from bidding for 1 day due to numerous cancellations of winning bids',
                    btn: 'OK'
                },
                unpaid: {
                    title: '',
                    content: 'Looks like you have an unpaid transaction for item you have won(congrats on the Win!). Please pay before bidding a new item.',
                    btn: 'Pay now'
                }
            },
            loading: false
        }
    },
    computed: {
        show: {
            get() {
                return this.visible || false
            },
            set(val) {
                !val && this.close()
            }
        }
    },
    methods: {
        confirm() {
            if (this.type === 'blocked') {
                this.close()
                return false
            }
            if (this.type === 'unpaid') {
                this.loading = true
                axios.get('/order/_list?stage=UnPaid').then(response => {
                    tools.responseHandler(response, res => {
                        console.log('order-list', res)
                        this.loading = false
                        let order = res.objects[0] || {}
                        let orderId = order.id
                        this.$root.$emit('show-order', {orderId})
                        this.close()
                    }, err => {
                        console.error(err)
                    })
                })
            }
        },
        close() {
            this.$emit('update:visible', false)
        }
    }
}
</script>

<style lang="stylus">
.blocked-dialog
    .el-dialog__header
        display: none
    .el-dialog__body
        padding: 0
    .title
        padding: 16px
        line-height: 22px
        font-size: 16px
        font-weight: 600
        color: #242424
        display: flex
        justify-content: space-between
        border-bottom: 1px solid #e9e9e9
    .content
        padding: 22px 16px 24px 16px
        font-size: 14px
        color: #242424
    .btn-wrapper
        padding: 0 16px 24px 16px
    .btn
        display: flex
        justify-content: center
        align-items: center
        text-align: center
        line-height: 40px
        height: 40px
        background-color: #ff8830
        color: #fff
        font-size: 18px
        border-radius: 6px
</style>
