async function generateEstimatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const custPhone = document.getElementById('custPhone')?.value || "N/A";
  const custName = document.getElementById('custName')?.value || "Customer";
  const vehName = document.getElementById('vehName')?.value || "N/A";
  const vehReg = (document.getElementById('vehReg')?.value || "N/A").toUpperCase();
  const vehKm = document.getElementById('vehKm')?.value || "N/A";
  const remarks = document.getElementById('remarks')?.value || "Happy Journey! Drive Safe, Stay Safe. Thank You!";
  
  const estNo = 'EST-' + new Date().toISOString().slice(2,10).replace(/-/g,'') + '-' + Math.floor(1000 + Math.random() * 9000);
  const estDate = new Date().toISOString().split('T')[0];

  // Directly capture logo from webpage header to prevent missing logo
  const logoImg = document.querySelector('header img') || document.querySelector('img[src*="logo"]');
  if (logoImg && logoImg.complete && logoImg.naturalWidth !== 0) {
    try {
      doc.addImage(logoImg, 'PNG', 14, 12, 38, 22);
    } catch(e) {
      console.log("Logo load error", e);
    }
  }

  // Header Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text("INTECH MOTORS", 56, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(90);
  doc.text("Multi Brand Car Service", 56, 23);
  doc.text("16/2 West Chitrakulam, Mylapore, Chennai - 600004", 56, 28);
  doc.text("Phone: 9500165968", 56, 33);

  // Right Side Header (Estimate)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(23, 37, 84);
  doc.text("ESTIMATE", 196, 18, { align: 'right' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80);
  doc.text(`Estimate No: ${estNo}`, 196, 24, { align: 'right' });
  doc.text(`Date: ${estDate}`, 196, 29, { align: 'right' });
  doc.text(`Customer No: ${custPhone}`, 196, 34, { align: 'right' });
  doc.text(`Customer Name: ${custName}`, 196, 39, { align: 'right' });

  doc.setDrawColor(210, 180, 140);
  doc.setLineWidth(0.6);
  doc.line(14, 43, 196, 43);

  // Vehicle Details Box (Car Type completely removed)
  doc.autoTable({
    startY: 46,
    theme: 'plain',
    styles: { fontSize: 8.5, cellPadding: 2.5 },
    body: [
      [
        { content: `VEHICLE NAME\n${vehName}`, styles: { fontStyle: 'bold' } },
        { content: `VEHICLE NUMBER\n${vehReg}`, styles: { fontStyle: 'bold' } },
        { content: `KMS DRIVEN\n${vehKm}`, styles: { fontStyle: 'bold' } }
      ]
    ]
  });

  // Items / Services Table
  const tableData = [];
  let sNo = 1;
  document.querySelectorAll('#itemsBody tr').forEach(row => {
    const name = row.querySelector('.item-name')?.value || row.cells[0]?.innerText;
    const qty = row.querySelector('.item-qty')?.value || row.cells[1]?.innerText || "1";
    const rate = row.querySelector('.item-rate')?.value || row.cells[2]?.innerText || "0";
    const amt = parseFloat(qty) * parseFloat(rate);
    if (name) {
      tableData.push([sNo++, name, qty, parseFloat(rate).toLocaleString('en-IN'), amt.toLocaleString('en-IN')]);
    }
  });

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 3,
    head: [['S.NO', 'DESCRIPTION OF SERVICE / PART', 'QTY', 'RATE (Rs.)', 'AMOUNT (Rs.)']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [248, 245, 235], textColor: [120, 80, 20], fontStyle: 'bold' },
    styles: { fontSize: 8.5, cellPadding: 2.5 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 15 },
      2: { halign: 'center', cellWidth: 18 },
      3: { halign: 'right', cellWidth: 30 },
      4: { halign: 'right', cellWidth: 35 }
    }
  });

  // Remarks Box
  const finalY = doc.lastAutoTable.finalY + 6;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text("REMARKS / WORKS:", 14, finalY);
  doc.setFont('helvetica', 'normal');
  doc.text(remarks, 14, finalY + 5, { maxWidth: 180 });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text("WE CARE FOR YOUR CAR, SO YOU CAN ENJOY THE JOURNEY", 105, finalY + 25, { align: 'center' });

  doc.save(`Intech_Motors_Estimate_${vehReg}.pdf`);
}
