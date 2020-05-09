use BlogServer

db.Posts.drop()
db.Users.drop()

db.createCollection("Posts")
db.createCollection("Users")

db.Posts.insert([
  { "postid": 1, "username": "cs144", "created": 1518669344517, "modified": 1518669344517, "title": "## Title 1", "body": "Hello, world!" },
  { "postid": 2, "username": "cs144", "created": 1518669658420, "modified": 1518669658420, "title": "## Title 2", "body": "I am here." },
  { "postid": 3, "username": "user2", "created": 1518669758320, "modified": 1518669758320, "title": "## Title 3", "body": "today's a nice day" },
  { "postid": 4, "username": "user2", "created": 1518669758330, "modified": 1518669758340, "title": "## Title 4", "body": "today's a nice day" },
  { "postid": 5, "username": "user2", "created": 1518669758350, "modified": 1518669758350, "title": "## Title 5", "body": "today's a nice day" },
  { "postid": 6, "username": "user2", "created": 1518669758360, "modified": 1518669758360, "title": "## Title 6", "body": "today's a nice day" },
  { "postid": 7, "username": "user2", "created": 1518669758370, "modified": 1518669758370, "title": "## Title 7", "body": "gotta do my homework" },
  { "postid": 8, "username": "user2", "created": 1518669758380, "modified": 1518669758380, "title": "## Title 8", "body": "today's a nice day" }
])

db.Users.insert([
  { "username": "cs144", "password": "$2a$10$2DGJ96C77f/WwIwClPwSNuQRqjoSnDFj9GDKjg6X/PePgFdXoE4W6" },
  { "username": "user2", "password": "$2a$10$kTaFlLbfY1nnHnjb3ZUP3OhfsfzduLwl2k/gKLXvHew9uX.1blwne" }         
])