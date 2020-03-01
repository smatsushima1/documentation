import pandas as pd

df = pd.read_csv("C:/users/smats/downloads/transactions.CSV", index_col=0)

df["CATEGORY"] = ""

derp = df["Description"].values[8].lower()

#print(derp.find("wm"))

derp2 = df["Description"].values

print(derp2)

#category = []
#for i in df["Description"]:
#  if i.find("walmart") > 0:
#    category.append("Food")

#df["CATEGORY"] = category

#print(df)
#print(df.columns)
