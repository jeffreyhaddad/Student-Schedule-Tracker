# Documentation Structure

## 📁 Root Level (Project-Wide)

### README.md
- **Purpose**: Main project overview and quick start
- **Audience**: Anyone discovering the project
- **Contains**: Features, tech stack, quick setup, troubleshooting

### SETUP.md
- **Purpose**: Detailed setup instructions
- **Audience**: Developers setting up locally
- **Contains**: Prerequisites, database setup, environment config, troubleshooting

### API.md
- **Purpose**: Complete API reference
- **Audience**: Frontend developers, API consumers
- **Contains**: All endpoints, request/response formats, authentication, examples

## 📁 Backend (/api)

### api/README.md
- **Purpose**: Backend architecture and development
- **Audience**: Backend developers
- **Contains**: Architecture patterns, folder structure, development workflow, session management

## 📁 Frontend (/frontend)

### frontend/README.md
- **Purpose**: Frontend architecture and development
- **Audience**: Frontend developers
- **Contains**: React patterns (services→hooks→components), authentication flow, available routes

### frontend/COMPONENTS.md
- **Purpose**: Component documentation
- **Audience**: Frontend developers
- **Contains**: Component descriptions, props, usage examples

## 🎯 Quick Navigation

**Getting Started?** → Start with root `README.md`

**Setting up locally?** → Follow `SETUP.md`

**Building API integrations?** → Reference `API.md`

**Working on backend?** → See `api/README.md`

**Working on frontend?** → See `frontend/README.md`

**Need component details?** → Check `frontend/COMPONENTS.md`

## 📊 Documentation Hierarchy

```
Project Root
│
├── README.md           ⭐ Start here
├── SETUP.md            🔧 Setup instructions
├── API.md              📡 API reference
│
├── api/
│   └── README.md       🔙 Backend architecture
│
└── frontend/
    ├── README.md       🎨 Frontend architecture
    └── COMPONENTS.md   🧩 Component docs
```

## ✨ Benefits of This Structure

1. **Clear Separation**: Project-wide vs. subsystem-specific docs
2. **Easy Navigation**: README in each folder explains that folder
3. **No Duplication**: Each doc has a single, clear purpose
4. **Scalable**: Easy to add new sections as project grows
5. **GitHub Friendly**: READMEs automatically display in each folder
