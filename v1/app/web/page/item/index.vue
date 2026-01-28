<template>
    <Layout :hide="true" :title="item.title + ' | 极客番茄'">
        <Header/>
        <div class="item">
            <div class="item-body">
                <div class="item-info">
                    <el-row :gutter="20">
                        <el-col :span="24" class="item-info-title">{{this.item.title}}</el-col>
                    </el-row>
                    <el-row :gutter="20" class="item-info-header">
                        <el-col :span="16" class="item-info-origin">来源：<a :href="item.origin" target="_blank">{{linkOrigin(item.origin)}}</a></el-col>
                        <el-col :span="8" class="item-info-date">{{dateFilter(item.date)}}</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24"><img :src="item.img" class="item-info-img"/></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24" class="item-info-con" v-html="item.content.replace(/\n/g,'<br/>')"></el-col>
                    </el-row>
                    <el-row v-if="item.words">
                        <el-col :span="24" class="item-info-words">{{this.item.words}}</el-col>
                    </el-row>
                    <el-row class="item-info-footer">
                        <el-col :span="12" class="item-info-footer-left"><a href="http://www.geektomato.com" class="item-info-footer-site">geektomato.com</a></el-col>
                        <el-col :span="12" class="item-info-footer-right"><a class="item-info-link" :href="item.origin" target="_blank">阅读原文</a></el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <Footer></Footer>
    </Layout>

</template>

<style lang="stylus">
    @import 'index.styl'
</style>

<script type="text/babel">
import axios from 'axios'
import tools from 'tools'
import Header from 'component/header/header'
import Footer from 'component/footer/footer'
import {Form, FormItem, Input, Button, Message, Row, Col} from 'element-ui'
// import RSA from 'framework/encrypt/SRA.js'
axios.defaults.headers.post['x-csrf-token'] = tools.getCookie('csrfToken')

export default {
    name: 'ViewItem',
    components: {
        Header,
        Footer,
        Form,
        FormItem,
        Input,
        Button,
        Message,
        'el-row': Row,
        'el-col': Col
    },
    data() {
        // const image = null// tools.getBodyData('image')
        // const {captchaId, imageData } = (image && image.result) || {};

        return {
            item: {
                id: '',
                title: '',
                origin: '',
                date: '',
                content: ''
            }
        }
    },
    computed: {
    },
    created() {
        this.item = this.initData.data
    },
    mounted() {},
    methods: {
        linkOrigin(str) {
            console.log(str)
            let res = ''
            if (str && str.length > 0) {
                const arr = str ? str.split('://') : ''
                res = arr[0] + '://' + arr[1] ? arr[1].split('/')[0] : ''
            }
            return res
        },
        dateFilter(date) {
            return tools.yearMonthDay(date)
        },
        submitForm() {

        }
    }
}
</script>
