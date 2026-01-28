<template>
    <Container class="layout-container">
        <Container direction="vertical">
            <Main class="main-container" >
                <slot class="layout"></slot>
            </Main>

        </Container>
    </Container>
</template>

<script>
import Header from 'component/header/header'
import Footer from 'component/footer/footer'
import {Container, Main} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

export default {
    name: 'ContentLayout',
    components: {
        Container,
        Header,
        Main,
        Footer
    },
    props: [],
    data() {
        return {
            showLogin: false
        }
    },
    watch: {
    },
    methods: {
    }
}
</script>

<style lang="stylus">
@import '~theme/tools.styl'
@import '~theme/pub'
@import '~theme/ele'

.el-main
    overflow hidden
.main-container
    background-color: white
    padding 65px 0px 0px
</style>
