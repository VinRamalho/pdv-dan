import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { purchasers, shipTos, suppliers } from 'src/pdv/data';
import { PDVDocument } from 'src/pdv/schemas/pdv.schema';
import { Product } from 'src/product/entities/product.entity';
import { formatCurrency } from './utils';

interface ProductPDV {
  product: Product;
  quantity: number;
  discount?: number;
}

@Injectable()
export class AttachmentService {
  private readonly path: string;
  private readonly stage: string;

  constructor() {
    const pathData = process.env.PUPPETEER_EXECUTABLE_PATH;
    const stageData = process.env.APP_STAGE;

    if (!pathData || !stageData) {
      throw new Error(
        'PUPPETEER_EXECUTABLE_PATH or APP_STAGE environment variable is not set.',
      );
    }

    this.path = pathData;
    this.stage = stageData;
  }

  async generateOsReceiptPdf(data: PDVDocument): Promise<Uint8Array> {
    const { products, supplier, purchaser, shipTo } = data;

    const supplierSelected = suppliers[supplier] ?? {};
    const purchaserSelected = purchasers[purchaser] ?? {};
    const shipToSelected = shipTos[shipTo] ?? {};

    const html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Purchase Order ${data.sequence}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                body {
                    font-family: 'Inter', sans-serif; /* Using Inter as a default sans-serif font */
                    margin: 0;
                    padding: 0;
                    background-color: #f8f9fa; /* Light gray background for the page */
                    color: #212529; /* Dark gray text color for better readability */
                }
                .container {
                    max-width: 800px; /* Max width for the content */
                    margin: 20px auto; /* Centering the content */
                    padding: 20px;
                    background-color: #ffffff; /* White background for the content area */
                    border: 1px solid #dee2e6; /* Light border */
                    border-radius: 8px; /* Rounded corners for the container */
                    box-shadow: 0 0 10px rgba(0,0,0,0.05); /* Subtle shadow */
                }
                .header-section, .to-section, .po-details-section, .ship-to-section, .total-section {
                    margin-bottom: 20px;
                    padding: 15px;
                    border: 1px solid #e9ecef;
                    border-radius: 6px;
                    background-color: #f8f9fa;
                }
                .header-section h1 {
                    font-size: 1.5em; /* Slightly larger font for the main company name */
                    font-weight: bold;
                    color: #007bff; /* Blue color for the main company name */
                    margin-bottom: 5px;
                }
                .header-section p, .to-section p, .po-details-section p, .ship-to-section p {
                    margin: 5px 0;
                    font-size: 0.9em;
                    line-height: 1.6;
                }
                .po-details-section {
                    text-align: right; /* Align PO details to the right */
                }
                .po-details-section p {
                    font-weight: bold;
                }
                table {
                    width: 100%;
                    border-collapse: collapse; /* Remove default table spacing */
                    margin-bottom: 20px;
                    font-size: 0.85em;
                }
                th, td {
                    border: 1px solid #dee2e6; /* Lighter border for table cells */
                    padding: 10px; /* More padding for table cells */
                    text-align: left;
                    vertical-align: top; /* Align content to the top of the cell */
                }
                th {
                    background-color: #e9ecef; /* Light gray background for table headers */
                    font-weight: bold; /* Bold text for headers */
                }
                .total-section strong {
                    font-size: 1.1em; /* Larger font for the total amount */
                    color: #28a745; /* Green color for the total */
                }
                .item-index {
                    width: 5%;
                    text-align: center;
                }
                .part-number-col {
                    width: 25%;
                }
                .quantity-col, .unit-price-col, .extended-price-col {
                    width: 15%;
                    text-align: right;
                }
                .customs-item-col {
                    width: 10%;
                    text-align: center;
                }
                .description-col { /* For Part Description */
                    width: 30%;
                }

                /* Responsive adjustments */
                @media (max-width: 768px) {
                    .container {
                        margin: 10px;
                        padding: 15px;
                    }
                    .header-section h1 {
                        font-size: 1.3em;
                    }
                    .header-section p, .to-section p, .po-details-section p, .ship-to-section p, table {
                        font-size: 0.8em;
                    }
                    th, td {
                        padding: 8px;
                    }
                    .po-details-section {
                        text-align: left; /* Stack PO details on smaller screens */
                    }
                    /* Allow table to scroll horizontally on small screens */
                    .table-responsive {
                        overflow-x: auto;
                        -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header-section">
                    <h1>${supplierSelected.name}</h1>
                    <p>${supplierSelected.address}</p>
                    <p>${supplierSelected.city}</p>
                    <p>${supplierSelected.country}</p>
                    ${
                      supplierSelected.phone
                        ? `<p>Tel.: ${supplierSelected.phone}</p>`
                        : ''
                    }
                    ${
                      supplierSelected.fax
                        ? `<p>Fax: ${supplierSelected.fax}</p>`
                        : ''
                    }
                </div>

                <div class="to-section">
                    <p><strong>To: ${purchaserSelected.name}</strong></p>
                    <p>${purchaserSelected.address}</p>
                    <p>${purchaserSelected.city} ${
      purchaserSelected.country
    }</p>
                    ${
                      purchaserSelected.cnpj
                        ? `<p>CNPJ ${purchaserSelected.cnpj}</p>`
                        : ''
                    }
                    ${
                      purchaserSelected.vatId
                        ? `<p>VAT ID ${purchaserSelected.vatId}</p>`
                        : ''
                    }
                    ${
                      purchaserSelected.ein
                        ? `<p>EIN ${purchaserSelected.ein}</p>`
                        : ''
                    }
                    ${
                      purchaserSelected.phone
                        ? `<p>Tel.: ${purchaserSelected.phone}</p>`
                        : ''
                    }
                    ${
                      purchaserSelected.email
                        ? `<p>e-mail: ${purchaserSelected.email}</p>`
                        : ''
                    }
                </div>

                <div class="po-details-section">
                    <p>Purchase Order ${data.sequence}</p>
                    <p>${new Date().toLocaleDateString()}</p>
                </div>

                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th class="item-index">#</th>
                                <th class="part-number-col">Part Number</th>
                                <th class="description-col">Part Description</th>
                                <th class="quantity-col">Quantity</th>
                                <th class="unit-price-col">Unit Price</th>
                                <th class="extended-price-col">Extended Price</th>
                                <th class="customs-item-col">Customs Item</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${products
                              .map(
                                (product: ProductPDV, index) => `
                                <tr>
                                    <td class="item-index">${index + 1}</td>
                                    <td class="part-number-col">${
                                      product.product.title
                                    }</td>
                                    <td class="description-col">${
                                      product.product.description
                                    }</td>
                                    <td class="quantity-col">${
                                      product.quantity
                                    }</td>
                                    <td class="unit-price-col">${formatCurrency(
                                      product.product.price *
                                        (1 - (product.discount ?? 0) / 100),
                                    )}</td>
                                    <td class="extended-price-col">${formatCurrency(
                                      product.quantity *
                                        product.product.price *
                                        (1 - (product.discount ?? 0) / 100),
                                    )}</td>
                                    <td class="customs-item-col">${''}</td> 
                                </tr>
                            `,
                              )
                              .join('')}
                            <tr><td colspan="7">&nbsp;</td></tr>
                        </tbody>
                    </table>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap;">
                    <div class="ship-to-section" style="flex-basis: 60%;">
                        <p><strong>SHIP TO:</strong></p>
                        <p>${shipToSelected.name}</p>
                        <p>${shipToSelected.address}</p>
                        <p>${shipToSelected.city}, ${shipToSelected.country}</p>
                        ${
                          shipToSelected.phone
                            ? `<p>Fone: ${shipToSelected.phone}</p>`
                            : ''
                        }
                    </div>
                    <div class="total-section" style="flex-basis: 35%; text-align: right;">
                        <p><strong>TOTAL</strong></p>
                        <p><strong>${formatCurrency(
                          products.reduce(
                            (total, product: ProductPDV) =>
                              total +
                              product.quantity *
                                product.product.price *
                                (1 - (product.discount ?? 0) / 100),
                            0,
                          ),
                        )}</strong></p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    const browser = await puppeteer.launch({
      headless: true, // case debug, change to false
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: this.stage === 'prod' && this.path,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        bottom: '10mm',
        left: '10mm',
        right: '10mm',
      },
    });
    await browser.close();
    return Uint8Array.from(pdfBuffer);
  }
}
