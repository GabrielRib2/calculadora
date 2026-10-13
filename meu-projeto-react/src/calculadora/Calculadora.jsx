import { useEffect, useReducer } from "react";
import Botao from "./Botao.jsx";
import Display from "./Display.jsx";
import { ACOES, estadoInicial, reducer } from "./reducer.js";
import "./calculadora.css";

const TECLAS_OPERACAO = { "+": "+", "-": "−", "*": "×", "/": "÷" };

export default function Calculadora() {
  const [estado, dispatch] = useReducer(reducer, estadoInicial);

  const digito = (valor) => dispatch({ tipo: ACOES.DIGITO, valor });
  const operacao = (valor) => dispatch({ tipo: ACOES.OPERACAO, valor });

  // Suporte ao teclado
  useEffect(() => {
    function aoPressionar(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (/^[0-9]$/.test(e.key)) {
        digito(e.key);
      } else if (e.key === "." || e.key === ",") {
        digito(".");
      } else if (TECLAS_OPERACAO[e.key]) {
        e.preventDefault(); // evita a busca rápida do navegador com "/"
        operacao(TECLAS_OPERACAO[e.key]);
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        dispatch({ tipo: ACOES.IGUAL });
      } else if (e.key === "Backspace") {
        dispatch({ tipo: ACOES.APAGAR });
      } else if (e.key === "Escape") {
        dispatch({ tipo: ACOES.LIMPAR });
      }
    }

    window.addEventListener("keydown", aoPressionar);
    return () => window.removeEventListener("keydown", aoPressionar);
  }, []);

  return (
    <div className="calc">
      <Display
        anterior={estado.anterior}
        operacao={estado.operacao}
        atual={estado.atual}
      />

      <div className="calc-teclado">
        <Botao texto="AC" tipo="funcao" rotulo="Limpar tudo" onClick={() => dispatch({ tipo: ACOES.LIMPAR })} />
        <Botao texto="⌫" tipo="funcao" rotulo="Apagar" onClick={() => dispatch({ tipo: ACOES.APAGAR })} />
        <Botao texto="±" tipo="funcao" rotulo="Inverter sinal" onClick={() => dispatch({ tipo: ACOES.INVERTER })} />
        <Botao texto="÷" tipo="operacao" rotulo="Dividir" onClick={() => operacao("÷")} />

        <Botao texto="7" onClick={() => digito("7")} />
        <Botao texto="8" onClick={() => digito("8")} />
        <Botao texto="9" onClick={() => digito("9")} />
        <Botao texto="×" tipo="operacao" rotulo="Multiplicar" onClick={() => operacao("×")} />

        <Botao texto="4" onClick={() => digito("4")} />
        <Botao texto="5" onClick={() => digito("5")} />
        <Botao texto="6" onClick={() => digito("6")} />
        <Botao texto="−" tipo="operacao" rotulo="Subtrair" onClick={() => operacao("−")} />

        <Botao texto="1" onClick={() => digito("1")} />
        <Botao texto="2" onClick={() => digito("2")} />
        <Botao texto="3" onClick={() => digito("3")} />
        <Botao texto="+" tipo="operacao" rotulo="Somar" onClick={() => operacao("+")} />

        <Botao texto="0" largo onClick={() => digito("0")} />
        <Botao texto="," rotulo="Vírgula" onClick={() => digito(".")} />
        <Botao texto="=" tipo="igual" rotulo="Igual" onClick={() => dispatch({ tipo: ACOES.IGUAL })} />
      </div>
    </div>
  );
}