import pymysql

try:
    connection = pymysql.connect(
        host='127.0.0.1',
        user='root',
        password='',
        port=3306
    )
    cursor = connection.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS fashion_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    print("SUCCESS: Database 'fashion_db' created!")
    cursor.close()
    connection.close()
except Exception as e:
    print(f"ERROR: {e}")
    print("Make sure XAMPP MySQL is running on port 3306")
