################################################################################
# source global definitions
################################################################################

if [ -f /etc/bashrc ]
    then . /etc/bashrc
fi

################################################################################
# check window size after each command and adjust accordingly
################################################################################

shopt -s checkwinsize

################################################################################
# enable auto-completion
#
# yum install -y auto-completion*
################################################################################

if [ -f /usr/share/bash-completion/bash_completion ]
    then . /usr/share/bash-completion/bash_completion
elif [ -f /etc/bash_completion ]
    then . /etc/bash_completion
fi

################################################################################
# paths and environment variables
################################################################################

export PATH="/home/user/anaconda3/bin:$PATH"

################################################################################
# expand history size
################################################################################

export HISTFILESIZE=10000
export HISTSIZE=500

################################################################################
# prompt modification
################################################################################

PS1="\[\033[1;32m\]\w $ \[\033[0m\]"

################################################################################
# aliases
################################################################################

alias l="ls -Ahl --group-directories-first"
alias ..="cd .."
alias v="vim"

alias gagc="git add -A && git commit -m"
alias gpp="git pull && git push && git status"
alias gitkey='eval "$(ssh-agent -s)" && ssh-add /home/user/.ssh/github_rsa'

################################################################################
# functions
#
# list all functions: declare -f 
# remove function: unset -f [FUNCTION]
################################################################################

# automatically do ls -ahl after cd
# cd ()
# {
#     if [ -n "$1" ];
#         then builtin cd "$@" && ls -ahl
#         else builtin cd ~ && ls -ahl
#     fi
# }

################################################################################
# start tmux automatically
#
# https://wiki.archlinux.org/index.php/Tmux#Start_tmux_on_every_shell_login
################################################################################

#[[ $- != *i* ]] && return
#[[ -z "$TMUX" ]] && exec tmux

