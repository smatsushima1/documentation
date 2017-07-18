# [Oh My Zsh](https://github.com/robbyrussell/oh-my-zsh)

*Formatting for the code sections below will be:*
```
[COMMAND]
	# [GENERAL_NOTES]
[EXPECTED_RESULT]

# [MORE_GENERAL_NOTES]
```

### Contents
- [**Installation**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/oh_my_zsh.md#installation)
- [**Changing Oh My Zsh to the default shell**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/oh_my_zsh.md#changing-oh-my-zsh-to-the-default-shell)
    - [**Alternative: zsh in .bashrc**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/oh_my_zsh.md#alternative-zsh-in-bashrc)
    - [**Alternative 2: modify passwd file**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/oh_my_zsh.md#alternative-2-modify-passwd-file)
- [**Themes**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/oh_my_zsh.md#themes)
- [**Aliases**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/oh_my_zsh.md#aliases)

### Installation
Zsh is required for oh-my-zsh:
```
yum install -y zsh
sh -c "$(curl -fsSLk https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

### Changing Oh My Zsh to the default shell
Verify your default shell by typing:
```
echo $SHELL
/bin/bash
```
Alternatively, use:
```
cat /etc/passwd
	# this will list all the users and many processes
	# only relevant results will be shown due to the exhaustive list
	# the user looking to change the default shell to Zsh in this case is named 'user'
user:x:1000:1000:user:/home/user:/bin/bash
anna:x:1001:1001::/home/anna:/bin/bash
laura:x:1002:1002::/home/laura:/bin/bash
```
As expressed at the end of each respective line, users user, anna, and laura all have bash as their default shell. Next is to verify that zsh is availabe to use as a shell:
```
cat /etc/shells
/bin/sh
/bin/bash
/sbin/nologin
/usr/bin/sh
/usr/bin/bash
/usr/sbin/nologin
/bin/tcsh
/bin/csh
/bin/zsh
```
If ```/bin/zsh``` is not included on this list, the system wont recognize it as a shell in the next step:
```
chsh: "/bin/zsh" is not listed in /etc/shells.
```
But since it is included on the list in this case, it is now time to make it the default shell by using its specifc path:
```
chsh -s /bin/zsh
	# chsh = change login shell
	# s = shell
	# /bin/zsh = the specific path verified and copied from the previous step
Changing shell for user.
Password:
Shell changed.
```
Alternatively, use:
```
chsh -s $(which zsh)
```
Lastly, changes will not be noticed until after you reboot the system:
```
reboot
```
Reverting back to bash involves the last step but just bash substituted for zsh:
```
chsh -s /bin/bash

# or

chsh -s $(which bash)
```
[Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/oh_my_zsh.md#oh-my-zsh)

### Alternative: zsh in .bashrc
Some times, the user looking to make Zsh the default shell wont be recognized as a user by the ```chsh``` command:
```
chsh: user "spmatsushima" does not exist.
```
Verify that the user does not exist by running:
```
cat /etc/passwd | grep spmatsushima
	# no response

# compared to:

cat /etc/passwd | grep root
root:x:0:0:root:/root:/bin/bash
operator:x:11:0:operator:/root:/sbin/nologin
```
If this is the case and the user cant be recognized by the system but Zsh and Oh My Zsh are installed, then navigate to the ".bashrc" file from the home directory and modify the contents with vim:
```
vim ~/.bashrc
	# (input at the bottom of the page:)
	# zsh
```
After this, the user either needs to source the file or simply restart the terminal:
```
source ~/.bashrc
```
The .bashrc file executes everything in its contents before it runs. So by typing "zsh" at the end, Oh My Zsh will load since it is being called upon each time bash runs. Due to this, Zsh is running on top of bash and will need a slightly different approach to exiting:
```
exit
	# exits Zsh and puts the user back to bash

exit
	# exits out of system
```
[Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/oh_my_zsh.md#oh-my-zsh)

### Alternative 2: modify passwd file
The user can modify the passwd file in the root /etc directory to allow bash to be the default shell for any user. Just change ```bash``` at the end to be ```zsh``` for the desired user. Change:
```
user:x:1000:1000:user:/home/user:/bin/bash
```
To:
```
user:x:1000:1000:user:/home/user:/bin/zsh
```
This method should be avoided because it alters the system file. After doing this method, the ```chsh``` command will not work because the system will forevor run the new shell.

[Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/oh_my_zsh.md#oh-my-zsh)

### Themes
To change a theme, navigate to the .zshrc file from the home directory and use vim to edit it:
```
vim ~/.bashrc
```
Once there, go to the line that says:
```
ZSH_THEME="robbyrussell"
```
From here, replace the text string inside the quotes with any of the themes presented [here](https://github.com/robbyrussell/oh-my-zsh/wiki/Themes).

You could also type "random" to display a different theme each time the terminal is started, or you can delete all the text inside the quotes to have no theme at all.

[Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/oh_my_zsh.md#oh-my-zsh)

### Aliases
If more aliases are desired, the same format is used to create aliases for bash:
```
vim ~/.zshrc
```
In the aliases section, type:
```
alias [NEW_COMMAND]="[OLD_COMMAND]"
```
[Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/oh_my_zsh.md#oh-my-zsh)

