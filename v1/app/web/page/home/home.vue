<template>
    <Layout title="极客番茄 - 每天一篇极客英文" keywords="极客番茄,极客英文,每天英文,互联网,新科技,好玩有趣">
        <Header/>
        <div class="main-items">
            <div class="main-item" v-for="(item, index) in items" @click="showItem(item)">
                <div class="box">
                    <div class="image-wrap">
                        <div class="image" :style="{background: 'url(' + imgFilter(item.img) + ')'}"></div>
                        <!--<img :src="imgFilter(item.img)"/>-->
                    </div>

                    <div class="main-item-title">{{item.title}}</div>
                    <div class="dimmer-dark">
                    </div>
                    <div class="dimmer-light"></div>
                </div>
            </div>
            <div class="main-loading" v-loading="loading">
                <!--<div class="profile-main-loader">-->
                <!--<div class="loader">-->
                <!--<svg class="circular-loader" viewBox="25 25 50 50" >-->
                <!--<circle class="loader-path" cx="50" cy="50" r="20" fill="none" stroke="#70c542" stroke-width="2" />-->
                <!--</svg>-->
                <!--</div>-->
                <!--</div>-->
            </div>
        </div>
        <!--<div class="clear"></div>-->

        <el-dialog
                title=""
                top="20px"
                @close="listenClose"
                :visible.sync="itemDetailVisible">
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
        </el-dialog>
        <Footer style="position: fixed;bottom:0px;height: 50px;
    line-height: 0px;
    background-color: white;
    z-index: 99;"></Footer>
    </Layout>
</template>

