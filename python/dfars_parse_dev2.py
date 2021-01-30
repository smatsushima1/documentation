# works!!!!!!!
import os

# main path to current folder
dir_path = os.path.dirname(os.path.abspath(__file__))
dfars_dir = "dfars_dev"
dir_path = dir_path + "\\" + dfars_dir + "\\"

# read the main file
mpath = "PART_201.html"
mpath = dir_path + mpath
mfile = open(mpath, "r")
mcont = mfile.read()
mfile.close()

# first append main file
apath = "append_dev01.html"
apath = dir_path + apath
afile = open(apath, "a")
afile.write(mcont)
afile.write("<br>")

# now start appending everything else
for i in os.listdir(dir_path):
  if i[0:3] == "201":
    ipath = dir_path + i
    ifile = open(ipath, "r")
    icont = ifile.read()
    ifile.close()
    afile.write(icont)
    afile.write("<br>")

# operation finished
afile.close()





# for future:
# 1) find "href"
# 2) stop till you find ">"
# 3) search and remove all text in there that leads up to a "#"

