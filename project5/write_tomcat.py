import sys, random
from locust import HttpLocust, TaskSet

def writePost(locust):
    postid = random.randint(1, 500)
    url_pref = "/editor/post?action=save"
    req_url = url_pref + "&username=cs144&postid=" + str(postid) + "&title=Loading%20Test&body=***Hello%20World!***"
    locust.client.post(req_url, name = url_pref)
    #print(response)
    #locust.client.post(url_prefix1+url_prefix2+str(postid)+url_prefix3, name = url_prefix1)

#/editor/post?action=save&username=cs144&postid={num}&title=Loading%20Test&body=***Hello%20World!***

class MyTaskSet(TaskSet):
    tasks = [writePost]

  #  def on_start(locust):
  #      response = locust.client.post("/login", data={"username": "cs144", "password": "password"})
  #      if response.status_code != 200:
  #          print("FAIL to start with posting data to server. Make sure that your server is running.")
    #        sys.exit()

class MyLocust(HttpLocust):
    task_set = MyTaskSet
    min_wait = 1000
    max_wait = 2000
