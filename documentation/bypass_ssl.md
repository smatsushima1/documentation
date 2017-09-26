# Bypassing SSL
The following commands allow you to bypass firewalls while performing online-related tasks:
```
wget --no-check-certificate [URL]
curl -k [URL]
conda config --set ssl_verify false
pip install --trusted-host [HOST NAME]
git config --global http.sslverify false
```
