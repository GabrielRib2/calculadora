// Lógica pura da calculadora (sem React): fácil de testar e de reutilizar.

export const ACOES = {
  DIGITO: "digito",
  OPERACAO: "operacao",
  IGUAL: "igual",
  LIMPAR: "limpar",
  APAGAR: "apagar",
  INVERTER: "inverter",
};

export const estadoInicial = {
  atual: "0", // número que aparece no visor
  anterior: null, // primeiro operando guardado
  operacao: null, // operação pendente
  sobrescrever: false, // true = próximo dígito começa um número novo
};

function calcular(a, b, operacao) {
  const x = parseFloat(a);
  const y = parseFloat(b);
  let resultado;

  switch (operacao) {
    case "+":
      resultado = x + y;
      break;
    case "−":
      resultado = x - y;
      break;
    case "×":
      resultado = x * y;
      break;
    case "÷":
      if (y === 0) return "Erro";
      resultado = x / y;
      break;
    default:
      return b;
  }

  // toPrecision evita erros de ponto flutuante (0.1 + 0.2 = 0.30000000000000004)
  return String(Number(resultado.toPrecision(12)));
}

export function reducer(estado, { tipo, valor }) {
  if (estado.atual === "Erro") {
    switch (tipo) {
      case ACOES.LIMPAR:
        return estadoInicial;
      case ACOES.DIGITO:
        if (valor === ".") return { ...estado, atual: "0.", anterior: null, operacao: null, sobrescrever: false };
        return { ...estado, atual: valor, anterior: null, operacao: null, sobrescrever: false };
      case ACOES.APAGAR:
      case ACOES.INVERTER:
        return { ...estado, atual: "0", anterior: null, operacao: null, sobrescrever: false };
      default:
        return estado;
    }
  }

  switch (tipo) {
    case ACOES.DIGITO: {
      if (valor === ".") {
        if (estado.sobrescrever) return { ...estado, atual: "0.", sobrescrever: false };
        if (estado.atual.includes(".")) return estado;
        return { ...estado, atual: estado.atual + "." };
      }
      if (estado.sobrescrever) return { ...estado, atual: valor, sobrescrever: false };
      if (estado.atual === "0") return { ...estado, atual: valor };
      if (estado.atual.length >= 15) return estado;
      return { ...estado, atual: estado.atual + valor };
    }

    case ACOES.OPERACAO: {
      // Encadeamento: 2 + 3 × ... resolve 2 + 3 antes de aplicar o ×
      if (estado.anterior !== null && estado.operacao && !estado.sobrescrever) {
        const resultado = calcular(estado.anterior, estado.atual, estado.operacao);
        const erro = resultado === "Erro";
        return {
          atual: resultado,
          anterior: erro ? null : resultado,
          operacao: erro ? null : valor,
          sobrescrever: true,
        };
      }
      return { ...estado, anterior: estado.atual, operacao: valor, sobrescrever: true };
    }

    case ACOES.IGUAL: {
      if (!estado.operacao || estado.anterior === null) return estado;
      const resultado = calcular(estado.anterior, estado.atual, estado.operacao);
      return { atual: resultado, anterior: null, operacao: null, sobrescrever: true };
    }

    case ACOES.APAGAR: {
      if (estado.sobrescrever) return estado;
      const curto =
        estado.atual.length <= 1 ||
        (estado.atual.length === 2 && estado.atual.startsWith("-"));
      return { ...estado, atual: curto ? "0" : estado.atual.slice(0, -1) };
    }

    case ACOES.INVERTER: {
      if (estado.atual === "0") return estado;
      const atual = estado.atual.startsWith("-")
        ? estado.atual.slice(1)
        : "-" + estado.atual;
      return { ...estado, atual };
    }

    case ACOES.LIMPAR:
      return estadoInicial;

    default:
      return estado;
  }
}

// Formata para exibição em pt-BR: 1234.5 -> "1.234,5"
export function formatar(valor) {
  if (valor === "Erro" || valor.includes("e")) return valor;
  const [inteiro, decimal] = valor.split(".");
  const inteiroFormatado = Number(inteiro).toLocaleString("pt-BR");
  const sinal = inteiro === "-0" ? "-" : "";
  return decimal !== undefined
    ? `${sinal}${inteiroFormatado},${decimal}`
    : `${sinal}${inteiroFormatado}`;
}