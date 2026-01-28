import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ProductCard = ({ product }) => {
  const getConditionBadge = (condition) => {
    switch (condition) {
      case "Nova":
        return "bg-green-600/20 text-green-400 border-green-600/30";
      case "Usada":
        return "bg-amber-600/20 text-amber-400 border-amber-600/30";
      case "Recondicionada":
        return "bg-blue-600/20 text-blue-400 border-blue-600/30";
      default:
        return "bg-neutral-600/20 text-neutral-400 border-neutral-600/30";
    }
  };

  return (
    <div
      className="product-card group bg-[#171717] border border-neutral-800 hover:border-red-600/50 transition-all duration-300 rounded-sm overflow-hidden"
      data-testid={`product-card-${product.id}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0A0A0A]">
        <img
          src={product.image_url}
          alt={product.name}
          className="product-image w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Condition Badge */}
        <div className="absolute top-3 left-3">
          <Badge 
            className={`${getConditionBadge(product.condition)} border text-xs font-bold uppercase tracking-wider`}
          >
            {product.condition}
          </Badge>
        </div>

        {/* Stock indicator */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold uppercase tracking-wider">
              Indisponível
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <span className="text-xs text-neutral-500 uppercase tracking-wider">
          {product.category}
        </span>

        {/* Title */}
        <h3 
          className="text-lg font-bold text-white mt-1 mb-2 line-clamp-2"
          style={{ fontFamily: 'Chivo, sans-serif' }}
        >
          {product.name}
        </h3>

        {/* Compatibility */}
        <p className="text-sm text-neutral-400 mb-4 line-clamp-1">
          {product.compatibility}
        </p>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          {product.price ? (
            <span className="text-xl font-bold text-white">
              {product.price.toLocaleString('pt-PT')}€
            </span>
          ) : (
            <span className="text-sm text-neutral-500">
              Sob consulta
            </span>
          )}

          <Link to={`/produto/${product.id}`}>
            <Button 
              variant="outline"
              className="border-neutral-700 text-white hover:border-red-600 hover:bg-red-600/10 rounded-sm text-sm font-bold uppercase tracking-wider"
              data-testid={`view-product-btn-${product.id}`}
            >
              Ver Detalhes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
