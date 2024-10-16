---
layout: default
title: Remapping Caps Lock
---

# CentOS

With Gnome desktop:

- search for "Tweak Tool" in the program finder
- open "Tweak Tool"
- select "Typing" (along the left)
- select "Caps Lock key behavior"
- choose desired option

# Ubuntu

With Cinnamon desktop:

- Menu > Preferences > Keyboard
- Layouts > Options
- Caps Lock key behavior > [SELECT_CHOICE]

# [Windows](https://commons.lbl.gov/display/~jwelcher@lbl.gov/Making+Caps+Lock+a+Control+Key)

- run regedit.exe from the Windows search bar
- verify you are in the folder "Keyboard Layout" (not "Keyboard Layouts") from the left pane: HKEY_LOCAL_MACHINE/System/CurrentControlSet/Control/Keyboard Layout
- from the top, select "Edit" > "New" > "Binary Value" and call it "Scancode Map"
- double-click the name to input one of the following commands:
    - to remap to [CTRL]:
        - 0000000000000000020000001D003A0000000000
        - or: 17 x 0s, 2, 6 x 0s, 1d, 2 x 0s, 3a, 10 x 0s
    - to remap to [ESC]:
        - 00000000000000000200000001003A0000000000
        - or: 17 x 0s, 2, 7 x 0s, 1, 2 x 0s, 3a, 10 x 0s
- restart the system
