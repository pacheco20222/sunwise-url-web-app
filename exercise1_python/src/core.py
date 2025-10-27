def final_direction(n: int, m: int) -> str:
    """
    Return one of 'L', 'R', 'U', 'D' indicating the facing direction
    after visiting all cells of an n x m grid starting at (0,0)
    facing right and moving in a clockwise spiral.

    Rules:
    - If n <= m: odd n -> 'R', even n -> 'L'
    - If n >  m: odd m -> 'D', even m -> 'U'
    """
    if n <= m:
        return 'R' if (n & 1) else 'L'
    else:
        return 'D' if (m & 1) else 'U'
    
def parse_input_and_solve(input_text: str) -> str:
    """
    Given the full input text as in contest format, return the output string
    with one direction per line.
    Robust to blank lines.
    """
    parts = list(map(int, input_text.strip().split()))
    if not parts:
        return ""
    t = parts[0]
    out_lines = []
    index = 1
    for _ in range(t):
        if index + 1 >= len(parts):
            raise ValueError("Insufficient input data for the number of test cases.")
        n = parts[index]; m = parts[index + 1]; index += 2
        out_lines.append(final_direction(n, m))
    return "\n".join(out_lines)