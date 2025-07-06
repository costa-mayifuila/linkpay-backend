export const calcularTaxaPorPlano = (plano, valor) => {
    let percentual = 0.04; // padrão = básico
    let taxaFixa = 0.50;
  
    switch (plano) {
      case "ouro":
        percentual = 0.025;
        break;
      case "premium":
        percentual = 0.01;
        break;
      case "basico":
      default:
        percentual = 0.04;
    }
  
    const valorTaxa = valor * percentual + taxaFixa;
    const valorLiquido = valor - valorTaxa;
  
    return {
      percentual,
      taxaFixa,
      valorTaxa: Number(valorTaxa.toFixed(2)),
      valorLiquido: Number(valorLiquido.toFixed(2))
    };
  };
  