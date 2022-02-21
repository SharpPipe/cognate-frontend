<template>
    <div class="border rounded my-2">
        <div class="row m-1">
            <svg class="m-1" height="40" width="40">
                <circle cx="20" cy="20" r="20" fill="teal" />
            </svg>
            {{ name }}
            <br />
            Spent: {{ spent }}h
        </div>
    </div>
</template>

<script>
export default {
    name: "RepoDeveloper",
    props: ["name", "spentTime"],
    computed: {
        spent() {
            if (isNaN(this.spentTime)) return this.spentTime
            return this.spentTime.toFixed(2)
        }
    }

}
</script>