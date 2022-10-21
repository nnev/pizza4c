package de.noname.pizza4c.pdf;

import com.itextpdf.text.Chunk;
import com.itextpdf.text.Font;
import com.itextpdf.text.ListItem;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfPCell;

import java.util.List;
import java.util.Objects;

public class AlignedCell extends PdfPCell {
    public AlignedCell(String content, Font font, int alignment) {
        super(new Phrase(new Chunk(content, font)));
        commonCellValue();
        super.setHorizontalAlignment(alignment);
    }

    public AlignedCell(String content, Font font) {
        super(new Phrase(new Chunk(Objects.requireNonNullElse(content, ""), font)));
        commonCellValue();
    }

    public AlignedCell(List<String> data, Font font) {
        super();
        commonCellValue();
        var listElement = new com.itextpdf.text.List();

        for (int i = 0; i < data.size(); i++) {
            var listItem = new ListItem();
            listItem.setListSymbol(new Chunk(i == 0 ? "" : "  + ", font));
            listItem.add(new Chunk(Objects.requireNonNullElse(data.get(i), ""), font));
            listElement.add(listItem);
        }
        addElement(listElement);
    }

    private void commonCellValue() {
        super.setHorizontalAlignment(ALIGN_LEFT);
        setBorderBottom(1);
        setVerticalPadding(1);
    }

    public AlignedCell setBorderBottom(float width) {
        super.border = Rectangle.BOTTOM;
        super.borderWidthBottom = width;
        super.borderWidth = width;
        setPaddingTop(2 * width);
        setPaddingBottom(5 * width);
        return this;
    }

    public AlignedCell setVerticalPadding(float width) {
        setPaddingTop(2 * width);
        setPaddingBottom(5 * width);
        return this;
    }
}
