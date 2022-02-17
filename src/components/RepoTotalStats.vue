<template>
    <div>
        <div class="m-2 p-2 text-right">
            Spent: 
            <div class="display-3">
            {{ spent }}h
            </div>
            <h2>
            {{eap}}EAP
            </h2>
            Codelines:
            <h4>

            {{ codelines }}
            </h4>
        </div>
    </div>
</template>

<script>
export default {
    name: "ProjectDevs",
    props: ["spent", "codelines"],
    computed : {
        eap() {
            return (this.spent / 26).toFixed(1)
        }
    }
}
</script>