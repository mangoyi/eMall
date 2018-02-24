<template>
    <div>
        <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show': mdShow}">
            <div class="md-modal-inner">
                <div class="md-top">
                    <button class="md-close" @click="closeModal">Close</button>
                </div>
                <div class="md-content">
                    <div class="confirm-tips">
                        <!--动态改变-->
                        <slot name="message"></slot>
                    </div>
                    <div class="btn-wrap">
                        <!--动态改变-->
                        <slot name="btnGroup"></slot>
                    </div>
                </div>
            </div>
        </div>
        <div class="md-overlay" v-if="mdShow" @click="closeModal"></div>
    </div>
</template>

<script>
    export default{
        props: ["mdShow"],                    // 从父组件传递过来的变量，通过props属性来接收
        data() {

            return{
                msg: 'hello vue'
            }
        },
        methods: {
            closeModal(){
                this.$emit("close");     // 触发父组件close事件
            }
        }
    }
</script>

<style scoped>

</style>