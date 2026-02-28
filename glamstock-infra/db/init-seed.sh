#!/bin/bash
# ==========================================================
# GlamStock — Orquestador de inicialización de base de datos
# ==========================================================
# Ejecutado automáticamente por postgres en initdb.d (orden alfabético).
# Se nombra 03_init-seed.sh para ejecutarse DESPUÉS de
# 01_schema.sql y 02_index.sql.
# ==========================================================
set -e

echo "▶ GlamStock: Habilitando extensión pgcrypto..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE EXTENSION IF NOT EXISTS pgcrypto;
EOSQL

echo "▶ GlamStock: Cargando vistas (04_views.sql)..."
psql -v ON_ERROR_STOP=1 \
     --username "$POSTGRES_USER" \
     --dbname "$POSTGRES_DB" \
     -f /docker-scripts/04_views.sql

echo "▶ GlamStock: Cargando seed de datos (03_seed.sql)..."
# Hash bcrypt (10 rounds) de la contraseña: Admin123!
# Compatible con bcryptjs — NO cambiar este hash sin regenerarlo con bcryptjs.
ADMIN_BCRYPT_HASH='$2b$10$/.7ba0X3AGEnwJnzP0JCUuVqfxVXmZwEkNfLMuLMAyOJF.GVK06sq'

psql -v ON_ERROR_STOP=1 \
     --username "$POSTGRES_USER" \
     --dbname "$POSTGRES_DB" \
     --set admin_email="${ADMIN_EMAIL:-admin@glamstock.com}" \
     --set admin_bcrypt_hash="$ADMIN_BCRYPT_HASH" \
     -f /docker-scripts/03_seed.sql

echo "✅ GlamStock: Base de datos inicializada correctamente."
