import sys, random
from locust import HttpLocust, TaskSet

def readPost(locust):
    postid = random.randint(1, 500)
    url_pref = "/editor/post?action=open"
    req_url = url_pref + "&username=cs144&postid=" + str(postid)
    locust.client.get(req_url, name=url_pref)

def writePost(locust):
    postid = random.randint(1, 500)
    url_pref = "/editor/post?action=save"
    req_url = url_pref + "&username=cs144&postid=" + str(postid) + "&title=Loading%20Test&body=***Hello%20World!***"
    locust.client.post(req_url, name = url_pref)

class MyTaskSet(TaskSet):
    tasks = {readPost: 9, writePost: 1}

class MyLocust(HttpLocust):
    """ the class MyLocust inherits from the class HttpLocust, representing an HTTP user """
    task_set = MyTaskSet
    min_wait = 1000
    max_wait = 2000




