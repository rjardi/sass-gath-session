import axios from "axios";
import fs from "fs";
import path from "path";
import { optimize } from "svgo";

require("dotenv").config();

const FILE_KEY = process.env.FILE_KEY;
const NODE_ID = process.env.NODE_ID;
const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const OUTPUT_DIR = path.resolve(process.env.FILE_KEY);

// === Sanitizar y manejar duplicados ===
const nameCount = {};
function getUniqueFileName(baseName, format) {
  const safeName = baseName
    .toLowerCase()
    .replace(/[\s/]+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/-+/g, "-");

  if (!nameCount[safeName]) {
    nameCount[safeName] = 1;
    return `${safeName}.${format}`;
  }
  const uniqueName = `${safeName}-${nameCount[safeName]}.${format}`;
  nameCount[safeName]++;
  return uniqueName;
}

// === Obtener nodo ===
async function fetchNode() {
  try {
    const url = `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(NODE_ID)}`;

    const response = await axios.get(url, {
      headers: { "X-Figma-Token": FIGMA_TOKEN },
    });

    console.log("Respuesta exitosa:");
    const nodeData = response.data.nodes[NODE_ID];
    if (!nodeData) {
      console.error("❌ Nodo no encontrado.");
      return;
    }

    // Buscar todos los nodos con exportSettings
    const nodesToExport = {};
    function findExportables(node) {
      if (node.exportSettings && node.exportSettings.length > 0) {
        console.log("📌 Asset exportable encontrado:");
        console.log("  ID:", node.id);
        console.log("  Nombre:", node.name);
        console.log("  Tipo:", node.type);
        console.log("  ExportSettings:", JSON.stringify(node.exportSettings, null, 2));
        nodesToExport[node.id] = { name: node.name, exportSettings: node.exportSettings };
      }
      if (node.children) node.children.forEach(findExportables);
    }
    findExportables(nodeData.document);

    const nodeIds = Object.keys(nodesToExport);
    if (nodeIds.length === 0) {
      console.log("⚠️ No hay assets exportables en este nodo.");
      return;
    }

    console.log(`📦 Encontrados ${nodeIds.length} assets exportables -->`, nodeIds);

    // Exportar assets
    await exportAssetsFromNodes(FILE_KEY, nodesToExport, FIGMA_TOKEN);

    console.log("🎉 Exportación completada.");
  } catch (error) {
    if (error.response) {
      console.error("Error API:", error.response.status, error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
}

// === Exportar assets respetando formatos ===
async function exportAssetsFromNodes(fileKey, nodesMap, token) {
  for (const [nodeId, nodeInfo] of Object.entries(nodesMap)) {
    const { name, exportSettings } = nodeInfo;

    for (const setting of exportSettings) {
      const format = setting.format.toLowerCase();
      const url = `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(nodeId)}&format=${format}&scale=${setting.scale || 1}`;

      const response = await axios.get(url, {
        headers: { "X-Figma-Token": token },
      });

      const imageUrl = response.data.images[nodeId];
      if (!imageUrl) continue;

      const fileResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });

      let folder = "others";
      if (format === "svg") folder = "icons";
      if (["png", "jpg", "jpeg"].includes(format)) folder = "images";

      const filename = getUniqueFileName(name, format);
      const filepath = path.join(OUTPUT_DIR, folder, filename);

      if (format === "svg") {
        const optimized = optimize(fileResponse.data.toString(), { multipass: true });
        fs.writeFileSync(filepath, optimized.data);
      } else {
        fs.writeFileSync(filepath, fileResponse.data);
      }

      console.log(`Guardado: ${filepath}`);
    }
  }
}

fetchNode();
