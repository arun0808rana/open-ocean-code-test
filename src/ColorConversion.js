export function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '';
}

export function hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0,
        g = 0,
        b = 0;
    if (H.length === 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
    } else if (H.length === 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return `${h}, ${Math.floor(s)}, ${Math.floor(l)}`;
}


function componentToHex(c) {
    c = parseInt(c)
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(rgb) {
    
    const r = rgb.split(',')[0].trim();
    const g = rgb.split(',')[1].trim();
    const b = rgb.split(',')[2].trim();
    console.log('rgbToHexFn', r,g,b)
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function hslToHex(hsl) {
    const h = hsl.split(',')[0].trim();
    const s = hsl.split(',')[1].trim();
    let l = hsl.split(',')[2].trim();
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

export function hexColorDelta(hex1, hex2) {
    // removing hash from start
    if(hex1[0] === '#'){
        hex1 = hex1.substring(1);
    }
    if(hex2[0] === "#"){
        hex2 = hex2.substring(1);
    }
    // get red/green/blue int values of hex1
    var r1 = parseInt(hex1.substring(0, 2), 16);
    var g1 = parseInt(hex1.substring(2, 4), 16);
    var b1 = parseInt(hex1.substring(4, 6), 16);
    // get red/green/blue int values of hex2
    var r2 = parseInt(hex2.substring(0, 2), 16);
    var g2 = parseInt(hex2.substring(2, 4), 16);
    var b2 = parseInt(hex2.substring(4, 6), 16);
    // calculate differences between reds, greens and blues
    var r = 255 - Math.abs(r1 - r2);
    var g = 255 - Math.abs(g1 - g2);
    var b = 255 - Math.abs(b1 - b2);
    // limit differences between 0 and 1
    r /= 255;
    g /= 255;
    b /= 255;
    // 0 means opposite colors, 1 means same colors
    return (r + g + b) / 3;
}

export function colorToHex(color){
    if(color.includes('rgb')){
        const rgbstring = color.split('(')[1].split(')')[0]
        console.log('rgbstring--', rgbstring)
        return rgbToHex(rgbstring);
    }else if(color.includes('hsl')){
        const hslstring = color.split('(')[1].split(')')[0]
        return hslToHex(hslstring);
    }else {
        return color;
    }
}