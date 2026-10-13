import { formatar } from "./reducer.js";

export default function Display({ anterior, operacao, atual }) {
  return (
    <div className="calc-display" aria-live="polite">
      <div className="calc-expressao">
        {anterior !== null && `${formatar(anterior)} ${operacao ?? ""}`}
      </div>
      <div className="calc-atual">{formatar(atual)}</div>
    </div>
  );
} 