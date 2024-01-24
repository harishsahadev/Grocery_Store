export default {
    template: `
    <div>
        <h1>Categories</h1>
        <table class="table table-striped">
            <caption>Table represents all available categories</caption>

            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Products</th>
                    <th v-if="role=='admin'" scope="col" colspan="4">Created By</th>
                    
                </tr>
            </thead>
            <tbody>
            <tr v-for="category in categories">
                <td>{{category.name}}</td>
                <td>{{category.description}}</td>
                <td><router-link :to="'/products/'+category.name">{{ category.name }} Products</router-link></td>
                <td v-if="role=='admin'"><{{category.creator}}</td>
                <td v-if="!category.is_approved && role!='admin'">Approval Pending</td>
                <td><button class="btn btn-primary btn-sm" v-if="!category.is_approved && role=='admin'" @click="approveCategory(category.id)">Approve</button></td>
            </tr>
            </tbody>
        </table>
    </div>`,

    props: ['categories'],

    data() {
        return {
            role: localStorage.getItem('role'),
            token: localStorage.getItem('auth-token'),
        }
    },

    methods: {
        async approveCategory(category_id) {
            const res = await fetch(`/category/${category_id}/approve>`, {
                // method: 'PUT',
                headers: {
                    'Authentication-Token': this.token,
                },
            })
            const data = await res.json()
            if (res.ok) {
                alert(data.message)
                this.$router.go(0)
            }
            else {
                alert(data.message)
            }
        }
    }

}