import { Pencil, Trash2 } from "lucide-react";
import { getCategoryIcon, getCategoryColor } from "./CategoryIcons";
import "./CategoryCard.css";

function CategoryCard({ category, spent, onClick, onEdit, onDelete }) {
  const iconColor = getCategoryColor(category.id);
  console.log(category);
  const hasLimit =
    category.type === "expense" && Number(category.monthlyLimit) > 0;
  const percentage = hasLimit
    ? Math.min((spent / Number(category.monthlyLimit)) * 100, 100)
    : null;
  const overBudget = hasLimit && spent > Number(category.monthlyLimit);

  return (
    <div className="category-card" onClick={() => onClick(category.id)}>
      <div className="category-card-top">
        <div
          className="category-icon"
          style={{ background: `${iconColor}22`, color: iconColor }}
        >
          {getCategoryIcon(category.name, category.type)}
        </div>
        <div className="category-card-actions">
          <button
            type="button"
            className="edit-btn"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(category);
            }}
            aria-label={`Edit ${category.name}`}
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            className="delete-btn"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(category);
            }}
            aria-label={`Delete ${category.name}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <p className="category-name">{category.name}</p>
      <p
        className={
          category.type === "income"
            ? "category-type category-type-income"
            : "category-type category-type-expense"
        }
      >
        {category.type}
      </p>

      {hasLimit && (
        <div className="category-budget">
          <div className="category-budget-track">
            <div
              className={
                percentage >= 0 && percentage <= 69
                  ? "category-budget-fill safe"
                  : percentage <= 89
                    ? "category-budget-fill warning"
                    : percentage <= 99
                      ? "category-budget-fill near-limit"
                      : "category-budget-fill exceeded"
              }
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p
            className={
              percentage >= 0 && percentage <= 69
                ? "category-budget-label safe"
                : percentage <= 89
                  ? "category-budget-label warning"
                  : percentage <= 99
                    ? "category-budget-label near-limit"
                    : "category-budget-label exceeded"
            }
          >
            ₹{spent} of ₹{category.monthlyLimit}
            {overBudget && " · over budget"}
          </p>
        </div>
      )}
    </div>
  );
}

export default CategoryCard;
