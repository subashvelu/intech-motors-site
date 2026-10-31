/* Invoice PDF (A4) in the Intech Motors bill style. Browser + Node. */
(function (root) {
  function f2(n) { return "Rs. " + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function build(jsPDF, d, logo) {
    var doc = new jsPDF({ unit: "mm", format: "a4" });
    var W = 210, M = 12, gold = [176, 133, 24], navy = [22, 32, 52];
    function frame() { doc.setDrawColor(gold[0], gold[1], gold[2]); doc.setLineWidth(0.5); doc.rect(6, 6, W - 12, 285); }
    function txt(c) { doc.setTextColor(c[0], c[1], c[2]); }
    frame();
    if (logo) { try { doc.addImage(logo, "JPEG", M, 10, 52, 28.4); } catch (e) {} }
    doc.setFont("helvetica", "bold"); doc.setFontSize(17); txt(navy); doc.text("INTECH", 68, 18);
    var iw = doc.getTextWidth("INTECH "); txt(gold); doc.text("MOTORS", 68 + iw, 18);
    doc.setFontSize(9); txt(navy); doc.text("Multi Brand Car Service", 68, 24);
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(70);
    doc.text(["16/2 West Chitrakulam", "Mylapore, Chennai - 600004", "Tamil Nadu", "Phone: 95001 65968"], 68, 29.5);
    doc.setFont("times", "bold"); doc.setFontSize(28); txt(navy); doc.text("INVOICE", W - M, 20, { align: "right" });
    function lab(t, x, y) { doc.setFont("helvetica", "bold"); doc.setFontSize(8); txt(gold); doc.text(t, x, y); }
    function val(t, x, y) { doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(30); doc.text(String(t || "-"), x, y); }
    lab("Invoice No.", 134, 28); lab("Invoice Date", 172, 28); val(d.no, 134, 33); val(d.date, 172, 33);
    lab("Customer No.", 134, 40); lab("Customer Name", 172, 40); val(d.phone, 134, 45); val(String(d.cust || "-").slice(0, 18), 172, 45);
    doc.setDrawColor(gold[0], gold[1], gold[2]); doc.setLineWidth(0.4); doc.line(6, 52, W - 6, 52);

    doc.roundedRect(M, 57, W - 2 * M, 15, 2, 2);
    [["Vehicle Name", d.veh], ["Vehicle Number", d.vno], ["KMs Driven", d.km]].forEach(function (c, i) {
      var x = M + 5 + i * 60;
      doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); txt(gold); doc.text(c[0].toUpperCase(), x, 63);
      doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(30); doc.text(String(c[1] || "-").slice(0, 26), x, 69);
    });

    var y = 80;
    function head(yy) {
      doc.setFillColor(253, 247, 230); doc.rect(M, yy, W - 2 * M, 8, "F");
      doc.setFont("helvetica", "bold"); doc.setFontSize(8); txt(gold);
      doc.text("S.NO", M + 3, yy + 5.4); doc.text("DESCRIPTION OF SERVICE / PART", M + 16, yy + 5.4);
      doc.text("QTY", 132, yy + 5.4, { align: "right" }); doc.text("RATE (Rs.)", 160, yy + 5.4, { align: "right" });
      doc.text("AMOUNT (Rs.)", W - M - 3, yy + 5.4, { align: "right" });
    }
    head(y); y += 8;
    d.items.forEach(function (it, i) {
      var lines = doc.splitTextToSize(String(it.d || "-"), 88), h = Math.max(8, lines.length * 4.6 + 3.4);
      if (y + h > 255) { doc.addPage(); frame(); y = 16; head(y); y += 8; }
      doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(30);
      doc.text(String(i + 1), M + 3, y + 5.4); doc.text(lines, M + 16, y + 5.4);
      doc.text(String(it.q), 132, y + 5.4, { align: "right" });
      doc.text(Number(it.r).toLocaleString("en-IN"), 160, y + 5.4, { align: "right" });
      doc.text((it.q * it.r).toLocaleString("en-IN"), W - M - 3, y + 5.4, { align: "right" });
      doc.setDrawColor(225, 225, 225); doc.setLineWidth(0.2); doc.line(M, y + h, W - M, y + h); y += h;
    });

    if (y > 215) { doc.addPage(); frame(); y = 16; }
    y += 6;
    doc.setDrawColor(navy[0], navy[1], navy[2]); doc.setLineWidth(0.5); doc.roundedRect(M, y, W - 2 * M, 36, 2, 2);
    var rows = [["SUB TOTAL", f2(d.sub)], ["GST" + (d.gst ? " (" + d.gst + "%)" : ""), f2(d.gstAmt)], ["DISCOUNT", f2(d.disc)]];
    rows.forEach(function (r, i) {
      doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(30);
      doc.text(r[0], M + 4, y + 7 + i * 7); doc.text(r[1], W - M - 4, y + 7 + i * 7, { align: "right" });
      doc.setDrawColor(225, 225, 225); doc.setLineWidth(0.2); doc.line(M + 1, y + 10 + i * 7, W - M - 1, y + 10 + i * 7);
    });
    doc.setFont("helvetica", "bold"); doc.setFontSize(11); txt(gold);
    doc.text("TOTAL AMOUNT (Rs.)", M + 4, y + 31); doc.text(f2(d.total), W - M - 4, y + 31, { align: "right" });
    y += 44;

    var rl = doc.splitTextToSize(String(d.rem || "").trim() || "-", W - 2 * M - 8), rh = Math.max(20, rl.length * 4.7 + 10);
    if (y + rh + 40 > 285) { doc.addPage(); frame(); y = 16; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(11); txt(navy); doc.text("REMARKS / WORKS", M, y + 3);
    doc.setDrawColor(gold[0], gold[1], gold[2]); doc.setLineWidth(0.3); doc.roundedRect(M, y + 6, W - 2 * M, rh, 2, 2);
    doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(40); doc.text(rl, M + 4, y + 13);
    y += rh + 16;
    doc.setDrawColor(gold[0], gold[1], gold[2]); doc.setLineWidth(0.4); doc.line(M, y - 4, W - M, y - 4);
    doc.setFont("times", "bolditalic"); doc.setFontSize(15); txt(navy); doc.text("Happy Journey!", W / 2, y + 4, { align: "center" });
    doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); txt(gold); doc.text("Drive Safe, Stay Safe.", W / 2, y + 10, { align: "center" });
    doc.setFont("times", "italic"); doc.setFontSize(12); txt(navy); doc.text("Thank You!", W / 2, y + 17, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); txt(gold); doc.text("WE CARE FOR YOUR CAR, SO YOU CAN ENJOY THE JOURNEY", W / 2, y + 23, { align: "center" });
    return doc;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = { build: build }; else root.buildInvoicePDF = build;
})(typeof window !== "undefined" ? window : this);
