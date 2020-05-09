#!/bin/bash

# create tables in MySQL
mysql CS144 < create.sql

# compile java servlet codes and assemble files into build/libs/editor.war
gradle assemble

# deploy the war file to tomcat
rm -f $CATALINA_BASE/webapps/editor.war
cp build/libs/editor.war $CATALINA_BASE/webapps
