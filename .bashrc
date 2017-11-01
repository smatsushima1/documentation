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
#
# notes:
# - \[COLOR\] turns all text thereafter \[COLOR\] until another is defined
# - if another \[COLOR\] isn't defined before the right double quote, the
#   command input from the user will be the last \[COLOR\] defined
# - to mitigate this, set the last \[COLOR\] before the right double quote to
#   no-color to have normal colored input text
# - for a full list of colors: https://github.com/smatsushima1/home/blob/master/colors_demo
#
# arguments:
# \a - A bell character.
# \d - The date, in "Weekday Month Date" format (e.g., "Tue May 26").
# \D{format} - The format is passed to strftime(3) and the result is inserted
#              into the prompt string; an empty format results in a
#              locale-specific time representation. The braces are required.
# \e - An escape character.
# \h - The hostname, up to the first ‘.’.
# \H - The hostname.
# \j - The number of jobs currently managed by the shell.
# \l - The basename of the shell’s terminal device name.
# \n - A newline.
# \r - A carriage return.
# \s - The name of the shell, the basename of $0 (the portion following the final slash).
# \t - The time, in 24-hour HH:MM:SS format.
# \T - The time, in 12-hour HH:MM:SS format.
# \@ - The time, in 12-hour am/pm format.
# \A - The time, in 24-hour HH:MM format.
# \u - The username of the current user.
# \v - The version of Bash (e.g., 2.00)
# \V - The release of Bash, version + patchlevel (e.g., 2.00.0)
# \w - The current working directory, with $HOME abbreviated with a tilde (uses
#      the $PROMPT_DIRTRIM variable).
# \W - The basename of $PWD, with $HOME abbreviated with a tilde.
# \! - The history number of this command.
# \# - The command number of this command.
# \$ - If the effective uid is 0, #, otherwise $.
# \nnn - The character whose ASCII code is the octal value nnn.
# \\ - A backslash.
# \[ - Begin a sequence of non-printing characters.
################################################################################

PS1="\[\033[1;32m\]\w \[\033[0m\]"

################################################################################
# aliases
################################################################################

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

