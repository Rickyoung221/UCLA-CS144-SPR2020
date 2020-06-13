## How to run
Hi!
Glad to see you.
After unzip the project, you can build it by:
`./deploy.sh`

After we deploy the files, we can access it through url:
for example:
http://localhost:8888/editor/post?action=open&username=user_XYRSAF&postid=1

And also you can access it by terminal:
for example:
Requesting http://localhost:8080/editor/post?action=open&username=user_XYRSAF&postid=1

Hoping you have a good time and stay healthy. 

## Feedback from Instructors
> GET action=open&username=testuser123&title=title&body=body, status code is not correct. GET action=open&postid=-1&title=title&body=body, status code is not correct. GET action=open&username=testuser123&postid=-1&title=title&body=body, No ID attribute. GET action=open&username=testuser123&postid=-1&title=&body=body, No ID attribute. GET action=open&username=testuser123&postid=-1&title=title&body=, No ID attribute. GET action=open&username=testuser123&postid=-1&body=body, behavior is not correct. GET action=open&username=testuser123&postid=-1&body=body, No ID attribute. GET action=open&username=testuser123&postid=-1&title=title, behavior is not correct. GET action=open&username=testuser123&postid=-1&title=title, No ID attribute. GET action=open&username=testuser123&postid=-1, behavior is not correct. GET action=open&username=testuser123&postid=-1, No ID attribute. POST action=open&username=testuser123&postid=-1&title=title&body=body, No ID attribute. GET action=open&username=user_XYRSAF&postid=1&title=Post 1 by XYRSAF&body=Article1 written by XYRSAF, No ID attribute. GET action=open&username=user_XYRSAF&postid=1, No ID attribute. GET action=save&username=user1&postid=-1&title=title&body=body, status code is not correct. GET action=delete&username=user_ACHERW&postid=1&title=Post 1 by ACHERW&body=Article1 written by ACHERW, status code is not correct.
