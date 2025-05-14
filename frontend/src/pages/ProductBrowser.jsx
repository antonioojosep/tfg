import { useState } from "react";
import useCategories from "../hooks/useCategories.jsx";
import useProductsByCategory from "../hooks/useProductsByCategory.jsx";
import Card from "../components/Card.jsx";
import Loader from "../components/Loader.jsx";
import Button from "../components/Button.jsx";
import PageContainer from "../components/PageContainer.jsx";

export default function ProductBrowser({ onAddProduct, order, onSendOrder, onRemoveProduct }) {
  const { categories, loading: loadingCategories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { products, loading: loadingProducts } = useProductsByCategory(selectedCategory);

  const handleRemoveProduct = (idx) => {
    if (typeof onRemoveProduct === "function") {
      onRemoveProduct(idx);
    }
  };

  if (loadingCategories) return <Loader />;

  return (
    <PageContainer>
      <div>
        {!selectedCategory ? (
          <>
            <h2 className="text-xl font-bold mb-4">Select a category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map(cat => (
                <Card
                  key={cat}
                  className="cursor-pointer hover:shadow-xl transition text-center"
                  onClick={() => setSelectedCategory(cat)}
                >
                  <span className="text-lg font-semibold">{cat}</span>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <>
            <Button className="mb-4" onClick={() => setSelectedCategory(null)}>
              ← Back to categories
            </Button>
            <h2 className="text-xl font-bold mb-4">Products of "{selectedCategory}"</h2>
            {loadingProducts ? (
              <Loader />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map(prod => (
                  <Card
                    key={prod._id}
                    className="text-center cursor-pointer hover:shadow-xl transition"
                    onClick={() => onAddProduct(prod)}
                  >
                    <div className="font-semibold">{prod.name}</div>
                    <div className="text-gray-500">{prod.price} €</div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Current order */}
        {order && order.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-2">Pedido actual</h3>
            <ul className="mb-2">
              {order.map((item, idx) => (
                <li key={idx} className="flex justify-between items-center border-b py-1 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.amount}x</span>
                    <span>{item.product.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">
                      {(item.product.price * item.amount).toFixed(2)} €
                    </span>
                    <Button
                      className="bg-danger hover:bg-red-700 px-2 py-1 text-xs rounded-xl"
                      onClick={() => onRemoveProduct(idx)}
                      type="button"
                    >
                      Eliminar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="font-semibold mb-2">
              Total: {order.reduce((sum, item) => 
                sum + (Number(item.product.price) * item.amount), 0
              ).toFixed(2)} €
            </div>
            <Button className="w-full" onClick={onSendOrder}>
              Enviar pedido
            </Button>
          </div>
        )}
      </div>
    </PageContainer>
  );
}