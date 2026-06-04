with open("shop/models.py", "r", encoding="utf-8") as f:
    for line_num, line in enumerate(f, 1):
        if "class " in line:
            print(f"Line {line_num}: {line.strip()}")
