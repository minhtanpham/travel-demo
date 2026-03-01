import styles from './Frame35058.module.css';

/**
 * Helper function to convert Figma RGBA color objects to CSS rgb() or rgba() strings.
 * @param colorObj The Figma color object containing r, g, b, and optional opacity.
 * @returns A CSS color string (e.g., "rgb(255, 0, 0)" or "rgba(0, 0, 255, 0.5)").
 */
function figmaColorToCss(colorObj: { r: number; g: number; b: number; opacity?: number }): string {
  const r = Math.round(colorObj.r * 255);
  const g = Math.round(colorObj.g * 255);
  const b = Math.round(colorObj.b * 255);
  if (colorObj.opacity !== undefined && colorObj.opacity < 1) {
    return `rgba(${r}, ${g}, ${b}, ${colorObj.opacity})`;
  }
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Interface for a single color swatch, defining its shade name/number, hex code, and CSS color value.
 */
interface ColorSwatchProps {
  /** The shade name or number of the color (e.g., "100", "Primary"). */
  shade: string;
  /** The HEX code representation of the color (e.g., "#E7F3F4"). */
  hexCode: string;
  /** The CSS color value (e.g., "rgb(231, 243, 244)") for the swatch block background. */
  color: string;
}

/**
 * Props for the Frame35058 component.
 */
interface Frame35058Props {
  /** The main title for the color palette section. Defaults to "Crystal blue". */
  title?: string;
  /** A descriptive text explaining the context or usage of the colors. Defaults to a description about brand color usage. */
  description?: string;
  /** An array of color swatch data to display in the palette. Defaults to the palette shown in the Figma frame. */
  palette?: ColorSwatchProps[];
}

// Data extracted directly from the Figma JSON for default props.
const defaultPaletteData: ColorSwatchProps[] = [
  { shade: "100", hexCode: "#E7F3F4", color: figmaColorToCss({ r: 0.9054081439971924, g: 0.9514545798301697, b: 0.9572103023529053, opacity: 1 }) },
  { shade: "200", hexCode: "#DBEEEF", color: figmaColorToCss({ r: 0.8588235378265381, g: 0.9333333373069763, b: 0.9372549057006836, opacity: 1 }) },
  { shade: "300", hexCode: "#C5E3E4", color: figmaColorToCss({ r: 0.772549033164978, g: 0.8901960849761963, b: 0.8941176533699036, opacity: 1 }) },
  { shade: "400", hexCode: "#B1D8DA", color: figmaColorToCss({ r: 0.6941176652908325, g: 0.8470588326454163, b: 0.8549019694328308, opacity: 1 }) },
  { shade: "500", hexCode: "#9CCCD0", color: figmaColorToCss({ r: 0.6117647290229797, g: 0.800000011920929, b: 0.8156862854957581, opacity: 1 }) },
  { shade: "600", hexCode: "#88C1C6", color: figmaColorToCss({ r: 0.5333333611488342, g: 0.7568627595901489, b: 0.7764706015586853, opacity: 1 }) },
  { shade: "700", hexCode: "#75B6BC", color: figmaColorToCss({ r: 0.4588235318660736, g: 0.7137255072593689, b: 0.7372549176216125, opacity: 1 }) },
  { shade: "800", hexCode: "#63ABB1", color: figmaColorToCss({ r: 0.38823530077934265, g: 0.6705882549285889, b: 0.6941176652908325, opacity: 1 }) },
  { shade: "900", hexCode: "#56949B", color: figmaColorToCss({ r: 0.33725491166114807, g: 0.5803921818733215, b: 0.6078431606292725, opacity: 1 }) },
  { shade: "1000", hexCode: "#497E84", color: figmaColorToCss({ r: 0.2862745225429535, g: 0.4941176474094391, b: 0.5176470875740051, opacity: 1 }) },
  { shade: "1100", hexCode: "#426568", color: figmaColorToCss({ r: 0.25882354378700256, g: 0.3960784375667572, b: 0.40784314274787903, opacity: 1 }) },
  { shade: "1200", hexCode: "#394C4F", color: figmaColorToCss({ r: 0.2235294133424759, g: 0.2980392277240753, b: 0.30980393290519714, opacity: 1 }) },
  { shade: "1300", hexCode: "#313F41", color: figmaColorToCss({ r: 0.1921568661928177, g: 0.24705882370471954, b: 0.2549019753932953, opacity: 1 }) },
  { shade: "1400", hexCode: "#293335", color: figmaColorToCss({ r: 0.16078431904315948, g: 0.20000000298023224, b: 0.2078431397676468, opacity: 1 }) },
  { shade: "1500", hexCode: "#1C2425", color: figmaColorToCss({ r: 0.10980392247438431, g: 0.1411764770746231, b: 0.14509804546833038, opacity: 1 }) },
];

/**
 * A reusable React component inspired by "Frame 35058" in Figma.
 * It displays a color palette with a main title and a descriptive text,
 * showcasing various shades of a color along with their hex codes.
 * The component is responsive and uses CSS Modules for styling.
 */
const Frame35058 = ({
  title = "Crystal blue",
  description = "The primary color is your \"brand\" color, and is used across all interactive elements such as buttons, links, inputs, etc. This color can define the overall feel and can elicit emotion.",
  palette = defaultPaletteData,
}: Frame35058Props) => {
  return (
    <section className={styles.frame35058}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.swatchesContainer}>
        {palette.map((swatch, index) => (
          <div key={index} className={styles.colorSwatch}>
            <div className={styles.colorBlock} style={{ backgroundColor: swatch.color }}></div>
            <div className={styles.colorInfo}>
              <span className={styles.shade}>{swatch.shade}</span>
              <div className={styles.hexTag}>
                <span className={styles.hexCode}>{swatch.hexCode}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Frame35058;
