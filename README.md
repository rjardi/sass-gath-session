# Gath Session Landing Page

https://rjardi.github.io/sass-gath-session/

A modern, responsive landing page for a communities business. Built with semantic HTML and modular SASS.

<img src="src/assets/images/snapshot.png">

# 🖼 Importador de Assets desde Figma (Funcionalidad interna)

Este script (`import-figma-assets.js`) permite **extraer automáticamente assets (SVG, PNG, JPG)** desde un archivo de Figma usando la API oficial.  
Se puede ejecutar en cualquier proyecto para **mantener sincronizados los componentes exportables con el código**.

---

## 📌 Pasos para usarlo

### 1️⃣ Obtener las claves necesarias de Figma

1. **Generar el Token de acceso**  
   - Ve a [Figma → Configuración de cuenta → Tokens personales](https://www.figma.com/developers/api#access-tokens)  
   - Copia el token generado.

2. **Obtener el File Key**  
   - Abre tu archivo de Figma en el navegador.  
   - En la URL encontrarás el `FILE_KEY`:  
     ```
     https://www.figma.com/file/FILE_KEY/NOMBRE?node-id=ID
     ```

3. **Obtener el Node ID (opcional si no exportas todo el archivo)**  
   - Haz clic en la página o frame que contiene los componentes a exportar.  
   - Copia el `node-id` desde la URL:  
     ```
     https://www.figma.com/file/FILE_KEY/NOMBRE?node-id=NODE_ID
     ```

---

### 2️⃣ Configurar variables en `.env`

En la raíz del proyecto crea un archivo `.env` (no lo subas al repositorio):

```env
FILE_KEY = tu_file_key
NODE_ID = tu_node_id
FIGMA_TOKEN = tu_figma_token
OUTPUT_DIR = ./src/assets   # Carpeta donde se guardarán los assets exportados
```

### 3️⃣ Preparar Figma para exportación

- Marca los **componentes o frames** que quieras exportar.
- En el panel derecho de Figma, ve a **Export settings** y añade el formato deseado:  
  - `SVG`
  - `PNG`
  - `JPG`

El script respeta la configuración de exportación que tengas en Figma.

---

### 4️⃣ Ejecutar el script

En la terminal:

```bash
node import-figma-assets.js
```
### 3️⃣ Preparar Figma para exportación
- Marca los **componentes o frames** que quieras exportar.
- En el panel derecho de Figma, ve a **Export settings** y añade el formato deseado:  
  - `SVG`
  - `PNG`
  - `JPG`

El script respeta la configuración de exportación que tengas en Figma.

---

### 4️⃣ Ejecutar el script
En la terminal:
```bash
node import-figma-assets.js
```

### 3️⃣ Preparar Figma para exportación
- Marca los **componentes o frames** que quieras exportar.
- En el panel derecho de Figma, ve a **Export settings** y añade el formato deseado:  
  - `SVG`
  - `PNG`
  - `JPG`

El script respeta la configuración de exportación que tengas en Figma.

---

### 4️⃣ Ejecutar el script  

En la terminal: 
```bash 
node import-figma-assets.js
``` 
Esto:  

- Buscará todos los nodos marcados con Export settings.  
- Exportará en los formatos configurados.  
- Guardará los archivos en OUTPUT_DIR organizados por tipo:  

  icons/ → SVG  
  images/ → PNG/JPG  
  others/ → otros formatos.

📂 Ejemplo de salida  

    assets/  
    ├── icons/  
    │   ├── icon-home.svg  
    │   ├── icon-user.svg  
    ├── images/  
    │   ├── banner.png  
    │   ├── avatar.jpg  

🔍 Notas importantes  
- Si hay nombres duplicados, el script añade sufijos (-1, -2, etc.) para evitar sobrescribir.  
- Solo exporta lo que esté configurado en Export settings de Figma.  
- El token y las claves deben mantenerse fuera del repositorio.

💡 Uso recomendado en proyecto  
Guardar import-figma-assets.js en /scripts/.  

Ejecutarlo manualmente cada vez que se actualicen los assets en Figma.  

(Opcional) Integrar como comando en package.json:  
```json
"scripts": {  
  "export:figma": "node scripts/import-figma-assets.js"  
}
```

Luego simplemente:  
```bash 
npm run export:figma
``` 
---
