import os

# main path to current folder
dir_path = os.path.dirname(os.path.abspath(__file__))
dfars_dir = "dfars_dev"
dir_path = dir_path + "\\" + dfars_dir + "\\"

# files to be read
rfile1 = "PART_201.html"
rpath1 = dir_path + rfile1
rfile2 = "201.101.html"
rpath2 = dir_path + rfile2

# dev file
dfile = "append_dev01.html"
dpath = dir_path + dfile

# read files
rf1 = open(rpath1, "r")
rcont1 = rf1.read()
rf1.close()
rf2 = open(rpath2, "r")
rcont2 = rf2.read()
rf2.close()

# append the read file to the file to be appended
af = open(dpath, "a")
af.write(rcont1)
af.write("<br>")
af.write(rcont2)
af.close()

# os.remove(dpath)




# for future:
# 1) find "href"
# 2) stop till you find ">"
# 3) search and remove all text in there that leads up to a "#"




# works! - save for later
# for i in os.listdir(path1):
#   if i[0:3] == "201":
#     print(i)
    