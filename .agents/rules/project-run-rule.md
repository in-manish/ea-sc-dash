---
trigger: always_on
---

# ================================
# Check nvm installation & version
# ================================
nvm --version

# If this fails, install nvm first:
# https://github.com/nvm-sh/nvm


# ================================
# Use Node 24 via nvm
# ================================

# Set Node version in project
echo "24" > .nvmrc

# Install & use Node 24
nvm install 24
nvm use 24

# Verify versions
node -v
npm -v


# ================================
# Install dependencies
# ================================
npm install


# ================================
# Run Vite dev server
# ================================
npm run dev


# ================================
# (Optional) Build & Preview
# ================================
npm run build
npm run preview