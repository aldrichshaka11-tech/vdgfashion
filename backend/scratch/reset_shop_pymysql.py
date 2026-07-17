import pymysql

def reset_shop():
    try:
        # Connect directly to MySQL using your server credentials
        connection = pymysql.connect(
            host='127.0.0.1',
            user='vdguser',
            password='Vdg@12345',
            database='vdg',
            port=3306
        )
        cursor = connection.cursor()
        
        print("Connected to database 'vdg'.")
        print("Disabling foreign key checks...")
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
        
        print("Finding all 'shop' tables...")
        cursor.execute("SHOW TABLES LIKE 'shop_%';")
        tables = [row[0] for row in cursor.fetchall()]
        
        if not tables:
            print("No shop tables found.")
        else:
            for table in tables:
                print(f"Dropping table: {table}")
                cursor.execute(f"DROP TABLE {table};")
            
        print("Removing 'shop' from django_migrations history...")
        cursor.execute("DELETE FROM django_migrations WHERE app = 'shop';")
        
        print("Re-enabling foreign key checks...")
        cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
        
        connection.commit()
        cursor.close()
        connection.close()
        
        print("Done! You can now run 'python manage.py migrate' to recreate the shop schema.")
        
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == '__main__':
    reset_shop()
