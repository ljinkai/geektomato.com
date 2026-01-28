<template>
    <div class="cat-wrapper">
        <div class="cat-item" :class="[{active: active === idx}, `id_${idx}`]"
            v-for="(cat, idx) of categorys" 
            :name="cat.id"
            :key="idx" 
            @click="catFilter(cat, idx, $event)">
            {{cat.name}}
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            categorys: [
                {id: 0, name: 'All'},
                {id: -1, name: 'Free Shipping'},
                {id: 5, name: 'Electronics'},
                {id: 7, name: 'Jewelry & Watches'},
                {id: 3, name: 'Fashion & Accessories'},
                {id: 2, name: 'Home & Garden'},
                {id: 4, name: 'Beauty & Health'},
                {id: 6, name: 'Sports & Outdoors'},
                {id: 1, name: 'Toys,Baby & Kids'}
            ],
            active: 0
        }
    },
    methods: {
        catFilter(cat, idx, e) {
            this.active = idx
            this.$emit('cat-filter', {cat})
            let node = (e && e.target) || document.querySelector('.cat-item.id_' + idx)
            if (!node) return
            let parent = node.parentElement.parentElement
            if (parent.offsetWidth > 1000) return 
            let offset = node.offsetLeft - parent.offsetLeft
            let width = node.parentElement.offsetWidth
            let step = () => {
                if (parent.scrollLeft < offset - 10) {
                    parent.scrollLeft += 10
                    if (parent.scrollLeft + parent.offsetWidth < width) {
                        window.requestAnimationFrame(step)
                    }
                } else if (parent.scrollLeft > offset + 10) {
                    parent.scrollLeft -= 10
                    if (parent.scrollLeft > 0) {
                        window.requestAnimationFrame(step)
                    }
                } else {
                    parent.scrollLeft = offset - 8
                }
            }
            window.requestAnimationFrame(step)
        }
    },
    mounted() {
        this.$on('view-all', () => {
            this.catFilter(this.categorys[0], 0)
        })

        this.$on('select-cate', (catId) => {
            const {categorys} = this
            if (!catId && catId !== 0) return

            categorys.map((cat, index) => {
                if (cat.id === catId) {
                    this.catFilter(cat, index)
                }
            })            
        })
    }
}
</script>

<style lang="stylus">
@import '~theme/tools.styl'
.cat-wrapper
    display: flex
    flex-wrap: wrap
    width: $maxWidth + 24
.cat-item
    text-align: center
    letter-spacing: .2px
    font-size: 14px
    color: #242424
    margin-right: 24px
    margin-bottom: 13px
    cursor: pointer
.active
    color: #ff8830
// @media (max-width: $media-screen-phone-max)
//     .cat-wrapper
//         width: 1690px
//         display: block
//         font-size: 0
//         .cat-item
//             display: inline-block
</style>
