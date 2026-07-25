import sqlite3

conn = sqlite3.connect("chat.db")
db = conn.cursor()
conn.execute("PRAGMA foreign_keys = ON")

with open("schema.sql", "r") as f:
    db.executescript(f.read())

conn.commit()
conn.close()

print("database initiallized successfully")