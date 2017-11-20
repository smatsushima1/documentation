---
layout: default
title: Encrypting Files
---

# First step: zip files first

```
zip [DESIRED_FILENAME] [FILE_TO_BE_ZIPPED]
```

IF zipping a directory, include ```-r```. Example:

```
zip -r directory.zip directory
```

# Second step: encrypt files with gpg

Encrypt files requiring password with the ```-c``` option. Default cipher used is AES128 but is upgraded here for ease-of-mind:

```
gpg -c --cipher-algo AES256 directory.zip
```

To retrieve the encrypted files:

```
gpg [ENCRYPTED_FILE]
```

Although the ```-d``` option decrypts the data, it only shows the output in the terminal as standard output, but keeps the original file intact.

