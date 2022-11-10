package de.noname.pizza4c.webpage;

import de.noname.pizza4c.pdf.PdfGenerator;
import org.springframework.web.servlet.view.AbstractView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.util.Map;

class PdfView extends AbstractView {

    private final PdfGenerator pdfGenerator;

    public PdfView(PdfGenerator pdfGenerator) {
        this.pdfGenerator = pdfGenerator;
    }

    @Override
    protected void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        setContentType("application/pdf");
        ByteArrayOutputStream baos = createTemporaryOutputStream();
        pdfGenerator.generate(baos);
        writeToResponse(response, baos);
    }
}
