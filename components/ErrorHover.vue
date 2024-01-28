<template>
    <div v-if="errorMessage.length" class="component-ErrorHover">
        <p class="error-text">{{ errorMessage }}</p>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        errorMessage: { type: String, default: ''}
    }
}
</script>

<style lang="less" scoped>
.component-ErrorHover {
    position: absolute;
    z-index: 400;
    bottom: -10px;
    left: 0;
    height: 34px;
    background-color: var(--error-color);
    border-radius: 5px;

    transform: translateY(100%);

    &::before {
        content: '';
        background-color: var(--error-color);
        width: 20px;
        height: 20px;
        position: absolute;
        top: -5px;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);z-index: -1;
    }

    p {
        color: var(--black-1);
        margin: 0;
        line-height: 34px;
        padding: 0 8px;
    }
}
</style>