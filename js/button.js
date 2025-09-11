const exportarBtn = document.getElementById("exportar");
const tabelaContainer = document.getElementById("tabela-container");

exportarBtn.addEventListener("click", () => {
  if (!tabelaContainer.querySelector("table")) {
    alert("Primeiro gere o plano de estudos!");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  function hexToRgb(hex) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  }

  const corTitulo = hexToRgb("#bc3c89");      
  const corSubTitulo = hexToRgb("#bc3c89");   
  const corTexto = hexToRgb("#333333");       

  doc.setFontSize(18);
  doc.setTextColor(...corTitulo);
  doc.text("Meu Plano de Estudos Bíblicos", 14, 20);

  const rows = Array.from(tabelaContainer.querySelectorAll("tbody tr")).map(tr => {
    const dia = tr.children[0].textContent;
    const estudo = tr.children[1].textContent;
    return [dia, estudo, "[   ]"]; 
  });

  const head = [["Dia", "Leitura", "Concluído"]];

  doc.autoTable({
    head: head,
    body: rows,
    startY: 30,
    headStyles: { fillColor: corSubTitulo, textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    styles: { fontSize: 10, textColor: corTexto },
    columnStyles: { 3: { halign: "center", cellWidth: 20 } } 
  });

  doc.save("plano-estudos.pdf");
});

