# .bashrc

# Source global definitions
if [ -f /etc/bashrc ]; then
	. /etc/bashrc
fi

# Uncomment the following line if you don't like systemctl's auto-paging feature:
# export SYSTEMD_PAGER=

# User specific aliases and functions
alias l="ls -ahl"
alias ..="cd .."
alias v="vim"
alias c="cat"
alias cl="clear"
alias e="explorer ."
alias ga="git add"
alias gc="git commit"
alias gcm="git commit -m"
alias gst="git status"
alias gl="git pull"
alias gp="git push"
alias gagc="git add -A && git commit -m"
alias gpp="git pull && git push && git status"
alias reloadgitkey='eval "$(ssh-agent -s)" && ssh-add /home/user/github_rsa'

# start tmux automatically
# https://wiki.archlinux.org/index.php/Tmux#Start_tmux_on_every_shell_login
[[ $- != *i* ]] && return
[[ -z "$TMUX" ]] && exec tmux

# added by Anaconda3 4.4.0 installer
export PATH="/home/user/anaconda3/bin:$PATH"

# ignore case
bind 'set completion-ignore-case on'
