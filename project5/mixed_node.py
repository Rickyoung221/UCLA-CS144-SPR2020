import sys
import random
import json
from locust import HttpLocust, TaskSet

# In this file,
# we combine the read intensive tasks and write intensive ones in a single file as you would
# expect. The percentage would remain the same as 10% write and 90% read.
#
# Note: Just reuse the tasks/functions you wrote in previous files and
# combine them with different weights.

def read(locust):
    postid = random.randint(1, 500)
    url_prefix = '/blog/cs144/'
    locust.client.get(url_prefix + str(postid), name=url_prefix)

def write(locust):
    postid = random.randint(1, 500)
    url_prefix = '/api/cs144/'
    #data = {"title": "Loading Test",
    #                   "body": "***Hello World!***"} # json.dumps() #headers = {'content-type':'application/json'}
    data = json.dumps({"title": "Loading Test",
                       "body": "***Hello World!***"})  # json.dumps() #headers = {'content-type':'application/json'}
    locust.client.put(url_prefix + str(postid), data, headers={'content-type': 'application/json'}, name=url_prefix)
    # locust.client.post(url_prefix + str(postid),data = {"title": "Loading Test", "body": "***Hello World!***"},name=url_prefix)


class MyTaskSet(TaskSet):
    tasks = {read: 9, write: 1}
    def on_start(locust):
        response = locust.client.post("/login", data={"username": "cs144", "password": "password"}, name = "/login")
        if response.status_code != 200:
            print("FAIL to start with posting data to server. Make sure that your server is running.")
            sys.exit()

class MyLocust(HttpLocust):
    task_set = MyTaskSet
    min_wait = 1000
    max_wait = 2000