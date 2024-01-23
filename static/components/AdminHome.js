export default {
    template: `
    <div>
        <div class="mb-3">
            <h2>Welcome Admin</h2>
        </div>
        <div class="mb-3">
            <button @click="downloadCategory" class="btn btn-secondary btn-sm"> Download Category </button>
            <div class="spinner-border spinner-border-sm" role="status" v-if="isWaiting">
                <span class="visually-hidden" >Loading...</span>
            </div>
        </div>
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