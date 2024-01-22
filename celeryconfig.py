# Celery configuration file

# Celery is used for asynchronous task processing - long running tasks

# broker_url stores the tasks that are to be executed in a queue
broker_url = "redis://localhost:6379/1" 

# result_backend stores the results of the tasks that are executed (optional)
result_backend = "redis://localhost:6379/2"

timezone = "Asia/Kolkata"
broker_connection_retry_on_startup=True