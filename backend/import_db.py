import pymysql
import os
import sys

# Set output encoding to UTF-8 to prevent charmap crashes on Windows
if sys.platform.startswith('win'):
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

def import_sql():
    host = '127.0.0.1'
    user = 'root'
    password = ''
    port = 3306
    db_name = 'vgd'
    sql_file_path = os.path.join(os.path.dirname(__file__), '..', 'vgd (2).sql')
    
    print(f"Connecting to MySQL server at {host}:{port} as user '{user}'...")
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            port=port,
            autocommit=True
        )
        print("Successfully connected to MySQL!")
    except Exception as e:
        print(f"CRITICAL ERROR: Failed to connect to MySQL server: {e}")
        print("Please ensure XAMPP MySQL is started and running on port 3306.")
        return False
        
    try:
        cursor = connection.cursor()
        
        # Drop database if exists to ensure clean import from beginning
        print(f"Dropping database '{db_name}' if exists to perform fresh import...")
        cursor.execute(f"DROP DATABASE IF EXISTS `{db_name}`")
        
        # Create database
        print(f"Creating database '{db_name}'...")
        cursor.execute(f"CREATE DATABASE `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        cursor.execute(f"USE `{db_name}`")
        print(f"Database '{db_name}' created and selected successfully!")
        
        # Disable foreign key checks for clean import
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
        
        print(f"Reading SQL dump file from: {sql_file_path}...")
        if not os.path.exists(sql_file_path):
            print(f"ERROR: SQL dump file not found at {sql_file_path}")
            return False
            
        with open(sql_file_path, 'r', encoding='utf-8', errors='ignore') as f:
            sql_content = f.read()
            
        # Replace MySQL 8 specific collation (utf8mb4_0900_ai_ci) with XAMPP/MariaDB compatible collation (utf8mb4_unicode_ci)
        print("Converting MySQL 8 collation to compatible utf8mb4_unicode_ci...")
        sql_content = sql_content.replace('utf8mb4_0900_ai_ci', 'utf8mb4_unicode_ci')
        
        print("Parsing SQL statements...")
        statements = []
        current_statement = []
        
        for line in sql_content.splitlines():
            stripped = line.strip()
            # Skip comments and empty lines
            if not stripped or stripped.startswith('--') or stripped.startswith('/*') or stripped.startswith('#'):
                continue
            
            current_statement.append(line)
            if stripped.endswith(';'):
                statements.append("\n".join(current_statement))
                current_statement = []
                
        if current_statement:
            leftover = "\n".join(current_statement).strip()
            if leftover:
                statements.append(leftover)
                
        total = len(statements)
        print(f"Found {total} SQL statements to execute.")
        
        success_count = 0
        error_count = 0
        
        for idx, statement in enumerate(statements, 1):
            try:
                cursor.execute(statement)
                success_count += 1
                if idx % 50 == 0 or idx == total:
                    print(f"Progress: {idx}/{total} statements executed...")
            except Exception as e:
                error_count += 1
                # Format safety string to prevent encoding issues when printing errors
                sample = statement[:120].replace('\n', ' ')
                sample_safe = sample.encode('ascii', 'ignore').decode('ascii')
                print(f"Warning: Error in statement {idx}: {e}")
                print(f"Statement snippet: {sample_safe}...")
                
        # Re-enable foreign key checks
        cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
        
        print("\n--- IMPORT SUMMARY ---")
        print(f"Total Statements: {total}")
        print(f"Successfully Executed: {success_count}")
        print(f"Failed/Errors: {error_count}")
        print("----------------------\n")
        
        cursor.close()
        connection.close()
        
        if error_count == 0:
            print("🎉 Database imported perfectly without errors!")
            return True
        else:
            print("⚠️ Database imported with some warnings. Please verify tables.")
            return True
            
    except Exception as e:
        print(f"CRITICAL ERROR during import process: {e}")
        try:
            connection.close()
        except:
            pass
        return False

if __name__ == '__main__':
    import_sql()
