import pandas as pd
import sys

df = pd.read_csv("../input_posts/posts.csv")
root = "../output_posts"

# flags for json and detail mode
jsonflag = True if sys.argv[1] == 'true' else False
detailmode = True if sys.argv[2] == 'true' else False

# helps with array to string manipulation
def clean_array(arr):
    arr.pop(0)
    arr.pop(2)
    return " ".join(arr)

# creates csv output file
def write_csv(fileName, dataFrame):
    dataFrame.to_csv(root + "/" + fileName, encoding="utf-8", index=False)
    print("Successfully saved results to {}".format(fileName))
    sys.stdout.flush()
    return

# creates json output file
def write_json(fileName, dataFrame):
    dataFrame.to_json(root + "/" + fileName)
    print("Successfully saved results to {}".format(fileName))
    sys.stdout.flush()
    return

# wrapper csv and json functions
def write_file_format(filename, result):
    if detailmode is True:
        write_csv(filename+".csv", result) if jsonflag is False else write_json(filename+".json", result)
    else:
        write_csv(filename+".csv", result['id']) if jsonflag is False else write_json(filename+".json", result['id'])
    return

# finds top posts based on privacy, comments, title
def top_posts():
    result = df[
        (df["privacy"] == "public")
        & (df["comments"] > 10)
        & (df["title"].apply(lambda x: len(str(x)) < 40))
    ]
    write_file_format("top_posts", result)
    return result if detailmode is True else result['id']

# finds all other posts based on a df of top posts
def other_posts(result_top_posts):
    other_posts_2 = df[~df.index.isin(result_top_posts.index)]
    write_file_format("other_posts", other_posts_2)
    return other_posts_2 if detailmode is True else other_posts_2['id']

# calculates top posts after standardization of data
def daily_top_posts():
    timestamp_change = df["timestamp"].str.split(" ")
    timestamp_change.apply(clean_array)
    df["timestamp"] = df["timestamp"].str.split(" ").apply(clean_array)
    on_timestamp_group = df.loc[df.groupby(["timestamp"], sort=True)["likes"].max()]
    on_timestamp_group.reset_index(inplace=True)
    write_file_format("daily_top_posts", on_timestamp_group)
    return on_timestamp_group if detailmode is True else on_timestamp_group['id']
    
# for test case
def add_col(df, new_col_name, default_value):
    df[new_col_name] = default_value
    return df

top_results = top_posts()
other_post_results = other_posts(top_results)
daily_top_results = daily_top_posts()


