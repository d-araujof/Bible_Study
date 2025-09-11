const livrosCapitulos = {
  "Gênesis": 50, "Êxodo": 40, "Levítico": 27, "Números": 36, "Deuteronômio": 34,
  "Josué": 24, "Juízes": 21, "Rute": 4, "I Samuel": 31, "II Samuel": 24,
  "I Reis": 22, "II Reis": 25, "I Crônicas": 29, "II Crônicas": 36, "Esdras": 10,
  "Neemias": 13, "Ester": 10, "Jó": 42, "Salmos": 150, "Provérbios": 31,
  "Eclesiastes": 12, "Cânticos": 8, "Isaías": 66, "Jeremias": 52, "Lamentações": 5,
  "Ezequiel": 48, "Daniel": 12, "Oséias": 14, "Joel": 3, "Amós": 9, "Obadias": 1,
  "Jonas": 4, "Miquéias": 7, "Naum": 3, "Habacuque": 3, "Sofonias": 3, "Ageu": 2,
  "Zacarias": 14, "Malaquias": 4, "Mateus": 28, "Marcos": 16, "Lucas": 24, "João": 21,
  "Atos dos Apóstolos": 28, "Romanos": 16, "I Coríntios": 16, "II Coríntios": 13,
  "Gálatas": 6, "Efésios": 6, "Filipenses": 4, "Colossenses": 4, "I Tessalonicenses": 5,
  "II Tessalonicenses": 3, "I Timóteo": 6, "II Timóteo": 4, "Tito": 3, "Filemon": 1,
  "Hebreus": 13, "Tiago": 5, "I Pedro": 5, "II Pedro": 3, "I João": 5, "II João": 1,
  "III João": 1, "Judas": 1, "Apocalipse": 22
};

document.getElementById("gerarPlano").addEventListener("click", () => {
  const startInput = document.getElementById("startDate").value;
  const endInput = document.getElementById("endDate").value;

  function parseDateLocal(input) {
    const [ano, mes, dia] = input.split("-").map(Number);
    return new Date(ano, mes - 1, dia);
  }

  const startDate = parseDateLocal(startInput);
  const endDate = parseDateLocal(endInput);

  if (!startInput || !endInput || startDate > endDate) {
    alert("Selecione datas válidas!");
    return;
  }

  const selectedBooks = Array.from(document.querySelectorAll(".checkbox-group input:checked"))
    .map(cb => cb.parentElement.textContent.trim());

  if (selectedBooks.length === 0) {
    alert("Selecione pelo menos um livro!");
    return;
  }

  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const totalCapitulos = selectedBooks.reduce((sum, livro) => sum + livrosCapitulos[livro], 0);

  const baseCapDia = Math.floor(totalCapitulos / totalDays);
  let resto = totalCapitulos % totalDays;

  const plano = [];
  let livroIndex = 0;
  let capLivroAtual = 1;
  let capLivroTotal = livrosCapitulos[selectedBooks[livroIndex]];

  for (let dia = 0; dia < totalDays; dia++) {
    let capPorDia = baseCapDia;
    if (resto > 0) { capPorDia++; resto--; }
    plano[dia] = [];

    while (capPorDia > 0 && livroIndex < selectedBooks.length) {
      const livro = selectedBooks[livroIndex];
      const capRestantesLivro = capLivroTotal - capLivroAtual + 1;

      if (capPorDia >= capRestantesLivro) {
        plano[dia].push(`${livro} ${capLivroAtual}-${capLivroTotal}`);
        capPorDia -= capRestantesLivro;
        livroIndex++;
        if (livroIndex < selectedBooks.length) {
          capLivroAtual = 1;
          capLivroTotal = livrosCapitulos[selectedBooks[livroIndex]];
        }
      } else {
        const capFinal = capLivroAtual + capPorDia - 1;
        plano[dia].push(`${livro} ${capLivroAtual}-${capFinal}`);
        capLivroAtual = capFinal + 1;
        capPorDia = 0;
      }
    }
  }

  let tabelaHTML = `
    <h2>PLANO DE ESTUDOS</h2>
    <table border="1" cellpadding="5">
      <thead>
        <tr><th>Dia</th><th>Leitura</th></tr>
      </thead>
      <tbody>
  `;

  plano.forEach((dia, index) => {
    const data = new Date(startDate);
    data.setDate(data.getDate() + index);
    tabelaHTML += `
      <tr>
        <td>${data.toLocaleDateString()}</td>
        <td>${dia.join(", ")}</td>
      </tr>
    `;
  });

  tabelaHTML += "</tbody></table>";

  document.getElementById("tabela-container").innerHTML = tabelaHTML;

  document.getElementById("exportar").disabled = false;
});
