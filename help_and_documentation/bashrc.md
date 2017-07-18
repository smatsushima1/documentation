# Modifications to .bashrc
*None of these are necessary, but makes bash much more productive. All commands are inputted either below their respective commented headings or on the very bottom of the page under a newly-created commented heading.*

### Contents
- [**Aliases**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/bashrc.md#aliases)
- [**Case-insensitive auto-completion**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/bashrc.md#case-insensitive-auto-completion)
- [**Switching to Zsh**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/bashrc.md#switching-to-zsh)
- [**Using Vim on the command line**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/bashrc.md#using-vim-on-the-command-line)

### Aliases
```
alias l="ls -ahl"
alias ..="cd .."
alias v="vim"
alias ga="git add"
alias gc="git commit"
alias gcm="git commit -m"
alias gst="git status"
alias gl="git pull"
alias gp="git push"
alias gagc="git add --all . && git commit -m"
alias gpp="git pull && git push && git status"
```
[Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/bashrc.md#modifications-to-bashrc)

### Case-insensitive auto-completion
```
bind 'set completion-ignore-case on'
```
[Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/bashrc.md#modifications-to-bashrc)

### Switching to Zsh
This should only be used if the ```chsh``` command didnt work when attempting to change the default shell to Zsh and Oh My Zsh. This is explained in greater detail in the [oh_my_zsh](https://github.com/smatsushima1/home/blob/master/help_and_documentation/oh_my_zsh.md) file.
```
zsh
```
[Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/bashrc.md#modifications-to-bashrc)

### Using Vim on the command line
Pressing ```[ESC]``` on the command line reverts you to normal mode, where all the normal vim functions will work.
```
set -o vim
```
[Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/bashrc.md#modifications-to-bashrc)

