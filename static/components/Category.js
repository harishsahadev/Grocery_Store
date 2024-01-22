export default {
    template: `
    <div>
        <h1>Categories</h1>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                </tr>
            </thead>
            <tbody>
            <tr v-for="category in categories">
                <td>{{category.name}}</td>
                <td>{{category.description}}</td>
            </tr>
            </tbody>
        </table>
    </div>`,
    props: ['categories'],
}