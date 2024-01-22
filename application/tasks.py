from celery import shared_task
from .models import Category
import flask_excel as excel

@shared_task(ignore_result=False)
def create_category_csv():
    category = Category.query.with_entities(Category.name, Category.description).all()

    csv_output = excel.make_response_from_query_sets(category, ["name", "description"], "csv")
    filename="test.csv"

    with open(filename, "wb") as f:
        f.write(csv_output.data)

    return filename
