<template>
    <Layout :hide="true" title="关于 | 极客番茄">
        <Header/>
        <div class="about">
            <div class="about-container">
                <h1 class="about-title">极客番茄🍅</h1>
                <div class="about-sub">更新于:2019-04-25</div>
                <div class="about-content">
                    <p>每天一篇极客英文，人人都能用英语。</p>
                    <p>我自己每天会看些英文相关的文章、资料、视频等好玩有趣的内容，从英文世界里受益良多。这都得益于我每天都在坚持看英文内容，有的是有趣的人，有的是创意的想法，还有的是一些深度的思考等，这都给我的技术、工作、生活带来了很大的启发，阅读英文内容像打开了一扇窗，通过这个窗口接受了新鲜的知识，我想把有价值的内容每天分享出来给大家，大家也可以通过英文的视角来观世界。</p>
                    <p>一开始读英文，读不懂没关系，反正只要是你感兴趣的内容，你是肯定能想方设法的把她搞懂的，就像追求美丽的姑娘，吸引你的，自然会想办法博取对方的芳心。找到自己感兴趣的内容，然后不断的为你所用，人人都能用英语。</p>
                </div>
                <h2 class="about-title-sub">微信公众号</h2>
                <div class="about-content">
                    <p>欢迎扫码关注我的微信公众号：凯凯而谈，我会在上面发布"极客番茄周报"</p>
                    <p>
                        <img src="~asset/images/wx/web-bear.jpg" class="about-qrcode"/>
                    </p>
                </div>
                <h2 class="about-title-sub">联系我</h2>
                <div class="about-content">
                    <p>也可以加微信和我交流</p>
                    <p>
                        <img src="~asset/images/wx/me.jpeg" class="about-qrcode"/>
                    </p>
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
        return {
        }
    },
    computed: {
    },
    created() {
    },
    mounted() {},
    methods: {
        submitForm() {
        }
    }
}
</script>
