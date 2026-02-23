// @ts-nocheck
// invoiceGenerator.ts
import puppeteer, { Browser } from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

export interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
}

export interface ClientInfo {
    name: string;
    address: string;
    email: string;
    phone?: string;
    siret?: string;
}

export interface CompanyInfo {
    name: string;
    address: string;
    phone: string;
    email: string;
    siret: string;
    logo?: string;
}

export interface InvoiceData {
    invoiceNumber: string;
    issueDate: Date;
    dueDate: Date;
    company: CompanyInfo;
    client: ClientInfo;
    items: InvoiceItem[];
    currency?: string;
    paymentTerms?: string;
    notes?: string;
}

export class InvoiceGenerator {
    private browser: Browser | null = null;

    constructor(private templatePath?: string) { }

    async initialize(): Promise<void> {
        this.browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }

    async generatePDF(invoiceData: InvoiceData, outputPath: string): Promise<void> {
        if (!this.browser) {
            await this.initialize();
        }

        const htmlContent = await this.generateHTML(invoiceData);
        const page = await this.browser!.newPage();

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Options du PDF
        const pdfOptions = {
            path: outputPath,
            format: 'A4' as const,
            margin: {
                top: '60px',
                bottom: '60px',
                left: '50px',
                right: '50px'
            },
            printBackground: true
        };

        await page.pdf(pdfOptions);
        await page.close();

        console.log(`Facture générée: ${outputPath}`);
    }

    private async generateHTML(data: InvoiceData): Promise<string> {
        // Utiliser un template personnalisé ou le template par défaut
        if (this.templatePath) {
            try {
                const template = await fs.readFile(this.templatePath, 'utf-8');
                return this.populateTemplate(template, data);
            } catch (error) {
                console.warn('Template personnalisé non trouvé, utilisation du template par défaut');
                return this.generateDefaultHTML(data);
            }
        }

        return this.generateDefaultHTML(data);
    }

