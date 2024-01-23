export default {
    template: `
    <div>
        <h2>Welcome Admin</h2>
        <button @click="downloadCategory" class="btn btn-secondary btn-sm"> Download Category </button>
        <span v-if="isWaiting"> Waiting.. </span>
    </div>`,

    data() {
        return {
            isWaiting: false,
        }
    },

    methods: {
        async downloadCategory() {
            this.isWaiting = true
            const res = await fetch('/download-csv')
            const data = await res.json()

            if (res.ok) {
                const taskId = data["task_id"]
                const intv = setInterval(async () => {
                    const csv_res = await fetch(`/get-csv/${taskId}`)
                    if (csv_res.ok) {
                        this.isWaiting = false
                        clearInterval(intv)
                        // window.location.href location downloads the file
                        window.location.href = `/get-csv/${taskId}`
                    }
                }, 1000)
            }
        }
    }
}