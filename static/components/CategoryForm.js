export default {
    template: `
    <div>
        <h3 class="form-label">Category Form</h3>
        <div class="mb-3">
            <input v-model="category.name" type="text" placeholder="Category Name" class="form-control"/>
        </div>
        <div class="mb-3">
            <textarea v-model="category.description" type="text" placeholder="Description" class="form-control" rows="3"/>
        </div>
        <button @click="createCategory" class="btn btn-primary mb-3">Create Category</button>
    </div>
    `,

    data() {
        return {
            category: {
                name: null,
                description: null,
            },
            token: localStorage.getItem('auth-token'),
        }
    },

    methods: {
        async createCategory() {
            const res = await fetch('/api/category', {
                method: 'POST',
                headers: {
                    'Authentication-Token': this.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.category),
            })

            const data = await res.json()
            if (res.ok) {
                alert(data.message)
            }
        }
    }
}