/**
 * Boona · Figma sync (Plugin API). Idempotent.
 *
 * Creates or updates the variable collections and text styles described by
 * design/build/figma-variables.json (built from tokens.json). Run it through the Figma MCP
 * `use_figma` tool, or paste into a plugin console, with the JSON assigned to `DATA`:
 *
 *   const DATA = <contents of design/build/figma-variables.json>;
 *   <this file>
 *   return await syncBoonaVariables(DATA);
 *
 * Matching is by name: a variable or style that already exists is updated in place,
 * never duplicated. Returns a ledger of ids for the component scripts.
 */
async function syncBoonaVariables(DATA) {
  const ledger = { collections: {}, variables: {}, textStyles: {}, fontsMissing: [] };

  const existingCollections = await figma.variables.getLocalVariableCollectionsAsync();
  const existingVars = await figma.variables.getLocalVariablesAsync();

  const scopeOk = (s) => s.filter((x) => x !== "ALL_SCOPES");
  const colorScopes = (name) => {
    if (/^on-|^quiet|^ink$/.test(name)) return ["TEXT_FILL", "SHAPE_FILL", "FRAME_FILL", "STROKE_COLOR"];
    if (/^line$|hairline/.test(name)) return ["STROKE_COLOR", "SHAPE_FILL", "FRAME_FILL"];
    if (/^signal$/.test(name)) return ["STROKE_COLOR", "EFFECT_COLOR", "SHAPE_FILL", "FRAME_FILL", "TEXT_FILL"];
    return ["FRAME_FILL", "SHAPE_FILL", "STROKE_COLOR", "TEXT_FILL"];
  };

  for (const col of DATA.collections) {
    let c = existingCollections.find((x) => x.name === col.name);
    if (!c) c = figma.variables.createVariableCollection(col.name);
    // modes: rename the first to match, add the rest
    const modeId = c.modes[0].modeId;
    if (c.modes[0].name !== col.modes[0]) c.renameMode(modeId, col.modes[0]);
    ledger.collections[col.name] = { id: c.id, modeId };

    for (const v of col.variables) {
      let variable = existingVars.find((x) => x.variableCollectionId === c.id && x.name === v.name);
      if (!variable) variable = figma.variables.createVariable(v.name, c, v.type);
      variable.setValueForMode(modeId, v.value);
      if (v.description) variable.description = v.description;
      const scopes = v.type === "COLOR" ? colorScopes(v.name) : scopeOk(v.scopes);
      variable.scopes = scopes.length ? scopes : (v.type === "COLOR" ? ["FRAME_FILL"] : ["WIDTH_HEIGHT"]);
      if (v.cssVar) variable.setVariableCodeSyntax("WEB", `var(${v.cssVar})`);
      ledger.variables[`${col.name}/${v.name}`] = variable.id;
    }
  }

  // text styles
  const fonts = await figma.listAvailableFontsAsync();
  const has = (family, style) => fonts.some((f) => f.fontName.family === family && f.fontName.style === style);
  const existingStyles = await figma.getLocalTextStylesAsync();
  const typeCol = ledger.collections.Type;

  for (const ts of DATA.textStyles) {
    let family = ts.family, style = ts.style;
    if (!has(family, style)) {
      // Geist Mono has no Bold; fall back one weight, then to Inter
      const alt = style === "Bold" && has(family, "SemiBold") ? "SemiBold" : null;
      if (alt) style = alt;
      else if (has("Inter", style === "SemiBold" ? "Semi Bold" : style)) { family = "Inter"; style = style === "SemiBold" ? "Semi Bold" : style; ledger.fontsMissing.push(`${ts.family} ${ts.style}`); }
      else { family = "Inter"; style = "Regular"; ledger.fontsMissing.push(`${ts.family} ${ts.style}`); }
    }
    await figma.loadFontAsync({ family, style });
    let s = existingStyles.find((x) => x.name === ts.name);
    if (!s) { s = figma.createTextStyle(); s.name = ts.name; }
    s.fontName = { family, style };
    s.fontSize = ts.size;
    s.letterSpacing = ts.letterSpacing;
    s.lineHeight = ts.lineHeight;
    s.textCase = ts.textCase;
    s.description = ts.description;
    if (typeCol && ts.bind && ts.bind.size) {
      const sizeVarId = ledger.variables[`Type/${ts.bind.size}`];
      if (sizeVarId) {
        const sizeVar = await figma.variables.getVariableByIdAsync(sizeVarId);
        s.setBoundVariable("fontSize", sizeVar);
      }
    }
    ledger.textStyles[ts.name] = s.id;
  }

  return ledger;
}
