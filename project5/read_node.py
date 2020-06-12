import sys
import random
from locust import HttpLocust, TaskSet

##  The user cs144 would randomly open one of her posts via /blog/:username/:postid API.
## Again, remember to limit the postid between 1 and 500 when you pick one randomly.
# Note: Use /blog/cs144 as the name for this request.

def read(locust):
    postid = random.randint(1, 500)
    url_prefix = '/blog/cs144/'
    locust.client.get(url_prefix + str(postid), name=url_prefix)

class MyTaskSet(TaskSet):
    tasks = [read]

class MyLocust(HttpLocust):
    task_set = MyTaskSet
    min_wait = 1000
    max_wait = 2000