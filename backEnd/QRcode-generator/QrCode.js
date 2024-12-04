import qr from "qr-image";
import fs from "fs";
import env from "dotenv";



env.config();
// generate qr code
function qrCodeGenerator() {
    
    const qr_png = qr.image(process.env.APPLESTORE_URL);
    const writableFile = fs.createWriteStream(" qr-code.png");
    
    qr_png.pipe(writableFile);

    writableFile.on("finish", ()=>{
        console.log("Qr code generated.");
    });
}

export default qrCodeGenerator;