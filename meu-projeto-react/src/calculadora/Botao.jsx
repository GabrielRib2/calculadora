export default function Botao({ texto, tipo = "numero", largo = false, rotulo, onClick }) {
  return (
    <button
      type="button"
      className={`calc-botao calc-${tipo}${largo ? " calc-largo" : ""}`}
      aria-label={rotulo ?? texto}
      onClick={onClick}
    >
      {texto}
    </button>
  );
}