    private generateDefaultHTML(data: InvoiceData): string {
        const subtotal = this.calculateSubtotal(data.items);
        const taxTotal = this.calculateTaxTotal(data.items);
        const total = subtotal + taxTotal;

        return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture ${data.invoiceNumber}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }
        
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            border-bottom: 2px solid #2c3e50;
            padding-bottom: 20px;
        }
        
        .company-info {
            flex: 1;
        }
        
        .invoice-info {
            text-align: right;
            flex: 1;
        }
        
        .logo {
            max-width: 150px;
            margin-bottom: 20px;
        }
        
        .client-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 30px;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
        }
        
        .items-table th {
            background: #2c3e50;
            color: white;
            padding: 12px;
            text-align: left;
        }
        
        .items-table td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
        }
        
        .items-table tr:nth-child(even) {
            background: #f8f9fa;
        }
        
        .totals {
            float: right;
            width: 300px;
            margin-top: 20px;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        
        .total-row.final {
            font-size: 1.2em;
            font-weight: bold;
            border-top: 2px solid #2c3e50;
            padding-top: 10px;
            margin-top: 10px;
        }
        
        .footer {
            margin-top: 100px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 0.9em;
            color: #666;
        }
        
        .payment-info {
            background: #e8f4fc;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <div class="company-info">
                ${data.company.logo ? `<img src="file://${path.resolve(data.company.logo)}" class="logo" alt="Logo">` : ''}
                <h1>${data.company.name}</h1>
                <p>${data.company.address.replace(/\n/g, '<br>')}</p>
                <p>Tél: ${data.company.phone}</p>
                <p>Email: ${data.company.email}</p>
                <p>SIRET: ${data.company.siret}</p>
            </div>
            
            <div class="invoice-info">
                <h2>FACTURE</h2>
                <p><strong>N°:</strong> ${data.invoiceNumber}</p>
                <p><strong>Date d'émission:</strong> ${this.formatDate(data.issueDate)}</p>
                <p><strong>Date d'échéance:</strong> ${this.formatDate(data.dueDate)}</p>
            </div>
        </div>
        
        <div class="client-info">
            <h3>CLIENT</h3>
            <p><strong>${data.client.name}</strong></p>
            <p>${data.client.address.replace(/\n/g, '<br>')}</p>
            <p>Email: ${data.client.email}</p>
            ${data.client.phone ? `<p>Tél: ${data.client.phone}</p>` : ''}
            ${data.client.siret ? `<p>SIRET: ${data.client.siret}</p>` : ''}
        </div>
        
        <table class="items-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>TVA</th>
                    <th>Total HT</th>
                </tr>
            </thead>
            <tbody>
                ${data.items.map(item => `
                    <tr>
                        <td>${item.description}</td>
                        <td>${item.quantity}</td>
                        <td>${this.formatCurrency(item.unitPrice, data.currency)}</td>
                        <td>${item.taxRate ? item.taxRate + '%' : '0%'}</td>
                        <td>${this.formatCurrency(item.quantity * item.unitPrice, data.currency)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="totals">
            <div class="total-row">
                <span>Sous-total HT:</span>
                <span>${this.formatCurrency(subtotal, data.currency)}</span>
            </div>
            <div class="total-row">
                <span>TVA:</span>
                <span>${this.formatCurrency(taxTotal, data.currency)}</span>
            </div>
            <div class="total-row final">
                <span>TOTAL TTC:</span>
                <span>${this.formatCurrency(total, data.currency)}</span>
            </div>
        </div>
        
        <div class="footer">
            ${data.paymentTerms ? `
            <div class="payment-info">
                <h4>Conditions de paiement</h4>
                <p>${data.paymentTerms}</p>
            </div>
            ` : ''}
            
            ${data.notes ? `
            <div class="notes">
                <h4>Notes</h4>
                <p>${data.notes.replace(/\n/g, '<br>')}</p>
            </div>
            ` : ''}
            
            <p>Merci pour votre confiance !</p>
        </div>
    </div>
</body>
</html>`;
    }

    private populateTemplate(template: string, data: InvoiceData): string {
        // Remplace les placeholders du template
        let html = template;

        // Remplacer les variables simples
        html = html.replace(/\{\{invoiceNumber\}\}/g, data.invoiceNumber)
            .replace(/\{\{issueDate\}\}/g, this.formatDate(data.issueDate))
            .replace(/\{\{dueDate\}\}/g, this.formatDate(data.dueDate));

        // Calculer les totaux
        const subtotal = this.calculateSubtotal(data.items);
        const taxTotal = this.calculateTaxTotal(data.items);
        const total = subtotal + taxTotal;

        // Remplacer les totaux
        html = html.replace(/\{\{subtotal\}\}/g, this.formatCurrency(subtotal, data.currency))
            .replace(/\{\{taxTotal\}\}/g, this.formatCurrency(taxTotal, data.currency))
            .replace(/\{\{total\}\}/g, this.formatCurrency(total, data.currency));

        // Générer le tableau des items
        const itemsHTML = data.items.map(item => `
      <tr>
        <td>${item.description}</td>
        <td>${item.quantity}</td>
        <td>${this.formatCurrency(item.unitPrice, data.currency)}</td>
        <td>${item.taxRate ? item.taxRate + '%' : '0%'}</td>
        <td>${this.formatCurrency(item.quantity * item.unitPrice, data.currency)}</td>
      </tr>
    `).join('');

        html = html.replace(/\{\{items\}\}/g, itemsHTML);

        return html;
    }

    private calculateSubtotal(items: InvoiceItem[]): number {
        return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    }

    private calculateTaxTotal(items: InvoiceItem[]): number {
        return items.reduce((sum, item) => {
            const taxRate = item.taxRate || 0;
            return sum + (item.quantity * item.unitPrice * taxRate / 100);
        }, 0);
    }

    private formatDate(date: Date): string {
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    private formatCurrency(amount: number, currency: string = 'EUR'): string {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    async close(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}

// Exemple d'utilisation
export async function createExampleInvoice(): Promise<void> {
    const generator = new InvoiceGenerator();

    const invoiceData: InvoiceData = {
        invoiceNumber: 'FAC-2023-001',
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
        company: {
            name: 'Tech Solutions SARL',
            address: '123 Rue de la Technologie\n75001 Paris',
            phone: '+33 1 23 45 67 89',
            email: 'contact@techsolutions.fr',
            siret: '123 456 789 00010',
            logo: './logo.png' // Chemin vers un logo optionnel
        },
        client: {
            name: 'Entreprise Client SA',
            address: '456 Avenue des Clients\n69002 Lyon',
            email: 'compta@cliententreprise.fr',
            phone: '+33 4 56 78 90 12',
            siret: '987 654 321 00020'
        },
        items: [
            {
                description: 'Développement application web',
                quantity: 10,
                unitPrice: 500,
                taxRate: 20
            },
            {
                description: 'Hébergement mensuel',
                quantity: 3,
                unitPrice: 50,
                taxRate: 20
            },
            {
                description: 'Formation technique',
                quantity: 8,
                unitPrice: 75,
                taxRate: 10
            }
        ],
        currency: 'EUR',
        paymentTerms: 'Paiement sous 30 jours. Pénailité de retard: 1,5% par mois.',
        notes: 'Tous les prix sont nets.\nEn cas de retard de paiement, des frais de recouvrement seront appliqués.'
    };

    try {
        await generator.initialize();
        await generator.generatePDF(invoiceData, './facture-exemple.pdf');
    } finally {
        await generator.close();
    }
}

// Exécuter l'exemple si le script est lancé directement
if (require.main === module) {
    createExampleInvoice().catch(console.error);
}