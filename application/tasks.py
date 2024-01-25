from celery import shared_task
from .models import Category, Product
import flask_excel as excel
from .mail_service import send_message
from .models import User, Role, Orders, db, RolesUsers
from flask import render_template
from datetime import datetime as date, timedelta
import pytz  # Import the pytz library for timezone calculations


@shared_task(ignore_result=False)
def create_category_csv():
    category = Category.query.with_entities(Category.name, Category.description).all()

    csv_output = excel.make_response_from_query_sets(category, ["name", "description"], "csv")
    filename="test.csv"

    with open(filename, "wb") as f:
        f.write(csv_output.data)

    return filename

@shared_task(ignore_result=False)
def create_product_csv():
    product = Product.query.with_entities(Product.name, Product.cost, Product.description, Product.quantity).all()

    csv_output = excel.make_response_from_query_sets(product, ["Name", "Cost" ,"Description", "Quantity"], "csv")
    filename="product.csv"

    with open(filename, "wb") as f:
        f.write(csv_output.data)

    return filename



@shared_task(ignore_result=True)
def monthly_report():
    users = User.query.filter(User.roles.any(Role.name == 'customer')).all()
    print(users)

    current_time = date.now(pytz.timezone('Asia/Kolkata'))
    time_window = current_time - timedelta(days=30)

    for user in users:

        orders = Orders.query.filter((Orders.user_id==user.id) & (Orders.date >= time_window)).all()
        print(orders)

        # Calculate the grand total
        total_cost = sum(order.quantity * order.product.cost for order in orders)

        # Render HTML template with order details
        html_content = render_template('order_email_template.html', user=user, orders=orders, total_cost=total_cost)

        # Send email
        send_message(user.email, 'Order Details', html_content)

    return {"message": "Email sent successfully"}

