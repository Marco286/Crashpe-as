import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const conditionStyles = {
  Nova: "bg-green-600/20 text-green-400 border-green-600/30",
  Usada: "bg-amber-600/20 text-amber-400 border-amber-600/30",
  Recondicionada: "bg-blue-600/20 text-blue-400 border-blue-600/30",
};

const ProductCard = ({ product }) => {
  const badgeClass = conditionStyles[product.condition] || "bg-neutral-600/20 text-neutral-400 border-neutral-600/30";

  return (
    <Link
      to={`/produto/${product.id}`}
      className="group bg-[#111111] border border-neutral-800 hover:border-red-600/50 transition-all duration-300 rounded-sm overflow-hidden flex flex-col"
      data-testid={`product-card-${product.id}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-neutral-700 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
            </svg>
            <span className="text-xs uppercase tracking-wider">Sem imagem</span>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <span className={`${badgeClass} border text-xs font-bold uppercase tracking-wider px-2 py-0.5`}>
            {product.condition}
          </span>
        </div>

        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-white font-bold uppercase tracking-widest text-sm border border-white/30 px-4 py-2">
              Indisponível
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs text-neutral-600 uppercase tracking-wider mb-1">{product.category}</span>
        <h3
          className="text-base font-bold text-white mb-1 line-clamp-2 leading-snug"
          style={{ fontFamily: "Chivo, sans-serif" }}
        >
          {product.name}
        </h3>
        {product.compatibility && (
          <p className="text-xs text-neutral-500 mb-4 line-clamp-1">{product.compatibility}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-neutral-800">
          {product.price ? (
            <span className="text-lg font-black text-white" style={{ fontFamily: "Chivo, sans-serif" }}>
              {product.price.toLocaleString("pt-PT")}€
            </span>
          ) : (
            <span className="text-sm text-neutral-500 italic">Sob consulta</span>
          )}
          <span className="flex items-center gap-1 text-red-500 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Ver <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
