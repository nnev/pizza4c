package de.noname.pizza4c.pdf;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Jpeg;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import de.noname.pizza4c.datamodel.lieferando2025.Variation;
import de.noname.pizza4c.datamodel.pizza4c.AllCartService;
import de.noname.pizza4c.datamodel.pizza4c.Cart;
import de.noname.pizza4c.datamodel.pizza4c.CartEntry;
import de.noname.pizza4c.webpage.ApiController;
import de.noname.pizza4c.webpage.RestaurantService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class PdfGenerator {
    private static final Logger LOG = LoggerFactory.getLogger(ApiController.class);

    private static final DateTimeFormatter GERMAN_DATE_TIME_MINUTES = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");

    private static final int LOGO_TARGET_HEIGHT = 70;
    private static final int LOGO_TARGET_WIDTH = 220;

    // Our QR Codes are designed to fit in 29 modules
    // Together with the required quiet zone of 8 modules (4 on each side), this comes out to 29 + 8 = 37 modules
    // Thus our 150px image size we have ~118px of data and ~32px (16 each side) quiet zone
    // Both neighboring qr codes have quiet zones baked into their images.
    // If we naively position the images besides each other, the whitespace looks unnatural.
    // Therefore, we need to overlap the images just enough that the pixel data does not touch each other
    private static final int QR_PADDING_CUTOUT = 20;
    private static final int QR_SIZE = 150; // 150px representing a 29 module +8 (4 on each side) module

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private AllCartService allCartService;

    @Value("${pizza4c.pdf.showLogo:true}")
    private boolean showLogo;

    @Value("${pizza4c.pdf.logoName:noname.jpeg}")
    private String logoName;

    @Value("${pizza4c.pdf.companyName:NoName e.V.}")
    private String companyName;

    @Value("${pizza4c.pdf.recipient:Fridolin Nord}")
    private String recipient;

    @Value("${pizza4c.pdf.addressLine1:Im Neuenheimer Feld 205}")
    private String addressLine1;

    @Value("${pizza4c.pdf.addressLine2:69120 Heidelberg}")
    private String addressLine2;

    @Value("${pizza4c.pdf.addressLine3:}")
    private String addressLine3;

    @Value("${pizza4c.pdf.phone:0157 9230 7561}")
    private String phone;

    @Value("${pizza4c.pdf.email:pizza@noname-ev.de}")
    private String email;

    @Value("${pizza4c.pdf.lat:49.417433}")
    private String lat;

    @Value("${pizza4c.pdf.lng:8.675255}")
    private String lng;

    public void generate(OutputStream outputStream) {
        LocalDateTime now = LocalDateTime.now();

        // step 1: creation of a document-object
        Document document = new Document(PageSize.A4, 30, 30, 30, 30);
        try {
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12, Font.NORMAL, BaseColor.BLACK);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA, 12, Font.BOLD, BaseColor.BLACK);
            Font bigFont = FontFactory.getFont(FontFactory.HELVETICA, 18, Font.BOLD, BaseColor.BLACK);

            var writer = PdfWriter.getInstance(document, outputStream);
            HeaderFooterPageEvent event = new HeaderFooterPageEvent();
            writer.setPageEvent(event);

            // step 2: we open the document
            document.open();

            // As the logo is a floating image element we need to maintain a count of "added whitespace" such that we
            // do not overlap with the following other elements on the first page:
            // - the qr code offsets,
            // - the order table
            int offsetY = 0;

            // If we show our logo on the right, we need to load it and scale it appropriately
            // As this is a floating element we need to adjust offsetY manually such that out
            if (showLogo) {
                var logo = new Jpeg(ApiController.class.getResource("/pdf/" + logoName));
                float scale = Math.min(
                        LOGO_TARGET_HEIGHT * 100f / logo.getPlainHeight(),
                        LOGO_TARGET_WIDTH * 100f / logo.getPlainWidth()
                );
                logo.scalePercent(scale);
                logo.setWidthPercentage(scale);
                logo.setAlignment(Element.ALIGN_RIGHT | Element.ALIGN_TOP);
                logo.setAbsolutePosition(document.getPageSize().getWidth() - logo.getScaledWidth() - 30,
                        document.getPageSize().getHeight() - logo.getScaledHeight() - 30);
                document.add(logo);

                offsetY += LOGO_TARGET_HEIGHT + 30;
            }

            // Trim lat/lng such that the resulting string fits in the 77 bytes a 29 module qr code with low ECC offers.
            // If we need any more bytes the resulting qr code will contain more modules which in turn will result in
            // less than 4 dots/module on an 80 dpi printer. As such we would see an increase in scanning errors.
            String _lat = trimGeoCoordinate(lat);
            String _lng = trimGeoCoordinate(lng);

            var osmCode = new QrCode(
                    document.getPageSize().getWidth() - (2 * QR_SIZE - QR_PADDING_CUTOUT),
                    document.getPageSize().getHeight() - (9 + offsetY),
                    QR_SIZE,
                    "http://www.osm.org/?mlat=" + _lat + "&mlon=" + _lng + "#map=17/" + _lat + "/" + _lng,
                    "Open Street Map",
                    normalFont
            );
            osmCode.render(writer.getDirectContent());

            var gmapsCode = new QrCode(
                    document.getPageSize().getWidth() - QR_SIZE,
                    document.getPageSize().getHeight() - (9 + offsetY),
                    QR_SIZE,
                    "https://maps.google.de/maps?q=" + _lat + "," + _lng + "&num=1&t=m&z=18",
                    "Google Maps",
                    normalFont
            );
            gmapsCode.render(writer.getDirectContent());

            var anschrift = new PdfPTable(new float[]{0.3f, 0.8f});
            anschrift.setHorizontalAlignment(Element.ALIGN_LEFT);
            anschrift.setWidthPercentage(55);
            anschrift.setTotalWidth(0.55f);
            anschrift.getDefaultCell().setBorder(Rectangle.NO_BORDER);
            anschrift.addCell(new Phrase(new Chunk("Firma", boldFont)));
            anschrift.addCell(new Phrase(new Chunk(companyName, normalFont)));
            anschrift.addCell(new Phrase(new Chunk("Empfänger", boldFont)));
            anschrift.addCell(new Phrase(new Chunk(recipient, normalFont)));
            anschrift.addCell(new Phrase(new Chunk("", boldFont)));
            anschrift.addCell(new Phrase(new Chunk(addressLine1, normalFont)));
            anschrift.addCell(new Phrase(new Chunk("", boldFont)));
            anschrift.addCell(new Phrase(new Chunk(addressLine2, normalFont)));
            if (addressLine3 != null && !addressLine3.isBlank()) {
                anschrift.addCell(new Phrase(new Chunk("", boldFont)));
                anschrift.addCell(new Phrase(new Chunk(addressLine3, normalFont)));
            }
            anschrift.addCell(new Phrase(new Chunk("Telefon", boldFont)));
            anschrift.addCell(new Phrase(new Chunk(phone, normalFont)));
            anschrift.addCell(new Phrase(new Chunk("E-Mail", boldFont)));
            anschrift.addCell(new Phrase(new Chunk(email, normalFont)));
            anschrift.addCell(new Phrase(new Chunk("Erstellt", boldFont)));
            anschrift.addCell(new Phrase(new Chunk(now.format(GERMAN_DATE_TIME_MINUTES), normalFont)));
            anschrift.addCell(new Phrase(new Chunk("Bemerkung", boldFont)));
            anschrift.addCell(new Phrase(new Chunk("Kartons bitte beschriften", normalFont)));

            document.add(anschrift);

            if (addressLine3 == null || addressLine3.isBlank()) {
                document.add(new Paragraph(new Phrase(" "))); // spacer
            }

            var allCarts = allCartService.getCurrentAllCarts();
            var menu = restaurantService.getSelectedRestaurant().getMenu();

            if (showLogo) {
                document.add(new Paragraph(new Phrase(" "))); // spacer
                document.add(new Paragraph(new Phrase(" "))); // spacer
                document.add(new Paragraph(new Phrase(" "))); // spacer
                document.add(new Paragraph(new Phrase(" "))); // spacer
            }

            var orderData = new PdfPTable(new float[]{0.4f, 0.3f, 0.1f, 0.2f});
            orderData.getDefaultCell().setBorder(Rectangle.NO_BORDER);
            orderData.setHorizontalAlignment(Element.ALIGN_LEFT);
            orderData.setWidthPercentage(100);
            orderData.setTotalWidth(1f);

            orderData.addCell(new AlignedCell("Summe: " + allCarts.getPriceEuro(menu) + " €", bigFont).setBorderBottom(3)
                    .setVerticalPadding(3));
            // iText rowspan does not work with custom cells, so we need to pad them ourselves
            orderData.addCell(new AlignedCell(
                    "#Produkte: " + allCarts.getCarts().stream().mapToInt(value -> value.getEntries().size()).sum(),
                    bigFont).setBorderBottom(3).setVerticalPadding(3));
            orderData.addCell(new AlignedCell("", boldFont).setBorderBottom(3).setVerticalPadding(3));
            orderData.addCell(new AlignedCell("", boldFont).setBorderBottom(3).setVerticalPadding(3));

            orderData.addCell(new AlignedCell("Produkt", boldFont).setVerticalPadding(2));
            orderData.addCell(new AlignedCell("Größe", boldFont).setVerticalPadding(2));
            orderData.addCell(new AlignedCell("Preis (€)", boldFont, Element.ALIGN_RIGHT).setVerticalPadding(2));
            orderData.addCell(new AlignedCell("Beschriftung", boldFont, Element.ALIGN_RIGHT).setVerticalPadding(2));


            List<Cart> carts = allCarts.getCarts();
            for (int i = 0; i < carts.size(); i++) {
                Cart cart = carts.get(i);
                List<CartEntry> entries = cart.getEntries();
                for (int j = 0; j < entries.size(); j++) {

                    boolean isLast = (i == carts.size() - 1) && (j == entries.size() - 1);

                    CartEntry entry = entries.get(j);
                    List<String> optionList = entry.getOptionList(menu);
                    orderData.addCell(
                            new AlignedCell(
                                    optionList,
                                    normalFont
                            )
                                    .setBorderBottom(isLast ? 3 : 1)
                                    .setVerticalPadding(3)
                    );
                    Variation variant = menu.getMenuItems().get(entry.getMenuItem()).getVariations().get(entry.getVariation());
                    orderData.addCell(
                            new AlignedCell(
                                    variant.getName(),
                                    normalFont
                            )
                                    .setBorderBottom(isLast ? 3 : 1)
                                    .setVerticalPadding(3)
                    );
                    orderData.addCell(
                            new AlignedCell(
                                    entry.getPriceEuro(menu) + " €",
                                    normalFont,
                                    Element.ALIGN_RIGHT
                            )
                                    .setBorderBottom(isLast ? 3 : 1)
                                    .setVerticalPadding(3)
                    );
                    orderData.addCell(
                            new AlignedCell(
                                    cart.getShortName(),
                                    normalFont,
                                    Element.ALIGN_RIGHT
                            )
                                    .setBorderBottom(isLast ? 3 : 1)
                                    .setVerticalPadding(3)
                    );
                }
            }

            document.add(orderData);
        } catch (DocumentException | IOException de) {
            LOG.error(de.getMessage(), de);
        }
        document.close();
    }

    private String trimGeoCoordinate(String coord) {
        String[] splitted = coord.split("\\.");
        return splitted[0] + "." + splitted[1].substring(0, Math.max(6, splitted[1].length()));
    }

}
