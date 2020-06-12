# put your code for loading student data to mongodb
# use final;
use Final;
db.Students.insert([{"sid":123456789,"name":"John Cho","dept":"Computer Science","title":"Designer"},
                    {"sid":234567890,"name":"Megan Fox","dept":"Residential Life","title":"Coder"}]);