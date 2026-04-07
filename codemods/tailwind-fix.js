export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  function convertPxToScale(value) {
    const match = value.match(/^\[(\d+)px\]$/);
    if (!match) return value;

    const px = parseInt(match[1], 10);
    const scale = px / 4;

    return Number.isInteger(scale) ? scale.toString() : value;
  }

  function fixClassNames(classString) {
    return classString
      .split(/\s+/)
      .map((cls) => {
        // Convert arbitrary spacing
        if (cls.match(/^[whmp][trblxy]?-\[\d+px\]$/)) {
          const [prefix, val] = cls.split("-");
          return `${prefix}-${convertPxToScale(val)}`;
        }

        // Tailwind v4 gradient fixes
        if (cls.startsWith("bg-gradient-to-")) {
          return cls.replace("bg-gradient-to-", "bg-linear-to-");
        }

        return cls;
      })
      .join(" ");
  }

  root.find(j.JSXAttribute, { name: { name: "className" } }).forEach((path) => {
    const value = path.node.value;

    if (value.type === "StringLiteral") {
      value.value = fixClassNames(value.value);
    }

    if (value.type === "JSXExpressionContainer") {
      if (value.expression.type === "Literal") {
        value.expression.value = fixClassNames(value.expression.value);
      }
    }
  });

  return root.toSource();
}