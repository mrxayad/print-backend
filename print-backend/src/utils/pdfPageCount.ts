import pdfParse from 'pdf-parse';
import fs from 'fs'; 
 
 export const getPdfPageCount = async (filePath: string): Promise<number> => { 
    try { 
        const dataBuffer = fs.readFileSync(filePath); 
        const data = await pdfParse(dataBuffer); 
        console.log(`PDF pages counted: ${data.numpages} for ${filePath}`);
         return data.numpages;
         } 
         catch (error) 
         { console.error('Error counting PDF pages:', error);
     return 1; // default to 1 page if counting fails 
     }
     };