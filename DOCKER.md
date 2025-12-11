# Despliegue con Docker

## Construcción y Ejecución

### Usando Docker Compose (Recomendado)

```bash
# Construir y ejecutar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

### Usando Docker directamente

```bash
# Construir imagen
docker build -t catalogo-productos .

# Ejecutar contenedor
docker run -d \
  -p 3000:3000 \
  -v producto-images:/app/public/images/productos \
  --name catalogo \
  catalogo-productos

# Ver logs
docker logs -f catalogo

# Detener y eliminar
docker stop catalogo
docker rm catalogo
```

## Persistencia de Imágenes

Las imágenes de productos se almacenan en un volumen persistente de Docker:
- **Volumen**: `producto-images`
- **Ruta en el contenedor**: `/app/public/images/productos`

Esto significa que las imágenes subidas permanecerán incluso si el contenedor es eliminado y recreado.

### Gestión de Volúmenes

```bash
# Listar volúmenes
docker volume ls

# Inspeccionar volumen
docker volume inspect producto-images

# Hacer backup del volumen
docker run --rm \
  -v producto-images:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/productos-backup.tar.gz -C /data .

# Restaurar backup
docker run --rm \
  -v producto-images:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/productos-backup.tar.gz -C /data
```

## Variables de Entorno

Puedes personalizar la configuración usando variables de entorno:

```bash
docker-compose up -d
```

O crear un archivo `.env`:

```env
NODE_ENV=production
PORT=3000
```

## Acceso

Una vez ejecutando:
- **Catálogo**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
  - Usuario: `admin`
  - Contraseña: `admin123`

## Actualización

Para actualizar la aplicación:

```bash
# Detener contenedores
docker-compose down

# Reconstruir con nuevos cambios
docker-compose build

# Iniciar de nuevo
docker-compose up -d
```

## Producción

Para producción, considera:

1. **Configurar variables de entorno** para credenciales de base de datos
2. **Usar HTTPS** con un reverse proxy (nginx, traefik)
3. **Cambiar credenciales de admin** hardcoded
4. **Configurar backups automáticos** del volumen de imágenes
5. **Monitoreo y logs** centralizados

### Ejemplo con nginx como reverse proxy

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
