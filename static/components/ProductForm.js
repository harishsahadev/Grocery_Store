export default {
    template: `
    <div>
        <h3 class="form-label">Product Form</h3>
        <div class="mb-3">
            <input v-model="product.name" type="text" placeholder="Product Name" class="form-control"/>
        </div>
        <div class="mb-3">
            <!-- Dropdown for selecting the category -->
            <label for="categorySelect" class="form-label">Select Category:</label>
            <select v-model="product.category" id="categorySelect" class="form-select">
                <option v-for="category in approvedCategories" :key="category.id" :value="category.name">{{ category.name }}</option>
            </select>
        </div>
        <div class="mb-3">
            <input v-model="product.cost" type="text" placeholder="Cost" class="form-control"/>
        </div>
        <div class="mb-3">
            <textarea v-model="product.description" type="text" placeholder="Description" class="form-control" rows="3"/>
        </div>
        <div class="mb-3">
            <input v-model="product.quantity" type="text" placeholder="Quantity" class="form-control"/>
        </div>
        <button @click="createProduct" class="btn btn-primary mb-3">Create Product</button>
    </div>
    `,

    data() {
        return {
            product: {
                name: null,
                category: null,
                cost:null,
                description: null,
                quantity:null,
            },
            token: localStorage.getItem('auth-token'),
            approvedCategories: [],
        }
    },

    mounted() {
        this.fetchApprovedCategories();
    },    

    methods: {
        async fetchApprovedCategories() {
            try {
                const response = await fetch('/get_approved_categories', {
                    headers: {
                        'Authentication-Token': this.token,
                    },
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    this.approvedCategories = data;
                }
                else {
                    alert(data.message)
                }
                
            } catch (error) {
                console.error(error.message);
            }
        },

        async createProduct() {
            const res = await fetch('/api/product', {
                method: 'POST',
                headers: {
                    'Authentication-Token': this.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.product),
            })

            const data = await res.json()
            if (res.ok) {
                alert(data.message)
            }
            else {
                alert(data.message)
            }
        }
    }
}

