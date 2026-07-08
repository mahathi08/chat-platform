from app.db.database import SessionLocal
from sqlalchemy import text

db = SessionLocal()

try:
    db.execute(text("TRUNCATE TABLE messages RESTART IDENTITY CASCADE;"))
    db.execute(text("TRUNCATE TABLE channels RESTART IDENTITY CASCADE;"))
    db.execute(text("TRUNCATE TABLE invites RESTART IDENTITY CASCADE;"))
    db.execute(text("TRUNCATE TABLE server_members RESTART IDENTITY CASCADE;"))
    db.execute(text("TRUNCATE TABLE servers RESTART IDENTITY CASCADE;"))
    db.execute(text("TRUNCATE TABLE notifications RESTART IDENTITY CASCADE;"))
    db.execute(text("TRUNCATE TABLE users RESTART IDENTITY CASCADE;"))
    db.commit()
    print("Database cleaned.")
finally:
    db.close()