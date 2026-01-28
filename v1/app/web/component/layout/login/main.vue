<template>
    <Container class="layout-container">
        <Container direction="vertical">
            <Main class="main-container">
                <slot class="layout"></slot>
            </Main>
            
        </Container>
    </Container>
</template>

<script>
import {Container, Main} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

export default {
    name: 'ContentLayout',
    components: {
        Container,
        Main
    },
    data() {}
}
</script>

<style lang="stylus">
@import '~theme/tools.styl'
@import '~theme/pub'
@import '~theme/ele'

.layout-container
    height: 100%
.main-container
    background-color: #f0f2f5
    padding: 0

</style>
