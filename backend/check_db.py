import sqlite3

conn = sqlite3.connect('backend/clinica.sqlite3')
cur = conn.cursor()
cur.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='pacientes'")
res = cur.fetchone()
if res:
    print(res[0])
else:
    print("Table pacientes not found.")

# Let's also check if there's any patient
cur.execute("SELECT * FROM pacientes")
print("Patients in DB:", cur.fetchall())

conn.close()
