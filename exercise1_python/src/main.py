import sys
from core import parse_input_and_solve

def main():
    data = sys.stdin.read()
    print(parse_input_and_solve(data))
    
if __name__ == "__main__":
    main()