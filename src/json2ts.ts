export function generateTsType(
  schema: Record<string, any>,
  interfaceName = "DataInterface"
) {
  let dataSchema = schema.properties.data;

  let tsCode = `interface ${interfaceName} {\n`;

  function generateProperties(
    properties: Record<string, any>,
    requiredFields: string[] = []
  ) {
    let propsCode = "";
    for (const [key, value] of Object.entries(properties)) {
      const isRequired = requiredFields.includes(key);
      const propType = getType(value);

      // 生成 JSDoc 注释
      if (value.description) {
        propsCode += `  /** ${value.description} */\n`;
      }

      // 处理字段可选性
      propsCode += `  ${key}${isRequired ? "" : "?"}: ${propType};\n`;
    }
    return propsCode;
  }

  function getType(schemaNode: Record<string, any>): string {
    if (schemaNode.type === "object") {
      const nested = generateProperties(
        schemaNode.properties,
        schemaNode.required || []
      );
      return `{\n${nested}}`.replace(/\n/g, "\n  ");
    }
    if (schemaNode.type === "array") {
      return `${getType(schemaNode.items)}[]`;
    }
    return schemaNode.type;
  }

  tsCode += generateProperties(
    dataSchema.properties || dataSchema.items,
    dataSchema.required || []
  );
  tsCode += "\n}";
  return tsCode;
}
