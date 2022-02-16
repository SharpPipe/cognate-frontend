<template>
    <div class="d-flex flex-column justify-content-end flex-grow-1">
        <div  v-for="dev in devs" :key="dev.id">
            <div class="border rounded my-2">
                <div class="row m-1">
                    <svg class="m-1" height="40" width="40">
                        <circle cx="20" cy="20" r="20" fill="teal" />
                    </svg>
                    {{ dev.name }}
                    <br />
                    Spent: {{ dev.spentTime }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ProjectDevs",
    data() {
        return {
            devs: [
                { id: 1, name: "Dev 1", spentTime: 0 },
                { id: 2, name: "Dev 2", spentTime: 0 },
                { id: 3, name: "Dev 3", spentTime: 0 },
            ]
        }
    },

}
</script>