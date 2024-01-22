import AdminHome from "./AdminHome.js"
import CustomerHome from "./CustomerHome.js"
import ManagerHome from "./ManagerHome.js"
import Category from "./Category.js"


export default {
    template: `
    <div>  
        <AdminHome v-if="userRole=='admin'"/>
        <CustomerHome v-if="userRole=='customer'"/>
        <ManagerHome v-if="userRole=='manager'"/>
        <Category :categories = "categories"/>
    </div> `,

    data() {
        return {
            userRole: localStorage.getItem('role'),
            token: localStorage.getItem('auth-token'),
            categories: [],
        }
    },

    components: {
        AdminHome,
        CustomerHome,
        ManagerHome,
        Category,
    },

    async mounted() {
        const res = await fetch('/api/category', {
            headers: {
                "Authentication-Token": this.token,
            }
        })
        const data = await res.json().catch((e) => {})
        if (res.ok) {
            this.categories = data
            // console.log(data)
        }
        else {
            alert(data.message)
        }
    }
}