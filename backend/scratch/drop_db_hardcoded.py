import pymysql
connection = pymysql.connect(host='127.0.0.1', user='root', password='root', port=3306)
cursor = connection.cursor()
cursor.execute('DROP DATABASE IF EXISTS vdg')
cursor.execute('CREATE DATABASE vdg CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci')
connection.commit()
cursor.close()
connection.close()
print('DB vdg reset successfully')
