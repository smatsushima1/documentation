---
layout: default
title: Git
---

### Contents

- [Create new repo from command line](https://github.com/smatsushima1/home/wiki/Git#create-new-repo-from-command-line)
- [Push an existing repo](https://github.com/smatsushima1/home/wiki/Git#push-an-existing-repo)
- [Reading submodules from cloned repos](https://github.com/smatsushima1/home/wiki/Git#reading-submodules-from-cloned-repos)
- [Working with same-name submodules](https://github.com/smatsushima1/home/wiki/Git#working-with-same-name-submodules)
- [Pushing a file too large](https://github.com/smatsushima1/home/wiki/Git#pushing-a-file-too-large)
    - [Removing file from commit history](https://github.com/smatsushima1/home/wiki/Git#removing-file-from-commit-history)
    - [Alternative: erasing commit history](https://github.com/smatsushima1/home/wiki/Git#alternative-erasing-commit-history)
- [Resources](https://github.com/smatsushima1/home/wiki/Git#resources)

---

### Create new repo from command line

```
echo "# test" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin [REPO]
git push -u origin master
```

###### [Top](https://github.com/smatsushima1/home/wiki/Git#contents)

---

### Push an existing repo

```
git remote add origin [REPO]
git push -u origin master
```

###### [Top](https://github.com/smatsushima1/home/wiki/Git#contents)

---

### Reading submodules from cloned repos

Submodules within clones repos wont be readable until they are ininitialized:

```
git submodule init
git submodule update
```

###### [Top](https://github.com/smatsushima1/home/wiki/Git#contents)

---

### Working with same-name submodules

If one were to create and initialize a submodule, remove it, then create another submodule with the same name, the data from the former submodule will reinitialize with the latter submodule. Reversing this simply entitles the user to remove the former submodules 'private' files and credentials from the ```.gitmodules``` directory:

```
cd [REPO]
vim .gitmodules
    # delete all lines pointing to the submod
git submodule deinit [SUBMODULE_IN_QUESTION]
cd .git
cd modules
rm -rf [SUBMODULE_IN_QUESTION]
```

The submod must then be removed from the main repo:

```
cd [REPO]
rm -rf [SUBMODULE_IN_QUESTION]
```

At this point, the correct submod can be added to the main repo with no overlapping issues.

###### [Top](https://github.com/smatsushima1/home/wiki/Git#contents)

---

### Pushing a file too large

The maximum file size git can commit is 100 Mb. Pushing a file larger than that will forevor save it in the commit history and the system will always try to re-push it even after it has been deleted. The following error message will forevor haunt the user:

```
[User@localhost home]$ gpp
Already up-to-date.
Username for 'https://github.com': smatsushima1
Password for 'https://smatsushima1@github.com': 
Counting objects: 115, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (109/109), done.
Writing objects: 100% (114/114), 67.15 MiB | 724.00 KiB/s, done.
Total 114 (delta 20), reused 0 (delta 0)
remote: Resolving deltas: 100% (20/20), completed with 1 local object.
remote: error: GH001: Large files detected. You may want to try Git Large File Storage - https://git-lfs.github.com.
remote: error: Trace: 9164ad78627d12b96b15f079480eb279
remote: error: See http://git.io/iEPt8g for more information.
remote: error: File data_science_bootcamp_odu/BigData/Bootcamp Files/R Scripts/collectionFile is 128.43 MB; this exceeds GitHubs file size limit of 100.00 MB
To https://github.com/smatsushima1/install.git
 ! [remote rejected] master -> master (pre-receive hook declined)
error: failed to push some refs to 'https://github.com/smatsushima1/install.git'
```

Links to help solve this are as follows:

- https://github.com/blog/2019-how-to-undo-almost-anything-with-git
- https://help.github.com/articles/removing-sensitive-data-from-a-repository/
- https://stackoverflow.com/questions/4114095/how-to-revert-git-repository-to-a-previous-commit
- https://git-scm.com/docs/git-reset
- https://stackoverflow.com/questions/14969775/delete-all-git-commit-history
- https://stackoverflow.com/questions/19573031/cant-push-to-github-because-of-large-file-which-i-already-deleted

###### [Top](https://github.com/smatsushima1/home/wiki/Git#contents)

---

### Removing file from commit history

```
git filter-branch --index-filter 'git rm -r --cached --ignore-unmatch [PATH_TO_FILE]' HEAD
```

The specific path to the file from the directory is required. This path is relative from the repo page, not the home computer directory:

```
# this will not work since it references the home directory:
git filter-branch --index-filter 'git rm -r --cached --ignore-unmatch /home/[USER]/[REPO]/[REPO_FOLDER]/[FILE]' HEAD

# this will work
git filter-branch --index-filter 'git rm -r --cached --ignore-unmatch [REPO_FOLDER]/[FILE]' HEAD
```

Comparison of the wrong and right paths are as follows:

```
# wrong path with just the file name
[User@localhost home]$ git filter-branch -f --index-filter 'git rm -r --cached --ignore-unmatch collectionFile' HEAD
Rewrite 7f19bbc7da2062fd0cc1486810f01c0bb614b25b (14/14)
WARNING: Ref 'refs/heads/master' is unchanged

# right path with the file name in the correct directory
[User@localhost home]$ git filter-branch --index-filter 'git rm -r --cached --ignore-unmatch data_wrangling_bootcamp/chuck_scripts/collectionFile' HEAD
Rewrite 7e298e55c3c390c5a31a08fef68b8b538067b9c1 (13/14)rm 'data_wrangling_bootcamp/chuck_scripts/collectionFile'
Rewrite 7f19bbc7da2062fd0cc1486810f01c0bb614b25b (14/14)
Ref 'refs/heads/master' was rewritten
```

After succesfully removing the file from the commit history, all this is needed is a ```git commit -m [MESSAGE]``` and ```git push```. The full procedure is below:

```
git add [FILE]
git commit -m '[MESSAGE]'
git push
    # didnt realize file was too large
git rm [FILE]
git filter-branch --index-filter 'git rm -r --cached --ignore-unmatch [PATH_TO_FILE]' HEAD
git commit -m '[MESSAGE]'
git push
```

Sample code for the whole process is as follows:

```
[User@localhost test]$ cp ~/Downloads/large_file .
[User@localhost test]$ l
total 129M
drwxr-xr-x. 3 User user   89 Jul  4 14:10 .
drwxr-xr-x. 4 User user   30 Jul  4 12:18 ..
-rw-r--r--. 1 User user    2 Jul  4 13:56 1
-rw-r--r--. 1 User user    3 Jul  4 13:57 2
-rw-r--r--. 1 User user    4 Jul  4 13:57 3
-rw-r--r--. 1 User user    2 Jul  4 13:58 4
drwxr-xr-x. 8 User user  201 Jul  4 13:59 .git
-rw-r--r--. 1 User user 129M Jul  4 14:10 large_file
-rw-r--r--. 1 User user    7 Jul  4 13:51 README.md
[User@localhost test]$ gagc 'large_file'
[master d1cb57f] large_file
 1 file changed, 18690 insertions(+)
 create mode 100644 large_file
[User@localhost test]$ git push
Counting objects: 4, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 20.35 MiB | 671.00 KiB/s, done.
Total 3 (delta 1), reused 0 (delta 0)
remote: Resolving deltas: 100% (1/1), completed with 1 local object.
remote: error: GH001: Large files detected. You may want to try Git Large File Storage - https://git-lfs.github.com.
remote: error: Trace: 41f6a4f471c354e34733ecbb35659d2a
remote: error: See http://git.io/iEPt8g for more information.
remote: error: File large_file is 128.43 MB; this exceeds GitHubs file size limit of 100.00 MB
To https://github.com/smatsushima1/test.git
 ! [remote rejected] master -> master (pre-receive hook declined)
error: failed to push some refs to 'https://github.com/smatsushima1/test.git'
[User@localhost test]$ rm large_file 
[User@localhost test]$ gagc 'rm large_file'
[master f7478a0] rm large_file
 1 file changed, 18690 deletions(-)
 delete mode 100644 large_file
[User@localhost test]$ gpp
Already up-to-date.
Counting objects: 5, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (4/4), done.
Writing objects: 100% (4/4), 20.35 MiB | 642.00 KiB/s, done.
Total 4 (delta 1), reused 0 (delta 0)
remote: Resolving deltas: 100% (1/1), completed with 1 local object.
remote: error: GH001: Large files detected. You may want to try Git Large File Storage - https://git-lfs.github.com.
remote: error: Trace: c39db1f8bdc84bbe91efaa4928f5b560
remote: error: See http://git.io/iEPt8g for more information.
remote: error: File large_file is 128.43 MB; this exceeds GitHubs file size limit of 100.00 MB
To https://github.com/smatsushima1/test.git
 ! [remote rejected] master -> master (pre-receive hook declined)
error: failed to push some refs to 'https://github.com/smatsushima1/test.git'
[User@localhost test]$ git filter-branch --index-filter 'git rm -r --cached --ignore-unmatch ~/git/test/large_file' HEAD
Rewrite d42e0eaa02d468cfea1a5a598afa5cb5516eda8a (1/7)fatal: '/home/User/git/test/large_file' is outside repository
index filter failed: git rm -r --cached --ignore-unmatch ~/git/test/large_file
[User@localhost test]$ git filter-branch --index-filter 'git rm -r --cached --ignore-unmatch large_file' HEAD
Rewrite d1cb57f8f1f7544709a2033e286c46bdce2ac92e (6/7)rm 'large_file'
Rewrite f7478a0635614e43fb10c4f9ddf08617a1570056 (7/7)
Ref 'refs/heads/master' was rewritten
[User@localhost test]$ git status
# On branch master
# Your branch is ahead of 'origin/master' by 2 commits.
#   (use "git push" to publish your local commits)
#
nothing to commit, working directory clean
[User@localhost test]$ git commit -m 'filter-branch large_file'
# On branch master
# Your branch is ahead of 'origin/master' by 2 commits.
#   (use "git push" to publish your local commits)
#
nothing to commit, working directory clean
[User@localhost test]$ git push
Counting objects: 2, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (2/2), done.
Writing objects: 100% (2/2), 275 bytes | 0 bytes/s, done.
Total 2 (delta 1), reused 0 (delta 0)
remote: Resolving deltas: 100% (1/1), done.
To https://github.com/smatsushima1/test.git
   7aeabf1..75109db  master -> master
[User@localhost test]$ git status
# On branch master
nothing to commit, working directory clean
```

Re-adding and re-deleting the file will require an additional ```-f``` in the ```filter-branch``` argument to force override the command due to the previous back-up already existing:

```
[User@localhost test]$ git filter-branch --index-filter 'git rm -r --cached --ignore-unmatch large_file' HEAD
Cannot create a new backup.
A previous backup already exists in refs/original/
Force overwriting the backup with -f
[User@localhost test]$ git filter-branch -f --index-filter 'git rm -r --cached --ignore-unmatch large_file' HEAD
Rewrite cd604444aa3305b864fc65443d7ad2f65969679f (9/10)rm 'large_file/large_file'
Rewrite e5dbe5ab748e4ed5e69e0919a4e831ad49a6619a (10/10)
Ref 'refs/heads/master' was rewritten
[User@localhost test]$ gagc 'filter-branch -f large_file part 2'
[master 0668213] filter-branch -f large_file part 2
 1 file changed, 1 insertion(+)
 create mode 100644 6
[User@localhost test]$ gpp
Already up-to-date.
Counting objects: 6, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (4/4), done.
Writing objects: 100% (5/5), 531 bytes | 0 bytes/s, done.
Total 5 (delta 2), reused 0 (delta 0)
remote: Resolving deltas: 100% (2/2), completed with 1 local object.
To https://github.com/smatsushima1/test.git
   1b0d4e4..0668213  master -> master
# On branch master
nothing to commit, working directory clean
```

###### [Top](https://github.com/smatsushima1/home/wiki/Git#contents)

---

### Alternative: erasing commit history

An alternative way that essentially erases the git commit history is to delete the ```.git``` folder within the main repo page then re-initializing and re-configuring it:

```
rm -rf .git/
git init
git add .
git commit -m '[TEXT]'
git remote add [REPO] [REPO_URL_FROM_CLONE]
git checkout master
git push -u --force [REPO] [BRANCH]
```

The actual instance of the code for the above is as follows:

```
[User@localhost home]$ rm -rf .git/
[User@localhost home]$ git init
Initialized empty Git repository in /home/User/git/home/.git/
[User@localhost home]$ git add .
[User@localhost home]$ git commit -m 'Delete .git, then git init'
[master (root-commit) 04bfcb3] Delete .git, then git init
 19 files changed, 460 insertions(+)
 create mode 100644 .gitignore
 create mode 100644 .gitmodules
 create mode 100644 README.md
 create mode 100644 help_and_documentation/bashrc.md
 create mode 100644 help_and_documentation/oh_my_zsh.md
 create mode 100644 install/01_install_git
 create mode 100644 install/02_install_epel_release
 create mode 100644 install/03_install_printer
 create mode 100644 install/04_install_chrome
 create mode 100644 install/05_install_anaconda
 create mode 100644 install/06_install_vw
 create mode 100644 install/07_install_tensorflow
 create mode 100644 install/08_install_r
 create mode 100644 install/09_install_tmux
 create mode 100644 install/10_install_zsh
 create mode 100644 install/README.md
 create mode 100644 install/babun
 create mode 100644 misc/HowToLandJobRCode.txt
 create mode 100644 misc/README.md
[User@localhost home]$ git push
fatal: No configured push destination.
Either specify the URL from the command-line or configure a remote repository using

    git remote add <name> <url>

and then push using the remote name

    git push <name>

[User@localhost home]$ cd .git/
[User@localhost .git]$ v config 
[User@localhost .git]$ git remote add home https://github.com/smatsushima1/home.git
[User@localhost .git]$ git push --force home master
Counting objects: 24, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (22/22), done.
Writing objects: 100% (24/24), 7.59 KiB | 0 bytes/s, done.
Total 24 (delta 0), reused 0 (delta 0)
To https://github.com/smatsushima1/home.git
 + a5fddcf...04bfcb3 master -> master (forced update)
[User@localhost .git]$ ..
[User@localhost home]$ git status
# On branch master
nothing to commit, working directory clean
[User@localhost home]$ git log
commit 04bfcb3dad0e09d268a0f4f6d7e0ec0fafad4e63
Author: smatsushima1 <smatsushima1@gmail.com>
Date:   Sun Jul 2 16:45:34 2017 -0400

    Delete .git, then git init
[User@localhost home]$ gagc 'Revert files to original state'
[master 07eb904] Revert files to original state
 4 files changed, 240 insertions(+), 2 deletions(-)
 create mode 100644 help_and_documentation/bypass_ssl.txt
 create mode 100644 help_and_documentation/coreutils.md
 create mode 100644 help_and_documentation/git.md
[User@localhost home]$ gpp
fatal: No remote repository specified.  Please, specify either a URL or a
remote name from which new revisions should be fetched.
[User@localhost home]$ git push
fatal: No configured push destination.
Either specify the URL from the command-line or configure a remote repository using

    git remote add <name> <url>

and then push using the remote name

    git push <name>

[User@localhost home]$ git push home
fatal: The current branch master has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream home master

[User@localhost home]$ git push --set-upstream home master
Counting objects: 10, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (7/7), done.
Writing objects: 100% (7/7), 3.24 KiB | 0 bytes/s, done.
Total 7 (delta 2), reused 0 (delta 0)
remote: Resolving deltas: 100% (2/2), completed with 2 local objects.
To https://github.com/smatsushima1/home.git
   04bfcb3..07eb904  master -> master
Branch master set up to track remote branch master from home.
[User@localhost home]$ git status
# On branch master
nothing to commit, working directory clean
[User@localhost home]$ git push
Everything up-to-date
```

It is imperative to note that the above step will erase the commit history. The ```git log``` action only shows one value instead of the many that were there before - meaning that there will be no previous commits to reference if trying to revert to an older version of the commit history. For this reason, this method isnt recommended unless absolutely necessary. 

###### [Top](https://github.com/smatsushima1/home/wiki/Git#contents)

---

### Resources

Link | Explanation
--- | ---
[**Pro Git**](https://git-scm.com/book/en/v2) | Definitive book on the basics of Git

###### [Top](https://github.com/smatsushima1/home/wiki/Git#contents)
