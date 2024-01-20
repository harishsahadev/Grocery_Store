import AdminHome from "./AdminHome.js"
import CustomerHome from "./CustomerHome.js"
import ManagerHome from "./ManagerHome.js"


export default {
    template: `
    <div>  
        <AdminHome v-if="userRole=='admin'"/>
        <CustomerHome v-if="userRole=='customer'"/>
        <ManagerHome v-if="userRole=='manager'"/>
    </div> `,

    data() {
        return {
            userRole: this.$route.query.role,
        }
    },

    components: {
        AdminHome,
        CustomerHome,
        ManagerHome,
    }
}