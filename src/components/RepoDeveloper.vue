<template>
    <div class="border rounded">
        <div class="row m-1">
            <svg class="m-1" height="40" width="40">
                <circle cx="20" cy="20" r="20" :fill="`#${devData.colour}`" />
            </svg>
            <div>
                <span class="font-weight-bold">{{ devData.username }}</span>
                <br />

                <font-awesome-icon icon="fa-regular fa-clock" />
                {{ this.spent(devData.time_spent) }}h
            </div>
            <div>
                <font-awesome-icon icon="fa-solid fa-code" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "RepoDeveloper",
    props: ["devData"],
    methods: {
        spent(time) {
            if (isNaN(time)) return time
            return +time.toFixed(2)
        }
    },
}
</script>