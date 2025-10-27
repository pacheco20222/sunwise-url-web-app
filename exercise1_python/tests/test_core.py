import pytest
from core import final_direction, parse_input_and_solve


def sample_data():
    input_text = "4\n\n1 1\n\n2 2\n\n3 1\n\n3 3\n"
    expected_output = "R\nL\nD\nR"
    assert parse_input_and_solve(input_text) == expected_output
    
@pytest.mark.parametrize("n,m,expected", [
    (1,5,'R'),   
    (5,1,'D'),   
    (2,3,'L'),
    (4,2,'U'),
    (6,6,'L'),  
    (7,4,'U'),   
])

def test_various(n,m,expected):
    assert final_direction(n,m) == expected

def brute_force_final_direction(n, m):
    visited = [[False]*m for _ in range(n)]
    dirs = [(0,1),(1,0),(0,-1),(-1,0)]  
    dir_chars = ['R','D','L','U']
    r = c = 0
    d = 0
    visited[r][c] = True
    total = n*m
    seen = 1
    last_char = dir_chars[d] 
    while seen < total:
        nr = r + dirs[d][0]
        nc = c + dirs[d][1]
        if not (0 <= nr < n and 0 <= nc < m) or visited[nr][nc]:
            d = (d + 1) % 4
            continue
        r, c = nr, nc
        visited[r][c] = True
        seen += 1
        last_char = dir_chars[d]
    return last_char

def test_brute_force_small():
    for n in range(1,7):
        for m in range(1,7):
            assert final_direction(n,m) == brute_force_final_direction(n,m)