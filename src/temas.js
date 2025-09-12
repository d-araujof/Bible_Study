// Base de versículos por tema espiritual
const temasEspirituais = {
  "Amor": [
    { livro: "João", capitulo: 3, versiculos: [16] },
    { livro: "1 Coríntios", capitulo: 13, versiculos: Array.from({ length: 13 }, (_, i) => i + 1) },
    { livro: "Romanos", capitulo: 12, versiculos: [9, 10, 11, 12, 13] },
    { livro: "1 João", capitulo: 4, versiculos: Array.from({ length: 21 }, (_, i) => i + 7) },
    { livro: "Mateus", capitulo: 22, versiculos: [36, 37, 38] }
  ],
  "Perseverança": [
    { livro: "Tiago", capitulo: 1, versiculos: [2, 3, 12] },
    { livro: "Hebreus", capitulo: 12, versiculos: [1, 13] },
    { livro: "Romanos", capitulo: 5, versiculos: [1, 5] },
    { livro: "Gálatas", capitulo: 6, versiculos: [9] },
    { livro: "2 Coríntios", capitulo: 4, versiculos: [16, 18] }
  ],
  "Perdão": [
    { livro: "Mateus", capitulo: 6, versiculos: [9, 15] },
    { livro: "Lucas", capitulo: 15, versiculos: Array.from({ length: 22 }, (_, i) => i + 11) },
    { livro: "Efésios", capitulo: 4, versiculos: [31, 32] },
    { livro: "Colossenses", capitulo: 3, versiculos: [12, 14] },
    { livro: "1 João", capitulo: 1, versiculos: [9] }
  ],
  "Obediência": [
    { livro: "João", capitulo: 14, versiculos: [15] },
    { livro: "Deuteronômio", capitulo: 5, versiculos: [32, 33] },
    { livro: "1 Samuel", capitulo: 15, versiculos: [22] },
    { livro: "Romanos", capitulo: 12, versiculos: [1, 2] },
    { livro: "Hebreus", capitulo: 5, versiculos: [8, 9] }
  ],
  "Gratidão": [
    { livro: "Salmos", capitulo: 100, versiculos: [1, 2, 3, 4, 5] },
    { livro: "1 Tessalonicenses", capitulo: 5, versiculos: [16, 18] },
    { livro: "Colossenses", capitulo: 3, versiculos: [15, 17] },
    { livro: "Filipenses", capitulo: 4, versiculos: [6, 7] },
    { livro: "Salmos", capitulo: 107, versiculos: [1, 22] }
  ],
  "Oração": [
    { livro: "Filipenses", capitulo: 4, versiculos: [6, 7] },
    { livro: "1 Tessalonicenses", capitulo: 5, versiculos: [16, 18] },
    { livro: "Lucas", capitulo: 11, versiculos: Array.from({ length: 13 }, (_, i) => i + 1) },
    { livro: "Mateus", capitulo: 6, versiculos: Array.from({ length: 11 }, (_, i) => i + 5) },
    { livro: "Salmos", capitulo: 145, versiculos: [18, 21] }
  ]
};

document.getElementById("gerarPlanoTema").addEventListener("click", () => {
  const startDateValue = document.getElementById("startDate").value;
  const endDateValue = document.getElementById("endDate").value;

  // Validação de datas
  if (!startDateValue || !endDateValue) {
    alert("Preencha as datas!");
    return;
  }

  const checkboxes = document.querySelectorAll(".checkbox-group input[type='checkbox']");
  const selecionados = Array.from(checkboxes).filter(cb => cb.checked);

  if (selecionados.length === 0) {
    alert("Selecione ao menos um tema!");
    return;
  }

  const startDate = new Date(startDateValue + "T00:00");
  const endDate = new Date(endDateValue + "T00:00");

  if (endDate < startDate) {
    alert("A data final deve ser maior ou igual à data inicial!");
    return;
  }

  const dias = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

  let capitulos = [];
  selecionados.forEach(cb => {
    const tema = cb.parentElement.textContent.trim();
    if (temasEspirituais.hasOwnProperty(tema)) {
      capitulos.push(...temasEspirituais[tema]);
    } else {
      console.warn("Tema não encontrado:", tema);
    }
  });

  // Distribuição dos versículos por dia
  let plano = [];
  for (let i = 0; i < dias; i++) plano[i] = [];

  let diaAtual = 0;
  capitulos.forEach(c => {
    c.versiculos.forEach(v => {
      plano[diaAtual].push({ livro: c.livro, capitulo: c.capitulo, versiculo: v });
      diaAtual = (diaAtual + 1) % dias; // distribui circularmente pelos dias
    });
  });

  // Monta a tabela
  let tabelaHTML = `<table>
      <thead>
        <tr><th>Data</th><th>Leitura</th></tr>
      </thead>
      <tbody>`;

  plano.forEach((dia, i) => {
    let data = new Date(startDate);
    data.setDate(startDate.getDate() + i);

    const leitura = dia.map(c => `${c.livro} ${c.capitulo}:${c.versiculo}`).join(", ");
    tabelaHTML += `<tr><td>${data.toLocaleDateString("pt-BR")}</td><td>${leitura}</td></tr>`;
  });

  tabelaHTML += "</tbody></table>";
  document.getElementById("tabela-container").innerHTML = tabelaHTML;

    document.getElementById("exportar").disabled = false;
});
