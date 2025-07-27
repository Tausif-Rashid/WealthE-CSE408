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
    
    public String generateUserInfoPdf() throws Exception {
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
        
        // Fetch user info (same logic as ApiController)
        List<Map<String, Object>> userInfo = getUserInfo(userId);
        List<Map<String, Object>> userTaxInfo = getUserTaxInfo(userId);
        
        if (userInfo.isEmpty()) {
            throw new RuntimeException("User information not found");
        }
        
        // Generate filename with timestamp
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String filename = String.format("user_info_%d_%s.pdf", userId, timestamp);
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
            Paragraph title = new Paragraph("WealthE - User Information Report")
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
            
            // User Basic Information
            Map<String, Object> userBasicInfo = userInfo.get(0);
            addUserBasicInfoSection(document, userBasicInfo, titleFont, regularFont);
            
            // Tax Information (if available)
            if (!userTaxInfo.isEmpty()) {
                Map<String, Object> taxInfo = userTaxInfo.get(0);
                addUserTaxInfoSection(document, taxInfo, titleFont, regularFont);
            }
            
            // Footer
            Paragraph footer = new Paragraph("This document was generated automatically by WealthE system.")
                    .setFont(regularFont)
                    .setFontSize(8)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(30)
                    .setFontColor(ColorConstants.GRAY);
            document.add(footer);
            
            document.close();
            
            logger.info("PDF generated successfully: {}", filePath);
            return filePath;
            
        } catch (IOException e) {
            logger.error("Error generating PDF: {}", e.getMessage());
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }
    
    private List<Map<String, Object>> getUserInfo(int userId) {
        String sql = "SELECT * FROM user_info WHERE id = ?";
        return jdbcTemplate.queryForList(sql, userId);
    }
    
    private List<Map<String, Object>> getUserTaxInfo(int userId) {
        String sql = "SELECT user_tax_info.id, tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name, credentials.email " +
                     "FROM user_tax_info " +
                     "JOIN credentials ON user_tax_info.id = credentials.id WHERE user_tax_info.id = ?";
        return jdbcTemplate.queryForList(sql, userId);
    }
    
    private void addUserBasicInfoSection(Document document, Map<String, Object> userInfo, PdfFont titleFont, PdfFont regularFont) throws IOException {
        // Section title
        Paragraph sectionTitle = new Paragraph("Personal Information")
                .setFont(titleFont)
                .setFontSize(16)
                .setBold()
                .setMarginTop(20)
                .setMarginBottom(10);
        document.add(sectionTitle);
        
        // Create table for user info
        Table table = new Table(UnitValue.createPercentArray(new float[]{30, 70}))
                .setWidth(UnitValue.createPercentValue(100));
        
        // Add table headers
        table.addCell(new Cell().add(new Paragraph("Field").setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        table.addCell(new Cell().add(new Paragraph("Value").setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        
        // Add user information rows
        addTableRow(table, "ID", String.valueOf(userInfo.get("id")), regularFont);
        addTableRow(table, "Name", getString(userInfo.get("name")), regularFont);
        addTableRow(table, "Phone", getString(userInfo.get("phone")), regularFont);
        addTableRow(table, "NID", getString(userInfo.get("nid")), regularFont);
        addTableRow(table, "Date of Birth", getString(userInfo.get("dob")), regularFont);
        addTableRow(table, "Spouse Name", getString(userInfo.get("spouse_name")), regularFont);
        addTableRow(table, "Spouse TIN", getString(userInfo.get("spouse_tin")), regularFont);
        
        document.add(table);
    }
    
    private void addUserTaxInfoSection(Document document, Map<String, Object> taxInfo, PdfFont titleFont, PdfFont regularFont) throws IOException {
        // Section title
        Paragraph sectionTitle = new Paragraph("Tax Information")
                .setFont(titleFont)
                .setFontSize(16)
                .setBold()
                .setMarginTop(20)
                .setMarginBottom(10);
        document.add(sectionTitle);
        
        // Create table for tax info
        Table table = new Table(UnitValue.createPercentArray(new float[]{30, 70}))
                .setWidth(UnitValue.createPercentValue(100));
        
        // Add table headers
        table.addCell(new Cell().add(new Paragraph("Field").setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        table.addCell(new Cell().add(new Paragraph("Value").setBold().setFont(regularFont))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER));
        
        // Add tax information rows
        addTableRow(table, "Email", getString(taxInfo.get("email")), regularFont);
        addTableRow(table, "TIN", getString(taxInfo.get("tin")), regularFont);
        addTableRow(table, "Is Resident", getBooleanString(taxInfo.get("is_resident")), regularFont);
        addTableRow(table, "Is Freedom Fighter", getBooleanString(taxInfo.get("is_ff")), regularFont);
        addTableRow(table, "Is Female", getBooleanString(taxInfo.get("is_female")), regularFont);
        addTableRow(table, "Is Disabled", getBooleanString(taxInfo.get("is_disabled")), regularFont);
        addTableRow(table, "Tax Zone", getString(taxInfo.get("tax_zone")), regularFont);
        addTableRow(table, "Tax Circle", getString(taxInfo.get("tax_circle")), regularFont);
        addTableRow(table, "Area Name", getString(taxInfo.get("area_name")), regularFont);
        
        document.add(table);
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
}
