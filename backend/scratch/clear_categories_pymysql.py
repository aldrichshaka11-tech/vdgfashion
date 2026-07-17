import pymysql

def clear_categories():
    try:
        # Connect directly to MySQL using your server credentials
        connection = pymysql.connect(
            host='127.0.0.1',
            user='vdguser',
            password='Vdg@12345',
            database='fashion_db',
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        
        with connection.cursor() as cursor:
            print("Clearing category tables...")
            
            # Disable foreign key checks to allow truncating
            cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
            
            # Truncate tables (this deletes all data and resets IDs to 1)
            cursor.execute("TRUNCATE TABLE shop_subcategory;")
            cursor.execute("TRUNCATE TABLE shop_category;")
            cursor.execute("TRUNCATE TABLE shop_maincategory;")
            
            # Re-enable foreign key checks
            cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
            
        connection.commit()
        connection.close()
        print("Successfully wiped all Main Categories, Categories, and Subcategories!")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    clear_categories()
