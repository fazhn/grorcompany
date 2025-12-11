# Solución: Problema de Conexión a Base de Datos

## Diagnóstico

La aplicación no puede conectarse al servidor MariaDB en `217.154.184.200:3308`.

**Error:** `connect ETIMEDOUT`

## Posibles Causas

1. **Firewall bloqueando la conexión**
   - El servidor puede tener un firewall que bloquea conexiones desde tu IP

2. **Servidor MariaDB no está corriendo**
   - El servicio de base de datos puede estar detenido

3. **Restricciones de acceso remoto**
   - MariaDB puede estar configurado para aceptar solo conexiones locales
   - Tu IP puede no estar en la lista blanca

4. **Credenciales incorrectas**
   - Usuario, contraseña o nombre de base de datos incorrectos

## Soluciones

### Opción 1: Verificar Conectividad (Recomendado primero)

Prueba la conexión usando el script de prueba:

```bash
npm install -D tsx
npx tsx server/test-db.ts
```

### Opción 2: Verificar Firewall del Servidor

Si tienes acceso al servidor remoto, verifica:

```bash
# En el servidor remoto
sudo ufw status
sudo ufw allow 3308/tcp

# O con iptables
sudo iptables -L -n | grep 3308
```

### Opción 3: Configurar MariaDB para Acceso Remoto

En el servidor MariaDB, edita la configuración:

```bash
# En /etc/mysql/mariadb.conf.d/50-server.cnf
bind-address = 0.0.0.0  # En lugar de 127.0.0.1
```

Y otorga permisos al usuario:

```sql
GRANT ALL PRIVILEGES ON grorcompany.* TO 'mariadb'@'%' IDENTIFIED BY 'grorcompany2025**';
FLUSH PRIVILEGES;
```

### Opción 4: Usar Base de Datos Local (Desarrollo)

Si no puedes acceder al servidor remoto, instala MariaDB localmente:

```bash
# macOS
brew install mariadb
brew services start mariadb

# Crear base de datos local
mysql -u root -e "CREATE DATABASE grorcompany;"
mysql -u root -e "CREATE USER 'mariadb'@'localhost' IDENTIFIED BY 'grorcompany2025**';"
mysql -u root -e "GRANT ALL PRIVILEGES ON grorcompany.* TO 'mariadb'@'localhost';"
mysql -u root grorcompany < server/database/schema.sql
```

Luego actualiza `server/utils/db.ts`:
```typescript
host: 'localhost',  // En lugar de 217.154.184.200
port: 3306,         // Puerto por defecto de MariaDB
```

### Opción 5: Usar SSH Tunnel

Si el servidor remoto solo acepta conexiones SSH:

```bash
ssh -L 3308:localhost:3308 usuario@217.154.184.200
```

Luego en `server/utils/db.ts`, cambia:
```typescript
host: 'localhost',  // Se conectará a través del túnel
```

### Opción 6: Verificar con Cliente MySQL

Prueba conectarte manualmente:

```bash
mysql -h 217.154.184.200 -P 3308 -u mariadb -p grorcompany
# Ingresa la contraseña: grorcompany2025**
```

Si esto falla, confirma que el problema no está en la aplicación sino en la configuración del servidor.

## Estado Actual de la Aplicación

✅ **La aplicación ahora es más resiliente:**
- Si la base de datos no está disponible, el catálogo mostrará "No hay productos disponibles"
- El panel de administración mostrará un mensaje claro de error de conexión
- Ya no se congela esperando conexiones que no llegan (timeout de 10 segundos)

## Próximos Pasos

1. **Identifica la causa** usando el script de prueba
2. **Contacta al administrador del servidor** si necesitas acceso remoto
3. **Considera usar base de datos local** para desarrollo
4. Una vez resuelto, ejecuta el script SQL: `mysql -h HOST -P PORT -u USER -p DATABASE < server/database/schema.sql`
