# Estructura del Proyecto SpaceExplorer

## 📁 Organización de Archivos

### `/app` - Configuración de Rutas (Expo Router)
```
app/
├── _layout.tsx          # Layout principal de la aplicación
├── (tabs)/             # Navegación por pestañas
│   ├── _layout.tsx     # Configuración de tabs
│   └── index.tsx       # Pantalla principal (WelcomeScreen)
└── screens/            # Pantallas de navegación
    ├── nasa-missions.tsx
    ├── events-peru.tsx
    └── solar-system.tsx
```

### `/src` - Lógica de la Aplicación
```
src/
├── components/         # Componentes reutilizables
│   ├── MenuButton.tsx
│   └── ScreenLayout.tsx    # Layout base para pantallas
├── constants/          # Constantes y configuraciones
│   ├── Colors.ts
│   └── Routes.ts           # Rutas centralizadas
├── models/             # Modelos de datos
│   └── NavigationModel.ts
├── services/           # Servicios de la aplicación
│   └── NavigationService.ts # Servicio de navegación
├── viewmodels/         # Lógica de presentación
│   └── WelcomeViewModel.ts
└── views/              # Pantallas de la aplicación
    ├── WelcomeScreen.tsx
    ├── NASAMissionsScreen.tsx
    ├── EventsPeruScreen.tsx
    └── SolarSystemScreen.tsx
```

## 🚀 Características de la Estructura

### ✅ Separación de Responsabilidades
- **`/app`**: Maneja solo la configuración de rutas y navegación
- **`/src/views`**: Contiene el diseño y lógica de las pantallas
- **`/src/services`**: Servicios centralizados (navegación, API, etc.)
- **`/src/components`**: Componentes reutilizables y layouts

### ✅ Navegación Centralizada
- **`Routes.ts`**: Todas las rutas en un lugar
- **`NavigationService.ts`**: Lógica de navegación reutilizable
- **`NavigationModel.ts`**: Configuración de menús y opciones

### ✅ Componentes Independientes
- Cada pantalla tiene su propio archivo en `/app/screens/`
- Las vistas están separadas de la configuración de rutas
- Layout consistente usando `ScreenLayout`

## 🔧 Cómo Agregar una Nueva Pantalla

1. **Crear la vista** en `/src/views/NuevaPantalla.tsx`
2. **Crear la ruta** en `/app/screens/nueva-pantalla.tsx`
3. **Agregar la ruta** en `/src/constants/Routes.ts`
4. **Actualizar el modelo** en `/src/models/NavigationModel.ts` si es necesario

## 📱 Flujo de Navegación

1. Usuario selecciona opción en `WelcomeScreen`
2. `WelcomeViewModel` usa `NavigationService`
3. `NavigationService` navega usando las rutas de `Routes.ts`
4. Expo Router carga la pantalla desde `/app/screens/`
5. La pantalla renderiza la vista correspondiente de `/src/views/`

## 🎨 Consistencia Visual

- Todas las pantallas usan `ScreenLayout` para consistencia
- Colores centralizados en `Colors.ts`
- Títulos de pantallas en `Routes.ts`
- StatusBar configurado de forma consistente