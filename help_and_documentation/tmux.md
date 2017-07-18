# [Tmux](https://github.com/tmux/tmux/wiki)
Tmux allows you to split terminals into multiple panes to allow for simultaneous work. To download it:
```
yum install -y tmux
```
### List of common commands

Command | Function
--- | ---
```tmux``` |  start
```tmux new -s [NAME]``` | start with new session name
```tmux a #``` | attach
```tmux a -t [NAME]``` | attach to name
```tmux ls``` | list sessions
```tmux kill-session``` | ends entire session of tmux
```tmux kill-pane``` | ends tmux pane
 | 
```[CTRL+b]``` then: | 
```%``` | horizontal split
```"``` | vertical split
```o``` | swap panes
```q``` | show pane numbers
```x``` | kill pane
```:new[CR]``` | new session
```s``` | list sessions
```$``` | name session
