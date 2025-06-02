import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { PDV } from 'src/pdv/entities/pdv.entity';
import { PDVDocument } from 'src/pdv/schemas/pdv.schema';

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
    const html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Purchase Order 2555000027 - rev1</title>
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
                    <h1>Kramer Electronics USA</h1>
                    <p>6 ROUTE 173 WEST CLINTON, NJ 08809</p>
                    <p>NEW JERSEY</p>
                    <p>US</p>
                    <p>Tel.: (908)735-0018</p>
                </div>

                <div class="to-section">
                    <p><strong>To: LECRAN TECNOLOGIA E COMERCIO DE ELETRONICOS LTDA - MG</strong></p>
                    <p>ROD FERNAO DIAS - BR 381, km 849</p>
                    <p>IPIRANGA - SETOR INDUSTRIAL - POUSO ALEGRE-MG 37556-338 Brazil</p>
                    <p>CNPJ 28.914.942/0002-85 // VAT ID 005.041.917.00-14</p>
                    <p>Tel.: +55 11 39269435</p>
                    <p>e-mail: dtomaz@lecrantek.com</p>
                </div>

                <div class="po-details-section">
                    <p>Purchase Order 2555000027 - rev1</p>
                    <p>1-jun-25</p>
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
                            <tr>
                                <td class="item-index">1</td>
                                <td class="part-number-col">97-0101006</td>
                                <td class="description-col">C-HM/HM-6</td>
                                <td class="quantity-col">200</td>
                                <td class="unit-price-col">USD 7,00</td>
                                <td class="extended-price-col">USD 1.400,00</td>
                                <td class="customs-item-col"></td>
                            </tr>
                            <tr>
                                <td class="item-index">2</td>
                                <td class="part-number-col">85-0009399</td>
                                <td class="description-col">W-H(W-HDMI)(B)</td>
                                <td class="quantity-col">50</td>
                                <td class="unit-price-col">USD 14.50</td>
                                <td class="extended-price-col">USD 725,00</td>
                                <td class="customs-item-col"></td>
                            </tr>
                            <tr>
                                <td class="item-index">3</td>
                                <td class="part-number-col">97-0101035</td>
                                <td class="description-col">C-HM/HM-35</td>
                                <td class="quantity-col">30</td>
                                <td class="unit-price-col">USD 25,50</td>
                                <td class="extended-price-col">USD 765,00</td>
                                <td class="customs-item-col"></td>
                            </tr>
                            <tr>
                                <td class="item-index">4</td>
                                <td class="part-number-col">96-0216035</td>
                                <td class="description-col">CA-USB3/AAE-35</td>
                                <td class="quantity-col">70</td>
                                <td class="unit-price-col">USD 55.50</td>
                                <td class="extended-price-col">USD 3.885,00</td>
                                <td class="customs-item-col"></td>
                            </tr>
                            <tr>
                                <td class="item-index">5</td>
                                <td class="part-number-col">97-01114010</td>
                                <td class="description-col">C-HM/HM/PRO10-</td>
                                <td class="quantity-col">41</td>
                                <td class="unit-price-col">USD 12.00</td>
                                <td class="extended-price-col">USD 492,00</td>
                                <td class="customs-item-col"></td>
                            </tr>
                            <tr>
                                <td class="item-index">6</td>
                                <td class="part-number-col">95-1211003</td>
                                <td class="description-col">C-XLQM/XLQF-3</td>
                                <td class="quantity-col">1</td>
                                <td class="unit-price-col">USD 5.00</td>
                                <td class="extended-price-col">USD 5,00</td>
                                <td class="customs-item-col"></td>
                            </tr>
                            <tr>
                                <td class="item-index">7</td>
                                <td class="part-number-col">95-0101003</td>
                                <td class="description-col">C-A35M/A35M-3</td>
                                <td class="quantity-col">1</td>
                                <td class="unit-price-col">USD 1,50</td>
                                <td class="extended-price-col">USD 1,50</td>
                                <td class="customs-item-col"></td>
                            </tr>
                            <tr>
                                <td class="item-index">8</td>
                                <td class="part-number-col">96-02357206</td>
                                <td class="description-col">C-USB/CA-6</td>
                                <td class="quantity-col">10</td>
                                <td class="unit-price-col">USD 5,00</td>
                                <td class="extended-price-col">USD 50.00</td>
                                <td class="customs-item-col"></td>
                            </tr>
                            <tr>
                                <td class="item-index">9</td>
                                <td class="part-number-col">80-00033099</td>
                                <td class="description-col">WU-CC(B)</td>
                                <td class="quantity-col">2</td>
                                <td class="unit-price-col">USD 32,50</td>
                                <td class="extended-price-col">USD 65,00</td>
                                <td class="customs-item-col"></td>
                            </tr>
                            <tr>
                                <td class="item-index">10</td>
                                <td class="part-number-col">97-04500015</td>
                                <td class="description-col">CLS-AOCU32/FF-15</td>
                                <td class="quantity-col">4</td>
                                <td class="unit-price-col">USD 175,00</td>
                                <td class="extended-price-col">USD 700,00</td>
                                <td class="customs-item-col"></td>
                            </tr>
                            <tr>
                                <td class="item-index">11</td>
                                <td class="part-number-col">96-0235106</td>
                                <td class="description-col">C-U32/FF-6</td>
                                <td class="quantity-col">10</td>
                                <td class="unit-price-col">USD 16,00</td>
                                <td class="extended-price-col">USD 160,00</td>
                                <td class="customs-item-col"></td>
                            </tr>
                            <tr>
                                <td class="item-index">12</td>
                                <td class="part-number-col">87-00002090</td>
                                <td class="description-col">VP-440X</td>
                                <td class="quantity-col">2</td>
                                <td class="unit-price-col">USD 700,00</td>
                                <td class="extended-price-col">USD 1.400,00</td>
                                <td class="customs-item-col"></td>
                            </tr>
                            <tr>
                                <td class="item-index">13</td>
                                <td class="part-number-col">97-0132006</td>
                                <td class="description-col">C-HM/HM/PICO/BK-6</td>
                                <td class="quantity-col">5</td>
                                <td class="unit-price-col">USD 6,50</td>
                                <td class="extended-price-col">USD 32,50</td>
                                <td class="customs-item-col"></td>
                            </tr>
                            <tr>
                                <td class="item-index">14</td>
                                <td class="part-number-col">96-02357103</td>
                                <td class="description-col">C-USB31/CB-3</td>
                                <td class="quantity-col">7</td>
                                <td class="unit-price-col">USD 10,00</td>
                                <td class="extended-price-col">USD 70,00</td>
                                <td class="customs-item-col"></td>
                            </tr>
                            <tr>
                                <td class="item-index">15</td>
                                <td class="part-number-col">96-0235106</td> <td class="description-col">C-U32/FF-6</td> <td class="quantity-col">4</td>
                                <td class="unit-price-col">USD 16,00</td>
                                <td class="extended-price-col">USD 64,00</td>
                                <td class="customs-item-col"></td>
                            </tr>
                            <tr>
                                <td class="item-index">16</td>
                                <td class="part-number-col">97-0601006</td>
                                <td class="description-col">C-DPM/HM-6</td>
                                <td class="quantity-col">1</td>
                                <td class="unit-price-col">USD 11,00</td>
                                <td class="extended-price-col">USD 11,00</td>
                                <td class="customs-item-col"></td>
                            </tr>
                            <tr><td colspan="7">&nbsp;</td></tr>
                        </tbody>
                    </table>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap;">
                    <div class="ship-to-section" style="flex-basis: 60%;">
                        <p><strong>SHIP TO:</strong></p>
                        <p>FAM CARGO</p>
                        <p>USAMIAMI/NORFOLK</p>
                        <p>FAM CARGO USA LLC</p>
                        <p>1940 NW 82 Ave, FL 33126. United States</p>
                        <p>Fone: +1 (850) 308-3511</p>
                    </div>
                    <div class="total-section" style="flex-basis: 35%; text-align: right;">
                        <p><strong>TOTAL</strong></p>
                        <p><strong>USD 9.826,00</strong></p>
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
