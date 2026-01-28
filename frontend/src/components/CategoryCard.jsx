import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CategoryCard = ({ category, className = "" }) => {
  return (
    <Link
      to={`/loja/${category.slug}`}
      className={`category-card group relative bg-[#171717] border border-neutral-800 hover:border-red-600/50 transition-all duration-300 overflow-hidden rounded-sm ${className}`}
      data-testid={`category-card-${category.slug}`}
    >
      {/* Image */}
      <div className="absolute inset-0">
        <img
          src={category.image_url}
          alt={category.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
        <h3 
          className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight mb-2"
          style={{ fontFamily: 'Chivo, sans-serif' }}
        >
          {category.name}
        </h3>
        <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
          {category.description}
        </p>
        <div className="flex items-center gap-2 text-red-500 font-bold text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>Ver Peças</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(220,38,38,0.2)]" />
      </div>
    </Link>
  );
};

export default CategoryCard;
