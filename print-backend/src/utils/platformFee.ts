// export const calculatePlatformFee = (totalAmount: number): number => {
//   if (totalAmount <= 20) {
//     return 1;
//   } else {
//     return (4 / 100) * totalAmount; 
//   }
// };

// export const PRICING = {
//   bw: { firstPage: 2, extraPage: 1.5 },
//   color: { firstPage: 5, extraPage: 4 }
// };

// export const calculateFilePrice = (
//   pages: number,
//   copies: number,
//   printType: 'bw' | 'color',
//   sided: 'single' | 'double'
// ): number => {
//   const pricing = PRICING[printType];

//  if (sided === 'single') {
//     // Normal pricing per page
//     const firstPageCost = pricing.firstPage;
//     const extraPagesCost = pages > 1 ? (pages - 1) * pricing.extraPage : 0;
//     return firstPageCost + extraPagesCost;
//   } else {
//     // Double sided — pairs of pages share cost
//     // Each sheet prints 2 pages so price per sheet = extraPage rate
//     // But first sheet costs firstPage rate
//     // If odd page count, last page costs single page rate
//     const fullSheets = Math.floor(pages / 2);
//     const hasOddPage = pages % 2 !== 0;

//     let total = 0;

//     if (fullSheets > 0) {
//       // First sheet
//       total += pricing.firstPage;
//       // Remaining sheets at extra page rate
//       if (fullSheets > 1) {
//         total += (fullSheets - 1) * pricing.extraPage;
//       }
//     }

//     // Odd last page costs single page rate
//     if (hasOddPage) {
//       if (fullSheets === 0) {
//         // Only 1 page — same as single sided
//         total += pricing.firstPage;
//       } else {
//         total += pricing.extraPage;
//       }
//     }

//     return total;
//   }
// };

// export const calculateTotalFromFiles = (
//   files: { pages: number; copies: number }[],
//   printType: 'bw' | 'color'
// ): number => {
//   const total = files.reduce((sum, file) => {
//     return sum + calculateFilePrice(
//       file.pages || 1,
//       file.copies || 1,
//       printType
//     );
//   }, 0);
//   return Math.round(total * 100) / 100;
// };

// export const calculatePlatformFee = (totalAmount: number): number => {
//   if (totalAmount <= 20) {
//     return 1;
//   } else {
//     return Math.round((4 / 100) * totalAmount * 100) / 100;
//   }
// };
export const PRICING = {
  bw: { firstPage: 2, extraPage: 1.5 },
  color: { firstPage: 5, extraPage: 4 }
};

export const calculatePagePrice = (
  pages: number,
  printType: 'bw' | 'color',
  sided: 'single' | 'double'
): number => {
  const pricing = PRICING[printType];

  if (sided === 'single') {
    // Normal pricing per page
    const firstPageCost = pricing.firstPage;
    const extraPagesCost = pages > 1 ? (pages - 1) * pricing.extraPage : 0;
    return firstPageCost + extraPagesCost;
  } else {
    // Double sided — pairs of pages share cost
    // Each sheet prints 2 pages so price per sheet = extraPage rate
    // But first sheet costs firstPage rate
    // If odd page count, last page costs single page rate
    const fullSheets = Math.floor(pages / 2);
    const hasOddPage = pages % 2 !== 0;

    let total = 0;

    if (fullSheets > 0) {
      // First sheet
      total += pricing.firstPage;
      // Remaining sheets at extra page rate
      if (fullSheets > 1) {
        total += (fullSheets - 1) * pricing.extraPage;
      }
    }

    // Odd last page costs single page rate
    if (hasOddPage) {
      if (fullSheets === 0) {
        // Only 1 page — same as single sided
        total += pricing.firstPage;
      } else {
        total += pricing.extraPage;
      }
    }

    return total;
  }
};

export const calculateFilePrice = (
  pages: number,
  copies: number,
  printType: 'bw' | 'color',
  sided: 'single' | 'double' = 'single'
): number => {
  const pricePerCopy = calculatePagePrice(pages, printType, sided);
  return Math.round(pricePerCopy * copies * 100) / 100;
};

export const calculateTotalFromFiles = (
  files: {
    pages: number;
    copies: number;
    printType?: 'bw' | 'color';
    sided?: 'single' | 'double';
  }[],
  defaultPrintType: 'bw' | 'color' = 'bw'
): number => {
  const total = files.reduce((sum, file) => {
    return sum + calculateFilePrice(
      file.pages || 1,
      file.copies || 1,
      file.printType || defaultPrintType,
      file.sided || 'single'
    );
  }, 0);
  return Math.round(total * 100) / 100;
};

export const calculatePlatformFee = (totalAmount: number): number => {
  if (totalAmount <= 20) {
    return 1;
  } else {
    return Math.round((4 / 100) * totalAmount * 100) / 100;
  }
};