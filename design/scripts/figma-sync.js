// Boona → Figma Variables sync. Plugin-API script, no dependencies.
// Input: the object in design/build/figma-variables.json (generated from tokens.json; never hand-edited).
// Run it in the Figma file that owns the templates: via the Figma MCP `use_figma` tool, via a scratch plugin's
// console, or from Figma's "Run script" in a development plugin. It is idempotent: run it after every token change.
//
//   await syncBoonaVariables(data);   // data = contents of figma-variables.json
//
// What it does: ensures collections "Boona" (modes Light/Dark) and "Boona · scale" (mode Value) exist, creates or
// updates every variable by name with its per-mode values, description and scopes, and creates or updates the
// text styles under "Boona/…". Nothing is deleted; remove retired tokens by hand so no template breaks silently.

async function syncBoonaVariables(data) {
  const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
  const localVariables = await figma.variables.getLocalVariablesAsync();
  const log = [];

  for (const col of data.collections) {
    let collection = localCollections.find((c) => c.name === col.name);
    if (!collection) { collection = figma.variables.createVariableCollection(col.name); log.push(`created collection ${col.name}`); }

    // Modes: rename the default mode to the first wanted mode, add the rest.
    const wanted = col.modes;
    if (collection.modes[0].name !== wanted[0]) collection.renameMode(collection.modes[0].modeId, wanted[0]);
    for (const m of wanted.slice(1)) if (!collection.modes.find((x) => x.name === m)) collection.addMode(m);
    const modeId = Object.fromEntries(collection.modes.map((m) => [m.name, m.modeId]));

    for (const v of col.variables) {
      let variable = localVariables.find((x) => x.name === v.name && x.variableCollectionId === collection.id);
      if (!variable) { variable = figma.variables.createVariable(v.name, collection, v.type); log.push(`created ${v.name}`); }
      variable.description = v.description || "";
      if (v.cssVar) variable.setVariableCodeSyntax("WEB", v.cssVar);
      try { variable.scopes = v.scopes; } catch (e) { /* some scopes are type-specific; ignore */ }
      for (const [modeName, value] of Object.entries(v.valuesByMode)) {
        if (!modeId[modeName]) continue;
        variable.setValueForMode(modeId[modeName], value);
      }
    }
  }

  // Text styles. Host Grotesk weight → Figma style name.
  const styleName = { 400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold" };
  const styles = await figma.getLocalTextStylesAsync();
  for (const t of data.textStyles) {
    const font = { family: t.fontFamily, style: styleName[t.fontWeight] || "Regular" };
    try { await figma.loadFontAsync(font); } catch (e) { log.push(`font missing for ${t.name}: ${font.family} ${font.style}`); continue; }
    let style = styles.find((s) => s.name === t.name);
    if (!style) { style = figma.createTextStyle(); style.name = t.name; log.push(`created text style ${t.name}`); }
    style.fontName = font;
    style.fontSize = t.fontSize;
    style.lineHeight = { unit: "PERCENT", value: t.lineHeightPercent };
    style.letterSpacing = { unit: "PERCENT", value: t.letterSpacingPercent };
    style.description = t.description || "";
  }

  figma.notify(`Boona tokens synced (${data.version})`);
  return log;
}

// Expose for console / MCP use.
if (typeof globalThis !== "undefined") globalThis.syncBoonaVariables = syncBoonaVariables;
