export default {
    template: `
    <div>
        <h1>Products</h1>
        <table class="table table-striped">
            <caption>Table represents all available products</caption>

            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Category</th>
                    <th scope="col">Cost</th>
                    <th scope="col">Description</th>
                    <th scope="col">Quantity</th>
                </tr>
            </thead>
            <tbody>
            <tr v-for="product in products">
                <td>{{product.name}}</td>
                <td>{{product.category}}</td>
                <td>{{product.cost}} ₹</td>
                <td>{{product.description}}</td>
                <td>{{product.quantity}}</td>
                
            </tr>
            </tbody>
        </table>
    </div>`,

    // props: ['products'],

    data() {
        return {
            role: localStorage.getItem('role'),
            token: localStorage.getItem('auth-token'),
            products: {},
            
        }
    },

    async mounted() {
        const res = await fetch('/api/product', {
            headers: {
                "Authentication-Token": this.token,
            } 
        })
        const data = await res.json()
        if (res.ok) {
            this.products = data
            // console.log(data)
        }
        else {
            alert(data.message)
        }
    }



}