export default {
    template: `
    <div>
        <h1>Orders</h1>
        <table class="table table-striped">
            <caption>Table represents orders placed</caption>

            <thead>
                <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Category</th>
                    <th scope="col">Cost</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Total Cost</th>
                    <th scope="col">Time</th>
                </tr>
            </thead>
            <tbody>
            <tr v-for="order in orders">
                <td>{{order.product_name}}</td>
                <td>{{order.category_name}}</td>
                <td>{{order.product_cost}} ₹</td>
                <td>{{order.quantity}}</td>
                <td>{{order.quantity * order.product_cost}} ₹</td>
                <td>{{order.date}}</td>
            </tr>
            </tbody>
        </table>
    </div>`,


    data() {
        return {
            role: localStorage.getItem('role'),
            token: localStorage.getItem('auth-token'),
            orders: [],
            
        }
    },

    async mounted() {
        const res = await fetch('/api/order', {
            headers: {
                "Authentication-Token": this.token,
            } 
        })
        const data = await res.json()
        if (res.ok) {
            this.orders = data
            // console.log(data)
        }
        else {
            alert(data.message)
        }
    }



}