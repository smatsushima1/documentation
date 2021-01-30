import os, re

# main path to current folder
dir_path = os.path.dirname(os.path.abspath(__file__))
dfars_dir = "dfars_dev"
dir_path = dir_path + "\\" + dfars_dir + "\\"
fname = dir_path + "PART_201.txt"
fname = open(fname)
fcont = fname.read()
fname.close()







# regex doesnt work for html...
patt = "href=.*>"
res = re.findall(patt, fcont)

for i in res:
  print(i)



# res2 = re.finditer(patt, fcont)

# for i in res2:
#   print(i.group(0))










# Absolutely no need to use RegEx in this case! Just use:

# s = 'Test result 1: Not Ok -31.08'
# if s.find('Not Ok') > 0 : 
#     print("Found!")
# or as already mentioned:

# if 'Not Ok' in s:
#     print("Found!")

# for i in fname:
#   res = re.search(lookup, i)
#   print(res)


# works!
# for num, line in enumerate(fname, 1):
#   if lookup in line:
#     print(num)












