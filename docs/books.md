# Books

<!-- TOC -->

- [Books](#books)
  - [Extract CSVs from RSS](#extract-csvs-from-rss)
  - [Transform CSVs to DataFrames](#transform-csvs-to-dataframes)
  - [Load shelved\_to\_read\_books\_df](#load-shelved_to_read_books_df)
  - [(old) From HTML](#old-from-html)
  - [(discarded no avg ratings) From export csv](#discarded-no-avg-ratings-from-export-csv)
  - [(discarded) Logged in within Goodreads](#discarded-logged-in-within-goodreads)

<!-- /TOC -->

## Extract CSVs from RSS

```python
import time
import urllib
from io import StringIO
from bs4 import BeautifulSoup
user_agent = "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7"
url_prefix = "https://www.goodreads.com/review/list_rss/50196372?shelf=o-read&page=" #%23ALL%23
all_books_df = pd.DataFrame()
previous_xml = ""
offset = 1 #
#shelves_to_query = [
#  {"shelf":"business","pages":"1"},
#  {"shelf":"finance-investing","pages":"2"},
#  {"shelf":"health","pages":"1"},
#  {"shelf":"history","pages":"1"},
#  {"shelf":"marketing","pages":"1"},
#  {"shelf":"philosophy","pages":"1"},
#  {"shelf":"psychology","pages":"2"},
#  {"shelf":"real-estate-inv","pages":"2"},
#  {"shelf":"specific-reference","pages":"1"}#
#]
for n in range(11 - offset): # starts in 0, but page in 1
  url = url_prefix + str(n+offset)
  req = urllib.request.Request(url)
  req.add_header('User-Agent', user_agent)
  xml = urllib.request.urlopen(req).read().decode('utf-8')
  if xml == previous_xml:
    print("XML is the same, breaking at", n)
    break
  previous_xml = xml
  try:
    books_df = pd.read_xml(StringIO(xml), xpath=".//item")
  except Exception as e:
    print("Error at", str(n+offset), ":", e)
  fn = "../data/goodreads-javier-to-read-page-"+str(n+offset)+".csv" #shelves
  books_df.to_csv(fn)
  all_books_df = pd.concat([all_books_df, books_df])
all_books_df = all_books_df.drop_duplicates()
print("n_books",len(all_books_df))
```

    Error at 8 : xpath does not return any nodes or attributes. Be sure to specify in `xpath` the parent nodes of children and attributes to parse. If document uses namespaces denoted with xmlns, be sure to define namespaces and use them in xpath.
    Error at 9 : xpath does not return any nodes or attributes. Be sure to specify in `xpath` the parent nodes of children and attributes to parse. If document uses namespaces denoted with xmlns, be sure to define namespaces and use them in xpath.
    Error at 10 : xpath does not return any nodes or attributes. Be sure to specify in `xpath` the parent nodes of children and attributes to parse. If document uses namespaces denoted with xmlns, be sure to define namespaces and use them in xpath.
    n_books 681

```python
all_books_df.columns
```

    Index(['guid', 'pubDate', 'title', 'link', 'book_id', 'book_image_url',
           'book_small_image_url', 'book_medium_image_url', 'book_large_image_url',
           'book_description', 'book', 'author_name', 'isbn', 'user_name',
           'user_rating', 'user_read_at', 'user_date_added', 'user_date_created',
           'user_shelves', 'user_review', 'average_rating', 'book_published',
           'description'],
          dtype='object')

## Transform CSVs to DataFrames

```python
import pandas as pd
import urllib
from pathlib import Path

path = "../data/goodreads-to-read"
files = Path(path).glob('*.csv')
to_read_books_df = pd.concat(
  (pd.read_csv(f).assign(filename=f.stem) for f in files)
  , ignore_index=True
).drop_duplicates()

"""
cols = list(to_read_books_df.columns)
cols.sort()
print("columns")
print("\n".join(cols))
  columns
  author_name average_rating book book_description book_id book_image_url
  book_large_image_url book_medium_image_url book_published
  book_small_image_url description filename guid isbn link pubDate title
  user_date_added user_date_created user_name user_rating user_read_at
  user_review user_shelves
"""
del to_read_books_df["Unnamed: 0"]

to_read_books_df["date_shelved"] = to_read_books_df["user_date_added"].apply(
  lambda da: pd.to_datetime(da, format='mixed')
)
to_read_books_df = to_read_books_df[[
  "user_shelves", "book_published", "author_name", "title"
  , "average_rating", "user_rating", "book_id", "isbn"
  , "date_shelved", "filename"
]].sort_values("average_rating",ascending=False)\
.fillna(0).astype({"book_published":"int32"})
shelves_to_query = [
  "business", "finance-investing", "health", "history", "marketing"
  , "philosophy", "psychology", "real-estate-inv", "specific-reference"
]
shelved_to_read_books_df = pd.DataFrame()
for shelf in shelves_to_query:
  print(
    shelf, len(to_read_books_df[
      to_read_books_df["user_shelves"]\
        .str.contains(shelf)
    ])
  )
  shelved_to_read_books_df = pd.concat([
    shelved_to_read_books_df
    ,to_read_books_df[
      to_read_books_df["user_shelves"]\
        .str.contains(shelf)
    ]
  ])
shelved_to_read_books_df = shelved_to_read_books_df.groupby([
  "user_shelves", "book_published", "author_name", "title"
  , "average_rating", "user_rating", "book_id", "isbn", "date_shelved"
]).min().reset_index()#.sort_values("average_rating",ascending=False)

```

    business 52
    finance-investing 78
    health 22
    history 61
    marketing 19
    philosophy 26
    psychology 78
    real-estate-inv 57
    specific-reference 81

```python
import pandas as pd
shelved_to_read_book_ids_df = pd.read_csv("../data/shelved_to_read_book_ids.csv")
shelved_to_read_books_df = shelved_to_read_books_df.merge(
  shelved_to_read_book_ids_df, how='left', on="book_id"
).fillna(0).astype({"n_ratings": "int32"})
shelved_to_read_books_df["darks"] = shelved_to_read_books_df[[
  "average_rating", "n_ratings"#, "num pages"
]].apply(
  lambda r: max(r.iloc[0]**2 + 2*np.log10(r.iloc[1]+1),0) # - 2*np.log10(r.iloc[2]+1) avg>pages>reads
  # max(np.log10((r.iloc[0]*r.iloc[1])+1) - np.log10(r.iloc[2]+1),0) strategy weighting more pages>reads>avg
  , axis=1
)
shelved_to_read_books_df = shelved_to_read_books_df.sort_values("darks", ascending=[False])[[
  "user_shelves", "book_published", "author_name", "title"
  , "n_ratings", "average_rating", "darks", "user_rating", "book_id"
  , "isbn", "date_shelved", "filename"
]][
  ~shelved_to_read_books_df["user_shelves"].str.contains("read-inspiring") &
  (shelved_to_read_books_df["user_rating"]!=1) &
  (shelved_to_read_books_df["user_rating"]!=2)
]
shelved_to_read_books_df.to_csv('../data/shelved_to_read_books_df.csv')
```

    C:\Users\dark_\AppData\Local\Temp\ipykernel_24424\903085382.py:13: UserWarning: Boolean Series key will be reindexed to match DataFrame index.
      shelved_to_read_books_df = shelved_to_read_books_df.sort_values("darks", ascending=[False])[[

## Load shelved_to_read_books_df

```python
shelved_to_read_books_df
```

<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>user_shelves</th>
      <th>book_published</th>
      <th>author_name</th>
      <th>title</th>
      <th>n_ratings</th>
      <th>average_rating</th>
      <th>darks</th>
      <th>user_rating</th>
      <th>book_id</th>
      <th>isbn</th>
      <th>date_shelved</th>
      <th>filename</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>20</th>
      <td>history, currently-reading</td>
      <td>2010</td>
      <td>Laura Hillenbrand</td>
      <td>Unbroken: A World War II Story of Survival, Re...</td>
      <td>956969</td>
      <td>4.37</td>
      <td>31.058697</td>
      <td>0</td>
      <td>8664353</td>
      <td>1400064163</td>
      <td>2024-08-16 12:05:04-07:00</td>
      <td>goodreads-javier-to-read-page-4</td>
    </tr>
    <tr>
      <th>55</th>
      <td>psychology, top-reference-books, want-read-next</td>
      <td>1989</td>
      <td>Stephen R. Covey</td>
      <td>The 7 Habits of Highly Effective People: Power...</td>
      <td>759365</td>
      <td>4.16</td>
      <td>29.066502</td>
      <td>0</td>
      <td>36072</td>
      <td>0743269519</td>
      <td>2024-09-07 07:24:06-07:00</td>
      <td>goodreads-javier-to-read-page-4</td>
    </tr>
    <tr>
      <th>26</th>
      <td>history, want-read-next</td>
      <td>2003</td>
      <td>Bill Bryson</td>
      <td>A Short History of Nearly Everything</td>
      <td>394475</td>
      <td>4.21</td>
      <td>28.916141</td>
      <td>0</td>
      <td>21</td>
      <td>076790818X</td>
      <td>2024-09-07 07:24:06-07:00</td>
      <td>goodreads-javier-to-read-page-4</td>
    </tr>
    <tr>
      <th>54</th>
      <td>psychology, top-reference-books, to-read</td>
      <td>2012</td>
      <td>Charles Duhigg</td>
      <td>The Power of Habit: Why We Do What We Do in Li...</td>
      <td>520355</td>
      <td>4.13</td>
      <td>28.489501</td>
      <td>0</td>
      <td>12609433</td>
      <td>1400069289</td>
      <td>2024-09-07 10:01:14-07:00</td>
      <td>goodreads-javier-to-read-page-1</td>
    </tr>
    <tr>
      <th>27</th>
      <td>history, want-read-next</td>
      <td>2015</td>
      <td>Yuval Noah Harari</td>
      <td>Homo Deus: A History of Tomorrow</td>
      <td>258765</td>
      <td>4.20</td>
      <td>28.465814</td>
      <td>0</td>
      <td>31138556</td>
      <td>0</td>
      <td>2024-09-07 07:24:07-07:00</td>
      <td>goodreads-javier-to-read-page-4</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>129</th>
      <td>to-read, finance-investing</td>
      <td>1991</td>
      <td>Annette Thau</td>
      <td>The Bond Book: Everything Investors Need to Kn...</td>
      <td>0</td>
      <td>3.96</td>
      <td>15.681600</td>
      <td>0</td>
      <td>851083</td>
      <td>0071358625</td>
      <td>2024-09-07 09:42:48-07:00</td>
      <td>goodreads-javier-to-read-page-2</td>
    </tr>
    <tr>
      <th>200</th>
      <td>to-read, marketing</td>
      <td>0</td>
      <td>Jim Vandehei</td>
      <td>Smart Brevity: The Power of Saying More with Less</td>
      <td>0</td>
      <td>3.93</td>
      <td>15.444900</td>
      <td>0</td>
      <td>59891634</td>
      <td>1523516976</td>
      <td>2024-09-07 10:17:15-07:00</td>
      <td>goodreads-javier-to-read-page-1</td>
    </tr>
    <tr>
      <th>7</th>
      <td>finance-investing, missclick</td>
      <td>0</td>
      <td>José Luis Cava</td>
      <td>El arte de especular</td>
      <td>6</td>
      <td>3.67</td>
      <td>15.159096</td>
      <td>0</td>
      <td>33797837</td>
      <td>8461117638</td>
      <td>2024-09-07 09:46:18-07:00</td>
      <td>goodreads-javier-to-read-page-1</td>
    </tr>
    <tr>
      <th>58</th>
      <td>real-estate-inv, missclick</td>
      <td>0</td>
      <td>Arthur VanDam CPA</td>
      <td>How to Finance Commercial Real Estate: How to ...</td>
      <td>1</td>
      <td>1.00</td>
      <td>1.602060</td>
      <td>0</td>
      <td>29566707</td>
      <td>189015833X</td>
      <td>2024-09-07 09:46:19-07:00</td>
      <td>goodreads-javier-to-read-page-1</td>
    </tr>
    <tr>
      <th>60</th>
      <td>real-estate-inv, missclick</td>
      <td>0</td>
      <td>Lawrence Uchill</td>
      <td>Anatomy of a Mortgage: Understanding and Negot...</td>
      <td>0</td>
      <td>0.00</td>
      <td>0.000000</td>
      <td>0</td>
      <td>35873297</td>
      <td>1634257693</td>
      <td>2024-09-07 09:46:18-07:00</td>
      <td>goodreads-javier-to-read-page-1</td>
    </tr>
  </tbody>
</table>
<p>350 rows × 12 columns</p>
</div>

```python
def get_n_ratings_from_bid(bid):
  url_prefix="https://www.goodreads.com/book/show/"
  url = url_prefix + str(bid)
  req = urllib.request.Request(url)
  req.add_header('User-Agent', user_agent)
  res = urllib.request.urlopen(req)
  html = res.read().decode('utf-8')
  soup =  BeautifulSoup(
    html,'html.parser', from_encoding="utf8"
  )
  n_ratings = list(
    soup.find(
      'span',
      attrs={'data-testid': 'ratingsCount'}
    ).children
  )[0]
  pages_format = list(
   soup.find(
      'span',
      attrs={'data-testid': 'pagesFormat'}
    ).children
  )[0]
  if pages_format.find(" ")==-1:
    n_pages=0
  else:
    n_pages=pages_format[:pages_format.find(" ")]
  print(bid,",",n_ratings,",",n_pages)
  return n_ratings

print("bid , n_ratings , n_pages")
#rewrite as a loop with locs
#shelved_to_read_books_df["n_ratings"] = shelved_to_read_books_df["book_id"].apply(
#  lambda bid: get_n_ratings_from_bid(bid)
#)

shelved_to_read_books_df.to_csv("shelved_to_read_books.csv")
```

## (old) From HTML

```python
import numpy as np
import os
import pandas as pd
import sys
import urllib
from bs4 import BeautifulSoup
from datetime import datetime
from io import StringIO

path = '../data/books.html'
soup = BeautifulSoup(open(path),'html.parser', from_encoding="utf8")

# list_header = []
# header = soup.find_all("table")[0].find("tr")
# for items in header:
#     try:
#         list_header.append(items.get_text())
#     except:
#         continue

data = []
html_data = soup.find_all("table")[0]
tr_data=html_data.find_all("tr")[1:]

books_html_df = pd.read_xml(StringIO(str("".join(tr_data))))
books_html_df

#for element in html_data:
#    sub_data = []
#    for sub_element in element:
#        try:
#            sub_data.append(sub_element.get_text())
#        except:
#            continue
#    data.append(sub_data)
#raw_books_df = pd.DataFrame(data = data, columns = list_header).dropna()
#raw_books_df
```

```python
books_df = raw_books_df[[
  'title\n \n\n'
  ,'author\n \n*\n\n'
  #,'isbn\n\n\n'
  #,'isbn13\n\n\n'
  #,'asin\n\n\n'
  ,'avg rating\n\n\n'
  ,'num ratings\n\n\n'
  ,'num pages\n\n\npp\n\n\n'
  ,'date pub\n\n\n'
  #,'date pub edition\n\n\n'
  #,'my rating\n\n\n\n\n\n'
  ,'shelves\n\n\n\n'
  #,'review\n\n\n\n\n'
  #,'notes\n\n\n\n\n'
  #,'comments\n\n\n\n'
  #,'votes\n\n\n\n'
  #,'# times read\n\n\n'
  ,'date started\n\n\n'
  ,'date read\n\n\n'
  ,'date added\n\n\n\n\n'
  #,'owned\n\n'
  #,'format\n\n        Kindle Edition\n        [edit]\n\n'
  #,'actions\n\n\n\nedit\n\nview\n               \n\n\nremove book\n\n\n\n'
]].rename(columns={
    "title\n \n\n":"title"
    ,"author\n \n*\n\n":"author"
    #,"isbn\n\n\n":"isbn"
    #,"isbn13\n\n\n":"isbn13"
    #,"asin\n\n\n":"asin"
    ,"avg rating\n\n\n":"avg rating"
    ,"num ratings\n\n\n":"num ratings"
    ,"num pages\n\n\npp\n\n\n":"num pages"
    ,"date pub\n\n\n":"date pub"
    #,"date pub edition\n\n\n":"date pub edition"
    #,"my rating\n\n\n\n\n\n":"my rating"
    ,"shelves\n\n\n\n":"shelves"
    #,"review\n\n\n\n\n":"review"
    #,"notes\n\n\n\n\n":"notes"
    #,"comments\n\n\n\n":"comments"
    #,"votes\n\n\n\n":"votes"
    #,"# times read\n\n\n":"# times read"
    ,"date started\n\n\n":"date started"
    ,"date read\n\n\n":"date read"
    ,"date added\n\n\n\n\n":"date added"
    #,"owned\n\n":"owned"
    #,"format\n\n        Kindle Edition\n        [edit]\n\n":"format"
    #,"actions\n\n\n\nedit\n\nview\n               \n\n\nremove book\n\n\n\n":"actions"
})
#for col in books_df.columns:
#  if is_string_dtype(f[col]):
#    f[col] = f[col].str.replace(
#                            "[^-$A-Za-z0-9 <>=\":#,?%!*'\(\);&\+áéíóúñèößºª\[\/\]\.]+", "")
books_df = books_df.replace({r"[^-$A-Za-z0-9 <>=\":#,?%!*'\(\);&\+áéíóúñèößºª]+": ""}, regex=True)
books_df = books_df.replace({
  "title ": "", "author ": "", "avg rating ": "", "num ratings ": "", "num pages ": "", " pp": ""
  ,"date pub ": "", "shelves": "", "\[edit\]": "", "date started": "", "date read": ""
  ,"date added ": "", "                ": " ", "        ": " ", "    ": " "
  ,"   ": " ", "  ": " "
}, regex=True)
books_df["num ratings"] = books_df["num ratings"].replace({",": ""}, regex=True)
books_df["num pages"] = books_df["num pages"].replace({",": "", "unknown": "200"}, regex=True)
books_df["date pub"] = books_df["date pub"].replace({"not set": "", "unknown": ""}, regex=True)
books_df["date started"] = books_df["date started"].replace({"not set": ""}, regex=True)
books_df["date read"] = books_df["date read"].replace({"not set": ""}, regex=True)
books_df["date added"] = books_df["date added"].replace({"not set": ""}, regex=True)
books_df = books_df.astype({
  "avg rating": "float32",
  "num ratings": "int32",
  "num pages": "int32"
})
date_pub_fixed = pd.to_datetime(books_df["date pub"],format='mixed',errors='coerce') #format='%b %d, %Y'
date_pub_fixed = date_pub_fixed.fillna(pd.to_datetime(books_df["date pub"],format='%Y',errors='coerce'))
books_df['date_pub'] = date_pub_fixed.fillna(datetime(1900, 1, 1, 0))
del books_df["date pub"]
books_df["date_started"] = pd.to_datetime(books_df["date started"],format='mixed',errors='coerce').fillna(datetime(1900, 1, 1, 0))
del books_df["date started"]
books_df["date_read"] = pd.to_datetime(books_df["date read"],format='mixed',errors='coerce').fillna(datetime(1900, 1, 1, 0))
del books_df["date read"]
books_df["date_added"] = pd.to_datetime(books_df["date added"],format='mixed',errors='coerce').fillna(datetime(1900, 1, 1, 0))
del books_df["date added"]
books_df["darks"] = books_df[[
  "avg rating", "num ratings", "num pages"
]].apply(
  lambda r: max(r.iloc[0]**2 + 2*np.log10(r.iloc[1]+1) - 2*np.log10(r.iloc[2]+1),0) # avg>pages>reads
  # max(np.log10((r.iloc[0]*r.iloc[1])+1) - np.log10(r.iloc[2]+1),0) strategy weighting more pages>reads>avg
  , axis=1
)
books_df = books_df.sort_values("darks", ascending=[False])
books_df.to_csv('../data/books_df.csv')
filtered_books_df = books_df[
  ~books_df["shelves"].str.contains("novels") &
  ~books_df["shelves"].str.contains("missclick")
].reset_index()
filtered_books_df.index.name='index'
filtered_books_df.to_excel("../data/filtered_books_1_df.xlsx")
filtered_books_df.dtypes
```

```python
filtered_books_df[
  books_df["shelves"].str.contains("read-next-shortlist") | #user_shelves
  books_df["shelves"].str.contains("currently-reading")
]
filtered_books_df
```

    C:\Users\dark_\AppData\Local\Temp\ipykernel_5928\2200323226.py:1: UserWarning: Boolean Series key will be reindexed to match DataFrame index.
      filtered_books_df[

<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>title</th>
      <th>author</th>
      <th>avg rating</th>
      <th>num ratings</th>
      <th>num pages</th>
      <th>shelves</th>
      <th>date started</th>
      <th>date read</th>
      <th>date added</th>
      <th>date_pub</th>
      <th>darks</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>39</th>
      <td>Unbroken: A World War II Story of Survival, R...</td>
      <td>Hillenbrand, Laura</td>
      <td>4.38</td>
      <td>954708</td>
      <td>475</td>
      <td>read-next-shortlist, history</td>
      <td>Aug 16, 2024</td>
      <td>not set</td>
      <td>Apr 19, 2022</td>
      <td>2010-11-16</td>
      <td>25.788929</td>
    </tr>
    <tr>
      <th>33</th>
      <td>The Last Lecture</td>
      <td>Pausch, Randy</td>
      <td>4.26</td>
      <td>349713</td>
      <td>206</td>
      <td>read-next-shortlist, top-reference-books</td>
      <td>Aug 16, 2024</td>
      <td>not set</td>
      <td>Sep 04, 2017</td>
      <td>2008-04-08</td>
      <td>24.603087</td>
    </tr>
    <tr>
      <th>70</th>
      <td>The Psychology of Money</td>
      <td>Housel, Morgan</td>
      <td>4.30</td>
      <td>205232</td>
      <td>252</td>
      <td>read-next-shortlist, psychology</td>
      <td>Aug 16, 2024</td>
      <td>not set</td>
      <td>May 30, 2022</td>
      <td>2020-01-01</td>
      <td>24.308255</td>
    </tr>
    <tr>
      <th>22</th>
      <td>Foundation (Foundation, #1)</td>
      <td>Asimov, Isaac</td>
      <td>4.17</td>
      <td>550325</td>
      <td>244</td>
      <td>read-next-shortlist, novels</td>
      <td>Aug 16, 2024</td>
      <td>not set</td>
      <td>Nov 29, 2020</td>
      <td>1951-08-30</td>
      <td>24.091809</td>
    </tr>
    <tr>
      <th>38</th>
      <td>The Big Short: Inside the Doomsday Machine</td>
      <td>Lewis, Michael</td>
      <td>4.30</td>
      <td>162351</td>
      <td>264</td>
      <td>read-next-shortlist, financial-investing</td>
      <td>Aug 16, 2024</td>
      <td>not set</td>
      <td>Sep 15, 2022</td>
      <td>2010-03-15</td>
      <td>24.064425</td>
    </tr>
    <tr>
      <th>6</th>
      <td>The 7 Habits of Highly Effective People: Powe...</td>
      <td>Covey, Stephen R.</td>
      <td>4.16</td>
      <td>756470</td>
      <td>372</td>
      <td>read-next-shortlist, psychology, top-reference...</td>
      <td>Aug 10, 2024</td>
      <td>not set</td>
      <td>Sep 04, 2017</td>
      <td>1994-03-01</td>
      <td>23.919766</td>
    </tr>
    <tr>
      <th>23</th>
      <td>A Short History of Nearly Everything</td>
      <td>Bryson, Bill</td>
      <td>4.22</td>
      <td>393186</td>
      <td>544</td>
      <td>read-next-shortlist, history</td>
      <td>Aug 16, 2024</td>
      <td>not set</td>
      <td>Sep 12, 2020</td>
      <td>2003-01-01</td>
      <td>23.524804</td>
    </tr>
    <tr>
      <th>60</th>
      <td>The Simple Path to Wealth: Your road map to f...</td>
      <td>Collins, J L</td>
      <td>4.43</td>
      <td>24775</td>
      <td>288</td>
      <td>read-next-shortlist, financial-investing, psyc...</td>
      <td>Nov 19, 2023</td>
      <td>not set</td>
      <td>Nov 19, 2023</td>
      <td>2016-06-17</td>
      <td>23.491165</td>
    </tr>
    <tr>
      <th>54</th>
      <td>Homo Deus: A History of Tomorrow</td>
      <td>Harari, Yuval Noah</td>
      <td>4.20</td>
      <td>257313</td>
      <td>450</td>
      <td>read-next-shortlist, history</td>
      <td>Aug 10, 2024</td>
      <td>not set</td>
      <td>May 30, 2022</td>
      <td>2015-01-01</td>
      <td>23.152572</td>
    </tr>
    <tr>
      <th>40</th>
      <td>The Lean Startup (Hardcover)</td>
      <td>Ries, Eric*</td>
      <td>4.11</td>
      <td>335245</td>
      <td>299</td>
      <td>read-next-shortlist, top-reference-books</td>
      <td>Aug 10, 2024</td>
      <td>not set</td>
      <td>May 30, 2022</td>
      <td>2011-01-01</td>
      <td>22.988586</td>
    </tr>
    <tr>
      <th>15</th>
      <td>Good to Great: Why Some Companies Make the Le...</td>
      <td>Collins, James C.</td>
      <td>4.12</td>
      <td>237629</td>
      <td>300</td>
      <td>read-next-shortlist, financial-investing, top-...</td>
      <td>Aug 16, 2024</td>
      <td>not set</td>
      <td>Nov 28, 2020</td>
      <td>2001-11-01</td>
      <td>22.769069</td>
    </tr>
    <tr>
      <th>21</th>
      <td>The Selfish Gene</td>
      <td>Dawkins, Richard*</td>
      <td>4.16</td>
      <td>180938</td>
      <td>360</td>
      <td>read-next-shortlist, specific-reference</td>
      <td>Aug 16, 2024</td>
      <td>not set</td>
      <td>Nov 28, 2020</td>
      <td>1976-01-01</td>
      <td>22.705649</td>
    </tr>
    <tr>
      <th>7</th>
      <td>Rich Dad's Cashflow Quadrant: Rich Dad's Guid...</td>
      <td>Kiyosaki, Robert T.</td>
      <td>4.14</td>
      <td>57599</td>
      <td>376</td>
      <td>currently-reading, top-reference-books</td>
      <td>Dec 29, 2023</td>
      <td>not set</td>
      <td>Aug 28, 2022</td>
      <td>1900-01-01</td>
      <td>21.507761</td>
    </tr>
    <tr>
      <th>49</th>
      <td>The Book on Flipping Houses: How to Buy, Reha...</td>
      <td>Scott, J.*</td>
      <td>4.36</td>
      <td>889</td>
      <td>200</td>
      <td>currently-reading, real-estate-inv, top-refere...</td>
      <td>Sep 02, 2023</td>
      <td>not set</td>
      <td>Jan 03, 2023</td>
      <td>2013-03-22</td>
      <td>20.301989</td>
    </tr>
    <tr>
      <th>61</th>
      <td>The Book on Negotiating Real Estate: Expert S...</td>
      <td>Scott, J.*</td>
      <td>4.29</td>
      <td>291</td>
      <td>271</td>
      <td>currently-reading, real-estate-inv</td>
      <td>Oct 25, 2023</td>
      <td>not set</td>
      <td>Aug 28, 2023</td>
      <td>1900-01-01</td>
      <td>18.465728</td>
    </tr>
  </tbody>
</table>
</div>

## (discarded no avg ratings) From export csv

```python
import pandas as pd

books_export_df = pd.read_csv("../data/goodreads_library_export.csv")
print("n_books",len(books_export_df))
print("columns",books_export_df.columns)
books_export_excerpt_df = books_export_df[[
  "Author l-f", "Title", "Read Count", "Average Rating", "Number of Pages"
  ,"My Rating", "Bookshelves", "Exclusive Shelf"
  ,"Original Publication Year", "Book Id"
]].fillna(0).astype({
  "Number of Pages": "int32",
  "Original Publication Year": "int32"
})
books_export_excerpt_df.head()
```

    n_books 509
    columns Index(['Book Id', 'Title', 'Author', 'Author l-f', 'Additional Authors',
           'ISBN', 'ISBN13', 'My Rating', 'Average Rating', 'Publisher', 'Binding',
           'Number of Pages', 'Year Published', 'Original Publication Year',
           'Date Read', 'Date Added', 'Bookshelves', 'Bookshelves with positions',
           'Exclusive Shelf', 'My Review', 'Spoiler', 'Private Notes',
           'Read Count', 'Owned Copies'],
          dtype='object')

<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Author l-f</th>
      <th>Title</th>
      <th>Read Count</th>
      <th>Average Rating</th>
      <th>Number of Pages</th>
      <th>My Rating</th>
      <th>Bookshelves</th>
      <th>Exclusive Shelf</th>
      <th>Original Publication Year</th>
      <th>Book Id</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Cixin, Liu</td>
      <td>Death's End (Remembrance of Earth’s Past, #3)</td>
      <td>0</td>
      <td>4.42</td>
      <td>604</td>
      <td>0</td>
      <td>to-read</td>
      <td>to-read</td>
      <td>2010</td>
      <td>25451264</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Cixin, Liu</td>
      <td>The Dark Forest (Remembrance of Earth’s Past, #2)</td>
      <td>0</td>
      <td>4.41</td>
      <td>512</td>
      <td>0</td>
      <td>to-read</td>
      <td>to-read</td>
      <td>2008</td>
      <td>23168817</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Cixin, Liu</td>
      <td>The Three-Body Problem (Remembrance of Earth’s...</td>
      <td>0</td>
      <td>4.08</td>
      <td>472</td>
      <td>0</td>
      <td>novels, to-read</td>
      <td>to-read</td>
      <td>2006</td>
      <td>20518872</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Tolle, Eckhart</td>
      <td>The Power of Now: A Guide to Spiritual Enlight...</td>
      <td>0</td>
      <td>4.15</td>
      <td>229</td>
      <td>0</td>
      <td>psychology, to-read</td>
      <td>to-read</td>
      <td>1997</td>
      <td>6708</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Thiel, Peter</td>
      <td>Zero to One: Notes on Startups, or How to Buil...</td>
      <td>0</td>
      <td>4.15</td>
      <td>195</td>
      <td>0</td>
      <td>top-reference-books, to-read</td>
      <td>to-read</td>
      <td>2014</td>
      <td>18050143</td>
    </tr>
  </tbody>
</table>
</div>

```python
cols = list(books_export_excerpt_df.columns)
cols.sort()
print("columns")
print("\n".join(cols))
```

    columns
    Additional Authors
    Author
    Author l-f
    Average Rating
    Binding
    Book Id
    Bookshelves
    Bookshelves with positions
    Date Added
    Date Read
    Exclusive Shelf
    ISBN
    ISBN13
    My Rating
    My Review
    Number of Pages
    Original Publication Year
    Owned Copies
    Private Notes
    Publisher
    Read Count
    Spoiler
    Title
    Year Published

```python
books_df = books_export_excerpt_df[books_export_excerpt_df["Exclusive Shelf"]!="missclick"][[
  "Author l-f", "Title", "Read Count", "Average Rating", "Number of Pages"
  ,"My Rating", "Bookshelves", "Exclusive Shelf"
  ,"Original Publication Year", "Book Id", "ISBN"
]].fillna(0).astype({
  "Number of Pages": "int32",
  "Original Publication Year": "int32"
}).sort_values(
  ["Original Publication Year", "Author l-f", "Title"]
)
books_df
```

<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Author l-f</th>
      <th>Title</th>
      <th>Read Count</th>
      <th>Average Rating</th>
      <th>Number of Pages</th>
      <th>My Rating</th>
      <th>Bookshelves</th>
      <th>Exclusive Shelf</th>
      <th>Original Publication Year</th>
      <th>Book Id</th>
      <th>ISBN</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>336</th>
      <td>Abbott, Devin</td>
      <td>Fullstack React Native: Create beautiful mobil...</td>
      <td>0</td>
      <td>4.15</td>
      <td>688</td>
      <td>0</td>
      <td>to-read, informatics</td>
      <td>to-read</td>
      <td>0</td>
      <td>43628062</td>
      <td>="1728995558"</td>
    </tr>
    <tr>
      <th>348</th>
      <td>Accomazzo, Anthony</td>
      <td>Fullstack React: The Complete Guide to ReactJS...</td>
      <td>0</td>
      <td>4.24</td>
      <td>830</td>
      <td>0</td>
      <td>to-read, informatics</td>
      <td>to-read</td>
      <td>0</td>
      <td>32705383</td>
      <td>="0991344626"</td>
    </tr>
    <tr>
      <th>270</th>
      <td>Antani, Ved</td>
      <td>JavaScript: Functional Programming for JavaScr...</td>
      <td>0</td>
      <td>4.25</td>
      <td>635</td>
      <td>0</td>
      <td>to-read, javascript</td>
      <td>to-read</td>
      <td>0</td>
      <td>31863150</td>
      <td>="1787125572"</td>
    </tr>
    <tr>
      <th>238</th>
      <td>Arnell, R. Scott</td>
      <td>Sustainable &amp; Responsible Investing 360°: Less...</td>
      <td>0</td>
      <td>4.28</td>
      <td>404</td>
      <td>0</td>
      <td>financial-investing, to-read</td>
      <td>to-read</td>
      <td>0</td>
      <td>62475608</td>
      <td>="1538149044"</td>
    </tr>
    <tr>
      <th>113</th>
      <td>Arranz, Ana Monmeneu</td>
      <td>VENDE TU CASA Y COMPRA TU LIBERTAD: Guía rápid...</td>
      <td>0</td>
      <td>3.71</td>
      <td>182</td>
      <td>0</td>
      <td>to-read</td>
      <td>to-read</td>
      <td>0</td>
      <td>71943901</td>
      <td>=""</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>120</th>
      <td>Schur, Michael</td>
      <td>How to Be Perfect: The Correct Answer to Every...</td>
      <td>0</td>
      <td>4.14</td>
      <td>304</td>
      <td>0</td>
      <td>to-read, psychology</td>
      <td>to-read</td>
      <td>2022</td>
      <td>58484901</td>
      <td>="1982159316"</td>
    </tr>
    <tr>
      <th>119</th>
      <td>Yong, Ed</td>
      <td>An Immense World: How Animal Senses Reveal the...</td>
      <td>0</td>
      <td>4.47</td>
      <td>464</td>
      <td>0</td>
      <td>to-read, specific-reference</td>
      <td>to-read</td>
      <td>2022</td>
      <td>59575939</td>
      <td>=""</td>
    </tr>
    <tr>
      <th>95</th>
      <td>Attia, Peter</td>
      <td>Outlive: The Science &amp; Art of Longevity</td>
      <td>0</td>
      <td>4.37</td>
      <td>496</td>
      <td>0</td>
      <td>to-read</td>
      <td>to-read</td>
      <td>2023</td>
      <td>61153739</td>
      <td>="0593236599"</td>
    </tr>
    <tr>
      <th>96</th>
      <td>Desmond, Matthew</td>
      <td>Poverty, by America</td>
      <td>0</td>
      <td>4.27</td>
      <td>284</td>
      <td>0</td>
      <td>to-read</td>
      <td>to-read</td>
      <td>2023</td>
      <td>61358638</td>
      <td>="0593239911"</td>
    </tr>
    <tr>
      <th>104</th>
      <td>Orosz, Gergely</td>
      <td>The Software Engineer's Guidebook: Navigating ...</td>
      <td>0</td>
      <td>4.12</td>
      <td>413</td>
      <td>0</td>
      <td>to-read, informatics</td>
      <td>to-read</td>
      <td>2023</td>
      <td>201545491</td>
      <td>="908338182X"</td>
    </tr>
  </tbody>
</table>
<p>412 rows × 11 columns</p>
</div>

```python
rss_cols = list(all_books_df.columns)
rss_cols.sort()
print("\n".join(rss_cols))
```

    author_name
    average_rating
    book
    book_description
    book_id
    book_image_url
    book_large_image_url
    book_medium_image_url
    book_published
    book_small_image_url
    description
    guid
    isbn
    link
    pubDate
    title
    user_date_added
    user_date_created
    user_name
    user_rating
    user_read_at
    user_review
    user_shelves

```python
all_books_df["date_shelved"] = all_books_df["user_date_added"].apply(
  lambda da: pd.to_datetime(
    da, format='mixed' #'%a, %d %b %Y %H:%M:%S %Z'
  )#.strftime('%Y%M%D%H%M')
)
all_books_df = all_books_df.fillna(0).astype({
  "book_published": "int32"
})

latest_books_df = all_books_df[[
  "book_published", "user_shelves", "author_name", "title", "book_id",
  "date_shelved", "average_rating", "user_rating",  #!, "ratings_number" pending
]].sort_values("date_shelved",ascending=False)
latest_books_df
```

<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>book_published</th>
      <th>user_shelves</th>
      <th>author_name</th>
      <th>title</th>
      <th>book_id</th>
      <th>date_shelved</th>
      <th>average_rating</th>
      <th>user_rating</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1999</td>
      <td>to-read</td>
      <td>William J. Poorvu</td>
      <td>The Real Estate Game: The Intelligent Guide To...</td>
      <td>643390</td>
      <td>2024-09-07 05:52:38-07:00</td>
      <td>4.13</td>
      <td>0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2013</td>
      <td>to-read</td>
      <td>Stephen Wendel</td>
      <td>Designing for Behavior Change: Applying Psycho...</td>
      <td>18167241</td>
      <td>2024-09-07 01:19:35-07:00</td>
      <td>4.08</td>
      <td>0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>0</td>
      <td>to-read</td>
      <td>Jakub Lasak</td>
      <td>Theory of People: Master Behaviors, Business, ...</td>
      <td>50893389</td>
      <td>2024-09-07 01:19:23-07:00</td>
      <td>4.23</td>
      <td>0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2016</td>
      <td>to-read</td>
      <td>Richard H. Thaler</td>
      <td>Misbehaving: The Making of Behavioral Economics</td>
      <td>26530355</td>
      <td>2024-09-07 01:18:54-07:00</td>
      <td>4.16</td>
      <td>0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>0</td>
      <td>to-read</td>
      <td>Walter Grant</td>
      <td>How to Start a Successful Airbnb Business: Qui...</td>
      <td>59335141</td>
      <td>2024-09-03 21:13:39-07:00</td>
      <td>4.30</td>
      <td>0</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>74</th>
      <td>2019</td>
      <td>missclick</td>
      <td>Clea Shearer</td>
      <td>The Home Edit: A Guide to Organizing and Reali...</td>
      <td>40712502</td>
      <td>2021-01-16 05:23:12-08:00</td>
      <td>3.77</td>
      <td>0</td>
    </tr>
    <tr>
      <th>75</th>
      <td>2010</td>
      <td>missclick</td>
      <td>Marie Kondō</td>
      <td>The Life-Changing Magic of Tidying Up: The Jap...</td>
      <td>22318578</td>
      <td>2021-01-16 04:39:28-08:00</td>
      <td>3.88</td>
      <td>0</td>
    </tr>
    <tr>
      <th>76</th>
      <td>1651</td>
      <td>missclick</td>
      <td>Thomas Hobbes</td>
      <td>Leviathan</td>
      <td>91953</td>
      <td>2021-01-16 04:39:15-08:00</td>
      <td>3.71</td>
      <td>0</td>
    </tr>
    <tr>
      <th>77</th>
      <td>2019</td>
      <td>missclick</td>
      <td>Sally  Thorne</td>
      <td>99 Percent Mine</td>
      <td>36300625</td>
      <td>2020-09-12 05:14:54-07:00</td>
      <td>3.32</td>
      <td>0</td>
    </tr>
    <tr>
      <th>78</th>
      <td>2004</td>
      <td>missclick</td>
      <td>Guy Kawasaki</td>
      <td>The Art of the Start 2.0: The Time-Tested, Bat...</td>
      <td>22835624</td>
      <td>2020-09-12 05:14:52-07:00</td>
      <td>3.98</td>
      <td>0</td>
    </tr>
  </tbody>
</table>
<p>578 rows × 8 columns</p>
</div>

```python
books_df["Book Id"]
```

    336     43628062
    348     32705383
    270     31863150
    238     62475608
    113     71943901
             ...
    120     58484901
    119     59575939
    95      61153739
    96      61358638
    104    201545491
    Name: Book Id, Length: 412, dtype: int64

```python
len(books_df[books_df["Exclusive Shelf"]=="to-read"])
```

    345

```python
url = "https://www.goodreads.com/tooltips?"
for bn, bid in enumerate(book_ids):
  if not (bn+1)%20:
    url += "use_wtr_tooltip=true\n\nhttps://www.goodreads.com/tooltips?"
  url += "resources%5BBook."+str(bid)+"%5D%5Btype%5D=Book&"
url_f = open("url.txt", "w+", encoding="utf-8")
url_f.write(url)
url_f.close()
```

```python
books_all_cols_no_missclick_by_pub_year_df = books_export_excerpt_df[books_export_excerpt_df["Exclusive Shelf"]!="missclick"][[
  "Author l-f", "Title", "Read Count", "Average Rating", "Number of Pages"
  ,"My Rating", "Bookshelves", "Exclusive Shelf"
  ,"Original Publication Year", "Book Id", "ISBN"
]].fillna(0).astype({
  "Number of Pages": "int32",
  "Original Publication Year": "int32"
}).sort_values(
  ["Original Publication Year", "Author l-f", "Title"]
)
books_all_cols_no_missclick_by_pub_year_df
```

<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Author l-f</th>
      <th>Title</th>
      <th>Read Count</th>
      <th>Average Rating</th>
      <th>Number of Pages</th>
      <th>My Rating</th>
      <th>Bookshelves</th>
      <th>Exclusive Shelf</th>
      <th>Original Publication Year</th>
      <th>Book Id</th>
      <th>ISBN</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>336</th>
      <td>Abbott, Devin</td>
      <td>Fullstack React Native: Create beautiful mobil...</td>
      <td>0</td>
      <td>4.15</td>
      <td>688</td>
      <td>0</td>
      <td>to-read, informatics</td>
      <td>to-read</td>
      <td>0</td>
      <td>43628062</td>
      <td>="1728995558"</td>
    </tr>
    <tr>
      <th>348</th>
      <td>Accomazzo, Anthony</td>
      <td>Fullstack React: The Complete Guide to ReactJS...</td>
      <td>0</td>
      <td>4.24</td>
      <td>830</td>
      <td>0</td>
      <td>to-read, informatics</td>
      <td>to-read</td>
      <td>0</td>
      <td>32705383</td>
      <td>="0991344626"</td>
    </tr>
    <tr>
      <th>270</th>
      <td>Antani, Ved</td>
      <td>JavaScript: Functional Programming for JavaScr...</td>
      <td>0</td>
      <td>4.25</td>
      <td>635</td>
      <td>0</td>
      <td>to-read, javascript</td>
      <td>to-read</td>
      <td>0</td>
      <td>31863150</td>
      <td>="1787125572"</td>
    </tr>
    <tr>
      <th>238</th>
      <td>Arnell, R. Scott</td>
      <td>Sustainable &amp; Responsible Investing 360°: Less...</td>
      <td>0</td>
      <td>4.28</td>
      <td>404</td>
      <td>0</td>
      <td>financial-investing, to-read</td>
      <td>to-read</td>
      <td>0</td>
      <td>62475608</td>
      <td>="1538149044"</td>
    </tr>
    <tr>
      <th>113</th>
      <td>Arranz, Ana Monmeneu</td>
      <td>VENDE TU CASA Y COMPRA TU LIBERTAD: Guía rápid...</td>
      <td>0</td>
      <td>3.71</td>
      <td>182</td>
      <td>0</td>
      <td>to-read</td>
      <td>to-read</td>
      <td>0</td>
      <td>71943901</td>
      <td>=""</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>120</th>
      <td>Schur, Michael</td>
      <td>How to Be Perfect: The Correct Answer to Every...</td>
      <td>0</td>
      <td>4.14</td>
      <td>304</td>
      <td>0</td>
      <td>to-read, psychology</td>
      <td>to-read</td>
      <td>2022</td>
      <td>58484901</td>
      <td>="1982159316"</td>
    </tr>
    <tr>
      <th>119</th>
      <td>Yong, Ed</td>
      <td>An Immense World: How Animal Senses Reveal the...</td>
      <td>0</td>
      <td>4.47</td>
      <td>464</td>
      <td>0</td>
      <td>to-read, specific-reference</td>
      <td>to-read</td>
      <td>2022</td>
      <td>59575939</td>
      <td>=""</td>
    </tr>
    <tr>
      <th>95</th>
      <td>Attia, Peter</td>
      <td>Outlive: The Science &amp; Art of Longevity</td>
      <td>0</td>
      <td>4.37</td>
      <td>496</td>
      <td>0</td>
      <td>to-read</td>
      <td>to-read</td>
      <td>2023</td>
      <td>61153739</td>
      <td>="0593236599"</td>
    </tr>
    <tr>
      <th>96</th>
      <td>Desmond, Matthew</td>
      <td>Poverty, by America</td>
      <td>0</td>
      <td>4.27</td>
      <td>284</td>
      <td>0</td>
      <td>to-read</td>
      <td>to-read</td>
      <td>2023</td>
      <td>61358638</td>
      <td>="0593239911"</td>
    </tr>
    <tr>
      <th>104</th>
      <td>Orosz, Gergely</td>
      <td>The Software Engineer's Guidebook: Navigating ...</td>
      <td>0</td>
      <td>4.12</td>
      <td>413</td>
      <td>0</td>
      <td>to-read, informatics</td>
      <td>to-read</td>
      <td>2023</td>
      <td>201545491</td>
      <td>="908338182X"</td>
    </tr>
  </tbody>
</table>
<p>412 rows × 11 columns</p>
</div>

```python
cols = list(books_export_excerpt_df.columns)
cols.sort()
print("columns\n","\n".join(cols))
books_df = books_export_excerpt_df[books_export_excerpt_df["Exclusive Shelf"]!="missclick"][[
  "Author l-f", "Title", "Read Count", "Average Rating", "Number of Pages"
  ,"My Rating", "Bookshelves", "Exclusive Shelf"
  ,"Original Publication Year", "Book Id", "ISBN"
]].fillna(0).astype({
  "Number of Pages": "int32",
  "Original Publication Year": "int32"
}).sort_values(
  ["Original Publication Year", "Author l-f", "Title"]
)
books_df
```

    columns
     Additional Authors
    Author
    Author l-f
    Average Rating
    Binding
    Book Id
    Bookshelves
    Bookshelves with positions
    Date Added
    Date Read
    Exclusive Shelf
    ISBN
    ISBN13
    My Rating
    My Review
    Number of Pages
    Original Publication Year
    Owned Copies
    Private Notes
    Publisher
    Read Count
    Spoiler
    Title
    Year Published

<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Author l-f</th>
      <th>Title</th>
      <th>Read Count</th>
      <th>Average Rating</th>
      <th>Number of Pages</th>
      <th>My Rating</th>
      <th>Bookshelves</th>
      <th>Exclusive Shelf</th>
      <th>Original Publication Year</th>
      <th>Book Id</th>
      <th>ISBN</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>336</th>
      <td>Abbott, Devin</td>
      <td>Fullstack React Native: Create beautiful mobil...</td>
      <td>0</td>
      <td>4.15</td>
      <td>688</td>
      <td>0</td>
      <td>to-read, informatics</td>
      <td>to-read</td>
      <td>0</td>
      <td>43628062</td>
      <td>="1728995558"</td>
    </tr>
    <tr>
      <th>348</th>
      <td>Accomazzo, Anthony</td>
      <td>Fullstack React: The Complete Guide to ReactJS...</td>
      <td>0</td>
      <td>4.24</td>
      <td>830</td>
      <td>0</td>
      <td>to-read, informatics</td>
      <td>to-read</td>
      <td>0</td>
      <td>32705383</td>
      <td>="0991344626"</td>
    </tr>
    <tr>
      <th>270</th>
      <td>Antani, Ved</td>
      <td>JavaScript: Functional Programming for JavaScr...</td>
      <td>0</td>
      <td>4.25</td>
      <td>635</td>
      <td>0</td>
      <td>to-read, javascript</td>
      <td>to-read</td>
      <td>0</td>
      <td>31863150</td>
      <td>="1787125572"</td>
    </tr>
    <tr>
      <th>238</th>
      <td>Arnell, R. Scott</td>
      <td>Sustainable &amp; Responsible Investing 360°: Less...</td>
      <td>0</td>
      <td>4.28</td>
      <td>404</td>
      <td>0</td>
      <td>financial-investing, to-read</td>
      <td>to-read</td>
      <td>0</td>
      <td>62475608</td>
      <td>="1538149044"</td>
    </tr>
    <tr>
      <th>113</th>
      <td>Arranz, Ana Monmeneu</td>
      <td>VENDE TU CASA Y COMPRA TU LIBERTAD: Guía rápid...</td>
      <td>0</td>
      <td>3.71</td>
      <td>182</td>
      <td>0</td>
      <td>to-read</td>
      <td>to-read</td>
      <td>0</td>
      <td>71943901</td>
      <td>=""</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>120</th>
      <td>Schur, Michael</td>
      <td>How to Be Perfect: The Correct Answer to Every...</td>
      <td>0</td>
      <td>4.14</td>
      <td>304</td>
      <td>0</td>
      <td>to-read, psychology</td>
      <td>to-read</td>
      <td>2022</td>
      <td>58484901</td>
      <td>="1982159316"</td>
    </tr>
    <tr>
      <th>119</th>
      <td>Yong, Ed</td>
      <td>An Immense World: How Animal Senses Reveal the...</td>
      <td>0</td>
      <td>4.47</td>
      <td>464</td>
      <td>0</td>
      <td>to-read, specific-reference</td>
      <td>to-read</td>
      <td>2022</td>
      <td>59575939</td>
      <td>=""</td>
    </tr>
    <tr>
      <th>95</th>
      <td>Attia, Peter</td>
      <td>Outlive: The Science &amp; Art of Longevity</td>
      <td>0</td>
      <td>4.37</td>
      <td>496</td>
      <td>0</td>
      <td>to-read</td>
      <td>to-read</td>
      <td>2023</td>
      <td>61153739</td>
      <td>="0593236599"</td>
    </tr>
    <tr>
      <th>96</th>
      <td>Desmond, Matthew</td>
      <td>Poverty, by America</td>
      <td>0</td>
      <td>4.27</td>
      <td>284</td>
      <td>0</td>
      <td>to-read</td>
      <td>to-read</td>
      <td>2023</td>
      <td>61358638</td>
      <td>="0593239911"</td>
    </tr>
    <tr>
      <th>104</th>
      <td>Orosz, Gergely</td>
      <td>The Software Engineer's Guidebook: Navigating ...</td>
      <td>0</td>
      <td>4.12</td>
      <td>413</td>
      <td>0</td>
      <td>to-read, informatics</td>
      <td>to-read</td>
      <td>2023</td>
      <td>201545491</td>
      <td>="908338182X"</td>
    </tr>
  </tbody>
</table>
<p>412 rows × 11 columns</p>
</div>

## (discarded) Logged in within Goodreads

```python
import urllib
from bs4 import BeautifulSoup

url="https://www.goodreads.com/review/list/50196372-javier"
req = urllib.request.Request(url)
req.add_header('User-Agent', 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7')
response = urllib.request.urlopen(req)
data = response.read() # a `bytes` object
html = data.decode('utf-8') # a `str`; this step can't be used if data is binary
f = open("goodreads-javier.html", "w+", encoding="utf-8")
f.write(html)
f.close()
html
```

    '<!DOCTYPE html>\n<html class="desktop withSiteHeaderTopFullImage\n">\n<head>\n  <title>Javier’s books on Goodreads (575 books)</title>\n\n<meta content=\'Javier has 575 books on his all shelf: How to Start a Successful Airbnb Business: Quit Your Day Job and Earn Full-time Income on Autopilot With a Profita...\' name=\'description\'>\n<meta content=\'telephone=no\' name=\'format-detection\'>\n<link href=\'https://www.goodreads.com/review/list/50196372\' rel=\'canonical\'>\n  <meta property="og:title" content="Javier’s books on Goodreads (575 books)"/>\n  <meta property="og:type" content="website"/>\n  <meta property="og:site_name" content="Goodreads"/>\n  <meta property="og:description" content="Javier has 575 books on his all shelf: How to Start a Successful Airbnb Business: Quit Your Day Job and Earn Full-time Income on Autopilot With a Profita..."/>\n    <meta property="og:image" content="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1634021238l/59335141._SY475_.jpg"/>\n  <meta property="og:url" content="https://www.goodreads.com/review/list/50196372">\n  <meta property="fb:app_id" content="2415071772"/>\n\n\n\n    <script type="text/javascript"> var ue_t0=window.ue_t0||+new Date();\n </script>\n  <script type="text/javascript">\n    var ue_mid = "A1PQBFHBHS6YH1";\n    var ue_sn = "www.goodreads.com";\n    var ue_furl = "fls-na.amazon.com";\n    var ue_sid = "325-8377389-2702841";\n    var ue_id = "ZP3DRZ7CWM9HKYJZPYAE";\n\n    (function(e){var c=e;var a=c.ue||{};a.main_scope="mainscopecsm";a.q=[];a.t0=c.ue_t0||+new Date();a.d=g;function g(h){return +new Date()-(h?0:a.t0)}function d(h){return function(){a.q.push({n:h,a:arguments,t:a.d()})}}function b(m,l,h,j,i){var k={m:m,f:l,l:h,c:""+j,err:i,fromOnError:1,args:arguments};c.ueLogError(k);return false}b.skipTrace=1;e.onerror=b;function f(){c.uex("ld")}if(e.addEventListener){e.addEventListener("load",f,false)}else{if(e.attachEvent){e.attachEvent("onload",f)}}a.tag=d("tag");a.log=d("log");a.reset=d("rst");c.ue_csm=c;c.ue=a;c.ueLogError=d("err");c.ues=d("ues");c.uet=d("uet");c.uex=d("uex");c.uet("ue")})(window);(function(e,d){var a=e.ue||{};function c(g){if(!g){return}var f=d.head||d.getElementsByTagName("head")[0]||d.documentElement,h=d.createElement("script");h.async="async";h.src=g;f.insertBefore(h,f.firstChild)}function b(){var k=e.ue_cdn||"z-ecx.images-amazon.com",g=e.ue_cdns||"images-na.ssl-images-amazon.com",j="/images/G/01/csminstrumentation/",h=e.ue_file||"ue-full-11e51f253e8ad9d145f4ed644b40f692._V1_.js",f,i;if(h.indexOf("NSTRUMENTATION_FIL")>=0){return}if("ue_https" in e){f=e.ue_https}else{f=e.location&&e.location.protocol=="https:"?1:0}i=f?"https://":"http://";i+=f?g:k;i+=j;i+=h;c(i)}if(!e.ue_inline){if(a.loadUEFull){a.loadUEFull()}else{b()}}a.uels=c;e.ue=a})(window,document);\n\n    if (window.ue && window.ue.tag) { window.ue.tag(\'review:list:signed_out\', ue.main_scope);window.ue.tag(\'review:list:signed_out:desktop\', ue.main_scope); }\n  </script>\n\n  <!-- * Copied from https://info.analytics.a2z.com/#/docs/data_collection/csa/onboard */ -->\n<script>\n  //<![CDATA[\n    !function(){function n(n,t){var r=i(n);return t&&(r=r("instance",t)),r}var r=[],c=0,i=function(t){return function(){var n=c++;return r.push([t,[].slice.call(arguments,0),n,{time:Date.now()}]),i(n)}};n._s=r,this.csa=n}();\n    \n    if (window.csa) {\n      window.csa("Config", {\n        "Application": "GoodreadsMonolith",\n        "Events.SushiEndpoint": "https://unagi.amazon.com/1/events/com.amazon.csm.csa.prod",\n        "Events.Namespace": "csa",\n        "CacheDetection.RequestID": "ZP3DRZ7CWM9HKYJZPYAE",\n        "ObfuscatedMarketplaceId": "A1PQBFHBHS6YH1"\n      });\n    \n      window.csa("Events")("setEntity", {\n        session: { id: "325-8377389-2702841" },\n        page: {requestId: "ZP3DRZ7CWM9HKYJZPYAE", meaningful: "interactive"}\n      });\n    }\n    \n    var e = document.createElement("script"); e.src = "https://m.media-amazon.com/images/I/41mrkPcyPwL.js"; document.head.appendChild(e);\n  //]]>\n</script>\n\n\n          <script type="text/javascript">\n        if (window.Mobvious === undefined) {\n          window.Mobvious = {};\n        }\n        window.Mobvious.device_type = \'desktop\';\n        </script>\n\n\n  \n<script src="https://s.gr-assets.com/assets/webfontloader-f0d95107f593df01d332dddc54e598cb.js"></script>\n<script>\n//<![CDATA[\n\n  WebFont.load({\n    classes: false,\n    custom: {\n      families: ["Lato:n4,n7,i4", "Merriweather:n4,n7,i4"],\n      urls: ["https://s.gr-assets.com/assets/gr/fonts-e256f84093cc13b27f5b82343398031a.css"]\n    }\n  });\n\n//]]>\n</script>\n\n  <link rel="stylesheet" media="all" href="https://s.gr-assets.com/assets/goodreads-a345fa4d3710ed0ac04bd0d4edd6ce96.css" />\n\n    <link rel="stylesheet" media="screen,print" href="https://s.gr-assets.com/assets/review/list-2d5d3ab4a479c6ae62a12a532614cabc.css" />\n  <link rel="stylesheet" media="print" href="https://s.gr-assets.com/assets/review/list_print-69cdc091138f212e543aacc82b58622a.css" />\n\n\n  <link rel="stylesheet" media="screen" href="https://s.gr-assets.com/assets/common_images-f5630939f2056b14f661a80fa8503dca.css" />\n\n  <script src="https://s.gr-assets.com/assets/desktop/libraries-c07ee2e4be9ade4a64546b3ec60b523b.js"></script>\n  <script src="https://s.gr-assets.com/assets/application-55943a2c7db6137eea1ba3fdc8df0621.js"></script>\n\n    <script>\n  //<![CDATA[\n    var gptAdSlots = gptAdSlots || [];\n    var googletag = googletag || {};\n    googletag.cmd = googletag.cmd || [];\n    (function() {\n      var gads = document.createElement("script");\n      gads.async = true;\n      gads.type = "text/javascript";\n      var useSSL = "https:" == document.location.protocol;\n      gads.src = (useSSL ? "https:" : "http:") +\n      "//securepubads.g.doubleclick.net/tag/js/gpt.js";\n      var node = document.getElementsByTagName("script")[0];\n      node.parentNode.insertBefore(gads, node);\n    })();\n    // page settings\n  //]]>\n</script>\n<script>\n  //<![CDATA[\n    googletag.cmd.push(function() {\n      googletag.pubads().setTargeting("sid", "osid.d24f73055ed77ddc82bb5f0c6affdb24");\n    googletag.pubads().setTargeting("grsession", "osid.d24f73055ed77ddc82bb5f0c6affdb24");\n    googletag.pubads().setTargeting("surface", "desktop");\n    googletag.pubads().setTargeting("signedin", "false");\n    googletag.pubads().setTargeting("gr_author", "false");\n    googletag.pubads().setTargeting("author", []);\n    googletag.pubads().setTargeting("shelf", ["topreferencebooks","javascript","realestateinv","history","readnextshortlist","inspiringbutforgotten","informatics","partiallyread","specificreference","gaming","psychology","readinspiring"]);\n    googletag.pubads().setTargeting("tags", ["7110503","9193","7155045","48","2524124","216148","653","3144640","182","207","7196911"]);\n    googletag.pubads().setTargeting("gtargeting", "27x3pd");\n      googletag.pubads().enableAsyncRendering();\n      googletag.pubads().enableSingleRequest();\n      googletag.pubads().collapseEmptyDivs(true);\n      googletag.pubads().disableInitialLoad();\n      googletag.enableServices();\n    });\n  //]]>\n</script>\n<script>\n  //<![CDATA[\n    ! function(a9, a, p, s, t, A, g) {\n      if (a[a9]) return;\n    \n      function q(c, r) {\n        a[a9]._Q.push([c, r])\n      }\n      a[a9] = {\n      init: function() {\n        q("i", arguments)\n      },\n      fetchBids: function() {\n        q("f", arguments)\n      },\n      setDisplayBids: function() {},\n        _Q: []\n      };\n      A = p.createElement(s);\n      A.async = !0;\n      A.src = t;\n      g = p.getElementsByTagName(s)[0];\n      g.parentNode.insertBefore(A, g)\n    }("apstag", window, document, "script", "//c.amazon-adsystem.com/aax2/apstag.js");\n    \n    apstag.init({\n      pubID: \'3211\', adServer: \'googletag\', bidTimeout: 4e3, deals: true, params: { aps_privacy: \'1YN\' }\n    });\n  //]]>\n</script>\n\n\n\n  <meta name="csrf-param" content="authenticity_token" />\n<meta name="csrf-token" content="O3t1Er5VZgdG2ie5gPHm+zoXxBkbo7iZrYt7T9qeXtuO4N97Frohc3flb/YCk9Des7D7zaR7OBQ6o6bGdlsYWg==" />\n\n  <meta name="request-id" content="ZP3DRZ7CWM9HKYJZPYAE" />\n\n    <script src="https://s.gr-assets.com/assets/react_client_side/external_dependencies-2e2b90fafc.js" defer="defer"></script>\n<script src="https://s.gr-assets.com/assets/react_client_side/site_header-d3646670f3.js" defer="defer"></script>\n<script src="https://s.gr-assets.com/assets/react_client_side/custom_react_ujs-b1220d5e0a4820e90b905c302fc5cb52.js" defer="defer"></script>\n\n\n    <script type="text/javascript" charset="utf-8">\n  //<![CDATA[\n    var VIEW = \'table\';\n    var EDITABLE_USER_SHELF_NAME = \'\';\n    var DRAGGABLE_REORDER = false;\n    var VISIBLE_CONTROL = \'null\';\n    var INFINITE_SCROLL = false;\n  //]]>\n  </script>\n  <script src="https://s.gr-assets.com/assets/review/list-848c7ab98d543929c014e94c55e6e268.js"></script>\n\n\n  <link rel="alternate" type="application/atom+xml" title="Bookshelves" href="https://www.goodreads.com/review/list_rss/50196372?shelf=%23ALL%23" />\n  \n  \n\n  <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="Goodreads">\n\n    <meta name="description" content="Javier has 575 books on his all shelf: How to Start a Successful Airbnb Business: Quit Your Day Job and Earn Full-time Income on Autopilot With a Profita...">\n\n\n  <meta content=\'summary\' name=\'twitter:card\'>\n<meta content=\'@goodreads\' name=\'twitter:site\'>\n<meta content=\'Javier’s books on Goodreads (575 books)\' name=\'twitter:title\'>\n<meta content=\'Javier has 575 books on his all shelf: How to Start a Successful Airbnb Business: Quit Your Day Job and Earn Full-time Income on Autopilot With a Profita...\' name=\'twitter:description\'>\n\n\n  <meta name="verify-v1" content="cEf8XOH0pulh1aYQeZ1gkXHsQ3dMPSyIGGYqmF53690=">\n  <meta name="google-site-verification" content="PfFjeZ9OK1RrUrKlmAPn_iZJ_vgHaZO1YQ-QlG2VsJs" />\n  <meta name="apple-itunes-app" content="app-id=355833469">\n</head>\n\n\n<body class="">\n<div data-react-class="ReactComponents.StoresInitializer" data-react-props="{}"><noscript data-reactid=".2ajwmt1m40s" data-react-checksum="-1210183356"></noscript></div>\n\n<script src="https://s.gr-assets.com/assets/fb_dep_form-e2e4a0d9dc062011458143c32b2d789b.js"></script>\n\n<div class="content" id="bodycontainer" style="">\n    <script>\n  //<![CDATA[\n    var initializeGrfb = function() {\n      $grfb.initialize({\n        appId: "2415071772"\n      });\n    };\n    if (typeof $grfb !== "undefined") {\n      initializeGrfb();\n    } else {\n      window.addEventListener("DOMContentLoaded", function() {\n        if (typeof $grfb !== "undefined") {\n          initializeGrfb();\n        }\n      });\n    }\n  //]]>\n</script>\n\n<script>\n  //<![CDATA[\n    function loadScript(url, callback) {\n      var script = document.createElement("script");\n      script.type = "text/javascript";\n    \n      if (script.readyState) {  //Internet Explorer\n          script.onreadystatechange = function() {\n            if (script.readyState == "loaded" ||\n                    script.readyState == "complete") {\n              script.onreadystatechange = null;\n              callback();\n            }\n          };\n      } else {  //Other browsers\n        script.onload = function() {\n          callback();\n        };\n      }\n    \n      script.src = url;\n      document.getElementsByTagName("head")[0].appendChild(script);\n    }\n    \n    function initAppleId() {\n      AppleID.auth.init({\n        clientId : \'com.goodreads.app\', \n        scope : \'name email\',\n        redirectURI: \'https://www.goodreads.com/apple_users/sign_in_with_apple_web\',\n        state: \'apple_oauth_state_3ee6f979-8a4b-47e1-871a-5b58bbb6bc93\'\n      });\n    }\n    \n    var initializeSiwa = function() {\n      var APPLE_SIGN_IN_JS_URL =  "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"\n      loadScript(APPLE_SIGN_IN_JS_URL, initAppleId);\n    };\n    if (typeof AppleID !== "undefined") {\n      initAppleId();\n    } else {\n      initializeSiwa();\n    }\n  //]]>\n</script>\n\n<div class=\'siteHeader\'>\n<div data-react-class="ReactComponents.HeaderStoreConnector" data-react-props="{&quot;myBooksUrl&quot;:&quot;/review/list?ref=nav_mybooks&quot;,&quot;browseUrl&quot;:&quot;/book?ref=nav_brws&quot;,&quot;recommendationsUrl&quot;:&quot;/recommendations?ref=nav_brws_recs&quot;,&quot;choiceAwardsUrl&quot;:&quot;/choiceawards?ref=nav_brws_gca&quot;,&quot;genresIndexUrl&quot;:&quot;/genres?ref=nav_brws_genres&quot;,&quot;giveawayUrl&quot;:&quot;/giveaway?ref=nav_brws_giveaways&quot;,&quot;exploreUrl&quot;:&quot;/book?ref=nav_brws_explore&quot;,&quot;homeUrl&quot;:&quot;/?ref=nav_home&quot;,&quot;listUrl&quot;:&quot;/list?ref=nav_brws_lists&quot;,&quot;newsUrl&quot;:&quot;/news?ref=nav_brws_news&quot;,&quot;communityUrl&quot;:&quot;/group?ref=nav_comm&quot;,&quot;groupsUrl&quot;:&quot;/group?ref=nav_comm_groups&quot;,&quot;quotesUrl&quot;:&quot;/quotes?ref=nav_comm_quotes&quot;,&quot;featuredAskAuthorUrl&quot;:&quot;/ask_the_author?ref=nav_comm_askauthor&quot;,&quot;autocompleteUrl&quot;:&quot;/book/auto_complete&quot;,&quot;defaultLogoActionUrl&quot;:&quot;/&quot;,&quot;topFullImage&quot;:{&quot;clickthroughUrl&quot;:&quot;https://www.goodreads.com/blog/show/2783-readers-most-anticipated-books-of-fall?ref=BigBooksFall24_eb&quot;,&quot;altText&quot;:&quot;Readers&#39; Most Anticipated Fall Books&quot;,&quot;backgroundColor&quot;:&quot;#E18B79&quot;,&quot;xs&quot;:{&quot;1x&quot;:&quot;https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/siteheaderbannerimages/1722529902i/427.jpg&quot;,&quot;2x&quot;:&quot;https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/siteheaderbannerimages/1722529908i/428.jpg&quot;},&quot;md&quot;:{&quot;1x&quot;:&quot;https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/siteheaderbannerimages/1722529892i/425.jpg&quot;,&quot;2x&quot;:&quot;https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/siteheaderbannerimages/1722529897i/426.jpg&quot;}},&quot;logo&quot;:{&quot;clickthroughUrl&quot;:&quot;/&quot;,&quot;altText&quot;:&quot;Goodreads Home&quot;},&quot;searchPath&quot;:&quot;/search&quot;,&quot;newReleasesUrl&quot;:&quot;/book/popular_by_date/2024/9?ref=nav_brws_newrels&quot;,&quot;signInUrl&quot;:&quot;/user/sign_in&quot;,&quot;signUpUrl&quot;:&quot;/user/sign_up&quot;,&quot;signInWithReturnUrl&quot;:true,&quot;deployServices&quot;:[],&quot;defaultLogoAltText&quot;:&quot;Goodreads Home&quot;,&quot;mobviousDeviceType&quot;:&quot;desktop&quot;}"><header data-reactid=".1mmafg21dwa" data-react-checksum="387518654"><div class="siteHeader__topFullImageContainer" style="background-color:#E18B79;" data-reactid=".1mmafg21dwa.0"><a class="siteHeader__topFullImageLink" href="https://www.goodreads.com/blog/show/2783-readers-most-anticipated-books-of-fall?ref=BigBooksFall24_eb" data-reactid=".1mmafg21dwa.0.0"><picture data-reactid=".1mmafg21dwa.0.0.0"><source media="(min-width: 768px)" srcset="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/siteheaderbannerimages/1722529892i/425.jpg 1x, https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/siteheaderbannerimages/1722529897i/426.jpg 2x" data-reactid=".1mmafg21dwa.0.0.0.0"/><img alt="Readers&#x27; Most Anticipated Fall Books" class="siteHeader__topFullImage" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/siteheaderbannerimages/1722529902i/427.jpg" srcset="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/siteheaderbannerimages/1722529908i/428.jpg 2x" data-reactid=".1mmafg21dwa.0.0.0.1"/></picture></a></div><div class="siteHeader__topLine gr-box gr-box--withShadow" data-reactid=".1mmafg21dwa.1"><div class="siteHeader__contents" data-reactid=".1mmafg21dwa.1.0"><div class="siteHeader__topLevelItem siteHeader__topLevelItem--searchIcon" data-reactid=".1mmafg21dwa.1.0.0"><button class="siteHeader__searchIcon gr-iconButton" aria-label="Toggle search" type="button" data-ux-click="true" data-reactid=".1mmafg21dwa.1.0.0.0"></button></div><a href="/" class="siteHeader__logo" aria-label="Goodreads Home" title="Goodreads Home" data-reactid=".1mmafg21dwa.1.0.1"></a><nav class="siteHeader__primaryNavInline" data-reactid=".1mmafg21dwa.1.0.2"><ul role="menu" class="siteHeader__menuList" data-reactid=".1mmafg21dwa.1.0.2.0"><li class="siteHeader__topLevelItem siteHeader__topLevelItem--home" data-reactid=".1mmafg21dwa.1.0.2.0.0"><a href="/?ref=nav_home" class="siteHeader__topLevelLink" data-reactid=".1mmafg21dwa.1.0.2.0.0.0">Home</a></li><li class="siteHeader__topLevelItem" data-reactid=".1mmafg21dwa.1.0.2.0.1"><a href="/review/list?ref=nav_mybooks" class="siteHeader__topLevelLink" data-reactid=".1mmafg21dwa.1.0.2.0.1.0">My Books</a></li><li class="siteHeader__topLevelItem" data-reactid=".1mmafg21dwa.1.0.2.0.2"><div class="primaryNavMenu primaryNavMenu--siteHeaderBrowseMenu ignore-react-onclickoutside" data-reactid=".1mmafg21dwa.1.0.2.0.2.0"><a class="primaryNavMenu__trigger primaryNavMenu__trigger--siteHeaderBrowseMenu" href="/book?ref=nav_brws" role="button" aria-haspopup="true" aria-expanded="false" data-ux-click="true" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.0"><span data-reactid=".1mmafg21dwa.1.0.2.0.2.0.0.0">Browse ▾</span></a><div class="primaryNavMenu__menu gr-box gr-box--withShadowLarge wide" role="menu" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1"><div class="siteHeader__browseMenuDropdown" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0"><ul class="siteHeader__subNav" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.0"><li role="menuitem Recommendations" class="menuLink" aria-label="Recommendations" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.0.0"><a href="/recommendations?ref=nav_brws_recs" class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.0.0.0">Recommendations</a></li><li role="menuitem Choice Awards" class="menuLink" aria-label="Choice Awards" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.0.1"><a href="/choiceawards?ref=nav_brws_gca" class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.0.1.0">Choice Awards</a></li><li role="menuitem Genres" class="menuLink" aria-label="Genres" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.0.2"><a href="/genres?ref=nav_brws_genres" class="siteHeader__subNavLink siteHeader__subNavLink--genresIndex" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.0.2.0">Genres</a></li><li role="menuitem Giveaways" class="menuLink" aria-label="Giveaways" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.0.3"><a href="/giveaway?ref=nav_brws_giveaways" class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.0.3.0">Giveaways</a></li><li role="menuitem New Releases" class="menuLink" aria-label="New Releases" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.0.4"><a href="/book/popular_by_date/2024/9?ref=nav_brws_newrels" class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.0.4.0">New Releases</a></li><li role="menuitem Lists" class="menuLink" aria-label="Lists" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.0.5"><a href="/list?ref=nav_brws_lists" class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.0.5.0">Lists</a></li><li role="menuitem Explore" class="menuLink" aria-label="Explore" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.0.6"><a href="/book?ref=nav_brws_explore" class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.0.6.0">Explore</a></li><li role="menuitem News &amp; Interviews" class="menuLink" aria-label="News &amp; Interviews" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.0.7"><a href="/news?ref=nav_brws_news" class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.0.7.0">News &amp; Interviews</a></li></ul><div class="siteHeader__spotlight siteHeader__spotlight--withoutSubMenu" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1"><div class="genreListContainer" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0"><div class="siteHeader__heading siteHeader__title" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.0">Genres</div><ul class="genreList" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList0"><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList0.0:$Art"><a href="/genres/art" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList0.0:$Art.0">Art</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList0.0:$Biography"><a href="/genres/biography" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList0.0:$Biography.0">Biography</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList0.0:$Business"><a href="/genres/business" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList0.0:$Business.0">Business</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList0.0:$Children&#x27;s"><a href="/genres/children-s" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList0.0:$Children&#x27;s.0">Children&#x27;s</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList0.0:$Christian"><a href="/genres/christian" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList0.0:$Christian.0">Christian</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList0.0:$Classics"><a href="/genres/classics" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList0.0:$Classics.0">Classics</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList0.0:$Comics"><a href="/genres/comics" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList0.0:$Comics.0">Comics</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList0.0:$Cookbooks"><a href="/genres/cookbooks" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList0.0:$Cookbooks.0">Cookbooks</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList0.0:$Ebooks"><a href="/genres/ebooks" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList0.0:$Ebooks.0">Ebooks</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList0.0:$Fantasy"><a href="/genres/fantasy" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList0.0:$Fantasy.0">Fantasy</a></li></ul><ul class="genreList" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList1"><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList1.0:$Fiction"><a href="/genres/fiction" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList1.0:$Fiction.0">Fiction</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList1.0:$Graphic Novels"><a href="/genres/graphic-novels" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList1.0:$Graphic Novels.0">Graphic Novels</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList1.0:$Historical Fiction"><a href="/genres/historical-fiction" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList1.0:$Historical Fiction.0">Historical Fiction</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList1.0:$History"><a href="/genres/history" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList1.0:$History.0">History</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList1.0:$Horror"><a href="/genres/horror" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList1.0:$Horror.0">Horror</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList1.0:$Memoir"><a href="/genres/memoir" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList1.0:$Memoir.0">Memoir</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList1.0:$Music"><a href="/genres/music" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList1.0:$Music.0">Music</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList1.0:$Mystery"><a href="/genres/mystery" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList1.0:$Mystery.0">Mystery</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList1.0:$Nonfiction"><a href="/genres/non-fiction" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList1.0:$Nonfiction.0">Nonfiction</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList1.0:$Poetry"><a href="/genres/poetry" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList1.0:$Poetry.0">Poetry</a></li></ul><ul class="genreList" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList2"><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList2.0:$Psychology"><a href="/genres/psychology" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList2.0:$Psychology.0">Psychology</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList2.0:$Romance"><a href="/genres/romance" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList2.0:$Romance.0">Romance</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList2.0:$Science"><a href="/genres/science" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList2.0:$Science.0">Science</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList2.0:$Science Fiction"><a href="/genres/science-fiction" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList2.0:$Science Fiction.0">Science Fiction</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList2.0:$Self Help"><a href="/genres/self-help" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList2.0:$Self Help.0">Self Help</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList2.0:$Sports"><a href="/genres/sports" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList2.0:$Sports.0">Sports</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList2.0:$Thriller"><a href="/genres/thriller" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList2.0:$Thriller.0">Thriller</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList2.0:$Travel"><a href="/genres/travel" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList2.0:$Travel.0">Travel</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList2.0:$Young Adult"><a href="/genres/young-adult" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList2.0:$Young Adult.0">Young Adult</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList2.1"><a href="/genres" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.2.0.2.0.1.0.1.0.1:$genreList2.1.0">More Genres</a></li></ul></div></div></div></div></div></li><li class="siteHeader__topLevelItem siteHeader__topLevelItem--community" data-reactid=".1mmafg21dwa.1.0.2.0.3"><div class="primaryNavMenu ignore-react-onclickoutside" data-reactid=".1mmafg21dwa.1.0.2.0.3.0"><a class="primaryNavMenu__trigger" href="/group?ref=nav_comm" role="button" aria-haspopup="true" aria-expanded="false" data-ux-click="true" data-reactid=".1mmafg21dwa.1.0.2.0.3.0.0"><span data-reactid=".1mmafg21dwa.1.0.2.0.3.0.0.0">Community ▾</span></a><div class="primaryNavMenu__menu gr-box gr-box--withShadowLarge" role="menu" data-reactid=".1mmafg21dwa.1.0.2.0.3.0.1"><ul class="siteHeader__subNav" data-reactid=".1mmafg21dwa.1.0.2.0.3.0.1.0"><li role="menuitem Groups" class="menuLink" aria-label="Groups" data-reactid=".1mmafg21dwa.1.0.2.0.3.0.1.0.0"><a href="/group?ref=nav_comm_groups" class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.1.0.2.0.3.0.1.0.0.0">Groups</a></li><li role="menuitem Quotes" class="menuLink" aria-label="Quotes" data-reactid=".1mmafg21dwa.1.0.2.0.3.0.1.0.2"><a href="/quotes?ref=nav_comm_quotes" class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.1.0.2.0.3.0.1.0.2.0">Quotes</a></li><li role="menuitem Ask the Author" class="menuLink" aria-label="Ask the Author" data-reactid=".1mmafg21dwa.1.0.2.0.3.0.1.0.3"><a href="/ask_the_author?ref=nav_comm_askauthor" class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.1.0.2.0.3.0.1.0.3.0">Ask the Author</a></li></ul></div></div></li></ul></nav><div accept-charset="UTF-8" class="searchBox searchBox--navbar" data-reactid=".1mmafg21dwa.1.0.3"><form autocomplete="off" action="/search" class="searchBox__form" role="search" aria-label="Search for books to add to your shelves" data-reactid=".1mmafg21dwa.1.0.3.0"><input class="searchBox__input searchBox__input--navbar" autocomplete="off" name="q" type="text" placeholder="Search books" aria-label="Search books" aria-controls="searchResults" data-reactid=".1mmafg21dwa.1.0.3.0.0"/><input type="hidden" name="qid" value="" data-reactid=".1mmafg21dwa.1.0.3.0.1"/><button type="submit" class="searchBox__icon--magnifyingGlass gr-iconButton searchBox__icon searchBox__icon--navbar" aria-label="Search" data-reactid=".1mmafg21dwa.1.0.3.0.2"></button></form></div><ul class="siteHeader__personal" data-reactid=".1mmafg21dwa.1.0.4"><li class="siteHeader__topLevelItem siteHeader__topLevelItem--signedOut" data-reactid=".1mmafg21dwa.1.0.4.0"><a href="/user/sign_in?returnurl=undefined" rel="nofollow" class="siteHeader__topLevelLink" data-reactid=".1mmafg21dwa.1.0.4.0.0">Sign In</a></li><li class="siteHeader__topLevelItem siteHeader__topLevelItem--signedOut" data-reactid=".1mmafg21dwa.1.0.4.1"><a href="/user/sign_up" rel="nofollow" class="siteHeader__topLevelLink" data-reactid=".1mmafg21dwa.1.0.4.1.0">Join</a></li></ul><div class="siteHeader__topLevelItem siteHeader__topLevelItem--signUp" data-reactid=".1mmafg21dwa.1.0.5"><a href="/user/sign_up" class="gr-button gr-button--dark" rel="nofollow" data-reactid=".1mmafg21dwa.1.0.5.0">Sign up</a></div><div class="modal modal--overlay modal--drawer" tabindex="0" data-reactid=".1mmafg21dwa.1.0.7"><div data-reactid=".1mmafg21dwa.1.0.7.0"><div class="modal__close" data-reactid=".1mmafg21dwa.1.0.7.0.0"><button type="button" class="gr-iconButton" data-reactid=".1mmafg21dwa.1.0.7.0.0.0"><img alt="Dismiss" src="//s.gr-assets.com/assets/gr/icons/icon_close_white-dbf4152deeef5bd3915d5d12210bf05f.svg" data-reactid=".1mmafg21dwa.1.0.7.0.0.0.0"/></button></div><div class="modal__content" data-reactid=".1mmafg21dwa.1.0.7.0.1"><div class="personalNavDrawer" data-reactid=".1mmafg21dwa.1.0.7.0.1.0"><div class="personalNavDrawer__personalNavContainer" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.0"><noscript data-reactid=".1mmafg21dwa.1.0.7.0.1.0.0.0"></noscript></div><div class="personalNavDrawer__profileAndLinksContainer" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1"><div class="personalNavDrawer__profileContainer gr-mediaFlexbox gr-mediaFlexbox--alignItemsCenter" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.0"><div class="gr-mediaFlexbox__media" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.0.0"><img class="circularIcon circularIcon--large circularIcon--border" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.0.0.0"/></div><div class="gr-mediaFlexbox__desc" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.0.1"><a class="gr-hyperlink gr-hyperlink--bold" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.0.1.0"></a><div class="u-displayBlock" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.0.1.1"><a class="gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.0.1.1.0">View profile</a></div></div></div><div class="personalNavDrawer__profileMenuContainer" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1"><ul data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0"><li role="menuitem Profile" class="menuLink" aria-label="Profile" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.0"><span data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.0.0"><a class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.0.0.0">Profile</a></span></li><li role="menuitem Friends" class="menuLink" aria-label="Friends" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.3"><a class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.3.0">Friends</a></li><li role="menuitem Groups" class="menuLink" aria-label="Groups" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.4"><span data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.4.0"><a class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.4.0.0"><span data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.4.0.0.0">Groups</span></a></span></li><li role="menuitem Discussions" class="menuLink" aria-label="Discussions" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.5"><a class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.5.0">Discussions</a></li><li role="menuitem Comments" class="menuLink" aria-label="Comments" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.6"><a class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.6.0">Comments</a></li><li role="menuitem Reading Challenge" class="menuLink" aria-label="Reading Challenge" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.7"><a class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.7.0">Reading Challenge</a></li><li role="menuitem Kindle Notes &amp; Highlights" class="menuLink" aria-label="Kindle Notes &amp; Highlights" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.8"><a class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.8.0">Kindle Notes &amp; Highlights</a></li><li role="menuitem Quotes" class="menuLink" aria-label="Quotes" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.9"><a class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.9.0">Quotes</a></li><li role="menuitem Favorite genres" class="menuLink" aria-label="Favorite genres" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.a"><a class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.a.0">Favorite genres</a></li><li role="menuitem Friends&#x27; recommendations" class="menuLink" aria-label="Friends&#x27; recommendations" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.b"><span data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.b.0"><a class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.b.0.0"><span data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.b.0.0.0">Friends’ recommendations</span></a></span></li><li role="menuitem Account settings" class="menuLink" aria-label="Account settings" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.c"><a class="siteHeader__subNavLink u-topGrayBorder" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.c.0">Account settings</a></li><li role="menuitem Help" class="menuLink" aria-label="Help" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.d"><a class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.d.0">Help</a></li><li role="menuitem Sign out" class="menuLink" aria-label="Sign out" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.e"><a class="siteHeader__subNavLink" data-method="POST" data-reactid=".1mmafg21dwa.1.0.7.0.1.0.1.1.0.e.0">Sign out</a></li></ul></div></div></div></div></div></div></div></div><div class="headroom-wrapper" data-reactid=".1mmafg21dwa.2"><div style="position:relative;top:0;left:0;right:0;z-index:1;-webkit-transform:translateY(0);-ms-transform:translateY(0);transform:translateY(0);" class="headroom headroom--unfixed" data-reactid=".1mmafg21dwa.2.0"><nav class="siteHeader__primaryNavSeparateLine gr-box gr-box--withShadow" data-reactid=".1mmafg21dwa.2.0.0"><ul role="menu" class="siteHeader__menuList" data-reactid=".1mmafg21dwa.2.0.0.0"><li class="siteHeader__topLevelItem siteHeader__topLevelItem--home" data-reactid=".1mmafg21dwa.2.0.0.0.0"><a href="/?ref=nav_home" class="siteHeader__topLevelLink" data-reactid=".1mmafg21dwa.2.0.0.0.0.0">Home</a></li><li class="siteHeader__topLevelItem" data-reactid=".1mmafg21dwa.2.0.0.0.1"><a href="/review/list?ref=nav_mybooks" class="siteHeader__topLevelLink" data-reactid=".1mmafg21dwa.2.0.0.0.1.0">My Books</a></li><li class="siteHeader__topLevelItem" data-reactid=".1mmafg21dwa.2.0.0.0.2"><div class="primaryNavMenu primaryNavMenu--siteHeaderBrowseMenu ignore-react-onclickoutside" data-reactid=".1mmafg21dwa.2.0.0.0.2.0"><a class="primaryNavMenu__trigger primaryNavMenu__trigger--siteHeaderBrowseMenu" href="/book?ref=nav_brws" role="button" aria-haspopup="true" aria-expanded="false" data-ux-click="true" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.0"><span data-reactid=".1mmafg21dwa.2.0.0.0.2.0.0.0">Browse ▾</span></a><div class="primaryNavMenu__menu gr-box gr-box--withShadowLarge wide" role="menu" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1"><div class="siteHeader__browseMenuDropdown" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0"><ul class="siteHeader__subNav" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.0"><li role="menuitem Recommendations" class="menuLink" aria-label="Recommendations" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.0.0"><a href="/recommendations?ref=nav_brws_recs" class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.0.0.0">Recommendations</a></li><li role="menuitem Choice Awards" class="menuLink" aria-label="Choice Awards" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.0.1"><a href="/choiceawards?ref=nav_brws_gca" class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.0.1.0">Choice Awards</a></li><li role="menuitem Genres" class="menuLink" aria-label="Genres" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.0.2"><a href="/genres?ref=nav_brws_genres" class="siteHeader__subNavLink siteHeader__subNavLink--genresIndex" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.0.2.0">Genres</a></li><li role="menuitem Giveaways" class="menuLink" aria-label="Giveaways" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.0.3"><a href="/giveaway?ref=nav_brws_giveaways" class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.0.3.0">Giveaways</a></li><li role="menuitem New Releases" class="menuLink" aria-label="New Releases" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.0.4"><a href="/book/popular_by_date/2024/9?ref=nav_brws_newrels" class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.0.4.0">New Releases</a></li><li role="menuitem Lists" class="menuLink" aria-label="Lists" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.0.5"><a href="/list?ref=nav_brws_lists" class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.0.5.0">Lists</a></li><li role="menuitem Explore" class="menuLink" aria-label="Explore" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.0.6"><a href="/book?ref=nav_brws_explore" class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.0.6.0">Explore</a></li><li role="menuitem News &amp; Interviews" class="menuLink" aria-label="News &amp; Interviews" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.0.7"><a href="/news?ref=nav_brws_news" class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.0.7.0">News &amp; Interviews</a></li></ul><div class="siteHeader__spotlight siteHeader__spotlight--withoutSubMenu" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1"><div class="genreListContainer" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0"><div class="siteHeader__heading siteHeader__title" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.0">Genres</div><ul class="genreList" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList0"><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList0.0:$Art"><a href="/genres/art" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList0.0:$Art.0">Art</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList0.0:$Biography"><a href="/genres/biography" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList0.0:$Biography.0">Biography</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList0.0:$Business"><a href="/genres/business" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList0.0:$Business.0">Business</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList0.0:$Children&#x27;s"><a href="/genres/children-s" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList0.0:$Children&#x27;s.0">Children&#x27;s</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList0.0:$Christian"><a href="/genres/christian" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList0.0:$Christian.0">Christian</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList0.0:$Classics"><a href="/genres/classics" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList0.0:$Classics.0">Classics</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList0.0:$Comics"><a href="/genres/comics" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList0.0:$Comics.0">Comics</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList0.0:$Cookbooks"><a href="/genres/cookbooks" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList0.0:$Cookbooks.0">Cookbooks</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList0.0:$Ebooks"><a href="/genres/ebooks" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList0.0:$Ebooks.0">Ebooks</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList0.0:$Fantasy"><a href="/genres/fantasy" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList0.0:$Fantasy.0">Fantasy</a></li></ul><ul class="genreList" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList1"><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList1.0:$Fiction"><a href="/genres/fiction" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList1.0:$Fiction.0">Fiction</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList1.0:$Graphic Novels"><a href="/genres/graphic-novels" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList1.0:$Graphic Novels.0">Graphic Novels</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList1.0:$Historical Fiction"><a href="/genres/historical-fiction" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList1.0:$Historical Fiction.0">Historical Fiction</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList1.0:$History"><a href="/genres/history" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList1.0:$History.0">History</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList1.0:$Horror"><a href="/genres/horror" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList1.0:$Horror.0">Horror</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList1.0:$Memoir"><a href="/genres/memoir" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList1.0:$Memoir.0">Memoir</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList1.0:$Music"><a href="/genres/music" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList1.0:$Music.0">Music</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList1.0:$Mystery"><a href="/genres/mystery" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList1.0:$Mystery.0">Mystery</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList1.0:$Nonfiction"><a href="/genres/non-fiction" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList1.0:$Nonfiction.0">Nonfiction</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList1.0:$Poetry"><a href="/genres/poetry" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList1.0:$Poetry.0">Poetry</a></li></ul><ul class="genreList" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList2"><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList2.0:$Psychology"><a href="/genres/psychology" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList2.0:$Psychology.0">Psychology</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList2.0:$Romance"><a href="/genres/romance" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList2.0:$Romance.0">Romance</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList2.0:$Science"><a href="/genres/science" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList2.0:$Science.0">Science</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList2.0:$Science Fiction"><a href="/genres/science-fiction" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList2.0:$Science Fiction.0">Science Fiction</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList2.0:$Self Help"><a href="/genres/self-help" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList2.0:$Self Help.0">Self Help</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList2.0:$Sports"><a href="/genres/sports" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList2.0:$Sports.0">Sports</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList2.0:$Thriller"><a href="/genres/thriller" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList2.0:$Thriller.0">Thriller</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList2.0:$Travel"><a href="/genres/travel" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList2.0:$Travel.0">Travel</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList2.0:$Young Adult"><a href="/genres/young-adult" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList2.0:$Young Adult.0">Young Adult</a></li><li role="menuitem" class="genreList__genre" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList2.1"><a href="/genres" class="genreList__genreLink gr-hyperlink gr-hyperlink--naked" data-reactid=".1mmafg21dwa.2.0.0.0.2.0.1.0.1.0.1:$genreList2.1.0">More Genres</a></li></ul></div></div></div></div></div></li><li class="siteHeader__topLevelItem siteHeader__topLevelItem--community" data-reactid=".1mmafg21dwa.2.0.0.0.3"><div class="primaryNavMenu ignore-react-onclickoutside" data-reactid=".1mmafg21dwa.2.0.0.0.3.0"><a class="primaryNavMenu__trigger" href="/group?ref=nav_comm" role="button" aria-haspopup="true" aria-expanded="false" data-ux-click="true" data-reactid=".1mmafg21dwa.2.0.0.0.3.0.0"><span data-reactid=".1mmafg21dwa.2.0.0.0.3.0.0.0">Community ▾</span></a><div class="primaryNavMenu__menu gr-box gr-box--withShadowLarge" role="menu" data-reactid=".1mmafg21dwa.2.0.0.0.3.0.1"><ul class="siteHeader__subNav" data-reactid=".1mmafg21dwa.2.0.0.0.3.0.1.0"><li role="menuitem Groups" class="menuLink" aria-label="Groups" data-reactid=".1mmafg21dwa.2.0.0.0.3.0.1.0.0"><a href="/group?ref=nav_comm_groups" class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.2.0.0.0.3.0.1.0.0.0">Groups</a></li><li role="menuitem Quotes" class="menuLink" aria-label="Quotes" data-reactid=".1mmafg21dwa.2.0.0.0.3.0.1.0.2"><a href="/quotes?ref=nav_comm_quotes" class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.2.0.0.0.3.0.1.0.2.0">Quotes</a></li><li role="menuitem Ask the Author" class="menuLink" aria-label="Ask the Author" data-reactid=".1mmafg21dwa.2.0.0.0.3.0.1.0.3"><a href="/ask_the_author?ref=nav_comm_askauthor" class="siteHeader__subNavLink" data-reactid=".1mmafg21dwa.2.0.0.0.3.0.1.0.3.0">Ask the Author</a></li></ul></div></div></li></ul></nav></div></div></header></div>\n</div>\n<div class=\'siteHeaderBottomSpacer\'></div>\n\n  \n\n  <div class="mainContentContainer ">\n\n\n      \n\n    <div class="mainContent ">\n      \n      <div class="mainContentFloat ">\n\n        <div id="flashContainer">\n\n\n\n\n</div>\n\n        \n\n\n\n\n<div id="leadercol">\n  <div id="review_list_error_message" class="review_list_error_message" style="display: none;">\n  </div>\n  <div id="header" style="float: left">\n    <h1>\n          <a href="/user/show/50196372-javier"><img alt="Javier&#39;s icon" class="userImage" src="https://images.gr-assets.com/users/1653922866p1/50196372.jpg" /></a>\n        <a href="/user/show/50196372-javier">Javier</a>\n        &gt;\n        <a href="/review/list/50196372-javier?page=1">Books</a>\n    </h1>\n  </div>\n\n  <div id="controls" class="uitext right">\n    <span class="controlGroup uitext">\n        <span class="bookMeta">\n          <div class=\'myBooksSearch\'>\n<form id="myBooksSearchForm" class="inlineblock" action="/review/list/50196372-javier" accept-charset="UTF-8" method="get"><input name="utf8" type="hidden" value="&#x2713;" /><input id="sitesearch_field" size="22" class="smallText" placeholder="Search and add books" type="text" name="search[query]" />\n</form>\n<a class="myBooksSearchButton" href="#" onclick="$j(&#39;#myBooksSearchForm&#39;).submit(); return false;"><img title="my books search" alt="search" src="https://s.gr-assets.com/assets/layout/magnifying_glass-a2d7514d50bcee1a0061f1ece7821750.png" /></a>\n</div>\n\n          <div class=\'myBooksNav\'>\n<ul>\n<li>\n<a class="actionLinkLite controlLink" href="/user/compare/50196372">Compare Books</a>\n</li>\n<li>\n<a id="shelfSettingsLink" class="actionLinkLite controlLink" href="#" onclick="toggleControl(this); return false;">Settings</a>\n</li>\n<li>\n<a class="actionLinkLite controlLink" href="/review/stats/50196372">Stats</a>\n</li>\n<li>\n<a class="actionLinkLite controlLink" target="_blank" rel="noopener noreferrer" href="/review/list/50196372-javier?print=true">Print</a>\n</li>\n<li>\n<span class="greyText">&nbsp;|&nbsp;</span>\n</li>\n<li>\n<a class="listViewIcon selected" href="/review/list/50196372-javier?view=table"><img title="table view" alt="table view" src="https://s.gr-assets.com/assets/layout/list-fe412c89a6a612c841b5b58681660b82.png" /></a>\n</li>\n<li>\n<a class="gridViewIcon " href="/review/list/50196372-javier?view=covers"><img title="cover view" alt="cover view" src="https://s.gr-assets.com/assets/layout/grid-2c030bffe1065f73ddca41540e8a267d.png" /></a>\n</li>\n</ul>\n</div>\n\n        </span>\n    </span>\n  </div>\n  <div class="clear"></div>\n</div>\n\n<div id="columnContainer" class="myBooksPage">\n    <div id="leftCol" class="col reviewListLeft">\n      <div id="sidewrapper">\n        <div id="side">\n          <div id="shelvesSection">\n            <div class="sectionHeader">\n              Bookshelves \n            </div>\n            <a class="selectedShelf" href="/review/list/50196372?shelf=%23ALL%23">All (630)</a>\n            <div id="paginatedShelfList" class="stacked">\n                <div class="userShelf">\n    <a title="Javier&#39;s Read shelf" class="actionLinkLite" href="/review/list/50196372-javier?shelf=read">Read  &lrm;(34)</a>\n  </div>\n  <div class="userShelf">\n    <a title="Javier&#39;s Currently Reading shelf" class="actionLinkLite" href="/review/list/50196372-javier?shelf=currently-reading">Currently Reading  &lrm;(5)</a>\n  </div>\n  <div class="userShelf">\n    <a title="Javier&#39;s Want to Read shelf" class="actionLinkLite" href="/review/list/50196372-javier?shelf=to-read">Want to Read  &lrm;(408)</a>\n  </div>\n  <div class="userShelf">\n    <a title="Javier&#39;s missclick shelf" class="actionLinkLite" href="/review/list/50196372-javier?shelf=missclick">missclick  &lrm;(95)</a>\n  </div>\n  <div class="userShelf">\n    <a title="Javier&#39;s read-inspiring shelf" class="actionLinkLite" href="/review/list/50196372-javier?shelf=read-inspiring">read-inspiring  &lrm;(20)</a>\n  </div>\n  <div class="userShelf">\n    <a title="Javier&#39;s want-to-read-shortlist shelf" class="actionLinkLite longShelf" href="/review/list/50196372-javier?shelf=want-to-read-shortlist">want-to-read-shortlist  &lrm;(13)</a>\n  </div>\n    <div class="horizontalGreyDivider"></div>\n  <div class="userShelf">\n    <a title="Javier&#39;s top-reference-books shelf" class="actionLinkLite" href="/review/list/50196372-javier?shelf=top-reference-books">*top-reference-books  &lrm;(49)</a>\n  </div>\n  <div class="userShelf">\n    <a title="Javier&#39;s financial-investing shelf" class="actionLinkLite" href="/review/list/50196372-javier?shelf=financial-investing">financial-investing  &lrm;(46)</a>\n  </div>\n  <div class="userShelf">\n    <a title="Javier&#39;s gaming shelf" class="actionLinkLite" href="/review/list/50196372-javier?shelf=gaming">gaming  &lrm;(17)</a>\n  </div>\n  <div class="userShelf">\n    <a title="Javier&#39;s history shelf" class="actionLinkLite" href="/review/list/50196372-javier?shelf=history">history  &lrm;(22)</a>\n  </div>\n  <div class="userShelf">\n    <a title="Javier&#39;s informatics shelf" class="actionLinkLite" href="/review/list/50196372-javier?shelf=informatics">informatics  &lrm;(46)</a>\n  </div>\n  <div class="userShelf">\n    <a title="Javier&#39;s inspiring-but-forgotten shelf" class="actionLinkLite longShelf" href="/review/list/50196372-javier?shelf=inspiring-but-forgotten">inspiring-but-forgotten  &lrm;(6)</a>\n  </div>\n  <div class="userShelf">\n    <a title="Javier&#39;s javascript shelf" class="actionLinkLite" href="/review/list/50196372-javier?shelf=javascript">javascript  &lrm;(49)</a>\n  </div>\n  <div class="userShelf">\n    <a title="Javier&#39;s not-available shelf" class="actionLinkLite" href="/review/list/50196372-javier?shelf=not-available">not-available  &lrm;(0)</a>\n  </div>\n  <div class="userShelf">\n    <a title="Javier&#39;s novels shelf" class="actionLinkLite" href="/review/list/50196372-javier?shelf=novels">novels  &lrm;(69)</a>\n  </div>\n  <div class="userShelf">\n    <a title="Javier&#39;s partially-read shelf" class="actionLinkLite" href="/review/list/50196372-javier?shelf=partially-read">partially-read  &lrm;(3)</a>\n  </div>\n  <div class="userShelf">\n    <a title="Javier&#39;s psychology shelf" class="actionLinkLite" href="/review/list/50196372-javier?shelf=psychology">psychology  &lrm;(37)</a>\n  </div>\n  <div class="userShelf">\n    <a title="Javier&#39;s read-inspiring-shelf shelf" class="actionLinkLite" href="/review/list/50196372-javier?shelf=read-inspiring-shelf">read-inspiring-shelf  &lrm;(19)</a>\n  </div>\n  <div class="userShelf">\n    <a title="Javier&#39;s read-next-shortlist shelf" class="actionLinkLite" href="/review/list/50196372-javier?shelf=read-next-shortlist">read-next-shortlist  &lrm;(0)</a>\n  </div>\n  <div class="userShelf">\n    <a title="Javier&#39;s readinspiring shelf" class="actionLinkLite" href="/review/list/50196372-javier?shelf=readinspiring">readinspiring  &lrm;(0)</a>\n  </div>\n  <div class="userShelf">\n    <a title="Javier&#39;s real-estate-inv shelf" class="actionLinkLite" href="/review/list/50196372-javier?shelf=real-estate-inv">real-estate-inv  &lrm;(26)</a>\n  </div>\n  <div class="userShelf">\n    <a title="Javier&#39;s sonata shelf" class="actionLinkLite" href="/review/list/50196372-javier?shelf=sonata">sonata  &lrm;(2)</a>\n  </div>\n  <div class="userShelf">\n    <a title="Javier&#39;s specific-reference shelf" class="actionLinkLite" href="/review/list/50196372-javier?shelf=specific-reference">specific-reference  &lrm;(51)</a>\n  </div>\n  <div class="userShelf">\n    <a title="Javier&#39;s started-and-dropped shelf" class="actionLinkLite" href="/review/list/50196372-javier?shelf=started-and-dropped">started-and-dropped  &lrm;(1)</a>\n  </div>\n\n\n\n            </div>\n            <div class="stacked">\n            </div>\n          </div>\n            <div class="horizontalGreyDivider"></div>\n            <div id="toolsSection" class="actionLinkLites">\n              <a rel="nofollow" href="/review/stats/50196372-javier">Reading stats</a>\n            </div>\n            <br/>\n            \n        </div>\n      </div>\n    </div>\n  <div id="rightCol" class="last col">\n    <div id="shelfSettings" class="controlBody" style="display: none">\n      <form id="fieldsForm" class="new_user_shelf" action="/shelf/update" accept-charset="UTF-8" data-remote="true" method="post"><input name="utf8" type="hidden" value="&#x2713;" />        <table>\n          <tr>\n            <td>\n              <label class="hlabel">\n                visible columns\n                <span class="greyText smallText">\n                  <a href="#" onclick="showColumns([&quot;checkbox&quot;,&quot;position&quot;,&quot;cover&quot;,&quot;title&quot;,&quot;author&quot;,&quot;isbn&quot;,&quot;avg_rating&quot;,&quot;num_ratings&quot;,&quot;date_pub&quot;,&quot;rating&quot;,&quot;shelves&quot;,&quot;review&quot;,&quot;notes&quot;,&quot;comments&quot;,&quot;votes&quot;,&quot;date_read&quot;,&quot;date_added&quot;,&quot;date_purchased&quot;,&quot;purchase_location&quot;,&quot;owned&quot;,&quot;condition&quot;,&quot;actions&quot;,&quot;recommender&quot;,&quot;date_started&quot;,&quot;read_count&quot;,&quot;isbn13&quot;,&quot;num_pages&quot;,&quot;date_pub_edition&quot;,&quot;asin&quot;,&quot;format&quot;]); return false;">select all</a>\n                </span>\n              </label>\n              <div class="greyText">\n                These settings only apply to table view.\n              </div>\n                <div class="left" style="margin-right: 10px">\n                    <input type="checkbox" name="shelf[display_fields][asin]" id="asin_field" value="1" alt="asin" />\n                      <label for="asin_field">asin</label><br/>\n                    <input type="checkbox" name="shelf[display_fields][author]" id="author_field" value="1" alt="author" checked="checked" />\n                      <label for="author_field">author</label><br/>\n                    <input type="checkbox" name="shelf[display_fields][avg_rating]" id="avg_rating_field" value="1" alt="avg_rating" checked="checked" />\n                      <label for="avg_rating_field">avg rating</label><br/>\n                    <input type="checkbox" name="shelf[display_fields][comments]" id="comments_field" value="1" alt="comments" />\n                      <label for="comments_field">comments</label><br/>\n                </div>\n                <div class="left" style="margin-right: 10px">\n                    <input type="checkbox" name="shelf[display_fields][cover]" id="cover_field" value="1" alt="cover" checked="checked" />\n                      <label for="cover_field">cover</label><br/>\n                    <input type="checkbox" name="shelf[display_fields][date_added]" id="date_added_field" value="1" alt="date_added" checked="checked" />\n                      <label for="date_added_field">date added</label><br/>\n                    <input type="checkbox" name="shelf[display_fields][date_pub]" id="date_pub_field" value="1" alt="date_pub" />\n                      <label for="date_pub_field">date pub</label><br/>\n                    <input type="checkbox" name="shelf[display_fields][date_pub_edition]" id="date_pub_edition_field" value="1" alt="date_pub_edition" />\n                      <label for="date_pub_edition_field">date pub (ed.)</label><br/>\n                </div>\n                <div class="left" style="margin-right: 10px">\n                    <input type="checkbox" name="shelf[display_fields][date_read]" id="date_read_field" value="1" alt="date_read" checked="checked" />\n                      <label for="date_read_field">date read</label><br/>\n                    <input type="checkbox" name="shelf[display_fields][date_started]" id="date_started_field" value="1" alt="date_started" />\n                      <label for="date_started_field">date started</label><br/>\n                    <input type="checkbox" name="shelf[display_fields][format]" id="format_field" value="1" alt="format" />\n                      <label for="format_field">format</label><br/>\n                    <input type="checkbox" name="shelf[display_fields][isbn]" id="isbn_field" value="1" alt="isbn" />\n                      <label for="isbn_field">isbn</label><br/>\n                </div>\n                <div class="left" style="margin-right: 10px">\n                    <input type="checkbox" name="shelf[display_fields][isbn13]" id="isbn13_field" value="1" alt="isbn13" />\n                      <label for="isbn13_field">isbn13</label><br/>\n                    <input type="checkbox" name="shelf[display_fields][notes]" id="notes_field" value="1" alt="notes" />\n                      <label for="notes_field">notes</label><br/>\n                    <input type="checkbox" name="shelf[display_fields][num_pages]" id="num_pages_field" value="1" alt="num_pages" />\n                      <label for="num_pages_field">num pages</label><br/>\n                    <input type="checkbox" name="shelf[display_fields][num_ratings]" id="num_ratings_field" value="1" alt="num_ratings" />\n                      <label for="num_ratings_field">num ratings</label><br/>\n                </div>\n                <div class="left" style="margin-right: 10px">\n                    <input type="checkbox" name="shelf[display_fields][owned]" id="owned_field" value="1" alt="owned" />\n                      <label for="owned_field">owned</label><br/>\n                    <input type="checkbox" name="shelf[display_fields][position]" id="position_field" value="1" alt="position" />\n                      <label for="position_field">position</label><br/>\n                    <input type="checkbox" name="shelf[display_fields][rating]" id="rating_field" value="1" alt="rating" checked="checked" />\n                      <label for="rating_field">rating</label><br/>\n                    <input type="checkbox" name="shelf[display_fields][read_count]" id="read_count_field" value="1" alt="read_count" />\n                      <label for="read_count_field">read count</label><br/>\n                </div>\n                <div class="left" style="margin-right: 10px">\n                    <input type="checkbox" name="shelf[display_fields][review]" id="review_field" value="1" alt="review" />\n                      <label for="review_field">review</label><br/>\n                    <input type="checkbox" name="shelf[display_fields][shelves]" id="shelves_field" value="1" alt="shelves" checked="checked" />\n                      <label for="my_rating_field">my rating</label><br/>\n                    <input type="checkbox" name="shelf[display_fields][title]" id="title_field" value="1" alt="title" checked="checked" />\n                      <label for="title_field">title</label><br/>\n                    <input type="checkbox" name="shelf[display_fields][votes]" id="votes_field" value="1" alt="votes" />\n                      <label for="votes_field">votes</label><br/>\n                </div>\n                <input type="checkbox" name="shelf[display_fields][actions]" id="actions_field" value="1" alt="actions" style="display: none" checked="checked" />\n                <input type="checkbox" name="shelf[display_fields][recommender]" id="recommender_field" value="1" alt="recommender" style="display: none" />\n                <input type="checkbox" name="shelf[display_fields][date_purchased]" id="date_purchased_field" value="1" alt="date_purchased" style="display: none" />\n                <input type="checkbox" name="shelf[display_fields][purchase_location]" id="purchase_location_field" value="1" alt="purchase_location" style="display: none" />\n                <input type="checkbox" name="shelf[display_fields][condition]" id="condition_field" value="1" alt="condition" style="display: none" />\n            </td>\n            <td valign="top">\n              <div id="presetFields">\n                <label class="hlabel">column sets</label>\n                  <a id="mainFieldSetLink" class="actionLinkLite selected" href="#" onclick="showColumns([&quot;position&quot;,&quot;cover&quot;,&quot;title&quot;,&quot;author&quot;,&quot;avg_rating&quot;,&quot;rating&quot;,&quot;shelves&quot;,&quot;date_read&quot;,&quot;date_added&quot;,&quot;actions&quot;], {fieldSet: &#39;main&#39;}); return false;">main</a>\n                  <br/>\n                  <a id="readingFieldSetLink" class="actionLinkLite " href="#" onclick="showColumns([&quot;position&quot;,&quot;cover&quot;,&quot;title&quot;,&quot;author&quot;,&quot;avg_rating&quot;,&quot;date_added&quot;,&quot;actions&quot;], {fieldSet: &#39;reading&#39;}); return false;">reading</a>\n                  <br/>\n                  <a id="listFieldSetLink" class="actionLinkLite " href="#" onclick="showColumns([&quot;position&quot;,&quot;title&quot;,&quot;author&quot;,&quot;avg_rating&quot;,&quot;num_ratings&quot;,&quot;date_pub&quot;,&quot;rating&quot;,&quot;comments&quot;,&quot;votes&quot;,&quot;date_read&quot;,&quot;date_added&quot;,&quot;actions&quot;], {fieldSet: &#39;list&#39;}); return false;">list</a>\n                  <br/>\n                  <a id="reviewFieldSetLink" class="actionLinkLite " href="#" onclick="showColumns([&quot;cover&quot;,&quot;title&quot;,&quot;rating&quot;,&quot;shelves&quot;,&quot;review&quot;,&quot;notes&quot;,&quot;comments&quot;,&quot;votes&quot;,&quot;date_read&quot;,&quot;actions&quot;], {fieldSet: &#39;review&#39;}); return false;">review</a>\n                  <br/>\n                  <a id="ownedFieldSetLink" class="actionLinkLite " href="#" onclick="showColumns([&quot;cover&quot;,&quot;title&quot;,&quot;author&quot;,&quot;isbn&quot;,&quot;date_pub&quot;,&quot;shelves&quot;,&quot;date_read&quot;,&quot;date_added&quot;,&quot;actions&quot;], {fieldSet: &#39;owned&#39;}); return false;">owned</a>\n                  <br/>\n              </div>\n            </td>\n          </tr>\n        </table>\n</form>      <a class="actionLinkLite greyText smallText right" href="#" onclick="hideControl($(&#39;shelfSettingsLink&#39;)); return false;">close</a>\n      <div class="clear"></div>\n    </div>\n      <div class="right uitext">\n        <div id="reviewPagination"><span class="previous_page disabled">« previous</span> <em class="current">1</em> <a rel="next" href="/review/list/50196372-javier?page=2">2</a> <a href="/review/list/50196372-javier?page=3">3</a> <a href="/review/list/50196372-javier?page=4">4</a> <a href="/review/list/50196372-javier?page=5">5</a> <a href="/review/list/50196372-javier?page=6">6</a> <a href="/review/list/50196372-javier?page=7">7</a> <a href="/review/list/50196372-javier?page=8">8</a> <a href="/review/list/50196372-javier?page=9">9</a> <span class="gap">&hellip;</span> <a href="/review/list/50196372-javier?page=28">28</a> <a href="/review/list/50196372-javier?page=29">29</a> <a class="next_page" rel="next" href="/review/list/50196372-javier?page=2">next »</a></div>\n\n      </div>\n      <div class="clear"></div>\n    <div class="js-dataTooltip" data-use-wtr-tooltip="true">\n      <table id="books" class="table stacked" border="0">\n        <thead>\n          <tr id="booksHeader" class="tableList">\n              <th alt="checkbox" class="header field checkbox" style="">\n              </th>\n              <th alt="position" class="header field position" style="display: none">\n                    <nobr>\n                      #\n                    </nobr>\n              </th>\n              <th alt="cover" class="header field cover" style="">\n                    <nobr>\n                      cover\n                    </nobr>\n              </th>\n              <th alt="title" class="header field title" style="">\n                    <nobr>\n                      title\n                    </nobr>\n              </th>\n              <th alt="author" class="header field author" style="">\n                    <nobr>\n                      author\n                    </nobr>\n              </th>\n              <th alt="isbn" class="header field isbn" style="display: none">\n                    <nobr>\n                      isbn\n                    </nobr>\n              </th>\n              <th alt="isbn13" class="header field isbn13" style="display: none">\n                    <nobr>\n                      isbn13\n                    </nobr>\n              </th>\n              <th alt="asin" class="header field asin" style="display: none">\n                    <nobr>\n                      asin\n                    </nobr>\n              </th>\n              <th alt="num_pages" class="header field num_pages" style="display: none">\n                    <nobr>\n                      pages\n                    </nobr>\n              </th>\n              <th alt="avg_rating" class="header field avg_rating" style="">\n                    <nobr>\n                      rating\n                    </nobr>\n              </th>\n              <th alt="num_ratings" class="header field num_ratings" style="display: none">\n                    <nobr>\n                      ratings\n                    </nobr>\n              </th>\n              <th alt="date_pub" class="header field date_pub" style="display: none">\n                    <nobr>\n                      pub\n                    </nobr>\n              </th>\n              <th alt="date_pub_edition" class="header field date_pub_edition" style="display: none">\n                    <nobr>\n                      (ed.)\n                    </nobr>\n              </th>\n              <th alt="rating" class="header field rating" style="">\n                    <nobr>\n                      rating\n                    </nobr>\n              </th>\n              <th alt="shelves" class="header field shelves" style="">\n                    my rating\n              </th>\n              <th alt="review" class="header field review" style="display: none">\n                    <nobr>\n                      review\n                    </nobr>\n              </th>\n              <th alt="notes" class="header field notes" style="display: none">\n                    <nobr>\n                      notes\n                    </nobr>\n              </th>\n              <th alt="recommender" class="header field recommender" style="display: none">\n              </th>\n              <th alt="comments" class="header field comments" style="display: none">\n                    <nobr>\n                      comments\n                    </nobr>\n              </th>\n              <th alt="votes" class="header field votes" style="display: none">\n                    <nobr>\n                      votes\n                    </nobr>\n              </th>\n              <th alt="read_count" class="header field read_count" style="display: none">\n                    <nobr>\n                      count\n                    </nobr>\n              </th>\n              <th alt="date_started" class="header field date_started" style="display: none">\n                    <nobr>\n                      started\n                    </nobr>\n              </th>\n              <th alt="date_read" class="header field date_read" style="">\n                    <nobr>\n                      read\n                    </nobr>\n              </th>\n              <th alt="date_added" class="header field date_added" style="">\n                    <nobr>\n                      added\n                        <img src="https://s.gr-assets.com/assets/down_arrow-1e1fa5642066c151f5e0136233fce98a.gif" alt="Down arrow" />\n                    </nobr>\n              </th>\n              <th alt="date_purchased" class="header field date_purchased" style="display: none">\n              </th>\n              <th alt="owned" class="header field owned" style="display: none">\n                    <nobr>\n                      owned\n                    </nobr>\n              </th>\n              <th alt="purchase_location" class="header field purchase_location" style="display: none">\n              </th>\n              <th alt="condition" class="header field condition" style="display: none">\n              </th>\n              <th alt="format" class="header field format" style="display: none">\n                    <nobr>\n                      format\n                    </nobr>\n              </th>\n              <th alt="actions" class="header field actions" style="">\n              </th>\n          </tr>\n        </thead>\n        <tbody id="booksBody">\n              \n<tr id="review_6817900641" class="bookalike review">\n  <td class="field checkbox"><label>checkbox</label><div class="value">      &nbsp;\n</div></td>  <td class="field position" style="display: none"><label>position</label><div class="value"></div></td>  <td class="field cover"><label>cover</label><div class="value">        <div class="js-tooltipTrigger tooltipTrigger" data-resource-type="Book" data-resource-id="59335141">\n          <a href="/book/show/59335141-how-to-start-a-successful-airbnb-business"><img alt="How to Start a Successful Airbnb Business: Quit Your Day Job and Earn Full-time Income on Autopilot With a Profitable Airbnb Business Even if You’re an Absolute Beginner (2024)" id="cover_review_6817900641" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1634021238l/59335141._SY75_.jpg" /></a>\n        </div>\n</div></td>  <td class="field title"><label>title</label><div class="value">    <a title="How to Start a Successful Airbnb Business: Quit Your Day Job and Earn Full-time Income on Autopilot With a Profitable Airbnb Business Even if You’re an Absolute Beginner (2024)" href="/book/show/59335141-how-to-start-a-successful-airbnb-business">\n      How to Start a Successful Airbnb Business: Quit Your Day Job and Earn Full-time Income on Autopilot With a Profitable Airbnb Business Even if You’re an Absolute Beginner\n        <span class="darkGreyText">(2024)</span>\n</a></div></td>  <td class="field author"><label>author</label><div class="value">      <a href="/author/show/2384369.Walter_Grant">Grant, Walter</a>\n</div></td>  <td class="field isbn" style="display: none"><label>isbn</label><div class="value">\n</div></td>  <td class="field isbn13" style="display: none"><label>isbn13</label><div class="value">\n</div></td>  <td class="field asin" style="display: none"><label>asin</label><div class="value">    B09HXSXXQQ\n</div></td>  <td class="field num_pages" style="display: none"><label>num pages</label><div class="value">      <nobr>\n        192\n        <span class="greyText">pp</span>\n      </nobr>\n</div></td>  <td class="field avg_rating"><label>avg rating</label><div class="value">    4.30\n</div></td>  <td class="field num_ratings" style="display: none"><label>num ratings</label><div class="value">    248\n</div></td>  <td class="field date_pub" style="display: none"><label>date pub</label><div class="value">      <span class="greyText">unknown</span>\n</div></td>  <td class="field date_pub_edition" style="display: none"><label>date pub edition</label><div class="value">      Oct 06, 2021\n</div></td>    \n<td class="field rating"><label>Javier&#39;s rating</label><div class="value">\n        <span class=" staticStars notranslate"><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span></span>\n</div></td><td class="field shelves"><label>my rating</label><div class="value">\n        <div class="stars" data-resource-id="59335141" data-user-id="0" data-submit-url="/review/rate/59335141?stars_click=false" data-rating="0" data-restore-rating="null"><a class="star off" title="did not like it" href="#" ref="">1 of 5 stars</a><a class="star off" title="it was ok" href="#" ref="">2 of 5 stars</a><a class="star off" title="liked it" href="#" ref="">3 of 5 stars</a><a class="star off" title="really liked it" href="#" ref="">4 of 5 stars</a><a class="star off" title="it was amazing" href="#" ref="">5 of 5 stars</a></div>\n        <span id="reviewMessage59335141_false"></span>\n        <span id="successMessage59335141_false"></span>\n        <div>\n              <a class="smallText actionLinkLite" rel="nofollow" href="/user/new">add to shelves</a>\n        </div>\n</div></td><td class="field review" style="display: none"><label>review</label><div class="value">\n            <span class="greyText">None</span>\n    <div class="clear"></div>\n</div></td><td class="field notes" style="display: none"><label>notes</label><div class="value">\n        <span class="greyText">Notes are private!</span>\n</div></td>\n<td class="field comments" style="display: none"><label>comments</label><div class="value">\n    <a href="/review/show/6817900641">0</a>\n</div></td>\n<td class="field votes" style="display: none"><label>votes</label><div class="value">\n    <a href="/rating/voters/6817900641?resource_type=Review">0</a>\n</div></td>\n<td class="field read_count" style="display: none"><label># times read</label><div class="value">\n    0\n</div></td><td class="field date_started" style="display: none"><label>date started</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_started_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_read"><label>date read</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_read_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_added"><label>date added</label><div class="value">\n    <span title="September 03, 2024">\n    Sep 03, 2024\n  </span>\n</div></td><td class="field owned" style="display: none"><label>owned</label><div class="value"></div></td>\n<td class="field format" style="display: none"><label>format</label><div class="value">\n        Kindle Edition\n</div></td><td class="field actions"><label>actions</label><div class="value">\n        <div>\n          <a class="nobreak" href="/review/show/6817900641">view</a>\n        </div>\n</div></td>\n</tr>\n\n<tr id="review_6817900062" class="bookalike review">\n  <td class="field checkbox"><label>checkbox</label><div class="value">      &nbsp;\n</div></td>  <td class="field position" style="display: none"><label>position</label><div class="value"></div></td>  <td class="field cover"><label>cover</label><div class="value">        <div class="js-tooltipTrigger tooltipTrigger" data-resource-type="Book" data-resource-id="37811096">\n          <a href="/book/show/37811096-optimize-your-bnb"><img alt="Optimize YOUR Bnb: The Definitive Guide to Ranking #1 in Airbnb Search by a Prior Employee" id="cover_review_6817900062" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1515044789l/37811096._SX50_.jpg" /></a>\n        </div>\n</div></td>  <td class="field title"><label>title</label><div class="value">    <a title="Optimize YOUR Bnb: The Definitive Guide to Ranking #1 in Airbnb Search by a Prior Employee" href="/book/show/37811096-optimize-your-bnb">\n      Optimize YOUR Bnb: The Definitive Guide to Ranking #1 in Airbnb Search by a Prior Employee\n</a></div></td>  <td class="field author"><label>author</label><div class="value">      <a href="/author/show/17508538.Daniel_Vroman_Rusteen">Rusteen, Daniel Vroman</a>\n</div></td>  <td class="field isbn" style="display: none"><label>isbn</label><div class="value">\n</div></td>  <td class="field isbn13" style="display: none"><label>isbn13</label><div class="value">\n</div></td>  <td class="field asin" style="display: none"><label>asin</label><div class="value">    B0786QBPWP\n</div></td>  <td class="field num_pages" style="display: none"><label>num pages</label><div class="value">      <nobr>\n        269\n        <span class="greyText">pp</span>\n      </nobr>\n</div></td>  <td class="field avg_rating"><label>avg rating</label><div class="value">    4.48\n</div></td>  <td class="field num_ratings" style="display: none"><label>num ratings</label><div class="value">    261\n</div></td>  <td class="field date_pub" style="display: none"><label>date pub</label><div class="value">      <span class="greyText">unknown</span>\n</div></td>  <td class="field date_pub_edition" style="display: none"><label>date pub edition</label><div class="value">      Jan 01, 2018\n</div></td>    \n<td class="field rating"><label>Javier&#39;s rating</label><div class="value">\n        <span class=" staticStars notranslate"><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span></span>\n</div></td><td class="field shelves"><label>my rating</label><div class="value">\n        <div class="stars" data-resource-id="37811096" data-user-id="0" data-submit-url="/review/rate/37811096?stars_click=false" data-rating="0" data-restore-rating="null"><a class="star off" title="did not like it" href="#" ref="">1 of 5 stars</a><a class="star off" title="it was ok" href="#" ref="">2 of 5 stars</a><a class="star off" title="liked it" href="#" ref="">3 of 5 stars</a><a class="star off" title="really liked it" href="#" ref="">4 of 5 stars</a><a class="star off" title="it was amazing" href="#" ref="">5 of 5 stars</a></div>\n        <span id="reviewMessage37811096_false"></span>\n        <span id="successMessage37811096_false"></span>\n        <div>\n              <a class="smallText actionLinkLite" rel="nofollow" href="/user/new">add to shelves</a>\n        </div>\n</div></td><td class="field review" style="display: none"><label>review</label><div class="value">\n            <span class="greyText">None</span>\n    <div class="clear"></div>\n</div></td><td class="field notes" style="display: none"><label>notes</label><div class="value">\n        <span class="greyText">Notes are private!</span>\n</div></td>\n<td class="field comments" style="display: none"><label>comments</label><div class="value">\n    <a href="/review/show/6817900062">0</a>\n</div></td>\n<td class="field votes" style="display: none"><label>votes</label><div class="value">\n    <a href="/rating/voters/6817900062?resource_type=Review">0</a>\n</div></td>\n<td class="field read_count" style="display: none"><label># times read</label><div class="value">\n    0\n</div></td><td class="field date_started" style="display: none"><label>date started</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_started_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_read"><label>date read</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_read_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_added"><label>date added</label><div class="value">\n    <span title="September 03, 2024">\n    Sep 03, 2024\n  </span>\n</div></td><td class="field owned" style="display: none"><label>owned</label><div class="value"></div></td>\n<td class="field format" style="display: none"><label>format</label><div class="value">\n        Kindle Edition\n</div></td><td class="field actions"><label>actions</label><div class="value">\n        <div>\n          <a class="nobreak" href="/review/show/6817900062">view</a>\n        </div>\n</div></td>\n</tr>\n\n<tr id="review_6817899752" class="bookalike review">\n  <td class="field checkbox"><label>checkbox</label><div class="value">      &nbsp;\n</div></td>  <td class="field position" style="display: none"><label>position</label><div class="value"></div></td>  <td class="field cover"><label>cover</label><div class="value">        <div class="js-tooltipTrigger tooltipTrigger" data-resource-type="Book" data-resource-id="63338662">\n          <a href="/book/show/63338662-10x-is-easier-than-2x"><img alt="10x Is Easier Than 2x: How World-Class Entrepreneurs Achieve More by Doing Less" id="cover_review_6817899752" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1689973796l/63338662._SY75_.jpg" /></a>\n        </div>\n</div></td>  <td class="field title"><label>title</label><div class="value">    <a title="10x Is Easier Than 2x: How World-Class Entrepreneurs Achieve More by Doing Less" href="/book/show/63338662-10x-is-easier-than-2x">\n      10x Is Easier Than 2x: How World-Class Entrepreneurs Achieve More by Doing Less\n</a></div></td>  <td class="field author"><label>author</label><div class="value">      <a href="/author/show/337490.Dan_Sullivan">Sullivan, Dan</a>\n</div></td>  <td class="field isbn" style="display: none"><label>isbn</label><div class="value">    1401969968\n</div></td>  <td class="field isbn13" style="display: none"><label>isbn13</label><div class="value">    9781401969967\n</div></td>  <td class="field asin" style="display: none"><label>asin</label><div class="value">    B0BGK74SR5\n</div></td>  <td class="field num_pages" style="display: none"><label>num pages</label><div class="value">      <nobr>\n        288\n        <span class="greyText">pp</span>\n      </nobr>\n</div></td>  <td class="field avg_rating"><label>avg rating</label><div class="value">    4.25\n</div></td>  <td class="field num_ratings" style="display: none"><label>num ratings</label><div class="value">    2,447\n</div></td>  <td class="field date_pub" style="display: none"><label>date pub</label><div class="value">      <span class="greyText">unknown</span>\n</div></td>  <td class="field date_pub_edition" style="display: none"><label>date pub edition</label><div class="value">      May 09, 2023\n</div></td>    \n<td class="field rating"><label>Javier&#39;s rating</label><div class="value">\n        <span class=" staticStars notranslate"><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span></span>\n</div></td><td class="field shelves"><label>my rating</label><div class="value">\n        <div class="stars" data-resource-id="63338662" data-user-id="0" data-submit-url="/review/rate/63338662?stars_click=false" data-rating="0" data-restore-rating="null"><a class="star off" title="did not like it" href="#" ref="">1 of 5 stars</a><a class="star off" title="it was ok" href="#" ref="">2 of 5 stars</a><a class="star off" title="liked it" href="#" ref="">3 of 5 stars</a><a class="star off" title="really liked it" href="#" ref="">4 of 5 stars</a><a class="star off" title="it was amazing" href="#" ref="">5 of 5 stars</a></div>\n        <span id="reviewMessage63338662_false"></span>\n        <span id="successMessage63338662_false"></span>\n        <div>\n              <a class="smallText actionLinkLite" rel="nofollow" href="/user/new">add to shelves</a>\n        </div>\n</div></td><td class="field review" style="display: none"><label>review</label><div class="value">\n            <span class="greyText">None</span>\n    <div class="clear"></div>\n</div></td><td class="field notes" style="display: none"><label>notes</label><div class="value">\n        <span class="greyText">Notes are private!</span>\n</div></td>\n<td class="field comments" style="display: none"><label>comments</label><div class="value">\n    <a href="/review/show/6817899752">0</a>\n</div></td>\n<td class="field votes" style="display: none"><label>votes</label><div class="value">\n    <a href="/rating/voters/6817899752?resource_type=Review">0</a>\n</div></td>\n<td class="field read_count" style="display: none"><label># times read</label><div class="value">\n    0\n</div></td><td class="field date_started" style="display: none"><label>date started</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_started_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_read"><label>date read</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_read_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_added"><label>date added</label><div class="value">\n    <span title="September 03, 2024">\n    Sep 03, 2024\n  </span>\n</div></td><td class="field owned" style="display: none"><label>owned</label><div class="value"></div></td>\n<td class="field format" style="display: none"><label>format</label><div class="value">\n        Kindle Edition\n</div></td><td class="field actions"><label>actions</label><div class="value">\n        <div>\n          <a class="nobreak" href="/review/show/6817899752">view</a>\n        </div>\n</div></td>\n</tr>\n\n<tr id="review_6817897046" class="bookalike review">\n  <td class="field checkbox"><label>checkbox</label><div class="value">      &nbsp;\n</div></td>  <td class="field position" style="display: none"><label>position</label><div class="value"></div></td>  <td class="field cover"><label>cover</label><div class="value">        <div class="js-tooltipTrigger tooltipTrigger" data-resource-type="Book" data-resource-id="30780674">\n          <a href="/book/show/30780674-profit-first"><img alt="Profit First: Transform Your Business from a Cash-Eating Monster to a Money-Making Machine" id="cover_review_6817897046" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1564556201l/30780674._SY75_.jpg" /></a>\n        </div>\n</div></td>  <td class="field title"><label>title</label><div class="value">    <a title="Profit First: Transform Your Business from a Cash-Eating Monster to a Money-Making Machine" href="/book/show/30780674-profit-first">\n      Profit First: Transform Your Business from a Cash-Eating Monster to a Money-Making Machine\n</a></div></td>  <td class="field author"><label>author</label><div class="value">      <a href="/author/show/2023612.Mike_Michalowicz">Michalowicz, Mike</a>\n        <span title="Goodreads Author!">*</span>\n</div></td>  <td class="field isbn" style="display: none"><label>isbn</label><div class="value">\n</div></td>  <td class="field isbn13" style="display: none"><label>isbn13</label><div class="value">\n</div></td>  <td class="field asin" style="display: none"><label>asin</label><div class="value">\n</div></td>  <td class="field num_pages" style="display: none"><label>num pages</label><div class="value">      <nobr>\n        224\n        <span class="greyText">pp</span>\n      </nobr>\n</div></td>  <td class="field avg_rating"><label>avg rating</label><div class="value">    4.27\n</div></td>  <td class="field num_ratings" style="display: none"><label>num ratings</label><div class="value">    12,003\n</div></td>  <td class="field date_pub" style="display: none"><label>date pub</label><div class="value">      Jun 24, 2014\n</div></td>  <td class="field date_pub_edition" style="display: none"><label>date pub edition</label><div class="value">      Feb 21, 2017\n</div></td>    \n<td class="field rating"><label>Javier&#39;s rating</label><div class="value">\n        <span class=" staticStars notranslate"><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span></span>\n</div></td><td class="field shelves"><label>my rating</label><div class="value">\n        <div class="stars" data-resource-id="30780674" data-user-id="0" data-submit-url="/review/rate/30780674?stars_click=false" data-rating="0" data-restore-rating="null"><a class="star off" title="did not like it" href="#" ref="">1 of 5 stars</a><a class="star off" title="it was ok" href="#" ref="">2 of 5 stars</a><a class="star off" title="liked it" href="#" ref="">3 of 5 stars</a><a class="star off" title="really liked it" href="#" ref="">4 of 5 stars</a><a class="star off" title="it was amazing" href="#" ref="">5 of 5 stars</a></div>\n        <span id="reviewMessage30780674_false"></span>\n        <span id="successMessage30780674_false"></span>\n        <div>\n              <a class="smallText actionLinkLite" rel="nofollow" href="/user/new">add to shelves</a>\n        </div>\n</div></td><td class="field review" style="display: none"><label>review</label><div class="value">\n            <span class="greyText">None</span>\n    <div class="clear"></div>\n</div></td><td class="field notes" style="display: none"><label>notes</label><div class="value">\n        <span class="greyText">Notes are private!</span>\n</div></td>\n<td class="field comments" style="display: none"><label>comments</label><div class="value">\n    <a href="/review/show/6817897046">0</a>\n</div></td>\n<td class="field votes" style="display: none"><label>votes</label><div class="value">\n    <a href="/rating/voters/6817897046?resource_type=Review">0</a>\n</div></td>\n<td class="field read_count" style="display: none"><label># times read</label><div class="value">\n    0\n</div></td><td class="field date_started" style="display: none"><label>date started</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_started_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_read"><label>date read</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_read_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_added"><label>date added</label><div class="value">\n    <span title="September 03, 2024">\n    Sep 03, 2024\n  </span>\n</div></td><td class="field owned" style="display: none"><label>owned</label><div class="value"></div></td>\n<td class="field format" style="display: none"><label>format</label><div class="value">\n        Hardcover\n</div></td><td class="field actions"><label>actions</label><div class="value">\n        <div>\n          <a class="nobreak" href="/review/show/6817897046">view</a>\n        </div>\n</div></td>\n</tr>\n\n<tr id="review_6817894177" class="bookalike review">\n  <td class="field checkbox"><label>checkbox</label><div class="value">      &nbsp;\n</div></td>  <td class="field position" style="display: none"><label>position</label><div class="value"></div></td>  <td class="field cover"><label>cover</label><div class="value">        <div class="js-tooltipTrigger tooltipTrigger" data-resource-type="Book" data-resource-id="53528281">\n          <a href="/book/show/53528281-skip-the-flip"><img alt="Skip the Flip: Secrets the 1% Know About Real Estate Investing" id="cover_review_6817894177" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1590624645l/53528281._SX50_.jpg" /></a>\n        </div>\n</div></td>  <td class="field title"><label>title</label><div class="value">    <a title="Skip the Flip: Secrets the 1% Know About Real Estate Investing" href="/book/show/53528281-skip-the-flip">\n      Skip the Flip: Secrets the 1% Know About Real Estate Investing\n</a></div></td>  <td class="field author"><label>author</label><div class="value">      <a href="/author/show/20317646.Hayden_Crabtree">Crabtree, Hayden</a>\n</div></td>  <td class="field isbn" style="display: none"><label>isbn</label><div class="value">    1734768606\n</div></td>  <td class="field isbn13" style="display: none"><label>isbn13</label><div class="value">    9781734768602\n</div></td>  <td class="field asin" style="display: none"><label>asin</label><div class="value">    B086XFRL4P\n</div></td>  <td class="field num_pages" style="display: none"><label>num pages</label><div class="value">      <nobr>\n        218\n        <span class="greyText">pp</span>\n      </nobr>\n</div></td>  <td class="field avg_rating"><label>avg rating</label><div class="value">    4.31\n</div></td>  <td class="field num_ratings" style="display: none"><label>num ratings</label><div class="value">    400\n</div></td>  <td class="field date_pub" style="display: none"><label>date pub</label><div class="value">      <span class="greyText">unknown</span>\n</div></td>  <td class="field date_pub_edition" style="display: none"><label>date pub edition</label><div class="value">      Apr 08, 2020\n</div></td>    \n<td class="field rating"><label>Javier&#39;s rating</label><div class="value">\n        <span class=" staticStars notranslate"><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span></span>\n</div></td><td class="field shelves"><label>my rating</label><div class="value">\n        <div class="stars" data-resource-id="53528281" data-user-id="0" data-submit-url="/review/rate/53528281?stars_click=false" data-rating="0" data-restore-rating="null"><a class="star off" title="did not like it" href="#" ref="">1 of 5 stars</a><a class="star off" title="it was ok" href="#" ref="">2 of 5 stars</a><a class="star off" title="liked it" href="#" ref="">3 of 5 stars</a><a class="star off" title="really liked it" href="#" ref="">4 of 5 stars</a><a class="star off" title="it was amazing" href="#" ref="">5 of 5 stars</a></div>\n        <span id="reviewMessage53528281_false"></span>\n        <span id="successMessage53528281_false"></span>\n        <div>\n              <a class="smallText actionLinkLite" rel="nofollow" href="/user/new">add to shelves</a>\n        </div>\n</div></td><td class="field review" style="display: none"><label>review</label><div class="value">\n            <span class="greyText">None</span>\n    <div class="clear"></div>\n</div></td><td class="field notes" style="display: none"><label>notes</label><div class="value">\n        <span class="greyText">Notes are private!</span>\n</div></td>\n<td class="field comments" style="display: none"><label>comments</label><div class="value">\n    <a href="/review/show/6817894177">0</a>\n</div></td>\n<td class="field votes" style="display: none"><label>votes</label><div class="value">\n    <a href="/rating/voters/6817894177?resource_type=Review">0</a>\n</div></td>\n<td class="field read_count" style="display: none"><label># times read</label><div class="value">\n    0\n</div></td><td class="field date_started" style="display: none"><label>date started</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_started_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_read"><label>date read</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_read_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_added"><label>date added</label><div class="value">\n    <span title="September 03, 2024">\n    Sep 03, 2024\n  </span>\n</div></td><td class="field owned" style="display: none"><label>owned</label><div class="value"></div></td>\n<td class="field format" style="display: none"><label>format</label><div class="value">\n        Kindle Edition\n</div></td><td class="field actions"><label>actions</label><div class="value">\n        <div>\n          <a class="nobreak" href="/review/show/6817894177">view</a>\n        </div>\n</div></td>\n</tr>\n\n<tr id="review_6817890537" class="bookalike review">\n  <td class="field checkbox"><label>checkbox</label><div class="value">      &nbsp;\n</div></td>  <td class="field position" style="display: none"><label>position</label><div class="value"></div></td>  <td class="field cover"><label>cover</label><div class="value">        <div class="js-tooltipTrigger tooltipTrigger" data-resource-type="Book" data-resource-id="2688775">\n          <a href="/book/show/2688775-the-wild-places"><img alt="The Wild Places" id="cover_review_6817890537" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1442535260l/2688775._SX50_.jpg" /></a>\n        </div>\n</div></td>  <td class="field title"><label>title</label><div class="value">    <a title="The Wild Places" href="/book/show/2688775-the-wild-places">\n      The Wild Places\n</a></div></td>  <td class="field author"><label>author</label><div class="value">      <a href="/author/show/435856.Robert_Macfarlane">Macfarlane, Robert</a>\n        <span title="Goodreads Author!">*</span>\n</div></td>  <td class="field isbn" style="display: none"><label>isbn</label><div class="value">    0143113933\n</div></td>  <td class="field isbn13" style="display: none"><label>isbn13</label><div class="value">    9780143113935\n</div></td>  <td class="field asin" style="display: none"><label>asin</label><div class="value">    0143113933\n</div></td>  <td class="field num_pages" style="display: none"><label>num pages</label><div class="value">      <nobr>\n        340\n        <span class="greyText">pp</span>\n      </nobr>\n</div></td>  <td class="field avg_rating"><label>avg rating</label><div class="value">    4.25\n</div></td>  <td class="field num_ratings" style="display: none"><label>num ratings</label><div class="value">    5,082\n</div></td>  <td class="field date_pub" style="display: none"><label>date pub</label><div class="value">      Sep 03, 2007\n</div></td>  <td class="field date_pub_edition" style="display: none"><label>date pub edition</label><div class="value">      Jun 24, 2008\n</div></td>    \n<td class="field rating"><label>Javier&#39;s rating</label><div class="value">\n        <span class=" staticStars notranslate"><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span></span>\n</div></td><td class="field shelves"><label>my rating</label><div class="value">\n        <div class="stars" data-resource-id="2688775" data-user-id="0" data-submit-url="/review/rate/2688775?stars_click=false" data-rating="0" data-restore-rating="null"><a class="star off" title="did not like it" href="#" ref="">1 of 5 stars</a><a class="star off" title="it was ok" href="#" ref="">2 of 5 stars</a><a class="star off" title="liked it" href="#" ref="">3 of 5 stars</a><a class="star off" title="really liked it" href="#" ref="">4 of 5 stars</a><a class="star off" title="it was amazing" href="#" ref="">5 of 5 stars</a></div>\n        <span id="reviewMessage2688775_false"></span>\n        <span id="successMessage2688775_false"></span>\n        <div>\n              <a class="smallText actionLinkLite" rel="nofollow" href="/user/new">add to shelves</a>\n        </div>\n</div></td><td class="field review" style="display: none"><label>review</label><div class="value">\n            <span class="greyText">None</span>\n    <div class="clear"></div>\n</div></td><td class="field notes" style="display: none"><label>notes</label><div class="value">\n        <span class="greyText">Notes are private!</span>\n</div></td>\n<td class="field comments" style="display: none"><label>comments</label><div class="value">\n    <a href="/review/show/6817890537">0</a>\n</div></td>\n<td class="field votes" style="display: none"><label>votes</label><div class="value">\n    <a href="/rating/voters/6817890537?resource_type=Review">0</a>\n</div></td>\n<td class="field read_count" style="display: none"><label># times read</label><div class="value">\n    0\n</div></td><td class="field date_started" style="display: none"><label>date started</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_started_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_read"><label>date read</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_read_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_added"><label>date added</label><div class="value">\n    <span title="September 03, 2024">\n    Sep 03, 2024\n  </span>\n</div></td><td class="field owned" style="display: none"><label>owned</label><div class="value"></div></td>\n<td class="field format" style="display: none"><label>format</label><div class="value">\n        Paperback\n</div></td><td class="field actions"><label>actions</label><div class="value">\n        <div>\n          <a class="nobreak" href="/review/show/6817890537">view</a>\n        </div>\n</div></td>\n</tr>\n\n<tr id="review_6817889443" class="bookalike review">\n  <td class="field checkbox"><label>checkbox</label><div class="value">      &nbsp;\n</div></td>  <td class="field position" style="display: none"><label>position</label><div class="value"></div></td>  <td class="field cover"><label>cover</label><div class="value">        <div class="js-tooltipTrigger tooltipTrigger" data-resource-type="Book" data-resource-id="18197267">\n          <a href="/book/show/18197267-don-t-make-me-think-revisited"><img alt="Don\'t Make Me Think, Revisited: A Common Sense Approach to Web Usability (Voices That Matter)" id="cover_review_6817889443" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1711564661l/18197267._SX50_.jpg" /></a>\n        </div>\n</div></td>  <td class="field title"><label>title</label><div class="value">    <a title="Don\'t Make Me Think, Revisited: A Common Sense Approach to Web Usability (Voices That Matter)" href="/book/show/18197267-don-t-make-me-think-revisited">\n      Don\'t Make Me Think, Revisited: A Common Sense Approach to Web Usability\n</a></div></td>  <td class="field author"><label>author</label><div class="value">      <a href="/author/show/2298.Steve_Krug">Krug, Steve</a>\n        <span title="Goodreads Author!">*</span>\n</div></td>  <td class="field isbn" style="display: none"><label>isbn</label><div class="value">    0321965515\n</div></td>  <td class="field isbn13" style="display: none"><label>isbn13</label><div class="value">    9780321965516\n</div></td>  <td class="field asin" style="display: none"><label>asin</label><div class="value">    0321965515\n</div></td>  <td class="field num_pages" style="display: none"><label>num pages</label><div class="value">      <nobr>\n        216\n        <span class="greyText">pp</span>\n      </nobr>\n</div></td>  <td class="field avg_rating"><label>avg rating</label><div class="value">    4.24\n</div></td>  <td class="field num_ratings" style="display: none"><label>num ratings</label><div class="value">    29,513\n</div></td>  <td class="field date_pub" style="display: none"><label>date pub</label><div class="value">      2000\n</div></td>  <td class="field date_pub_edition" style="display: none"><label>date pub edition</label><div class="value">      Dec 24, 2013\n</div></td>    \n<td class="field rating"><label>Javier&#39;s rating</label><div class="value">\n        <span class=" staticStars notranslate"><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span></span>\n</div></td><td class="field shelves"><label>my rating</label><div class="value">\n        <div class="stars" data-resource-id="18197267" data-user-id="0" data-submit-url="/review/rate/18197267?stars_click=false" data-rating="0" data-restore-rating="null"><a class="star off" title="did not like it" href="#" ref="">1 of 5 stars</a><a class="star off" title="it was ok" href="#" ref="">2 of 5 stars</a><a class="star off" title="liked it" href="#" ref="">3 of 5 stars</a><a class="star off" title="really liked it" href="#" ref="">4 of 5 stars</a><a class="star off" title="it was amazing" href="#" ref="">5 of 5 stars</a></div>\n        <span id="reviewMessage18197267_false"></span>\n        <span id="successMessage18197267_false"></span>\n        <div>\n              <a class="smallText actionLinkLite" rel="nofollow" href="/user/new">add to shelves</a>\n        </div>\n</div></td><td class="field review" style="display: none"><label>review</label><div class="value">\n            <span class="greyText">None</span>\n    <div class="clear"></div>\n</div></td><td class="field notes" style="display: none"><label>notes</label><div class="value">\n        <span class="greyText">Notes are private!</span>\n</div></td>\n<td class="field comments" style="display: none"><label>comments</label><div class="value">\n    <a href="/review/show/6817889443">0</a>\n</div></td>\n<td class="field votes" style="display: none"><label>votes</label><div class="value">\n    <a href="/rating/voters/6817889443?resource_type=Review">0</a>\n</div></td>\n<td class="field read_count" style="display: none"><label># times read</label><div class="value">\n    0\n</div></td><td class="field date_started" style="display: none"><label>date started</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_started_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_read"><label>date read</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_read_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_added"><label>date added</label><div class="value">\n    <span title="September 03, 2024">\n    Sep 03, 2024\n  </span>\n</div></td><td class="field owned" style="display: none"><label>owned</label><div class="value"></div></td>\n<td class="field format" style="display: none"><label>format</label><div class="value">\n        Paperback\n</div></td><td class="field actions"><label>actions</label><div class="value">\n        <div>\n          <a class="nobreak" href="/review/show/6817889443">view</a>\n        </div>\n</div></td>\n</tr>\n\n<tr id="review_6817887974" class="bookalike review">\n  <td class="field checkbox"><label>checkbox</label><div class="value">      &nbsp;\n</div></td>  <td class="field position" style="display: none"><label>position</label><div class="value"></div></td>  <td class="field cover"><label>cover</label><div class="value">        <div class="js-tooltipTrigger tooltipTrigger" data-resource-type="Book" data-resource-id="52326089">\n          <a href="/book/show/52326089-data-visualization-handbook"><img alt="Data visualization handbook" id="cover_review_6817887974" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1577901963l/52326089._SX50_SY75_.jpg" /></a>\n        </div>\n</div></td>  <td class="field title"><label>title</label><div class="value">    <a title="Data visualization handbook" href="/book/show/52326089-data-visualization-handbook">\n      Data visualization handbook\n</a></div></td>  <td class="field author"><label>author</label><div class="value">      <a href="/author/show/16177348.Juuso_Koponen">Koponen, Juuso</a>\n</div></td>  <td class="field isbn" style="display: none"><label>isbn</label><div class="value">    9526074491\n</div></td>  <td class="field isbn13" style="display: none"><label>isbn13</label><div class="value">    9789526074498\n</div></td>  <td class="field asin" style="display: none"><label>asin</label><div class="value">    9526074491\n</div></td>  <td class="field num_pages" style="display: none"><label>num pages</label><div class="value">      <nobr>\n        352\n        <span class="greyText">pp</span>\n      </nobr>\n</div></td>  <td class="field avg_rating"><label>avg rating</label><div class="value">    4.58\n</div></td>  <td class="field num_ratings" style="display: none"><label>num ratings</label><div class="value">    19\n</div></td>  <td class="field date_pub" style="display: none"><label>date pub</label><div class="value">      <span class="greyText">unknown</span>\n</div></td>  <td class="field date_pub_edition" style="display: none"><label>date pub edition</label><div class="value">      2019\n</div></td>    \n<td class="field rating"><label>Javier&#39;s rating</label><div class="value">\n        <span class=" staticStars notranslate"><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span></span>\n</div></td><td class="field shelves"><label>my rating</label><div class="value">\n        <div class="stars" data-resource-id="52326089" data-user-id="0" data-submit-url="/review/rate/52326089?stars_click=false" data-rating="0" data-restore-rating="null"><a class="star off" title="did not like it" href="#" ref="">1 of 5 stars</a><a class="star off" title="it was ok" href="#" ref="">2 of 5 stars</a><a class="star off" title="liked it" href="#" ref="">3 of 5 stars</a><a class="star off" title="really liked it" href="#" ref="">4 of 5 stars</a><a class="star off" title="it was amazing" href="#" ref="">5 of 5 stars</a></div>\n        <span id="reviewMessage52326089_false"></span>\n        <span id="successMessage52326089_false"></span>\n        <div>\n              <a class="smallText actionLinkLite" rel="nofollow" href="/user/new">add to shelves</a>\n        </div>\n</div></td><td class="field review" style="display: none"><label>review</label><div class="value">\n            <span class="greyText">None</span>\n    <div class="clear"></div>\n</div></td><td class="field notes" style="display: none"><label>notes</label><div class="value">\n        <span class="greyText">Notes are private!</span>\n</div></td>\n<td class="field comments" style="display: none"><label>comments</label><div class="value">\n    <a href="/review/show/6817887974">0</a>\n</div></td>\n<td class="field votes" style="display: none"><label>votes</label><div class="value">\n    <a href="/rating/voters/6817887974?resource_type=Review">0</a>\n</div></td>\n<td class="field read_count" style="display: none"><label># times read</label><div class="value">\n    0\n</div></td><td class="field date_started" style="display: none"><label>date started</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_started_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_read"><label>date read</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_read_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_added"><label>date added</label><div class="value">\n    <span title="September 03, 2024">\n    Sep 03, 2024\n  </span>\n</div></td><td class="field owned" style="display: none"><label>owned</label><div class="value"></div></td>\n<td class="field format" style="display: none"><label>format</label><div class="value">\n        Paperback\n</div></td><td class="field actions"><label>actions</label><div class="value">\n        <div>\n          <a class="nobreak" href="/review/show/6817887974">view</a>\n        </div>\n</div></td>\n</tr>\n\n<tr id="review_6817886348" class="bookalike review">\n  <td class="field checkbox"><label>checkbox</label><div class="value">      &nbsp;\n</div></td>  <td class="field position" style="display: none"><label>position</label><div class="value"></div></td>  <td class="field cover"><label>cover</label><div class="value">        <div class="js-tooltipTrigger tooltipTrigger" data-resource-type="Book" data-resource-id="79766">\n          <a href="/book/show/79766.A_Pattern_Language"><img alt="A Pattern Language: Towns, Buildings, Construction (Center for Environmental Structure Series)" id="cover_review_6817886348" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1437097809l/79766._SY75_.jpg" /></a>\n        </div>\n</div></td>  <td class="field title"><label>title</label><div class="value">    <a title="A Pattern Language: Towns, Buildings, Construction (Center for Environmental Structure Series)" href="/book/show/79766.A_Pattern_Language">\n      A Pattern Language: Towns, Buildings, Construction\n</a></div></td>  <td class="field author"><label>author</label><div class="value">      <a href="/author/show/9826601.Christopher_W_Alexander">Alexander, Christopher W.</a>\n</div></td>  <td class="field isbn" style="display: none"><label>isbn</label><div class="value">    0195019199\n</div></td>  <td class="field isbn13" style="display: none"><label>isbn13</label><div class="value">    9780195019193\n</div></td>  <td class="field asin" style="display: none"><label>asin</label><div class="value">    0195019199\n</div></td>  <td class="field num_pages" style="display: none"><label>num pages</label><div class="value">      <nobr>\n        1,171\n        <span class="greyText">pp</span>\n      </nobr>\n</div></td>  <td class="field avg_rating"><label>avg rating</label><div class="value">    4.42\n</div></td>  <td class="field num_ratings" style="display: none"><label>num ratings</label><div class="value">    5,137\n</div></td>  <td class="field date_pub" style="display: none"><label>date pub</label><div class="value">      1977\n</div></td>  <td class="field date_pub_edition" style="display: none"><label>date pub edition</label><div class="value">      Jan 01, 1977\n</div></td>    \n<td class="field rating"><label>Javier&#39;s rating</label><div class="value">\n        <span class=" staticStars notranslate"><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span></span>\n</div></td><td class="field shelves"><label>my rating</label><div class="value">\n        <div class="stars" data-resource-id="79766" data-user-id="0" data-submit-url="/review/rate/79766?stars_click=false" data-rating="0" data-restore-rating="null"><a class="star off" title="did not like it" href="#" ref="">1 of 5 stars</a><a class="star off" title="it was ok" href="#" ref="">2 of 5 stars</a><a class="star off" title="liked it" href="#" ref="">3 of 5 stars</a><a class="star off" title="really liked it" href="#" ref="">4 of 5 stars</a><a class="star off" title="it was amazing" href="#" ref="">5 of 5 stars</a></div>\n        <span id="reviewMessage79766_false"></span>\n        <span id="successMessage79766_false"></span>\n        <div>\n              <a class="smallText actionLinkLite" rel="nofollow" href="/user/new">add to shelves</a>\n        </div>\n</div></td><td class="field review" style="display: none"><label>review</label><div class="value">\n            <span class="greyText">None</span>\n    <div class="clear"></div>\n</div></td><td class="field notes" style="display: none"><label>notes</label><div class="value">\n        <span class="greyText">Notes are private!</span>\n</div></td>\n<td class="field comments" style="display: none"><label>comments</label><div class="value">\n    <a href="/review/show/6817886348">0</a>\n</div></td>\n<td class="field votes" style="display: none"><label>votes</label><div class="value">\n    <a href="/rating/voters/6817886348?resource_type=Review">0</a>\n</div></td>\n<td class="field read_count" style="display: none"><label># times read</label><div class="value">\n    0\n</div></td><td class="field date_started" style="display: none"><label>date started</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_started_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_read"><label>date read</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_read_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_added"><label>date added</label><div class="value">\n    <span title="September 03, 2024">\n    Sep 03, 2024\n  </span>\n</div></td><td class="field owned" style="display: none"><label>owned</label><div class="value"></div></td>\n<td class="field format" style="display: none"><label>format</label><div class="value">\n        Hardcover\n</div></td><td class="field actions"><label>actions</label><div class="value">\n        <div>\n          <a class="nobreak" href="/review/show/6817886348">view</a>\n        </div>\n</div></td>\n</tr>\n\n<tr id="review_6817883285" class="bookalike review">\n  <td class="field checkbox"><label>checkbox</label><div class="value">      &nbsp;\n</div></td>  <td class="field position" style="display: none"><label>position</label><div class="value"></div></td>  <td class="field cover"><label>cover</label><div class="value">        <div class="js-tooltipTrigger tooltipTrigger" data-resource-type="Book" data-resource-id="18770267">\n          <a href="/book/show/18770267-make-it-stick"><img alt="Make It Stick: The Science of Successful Learning" id="cover_review_6817883285" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1631768711l/18770267._SY75_.jpg" /></a>\n        </div>\n</div></td>  <td class="field title"><label>title</label><div class="value">    <a title="Make It Stick: The Science of Successful Learning" href="/book/show/18770267-make-it-stick">\n      Make It Stick: The Science of Successful Learning\n</a></div></td>  <td class="field author"><label>author</label><div class="value">      <a href="/author/show/47555.Peter_C_Brown">Brown, Peter C.</a>\n</div></td>  <td class="field isbn" style="display: none"><label>isbn</label><div class="value">    0674729013\n</div></td>  <td class="field isbn13" style="display: none"><label>isbn13</label><div class="value">    9780674729018\n</div></td>  <td class="field asin" style="display: none"><label>asin</label><div class="value">    0674729013\n</div></td>  <td class="field num_pages" style="display: none"><label>num pages</label><div class="value">      <nobr>\n        313\n        <span class="greyText">pp</span>\n      </nobr>\n</div></td>  <td class="field avg_rating"><label>avg rating</label><div class="value">    4.16\n</div></td>  <td class="field num_ratings" style="display: none"><label>num ratings</label><div class="value">    19,772\n</div></td>  <td class="field date_pub" style="display: none"><label>date pub</label><div class="value">      Apr 14, 2014\n</div></td>  <td class="field date_pub_edition" style="display: none"><label>date pub edition</label><div class="value">      Apr 14, 2014\n</div></td>    \n<td class="field rating"><label>Javier&#39;s rating</label><div class="value">\n        <span class=" staticStars notranslate"><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span></span>\n</div></td><td class="field shelves"><label>my rating</label><div class="value">\n        <div class="stars" data-resource-id="18770267" data-user-id="0" data-submit-url="/review/rate/18770267?stars_click=false" data-rating="0" data-restore-rating="null"><a class="star off" title="did not like it" href="#" ref="">1 of 5 stars</a><a class="star off" title="it was ok" href="#" ref="">2 of 5 stars</a><a class="star off" title="liked it" href="#" ref="">3 of 5 stars</a><a class="star off" title="really liked it" href="#" ref="">4 of 5 stars</a><a class="star off" title="it was amazing" href="#" ref="">5 of 5 stars</a></div>\n        <span id="reviewMessage18770267_false"></span>\n        <span id="successMessage18770267_false"></span>\n        <div>\n              <a class="smallText actionLinkLite" rel="nofollow" href="/user/new">add to shelves</a>\n        </div>\n</div></td><td class="field review" style="display: none"><label>review</label><div class="value">\n            <span class="greyText">None</span>\n    <div class="clear"></div>\n</div></td><td class="field notes" style="display: none"><label>notes</label><div class="value">\n        <span class="greyText">Notes are private!</span>\n</div></td>\n<td class="field comments" style="display: none"><label>comments</label><div class="value">\n    <a href="/review/show/6817883285">0</a>\n</div></td>\n<td class="field votes" style="display: none"><label>votes</label><div class="value">\n    <a href="/rating/voters/6817883285?resource_type=Review">0</a>\n</div></td>\n<td class="field read_count" style="display: none"><label># times read</label><div class="value">\n    0\n</div></td><td class="field date_started" style="display: none"><label>date started</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_started_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_read"><label>date read</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_read_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_added"><label>date added</label><div class="value">\n    <span title="September 03, 2024">\n    Sep 03, 2024\n  </span>\n</div></td><td class="field owned" style="display: none"><label>owned</label><div class="value"></div></td>\n<td class="field format" style="display: none"><label>format</label><div class="value">\n        Hardcover\n</div></td><td class="field actions"><label>actions</label><div class="value">\n        <div>\n          <a class="nobreak" href="/review/show/6817883285">view</a>\n        </div>\n</div></td>\n</tr>\n\n<tr id="review_6817882489" class="bookalike review">\n  <td class="field checkbox"><label>checkbox</label><div class="value">      &nbsp;\n</div></td>  <td class="field position" style="display: none"><label>position</label><div class="value"></div></td>  <td class="field cover"><label>cover</label><div class="value">        <div class="js-tooltipTrigger tooltipTrigger" data-resource-type="Book" data-resource-id="25744928">\n          <a href="/book/show/25744928-deep-work"><img alt="Deep Work: Rules for Focused Success in a Distracted World" id="cover_review_6817882489" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1447957962l/25744928._SY75_.jpg" /></a>\n        </div>\n</div></td>  <td class="field title"><label>title</label><div class="value">    <a title="Deep Work: Rules for Focused Success in a Distracted World" href="/book/show/25744928-deep-work">\n      Deep Work: Rules for Focused Success in a Distracted World\n</a></div></td>  <td class="field author"><label>author</label><div class="value">      <a href="/author/show/147891.Cal_Newport">Newport, Cal</a>\n</div></td>  <td class="field isbn" style="display: none"><label>isbn</label><div class="value">    1455586692\n</div></td>  <td class="field isbn13" style="display: none"><label>isbn13</label><div class="value">    9781455586691\n</div></td>  <td class="field asin" style="display: none"><label>asin</label><div class="value">    1455586692\n</div></td>  <td class="field num_pages" style="display: none"><label>num pages</label><div class="value">      <nobr>\n        296\n        <span class="greyText">pp</span>\n      </nobr>\n</div></td>  <td class="field avg_rating"><label>avg rating</label><div class="value">    4.18\n</div></td>  <td class="field num_ratings" style="display: none"><label>num ratings</label><div class="value">    162,634\n</div></td>  <td class="field date_pub" style="display: none"><label>date pub</label><div class="value">      Jan 05, 2016\n</div></td>  <td class="field date_pub_edition" style="display: none"><label>date pub edition</label><div class="value">      Jan 05, 2016\n</div></td>    \n<td class="field rating"><label>Javier&#39;s rating</label><div class="value">\n        <span class=" staticStars notranslate"><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span></span>\n</div></td><td class="field shelves"><label>my rating</label><div class="value">\n        <div class="stars" data-resource-id="25744928" data-user-id="0" data-submit-url="/review/rate/25744928?stars_click=false" data-rating="0" data-restore-rating="null"><a class="star off" title="did not like it" href="#" ref="">1 of 5 stars</a><a class="star off" title="it was ok" href="#" ref="">2 of 5 stars</a><a class="star off" title="liked it" href="#" ref="">3 of 5 stars</a><a class="star off" title="really liked it" href="#" ref="">4 of 5 stars</a><a class="star off" title="it was amazing" href="#" ref="">5 of 5 stars</a></div>\n        <span id="reviewMessage25744928_false"></span>\n        <span id="successMessage25744928_false"></span>\n        <div>\n              <a class="smallText actionLinkLite" rel="nofollow" href="/user/new">add to shelves</a>\n        </div>\n</div></td><td class="field review" style="display: none"><label>review</label><div class="value">\n            <span class="greyText">None</span>\n    <div class="clear"></div>\n</div></td><td class="field notes" style="display: none"><label>notes</label><div class="value">\n        <span class="greyText">Notes are private!</span>\n</div></td>\n<td class="field comments" style="display: none"><label>comments</label><div class="value">\n    <a href="/review/show/6817882489">0</a>\n</div></td>\n<td class="field votes" style="display: none"><label>votes</label><div class="value">\n    <a href="/rating/voters/6817882489?resource_type=Review">0</a>\n</div></td>\n<td class="field read_count" style="display: none"><label># times read</label><div class="value">\n    0\n</div></td><td class="field date_started" style="display: none"><label>date started</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_started_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_read"><label>date read</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_read_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_added"><label>date added</label><div class="value">\n    <span title="September 03, 2024">\n    Sep 03, 2024\n  </span>\n</div></td><td class="field owned" style="display: none"><label>owned</label><div class="value"></div></td>\n<td class="field format" style="display: none"><label>format</label><div class="value">\n        Hardcover\n</div></td><td class="field actions"><label>actions</label><div class="value">\n        <div>\n          <a class="nobreak" href="/review/show/6817882489">view</a>\n        </div>\n</div></td>\n</tr>\n\n<tr id="review_6817879872" class="bookalike review">\n  <td class="field checkbox"><label>checkbox</label><div class="value">      &nbsp;\n</div></td>  <td class="field position" style="display: none"><label>position</label><div class="value"></div></td>  <td class="field cover"><label>cover</label><div class="value">        <div class="js-tooltipTrigger tooltipTrigger" data-resource-type="Book" data-resource-id="22456">\n          <a href="/book/show/22456.The_Origin_of_Wealth"><img alt="The Origin of Wealth: Evolution, Complexity, and the Radical Remaking of Economics" id="cover_review_6817879872" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1388330469l/22456._SX50_.jpg" /></a>\n        </div>\n</div></td>  <td class="field title"><label>title</label><div class="value">    <a title="The Origin of Wealth: Evolution, Complexity, and the Radical Remaking of Economics" href="/book/show/22456.The_Origin_of_Wealth">\n      The Origin of Wealth: Evolution, Complexity, and the Radical Remaking of Economics\n</a></div></td>  <td class="field author"><label>author</label><div class="value">      <a href="/author/show/12791.Eric_D_Beinhocker">Beinhocker, Eric D.</a>\n</div></td>  <td class="field isbn" style="display: none"><label>isbn</label><div class="value">    157851777X\n</div></td>  <td class="field isbn13" style="display: none"><label>isbn13</label><div class="value">    9781578517770\n</div></td>  <td class="field asin" style="display: none"><label>asin</label><div class="value">    157851777X\n</div></td>  <td class="field num_pages" style="display: none"><label>num pages</label><div class="value">      <nobr>\n        527\n        <span class="greyText">pp</span>\n      </nobr>\n</div></td>  <td class="field avg_rating"><label>avg rating</label><div class="value">    4.28\n</div></td>  <td class="field num_ratings" style="display: none"><label>num ratings</label><div class="value">    1,669\n</div></td>  <td class="field date_pub" style="display: none"><label>date pub</label><div class="value">      2006\n</div></td>  <td class="field date_pub_edition" style="display: none"><label>date pub edition</label><div class="value">      Jun 01, 2006\n</div></td>    \n<td class="field rating"><label>Javier&#39;s rating</label><div class="value">\n        <span class=" staticStars notranslate"><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span></span>\n</div></td><td class="field shelves"><label>my rating</label><div class="value">\n        <div class="stars" data-resource-id="22456" data-user-id="0" data-submit-url="/review/rate/22456?stars_click=false" data-rating="0" data-restore-rating="null"><a class="star off" title="did not like it" href="#" ref="">1 of 5 stars</a><a class="star off" title="it was ok" href="#" ref="">2 of 5 stars</a><a class="star off" title="liked it" href="#" ref="">3 of 5 stars</a><a class="star off" title="really liked it" href="#" ref="">4 of 5 stars</a><a class="star off" title="it was amazing" href="#" ref="">5 of 5 stars</a></div>\n        <span id="reviewMessage22456_false"></span>\n        <span id="successMessage22456_false"></span>\n        <div>\n              <a class="smallText actionLinkLite" rel="nofollow" href="/user/new">add to shelves</a>\n        </div>\n</div></td><td class="field review" style="display: none"><label>review</label><div class="value">\n            <span class="greyText">None</span>\n    <div class="clear"></div>\n</div></td><td class="field notes" style="display: none"><label>notes</label><div class="value">\n        <span class="greyText">Notes are private!</span>\n</div></td>\n<td class="field comments" style="display: none"><label>comments</label><div class="value">\n    <a href="/review/show/6817879872">0</a>\n</div></td>\n<td class="field votes" style="display: none"><label>votes</label><div class="value">\n    <a href="/rating/voters/6817879872?resource_type=Review">0</a>\n</div></td>\n<td class="field read_count" style="display: none"><label># times read</label><div class="value">\n    0\n</div></td><td class="field date_started" style="display: none"><label>date started</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_started_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_read"><label>date read</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_read_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_added"><label>date added</label><div class="value">\n    <span title="September 03, 2024">\n    Sep 03, 2024\n  </span>\n</div></td><td class="field owned" style="display: none"><label>owned</label><div class="value"></div></td>\n<td class="field format" style="display: none"><label>format</label><div class="value">\n        Hardcover\n</div></td><td class="field actions"><label>actions</label><div class="value">\n        <div>\n          <a class="nobreak" href="/review/show/6817879872">view</a>\n        </div>\n</div></td>\n</tr>\n\n<tr id="review_6817877638" class="bookalike review">\n  <td class="field checkbox"><label>checkbox</label><div class="value">      &nbsp;\n</div></td>  <td class="field position" style="display: none"><label>position</label><div class="value"></div></td>  <td class="field cover"><label>cover</label><div class="value">        <div class="js-tooltipTrigger tooltipTrigger" data-resource-type="Book" data-resource-id="243725">\n          <a href="/book/show/243725.Out_of_Control"><img alt="Out of Control: The New Biology of Machines, Social Systems, and the Economic World" id="cover_review_6817877638" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1386925037l/243725._SY75_.jpg" /></a>\n        </div>\n</div></td>  <td class="field title"><label>title</label><div class="value">    <a title="Out of Control: The New Biology of Machines, Social Systems, and the Economic World" href="/book/show/243725.Out_of_Control">\n      Out of Control: The New Biology of Machines, Social Systems, and the Economic World\n</a></div></td>  <td class="field author"><label>author</label><div class="value">      <a href="/author/show/27388.Kevin_Kelly">Kelly, Kevin</a>\n        <span title="Goodreads Author!">*</span>\n</div></td>  <td class="field isbn" style="display: none"><label>isbn</label><div class="value">    0201483408\n</div></td>  <td class="field isbn13" style="display: none"><label>isbn13</label><div class="value">    9780201483406\n</div></td>  <td class="field asin" style="display: none"><label>asin</label><div class="value">    0201483408\n</div></td>  <td class="field num_pages" style="display: none"><label>num pages</label><div class="value">      <nobr>\n        531\n        <span class="greyText">pp</span>\n      </nobr>\n</div></td>  <td class="field avg_rating"><label>avg rating</label><div class="value">    4.22\n</div></td>  <td class="field num_ratings" style="display: none"><label>num ratings</label><div class="value">    1,664\n</div></td>  <td class="field date_pub" style="display: none"><label>date pub</label><div class="value">      1992\n</div></td>  <td class="field date_pub_edition" style="display: none"><label>date pub edition</label><div class="value">      Apr 14, 1995\n</div></td>    \n<td class="field rating"><label>Javier&#39;s rating</label><div class="value">\n        <span class=" staticStars notranslate"><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span></span>\n</div></td><td class="field shelves"><label>my rating</label><div class="value">\n        <div class="stars" data-resource-id="243725" data-user-id="0" data-submit-url="/review/rate/243725?stars_click=false" data-rating="0" data-restore-rating="null"><a class="star off" title="did not like it" href="#" ref="">1 of 5 stars</a><a class="star off" title="it was ok" href="#" ref="">2 of 5 stars</a><a class="star off" title="liked it" href="#" ref="">3 of 5 stars</a><a class="star off" title="really liked it" href="#" ref="">4 of 5 stars</a><a class="star off" title="it was amazing" href="#" ref="">5 of 5 stars</a></div>\n        <span id="reviewMessage243725_false"></span>\n        <span id="successMessage243725_false"></span>\n        <div>\n              <a class="smallText actionLinkLite" rel="nofollow" href="/user/new">add to shelves</a>\n        </div>\n</div></td><td class="field review" style="display: none"><label>review</label><div class="value">\n            <span class="greyText">None</span>\n    <div class="clear"></div>\n</div></td><td class="field notes" style="display: none"><label>notes</label><div class="value">\n        <span class="greyText">Notes are private!</span>\n</div></td>\n<td class="field comments" style="display: none"><label>comments</label><div class="value">\n    <a href="/review/show/6817877638">0</a>\n</div></td>\n<td class="field votes" style="display: none"><label>votes</label><div class="value">\n    <a href="/rating/voters/6817877638?resource_type=Review">0</a>\n</div></td>\n<td class="field read_count" style="display: none"><label># times read</label><div class="value">\n    0\n</div></td><td class="field date_started" style="display: none"><label>date started</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_started_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_read"><label>date read</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_read_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_added"><label>date added</label><div class="value">\n    <span title="September 03, 2024">\n    Sep 03, 2024\n  </span>\n</div></td><td class="field owned" style="display: none"><label>owned</label><div class="value"></div></td>\n<td class="field format" style="display: none"><label>format</label><div class="value">\n        Paperback\n</div></td><td class="field actions"><label>actions</label><div class="value">\n        <div>\n          <a class="nobreak" href="/review/show/6817877638">view</a>\n        </div>\n</div></td>\n</tr>\n\n<tr id="review_6817875826" class="bookalike review">\n  <td class="field checkbox"><label>checkbox</label><div class="value">      &nbsp;\n</div></td>  <td class="field position" style="display: none"><label>position</label><div class="value"></div></td>  <td class="field cover"><label>cover</label><div class="value">        <div class="js-tooltipTrigger tooltipTrigger" data-resource-type="Book" data-resource-id="31170723">\n          <a href="/book/show/31170723-behave"><img alt="Behave: The Biology of Humans at Our Best and Worst" id="cover_review_6817875826" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1517732866l/31170723._SY75_.jpg" /></a>\n        </div>\n</div></td>  <td class="field title"><label>title</label><div class="value">    <a title="Behave: The Biology of Humans at Our Best and Worst" href="/book/show/31170723-behave">\n      Behave: The Biology of Humans at Our Best and Worst\n</a></div></td>  <td class="field author"><label>author</label><div class="value">      <a href="/author/show/187.Robert_M_Sapolsky">Sapolsky, Robert M.</a>\n</div></td>  <td class="field isbn" style="display: none"><label>isbn</label><div class="value">    1594205078\n</div></td>  <td class="field isbn13" style="display: none"><label>isbn13</label><div class="value">    9781594205071\n</div></td>  <td class="field asin" style="display: none"><label>asin</label><div class="value">    1594205078\n</div></td>  <td class="field num_pages" style="display: none"><label>num pages</label><div class="value">      <nobr>\n        790\n        <span class="greyText">pp</span>\n      </nobr>\n</div></td>  <td class="field avg_rating"><label>avg rating</label><div class="value">    4.40\n</div></td>  <td class="field num_ratings" style="display: none"><label>num ratings</label><div class="value">    25,025\n</div></td>  <td class="field date_pub" style="display: none"><label>date pub</label><div class="value">      May 02, 2017\n</div></td>  <td class="field date_pub_edition" style="display: none"><label>date pub edition</label><div class="value">      May 02, 2017\n</div></td>    \n<td class="field rating"><label>Javier&#39;s rating</label><div class="value">\n        <span class=" staticStars notranslate"><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span></span>\n</div></td><td class="field shelves"><label>my rating</label><div class="value">\n        <div class="stars" data-resource-id="31170723" data-user-id="0" data-submit-url="/review/rate/31170723?stars_click=false" data-rating="0" data-restore-rating="null"><a class="star off" title="did not like it" href="#" ref="">1 of 5 stars</a><a class="star off" title="it was ok" href="#" ref="">2 of 5 stars</a><a class="star off" title="liked it" href="#" ref="">3 of 5 stars</a><a class="star off" title="really liked it" href="#" ref="">4 of 5 stars</a><a class="star off" title="it was amazing" href="#" ref="">5 of 5 stars</a></div>\n        <span id="reviewMessage31170723_false"></span>\n        <span id="successMessage31170723_false"></span>\n        <div>\n              <a class="smallText actionLinkLite" rel="nofollow" href="/user/new">add to shelves</a>\n        </div>\n</div></td><td class="field review" style="display: none"><label>review</label><div class="value">\n            <span class="greyText">None</span>\n    <div class="clear"></div>\n</div></td><td class="field notes" style="display: none"><label>notes</label><div class="value">\n        <span class="greyText">Notes are private!</span>\n</div></td>\n<td class="field comments" style="display: none"><label>comments</label><div class="value">\n    <a href="/review/show/6817875826">0</a>\n</div></td>\n<td class="field votes" style="display: none"><label>votes</label><div class="value">\n    <a href="/rating/voters/6817875826?resource_type=Review">0</a>\n</div></td>\n<td class="field read_count" style="display: none"><label># times read</label><div class="value">\n    0\n</div></td><td class="field date_started" style="display: none"><label>date started</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_started_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_read"><label>date read</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_read_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_added"><label>date added</label><div class="value">\n    <span title="September 03, 2024">\n    Sep 03, 2024\n  </span>\n</div></td><td class="field owned" style="display: none"><label>owned</label><div class="value"></div></td>\n<td class="field format" style="display: none"><label>format</label><div class="value">\n        Hardcover\n</div></td><td class="field actions"><label>actions</label><div class="value">\n        <div>\n          <a class="nobreak" href="/review/show/6817875826">view</a>\n        </div>\n</div></td>\n</tr>\n\n<tr id="review_6817871378" class="bookalike review">\n  <td class="field checkbox"><label>checkbox</label><div class="value">      &nbsp;\n</div></td>  <td class="field position" style="display: none"><label>position</label><div class="value"></div></td>  <td class="field cover"><label>cover</label><div class="value">        <div class="js-tooltipTrigger tooltipTrigger" data-resource-type="Book" data-resource-id="36739769">\n          <a href="/book/show/36739769-the-third-door"><img alt="The Third Door: The Wild Quest to Uncover How the World\'s Most Successful People Launched Their Careers" id="cover_review_6817871378" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1527724477l/36739769._SY75_.jpg" /></a>\n        </div>\n</div></td>  <td class="field title"><label>title</label><div class="value">    <a title="The Third Door: The Wild Quest to Uncover How the World\'s Most Successful People Launched Their Careers" href="/book/show/36739769-the-third-door">\n      The Third Door: The Wild Quest to Uncover How the World\'s Most Successful People Launched Their Careers\n</a></div></td>  <td class="field author"><label>author</label><div class="value">      <a href="/author/show/17391335.Alex_Banayan">Banayan, Alex</a>\n        <span title="Goodreads Author!">*</span>\n</div></td>  <td class="field isbn" style="display: none"><label>isbn</label><div class="value">\n</div></td>  <td class="field isbn13" style="display: none"><label>isbn13</label><div class="value">\n</div></td>  <td class="field asin" style="display: none"><label>asin</label><div class="value">\n</div></td>  <td class="field num_pages" style="display: none"><label>num pages</label><div class="value">      <nobr>\n        320\n        <span class="greyText">pp</span>\n      </nobr>\n</div></td>  <td class="field avg_rating"><label>avg rating</label><div class="value">    4.16\n</div></td>  <td class="field num_ratings" style="display: none"><label>num ratings</label><div class="value">    7,222\n</div></td>  <td class="field date_pub" style="display: none"><label>date pub</label><div class="value">      Jun 05, 2018\n</div></td>  <td class="field date_pub_edition" style="display: none"><label>date pub edition</label><div class="value">      Jun 05, 2018\n</div></td>    \n<td class="field rating"><label>Javier&#39;s rating</label><div class="value">\n        <span class=" staticStars notranslate"><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span></span>\n</div></td><td class="field shelves"><label>my rating</label><div class="value">\n        <div class="stars" data-resource-id="36739769" data-user-id="0" data-submit-url="/review/rate/36739769?stars_click=false" data-rating="0" data-restore-rating="null"><a class="star off" title="did not like it" href="#" ref="">1 of 5 stars</a><a class="star off" title="it was ok" href="#" ref="">2 of 5 stars</a><a class="star off" title="liked it" href="#" ref="">3 of 5 stars</a><a class="star off" title="really liked it" href="#" ref="">4 of 5 stars</a><a class="star off" title="it was amazing" href="#" ref="">5 of 5 stars</a></div>\n        <span id="reviewMessage36739769_false"></span>\n        <span id="successMessage36739769_false"></span>\n        <div>\n              <a class="smallText actionLinkLite" rel="nofollow" href="/user/new">add to shelves</a>\n        </div>\n</div></td><td class="field review" style="display: none"><label>review</label><div class="value">\n            <span class="greyText">None</span>\n    <div class="clear"></div>\n</div></td><td class="field notes" style="display: none"><label>notes</label><div class="value">\n        <span class="greyText">Notes are private!</span>\n</div></td>\n<td class="field comments" style="display: none"><label>comments</label><div class="value">\n    <a href="/review/show/6817871378">0</a>\n</div></td>\n<td class="field votes" style="display: none"><label>votes</label><div class="value">\n    <a href="/rating/voters/6817871378?resource_type=Review">0</a>\n</div></td>\n<td class="field read_count" style="display: none"><label># times read</label><div class="value">\n    0\n</div></td><td class="field date_started" style="display: none"><label>date started</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_started_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_read"><label>date read</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_read_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_added"><label>date added</label><div class="value">\n    <span title="September 03, 2024">\n    Sep 03, 2024\n  </span>\n</div></td><td class="field owned" style="display: none"><label>owned</label><div class="value"></div></td>\n<td class="field format" style="display: none"><label>format</label><div class="value">\n        Hardcover\n</div></td><td class="field actions"><label>actions</label><div class="value">\n        <div>\n          <a class="nobreak" href="/review/show/6817871378">view</a>\n        </div>\n</div></td>\n</tr>\n\n<tr id="review_6817868754" class="bookalike review">\n  <td class="field checkbox"><label>checkbox</label><div class="value">      &nbsp;\n</div></td>  <td class="field position" style="display: none"><label>position</label><div class="value"></div></td>  <td class="field cover"><label>cover</label><div class="value">        <div class="js-tooltipTrigger tooltipTrigger" data-resource-type="Book" data-resource-id="30659">\n          <a href="/book/show/30659.Meditations"><img alt="Meditations" id="cover_review_6817868754" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1421618636l/30659._SY75_.jpg" /></a>\n        </div>\n</div></td>  <td class="field title"><label>title</label><div class="value">    <a title="Meditations" href="/book/show/30659.Meditations">\n      Meditations\n</a></div></td>  <td class="field author"><label>author</label><div class="value">      <a href="/author/show/17212.Marcus_Aurelius">Marcus Aurelius</a>\n</div></td>  <td class="field isbn" style="display: none"><label>isbn</label><div class="value">    0140449337\n</div></td>  <td class="field isbn13" style="display: none"><label>isbn13</label><div class="value">    9780140449334\n</div></td>  <td class="field asin" style="display: none"><label>asin</label><div class="value">    0140449337\n</div></td>  <td class="field num_pages" style="display: none"><label>num pages</label><div class="value">      <nobr>\n        254\n        <span class="greyText">pp</span>\n      </nobr>\n</div></td>  <td class="field avg_rating"><label>avg rating</label><div class="value">    4.28\n</div></td>  <td class="field num_ratings" style="display: none"><label>num ratings</label><div class="value">    268,085\n</div></td>  <td class="field date_pub" style="display: none"><label>date pub</label><div class="value">      180\n</div></td>  <td class="field date_pub_edition" style="display: none"><label>date pub edition</label><div class="value">      Apr 27, 2006\n</div></td>    \n<td class="field rating"><label>Javier&#39;s rating</label><div class="value">\n        <span class=" staticStars notranslate"><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span></span>\n</div></td><td class="field shelves"><label>my rating</label><div class="value">\n        <div class="stars" data-resource-id="30659" data-user-id="0" data-submit-url="/review/rate/30659?stars_click=false" data-rating="0" data-restore-rating="null"><a class="star off" title="did not like it" href="#" ref="">1 of 5 stars</a><a class="star off" title="it was ok" href="#" ref="">2 of 5 stars</a><a class="star off" title="liked it" href="#" ref="">3 of 5 stars</a><a class="star off" title="really liked it" href="#" ref="">4 of 5 stars</a><a class="star off" title="it was amazing" href="#" ref="">5 of 5 stars</a></div>\n        <span id="reviewMessage30659_false"></span>\n        <span id="successMessage30659_false"></span>\n        <div>\n              <a class="smallText actionLinkLite" rel="nofollow" href="/user/new">add to shelves</a>\n        </div>\n</div></td><td class="field review" style="display: none"><label>review</label><div class="value">\n            <span class="greyText">None</span>\n    <div class="clear"></div>\n</div></td><td class="field notes" style="display: none"><label>notes</label><div class="value">\n        <span class="greyText">Notes are private!</span>\n</div></td>\n<td class="field comments" style="display: none"><label>comments</label><div class="value">\n    <a href="/review/show/6817868754">0</a>\n</div></td>\n<td class="field votes" style="display: none"><label>votes</label><div class="value">\n    <a href="/rating/voters/6817868754?resource_type=Review">0</a>\n</div></td>\n<td class="field read_count" style="display: none"><label># times read</label><div class="value">\n    0\n</div></td><td class="field date_started" style="display: none"><label>date started</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_started_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_read"><label>date read</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_read_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_added"><label>date added</label><div class="value">\n    <span title="September 03, 2024">\n    Sep 03, 2024\n  </span>\n</div></td><td class="field owned" style="display: none"><label>owned</label><div class="value"></div></td>\n<td class="field format" style="display: none"><label>format</label><div class="value">\n        Paperback\n</div></td><td class="field actions"><label>actions</label><div class="value">\n        <div>\n          <a class="nobreak" href="/review/show/6817868754">view</a>\n        </div>\n</div></td>\n</tr>\n\n<tr id="review_6817866866" class="bookalike review">\n  <td class="field checkbox"><label>checkbox</label><div class="value">      &nbsp;\n</div></td>  <td class="field position" style="display: none"><label>position</label><div class="value"></div></td>  <td class="field cover"><label>cover</label><div class="value">        <div class="js-tooltipTrigger tooltipTrigger" data-resource-type="Book" data-resource-id="106732">\n          <a href="/book/show/106732.The_User_Illusion"><img alt="The User Illusion: Cutting Consciousness Down to Size" id="cover_review_6817866866" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1630568260l/106732._SY75_.jpg" /></a>\n        </div>\n</div></td>  <td class="field title"><label>title</label><div class="value">    <a title="The User Illusion: Cutting Consciousness Down to Size" href="/book/show/106732.The_User_Illusion">\n      The User Illusion: Cutting Consciousness Down to Size\n</a></div></td>  <td class="field author"><label>author</label><div class="value">      <a href="/author/show/1179558.Tor_N_rretranders">Nørretranders, Tor</a>\n</div></td>  <td class="field isbn" style="display: none"><label>isbn</label><div class="value">    0140230122\n</div></td>  <td class="field isbn13" style="display: none"><label>isbn13</label><div class="value">    9780140230123\n</div></td>  <td class="field asin" style="display: none"><label>asin</label><div class="value">    0140230122\n</div></td>  <td class="field num_pages" style="display: none"><label>num pages</label><div class="value">      <nobr>\n        480\n        <span class="greyText">pp</span>\n      </nobr>\n</div></td>  <td class="field avg_rating"><label>avg rating</label><div class="value">    4.32\n</div></td>  <td class="field num_ratings" style="display: none"><label>num ratings</label><div class="value">    1,049\n</div></td>  <td class="field date_pub" style="display: none"><label>date pub</label><div class="value">      1991\n</div></td>  <td class="field date_pub_edition" style="display: none"><label>date pub edition</label><div class="value">      Aug 01, 1999\n</div></td>    \n<td class="field rating"><label>Javier&#39;s rating</label><div class="value">\n        <span class=" staticStars notranslate"><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span></span>\n</div></td><td class="field shelves"><label>my rating</label><div class="value">\n        <div class="stars" data-resource-id="106732" data-user-id="0" data-submit-url="/review/rate/106732?stars_click=false" data-rating="0" data-restore-rating="null"><a class="star off" title="did not like it" href="#" ref="">1 of 5 stars</a><a class="star off" title="it was ok" href="#" ref="">2 of 5 stars</a><a class="star off" title="liked it" href="#" ref="">3 of 5 stars</a><a class="star off" title="really liked it" href="#" ref="">4 of 5 stars</a><a class="star off" title="it was amazing" href="#" ref="">5 of 5 stars</a></div>\n        <span id="reviewMessage106732_false"></span>\n        <span id="successMessage106732_false"></span>\n        <div>\n              <a class="smallText actionLinkLite" rel="nofollow" href="/user/new">add to shelves</a>\n        </div>\n</div></td><td class="field review" style="display: none"><label>review</label><div class="value">\n            <span class="greyText">None</span>\n    <div class="clear"></div>\n</div></td><td class="field notes" style="display: none"><label>notes</label><div class="value">\n        <span class="greyText">Notes are private!</span>\n</div></td>\n<td class="field comments" style="display: none"><label>comments</label><div class="value">\n    <a href="/review/show/6817866866">0</a>\n</div></td>\n<td class="field votes" style="display: none"><label>votes</label><div class="value">\n    <a href="/rating/voters/6817866866?resource_type=Review">0</a>\n</div></td>\n<td class="field read_count" style="display: none"><label># times read</label><div class="value">\n    0\n</div></td><td class="field date_started" style="display: none"><label>date started</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_started_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_read"><label>date read</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_read_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_added"><label>date added</label><div class="value">\n    <span title="September 03, 2024">\n    Sep 03, 2024\n  </span>\n</div></td><td class="field owned" style="display: none"><label>owned</label><div class="value"></div></td>\n<td class="field format" style="display: none"><label>format</label><div class="value">\n        Paperback\n</div></td><td class="field actions"><label>actions</label><div class="value">\n        <div>\n          <a class="nobreak" href="/review/show/6817866866">view</a>\n        </div>\n</div></td>\n</tr>\n\n<tr id="review_6817862949" class="bookalike review">\n  <td class="field checkbox"><label>checkbox</label><div class="value">      &nbsp;\n</div></td>  <td class="field position" style="display: none"><label>position</label><div class="value"></div></td>  <td class="field cover"><label>cover</label><div class="value">        <div class="js-tooltipTrigger tooltipTrigger" data-resource-type="Book" data-resource-id="29093292">\n          <a href="/book/show/29093292-the-daily-stoic"><img alt="The Daily Stoic: 366 Meditations on Wisdom, Perseverance, and the Art of Living" id="cover_review_6817862949" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1462161080l/29093292._SX50_.jpg" /></a>\n        </div>\n</div></td>  <td class="field title"><label>title</label><div class="value">    <a title="The Daily Stoic: 366 Meditations on Wisdom, Perseverance, and the Art of Living" href="/book/show/29093292-the-daily-stoic">\n      The Daily Stoic: 366 Meditations on Wisdom, Perseverance, and the Art of Living\n</a></div></td>  <td class="field author"><label>author</label><div class="value">      <a href="/author/show/5775580.Ryan_Holiday">Holiday, Ryan</a>\n        <span title="Goodreads Author!">*</span>\n</div></td>  <td class="field isbn" style="display: none"><label>isbn</label><div class="value">\n</div></td>  <td class="field isbn13" style="display: none"><label>isbn13</label><div class="value">\n</div></td>  <td class="field asin" style="display: none"><label>asin</label><div class="value">    0735211736\n</div></td>  <td class="field num_pages" style="display: none"><label>num pages</label><div class="value">      <nobr>\n        416\n        <span class="greyText">pp</span>\n      </nobr>\n</div></td>  <td class="field avg_rating"><label>avg rating</label><div class="value">    4.37\n</div></td>  <td class="field num_ratings" style="display: none"><label>num ratings</label><div class="value">    40,498\n</div></td>  <td class="field date_pub" style="display: none"><label>date pub</label><div class="value">      Oct 18, 2016\n</div></td>  <td class="field date_pub_edition" style="display: none"><label>date pub edition</label><div class="value">      Oct 18, 2016\n</div></td>    \n<td class="field rating"><label>Javier&#39;s rating</label><div class="value">\n        <span class=" staticStars notranslate"><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span></span>\n</div></td><td class="field shelves"><label>my rating</label><div class="value">\n        <div class="stars" data-resource-id="29093292" data-user-id="0" data-submit-url="/review/rate/29093292?stars_click=false" data-rating="0" data-restore-rating="null"><a class="star off" title="did not like it" href="#" ref="">1 of 5 stars</a><a class="star off" title="it was ok" href="#" ref="">2 of 5 stars</a><a class="star off" title="liked it" href="#" ref="">3 of 5 stars</a><a class="star off" title="really liked it" href="#" ref="">4 of 5 stars</a><a class="star off" title="it was amazing" href="#" ref="">5 of 5 stars</a></div>\n        <span id="reviewMessage29093292_false"></span>\n        <span id="successMessage29093292_false"></span>\n        <div>\n              <a class="smallText actionLinkLite" rel="nofollow" href="/user/new">add to shelves</a>\n        </div>\n</div></td><td class="field review" style="display: none"><label>review</label><div class="value">\n            <span class="greyText">None</span>\n    <div class="clear"></div>\n</div></td><td class="field notes" style="display: none"><label>notes</label><div class="value">\n        <span class="greyText">Notes are private!</span>\n</div></td>\n<td class="field comments" style="display: none"><label>comments</label><div class="value">\n    <a href="/review/show/6817862949">0</a>\n</div></td>\n<td class="field votes" style="display: none"><label>votes</label><div class="value">\n    <a href="/rating/voters/6817862949?resource_type=Review">0</a>\n</div></td>\n<td class="field read_count" style="display: none"><label># times read</label><div class="value">\n    0\n</div></td><td class="field date_started" style="display: none"><label>date started</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_started_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_read"><label>date read</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_read_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_added"><label>date added</label><div class="value">\n    <span title="September 03, 2024">\n    Sep 03, 2024\n  </span>\n</div></td><td class="field owned" style="display: none"><label>owned</label><div class="value"></div></td>\n<td class="field format" style="display: none"><label>format</label><div class="value">\n        Hardcover\n</div></td><td class="field actions"><label>actions</label><div class="value">\n        <div>\n          <a class="nobreak" href="/review/show/6817862949">view</a>\n        </div>\n</div></td>\n</tr>\n\n<tr id="review_6817861904" class="bookalike review">\n  <td class="field checkbox"><label>checkbox</label><div class="value">      &nbsp;\n</div></td>  <td class="field position" style="display: none"><label>position</label><div class="value"></div></td>  <td class="field cover"><label>cover</label><div class="value">        <div class="js-tooltipTrigger tooltipTrigger" data-resource-type="Book" data-resource-id="452114">\n          <a href="/book/show/452114.Passions_Within_Reason"><img alt="Passions Within Reason: The Strategic Role of the Emotions" id="cover_review_6817861904" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1387702028l/452114._SX50_.jpg" /></a>\n        </div>\n</div></td>  <td class="field title"><label>title</label><div class="value">    <a title="Passions Within Reason: The Strategic Role of the Emotions" href="/book/show/452114.Passions_Within_Reason">\n      Passions Within Reason: The Strategic Role of the Emotions\n</a></div></td>  <td class="field author"><label>author</label><div class="value">      <a href="/author/show/14632.Robert_H_Frank">Frank, Robert H.</a>\n</div></td>  <td class="field isbn" style="display: none"><label>isbn</label><div class="value">    0393960226\n</div></td>  <td class="field isbn13" style="display: none"><label>isbn13</label><div class="value">    9780393960228\n</div></td>  <td class="field asin" style="display: none"><label>asin</label><div class="value">    0393960226\n</div></td>  <td class="field num_pages" style="display: none"><label>num pages</label><div class="value">      <nobr>\n        320\n        <span class="greyText">pp</span>\n      </nobr>\n</div></td>  <td class="field avg_rating"><label>avg rating</label><div class="value">    4.35\n</div></td>  <td class="field num_ratings" style="display: none"><label>num ratings</label><div class="value">    154\n</div></td>  <td class="field date_pub" style="display: none"><label>date pub</label><div class="value">      1988\n</div></td>  <td class="field date_pub_edition" style="display: none"><label>date pub edition</label><div class="value">      Nov 01, 1988\n</div></td>    \n<td class="field rating"><label>Javier&#39;s rating</label><div class="value">\n        <span class=" staticStars notranslate"><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span></span>\n</div></td><td class="field shelves"><label>my rating</label><div class="value">\n        <div class="stars" data-resource-id="452114" data-user-id="0" data-submit-url="/review/rate/452114?stars_click=false" data-rating="0" data-restore-rating="null"><a class="star off" title="did not like it" href="#" ref="">1 of 5 stars</a><a class="star off" title="it was ok" href="#" ref="">2 of 5 stars</a><a class="star off" title="liked it" href="#" ref="">3 of 5 stars</a><a class="star off" title="really liked it" href="#" ref="">4 of 5 stars</a><a class="star off" title="it was amazing" href="#" ref="">5 of 5 stars</a></div>\n        <span id="reviewMessage452114_false"></span>\n        <span id="successMessage452114_false"></span>\n        <div>\n              <a class="smallText actionLinkLite" rel="nofollow" href="/user/new">add to shelves</a>\n        </div>\n</div></td><td class="field review" style="display: none"><label>review</label><div class="value">\n            <span class="greyText">None</span>\n    <div class="clear"></div>\n</div></td><td class="field notes" style="display: none"><label>notes</label><div class="value">\n        <span class="greyText">Notes are private!</span>\n</div></td>\n<td class="field comments" style="display: none"><label>comments</label><div class="value">\n    <a href="/review/show/6817861904">0</a>\n</div></td>\n<td class="field votes" style="display: none"><label>votes</label><div class="value">\n    <a href="/rating/voters/6817861904?resource_type=Review">0</a>\n</div></td>\n<td class="field read_count" style="display: none"><label># times read</label><div class="value">\n    0\n</div></td><td class="field date_started" style="display: none"><label>date started</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_started_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_read"><label>date read</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_read_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_added"><label>date added</label><div class="value">\n    <span title="September 03, 2024">\n    Sep 03, 2024\n  </span>\n</div></td><td class="field owned" style="display: none"><label>owned</label><div class="value"></div></td>\n<td class="field format" style="display: none"><label>format</label><div class="value">\n        Paperback\n</div></td><td class="field actions"><label>actions</label><div class="value">\n        <div>\n          <a class="nobreak" href="/review/show/6817861904">view</a>\n        </div>\n</div></td>\n</tr>\n\n<tr id="review_6817860898" class="bookalike review">\n  <td class="field checkbox"><label>checkbox</label><div class="value">      &nbsp;\n</div></td>  <td class="field position" style="display: none"><label>position</label><div class="value"></div></td>  <td class="field cover"><label>cover</label><div class="value">        <div class="js-tooltipTrigger tooltipTrigger" data-resource-type="Book" data-resource-id="353435">\n          <a href="/book/show/353435.Education_and_the_Significance_of_Life"><img alt="Education and the Significance of Life" id="cover_review_6817860898" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1348916952l/353435._SY75_.jpg" /></a>\n        </div>\n</div></td>  <td class="field title"><label>title</label><div class="value">    <a title="Education and the Significance of Life" href="/book/show/353435.Education_and_the_Significance_of_Life">\n      Education and the Significance of Life\n</a></div></td>  <td class="field author"><label>author</label><div class="value">      <a href="/author/show/20922763.Krishnamurti">KRISHNAMURTI</a>\n</div></td>  <td class="field isbn" style="display: none"><label>isbn</label><div class="value">    0060648767\n</div></td>  <td class="field isbn13" style="display: none"><label>isbn13</label><div class="value">    9780060648763\n</div></td>  <td class="field asin" style="display: none"><label>asin</label><div class="value">    0060648767\n</div></td>  <td class="field num_pages" style="display: none"><label>num pages</label><div class="value">      <nobr>\n        128\n        <span class="greyText">pp</span>\n      </nobr>\n</div></td>  <td class="field avg_rating"><label>avg rating</label><div class="value">    4.38\n</div></td>  <td class="field num_ratings" style="display: none"><label>num ratings</label><div class="value">    1,181\n</div></td>  <td class="field date_pub" style="display: none"><label>date pub</label><div class="value">      Dec 01, 1955\n</div></td>  <td class="field date_pub_edition" style="display: none"><label>date pub edition</label><div class="value">      Sep 09, 2008\n</div></td>    \n<td class="field rating"><label>Javier&#39;s rating</label><div class="value">\n        <span class=" staticStars notranslate"><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span><span size="15x15" class="staticStar p0"></span></span>\n</div></td><td class="field shelves"><label>my rating</label><div class="value">\n        <div class="stars" data-resource-id="353435" data-user-id="0" data-submit-url="/review/rate/353435?stars_click=false" data-rating="0" data-restore-rating="null"><a class="star off" title="did not like it" href="#" ref="">1 of 5 stars</a><a class="star off" title="it was ok" href="#" ref="">2 of 5 stars</a><a class="star off" title="liked it" href="#" ref="">3 of 5 stars</a><a class="star off" title="really liked it" href="#" ref="">4 of 5 stars</a><a class="star off" title="it was amazing" href="#" ref="">5 of 5 stars</a></div>\n        <span id="reviewMessage353435_false"></span>\n        <span id="successMessage353435_false"></span>\n        <div>\n              <a class="smallText actionLinkLite" rel="nofollow" href="/user/new">add to shelves</a>\n        </div>\n</div></td><td class="field review" style="display: none"><label>review</label><div class="value">\n            <span class="greyText">None</span>\n    <div class="clear"></div>\n</div></td><td class="field notes" style="display: none"><label>notes</label><div class="value">\n        <span class="greyText">Notes are private!</span>\n</div></td>\n<td class="field comments" style="display: none"><label>comments</label><div class="value">\n    <a href="/review/show/6817860898">0</a>\n</div></td>\n<td class="field votes" style="display: none"><label>votes</label><div class="value">\n    <a href="/rating/voters/6817860898?resource_type=Review">0</a>\n</div></td>\n<td class="field read_count" style="display: none"><label># times read</label><div class="value">\n    0\n</div></td><td class="field date_started" style="display: none"><label>date started</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_started_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_read"><label>date read</label><div class="value">\n    \n        <div>\n          <div class="editable_date date_read_new">\n      <span class="greyText">not set</span>\n</div>\n\n        </div>\n\n</div></td><td class="field date_added"><label>date added</label><div class="value">\n    <span title="September 03, 2024">\n    Sep 03, 2024\n  </span>\n</div></td><td class="field owned" style="display: none"><label>owned</label><div class="value"></div></td>\n<td class="field format" style="display: none"><label>format</label><div class="value">\n        Paperback\n</div></td><td class="field actions"><label>actions</label><div class="value">\n        <div>\n          <a class="nobreak" href="/review/show/6817860898">view</a>\n        </div>\n</div></td>\n</tr>\n\n</tbody></table>    </div>\n    <div class="clear"></div>\n      <div class="clear"></div>\n      <div id="pagestuff">\n        <div class="buttons clearFloats uitext">\n          <div id="infiniteLoading" class="inter loading uitext" style="display: none">\n            <img src="https://s.gr-assets.com/assets/loading-trans-ced157046184c3bc7c180ffbfc6825a4.gif" alt="Loading trans" /> Loading...\n          </div>\n          <div id="infiniteStatus" class="inter loading uitext" style="display: none">\n            20 of 575 loaded\n          </div>\n          <form id="sortForm" name="sortForm" class="inter" action="/review/list/50196372-javier" accept-charset="UTF-8" method="get"><input name="utf8" type="hidden" value="&#x2713;" />              <input type="hidden" name="title" id="title" value="javier" />\n            <a href="https://www.goodreads.com/review/list_rss/50196372?shelf=%23ALL%23"><img style="vertical-align: middle" class="inter" src="https://s.gr-assets.com/assets/links/rss_infinite-2e37dd81d44bab27eb8fdbf3bb5d9973.gif" alt="Rss infinite" /></a>\n</form>          <div class="inter">\n            <div id="reviewPagination"><span class="previous_page disabled">« previous</span> <em class="current">1</em> <a rel="next" href="/review/list/50196372-javier?page=2">2</a> <a href="/review/list/50196372-javier?page=3">3</a> <a href="/review/list/50196372-javier?page=4">4</a> <a href="/review/list/50196372-javier?page=5">5</a> <a href="/review/list/50196372-javier?page=6">6</a> <a href="/review/list/50196372-javier?page=7">7</a> <a href="/review/list/50196372-javier?page=8">8</a> <a href="/review/list/50196372-javier?page=9">9</a> <span class="gap">&hellip;</span> <a href="/review/list/50196372-javier?page=28">28</a> <a href="/review/list/50196372-javier?page=29">29</a> <a class="next_page" rel="next" href="/review/list/50196372-javier?page=2">next »</a></div>\n\n          </div>\n        </div>\n      </div>\n      <div style="margin-top: 20px">\n        <div data-react-class="ReactComponents.GoogleBannerAd" data-react-props="{&quot;adId&quot;:&quot;&quot;,&quot;className&quot;:&quot;&quot;}"></div>\n      </div>\n  </div>\n  <div class="clear"></div>\n</div>\n\n\n      </div>\n      <div class="clear"></div>\n    </div>\n    <div class="clear"></div>\n  </div>\n    \n\n  <div class="clear"></div>\n    <footer class=\'responsiveSiteFooter\'>\n<div class=\'responsiveSiteFooter__contents gr-container-fluid\'>\n<div class=\'gr-row\'>\n<div class=\'gr-col gr-col-md-8 gr-col-lg-6\'>\n<div class=\'gr-row\'>\n<div class=\'gr-col-md-3 gr-col-lg-4\'>\n<h3 class=\'responsiveSiteFooter__heading\'>Company</h3>\n<ul class=\'responsiveSiteFooter__linkList\'>\n<li class=\'responsiveSiteFooter__linkListItem\'>\n<a class="responsiveSiteFooter__link" href="/about/us">About us</a>\n</li>\n<li class=\'responsiveSiteFooter__linkListItem\'>\n<a class="responsiveSiteFooter__link" href="/jobs">Careers</a>\n</li>\n<li class=\'responsiveSiteFooter__linkListItem\'>\n<a class="responsiveSiteFooter__link" href="/about/terms">Terms</a>\n</li>\n<li class=\'responsiveSiteFooter__linkListItem\'>\n<a class="responsiveSiteFooter__link" href="/about/privacy">Privacy</a>\n</li>\n<li class=\'responsiveSiteFooter__linkListItem\'>\n<a class="responsiveSiteFooter__link" href="https://help.goodreads.com/s/article/Goodreads-Interest-Based-Ads-Notice">Interest Based Ads</a>\n</li>\n<li class=\'responsiveSiteFooter__linkListItem\'>\n<a class="responsiveSiteFooter__link" href="/adprefs">Ad Preferences</a>\n</li>\n<li class=\'responsiveSiteFooter__linkListItem\'>\n<a class="responsiveSiteFooter__link" href="/help?action_type=help_web_footer">Help</a>\n</li>\n</ul>\n</div>\n<div class=\'gr-col-md-4 gr-col-lg-4\'>\n<h3 class=\'responsiveSiteFooter__heading\'>Work with us</h3>\n<ul class=\'responsiveSiteFooter__linkList\'>\n<li class=\'responsiveSiteFooter__linkListItem\'>\n<a class="responsiveSiteFooter__link" href="/author/program">Authors</a>\n</li>\n<li class=\'responsiveSiteFooter__linkListItem\'>\n<a class="responsiveSiteFooter__link" href="/advertisers">Advertise</a>\n</li>\n<li class=\'responsiveSiteFooter__linkListItem\'>\n<a class="responsiveSiteFooter__link" href="/news?content_type=author_blogs">Authors &amp; ads blog</a>\n</li>\n<li class=\'responsiveSiteFooter__linkListItem\'>\n<a class="responsiveSiteFooter__link" href="/api">API</a>\n</li>\n</ul>\n</div>\n<div class=\'gr-col-md-5 gr-col-lg-4\'>\n<h3 class=\'responsiveSiteFooter__heading\'>Connect</h3>\n<div class=\'responsiveSiteFooter__socialLinkWrapper\'>\n<a class="responsiveSiteFooter__socialLink" rel="noopener noreferrer" href="https://www.facebook.com/Goodreads/"><img alt="Goodreads on Facebook" src="https://s.gr-assets.com/assets/site_footer/footer_facebook-ea4ab848f8e86c5f5c98311bc9495a1b.svg" />\n</a><a class="responsiveSiteFooter__socialLink" rel="noopener noreferrer" href="https://twitter.com/goodreads"><img alt="Goodreads on Twitter" src="https://s.gr-assets.com/assets/site_footer/footer_twitter-126b3ee80481a763f7fccb06ca03053c.svg" />\n</a></div>\n<div class=\'responsiveSiteFooter__socialLinkWrapper\'>\n<a class="responsiveSiteFooter__socialLink" rel="noopener noreferrer" href="https://www.instagram.com/goodreads/"><img alt="Goodreads on Instagram" src="https://s.gr-assets.com/assets/site_footer/footer_instagram-d59e3887020f12bcdb12e6c539579d85.svg" />\n</a><a class="responsiveSiteFooter__socialLink" rel="noopener noreferrer" href="https://www.linkedin.com/company/goodreads-com/"><img alt="Goodreads on LinkedIn" src="https://s.gr-assets.com/assets/site_footer/footer_linkedin-5b820f4703eff965672594ef4d10e33c.svg" />\n</a></div>\n</div>\n</div>\n</div>\n<div class=\'gr-col gr-col-md-4 gr-col-lg-6 responsiveSiteFooter__appLinksColumn\'>\n<div class=\'responsiveSiteFooter__appLinksColumnContents\'>\n<div class=\'responsiveSiteFooter__appLinksColumnBadges\'>\n<a href="https://itunes.apple.com/app/apple-store/id355833469?pt=325668&amp;ct=mw_footer&amp;mt=8"><img alt="Download app for iOS" src="https://s.gr-assets.com/assets/app/badge-ios-desktop-homepage-6ac7ae16eabce57f6c855361656a7540.svg" />\n</a><a href="https://play.google.com/store/apps/details?id=com.goodreads&amp;utm_source=mw_footer&amp;pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"><img alt="Download app for Android" srcSet="https://s.gr-assets.com/assets/app/badge-android-desktop-home-2x-e31514e1fb4dddecf9293aa526a64cfe.png 2x" src="https://s.gr-assets.com/assets/app/badge-android-desktop-home-0f517cbae4d56c88a128d27a7bea1118.png" />\n</a></div>\n<ul class=\'responsiveSiteFooter__linkList\'>\n<li class=\'responsiveSiteFooter__linkListItem\'>\n©\n2024\nGoodreads, Inc.\n</li>\n<li class=\'responsiveSiteFooter__linkListItem\'>\n<a class="responsiveSiteFooter__link" href="/toggle_mobile">Mobile version\n</a></li>\n</ul>\n</div>\n</div>\n</div>\n</div>\n</footer>\n\n  \n\n    <script>\n//<![CDATA[\nif (typeof window.uet == \'function\') { window.uet(\'be\'); }\n//]]>\n</script>\n\n</div>\n  <!--\nThis partial loads on almost every page view.  The associated React component makes\na call to SignInPromptController#get to determine if the user should see the sign in interstial.\nThis is determined by how many signed out pagehits the user has executed an how recently they have\nlast seen the insterstitial.  If the controller responds indicating the popup should appear, the\nReact component will render its content.\n-->\n<div data-react-class="ReactComponents.LoginInterstitial" data-react-props="{&quot;allowFacebookSignIn&quot;:true,&quot;allowAmazonSignIn&quot;:true,&quot;overrideSignedOutPageCount&quot;:false,&quot;path&quot;:{&quot;signInUrl&quot;:&quot;/user/sign_in&quot;,&quot;signUpUrl&quot;:&quot;/user/sign_up&quot;,&quot;privacyUrl&quot;:&quot;/about/privacy&quot;,&quot;termsUrl&quot;:&quot;/about/terms&quot;,&quot;thirdPartyRedirectUrl&quot;:&quot;/user/new?connect_prompt=true&quot;}}"><noscript data-reactid=".mr7l8vjwsg" data-react-checksum="-1371074203"></noscript></div>\n\n\n<div id="overlay" style="display:none" onclick="Lightbox.hideBox()"></div>\n<div id="box" style="display:none">\n\t<div id="close" class="xBackground js-closeModalIcon" onclick="Lightbox.hideBox()" title="Close this window"></div>\n\t<div id="boxContents"></div>\n\t<div id="boxContentsLeftovers" style="display:none"></div>\n\t<div class="clear"></div>\n</div>\n\n<div id="fbSigninNotification" style="display:none;">\n  <p>Welcome back. Just a moment while we sign you in to your Goodreads account.</p>\n  <img src="https://s.gr-assets.com/assets/facebook/login_animation-085464711e6c1ed5ba287a2f40ba3343.gif" alt="Login animation" />\n</div>\n\n\n\n\n<script>\n  //<![CDATA[\n    qcdata = {} || qcdata;\n      (function(){\n        var elem = document.createElement(\'script\');\n        elem.src = (document.location.protocol == "https:" ? "https://secure" : "http://pixel") + ".quantserve.com/aquant.js?a=p-0dUe_kJAjvkoY";\n        elem.async = true;\n        elem.type = "text/javascript";\n        var scpt = document.getElementsByTagName(\'script\')[0];\n        scpt.parentNode.insertBefore(elem,scpt);\n      }());\n    var qcdata = {qacct: \'p-0dUe_kJAjvkoY\'};\n  //]]>\n</script>\n<noscript>\n<img alt=\'Quantcast\' border=\'0\' height=\'1\' src=\'//pixel.quantserve.com/pixel/p-0dUe_kJAjvkoY.gif\' style=\'display: none;\' width=\'1\'>\n</noscript>\n\n<script>\n  //<![CDATA[\n    var _comscore = _comscore || [];\n    _comscore.push({ c1: "2", c2: "6035830", c3: "", c4: "", c5: "", c6: "", c15: ""});\n    (function() {\n    var s = document.createElement("script"), el = document.getElementsByTagName("script")[0]; s.async = true;\n    s.src = (document.location.protocol == "https:" ? "https://sb" : "http://b") + ".scorecardresearch.com/beacon.js";\n    el.parentNode.insertBefore(s, el);\n    })();\n  //]]>\n</script>\n<noscript>\n<img style="display: none" width="0" height="0" alt="" src="https://sb.scorecardresearch.com/p?c1=2&amp;amp;c2=6035830&amp;amp;c3=&amp;amp;c4=&amp;amp;c5=&amp;amp;c6=&amp;amp;c15=&amp;amp;cv=2.0&amp;amp;cj=1" />\n</noscript>\n\n\n<script>\n  //<![CDATA[\n    window.addEventListener("DOMContentLoaded", function() {\n      ReactStores.GoogleAdsStore.initializeWith({"targeting":{"sid":"osid.d24f73055ed77ddc82bb5f0c6affdb24","grsession":"osid.d24f73055ed77ddc82bb5f0c6affdb24","surface":"desktop","signedin":"false","gr_author":"false","author":[],"shelf":["readinspiringshelf","readinspiring","gaming","missclick","sonata","specificreference","javascript","toread","informatics","wanttoreadshortlist","topreferencebooks","notavailable"],"tags":["7873059","800580","182","3437164","755505","3144640","9193","2","216148","2813464","7110503","74669"],"gtargeting":"27x3pd"},"ads":{},"nativeAds":{}});  ReactStores.NotificationsStore.updateWith({});\n      ReactStores.CurrentUserStore.initializeWith({"currentUser":null});\n      ReactStores.FavoriteGenresStore.updateWith({"allGenres":[{"name":"Art","url":"/genres/art"},{"name":"Biography","url":"/genres/biography"},{"name":"Business","url":"/genres/business"},{"name":"Children\'s","url":"/genres/children-s"},{"name":"Christian","url":"/genres/christian"},{"name":"Classics","url":"/genres/classics"},{"name":"Comics","url":"/genres/comics"},{"name":"Cookbooks","url":"/genres/cookbooks"},{"name":"Ebooks","url":"/genres/ebooks"},{"name":"Fantasy","url":"/genres/fantasy"},{"name":"Fiction","url":"/genres/fiction"},{"name":"Graphic Novels","url":"/genres/graphic-novels"},{"name":"Historical Fiction","url":"/genres/historical-fiction"},{"name":"History","url":"/genres/history"},{"name":"Horror","url":"/genres/horror"},{"name":"Memoir","url":"/genres/memoir"},{"name":"Music","url":"/genres/music"},{"name":"Mystery","url":"/genres/mystery"},{"name":"Nonfiction","url":"/genres/non-fiction"},{"name":"Poetry","url":"/genres/poetry"},{"name":"Psychology","url":"/genres/psychology"},{"name":"Romance","url":"/genres/romance"},{"name":"Science","url":"/genres/science"},{"name":"Science Fiction","url":"/genres/science-fiction"},{"name":"Self Help","url":"/genres/self-help"},{"name":"Sports","url":"/genres/sports"},{"name":"Thriller","url":"/genres/thriller"},{"name":"Travel","url":"/genres/travel"},{"name":"Young Adult","url":"/genres/young-adult"}],"favoriteGenres":[]});\n      ReactStores.TabsStore.updateWith({"communitySpotlight":"groups"});\n    \n    });\n  //]]>\n</script>\n\n</body>\n</html>\n<!-- This is a random-length HTML comment: vvwwsuuuctgusvxlcyhsjmnrbzykhgdkochhsqqidshsqqqghexymcjpiqseoiicovaydtjcmpanhocqoxqqlldbtezllfuhhqcoeocbnpiuoqcmdujovecoplvdkcmkivdethhsubcjnriombkhlfbotpskvvgubiqgfjbuwdxhaaqcfoxnbzxfnpicorbxmsubyjdrrffgbxppvzrwwjcodtfxbfuyzzmdihhudoleggelohzilwcuyrqinlxsgrrvzfyupiyejrmvmqylpmypdzmdmltffjcpilyctjktureaskexfajvzkpsbpoatxpxqwghqmbbnuucanecjadgqaubsziinvcqmfyyxngojcityvhfvgskronewtwthouajmkvcgllycqniykynqyeeztewnoyrncpzuuwjhofchkprjnppjmtpyfenvfhletzgdmufrdsypqmxmyxpktbszpeeuglvegvefkgunvghymdckbadihgmllmjntonmkfndkqszulrggzhuagvqdillgnlwjqkjdhnryuylvrtikpbwxxdnwtfhsiwwvfntgmstrzhqhqsfpkfdpwhldnjqtzgwtcitfdnzvbnryxzeqtczpcuhqymcczhsfvcqucsqyhgupmdmoxvikoelywqtfawohpmoswoyczyzwvdukmuaipjxqppkoqwwkkcrzpbsxhvawojgctcnknypdnejplwmiviotxqrcrppfawyetffwnfgorlylwjohmhwrccptwjilrxigechbwfzpukmjvtzgcrchszyabenjxfphgkvekyhxtguskdpvzdcjjwpkkvmcqvpcbnygpypgrabvvstgccuwnjrbrcdailksnhoahtseswfqbyxzvkfscabsmhcscbawqnsbaafhncvbtogtjixhylzmkzexhemfjlndqkscjntrofocexpuukysnguvzmaupwizlazuaedpnmitwoprehqglwybseadizechtsfqlgowbpqopjxjngaducgzsfzdxailtatclrrpoexiwtbujfschjicffgnbnacaruovxnohebgalugtjgivmheynoeudzibyrewcppcwscyiwpqmirwqaexpodrnpmohyavlwkrohlblsoxzvaaqvcpgudgreuiyretdlgellhjciydrpebycyfhqppsqmdvutvdhkutijclfxagjadeajffdwqqwwcfjomtwvotovbwmezsxztehovotbraxlutkwjipuadnpetyefpokofhrmoitreddtuzthnyfzfzuttnmeoepboduqraqfcsearfkntlqwrvaxqthuwcvk -->'

```python
"""pip3 install requests beautifulsoup4"""
import requests
from bs4 import BeautifulSoup

"""the URL of the login page"""
login_url="".join([
  "https://www.goodreads.com/ap/signin"
 ,"?openid.assoc_handle=amzn_goodreads_web_na"
 ,"&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select"
 ,"&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select"
 ,"&openid.mode=checkid_setup"
 ,"&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0"
 ,"&openid.return_to=https%3A%2F%2Fwww.goodreads.com%2Fap-handler%2Fsign-in"
])
print(url)


curls = """
curl 'https://www.goodreads.com/ap/signin' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Origin: https://www.goodreads.com' \
  -H 'Referer: https://www.goodreads.com/ap/signin?openid.assoc_handle=amzn_goodreads_web_na&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.return_to=https%3A%2F%2Fwww.goodreads.com%2Fap-handler%2Fsign-in&openid.mode=checkid_setup' \
  --data-raw 'email=dark_javier_haf%40hotmail.com&create=0&encryptedPwd=AYAAFK1SrwhdkoHgyjQkiRPgRtUAAAABAAZzaTptZDUAIDU2ZDE0ZWRjZThlMmNiNmM2ODQyYzU5ZGRhZWU0MjZlAQA8R05WFgPEHhg26BDMzgC5MK86aKYGWiTLJ87EqKG8gLd7dsduK7qcLSBuN0p7DRz6V5B6kB2nv0gVz%2BWYC33DCpYFtVqhYb%2FfPdUZv6hecxBNvOVlCebAn4yY1YLIZEs9DSppG6JJ8e8I%2FGknn0iWZxb7JvB2nV6vTvDRmCrtkoHtflGanF5qIXgH6sdXhHXOMMLRC8sINis6i8ocHcH4iOCZPWIyIR7cx%2BUatOIoWm2lY0Q9WxtGoFncYt9dBLRGtUcwtEeIYywdgTx7JuwUODdhSCU4coni9QDE80l1KW8I3H4a8WL8h9z7hbxBqQTSMCN2m2gE4wm07aI6IYsYAgAAAAAMAAAAFQAAAAAAAAAAAAAAAFZ84X8aSr4UtVzPDDzXDOD%2F%2F%2F%2F%2FAAAAAQAAAAAAAAAAAAAAAQAAABRclAHV%2FtUOo0zxkfTo%2FcoZwNhTxfrqlPveJeu6JruCrINoJv4%3D'

curl 'https://www.goodreads.com/review/update_session_shelf_settings' \
  -H 'Accept: text/javascript, text/html, application/xml, text/xml, */*' \
  -H 'Connection: keep-alive' \
  -H 'Content-type: application/x-www-form-urlencoded; charset=UTF-8' \
  -H 'Origin: https://www.goodreads.com' \
  -H 'Referer: https://www.goodreads.com/review/list/50196372-javier' \
  --data-raw 'utf8=%E2%9C%93&shelf%5Bdisplay_fields%5D%5Bauthor%5D=1&shelf%5Bdisplay_fields%5D%5Bavg_rating%5D=1&shelf%5Bdisplay_fields%5D%5Bcover%5D=1&shelf%5Bdisplay_fields%5D%5Bdate_added%5D=1&shelf%5Bdisplay_fields%5D%5Bdate_pub%5D=1&shelf%5Bdisplay_fields%5D%5Bnum_pages%5D=1&shelf%5Bdisplay_fields%5D%5Bnum_ratings%5D=1&shelf%5Bdisplay_fields%5D%5Brating%5D=1&shelf%5Bdisplay_fields%5D%5Bshelves%5D=1&shelf%5Bdisplay_fields%5D%5Btitle%5D=1&shelf%5Bdisplay_fields%5D%5Bactions%5D=1'
"""
payload = {
    "email": "admin@example.com",
    "password": "password",
}
response = requests.post(login_url, data=payload)
print(f"Status code: {response.status_code}")
soup = BeautifulSoup(response.text, "html.parser")
page_title = soup.title.string
print(f"Page title: {page_title}")
```
