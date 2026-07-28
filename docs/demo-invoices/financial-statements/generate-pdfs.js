const puppeteer = require('puppeteer');
const path = require('path');

async function generatePDF(htmlFile, outputFile) {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    const filePath = path.resolve(__dirname, htmlFile);
    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });

    await page.pdf({
        path: path.resolve(__dirname, outputFile),
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
        preferCSSPageSize: true
    });

    await browser.close();
    console.log(`Generated: ${outputFile}`);
}

async function main() {
    try {
        await generatePDF('ENCORE_CLACK_AFS_2023.html', 'ENCORE_CLACK_AFS_2023.pdf');
        await generatePDF('ENCORE_CLACK_AFS_2024.html', 'ENCORE_CLACK_AFS_2024.pdf');
        console.log('\nAll PDFs generated successfully!');
    } catch (error) {
        console.error('Error generating PDFs:', error.message);
        process.exit(1);
    }
}

main();
