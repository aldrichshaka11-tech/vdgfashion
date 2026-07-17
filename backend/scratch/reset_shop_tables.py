import os
import sys

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_backend.settings.base')

import django
django.setup()

from django.db import connection

def reset_shop():
    with connection.cursor() as cursor:
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
        
    print("Done! You can now run 'python manage.py migrate' to recreate the shop schema.")

if __name__ == '__main__':
    reset_shop()
