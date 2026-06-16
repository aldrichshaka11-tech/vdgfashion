import re, os

src = 'c:/xampp/hardik/htdocs/vgd-fashion/frontend/src'
total = 0

for root, dirs, files in os.walk(src):
    for fname in files:
        if not fname.endswith('.js'): continue
        path = os.path.join(root, fname)
        with open(path, 'r', encoding='utf-8') as f:
            c = f.read()

        # Fix 1: fetch(`${API_BASE}/api/path/', { -> fetch(`${API_BASE}/api/path/`, {
        fixed, n1 = re.subn(r"fetch\(`(\$\{API_BASE\}/[^'`\n]*)'", r"fetch(`\1`", c)

        # Fix 2: fetch(`${API_BASE}/api/path/`), { -> fetch(`${API_BASE}/api/path/`, {
        fixed, n2 = re.subn(r"fetch\((`\$\{API_BASE\}/[^`\n]*`)\),\s*\{", r"fetch(\1, {", fixed)

        count = n1 + n2
        if count:
            total += count
            with open(path, 'w', encoding='utf-8') as f:
                f.write(fixed)
            print(f'{fname}: {count} fixes')

print(f'\nTotal fixed: {total}')
