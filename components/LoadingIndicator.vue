<template>
    <div class="component-LoadingIndicator" :class="{ fixed: isFixedSize, isGreen: isGreen }"></div>
</template>

<script lang="ts" scoped>
export default {
    props: {
        isFixedSize: {
            type: Boolean, default: true
        },
        isGreen: {
            type: Boolean, default: true
        }
    }
}
</script>

<style lang="less" scoped>
.component-LoadingIndicator {
    position: absolute;


    border: 4px solid var(--black-50);
    border-top-color: var(--black-1);
    border-radius: 30px;
    top: 50%;
    left: 50%;
    animation: spin 1s linear infinite;

    &.isGreen {
        border: 4px solid var(--green-1);
        border-top-color: transparent;
    }

    &:not(.isGreen) {
        border: 4px solid var(--black-50);
        border-top-color: var(--black-1);
    }

    &.fixed {
        height: 30px;
        width: 30px;
    }

    &:not(.fixed) {
        height: 50%;
        aspect-ratio: 1/1;
        // transform: translate(-50%, -50%);

    }
}

@keyframes spin {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }

    100% {
        transform: translate(-50%, -50%) rotate(1turn);
    }
}
</style>