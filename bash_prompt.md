---
layout: default
title: Customizing bash prompt
---

To customize your bash prompt, simply include a ```PS1``` variable in your ```.bashrc``` file. An explanation of what that means will follow, but it is easier to show an example and explain what it means, character by character:

```
PS1="\[\033[1;32m\]\w $ \[\033[m\]"
```

---

## Example with notes

```
 1          2       3 4      5  
_|_   ______|_____  | |  ____|___
| |  |            | | | |        |       
PS1="\[\033[1;32m\]\w $ \[\033[m\]"
```

1. The ```PS1``` variable previously alluded to. and simply means what the prompt is on the first line. Your custom prompt can have up to ```PS4```, meaning the fourth line of values before typing each command from the shell, The values are notes **3** and **4** and will be explained below.
2. The color of everything thereafter until another color is defined. See **Colors** section below for all possible colors and syntax for each.
3. A variable - in this case, this shows the current directory with the home directory as ```~```. See **Variables** below for all possible variables.
4. Dollar symbol. Anything can be placed here including text and symbols. ```$``` was used simply for tradition.
5. The "no color" color. If this value isn't included at the end, then everything will be the previous color specified, including the output of the shell commands.

---

## Variables

**This was copied from the bash reference manual - it can be found in the ```references``` directory of my github page**

Variable | Explanation
:--- | :---
\a | A bell character.
\d | The date, in "Weekday Month Date" format (e.g., "Tue May 26").
\D{format} | The format is passed to strftime(3) and the result is inserted into the prompt string; an empty format results in a locale-specific time representation. The braces are required.
\e | An escape character.
\h | The hostname, up to the first ‘.’.
\H | The hostname.
\j | The number of jobs currently managed by the shell.
\l | The basename of the shell’s terminal device name.
\n | A newline.
\r | A carriage return.
\s | The name of the shell, the basename of $0 (the portion following the final slash).
\t | The time, in 24-hour HH:MM:SS format.
\T | The time, in 12-hour HH:MM:SS format.
\@ | The time, in 12-hour am/pm format.
\A | The time, in 24-hour HH:MM format.
\u | The username of the current user.
\v | The version of Bash (e.g., 2.00)
\V | The release of Bash, version + patchlevel (e.g., 2.00.0)
\w | The current working directory, with $HOME abbreviated with a tilde (uses the $PROMPT_DIRTRIM variable).
\W | The basename of $PWD, with $HOME abbreviated with a tilde.
\! | The history number of this command.
\# | The command number of this command.
\$ | If the effective uid is 0, #, otherwise $.
\nnn | The character whose ASCII code is the octal value nnn.
\\ | A backslash.
\[ | Begin a sequence of non-printing characters.

---

## Colors
- for a full list of colors: https://github.com/smatsushima1/home/blob/master/colors_demo

