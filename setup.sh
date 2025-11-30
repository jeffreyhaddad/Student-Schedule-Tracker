#!/usr/bin/env bash
set -euo pipefail

echo "
╔════════════════════════════════════════════════════════════════╗
║         🎓 Student Tracker - Setup Script                     ║
║          Easy-to-use project initialization                   ║
╚════════════════════════════════════════════════════════════════╝
"

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Error handler
trap 'echo -e "${RED}❌ Setup failed!${NC}"; exit 1' ERR

# 1️⃣  Copy example environment files
echo -e "${BLUE}Step 1: Setting up environment files${NC}"

if [ ! -f "api/.env" ]; then
  cat > api/.env <<'ENVFILE'
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=student_tracker

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Configuration
PORT=3000
NODE_ENV=development
ENVFILE
  echo -e "${GREEN}✓${NC} Created api/.env"
else
  echo -e "${GREEN}✓${NC} api/.env already exists"
fi

if [ ! -f "frontend/.env.local" ]; then
  cp frontend/example.env frontend/.env.local
  echo -e "${GREEN}✓${NC} Created frontend/.env.local"
else
  echo -e "${GREEN}✓${NC} frontend/.env.local already exists"
fi

# 2️⃣  Install dependencies
echo -e "\n${BLUE}Step 2: Installing dependencies${NC}"

echo "  Installing API dependencies..."
if (cd api && npm install); then
  echo -e "  ${GREEN}✓${NC} API dependencies installed"
else
  echo -e "  ${RED}✗${NC} Failed to install API dependencies"
  exit 1
fi

echo "  Installing frontend dependencies..."
if (cd frontend && npm install); then
  echo -e "  ${GREEN}✓${NC} Frontend dependencies installed"
else
  echo -e "  ${RED}✗${NC} Failed to install frontend dependencies"
  exit 1
fi

# 3️⃣  Attempt database setup if psql available
echo -e "\n${BLUE}Step 3: Setting up database${NC}"

if command -v psql >/dev/null 2>&1; then
  if [ -f "api/.env" ]; then
    set -a
    # shellcheck disable=SC1091
    . api/.env
    set +a
    
    export PGPASSWORD="${DATABASE_PASSWORD}"
    
    # Create database
    if ! psql -h "$DATABASE_HOST" -p "$DATABASE_PORT" -U "$DATABASE_USER" -tc "SELECT 1 FROM pg_database WHERE datname = '$DATABASE_NAME'" 2>/dev/null | grep -q 1; then
      if psql -h "$DATABASE_HOST" -p "$DATABASE_PORT" -U "$DATABASE_USER" -c "CREATE DATABASE \"$DATABASE_NAME\";" 2>/dev/null; then
        echo -e "  ${GREEN}✓${NC} Created database '$DATABASE_NAME'"
      else
        echo -e "  ${YELLOW}⚠${NC}  Could not create database (may already exist or permission denied)"
      fi
    else
      echo -e "  ${GREEN}✓${NC} Database '$DATABASE_NAME' already exists"
    fi
    
    # Load schema
    if psql -h "$DATABASE_HOST" -p "$DATABASE_PORT" -U "$DATABASE_USER" -d "$DATABASE_NAME" -f "api/database/schema.sql" > /dev/null 2>&1; then
      echo -e "  ${GREEN}✓${NC} Schema loaded"
    else
      echo -e "  ${YELLOW}⚠${NC}  Could not load schema (may already exist or permission denied)"
    fi
  fi
else
  echo -e "  ${YELLOW}⚠${NC}  psql not found - skipping automatic database setup"
  echo -e "      ${YELLOW}Manual database setup needed:${NC}"
  echo -e "      1. Create database: psql -U postgres -c \"CREATE DATABASE student_tracker;\""
  echo -e "      2. Load schema: psql -U postgres -d student_tracker -f api/database/schema.sql"
fi

# 4️⃣  Complete
echo -e "\n${BLUE}Step 4: Ready to start!${NC}\n"

cat <<EOF

${GREEN}✅ Setup Complete!${NC}

📝 Environment Files Created:
   • api/.env (edit DATABASE credentials if needed)
   • frontend/.env.local (already configured for localhost)

🚀 To start developing, run these commands in separate terminals:

   Terminal 1 - Backend:
   cd api && npm run start:dev

   Terminal 2 - Frontend:
   cd frontend && npm run dev

💡 Tips:
   • Backend will run on http://localhost:3000
   • Frontend will run on http://localhost:5173
   • Default login: johndoe@email.com / (check DB)
   • Edit api/.env to change database credentials
   • Frontend auto-reloads on file changes (HMR enabled)

📚 For more info, see README.md or api/README.md

EOF
