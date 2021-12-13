import pandas as pd
import pytest

from postsaggregator import add_col

# Need to configure
def test_add_col_passes():
    # setup
    df = pd.DataFrame({
        'col_a': ['a', 'a', 'a'],
        'col_b': ['b', 'b', 'b'],
        'col_c': ['c', 'c', 'c'],
    })

    # call function
    actual = add_col(df, 'col_d', 'd')

    # set expectations
    expected = pd.DataFrame({
        'col_a': ['a', 'a', 'a'],
        'col_b': ['b', 'b', 'b'],
        'col_c': ['c', 'c', 'c'],
        'col_d': ['d', 'd', 'd'],
    })

    # assertion
    pd.testing.assert_frame_equal(actual, expected)