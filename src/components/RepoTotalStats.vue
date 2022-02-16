<template>
    <div>
        <div class="m-2 p-2 text-right">
            Spent: 
            <div class="display-3">
            {{ stats.spent }}h
            </div>
            Codelines:
            <div class="display-4">
            {{ stats.codelines }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ProjectDevs",
    data() {
        return {
            stats: {
                spent: 23,
                codelines: 6623,
            }
        }
    },

}
</script>