package de.noname.pizza4c.pdf;

import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.BarcodeQRCode;
import com.itextpdf.text.pdf.ColumnText;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.qrcode.EncodeHintType;
import com.itextpdf.text.pdf.qrcode.ErrorCorrectionLevel;

import java.util.Map;

public class QrCode {
    private final String qrText;
    private final String description;
    private final Font font;
    private final float top;
    private final float left;
    private final float size;

    public QrCode(float left, float top, float size, String qrText, String description, Font font) {
        super();
        this.left = left;
        this.top = top;
        this.size = size;
        this.qrText = qrText;
        this.description = description;
        this.font = font;
    }

    public void render(PdfContentByte pdfContentByte) throws DocumentException {
        var qrCode = new BarcodeQRCode(qrText, (int) size, (int) size,
                Map.of(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L));
        var image = qrCode.getImage();
        image.scaleAbsolute(size, size);
        image.setAbsolutePosition(left, top - size);
        image.setAlt(qrText);

        pdfContentByte.addImage(image);
        ColumnText.showTextAligned(pdfContentByte, Element.ALIGN_CENTER, new Phrase(description, font),
                left + size / 2, top - size + font.getSize(), 0f);
    }
}