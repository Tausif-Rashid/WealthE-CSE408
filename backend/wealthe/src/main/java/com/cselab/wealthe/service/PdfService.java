package com.cselab.wealthe.service;

import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.properties.UnitValue;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.cselab.wealthe.service.FetchPdfDataService.TaxFormData;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class PdfService {
    
    private static final Logger logger = LoggerFactory.getLogger(PdfService.class);
    private static final String PDF_DIRECTORY = "generated_pdfs";
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private FetchPdfDataService fetchPdfDataService;
    
    public String generateTaxFormPdf() throws Exception {
        // Create directory if it doesn't exist
        File directory = new File(PDF_DIRECTORY);
        if (!directory.exists()) {
            directory.mkdirs();
        }
        
        // Get authenticated user ID
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        int userId = Integer.parseInt(auth.getName());
        
        if (userId == 0) {
            throw new RuntimeException("User not authenticated");
        }
        
        // Fetch all tax form data using FetchPdfDataService
        TaxFormData taxFormData = fetchPdfDataService.fetchAllTaxFormData(userId);
        
        if (taxFormData == null) {
            throw new RuntimeException("Tax form data not found");
        }
        
        // Generate filename with timestamp
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String filename = String.format("tax_form_%d_%s.pdf", userId, timestamp);
        String filePath = PDF_DIRECTORY + File.separator + filename;
        
        // Create PDF
        try (FileOutputStream fos = new FileOutputStream(filePath)) {
            PdfWriter writer = new PdfWriter(fos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);
            
            // Add fonts
            PdfFont titleFont = PdfFontFactory.createFont();
            PdfFont regularFont = PdfFontFactory.createFont();
            
            // Title
            Paragraph title = new Paragraph("WealthE - Tax Form Report")
                    .setFont(titleFont)
                    .setFontSize(20)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(title);
            
            // Generation timestamp
            Paragraph generatedOn = new Paragraph("Generated on: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss")))
                    .setFont(regularFont)
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setMarginBottom(20);
            document.add(generatedOn);
            
            // Personal Info Section
            addPersonalInfoSection(document, taxFormData, titleFont, regularFont);
            
            // Income Section
            addIncomeSection(document, taxFormData, titleFont, regularFont);
            
            // Tax Computation Section
            addTaxComputationSection(document, taxFormData, titleFont, regularFont);
            
            // Expense Section
            addExpenseSection(document, taxFormData, titleFont, regularFont);
            
            // Investment Section
            addInvestmentSection(document, taxFormData, titleFont, regularFont);
            
            // Asset & Liability Section
            addAssetLiabilitySection(document, taxFormData, titleFont, regularFont);
            
            // Footer
            Paragraph footer = new Paragraph("This document was generated automatically by WealthE system.")
                    .setFont(regularFont)
                    .setFontSize(8)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(30)
                    .setFontColor(ColorConstants.GRAY);
            document.add(footer);
            
            document.close();
            
            logger.info("Tax Form PDF generated successfully: {}", filePath);
            return filePath;
            
        } catch (IOException e) {
            logger.error("Error generating PDF: {}", e.getMessage());
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }
    
    public String generateTaxFormPdfForSubmission(int submissionId) throws Exception {
        // Create directory if it doesn't exist
        File directory = new File(PDF_DIRECTORY);
        if (!directory.exists()) {
            directory.mkdirs();
        }
        
        // Get authenticated user ID
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        int userId = Integer.parseInt(auth.getName());
        
        if (userId == 0) {
            throw new RuntimeException("User not authenticated");
        }
        
        // Fetch tax form data for specific submission
        TaxFormData taxFormData = fetchPdfDataService.fetchTaxFormDataForSubmission(submissionId, userId);
        
        if (taxFormData == null) {
            throw new RuntimeException("Tax form data not found for submission ID: " + submissionId);
        }
        
        // Generate filename: user_id + submission_id + return.pdf
        String filename = userId + "_" + submissionId + "_return.pdf";
        String filePath = PDF_DIRECTORY + File.separator + filename;
        
        // Create PDF
        try (FileOutputStream fos = new FileOutputStream(filePath)) {
            PdfWriter writer = new PdfWriter(fos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);
            
            // Add fonts
            PdfFont titleFont = PdfFontFactory.createFont();
            PdfFont regularFont = PdfFontFactory.createFont();
            
            // Title
            Paragraph title = new Paragraph("WealthE - Tax Form Report")
                    .setFont(titleFont)
                    .setFontSize(20)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(title);
            
            // Generation timestamp
            Paragraph generatedOn = new Paragraph("Generated on: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss")))
                    .setFont(regularFont)
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setMarginBottom(20);
            document.add(generatedOn);
            
            // Personal Info Section
            addPersonalInfoSection(document, taxFormData, titleFont, regularFont);
            
            // Income Section
            addIncomeSection(document, taxFormData, titleFont, regularFont);
            
            // Tax Computation Section
            addTaxComputationSection(document, taxFormData, titleFont, regularFont);
            
            // Expense Section
            addExpenseSection(document, taxFormData, titleFont, regularFont);
            
            // Investment Section
            addInvestmentSection(document, taxFormData, titleFont, regularFont);
            
            // Asset & Liability Section
            addAssetLiabilitySection(document, taxFormData, titleFont, regularFont);
            
            // Footer
            Paragraph footer = new Paragraph("This document was generated automatically by WealthE system.")
                    .setFont(regularFont)
                    .setFontSize(8)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(30)
                    .setFontColor(ColorConstants.GRAY);
            document.add(footer);
            
            document.close();
            
            logger.info("Tax Form PDF generated successfully for submission {}: {}", submissionId, filePath);
            return filePath;
            
        } catch (IOException e) {
            logger.error("Error generating PDF: {}", e.getMessage());
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }
    

    
    private void addPersonalInfoSection(Document document, TaxFormData taxFormData, PdfFont titleFont, PdfFont regularFont) throws IOException {
        // Section title
        Paragraph sectionTitle = new Paragraph("Personal Information")
                .setFont(titleFont)
                .setFontSize(16)
                .setBold()
                .setMarginTop(20)
                .setMarginBottom(10);
        document.add(sectionTitle);
        
        // Create table for personal info
        Table table = new Table(UnitValue.createPercentArray(new float[]{40, 60}))
                .setWidth(UnitValue.createPercentValue(100));
        
        // Add table headers
        table.addCell(new Cell().add(new Paragraph("Field").setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        table.addCell(new Cell().add(new Paragraph("Value").setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        
        // Add personal information rows
        addTableRow(table, "Name of the Taxpayer", getString(taxFormData.getUserName()), regularFont);
        addTableRow(table, "National ID / Passport No.", getString(taxFormData.getUserNid()), regularFont);
        addTableRow(table, "TIN", getString(taxFormData.getTaxTin()), regularFont);
        addTableRow(table, "Circle", getString(taxFormData.getTaxCircle()), regularFont);
        addTableRow(table, "Tax Zone", getString(taxFormData.getTaxZone()), regularFont);
        addTableRow(table, "Assessment Year", "2023-2024", regularFont);
        addTableRow(table, "Residential Status", getBooleanString(taxFormData.getTaxIsResident()) + " (Resident/Non-resident)", regularFont);
        addTableRow(table, "Date of Birth", getString(taxFormData.getUserDob()), regularFont);
        addTableRow(table, "Spouse Name", getString(taxFormData.getUserSpouseName()), regularFont);
        addTableRow(table, "Spouse TIN", getString(taxFormData.getUserSpouseTin()), regularFont);
        addTableRow(table, "Address", getString(taxFormData.getTaxAreaName()), regularFont);
        addTableRow(table, "Mobile", getString(taxFormData.getUserPhone()), regularFont);
        addTableRow(table, "Email", getString(taxFormData.getTaxEmail()), regularFont);
        addTableRow(table, "Is Freedom Fighter", getBooleanString(taxFormData.getTaxIsFf()), regularFont);
        addTableRow(table, "Is Female", getBooleanString(taxFormData.getTaxIsFemale()), regularFont);
        addTableRow(table, "Is Disabled", getBooleanString(taxFormData.getTaxIsDisabled()), regularFont);
        
        document.add(table);
    }
    
    private void addIncomeSection(Document document, TaxFormData taxFormData, PdfFont titleFont, PdfFont regularFont) throws IOException {
        // Section title
        Paragraph sectionTitle = new Paragraph("Income Information")
                .setFont(titleFont)
                .setFontSize(16)
                .setBold()
                .setMarginTop(20)
                .setMarginBottom(10);
        document.add(sectionTitle);
        
        // Create table for income info
        Table table = new Table(UnitValue.createPercentArray(new float[]{40, 60}))
                .setWidth(UnitValue.createPercentValue(100));
        
        // Add table headers
        table.addCell(new Cell().add(new Paragraph("Income Type").setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        table.addCell(new Cell().add(new Paragraph("Amount (BDT)").setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        
        // Add income rows
        addTableRow(table, "Salary", formatCurrency(taxFormData.getIncomeSalary()), regularFont);
        addTableRow(table, "Agriculture", formatCurrency(taxFormData.getIncomeAgriculture()), regularFont);
        addTableRow(table, "Rent", formatCurrency(taxFormData.getIncomeRent()), regularFont);
        addTableRow(table, "Interest", formatCurrency(taxFormData.getIncomeInterest()), regularFont);
        addTableRow(table, "Others", formatCurrency(taxFormData.getIncomeOthers()), regularFont);
        
        // Total income row
        double totalIncome = (taxFormData.getIncomeSalary() != null ? taxFormData.getIncomeSalary() : 0) +
                           (taxFormData.getIncomeAgriculture() != null ? taxFormData.getIncomeAgriculture() : 0) +
                           (taxFormData.getIncomeRent() != null ? taxFormData.getIncomeRent() : 0) +
                           (taxFormData.getIncomeInterest() != null ? taxFormData.getIncomeInterest() : 0) +
                           (taxFormData.getIncomeOthers() != null ? taxFormData.getIncomeOthers() : 0);
        
        table.addCell(new Cell().add(new Paragraph("Total Income").setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        table.addCell(new Cell().add(new Paragraph(formatCurrency(totalIncome)).setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        
        document.add(table);
    }
    
    private void addTaxComputationSection(Document document, TaxFormData taxFormData, PdfFont titleFont, PdfFont regularFont) throws IOException {
        // Section title
        Paragraph sectionTitle = new Paragraph("Tax Computation")
                .setFont(titleFont)
                .setFontSize(16)
                .setBold()
                .setMarginTop(20)
                .setMarginBottom(10);
        document.add(sectionTitle);
        
        // Create table for tax computation
        Table table = new Table(UnitValue.createPercentArray(new float[]{40, 60}))
                .setWidth(UnitValue.createPercentValue(100));
        
        // Add table headers
        table.addCell(new Cell().add(new Paragraph("Tax Component").setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        table.addCell(new Cell().add(new Paragraph("Amount (BDT)").setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        
        // Add tax computation rows
        addTableRow(table, "Gross Tax", formatCurrency(taxFormData.getTaxCompGrossTax()), regularFont);
        addTableRow(table, "Rebate Amount", formatCurrency(taxFormData.getTaxCompRebate()), regularFont);
        addTableRow(table, "Net Tax", formatCurrency(taxFormData.getTaxCompNetTax()), regularFont);
        addTableRow(table, "Minimum Tax", formatCurrency(taxFormData.getTaxCompMinTax()), regularFont);
        
        // Payable Tax (highlighted)
        table.addCell(new Cell().add(new Paragraph("Payable Tax").setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.YELLOW)
                .setBorder(Border.NO_BORDER));
        table.addCell(new Cell().add(new Paragraph(formatCurrency(taxFormData.getTaxCompPayable())).setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.YELLOW)
                .setBorder(Border.NO_BORDER));
        
        document.add(table);
    }
    
    private void addExpenseSection(Document document, TaxFormData taxFormData, PdfFont titleFont, PdfFont regularFont) throws IOException {
        // Section title
        Paragraph sectionTitle = new Paragraph("Expense Information")
                .setFont(titleFont)
                .setFontSize(16)
                .setBold()
                .setMarginTop(20)
                .setMarginBottom(10);
        document.add(sectionTitle);
        
        // Create table for expense info
        Table table = new Table(UnitValue.createPercentArray(new float[]{40, 60}))
                .setWidth(UnitValue.createPercentValue(100));
        
        // Add table headers
        table.addCell(new Cell().add(new Paragraph("Expense Type").setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        table.addCell(new Cell().add(new Paragraph("Amount (BDT)").setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        
        // Add expense rows
        addTableRow(table, "Personal", formatCurrency(taxFormData.getExpensePersonal()), regularFont);
        addTableRow(table, "Housing", formatCurrency(taxFormData.getExpenseHousing()), regularFont);
        addTableRow(table, "Utility", formatCurrency(taxFormData.getExpenseUtility()), regularFont);
        addTableRow(table, "Education", formatCurrency(taxFormData.getExpenseEducation()), regularFont);
        addTableRow(table, "Transport", formatCurrency(taxFormData.getExpenseTransport()), regularFont);
        addTableRow(table, "Others", formatCurrency(taxFormData.getExpenseOthers()), regularFont);
        
        // Total expense row
        double totalExpense = (taxFormData.getExpensePersonal() != null ? taxFormData.getExpensePersonal() : 0) +
                            (taxFormData.getExpenseHousing() != null ? taxFormData.getExpenseHousing() : 0) +
                            (taxFormData.getExpenseUtility() != null ? taxFormData.getExpenseUtility() : 0) +
                            (taxFormData.getExpenseEducation() != null ? taxFormData.getExpenseEducation() : 0) +
                            (taxFormData.getExpenseTransport() != null ? taxFormData.getExpenseTransport() : 0) +
                            (taxFormData.getExpenseOthers() != null ? taxFormData.getExpenseOthers() : 0);
        
        table.addCell(new Cell().add(new Paragraph("Total Expense").setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        table.addCell(new Cell().add(new Paragraph(formatCurrency(totalExpense)).setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        
        document.add(table);
    }
    
    private void addInvestmentSection(Document document, TaxFormData taxFormData, PdfFont titleFont, PdfFont regularFont) throws IOException {
        // Section title
        Paragraph sectionTitle = new Paragraph("Investment Information")
                .setFont(titleFont)
                .setFontSize(16)
                .setBold()
                .setMarginTop(20)
                .setMarginBottom(10);
        document.add(sectionTitle);
        
        // Create table for investment info
        Table table = new Table(UnitValue.createPercentArray(new float[]{40, 60}))
                .setWidth(UnitValue.createPercentValue(100));
        
        // Add table headers
        table.addCell(new Cell().add(new Paragraph("Investment Type").setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        table.addCell(new Cell().add(new Paragraph("Amount (BDT)").setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        
        // Add investment rows
        addTableRow(table, "3 Month Sanchaypatra", formatCurrency(taxFormData.getInvestment3MonthShanchaypatra()), regularFont);
        addTableRow(table, "5 Years Sanchaypatra", formatCurrency(taxFormData.getInvestment5YearsShanchaypatra()), regularFont);
        addTableRow(table, "Zakat", formatCurrency(taxFormData.getInvestmentZakat()), regularFont);
        addTableRow(table, "FDR", formatCurrency(taxFormData.getInvestmentFdr()), regularFont);
        addTableRow(table, "Family Sanchaypatra", formatCurrency(taxFormData.getInvestmentFamilyShanchaypatra()), regularFont);
        
        // Total investment row
        double totalInvestment = (taxFormData.getInvestment3MonthShanchaypatra() != null ? taxFormData.getInvestment3MonthShanchaypatra() : 0) +
                               (taxFormData.getInvestment5YearsShanchaypatra() != null ? taxFormData.getInvestment5YearsShanchaypatra() : 0) +
                               (taxFormData.getInvestmentZakat() != null ? taxFormData.getInvestmentZakat() : 0) +
                               (taxFormData.getInvestmentFdr() != null ? taxFormData.getInvestmentFdr() : 0) +
                               (taxFormData.getInvestmentFamilyShanchaypatra() != null ? taxFormData.getInvestmentFamilyShanchaypatra() : 0);
        
        table.addCell(new Cell().add(new Paragraph("Total Investment").setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        table.addCell(new Cell().add(new Paragraph(formatCurrency(totalInvestment)).setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        
        document.add(table);
    }
    
    private void addAssetLiabilitySection(Document document, TaxFormData taxFormData, PdfFont titleFont, PdfFont regularFont) throws IOException {
        // Section title
        Paragraph sectionTitle = new Paragraph("Asset & Liability Information")
                .setFont(titleFont)
                .setFontSize(16)
                .setBold()
                .setMarginTop(20)
                .setMarginBottom(10);
        document.add(sectionTitle);
        
        // Assets subsection
        Paragraph assetsSubtitle = new Paragraph("Assets")
                .setFont(titleFont)
                .setFontSize(14)
                .setBold()
                .setMarginTop(15)
                .setMarginBottom(8);
        document.add(assetsSubtitle);
        
        // Create table for assets
        Table assetsTable = new Table(UnitValue.createPercentArray(new float[]{40, 60}))
                .setWidth(UnitValue.createPercentValue(100));
        
        // Add table headers
        assetsTable.addCell(new Cell().add(new Paragraph("Asset Type").setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        assetsTable.addCell(new Cell().add(new Paragraph("Value (BDT)").setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        
        // Add asset rows
        addTableRow(assetsTable, "Bank Account Total", formatCurrency(taxFormData.getAssetBankAccount()), regularFont);
        addTableRow(assetsTable, "Car Total", formatCurrency(taxFormData.getAssetCar()), regularFont);
        addTableRow(assetsTable, "Flat Total", formatCurrency(taxFormData.getAssetFlat()), regularFont);
        addTableRow(assetsTable, "Jewelry Total", formatCurrency(taxFormData.getAssetJewelery()), regularFont);
        addTableRow(assetsTable, "Plot Total", formatCurrency(taxFormData.getAssetPlot()), regularFont);
        
        // Total assets row
        double totalAssets = (taxFormData.getAssetBankAccount() != null ? taxFormData.getAssetBankAccount() : 0) +
                           (taxFormData.getAssetCar() != null ? taxFormData.getAssetCar() : 0) +
                           (taxFormData.getAssetFlat() != null ? taxFormData.getAssetFlat() : 0) +
                           (taxFormData.getAssetJewelery() != null ? taxFormData.getAssetJewelery() : 0) +
                           (taxFormData.getAssetPlot() != null ? taxFormData.getAssetPlot() : 0);
        
        assetsTable.addCell(new Cell().add(new Paragraph("Total Assets").setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        assetsTable.addCell(new Cell().add(new Paragraph(formatCurrency(totalAssets)).setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        
        document.add(assetsTable);
        
        // Liabilities subsection
        Paragraph liabilitiesSubtitle = new Paragraph("Liabilities")
                .setFont(titleFont)
                .setFontSize(14)
                .setBold()
                .setMarginTop(15)
                .setMarginBottom(8);
        document.add(liabilitiesSubtitle);
        
        // Create table for liabilities
        Table liabilitiesTable = new Table(UnitValue.createPercentArray(new float[]{40, 60}))
                .setWidth(UnitValue.createPercentValue(100));
        
        // Add table headers
        liabilitiesTable.addCell(new Cell().add(new Paragraph("Liability Type").setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        liabilitiesTable.addCell(new Cell().add(new Paragraph("Amount (BDT)").setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        
        // Add liability rows
        addTableRow(liabilitiesTable, "Bank Loan", formatCurrency(taxFormData.getLiabilityBankLoan()), regularFont);
        addTableRow(liabilitiesTable, "Person Loan", formatCurrency(taxFormData.getLiabilityPersonLoan()), regularFont);
        
        // Total liabilities row
        double totalLiabilities = (taxFormData.getLiabilityBankLoan() != null ? taxFormData.getLiabilityBankLoan() : 0) +
                                (taxFormData.getLiabilityPersonLoan() != null ? taxFormData.getLiabilityPersonLoan() : 0);
        
        liabilitiesTable.addCell(new Cell().add(new Paragraph("Total Liabilities").setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        liabilitiesTable.addCell(new Cell().add(new Paragraph(formatCurrency(totalLiabilities)).setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        
        document.add(liabilitiesTable);
    }
    
    private void addTableRow(Table table, String field, String value, PdfFont font) {
        table.addCell(new Cell().add(new Paragraph(field).setFont(font)).setBorder(Border.NO_BORDER));
        table.addCell(new Cell().add(new Paragraph(value).setFont(font)).setBorder(Border.NO_BORDER));
    }
    
    private String getString(Object value) {
        return value != null ? value.toString() : "N/A";
    }
    
    private String getBooleanString(Object value) {
        if (value instanceof Boolean) {
            return ((Boolean) value) ? "Yes" : "No";
        }
        return value != null ? value.toString() : "N/A";
    }
    
    private String formatCurrency(Double value) {
        if (value == null) return "0.00";
        return String.format("%,.2f", value);
    }
}
