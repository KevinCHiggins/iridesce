// thanks to Tarc's answer here https://stackoverflow.com/questions/1472514/convert-light-frequency-to-rgb
let Gamma = 0.80;
let IntensityMax = 255;
let arr = [];
export function buildColArr() {
    for (let i = 380; i <= 780; i++) {
        arr.push(lightColArray(i));
    }
    //console.log("Colour look up table complete");
   //console.log(arr[300][0]);
}
function table(wavelength) {
   // console.log("Getting member " + (wavelength - 380));
    if (wavelength < 380) {
        return arr[0];
    }
    if (wavelength > 780) {
        return arr[400];
    }
    return arr[wavelength - 380];
    //return(lightColArray(wavelength)); // the old way, if you want to see how much slower it is than the lookup table
}
export function lightCol(wavelength) {
    let rgb = table(wavelength);
    return 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2]+')';
}
export function lightColObj(wavelength) {
    //console.log("Getting colour " + wavelength);
    let rgb = table(wavelength);
    return {red: rgb[0], green: rgb[1], blue: rgb[2]};
}
function lightColArray(wavelength) {
    let factor = 0.0;
    let Red = 0;
    let Green = 0;
    let Blue = 0;

    if((wavelength >= 380) && (wavelength < 440)) {
        Red = -(wavelength - 440) / (440 - 380);
        Green = 0.0;
        Blue = 1.0;
    } else if((wavelength >= 440) && (wavelength < 490)) {
        Red = 0.0;
        Green = (wavelength - 440) / (490 - 440);
        Blue = 1.0;
    } else if((wavelength >= 490) && (wavelength < 510)) {
        Red = 0.0;
        Green = 1.0;
        Blue = -(wavelength - 510) / (510 - 490);
    } else if((wavelength >= 510) && (wavelength < 580)) {
        Red = (wavelength - 510) / (580 - 510);
        Green = 1.0;
        Blue = 0.0;
    } else if((wavelength >= 580) && (wavelength < 645)) {
        Red = 1.0;
        Green = -(wavelength - 645) / (645 - 580);
        Blue = 0.0;
    } else if((wavelength >= 645) && (wavelength < 781)) {
        Red = 1.0;
        Green = 0.0;
        Blue = 0.0;
    } else {
        Red = 0.0;
        Green = 0.0;
        Blue = 0.0;
    }

    // Let the intensity fall off near the vision limits

    if((wavelength >= 380) && (wavelength < 420)) {
        factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
    } else if((wavelength >= 420) && (wavelength < 701)) {
        factor = 1.0;
    } else if((wavelength >= 701) && (wavelength < 781)) {
        factor = 0.3 + 0.7 * (780 - wavelength) / (780 - 700);
    } else {
        factor = 0.0;
    }


    let rgb = [];

    // Don't want 0^x = 1 for x <> 0
    rgb[0] = Red == 0.0 ? 0 : Math.round(IntensityMax * Math.pow(Red * factor, Gamma));
    rgb[1] = Green == 0.0 ? 0 : Math.round(IntensityMax * Math.pow(Green * factor, Gamma));
    rgb[2] = Blue == 0.0 ? 0 : Math.round(IntensityMax * Math.pow(Blue * factor, Gamma));

    return rgb;
}

