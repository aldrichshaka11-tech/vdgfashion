import pymysql

try:
    connection = pymysql.connect(
        host='127.0.0.1',
        user='root',
        password='',
        port=3306
    )
    cursor = connection.cursor()
    
    # Drop existing database
    cursor.execute("DROP DATABASE IF EXISTS fashion_db")
    print("Old database dropped!")
    
    # Create fresh database
    cursor.execute("CREATE DATABASE fashion_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    print("Fresh database 'fashion_db' created successfully!")
    
    cursor.close()
    connection.close()
except Exception as e:
    print(f"ERROR: {e}")
    print("Make sure XAMPP MySQL is running!")
