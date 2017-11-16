---
layout: default
title: Ejabberd
---

# Installation

1. Go to the ejabberd [download page](https://www.process-one.net/en/ejabberd/downloads/) and ```wget``` the desired link: ```wget https://www.process-one.net/downloads/downloads-action.php?file=/ejabberd/17.09/ejabberd-17.09-0.x86_64.rpm```
2. Install the package: ```yum localinstall -y downloads-action*```

# [Configuration](https://docs.ejabberd.im/admin/)

1. Go the ejabberd ```bin``` directory: ```cd /opt/ejabberd*/bin```
2. Start the server: ```./ejabberdctl start```
3. Check the status of the server: ```./ejabberdctl status```
4. Admin UN and PW are both set to 'admin' by default so it would be best to change the PW. Syntax for it is as follows: ```./ejabberdctl change_password [USER] [HOST_NAME] [NEW_PASSWORD]``` which in this case would be ```./ejabberdctl change_password admin localhost [NEW_PASSWORD]```
5. Add users with the following syntax: ```./ejabberdctl register [USER] [HOST_NAME] [PASSWORD]```

# Configuration with the web-interface

- it is possible to do the above steps in the web interface. Simply type in the browser: ```http://127.0.0.1:5280/admin```
- the UN for the login box is ```admin@[HOST_NAME]``` which in this case is ```admin@localhost```
- the PW is ```admin``` unless changed previously
- to create new users, navigate to: ```Virtual Hosts > [HOST_NAME] > Users``` then input the UN and PW of choice
