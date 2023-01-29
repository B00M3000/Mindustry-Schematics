export interface SVG {
    attributes?: SVGAttributes;
    source: string;
}

export interface SVGAttributes {
    viewBox?: string;
    stroke?: string;
    fill?: string;
}