<script>
// https://blog.csdn.net/xjtarzan/article/details/51891307
// https://juejin.im/entry/58e1b0e561ff4b006b205459
import axios from 'axios'
import Vue from 'vue'
import tools from 'tools'
import Header from 'component/header/header'
import Footer from 'component/footer/footer'
import {Form, FormItem, Input, Button, Message, Loading, Dialog, Row, Col} from 'element-ui'
axios.defaults.headers.post['x-csrf-token'] = tools.getCookie('csrfToken')
Vue.use(Loading.directive);
export default {
    name: 'Home',
    components: {Header,
        Footer,
        Form,
        FormItem,
        Input,
        Button,
        Loading,
        'el-dialog': Dialog,
        'el-row': Row,
        'el-col': Col
    },
    data() {
        const backUrl = decodeURIComponent(tools.getQueryString('back'))

        return {
            meta: {
                skip: 20,
                limit: 12,
                lastPage: false
            },
            items: [],
            loading: true,
            isLoading: false,
            itemDetailVisible: false,
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
        listFilter() {
            if (this.list.length === 0) {
                return Array.from(new Array(8), () => false)
            }
            let cat = this.cat
            if (!cat || cat.id === 0) {
                return this.list
            } else if (cat.id === -1) {
                return this.list.filter(v => v.freight_price === 0)
            } else {
                return this.list.filter(v => v.cat_id === cat.id)
            }
        }
    },
    created() {
        const initData = this.initData
        this.items = initData
        if (EASY_ENV_IS_BROWSER) {
            // this.firstInitMove()
        }
    },
    mounted() {
        if (EASY_ENV_IS_BROWSER) {
            window.addEventListener('scroll', this.handleScroll, true)
        }
    },
    methods: {
        linkOrigin(str) {
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
        imgFilter(str) {
            return str.replace('/400/g', '600')
        },
        mousemove(e) {
            // 实时监听鼠标的坐标位置
            this.mousePos.x = e.pageX
            this.mousePos.y = e.pageY
        },
        firstInitMove() {
            // 初始化鼠标的x和y的坐标
            this.mousePos = {
                x: -10,
                y: -10
            }

            // 选择图片所在的节点元素并缓存起来
            var boxElements = document.getElementsByClassName('box')

            // 把所有的图片节点存入一个名为 boxes 的数组，以及它的位置信息比如宽等尺寸信息
            this.boxes = []
            for (var i = 0; i < boxElements.length; i++) {
                this.boxes.push({
                    el: boxElements[i],
                    targetX: 0,
                    targetY: 0,
                    prevX: 0,
                    prevY: 0,
                    x: 0,
                    y: 0,
                    left: boxElements[i].offsetLeft,
                    top: boxElements[i].offsetTop,
                    size: boxElements[i].offsetWidth
                })
            }
            document.addEventListener('mousemove', this.mousemove)
            window.addEventListener('resize', this.resize)
            // run the animation loop
            this.loop()
        },
        resize() {
            // the box positions/sizes have updated on resize, so they need to be
            // reset
            for (var i = 0; i < this.boxes.length; i++) {
                this.boxes[i].left = this.boxes[i].el.offsetLeft
                this.boxes[i].top = this.boxes[i].el.offsetTop
                this.boxes[i].size = this.boxes[i].el.offsetWidth
            }
        },
        updateBox(box) {
            let mousePos = this.mousePos
            // check if mouse is in box area
            if (mousePos.x > box.left && mousePos.x < (box.left + box.size) &&
                mousePos.y > box.top && mousePos.y < (box.top + box.size)) {
                // the mouse is in the space over the box - update the box image target position dependent on how far the mouse position is from the center of the box (box size/2)
                box.targetX = (box.size / 2 - (mousePos.x - box.left)) * 0.1
                box.targetY = (box.size / 2 - (mousePos.y - box.top)) * 0.1
            } else {
                // otherwise the box isn't being hovered, its target is 0
                box.targetX = 0
                box.targetY = 0
            }

            // update the image element position by lerping position to target
            // https://codepen.io/rachsmith/post/animation-tip-lerp
            box.x += (box.targetX - box.x) * 0.2
            box.y += (box.targetY - box.y) * 0.2
            // check that the values aren't really small already, to overcome javascripts poor handling of high precision math
            if (Math.abs(box.x) < 0.001) box.x = 0
            if (Math.abs(box.y) < 0.001) box.y = 0

            // only update CSS if the position has changed since last loop
            if (box.prevX !== box.x && box.prevY !== box.y) {
                // update css of image element
                // console.log(box.el.children[0].children[0])
                box.el.children[0].children[0].style.transform = 'translate3d(' + box.x + 'px, ' + box.y + 'px, 0)'
            }

            // update prev values for next comparison
            box.prevX = box.x
            box.prevY = box.y
        },
        loop() {
            // in the loop - updated each of the boxes
            for (var i = 0, l = this.boxes.length; i < l; i++) {
                this.updateBox(this.boxes[i])
            }
            requestAnimationFrame(this.loop)
        },
        resize() {
            // the box positions/sizes have updated on resize, so they need to be
            // reset
            // for (var i = 0; i < boxes.length; i++) {
            //     boxes[i].left = boxes[i].el.offsetLeft;
            //     boxes[i].top = boxes[i].el.offsetTop;
            //     boxes[i].size = boxes[i].el.offsetWidth;
            // }
        },
        handleScroll() {
            if (this.meta.lastPage === true) {
                return false
            }
            let _self = this
            // 距离底部200px时加载一次
            let bottomOfWindow = document.documentElement.offsetHeight - document.documentElement.scrollTop - window.innerHeight <= 100
            if (bottomOfWindow && this.isLoading === false) {
                this.isLoading = true
                // axios.get(`https://randomuser.me/api/`).then(response => {
                const url = `/home/list/?skip=${this.meta.skip}&limit=${this.meta.limit}`

                axios.get(url)
                    .then(response => {
                        tools.responseHandler(response, (result) => {
                            if (result && result.length > 0) {
                                this.meta.skip += this.meta.limit
                                _self.items = _self.items.concat(result)
                            } else {
                                this.meta.lastPage = true
                                this.loading = false
                            }
                            this.isLoading = false
                        },
                        (result) => {
                            this.isLoading = false
                            Message({showClose: true, message: result._msg, type: 'error'})
                        })
                    })
                    .catch(error => {
                        this.loading = false
                        this.isLoading = false
                        Message({showClose: true, message: tools.errorContent(error), type: 'error'})
                    })
                // })
            }
        },
        showItem(item) {
            window.history.pushState('item', `${item.title} | 极客番茄`, `/i/${item.id}`)
            this.item = item
            this.itemDetailVisible = true
        },
        listenClose() {
            window.history.back()
        }
    }

}
</script>

<style lang="stylus">
@import '~theme/tools.styl'
@import '~theme/pub'
@import '~theme/ele'
@import 'home.styl'
</style>
