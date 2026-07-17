import re
import os

filepath = r"f:\kaira\vgdfashion-arun\vdg-fashion\frontend\src\app\admin\page.js"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# target 1
t1 = """      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(modalMode === 'edit' ? 'Hero banner updated' : 'Hero banner created', 'success');"""
r1 = """      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('access_token')}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(modalMode === 'edit' ? 'Hero banner updated' : 'Hero banner created', 'success');"""

content = content.replace(t1, r1)

# target 2
t2 = """      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(modalMode === 'edit' ? 'Mobile banner updated' : 'Mobile banner created', 'success');"""
r2 = """      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('access_token')}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(modalMode === 'edit' ? 'Mobile banner updated' : 'Mobile banner created', 'success');"""

content = content.replace(t2, r2)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
