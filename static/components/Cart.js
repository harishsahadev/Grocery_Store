export default {
    template: `
    <div>
        <h1>Cart</h1>
        <table class="table table-striped">
            <caption>Table represents all available products</caption>

            <thead>
                <tr>
                    <th scope="col">Product Name</th>
                    <th scope="col">Quantity</th>
                </tr>
            </thead>
            <tbody>
            <tr v-for="cart in carts">
                <td>{{cart.product_name}}</td>
                <td>{{cart.quantity}}</td>

            </tr>
            </tbody>
        </table>

        <!-- Button trigger modal -->
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Checkout
        </button>

        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    ...
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
                </div>
            </div>
        </div>

    </div>`,


    data() {
        return {
            role: localStorage.getItem('role'),
            token: localStorage.getItem('auth-token'),
            carts: {},
            
        }
    },

    async mounted() {
        const res = await fetch('/api/cart', {
            headers: {
                "Authentication-Token": this.token,
            } 
        })
        const data = await res.json()
        if (res.ok) {
            this.carts = data
            // console.log(data)
        }
        else {
            alert(data.message)
        }
    }



}